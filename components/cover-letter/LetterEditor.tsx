"use client";

// The cover letter editor. The same arrangement as the resume: Content and
// Customize in the top bar, the panel for whichever is selected on the left,
// and the page itself on the right.

import Link from "next/link";
import { useState } from "react";
import type { CoverLetter, Resume } from "@/lib/types";
import { LetterProvider, useLetter } from "@/lib/letter-store";
import { PreviewCanvas } from "@/components/preview/PreviewCanvas";
import { PAGE_SIZES } from "@/lib/defaults";
import { Logo, LogoLockup } from "@/components/ui/logo";
import {
  DesignIcon,
  DocumentIcon,
  DownloadIcon,
  MagicIcon as SparklesIcon,
} from "@/components/ui/svg-icons";
import { EyeIcon, PencilIcon } from "@/components/ui/svg-icons";
import { cn } from "@/lib/utils";
import { CoverLetterPreview } from "./CoverLetterPreview";
import { LetterContent, LetterCustomize } from "./LetterForm";
import { RewriteDialog } from "./RewriteDialog";
import { useDownloadLetter } from "./use-download-letter";

type LetterTab = "content" | "customize";

const TABS: { id: LetterTab; label: string; icon: React.ReactNode }[] = [
  {
    id: "content",
    label: "Content",
    icon: <DocumentIcon className="h-[18px] w-[18px]" />,
  },
  {
    id: "customize",
    label: "Customize",
    icon: <DesignIcon className="h-[18px] w-[18px]" />,
  },
];

export function LetterEditor({
  letter,
  resume,
}: {
  letter: CoverLetter;
  /** The resume it was drafted from, when it still exists — what a rewrite
   *  reads. Null means the rewrite button asks you to pick one. */
  resume: Resume | null;
}) {
  return (
    <LetterProvider letter={letter}>
      <Shell resume={resume} />
    </LetterProvider>
  );
}

function Shell({ resume }: { resume: Resume | null }) {
  const { data, format } = useLetter();
  const [rewriting, setRewriting] = useState(false);
  const [tab, setTab] = useState<LetterTab>("content");
  // A phone shows one thing at a time — the same arrangement the resume editor
  // uses: tabs along the bottom, and the page behind a floating eye.
  const [previewing, setPreviewing] = useState(false);

  const onTabPress = (id: LetterTab) => {
    setTab(id);
    setPreviewing(false);
  };

  const openRewrite = () => setRewriting(true);

  return (
    <div className="flex min-h-dvh flex-col pb-16 lg:h-dvh lg:pb-0">
      <TopBar tab={tab} onTab={setTab} onRewrite={openRewrite} />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div
          className={cn(
            "scroll-slim w-full shrink-0 overflow-y-auto px-4 py-5 lg:block lg:w-[46%] lg:max-w-[640px] lg:min-w-[420px]",
            previewing && "hidden",
          )}
        >
          {tab === "content" ? <LetterContent /> : <LetterCustomize />}
        </div>

        <div
          className={cn(
            "scroll-slim flex-1 overflow-y-auto px-4 pt-4 pb-24 lg:block lg:px-8 lg:py-8",
            previewing ? "block" : "hidden",
          )}
        >
          <div
            className="mx-auto w-full"
            style={{ maxWidth: PAGE_SIZES[format].width }}
          >
            <PreviewCanvas format={format}>
              <CoverLetterPreview data={data} format={format} />
            </PreviewCanvas>
          </div>
        </div>
      </div>

      {/* Look at the letter, or go back to writing it. */}
      <button
        type="button"
        onClick={() => setPreviewing((v) => !v)}
        aria-pressed={previewing}
        aria-label={previewing ? "Back to editing" : "Preview the letter"}
        className="fixed right-4 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-30 flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white shadow-[0_10px_28px_rgba(15,23,42,0.3)] transition active:scale-95 lg:hidden"
      >
        {previewing ? (
          <PencilIcon className="h-6 w-6" />
        ) : (
          <EyeIcon className="h-6 w-6" />
        )}
      </button>

      {/* The tabs, where a thumb can reach them. */}
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 border-t border-black/5 bg-panel pb-[env(safe-area-inset-bottom)] lg:hidden">
        {TABS.map((t) => {
          const on = t.id === tab && !previewing;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onTabPress(t.id)}
              aria-current={on ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[11.5px] font-bold transition",
                on ? "text-brand" : "text-ink-faint",
              )}
            >
              {t.icon}
              {t.label === "Content" ? "Write" : "Design"}
            </button>
          );
        })}

        {/* Rewriting the letter is the third thing you do here, so on a phone
            it sits beside the other two rather than in the crowded top bar. */}
        <button
          type="button"
          onClick={openRewrite}
          className="flex flex-col items-center gap-1 py-2.5 text-[11.5px] font-bold text-ink-faint transition"
        >
          <SparklesIcon className="h-[18px] w-[18px]" />
          Rewrite
        </button>
      </nav>

      <RewriteDialog
        open={rewriting}
        onOpenChange={setRewriting}
        resume={resume}
      />
    </div>
  );
}

