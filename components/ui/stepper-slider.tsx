"use client";

// Stepped slider: a thick two-tone bar — brand up to the value, grey after —
// with a chunky square thumb and −/+ stepper buttons. Built on the Radix
// Slider primitive so it keeps full drag + keyboard accessibility.

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
        <SliderPrimitive.Root
          className="relative flex h-8 flex-1 touch-none items-center select-none"
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={(v) => commit(v[0])}
        >
          <SliderPrimitive.Track className="relative h-2 grow overflow-hidden rounded-[3px] bg-field">
            <SliderPrimitive.Range className="absolute h-full rounded-[3px] bg-brand" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb
            aria-label={label}
            className="block h-8 w-8 cursor-grab rounded-md bg-brand outline-none transition hover:brightness-105 focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 active:cursor-grabbing"
          />
        </SliderPrimitive.Root>

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
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-field-border bg-panel text-ink transition hover:bg-field disabled:opacity-35"
    >
      {children}
    </button>
  );
}
