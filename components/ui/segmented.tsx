// The one switcher: a white track with a soft shadow, the chosen option a
// solid blue block inside it. Corners follow the rest of the system — the
// track rounds like a group (10px), the option like a field — not pills. The
// editor's tabs, the Design panel's toggles, the phone's tab bar, the pricing
// period and the landing page's picture of the editor all draw from these, so
// a switch looks like a switch wherever it is.
//
// No "use client": nothing here holds state, and the class strings have to be
// readable from server components too — a client module's exports reach the
// server only as references.
//
// Exported as classes as well as a component: the editor's tabs are shadcn
// Tabs (Radix keeps their keyboard and ARIA behaviour), and they only need to
// wear the look.

import { cn } from "@/lib/utils";

/** The track. */
export const segTrack =
  "flex gap-1 rounded-[10px] bg-panel p-1 ring-1 ring-divider shadow-[0_4px_16px_rgba(0,0,0,0.05)]";

/** One option. Selected via `active`, or via Radix's `data-active` when the
 *  option is a TabsTrigger. */
export const segItem =
  "inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-[7px] border-0 px-2 text-[13.5px] font-medium text-ink-soft transition hover:text-ink";

export const segItemOn = "bg-brand text-white hover:bg-accent-2 hover:text-white";

/** For a TabsList. shadcn's list fixes its height and padding through
 *  variant-scoped classes (`group-data-horizontal/tabs:h-8`), which a plain
 *  `h-auto` can't outrank — so they're overridden at the same scope. */
export const segTabList = cn(
  segTrack,
  "h-auto w-full p-1 group-data-horizontal/tabs:h-auto",
);

/** For a TabsTrigger: the selected look keyed off Radix's own state, with
 *  shadcn's own active shadow switched off at the scope it's set on. */
export const segTab = cn(
  segItem,
  "h-8 py-0 data-active:bg-brand data-active:text-white hover:data-active:bg-accent-2 group-data-[variant=default]/tabs-list:data-active:shadow-none after:hidden",
);

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  className,
}: {
  value: T;
  options: { value: T; label: React.ReactNode; title?: string }[];
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={cn(segTrack, className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          title={o.title}
          className={cn(segItem, value === o.value && segItemOn)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
