// Translates a resume into another language. Unlike the writing tools this
// answers with a document rather than a stream: there is nothing to watch
// being written, and the whole point is that it lands intact.

import Anthropic from "@anthropic-ai/sdk";
import { getAuthUser } from "@/lib/auth";
import {
  applyTranslations,
  collectStrings,
  TRANSLATION_SCHEMA,
  translationPrompt,
} from "@/lib/ai/translate";
import { language } from "@/lib/i18n";
import type { ResumeData } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

const MODEL = "claude-sonnet-5";

/** A resume with more strings than this isn't a resume any more. */
const MAX_STRINGS = 400;

let client: Anthropic | null = null;

export async function POST(req: Request) {
  if (!(await getAuthUser())) return jsonError("Not signed in", 401);

  let body: { data?: ResumeData; target?: string };
  try {
    body = (await req.json()) as { data?: ResumeData; target?: string };
  } catch {
    return jsonError("Invalid request body", 400);
  }

  const data = body.data;
  if (!data?.personal || !Array.isArray(data.sections)) {
    return jsonError("Missing resume data", 400);
  }

  const target = language(body.target);
  if (target.code === (data.settings?.language ?? "en")) {
    return jsonError(`This resume is already in ${target.english}.`, 400);
  }

  const items = collectStrings(data);
  if (!items.length) {
    return jsonError("There's nothing written here to translate yet.", 400);
  }
  if (items.length > MAX_STRINGS) {
    return jsonError("This resume is too long to translate in one go.", 400);
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

  const prompt = translationPrompt(target.code);

  let message;
  try {
    message = await anthropic.messages.create(
      {
        model: MODEL,
        max_tokens: 16000,
        system: prompt.system,
        thinking: { type: "adaptive" },
        output_config: {
          effort: "low",
          format: { type: "json_schema", schema: TRANSLATION_SCHEMA },
        },
        messages: [{ role: "user", content: prompt.user(items) }],
      },
      { signal: req.signal },
    );
  } catch (err) {
    return apiError(err);
  }

  if (message.stop_reason === "refusal") {
    return jsonError("Claude declined to translate this resume.", 422);
  }

  const text = message.content.find((block) => block.type === "text")?.text;
  if (!text) return jsonError("Nothing came back from the translation.", 422);

  let parsed: { items?: { key: string; text: string }[] };
  try {
    parsed = JSON.parse(text) as { items?: { key: string; text: string }[] };
  } catch {
    return jsonError(
      message.stop_reason === "max_tokens"
        ? "This resume is too long to translate in one go."
        : "Couldn't read the translation.",
      422,
    );
  }

  // Only keys we actually sent are honoured — an invented one has nowhere to
  // go, and a missing one leaves the original text in place.
  const sent = new Set(items.map((item) => item.key));
  const translations = new Map<string, string>();
  for (const item of parsed.items ?? []) {
    if (item?.key && typeof item.text === "string" && sent.has(item.key)) {
      translations.set(item.key, item.text);
    }
  }

  if (!translations.size) {
    return jsonError("Nothing came back translated.", 422);
  }

  return Response.json(
    {
      data: applyTranslations(data, translations, target.code),
      translated: translations.size,
      total: items.length,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

function apiError(err: unknown) {
  if (err instanceof Anthropic.AuthenticationError) {
    return jsonError("The server's Anthropic API key was rejected.", 503);
  }
  if (err instanceof Anthropic.RateLimitError) {
    return jsonError("Rate limited by the API — try again shortly.", 429);
  }
  if (err instanceof Anthropic.APIConnectionError) {
    return jsonError("Couldn't reach the Anthropic API.", 502);
  }
  if (err instanceof Anthropic.APIError) {
    return jsonError(err.message, err.status ?? 500);
  }
  return jsonError(
    err instanceof Error ? err.message : "The translation failed",
    500,
  );
}

function jsonError(error: string, status: number) {
  return Response.json(
    { error },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
