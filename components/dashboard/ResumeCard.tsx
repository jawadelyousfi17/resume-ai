"use client";

import Link, { useLinkStatus } from "next/link";
import { useMemo, useState } from "react";
import type { Resume } from "@/lib/types";
import { downloadResumePdf } from "@/lib/export";
import { formatRelative } from "@/lib/relative-time";
import { resumeStrength } from "@/lib/strength";
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
  const strength = useMemo(
    () => resumeStrength(resume.data).score,
    [resume.data],
  );
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
      {/* The page itself is the button. Hover only outlines it in the blue —
          every action lives in the ⋯ menu below, the same on touch and
          pointer. */}
      <div className="relative overflow-hidden rounded-none bg-white ring-1 ring-divider transition hover:ring-2 hover:ring-brand/60">
        <ResumeThumb data={resume.data} />

        {/* How finished it is, as a hairline along the foot of the page — a
            set of cards whose bars stop short is its own nudge. */}
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[3px] bg-canvas"
        >
          <span
            className="block h-full bg-brand"
            style={{ width: `${strength}%` }}
          />
        </span>

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

      </div>

      <div className="mt-2.5 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14.5px] font-semibold text-ink">
            {resume.name}
          </p>
          <p className="text-[12.5px] text-ink-faint">
            {formatRelative(resume.updatedAt)} · {strength}%
            {/* A resume anyone with a link can read shouldn't be quiet about
                it — this is the only place the dashboard says so. */}
            {resume.share && (
              <span className="ml-1.5 inline-flex items-center gap-1 align-middle font-semibold text-brand">
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
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-soft transition hover:bg-canvas hover:text-ink"
              aria-label="Resume options"
            >
              <DotsIcon className="h-[18px] w-[18px]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem asChild>
              <Link href={`/resume/${resume.id}`}>
                <PencilIcon />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => void download()}
              disabled={downloading}
            >
              <DownloadIcon />
              {downloading ? "Building…" : "Download"}
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

/** The scrim over a card whose resume is being opened. */
function Opening() {
  const { pending } = useLinkStatus();
  if (!pending) return null;

  return (
    <span className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-white/75 text-[13.5px] font-semibold text-ink">
      <Spinner className="text-brand" />
      Opening…
    </span>
  );
}
