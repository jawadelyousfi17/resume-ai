import Link from "next/link";

import { btnPrimary } from "@/components/landing/ui";
import { LogoLockup } from "@/components/ui/logo";

// A link that was never minted, or one the owner has since withdrawn. The two
// say the same thing on purpose — see the note in app/r/[slug]/page.tsx.
export default function SharedResumeNotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-cream px-6 text-center">
      <Link href="/" aria-label="meniacv">
        <LogoLockup className="h-11" />
      </Link>
      <div>
        <p className="text-[21px] font-extrabold tracking-tight text-ink">
          This link isn&apos;t available
        </p>
        <p className="mt-1.5 max-w-[38ch] text-[15px] text-ink-soft">
          The resume behind it has been unshared or deleted. Ask whoever sent it
          for a new link.
        </p>
      </div>
      <Link href="/dashboard" className={btnPrimary}>
        Build your own resume
      </Link>
    </div>
  );
}
