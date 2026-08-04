import { notFound } from "next/navigation";

import { ResumePreview } from "@/components/preview/ResumePreview";
import { CoverLetterPreview } from "@/components/cover-letter/CoverLetterPreview";
import { DEFAULT_SETTINGS, PAGE_SIZES } from "@/lib/defaults";
import { claimPrintJob } from "@/lib/print-store";
import { isSignedToken, printSecret, readSignedJob } from "@/lib/print-token";

// The page the headless browser prints. Nothing here but the document itself,
// at exactly one page width, so the PDF is the preview rather than a second
// rendering of it.
//
// Reached only with a single-use token from the export route, which expires in
// a minute — there is nothing to enumerate and nothing to leak.

export const dynamic = "force-dynamic";

export default async function PrintPage(props: PageProps<"/print/[token]">) {
  const { token } = await props.params;

  // A signed token carries the document with it, which is what lets a renderer
  // on another machine — or another serverless instance — read it. Anything
  // else is a one-shot handle into this process's own store.
  const secret = printSecret();
  const job =
    secret && isSignedToken(token)
      ? readSignedJob(token, secret)
      : claimPrintJob(token);

  if (!job) notFound();

  const { width } = PAGE_SIZES[job.format];
  const marginY = job.data.settings?.marginY ?? DEFAULT_SETTINGS.marginY;

  return (
    <>
      {/* The browser paginates this; the page box comes from the PDF options,
          so the document must sit flush in the corner with nothing around it.
          The one thing the page box does carry is the vertical margin, because
          only it repeats: a padded container gives the document a head and a
          foot, but nothing at all where the paper is cut, so a second page used
          to start hard against the top edge and a first page ran off the bottom
          of it. `:first` keeps its top margin at nothing so page one still
          opens the way the template drew it — a banded header bleeding to the
          edge, most visibly — and the document stops padding its own foot; see
          the `paged` prop below. */}
      <style>{`
        html, body { margin: 0; padding: 0; background: #fff; }
        @page { margin: ${marginY}mm 0; }
        @page :first { margin-top: 0; }
        /* Keep a heading with what it introduces, and don't split a bullet
           across the page boundary. */
        h2 { break-after: avoid; }
        li { break-inside: avoid; }
      `}</style>
      <div
        data-print-root
        style={{ width, background: "#fff" }}
        className="resume-page"
      >
        {job.kind === "letter" ? (
          <CoverLetterPreview data={job.data} format={job.format} />
        ) : (
          <ResumePreview data={job.data} format={job.format} paged />
        )}
      </div>
    </>
  );
}
