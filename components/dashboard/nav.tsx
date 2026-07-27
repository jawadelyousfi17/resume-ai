// The places the sidebar can take you, and the sidebar itself with nothing
// live in it.
//
// Shared by <DashboardShell> and by the loading fallbacks: while a page loads,
// the navigation is already known, so it stays on screen exactly as it is
// rather than dissolving into grey boxes.

import Link from "next/link";

import {
  BriefcaseIcon,
  CapIcon,
  FileTextIcon,
  MailIcon,
  TagIcon,
} from "@/components/ui/icons";
import { LogoLockup } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

export type DashboardSection = "resumes" | "letters" | "jobs";

/** Where the sidebar can take you. An entry without an href is a place that
 *  doesn't exist yet — it stays inert rather than pretending. */
export const NAV: {
  id: DashboardSection;
  label: string;
  href?: string;
  icon: typeof FileTextIcon;
}[] = [
  { id: "resumes", label: "Resume", href: "/dashboard", icon: FileTextIcon },
  {
    id: "letters",
    label: "Cover Letter",
    href: "/cover-letters",
    icon: MailIcon,
  },
  { id: "jobs", label: "Job Tracker", href: "/jobs", icon: BriefcaseIcon },
];

export const NAV_FOOTER = [
  { label: "Plans & Pricing", href: "/pricing", icon: TagIcon },
  { label: "Student Benefits", icon: CapIcon },
];

/** The sidebar as it looks with no account loaded — the shape a fallback
 *  renders so the real one lands in the same place. */
export function SidebarNav({ active }: { active: DashboardSection }) {
  return (
    <>
      <div className="mb-8 flex items-center px-2">
        <LogoLockup className="h-14" />
      </div>

      <nav className="space-y-1.5">
        {NAV.map((item) => {
          const Icon = item.icon;
          const on = item.id === active;
          const className = cn(
            "flex w-full items-center gap-3 rounded-xl px-3.5 py-3.5 text-left text-[16px] font-bold transition",
            on
              ? "bg-white text-ink"
              : "text-ink-soft hover:bg-white/60 hover:text-ink",
          );

          return item.href ? (
            <Link
              key={item.label}
              href={item.href}
              prefetch
              aria-current={on ? "page" : undefined}
              className={className}
            >
              <Icon className="h-5 w-5" />
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
    <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 border-t border-black/5 bg-panel pb-[env(safe-area-inset-bottom)] md:hidden">
      {NAV.map((item) => {
        const Icon = item.icon;
        const on = item.id === active;
        const className = cn(
          "flex flex-col items-center gap-1 py-2.5 text-[11.5px] font-bold transition",
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
