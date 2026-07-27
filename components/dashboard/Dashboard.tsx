"use client";

import { useState, useSyncExternalStore, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Resume, ResumeData } from "@/lib/types";
import {
  createResumeAction,
  deleteResumeAction,
  duplicateResumeAction,
  importResumeAction,
  renameResumeAction,
} from "@/app/actions/resumes";
import { PlusIcon } from "@/components/ui/icons";
import {
  DashboardShell,
  type Account,
} from "@/components/dashboard/DashboardShell";
import { ResumeCard } from "@/components/dashboard/ResumeCard";
import { GuestImport } from "@/components/dashboard/GuestImport";
import { NewResumeDialog } from "@/components/dashboard/NewResumeDialog";
import {
  ConfirmDeleteDialog,
  RenameDialog,
} from "@/components/ui/prompt-dialogs";
import { useAuthDialog } from "@/components/auth/AuthDialog";
import {
  createGuestResume,
  deleteGuestResume,
  GUEST_RESUME_ID,
  GUEST_RESUME_LIMIT,
  guestResumeSnapshot,
  guestServerSnapshot,
  onGuestResumeChange,
  renameGuestResume,
  replaceGuestResume,
} from "@/lib/guest";

export function Dashboard({
  resumes,
  account,
}: {
  /** Rendered on the server from this user's rows — no client fetch. */
  resumes: Resume[];
  /** Null for a guest, who gets an invitation to sign in where the account
   *  row would be. */
  account: Account;
}) {
  const router = useRouter();
  const auth = useAuthDialog();
  const [pending, startTransition] = useTransition();
  // Set while a card's own action is in flight, so only that card dims.
  const [busyId, setBusyId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  // True from the press until the new resume opens.
  const [creating, setCreating] = useState(false);
  // The resume each dialog is asking about, or null when it's closed.
  const [renaming, setRenaming] = useState<Resume | null>(null);
  const [deleting, setDeleting] = useState<Resume | null>(null);

  const guest = account === null;

  // A guest's one resume lives in this browser, so it isn't in what the server
  // rendered. Subscribing picks it up after hydration and again whenever it
  // changes — including from another tab.
  const guestResume = useSyncExternalStore(
    onGuestResumeChange,
    guestResumeSnapshot,
    guestServerSnapshot,
  );

  const list = guest ? (guestResume ? [guestResume] : []) : resumes;
  const atGuestLimit = guest && list.length >= GUEST_RESUME_LIMIT;

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
      // The list is server-rendered, so ask for it again rather than
      // patching a local copy.
      router.refresh();
    });
  };

  const handleNew = () => {
    if (guest && atGuestLimit) {
      auth.open("signup");
      return;
    }
    setAdding(true);
  };

  /** "Start from scratch" — a blank document, opened straight away. The
   *  `setup` parameter is what the phone editor reads to start its guided
   *  build; the desktop editor ignores it. */
  const startFromScratch = () => {
    if (guest) {
      setAdding(false);
      createGuestResume();
      router.push(`/resume/${GUEST_RESUME_ID}?setup=new`);
      return;
    }

    // The dialog stays open until the resume exists — a row that says
    // "Creating…" is the only sign anything is happening while the server
    // writes it and the editor loads.
    setCreating(true);
    setBusyId(null);
    startTransition(async () => {
      const result = await createResumeAction();
      if (!result.ok) {
        setCreating(false);
        toast.error(result.error);
        return;
      }
      router.push(`/resume/${result.id}?setup=new`);
    });
  };

  /** A resume the AI just read out of an uploaded file. Guests never get
   *  here — importing needs an account. */
  const openImported = (imported: { name: string; data: ResumeData }) => {
    setCreating(true);

    if (guest) {
      replaceGuestResume(imported);
      router.push(`/resume/${GUEST_RESUME_ID}?setup=import`);
      return;
    }

    startTransition(async () => {
      const result = await importResumeAction({
        name: imported.name,
        format: "A4",
        data: imported.data,
      });
      if (!result.ok) {
        setCreating(false);
        toast.error(result.error);
        return;
      }
      router.push(`/resume/${result.id}?setup=import`);
    });
  };

  const confirmRename = (resume: Resume, name: string) => {
    setRenaming(null);
    if (guest) {
      renameGuestResume(name);
      return;
    }
    run(resume.id, () => renameResumeAction(resume.id, name));
  };

  const handleDuplicate = (resume: Resume) => {
    if (guest) {
      auth.open("signup");
      return;
    }
    run(resume.id, () => duplicateResumeAction(resume.id));
  };

  const confirmDelete = (resume: Resume) => {
    setDeleting(null);
    if (guest) {
      deleteGuestResume();
      return;
    }
    run(resume.id, () => deleteResumeAction(resume.id));
  };

  return (
    <DashboardShell active="resumes" account={account}>
      {/* The bar along the bottom already says Resume, so on a phone this
          takes no room — but a page still has to have an <h1>. */}
      <div className="max-sm:sr-only">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          My Resumes
        </h1>
        <p className="mt-1.5 text-[14px] text-ink-soft sm:text-[15px]">
          {guest
            ? "Building as a guest — this resume is saved in this browser only. Sign in to keep it and build more."
            : "Build as many as you like — they save automatically to your account."}
        </p>
      </div>
      {!guest && <GuestImport />}

      <NewResumeDialog
        open={adding}
        onOpenChange={setAdding}
        creating={creating}
        onScratch={startFromScratch}
        onImported={openImported}
        canImport={!guest}
        onImportBlocked={() => {
          setAdding(false);
          auth.open("signup");
        }}
      />

      {/* A page-shaped placeholder is a lot of a phone screen to spend on
            one button, so there it collapses to a single row. */}
      <button
        type="button"
        onClick={handleNew}
        disabled={pending}
        className={`mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink-faint/40 text-[15px] font-bold text-ink-soft transition disabled:opacity-60 md:hidden ${
          atGuestLimit ? "opacity-60" : "active:border-purple/50"
        }`}
      >
        <PlusIcon className="h-5 w-5" />
        {atGuestLimit ? "Sign in for more" : "New resume"}
      </button>

      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6 sm:mt-8 md:grid-cols-[repeat(auto-fill,minmax(190px,1fr))] md:gap-x-6 md:gap-y-8">
        <button
          type="button"
          onClick={handleNew}
          disabled={pending}
          title={
            atGuestLimit
              ? "Guests get one resume — sign in to build more."
              : undefined
          }
          className={`group hidden aspect-[210/297] w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-ink-faint/40 text-ink-soft transition disabled:opacity-60 md:flex ${
            atGuestLimit
              ? "opacity-60"
              : "hover:border-purple/50 hover:text-purple"
          }`}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white transition group-hover:scale-105">
            <PlusIcon className="h-6 w-6" />
          </span>
          <span className="text-[15px] font-bold">
            {atGuestLimit ? "Sign in for more" : "New resume"}
          </span>
        </button>

        {list.map((resume) => (
          <div
            key={resume.id}
            className={busyId === resume.id ? "opacity-50" : undefined}
          >
            <ResumeCard
              resume={resume}
              onRename={() => setRenaming(resume)}
              onDuplicate={() => handleDuplicate(resume)}
              onDelete={() => setDeleting(resume)}
            />
          </div>
        ))}
      </div>

      <RenameDialog
        title="Rename resume"
        name={renaming?.name ?? null}
        onClose={() => setRenaming(null)}
        onRename={(name) => renaming && confirmRename(renaming, name)}
      />
      <ConfirmDeleteDialog
        title="Delete this resume?"
        name={deleting?.name ?? null}
        onClose={() => setDeleting(null)}
        onDelete={() => deleting && confirmDelete(deleting)}
      />
    </DashboardShell>
  );
}
