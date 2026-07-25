"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Resume } from "@/lib/types";
import {
  createResume,
  deleteResume,
  duplicateResume,
  listResumes,
  renameResume,
} from "@/lib/storage";
import {
  BriefcaseIcon,
  CapIcon,
  FileTextIcon,
  MailIcon,
  PlusIcon,
  TagIcon,
  UserIcon,
} from "@/components/ui/icons";
import { ResumeCard } from "@/components/dashboard/ResumeCard";

const NAV = [
  { label: "Resume", icon: FileTextIcon },
  { label: "Cover Letter", icon: MailIcon },
  { label: "Job Tracker", icon: BriefcaseIcon },
];
const NAV_FOOTER = [
  { label: "Plans & Pricing", icon: TagIcon },
  { label: "Student Benefits", icon: CapIcon },
];

export default function Dashboard() {
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = () => setResumes(listResumes());

  useEffect(() => {
    refresh();
    setReady(true);
  }, []);

  const handleNew = () => {
    const count = listResumes().length;
    const resume = createResume(`Resume ${count + 1}`);
    router.push(`/resume/${resume.id}`);
  };

  const handleRename = (r: Resume) => {
    const name = window.prompt("Rename resume", r.name);
    if (name && name.trim()) {
      renameResume(r.id, name.trim());
      refresh();
    }
  };

  const handleDuplicate = (r: Resume) => {
    duplicateResume(r.id);
    refresh();
  };

  const handleDelete = (r: Resume) => {
    if (window.confirm(`Delete "${r.name}"? This can't be undone.`)) {
      deleteResume(r.id);
      refresh();
    }
  };

  return (
    <div className="flex min-h-dvh">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-black/5 bg-cream-dark px-4 py-6 md:flex">
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
          <div className="mt-2 flex items-center gap-2 px-3 py-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink-soft">
              <UserIcon className="h-4 w-4" />
            </span>
            <span className="text-[14px] font-semibold text-ink">
              My account
            </span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 px-6 py-8 sm:px-10 lg:px-14">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">
          My Resumes
        </h1>
        <p className="mt-1.5 text-[15px] text-ink-soft">
          Your first resume is free forever. Build as many as you like — they
          save automatically to this browser.
        </p>

        <div className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-x-6 gap-y-8">
          <button
            type="button"
            onClick={handleNew}
            className="group flex aspect-[210/297] w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-ink-faint/40 text-ink-soft transition hover:border-purple/50 hover:text-purple"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition group-hover:scale-105">
              <PlusIcon className="h-6 w-6" />
            </span>
            <span className="text-[15px] font-bold">New resume</span>
          </button>

          {ready &&
            resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onRename={() => handleRename(resume)}
                onDuplicate={() => handleDuplicate(resume)}
                onDelete={() => handleDelete(resume)}
              />
            ))}
        </div>
      </main>
    </div>
  );
}
