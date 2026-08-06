// Reads a resume against one posting: a fit score, the gaps, and the fields
// that need rewriting before it's sent. Structured output, like the review —
// the panel renders a report, not a stream of prose.
//
// No new wording comes back from here. See the note at the top of
// lib/ai/tailoring for why the person writes it themselves.

import Anthropic from "@anthropic-ai/sdk";
import {
  activeProvider,
  ai,
  NotConfiguredError,
  notConfiguredMessage,
} from "@/lib/ai/provider";

import { requireFeature } from "@/lib/subscription";
import { resumeBrief } from "@/lib/ai/prompt";
import { LIMITS } from "@/lib/ai/tasks";
import {
  fieldFormat,
  locateField,
  MAX_POSTING_CHARS,
  MIN_POSTING_CHARS,
  readField,
  TAILOR_SCHEMA,
  tailorPrompt,
  type TailorReport,
  type TailorRequirement,
  type TailorRewrite,
} from "@/lib/ai/tailoring";
import { collectStrings } from "@/lib/ai/translate";
import type { ResumeData } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;


/** More than this and the panel is a wall rather than a set of decisions. */
const MAX_REWRITES = 8;
const MAX_REQUIREMENTS = 14;


export async function POST(req: Request) {
  const denied = await requireFeature("tailor");
  if (denied) return denied;

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

  let handle;
  try {
    handle = ai();
  } catch (err) {
    return jsonError(
      err instanceof NotConfiguredError
        ? err.message
        : notConfiguredMessage(activeProvider()),
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
    message = await handle.create(
      {
        model: handle.model,
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
  // A resume needing no rewrites is a real answer, but a report with nothing
  // in it at all is far more likely to be a failed read.
  if (!report.rewrites.length && !report.requirements.length && !report.summary) {
    return jsonError(
      "Nothing came back worth changing. Try a fuller posting.",
      422,
    );
  }

  return Response.json(report, { headers: { "Cache-Control": "no-store" } });
}

interface RawReport {
  job?: unknown;
  fit?: unknown;
  summary?: unknown;
  requirements?: unknown;
  rewrites?: unknown;
}

/**
 * Turns the model's answer into the report the panel renders.
 *
 * The schema guarantees the shape, not that the keys exist. A note survives
 * only if its key resolves to a field really on this document — otherwise the
 * panel would offer to open something that isn't there.
 */
function shape(parsed: unknown, data: ResumeData): TailorReport {
  const raw = (parsed ?? {}) as RawReport;

  const rewrites: TailorRewrite[] = [];
  const seen = new Set<string>();

  for (const entry of asArray(raw.rewrites)) {
    if (rewrites.length >= MAX_REWRITES) break;

    const key = str(entry.key);
    const hint = str(entry.hint);
    // One note per field. Two briefs for the same summary would open the same
    // editor twice and disagree with each other inside it.
    if (!hint || seen.has(key) || readField(data, key) === null) continue;
    seen.add(key);

    rewrites.push({
      key,
      why: str(entry.why),
      hint,
      priority: priorityOf(entry.priority),
      where: locateField(data, key),
      format: fieldFormat(key),
    });
  }

  // Kept in the order the posting raises them, not sorted by status: the point
  // of the list is to read as the posting reads.
  const requirements: TailorRequirement[] = [];
  for (const entry of asArray(raw.requirements)) {
    if (requirements.length >= MAX_REQUIREMENTS) break;
    const requirement = str(entry.requirement);
    if (!requirement) continue;
    requirements.push({
      requirement,
      kind: str(entry.kind) === "nice" ? "nice" : "key",
      status: statusOf(entry.status),
      detail: str(entry.detail),
    });
  }

  const job = (raw.job ?? {}) as Record<string, unknown>;

  return {
    job: {
      role: str(job.role),
      company: str(job.company),
      location: str(job.location),
    },
    fit: clamp(raw.fit),
    summary: str(raw.summary),
    requirements,
    rewrites: rewrites.sort((a, b) => RANK[a.priority] - RANK[b.priority]),
  };
}

/** Biggest first, so the rewrite list reads top to bottom. */
const RANK = { high: 0, medium: 1, low: 2 } as const;

function priorityOf(value: unknown): TailorRewrite["priority"] {
  const v = str(value);
  return v === "high" || v === "low" ? v : "medium";
}

/** Anything unrecognised reads as "partial" — the honest middle, rather than
 *  crediting the resume with something or accusing it of a gap. */
function statusOf(value: unknown): TailorRequirement["status"] {
  const v = str(value);
  return v === "met" || v === "missing" ? v : "partial";
}

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
