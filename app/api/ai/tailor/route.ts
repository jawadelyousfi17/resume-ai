// Tailors a resume to one posting: a fit score, the gaps, and a rewrite of
// every field that should change. Structured output, like the review — the
// panel renders a report, not a stream of prose.

import Anthropic from "@anthropic-ai/sdk";

import { getAuthUser } from "@/lib/auth";
import { resumeBrief } from "@/lib/ai/prompt";
import { LIMITS } from "@/lib/ai/tasks";
import {
  locateField,
  MAX_POSTING_CHARS,
  MIN_POSTING_CHARS,
  readField,
  TAILOR_SCHEMA,
  tailorPrompt,
  type TailorEdit,
  type TailorReport,
} from "@/lib/ai/tailoring";
import { collectStrings } from "@/lib/ai/translate";
import type { ResumeData } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

const MODEL = "claude-sonnet-5";

/** More than this and the panel is a wall rather than a set of decisions. */
const MAX_EDITS = 12;

let client: Anthropic | null = null;

export async function POST(req: Request) {
  if (!(await getAuthUser())) return jsonError("Not signed in", 401);

  let body: { data?: ResumeData; posting?: string };
  try {
    body = (await req.json()) as { data?: ResumeData; posting?: string };
  } catch {
    return jsonError("Invalid request body", 400);
  }

  const data = body.data;
  if (!data?.personal || !Array.isArray(data.sections) || !data.settings) {
    return jsonError("Missing resume data", 400);
  }

  const posting = (body.posting ?? "").trim();
  if (posting.length < MIN_POSTING_CHARS) {
    return jsonError("Paste more of the posting to tailor against.", 400);
  }

  const brief = resumeBrief(data);
  if (brief.length > LIMITS.brief) {
    return jsonError("This resume is too long to tailor in one go.", 400);
  }
  if (!data.sections.length) {
    return jsonError(
      "There's nothing to tailor yet — write the resume first.",
      400,
    );
  }

  const items = collectStrings(data);

  let anthropic: Anthropic;
  try {
    anthropic = client ??= new Anthropic();
  } catch {
    return jsonError(
      "AI is not configured on this server. Set ANTHROPIC_API_KEY and restart.",
      503,
    );
  }

  const prompt = tailorPrompt(
    data,
    brief,
    items,
    posting.slice(0, MAX_POSTING_CHARS),
  );

  let message;
  try {
    message = await anthropic.messages.create(
      {
        model: MODEL,
        max_tokens: 12000,
        system: prompt.system,
        // Deciding what to change, and what would be an invention, is worth
        // thinking about — and this runs once per posting.
        thinking: { type: "adaptive" },
        output_config: {
          effort: "medium",
          format: { type: "json_schema", schema: TAILOR_SCHEMA },
        },
        messages: [{ role: "user", content: prompt.user }],
      },
      { signal: req.signal },
    );
  } catch (err) {
    return apiError(err);
  }

  if (message.stop_reason === "refusal") {
    return jsonError("The tailor declined to read this posting.", 422);
  }

  const text = message.content.find((block) => block.type === "text")?.text;
  if (!text) return jsonError("Nothing came back from the tailor.", 422);

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return jsonError(
      message.stop_reason === "max_tokens"
        ? "This resume is too long to tailor in one go."
        : "Couldn't read the tailoring.",
      422,
    );
  }

  const report = shape(parsed, data);
  if (!report.edits.length) {
    return jsonError(
      "Nothing came back worth changing. Try a fuller posting.",
      422,
    );
  }

  return Response.json(report, { headers: { "Cache-Control": "no-store" } });
}

interface RawReport {
  fit?: unknown;
  verdict?: unknown;
  gaps?: unknown;
  edits?: unknown;
}

/**
 * Turns the model's answer into the report the panel renders.
 *
 * The schema guarantees the shape, not that the keys exist or that a rewrite
 * is a rewrite. An edit survives only if its key resolves to a field that is
 * really on this document, and only if it actually says something different.
 */
function shape(parsed: unknown, data: ResumeData): TailorReport {
  const raw = (parsed ?? {}) as RawReport;

  const edits: TailorEdit[] = [];
  for (const entry of asArray(raw.edits)) {
    if (edits.length >= MAX_EDITS) break;

    const key = str(entry.key);
    const after = str(entry.after);
    const before = readField(data, key);

    if (before === null || !after) continue;
    // A "rewrite" that only moves whitespace is not one.
    if (flatten(before) === flatten(after)) continue;

    const priority = str(entry.priority);
    edits.push({
      key,
      before,
      after,
      why: str(entry.why),
      priority:
        priority === "high" || priority === "medium" || priority === "low"
          ? priority
          : "medium",
      where: locateField(data, key),
    });
  }

  // One edit per field: two rewrites of the same summary can't both be applied,
  // and the second would silently fail the `before` check anyway.
  const seen = new Set<string>();
  const unique = edits.filter((edit) =>
    seen.has(edit.key) ? false : (seen.add(edit.key), true),
  );

  return {
    fit: clamp(raw.fit),
    verdict: str(raw.verdict),
    gaps: Array.isArray(raw.gaps)
      ? raw.gaps.filter((g): g is string => typeof g === "string").slice(0, 5)
      : [],
    edits: order(unique),
  };
}

/** Biggest first, so the panel reads top to bottom. */
function order(edits: TailorEdit[]): TailorEdit[] {
  const rank = { high: 0, medium: 1, low: 2 };
  return [...edits].sort((a, b) => rank[a.priority] - rank[b.priority]);
}

const flatten = (value: string) => value.replace(/\s+/g, " ").trim();

function asArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.filter(
        (v): v is Record<string, unknown> =>
          typeof v === "object" && v !== null,
      )
    : [];
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function clamp(value: unknown): number {
  const n = typeof value === "number" ? Math.round(value) : 0;
  return Math.min(100, Math.max(0, Number.isFinite(n) ? n : 0));
}

function apiError(err: unknown) {
  if (err instanceof Anthropic.AuthenticationError) {
    return jsonError("The server's AI credentials were rejected.", 503);
  }
  if (err instanceof Anthropic.RateLimitError) {
    return jsonError("Rate limited by the API — try again shortly.", 429);
  }
  if (err instanceof Anthropic.APIConnectionError) {
    return jsonError("Couldn't reach the AI service.", 502);
  }
  if (err instanceof Anthropic.APIError) {
    return jsonError(err.message, err.status ?? 500);
  }
  return jsonError(
    err instanceof Error ? err.message : "The tailoring failed",
    500,
  );
}

function jsonError(error: string, status: number) {
  return Response.json(
    { error },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
