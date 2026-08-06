import "server-only";

// What the MCP server can do.
//
// One registration per tool, each a thin wrapper over the same functions the
// app's own routes call — `readResume` for the extractor, `runReview` for the
// reviewer. Nothing here talks to the database or to a signed-in user: this
// server is held open by a partner's API key, not by a person, so every tool
// takes its document as an argument and hands one back.
//
// Tools answer with JSON as text. A tool that fails answers with `isError`
// and a sentence rather than throwing — a thrown error is a protocol fault the
// model never sees, and "that file wasn't a resume" is something it should be
// able to read and act on.

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { importedResumeName, toResumeData } from "@/lib/ai/extract";
import {
  MAX_BYTES,
  ReadError,
  dataBlock,
  readResume,
} from "@/lib/ai/read-resume";
import { ReviewError, runReview } from "@/lib/ai/review-run";
import { language } from "@/lib/i18n";
import { parseResumeData } from "@/lib/validation";
import { REVIEW_CATEGORIES } from "@/lib/ai/review";

/** Registers every tool on a server instance. Called once per request — see
 *  the route, which builds a fresh server for each one. */
export function registerTools(server: McpServer) {
  registerExtract(server);
  registerReview(server);
}

/* -------------------------------------------------------------------------- */
/* extract_resume                                                             */
/* -------------------------------------------------------------------------- */

function registerExtract(server: McpServer) {
  server.registerTool(
    "extract_resume",
    {
      title: "Extract a resume",
      description:
        "Read a resume file and return its contents as structured JSON: the person's details, roles, education, projects, skills and languages. " +
        "Accepts a PDF, an image (PNG, JPEG, WebP) or plain text. " +
        "Send the file as base64 in `file` with its `media_type`, or — if you already have the resume as a string — send it in `text` instead. " +
        "It transcribes rather than writes: nothing is invented, and a detail the document doesn't state comes back empty. " +
        'Use `format: "editor"` when the result is going to `review_resume`, which needs that shape.',
      inputSchema: {
        file: z
          .string()
          .optional()
          .describe(
            "The resume file, base64-encoded. A `data:` URL is accepted too, in which case `media_type` is read from it.",
          ),
        media_type: z
          .string()
          .optional()
          .describe(
            "The file's media type, e.g. `application/pdf` or `image/png`. Required with `file` unless a `data:` URL carries it.",
          ),
        text: z
          .string()
          .optional()
          .describe("The resume as plain text, instead of `file`."),
        filename: z
          .string()
          .optional()
          .describe("Echoed back, so batched calls can be told apart."),
        format: z
          .enum(["fields", "editor"])
          .optional()
          .describe(
            "`fields` (default) is the flat transcription. `editor` is the document meniacv's own editor opens — ids and section headings included — and is what `review_resume` takes.",
          ),
        language: z
          .string()
          .optional()
          .describe('Only used by `format: "editor"`; e.g. `en`, `fr`.'),
      },
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async (args, extra): Promise<CallToolResult> => {
      const format = args.format ?? "fields";

      let content;
      let size: number;
      let mediaType: string;

      if (args.text?.trim()) {
        content = { type: "text" as const, text: args.text };
        size = Buffer.byteLength(args.text);
        mediaType = "text/plain";
      } else if (args.file?.trim()) {
        // A `data:` URL carries its own media type, which saves the caller
        // stating it twice.
        const dataUrl = /^data:([^;,]+)[^,]*;base64,([\s\S]*)$/.exec(
          args.file.trim(),
        );
        const base64 = (dataUrl ? dataUrl[2]! : args.file).replace(/\s+/g, "");
        mediaType = dataUrl?.[1] ?? args.media_type ?? "";

        if (!mediaType) {
          return failure(
            "State the file's `media_type`, e.g. `application/pdf`.",
          );
        }
        if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) {
          return failure(
            "`file` must be base64, with or without a `data:` prefix.",
          );
        }

        // Every 4 base64 characters are 3 bytes; close enough to refuse a file
        // that's over the limit without decoding it first.
        size = Math.floor((base64.length * 3) / 4);
        if (size > MAX_BYTES) {
          return failure(
            `That file is larger than ${MAX_BYTES / (1024 * 1024)}MB.`,
          );
        }
        content = dataBlock(mediaType, base64);
      } else {
        return failure("Send `file` as base64, or `text` as a string.");
      }

      try {
        const reading = await readResume(content, extra.signal);
        const body =
          format === "editor"
            ? {
                name: importedResumeName(reading.resume),
                resume: toResumeData(
                  reading.resume,
                  language(args.language).code,
                ),
              }
            : { resume: reading.resume };

        return json({
          format,
          file: {
            name: args.filename ?? null,
            media_type: mediaType,
            size_bytes: size,
          },
          ...body,
          usage: {
            input_tokens: reading.usage.inputTokens,
            output_tokens: reading.usage.outputTokens,
          },
        });
      } catch (err) {
        if (err instanceof ReadError) return failure(err.message);
        throw err;
      }
    },
  );
}

/* -------------------------------------------------------------------------- */
/* review_resume                                                              */
/* -------------------------------------------------------------------------- */

function registerReview(server: McpServer) {
  const categories = REVIEW_CATEGORIES.map((c) => c.id).join(", ");

  server.registerTool(
    "review_resume",
    {
      title: "Review a resume",
      description:
        "Score a resume and report what's wrong with it. Returns an overall mark out of 100, a one-line verdict, a score and note per category " +
        `(${categories}), proofreading findings that quote the exact text at fault along with a suggested fix, and prioritised advice. ` +
        'Takes the editor-format document — call `extract_resume` with `format: "editor"` first if all you have is a file. ' +
        "Every finding quotes text that is genuinely in the field it names; anything the reviewer imagined is dropped before you see it.",
      inputSchema: {
        resume: z
          .record(z.string(), z.unknown())
          .describe(
            'The resume document, in the shape `extract_resume` returns under `resume` when called with `format: "editor"`.',
          ),
      },
      annotations: {
        readOnlyHint: true,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async (args, extra): Promise<CallToolResult> => {
      const parsed = parseResumeData(args.resume);
      if (!parsed.ok) return failure(parsed.error);

      try {
        const report = await runReview(parsed.data as never, extra.signal);
        return json(report);
      } catch (err) {
        if (err instanceof ReviewError) return failure(err.message);
        throw err;
      }
    },
  );
}

/* -------------------------------------------------------------------------- */
/* Answers                                                                    */
/* -------------------------------------------------------------------------- */

/** A tool's answer: the JSON, pretty enough to read in a transcript. */
function json(body: unknown): CallToolResult {
  return {
    content: [{ type: "text", text: JSON.stringify(body, null, 2) }],
  };
}

/** A refusal the model can read and act on, rather than a protocol fault. */
function failure(message: string): CallToolResult {
  return {
    isError: true,
    content: [{ type: "text", text: message }],
  };
}
