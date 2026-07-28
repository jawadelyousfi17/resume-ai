import "server-only";

import { cache } from "react";
import { prisma } from "./prisma";
import { getAuthUser } from "./auth";
import { countResumes } from "./resumes";
import { countCoverLetters } from "./cover-letters";
import {
  limitMessage,
  planById,
  PLAN_LIMITS,
  upgradeMessage,
  type PlanFeature,
  type PlanId,
  type PlanLimits,
} from "./plans";
import type { Subscription } from "@/generated/prisma/client";

// The one place that answers "is this account allowed to do that?".
//
// The plans and their numbers live in lib/plans.ts, shared with the pricing
// page; the `subscriptions` table records which plan a user is on. Nothing
// else should read either directly — server actions and route handlers ask
// for a denial and either pass it on or carry on.
//
// Every check is a positive grant: an account with no subscription row, an
// unrecognised plan, or an expired one comes out as free.

/** This user's subscription row, or null when they've never bought anything.
 *  Memoized per render pass — several guards in one request cost one query. */
export const getSubscription = cache(
  async (userId: string): Promise<Subscription | null> =>
    prisma.subscription.findUnique({ where: { userId } }),
);

/**
 * The plan actually in force, which isn't always the one in the row.
 *
 * A period end in the past means free whatever the status says: a webhook that
 * never arrived, or a card that stopped working, must not leave a paid plan
 * running forever. A cancellation keeps its plan until that date — they paid
 * for the month — and drops to free when there's no date to wait for.
 */
export function effectivePlan(sub: Subscription | null): PlanId {
  if (!sub) return "free";
  if (sub.currentPeriodEnd && sub.currentPeriodEnd.getTime() <= Date.now()) {
    return "free";
  }
  if (sub.status === "canceled" && !sub.currentPeriodEnd) return "free";
  return sub.plan;
}

export const planFor = cache(
  async (userId: string): Promise<PlanId> =>
    effectivePlan(await getSubscription(userId)),
);

export async function limitsFor(userId: string): Promise<PlanLimits> {
  return PLAN_LIMITS[await planFor(userId)];
}

/** A feature this plan doesn't include, said in words — or null to go ahead. */
export async function featureDenial(
  userId: string,
  feature: PlanFeature,
): Promise<string | null> {
  const limits = await limitsFor(userId);
  return limits[feature] ? null : upgradeMessage(feature);
}

/**
 * Whether there's room for one more document, in words — or null to go ahead.
 *
 * Counted against what exists now rather than a running total: deleting a
 * resume frees its slot, which is what "3 at once" says on the pricing page.
 * There is a race here — two creates landing together can both see room — and
 * it's deliberate. The alternative is a transaction around every write to hold
 * a ceiling nobody is trying to cheat, and the worst case is one resume over.
 */
export async function quotaDenial(
  userId: string,
  kind: "resumes" | "coverLetters",
): Promise<string | null> {
  const plan = planById(await planFor(userId));
  const cap = plan.limits[kind];

  if (cap === Infinity) return null;
  if (cap === 0) return limitMessage(plan, kind);

  const used =
    kind === "resumes"
      ? await countResumes(userId)
      : await countCoverLetters(userId);

  return used >= cap ? limitMessage(plan, kind) : null;
}

/**
 * The route-handler form of the two checks above: the response to send back,
 * or null when the caller may go ahead.
 *
 * 402 rather than 403 — nothing is wrong with the request or the session, the
 * account simply hasn't paid for this. The dialogs show `error` whatever the
 * status, so the sentence is what the user actually reads.
 */
export async function requireFeature(
  feature: PlanFeature,
): Promise<Response | null> {
  return guard((userId) => featureDenial(userId, feature));
}

export async function requireQuota(
  kind: "resumes" | "coverLetters",
): Promise<Response | null> {
  return guard((userId) => quotaDenial(userId, kind));
}

async function guard(
  check: (userId: string) => Promise<string | null>,
): Promise<Response | null> {
  const user = await getAuthUser();
  if (!user) return error("Not signed in", 401);

  const denial = await check(user.id);
  return denial ? error(denial, 402) : null;
}

function error(message: string, status: number) {
  return Response.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
