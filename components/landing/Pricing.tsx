"use client";

// The plans, as a row of cards: a white panel floating on a lit gradient slab,
// with that plan's features listed on the slab underneath it.
//
// The data lives in lib/plans.ts and both the landing section and /pricing
// render from it, so the two can't drift apart. The billing toggle is the only
// state on the page: the headline figure is always what a month costs, and the
// year's total sits under it when the year is what you're buying.

import Link from "next/link";
import { useState } from "react";

import {
  PLANS,
  bestSaving,
  planPrice,
  type BillingCycle,
  type Plan,
} from "@/lib/plans";
import { cn } from "@/lib/utils";

import { h2, lede, sectionGap, shell } from "./ui";

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

/** Monthly or yearly, above the cards. */
export function BillingToggle({
  cycle,
  onChange,
  className,
}: {
  cycle: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Billing period"
      className={cn(
        "mx-auto inline-flex items-center gap-1 rounded-full bg-panel p-1.5 shadow-[var(--shadow-panel)] ring-1 ring-black/5",
        className,
      )}
    >
      {(["monthly", "yearly"] as const).map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={cycle === option}
          onClick={() => onChange(option)}
          className={cn(
            "inline-flex h-11 items-center gap-2 rounded-full px-6 text-[15px] font-bold transition",
            cycle === option
              ? "bg-navy text-white"
              : "text-ink-soft hover:text-ink",
          )}
        >
          {option === "monthly" ? "Monthly" : "Yearly"}
          {option === "yearly" && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11.5px] font-bold",
                cycle === "yearly"
                  ? "bg-white/15 text-white"
                  : "bg-brand-soft text-brand",
              )}
            >
              −{bestSaving}%
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function PlanCard({ plan, cycle }: { plan: Plan; cycle: BillingCycle }) {
  const price = planPrice(plan, cycle);

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
        <h3
          className={cn(
            "text-[26px] leading-[1.05] tracking-[-0.04em]",
            // Clear of the flame, which floats in the same corner.
            plan.featured && "pr-14",
          )}
        >
          <span className="block font-medium text-ink-faint">
            {plan.qualifier}
          </span>
          <span className="block font-semibold text-ink">{plan.name}</span>
        </h3>

        {plan.featured && <HotBadge />}

        <div className="mt-8 flex items-baseline gap-2 whitespace-nowrap">
          <span className="text-[44px] leading-[0.9] font-semibold tracking-[-0.055em]">
            {price.amount}
          </span>
          <span className="text-[14px] font-normal tracking-[-0.035em] text-ink-soft">
            {price.period}
          </span>
        </div>
        <p className="mt-2 text-[12.5px] text-ink-faint">{price.note}</p>

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

/** The toggle and the three plans. Used by the landing page and by /pricing. */
export function PlanGrid({ className }: { className?: string }) {
  // Yearly first: it's the price the headline copy quotes, and the monthly
  // figure is one click away for anyone who doesn't want to commit a year.
  const [cycle, setCycle] = useState<BillingCycle>("yearly");

  return (
    <div className={className}>
      <div className="text-center">
        <BillingToggle cycle={cycle} onChange={setCycle} />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} cycle={cycle} />
        ))}
      </div>
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
        free plan.{" "}
        <Link
          href="/pricing"
          className="font-bold text-brand underline underline-offset-4"
        >
          Compare the plans in full
        </Link>
        .
      </p>
    </section>
  );
}
