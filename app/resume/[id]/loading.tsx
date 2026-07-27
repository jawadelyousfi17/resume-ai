// The editor while a resume is being read.
//
// The bar across the top is the real one, minus the parts that need the
// document — the tabs are there, the logo is there, and only the page and the
// panel beside it are waiting.

import Link from "next/link";
import { AwardIcon } from "@/components/ui/icons";
import {
  DocumentIcon,
  MagicIcon,
  DesignIcon as WandIcon,
} from "@/components/ui/svg-icons";
import { Logo, LogoLockup } from "@/components/ui/logo";
import { Spinner } from "@/components/ui/spinner";

const TABS = [
  { label: "Content", icon: DocumentIcon, on: true },
  { label: "Customize", icon: WandIcon },
  { label: "AI Tools", icon: MagicIcon },
  { label: "Review", icon: AwardIcon },
  { label: "Tailor", icon: MagicIcon },
];

export default function Loading() {
  return (
    <div className="flex h-dvh flex-col">
      <header className="z-20 mx-3 mt-3 shrink-0 rounded-xl border border-black/5 bg-panel px-3 py-2">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="flex shrink-0 items-center gap-1.5 px-1"
          >
            <Logo className="h-7 w-7 sm:hidden" />
            <LogoLockup className="hidden h-7 sm:block" />
          </Link>

          <span className="hidden h-5 w-px shrink-0 bg-black/10 sm:block" />
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
  );
}
