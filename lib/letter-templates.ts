// The cover letter designs.
//
// Same arrangement as lib/templates.ts: a template is a set of layout
// decisions, not a renderer of its own. CoverLetterPreview reads the
// descriptor and lays the same letter out accordingly, so adding a design is
// adding a row here — and the editor preview, the dashboard thumbnail and the
// printed PDF can never drift apart, because they are all that one component.
//
// The Customize panel's settings — accent, typeface, size, spacing, margins —
// stay user-owned on top of whichever template is selected.

import type { CoverLetterSettings, LetterTemplateId } from "./types";

/** How the sender's block sits at the top of the page. */
export type LetterHeaderLayout =
  /** Name, title and contacts stacked in a block. The business-letter default. */
  | "stacked"
  /** Painted edge to edge in the accent, type reversed out of it. */
  | "banner"
  /** One quiet line — a name and a contact row, nothing else. */
  | "minimal"
  /** Name and title on one side, contacts against the other. */
  | "split"
  /** The whole block inside a ruled box. */
  | "boxed"
  /** A solid accent panel behind the name, contacts in a tinted panel beside
   *  it, both running to the edge of the sheet. */
  | "block"
  /** Name at the top, contacts moved to the foot of the page — a letterhead
   *  that signs off rather than announcing itself twice. */
  | "footer";

/** How the name itself is set. */
export type LetterNameStyle =
  /** Large and bold, tight. */
  | "bold"
  /** Oversized caps at display size. */
  | "display"
  /** Caps, light, widely letter-spaced. The formal engraved look. */
  | "tracked";

/** What sits under the header block. */
export type LetterRule = "none" | "hairline" | "thick" | "accent";

/** Decoration at the edge of the sheet. Purely visual — nothing prints on top
 *  of it, and every one of them leaves the text block alone. */
export type LetterEdge =
  | "none"
  /** A hairline down the inner edge of the margin. */
  | "rule"
  /** A solid accent band down the side of the page. */
  | "strip"
  /** A thin ruled border inset from all four sides. */
  | "frame"
  /** Two nested rules, the outer heavier. */
  | "double-frame"
  /** Curved shapes at the top and bottom corners. */
  | "wave"
  /** A block in two opposite corners. */
  | "corner"
  /** A bar across the very top of the sheet. */
  | "band-top"
  /** Bars across the top and the bottom. */
  | "band-both"
  /** A triangle filling one corner. */
  | "diagonal"
  /** A column of dots down the margin. */
  | "dots"
  /** A tinted wash behind the top of the page, under the header. */
  | "wash"
  /** Short right-angle marks in opposite corners, like crop marks. */
  | "notch";

/** The subject line's treatment. */
export type LetterSubject = "plain" | "caps" | "chip";

/** An initials mark beside the name. */
export type LetterMonogram = "none" | "circle" | "square" | "plain";

/** How the sender's contact details set inside the header. */
export type LetterContacts =
  /** One flowing dot-separated row. */
  | "inline"
  /** One per line. */
  | "stacked"
  /** One per line inside a tinted panel. */
  | "boxed"
  /** One per line, separated by hairlines. */
  | "ruled";

/** The set a design was drawn as part of. Every design belongs to exactly one,
 *  which is what makes it something you can read a list by — unlike the
 *  categories below, which overlap on purpose. */
export type LetterFamily =
  | "essential"
  | "plain"
  | "stationery"
  | "studio"
  | "colour"
  | "edge"
  | "correspondence"
  | "type";

export const LETTER_FAMILIES: {
  id: LetterFamily;
  label: string;
  blurb: string;
}[] = [
  {
    id: "essential",
    label: "The essentials",
    blurb:
      "The designs most letters want: a plain header, a band, a rule, a quiet line.",
  },
  {
    id: "plain",
    label: "The plain set",
    blurb:
      "One column, no decoration, nothing between the reader and the words.",
  },
  {
    id: "stationery",
    label: "The stationery set",
    blurb:
      "Serif, engraved, ruled and framed — what a letter looked like when it was printed rather than sent.",
  },
  {
    id: "studio",
    label: "The studio set",
    blurb: "Sans at scale: display names, solid blocks, chips and bars.",
  },
  {
    id: "colour",
    label: "The colour set",
    blurb:
      "Tinted and dark papers, where the accent stops being a detail and becomes the sheet.",
  },
  {
    id: "edge",
    label: "The edge set",
    blurb:
      "One decorative move each, made at the edge of the sheet where it can't get in the way of a word.",
  },
  {
    id: "correspondence",
    label: "The correspondence set",
    blurb:
      "Designs that move the furniture of a letter — the greeting, the contacts, the sign-off.",
  },
  {
    id: "type",
    label: "The type set",
    blurb:
      "Typography only: how the name is cut, how far apart the lines sit, whether the first line steps in.",
  },
];

export interface LetterTemplate {
  id: LetterTemplateId;
  family: LetterFamily;
  name: string;
  description: string;
  /** A few words for a picker, where the full description is too much. */
  short: string;

  /** Typeface personality — what the design was drawn for. The Customize
   *  panel's font control still wins; picking a template writes `presets`
   *  into settings rather than overriding them at render time. */
  font: "serif" | "sans";

  /** The paper. `tint` washes it in a hint of the accent; `dark` prints the
   *  sheet in the accent itself and inverts everything on it. */
  page: "light" | "tint" | "dark";

  header: LetterHeaderLayout;
  /** Alignment of the header block. Ignored by layouts that place the two
   *  halves themselves — `split` and `block`. */
  align: "left" | "center";
  nameStyle: LetterNameStyle;
  /** The sender's own job title in tracked capitals. */
  titleCaps: boolean;
  monogram: LetterMonogram;
  contacts: LetterContacts;
  rule: LetterRule;
  edge: LetterEdge;

  /** The date set across from the recipient rather than above it. */
  dateAlign: "left" | "right";
  /** Body paragraphs justified instead of flush left. */
  justify: boolean;
  /** First lines indented, the way a typed letter used to be. */
  indent: boolean;
  subject: LetterSubject;
  greeting: "plain" | "bold" | "display";
  /** The typed name under the sign-off, set as a hand would write it. */
  signature: "plain" | "script";
  /** A rule across the page above the sign-off, with the name under it at
   *  display size — the letter closing the way it opened. */
  signOffBar: boolean;
  /** Multiplies the gaps between the blocks of the letter. */
  density: number;

  /** The accent this design was drawn around. Applied when it's picked, and
   *  still a setting afterwards. */
  accent: string;
  /** Applied to settings when the template is picked. */
  presets: Pick<CoverLetterSettings, "fontFamily">;
}

/** Everything a template doesn't say otherwise. */
const BASE = {
  font: "sans",
  page: "light",
  header: "stacked",
  align: "left",
  nameStyle: "bold",
  titleCaps: false,
  monogram: "none",
  contacts: "inline",
  rule: "accent",
  edge: "none",
  dateAlign: "left",
  justify: false,
  indent: false,
  subject: "plain",
  greeting: "plain",
  signature: "plain",
  signOffBar: false,
  density: 1,
} satisfies Omit<
  LetterTemplate,
  "id" | "family" | "name" | "description" | "short" | "accent" | "presets"
>;

