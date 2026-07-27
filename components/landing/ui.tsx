// Shared layout / button / type recipes for the landing page. Kept as plain
// class strings so they compose onto <a>, <button> and next/link alike.
//
// These mirror the app's own controls: the same radii, the same font weights,
// and the blue→cyan `btn-gradient` the editor uses for its primary action.

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Layout                                                                     */
/* -------------------------------------------------------------------------- */

/** The column every section's content sits in. */
export const shell = "mx-auto w-full max-w-[1180px] px-5 sm:px-8";

/** Vertical rhythm between the page's major sections. */
export const sectionGap = "mt-20 md:mt-24 lg:mt-32";

/**
 * The app's card: white, soft shadow, hairline ring — the same recipe a resume
 * card uses on the dashboard.
 */
export const panel =
  "rounded-2xl bg-panel shadow-[var(--shadow-panel)] ring-1 ring-black/5";

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
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-6 text-[15px] font-bold transition lg:text-base";

/** Primary action anywhere: the app's signature gradient. */
export const btnPrimary = cn(base, "h-12 btn-gradient hover:opacity-90");

/** The oversized hero call to action. */
export const btnHero = cn(
  base,
  "h-14 px-8 text-base btn-gradient hover:opacity-90 lg:h-16 lg:px-9 lg:text-lg",
);

/** Secondary action on cream or white. */
export const btnQuiet = cn(
  base,
  "h-12 border-2 border-black/10 bg-panel text-ink hover:border-ink/30",
);

/** Secondary action on a navy panel. */
export const btnOnNavy = cn(base, "h-12 bg-white text-ink hover:bg-white/90");

/** Small pill used inside the product mockups. */
export const btnMini =
  "inline-flex h-6 items-center gap-1 rounded-lg bg-navy px-2.5 text-[10px] font-bold text-white";

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
