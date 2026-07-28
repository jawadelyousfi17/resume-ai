"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
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
import { usePlan } from "@/components/plan/PlanProvider";
import {
  ConfirmDeleteDialog,
  RenameDialog,
} from "@/components/ui/prompt-dialogs";
import { useAuthDialog } from "@/components/auth/AuthDialog";
import { reachedMilestone } from "@/lib/feedback-nudge";
import { setPendingTemplate } from "@/lib/pending-resume";
import type { Template } from "@/lib/templates";
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
  const plan = usePlan();

  // Someone keeping a second resume is someone using this for a real search —
  // a fairer moment to ask how it's going than the middle of writing one. The
  // nudge decides whether to say anything; this only says when.
  const many = !guest && resumes.length >= 2;
  useEffect(() => {
    if (many) reachedMilestone("second-resume");
  }, [many]);

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
    // How many they have is already on this page, so a full plan is answered
    // here — with the plans — rather than by a server action refusing after
    // the gallery has been opened and a template chosen.
    if (!guest && !plan.askRoomFor("resumes", list.length)) return;
    setAdding(true);
  };

  /**
   * The resume being written while its template is still being chosen.
   *
   * Picking a template used to start a round trip: write the row, wait, then
   * open it. The two don't depend on each other, so the write starts the
   * moment the gallery does and is long finished by the time anything is
   * picked — opening it is a page load and nothing else.
   *
   * Held as a promise rather than an id: whoever needs it awaits, and on the
   * one occasion that costs anything — picking a template within a few hundred
   * milliseconds of opening the gallery — it costs exactly what the old flow
   * cost every single time.
   */
  const starting = useRef<ReturnType<typeof createResumeAction> | null>(null);

  /** The gallery is open, so a resume is on its way. */
  const beginScratch = () => {
    if (guest || starting.current) return;
    starting.current = createResumeAction();
  };

  /**
   * Backing out of the gallery. The row exists by now, and a resume nobody
   * asked for on the dashboard is worse than the work of removing it.
   */
  const abandonScratch = () => {
    const pending = starting.current;
    starting.current = null;
    if (!pending) return;
    void (async () => {
      const result = await pending;
      if (result.ok) {
        await deleteResumeAction(result.id);
        router.refresh();
      }
    })();
  };

  /**
   * "Start from scratch", once a template has been chosen.
   *
   * The template can't travel with the row — it wasn't chosen when the row was
   * written — so it goes in the browser and the editor applies it as it opens.
   * See lib/pending-resume.
   *
   * The `setup` parameter is what the phone editor reads to start its guided
   * build; the desktop editor opens on the content, since the one question it
   * would have asked has just been answered.
   */
  const startFromScratch = (template: Template) => {
    setPendingTemplate(template.id);

    if (guest) {
      setAdding(false);
      const resume = createGuestResume();
      router.push(`/resume/${resume.id}?setup=new`);
      return;
    }

    const pending = starting.current;
    starting.current = null;
    setCreating(true);
    setBusyId(null);

    // Outside startTransition on purpose. React keeps the current screen up
    // for the length of a transition and suppresses Suspense fallbacks inside
    // it, so a router.push() made in one skips the target route's loading.tsx
    // entirely. Run plainly, the skeleton shows if there is anything to wait
    // for at all.
    void (async () => {
      const result = await (pending ?? createResumeAction());
      if (!result.ok) {
        setCreating(false);
        toast.error(result.error);
        return;
      }
      router.push(`/resume/${result.id}?setup=new`);
    })();
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

    // Same reason as above: inside a transition the editor's loading.tsx
    // would never show.
    void (async () => {
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
    })();
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
        onScratchOpen={beginScratch}
        onScratchCancel={abandonScratch}
        onImported={openImported}
        // The dialog turns the file away itself — plan or no account — and
        // puts the right card up. All that's left here is to get out of its
        // way, so the answer isn't behind this one.
        onImportBlocked={() => setAdding(false)}
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
