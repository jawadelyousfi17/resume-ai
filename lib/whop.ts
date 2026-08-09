import "server-only";

import Whop from "@whop/sdk";
import { Webhook } from "standardwebhooks";

import type { BillingCycle, PlanId } from "./plans";

// The billing provider, and the one place that knows which Whop plan is which
// of ours.
//
// Whop's ids live here rather than in lib/plans.ts because that module is
// imported by client components — the pricing cards read the prices out of it
// — and a plan id read from `process.env` in a client bundle is `undefined`,
// not a plan id. Everything on this side of the line is server-only, and the
// browser is never told which plan it's buying beyond our own name for it.
//
// The account, the key and the four plan ids all come from the Whop dashboard.
// Nothing here throws at import time: the app has to run with none of it set,
// which is what a deployment with checkout switched off looks like.

/**
 * The four plans that can be bought, keyed the way the app names them: a plan
 * and a billing cycle. Yearly is a separate Whop plan rather than a modifier,
 * because that's what it is on their side too.
 *
 * Each one is either a plan id (`plan_…`) or a checkout link copied out of the
 * dashboard, and which one it is decides how much the app can know about the
 * sale — see `checkoutTarget()` below.
 */
const PLAN_ENV: Record<`${PlanId}:${BillingCycle}`, string | undefined> = {
  "basic:monthly": process.env.WHOP_PLAN_BASIC_MONTHLY,
  "basic:yearly": process.env.WHOP_PLAN_BASIC_YEARLY,
  "ultimate:monthly": process.env.WHOP_PLAN_ULTIMATE_MONTHLY,
  "ultimate:yearly": process.env.WHOP_PLAN_ULTIMATE_YEARLY,
  // The free plan is the absence of a purchase, so it has no counterpart over
  // there. Listed so the record is total and a lookup can't fall off the end.
  "free:monthly": undefined,
  "free:yearly": undefined,
};

/**
 * Where a plan's button leads, and how much the app will know about the sale.
 *
 * Two shapes are allowed, because the dashboard hands out one and the API
 * wants the other:
 *
 *  - `plan` — a plan id. The app creates a checkout configuration per click
 *    and stamps it with the buyer's user id, so the webhook can put the plan
 *    on exactly the right account. This is the one to prefer.
 *  - `link` — a checkout link pasted from the dashboard. Nothing can be
 *    attached to it, so the purchase comes back carrying only what Whop knows
 *    about the buyer, and fulfilment falls back to matching their email. It
 *    works, and it's a link somebody can also reach without going through the
 *    app at all, which is why the webhook has to cope with it either way.
 *
 * Undefined when that combination isn't for sale: the free plan, or one whose
 * id hasn't been configured.
 */
