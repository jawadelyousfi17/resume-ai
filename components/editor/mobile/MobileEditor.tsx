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
  DownloadIcon,
  DocumentIcon as FileTextIcon,
  EyeIcon,
  PencilIcon,
  ChipIcon,
  TargetIcon,
  DesignIcon as WandIcon,
} from "@/components/ui/svg-icons";
import { Logo } from "@/components/ui/logo";
import { useResume } from "@/lib/store";
import { cn } from "@/lib/utils";

import { AIPanel } from "../ai/AIPanel";
import { ContentPanel } from "../ContentPanel";
import { CustomizePanel } from "../CustomizePanel";
import { ReviewPanel } from "../ReviewPanel";
import { useDownloadPdf } from "../use-download-pdf";
import { TailorPanel } from "../TailorPanel";
import { SetupFlow } from "./SetupFlow";

type MobileTab = "content" | "customize" | "ai" | "review" | "tailor";

const TABS: {
  id: MobileTab;
  label: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
}[] = [
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
  const [tab, setTab] = useState<MobileTab>("content");
  // The page itself isn't one of the tabs — it's the floating eye, so looking
  // at the resume never costs you the panel you were working in.
  const [previewing, setPreviewing] = useState(true);

  if (setup) {
    return (
      <SetupFlow
        mode={setup}
        onDone={() => {
          setSetup(null);
          // Finishing the walk-through lands on the finished page.
          setPreviewing(true);
          // Drop the parameter so a refresh lands in the editor, not back at
          // step one.
          router.replace(window.location.pathname);
        }}
      />
    );
  }

  return (
    <div className="flex h-dvh flex-col bg-cream">
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
            <CustomizePanel />
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

      {/* Look at the page, or go back to what you were editing. It floats
          clear of the tab bar so it's reachable from anywhere. */}
      <button
        type="button"
        onClick={() => setPreviewing((v) => !v)}
        aria-pressed={previewing}
        aria-label={previewing ? "Back to editing" : "Preview the resume"}
        className="fixed right-4 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-30 flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white shadow-[0_10px_28px_rgba(15,23,42,0.3)] transition active:scale-95"
      >
        {previewing ? (
          <PencilIcon className="h-6 w-6" />
        ) : (
          <EyeIcon className="h-6 w-6" />
        )}
      </button>

      <nav className="grid shrink-0 grid-cols-5 border-t border-black/5 bg-panel pb-[env(safe-area-inset-bottom)]">
        {TABS.map((t) => {
          const Icon = t.icon;
          const on = t.id === tab && !previewing;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id);
                setPreviewing(false);
              }}
              aria-current={on ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[10.5px] font-bold transition",
                on ? "text-brand" : "text-ink-faint",
              )}
            >
              <Icon className="h-[22px] w-[22px]" />
              {t.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function MobileTopBar() {
  const { name } = useResume();
  const { download, busy } = useDownloadPdf();

  return (
    <header className="flex shrink-0 items-center gap-2 border-b border-black/5 bg-panel px-3 py-2.5">
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
        className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-navy px-3.5 text-[14px] font-bold text-white transition disabled:opacity-60"
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
    <div className="relative px-3 pt-4 pb-24">
      <PreviewCanvas format={format}>
        <ResumePreview data={data} format={format} />
      </PreviewCanvas>
    </div>
  );
}
