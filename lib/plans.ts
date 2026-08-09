// The plans, the prices and the feature matrix.
//
// Prices are numbers rather than strings so the billing toggle can work them
// out: `monthly` is the month-to-month rate, `yearly` is what a month costs
// when the year is paid up front. Everything shown on a card or in the
// comparison table is derived from here, so the two can't disagree.

import { TEMPLATES } from "./templates";

export type BillingCycle = "monthly" | "yearly";

/** Matches the `PlanId` enum in prisma/schema.prisma, so a row read out of
 *  the database is already one of these. */
export type PlanId = "free" | "basic" | "ultimate";

/**
 * What a plan allows. Counts are `Infinity` when there's no cap.
 *
 * These are the numbers the server actually enforces (lib/subscription.ts),
 * and they're what the feature lists below are written from — so the page
 * can't promise something the server then refuses.
 */
export interface PlanLimits {
  /** How many resumes can exist at once. */
  resumes: number;
  /** How many cover letters can exist at once. Zero means the feature is off. */
  coverLetters: number;
  /** Writing and rewriting with the assistant. */
  ai: boolean;
  /** Reading an existing resume out of an uploaded file. */
  import: boolean;
  /** The scored review of the whole page. */
  review: boolean;
  /** Tailoring a copy to one posting. */
  tailor: boolean;
  /** Translating a resume into another language. */
  translate: boolean;
}

/** The in-or-out features, as opposed to the counted ones. */
export type PlanFeature = {
  [K in keyof PlanLimits]: PlanLimits[K] extends boolean ? K : never;
}[keyof PlanLimits];

/** Anything a plan can be short of: the switched features, and the counted
 *  ones for when the count runs out. */
export type PlanGate = PlanFeature | "resumes" | "coverLetters";

/** The counted gates, which are refused for a different reason — a full plan
 *  rather than one that never had it. */
export const isCounted = (gate: PlanGate): gate is "resumes" | "coverLetters" =>
  gate === "resumes" || gate === "coverLetters";

export interface Plan {
  id: PlanId;
  /** The plan's own name, for the places that name it in a sentence. */
  title: string;
  /** Two-line name: a muted qualifier over the plan itself. */
  qualifier: string;
  name: string;
  /** Dollars per month, billed month to month. Zero for the free plan. */
  monthly: number;
  /** Dollars per month with the year paid up front. */
  yearly: number;
  cta: string;
  href: string;
  featuresHeading: string;
  features: string[];
  limits: PlanLimits;
  /** The one plan carrying the flame badge. */
  featured?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "free",
    title: "Free",
    qualifier: "For one",
    name: "well-made resume",
    monthly: 0,
    yearly: 0,
    cta: "Start for free",
    href: "/dashboard",
    featuresHeading: "What you get",
    features: [
      "1 resume, yours for good",
      `All ${TEMPLATES.length} templates`,
      "Unlimited PDF downloads",
      "No watermark, ever",
      "Full layout and design control",
    ],
    limits: {
      resumes: 1,
      coverLetters: 0,
      ai: false,
      import: false,
      review: false,
      tailor: false,
      translate: false,
    },
  },
  {
    id: "basic",
    title: "Basic",
    qualifier: "For a real",
    name: "job search",
    monthly: 9,
    yearly: 3,
    cta: "Get Basic",
    href: "/dashboard",
    featuresHeading: "Everything in Free, plus",
    features: [
      "3 resumes at once",
      "AI writing and rewriting",
      "Import an existing resume",
      "AI review of the whole page",
      "Tailor a copy per role",
    ],
    limits: {
      resumes: 3,
      coverLetters: 0,
      ai: true,
      import: true,
      review: true,
      tailor: true,
      translate: false,
    },
  },
  {
    id: "ultimate",
    title: "Ultimate",
    qualifier: "For applying",
    name: "everywhere at once",
    monthly: 17,
    yearly: 5,
    cta: "Get Ultimate",
    href: "/dashboard",
    featuresHeading: "Everything in Basic, plus",
    features: [
      "Unlimited resumes",
      "Cover letters that match",
      "Translation into 40+ languages",
      "LaTeX source export",
      "Priority support",
    ],
    limits: {
      resumes: Infinity,
      coverLetters: Infinity,
      ai: true,
      import: true,
      review: true,
      tailor: true,
      translate: true,
    },
    featured: true,
  },
];

