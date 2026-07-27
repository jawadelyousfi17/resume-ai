"use client";

// Rewriting a letter that already exists. Same call as the first draft, but it
// starts from what's on the page: the posting the letter was written against
// is already stored, and the current draft goes along so "make it shorter" has
// something to be shorter than.

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/fields";
import { useLetter } from "@/lib/letter-store";
import {
  DEFAULT_TONE,
  LETTER_TONES,
  applyDraft,
  type DraftedLetter,
  type LetterTone,
} from "@/lib/ai/cover-letter";
import type { Resume } from "@/lib/types";

export function RewriteDialog({
  open,
  onOpenChange,
  resume,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resume: Resume | null;
}) {
  const [busy, setBusy] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(next) => !busy && onOpenChange(next)}>
      <DialogContent fullScreen className="max-w-[560px] p-7 sm:max-w-[560px]">
        {/* Keyed on `open` so each visit starts fresh rather than showing the
            last attempt's error. */}
        <Body
          key={String(open)}
          resume={resume}
          busy={busy}
          setBusy={setBusy}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function Body({
  resume,
  busy,
  setBusy,
  onDone,
}: {
  resume: Resume | null;
  busy: boolean;
  setBusy: (busy: boolean) => void;
  onDone: () => void;
}) {
  const { data, replace } = useLetter();
  const [posting, setPosting] = useState(data.jobDescription);
  const [tone, setTone] = useState<LetterTone>(DEFAULT_TONE);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const ready = Boolean(resume) && posting.trim().length >= 40;

  const rewrite = async () => {
    if (!resume) return;
    setBusy(true);
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
          letter: data,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as
        (DraftedLetter & { error?: string }) | { error?: string };
      if (!res.ok || !("body" in payload)) {
        throw new Error(payload.error || `Server error ${res.status}`);
      }

      replace({ ...applyDraft(data, payload), jobDescription: posting.trim() });
      onDone();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't rewrite the letter",
      );
    } finally {
      setBusy(false);
    }
  };

  if (!resume) {
    return (
      <>
        <DialogTitle className="text-[21px] font-extrabold tracking-tight text-ink">
          No resume to write from
        </DialogTitle>
        <DialogDescription className="text-[14.5px] leading-relaxed text-ink-soft">
          This letter isn&rsquo;t linked to a resume any more — it was deleted,
          or the letter was started from a blank page. The assistant writes from
          what a resume says, so start a new letter from one to use it. What
          you&rsquo;ve written here is untouched.
        </DialogDescription>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onDone}
            className="rounded-lg bg-navy px-5 py-2.5 text-[14.5px] font-bold text-white transition hover:bg-navy/90"
          >
            Close
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <DialogTitle className="text-[21px] font-extrabold tracking-tight text-ink">
        Rewrite this letter
      </DialogTitle>
      <DialogDescription className="sr-only">
        Rewrites the body from your resume and the job posting.
      </DialogDescription>

      <div className="space-y-4">
        <label className="block">
          <Label>The job posting</Label>
          <Textarea
            value={posting}
            onChange={(e) => setPosting(e.target.value)}
            disabled={busy}
            placeholder="Paste the advert this letter is for."
            className="max-h-[24vh] min-h-[120px] text-[14.5px]"
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
                disabled={busy}
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
          <Label>What should change? (optional)</Label>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={busy}
            maxLength={600}
            placeholder="Shorter · Lead with the payments work · Less formal"
            className="text-[14.5px]"
          />
        </label>

        {error && (
          <p className="text-[13.5px] leading-relaxed font-medium text-danger">
            {error}
          </p>
        )}

        <p className="text-[12.5px] leading-relaxed text-ink-faint">
          This replaces the greeting, body and sign-off. Your header and the
          address block stay as they are.
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDone}
            disabled={busy}
            className="rounded-lg px-3.5 py-2.5 text-[14.5px] font-bold text-ink-soft transition hover:text-ink disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void rewrite()}
            disabled={!ready || busy}
            className="ml-auto rounded-lg bg-purple px-5 py-2.5 text-[14.5px] font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {busy ? "Writing…" : "Rewrite"}
          </button>
        </div>

        {busy && (
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
