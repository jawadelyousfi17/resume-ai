import "server-only";

// Reading a resume file with Claude: the upload types we accept, the model
// call, and every way it can fail said in one sentence.
//
// Two callers share this. The dashboard's importer (`/api/import`) turns the
// result into a document for the editor; the public extractor
// (`/api/v1/extract`) hands the same fields back as JSON. Neither should own
// the list of media types or the retry-vs-refusal distinction, so both live
// here and the routes only shape the response.
//
// The schema the model answers in — and the mapping into the editor's own
// shape — is next door in `lib/ai/extract`.

import Anthropic from "@anthropic-ai/sdk";
import {
  activeProvider,
  ai,
  isConfigured,
  NotConfiguredError,
  notConfiguredMessage,
  supportsDocuments,
} from "./provider";
import {
  EXTRACTION_SCHEMA,
  EXTRACTION_SYSTEM,
  type ExtractedResume,
} from "./extract";

/** Claude reads PDFs and images natively; plain text is passed straight
 *  through. Anything else — .docx especially — has no reader here. */
export const PDF_TYPE = "application/pdf";
export const IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
] as const;
export const TEXT_TYPES = ["text/plain", "text/markdown"] as const;

type ImageType = (typeof IMAGE_TYPES)[number];

/** Comfortably under the API's 32MB request ceiling once base64 expands it. */
export const MAX_BYTES = 12 * 1024 * 1024;

export const UNSUPPORTED_MESSAGE =
  "Upload a PDF, an image, or a plain-text file. Word documents aren't supported yet — export to PDF first.";

/**
 * Why a read didn't happen, in a form both routes can map to their own
 * response shape. The codes are part of the public API's contract, so they
 * are stable strings rather than an enum that could be renamed freely.
 */
export type ReadErrorCode =
  | "unsupported_media_type"
  | "unreadable_file"
  | "not_configured"
  | "refused"
  | "empty_result"
  | "file_too_long"
  | "invalid_output"
  | "upstream_auth"
  | "upstream_rate_limited"
  | "upstream_unreachable"
  | "upstream_error";

export class ReadError extends Error {
  constructor(
    readonly code: ReadErrorCode,
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ReadError";
  }
}

export interface ResumeReading {
  resume: ExtractedResume;
  /** What the call cost, passed on so a caller can meter its own usage. */
  usage: { inputTokens: number; outputTokens: number };
}

/** The user content block for an upload, by type. */
export async function fileBlock(
  file: File,
): Promise<Anthropic.ContentBlockParam> {
  const type = normalize(file.type || guessType(file.name));

  // Read text as text, and refuse an unreadable type before spending anything
  // on base64 — a 12MB file grows by a third on the way to the model.
  if (TEXT_TYPES.includes(type as (typeof TEXT_TYPES)[number])) {
    return { type: "text", text: await file.text() };
  }
  if (type !== PDF_TYPE && !IMAGE_TYPES.includes(type as ImageType)) {
    throw new ReadError("unsupported_media_type", UNSUPPORTED_MESSAGE, 415);
  }

  return dataBlock(type, Buffer.from(await file.arrayBuffer()).toString("base64"));
}

/**
 * The same block from base64 that arrived in a JSON body.
 *
 * The media type has to be stated by the caller here — there's no filename to
 * fall back on — and text/* is decoded rather than sent as a document, which
 * is both cheaper and exactly what the model would have read anyway.
 */
export function dataBlock(
  mediaType: string,
  base64: string,
): Anthropic.ContentBlockParam {
  const type = normalize(mediaType);

  if (type === PDF_TYPE) {
    return {
      type: "document",
      source: { type: "base64", media_type: PDF_TYPE, data: base64 },
    };
  }

  if (IMAGE_TYPES.includes(type as ImageType)) {
    return {
      type: "image",
      source: { type: "base64", media_type: type as ImageType, data: base64 },
    };
  }

  if (TEXT_TYPES.includes(type as (typeof TEXT_TYPES)[number])) {
    return { type: "text", text: Buffer.from(base64, "base64").toString("utf8") };
  }

  throw new ReadError("unsupported_media_type", UNSUPPORTED_MESSAGE, 415);
}

