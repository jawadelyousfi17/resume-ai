"use client";

// The same card the resume grid uses — hover menu over the page, ⋯ dropdown
// underneath — against a letter.

import Link from "next/link";
import type { CoverLetter } from "@/lib/types";
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
import { LetterThumb } from "./LetterThumb";

export function LetterCard({
  letter,
  onRename,
  onDuplicate,
  onDelete,
}: {
  letter: CoverLetter;
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const href = `/cover-letters/${letter.id}`;
  const company = letter.data.recipient.company.trim();

  return (
    <div className="w-full">
      <div className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:ring-black/15">
        <LetterThumb data={letter.data} />

        {/* Under the menu rather than around it — an anchor can't contain
            buttons. It still covers the whole card, so the dimmed area around
            the menu opens the letter too. */}
        <Link
          href={href}
          aria-label={`Open ${letter.name}`}
          className="absolute inset-0"
        />

        <div className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-black/65 p-4 opacity-0 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100 md:flex">
          <div className="pointer-events-auto w-full max-w-[170px]">
            <CardAction href={href} icon={PencilIcon}>
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
            {letter.name}
          </p>
          <p className="truncate text-[13px] text-ink-soft">
            {/* Which job it's for is what tells two letters apart; the edit
                time only matters once you already know that. */}
            {company ? `${company} · ` : ""}
            edited {formatRelative(letter.updatedAt)}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/10 text-ink-soft transition hover:bg-black/5"
              aria-label="Cover letter options"
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
