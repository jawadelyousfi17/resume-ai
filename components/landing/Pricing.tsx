"use client";

// The plans, as a row of cards: the app's own panel, with the plan we
// recommend drawn on navy instead of on white.
//
// The data lives in lib/plans.ts and both the landing section and /pricing
// render from it, so the two can't drift apart. The billing toggle is the only
// state on the page: the headline figure is always what a month costs, and the
// year's total sits under it when the year is what you're buying.
//
// Nothing here is lit. The cards were a white panel floating on a stack of
// radial gradients in a fixed blue and cyan, with shadowed type on top — the
// one part of the site with lighting on it, and the one part that couldn't
// follow the palette. See components/ui/plan-surface.

import Link from "next/link";
import { useState } from "react";

import {
  CHECKOUT_ENABLED,
  PLANS,
  SELLABLE_CYCLES,
  bestSaving,
  canBuy,
  planPrice,
  type BillingCycle,
  type Plan,
} from "@/lib/plans";
import { cn } from "@/lib/utils";
import { segItem, segItemOn, segTrack } from "@/components/ui/segmented";
import { CheckoutButton } from "@/components/plan/CheckoutButton";
import { FlameMark } from "@/components/ui/plan-badge";
import {
  PlanTicks,
  planAction,
  planSkin,
  type PlanSkin,
} from "@/components/ui/plan-surface";

import { ArrowRight, eyebrow, h2, sectionGap, shell } from "./ui";

/** The mark on the plan we'd point someone at. Says what it means rather than
 *  only glowing: a flame on its own is decoration, a flame with a word is a
 *  recommendation. */
export function HotBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-bold tracking-[0.02em]",
        className,
      )}
    >
      <FlameMark className="h-3 w-3" />
      Most popular
    </span>
  );
}

/**
 * The landing page's dress for the same cards — .design/landing_page. Soft
 * panels instead of ringed white ones, the recommended plan on the page's
 * brown, pill actions, and the plan's qualifier as a pastel tag. Only the
 * landing asks for it; /pricing and the upgrade dialog keep the app's look.
 */
function editorialSkin(plan: Plan): PlanSkin {
  if (plan.featured) {
    return {
      dark: true,
      card: "bg-lp-brown text-white",
      title: "text-white",
      soft: "text-white/75",
      faint: "text-white/55",
      tick: "text-lp-pink",
      rule: "border-white/15",
      cta: "bg-white text-ink hover:bg-white",
      ctaQuiet: "bg-white text-ink",
      ctaShut: "bg-white/10 text-white/55 ring-1 ring-white/15 ring-inset",
      pill: "bg-lp-pink text-ink",
    };
  }
  return {
    dark: false,
    card: "bg-canvas",
    title: "text-ink",
    soft: "text-ink-soft",
    faint: "text-ink-faint",
    tick: "text-ink",
    rule: "border-divider",
    cta: "btn-fill",
    ctaQuiet: "btn-soft",
    ctaShut: "bg-white text-ink-faint ring-1 ring-divider ring-inset",
    pill: "bg-white text-ink",
  };
}

/** The qualifier's tag colour, plan by plan, in the page's pastels. */
const EDITORIAL_TAG: Record<string, string> = {
  free: "bg-lp-mint",
  basic: "bg-lp-blue",
};

