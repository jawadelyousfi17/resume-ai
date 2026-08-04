"use client";

// The paper on a shared link's page.
//
// The same `ResumePreview` the editor and the PDF go through, on the same
// scaling canvas — a visitor sees the document the owner sees, not a second
// rendering of it. Without the editor's page cuts: they answer "will this
// export onto two sheets", which is the author's question, not a reader's.

import { PreviewCanvas } from "@/components/preview/PreviewCanvas";
import { ResumePreview } from "@/components/preview/ResumePreview";
import type { PageFormat, ResumeData } from "@/lib/types";

export function SharedResumeView({
  data,
  format,
}: {
  data: ResumeData;
  format: PageFormat;
}) {
  return (
    <PreviewCanvas format={format} guides={false} marginY={data.settings?.marginY}>
      <ResumePreview data={data} format={format} paged />
    </PreviewCanvas>
  );
}
