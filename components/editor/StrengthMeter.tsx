"use client";

// The Content panel's progress line: how complete the page is, and the one
// thing worth doing next. The next step is a button — it opens the card that
// needs the work, or adds the section if there isn't one.

import { useMemo } from "react";
import { useResume } from "@/lib/store";
import { resumeStrength, type StrengthTarget } from "@/lib/strength";
import { CheckIcon, PlusIcon } from "@/components/ui/icons";

export function StrengthMeter({
  onGo,
}: {
  onGo: (target: StrengthTarget) => void;
}) {
  const { data } = useResume();
  const { score, next } = useMemo(() => resumeStrength(data), [data]);
  const done = next === null;

  return (
    <div>
      <div className="flex items-baseline justify-between text-[13px]">
        <span className="font-semibold text-ink">Resume strength</span>
        <span className="font-semibold text-ink tabular-nums">{score}%</span>
      </div>

      <div
        role="meter"
        aria-label="Resume strength"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={score}
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-canvas"
      >
        <span
          className="block h-full rounded-full bg-brand transition-[width] duration-500 ease-out"
          style={{ width: `${score}%` }}
        />
      </div>

      {done ? (
        <p className="mt-2.5 flex items-center gap-1.5 text-[13px] text-ink-soft">
          <CheckIcon className="h-4 w-4 text-positive" strokeWidth={2.25} />
          Complete
        </p>
      ) : (
        <button
          type="button"
          onClick={() => onGo(next.target)}
          className="mt-2 -ml-1.5 flex items-center gap-1 rounded-md px-1.5 py-1 text-[13px] font-medium text-brand transition hover:bg-brand-soft"
        >
          <PlusIcon className="h-3.5 w-3.5" />
          {next.label}
          <span className="text-ink-faint">+{next.points}%</span>
        </button>
      )}
    </div>
  );
}