/** Monthly or yearly, above the cards. */
export function BillingToggle({
  cycle,
  onChange,
  className,
  editorial = false,
}: {
  cycle: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
  className?: string;
  /** The landing page's pill: an outlined track, the choice in ink. */
  editorial?: boolean;
}) {
  return (
    // A track and a marker, like the rest of the app's segmented controls:
    // `rounded-xl` outside, one step down inside, and the same `font-bold` the
    // buttons use. The track is the field colour rather than a floating white
    // pill, so the control reads as an input on both the cream page and the
    // white one.
    <div
      role="radiogroup"
      aria-label="Billing period"
      className={cn(
        segTrack,
        "mx-auto inline-flex",
        editorial && "rounded-full shadow-none ring-ink",
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
            segItem,
            "h-10 flex-none px-6 text-[15px]",
            editorial && "rounded-full",
            cycle === option && segItemOn,
          )}
        >
          {option === "monthly" ? "Monthly" : "Yearly"}
          {option === "yearly" && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11.5px] font-bold",
                editorial
                  ? "bg-lp-mint text-ink"
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

export function PlanCard({
  plan,
  cycle,
  editorial = false,
}: {
  plan: Plan;
  cycle: BillingCycle;
  /** The landing page's dress — see `editorialSkin`. */
  editorial?: boolean;
}) {
  const price = planPrice(plan, cycle);
  const skin = editorial ? editorialSkin(plan) : planSkin(plan.id);
  // The free plan is always available — it costs nothing to hand over. A paid
  // one is shut either because nothing is on sale yet or because this period
  // isn't, and the two want different words: one is a shop that hasn't opened,
  // the other is a shop that has, with a way in one click away.
  const closed = plan.monthly > 0 && !canBuy(plan, cycle);
  const shutBecause = CHECKOUT_ENABLED
    ? `${cycle === "yearly" ? "Yearly" : "Monthly"} billing isn't open yet.`
    : "Payments aren't open yet.";
  // One card, not a card on a slab: the plan's price and what it includes are
  // the same offer, and there's no reason to draw a seam between them.
  return (
    <article
      className={cn(
        "flex h-full flex-col",
        editorial
          ? "rounded-[28px] px-7 pt-7 pb-8 lg:px-8"
          : "rounded-2xl px-6 pt-6 pb-7",
        skin.card,
      )}
    >
      {/* The mark sits in the flow above the name rather than floating in the
          corner, so the two cards without one keep the same rhythm — the row
          below it starts at the same height on all three. */}
      <div className="flex h-6 items-start">
        {plan.featured && <HotBadge className={skin.pill} />}
      </div>

      {editorial ? (
        <h3 className="mt-4">
          <span
            className={cn(
              "inline-block rounded-[3px] px-2 py-0.5 text-[11.5px] font-medium text-ink",
              plan.featured ? "bg-lp-pink" : (EDITORIAL_TAG[plan.id] ?? "bg-white"),
            )}
          >
            {plan.title}
          </span>
          {/* The qualifier and the name are one phrase — "For one well-made
              resume" — so here they're set as one. */}
          <span
            className={cn(
              "mt-3 block font-editorial text-[28px] leading-[1.1] font-normal tracking-[-0.02em]",
              skin.title,
            )}
          >
            {plan.qualifier} {plan.name}
          </span>
        </h3>
      ) : (
        <h3 className="mt-4 text-[24px] leading-[1.1] font-bold tracking-tight">
          <span className={cn("block text-[14px] font-bold", skin.faint)}>
            {plan.qualifier}
          </span>
          <span className={cn("mt-1 block", skin.title)}>{plan.name}</span>
        </h3>
      )}

      <div className="mt-7 flex items-baseline gap-1.5 whitespace-nowrap">
        <span
          className={cn(
            editorial
              ? "font-editorial text-[60px] leading-none font-normal tracking-[-0.03em]"
              : "text-[42px] leading-none font-bold tracking-tight",
            skin.title,
          )}
        >
          {price.amount}
        </span>
        <span
          className={cn(
            "text-[15px]",
            editorial ? "font-medium" : "font-bold",
            skin.soft,
          )}
        >
          {price.period}
        </span>
      </div>
      <p className={cn("mt-2 text-[13px]", skin.faint)}>{price.note}</p>

      {closed ? (
        // Nothing to hand a card to yet. The button keeps its place and its
        // words so the card still reads as an offer, but it doesn't pretend
        // to be a way to buy anything.
        <button
          type="button"
          disabled
          title={shutBecause}
          className={cn(planAction, skin.ctaShut, "cursor-not-allowed")}
        >
          {plan.cta}
        </button>
      ) : plan.monthly === 0 ? (
        // The free plan is the one nobody has to be sold: it gets the quiet
        // button, and it goes to the app rather than to a checkout.
        <Link href={plan.href} className={cn(planAction, skin.ctaQuiet)}>
          {plan.cta}
        </Link>
      ) : (
        // Whichever cycle the toggle is on is the one being bought — the
        // headline figure above and the checkout below can't disagree.
        <CheckoutButton
          plan={plan.id}
          cycle={cycle}
          className={cn(planAction, skin.cta, "disabled:opacity-70")}
        >
          {plan.cta}
        </CheckoutButton>
      )}

      {/* What's included, under a hairline rule rather than on a second
          surface. `h-full` on the card is what keeps the three the same
          height when one plan lists a longer feature than another. */}
      <div className={cn("mt-7 border-t pt-6", skin.rule)}>
        <p className={cn("text-[13px] font-bold", skin.faint)}>
          {plan.featuresHeading}
        </p>
        <PlanTicks features={plan.features} skin={skin} className="mt-4" />
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
  editorial = false,
}: {
  className?: string;
  swipe?: boolean;
  /** The landing page's dress, for the toggle and every card. */
  editorial?: boolean;
}) {
  // Yearly first: it's the price the headline copy quotes, and the monthly
  // figure is one click away for anyone who doesn't want to commit a year.
  //
  // Unless yearly is the one thing that can't be bought, in which case opening
  // on it would put a shut button in front of everybody who never touches the
  // toggle. While nothing at all is for sale it stays yearly — there's no way
  // in either way, and the better price is the one to be quoted.
  const [cycle, setCycle] = useState<BillingCycle>(
    !CHECKOUT_ENABLED || SELLABLE_CYCLES.includes("yearly")
      ? "yearly"
      : "monthly",
  );

  return (
    // `min-w-0` matters inside the upgrade dialog: its content is a grid, and
    // a grid item defaults to min-width:auto, so a scrolling row of cards
    // would size the whole dialog to the row rather than scrolling inside it.
    <div className={cn("min-w-0", className)}>
      <div className="text-center">
        <BillingToggle
          cycle={cycle}
          onChange={setCycle}
          editorial={editorial}
        />
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
            <PlanCard plan={plan} cycle={cycle} editorial={editorial} />
          </div>
        ))}
      </div>

      {/* Said once under the grid rather than on each shut card, so the three
          cards keep the same shape and the reason doesn't arrive twice. */}
      {/* On sale, but not by the year. Said here rather than on each card for
          the same reason the sentence below is: the two paid cards are shut
          for one shared reason, and hearing it twice doesn't make it truer. */}
      {CHECKOUT_ENABLED && !SELLABLE_CYCLES.includes(cycle) && (
        <p className="mt-6 text-center text-[13.5px] text-ink-soft">
          <span className="font-bold text-ink">
            Yearly isn&rsquo;t open yet.
          </span>{" "}
          The price is what it will be —{" "}
          <button
            type="button"
            onClick={() => setCycle("monthly")}
            className="font-bold text-brand underline underline-offset-4"
          >
            switch to monthly
          </button>{" "}
          to start today.
        </p>
      )}

      {!CHECKOUT_ENABLED && (
        <p className="mt-6 text-center text-[13.5px] text-ink-soft">
          <span className="font-bold text-ink">Not on sale yet.</span> The free
          plan is open in the meantime — one resume, every template, and no
          card.
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
        <span className={eyebrow}>{"// Pricing //"}</span>
        <h2 className={`${h2} mt-4`}>One resume free, forever</h2>
        <p className="mx-auto mt-4 max-w-[46ch] text-[16px] leading-[1.6] text-ink-soft">
          No card to start and no watermark on the way out. Upgrade when you
          want the AI.
        </p>
      </div>

      <PlanGrid editorial className="mt-10 lg:mt-12" />

      <p className="mt-8 text-center">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 border-b border-ink pb-0.5 text-[14px] font-medium text-ink transition hover:gap-3"
        >
          Compare plans
          <ArrowRight className="h-4 w-4" />
        </Link>
      </p>
    </section>
  );
}
