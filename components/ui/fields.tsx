"use client";

// Form primitives for the editor, built on top of the shadcn Input/Textarea
// so we inherit their focus/disabled/aria handling but keep our filled,
// rounded, slightly-larger visual style.

import { cn } from "@/lib/utils";
import { Input as BaseInput } from "@/components/ui/input";
import { Textarea as BaseTextarea } from "@/components/ui/textarea";

const controlBase =
  "h-auto rounded-xl border-transparent bg-field px-4 py-3 text-base md:text-base text-ink placeholder:text-ink-faint focus-visible:bg-white focus-visible:border-brand/40 focus-visible:ring-brand/25";

export function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("mb-2 block text-[14px] font-bold text-ink", className)}>
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
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      {children}
    </label>
  );
}
