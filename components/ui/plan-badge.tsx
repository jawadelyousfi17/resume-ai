// The plan someone is on, as a pill beside their name.

import { planById, type PlanId } from "@/lib/plans";
import { cn } from "@/lib/utils";

/** The flame that marks the plan we'd point someone at. Shared with the
 *  pricing card's corner badge so the two are the same mark at two sizes. */
export function FlameMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M27.7 4.8c1.6 7.3-4.4 10.2-7.4 14.8-2.4 3.7-2.8 7.9-.8 11.3-2.7-1.6-4.4-4.4-4.4-7.7-5.4 4.1-7.9 9.5-6 15.2C11.1 44.2 16.5 47 23 47c8.7 0 15.8-6.6 15.8-15.4 0-8.4-5.4-14.9-11.1-26.8Zm-3.6 35.8c-4.1 0-7.4-2.8-7.4-6.7 0-2.9 1.8-5.5 4.8-7.9-.2 3.2 1.7 5.2 3.7 6.5 2.2-2.4 3.6-5.3 3.8-8.8 3.5 4.2 5.1 7.4 5.1 10.4 0 3.8-3.7 6.5-10 6.5Z"
      />
    </svg>
  );
}

/**
 * The plan, said in a word.
 *
 * A paid plan wears its own slab — the lit one for Ultimate, the quiet one for
 * Basic — so the badge and the pricing card are recognisably the same thing.
 * Free is drawn flat and grey: it says what account you're on without dressing
 * up as something bought.
 */
export function PlanBadge({
  plan,
  className,
}: {
  plan: PlanId;
  className?: string;
}) {
  const { title, featured } = planById(plan);
  const free = plan === "free";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-[3px] text-[10px] font-bold tracking-[0.08em] uppercase",
        free
          ? "bg-black/[0.06] text-ink-soft"
          : cn(
              "text-white ring-1 ring-white/15",
              featured ? "plan-shell" : "plan-shell-quiet",
            ),
        className,
      )}
    >
      {featured && <FlameMark className="h-2.5 w-2.5" />}
      {title}
    </span>
  );
}
