"use client";

// Form primitives for the editor, built on top of the shadcn Input/Textarea
// so we inherit their focus/disabled/aria handling but keep our filled,
// rounded, slightly-larger visual style.

import { cn } from "@/lib/utils";
import { Input as BaseInput } from "@/components/ui/input";
import { Textarea as BaseTextarea } from "@/components/ui/textarea";

// White, a hairline border, modest corners. Focus turns the border blue and
// adds a soft halo — the only colour a field ever carries, so the one being
// typed into is the one that stands out.
const controlBase =
  "h-auto rounded-md border-field-border bg-panel px-3.5 py-2.5 text-[14px] md:text-[14px] text-ink placeholder:text-ink-faint focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/15";

export function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn("mb-1.5 block text-[13px] font-semibold text-ink", className)}
    >
      {children}
    </span>
  );
}

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <BaseInput className={cn(controlBase, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <BaseTextarea
      className={cn(controlBase, "min-h-[46px] leading-relaxed", className)}
      {...props}
    />
  );
}

export function Field({
  label,
  className,
  children,
}: {
  label: string;
  /** For placing the field in a grid — spanning a row on a narrow screen. */
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block", className)}>
      <Label>{label}</Label>
      {children}
    </label>
  );
}
