// A spinner, in whatever colour it inherits.
//
// One ring with a bright quarter, so it reads as motion rather than as a busy
// icon. Sized with Tailwind like every other mark in the app.

import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current/25 border-t-current",
        className,
      )}
    />
  );
}
