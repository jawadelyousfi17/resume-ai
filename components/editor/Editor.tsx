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
import { ReviewPanel } from "./ReviewPanel";
import { ReviewProvider, ScanOverlay } from "./ReviewSession";
import { TailorPanel } from "./TailorPanel";
import { TailorProvider } from "./TailorSession";
import { MobileEditor } from "./mobile/MobileEditor";
import { useIsMobile } from "./mobile/use-mobile";

function EditorShell({ initialMobile }: { initialMobile: boolean }) {
  const { data, format } = useResume();
  // Always the content: the template is chosen before the editor opens, so
  // there is nothing to answer here — just the page to write. `?setup=` is
  // still read by the phone's guided build, which is its own flow.
  const [tab, setTab] = useState<EditorTab>("content");
  const mobile = useIsMobile(initialMobile);

  // A phone gets its own editor rather than a squeezed version of this one:
  // one thing on screen at a time, and the resume itself is one of them.
  if (mobile) return <MobileEditor />;

  return (
    <div className="mx-auto flex h-dvh w-full max-w-app flex-col">
      <TopBar tab={tab} onTab={setTab} />

      <div className="flex min-h-0 flex-1">
        {/* Left: editing panel */}
        <div className="scroll-slim w-full max-w-[640px] shrink-0 overflow-y-auto px-4 py-5 sm:min-w-[420px] lg:w-[46%]">
          {tab === "content" && <ContentPanel />}
          {tab === "customize" && <CustomizePanel />}
          {tab === "ai" && <AIPanel />}
          {tab === "review" && <ReviewPanel />}
          {tab === "tailor" && <TailorPanel />}
        </div>

        {/* Right: live preview. The scan shows whichever tab you're on — a
            review carries on running after you leave it. */}
        <div className="scroll-slim hidden flex-1 overflow-y-auto px-8 py-8 lg:block">
          <div
            className="relative mx-auto w-full"
            style={{ maxWidth: PAGE_SIZES[format].width }}
          >
            <PreviewCanvas format={format}>
              <ResumePreview data={data} format={format} />
            </PreviewCanvas>
            <ScanOverlay />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Editor({
  resume,
  guest = false,
  mobile = false,
  savingTo,
}: {
  resume: Resume;
  /** The resume lives in this browser rather than the database. */
  guest?: boolean;
  /** What the server made of the User-Agent — a starting point the client
   *  corrects against the real viewport. */
  mobile?: boolean;
  /** Where saves go when that isn't `resume.id` yet — see <NewResume>. */
  savingTo?: string | null;
}) {
  return (
    <ResumeProvider resume={resume} guest={guest} savingTo={savingTo}>
      {/* Outside the shell, so the report survives a tab change — and covers
          the phone editor, which renders the same Review panel. */}
      <ReviewProvider>
        <TailorProvider>
          <EditorShell initialMobile={mobile} />
        </TailorProvider>
      </ReviewProvider>
    </ResumeProvider>
  );
}
