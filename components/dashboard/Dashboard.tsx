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
import { signOutAction } from "@/app/auth/actions";
import {
  BriefcaseIcon,
  CapIcon,
  FileTextIcon,
  MailIcon,
  PlusIcon,
  TagIcon,
  UserIcon,
} from "@/components/ui/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ResumeCard } from "@/components/dashboard/ResumeCard";
import { GuestImport } from "@/components/dashboard/GuestImport";
import { NewResumeDialog } from "@/components/dashboard/NewResumeDialog";
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

const NAV = [
  { label: "Resume", icon: FileTextIcon },
  { label: "Cover Letter", icon: MailIcon },
  { label: "Job Tracker", icon: BriefcaseIcon },
];
const NAV_FOOTER = [
  { label: "Plans & Pricing", icon: TagIcon },
  { label: "Student Benefits", icon: CapIcon },
];

export function Dashboard({
  resumes,
  account,
}: {
  /** Rendered on the server from this user's rows — no client fetch. */
  resumes: Resume[];
  /** Null for a guest, who gets an invitation to sign in where the account
   *  row would be. */
  account: { email: string; name: string | null } | null;
}) {
  const router = useRouter();
  const auth = useAuthDialog();
  const [pending, startTransition] = useTransition();
  // Set while a card's own action is in flight, so only that card dims.
  const [busyId, setBusyId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

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

  /** "Start from scratch" — a blank document, opened straight away. */
  const startFromScratch = () => {
    setAdding(false);

    if (guest) {
      createGuestResume();
      router.push(`/resume/${GUEST_RESUME_ID}`);
      return;
    }

    setBusyId(null);
    startTransition(async () => {
      const result = await createResumeAction();
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      router.push(`/resume/${result.id}`);
    });
  };

  /** A resume Claude just read out of an uploaded file. Guests never get
   *  here — importing needs an account. */
  const openImported = (imported: { name: string; data: ResumeData }) => {
    setAdding(false);

    if (guest) {
      replaceGuestResume(imported);
      router.push(`/resume/${GUEST_RESUME_ID}`);
      return;
    }

    startTransition(async () => {
      const result = await importResumeAction({
        name: imported.name,
        format: "A4",
        data: imported.data,
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      router.push(`/resume/${result.id}`);
    });
  };

  const handleRename = (resume: Resume) => {
    const name = window.prompt("Rename resume", resume.name);
    if (!name?.trim()) return;
    if (guest) {
      renameGuestResume(name.trim());
      return;
    }
    run(resume.id, () => renameResumeAction(resume.id, name.trim()));
  };

  const handleDuplicate = (resume: Resume) => {
    if (guest) {
      auth.open("signup");
      return;
    }
    run(resume.id, () => duplicateResumeAction(resume.id));
  };

  const handleDelete = (resume: Resume) => {
    if (!window.confirm(`Delete "${resume.name}"? This can't be undone.`)) {
      return;
    }
    if (guest) {
      deleteGuestResume();
      return;
    }
    run(resume.id, () => deleteResumeAction(resume.id));
  };

  return (
    <div className="flex min-h-dvh">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-black/5 px-4 py-6 md:flex">
        <div className="mb-8 flex items-center gap-2 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-lg font-black text-white">
            r
          </span>
          <span className="text-[18px] font-extrabold tracking-tight text-ink">
            resume<span className="text-brand">ai</span>
          </span>
        </div>

        <nav className="space-y-1">
          {NAV.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[15px] font-bold transition ${
                  i === 0
                    ? "bg-white text-ink shadow-sm"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto space-y-1 pt-6">
          {NAV_FOOTER.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[14px] font-semibold text-ink-soft transition hover:text-ink"
              >
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
              </button>
            );
          })}

          {account ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition hover:bg-black/[0.03]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-ink-soft">
                    <UserIcon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-semibold text-ink">
                      {account.name ?? "My account"}
                    </span>
                    <span className="block truncate text-[12px] text-ink-soft">
                      {account.email}
                    </span>
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <form action={signOutAction}>
                    <button type="submit" className="w-full text-left">
                      Sign out
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="mt-2 rounded-xl bg-white p-3 shadow-sm">
              <p className="text-[12.5px] leading-relaxed text-ink-soft">
                You&rsquo;re working as a guest. Sign in to keep this resume
                and build more.
              </p>
              <button
                type="button"
                onClick={() => auth.open("signin")}
                className="mt-2.5 flex w-full items-center justify-center rounded-lg bg-navy px-3 py-2 text-[14px] font-bold text-white transition hover:bg-navy/90"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => auth.open("signup")}
                className="mt-1.5 flex w-full items-center justify-center rounded-lg px-3 py-2 text-[14px] font-bold text-ink-soft transition hover:text-ink"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 px-6 py-8 sm:px-10 lg:px-14">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">
          My Resumes
        </h1>
        <p className="mt-1.5 text-[15px] text-ink-soft">
          {guest
            ? "Building as a guest — this resume is saved in this browser only. Sign in to keep it and build more."
            : "Build as many as you like — they save automatically to your account."}
        </p>
        {!guest && <GuestImport />}

        <NewResumeDialog
          open={adding}
          onOpenChange={setAdding}
          onScratch={startFromScratch}
          onImported={openImported}
          canImport={!guest}
          onImportBlocked={() => {
            setAdding(false);
            auth.open("signup");
          }}
        />

        <div className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-x-6 gap-y-8">
          <button
            type="button"
            onClick={handleNew}
            disabled={pending}
            title={
              atGuestLimit
                ? "Guests get one resume — sign in to build more."
                : undefined
            }
            className={`group flex aspect-[210/297] w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-ink-faint/40 text-ink-soft transition disabled:opacity-60 ${
              atGuestLimit
                ? "opacity-60"
                : "hover:border-purple/50 hover:text-purple"
            }`}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition group-hover:scale-105">
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
                onRename={() => handleRename(resume)}
                onDuplicate={() => handleDuplicate(resume)}
                onDelete={() => handleDelete(resume)}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
