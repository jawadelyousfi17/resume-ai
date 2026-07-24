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
  GridIcon,
  SparklesIcon,
  WandIcon,
} from "@/components/ui/icons";

export type EditorTab = "overview" | "content" | "customize" | "ai";

const TABS: { id: EditorTab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <GridIcon className="h-[18px] w-[18px]" /> },
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
  const { name, data, setName, saveState } = useResume();
  const [editingName, setEditingName] = useState(false);

  const [busy, setBusy] = useState(false);
  const buildTex = () => generateLatex({ name, data });

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
    <header className="z-20 shrink-0 border-b border-black/5 bg-panel px-4 py-3">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="hidden shrink-0 rounded-lg px-2 py-1 text-[15px] font-extrabold tracking-tight text-ink sm:block"
        >
          resume<span className="text-brand">ai</span>
        </Link>

        <nav className="flex items-center gap-1 rounded-xl bg-cream/60 p-1">
          {TABS.map((t) => {
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onTab(t.id)}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-[15px] font-bold transition ${
                  active
                    ? "bg-panel text-brand shadow-sm"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {t.icon}
                <span className="hidden md:inline">{t.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden text-[12px] font-medium text-ink-faint sm:inline">
            {saveState === "saving"
              ? "Saving…"
              : saveState === "saved"
                ? "Saved"
                : ""}
          </span>

          {editingName ? (
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={(e) => e.key === "Enter" && setEditingName(false)}
              className="w-44 rounded-lg border border-brand/40 bg-white px-3 py-2.5 text-[15px] font-semibold text-ink outline-none"
            />
          ) : (
            <button
              type="button"
              onClick={() => setEditingName(true)}
              className="flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2.5 text-[15px] font-semibold text-ink transition hover:bg-black/5"
            >
              {name || "Untitled"}
              <ChevronDownIcon className="h-4 w-4 text-ink-soft" />
            </button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                disabled={busy}
                className="h-auto gap-2 rounded-lg bg-navy px-4 py-2.5 text-[14px] font-bold text-white hover:bg-navy/90"
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
