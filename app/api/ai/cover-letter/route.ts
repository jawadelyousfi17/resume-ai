// Drafts a cover letter from a resume and a job posting. Answers with the
// finished letter rather than a stream: the editor drops each field into place,
// and half a salutation is no use to anybody.

import Anthropic from "@anthropic-ai/sdk";
import { getAuthUser } from "@/lib/auth";
import { resumeBrief } from "@/lib/ai/prompt";
import {
  DEFAULT_TONE,
  isLetterTone,
  LETTER_SCHEMA,
  letterPrompt,
  type DraftedLetter,
} from "@/lib/ai/cover-letter";
import { LIMITS } from "@/lib/ai/tasks";
import type { CoverLetterData, ResumeData } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

const MODEL = "claude-sonnet-5";

/** Below this there's no posting to write against, only a job title. */
const MIN_JOB_DESCRIPTION = 40;

let client: Anthropic | null = null;

export async function POST(req: Request) {
  if (!(await getAuthUser())) return jsonError("Not signed in", 401);

  let body: {
    data?: ResumeData;
    jobDescription?: string;
    tone?: string;
    instruction?: string;
    letter?: CoverLetterData;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return jsonError("Invalid request body", 400);
  }

  const data = body.data;
  if (!data?.personal || !Array.isArray(data.sections)) {
    return jsonError("Missing resume data", 400);
  }

  const jobDescription = (body.jobDescription ?? "").trim();
  if (jobDescription.length < MIN_JOB_DESCRIPTION) {
    return jsonError(
      "Paste the job posting — the letter is written against what it asks for.",
      400,
    );
  }
  if (jobDescription.length > LIMITS.jobDescription) {
    return jsonError("That job posting is too long.", 400);
  }

  const brief = resumeBrief(data);
  if (brief.length > LIMITS.brief) {
    return jsonError("This resume is too long for the assistant to read.", 400);
  }
  if (brief.trim() === "(The resume is still empty.)") {
    return jsonError(
      "There's nothing on this resume yet — the letter is written from what it says.",
      400,
    );
  }

  let anthropic: Anthropic;
  try {
    anthropic = (client ??= new Anthropic());
  } catch {
    return jsonError(
      "AI is not configured on this server. Set ANTHROPIC_API_KEY and restart.",
      503,
    );
  }

  const prompt = letterPrompt({
    brief,
    jobDescription,
    tone: isLetterTone(body.tone) ? body.tone : DEFAULT_TONE,
    instruction: body.instruction,
    data,
    existing: body.letter ?? null,
  });

  let message;
  try {
    message = await anthropic.messages.create(
      {
        model: MODEL,
        max_tokens: 8000,
        system: prompt.system,
        thinking: { type: "adaptive" },
        output_config: {
          effort: "medium",
          format: { type: "json_schema", schema: LETTER_SCHEMA },
        },
        messages: [{ role: "user", content: prompt.user }],
      },
      { signal: req.signal },
    );
  } catch (err) {
    return apiError(err);
  }

  if (message.stop_reason === "refusal") {
    return jsonError("The assistant declined to write this letter.", 422);
  }

  const text = message.content.find((block) => block.type === "text")?.text;
  if (!text) return jsonError("Nothing came back from the assistant.", 422);

  let parsed: Partial<DraftedLetter>;
  try {
    parsed = JSON.parse(text) as Partial<DraftedLetter>;
  } catch {
    return jsonError(
      message.stop_reason === "max_tokens"
        ? "The letter came back unfinished. Try again."
        : "Couldn't read the letter.",
      422,
    );
  }

  const draft: DraftedLetter = {
    role: str(parsed.role),
    company: str(parsed.company),
    recipient: str(parsed.recipient),
    greeting: str(parsed.greeting),
    body: str(parsed.body),
    closing: str(parsed.closing),
  };

  if (!draft.body) return jsonError("The letter came back empty.", 422);

  return Response.json(draft, { headers: { "Cache-Control": "no-store" } });
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
    err instanceof Error ? err.message : "The assistant failed",
    500,
  );
}

function jsonError(error: string, status: number) {
  return Response.json(
    { error },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
