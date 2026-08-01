// Shared layout / button / type recipes for the landing page. Kept as plain
// class strings so they compose onto <a>, <button> and next/link alike.
//
// These mirror the app's own controls: the same radii, the same font weights,
// and the flat `btn-fill` the editor uses for its primary action.

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Layout                                                                     */
/* -------------------------------------------------------------------------- */

/** The column every section's content sits in. Width lives in globals.css as
 *  `--container-site`, so the nav and footer can't drift out of line with it. */
export const shell = "mx-auto w-full max-w-site px-5 sm:px-8";

/** Vertical rhythm between the page's major sections. */
export const sectionGap = "mt-20 md:mt-24 lg:mt-32";

/**
 * The app's card: white, soft shadow, hairline ring — the same recipe a resume
 * card uses on the dashboard.
 */
export const panel =
  "rounded-2xl bg-panel shadow-[var(--shadow-panel)] ring-1 ring-black/5";

/**
 * The same box with no lift: an outline, and nothing under it.
 *
 * For the pages that sit on white, where a white card casting a shadow is a
 * card floating over nothing — the shadow is what says "this is a surface
 * above the page", and on white there is no page to be above. The ring alone
 * carries the grouping.
 */
export const panelFlat = "rounded-2xl bg-panel ring-1 ring-black/[0.09]";

/* -------------------------------------------------------------------------- */
/* Type                                                                       */
/* -------------------------------------------------------------------------- */

/** Section heading. */
export const h2 =
  "text-[30px] leading-[1.12] font-extrabold tracking-tight text-ink sm:text-[38px] lg:text-[44px]";

/** The paragraph under a section heading. */
export const lede =
  "mt-4 max-w-[62ch] text-[16px] leading-[1.7] text-ink-soft lg:mt-5 lg:text-[18px]";

/* -------------------------------------------------------------------------- */
/* Controls                                                                   */
/* -------------------------------------------------------------------------- */

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-6 text-center text-[15px] font-bold whitespace-nowrap transition lg:text-base";

/**
 * The height every button in a row shares, and the reason it's here rather
 * than on each one.
 *
 * These almost always appear in pairs — a filled action beside a quiet one —
 * and the quiet one used to draw its edge with a 2px border. A border is part
 * of the box: it took 4px off the inside of an equally tall button, which
 * pulled the label in and left the second button reading as the smaller of the
 * two. The outline is a ring now, which is painted rather than measured, so
 * both buttons are the same box with the same room inside it.
 */
const row = "h-12 min-w-[9.5rem]";

/** Primary action anywhere: the brand, flat. No gradient and no shadow —
 *  a button is a shape with a colour, not a raised object. */
export const btnPrimary = cn(base, row, "btn-fill hover:opacity-90");

/** The oversized hero call to action. */
export const btnHero = cn(
  base,
  "h-14 px-8 text-base btn-fill hover:opacity-90 lg:h-16 lg:px-9 lg:text-lg",
);

/** Secondary action on cream or white. Same box as the primary, stated
 *  quietly: a hairline ring instead of a fill. */
export const btnQuiet = cn(
  base,
  row,
  "bg-panel text-ink ring-1 ring-black/10 ring-inset hover:bg-black/[0.02] hover:ring-ink/25",
);

/**
 * What a pair of buttons wears in a hero, so the two stay on one line.
 *
 * The minimum width and the roomy padding are what make a lone button look
 * deliberate; side by side on a 360px screen they're what push the second one
 * onto its own row. Here they give way: each takes half the row and the type
 * comes down a step. Applied to the buttons, with `flex-nowrap` on the row.
 */
export const btnCompact = "max-sm:min-w-0 max-sm:flex-1 max-sm:px-3 max-sm:text-[13.5px]";

/** Secondary action on a navy panel. */
export const btnOnNavy = cn(base, row, "bg-white text-ink hover:bg-white/90");

/** Right-pointing arrow for text links — the app's icon set has no arrow. */
export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn("h-3.5 w-3.5", className)}
      aria-hidden="true"
    >
      <path
        d="M2.5 8h10.5M9 4.2 12.8 8 9 11.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
