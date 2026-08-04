"use client";

import { useEffect, useState } from "react";
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
import { TailorOverlay, TailorProvider } from "./TailorSession";
import { MobileEditor } from "./mobile/MobileEditor";
import { useIsMobile } from "./mobile/use-mobile";

function EditorShell({ initialMobile }: { initialMobile: boolean }) {
  const { data, format } = useResume();
  // Always the content: the template is chosen before the editor opens, so
  // there is nothing to answer here — just the page to write. `?setup=` is
  // still read by the phone's guided build, which is its own flow.
  const [tab, setTab] = useState<EditorTab>("content");
  const mobile = useIsMobile(initialMobile);

  // The window itself must never scroll in here. The shell is exactly one
  // viewport tall and the two columns inside it do all the scrolling there is,
  // so a scrollbar on the page means something has escaped — and it takes the
  // top bar off screen with it, which is the one thing that has to stay put.
  //
  // Locking the body is what actually guarantees it. `overflow-hidden` on the
  // shell only contains the shell's own children; it can do nothing about the
  // page growing underneath it, and `h-dvh` measures the viewport, which is
  // not quite the same as the height the body ends up with once a horizontal
  // scrollbar or a dynamic toolbar is in play. The phone editor scrolls
  // normally and is left alone.
  useEffect(() => {
    if (mobile) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobile]);

  // A phone gets its own editor rather than a squeezed version of this one:
  // one thing on screen at a time, and the resume itself is one of them.
  if (mobile) return <MobileEditor />;

  return (
    // `overflow-hidden` is what keeps the window itself from ever scrolling:
    // the shell is exactly one viewport tall and the two columns below do all
    // the scrolling there is. Without it, anything a panel renders that
    // doesn't fit escapes and takes the whole page with it.
    <div className="mx-auto flex h-dvh w-full max-w-app flex-col overflow-hidden">
      <TopBar tab={tab} onTab={setTab} />

      <div className="flex min-h-0 flex-1">
        {/* Left: editing panel. Given the larger half of the split — the
            panels are where the work happens, and several of them (Customize,
            Tailor) are two columns of controls wanting the room, while the
            preview is capped at the paper's own width however much it gets. */}
        {/* `min-w-0`: a flex item defaults to min-width:auto, so one long
            unbreakable string — a keyword lifted straight out of a posting,
            say — would widen the column past its share and push the row wider
            than the window. */}
        <div className="scroll-slim w-full min-w-0 max-w-[860px] shrink-0 overflow-y-auto px-4 py-5 sm:min-w-[420px] lg:w-[55%]">
          {tab === "content" && <ContentPanel />}
          {tab === "customize" && <CustomizePanel />}
          {tab === "ai" && <AIPanel />}
          {tab === "review" && <ReviewPanel />}
          {tab === "tailor" && <TailorPanel />}
        </div>

        {/* Right: live preview. The scan shows whichever tab you're on — a
            review carries on running after you leave it.
            Padding is kept tight: the page inside scales to whatever width is
            left, so every pixel of inset comes straight off the paper. */}
        <div className="scroll-slim hidden flex-1 overflow-y-auto px-4 py-5 lg:block">
          <div
            className="relative mx-auto w-full"
            style={{ maxWidth: PAGE_SIZES[format].width }}
          >
            <PreviewCanvas format={format} marginY={data.settings?.marginY}>
              <ResumePreview data={data} format={format} paged />
            </PreviewCanvas>
            {/* Both draw over the paper, and only one can be running: the
                review and the tailor each take the whole panel while they
                work. */}
            <ScanOverlay />
            <TailorOverlay />
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
}: {
  resume: Resume;
  /** The resume lives in this browser rather than the database. */
  guest?: boolean;
  /** What the server made of the User-Agent — a starting point the client
   *  corrects against the real viewport. */
  mobile?: boolean;
}) {
  return (
    <ResumeProvider resume={resume} guest={guest}>
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