export const LETTER_TEMPLATES: LetterTemplate[] = [
  {
    ...BASE,
    id: "classic",
    family: "essential",
    name: "Classic",
    description:
      "Name, title and contacts stacked at the top over an accent rule. The plain business letter, and the safest thing to send anyone.",
    short: "Stacked header, accent rule.",
    accent: "#2563eb",
    presets: { fontFamily: "sans" },
  },
  {
    ...BASE,
    id: "banner",
    family: "essential",
    name: "Banner",
    description:
      "The header painted edge to edge in your accent colour, type reversed out of it. Pairs a letter to a resume with a banded header.",
    short: "Full-width accent band.",
    header: "banner",
    rule: "none",
    accent: "#2563eb",
    presets: { fontFamily: "inter" },
  },
  {
    ...BASE,
    id: "note",
    family: "essential",
    name: "Note",
    description:
      "A name, a single contact line and then the letter. For when the resume behind it already carries your details, or the whole thing is going into a paste box.",
    short: "One quiet line, then the letter.",
    header: "minimal",
    rule: "none",
    accent: "#0f172a",
    presets: { fontFamily: "sans" },
  },
  {
    ...BASE,
    id: "bureau",
    family: "essential",
    name: "Bureau",
    description:
      "Name and title on the left, contacts against the right, a heavy rule under both, and the date set across from the company. Formal and very legible.",
    short: "Name left, contacts right, heavy rule.",
    header: "split",
    rule: "thick",
    dateAlign: "right",
    subject: "caps",
    accent: "#111827",
    presets: { fontFamily: "inter" },
  },
  {
    ...BASE,
    id: "copperplate",
    family: "essential",
    name: "Copperplate",
    description:
      "Letter-spaced capitals in a garamond over a hairline, with a rule running down the margin. The engraved stationery look.",
    short: "Tracked caps, ruled margin.",
    font: "serif",
    nameStyle: "tracked",
    rule: "hairline",
    edge: "rule",
    accent: "#1f2937",
    presets: { fontFamily: "cormorant-garamond" },
  },
  {
    ...BASE,
    id: "column",
    family: "essential",
    name: "Column",
    description:
      "The name reversed out of a solid block with your contacts in a panel beside it, both running to the edge of the sheet. The strongest letterhead here.",
    short: "Accent block and contact panel.",
    header: "block",
    rule: "none",
    accent: "#1d4e79",
    presets: { fontFamily: "work-sans" },
  },
  {
    ...BASE,
    id: "emblem",
    family: "essential",
    name: "Emblem",
    description:
      "A centred header inside its own box, with a thin border drawn round the page. Ceremonial without being fussy.",
    short: "Centred box inside a page border.",
    font: "serif",
    header: "boxed",
    align: "center",
    nameStyle: "tracked",
    rule: "none",
    edge: "frame",
    accent: "#3f6152",
    presets: { fontFamily: "lora" },
  },
  {
    ...BASE,
    id: "tide",
    family: "essential",
    name: "Tide",
    description:
      "Curved shapes across the top and bottom corners, with your contacts printed at the foot rather than the head. Soft, and unmistakably designed.",
    short: "Curved corners, contacts at the foot.",
    header: "footer",
    rule: "none",
    edge: "wave",
    subject: "caps",
    accent: "#4c4159",
    presets: { fontFamily: "dm-sans" },
  },
  {
    ...BASE,
    id: "headline",
    family: "essential",
    name: "Headline",
    description:
      "The name at poster size on tinted paper, the role in a chip, and a bar across the foot that signs off in the same type. Built to be remembered.",
    short: "Display name, tinted paper, signing bar.",
    header: "split",
    nameStyle: "display",
    page: "tint",
    rule: "none",
    subject: "chip",
    signOffBar: true,
    accent: "#111827",
    presets: { fontFamily: "montserrat" },
  },
  {
    ...BASE,
    id: "ribbon",
    family: "essential",
    name: "Ribbon",
    description:
      "A solid band of colour down the edge of the page and nothing else — the whole design in one stroke, and the text left entirely alone.",
    short: "Accent band down the edge.",
    rule: "none",
    edge: "strip",
    accent: "#0d9488",
    presets: { fontFamily: "work-sans" },
  },
  {
    ...BASE,
    id: "press",
    family: "essential",
    name: "Press",
    description:
      "A centred serif header over a hairline with the body justified beneath it. Reads like something typeset rather than typed.",
    short: "Centred serif, justified body.",
    font: "serif",
    align: "center",
    rule: "hairline",
    justify: true,
    accent: "#0f172a",
    presets: { fontFamily: "pt-serif" },
  },
  {
    ...BASE,
    id: "midnight",
    family: "essential",
    name: "Midnight",
    description:
      "The whole sheet printed dark with the type reversed out of it. Striking on screen, and it stays legible on paper if it ever gets there.",
    short: "Dark page, reversed type.",
    page: "dark",
    rule: "hairline",
    accent: "#17202e",
    presets: { fontFamily: "inter" },
  },
  {
    ...BASE,
    id: "gazette",
    family: "essential",
    name: "Gazette",
    description:
      "A serif split header with the date opposite the company and the body justified. The publishing-house version of a covering letter.",
    short: "Serif split header, justified.",
    font: "serif",
    header: "split",
    rule: "hairline",
    dateAlign: "right",
    justify: true,
    subject: "caps",
    accent: "#7c2d12",
    presets: { fontFamily: "source-serif" },
  },
  {
    ...BASE,
    id: "pennant",
    family: "essential",
    name: "Pennant",
    description:
      "A centred name across a full-width band, contacts under it in the same colour. Warm, and it carries at a glance.",
    short: "Centred name on a colour band.",
    header: "banner",
    align: "center",
    rule: "none",
    accent: "#b91c1c",
    presets: { fontFamily: "lato" },
  },
  {
    ...BASE,
    id: "foolscap",
    family: "essential",
    name: "Foolscap",
    description:
      "Warm tinted paper, a garamond, and a header of one line. Quiet in the way expensive stationery is quiet.",
    short: "Warm paper, one-line header.",
    font: "serif",
    header: "minimal",
    page: "tint",
    rule: "hairline",
    accent: "#8a6a3f",
    presets: { fontFamily: "eb-garamond" },
  },
  {
    ...BASE,
    id: "atrium",
    family: "essential",
    name: "Atrium",
    description:
      "A boxed header between two blocks of colour set in opposite corners, with the role in a chip. Geometric, and it holds the page square.",
    short: "Boxed header, corner blocks.",
    header: "boxed",
    rule: "none",
    edge: "corner",
    subject: "chip",
    accent: "#b45309",
    presets: { fontFamily: "ibm-plex-sans" },
  },
  /* -------------------------------------------------------------------------
     The plain set. One column, no decoration, nothing between the reader and
     the words — what to send when you don't know who's opening it.
     ------------------------------------------------------------------------- */
  {
    ...BASE,
    id: "postmark",
    family: "plain",
    name: "Postmark",
    description:
      "Contacts listed one per line under the name, over a hairline. Plain, and it never crowds a long email address.",
    short: "Contacts stacked, hairline.",
    contacts: "stacked",
    rule: "hairline",
    accent: "#1f2937",
    presets: { fontFamily: "inter" },
  },
  {
    ...BASE,
    id: "dispatch",
    family: "plain",
    name: "Dispatch",
    description:
      "No rule at all, and the role set in small capitals above the greeting. Brisk.",
    short: "No rule, role in small caps.",
    rule: "none",
    subject: "caps",
    accent: "#0f172a",
    presets: { fontFamily: "source-sans" },
  },
  {
    ...BASE,
    id: "memo",
    family: "plain",
    name: "Memo",
    description:
      "Everything pulled a little tighter, for a letter that has to share the page with something else.",
    short: "Tight spacing throughout.",
    rule: "hairline",
    subject: "caps",
    density: 0.85,
    accent: "#334155",
    presets: { fontFamily: "ibm-plex-sans" },
  },
  {
    ...BASE,
    id: "notice",
    family: "plain",
    name: "Notice",
    description:
      "The whole header centred over a hairline, the way a printed notice sets its own masthead.",
    short: "Centred header, hairline.",
    align: "center",
    rule: "hairline",
    accent: "#1e3a5f",
    presets: { fontFamily: "lato" },
  },
  {
    ...BASE,
    id: "circular",
    family: "plain",
    name: "Circular",
    description:
      "A heavy rule under the name and nothing else — one strong horizontal to hang the page from.",
    short: "One heavy rule.",
    rule: "thick",
    accent: "#111827",
    presets: { fontFamily: "work-sans" },
  },
  {
    ...BASE,
    id: "missive",
    family: "plain",
    name: "Missive",
    description:
      "Serif, justified, first lines indented. A letter that looks typed rather than composed.",
    short: "Serif, justified, indented.",
    font: "serif",
    rule: "hairline",
    justify: true,
    indent: true,
    accent: "#1f2937",
    presets: { fontFamily: "pt-serif" },
  },
  {
    ...BASE,
    id: "epistle",
    family: "plain",
    name: "Epistle",
    description:
      "A centred serif header with indented, justified paragraphs and a little more air between them.",
    short: "Centred serif, indented, open.",
    font: "serif",
    align: "center",
    rule: "hairline",
    justify: true,
    indent: true,
    density: 1.15,
    accent: "#374151",
    presets: { fontFamily: "libre-baskerville" },
  },
  {
    ...BASE,
    id: "regards",
    family: "plain",
    name: "Regards",
    description:
      "The greeting set in bold so the first line of the letter is the first thing read.",
    short: "Bold greeting, no rule.",
    rule: "none",
    greeting: "bold",
    accent: "#0d9488",
    presets: { fontFamily: "dm-sans" },
  },
  {
    ...BASE,
    id: "courtesy",
    family: "plain",
    name: "Courtesy",
    description:
      "Contact details separated by hairlines, one to a line — a small, deliberate piece of order at the top.",
    short: "Contacts on ruled lines.",
    contacts: "ruled",
    rule: "hairline",
    accent: "#475569",
    presets: { fontFamily: "nunito-sans" },
  },
  {
    ...BASE,
    id: "bond",
    family: "plain",
    name: "Bond",
    description:
      "Wide spacing on plain paper. For a short letter that would otherwise sit in the top third of the sheet.",
    short: "Generously spaced, plain.",
    rule: "none",
    density: 1.3,
    accent: "#1e293b",
    presets: { fontFamily: "open-sans" },
  },
  {
    ...BASE,
    id: "ream",
    family: "plain",
    name: "Ream",
    description:
      "Contacts stacked under the name and the date set opposite the company, so the top of the page reads across.",
    short: "Stacked contacts, date opposite.",
    contacts: "stacked",
    dateAlign: "right",
    accent: "#2563eb",
    presets: { fontFamily: "inter" },
  },
  {
    ...BASE,
    id: "sheaf",
    family: "plain",
    name: "Sheaf",
    description:
      "Justified body under a hairline. Even edges on both sides, which reads as care taken.",
    short: "Justified, hairline.",
    rule: "hairline",
    justify: true,
    accent: "#3f6152",
    presets: { fontFamily: "source-sans" },
  },
  {
    ...BASE,
    id: "clerk",
    family: "plain",
    name: "Clerk",
    description:
      "Your title in tracked capitals and the role in the same, so the two ends of the page rhyme.",
    short: "Tracked caps, twice over.",
    titleCaps: true,
    rule: "hairline",
    subject: "caps",
    accent: "#0f172a",
    presets: { fontFamily: "ibm-plex-sans" },
  },
  {
    ...BASE,
    id: "secretary",
    family: "plain",
    name: "Secretary",
    description:
      "Contacts in a tinted panel under the name — grouped, so the eye takes them in one go and moves on.",
    short: "Contacts in a tinted panel.",
    contacts: "boxed",
    rule: "none",
    accent: "#1d4e79",
    presets: { fontFamily: "work-sans" },
  },

  /* -------------------------------------------------------------------------
     The stationery set. Serif, engraved, ruled and framed — what a letter
     looked like when it was printed rather than sent.
     ------------------------------------------------------------------------- */
  {
    ...BASE,
    id: "letterpress",
    family: "stationery",
    name: "Letterpress",
    description:
      "Tracked capitals over a heavy rule, inside a border. Every element pressed into the page.",
    short: "Tracked caps, heavy rule, border.",
    font: "serif",
    nameStyle: "tracked",
    rule: "thick",
    edge: "frame",
    accent: "#1c1917",
    presets: { fontFamily: "libre-baskerville" },
  },
  {
    ...BASE,
    id: "deckle",
    family: "stationery",
    name: "Deckle",
    description:
      "A centred name in tracked capitals inside two nested rules. Formal to the point of ceremony.",
    short: "Centred caps, double border.",
    font: "serif",
    align: "center",
    nameStyle: "tracked",
    rule: "none",
    edge: "double-frame",
    accent: "#44403c",
    presets: { fontFamily: "cormorant-garamond" },
  },
  {
    ...BASE,
    id: "watermark",
    family: "stationery",
    name: "Watermark",
    description:
      "One line of a header over a pale wash, and the name signed rather than typed at the foot.",
    short: "Washed header, signed sign-off.",
    font: "serif",
    header: "minimal",
    rule: "none",
    edge: "wash",
    signature: "script",
    accent: "#475569",
    presets: { fontFamily: "eb-garamond" },
  },
  {
    ...BASE,
    id: "gilt",
    family: "stationery",
    name: "Gilt",
    description:
      "Initials above a centred, boxed header inside a page border. The most decorated thing here.",
    short: "Initials, boxed and bordered.",
    font: "serif",
    header: "boxed",
    align: "center",
    nameStyle: "tracked",
    monogram: "plain",
    rule: "none",
    edge: "frame",
    accent: "#8a6a3f",
    presets: { fontFamily: "cormorant-garamond" },
  },
  {
    ...BASE,
    id: "emboss",
    family: "stationery",
    name: "Emboss",
    description:
      "Your initials in a solid square beside the name, over a hairline. A mark rather than a logo.",
    short: "Square initials, hairline.",
    font: "serif",
    monogram: "square",
    rule: "hairline",
    accent: "#1f2937",
    presets: { fontFamily: "source-serif" },
  },
  {
    ...BASE,
    id: "deboss",
    family: "stationery",
    name: "Deboss",
    description:
      "Initials in a filled circle inside a ruled box. Quiet, and it holds together at any size.",
    short: "Round initials in a box.",
    font: "serif",
    header: "boxed",
    monogram: "circle",
    rule: "none",
    accent: "#3f3f46",
    presets: { fontFamily: "lora" },
  },
  {
    ...BASE,
    id: "signet",
    family: "stationery",
    name: "Signet",
    description:
      "A centred monogram over a tracked name, framed. Reads like something sealed before it was sent.",
    short: "Centred monogram, framed.",
    font: "serif",
    align: "center",
    nameStyle: "tracked",
    monogram: "circle",
    rule: "hairline",
    edge: "frame",
    accent: "#7f1d1d",
    presets: { fontFamily: "eb-garamond" },
  },
  {
    ...BASE,
    id: "seal",
    family: "stationery",
    name: "Seal",
    description:
      "A boxed header with a monogram, between two right-angle marks set into opposite corners.",
    short: "Monogram, corner marks.",
    font: "serif",
    header: "boxed",
    monogram: "circle",
    rule: "none",
    edge: "notch",
    accent: "#7c2d12",
    presets: { fontFamily: "pt-serif" },
  },
  {
    ...BASE,
    id: "cachet",
    family: "stationery",
    name: "Cachet",
    description:
      "Initials and name on the left, contacts against the right, a hairline under both.",
    short: "Monogram left, contacts right.",
    font: "serif",
    header: "split",
    monogram: "square",
    contacts: "stacked",
    rule: "hairline",
    accent: "#334155",
    presets: { fontFamily: "source-serif" },
  },
  {
    ...BASE,
    id: "escutcheon",
    family: "stationery",
    name: "Escutcheon",
    description:
      "A centred monogram, a boxed header and two nested rules round the sheet. Full ceremony.",
    short: "Monogram, box, double border.",
    font: "serif",
    header: "boxed",
    align: "center",
    monogram: "square",
    rule: "none",
    edge: "double-frame",
    accent: "#1e3a5f",
    presets: { fontFamily: "libre-baskerville" },
  },
  {
    ...BASE,
    id: "quarto",
    family: "stationery",
    name: "Quarto",
    description:
      "Justified serif with indented first lines and a little extra leading. Book-like.",
    short: "Justified serif, indented.",
    font: "serif",
    rule: "hairline",
    justify: true,
    indent: true,
    density: 1.1,
    accent: "#292524",
    presets: { fontFamily: "crimson-pro" },
  },
  {
    ...BASE,
    id: "octavo",
    family: "stationery",
    name: "Octavo",
    description:
      "The same book setting, centred at the top and pulled in tighter. Small and dense.",
    short: "Centred, dense, indented.",
    font: "serif",
    align: "center",
    rule: "hairline",
    justify: true,
    indent: true,
    density: 0.9,
    accent: "#292524",
    presets: { fontFamily: "crimson-pro" },
  },
  {
    ...BASE,
    id: "laid",
    family: "stationery",
    name: "Laid",
    description:
      "Tinted paper, a one-line header, and a signed name at the foot. Almost nothing on the page.",
    short: "Tinted paper, signed off.",
    font: "serif",
    header: "minimal",
    page: "tint",
    rule: "none",
    signature: "script",
    accent: "#78716c",
    presets: { fontFamily: "eb-garamond" },
  },
  {
    ...BASE,
    id: "wove",
    family: "stationery",
    name: "Wove",
    description:
      "A rule down the margin against tinted paper — one vertical, one horizontal, nothing more.",
    short: "Ruled margin, tinted paper.",
    font: "serif",
    page: "tint",
    rule: "hairline",
    edge: "rule",
    accent: "#57534e",
    presets: { fontFamily: "lora" },
  },
  {
    ...BASE,
    id: "rag",
    family: "stationery",
    name: "Rag",
    description:
      "Contacts on hairlines beside a ruled margin. Everything on this page is a line.",
    short: "Ruled contacts, ruled margin.",
    font: "serif",
    contacts: "ruled",
    rule: "none",
    edge: "rule",
    accent: "#44403c",
    presets: { fontFamily: "source-serif" },
  },
  {
    ...BASE,
    id: "onionskin",
    family: "stationery",
    name: "Onionskin",
    description:
      "A one-line header inside a thin border, with the letter set well apart from itself.",
    short: "Bordered, airy, one-line header.",
    font: "serif",
    header: "minimal",
    rule: "none",
    edge: "frame",
    density: 1.2,
    accent: "#64748b",
    presets: { fontFamily: "eb-garamond" },
  },
  {
    ...BASE,
    id: "manila",
    family: "stationery",
    name: "Manila",
    description:
      "A bar across the very top of tinted paper, and a serif under it. Filed rather than posted.",
    short: "Top bar, tinted paper.",
    font: "serif",
    page: "tint",
    rule: "none",
    edge: "band-top",
    accent: "#a16207",
    presets: { fontFamily: "bitter" },
  },
  {
    ...BASE,
    id: "tracing",
    family: "stationery",
    name: "Tracing",
    description:
      "A column of dots down the margin beside a one-line header. Light enough to almost not be there.",
    short: "Dotted margin, one-line header.",
    font: "serif",
    header: "minimal",
    rule: "none",
    edge: "dots",
    accent: "#0369a1",
    presets: { fontFamily: "lora" },
  },

  /* -------------------------------------------------------------------------
     The studio set. Sans at scale — display names, solid blocks, chips and
     bars. Loud on purpose, and meant for places where that reads as confidence.
     ------------------------------------------------------------------------- */
  {
    ...BASE,
    id: "grotesk",
    family: "studio",
    name: "Grotesk",
    description:
      "The name at display size on the left, contacts on the right, a heavy rule between that and the letter.",
    short: "Display name, heavy rule.",
    header: "split",
    nameStyle: "display",
    contacts: "stacked",
    rule: "thick",
    subject: "chip",
    accent: "#111827",
    presets: { fontFamily: "montserrat" },
  },
  {
    ...BASE,
    id: "slab",
    family: "studio",
    name: "Slab",
    description:
      "A display name over a heavy rule, stacked. The simplest way to be the biggest thing on the page.",
    short: "Display name, stacked, heavy rule.",
    nameStyle: "display",
    rule: "thick",
    accent: "#0f172a",
    presets: { fontFamily: "bitter" },
  },
  {
    ...BASE,
    id: "kicker",
    family: "studio",
    name: "Kicker",
    description:
      "A display name, the role in a chip, and the whole thing signed off across a bar at the foot.",
    short: "Chip role, signing bar.",
    header: "split",
    nameStyle: "display",
    contacts: "stacked",
    rule: "none",
    subject: "chip",
    signOffBar: true,
    accent: "#1d4ed8",
    presets: { fontFamily: "montserrat" },
  },
  {
    ...BASE,
    id: "masthead",
    family: "studio",
    name: "Masthead",
    description:
      "A bar across the top of the sheet and a display name under it. Front page, not correspondence.",
    short: "Top bar, display name.",
    nameStyle: "display",
    rule: "thick",
    edge: "band-top",
    accent: "#b91c1c",
    presets: { fontFamily: "work-sans" },
  },
  {
    ...BASE,
    id: "standfirst",
    family: "studio",
    name: "Standfirst",
    description:
      "A display name and a greeting set large enough to be read as an opening line rather than a formality.",
    short: "Display name, large greeting.",
    header: "split",
    nameStyle: "display",
    contacts: "stacked",
    rule: "none",
    greeting: "display",
    accent: "#0f766e",
    presets: { fontFamily: "dm-sans" },
  },
  {
    ...BASE,
    id: "byline",
    family: "studio",
    name: "Byline",
    description:
      "Name against contacts, the role in a chip below. Compact, and every element has an edge.",
    short: "Split header, chip role.",
    header: "split",
    contacts: "stacked",
    rule: "hairline",
    subject: "chip",
    accent: "#4338ca",
    presets: { fontFamily: "inter" },
  },
  {
    ...BASE,
    id: "dateline",
    family: "studio",
    name: "Dateline",
    description:
      "Title and role both in tracked capitals, with the date set across from the company.",
    short: "Tracked caps, date opposite.",
    header: "split",
    titleCaps: true,
    contacts: "stacked",
    rule: "thick",
    dateAlign: "right",
    subject: "caps",
    accent: "#171717",
    presets: { fontFamily: "ibm-plex-sans" },
  },
  {
    ...BASE,
    id: "typeset",
    family: "studio",
    name: "Typeset",
    description:
      "A display name boxed at the top with the role reversed out of a chip underneath.",
    short: "Boxed display name, chip role.",
    header: "boxed",
    nameStyle: "display",
    rule: "none",
    subject: "chip",
    accent: "#c2410c",
    presets: { fontFamily: "work-sans" },
  },
  {
    ...BASE,
    id: "matrix",
    family: "studio",
    name: "Matrix",
    description:
      "The solid block letterhead with the role in a chip below it. Two blocks of colour, nothing wasted.",
    short: "Colour block, chip role.",
    header: "block",
    rule: "none",
    subject: "chip",
    accent: "#0f766e",
    presets: { fontFamily: "ibm-plex-sans" },
  },
  {
    ...BASE,
    id: "punchcut",
    family: "studio",
    name: "Punchcut",
    description:
      "Initials reversed out of the block beside your name. The mark and the letterhead are the same object.",
    short: "Monogram inside the block.",
    header: "block",
    monogram: "square",
    rule: "none",
    accent: "#312e81",
    presets: { fontFamily: "work-sans" },
  },
  {
    ...BASE,
    id: "stylus",
    family: "studio",
    name: "Stylus",
    description:
      "A display name across a full-width band, with the role chipped below it.",
    short: "Banded display name.",
    header: "banner",
    nameStyle: "display",
    rule: "none",
    subject: "chip",
    accent: "#7c3aed",
    presets: { fontFamily: "montserrat" },
  },
  {
    ...BASE,
    id: "tabula",
    family: "studio",
    name: "Tabula",
    description:
      "The block letterhead with your title in tracked capitals — the panel version of a name plate.",
    short: "Colour block, tracked title.",
    header: "block",
    titleCaps: true,
    contacts: "stacked",
    rule: "none",
    accent: "#155e75",
    presets: { fontFamily: "dm-sans" },
  },
  {
    ...BASE,
    id: "plaque",
    family: "studio",
    name: "Plaque",
    description:
      "A boxed header with a square monogram and a block of colour set into the corner.",
    short: "Boxed, monogram, corner block.",
    header: "boxed",
    monogram: "square",
    rule: "none",
    edge: "corner",
    accent: "#a21caf",
    presets: { fontFamily: "work-sans" },
  },
  {
    ...BASE,
    id: "tablet",
    family: "studio",
    name: "Tablet",
    description:
      "The block letterhead held between bars at the top and bottom of the sheet.",
    short: "Colour block between bars.",
    header: "block",
    rule: "none",
    edge: "band-both",
    accent: "#1e40af",
    presets: { fontFamily: "inter" },
  },
  {
    ...BASE,
    id: "stele",
    family: "studio",
    name: "Stele",
    description:
      "A centred monogram and name reversed out of a full-width band. Symmetrical and immovable.",
    short: "Centred monogram on a band.",
    header: "banner",
    align: "center",
    monogram: "circle",
    rule: "none",
    accent: "#065f46",
    presets: { fontFamily: "lato" },
  },
  {
    ...BASE,
    id: "frieze",
    family: "studio",
    name: "Frieze",
    description:
      "A band with the title in tracked capitals under the name. Even weight all the way across.",
    short: "Banded, tracked title.",
    header: "banner",
    titleCaps: true,
    rule: "none",
    accent: "#9a3412",
    presets: { fontFamily: "nunito-sans" },
  },
  {
    ...BASE,
    id: "architrave",
    family: "studio",
    name: "Architrave",
    description:
      "A boxed header with a tracked title, inside two nested rules. Built rather than laid out.",
    short: "Boxed and double-bordered.",
    header: "boxed",
    titleCaps: true,
    rule: "none",
    edge: "double-frame",
    accent: "#1f2937",
    presets: { fontFamily: "ibm-plex-sans" },
  },
  {
    ...BASE,
    id: "reglet",
    family: "studio",
    name: "Reglet",
    description:
      "Split header, heavy rule, everything pulled tight. For a letter that needs to say a lot on one page.",
    short: "Split header, tight, heavy rule.",
    header: "split",
    contacts: "stacked",
    rule: "thick",
    density: 0.85,
    accent: "#0f172a",
    presets: { fontFamily: "source-sans" },
  },

  /* -------------------------------------------------------------------------
     The colour set. Tinted and dark papers — the accent stops being a detail
     and becomes the sheet.
     ------------------------------------------------------------------------- */
  {
    ...BASE,
    id: "inkstand",
    family: "colour",
    name: "Inkstand",
    description:
      "A dark page with your initials in a circle beside the name. Reversed type throughout.",
    short: "Dark page, round monogram.",
    page: "dark",
    monogram: "circle",
    rule: "hairline",
    accent: "#111827",
    presets: { fontFamily: "inter" },
  },
  {
    ...BASE,
    id: "nib",
    family: "colour",
    name: "Nib",
    description:
      "Dark paper, split header, the role reversed out of a chip. Sharp on screen.",
    short: "Dark page, split header, chip.",
    page: "dark",
    header: "split",
    contacts: "stacked",
    rule: "none",
    subject: "chip",
    accent: "#1e293b",
    presets: { fontFamily: "dm-sans" },
  },
  {
    ...BASE,
    id: "blotter",
    family: "colour",
    name: "Blotter",
    description:
      "The darkest page here, with a display name and nothing else competing for it.",
    short: "Dark page, display name.",
    page: "dark",
    nameStyle: "display",
    rule: "hairline",
    accent: "#0b1220",
    presets: { fontFamily: "montserrat" },
  },
  {
    ...BASE,
    id: "cipher",
    family: "colour",
    name: "Cipher",
    description:
      "A dark sheet with one line of a header and a lot of space. Quiet and unusual at once.",
    short: "Dark page, one-line header.",
    page: "dark",
    header: "minimal",
    rule: "none",
    density: 1.15,
    accent: "#18181b",
    presets: { fontFamily: "ibm-plex-sans" },
  },
  {
    ...BASE,
    id: "archive",
    family: "colour",
    name: "Archive",
    description:
      "A boxed header on dark paper inside a thin border. Everything twice contained.",
    short: "Dark page, boxed and bordered.",
    page: "dark",
    header: "boxed",
    rule: "none",
    edge: "frame",
    accent: "#1c1917",
    presets: { fontFamily: "source-sans" },
  },
  {
    ...BASE,
    id: "chambers",
    family: "colour",
    name: "Chambers",
    description:
      "A dark serif page with the date set across from the company. Formal, and unlike anything else in the stack.",
    short: "Dark serif, date opposite.",
    font: "serif",
    page: "dark",
    header: "split",
    contacts: "stacked",
    rule: "hairline",
    dateAlign: "right",
    accent: "#14213d",
    presets: { fontFamily: "source-serif" },
  },
  {
    ...BASE,
    id: "writ",
    family: "colour",
    name: "Writ",
    description:
      "A centred serif header on a dark sheet, tracked and spaced. Ceremony, inverted.",
    short: "Dark page, centred serif.",
    font: "serif",
    page: "dark",
    align: "center",
    nameStyle: "tracked",
    rule: "hairline",
    accent: "#1a2e05",
    presets: { fontFamily: "lora" },
  },
  {
    ...BASE,
    id: "rotunda",
    family: "colour",
    name: "Rotunda",
    description:
      "Tinted paper, a centred boxed header and a border round the sheet.",
    short: "Tinted, centred, bordered.",
    font: "serif",
    page: "tint",
    header: "boxed",
    align: "center",
    rule: "none",
    edge: "frame",
    accent: "#0f766e",
    presets: { fontFamily: "lora" },
  },
  {
    ...BASE,
    id: "vestibule",
    family: "colour",
    name: "Vestibule",
    description:
      "A square monogram beside the name on lightly tinted paper. Warm without being loud.",
    short: "Tinted paper, square monogram.",
    page: "tint",
    monogram: "square",
    rule: "hairline",
    accent: "#7c3aed",
    presets: { fontFamily: "work-sans" },
  },
  {
    ...BASE,
    id: "foyer",
    family: "colour",
    name: "Foyer",
    description:
      "Tinted paper with the contacts listed against the right edge. Open at the top.",
    short: "Tinted, contacts right.",
    page: "tint",
    header: "split",
    contacts: "stacked",
    rule: "none",
    accent: "#0369a1",
    presets: { fontFamily: "nunito-sans" },
  },
  {
    ...BASE,
    id: "consulate",
    family: "colour",
    name: "Consulate",
    description:
      "A centred serif header on tinted paper inside two nested rules. Diplomatic.",
    short: "Tinted, centred, double border.",
    font: "serif",
    page: "tint",
    align: "center",
    nameStyle: "tracked",
    rule: "none",
    edge: "double-frame",
    accent: "#1e3a5f",
    presets: { fontFamily: "cormorant-garamond" },
  },
  {
    ...BASE,
    id: "embassy",
    family: "colour",
    name: "Embassy",
    description:
      "A boxed serif header with a round monogram on tinted paper.",
    short: "Tinted, boxed, round monogram.",
    font: "serif",
    page: "tint",
    header: "boxed",
    monogram: "circle",
    rule: "none",
    accent: "#7f1d1d",
    presets: { fontFamily: "libre-baskerville" },
  },
  {
    ...BASE,
    id: "legation",
    family: "colour",
    name: "Legation",
    description:
      "Tinted paper, a serif split header, justified body, date opposite the company. The full formal apparatus.",
    short: "Tinted serif, justified, date opposite.",
    font: "serif",
    page: "tint",
    header: "split",
    contacts: "stacked",
    rule: "hairline",
    dateAlign: "right",
    justify: true,
    accent: "#3f6152",
    presets: { fontFamily: "pt-serif" },
  },
  {
    ...BASE,
    id: "cabinet",
    family: "colour",
    name: "Cabinet",
    description:
      "The solid block letterhead standing on tinted paper, so the panel edges soften into the sheet.",
    short: "Colour block on tinted paper.",
    page: "tint",
    header: "block",
    rule: "none",
    accent: "#334155",
    presets: { fontFamily: "inter" },
  },
  {
    ...BASE,
    id: "scriptorium",
    family: "colour",
    name: "Scriptorium",
    description:
      "Tinted paper, a one-line header, indented paragraphs and a signed name. Almost handwritten.",
    short: "Tinted, indented, signed.",
    font: "serif",
    page: "tint",
    header: "minimal",
    rule: "none",
    indent: true,
    signature: "script",
    accent: "#78350f",
    presets: { fontFamily: "eb-garamond" },
  },
  {
    ...BASE,
    id: "palimpsest",
    family: "colour",
    name: "Palimpsest",
    description:
      "A wash behind the header on paper already tinted — two layers of the same colour, barely apart.",
    short: "Washed header on tinted paper.",
    font: "serif",
    page: "tint",
    rule: "none",
    edge: "wash",
    accent: "#57534e",
    presets: { fontFamily: "crimson-pro" },
  },
  {
    ...BASE,
    id: "codicil",
    family: "colour",
    name: "Codicil",
    description:
      "A one-line serif header on tinted paper with a rule down the margin. An addendum, dressed properly.",
    short: "Tinted, one line, ruled margin.",
    font: "serif",
    page: "tint",
    header: "minimal",
    rule: "none",
    edge: "rule",
    accent: "#44403c",
    presets: { fontFamily: "source-serif" },
  },
  {
    ...BASE,
    id: "charter",
    family: "colour",
    name: "Charter",
    description:
      "Initials set plainly above a centred, boxed serif header on tinted paper.",
    short: "Tinted, centred, plain initials.",
    font: "serif",
    page: "tint",
    header: "boxed",
    align: "center",
    nameStyle: "tracked",
    monogram: "plain",
    rule: "none",
    accent: "#8a6a3f",
    presets: { fontFamily: "cormorant-garamond" },
  },

  /* -------------------------------------------------------------------------
     The edge set. One decorative move each, made at the edge of the sheet
     where it can't get in the way of a word.
     ------------------------------------------------------------------------- */
  {
    ...BASE,
    id: "envoy",
    family: "edge",
    name: "Envoy",
    description:
      "A band of colour down the edge with a split header beside it.",
    short: "Edge band, split header.",
    header: "split",
    contacts: "stacked",
    rule: "none",
    edge: "strip",
    accent: "#1d4ed8",
    presets: { fontFamily: "inter" },
  },
  {
    ...BASE,
    id: "herald",
    family: "edge",
    name: "Herald",
    description:
      "An edge band and a square monogram, so the colour appears twice and reads as deliberate.",
    short: "Edge band and monogram.",
    monogram: "square",
    rule: "none",
    edge: "strip",
    accent: "#be123c",
    presets: { fontFamily: "work-sans" },
  },
  {
    ...BASE,
    id: "crier",
    family: "edge",
    name: "Crier",
    description:
      "A bar across the top and a display name under it. Announcement first, letter second.",
    short: "Top bar, display name.",
    nameStyle: "display",
    rule: "none",
    edge: "band-top",
    accent: "#ea580c",
    presets: { fontFamily: "montserrat" },
  },
  {
    ...BASE,
    id: "stamp",
    family: "edge",
    name: "Stamp",
    description:
      "A block of colour in the corner and the role in a chip. Two squares, one page.",
    short: "Corner block, chip role.",
    rule: "hairline",
    edge: "corner",
    subject: "chip",
    accent: "#0891b2",
    presets: { fontFamily: "dm-sans" },
  },
  {
    ...BASE,
    id: "airmail",
    family: "edge",
    name: "Airmail",
    description:
      "Bars top and bottom with the date set across from the company between them.",
    short: "Bars top and bottom.",
    header: "split",
    contacts: "stacked",
    rule: "none",
    edge: "band-both",
    dateAlign: "right",
    accent: "#1e40af",
    presets: { fontFamily: "lato" },
  },
  {
    ...BASE,
    id: "postbox",
    family: "edge",
    name: "Postbox",
    description:
      "A triangle filling the top corner under a display name. The most graphic thing here.",
    short: "Corner triangle, display name.",
    nameStyle: "display",
    rule: "none",
    edge: "diagonal",
    accent: "#dc2626",
    presets: { fontFamily: "work-sans" },
  },
  {
    ...BASE,
    id: "letterbox",
    family: "edge",
    name: "Letterbox",
    description:
      "The same corner triangle over a split header, with the role in a chip.",
    short: "Corner triangle, chip role.",
    header: "split",
    contacts: "stacked",
    rule: "none",
    edge: "diagonal",
    subject: "chip",
    accent: "#0f766e",
    presets: { fontFamily: "inter" },
  },
  {
    ...BASE,
    id: "mailroom",
    family: "edge",
    name: "Mailroom",
    description:
      "A column of dots down the margin beside a plain stacked header.",
    short: "Dotted margin.",
    rule: "hairline",
    edge: "dots",
    accent: "#4f46e5",
    presets: { fontFamily: "nunito-sans" },
  },
  {
    ...BASE,
    id: "sorting",
    family: "edge",
    name: "Sorting",
    description:
      "Dots down the margin, contacts against the right edge. Order imposed on both sides at once.",
    short: "Dotted margin, contacts right.",
    header: "split",
    contacts: "stacked",
    rule: "none",
    edge: "dots",
    accent: "#0369a1",
    presets: { fontFamily: "ibm-plex-sans" },
  },
  {
    ...BASE,
    id: "delivery",
    family: "edge",
    name: "Delivery",
    description:
      "Right-angle marks set into opposite corners, like a page waiting to be trimmed.",
    short: "Corner marks.",
    rule: "hairline",
    edge: "notch",
    accent: "#334155",
    presets: { fontFamily: "source-sans" },
  },
  {
    ...BASE,
    id: "margin",
    family: "edge",
    name: "Margin",
    description:
      "A rule down the side and indented first lines — the two oldest ways of marking where the text begins.",
    short: "Ruled margin, indented.",
    rule: "none",
    edge: "rule",
    indent: true,
    accent: "#1f2937",
    presets: { fontFamily: "source-sans" },
  },
  {
    ...BASE,
    id: "gutter",
    family: "edge",
    name: "Gutter",
    description:
      "Ruled margin, justified serif, indented paragraphs. As close to a printed page as a letter gets.",
    short: "Ruled margin, justified serif.",
    font: "serif",
    rule: "none",
    edge: "rule",
    justify: true,
    indent: true,
    accent: "#292524",
    presets: { fontFamily: "crimson-pro" },
  },
  {
    ...BASE,
    id: "recto",
    family: "edge",
    name: "Recto",
    description:
      "A centred serif header inside a border on the sheet. Balanced on both axes.",
    short: "Centred serif in a border.",
    font: "serif",
    align: "center",
    rule: "hairline",
    edge: "frame",
    accent: "#3f6152",
    presets: { fontFamily: "lora" },
  },
  {
    ...BASE,
    id: "verso",
    family: "edge",
    name: "Verso",
    description:
      "Two nested rules round a plain serif header. The frame does all the talking.",
    short: "Double border, plain serif.",
    font: "serif",
    rule: "none",
    edge: "double-frame",
    accent: "#44403c",
    presets: { fontFamily: "source-serif" },
  },
  {
    ...BASE,
    id: "spread",
    family: "edge",
    name: "Spread",
    description:
      "A wash behind the top of the page with a display name sitting on it.",
    short: "Washed header, display name.",
    header: "split",
    nameStyle: "display",
    contacts: "stacked",
    rule: "none",
    edge: "wash",
    accent: "#4338ca",
    presets: { fontFamily: "montserrat" },
  },
  {
    ...BASE,
    id: "endpaper",
    family: "edge",
    name: "Endpaper",
    description:
      "A boxed serif header standing on a pale wash. Two tones of one colour, no lines.",
    short: "Boxed serif on a wash.",
    font: "serif",
    header: "boxed",
    rule: "none",
    edge: "wash",
    accent: "#7c2d12",
    presets: { fontFamily: "libre-baskerville" },
  },
  {
    ...BASE,
    id: "flyleaf",
    family: "edge",
    name: "Flyleaf",
    description:
      "One line of a header on a washed sheet, and then a great deal of nothing.",
    short: "Washed sheet, one-line header.",
    font: "serif",
    header: "minimal",
    rule: "none",
    edge: "wash",
    density: 1.2,
    accent: "#64748b",
    presets: { fontFamily: "eb-garamond" },
  },
  {
    ...BASE,
    id: "terminal",
    family: "edge",
    name: "Terminal",
    description:
      "The block letterhead with a matching square set into the corner of the page.",
    short: "Colour block and corner block.",
    header: "block",
    rule: "none",
    edge: "corner",
    accent: "#155e75",
    presets: { fontFamily: "ibm-plex-sans" },
  },
  {
    ...BASE,
    id: "finial",
    family: "edge",
    name: "Finial",
    description:
      "A centred monogram in a boxed header between two right-angle corner marks.",
    short: "Monogram, box, corner marks.",
    font: "serif",
    header: "boxed",
    align: "center",
    monogram: "circle",
    rule: "none",
    edge: "notch",
    accent: "#7f1d1d",
    presets: { fontFamily: "cormorant-garamond" },
  },
  {
    ...BASE,
    id: "swash",
    family: "edge",
    name: "Swash",
    description:
      "Curves at the corners of the sheet and a signed name at the foot. Nothing straight anywhere.",
    short: "Curved corners, signed off.",
    font: "serif",
    rule: "none",
    edge: "wave",
    signature: "script",
    accent: "#9d174d",
    presets: { fontFamily: "lora" },
  },

  /* -------------------------------------------------------------------------
     The correspondence set. Designs that move the furniture of a letter — the
     greeting, the contacts, the sign-off — rather than decorating the page.
     ------------------------------------------------------------------------- */
  {
    ...BASE,
    id: "salutation",
    family: "correspondence",
    name: "Salutation",
    description:
      "The greeting set at display size, so the letter opens on a sentence rather than a letterhead.",
    short: "Greeting at display size.",
    rule: "hairline",
    greeting: "display",
    accent: "#0f766e",
    presets: { fontFamily: "dm-sans" },
  },
  {
    ...BASE,
    id: "postscript",
    family: "correspondence",
    name: "Postscript",
    description:
      "Contacts at the foot of the page and a bar above the sign-off. Everything about you is at the bottom.",
    short: "Contacts and sign-off at the foot.",
    header: "footer",
    rule: "none",
    signOffBar: true,
    accent: "#1f2937",
    presets: { fontFamily: "inter" },
  },
  {
    ...BASE,
    id: "enclosure",
    family: "correspondence",
    name: "Enclosure",
    description:
      "A name at the top, contacts at the bottom, and a hairline holding the two ends together.",
    short: "Name up, contacts down.",
    header: "footer",
    rule: "hairline",
    accent: "#334155",
    presets: { fontFamily: "source-sans" },
  },
  {
    ...BASE,
    id: "compliments",
    family: "correspondence",
    name: "Compliments",
    description:
      "A serif with the contacts at the foot and the name signed rather than typed. A compliments slip that says something.",
    short: "Serif, contacts at the foot, signed.",
    font: "serif",
    header: "footer",
    rule: "hairline",
    signature: "script",
    accent: "#7c2d12",
    presets: { fontFamily: "eb-garamond" },
  },
  {
    ...BASE,
    id: "overture",
    family: "correspondence",
    name: "Overture",
    description:
      "A large greeting over the role in a chip. Opens like a pitch rather than a formality.",
    short: "Large greeting, chip role.",
    header: "split",
    contacts: "stacked",
    rule: "none",
    subject: "chip",
    greeting: "display",
    accent: "#4338ca",
    presets: { fontFamily: "work-sans" },
  },
  {
    ...BASE,
    id: "preamble",
    family: "correspondence",
    name: "Preamble",
    description:
      "A serif with a large greeting and indented paragraphs under it.",
    short: "Large greeting, indented serif.",
    font: "serif",
    rule: "hairline",
    indent: true,
    greeting: "display",
    accent: "#1f2937",
    presets: { fontFamily: "source-serif" },
  },
  {
    ...BASE,
    id: "prologue",
    family: "correspondence",
    name: "Prologue",
    description:
      "A boxed header and a greeting set large under it. The two are meant to be read as one opening.",
    short: "Boxed header, large greeting.",
    header: "boxed",
    rule: "none",
    greeting: "display",
    accent: "#0369a1",
    presets: { fontFamily: "nunito-sans" },
  },
  {
    ...BASE,
    id: "exordium",
    family: "correspondence",
    name: "Exordium",
    description:
      "A centred serif header with a large greeting beneath it. Formal, and it commits to an opening line.",
    short: "Centred serif, large greeting.",
    font: "serif",
    align: "center",
    nameStyle: "tracked",
    rule: "hairline",
    greeting: "display",
    accent: "#3f3f46",
    presets: { fontFamily: "cormorant-garamond" },
  },
  {
    ...BASE,
    id: "dictum",
    family: "correspondence",
    name: "Dictum",
    description:
      "The role in small capitals at the top and the name at display size across a bar at the foot.",
    short: "Caps role, display sign-off.",
    nameStyle: "display",
    rule: "none",
    subject: "caps",
    signOffBar: true,
    accent: "#171717",
    presets: { fontFamily: "montserrat" },
  },
  {
    ...BASE,
    id: "epigraph",
    family: "correspondence",
    name: "Epigraph",
    description:
      "A ruled margin and a large greeting in a serif. The letter reads as a quotation of itself.",
    short: "Ruled margin, large greeting.",
    font: "serif",
    rule: "none",
    edge: "rule",
    greeting: "display",
    accent: "#44403c",
    presets: { fontFamily: "lora" },
  },
  {
    ...BASE,
    id: "accord",
    family: "correspondence",
    name: "Accord",
    description:
      "A full-width band at the top and the contacts printed at the foot. The page is bracketed by you.",
    short: "Band above, contacts below.",
    header: "banner",
    rule: "none",
    accent: "#065f46",
    presets: { fontFamily: "lato" },
  },
  {
    ...BASE,
    id: "concord",
    family: "correspondence",
    name: "Concord",
    description:
      "The block letterhead with the role in small capitals and a signed name at the end.",
    short: "Colour block, signed off.",
    header: "block",
    rule: "none",
    subject: "caps",
    signature: "script",
    accent: "#1e3a5f",
    presets: { fontFamily: "dm-sans" },
  },
  {
    ...BASE,
    id: "entente",
    family: "correspondence",
    name: "Entente",
    description:
      "A boxed header with a round monogram and the contacts moved to the foot of the sheet.",
    short: "Boxed monogram, contacts below.",
    header: "footer",
    monogram: "circle",
    rule: "hairline",
    accent: "#0891b2",
    presets: { fontFamily: "work-sans" },
  },
  {
    ...BASE,
    id: "parley",
    family: "correspondence",
    name: "Parley",
    description:
      "Curves at the corners with the contacts printed at the foot in a serif.",
    short: "Curved corners, contacts below.",
    font: "serif",
    header: "footer",
    rule: "none",
    edge: "wave",
    accent: "#4c1d95",
    presets: { fontFamily: "lora" },
  },
  {
    ...BASE,
    id: "audience",
    family: "correspondence",
    name: "Audience",
    description:
      "A bar across the top, the name under it, and everything else waiting at the bottom of the page.",
    short: "Top bar, contacts below.",
    header: "footer",
    rule: "none",
    edge: "band-top",
    accent: "#b45309",
    presets: { fontFamily: "inter" },
  },
  {
    ...BASE,
    id: "interview",
    family: "correspondence",
    name: "Interview",
    description:
      "Split header, date opposite the company, contacts at the foot. Arranged like a meeting agenda.",
    short: "Split header, date opposite.",
    header: "split",
    contacts: "stacked",
    rule: "hairline",
    dateAlign: "right",
    accent: "#0f172a",
    presets: { fontFamily: "ibm-plex-sans" },
  },
  {
    ...BASE,
    id: "grace",
    family: "correspondence",
    name: "Grace",
    description:
      "A serif that ends on a bar with the name written across it rather than typed.",
    short: "Serif, signed across a bar.",
    font: "serif",
    rule: "hairline",
    signature: "script",
    signOffBar: true,
    accent: "#831843",
    presets: { fontFamily: "eb-garamond" },
  },
  {
    ...BASE,
    id: "clarity",
    family: "correspondence",
    name: "Clarity",
    description:
      "One line at the top, a bar and a display name at the bottom, and the letter alone in between.",
    short: "One line up, display name down.",
    header: "minimal",
    nameStyle: "display",
    rule: "none",
    signOffBar: true,
    accent: "#0f172a",
    presets: { fontFamily: "montserrat" },
  },
  {
    ...BASE,
    id: "candor",
    family: "correspondence",
    name: "Candor",
    description:
      "A display name at both ends of the page — once as a letterhead, once as a signature.",
    short: "Display name, twice.",
    header: "split",
    nameStyle: "display",
    contacts: "stacked",
    rule: "thick",
    signOffBar: true,
    accent: "#1d4ed8",
    presets: { fontFamily: "work-sans" },
  },
  {
    ...BASE,
    id: "lectern",
    family: "correspondence",
    name: "Lectern",
    description:
      "A boxed serif header and a bar across the foot. Weighted at the top and the bottom.",
    short: "Boxed serif, closing bar.",
    font: "serif",
    header: "boxed",
    rule: "none",
    signOffBar: true,
    accent: "#1c1917",
    presets: { fontFamily: "pt-serif" },
  },

  /* -------------------------------------------------------------------------
     The type set. Designs that are only typography — how the name is cut, how
     far apart the lines sit, whether the first line steps in.
     ------------------------------------------------------------------------- */
  {
    ...BASE,
    id: "ascender",
    family: "type",
    name: "Ascender",
    description:
      "A display name with the letter set well apart from it. Space used as emphasis.",
    short: "Display name, open spacing.",
    nameStyle: "display",
    rule: "none",
    density: 1.25,
    accent: "#111827",
    presets: { fontFamily: "montserrat" },
  },
  {
    ...BASE,
    id: "descender",
    family: "type",
    name: "Descender",
    description:
      "The same display name with everything closed up beneath it. Dense and quick to read.",
    short: "Display name, tight spacing.",
    nameStyle: "display",
    rule: "none",
    density: 0.85,
    accent: "#111827",
    presets: { fontFamily: "work-sans" },
  },
  {
    ...BASE,
    id: "baseline",
    family: "type",
    name: "Baseline",
    description:
      "Contacts on hairlines under a heavy rule — a stack of horizontals, evenly weighted.",
    short: "Ruled contacts, heavy rule.",
    contacts: "ruled",
    rule: "thick",
    accent: "#0f172a",
    presets: { fontFamily: "ibm-plex-sans" },
  },
  {
    ...BASE,
    id: "kern",
    family: "type",
    name: "Kern",
    description:
      "Tracked capitals in a sans, set wide, with the letter given room to match.",
    short: "Tracked sans caps, open.",
    nameStyle: "tracked",
    rule: "hairline",
    density: 1.15,
    accent: "#1f2937",
    presets: { fontFamily: "lato" },
  },
  {
    ...BASE,
    id: "ligature",
    family: "type",
    name: "Ligature",
    description:
      "Centred tracked capitals in a garamond. The most restrained header in the set.",
    short: "Centred tracked garamond.",
    font: "serif",
    align: "center",
    nameStyle: "tracked",
    rule: "hairline",
    accent: "#3f3f46",
    presets: { fontFamily: "cormorant-garamond" },
  },
  {
    ...BASE,
    id: "roman",
    family: "type",
    name: "Roman",
    description:
      "A plain serif with indented, justified paragraphs. Nothing but the type doing the work.",
    short: "Plain serif, indented, justified.",
    font: "serif",
    rule: "none",
    justify: true,
    indent: true,
    accent: "#292524",
    presets: { fontFamily: "pt-serif" },
  },
  {
    ...BASE,
    id: "uncial",
    family: "type",
    name: "Uncial",
    description:
      "Centred tracked capitals inside a border. Old, and it knows it.",
    short: "Centred tracked caps, bordered.",
    font: "serif",
    align: "center",
    nameStyle: "tracked",
    rule: "none",
    edge: "frame",
    accent: "#78350f",
    presets: { fontFamily: "eb-garamond" },
  },
  {
    ...BASE,
    id: "majuscule",
    family: "type",
    name: "Majuscule",
    description:
      "Tracked capitals reversed out of a full-width band. Loud and formal at the same time.",
    short: "Tracked caps on a band.",
    header: "banner",
    nameStyle: "tracked",
    rule: "none",
    accent: "#1e293b",
    presets: { fontFamily: "lato" },
  },
  {
    ...BASE,
    id: "minuscule",
    family: "type",
    name: "Minuscule",
    description:
      "One line at the top, tight spacing, no rule. The smallest letterhead that still counts as one.",
    short: "One line, tight, no rule.",
    header: "minimal",
    rule: "none",
    density: 0.85,
    accent: "#334155",
    presets: { fontFamily: "source-sans" },
  },
  {
    ...BASE,
    id: "ampersand",
    family: "type",
    name: "Ampersand",
    description:
      "Initials set plainly beside the name, contacts against the other edge.",
    short: "Plain initials, contacts right.",
    header: "split",
    monogram: "plain",
    contacts: "stacked",
    rule: "hairline",
    accent: "#0d9488",
    presets: { fontFamily: "dm-sans" },
  },
  {
    ...BASE,
    id: "pilcrow",
    family: "type",
    name: "Pilcrow",
    description:
      "Indented, justified serif under a hairline. Paragraph marks in everything but ink.",
    short: "Indented justified serif.",
    font: "serif",
    rule: "hairline",
    justify: true,
    indent: true,
    density: 0.95,
    accent: "#1f2937",
    presets: { fontFamily: "crimson-pro" },
  },
  {
    ...BASE,
    id: "leading",
    family: "type",
    name: "Leading",
    description:
      "The most open setting here — every block of the letter pushed apart from the next.",
    short: "Widest spacing.",
    rule: "hairline",
    density: 1.35,
    accent: "#475569",
    presets: { fontFamily: "nunito-sans" },
  },
  {
    ...BASE,
    id: "tracking",
    family: "type",
    name: "Tracking",
    description:
      "Tracked capitals for the name and the title both, split across the top of the page.",
    short: "Tracked name and title.",
    header: "split",
    nameStyle: "tracked",
    titleCaps: true,
    contacts: "stacked",
    rule: "hairline",
    accent: "#0f172a",
    presets: { fontFamily: "work-sans" },
  },
  {
    ...BASE,
    id: "rubric",
    family: "type",
    name: "Rubric",
    description:
      "A centred serif header with the role reversed out of a chip beneath it.",
    short: "Centred serif, chip role.",
    font: "serif",
    align: "center",
    rule: "hairline",
    subject: "chip",
    accent: "#9f1239",
    presets: { fontFamily: "lora" },
  },
  {
    ...BASE,
    id: "versal",
    family: "type",
    name: "Versal",
    description:
      "A square monogram beside a serif name over a hairline. An initial in the old sense.",
    short: "Square initial, serif name.",
    font: "serif",
    monogram: "square",
    rule: "hairline",
    accent: "#3f6152",
    presets: { fontFamily: "libre-baskerville" },
  },
  {
    ...BASE,
    id: "capital",
    family: "type",
    name: "Capital",
    description:
      "Tracked capitals inside a centred box. Symmetry twice over.",
    short: "Boxed centred capitals.",
    font: "serif",
    header: "boxed",
    align: "center",
    nameStyle: "tracked",
    rule: "none",
    accent: "#1e3a5f",
    presets: { fontFamily: "cormorant-garamond" },
  },
  {
    ...BASE,
    id: "initial",
    family: "type",
    name: "Initial",
    description:
      "A round monogram against a split header. The mark carries the colour, the type stays plain.",
    short: "Round monogram, split header.",
    header: "split",
    monogram: "circle",
    contacts: "stacked",
    rule: "none",
    accent: "#7c3aed",
    presets: { fontFamily: "inter" },
  },
  {
    ...BASE,
    id: "scrivener",
    family: "type",
    name: "Scrivener",
    description:
      "A plain serif letter that ends with the name written out rather than set.",
    short: "Plain serif, written sign-off.",
    font: "serif",
    rule: "hairline",
    signature: "script",
    accent: "#44403c",
    presets: { fontFamily: "source-serif" },
  },
  {
    ...BASE,
    id: "amanuensis",
    family: "type",
    name: "Amanuensis",
    description:
      "Indented, justified serif with a written sign-off. As close as type gets to a letter written by hand.",
    short: "Indented serif, written sign-off.",
    font: "serif",
    rule: "none",
    justify: true,
    indent: true,
    signature: "script",
    accent: "#78350f",
    presets: { fontFamily: "eb-garamond" },
  },
  {
    ...BASE,
    id: "notary",
    family: "type",
    name: "Notary",
    description:
      "A boxed serif header with a square monogram and the role in small capitals.",
    short: "Boxed monogram, caps role.",
    font: "serif",
    header: "boxed",
    monogram: "square",
    rule: "none",
    subject: "caps",
    accent: "#1c1917",
    presets: { fontFamily: "pt-serif" },
  },
  {
    ...BASE,
    id: "steward",
    family: "type",
    name: "Steward",
    description:
      "A tracked title on the left, contacts on hairlines to the right. Ordered on both sides.",
    short: "Tracked title, ruled contacts.",
    header: "split",
    titleCaps: true,
    contacts: "ruled",
    rule: "hairline",
    accent: "#155e75",
    presets: { fontFamily: "ibm-plex-sans" },
  },
  {
    ...BASE,
    id: "chancellor",
    family: "type",
    name: "Chancellor",
    description:
      "Initials set plainly above a centred serif name, inside two nested rules.",
    short: "Centred initials, double border.",
    font: "serif",
    align: "center",
    nameStyle: "tracked",
    monogram: "plain",
    rule: "none",
    edge: "double-frame",
    accent: "#7f1d1d",
    presets: { fontFamily: "libre-baskerville" },
  },
  {
    ...BASE,
    id: "provost",
    family: "type",
    name: "Provost",
    description:
      "A boxed serif header with a tracked title, inside a border. Institutional in the best sense.",
    short: "Boxed serif, tracked title, border.",
    font: "serif",
    header: "boxed",
    titleCaps: true,
    rule: "none",
    edge: "frame",
    accent: "#1e3a5f",
    presets: { fontFamily: "source-serif" },
  },
  {
    ...BASE,
    id: "reed",
    family: "type",
    name: "Reed",
    description:
      "One line of a header in a garamond, and a written name at the end. The quietest letter here.",
    short: "One line, written sign-off.",
    font: "serif",
    header: "minimal",
    rule: "none",
    signature: "script",
    density: 1.1,
    accent: "#57534e",
    presets: { fontFamily: "eb-garamond" },
  },
];

