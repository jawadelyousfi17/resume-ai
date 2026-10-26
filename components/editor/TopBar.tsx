"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Cloud,
  CloudAlert,
  Download,
  LoaderCircle,
  Redo2,
  Send,
  Undo2,
} from "lucide-react";
import { useResume } from "@/lib/store";
import { Logo } from "@/components/ui/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShareDialog } from "@/components/share/ShareDialog";
import { useAuthDialog } from "@/components/auth/AuthDialog";
import { cn } from "@/lib/utils";
import { useDownloadPdf } from "./use-download-pdf";

// The left panel's tabs. Design sits in a panel of its own on a wide screen
// and only joins these when there isn't room for a third column — see Editor.
// The assistant is deliberately absent: it is a floating mark that opens over
// the whole window — see `ai/AgentOverlay`.
export type EditorTab = "content" | "customize" | "review" | "tailor";

export type Zoom = "fit" | number;

const ZOOMS = [0.5, 0.75, 1, 1.25, 1.5];

export function TopBar({
  history,
  zoom,
  scale,
  onZoom,
  tabs,
}: {
  history: {
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
  };
  zoom: Zoom;
  /** What the paper is drawn at right now — the label while fitting. */
  scale: number;
  onZoom: (zoom: Zoom) => void;
  /** The editor's panel switcher, centred in the bar. Built by the Editor,
   *  which owns the Tabs it belongs to. */
  tabs: React.ReactNode;
}) {
  const { id, name, setName, guest, share, setShare } = useResume();
  const { download, busy } = useDownloadPdf();
  const auth = useAuthDialog();
  const [sharing, setSharing] = useState(false);

  // A guest's resume is in this browser and nowhere else, so there is nothing
  // to put a link on. Same answer the dashboard gives: an account first.
  const openShare = () => (guest ? auth.open("signup") : setSharing(true));

  return (
    <header className="z-20 flex h-16 shrink-0 items-center gap-2 border-b border-divider bg-panel px-4 xl:h-[72px] xl:px-6">
      {/* Left: where you are — the mark, the trail back, the document. */}
      <Link
        href="/dashboard"
        aria-label="Back to your dashboard"
        className="shrink-0 rounded-full"
      >
        <Logo className="h-10 w-10" />
      </Link>

      <nav
        aria-label="Breadcrumb"
        className="ml-3 flex min-w-0 items-center gap-1.5 text-[15px]"
      >
        <Link
          href="/dashboard"
          className="hidden shrink-0 text-ink-soft transition hover:text-ink md:inline"
        >
          Dashboard
        </Link>
        <ChevronRight
          aria-hidden
          className="hidden size-4 shrink-0 text-ink-faint md:block"
        />
        {/* The title is edited where it's shown. Sized to its own text so the
            bar doesn't hold a field-width gap after a short name. */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Untitled"
          aria-label="Resume name"
          size={Math.max(8, Math.min(32, (name || "Untitled").length + 1))}
          className="min-w-0 truncate rounded-md bg-transparent px-1.5 py-1 font-medium text-ink outline-none transition placeholder:text-ink-faint hover:bg-canvas focus-visible:bg-canvas focus-visible:ring-2 focus-visible:ring-brand/30"
        />
      </nav>

      <SaveStatus />

      {/* Centre: which panel the left column shows. A flex-1 on each side of
          it keeps it centred over the bar however long the title gets. */}
      <div className="flex min-w-0 flex-1 justify-center px-3">{tabs}</div>

      {/* Right: history and zoom, then the two ways a resume leaves. */}
      <div className="hidden items-center gap-1 sm:flex">
        <IconButton
          label="Undo"
          shortcut="⌘Z"
          onClick={history.undo}
          disabled={!history.canUndo}
        >
          <Undo2 className="size-5" />
        </IconButton>
        <IconButton
          label="Redo"
          shortcut="⇧⌘Z"
          onClick={history.redo}
          disabled={!history.canRedo}
        >
          <Redo2 className="size-5" />
        </IconButton>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Zoom"
            className="ml-1 hidden h-10 shrink-0 items-center gap-2 rounded-lg bg-canvas pr-2.5 pl-3.5 text-[14px] font-medium text-ink tabular-nums transition hover:bg-field lg:flex"
          >
            {Math.round(scale * 100)}%
            <ChevronDown className="size-4 text-ink-soft" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-36">
          <DropdownMenuItem onClick={() => onZoom("fit")}>
            Fit to width
            {zoom === "fit" && <Tick />}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {ZOOMS.map((z) => (
            <DropdownMenuItem key={z} onClick={() => onZoom(z)}>
              {z * 100}%{zoom === z && <Tick />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <span className="mx-2 hidden h-6 w-px shrink-0 bg-divider lg:block" />

      <button
        type="button"
        onClick={download}
        disabled={busy}
        className="btn-soft flex h-10 shrink-0 items-center gap-2 px-3 text-[15px] font-medium transition disabled:opacity-60 sm:px-5 xl:h-12"
      >
        {busy ? (
          <LoaderCircle className="size-5 animate-spin" />
        ) : (
          <Download className="size-5" />
        )}
        <span className="hidden sm:inline">
          {busy ? "Building…" : "Download"}
        </span>
      </button>

      <button
        type="button"
        onClick={openShare}
        title={share ? "Shared — manage the link" : "Share a public link"}
        className="btn-fill flex h-10 shrink-0 items-center gap-2 px-3 text-[15px] font-medium transition sm:px-5 xl:h-12"
      >
        <Send className="size-5" />
        {/* The only place that tells you a link is live. */}
        <span className="hidden sm:inline">{share ? "Shared" : "Share"}</span>
      </button>

      <ShareDialog
        resume={sharing ? { id, name, share } : null}
        onClose={() => setSharing(false)}
        onChange={setShare}
      />
    </header>
  );
}

/** "Saved" beside the title: the blue cloud is the reassurance, which is why
 *  it's the one bit of colour on this side of the bar. */
function SaveStatus() {
  const { saveState, guest } = useResume();
  const failed = saveState === "error";
  const saving = saveState === "saving";

  return (
    <span
      role="status"
      title={
        failed ? "Not saved" : saving ? "Saving…" : guest ? "Saved in this browser" : "Saved"
      }
      className="ml-2 hidden shrink-0 items-center gap-2 text-[14px] text-ink-soft md:flex"
    >
      {failed ? (
        <CloudAlert className="size-5 text-danger" />
      ) : (
        <Cloud
          className={cn(
            "size-5 text-brand",
            saving ? "animate-pulse" : "fill-brand",
          )}
        />
      )}
      {/* The cloud alone says it on a narrower bar; the words come back
          when there's room for them beside the tabs. */}
      <span className="hidden 2xl:inline">
        {failed
          ? "Not saved"
          : saving
            ? "Saving…"
            : guest
              ? "Saved in this browser"
              : "Saved"}
      </span>
    </span>
  );
}

function IconButton({
  label,
  shortcut,
  onClick,
  disabled,
  children,
}: {
  label: string;
  shortcut: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={`${label} (${shortcut})`}
      className="inline-flex size-10 items-center justify-center rounded-full text-ink transition hover:bg-canvas disabled:text-ink-faint disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

function Tick() {
  return <span className="ml-auto text-brand">✓</span>;
}
