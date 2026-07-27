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
  /** Name over a meter bar filled to the level. */
  | "bars"
  /** One flowing line, pipe-separated. */
  | "inline";

/** What a section heading looks like. */
export type HeadingTreatment =
  /** Tinted bar behind the whole line. */
  | "band"
  /** Hairline the full width of the column. */
  | "rule"
  /** Nothing but the type. */
  | "plain"
  /** A short, thick stub under the first inch of the heading. */
  | "underline-short"
  /** Reversed out of a small solid label. */
  | "chip"
  /** A rule above and a rule below — the classic ATS look. */
  | "rules";

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  /** A few words for a gallery card, where the full description is too much. */
  short: string;

  /** Typeface personality. Overrides the font control while selected. */
  font: "serif" | "sans";

  /** A page printed dark, with every colour inverted. The accent is the page,
   *  the same way it's the rail on a dark two-column template. */
  page: "light" | "dark";

  // ---- header -----------------------------------------------------------
  /** Alignment of the name / title / contact block. */
  headerAlign: "left" | "center";
  /** Title sits beside the name in italics rather than under it. */
  headerInlineTitle: boolean;
  /** Tinted band behind the whole header. */
  headerBand: boolean;
  /** Whether that band is a wash of the accent or the accent itself. On a
   *  solid band the type flips to whichever of black or white reads on it. */
  headerBandStyle: "tint" | "accent";
  /** A ruled box drawn around the name block. */
  headerBox: boolean;
  /** Hairline under the header block. */
  headerRule: boolean;
  /** Contacts as one flowing row, or a two-column grid with icons. */
  headerContacts: "inline" | "grid";
  /** Which side an avatar sits on, if the template shows one at all. */
  photo: "none" | "left" | "right";
  photoShape: "circle" | "square";
  /** The photo runs flush to the edge of the header band, full height,
   *  instead of sitting inside the padding. Needs `headerBand`. */
  photoBleed: boolean;

  // ---- section headings -------------------------------------------------
  headingStyle: HeadingTreatment;
  headingAlign: "left" | "center";
  headingCaps: boolean;
  /** The rule takes the accent colour rather than ink. */
  headingAccentRule: boolean;
  /** Sections counted off in front of their heading — 01, 02, or ① ②. */
  headingNumber: "none" | "plain" | "circle";

  // ---- body -------------------------------------------------------------
  dates: DateStyle;
  tags: TagStyle;
  /** A rail down one side of the page carrying the shorter sections. `rule`
   *  is the same two columns with a dividing line instead of a fill. */
  sidebar: "none" | "dark" | "tint" | "rule";
  /** Which side that rail runs down. */
  sidebarSide: "left" | "right";
  /** Whether the name block sits inside the rail or spans above both columns. */
  sidebarHeader: "inside" | "above";
  /** Each entry's role reversed out of a solid chip. */
  entryTitleChip: boolean;
  /** The summary set at display size — an opening statement rather than a
   *  paragraph under a heading. */
  bigSummary: boolean;
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
  page: "light",
  headerAlign: "left",
  headerInlineTitle: false,
  headerBand: false,
  headerBandStyle: "tint",
  headerBox: false,
  headerRule: false,
  headerContacts: "inline",
  photo: "none",
  photoShape: "circle",
  photoBleed: false,
  headingStyle: "rule",
  headingAlign: "left",
  headingCaps: false,
  headingAccentRule: false,
  headingNumber: "none",
  dates: "right",
  tags: "columns-2",
  sidebar: "none",
  sidebarSide: "left",
  sidebarHeader: "above",
  entryTitleChip: false,
  bigSummary: false,
  edgeStrip: false,
  density: 1,
} satisfies Omit<
  Template,
  "id" | "name" | "description" | "short" | "presets" | "accent"
>;

