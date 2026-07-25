// The resume templates.
//
// A template is a set of layout decisions, not a separate renderer: one
// preview component reads this descriptor and lays the same document out
// accordingly. Adding a template is adding an entry here — no new component,
// and no chance of one layout drifting away from the others.
//
// The Customize panel's settings (accent, size, spacing) stay user-owned on
// top of whichever template is selected.

import type { ResumeSettings, TemplateId } from "./types";

/** Where an entry's dates and location sit. */
export type DateStyle =
  /** Right-aligned against the role, two stacked lines. */
  | "right"
  /** Right-aligned on one line, separated by a pipe. */
  | "right-inline"
  /** Its own narrow column to the left of the entry. */
  | "left-column";

/** How a tag section — skills, languages, interests — is laid out. */
export type TagStyle =
  | "columns-1"
  | "columns-2"
  | "columns-3"
  | "columns-4"
  /** Name on the left, a five-dot proficiency meter on the right. */
  | "dots"
  /** One flowing line, pipe-separated. */
  | "inline";

export interface Template {
  id: TemplateId;
  name: string;
  description: string;

  /** Typeface personality. Overrides the font control while selected. */
  font: "serif" | "sans";

  // ---- header -----------------------------------------------------------
  /** Alignment of the name / title / contact block. */
  headerAlign: "left" | "center";
  /** Title sits beside the name in italics rather than under it. */
  headerInlineTitle: boolean;
  /** Tinted band behind the whole header. */
  headerBand: boolean;
  /** Hairline under the header block. */
  headerRule: boolean;
  /** Contacts as one flowing row, or a two-column grid with icons. */
  headerContacts: "inline" | "grid";
  /** Which side an avatar sits on, if the template shows one at all. */
  photo: "none" | "left" | "right";
  photoShape: "circle" | "square";

  // ---- section headings -------------------------------------------------
  /** Tinted bar, an underline, or nothing but the type. */
  headingStyle: "band" | "rule" | "plain";
  headingAlign: "left" | "center";
  headingCaps: boolean;
  /** The rule takes the accent colour rather than ink. */
  headingAccentRule: boolean;

  // ---- body -------------------------------------------------------------
  dates: DateStyle;
  tags: TagStyle;
  /** A rail down the left of the page carrying the shorter sections. */
  sidebar: "none" | "dark" | "tint";
  /** Whether the name block sits inside the rail or spans above both columns. */
  sidebarHeader: "inside" | "above";
  /** A narrow decorative band down the page edge. Purely visual. */
  edgeStrip: boolean;
  /** Multiplies the gap between sections. */
  density: number;

  /** Accent this template was designed around. Applied when it's picked. */
  accent?: string;
  /** Applied to settings when the template is picked. */
  presets: Pick<ResumeSettings, "fontFamily" | "headingStyle">;
}

/** Everything a template doesn't say otherwise. */
const BASE = {
  font: "sans",
  headerAlign: "left",
  headerInlineTitle: false,
  headerBand: false,
  headerRule: false,
  headerContacts: "inline",
  photo: "none",
  photoShape: "circle",
  headingStyle: "rule",
  headingAlign: "left",
  headingCaps: false,
  headingAccentRule: false,
  dates: "right",
  tags: "columns-2",
  sidebar: "none",
  sidebarHeader: "above",
  edgeStrip: false,
  density: 1,
} satisfies Omit<Template, "id" | "name" | "description" | "presets" | "accent">;

