import type { BillingCycle, PlanId } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import {
  planFromWhopPlanId,
  unwrapWebhook,
  whop,
  whopTime,
  type WhopEvent,
} from "@/lib/whop";
import type { SubscriptionStatus, User } from "@/generated/prisma/client";

// Where a purchase becomes a plan.
//
// Everything the app charges for is decided by the `subscriptions` table
// (lib/subscription.ts), and this is the only thing that writes to it besides
// the launch offer and `npm run plan`. Whop is the source of truth for the
// money; this route's whole job is to keep our row saying what theirs says.
//
// Three events matter, and all three carry a full membership, which is the
// only object with everything on it — who, which plan, and until when:
//
//   membership.activated                     a plan starts
//   membership.cancel_at_period_end_changed  they cancelled, or changed back
//   membership.deactivated                   it's over
//
// `payment.succeeded` is handled too, but only as a renewal signal: a payment
// carries no period end, so the membership behind it is fetched to find out
// how far the clock has been pushed. Every other event is acknowledged and
// dropped — a 200 that means "heard you", not "did something".
//
// Nothing here trusts delivery. Whop can send these twice, out of order, or
// not at all, so every write is an upsert that can run again harmlessly, and
// `currentPeriodEnd` is only ever moved forward. The backstop for a webhook
// that never arrives is already in `effectivePlan()`: a period that has run
// out reads as free whatever this table says.

type WhopMembership = Extract<
  WhopEvent,
  { type: "membership.activated" }
>["data"];

export async function POST(request: Request): Promise<Response> {
  const secret = process.env.WHOP_WEBHOOK_SECRET?.trim();
  if (!secret) {
    console.error("WHOP_WEBHOOK_SECRET is not set — webhook refused.");
    return new Response("Not configured", { status: 503 });
  }

  // The raw text, before anything parses it: the signature is over the exact
  // bytes sent, so a re-serialised body would never verify.
  const body = await request.text();

  let event: WhopEvent;
  try {
    event = unwrapWebhook(body, Object.fromEntries(request.headers), secret);
  } catch (error) {
    // Either it isn't from Whop or the secret is wrong. Both are a 400: a
    // retry of the same request would fail the same way.
    console.error("Rejected a Whop webhook:", error);
    return new Response("Bad signature", { status: 400 });
  }

  try {
    await handle(event);
  } catch (error) {
    // Answer 200 anyway. Whop retries a failure, and a bug in here would
    // otherwise be replayed every few minutes without ever succeeding — the
    // event is already logged, and a wrong row is fixed with `npm run plan`.
    console.error(`Whop ${event.type} (${event.id}) could not be handled:`, error);
  }

  return new Response("OK", { status: 200 });
}

async function handle(event: WhopEvent): Promise<void> {
  switch (event.type) {
    case "membership.activated":
    case "membership.cancel_at_period_end_changed":
    case "membership.deactivated":
      await record(event.data);
      return;

    case "payment.succeeded": {
      // A renewal. The payment says money arrived but not what it bought a
      // month of, so the membership is read back for its new period end.
      const membershipId = event.data.membership?.id;
      if (!membershipId) return;

      const membership = await whop().memberships.retrieve(membershipId);
      await record(membership, event.data.metadata);
      return;
    }

    default:
      return;
  }
}

/**
 * Writes a membership into the `subscriptions` table.
 *
 * `fallback` is the metadata from a payment, used when the membership itself
 * has none — the same keys, since both inherit them from the checkout.
 */
