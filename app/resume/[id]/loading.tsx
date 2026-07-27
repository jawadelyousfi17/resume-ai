// The editor while a resume is being read.
//
// Two shapes, because the editor has two: a phone gets the slim bar and the
// tabs along the bottom, a desktop gets the floating bar and the two panes.
// Anything else flickers into the real layout a moment later.

import Link from "next/link";

import { AwardIcon } from "@/components/ui/icons";
import {
  DocumentIcon,
  EyeIcon,
  MagicIcon,
  DesignIcon as WandIcon,
} from "@/components/ui/svg-icons";
import { Logo, LogoLockup } from "@/components/ui/logo";
import { Spinner } from "@/components/ui/spinner";

const TABS = [
  { label: "Content", short: "Edit", icon: DocumentIcon, on: true },
  { label: "Customize", short: "Design", icon: WandIcon },
  { label: "AI Tools", short: "AI", icon: MagicIcon },
  { label: "Review", short: "Review", icon: AwardIcon },
  { label: "Tailor", short: "Tailor", icon: MagicIcon },
];

export default function Loading() {
  return (
    <>
      {/* Phone */}
      <div className="flex h-dvh flex-col bg-cream md:hidden">
        <header className="flex shrink-0 items-center gap-2 border-b border-black/5 bg-panel px-3 py-2.5">
          <Logo className="h-11 w-11" />
          <span className="h-4 w-28 animate-pulse rounded bg-field" />
          <span className="ml-auto h-10 w-20 animate-pulse rounded-lg bg-field" />
        </header>

        <div className="flex-1 px-3 py-4">
          <div className="aspect-[210/297] w-full animate-pulse rounded-2xl bg-panel" />
        </div>

        <nav className="grid shrink-0 grid-cols-5 border-t border-black/5 bg-panel pb-[env(safe-area-inset-bottom)]">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <span
                key={tab.label}
                className={`flex flex-col items-center gap-1 py-2.5 text-[10.5px] font-bold ${
                  tab.on ? "text-brand" : "text-ink-faint"
                }`}
              >
                <Icon className="h-[22px] w-[22px]" />
                {tab.short}
              </span>
            );
          })}
        </nav>

        <span className="fixed right-4 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white/70 shadow-[0_10px_28px_rgba(15,23,42,0.3)]">
          <EyeIcon className="h-6 w-6" />
        </span>
      </div>

      {/* Desktop */}
      <div className="hidden h-dvh flex-col md:flex">
        <header className="z-20 mx-3 mt-3 shrink-0 rounded-xl border border-black/5 bg-panel px-3 py-2">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="flex shrink-0 items-center gap-1.5 px-1"
            >
              <LogoLockup className="h-11" />
            </Link>

            <span className="h-5 w-px shrink-0 bg-black/10" />
            <span className="h-4 w-28 animate-pulse rounded bg-field" />

            <nav className="mx-auto flex shrink-0 items-center gap-0.5">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <span
                    key={tab.label}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[14.5px] font-bold ${
                      tab.on ? "bg-brand-soft text-brand" : "text-ink-soft"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    <span className="hidden md:inline">{tab.label}</span>
                  </span>
                );
              })}
            </nav>

            <span className="h-9 w-[132px] shrink-0 animate-pulse rounded-lg bg-field" />
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          <div className="w-full max-w-[640px] shrink-0 space-y-3 px-4 py-5 sm:min-w-[420px] lg:w-[46%]">
            {[112, 76, 76, 76].map((h, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl bg-panel"
                style={{ height: h }}
              />
            ))}
          </div>

          <div className="hidden flex-1 items-center justify-center lg:flex">
            <span className="flex items-center gap-3 text-[14px] font-bold text-ink-soft">
              <Spinner className="h-5 w-5 text-brand" />
              Opening your resume…
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
