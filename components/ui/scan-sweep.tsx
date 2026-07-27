// The band of light that means "something is reading this page".
//
// Two places show it: the review reading the resume in the editor, and the
// import reading the file you just handed over. Both fill their own frame, so
// this only draws the light — the frame around it belongs to the caller.

import { cn } from "@/lib/utils";

/** Purely decorative: `aria-hidden`, and it never takes a click. */
export function ScanSweep({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 z-10 overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-0 bg-brand/[0.045]" />

      {/* One band, its own height, swept from just above the page to just
          below it — see `scan-sweep` in globals.css. */}
      <div className="scan-sweep absolute inset-x-0 top-0 h-[24%]">
        <div className="h-full bg-gradient-to-b from-transparent via-brand/[0.06] to-brand/20" />
        <div className="scan-line h-px" />
      </div>
    </div>
  );
}
