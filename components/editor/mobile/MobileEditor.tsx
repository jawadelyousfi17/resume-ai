"use client";

// The editor on a phone.
//
// The desktop layout puts the form beside the page and shows both at once; a
// phone can only hold one at a time, so the page itself becomes a destination
// rather than something permanently in the corner of your eye. Tabs along the
// bottom, the resume first — after all that typing, seeing it is the point.

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { PreviewCanvas } from "@/components/preview/PreviewCanvas";
import { ResumePreview } from "@/components/preview/ResumePreview";
import {
  AwardIcon,
  ChipIcon,
  DownloadIcon,
  EyeIcon,
  FileTextIcon,
  TargetIcon,
  WandIcon,
} from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";
import { useResume } from "@/lib/store";
import { cn } from "@/lib/utils";
import { segItem, segItemOn, segTrack } from "@/components/ui/segmented";

import { AIPanel } from "../ai/AIPanel";
import { ContentPanel } from "../ContentPanel";
import { CustomizePanel } from "../CustomizePanel";
import { ReviewPanel } from "../ReviewPanel";
import { ScanOverlay } from "../ReviewSession";
import { useDownloadPdf } from "../use-download-pdf";
import { TailorPanel } from "../TailorPanel";
import { TailorOverlay } from "../TailorSession";
import { SetupFlow } from "./SetupFlow";

type MobileTab =
  | "preview"
  | "content"
  | "customize"
  | "ai"
  | "review"
  | "tailor";

const TABS: {
  id: MobileTab;
  label: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
}[] = [
  { id: "preview", label: "Preview", icon: EyeIcon },
  { id: "content", label: "Edit", icon: FileTextIcon },
  { id: "customize", label: "Design", icon: WandIcon },
  { id: "ai", label: "AI", icon: ChipIcon },
  { id: "review", label: "Review", icon: AwardIcon },
  { id: "tailor", label: "Tailor", icon: TargetIcon },
];

export function MobileEditor() {
  const router = useRouter();
  const params = useSearchParams();

  // `?setup=new` after "start from scratch", `?setup=import` after an upload.
  // Read once: finishing the flow clears the URL, and that shouldn't restart it.
  const [setup, setSetup] = useState<"new" | "import" | null>(() => {
    const value = params.get("setup");
    return value === "new" || value === "import" ? value : null;
  });
  // The page is a tab like the rest, and the first one open.
  const [tab, setTab] = useState<MobileTab>("preview");
  const previewing = tab === "preview";

  if (setup) {
    return (
      <SetupFlow
        mode={setup}
        onDone={() => {
          setSetup(null);
          // Finishing the walk-through lands on the finished page.
          setTab("preview");
          // Drop the parameter so a refresh lands in the editor, not back at
          // step one.
          router.replace(window.location.pathname);
        }}
      />
    );
  }

  return (
    <div className="flex h-dvh flex-col bg-canvas">
      <MobileTopBar />

      <div className="scroll-slim min-h-0 flex-1 overflow-y-auto">
        {previewing && <PreviewTab />}
        {!previewing && tab === "content" && (
          <div className="px-3 py-4">
            <ContentPanel flat />
          </div>
        )}
        {!previewing && tab === "customize" && (
          <div className="px-3 py-4">
            {/* Flat sections, gathered into one sheet on the grey. */}
            <div className="@container overflow-hidden rounded-[10px] bg-panel ring-1 ring-divider">
              <CustomizePanel />
            </div>
          </div>
        )}
        {!previewing && tab === "ai" && (
          <div className="px-3 py-4">
            <AIPanel />
          </div>
        )}
        {!previewing && tab === "review" && (
          <div className="px-3 py-4">
            <ReviewPanel />
          </div>
        )}
        {!previewing && tab === "tailor" && (
          <div className="px-3 py-4">
            <TailorPanel />
          </div>
        )}
      </div>

      {/* The theme's segmented control, along the bottom: a pale track with
          the open tab lifted out of it in white, its icon in the blue. */}
      <nav className="shrink-0 border-t border-divider bg-panel px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        <div className={segTrack}>
          {TABS.map((t) => {
            const Icon = t.icon;
            const on = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                aria-current={on ? "page" : undefined}
                className={cn(
                  segItem,
                  "h-auto flex-col gap-0.5 px-0 py-1.5 text-[10.5px]",
                  on && segItemOn,
                )}
              >
                <Icon
                  className={cn("h-5 w-5", on ? "text-white" : "text-ink-faint")}
                />
                {t.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function MobileTopBar() {
  const { name } = useResume();
  const { download, busy } = useDownloadPdf();

  return (
    <header className="flex shrink-0 items-center gap-2 border-b border-divider bg-panel px-3 py-2.5">
      <Link
        href="/dashboard"
        aria-label="Back to my resumes"
        className="shrink-0"
      >
        <Logo className="h-11 w-11" />
      </Link>

      <span className="min-w-0 flex-1 truncate text-[15px] font-bold text-ink">
        {name || "Untitled"}
      </span>

      <button
        type="button"
        onClick={download}
        disabled={busy}
        className="btn-fill inline-flex h-10 shrink-0 items-center gap-1.5 px-4 text-[14px] font-semibold transition disabled:opacity-60"
      >
        <DownloadIcon className="h-[18px] w-[18px]" />
        {busy ? "Building…" : "PDF"}
      </button>
    </header>
  );
}

/** The page itself. The floating control is the way back out. */
function PreviewTab() {
  const { data, format } = useResume();

  return (
    <div className="px-3 pt-4 pb-6">
      {/* Its own positioning context, so an overlay covers the paper rather
          than the padding around it. */}
      <div className="relative">
        <PreviewCanvas format={format} marginY={data.settings?.marginY}>
          <ResumePreview data={data} format={format} paged />
        </PreviewCanvas>
        {/* Switching to this tab mid-run is exactly when you want to see that
            something is still happening to the page. */}
        <ScanOverlay />
        <TailorOverlay />
      </div>
    </div>
  );
}