export const TEMPLATES: Template[] = [
  {
    ...BASE,
    id: "ledger",
    name: "Ledger",
    description:
      "Serif type with centred headings on a soft grey bar. Formal without being stiff.",
    font: "serif",
    headerContacts: "grid",
    headingStyle: "band",
    headingAlign: "center",
    accent: "#0f172a",
    presets: { fontFamily: "serif", headingStyle: "plain" },
  },
  {
    ...BASE,
    id: "meridian",
    name: "Meridian",
    description:
      "Blue headings over a full-width rule, contacts on one line. Clean and corporate.",
    headingAccentRule: true,
    accent: "#2f5d8a",
    presets: { fontFamily: "sans", headingStyle: "plain" },
  },
  {
    ...BASE,
    id: "chronicle",
    name: "Chronicle",
    description:
      "Dates in their own left column, skills rated with dots. Reads like a record.",
    font: "serif",
    headerInlineTitle: true,
    headerContacts: "grid",
    dates: "left-column",
    tags: "dots",
    accent: "#0f172a",
    presets: { fontFamily: "serif", headingStyle: "plain" },
  },
  {
    ...BASE,
    id: "bergen",
    name: "Bergen",
    description:
      "Centred header, small-caps headings, skills as one flowing line. Very compact.",
    font: "serif",
    headerAlign: "center",
    headingCaps: true,
    dates: "right-inline",
    tags: "inline",
    accent: "#0f172a",
    presets: { fontFamily: "serif", headingStyle: "uppercase" },
  },
  {
    ...BASE,
    id: "atlas",
    name: "Atlas",
    description:
      "Two columns with an avatar in the header and an amber rule under every heading.",
    font: "serif",
    photo: "left",
    headerInlineTitle: true,
    headerContacts: "grid",
    headingCaps: true,
    headingAccentRule: true,
    sidebar: "tint",
    dates: "right-inline",
    tags: "columns-1",
    density: 0.95,
    accent: "#e8a33d",
    presets: { fontFamily: "serif", headingStyle: "uppercase" },
  },
  {
    ...BASE,
    id: "compass",
    name: "Compass",
    description:
      "Avatar top right, banded headings, dates down the left. Roomy and easy to scan.",
    photo: "right",
    headerInlineTitle: true,
    headerContacts: "grid",
    headingStyle: "band",
    headingAlign: "center",
    dates: "left-column",
    tags: "columns-3",
    accent: "#2f5d8a",
    presets: { fontFamily: "sans", headingStyle: "plain" },
  },
  {
    ...BASE,
    id: "verdant",
    name: "Verdant",
    description:
      "A colour strip down the page edge with a square avatar. Quietly distinctive.",
    photo: "right",
    photoShape: "square",
    edgeStrip: true,
    accent: "#2f6d5c",
    presets: { fontFamily: "sans", headingStyle: "plain" },
  },
  {
    ...BASE,
    id: "onyx",
    name: "Onyx",
    description:
      "Dark rail carrying the avatar, profile and skills, history in the light column.",
    font: "serif",
    photo: "left",
    sidebar: "dark",
    sidebarHeader: "inside",
    headingStyle: "band",
    headingAlign: "center",
    headingCaps: true,
    tags: "columns-1",
    density: 0.95,
    accent: "#1e3a53",
    presets: { fontFamily: "serif", headingStyle: "uppercase" },
  },
  {
    ...BASE,
    id: "portrait",
    name: "Portrait",
    description:
      "Avatar and contacts in a grey masthead, banded headings, dates on the left.",
    font: "serif",
    photo: "left",
    headerBand: true,
    headerContacts: "grid",
    headingStyle: "band",
    headingAlign: "center",
    dates: "left-column",
    tags: "columns-3",
    accent: "#4b5563",
    presets: { fontFamily: "serif", headingStyle: "plain" },
  },
  {
    ...BASE,
    id: "compact",
    name: "Compact",
    description:
      "Tight leading and four skill columns. For long histories that must fit.",
    headerAlign: "center",
    headingCaps: true,
    headingAccentRule: true,
    dates: "right-inline",
    tags: "columns-4",
    density: 0.8,
    accent: "#2f5d8a",
    presets: { fontFamily: "sans", headingStyle: "uppercase" },
  },
  {
    ...BASE,
    id: "oxford",
    name: "Oxford",
    description:
      "Centred serif header, single-column skills, languages rated with dots.",
    font: "serif",
    headerAlign: "center",
    headingCaps: true,
    tags: "columns-1",
    accent: "#0f172a",
    presets: { fontFamily: "serif", headingStyle: "uppercase" },
  },
  {
    ...BASE,
    id: "ashford",
    name: "Ashford",
    description:
      "The Oxford header with two skill columns. The safest of the serif set.",
    font: "serif",
    headerAlign: "center",
    headingCaps: true,
    accent: "#0f172a",
    presets: { fontFamily: "serif", headingStyle: "uppercase" },
  },

  // The original five. Kept because saved resumes reference them by id —
  // dropping one would silently re-style somebody's document.
  {
    ...BASE,
    id: "classic",
    name: "Classic",
    description: "Left-aligned header with underlined section rules. Safe everywhere.",
    presets: { fontFamily: "sans", headingStyle: "underline" },
  },
  {
    ...BASE,
    id: "modern",
    name: "Modern",
    description: "Name on a tinted accent band, uppercase headings underneath.",
    headerBand: true,
    headingCaps: true,
    presets: { fontFamily: "sans", headingStyle: "uppercase" },
  },
  {
    ...BASE,
    id: "minimal",
    name: "Minimal",
    description: "No rules at all. Space does the separating. Lots of white.",
    headingStyle: "plain",
    density: 1.3,
    presets: { fontFamily: "sans", headingStyle: "plain" },
  },
  {
    ...BASE,
    id: "sidebar",
    name: "Sidebar",
    description: "Contact and skills in a tinted rail, history in the main column.",
    sidebar: "tint",
    headingStyle: "plain",
    tags: "columns-1",
    density: 0.95,
    presets: { fontFamily: "sans", headingStyle: "plain" },
  },
  {
    ...BASE,
    id: "editorial",
    name: "Editorial",
    description: "Serif type, centred header between rules. Reads like print.",
    font: "serif",
    headerAlign: "center",
    headerRule: true,
    headingCaps: true,
    density: 1.1,
    presets: { fontFamily: "serif", headingStyle: "uppercase" },
  },
];