/**
 * Whether a paid plan can actually be bought.
 *
 * False and the cards still say what's coming and what it will cost, with the
 * button held shut rather than pointing somewhere that can't take the money.
 * While it's false the first hundred accounts are on Ultimate for a year
 * anyway — see lib/early-supporter.ts.
 *
 * Read from the environment rather than edited here, because the answer is a
 * property of the deployment and not of the code: the buttons should open on a
 * site whose Whop plans exist and stay shut on one where they don't, and both
 * are this repo. `NEXT_PUBLIC_` because the cards are a client component and
 * this decides what they draw. It says nothing secret — only whether the shop
 * is open, which anyone can see by looking at it.
 *
 * The plan ids themselves are server-side, in lib/whop.ts.
 */
export const CHECKOUT_ENABLED =
  process.env.NEXT_PUBLIC_CHECKOUT_ENABLED === "true";

/**
 * Which billing cycles can be bought, when checkout is open at all.
 *
 * A cycle can exist as a price without existing as something to buy: yearly is
 * the better deal and the reason the toggle is worth pressing, so it keeps
 * showing its figure and its saving while there's nothing behind it yet. The
 * button under it is the part that has to be honest.
 *
 * Unset means both, so this only ever has to be written down to restrict.
 * Public for the same reason `CHECKOUT_ENABLED` is: the cards are drawn on the
 * client, and which periods a shop sells is not a secret.
 */
export const SELLABLE_CYCLES: readonly BillingCycle[] = (
  process.env.NEXT_PUBLIC_CHECKOUT_CYCLES ?? "monthly,yearly"
)
  .split(",")
  .map((cycle) => cycle.trim())
  .filter((cycle): cycle is BillingCycle =>
    ["monthly", "yearly"].includes(cycle),
  );

/** Whether this plan, billed this way, is actually for sale. The free plan is
 *  never "bought", so it answers false and gets its own button. */
export const canBuy = (plan: Plan, cycle: BillingCycle): boolean =>
  CHECKOUT_ENABLED && plan.monthly > 0 && SELLABLE_CYCLES.includes(cycle);

/** The launch offer, which is over: the first hundred accounts were handed
 *  Ultimate for a year, no card involved. Nothing grants it any more — the
 *  numbers stay because the accounts that were given theirs still have it, and
 *  the thank-you still quotes both ("supporter no. 7 of the first 100"). */
export const EARLY_SUPPORTER = { places: 100, months: 12 } as const;

export const PLAN_LIMITS = Object.fromEntries(
  PLANS.map((plan) => [plan.id, plan.limits]),
) as Record<PlanId, PlanLimits>;

export const planById = (id: PlanId) => PLANS.find((p) => p.id === id)!;

/** The cheapest plan that includes something — what an upgrade prompt should
 *  name. Everything is on Ultimate, so there's always an answer. */
export const cheapestPlanWith = (gate: PlanGate) =>
  PLANS.find((plan) => plan.limits[gate])!;

/** The thing, said in a sentence: "AI writing is part of Basic." */
export const FEATURE_NAMES: Record<PlanGate, string> = {
  ai: "AI writing",
  resumes: "More resumes",
  import: "Importing an existing resume",
  review: "The AI review",
  tailor: "Tailoring to a posting",
  translate: "Translation",
  coverLetters: "Cover letters",
};

/** The next plan up on a counted limit — who to point at when the one they're
 *  on is full. Undefined when they're already on the roomiest. */
export const nextPlanFor = (gate: PlanGate, plan: PlanId) =>
  PLANS.find((p) => p.limits[gate] > PLAN_LIMITS[plan][gate]);

