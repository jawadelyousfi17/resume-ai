import "server-only";

import { prisma } from "./prisma";
import { EARLY_SUPPORTER } from "./plans";
import type { User } from "@/generated/prisma/client";

// The launch offer, start to finish: who gets it, and whether they've been
// told yet.
//
// Its own module rather than part of lib/subscription.ts because `syncUser()`
// grants it, and lib/auth.ts importing the subscription module — which imports
// lib/auth.ts back for its route guards — would be a cycle. Nothing here needs
// anything but the database.

/**
 * Hands a new account its free year, if it got here early enough.
 *
 * Called from `syncUser()`, so every sign-in passes through it once. Position
 * comes from `createdAt` rather than a counter, which means it doesn't matter
 * when someone comes back: account 37 is account 37 forever, and once the
 * hundredth place is taken nobody after it qualifies.
 *
 * Never throws. A gift that fails to arrive is not a reason to fail a sign-in,
 * and two sign-ins racing each other are settled by the unique index on
 * `userId` — the loser catches the conflict and leaves the winner's row alone.
 */
export async function grantEarlySupporter(user: User): Promise<void> {
  try {
    if (await prisma.subscription.findUnique({ where: { userId: user.id } })) {
      return;
    }

    // Their place in the queue: everyone who signed up before them, plus them.
    const place = await prisma.user.count({
      where: { createdAt: { lte: user.createdAt } },
    });
    if (place > EARLY_SUPPORTER.places) return;

    // Counted from when they joined, not from whenever this ran — a sign-in
    // months later shouldn't quietly restart the year.
    const currentPeriodEnd = new Date(user.createdAt);
    currentPeriodEnd.setMonth(
      currentPeriodEnd.getMonth() + EARLY_SUPPORTER.months,
    );

    await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: "ultimate",
        cycle: "yearly",
        currentPeriodEnd,
        earlySupporter: true,
        supporterNumber: place,
      },
    });
  } catch {
    // Already granted by a request that arrived at the same moment, or the
    // database is having a bad day. Either way, the sign-in goes through.
  }
}

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
