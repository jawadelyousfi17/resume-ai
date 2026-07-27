"use client";

// Starting a cover letter: hand over a resume and the posting and let the
// assistant draft it, or open a blank page and write it yourself.

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/fields";
import { Spinner } from "@/components/ui/spinner";
import {
  DEFAULT_TONE,
  LETTER_TONES,
  applyDraft,
  type DraftedLetter,
  type LetterTone,
} from "@/lib/ai/cover-letter";
import { letterFromResume } from "@/lib/cover-letter";
import type { CoverLetterData, Resume } from "@/lib/types";

/** What the dialog hands back: a letter to store, plus the resume it came
 *  from so the row can be linked to it. */
export interface NewLetter {
  /** Omitted for a blank letter, which gets a numbered name from the server —
   *  a drafted one is named after the job it's for. */
  name?: string;
  resumeId: string | null;
  data?: CoverLetterData;
}

export function NewLetterDialog({
  open,
  onOpenChange,
  resumes,
  creating = false,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The resumes a letter can be drafted from. */
  resumes: Resume[];
  /** True while the letter is being written and its editor opened. */
  creating?: boolean;
  onCreate: (letter: NewLetter) => void;
}) {
  const [drafting, setDrafting] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !drafting && onOpenChange(next)}
    >
      <DialogContent fullScreen className="max-w-[560px] p-7 sm:max-w-[560px]">
        {/* Keyed on `open` so every visit starts at step one with empty
            fields, rather than wherever the last one was abandoned. */}
        <Body
          key={String(open)}
          resumes={resumes}
          drafting={drafting}
          setDrafting={setDrafting}
          creating={creating}
          onCreate={onCreate}
        />
      </DialogContent>
    </Dialog>
  );
}

function Body({
  resumes,
  drafting,
  setDrafting,
  creating,
  onCreate,
}: {
  resumes: Resume[];
  drafting: boolean;
  setDrafting: (busy: boolean) => void;
  /** True while the letter is being written and its editor opened. */
  creating?: boolean;
  onCreate: (letter: NewLetter) => void;
}) {
  const [step, setStep] = useState<"pick" | "draft">("pick");
  const [resumeId, setResumeId] = useState(resumes[0]?.id ?? "");
  const [posting, setPosting] = useState("");
  const [tone, setTone] = useState<LetterTone>(DEFAULT_TONE);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const resume = resumes.find((r) => r.id === resumeId) ?? null;
  const ready = Boolean(resume) && posting.trim().length >= 40;

  const draft = async () => {
    if (!resume) return;
    setDrafting(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: resume.data,
          jobDescription: posting,
          tone,
          instruction: note,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as
        (DraftedLetter & { error?: string }) | { error?: string };
      if (!res.ok || !("body" in payload)) {
        throw new Error(payload.error || `Server error ${res.status}`);
      }

      const letter = applyDraft(letterFromResume(resume), payload);
      // Kept with the letter so "Rewrite" later doesn't ask for it again.
      letter.jobDescription = posting.trim();

      onCreate({
        name: letterName(letter),
        resumeId: resume.id,
        data: letter,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't write the letter",
      );
    } finally {
      setDrafting(false);
    }
  };

  if (step === "pick") {
    const canDraft = resumes.length > 0;
    return (
      <>
        <DialogTitle className="text-[22px] font-extrabold tracking-tight text-ink">
          New cover letter
        </DialogTitle>
        <DialogDescription className="sr-only">
          Draft one from a resume and a job posting, or start from a blank page.
        </DialogDescription>

        <div className="mt-6 space-y-2.5">
          <button
            type="button"
            onClick={() => setStep("draft")}
            disabled={!canDraft}
            title={
              canDraft
                ? undefined
                : "Build a resume first — the letter is written from it."
            }
            className="flex w-full items-center gap-4 rounded-xl bg-navy px-6 py-5 text-left text-[17px] font-bold text-white transition hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <span className="text-[24px] leading-none">✨</span>
            Write it from a job posting
            <span className="ml-auto pl-3 text-[13.5px] font-medium text-white/55">
              {canDraft ? "uses your resume" : "needs a resume"}
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              onCreate({
                // Blank still borrows the header from the newest resume when
                // there is one — nobody wants to retype their own address.
                resumeId: resumes[0]?.id ?? null,
              })
            }
            disabled={creating}
            className="flex w-full items-center gap-4 rounded-xl border border-field-border px-6 py-5 text-left text-[17px] font-bold text-ink transition hover:border-ink/30 disabled:opacity-60"
          >
            {creating ? (
              <>
                <Spinner className="h-6 w-6 text-ink-soft" />
                Creating your letter…
              </>
            ) : (
              <>
                <span className="text-[24px] leading-none">📝</span>
                Start from scratch
              </>
            )}
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <DialogTitle className="text-[22px] font-extrabold tracking-tight text-ink">
        What are you applying for?
      </DialogTitle>
      <DialogDescription className="sr-only">
        Pick the resume to write from and paste the job posting.
      </DialogDescription>

      <div className="space-y-4">
        {resumes.length > 1 && (
          <label className="block">
            <Label>Write from</Label>
            <select
              value={resumeId}
              onChange={(e) => setResumeId(e.target.value)}
              disabled={drafting}
              className="h-auto w-full rounded-xl bg-field px-4 py-3 text-[15px] text-ink focus-visible:ring-2 focus-visible:ring-ink/80 focus-visible:outline-none"
            >
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="block">
          <Label>The job posting</Label>
          <Textarea
            value={posting}
            onChange={(e) => setPosting(e.target.value)}
            disabled={drafting}
            placeholder="Paste the whole advert — responsibilities, requirements, the lot. The more it says, the less generic the letter."
            className="max-h-[26vh] min-h-[130px] text-[14.5px]"
          />
        </label>

        <div>
          <Label>Tone</Label>
          <div className="flex flex-wrap gap-2">
            {LETTER_TONES.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setTone(option.id)}
                disabled={drafting}
                title={option.blurb}
                className={`rounded-lg px-3.5 py-2 text-[14px] font-bold transition disabled:opacity-50 ${
                  tone === option.id
                    ? "bg-brand-soft text-brand"
                    : "bg-field text-ink-soft hover:text-ink"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <Label>Anything to add? (optional)</Label>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={drafting}
            maxLength={600}
            placeholder="Keep it under 250 words · Mention I'm relocating to Berlin"
            className="text-[14.5px]"
          />
        </label>

        {error && (
          <p className="text-[13.5px] leading-relaxed font-medium text-danger">
            {error}
          </p>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStep("pick")}
            disabled={drafting}
            className="rounded-lg px-3.5 py-2.5 text-[14.5px] font-bold text-ink-soft transition hover:text-ink disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => void draft()}
            disabled={!ready || drafting}
            className="ml-auto rounded-lg bg-purple px-5 py-2.5 text-[14.5px] font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {drafting ? "Writing…" : "Write the letter"}
          </button>
        </div>

        {drafting && (
          <div
            className="ai-progress-track h-1.5 w-full"
            role="progressbar"
            aria-label="Writing"
          >
            <span />
          </div>
        )}
      </div>
    </>
  );
}

/** Names the letter after the job it's for, which is the only thing that tells
 *  two of them apart in a list. */
export function letterName(letter: CoverLetterData): string {
  const company = letter.recipient.company.trim();
  const role = letter.role.trim();
  if (company && role) return `${company} — ${role}`;
  return company || role || "Cover letter";
}