export const isLetterTemplateId = (value: string): value is LetterTemplateId =>
  LETTER_TEMPLATES.some((t) => t.id === value);

/**
 * The design a letter is set in.
 *
 * Letters written before templates existed stored only a header style, so
 * that's what picks their design — a banner letter stays a banner letter,
 * rather than every old letter redrawing itself as the default.
 */
export function letterTemplate(
  settings: Pick<CoverLetterSettings, "template" | "headerStyle"> | undefined,
): LetterTemplate {
  const found = LETTER_TEMPLATES.find((t) => t.id === settings?.template);
  if (found) return found;

  const legacy =
    settings?.headerStyle === "banner"
      ? "banner"
      : settings?.headerStyle === "minimal"
        ? "note"
        : "classic";
  return LETTER_TEMPLATES.find((t) => t.id === legacy) ?? LETTER_TEMPLATES[0];
}

/** Picking a template also moves the settings it has an opinion about.
 *  Applied to a draft in place, the way `applyTemplate` does for a resume. */
export function applyLetterTemplate(
  settings: CoverLetterSettings,
  t: LetterTemplate,
) {
  settings.template = t.id;
  settings.fontFamily = t.presets.fontFamily;
  settings.accent = t.accent;
}

/** The buckets the picker filters by. A design can sit in several. */
export type LetterCategory =
  | "simple"
  | "classic"
  | "modern"
  | "bold"
  | "decorated"
  | "colour"
  | "monogram"
  | "formal";

