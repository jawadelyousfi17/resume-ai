"use client";

// The typeface control, shared by the resume's Customize tab and the cover
// letter's Design section. Every name is set in the face it selects — the only
// honest way to pick a font.

import { Fragment } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckIcon } from "@/components/ui/icons";
import { ChevronDownIcon } from "@/components/ui/svg-icons";
import { FONTS, FONT_CATEGORIES, fontsIn } from "@/lib/fonts";
import type { FontFamily } from "@/lib/types";

export function FontPicker({
  value,
  onChange,
}: {
  value: FontFamily;
  onChange: (value: FontFamily) => void;
}) {
  const active = FONTS.find((f) => f.id === value) ?? FONTS[0];
  const activeCategory = FONT_CATEGORIES.find(
    (c) => c.id === active.category,
  )?.label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl border border-field-border px-4 py-3.5 text-left transition hover:border-ink/30"
        >
          <span className="min-w-0 flex-1">
            <span
              className="block truncate text-[17px] text-ink"
              style={{ fontFamily: active.stack }}
            >
              {active.label}
            </span>
            {/* Three of these are called "System", so the trigger has to say
                which one is selected. */}
            <span className="mt-0.5 block text-[12.5px] font-semibold text-ink-faint">
              {activeCategory}
            </span>
          </span>
          <ChevronDownIcon className="h-4 w-4 shrink-0 text-ink-soft" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="max-h-[380px] p-2">
        {FONT_CATEGORIES.map((category, i) => (
          <Fragment key={category.id}>
            {i > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel className="text-[11.5px] font-bold tracking-wide text-ink-faint uppercase">
              {category.label}
            </DropdownMenuLabel>
            {fontsIn(category.id).map((font) => (
              <DropdownMenuItem
                key={font.id}
                onClick={() => onChange(font.id)}
                style={{ fontFamily: font.stack }}
                className="py-3 text-[16px] font-normal"
              >
                {font.label}
                {font.id === value && (
                  <CheckIcon className="ml-auto h-4 w-4 shrink-0 text-brand" />
                )}
              </DropdownMenuItem>
            ))}
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
