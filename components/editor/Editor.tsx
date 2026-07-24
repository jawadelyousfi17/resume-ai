"use client";

import { useState } from "react";
import { ResumeProvider, useResume } from "@/lib/store";
import { PreviewCanvas } from "@/components/preview/PreviewCanvas";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { TopBar, type EditorTab } from "./TopBar";
import { ContentPanel } from "./ContentPanel";
import { CustomizePanel } from "./CustomizePanel";
import { OverviewPanel } from "./OverviewPanel";
import { StubPanel } from "./StubPanel";

function EditorShell() {
  const { data } = useResume();
  const [tab, setTab] = useState<EditorTab>("content");

  return (
    <div className="flex h-dvh flex-col">
      <TopBar tab={tab} onTab={setTab} />

      <div className="flex min-h-0 flex-1">
        {/* Left: editing panel */}
        <div className="scroll-slim w-full max-w-[640px] shrink-0 overflow-y-auto px-4 py-5 sm:min-w-[420px] lg:w-[46%]">
          {tab === "content" && <ContentPanel />}
          {tab === "overview" && <OverviewPanel onTab={setTab} />}
          {tab === "customize" && <CustomizePanel />}
          {tab === "ai" && <StubPanel kind="ai" />}
        </div>

        {/* Right: live preview */}
        <div className="scroll-slim hidden flex-1 overflow-y-auto border-l border-black/5 bg-cream-dark/40 px-8 py-8 lg:block">
          <div className="mx-auto w-full max-w-[794px]">
            <PreviewCanvas>
              <ResumePreview data={data} />
            </PreviewCanvas>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Editor({ id }: { id: string }) {
  return (
    <ResumeProvider id={id}>
      <EditorShell />
    </ResumeProvider>
  );
}
