"use client";

// The first resume out the door.
//
// Mounted once in the root layout and dormant until it hears the event, so
// every way of downloading a resume — the editor's top bar, the phone bar, the
// card menu on the dashboard — gets the same moment without any of them
// knowing about it. See lib/first-export.

import { useEffect, useState } from "react";
import Link from "next/link";

import { Confetti } from "@/components/ui/confetti";
import { DownloadIcon } from "@/components/ui/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { reachedMilestone } from "@/lib/feedback-nudge";
import { FIRST_EXPORT_EVENT } from "@/lib/first-export";

export function FirstExportCelebration() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(FIRST_EXPORT_EVENT, show);
    return () => window.removeEventListener(FIRST_EXPORT_EVENT, show);
  }, []);

  /**
   * Closing this is what asks how it went.
   *
   * The first download is the one worth asking about — they've just seen the
   * whole thing work — but not while the confetti is still falling. The
   * milestone is announced on the way out instead, and the nudge takes its own
   * beat after that, so the question lands on a quiet screen. Later downloads
   * announce themselves from lib/export, where there's no celebration in the
   * way. Whether anything is shown at all is the nudge's business: it may be
   * "not now" week, or they may have said never.
   */
  const close = () => {
    setOpen(false);
    reachedMilestone("export");
  };

  return (
    <>
      {open && <Confetti />}

      <Dialog open={open} onOpenChange={(next) => !next && close()}>
        <DialogContent className="overflow-hidden text-center sm:max-w-md">
          <div className="plan-shell -m-4 mb-0 px-6 pt-9 pb-8">
            <p className="text-[13px] font-bold tracking-[0.14em] text-white/70 uppercase">
              First resume
            </p>
            {/* An icon rather than an emoji: this one has to look the same on
                every machine, and emoji don't. */}
            <span
              aria-hidden="true"
              className="mx-auto mt-4 grid h-14 w-14 place-items-center rounded-2xl bg-white/12 text-white ring-1 ring-white/20"
            >
              <DownloadIcon className="h-7 w-7" />
            </span>
          </div>

          <div className="px-1 pt-5 pb-1">
            <DialogTitle className="font-heading text-[22px] leading-tight font-semibold tracking-[-0.03em] text-ink">
              It&rsquo;s out the door
            </DialogTitle>

            <DialogDescription className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
              Your resume is downloaded, watermark-free and ready to send. That
              was the hard part — the next one is a copy, tailored to whatever
              you&rsquo;re applying for.
            </DialogDescription>

            <p className="mt-4 text-[13.5px] text-ink-faint">
              Keep going. The people who get hired are the ones who send the
              second, and the tenth.
            </p>

            <button
              type="button"
              onClick={close}
              className="mt-6 h-12 w-full rounded-xl bg-navy text-[15px] font-bold text-white transition hover:opacity-90"
            >
              Back to it
            </button>

            <Link
              href="/jobs"
              onClick={close}
              className="mt-2 flex h-11 w-full items-center justify-center rounded-xl text-[14px] font-bold text-ink-soft transition hover:text-ink"
            >
              Track where you sent it
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
