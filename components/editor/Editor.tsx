"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { Resume } from "@/lib/types";
import { ResumeProvider, useResume } from "@/lib/store";
import { PreviewCanvas } from "@/components/preview/PreviewCanvas";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { PAGE_SIZES } from "@/lib/defaults";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { segTab, segTabList } from "@/components/ui/segmented";
import { cn } from "@/lib/utils";
import { TopBar, type EditorTab, type Zoom } from "./TopBar";
import { useHistory } from "./use-history";
import { ContentPanel } from "./ContentPanel";
import { CustomizePanel } from "./CustomizePanel";
import { AgentOverlay } from "./ai/AgentOverlay";
import { ReviewPanel } from "./ReviewPanel";
import { ReviewProvider, ScanOverlay } from "./ReviewSession";
import { TailorPanel } from "./TailorPanel";
import { TailorOverlay, TailorProvider } from "./TailorSession";
import { MobileEditor } from "./mobile/MobileEditor";
import { useIsMobile } from "./mobile/use-mobile";

/** The width at which Design stops being a tab and gets a column of its own.
 *  Tailwind's `xl`, so the classes below and this agree on the switch. */
const WIDE_QUERY = "(min-width: 1280px)";

function useWide() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(WIDE_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(WIDE_QUERY).matches,
    () => false,
  );
}

const TABS: { id: EditorTab; label: string; narrowOnly?: boolean }[] = [
  { id: "content", label: "Content" },
  { id: "customize", label: "Design", narrowOnly: true },
  { id: "review", label: "Review" },
  { id: "tailor", label: "Tailor" },
];

function EditorShell({ initialMobile }: { initialMobile: boolean }) {
  const { data, format, replace } = useResume();
  // Always the content: the template is chosen before the editor opens, so
  // there is nothing to answer here — just the page to write. `?setup=` is
  // still read by the phone's guided build, which is its own flow.
  const [picked, setPicked] = useState<EditorTab>("content");
  const mobile = useIsMobile(initialMobile);
  const wide = useWide();
  const history = useHistory(data, replace);
  const [zoom, setZoom] = useState<Zoom>("fit");
  const [scale, setScale] = useState(1);

  // Design picked on a narrow window, then the window widened: it's in its
  // own column now, so the left panel goes back to the content.
  const tab = wide && picked === "customize" ? "content" : picked;

  // The window itself must never scroll in here. The shell is exactly one
  // viewport tall and the columns inside it do all the scrolling there is,
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

  const pageWidth = PAGE_SIZES[format].width;

  return (
    // Edge to edge at every size: the workspace is the window.
    <div className="flex h-dvh w-full overflow-hidden bg-panel">
      {/* The Tabs root spans the whole shell: its switcher sits in the top
          bar, its panels in the left column, and Radix ties the two together
          through context rather than placement. */}
      <Tabs
        value={tab}
        onValueChange={(v) => setPicked(v as EditorTab)}
        className="flex min-w-0 flex-1 flex-col gap-0 overflow-hidden"
      >
        <TopBar
          history={history}
          zoom={zoom}
          scale={scale}
          onZoom={setZoom}
          tabs={
            <TabsList className={cn(segTabList, "w-auto")}>
              {TABS.map((t) => (
                <TabsTrigger
                  key={t.id}
                  value={t.id}
                  className={cn(segTab, "w-24", t.narrowOnly && "xl:hidden")}
                >
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          }
        />

        <div className="flex min-h-0 flex-1">
          {/* Left: the editing panel — whichever tab the top bar has open.
              `min-w-0`: a flex item defaults to min-width:auto, so one long
              unbreakable string — a keyword lifted straight out of a posting,
              say — would widen the column past its share and push the row
              wider than the window. */}
          <div className="flex w-full min-w-0 shrink-0 flex-col border-divider bg-panel lg:w-[400px] lg:border-r 2xl:w-[440px]">
            {/* One scroller for whichever tab is showing. Content runs its
                accordion edge to edge; the rest bring a gutter. */}
            <div className="scroll-slim min-h-0 flex-1 overflow-y-auto">
              <TabsContent value="content">
                <ContentPanel />
              </TabsContent>
              <TabsContent value="customize" className="@container">
                <CustomizePanel />
              </TabsContent>
              <TabsContent value="review" className="p-5">
                <ReviewPanel />
              </TabsContent>
              <TabsContent value="tailor" className="p-5">
                <TailorPanel />
              </TabsContent>
            </div>
          </div>

          {/* Centre: the page on its canvas. The scan shows whichever tab
              you're on — a review carries on running after you leave it. */}
          <div className="scroll-slim hidden min-w-0 flex-1 overflow-auto bg-canvas px-6 py-8 lg:block 2xl:px-12 2xl:py-12">
            <div
              className="relative mx-auto"
              style={
                zoom === "fit"
                  ? { width: "100%", maxWidth: pageWidth }
                  : { width: pageWidth * zoom }
              }
            >
              <PreviewCanvas
                format={format}
                marginY={data.settings?.marginY}
                zoom={zoom}
                onScale={setScale}
              >
                <ResumePreview data={data} format={format} paged />
              </PreviewCanvas>
              {/* Both draw over the paper, and only one can be running: the
                  review and the tailor each take the whole panel while they
                  work. */}
              <ScanOverlay />
              <TailorOverlay />
            </div>
          </div>

          {/* Right: the page's properties. Only where three columns fit — on
              a narrower window the same panel is the Design tab. */}
          <aside
            aria-label="Design"
            className="scroll-slim @container hidden w-[340px] shrink-0 overflow-y-auto border-l border-divider bg-panel xl:block 2xl:w-[380px]"
          >
            {wide && <CustomizePanel />}
          </aside>
        </div>
      </Tabs>

      {/* Floating, and outside the columns: the assistant opens over the
          whole window rather than into any of them. */}
      <AgentOverlay />
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