async function record(
  membership: WhopMembership,
  fallback?: Record<string, unknown> | null,
): Promise<void> {
  // A membership Whop has drawn up but nobody has paid for yet. There's
  // nothing to grant, and writing the row now would hand out the plan.
  if (membership.status === "drafted") return;

  const metadata = { ...(fallback ?? {}), ...(membership.metadata ?? {}) };

  const user = await findUser(membership, metadata);
  if (!user) {
    // Someone paid and we can't tell who. Loud, because it's money in the
    // account with nobody getting anything for it, and the fix is by hand.
    console.error(
      `Whop membership ${membership.id} matches no account ` +
        `(metadata userId: ${String(metadata.userId ?? "none")}, ` +
        `email: ${membership.user?.email ?? "none"}).`,
    );
    return;
  }

  const bought = plan(membership, metadata);
  if (!bought) {
    console.error(
      `Whop membership ${membership.id} is for plan ` +
        `${membership.plan?.id ?? "unknown"}, which isn't one of ours.`,
    );
    return;
  }

  const existing = await prisma.subscription.findUnique({
    where: { userId: user.id },
  });

  // Only ever forward. An early supporter who later buys a month keeps the
  // free year they were given rather than having it cut short by it, and a
  // webhook that arrives out of order can't shorten a period already paid for.
  const currentPeriodEnd = later(
    existing?.currentPeriodEnd ?? null,
    whopTime(membership.renewal_period_end),
  );

  const fields = {
    plan: bought.plan,
    cycle: bought.cycle,
    status: status(membership.status),
    cancelAtPeriodEnd: membership.cancel_at_period_end,
    currentPeriodEnd,
    subscriptionId: membership.id,
    customerId: membership.user?.id ?? null,
  };

  // `earlySupporter` and `supporterNumber` are deliberately absent: they
  // record how someone arrived, not what they're paying, and buying a plan
  // shouldn't erase having been one of the first hundred.
  await prisma.subscription.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...fields },
    update: fields,
  });
}

/**
 * Whose purchase this is.
 *
 * The user id in the metadata is the real answer — the app put it there when
 * it built the checkout, so it can't be anyone else's. Email is the fallback,
 * for a purchase made through a checkout link pasted from the dashboard, which
 * carries nothing we chose. It's a weaker answer: someone can pay Whop with an
 * address they've never signed in here with, and then this finds nobody and
 * says so rather than guessing.
 */
async function findUser(
  membership: WhopMembership,
  metadata: Record<string, unknown>,
): Promise<User | null> {
  const userId = metadata.userId;
  if (typeof userId === "string" && userId) {
    const byId = await prisma.user.findUnique({ where: { id: userId } });
    if (byId) return byId;
  }

  const email = membership.user?.email?.trim().toLowerCase();
  if (!email) return null;

  return prisma.user.findUnique({ where: { email } });
}

/** Which of our plans was bought. The plan id on the membership wins: it's
 *  what the money actually went to, where the metadata is only what the app
 *  asked for when it sent them over. */
function plan(
  membership: WhopMembership,
  metadata: Record<string, unknown>,
): { plan: PlanId; cycle: BillingCycle } | null {
  const matched = planFromWhopPlanId(membership.plan?.id);
  if (matched) return matched;

  const asked = metadata.plan;
  const cycle = metadata.cycle;
  if (
    (asked === "basic" || asked === "ultimate") &&
    (cycle === "monthly" || cycle === "yearly")
  ) {
    return { plan: asked, cycle };
  }
  return null;
}

/**
 * Whop's lifecycle, in the four states this app cares about.
 *
 * `canceling` is a live membership that won't renew, which is our `active`
 * with `cancelAtPeriodEnd` set — the same thing said in two fields rather than
 * one. Anything finished is `canceled`, and `effectivePlan()` stops honouring
 * it once the period runs out.
 */
function status(state: WhopMembership["status"]): SubscriptionStatus {
  switch (state) {
    case "trialing":
      return "trialing";
    case "past_due":
    case "unresolved":
      return "past_due";
    case "active":
    case "canceling":
      return "active";
    default:
      return "canceled";
  }
}

function later(a: Date | null, b: Date | null): Date | null {
  if (!a) return b;
  if (!b) return a;
  return a > b ? a : b;
}
