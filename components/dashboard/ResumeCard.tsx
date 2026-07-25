"use client";

import Link from "next/link";
import type { Resume } from "@/lib/types";
import { formatRelative } from "@/lib/relative-time";
import {
  CopyIcon,
  DotsIcon,
  PencilIcon,
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
      <Link
        href={`/resume/${resume.id}`}
        className="block overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-panel)] ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        <ResumeThumb data={resume.data} />
      </Link>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold text-ink">
            {resume.name}
          </p>
          <p className="text-[13px] text-ink-soft">
            edited {formatRelative(resume.updatedAt)} · {resume.format}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 text-ink-soft transition hover:bg-black/5"
              aria-label="Resume options"
            >
              <DotsIcon className="h-[18px] w-[18px]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onClick={onRename}>
              <PencilIcon />
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