export const TEMPLATES: Template[] = [
  {
    ...BASE,
    id: "ledger",
    name: "Ledger",
    description:
      "Serif type with centred headings on a soft grey bar. Formal without being stiff.",
    short: "Serif, centred banded headings.",
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
    short: "Blue headings, corporate sans.",
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
    short: "Dates in their own column.",
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
    short: "Centred small caps, very tight.",
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
    short: "Two columns with an avatar.",
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
    short: "Roomy, avatar top right.",
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
    short: "A colour strip down the edge.",
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
    short: "Dark rail carrying the photo.",
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
    short: "Grey masthead with an avatar.",
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
    short: "Tight leading, four skill columns.",
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
    short: "Centred serif, one column.",
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
    short: "Serif header, two skill columns.",
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
    description:
      "Left-aligned header with underlined section rules. Safe everywhere.",
    short: "Underlined headings. Safe anywhere.",
    presets: { fontFamily: "sans", headingStyle: "underline" },
  },
  {
    ...BASE,
    id: "modern",
    name: "Modern",
    description: "Name on a tinted accent band, uppercase headings underneath.",
    short: "Tinted name band, caps headings.",
    headerBand: true,
    headingCaps: true,
    presets: { fontFamily: "sans", headingStyle: "uppercase" },
  },
  {
    ...BASE,
    id: "minimal",
    name: "Minimal",
    description: "No rules at all. Space does the separating. Lots of white.",
    short: "No rules. Lots of white.",
    headingStyle: "plain",
    density: 1.3,
    presets: { fontFamily: "sans", headingStyle: "plain" },
  },
  {
    ...BASE,
    id: "sidebar",
    name: "Sidebar",
    description:
      "Contact and skills in a tinted rail, history in the main column.",
    short: "Tinted rail for contact and skills.",
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
    short: "Print serif, centred header.",
    font: "serif",
    headerAlign: "center",
    headerRule: true,
    headingCaps: true,
    density: 1.1,
    presets: { fontFamily: "serif", headingStyle: "uppercase" },
  },

  /* ------------------------------------------------------------------------
     The city set.

     Fifteen more layouts, each built out of the vocabulary above rather than
     as its own renderer — so they inherit every fix the others get, and the
     Customize panel keeps working on all of them. A few of the shapes here
     needed new words (a solid header band, a rail on the right, meter bars,
     numbered headings, a dark page); those live in the descriptor above and
     are available to every template, old and new.
     --------------------------------------------------------------------- */

  {
    ...BASE,
    id: "amsterdam",
    name: "Amsterdam",
    description:
      "A ruled box around the name, a soft grey rail for the details, and dotted skill meters. Formal and very easy to scan.",
    short: "Boxed name, grey rail.",
    headerAlign: "center",
    headerBox: true,
    headingCaps: true,
    sidebar: "tint",
    tags: "dots",
    accent: "#1f2937",
    presets: { fontFamily: "sans", headingStyle: "uppercase" },
  },
  {
    ...BASE,
    id: "berlin",
    name: "Berlin",
    description:
      "Two columns split by a hairline, headings stubbed with a short heavy rule, skills as meter bars. Industrial and confident.",
    short: "Hairline split, meter bars.",
    headingStyle: "underline-short",
    headingCaps: true,
    sidebar: "rule",
    tags: "bars",
    dates: "right-inline",
    accent: "#111827",
    presets: { fontFamily: "sans", headingStyle: "uppercase" },
  },
  {
    ...BASE,
    id: "chicago",
    name: "Chicago",
    description:
      "Printed dark, with a serif name at display size and the profile opening the page. The accent is the paper here, so changing it repaints the whole thing.",
    short: "Dark page, display serif.",
    font: "serif",
    page: "dark",
    photo: "left",
    headerInlineTitle: true,
    headingCaps: true,
    headingStyle: "plain",
    bigSummary: true,
    tags: "columns-3",
    density: 1.05,
    accent: "#141a2b",
    presets: { fontFamily: "serif", headingStyle: "uppercase" },
  },
  {
    ...BASE,
    id: "copenhagen",
    name: "Copenhagen",
    description:
      "A warm band across the top carrying the photo and contacts, then the profile in large type. Editorial without shouting.",
    short: "Warm band, display profile.",
    photo: "left",
    photoShape: "square",
    headerBand: true,
    headerContacts: "grid",
    headingStyle: "plain",
    bigSummary: true,
    tags: "columns-3",
    accent: "#8c6d52",
    presets: { fontFamily: "sans", headingStyle: "plain" },
  },
  {
    ...BASE,
    id: "dublin",
    name: "Dublin",
    description:
      "A deep green rail holding the photo, the details and the skill meters, with serif headings in the light column.",
    short: "Green rail, serif headings.",
    font: "serif",
    photo: "left",
    sidebar: "dark",
    sidebarHeader: "inside",
    headingStyle: "plain",
    tags: "bars",
    density: 0.95,
    accent: "#14453d",
    presets: { fontFamily: "serif", headingStyle: "plain" },
  },
  {
    ...BASE,
    id: "helsinki",
    name: "Helsinki",
    description:
      "Blue headings between two rules, contacts on one line, four columns of skills. The straightest read a parser can get.",
    short: "Ruled blue headings, ATS-first.",
    photo: "right",
    photoShape: "square",
    headingStyle: "rules",
    headingCaps: true,
    headingAccentRule: true,
    dates: "right-inline",
    tags: "columns-4",
    accent: "#2f6fd0",
    presets: { fontFamily: "sans", headingStyle: "uppercase" },
  },
  {
    ...BASE,
    id: "madrid",
    name: "Madrid",
    description:
      "A full-strength colour band with the photo flush against it, and every heading reversed out of a solid label.",
    short: "Colour band, reversed labels.",
    photo: "left",
    photoShape: "square",
    photoBleed: true,
    headerBand: true,
    headerBandStyle: "accent",
    headingStyle: "chip",
    headingCaps: true,
    tags: "bars",
    accent: "#f5c518",
    presets: { fontFamily: "sans", headingStyle: "uppercase" },
  },
  {
    ...BASE,
    id: "newyork",
    name: "New York",
    description:
      "A centred masthead over two columns divided by a hairline. Wide letter-spacing and meter bars down the side.",
    short: "Centred masthead, split columns.",
    headerAlign: "center",
    photo: "left",
    photoShape: "square",
    headingCaps: true,
    sidebar: "rule",
    tags: "bars",
    accent: "#111827",
    presets: { fontFamily: "sans", headingStyle: "uppercase" },
  },
  {
    ...BASE,
    id: "rome",
    name: "Rome",
    description:
      "Numbered headings in outlined circles, a display serif name, and dotted skill meters. Unhurried and a little grand.",
    short: "Numbered circles, display serif.",
    font: "serif",
    photo: "right",
    photoShape: "square",
    headingStyle: "plain",
    headingCaps: true,
    headingNumber: "circle",
    tags: "dots",
    density: 1.1,
    accent: "#1f2937",
    presets: { fontFamily: "serif", headingStyle: "uppercase" },
  },
  {
    ...BASE,
    id: "santiago",
    name: "Santiago",
    description:
      "Centred serif masthead between rules, grey banded headings, skills on one line. The most traditional page here.",
    short: "Traditional centred serif.",
    font: "serif",
    headerAlign: "center",
    headerRule: true,
    headingStyle: "band",
    headingAlign: "center",
    headingCaps: true,
    dates: "right-inline",
    tags: "inline",
    accent: "#111827",
    presets: { fontFamily: "serif", headingStyle: "uppercase" },
  },
  {
    ...BASE,
    id: "singapore",
    name: "Singapore",
    description:
      "Sections counted off 01, 02, 03 with dates in their own column. Quiet, modern and generous with white space.",
    short: "Numbered sections, dated column.",
    headingStyle: "underline-short",
    headingCaps: true,
    headingNumber: "plain",
    dates: "left-column",
    density: 1.15,
    accent: "#111827",
    presets: { fontFamily: "sans", headingStyle: "uppercase" },
  },
  {
    ...BASE,
    id: "sydney",
    name: "Sydney",
    description:
      "The history runs down the page while a navy rail on the right carries the details and the skill meters.",
    short: "Navy rail, on the right.",
    photo: "left",
    sidebar: "dark",
    sidebarSide: "right",
    headingStyle: "plain",
    tags: "bars",
    accent: "#152a4e",
    presets: { fontFamily: "sans", headingStyle: "plain" },
  },
  {
    ...BASE,
    id: "tokyo",
    name: "Tokyo",
    description:
      "A solid colour band with a round photo, contacts on the line beneath it, and skills metered down the right.",
    short: "Colour band, round photo.",
    photo: "left",
    headerBand: true,
    headerBandStyle: "accent",
    headerContacts: "grid",
    headingStyle: "plain",
    sidebar: "rule",
    sidebarSide: "right",
    tags: "bars",
    accent: "#b3202c",
    presets: { fontFamily: "sans", headingStyle: "plain" },
  },
  {
    ...BASE,
    id: "toronto",
    name: "Toronto",
    description:
      "A square photo beside an oversized name, roles reversed out of solid chips, and a tinted rail of shorter sections.",
    short: "Reversed role chips.",
    photo: "left",
    photoShape: "square",
    headingStyle: "plain",
    sidebar: "tint",
    sidebarSide: "right",
    entryTitleChip: true,
    tags: "dots",
    accent: "#1f2937",
    presets: { fontFamily: "sans", headingStyle: "plain" },
  },
  {
    ...BASE,
    id: "vienna",
    name: "Vienna",
    description:
      "A bright band across the top with the photo let into it, and a quiet column of metered skills alongside the history.",
    short: "Bright band, metered rail.",
    photo: "left",
    photoShape: "square",
    photoBleed: true,
    headerBand: true,
    headerBandStyle: "accent",
    headingStyle: "plain",
    sidebar: "rule",
    tags: "bars",
    accent: "#3ddc97",
    presets: { fontFamily: "sans", headingStyle: "plain" },
  },
];

