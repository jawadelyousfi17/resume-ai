import { notFound } from "next/navigation";

import { ResumePreview } from "@/components/preview/ResumePreview";
import { PAGE_SIZES } from "@/lib/defaults";
import { claimPrintJob } from "@/lib/print-store";

// The page the headless browser prints. Nothing here but the resume itself, at
// exactly one page width, so the PDF is the preview rather than a second
// rendering of it.
//
// Reached only with a single-use token from the export route, which expires in
// a minute — there is nothing to enumerate and nothing to leak.

export const dynamic = "force-dynamic";

export default async function PrintPage(props: PageProps<"/print/[token]">) {
  const { token } = await props.params;
  const job = claimPrintJob(token);
  if (!job) notFound();

  const { width } = PAGE_SIZES[job.format];

  return (
    <>
      {/* The browser paginates this; the page box comes from the PDF options,
          so the document must sit flush in the corner with nothing around it. */}
      <style>{`
        html, body { margin: 0; padding: 0; background: #fff; }
        @page { margin: 0; }
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
        <ResumePreview data={job.data} format={job.format} />
      </div>
    </>
  );
}
