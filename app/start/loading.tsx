// What's on screen while the resume is being written.
//
// The page it replaces does one round trip and then redirects, so this is
// rarely up for long — but "nothing happened" is what a press with no feedback
// looks like, and this one is a database write away from the editor.

import { LogoLockup } from "@/components/ui/logo";
import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6">
      <LogoLockup className="h-11" />
      <span className="flex items-center gap-3 text-[15px] font-bold text-ink-soft">
        <Spinner className="h-5 w-5 text-brand" />
        Setting up your resume…
      </span>
    </main>
  );
}
