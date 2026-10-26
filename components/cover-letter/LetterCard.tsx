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
      <div className="relative overflow-hidden rounded-none bg-white ring-1 ring-divider transition hover:ring-2 hover:ring-brand/60">
        <LetterThumb data={letter.data} />

        {/* Under the menu rather than around it — an anchor can't contain
            buttons. It still covers the whole card, so the dimmed area around
            the menu opens the letter too. */}
        <Link
          href={href}
          aria-label={`Open ${letter.name}`}
          className="absolute inset-0"
        />

      </div>

      <div className="mt-2.5 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14.5px] font-semibold text-ink">
            {letter.name}
          </p>
          <p className="truncate text-[12.5px] text-ink-faint">
            {/* Which job it's for is what tells two letters apart; the edit
                time only matters once you already know that. */}
            {company ? `${company} · ` : ""}
            {formatRelative(letter.updatedAt)}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-soft transition hover:bg-canvas hover:text-ink"
              aria-label="Cover letter options"
            >
              <DotsIcon className="h-[18px] w-[18px]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem asChild>
              <Link href={href}>
                <PencilIcon />
                Edit
              </Link>
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
