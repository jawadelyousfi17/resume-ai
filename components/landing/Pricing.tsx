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
  CHECKOUT_ENABLED,
  EARLY_SUPPORTER,
  PLANS,
  bestSaving,
  planPrice,
  type BillingCycle,
  type Plan,
} from "@/lib/plans";
import { cn } from "@/lib/utils";
import { FlameMark } from "@/components/ui/plan-badge";

import { h2, lede, sectionGap, shell } from "./ui";

/** The flame, for the plan we'd point someone at. */
export function HotBadge() {
  return (
    <span
      className="absolute top-5 right-5 grid h-11 w-11 place-items-center rounded-xl border border-[#0393a6] bg-gradient-to-br from-[#58d7ed] via-[#17c2df] to-[#09b4d7] text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.75),0_2px_4px_rgba(0,0,0,0.09)]"
      aria-hidden="true"
    >
      <FlameMark className="h-6 w-6" />
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
  // The free plan is always available — it costs nothing to hand over. The
  // paid ones need a checkout that doesn't exist yet.
  const closed = !CHECKOUT_ENABLED && plan.monthly > 0;

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

        {closed ? (
          // Nothing to hand a card to yet. The button keeps its place and its
          // words so the card still reads as an offer, but it doesn't pretend
          // to be a way to buy anything.
          <button
            type="button"
            disabled
            title="Payments aren't open yet."
            className="plan-cta mt-6 flex h-12 w-full cursor-not-allowed items-center justify-center rounded-[10px] text-[14.5px] font-medium tracking-[-0.025em] opacity-55"
          >
            {plan.cta}
          </button>
        ) : (
          <Link
            href={plan.href}
            className="plan-cta mt-6 flex h-12 w-full items-center justify-center rounded-[10px] text-[14.5px] font-medium tracking-[-0.025em] transition hover:opacity-95"
          >
            {plan.cta}
          </Link>
        )}

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
export function PlanGrid({
  className,
  // On a page there's a whole screen to scroll and stacking is right. Inside a
  // dialog there isn't: three stacked cards put the third one two swipes below
  // the fold, where nobody goes. `swipe` lays them along instead, one card to a
  // screen with the next one peeking, so all three are a thumb apart.
  swipe = false,
}: {
  className?: string;
  swipe?: boolean;
}) {
  // Yearly first: it's the price the headline copy quotes, and the monthly
  // figure is one click away for anyone who doesn't want to commit a year.
  const [cycle, setCycle] = useState<BillingCycle>("yearly");

  return (
    // `min-w-0` matters inside the upgrade dialog: its content is a grid, and
    // a grid item defaults to min-width:auto, so a scrolling row of cards
    // would size the whole dialog to the row rather than scrolling inside it.
    <div className={cn("min-w-0", className)}>
      <div className="text-center">
        <BillingToggle cycle={cycle} onChange={setCycle} />
      </div>

      <div
        className={cn(
          "mt-8 grid min-w-0 gap-4 md:grid-cols-3 md:gap-5",
          swipe &&
            // `scroll-slim` takes the bar away: the peeking card is the
            // affordance, and a scrollbar under it is furniture nobody on a
            // phone needs. Bleeds to the edges so that card runs off the
            // screen rather than stopping short of it, which is what makes it
            // read as "there's more this way".
            "scroll-slim",
          swipe &&
            "max-md:-mx-5 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto max-md:px-5 max-md:pb-1",
        )}
      >
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              swipe && "max-md:w-[86%] max-md:shrink-0 max-md:snap-center",
            )}
          >
            <PlanCard plan={plan} cycle={cycle} />
          </div>
        ))}
      </div>

      {/* Said once under the grid rather than on each shut card, so the three
          cards keep the same shape and the reason doesn't arrive twice. */}
      {!CHECKOUT_ENABLED && (
        <p className="mt-6 text-center text-[13.5px] text-ink-soft">
          <span className="font-bold text-ink">Not on sale yet.</span> The first{" "}
          {EARLY_SUPPORTER.places}{" "}
          accounts get Ultimate free for a year — sign
          up and it&rsquo;s yours, no card involved.
        </p>
      )}
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
          Start free and without a card. Upgrade only when you want the AI to
          write with you, or when one resume stops being enough.
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
