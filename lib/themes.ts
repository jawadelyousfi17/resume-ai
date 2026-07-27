// The app's colour themes.
//
// A theme is a handful of CSS variables — the accent, the page, the dark
// surface, the ink — swapped on <html data-theme>. Everything else in the app
// is already expressed in those tokens, so nothing else has to know a theme
// exists. The values themselves live in app/globals.css; this is the list the
// switcher reads, plus the three colours it shows as a swatch.

export const THEMES = [
  {
    id: "ocean",
    name: "Ocean",
    note: "The original blue",
    swatch: ["#2563eb", "#06b6d4", "#f1f3f6"],
  },
  {
    id: "violet",
    name: "Violet",
    note: "Cooler, a little louder",
    swatch: ["#7c3aed", "#d946ef", "#f4f2fa"],
  },
  {
    id: "emerald",
    name: "Emerald",
    note: "Calm and green",
    swatch: ["#059669", "#14b8a6", "#f0f5f2"],
  },
  {
    id: "sunset",
    name: "Sunset",
    note: "Warm paper, amber accent",
    swatch: ["#ea580c", "#f59e0b", "#faf5ef"],
  },
  {
    id: "graphite",
    name: "Graphite",
    note: "No colour at all",
    swatch: ["#334155", "#64748b", "#eceef2"],
  },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const DEFAULT_THEME: ThemeId = "graphite";

/** Where the choice is kept. Read by the inline script in the layout too, so
 *  the page paints in the right colours rather than flashing the default. */
export const THEME_KEY = "maniacv:theme";

export const isThemeId = (value: unknown): value is ThemeId =>
  THEMES.some((t) => t.id === value);
