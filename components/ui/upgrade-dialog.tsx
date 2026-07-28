"use client";

// What a locked feature says when someone reaches for it: the plans, all
// three, on the spot.
//
// Shown *before* the work starts, never after. Letting a file upload and a
// model read it only to answer "that's a paid feature" spends a minute of
// someone's time to say something that was known the moment they clicked. The
// server refuses the same things again (lib/subscription.ts) — this is the
// part that refuses in time to be useful.
//
// The grid is the pricing page's own, so there is one description of what a
// plan costs and includes, and this can't drift from it.

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PlanGrid } from "@/components/landing/Pricing";
import {
  cheapestPlanWith,
  PLAN_LIMITS,
  FEATURE_NAMES,
  isCounted,
  nextPlanFor,
  planById,
  type PlanGate,
  type PlanId,
} from "@/lib/plans";

export function UpgradeDialog({
  gate,
  current,
  onOpenChange,
}: {
  /** What they reached for, or null when nothing is being refused. */
  gate: PlanGate | null;
  /** The plan they're on, which decides whether this is a thing they never
   *  had or a thing they've used up. */
  current: PlanId | null;
  onOpenChange: (open: boolean) => void;
}) {
  // Falls back to a plan rather than to nothing: the card animates out after
  // `gate` is cleared, and half a heading on the way off screen looks broken.
  const plan = cheapestPlanWith(gate ?? "ai");

  return (
    <Dialog open={gate !== null} onOpenChange={onOpenChange}>
      <DialogContent
        // A sheet on a phone, a wide panel from `sm` up. The desktop sizing is
        // scoped rather than global so it doesn't fight `fullScreen`'s own
        // rules underneath it — a dialog with two opinions about its height is
        // how you end up with content stranded below the fold.
        fullScreen
        // `content-start` undoes the full-screen sheet's vertical centring:
        // this content is taller than a phone, and centring something taller
        // than the screen pushes its heading up behind the Back button.
        className="max-sm:content-start sm:max-h-[92dvh] sm:max-w-[1000px] sm:overflow-y-auto sm:p-8"
        // The cards say what each plan is for; a paragraph above them saying
        // it again in general terms is a line to scroll past, not to read.
        aria-describedby={undefined}
      >
        <div className="text-center">
          <DialogTitle className="font-heading text-[21px] leading-tight font-semibold tracking-[-0.03em] text-ink sm:text-[28px]">
            {heading(gate, current, plan.title)}
          </DialogTitle>
        </div>

        {/* Swipeable on a phone: one card to a screen beats three stacked. */}
        <PlanGrid swipe className="mt-6 sm:mt-7" />
      </DialogContent>
    </Dialog>
  );
}

/**
 * The one line at the top, which depends on why they're here.
 *
 * Two different refusals wear the same card: something this plan never had
 * ("Translation comes with Ultimate"), and something it had and they've used
 * up ("You've filled every resume on Free"). Saying the first when it's really
 * the second reads as though the resumes they already made don't exist.
 */
function heading(
  gate: PlanGate | null,
  current: PlanId | null,
  cheapest: string,
): string {
  if (!gate) return "";

  if (isCounted(gate) && current && PLAN_LIMITS[current][gate] > 0) {
    const noun = gate === "resumes" ? "resume" : "cover letter";
    const next = nextPlanFor(gate, current);
    const room = next ? ` — ${next.title} keeps more` : "";
    return `You've filled every ${noun} on ${planById(current).title}${room}`;
  }

  return `${FEATURE_NAMES[gate]} comes with ${cheapest}`;
}
