// Rewrites the resume for one posting and hands back the new wording.
//
// Unlike the report next door, this one does write the copy — because by the
// time it runs the person has pressed a button asking it to. Two routes in:
// with answers (they've just told us about experience the page didn't show)
// and without (make the most of what's already there). The prompt for each is
// in lib/ai/tailor-apply.

import Anthropic from "@anthropic-ai/sdk";

import { requireFeature } from "@/lib/subscription";
import { resumeBrief } from "@/lib/ai/prompt";
import { LIMITS } from "@/lib/ai/tasks";
import {
  APPLY_SCHEMA,
  applyPrompt,
  type AppliedEdit,
  type ApplyResult,
  type TailorAnswer,
} from "@/lib/ai/tailor-apply";
import {
  locateField,
  MAX_POSTING_CHARS,
  MIN_POSTING_CHARS,
  readField,
  type TailorRequirement,
} from "@/lib/ai/tailoring";
import { collectStrings } from "@/lib/ai/translate";
import type { ResumeData } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 180;

const MODEL = "claude-sonnet-5";

const MAX_EDITS = 16;
const MAX_SKILLS = 12;
/** Per answer. Long enough to describe a project, short enough to bound the
 *  request when there are a dozen of them. */
const MAX_ANSWER_CHARS = 1500;

let client: Anthropic | null = null;

export async function POST(req: Request) {
  const denied = await requireFeature("tailor");
  if (denied) return denied;

  let body: {
    data?: ResumeData;
    posting?: string;
    requirements?: TailorRequirement[];
    answers?: TailorAnswer[];
  };
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid request body", 400);
  }

  const data = body.data;
  if (!data?.personal || !Array.isArray(data.sections) || !data.settings) {
    return jsonError("Missing resume data", 400);
  }
  if (!data.sections.length) {
    return jsonError("There's nothing to tailor yet.", 400);
  }

  const posting = (body.posting ?? "").trim();
  if (posting.length < MIN_POSTING_CHARS) {
    return jsonError("Paste more of the posting to tailor against.", 400);
  }

  const brief = resumeBrief(data);
  if (brief.length > LIMITS.brief) {
    return jsonError("This resume is too long to tailor in one go.", 400);
  }

  // Trimmed rather than rejected: an over-long answer is somebody being
  // thorough, and failing the whole run over it would lose the lot.
  const answers: TailorAnswer[] = (
    Array.isArray(body.answers) ? body.answers : []
  )
    .filter(
      (a): a is TailorAnswer =>
        typeof a?.requirement === "string" && typeof a?.answer === "string",
    )
    .slice(0, 20)
    .map((a) => ({
      requirement: a.requirement.slice(0, 300),
      confirmed: a.confirmed === true,
      answer: a.answer.slice(0, MAX_ANSWER_CHARS),
    }));

  let anthropic: Anthropic;
  try {
    anthropic = client ??= new Anthropic();
  } catch {
    return jsonError(
      "AI is not configured on this server. Set ANTHROPIC_API_KEY and restart.",
      503,
    );
  }

  // Shape-checked rather than trusted: it comes back through the browser, and
  // a malformed entry here would land as a stray line in the prompt.
  const requirements: TailorRequirement[] = (
    Array.isArray(body.requirements) ? body.requirements : []
  )
    .filter(
      (r): r is TailorRequirement =>
        typeof r?.requirement === "string" &&
        (r.status === "met" || r.status === "partial" || r.status === "missing"),
    )
    .slice(0, 20)
    .map((r) => ({
      requirement: r.requirement.slice(0, 300),
      kind: r.kind === "nice" ? "nice" : "key",
      status: r.status,
      detail: typeof r.detail === "string" ? r.detail.slice(0, 400) : "",
    }));

  const prompt = applyPrompt({
    data,
    brief,
    items: collectStrings(data),
    posting: posting.slice(0, MAX_POSTING_CHARS),
    requirements,
    answers,
  });

  let message;
  try {
    message = await anthropic.messages.create(
      {
        model: MODEL,
        max_tokens: 16000,
        system: prompt.system,
        // Rewriting a whole document against a posting, while working out what
        // each answer does and does not license, is the most it is asked to
        // think about anywhere in the app.
        thinking: { type: "adaptive" },
        output_config: {
          // Higher than anything else in the app. This is the one call asked
          // to work through a whole posting and rewrite a whole document
          // against it in a single pass, with nobody coming back to fill in
          // what it skipped.
          effort: "high",
          format: { type: "json_schema", schema: APPLY_SCHEMA },
        },
        messages: [{ role: "user", content: prompt.user }],
      },
      { signal: req.signal },
    );
  } catch (err) {
    return apiError(err);
  }

  if (message.stop_reason === "refusal") {
    return jsonError("The assistant declined to rewrite this resume.", 422);
  }

  const text = message.content.find((block) => block.type === "text")?.text;
  if (!text) return jsonError("Nothing came back from the assistant.", 422);

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return jsonError(
      message.stop_reason === "max_tokens"
        ? "This resume is too long to rewrite in one go."
        : "Couldn't read the rewrite.",
      422,
    );
  }

  return Response.json(shape(parsed, data), {
    headers: { "Cache-Control": "no-store" },
  });
}

/**
 * Turns the model's answer into edits the panel can apply.
 *
 * An edit survives only if its key still resolves and it actually changes the
 * field — the same two checks the old apply-a-rewrite flow made, for the same
 * reason: the schema guarantees shape, not sense.
 */
function shape(parsed: unknown, data: ResumeData): ApplyResult {
  const raw = (parsed ?? {}) as {
    edits?: unknown;
    addSkills?: unknown;
    stillMissing?: unknown;
  };

  const edits: AppliedEdit[] = [];
  const seen = new Set<string>();

  for (const entry of asArray(raw.edits)) {
    if (edits.length >= MAX_EDITS) break;

    const key = str(entry.key);
    const after = str(entry.after);
    const before = readField(data, key);

    if (before === null || !after || seen.has(key)) continue;
    // A "rewrite" that only moves whitespace isn't one.
    if (flatten(before) === flatten(after)) continue;
    seen.add(key);

    edits.push({
      key,
      before,
      after,
      why: str(entry.why),
      where: locateField(data, key),
    });
  }

  return {
    edits,
    addSkills: strings(raw.addSkills).slice(0, MAX_SKILLS),
    stillMissing: strings(raw.stillMissing).slice(0, 10),
  };
}

const flatten = (value: string) => value.replace(/\s+/g, " ").trim();

function strings(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map(str).filter((v) => v.length > 0)
    : [];
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
    err instanceof Error ? err.message : "The rewrite failed",
    500,
  );
}

function jsonError(error: string, status: number) {
  return Response.json(
    { error },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
