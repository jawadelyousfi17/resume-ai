"use client";

// The thank-you an early supporter sees once: what they were given, how long
// they have it for, and some paper in the air about it.
//
// Shown from the dashboard the first time they land there after the grant.
// Closing it is what marks it seen — the server action runs on the way out,
// and the dialog doesn't wait for it, because a slow round trip shouldn't
// hold a celebration open.

import { useState, useTransition } from "react";

import { dismissCelebrationAction } from "@/app/actions/subscription";
import { Confetti } from "@/components/ui/confetti";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { planById } from "@/lib/plans";

export interface Celebration {
  /** Their place in the queue — "supporter #37". */
  number: number;
  /** How many places there were, so the number has something to sit against. */
  places: number;
  /** When the free year runs out, as epoch millis: a Date can't cross from a
   *  server component to a client one. */
  until: number;
}

export function SupporterCelebration({
  celebration,
  preview = false,
}: {
  celebration: Celebration;
  /** Standing preview at /celebration: show the same dialog, but don't tell
   *  the server it's been seen — there's nothing to mark. */
  preview?: boolean;
}) {
  const [open, setOpen] = useState(true);
  const [, startTransition] = useTransition();

  const close = () => {
    setOpen(false);
    if (preview) return;
    // Fire and forget: if this fails they see the thank-you once more, which
    // is a far better failure than a dialog that won't close.
    startTransition(() => void dismissCelebrationAction());
  };

  const until = new Date(celebration.until).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const ultimate = planById("ultimate");

  return (
    <>
      {open && <Confetti />}

      <Dialog open={open} onOpenChange={(next) => !next && close()}>
        <DialogContent className="overflow-hidden text-center sm:max-w-md">
          {/* A lit slab behind the number, the same one the featured plan card
              uses, so the gift looks like the plan it is. */}
          <div className="plan-shell -m-4 mb-0 px-6 pt-9 pb-8">
            <p className="text-[13px] font-bold tracking-[0.14em] text-white/70 uppercase">
              Early supporter
            </p>
            <p className="mt-2 text-[56px] leading-none font-semibold tracking-[-0.05em] text-white">
              #{celebration.number}
            </p>
            <p className="mt-2 text-[13.5px] text-white/75">
              of the first {celebration.places}
            </p>
          </div>

          <div className="px-1 pt-5 pb-1">
            <DialogTitle className="font-heading text-[22px] leading-tight font-semibold tracking-[-0.03em] text-ink">
              {ultimate.title} is yours, free for a year
            </DialogTitle>

            <DialogDescription className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
              Unlimited resumes, the AI writer and reviewer, tailoring, cover
              letters and translation — everything on the top plan, until{" "}
              <span className="font-bold text-ink">{until}</span>. No card, and
              nothing to cancel.
            </DialogDescription>

            <p className="mt-4 text-[13.5px] text-ink-faint">
              You backed this while it was still finding its feet. Thank you.
            </p>

            <button
              type="button"
              onClick={close}
              className="mt-6 h-12 w-full rounded-xl bg-navy text-[15px] font-bold text-white transition hover:opacity-90"
            >
              Start building
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