export function checkoutTarget(
  plan: PlanId,
  cycle: BillingCycle,
): { kind: "plan"; planId: string } | { kind: "link"; url: string } | undefined {
  const value = PLAN_ENV[`${plan}:${cycle}`]?.trim();
  if (!value) return undefined;

  if (value.startsWith("plan_")) return { kind: "plan", planId: value };
  if (/^https?:\/\//.test(value)) return { kind: "link", url: value };

  // Neither, which means somebody has put something else in the variable.
  // Silently treating it as a plan id would send buyers to a 404.
  console.error(
    `WHOP_PLAN_… for ${plan} ${cycle} is neither a plan_ id nor a URL.`,
  );
  return undefined;
}

/**
 * The reverse: which of our plans a Whop plan id is.
 *
 * The webhook trusts this over the metadata it sent along with the checkout.
 * Metadata says what we asked for; the plan id on the membership says what
 * they actually bought, and when the two disagree the money is the truth.
 */
export function planFromWhopPlanId(
  id: string | null | undefined,
): { plan: PlanId; cycle: BillingCycle } | null {
  if (!id) return null;

  for (const [key, value] of Object.entries(PLAN_ENV)) {
    // Only the ones configured as ids can answer this. A checkout link is a
    // different kind of string that happens to live in the same variable, and
    // matching one here would be a coincidence rather than an answer.
    if (value?.trim().startsWith("plan_") && value.trim() === id) {
      const [plan, cycle] = key.split(":") as [PlanId, BillingCycle];
      return { plan, cycle };
    }
  }
  // Configured as a checkout link rather than a plan id, so there's nothing
  // here to match against. The webhook falls back to the metadata it was sent.
  return null;
}

/** The company the plans belong to, prefixed `biz_`. */
export const whopAccountId = process.env.WHOP_ACCOUNT_ID?.trim() || undefined;

/** Whether this deployment is wired up enough to sell this plan. Checked
 *  before a checkout starts so a half-filled `.env` fails at the button rather
 *  than at Whop's door, with an error naming what's missing. A pasted checkout
 *  link needs nothing but itself; a plan id needs a key to build a checkout
 *  with and an account to build it under. */
export function checkoutMisconfiguration(
  plan: PlanId,
  cycle: BillingCycle,
): string | null {
  const target = checkoutTarget(plan, cycle);
  if (!target) return `nothing configured for ${plan} ${cycle}`;
  if (target.kind === "link") return null;

  if (!process.env.WHOP_API_KEY?.trim()) return "WHOP_API_KEY is not set";
  if (!whopAccountId) return "WHOP_ACCOUNT_ID is not set";
  return null;
}

let client: Whop | undefined;

/** The API client, made on first use. Lazy so that importing this module —
 *  which the webhook route does on every request — doesn't require a key on a
 *  deployment that isn't selling anything. */
export function whop(): Whop {
  if (!client) {
    const apiKey = process.env.WHOP_API_KEY?.trim();
    if (!apiKey) {
      throw new Error("WHOP_API_KEY is not set — checkout can't be started.");
    }
    client = new Whop({ apiKey });
  }
  return client;
}

/** What `whop().webhooks.unwrap()` would have returned, had it worked. */
export type WhopEvent = ReturnType<Whop["webhooks"]["unwrap"]>;

/**
 * Checks a webhook's signature and returns the event inside it.
 *
 * This ought to be `whop().webhooks.unwrap(body, { headers, key })`, and it
 * isn't, because that throws on Whop's own secrets. Webhooks here follow the
 * Standard Webhooks spec, whose secrets are base64 behind a `whsec_` prefix;
 * Whop issues `ws_` followed by 64 hex characters, and the library strips only
 * the prefix it knows before base64-decoding — so the underscore it left in
 * place makes the decode fail before a signature is ever computed. Verified
 * against a real secret minted by the API, not guessed at.
 *
 * So the key is derived here. Which derivation Whop signs with isn't written
 * down anywhere I could find, so each plausible one is tried: it's the same
 * HMAC comparison every time, and an attacker without the secret can't produce
 * a signature that matches under any of them. The one that works is logged
 * once, so it can be cut down to that one when a real delivery has named it.
 */
export function unwrapWebhook(
  body: string,
  headers: Record<string, string>,
  secret: string,
): WhopEvent {
  const bare = secret.replace(/^ws_/, "");

  const candidates: Array<[string, Uint8Array]> = [
    ["raw secret", bytes(secret)],
    ["raw, prefix stripped", bytes(bare)],
    ["hex, prefix stripped", new Uint8Array(Buffer.from(bare, "hex"))],
    ["base64, prefix stripped", new Uint8Array(Buffer.from(bare, "base64"))],
  ];

  let last: unknown;
  for (const [name, key] of candidates) {
    try {
      const event = new Webhook(key, { format: "raw" }).verify(
        body,
        headers,
      ) as WhopEvent;
      if (!reported) {
        console.info(`Whop webhook signatures verify with the ${name}.`);
        reported = true;
      }
      return event;
    } catch (error) {
      last = error;
    }
  }

  throw last instanceof Error ? last : new Error("Signature did not verify");
}

let reported = false;

const bytes = (value: string) =>
  Uint8Array.from(value, (char) => char.charCodeAt(0));

/**
 * A time Whop sent us, as a Date.
 *
 * `renewal_period_end` is typed as a string and documented as a Unix
 * timestamp, which is two different things and only one of them parses. All
 * digits is seconds since the epoch; anything else is left to `Date` and
 * checked, because an Invalid Date written into `currentPeriodEnd` would read
 * as an expired plan and quietly take away what someone just paid for.
 */
export function whopTime(value: string | null | undefined): Date | null {
  if (!value) return null;

  const date = /^\d+$/.test(value)
    ? new Date(Number(value) * 1000)
    : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}
