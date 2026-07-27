"use client";

import Link from "next/link";
import type { Resume } from "@/lib/types";
import { formatRelative } from "@/lib/relative-time";
import {
  CopyIcon,
  DotsIcon,
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
import { ResumeThumb } from "./ResumeThumb";

export function ResumeCard({
  resume,
  onRename,
  onDuplicate,
  onDelete,
}: {
  resume: Resume;
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
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
          className="absolute inset-0"
        />

        {/* Hover only, so it never sits over the page on a touch screen where
            there's nothing to hover with — the ⋯ button below is that path.
            `pointer-events-none` on the scrim keeps the link underneath live. */}
        <div className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-black/65 p-4 opacity-0 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100 md:flex">
          <div className="pointer-events-auto w-full max-w-[170px]">
            <CardAction href={`/resume/${resume.id}`} icon={PencilIcon}>
              Edit
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
function CardAction({
  href,
  icon: Icon,
  destructive = false,
  onClick,
  children,
}: {
  href?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  destructive?: boolean;
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
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {inner}
    </button>
  );
}
