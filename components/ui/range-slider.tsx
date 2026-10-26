"use client";

// The panel's slider: a thick pale track marked off in steps, filled in the
// blue up to a white, square-cornered thumb with a blue edge. Built on the
// shadcn Slider — Radix keeps the dragging, keyboard and ARIA — and dressed
// through its `data-slot` parts, so the primitive itself stays stock.

import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

/** More marks than this and the track turns into a barcode; past it the
 *  ticks fall on every second, third… step instead. */
const MAX_TICKS = 12;

export function RangeSlider({
  value,
  min,
  max,
  step,
  onChange,
  className,
  ...aria
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  className?: string;
  "aria-label"?: string;
}) {
  const steps = Math.max(1, Math.round((max - min) / step));
  const segments = steps / Math.ceil(steps / MAX_TICKS);

  return (
    <div className={cn("relative", className)}>
      {/* The step marks, painted under the track's fill: hairlines at equal
          spacing, so the blue run covers the ones already passed. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 h-5 -translate-y-1/2 rounded-full"
        style={{
          backgroundColor: "var(--app-canvas)",
          backgroundImage: `repeating-linear-gradient(to right, transparent 0, transparent calc(${100 / segments}% - 1px), var(--app-divider) calc(${100 / segments}% - 1px), var(--app-divider) ${100 / segments}%)`,
        }}
      />
      <Slider
        {...aria}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
        className={cn(
          "h-6",
          // Track: 20px, a pill, clear — the marked strip under it is the
          // grey, and the fill paints over the marks it has passed.
          "[&_[data-slot=slider-track]]:h-5 [&_[data-slot=slider-track]]:rounded-full [&_[data-slot=slider-track]]:bg-transparent",
          // Fill.
          "[&_[data-slot=slider-range]]:bg-brand",
          // Thumb: taller than the track, square-cornered, white with a blue
          // edge — the reference's third slider.
          "[&_[data-slot=slider-thumb]]:h-6 [&_[data-slot=slider-thumb]]:w-4 [&_[data-slot=slider-thumb]]:rounded-[6px] [&_[data-slot=slider-thumb]]:border-[1.5px] [&_[data-slot=slider-thumb]]:border-brand [&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-thumb]]:shadow-[0_1px_3px_rgba(0,0,0,0.12)] [&_[data-slot=slider-thumb]]:ring-brand/20",
        )}
      />
    </div>
  );
}