export const getTemplate = (id: TemplateId | undefined): Template =>
  TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];

/** Picking a template also moves the settings it has an opinion about. Applied
 *  to a draft in place, so both the Customize panel and the mobile setup flow
 *  choose a template the same way. */
export function applyTemplate(settings: ResumeSettings, t: Template) {
  settings.template = t.id;
  settings.fontFamily = t.presets.fontFamily;
  settings.headingStyle = t.presets.headingStyle;
  // Each template was designed around an accent. It stays a setting — the
  // colour swatches in Customize still override it.
  if (t.accent) settings.accent = t.accent;
}

/** The buckets the picker filters by. A template can sit in several. */
export type TemplateCategory =
  "ats" | "classic" | "modern" | "minimal" | "photo" | "two-column" | "compact";

export const TEMPLATE_CATEGORIES: {
  id: TemplateCategory;
  label: string;
}[] = [
  { id: "ats", label: "ATS-safe" },
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
    // Every template exports real text, but a sidebar is the one thing that can
    // make a parser read the page out of order — so a single column is what
    // "safe" means here.
    // A dark page is the other thing a parser can trip on — the text is real
    // either way, but "safe" here means nothing between it and the reader.
    case "ats":
      return t.sidebar === "none" && !t.edgeStrip && t.page === "light";
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
        !t.headerBand &&
        t.page === "light" &&
        t.headingStyle !== "chip"
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

/** How many columns a tag style lays out in. Meter bars set their own — they
 *  need the width, and how much of it depends on where they land. */
export const tagColumns = (style: TagStyle): number =>
  style === "columns-4"
    ? 4
    : style === "columns-3"
      ? 3
      : style === "columns-2"
        ? 2
        : 1;