function TopBar({
  tab,
  onTab,
  onRewrite,
}: {
  tab: LetterTab;
  onTab: (t: LetterTab) => void;
  onRewrite: () => void;
}) {
  const { name, setName, saveState } = useLetter();
  const { download, busy } = useDownloadLetter();

  return (
    <header className="z-20 mx-3 mt-3 shrink-0 rounded-xl border border-black/5 bg-panel px-3 py-2">
      <div className="flex items-center gap-2">
        <Link
          href="/cover-letters"
          className="flex shrink-0 items-center gap-1.5 px-1"
          aria-label="Back to my cover letters"
        >
          <Logo className="h-7 w-7 sm:hidden" />
          <LogoLockup className="hidden h-7 sm:block" />
        </Link>

        <span className="hidden h-5 w-px shrink-0 bg-black/10 sm:block" />

        {/* The name is edited in place here rather than behind a dialog — a
            letter gets renamed as soon as you know which job it's for. */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Cover letter name"
          className="w-32 min-w-0 shrink rounded-lg px-2 py-1.5 text-[14px] font-bold text-ink transition hover:bg-black/[0.03] focus:bg-black/[0.03] focus:outline-none sm:w-48"
        />

        {/* Centre: tabs. Only the active one carries a fill. */}
        <nav className="mx-auto hidden shrink-0 items-center gap-0.5 lg:flex">
          {TABS.map((t) => {
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onTab(t.id)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[14.5px] font-bold transition ${
                  active
                    ? "bg-brand-soft text-brand"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {t.icon}
                <span className="hidden md:inline">{t.label}</span>
              </button>
            );
          })}
        </nav>

        <span className="hidden shrink-0 px-1 text-[12.5px] font-semibold text-ink-faint sm:block">
          {saveState === "saving"
            ? "Saving…"
            : saveState === "saved"
              ? "Saved"
              : saveState === "error"
                ? "Not saved"
                : ""}
        </span>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
          <button
            type="button"
            onClick={onRewrite}
            className="hidden h-auto items-center gap-2 rounded-lg bg-brand-soft px-3.5 py-2 text-[14px] font-bold text-brand transition hover:opacity-85 lg:inline-flex"
          >
            <SparklesIcon className="h-[18px] w-[18px]" />
            <span className="hidden md:inline">Rewrite</span>
          </button>

          <button
            type="button"
            onClick={download}
            disabled={busy}
            className="inline-flex h-auto items-center gap-2 rounded-lg bg-navy px-3.5 py-2 text-[14px] font-bold text-white transition hover:bg-navy/90 disabled:opacity-60"
          >
            <DownloadIcon className="h-[18px] w-[18px]" />
            <span className="hidden sm:inline">
              {busy ? "Building…" : "Download PDF"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
