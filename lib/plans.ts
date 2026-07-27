// The plans, the prices and the feature matrix.
//
// Prices are numbers rather than strings so the billing toggle can work them
// out: `monthly` is the month-to-month rate, `yearly` is what a month costs
// when the year is paid up front. Everything shown on a card or in the
// comparison table is derived from here, so the two can't disagree.

import { TEMPLATES } from "./templates";

export type BillingCycle = "monthly" | "yearly";

export interface Plan {
  id: string;
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
  /** The one plan carrying the flame badge. */
  featured?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "free",
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
  },
  {
    id: "basic",
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
  },
  {
    id: "ultimate",
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
    featured: true,
  },
];

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
