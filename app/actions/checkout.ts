"use server";

import { z } from "zod";

import { getAuthUser } from "@/lib/auth";
import { PLANS, type BillingCycle, type PlanId } from "@/lib/plans";
import { siteOrigin } from "@/lib/site-url";
import { planFor } from "@/lib/subscription";
import {
  checkoutMisconfiguration,
  checkoutTarget,
  whop,
  whopAccountId,
} from "@/lib/whop";

// Starting a checkout: what happens between pressing "Get Ultimate" and
// arriving at Whop's payment page.
//
// The button doesn't know a Whop plan id and can't be told one — this action
// resolves it server-side from the plan and cycle it was given, which are
// checked against lib/plans.ts rather than trusted. So the worst a forged POST
// can do is start a checkout for a plan that is already on sale at the price
// already published.
//
// The purchase URL comes back to the caller instead of being redirected to.
// It's a different origin, and a returned URL the client navigates to is
// plainer than relying on how a cross-origin `redirect()` behaves inside a
// transition — the button knows it's leaving the site.

export type CheckoutResult =
  | { ok: true; url: string }
  /** `signIn` carries where to send someone who isn't signed in yet: metadata
   *  needs a user id to carry, so there's no checkout without an account. */
  | { ok: false; error: string; signIn?: string };

const paidPlan = z.enum(
  PLANS.filter((plan) => plan.monthly > 0).map((plan) => plan.id) as [
    PlanId,
    ...PlanId[],
  ],
);
const cycleSchema = z.enum(["monthly", "yearly"]);

export async function startCheckout(
  plan: PlanId,
  cycle: BillingCycle,
): Promise<CheckoutResult> {
  const parsedPlan = paidPlan.safeParse(plan);
  const parsedCycle = cycleSchema.safeParse(cycle);
  if (!parsedPlan.success || !parsedCycle.success) {
    return { ok: false, error: "That plan isn't for sale." };
  }

  const authUser = await getAuthUser();
  if (!authUser) {
    return {
      ok: false,
      error: "Sign in first, so the plan lands on your account.",
      signIn: "/login?next=/pricing",
    };
  }

  const missing = checkoutMisconfiguration(parsedPlan.data, parsedCycle.data);
  if (missing) {
    // Not the buyer's problem, and not something to spell out to them: the
    // sentence they read is the same one any other outage gets, and the reason
    // goes to the logs where whoever deploys this will find it.
    console.error(`Checkout is not configured: ${missing}.`);
    return { ok: false, error: "Payments are briefly unavailable." };
  }

  if ((await planFor(authUser.id)) === parsedPlan.data) {
    return { ok: false, error: `You're already on ${parsedPlan.data}.` };
  }

  const target = checkoutTarget(parsedPlan.data, parsedCycle.data)!;

  // A link out of the dashboard is already the answer, and there's nothing to
  // stamp it with. Whoever buys through it is matched back by their email when
  // the webhook lands.
  if (target.kind === "link") return { ok: true, url: target.url };

  // Whop refuses a redirect that isn't https, which `http://localhost:3000` is
  // not. Sent when there's somewhere real to come back to and left off when
  // there isn't, so a checkout can still be walked through locally — it ends
  // on Whop's own receipt instead of back on the dashboard.
  const origin = await siteOrigin();
  const redirect_url = origin.startsWith("https://")
    ? `${origin}/dashboard`
    : undefined;

  try {
    const configuration = await whop().checkoutConfigurations.create({
      account_id: whopAccountId,
      plan_id: target.planId,
      // Copied onto every payment and membership the checkout produces, which
      // is the whole reason this goes through the API rather than a link
      // pasted from the dashboard: it's how the webhook knows whose account
      // just got paid for. See app/api/whop/webhook/route.ts.
      metadata: {
        userId: authUser.id,
        plan: parsedPlan.data,
        cycle: parsedCycle.data,
      },
      redirect_url,
    });

    if (!configuration.purchase_url) {
      throw new Error(`no purchase_url on ${configuration.id}`);
    }

    return { ok: true, url: configuration.purchase_url };
  } catch (error) {
    console.error("Whop checkout could not be created:", error);
    return { ok: false, error: "Payments are briefly unavailable." };
  }
}
