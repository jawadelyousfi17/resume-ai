"use client";

// Reordering, for touch.
//
// The drag handles are HTML5 drag-and-drop, which never fires on a phone —
// there is no dragstart from a finger. Rather than reimplement dragging with
// pointer events, a touch screen gets the two buttons the keyboard already
// had: move up, move down, against the same `onNudge` the arrow keys use.

import { ChevronDownIcon } from "@/components/ui/svg-icons";
import { cn } from "@/lib/utils";

export function NudgeButtons({
  onNudge,
  label,
  className,
}: {
  onNudge: (delta: number) => void;
  /** What is being moved, for the button's accessible name. */
  label: string;
  className?: string;
}) {
  return (
    <span className={cn("flex shrink-0 flex-col md:hidden", className)}>
      <NudgeButton label={`Move ${label} up`} onClick={() => onNudge(-1)} up />
      <NudgeButton label={`Move ${label} down`} onClick={() => onNudge(1)} />
    </span>
  );
}

function NudgeButton({
  label,
  onClick,
  up,
}: {
  label: string;
  onClick: () => void;
  up?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        // The rows are clickable themselves — moving one shouldn't also open it.
        e.stopPropagation();
        onClick();
      }}
      className="inline-flex h-6 w-7 items-center justify-center rounded-md text-ink-faint transition active:bg-black/5 active:text-ink"
    >
      <ChevronDownIcon className={cn("h-4 w-4", up && "rotate-180")} />
    </button>
  );
}
