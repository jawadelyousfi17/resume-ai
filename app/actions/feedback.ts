"use server";

import { requireUser } from "@/lib/auth";
import { countRecentFeedback, createFeedback } from "@/lib/feedback";
import { isRating } from "@/lib/feedback-ratings";
import { feedbackMessageSchema, feedbackPathSchema } from "@/lib/validation";
import type { ActionResult } from "./resumes";

/** Enough for anyone with a lot to say in one sitting, low enough that a
 *  script pointed at this action fills nothing up. */
const PER_HOUR = 10;

export async function sendFeedbackAction(input: {
  rating: number;
  message?: string;
  path?: string;
}): Promise<ActionResult> {
  const user = await requireUser();

  // The rating is the answer; without one there's nothing here to store.
  if (!isRating(input.rating)) {
    return { ok: false, error: "Pick how it's going first." };
  }

  // The note is optional, so an empty one is fine — but a long one isn't.
  const written = (input.message ?? "").trim();
  const message = written ? feedbackMessageSchema.safeParse(written) : null;
  if (message && !message.success) {
    return { ok: false, error: message.error.issues[0].message };
  }

  const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
  if ((await countRecentFeedback(user.id, hourAgo)) >= PER_HOUR) {
    return {
      ok: false,
      error:
        "That's a lot of notes in one hour — we've got them. Try again a little later.",
    };
  }

  const path = feedbackPathSchema.safeParse(input.path ?? "");

  await createFeedback({
    userId: user.id,
    rating: input.rating,
    message: message?.success ? message.data : null,
    path: path.success ? path.data : null,
  });

  return { ok: true };
}
