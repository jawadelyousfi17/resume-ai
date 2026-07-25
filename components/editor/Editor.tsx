"use client";

import { useState } from "react";
import type { Resume } from "@/lib/types";
import { ResumeProvider, useResume } from "@/lib/store";
import { PreviewCanvas } from "@/components/preview/PreviewCanvas";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { PAGE_SIZES } from "@/lib/defaults";
import { TopBar, type EditorTab } from "./TopBar";
import { ContentPanel } from "./ContentPanel";
import { CustomizePanel } from "./CustomizePanel";
import { AIPanel } from "./ai/AIPanel";

function EditorShell() {
  const { data, format } = useResume();
  const [tab, setTab] = useState<EditorTab>("content");

  return (
    <div className="flex h-dvh flex-col">
      <TopBar tab={tab} onTab={setTab} />

      <div className="flex min-h-0 flex-1">
        {/* Left: editing panel */}
        <div className="scroll-slim w-full max-w-[640px] shrink-0 overflow-y-auto px-4 py-5 sm:min-w-[420px] lg:w-[46%]">
          {tab === "content" && <ContentPanel />}
          {tab === "customize" && <CustomizePanel />}
          {tab === "ai" && <AIPanel />}
        </div>

        {/* Right: live preview */}
        <div className="scroll-slim hidden flex-1 overflow-y-auto px-8 py-8 lg:block">
          <div className="mx-auto w-full" style={{ maxWidth: PAGE_SIZES[format].width }}>
            <PreviewCanvas format={format}>
              <ResumePreview data={data} format={format} />
            </PreviewCanvas>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Editor({
  resume,
  guest = false,
}: {
  resume: Resume;
  /** The resume lives in this browser rather than the database. */
  guest?: boolean;
}) {
  return (
    <ResumeProvider resume={resume} guest={guest}>
      <EditorShell />
    </ResumeProvider>
  );
}
