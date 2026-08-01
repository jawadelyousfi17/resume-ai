// The candidates for the app's own interface font.
//
// Not the resume typefaces — those are lib/fonts.ts and they belong to the
// document. This is the type the product itself is set in: the nav, the
// headings, the buttons, the editor's labels.
//
// Every family here is already loaded by app/fonts.ts for the resume side, so
// switching between them costs nothing extra to try. Applying one is a single
// attribute on <html>; the rules that redirect `--font-sans` behind it live in
// app/globals.css, next to where the default is declared.

export const UI_FONTS = [
  {
    id: "manrope",
    name: "Manrope",
    note: "The current one — geometric, slightly quirky",
    stack: "var(--font-manrope)",
  },
  {
    id: "inter",
    name: "Inter",
    note: "The default of the last decade. Neutral, invisible",
    stack: "var(--font-inter)",
  },
  {
    id: "dm-sans",
    name: "DM Sans",
    note: "Softer geometry, low contrast, friendly",
    stack: "var(--font-dm-sans)",
  },
  {
    id: "work-sans",
    name: "Work Sans",
    note: "Grotesque with open apertures — reads well small",
    stack: "var(--font-work-sans)",
  },
  {
    id: "ibm-plex-sans",
    name: "IBM Plex Sans",
    note: "Engineered, a little serious",
    stack: "var(--font-ibm-plex-sans)",
  },
] as const;

export type UiFontId = (typeof UI_FONTS)[number]["id"];

export const DEFAULT_UI_FONT: UiFontId = "manrope";

/** Where the choice is kept, and what the pre-paint script in the root layout
 *  reads. Prefixed like the theme key so the two sit together in devtools. */
export const UI_FONT_KEY = "meniacv:ui-font";

export const isUiFontId = (value: unknown): value is UiFontId =>
  UI_FONTS.some((font) => font.id === value);
