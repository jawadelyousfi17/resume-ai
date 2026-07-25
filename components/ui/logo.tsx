// The brand, in one place.
//
// The sidebar, the editor's top bar and the marketing header used to draw
// their own lettered badge beside hand-set text, so changing the brand meant
// changing three files. They all render these instead.
//
// Two assets: `Logo` is the mark alone, for tight spots and small screens;
// `LogoLockup` is the full horizontal lockup — mark and wordmark — and is the
// one to reach for wherever there's room. The lockup's wordmark is black, so
// it only works on light backgrounds; on a dark one, pair `Logo` with the name
// set in the page's own type.

import Image from "next/image";

import { cn } from "@/lib/utils";

/** The product's name, wherever it has to be text rather than artwork. */
export const BRAND = "maniacv";

/** The mark on its own. `className` sets the box it fits into. */
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt=""
      width={64}
      height={64}
      // Ahead of everything else on the page, and small enough that inlining
      // it costs less than the request would.
      priority
      // The artwork sits inside its own margin — about three quarters of the
      // file's height — so the box runs a size larger than the badge it
      // replaced to land at the same optical weight.
      className={cn("h-9 w-9 object-contain", className)}
    />
  );
}

/** Mark and wordmark together. Height drives it; the width follows. */
export function LogoLockup({ className }: { className?: string }) {
  return (
    <Image
      src="/long.png"
      alt={BRAND}
      width={800}
      height={200}
      priority
      className={cn("h-8 w-auto object-contain", className)}
    />
  );
}
