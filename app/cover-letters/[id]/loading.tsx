// The letter editor while the letter is being read. The bar at the top is the
// real one, minus what needs the document.

import Link from "next/link";
import { Logo, LogoLockup } from "@/components/ui/logo";
import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex min-h-dvh flex-col lg:h-dvh">
      <header className="z-20 mx-3 mt-3 shrink-0 rounded-xl border border-black/5 bg-panel px-3 py-2">
        <div className="flex items-center gap-2">
          <Link
            href="/cover-letters"
            className="flex shrink-0 items-center gap-1.5 px-1"
            aria-label="Back to my cover letters"
          >
            <Logo className="h-7 w-7 sm:hidden" />
            <LogoLockup className="hidden h-7 sm:block" />
          </Link>

          <span className="hidden h-5 w-px shrink-0 bg-black/10 sm:block" />
          <span className="h-4 w-32 animate-pulse rounded bg-field" />

          <span className="ml-auto flex shrink-0 gap-2">
            <span className="h-9 w-24 animate-pulse rounded-lg bg-field" />
            <span className="h-9 w-32 animate-pulse rounded-lg bg-field" />
          </span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="w-full shrink-0 space-y-3 px-4 py-5 lg:w-[46%] lg:max-w-[640px] lg:min-w-[420px]">
          {[96, 140, 200].map((h, i) => (
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
            Opening your letter…
          </span>
        </div>
      </div>
    </div>
  );
}
