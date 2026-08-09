import "server-only";

import { prisma } from "./prisma";
import { EARLY_SUPPORTER } from "./plans";

// The launch offer, after the fact.
//
// It's closed: nothing grants it any more, because checkout is open and a new
// account is sold a plan rather than handed one. What's left here is for the
// accounts that were given theirs while it ran — they keep it until the year
// is up, and they're still owed the thank-you if they haven't seen it.
//
// The grant itself lived here and was called from `syncUser()`. It's gone
// rather than switched off behind a flag: an offer that has ended is not a
// setting, and the rows it wrote are the only record that needs keeping.

/** What the early supporter got, if they haven't been shown it yet. Null for
 *  everyone else, and for anyone who has already seen the thank-you. */
export async function pendingCelebration(userId: string): Promise<{
  number: number;
  places: number;
  until: Date;
} | null> {
  const sub = await prisma.subscription.findUnique({ where: { userId } });
  if (!sub?.earlySupporter || sub.celebratedAt || !sub.currentPeriodEnd) {
    return null;
  }
  return {
    number: sub.supporterNumber ?? 1,
    places: EARLY_SUPPORTER.places,
    until: sub.currentPeriodEnd,
  };
}

/** Marks the thank-you as shown. Idempotent: a second call changes nothing,
 *  so a double-click can't reopen the question. */
export async function markCelebrated(userId: string): Promise<void> {
  await prisma.subscription.updateMany({
    where: { userId, celebratedAt: null },
    data: { celebratedAt: new Date() },
  });
}
