"use client";

// Asking how it's going, at the one moment someone might want to say.
//
// It arrives after something has gone right rather than on a timer, it names
// the thing, and it asks the question itself — five faces, there and then. A
// dialog whose only button opens another dialog is a dialog that gets closed.
//
// It takes no for an answer twice over: closing it puts the question away for
// weeks, and the checkbox ends it for good. Mounted once in the root layout
// and asleep until a milestone fires — see lib/feedback-nudge.

import { useCallback, useEffect, useRef, useState } from "react";

import { FeedbackDialog } from "@/components/feedback/FeedbackDialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MILESTONE_EVENT,
  mayAsk,
  snoozeAsking,
  stopAsking,
  type Milestone,
} from "@/lib/feedback-nudge";

/** The line that opens, named after what they just did. Being specific is the
 *  difference between a question and an interruption. */
const OPENING: Record<Milestone, string> = {
  export: "You just took a resume away with you.",
  "second-resume": "That's your second resume on the go.",
};

export function FeedbackNudge() {
  const [asking, setAsking] = useState<Milestone | null>(null);
  // Ticked, every way out of this dialog means never — including the one that
  // would otherwise mean "in a few weeks".
  const [never, setNever] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const onMilestone = (event: Event) => {
      if (!mayAsk() || timer.current !== null) return;
      const milestone = (event as CustomEvent<Milestone>).detail;
      // A beat behind the thing they did, so it doesn't land on top of the
      // toast or the celebration that came with it.
      timer.current = window.setTimeout(() => {
        timer.current = null;
        setAsking(milestone);
      }, 1600);
    };

    window.addEventListener(MILESTONE_EVENT, onMilestone);
    return () => {
      window.removeEventListener(MILESTONE_EVENT, onMilestone);
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const dismiss = useCallback(() => {
    if (never) stopAsking();
    else snoozeAsking();
    setAsking(null);
  }, [never]);

  return (
    <FeedbackDialog
      open={asking !== null}
      // Escape and a click outside mean the same as the button: away for now,
      // or for good if the box is ticked. Neither is nothing.
      onOpenChange={(open) => !open && dismiss()}
      // Someone who has answered has told us what they think. Asking again
      // after that is the definition of a nag.
      onSent={stopAsking}
      title={`${asking ? OPENING[asking] : ""} How's it going?`}
      intro="One tap is a complete answer — the box is there if anything got in your way, or if there's something you wish this did."
      footer={
        <div className="space-y-1">
          <button
            type="button"
            onClick={dismiss}
            className="h-10 w-full rounded-lg text-[14px] font-bold text-ink-soft transition hover:text-ink"
          >
            Not now
          </button>

          <label className="mx-auto flex w-fit cursor-pointer items-center gap-2 text-[13.5px] text-ink-faint transition hover:text-ink-soft">
            <Checkbox
              checked={never}
              onCheckedChange={(value) => setNever(value === true)}
            />
            Don&rsquo;t ask me again
          </label>
        </div>
      }
    />
  );
}
