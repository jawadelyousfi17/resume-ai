"use client";

import Link, { useLinkStatus } from "next/link";
import { useState } from "react";
import type { Resume } from "@/lib/types";
import { downloadResumePdf } from "@/lib/export";
import { formatRelative } from "@/lib/relative-time";
import {
  CopyIcon,
  DotsIcon,
  DownloadIcon,
  LinkIcon,
  PencilIcon,
  TagIcon,
  TrashIcon,
} from "@/components/ui/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { ResumeThumb } from "./ResumeThumb";

export function ResumeCard({
  resume,
  onRename,
  onDuplicate,
  onShare,
  onDelete,
}: {
  resume: Resume;
  onRename: () => void;
  onDuplicate: () => void;
  onShare: () => void;
  onDelete: () => void;
}) {
  // Building a PDF takes a couple of seconds on the server, so the row it was
  // pressed from says so rather than looking like nothing happened. The toasts
  // inside `downloadResumePdf` report the outcome.
  const [downloading, setDownloading] = useState(false);
  const download = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadResumePdf(resume);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:ring-black/15">
        <ResumeThumb data={resume.data} />

        {/* Under the menu rather than around it — an anchor can't contain
            buttons. It still covers the whole card, so the dimmed area around
            the menu opens the resume too. */}
        <Link
          href={`/resume/${resume.id}`}
          aria-label={`Open ${resume.name}`}
          // The editor is a dynamic route, so the default prefetch would only
          // fetch its loading shell. `true` fetches the document with it —
          // opening a resume you can see on screen is then instant.
          prefetch
          className="absolute inset-0"
        >
          {/* Opening a resume is a server render — a second or two on a cold
              route. This says the press landed, before the editor's own
              skeleton takes over. */}
          <Opening />
        </Link>

        {/* Hover only, so it never sits over the page on a touch screen where
            there's nothing to hover with — the ⋯ button below is that path.
            `pointer-events-none` on the scrim keeps the link underneath live. */}
        <div className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-black/65 p-4 opacity-0 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100 md:flex">
          <div className="pointer-events-auto w-full max-w-[170px]">
            <CardAction href={`/resume/${resume.id}`} icon={PencilIcon}>
              Edit
            </CardAction>
            <CardAction
              onClick={download}
              icon={DownloadIcon}
              busy={downloading}
            >
              {downloading ? "Building…" : "Download"}
            </CardAction>
            <CardAction onClick={onShare} icon={LinkIcon}>
              {resume.share ? "Manage link" : "Share"}
            </CardAction>
            <CardAction onClick={onDuplicate} icon={CopyIcon}>
              Duplicate
            </CardAction>
            <CardAction onClick={onRename} icon={TagIcon}>
              Rename
            </CardAction>
            <CardAction onClick={onDelete} icon={TrashIcon} destructive>
              Delete
            </CardAction>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold text-ink">
            {resume.name}
          </p>
          <p className="text-[13px] text-ink-soft">
            edited {formatRelative(resume.updatedAt)} · {resume.format}
            {/* A resume anyone with a link can read shouldn't be quiet about
                it — this is the only place the dashboard says so. */}
            {resume.share && (
              <span className="ml-1.5 inline-flex items-center gap-1 align-middle font-bold text-brand">
                <LinkIcon className="h-3.5 w-3.5" />
                Shared
              </span>
            )}
          </p>
        </div>

        {/* The same actions without needing a pointer — the only way in on a
            touch screen, and a shortcut everywhere else. */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/10 text-ink-soft transition hover:bg-black/5"
              aria-label="Resume options"
            >
              <DotsIcon className="h-[18px] w-[18px]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onClick={() => void download()}>
              <DownloadIcon />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onShare}>
              <LinkIcon />
              {resume.share ? "Manage link" : "Share"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onRename}>
              <TagIcon />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicate}>
              <CopyIcon />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} variant="destructive">
              <TrashIcon />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

const actionClass =
  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[14px] font-bold transition";

/** A row of the hover menu. Given an `href` it renders as a link — "Edit"
 *  navigates, so it should behave like one (middle click, open in new tab);
 *  the rest are buttons. */
/** Swaps in beside an action's label while its route loads. */
function ActionSpinner() {
  const { pending } = useLinkStatus();
  return pending ? <Spinner className="ml-auto h-3.5 w-3.5" /> : null;
}

/** The scrim over a card whose resume is being opened. */
function Opening() {
  const { pending } = useLinkStatus();
  if (!pending) return null;

  return (
    <span className="absolute inset-0 z-10 flex items-center justify-center gap-2 rounded-2xl bg-white/75 text-[13.5px] font-bold text-ink">
      <Spinner className="text-brand" />
      Opening…
    </span>
  );
}

function CardAction({
  href,
  icon: Icon,
  destructive = false,
  busy = false,
  onClick,
  children,
}: {
  href?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  destructive?: boolean;
  /** Set while the row's own work is in flight — it spins where the link rows
   *  spin, and stops taking presses. */
  busy?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  // Sitting straight on the scrim, so every row is white. Red type would go
  // muddy against black, so Delete says what it is by turning red on hover
  // instead of being red the whole time.
  const className = `${actionClass} text-white/90 hover:text-white ${
    destructive ? "hover:bg-danger" : "hover:bg-white/15"
  }`;
  const inner = (
    <>
      <Icon className="h-[17px] w-[17px]" />
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} prefetch className={className}>
        {inner}
        {/* Edit is the row people press; it needs the same "heard you" the
            card itself has. */}
        <ActionSpinner />
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={className}
    >
      {inner}
      {busy && <Spinner className="ml-auto h-3.5 w-3.5" />}
    </button>
  );
}
