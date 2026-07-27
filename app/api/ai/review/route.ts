// Reviews a resume and answers with a scored report. Like translation this
// returns a document rather than a stream — there is nothing worth watching
// being written, and half a score is no use to anybody.

import Anthropic from "@anthropic-ai/sdk";
import { getAuthUser } from "@/lib/auth";
import { resumeBrief } from "@/lib/ai/prompt";
import { collectStrings } from "@/lib/ai/translate";
import {
  ISSUE_KINDS,
  locate,
  MIN_REVIEWABLE_CHARS,
  REVIEW_CATEGORIES,
  REVIEW_SCHEMA,
  reviewPrompt,
  type IssueKind,
  type ReviewAdvice,
  type ReviewCategoryId,
  type ReviewIssue,
  type ReviewReport,
  type ReviewScore,
} from "@/lib/ai/review";
import { LIMITS } from "@/lib/ai/tasks";
import type { ResumeData } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

const MODEL = "claude-sonnet-5";

/** Caps on what comes back, so one strange answer can't produce a page of
 *  findings to scroll through. */
const MAX_ISSUES = 30;
const MAX_ADVICE = 8;

let client: Anthropic | null = null;

export async function POST(req: Request) {
  // Every call here spends money, so the route checks the session itself.
  if (!(await getAuthUser())) return jsonError("Not signed in", 401);

  let body: { data?: ResumeData };
  try {
    body = (await req.json()) as { data?: ResumeData };
  } catch {
    return jsonError("Invalid request body", 400);
  }

  const data = body.data;
  if (!data?.personal || !Array.isArray(data.sections) || !data.settings) {
    return jsonError("Missing resume data", 400);
  }

  const brief = resumeBrief(data);
  if (brief.length > LIMITS.brief) {
    return jsonError("This resume is too long for the reviewer to read.", 400);
  }
  if (brief.length < MIN_REVIEWABLE_CHARS) {
    return jsonError(
      "There isn't enough here to review yet. Fill in a role or two first.",
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

  const prompt = reviewPrompt(data, brief, items);

  let message;
  try {
    message = await anthropic.messages.create(
      {
        model: MODEL,
        max_tokens: 12000,
        system: prompt.system,
        // Judging a document is the one thing here worth thinking about
        // properly, and it runs once rather than on every keystroke.
        thinking: { type: "adaptive" },
        output_config: {
          effort: "medium",
          format: { type: "json_schema", schema: REVIEW_SCHEMA },
        },
        messages: [{ role: "user", content: prompt.user }],
      },
      { signal: req.signal },
    );
  } catch (err) {
    return apiError(err);
  }

  if (message.stop_reason === "refusal") {
    return jsonError("The reviewer declined to read this resume.", 422);
  }

  const text = message.content.find((block) => block.type === "text")?.text;
  if (!text) return jsonError("Nothing came back from the review.", 422);

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return jsonError(
      message.stop_reason === "max_tokens"
        ? "This resume is too long to review in one go."
        : "Couldn't read the review.",
      422,
    );
  }

  const report = shape(parsed, data, items);
  if (!report.scores.length) {
    return jsonError("The review came back empty. Try again.", 422);
  }

  return Response.json(report, { headers: { "Cache-Control": "no-store" } });
}

interface RawReport {
  overall?: unknown;
  verdict?: unknown;
  scores?: unknown;
  issues?: unknown;
  advice?: unknown;
}

/**
 * Turns the model's answer into the report the panel renders.
 *
 * The schema guarantees the shape, not the truth of it — so scores are clamped
 * to their category, and a proofreading note only survives if the text it
 * quotes is genuinely in the field it names.
 */
function shape(
  parsed: unknown,
  data: ResumeData,
  items: { key: string; text: string }[],
): ReviewReport {
  const raw = (parsed ?? {}) as RawReport;
  const known = new Map(items.map((item) => [item.key, item.text]));

  const scores: ReviewScore[] = [];
  const seen = new Set<string>();
  for (const entry of asArray(raw.scores)) {
    const id = str(entry.id) as ReviewCategoryId;
    if (seen.has(id)) continue;
    if (!REVIEW_CATEGORIES.some((c) => c.id === id)) continue;
    seen.add(id);
    scores.push({ id, score: clamp(entry.score), note: str(entry.note) });
  }

  const issues: ReviewIssue[] = [];
  for (const entry of asArray(raw.issues)) {
    if (issues.length >= MAX_ISSUES) break;
    const key = str(entry.key);
    const quote = str(entry.quote);
    const fix = str(entry.fix);
    const source = known.get(key);
    // A quote that isn't in the field it claims to be in was imagined, and so
    // was the mistake in it.
    if (!source || !quote || !fix || fix === quote) continue;
    if (!contains(source, quote)) continue;

    const kind = str(entry.kind) as IssueKind;
    issues.push({
      kind: ISSUE_KINDS.includes(kind) ? kind : "grammar",
      key,
      quote,
      fix,
      note: str(entry.note),
      where: locate(data, key),
    });
  }

  const advice: ReviewAdvice[] = [];
  for (const entry of asArray(raw.advice)) {
    if (advice.length >= MAX_ADVICE) break;
    const title = str(entry.title);
    if (!title) continue;
    const priority = str(entry.priority);
    advice.push({
      priority: priority === "high" || priority === "low" ? priority : "medium",
      title,
      detail: str(entry.detail),
    });
  }

  return {
    overall: clamp(raw.overall),
    verdict: str(raw.verdict),
    scores,
    issues,
    advice,
  };
}

/** Whitespace is the one difference worth forgiving — the model copying a
 *  bullet across a line break shouldn't cost a real finding. */
function contains(haystack: string, needle: string): boolean {
  const flatten = (s: string) => s.replace(/\s+/g, " ").trim();
  return flatten(haystack).includes(flatten(needle));
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
    err instanceof Error ? err.message : "The review failed",
    500,
  );
}

function jsonError(error: string, status: number) {
  return Response.json(
    { error },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
