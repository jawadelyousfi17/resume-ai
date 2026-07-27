// Renders a cover letter to PDF. Same pipeline as the resume: park the
// document, point a headless browser at /print/<token>, hand back the bytes.
//
// Unlike the resume route this one requires a session — a cover letter only
// exists once you have an account, so there's no signed-out case to serve, and
// no reason to leave a browser render open to anonymous callers.

import { getAuthUser } from "@/lib/auth";
import {
  PdfError,
  pdfServiceUrl,
  renderResumePdf,
  renderViaService,
} from "@/lib/pdf";
import { createPrintJob } from "@/lib/print-store";
import { printSecret, signPrintJob } from "@/lib/print-token";
import { siteOrigin } from "@/lib/site-url";
import { pageFormatSchema, parseCoverLetterData } from "@/lib/validation";
import type { CoverLetterData } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  if (!(await getAuthUser())) return jsonError("Not signed in", 401);

  let body: { data?: unknown; format?: unknown };
  try {
    body = (await req.json()) as { data?: unknown; format?: unknown };
  } catch {
    return jsonError("Invalid request body", 400);
  }

  const parsedData = parseCoverLetterData(body.data);
  if (!parsedData.ok) return jsonError(parsedData.error, 400);

  const parsedFormat = pageFormatSchema.safeParse(body.format ?? "A4");
  if (!parsedFormat.success) {
    return jsonError("That page format isn't one we support.", 400);
  }

  const job = {
    kind: "letter",
    // Loose by design — see the note at the top of lib/validation.ts.
    data: parsedData.data as unknown as CoverLetterData,
    format: parsedFormat.data,
  } as const;

  // A renderer on another box can't read this process's memory, so when one is
  // configured the job travels in the token instead. See lib/print-token.
  const service = pdfServiceUrl();
  const secret = printSecret();
  const token =
    service && secret ? signPrintJob(job, secret) : createPrintJob(job);

  try {
    const origin = await siteOrigin();
    const pdf =
      service && secret
        ? await renderViaService(
            service,
            origin,
            token,
            parsedFormat.data,
            "cover-letter.pdf",
          )
        : await renderResumePdf(origin, token, parsedFormat.data);

    return new Response(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="cover-letter.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return jsonError(
      err instanceof PdfError
        ? err.message
        : err instanceof Error
          ? err.message
          : "Couldn't render the PDF",
      500,
    );
  }
}

function jsonError(error: string, status: number) {
  return Response.json(
    { error },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
