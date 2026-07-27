// Renders a resume to PDF, invoked from the editor's Download action.
//
// The document is parked in the print store, then a headless browser is pointed
// at /print/<token> — the same React component and stylesheet the editor
// previews with. Runs on the Node.js runtime because it drives a browser.

import { PdfError, renderResumePdf } from "@/lib/pdf";
import { createPrintJob } from "@/lib/print-store";
import { siteOrigin } from "@/lib/site-url";
import { parseResumeData, pageFormatSchema } from "@/lib/validation";
import type { ResumeData } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  // Open to guests: a visitor who builds a resume signed out still needs to
  // walk away with the PDF. That does mean an anonymous caller can start a
  // browser render, so this route wants a rate limit in front of it before it
  // faces real traffic.

  let body: { data?: unknown; format?: unknown };
  try {
    body = (await req.json()) as { data?: unknown; format?: unknown };
  } catch {
    return jsonError("Invalid request body", 400);
  }

  const parsedData = parseResumeData(body.data);
  if (!parsedData.ok) return jsonError(parsedData.error, 400);

  const parsedFormat = pageFormatSchema.safeParse(body.format ?? "A4");
  if (!parsedFormat.success) {
    return jsonError("That page format isn't one we support.", 400);
  }

  const token = createPrintJob({
    kind: "resume",
    // Loose by design — see the note at the top of lib/validation.ts.
    data: parsedData.data as unknown as ResumeData,
    format: parsedFormat.data,
  });

  try {
    const pdf = await renderResumePdf(
      await siteOrigin(),
      token,
      parsedFormat.data,
    );

    return new Response(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="resume.pdf"',
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
