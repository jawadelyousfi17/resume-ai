// The typeface catalogue: what the Customize panel lists, and what the preview
// and the PDF are actually set in.
//
// Pure data, so both client and server can read it. The fonts themselves are
// loaded in app/fonts.ts — each `var(--font-…)` below is the variable that
// file defines, with a system fallback behind it for the moment before the
// face arrives.

import type { FontFamily } from "./types";

export type FontCategory = "sans" | "serif" | "mono";

export interface FontOption {
  id: FontFamily;
  label: string;
  category: FontCategory;
  /** The CSS `font-family` value. */
  stack: string;
}

const SANS_FALLBACK = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const SERIF_FALLBACK = "Georgia, 'Times New Roman', Times, serif";
const MONO_FALLBACK = "'SFMono-Regular', Menlo, Consolas, monospace";

export const FONTS: FontOption[] = [
  // The original three. Kept first and unchanged because saved resumes store
  // these ids — repointing one would restyle somebody's document.
  { id: "sans", label: "System", category: "sans", stack: SANS_FALLBACK },
  { id: "serif", label: "System", category: "serif", stack: SERIF_FALLBACK },
  { id: "mono", label: "System", category: "mono", stack: MONO_FALLBACK },

  {
    id: "inter",
    label: "Inter",
    category: "sans",
    stack: `var(--font-inter), ${SANS_FALLBACK}`,
  },
  {
    id: "source-sans",
    label: "Source Sans",
    category: "sans",
    stack: `var(--font-source-sans), ${SANS_FALLBACK}`,
  },
  {
    id: "roboto",
    label: "Roboto",
    category: "sans",
    stack: `var(--font-roboto), ${SANS_FALLBACK}`,
  },

  {
    id: "source-serif",
    label: "Source Serif",
    category: "serif",
    stack: `var(--font-source-serif), ${SERIF_FALLBACK}`,
  },
  {
    id: "lora",
    label: "Lora",
    category: "serif",
    stack: `var(--font-lora), ${SERIF_FALLBACK}`,
  },
  {
    id: "merriweather",
    label: "Merriweather",
    category: "serif",
    stack: `var(--font-merriweather), ${SERIF_FALLBACK}`,
  },
  {
    id: "eb-garamond",
    label: "EB Garamond",
    category: "serif",
    stack: `var(--font-eb-garamond), ${SERIF_FALLBACK}`,
  },

  {
    id: "jetbrains-mono",
    label: "JetBrains Mono",
    category: "mono",
    stack: `var(--font-jetbrains-mono), ${MONO_FALLBACK}`,
  },
];

/** How the picker groups them, in the order it shows the groups. */
export const FONT_CATEGORIES: { id: FontCategory; label: string }[] = [
  { id: "sans", label: "Sans serif" },
  { id: "serif", label: "Serif" },
  { id: "mono", label: "Monospace" },
];

export const fontsIn = (category: FontCategory): FontOption[] =>
  FONTS.filter((f) => f.category === category);

/** CSS font stacks, per family choice. */
export const FONT_STACKS = Object.fromEntries(
  FONTS.map((f) => [f.id, f.stack]),
) as Record<FontFamily, string>;

/** Tolerates a font id saved before this list grew, or one that's since been
 *  dropped — an unknown value reads as the plain sans stack. */
export const fontStack = (id: FontFamily | undefined): string =>
  (id && FONT_STACKS[id]) || SANS_FALLBACK;
