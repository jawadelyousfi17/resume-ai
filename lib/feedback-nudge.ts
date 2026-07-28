// When it's fair to ask someone what they think, and when it isn't.
//
// The rule: only after something has gone right — a resume downloaded, a
// second one started — and only if they haven't already answered, said not
// now, or said never. All of that lives in the browser: a nag is a property of
// this person on this machine, and it isn't worth a table or a round trip.
//
// Anything that counts as a good moment calls `reachedMilestone()`. What
// happens next is `<FeedbackNudge>`'s business, not the caller's.

const NEVER = "meniacv:feedback-never";
const SNOOZED_UNTIL = "meniacv:feedback-snoozed";

/** Fired when something worth being pleased about has just happened. */
export const MILESTONE_EVENT = "meniacv:milestone";

/** How long "not now" lasts. Long enough that it doesn't feel like a nag, and
 *  they'll have done a good deal more by the time it comes back. */
const SNOOZE_DAYS = 21;

/** What just went right. The nudge uses it for its opening line. */
export type Milestone = "export" | "second-resume";

export function reachedMilestone(milestone: Milestone) {
  window.dispatchEvent(
    new CustomEvent<Milestone>(MILESTONE_EVENT, { detail: milestone }),
  );
}

/** Whether asking now would be fair. Storage that throws answers no: silence
 *  is the safe side of this question. */
export function mayAsk(): boolean {
  try {
    if (localStorage.getItem(NEVER)) return false;
    const until = Number(localStorage.getItem(SNOOZED_UNTIL) ?? 0);
    return !until || Date.now() > until;
  } catch {
    return false;
  }
}

/** "Not now" — ask again in a few weeks. */
export function snoozeAsking() {
  write(SNOOZED_UNTIL, String(Date.now() + SNOOZE_DAYS * 86_400_000));
}

/** "Don't ask again", and what answering does too: someone who has written in
 *  has already told us what they think. */
export function stopAsking() {
  write(NEVER, "1");
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Private mode. The worst case is being asked again, which is the failure
    // we can live with.
  }
}
