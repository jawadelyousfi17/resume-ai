// The places the sidebar can take you, and the sidebar itself with nothing
// live in it.
//
// Shared by <DashboardShell> and by the loading fallbacks: while a page loads,
// the navigation is already known, so it stays on screen exactly as it is
// rather than dissolving into grey boxes.

import Link from "next/link";

import {
  LettersIcon,
  ResumesIcon,
  TrackerIcon,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/** "profile" is a place the sidebar can be on without being a place it can
 *  take you: it's reached from the account menu, so nothing lights up. */
export type DashboardSection = "resumes" | "letters" | "jobs" | "profile";

/** Where the sidebar can take you. An entry without an href is a place that
 *  doesn't exist yet — it stays inert rather than pretending. */
export const NAV: {
  id: DashboardSection;
  label: string;
  href?: string;
  icon: typeof ResumesIcon;
}[] = [
  { id: "resumes", label: "Resumes", href: "/dashboard", icon: ResumesIcon },
  {
    id: "letters",
    label: "Cover Letters",
    href: "/cover-letters",
    icon: LettersIcon,
  },
  { id: "jobs", label: "Job Tracker", href: "/jobs", icon: TrackerIcon },
];

/** The sidebar as it looks with no account loaded — the shape a fallback
 *  renders so the real one lands in the same place. */
export function SidebarNav({
  active,
  top,
}: {
  active: DashboardSection;
  /** What heads the column — the account, on a live page. A loading page has
   *  no account yet, so it gets the same row's shape in grey instead, and the
   *  real one lands in its place. */
  top?: React.ReactNode;
}) {
  return (
    <>
      {/* The toolbar's height, so it sits level with the page title — but no
          rule under it: the sidebar is one column, top to bottom, and only
          the main area is divided. */}
      <div className="mb-2 flex h-[72px] shrink-0 items-center">
        {top ?? (
          <span className="flex w-full items-center gap-2.5 px-2.5">
            <span className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-canvas" />
            <span className="flex-1 space-y-1.5">
              <span className="block h-3 w-20 animate-pulse rounded bg-canvas" />
              <span className="block h-2.5 w-32 animate-pulse rounded bg-canvas" />
            </span>
          </span>
        )}
      </div>

      <nav className="space-y-0.5">
        {NAV.map((item) => {
          const Icon = item.icon;
          const on = item.id === active;
          const className = cn(
            "group/nav flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-[14.5px] font-semibold transition",
            on
              ? "bg-canvas text-ink"
              : "text-ink-soft hover:bg-canvas hover:text-ink",
          );

          return item.href ? (
            <Link
              key={item.label}
              href={item.href}
              prefetch
              aria-current={on ? "page" : undefined}
              className={className}
            >
              <Icon
                className={cn("h-5 w-5", on ? "text-brand" : "text-ink-faint")}
              />
              {item.label}
            </Link>
          ) : (
            <button key={item.label} type="button" className={className}>
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </>
  );
}

/** The same places along the bottom of a phone. Rendered by the shell and by
 *  the loading fallbacks — the bar isn't loading, so it shouldn't vanish. */
export function BottomNav({ active }: { active: DashboardSection }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 border-t border-divider bg-panel pb-[env(safe-area-inset-bottom)] md:hidden">
      {NAV.map((item) => {
        const Icon = item.icon;
        const on = item.id === active;
        const className = cn(
          "flex flex-col items-center gap-1 py-2.5 text-[11.5px] font-semibold transition",
          on ? "text-brand" : "text-ink-faint",
        );

        return item.href ? (
          <Link
            key={item.label}
            href={item.href}
            prefetch
            aria-current={on ? "page" : undefined}
            className={className}
          >
            <Icon className="h-[22px] w-[22px]" />
            {item.label}
          </Link>
        ) : (
          <button key={item.label} type="button" className={className}>
            <Icon className="h-[22px] w-[22px]" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
