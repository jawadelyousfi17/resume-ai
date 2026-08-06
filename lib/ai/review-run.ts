import "server-only";

// Reviewing a resume, from a document to a scored report.
//
// This is the whole of the review apart from who is allowed to ask for one:
// the checks on the document, the model call, and the shaping of what comes
// back. It lives here rather than in the route because there are two ways in
// now — `POST /api/ai/review` for the editor's panel, and the `review_resume`
// tool on the MCP server — and a second copy of the shaping is a second set of
// bugs.
//
// Everything that can go wrong arrives as a `ReviewError` carrying a code, a
// sentence fit to show someone, and the status the HTTP route should answer
// with. Callers that aren't HTTP ignore the status and print the sentence.

import Anthropic from "@anthropic-ai/sdk";

import {
  activeProvider,
  ai,
  NotConfiguredError,
  notConfiguredMessage,
} from "@/lib/ai/provider";
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

/** Caps on what comes back, so one strange answer can't produce a page of
 *  findings to scroll through. */
const MAX_ISSUES = 30;
const MAX_ADVICE = 8;

export type ReviewErrorCode =
  | "invalid_resume"
  | "too_long"
  | "too_short"
  | "not_configured"
  | "refused"
  | "unreadable"
  | "rate_limited"
  | "upstream";

/** Anything that stopped a review, said once for every caller. */
export class ReviewError extends Error {
  constructor(
    readonly code: ReviewErrorCode,
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ReviewError";
  }
}

/**
 * Reads a resume and scores it.
 *
 * Throws `ReviewError` for everything a caller could act on — a document too
 * short to judge, a server with no AI credentials, an answer that didn't
 * parse. `signal` aborts the model call when the caller goes away.
 */
export async function runReview(
  data: ResumeData,
  signal?: AbortSignal,
): Promise<ReviewReport> {
  if (!data?.personal || !Array.isArray(data.sections) || !data.settings) {
    throw new ReviewError("invalid_resume", "Missing resume data", 400);
  }

  const brief = resumeBrief(data);
  if (brief.length > LIMITS.brief) {
    throw new ReviewError(
      "too_long",
      "This resume is too long for the reviewer to read.",
      400,
    );
  }
  if (brief.length < MIN_REVIEWABLE_CHARS) {
    throw new ReviewError(
      "too_short",
      "There isn't enough here to review yet. Fill in a role or two first.",
      400,
    );
  }

  const items = collectStrings(data);

  let handle;
  try {
    handle = ai();
  } catch (err) {
    throw new ReviewError(
      "not_configured",
      err instanceof NotConfiguredError
        ? err.message
        : notConfiguredMessage(activeProvider()),
      503,
    );
  }

  const prompt = reviewPrompt(data, brief, items);

  let message;
  try {
    message = await handle.create(
      {
        model: handle.model,
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
      { signal },
    );
  } catch (err) {
    throw upstream(err);
  }

  if (message.stop_reason === "refusal") {
    throw new ReviewError(
      "refused",
      "The reviewer declined to read this resume.",
      422,
    );
  }

  const text = message.content.find((block) => block.type === "text")?.text;
  if (!text) {
    throw new ReviewError(
      "unreadable",
      "Nothing came back from the review.",
      422,
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new ReviewError(
      "unreadable",
      message.stop_reason === "max_tokens"
        ? "This resume is too long to review in one go."
        : "Couldn't read the review.",
      422,
    );
  }

  const report = shape(parsed, data, items);
  if (!report.scores.length) {
    throw new ReviewError(
      "unreadable",
      "The review came back empty. Try again.",
      422,
    );
  }

  return report;
}

/** The provider's own failures, in this module's terms. */
function upstream(err: unknown): ReviewError {
  if (err instanceof Anthropic.AuthenticationError) {
    return new ReviewError(
      "not_configured",
      "The server's AI credentials were rejected.",
      503,
    );
  }
  if (err instanceof Anthropic.RateLimitError) {
    return new ReviewError(
      "rate_limited",
      "Rate limited by the API — try again shortly.",
      429,
    );
  }
  if (err instanceof Anthropic.APIConnectionError) {
    return new ReviewError("upstream", "Couldn't reach the AI service.", 502);
  }
  if (err instanceof Anthropic.APIError) {
    return new ReviewError("upstream", err.message, err.status ?? 500);
  }
  return new ReviewError(
    "upstream",
    err instanceof Error ? err.message : "The review failed",
    500,
  );
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
