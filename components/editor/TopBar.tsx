"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useResume } from "@/lib/store";
import { generateLatex } from "@/lib/latex";
import { downloadBlob, downloadTex, slugify } from "@/lib/export";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDownIcon,
  DownloadIcon,
  FileTextIcon,
  SparklesIcon,
  WandIcon,
} from "@/components/ui/icons";

export type EditorTab = "content" | "customize" | "ai";

const TABS: { id: EditorTab; label: string; icon: React.ReactNode }[] = [
  { id: "content", label: "Content", icon: <FileTextIcon className="h-[18px] w-[18px]" /> },
  { id: "customize", label: "Customize", icon: <WandIcon className="h-[18px] w-[18px]" /> },
  { id: "ai", label: "AI Tools", icon: <SparklesIcon className="h-[18px] w-[18px]" /> },
];

export function TopBar({
  tab,
  onTab,
}: {
  tab: EditorTab;
  onTab: (t: EditorTab) => void;
}) {
  const { name, data, format } = useResume();

  const [busy, setBusy] = useState(false);
  const buildTex = () => generateLatex({ name, data, format });

  const handlePdf = async () => {
    setBusy(true);
    const toastId = toast.loading("Building your PDF…");
    try {
      const res = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tex: buildTex() }),
      });
      if (!res.ok) {
        const info = await res.json().catch(() => ({}) as { error?: string });
        throw new Error(info.error || `Server error ${res.status}`);
      }
      downloadBlob(`${slugify(name)}.pdf`, await res.blob());
      toast.success("Downloaded resume.pdf", { id: toastId });
    } catch (err) {
      toast.error("Couldn't build the PDF", {
        id: toastId,
        description:
          err instanceof Error ? err.message.slice(0, 160) : undefined,
      });
    } finally {
      setBusy(false);
    }
  };

  const handleTex = () => {
    downloadTex(`${slugify(name)}.tex`, buildTex());
    toast.success("Downloaded resume.tex");
  };

  return (
    <header className="z-20 mx-3 mt-3 shrink-0 rounded-xl border border-black/5 bg-panel px-3 py-2">
      <div className="flex items-center gap-2">
        {/* Left: identity — wordmark, then the document this bar is acting on. */}
        <Link
          href="/dashboard"
          className="hidden shrink-0 px-1 text-[15px] font-extrabold tracking-tight text-ink sm:block"
        >
          resume<span className="text-brand">ai</span>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                disabled={busy}
                className="h-auto gap-2 rounded-lg bg-navy px-3.5 py-2 text-[14px] font-bold text-white hover:bg-navy/90"
              >
                <DownloadIcon className="h-[18px] w-[18px]" />
                {busy ? "Building…" : "Download"}
                <ChevronDownIcon className="h-4 w-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuItem onClick={handlePdf}>
                <DownloadIcon className="h-4 w-4" />
                Download PDF
                <span className="ml-auto text-[11px] font-semibold text-ink-faint">
                  LaTeX
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleTex}>
                <FileTextIcon className="h-4 w-4" />
                Download .tex source
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
