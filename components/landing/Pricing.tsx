// The plans, as a row of cards: a white panel floating on a lit gradient slab,
// with that plan's features listed on the slab underneath it.
//
// The data lives here and both the landing section and /pricing render from it,
// so the two can't drift apart. All server-rendered — the monthly and yearly
// prices are both on the card rather than behind a toggle, which keeps the page
// free of JavaScript and means someone scanning it sees the whole offer at once.

import Link from "next/link";

import { TEMPLATES } from "@/lib/templates";
import { cn } from "@/lib/utils";

import { h2, lede, sectionGap, shell } from "./ui";

export interface Plan {
  id: string;
  /** The line above the name, in the mockup's "PLAN ~ promise" form. */
  kicker: string;
  /** Two-line name: a muted qualifier over the plan itself. */
  qualifier: string;
  name: string;
  /** Headline price, in whole dollars per month. */
  price: string;
  period: string;
  /** The monthly-billing alternative, or a note for the free plan. */
  note: string;
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
    kicker: "FREE ~ Everything you need to apply",
    qualifier: "For one",
    name: "well-made resume",
    price: "$0",
    period: "/forever",
    note: "No card, no trial, no expiry",
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
    kicker: "BASIC ~ Writing help where it counts",
    qualifier: "For a real",
    name: "job search",
    price: "$3",
    period: "/month, billed yearly",
    note: "or $9 month-to-month",
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
    kicker: "ULTIMATE ~ Nothing held back",
    qualifier: "For applying",
    name: "everywhere at once",
    price: "$5",
    period: "/month, billed yearly",
    note: "or $17 month-to-month",
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

/** The flame, for the plan we'd point someone at. */
function HotBadge() {
  return (
    <span
      className="absolute top-5 right-5 grid h-11 w-11 place-items-center rounded-xl border border-[#0393a6] bg-gradient-to-br from-[#58d7ed] via-[#17c2df] to-[#09b4d7] shadow-[inset_0_1px_2px_rgba(255,255,255,0.75),0_2px_4px_rgba(0,0,0,0.09)]"
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 48" className="h-6 w-6">
        <path
          fill="#fff"
          d="M27.7 4.8c1.6 7.3-4.4 10.2-7.4 14.8-2.4 3.7-2.8 7.9-.8 11.3-2.7-1.6-4.4-4.4-4.4-7.7-5.4 4.1-7.9 9.5-6 15.2C11.1 44.2 16.5 47 23 47c8.7 0 15.8-6.6 15.8-15.4 0-8.4-5.4-14.9-11.1-26.8Zm-3.6 35.8c-4.1 0-7.4-2.8-7.4-6.7 0-2.9 1.8-5.5 4.8-7.9-.2 3.2 1.7 5.2 3.7 6.5 2.2-2.4 3.6-5.3 3.8-8.8 3.5 4.2 5.1 7.4 5.1 10.4 0 3.8-3.7 6.5-10 6.5Z"
        />
      </svg>
    </span>
  );
}

export function PlanCard({ plan }: { plan: Plan }) {
  return (
    <article
      className={cn(
        // The ring is invisible on cream and does the separating on the dark
        // pricing page, so one card works on both.
        "flex flex-col overflow-hidden rounded-[20px] p-1.5 ring-1 ring-white/10",
        plan.featured ? "plan-shell" : "plan-shell-quiet",
      )}
    >
      {/* The white card */}
      <div className="relative rounded-[15px] bg-white px-6 pt-7 pb-6 text-ink shadow-[0_0_0_1px_rgba(0,0,0,0.03)]">
        <p className="max-w-[24ch] text-[13px] leading-snug font-medium tracking-tight text-ink-soft">
          {plan.kicker}
        </p>

        <h3 className="mt-4 text-[26px] leading-[1.05] tracking-[-0.04em]">
          <span className="block font-medium text-ink-faint">
            {plan.qualifier}
          </span>
          <span className="block font-semibold text-ink">{plan.name}</span>
        </h3>

        {plan.featured && <HotBadge />}

        <div className="mt-8 flex items-baseline gap-2 whitespace-nowrap">
          <span className="text-[44px] leading-[0.9] font-semibold tracking-[-0.055em]">
            {plan.price}
          </span>
          <span className="text-[14px] font-normal tracking-[-0.035em] text-ink-soft">
            {plan.period}
          </span>
        </div>
        <p className="mt-2 text-[12.5px] text-ink-faint">{plan.note}</p>

        <Link
          href={plan.href}
          className="plan-cta mt-6 flex h-12 w-full items-center justify-center rounded-[10px] text-[14.5px] font-medium tracking-[-0.025em] transition hover:opacity-95"
        >
          {plan.cta}
        </Link>
      </div>

      {/* The features, on the slab */}
      <div className="px-5 pt-6 pb-5 text-white">
        <p className="text-[14px] leading-none font-normal tracking-[-0.02em] text-white/85 [text-shadow:0_1px_2px_rgba(1,4,36,0.38)]">
          {plan.featuresHeading}
        </p>
        <ul className="mt-4 grid gap-3.5">
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2.5 text-[14px] leading-[1.15] tracking-[-0.025em] [text-shadow:0_1px_2px_rgba(0,4,40,0.4)]"
            >
              <span className="plan-check" aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/** The three plans, side by side. Used by the landing page and by /pricing. */
export function PlanGrid({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-3 md:gap-5", className)}>
      {PLANS.map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}

/** The landing page's pricing section. */
export function Pricing() {
  return (
    <section id="pricing" className={`${shell} ${sectionGap}`}>
      <div className="text-center">
        <h2 className={h2}>Simple pricing. One free resume, forever.</h2>
        <p className={`${lede} mx-auto`}>
          Start without an account and without a card. Upgrade only when you
          want the AI to write with you, or when one resume stops being enough.
        </p>
      </div>

      <PlanGrid className="mt-12 lg:mt-14" />

      <p className="mt-8 text-center text-[13.5px] text-ink-soft">
        Prices in USD. Cancel any time — your resumes stay downloadable on the
        free plan.
      </p>
    </section>
  );
}
