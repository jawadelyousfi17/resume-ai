"use client";

// The Cover Letter section of the dashboard: the letters this user has, and
// the way to start another.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { CoverLetter, Resume } from "@/lib/types";
import {
  createCoverLetterAction,
  deleteCoverLetterAction,
  duplicateCoverLetterAction,
  renameCoverLetterAction,
} from "@/app/actions/cover-letters";
import { PlusIcon } from "@/components/ui/icons";
import {
  DashboardShell,
  type Account,
} from "@/components/dashboard/DashboardShell";
import {
  ConfirmDeleteDialog,
  RenameDialog,
} from "@/components/ui/prompt-dialogs";
import { LetterCard } from "./LetterCard";
import { NewLetterDialog, type NewLetter } from "./NewLetterDialog";

export function CoverLetters({
  letters,
  resumes,
  account,
}: {
  letters: CoverLetter[];
  /** What a letter can be drafted from. */
  resumes: Resume[];
  account: Account;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [creating, setCreating] = useState(false);
  const [renaming, setRenaming] = useState<CoverLetter | null>(null);
  const [deleting, setDeleting] = useState<CoverLetter | null>(null);

  const run = (
    id: string | null,
    action: () => Promise<{ ok: true } | { ok: false; error: string }>,
  ) => {
    setBusyId(id);
    startTransition(async () => {
      const result = await action();
      setBusyId(null);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      // The list is server-rendered, so ask for it again rather than patching
      // a local copy.
      router.refresh();
    });
  };

  const create = (letter: NewLetter) => {
    // The dialog stays open, saying what it's doing, until the letter exists
    // and its editor is on screen.
    setCreating(true);
    startTransition(async () => {
      const result = await createCoverLetterAction(letter);
      if (!result.ok) {
        setCreating(false);
        toast.error(result.error);
        return;
      }
      router.push(`/cover-letters/${result.id}`);
    });
  };

  return (
    <DashboardShell account={account} active="letters">
      {/* The bottom bar names the section on a phone, so this takes no room
          there — but a page still has to have an <h1>. */}
      <div className="max-sm:sr-only">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Cover Letters
        </h1>
        <p className="mt-1.5 text-[14px] text-ink-soft sm:text-[15px]">
          One letter per job. Paste the posting and it&rsquo;s written from what
          your resume already says.
        </p>
      </div>

      <NewLetterDialog
        open={adding}
        onOpenChange={setAdding}
        resumes={resumes}
        creating={creating}
        onCreate={create}
      />

      {/* A page-shaped placeholder is a lot of a phone screen to spend on one
          button, so there it collapses to a single row. */}
      <button
        type="button"
        onClick={() => setAdding(true)}
        disabled={pending}
        className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink-faint/40 text-[15px] font-bold text-ink-soft transition active:border-purple/50 disabled:opacity-60 md:hidden"
      >
        <PlusIcon className="h-5 w-5" />
        New cover letter
      </button>

      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6 sm:mt-8 md:grid-cols-[repeat(auto-fill,minmax(190px,1fr))] md:gap-x-6 md:gap-y-8">
        <button
          type="button"
          onClick={() => setAdding(true)}
          disabled={pending}
          className="group hidden aspect-[210/297] w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-ink-faint/40 text-ink-soft transition hover:border-purple/50 hover:text-purple disabled:opacity-60 md:flex"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white transition group-hover:scale-105">
            <PlusIcon className="h-6 w-6" />
          </span>
          <span className="text-[15px] font-bold">New cover letter</span>
        </button>

        {letters.map((letter) => (
          <div
            key={letter.id}
            className={busyId === letter.id ? "opacity-50" : undefined}
          >
            <LetterCard
              letter={letter}
              onRename={() => setRenaming(letter)}
              onDuplicate={() =>
                run(letter.id, () => duplicateCoverLetterAction(letter.id))
              }
              onDelete={() => setDeleting(letter)}
            />
          </div>
        ))}
      </div>

      <RenameDialog
        title="Rename cover letter"
        name={renaming?.name ?? null}
        onClose={() => setRenaming(null)}
        onRename={(name) => {
          const letter = renaming;
          setRenaming(null);
          if (letter)
            run(letter.id, () => renameCoverLetterAction(letter.id, name));
        }}
      />
      <ConfirmDeleteDialog
        title="Delete this cover letter?"
        name={deleting?.name ?? null}
        onClose={() => setDeleting(null)}
        onDelete={() => {
          const letter = deleting;
          setDeleting(null);
          if (letter) run(letter.id, () => deleteCoverLetterAction(letter.id));
        }}
      />
    </DashboardShell>
  );
}
