// POST /api/v1/extract — the public resume extractor.
//
// Give it a PDF, an image or a text file and it answers with the resume's
// contents as JSON. It is the same reader the dashboard's importer uses
// (`lib/ai/read-resume`); what's different here is the audience: callers are
// other programs, holding an API key, that need a stable request shape, stable
// error codes and a body they can hand straight to their own code.
//
// The contract is written down in api_docs.md at the repo root. Changing
// anything below changes that document too.

import { authenticate, isEnabled } from "@/lib/api/keys";
import { rateLimit, rateLimitHeaders } from "@/lib/api/rate-limit";
import {
  MAX_BYTES,
  ReadError,
  dataBlock,
  fileBlock,
  readResume,
  type ResumeReading,
} from "@/lib/ai/read-resume";
import { importedResumeName, toResumeData } from "@/lib/ai/extract";
import { language } from "@/lib/i18n";
import type { ContentBlockParam } from "@anthropic-ai/sdk/resources/messages";

export const runtime = "nodejs";
export const maxDuration = 120;

/** What `resume` holds in the answer. `fields` is the flat transcription and
 *  the default; `editor` is the document shape meniacv's own editor opens,
 *  ids and section headings included. */
type Format = "fields" | "editor";

export async function POST(req: Request) {
  if (!isEnabled()) {
    return fail(
      "not_configured",
      "The extraction API is not enabled on this server.",
      503,
    );
  }

  const caller = authenticate(req.headers);
  if (!caller) {
    return fail(
      "unauthorized",
      "Send a valid API key as `Authorization: Bearer <key>`.",
      401,
      { "WWW-Authenticate": 'Bearer realm="meniacv"' },
    );
  }

  const limit = rateLimit(caller.id);
  if (!limit.ok) {
    return fail(
      "rate_limited",
      `Too many requests — this key allows ${limit.limit} per minute.`,
      429,
      { ...rateLimitHeaders(limit), "Retry-After": String(limit.retryAfter) },
    );
  }
  const headers = rateLimitHeaders(limit);

  let input: Input;
  try {
    input = await readInput(req);
  } catch (err) {
    return failure(err, headers);
  }

  let reading: ResumeReading;
  try {
    reading = await readResume(input.content, req.signal);
  } catch (err) {
    return failure(err, headers);
  }

  const body =
    input.format === "editor"
      ? {
          name: importedResumeName(reading.resume),
          resume: toResumeData(reading.resume, language(input.language).code),
        }
      : { resume: reading.resume };

  return json(
    {
      format: input.format,
      file: input.file,
      ...body,
      usage: {
        input_tokens: reading.usage.inputTokens,
        output_tokens: reading.usage.outputTokens,
      },
    },
    200,
    headers,
  );
}

interface Input {
  content: ContentBlockParam;
  format: Format;
  language?: string;
  /** Echoed back so a caller batching uploads can tell answers apart. */
  file: { name: string | null; media_type: string; size_bytes: number };
}

/** A request in either accepted shape: a multipart upload, or JSON carrying
 *  base64 (or plain text) inline. */
async function readInput(req: Request): Promise<Input> {
  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) return fromForm(req);
  if (contentType.includes("application/json")) return fromJson(req);

  throw new RequestError(
    "invalid_request",
    "Send `multipart/form-data` with a `file` field, or `application/json`.",
    415,
  );
}

async function fromForm(req: Request): Promise<Input> {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    throw new RequestError("invalid_request", "Couldn't read that upload.", 400);
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new RequestError(
      "invalid_request",
      "Attach the resume as a `file` field.",
      400,
    );
  }
  ensureSize(file.size);

  return {
    content: await fileBlock(file),
    format: formatOf(form.get("format")),
    language: stringOr(form.get("language")),
    file: {
      name: file.name || null,
      media_type: file.type || "application/octet-stream",
      size_bytes: file.size,
    },
  };
}

async function fromJson(req: Request): Promise<Input> {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    throw new RequestError("invalid_request", "The body isn't valid JSON.", 400);
  }
  if (!body || typeof body !== "object") {
    throw new RequestError("invalid_request", "The body must be an object.", 400);
  }

  const format = formatOf(body.format);
  const lang = stringOr(body.language);
  const filename = stringOr(body.filename) ?? null;

  // `text` is the shortcut for a resume you already have as a string — no
  // base64, no media type to state.
  const text = stringOr(body.text);
  if (text) {
    return {
      content: { type: "text", text },
      format,
      language: lang,
      file: {
        name: filename,
        media_type: "text/plain",
        size_bytes: Buffer.byteLength(text),
      },
    };
  }

  const raw = stringOr(body.file);
  if (!raw) {
    throw new RequestError(
      "invalid_request",
      "Send `file` as base64, or `text` as a string.",
      400,
    );
  }

  // A `data:` URL carries its own media type, which saves the caller stating
  // it twice — and is what a browser's FileReader hands you.
  const dataUrl = /^data:([^;,]+)[^,]*;base64,([\s\S]*)$/.exec(raw.trim());
  const base64 = (dataUrl ? dataUrl[2]! : raw).replace(/\s+/g, "");
  const mediaType = dataUrl?.[1] ?? stringOr(body.media_type);

  if (!mediaType) {
    throw new RequestError(
      "invalid_request",
      "State the file's `media_type`, e.g. `application/pdf`.",
      400,
    );
  }
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) {
    throw new RequestError(
      "invalid_request",
      "`file` must be base64, with or without a `data:` prefix.",
      400,
    );
  }

  // Every 4 base64 characters are 3 bytes; close enough to refuse a file
  // that's over the limit without decoding it first.
  const size = Math.floor((base64.length * 3) / 4);
  ensureSize(size);

  return {
    content: dataBlock(mediaType, base64),
    format,
    language: lang,
    file: { name: filename, media_type: mediaType, size_bytes: size },
  };
}

function ensureSize(bytes: number) {
  if (bytes > MAX_BYTES) {
    throw new RequestError(
      "file_too_large",
      `That file is larger than ${MAX_BYTES / (1024 * 1024)}MB.`,
      413,
    );
  }
}

function formatOf(value: unknown): Format {
  const raw = stringOr(value);
  if (!raw || raw === "fields") return "fields";
  if (raw === "editor") return "editor";
  throw new RequestError(
    "invalid_request",
    "`format` must be `fields` or `editor`.",
    400,
  );
}

const stringOr = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

/** Something wrong with the request itself, as opposed to the reading of it. */
class RequestError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "RequestError";
  }
}

/** Both error types carry a code, a sentence and a status; anything else is
 *  ours to own and says so without leaking a stack trace. */
function failure(err: unknown, headers: Record<string, string> = {}) {
  if (err instanceof RequestError || err instanceof ReadError) {
    return fail(err.code, err.message, err.status, headers);
  }
  console.error("[api/v1/extract]", err);
  return fail("internal_error", "Something went wrong reading that file.", 500);
}

function fail(
  code: string,
  message: string,
  status: number,
  headers: Record<string, string> = {},
) {
  return json({ error: { code, message } }, status, headers);
}

function json(body: unknown, status: number, headers: Record<string, string>) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}
