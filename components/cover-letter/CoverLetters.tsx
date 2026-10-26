"use client";

// The Cover Letter section of the dashboard: the letters this user has, and
// the way to start another.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
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
import { usePlan } from "@/components/plan/PlanProvider";
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

  // Cover letters are an Ultimate feature, so the question is asked at the
  // door — before the dialog that would collect a posting to write from.
  const plan = usePlan();
  const startLetter = () => plan.ask("coverLetters") && setAdding(true);

  const create = (letter: NewLetter) => {
    // The dialog stays open, saying what it's doing, until the letter exists
    // and its editor is on screen.
    setCreating(true);
    // The action runs outside startTransition on purpose. React keeps the
    // current screen up for the length of a transition and suppresses Suspense
    // fallbacks inside it, so a router.push() made in one skips the target
    // route's loading.tsx entirely — the old page just sits there until the
    // editor is ready. Run plainly, the push is an ordinary navigation and the
    // skeleton shows while the page loads.
    void (async () => {
      const result = await createCoverLetterAction(letter);
      if (!result.ok) {
        setCreating(false);
        toast.error(result.error);
        return;
      }
      router.push(`/cover-letters/${result.id}`);
    })();
  };

  return (
    <DashboardShell
      account={account}
      active="letters"
      header={{
        title: "Cover Letters",
        count: letters.length,
        action: (
          <button
            type="button"
            onClick={startLetter}
            disabled={pending}
            className="btn-fill flex h-11 items-center gap-2 px-5 text-[15px] font-medium transition disabled:opacity-60"
          >
            <PlusIcon className="h-[18px] w-[18px]" />
            New letter
          </button>
        ),
      }}
    >

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
        onClick={startLetter}
        disabled={pending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-[10px] border border-dashed border-field-border text-[15px] font-semibold text-ink-soft transition active:border-brand/50 active:text-brand disabled:opacity-60 md:hidden"
      >
        <PlusIcon className="h-5 w-5" />
        New cover letter
      </button>

      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6 md:mt-0 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:gap-x-6 md:gap-y-8">
        <button
          type="button"
          onClick={startLetter}
          disabled={pending}
          className="group hidden aspect-[210/297] w-full flex-col items-center justify-center gap-3 rounded-none border border-dashed border-field-border bg-canvas text-ink-soft transition hover:border-brand/50 hover:bg-brand-soft/40 hover:text-brand disabled:opacity-60 md:flex"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-panel ring-1 ring-divider transition group-hover:ring-brand/40">
            <PlusIcon className="h-5 w-5" />
          </span>
          <span className="text-[14px] font-semibold">New cover letter</span>
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
