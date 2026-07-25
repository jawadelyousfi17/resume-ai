// Shared button / badge recipes for the landing page. Kept as plain class
// strings so they compose onto <a>, <button> and next/link alike.
//
// These mirror the app's own controls: the same radii, the same font weights,
// and the blue→cyan `btn-gradient` the editor uses for its primary action.

import { cn } from "@/lib/utils";

/**
 * The app's card: white, soft shadow, hairline ring — the same recipe a resume
 * card uses on the dashboard. Every light section on this page is one of these.
 */
export const panel =
  "rounded-2xl bg-panel shadow-[var(--shadow-panel)] ring-1 ring-black/5";

const base =
  "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-5 text-[15px] font-bold transition";

/** Primary action anywhere: the app's signature gradient. */
export const btnPrimary = cn(base, "btn-gradient hover:opacity-90");

/** Secondary action on cream or white. */
export const btnQuiet = cn(
  base,
  "border border-black/10 bg-panel text-ink hover:border-ink/25",
);

/** Secondary action on a navy panel. */
export const btnOnNavy = cn(base, "bg-white text-ink hover:bg-white/90");

/** Small pill used inside the product mockups. */
export const btnMini =
  "inline-flex h-6 items-center gap-1 rounded-lg bg-navy px-2.5 text-[10px] font-bold text-white";

/** The eyebrow above every section heading. */
export function Eyebrow({
  children,
  icon,
  tone = "light",
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold tracking-[0.12em] uppercase",
        tone === "light"
          ? "bg-brand-soft text-brand"
          : "bg-white/10 text-white/70",
      )}
    >
      {icon}
      {children}
    </span>
  );
}

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