export const LETTER_CATEGORIES: {
  id: LetterCategory;
  label: string;
}[] = [
  { id: "simple", label: "Simple" },
  { id: "classic", label: "Classic" },
  { id: "modern", label: "Modern" },
  { id: "bold", label: "Bold" },
  { id: "formal", label: "Formal" },
  { id: "decorated", label: "Decorated" },
  { id: "colour", label: "Colour" },
  { id: "monogram", label: "Monogram" },
];

/** Worked out from the descriptor rather than stored per design, so adding one
 *  files it in the right buckets without a second list to keep up. */
export function inLetterCategory(
  t: LetterTemplate,
  category: LetterCategory,
): boolean {
  switch (category) {
    // Nothing drawn on the page and nothing painted behind it — what survives
    // being pasted into a plain-text box on the other end.
    case "simple":
      return (
        t.edge === "none" &&
        t.page === "light" &&
        t.monogram === "none" &&
        (t.header === "stacked" || t.header === "minimal")
      );
    case "classic":
      return t.font === "serif";
    case "modern":
      return t.font === "sans";
    case "bold":
      return (
        t.nameStyle === "display" ||
        t.header === "banner" ||
        t.header === "block"
      );
    // The things a letter does when it's being formal: centred, tracked,
    // bordered, indented.
    case "formal":
      return (
        t.align === "center" ||
        t.nameStyle === "tracked" ||
        t.indent ||
        t.edge === "frame" ||
        t.edge === "double-frame"
      );
    case "decorated":
      return t.edge !== "none";
    case "colour":
      return t.page !== "light";
    case "monogram":
      return t.monogram !== "none";
  }
}

export const letterTemplatesIn = (category: LetterCategory): LetterTemplate[] =>
  LETTER_TEMPLATES.filter((t) => inLetterCategory(t, category));

export const letterFamily = (family: LetterFamily): LetterTemplate[] =>
  LETTER_TEMPLATES.filter((t) => t.family === family);