/** What a locked feature says when someone reaches it anyway. */
export function upgradeMessage(gate: PlanGate): string {
  const plan = cheapestPlanWith(gate);
  return `${FEATURE_NAMES[gate]} is part of ${plan.title} — $${plan.yearly}/month billed yearly. Upgrade on the pricing page to use it.`;
}

/** What an account at its ceiling is told when it tries to add another
 *  document. Names the next plan up rather than only saying no. */
export function limitMessage(
  plan: Plan,
  kind: "resumes" | "coverLetters",
): string {
  const noun = kind === "resumes" ? "resume" : "cover letter";
  const cap = plan.limits[kind];
  const next = PLANS.find((p) => p.limits[kind] > cap);
  const more = next
    ? ` Upgrade to ${next.title} for ${
        next.limits[kind] === Infinity
          ? `as many ${noun}s as you like`
          : `${next.limits[kind]} ${noun}s`
      }.`
    : "";

  if (cap === 0) {
    return `${noun[0].toUpperCase()}${noun.slice(1)}s aren't part of ${plan.title}.${more}`;
  }
  return `${plan.title} keeps ${cap} ${noun}${cap === 1 ? "" : "s"} at a time.${more}`;
}

/** What a plan costs on the selected cycle, ready to print. */
export function planPrice(plan: Plan, cycle: BillingCycle) {
  if (plan.monthly === 0) {
    return {
      amount: "$0",
      period: "/forever",
      note: "No card, no trial, no expiry",
    };
  }

  const perMonth = cycle === "yearly" ? plan.yearly : plan.monthly;
  return {
    amount: `$${perMonth}`,
    period: "/month",
    // The headline is always the monthly figure; what the year actually costs
    // goes underneath, so nobody has to multiply it themselves.
    note:
      cycle === "yearly"
        ? `$${plan.yearly * 12} billed yearly — save ${saving(plan)}%`
        : "Billed monthly, cancel any time",
  };
}

/** How much a year up front takes off, as a percentage. */
export const saving = (plan: Plan) =>
  Math.round((1 - plan.yearly / plan.monthly) * 100);

/** The best saving on offer, for the toggle's badge. */
export const bestSaving = Math.max(
  ...PLANS.filter((p) => p.monthly > 0).map(saving),
);

/** A row of the comparison table. A cell is either a line of text, or `true` /
 *  `false` for a plain in-or-out feature. Cells are in PLANS order. */
export interface ComparisonRow {
  feature: string;
  cells: (string | boolean)[];
}

export const COMPARISON: ComparisonRow[] = [
  {
    feature: "Resumes",
    cells: ["1", "3 at once", "Unlimited"],
  },
  {
    feature: "Templates",
    cells: [
      `All ${TEMPLATES.length}`,
      `All ${TEMPLATES.length}`,
      `All ${TEMPLATES.length}`,
    ],
  },
  {
    feature: "PDF downloads",
    cells: ["Unlimited", "Unlimited", "Unlimited"],
  },
  { feature: "Watermark", cells: ["None", "None", "None"] },
  {
    feature: "Layout and design control",
    cells: ["Full", "Full", "Full"],
  },
  {
    feature: "Languages",
    cells: ["10 to write in", "10 to write in", "10, plus translation"],
  },
  {
    feature: "AI writing and rewriting",
    cells: [false, true, true],
  },
  {
    feature: "Import an existing resume",
    cells: [false, "PDF, image or text", "PDF, image or text"],
  },
  {
    feature: "AI review of the whole page",
    cells: [false, true, true],
  },
  {
    feature: "Tailor a copy per role",
    cells: [false, true, true],
  },
  {
    feature: "Cover letters",
    cells: [false, false, "Matched to the resume"],
  },
  {
    feature: "Translation",
    cells: [false, false, "40+ languages"],
  },
  { feature: "LaTeX source export", cells: [false, false, true] },
  { feature: "Priority support", cells: [false, false, true] },
];
