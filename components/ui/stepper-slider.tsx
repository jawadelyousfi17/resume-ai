"use client";

// FlowCV-style stepped slider: a pill track with evenly-spaced tick marks, a
// chunky square thumb, and −/+ stepper buttons. Built on the Radix Slider
// primitive so it keeps full drag + keyboard accessibility.

import { Slider as SliderPrimitive } from "radix-ui";
import { MinusIcon, PlusIcon } from "@/components/ui/icons";

export function StepperSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const precision = String(step).split(".")[1]?.length ?? 0;
  const commit = (v: number) => {
    const clamped = Math.min(max, Math.max(min, v));
    onChange(Number(clamped.toFixed(precision)));
  };

  const intervals = Math.round((max - min) / step);
  const tickCount = Math.min(intervals + 1, 13);
  const display = format ? format(value) : `${value}${unit ?? ""}`;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-[13.5px] font-bold text-ink">{label}</span>
        <span className="text-[13.5px] font-semibold text-ink-soft tabular-nums">
          {display}
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="relative h-11 flex-1 rounded-xl bg-field">
          {/* decorative tick marks */}
          <div className="pointer-events-none absolute inset-y-0 left-4 right-4 flex items-center justify-between">
            {Array.from({ length: tickCount }).map((_, i) => (
              <span key={i} className="h-2.5 w-px bg-ink-faint/40" />
            ))}
          </div>

          <SliderPrimitive.Root
            className="relative flex h-full touch-none items-center px-3 select-none"
            value={[value]}
            min={min}
            max={max}
            step={step}
            onValueChange={(v) => commit(v[0])}
          >
            <SliderPrimitive.Track className="relative h-full grow bg-transparent">
              <SliderPrimitive.Range className="hidden" />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb
              aria-label={label}
              className="block h-8 w-8 cursor-grab rounded-lg bg-brand shadow-md outline-none transition hover:brightness-105 focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-1 active:cursor-grabbing"
            />
          </SliderPrimitive.Root>
        </div>

        <StepButton
          label={`Decrease ${label}`}
          disabled={value <= min}
          onClick={() => commit(value - step)}
        >
          <MinusIcon className="h-5 w-5" />
        </StepButton>
        <StepButton
          label={`Increase ${label}`}
          disabled={value >= max}
          onClick={() => commit(value + step)}
        >
          <PlusIcon className="h-5 w-5" />
        </StepButton>
      </div>
    </div>
  );
}

function StepButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-field-border bg-panel text-ink transition hover:bg-field disabled:opacity-35"
    >
      {children}
    </button>
  );
}
