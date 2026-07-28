// Reads an uploaded resume — PDF, image, or plain text — and returns it as a
// document the editor can open. Claude does the reading; `lib/ai/extract`
// owns the schema it must answer in and the mapping into our own shape.

import Anthropic from "@anthropic-ai/sdk";
import { requireFeature } from "@/lib/subscription";
import {
  EXTRACTION_SCHEMA,
  EXTRACTION_SYSTEM,
  importedResumeName,
  toResumeData,
  type ExtractedResume,
} from "@/lib/ai/extract";
import { language, type LanguageCode } from "@/lib/i18n";

export const runtime = "nodejs";
export const maxDuration = 120;

const MODEL = "claude-sonnet-5";

/** Claude reads PDFs and images natively; plain text is passed straight
 *  through. Anything else — .docx especially — has no reader here. */
const PDF = "application/pdf";
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const TEXT_TYPES = ["text/plain", "text/markdown"];

/** Comfortably under the API's 32MB request ceiling once base64 expands it. */
const MAX_BYTES = 12 * 1024 * 1024;

let client: Anthropic | null = null;

export async function POST(req: Request) {
  // Reading a file costs a model call, so it needs an account and a plan that
  // includes it — same rule as the writing tools.
  const denied = await requireFeature("import");
  if (denied) return denied;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return jsonError("Upload a file to import.", 400);
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return jsonError("Upload a file to import.", 400);
  }
  if (file.size > MAX_BYTES) {
    return jsonError("That file is larger than 12MB.", 413);
  }

  const lang = languageOf(form.get("language"));

  let content;
  try {
    content = await documentBlock(file);
  } catch (err) {
    return jsonError(
      err instanceof UnsupportedFile ? err.message : "Couldn't read that file.",
      400,
    );
  }

  let anthropic: Anthropic;
  try {
    anthropic = client ??= new Anthropic();
  } catch {
    return jsonError(
      "AI is not configured on this server. Set ANTHROPIC_API_KEY and restart.",
      503,
    );
  }

  let message;
  try {
    message = await anthropic.messages.create(
      {
        model: MODEL,
        max_tokens: 16000,
        system: EXTRACTION_SYSTEM,
        // Transcription is a mechanical task; the depth goes into reading the
        // page, not deliberating about it.
        thinking: { type: "adaptive" },
        output_config: {
          effort: "low",
          format: { type: "json_schema", schema: EXTRACTION_SCHEMA },
        },
        messages: [
          {
            role: "user",
            content: [
              content,
              {
                type: "text",
                text: "Transcribe this resume into the required fields.",
              },
            ],
          },
        ],
      },
      { signal: req.signal },
    );
  } catch (err) {
    return apiError(err);
  }

  if (message.stop_reason === "refusal") {
    return jsonError("Claude declined to read that file.", 422);
  }

  const text = message.content.find((block) => block.type === "text")?.text;
  if (!text) {
    return jsonError("Nothing could be read out of that file.", 422);
  }

  let extracted: ExtractedResume;
  try {
    // The schema is enforced server-side, so this parses — but a truncated
    // response would not, and that reads better as "too long" than a crash.
    extracted = JSON.parse(text) as ExtractedResume;
  } catch {
    return jsonError(
      message.stop_reason === "max_tokens"
        ? "That resume is too long to import in one go."
        : "Couldn't make sense of that file.",
      422,
    );
  }

  return Response.json(
    {
      name: importedResumeName(extracted),
      data: toResumeData(extracted, lang),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

class UnsupportedFile extends Error {}

/** The user content block for this upload, by type. */
async function documentBlock(file: File): Promise<Anthropic.ContentBlockParam> {
  const type = file.type || guessType(file.name);

  if (type === PDF) {
    return {
      type: "document",
      source: {
        type: "base64",
        media_type: "application/pdf",
        data: await base64(file),
      },
    };
  }

  if (IMAGE_TYPES.includes(type)) {
    return {
      type: "image",
      source: {
        type: "base64",
        media_type: type as
          "image/png" | "image/jpeg" | "image/webp" | "image/gif",
        data: await base64(file),
      },
    };
  }

  if (TEXT_TYPES.includes(type)) {
    return { type: "text", text: await file.text() };
  }

  throw new UnsupportedFile(
    "Upload a PDF, an image, or a plain-text file. Word documents aren't supported yet — export to PDF first.",
  );
}

const base64 = async (file: File) =>
  Buffer.from(await file.arrayBuffer()).toString("base64");

/** Browsers sometimes send an empty type; fall back to the extension. */
function guessType(filename: string): string {
  const ext = filename.toLowerCase().split(".").pop() ?? "";
  if (ext === "pdf") return PDF;
  if (ext === "png") return "image/png";
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "webp") return "image/webp";
  if (ext === "txt") return "text/plain";
  if (ext === "md") return "text/markdown";
  return "";
}

function languageOf(value: FormDataEntryValue | null): LanguageCode {
  return language(typeof value === "string" ? value : undefined).code;
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
    err instanceof Error ? err.message : "Couldn't read that file.",
    500,
  );
}

function jsonError(error: string, status: number) {
  return Response.json(
    { error },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
