"use client";

// The assistant, as a room of its own rather than a tab.
//
// It used to be the third tab along the top, which gave it the same narrow
// column as the Content form and put it in competition with the work it is
// meant to help with. Now it floats: a mark in the corner of the editor that
// opens the whole window — the conversation on the left, the paper on the
// right, so an edit it makes is visible the moment it lands.
//
// The chat itself is unchanged; `AIPanel` renders in here exactly as it did in
// the tab, which is why it takes its width from its container rather than
// setting one.

import { useEffect, useState } from "react";
import { useResume } from "@/lib/store";
import { PAGE_SIZES } from "@/lib/defaults";
import { PreviewCanvas } from "@/components/preview/PreviewCanvas";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { MagicIcon } from "@/components/ui/svg-icons";
import { AIPanel } from "./AIPanel";

/** The assistant's own gradient. Shared with the marks inside the panel — see
 *  the note on `ORB` there for why this one colour ignores the theme. */
const ORB =
  "bg-[radial-gradient(circle_at_36%_25%,rgba(255,255,255,.78),transparent_10%),linear-gradient(145deg,#72d6f7_0%,#0e9ddd_55%,#168ee0_100%)]";

export function AgentOverlay() {
  const { data, format } = useResume();
  const [open, setOpen] = useState(false);

  // Escape closes it, the way every other dismissable surface in the app
  // behaves. Bound only while open so it can't swallow the key from a dialog
  // opened over the top of it.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open the AI assistant"
        // Stacked above the theme switcher, which already holds this corner
        // from `md` up (see components/theme/ThemeSwitcher). Below that
        // breakpoint the switcher is hidden and the corner is free.
        className={`fixed right-6 bottom-6 z-40 grid h-14 w-14 place-items-center rounded-full border border-[rgba(0,131,200,.75)] text-white shadow-[inset_0_1px_5px_rgba(255,255,255,.6),0_8px_24px_rgba(18,132,191,.35)] transition hover:-translate-y-0.5 hover:shadow-[inset_0_1px_5px_rgba(255,255,255,.6),0_12px_30px_rgba(18,132,191,.45)] md:bottom-24 ${ORB}`}
      >
        <MagicIcon className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="AI assistant"
      className="fixed inset-0 z-[60] flex flex-col bg-cream"
    >
      <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-black/[0.07] bg-panel px-5">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={`grid h-9 w-9 place-items-center rounded-full border border-[rgba(0,131,200,.75)] text-white ${ORB}`}
          >
            <MagicIcon className="h-[18px] w-[18px]" />
          </span>
          <span className="text-[17px] font-semibold tracking-[-.015em] text-ink">
            Assistant
          </span>
        </div>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex h-10 items-center gap-2 rounded-xl px-3.5 text-[14px] font-bold text-ink-soft transition hover:bg-black/[0.04] hover:text-ink"
        >
          Back to editor
          <CloseIcon className="h-4 w-4" />
        </button>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Left: the conversation, given the larger half — it is what this
            screen is for, and the paper is capped at its own width however
            much room it gets. */}
        <div className="scroll-slim min-w-0 flex-1 overflow-y-auto px-6 py-6 lg:w-[58%] lg:flex-none">
          <AIPanel />
        </div>

        {/* Right: the same live preview the editor shows, so an edit is
            visible where it landed rather than described. Dropped below `lg`,
            where there isn't room for two columns and the conversation is the
            one worth keeping. */}
        <div className="scroll-slim hidden flex-1 overflow-y-auto border-l border-black/[0.07] bg-cream px-5 py-6 lg:block">
          <div
            className="mx-auto w-full"
            style={{ maxWidth: PAGE_SIZES[format].width }}
          >
            <PreviewCanvas format={format} marginY={data.settings?.marginY}>
              <ResumePreview data={data} format={format} paged />
            </PreviewCanvas>
          </div>
        </div>
      </div>
    </div>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
