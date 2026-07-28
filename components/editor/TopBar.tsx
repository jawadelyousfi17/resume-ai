"use client";

import Link from "next/link";
import { useResume } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Logo, LogoLockup } from "@/components/ui/logo";
import {
  AwardIcon,
  ChipIcon,
  DownloadIcon,
  FileTextIcon,
  TargetIcon,
  WandIcon,
} from "@/components/ui/icons";
import { useDownloadPdf } from "./use-download-pdf";

export type EditorTab = "content" | "customize" | "ai" | "review" | "tailor";

const TABS: { id: EditorTab; label: string; icon: React.ReactNode }[] = [
  {
    id: "content",
    label: "Content",
    icon: <FileTextIcon className="h-[18px] w-[18px]" />,
  },
  {
    id: "customize",
    label: "Customize",
    icon: <WandIcon className="h-[18px] w-[18px]" />,
  },
  {
    id: "ai",
    label: "AI Tools",
    icon: <ChipIcon className="h-[18px] w-[18px]" />,
  },
  {
    id: "review",
    label: "Review",
    icon: <AwardIcon className="h-[18px] w-[18px]" />,
  },
  {
    id: "tailor",
    label: "Tailor",
    icon: <TargetIcon className="h-[18px] w-[18px]" />,
  },
];

export function TopBar({
  tab,
  onTab,
}: {
  tab: EditorTab;
  onTab: (t: EditorTab) => void;
}) {
  const { name } = useResume();
  const { download, busy } = useDownloadPdf();

  return (
    <header className="z-20 mx-3 mt-3 shrink-0 rounded-xl border border-black/5 bg-panel px-3 py-2">
      <div className="flex items-center gap-2">
        {/* Left: identity — wordmark, then the document this bar is acting on. */}
        <Link
          href="/dashboard"
          className="flex shrink-0 items-center gap-1.5 px-1 text-[15px] font-extrabold tracking-tight text-ink"
        >
          {/* The bar is crowded on a narrow screen, so the wordmark drops and
              the mark carries the link on its own. */}
          <Logo className="h-11 w-11 sm:hidden" />
          <LogoLockup className="hidden h-11 sm:block" />
        </Link>

        <span className="hidden h-5 w-px shrink-0 bg-black/10 sm:block" />

        <span className="min-w-0 shrink truncate px-2 py-1.5 text-[14px] font-bold text-ink">
          {name || "Untitled"}
        </span>

        {/* Centre: tabs. Only the active one carries a fill. */}
        <nav className="mx-auto flex shrink-0 items-center gap-0.5">
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

        {/* Right: the one primary action. */}
        <div className="flex shrink-0 items-center gap-2">
          <Button
            onClick={download}
            disabled={busy}
            className="h-auto gap-2 rounded-lg bg-navy px-3.5 py-2 text-[14px] font-bold text-white hover:bg-navy/90"
          >
            <DownloadIcon className="h-[18px] w-[18px]" />
            {busy ? "Building…" : "Download PDF"}
          </Button>
        </div>
      </div>
    </header>
  );
}
