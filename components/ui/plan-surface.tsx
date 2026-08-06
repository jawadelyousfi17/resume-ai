// What a plan looks like, in one place.
//
// The pricing cards, the badge beside someone's name and the plan card on the
// account page all draw the same object, so the recipe lives here rather than
// three times over. It is the app's own card recipe — panel, hairline ring,
// the soft panel shadow — with one step of hierarchy on top: Free states
// itself, Basic wears the brand, and the plan we recommend is a navy panel.
//
// Every colour is a theme token. The cards used to be a stack of radial
// gradients in a fixed blue and cyan, which read as imported on the four
// palettes that aren't blue — including graphite, the one the app ships in.

import { CheckIcon } from "@/components/ui/icons";
import { planById, type PlanId } from "@/lib/plans";
import { cn } from "@/lib/utils";

/** The classes a plan's surface hands to whatever is drawn on it. */
export interface PlanSkin {
  /** True when the card is navy and everything on it is reversed out. */
  dark: boolean;
  /** The card itself. */
  card: string;
  /** The plan's name, and anything else at full strength. */
  title: string;
  /** Secondary text: a lede, a feature, a period. */
  soft: string;
  /** The faintest line — a price note, a renewal date. */
  faint: string;
  /** The tick beside a feature. */
  tick: string;
  /** A hairline rule drawn inside the card. */
  rule: string;
  /** The card's action, filled. */
  cta: string;
  /** The same action stated quietly, for a plan nobody needs to buy. */
  ctaQuiet: string;
  /** And held shut, for a plan there's no checkout for yet. Its own fill
   *  rather than the filled one at half opacity — a faded brand button reads
   *  as a control still loading, not as one that isn't open. */
  ctaShut: string;
  /** A small pill on the card — the recommended mark, a caption. */
  pill: string;
}

/** The box every plan's action shares. Matches `btnPrimary`'s height, radius
 *  and weight, laid out full width instead of inline. */
export const planAction =
  "mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-bold transition";

export function planSkin(plan: PlanId): PlanSkin {
  // Navy is the app's one filled surface — `btnOnNavy` is already written for
  // buttons that sit on it — so the recommended plan gets it.
  if (planById(plan).featured) {
    return {
      dark: true,
      card: "bg-navy text-white shadow-[var(--shadow-panel)]",
      title: "text-white",
      soft: "text-white/72",
      faint: "text-white/55",
      tick: "text-white",
      rule: "border-white/15",
      cta: "bg-white text-ink hover:bg-white/90",
      ctaQuiet: "text-white ring-1 ring-white/25 ring-inset hover:bg-white/10",
      ctaShut: "bg-white/10 text-white/60 ring-1 ring-white/15 ring-inset",
      pill: "bg-white/12 text-white ring-1 ring-white/20",
    };
  }

  return {
    dark: false,
    card: "bg-panel ring-1 ring-black/[0.08] shadow-[var(--shadow-panel)]",
    title: "text-ink",
    soft: "text-ink-soft",
    faint: "text-ink-faint",
    tick: "text-brand",
    rule: "border-black/[0.07]",
    cta: "btn-fill hover:opacity-90",
    ctaQuiet: "text-ink ring-1 ring-black/10 ring-inset hover:bg-black/[0.02]",
    ctaShut: "bg-field text-ink-faint ring-1 ring-black/[0.06] ring-inset",
    pill: "bg-brand-soft text-brand",
  };
}

/** A plan's features, ticked off. The tick is the app's own icon rather than a
 *  shape drawn out of two rotated borders. */
export function PlanTicks({
  features,
  skin,
  className,
}: {
  features: readonly string[];
  skin: PlanSkin;
  className?: string;
}) {
  return (
    <ul className={cn("grid gap-3", className)}>
      {features.map((feature) => (
        <li
          key={feature}
          className={cn(
            "flex items-start gap-2.5 text-[14.5px] leading-snug",
            skin.soft,
          )}
        >
          <CheckIcon
            aria-hidden="true"
            strokeWidth={2.5}
            className={cn("mt-px h-4 w-4 shrink-0", skin.tick)}
          />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}
