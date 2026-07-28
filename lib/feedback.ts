import "server-only";

import { prisma } from "./prisma";

// Storing an answer. The faces themselves live in lib/feedback-ratings.ts,
// which the dialog reads too.

/** Stores one answer: a rating, and whatever else they wanted to say. */
export async function createFeedback(input: {
  userId: string | null;
  rating: number;
  message: string | null;
  path: string | null;
}): Promise<void> {
  await prisma.feedback.create({ data: input });
}

/** How many they've sent recently, so one person can't fill the table. */
export async function countRecentFeedback(
  userId: string,
  since: Date,
): Promise<number> {
  return prisma.feedback.count({
    where: { userId, createdAt: { gte: since } },
  });
}