/** `text/plain; charset=utf-8` and `TEXT/PLAIN` are the same type. */
const normalize = (mediaType: string) =>
  mediaType.split(";")[0]!.trim().toLowerCase();

/** Browsers sometimes send an empty type; fall back to the extension. */
export function guessType(filename: string): string {
  const ext = filename.toLowerCase().split(".").pop() ?? "";
  if (ext === "pdf") return PDF_TYPE;
  if (ext === "png") return "image/png";
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  if (ext === "txt") return "text/plain";
  if (ext === "md") return "text/markdown";
  return "";
}

/**
 * Transcribes one document into the extraction schema.
 *
 * Structured outputs mean the response parses or the request fails — the only
 * JSON that can arrive broken here is a truncated one, which reads better as
 * "too long" than as a crash. Every failure leaves as a `ReadError`.
 *
 * Runs on the fast tier: transcription is mechanical, and the depth belongs in
 * reading the page rather than deliberating about it.
 */
export async function readResume(
  content: Anthropic.ContentBlockParam,
  signal?: AbortSignal,
): Promise<ResumeReading> {
  // A PDF or an image needs a model that can see one, and only Anthropic's
  // can. Rather than fail on an upload the deployment could handle, this one
  // call crosses back over to Claude regardless of `AI_PROVIDER` — text files,
  // which are most of the volume through the public extractor, still go to
  // whichever provider is configured.
  const needsEyes = content.type !== "text";
  const provider =
    needsEyes && !supportsDocuments(activeProvider()) ? "anthropic" : undefined;

  if (provider === "anthropic" && !isConfigured("anthropic")) {
    throw new ReadError(
      "not_configured",
      `PDFs and images are read by Claude, which isn't configured here. ${notConfiguredMessage("anthropic")}`,
      503,
    );
  }

  let handle;
  try {
    handle = ai({ tier: "fast", provider });
  } catch (err) {
    throw new ReadError(
      "not_configured",
      err instanceof NotConfiguredError
        ? err.message
        : notConfiguredMessage(activeProvider()),
      503,
    );
  }

  let message: Anthropic.Message;
  try {
    message = await handle.create(
      {
        model: handle.model,
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
      { signal },
    );
  } catch (err) {
    throw upstreamError(err);
  }

  if (message.stop_reason === "refusal") {
    throw new ReadError(
      "refused",
      `${handle.label} declined to read that file.`,
      422,
    );
  }

  const text = message.content.find((block) => block.type === "text")?.text;
  if (!text) {
    throw new ReadError(
      "empty_result",
      "Nothing could be read out of that file.",
      422,
    );
  }

  let resume: ExtractedResume;
  try {
    resume = JSON.parse(text) as ExtractedResume;
  } catch {
    throw message.stop_reason === "max_tokens"
      ? new ReadError(
          "file_too_long",
          "That resume is too long to read in one go.",
          422,
        )
      : new ReadError("invalid_output", "Couldn't make sense of that file.", 422);
  }

  return {
    resume,
    usage: {
      inputTokens: message.usage.input_tokens,
      outputTokens: message.usage.output_tokens,
    },
  };
}

/** The SDK's errors, in words a caller of *this* API can act on. */
function upstreamError(err: unknown): ReadError {
  if (err instanceof Anthropic.AuthenticationError) {
    return new ReadError(
      "upstream_auth",
      "The server's AI credentials were rejected.",
      503,
    );
  }
  if (err instanceof Anthropic.RateLimitError) {
    return new ReadError(
      "upstream_rate_limited",
      "Rate limited by the AI service — try again shortly.",
      429,
    );
  }
  if (err instanceof Anthropic.APIConnectionError) {
    return new ReadError(
      "upstream_unreachable",
      "Couldn't reach the AI service.",
      502,
    );
  }
  if (err instanceof Anthropic.APIError) {
    return new ReadError("upstream_error", err.message, err.status ?? 500);
  }
  return new ReadError(
    "upstream_error",
    err instanceof Error ? err.message : "Couldn't read that file.",
    500,
  );
}