export const getTemplate = (id: TemplateId | undefined): Template =>
  TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];

/** The buckets the picker filters by. A template can sit in several. */
export type TemplateCategory =
  | "classic"
  | "modern"
  | "minimal"
  | "photo"
  | "two-column"
  | "compact";

export const TEMPLATE_CATEGORIES: {
  id: TemplateCategory;
  label: string;
}[] = [
  { id: "classic", label: "Classic" },
  { id: "modern", label: "Modern" },
  { id: "minimal", label: "Minimal" },
  { id: "photo", label: "With photo" },
  { id: "two-column", label: "Two column" },
  { id: "compact", label: "Compact" },
];

/** Worked out from the descriptor rather than stored per template, so adding a
 *  template files it in the right buckets without a second list to keep up. */
export function inCategory(t: Template, category: TemplateCategory): boolean {
  switch (category) {
    case "classic":
      return t.font === "serif";
    case "modern":
      return t.font === "sans";
    // What people mean by minimal: one plain column, nothing decorative.
    case "minimal":
      return (
        t.photo === "none" &&
        t.sidebar === "none" &&
        !t.edgeStrip &&
        !t.headerBand
      );
    case "photo":
      return t.photo !== "none";
    case "two-column":
      return t.sidebar !== "none";
    case "compact":
      return t.density < 1;
  }
}

export const templatesIn = (category: TemplateCategory): Template[] =>
  TEMPLATES.filter((t) => inCategory(t, category));

/** How many columns a tag style lays out in. */
export const tagColumns = (style: TagStyle): number =>
  style === "columns-4"
    ? 4
    : style === "columns-3"
      ? 3
      : style === "columns-2"
        ? 2
        : 1;
