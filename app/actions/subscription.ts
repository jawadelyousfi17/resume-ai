"use server";

import { requireUser } from "@/lib/auth";
import { markCelebrated } from "@/lib/early-supporter";

/**
 * The early-supporter thank-you has been seen.
 *
 * Nothing comes back: the dialog is already closed by the time this lands, and
 * there's no failure the user could act on. Worst case the write is lost and
 * they're thanked twice.
 */
export async function dismissCelebrationAction(): Promise<void> {
  const user = await requireUser();
  await markCelebrated(user.id);
}
