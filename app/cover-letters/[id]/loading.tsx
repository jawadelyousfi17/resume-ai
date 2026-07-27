// The letter editor while the letter is being read — the phone's shape on a
// phone, the desktop's on a desktop, so neither flickers into the other.

import Link from "next/link";

import {
  DesignIcon,
  DocumentIcon,
  EyeIcon,
  MagicIcon as SparklesIcon,
} from "@/components/ui/svg-icons";
import { Logo, LogoLockup } from "@/components/ui/logo";
import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <>
      {/* Phone */}
      <div className="flex h-dvh flex-col bg-cream lg:hidden">
        <header className="z-20 mx-3 mt-3 flex shrink-0 items-center gap-2 rounded-xl border border-black/5 bg-panel px-3 py-2">
          <Logo className="h-11 w-11" />
          <span className="h-4 w-28 animate-pulse rounded bg-field" />
          <span className="ml-auto h-9 w-24 animate-pulse rounded-lg bg-field" />
        </header>

        <div className="flex-1 space-y-3 px-4 py-5">
          {[96, 140, 200].map((h, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl bg-panel"
              style={{ height: h }}
            />
          ))}
        </div>

        <nav className="grid shrink-0 grid-cols-3 border-t border-black/5 bg-panel pb-[env(safe-area-inset-bottom)]">
          {[
            { label: "Write", icon: DocumentIcon, on: true },
            { label: "Design", icon: DesignIcon },
            { label: "Rewrite", icon: SparklesIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <span
                key={tab.label}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11.5px] font-bold ${
                  tab.on ? "text-brand" : "text-ink-faint"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                {tab.label}
              </span>
            );
          })}
        </nav>

        <span className="fixed right-4 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white/70 shadow-[0_10px_28px_rgba(15,23,42,0.3)]">
          <EyeIcon className="h-6 w-6" />
        </span>
      </div>

      {/* Desktop */}
      <div className="mx-auto hidden min-h-dvh w-full max-w-app flex-col lg:flex lg:h-dvh">
        <header className="z-20 mx-3 mt-3 shrink-0 rounded-xl border border-black/5 bg-panel px-3 py-2">
          <div className="flex items-center gap-2">
            <Link
              href="/cover-letters"
              className="flex shrink-0 items-center gap-1.5 px-1"
              aria-label="Back to my cover letters"
            >
              <LogoLockup className="h-11" />
            </Link>

            <span className="h-5 w-px shrink-0 bg-black/10" />
            <span className="h-4 w-32 animate-pulse rounded bg-field" />

            <span className="ml-auto flex shrink-0 gap-2">
              <span className="h-9 w-24 animate-pulse rounded-lg bg-field" />
              <span className="h-9 w-32 animate-pulse rounded-lg bg-field" />
            </span>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          <div className="w-full shrink-0 space-y-3 px-4 py-5 lg:w-[46%] lg:max-w-[640px] lg:min-w-[420px]">
            {[96, 140, 200].map((h, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl bg-panel"
                style={{ height: h }}
              />
            ))}
          </div>

          <div className="flex flex-1 items-center justify-center">
            <span className="flex items-center gap-3 text-[14px] font-bold text-ink-soft">
              <Spinner className="h-5 w-5 text-brand" />
              Opening your letter…
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
