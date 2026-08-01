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
    id: "open-sans",
    label: "Open Sans",
    category: "sans",
    stack: `var(--font-open-sans), ${SANS_FALLBACK}`,
  },
  {
    id: "lato",
    label: "Lato",
    category: "sans",
    stack: `var(--font-lato), ${SANS_FALLBACK}`,
  },
  {
    id: "montserrat",
    label: "Montserrat",
    category: "sans",
    stack: `var(--font-montserrat), ${SANS_FALLBACK}`,
  },
  {
    id: "work-sans",
    label: "Work Sans",
    category: "sans",
    stack: `var(--font-work-sans), ${SANS_FALLBACK}`,
  },
  {
    id: "nunito-sans",
    label: "Nunito Sans",
    category: "sans",
    stack: `var(--font-nunito-sans), ${SANS_FALLBACK}`,
  },
  {
    id: "dm-sans",
    label: "DM Sans",
    category: "sans",
    stack: `var(--font-dm-sans), ${SANS_FALLBACK}`,
  },
  {
    id: "ibm-plex-sans",
    label: "IBM Plex Sans",
    category: "sans",
    stack: `var(--font-ibm-plex-sans), ${SANS_FALLBACK}`,
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
    id: "playfair-display",
    label: "Playfair Display",
    category: "serif",
    stack: `var(--font-playfair-display), ${SERIF_FALLBACK}`,
  },
  {
    id: "libre-baskerville",
    label: "Libre Baskerville",
    category: "serif",
    stack: `var(--font-libre-baskerville), ${SERIF_FALLBACK}`,
  },
  {
    id: "pt-serif",
    label: "PT Serif",
    category: "serif",
    stack: `var(--font-pt-serif), ${SERIF_FALLBACK}`,
  },
  {
    id: "crimson-pro",
    label: "Crimson Pro",
    category: "serif",
    stack: `var(--font-crimson-pro), ${SERIF_FALLBACK}`,
  },
  {
    id: "bitter",
    label: "Bitter",
    category: "serif",
    stack: `var(--font-bitter), ${SERIF_FALLBACK}`,
  },
  {
    id: "cormorant-garamond",
    label: "Cormorant Garamond",
    category: "serif",
    stack: `var(--font-cormorant-garamond), ${SERIF_FALLBACK}`,
  },

  {
    id: "jetbrains-mono",
    label: "JetBrains Mono",
    category: "mono",
    stack: `var(--font-jetbrains-mono), ${MONO_FALLBACK}`,
  },
  {
    id: "ibm-plex-mono",
    label: "IBM Plex Mono",
    category: "mono",
    stack: `var(--font-ibm-plex-mono), ${MONO_FALLBACK}`,
  },
  {
    id: "roboto-mono",
    label: "Roboto Mono",
    category: "mono",
    stack: `var(--font-roboto-mono), ${MONO_FALLBACK}`,
  },
  {
    id: "source-code-pro",
    label: "Source Code Pro",
    category: "mono",
    stack: `var(--font-source-code-pro), ${MONO_FALLBACK}`,
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
