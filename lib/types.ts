import type { LanguageCode } from "./i18n";

// Core data model for the resume builder.
// Everything here is JSON-serializable so it can live in localStorage.

export type SectionType =
  | "summary"
  | TimelineType
  | CredentialType
  | TagGroupType;

/** Dated entries with bullet highlights. */
export type TimelineType = "experience" | "projects" | "volunteering";

/** A qualification awarded by somebody, with an optional description. */
export type CredentialType = "education" | "certifications" | "awards";

/** Named groups of short tags. */
export type TagGroupType = "skills" | "languages" | "interests";

export interface ContactLink {
  id: string;
  /** e.g. "LinkedIn", "Website", "GitHub" */
  label: string;
  url: string;
}

/** The reorderable contact rows in the personal details form. */
export type ContactField = "email" | "phone" | "location";

export interface PersonalDetails {
  fullName: string;
  title: string;
  /** Data URL of an uploaded photo, if any. */
  photo?: string;
  email: string;
  phone: string;
  location: string;
  /** Display order of the contact rows. Absent on resumes saved before
   *  reordering existed — read it through `contactOrder()`. */
  contactOrder?: ContactField[];
  links: ContactLink[];
}

export interface SummarySection {
  id: string;
  type: "summary";
  title: string;
  /** Markdown, in the subset `lib/markdown` defines. */
  content: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  /** Markdown, in the subset `lib/markdown` defines — usually a bullet list. */
  highlights: string;
  /** How highlights were stored before the Markdown editor: one string per
   *  bullet. Only `migrateResumeData` should read it. */
  bullets?: string[];
  /** Kept in the editor but left out of the rendered resume. */
  hidden?: boolean;
}

/** Backs every TimelineType section, not just "experience". */
export interface ExperienceSection {
  id: string;
  type: TimelineType;
  title: string;
  items: ExperienceItem[];
  /** Dates are printed unless this is explicitly false — absent on resumes
   *  saved before the toggle existed, so read it through `showsDates()`. */
  showDates?: boolean;
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  /** Markdown, in the subset `lib/markdown` defines. */
  description: string;
  /** Kept in the editor but left out of the rendered resume. */
  hidden?: boolean;
}

/** Backs every CredentialType section, not just "education". */
export interface EducationSection {
  id: string;
  type: CredentialType;
  title: string;
  items: EducationItem[];
  /** Dates are printed unless this is explicitly false — absent on resumes
   *  saved before the toggle existed, so read it through `showsDates()`. */
  showDates?: boolean;
}

/** One skill, language or interest — the unit a TagGroupType section lists. */
export interface SkillItem {
  id: string;
  /** The skill itself, e.g. "Java". */
  name: string;
  /** Position on the section's scale, 1 to `SKILL_LEVELS[type].length`.
   *  Absent means the resume prints the name on its own. */
  level?: number;
  /** Kept in the editor but left out of the rendered resume. */
  hidden?: boolean;
}

/** Backs every TagGroupType section, not just "skills". */
export interface SkillsSection {
  id: string;
  type: TagGroupType;
  title: string;
  items: SkillItem[];
  /** How these were stored before skills became one entry each: named groups
   *  of bare tags. Only `migrateResumeData` should read it. */
  groups?: { id: string; name: string; skills: string[] }[];
}

export type Section =
  | SummarySection
  | ExperienceSection
  | EducationSection
  | SkillsSection;

/** A typeface choice. The first three are system stacks and predate the rest —
 *  saved resumes store these ids, so none of them may be renamed. The
 *  catalogue behind them is in lib/fonts.ts. */
export type FontFamily =
  | "sans"
  | "serif"
  | "mono"
  | "inter"
  | "source-sans"
  | "roboto"
  | "source-serif"
  | "lora"
  | "merriweather"
  | "eb-garamond"
  | "jetbrains-mono"
  | "open-sans"
  | "lato"
  | "montserrat"
  | "work-sans"
  | "nunito-sans"
  | "dm-sans"
  | "ibm-plex-sans"
  | "playfair-display"
  | "libre-baskerville"
  | "pt-serif"
  | "crimson-pro"
  | "bitter"
  | "cormorant-garamond"
  | "ibm-plex-mono"
  | "roboto-mono"
  | "source-code-pro";

/** The paper the resume is laid out for. */
export type PageFormat = "A4" | "Letter";

/** How a month reads on the page: "May 2021", "September 2021", "05/2021",
 *  or "2021-05". */
export type DateFormat = "short" | "long" | "numeric" | "iso";
export type HeadingStyle = "underline" | "plain" | "uppercase";

/** Which template the document is rendered with. The last five predate the
 *  rest and are kept because saved resumes still reference them. */
export type TemplateId =
  | "ledger"
  | "meridian"
  | "chronicle"
  | "bergen"
  | "atlas"
  | "compass"
  | "verdant"
  | "onyx"
  | "portrait"
  | "compact"
  | "oxford"
  | "ashford"
  | "classic"
  | "modern"
  | "minimal"
  | "sidebar"
  | "editorial"
  // The city set.
  | "amsterdam"
  | "berlin"
  | "chicago"
  | "copenhagen"
  | "dublin"
  | "helsinki"
  | "madrid"
  | "newyork"
  | "rome"
  | "santiago"
  | "singapore"
  | "sydney"
  | "tokyo"
  | "toronto"
  | "vienna"
  // The gallery set.
  | "sable"
  | "cobalt"
  | "azure"
  | "vantage"
  | "halcyon"
  | "hazel"
  | "ridge"
  | "aspen"
  | "aurum"
  | "beacon"
  | "blush"
  | "folio"
  | "quarry"
  | "cygnus"
  | "terrace"
  | "colonnade"
  | "garnet"
  | "cove"
  | "vellum"
  | "cerulean"
  | "fathom"
  | "anvil"
  | "pewter"
  | "lattice"
  | "marble"
  | "sienna"
  | "strand"
  | "lagoon"
  | "linen"
  | "regatta"
  | "slate"
  | "frost"
  | "cameo"
  | "codex"
  | "citrine"
  | "keystone"
  | "alder"
  | "meadow"
  | "papyrus"
  | "admiral"
  | "almanac"
  | "opal"
  | "girder"
  | "sapphire"
  | "ashen"
  | "quill"
  | "brocade"
  | "cairn"
  | "verbena"
  | "argent"
  | "rosewood"
  | "obsidian"
  | "sandstone"
  | "quartz"
  | "bedrock"
  | "apricot"
  | "mulberry"
  | "ivory"
  | "cirrus"
  | "basalt"
  | "camel"
  | "bracken"
  | "flint"
  | "bastion"
  | "tawny"
  | "periwinkle"
  | "cadet"
  | "aurora"
  | "ensign"
  | "graphite"
  | "chalk"
  | "nautilus"
  | "truffle"
  | "starboard"
  | "cornice"
  | "dovetail"
  | "coral"
  | "lumen"
  | "praline"
  | "marigold"
  | "topaz"
  | "sovereign"
  | "parchment"
  | "harbor"
  | "portico"
  | "rampart"
  | "filigree"
  | "aquamarine"
  | "pumice"
  | "kingfisher"
  | "glacier"
  | "cocoa"
  | "pebble"
  | "vesper"
  | "pilot"
  | "obelisk"
  | "monolith"
  | "astra"
  | "saffron"
  | "cypress"
  | "standard"
  | "regent"
  | "cotton"
  | "heirloom"
  | "cobble"
  | "hornet"
  | "stipple"
  | "seafoam"
  | "bluebell"
  | "domino"
  | "registry"
  | "anthracite"
  | "syntax"
  | "cinder"
  | "fjord"
  | "tidewater"
  | "bulwark"
  | "inkwell"
  | "silverpoint"
  | "rosetta"
  | "cerise"
  | "nimbus"
  | "sterling"
  | "mariner"
  | "junction"
  | "chancery"
  | "pillar"
  | "tintype"
  | "gunmetal"
  | "palazzo"
  | "amethyst"
  | "charcoal"
  | "salon"
  | "lintel"
  | "belfry"
  | "quire"
  | "chiffon"
  | "camellia"
  | "vanguard"
  | "bullion"
  | "tarmac"
  | "corvette"
  | "peony"
  | "placard"
  | "boulder"
  | "chevron"
  | "skipper"
  | "foundry"
  | "spinnaker"
  | "bulletin"
  | "signal"
  | "ballet"
  | "concourse"
  | "harlequin"
  | "terracotta"
  | "marquee"
  | "windward"
  | "milestone"
  | "beaufort"
  | "platinum"
  | "flamingo"
  | "ballast"
  | "longitude"
  | "broadsheet"
  | "marginalia"
  | "alabaster"
  | "cascade"
  | "vermillion"
  | "sagebrush"
  | "crosshatch"
  | "juniper"
  | "regalia"
  | "fernwood"
  | "millstone"
  | "sepia"
  | "crest"
  | "shell"
  | "insignia"
  | "lighthouse"
  | "bloom"
  | "atelier"
  | "bellini"
  | "playbill"
  | "arcadia"
  | "blueprint"
  | "colophon"
  | "ultramarine"
  | "terrazzo"
  | "verdigris"
  | "capsule"
  | "sandpiper"
  | "gridiron"
  | "halyard"
  | "plumbline"
  | "vitrine";

export interface ResumeSettings {
  template: TemplateId;
  /** The language the resume is written in. Absent on resumes saved before
   *  languages existed — read it through `language()` in `lib/i18n`. */
  language?: LanguageCode;
  /** Accent color as a hex string, e.g. "#2563eb". */
  accent: string;
  /* The three below are all optional and all overrides: absent means "whatever
     the template does", which is what every resume saved before this said. */
  /** The paper itself. */
  pageColor?: string;
  /** An image laid over the paper, covering it. A stored URL, never inline —
   *  see lib/upload-image. */
  pageImage?: string;
  /** Body copy: paragraphs, bullets, everything that isn't a title. */
  textColor?: string;
  /** Section headings, entry titles and the name. */
  headingColor?: string;
  fontFamily: FontFamily;
  /** Base body font size in points. */
  fontSize: number;
  /** Unitless line height, e.g. 1.3. */
  lineHeight: number;
  /** How dates are written. Absent on older resumes, which used "short". */
  dateFormat?: DateFormat;
  /** Left/right page margin in millimetres. */
  marginX: number;
  /** Top/bottom page margin in millimetres. */
  marginY: number;
  headingStyle: HeadingStyle;
  /** Which set the contact marks are drawn from. Absent on resumes saved
   *  before the choice existed, which all showed the house set. */
  iconStyle?: IconStyle;
  /** How the skills, languages and interests sections are laid out. "auto",
   *  and absent, both mean whatever the template chose. */
  tagStyle?: TagLayout;
  /** What goes between the entries in the one-line layout. Absent means a
   *  pipe, which is what that layout always used. */
  tagSeparator?: TagSeparator;
}

/** A skills layout the document can ask for, over the template's own choice.
 *  The named values mirror `TagStyle` in lib/templates. */
export type TagLayout =
  | "auto"
  | "columns-1"
  | "columns-2"
  | "columns-3"
  | "columns-4"
  | "dots"
  | "bars"
  | "inline";

/** The mark between entries in the one-line skills layout. */
export type TagSeparator =
  | "pipe"
  | "bullet"
  | "dot"
  | "slash"
  | "comma"
  | "dash";

/** What a contact row means. The renderer works in these, not in icon names,
 *  so a style swap can't change which rows get a mark. */
export type IconKind =
  | "email"
  | "phone"
  | "location"
  | "github"
  | "linkedin"
  | "gitlab"
  | "dribbble"
  | "behance"
  | "stackoverflow"
  | "x"
  | "link";

/** The hand the marks are drawn in — see components/preview/contact-icons. */
export type IconStyle = "solid" | "line" | "rounded" | "classic" | "none";

export interface ResumeData {
  personal: PersonalDetails;
  sections: Section[];
  settings: ResumeSettings;
}

/** A resume's public link. Minted, read and revoked in lib/share.ts; the slug
 *  is what /r/<slug> is keyed by. */
export interface ShareLink {
  slug: string;
  /** When the link was minted, in epoch millis. */
  sharedAt: number;
}

export interface Resume {
  id: string;
  name: string;
  format: PageFormat;
  createdAt: number;
  updatedAt: number;
  data: ResumeData;
  /** The public link, when this resume is shared. Absent on a guest's resume,
   *  which lives in one browser and has nothing to share from. */
  share?: ShareLink | null;
}

/* ---------------------------------------------------------------------------
   Cover letters.

   A letter is a much smaller thing than a resume: a header, who it's to, a
   greeting, some paragraphs, a sign-off. There are no sections to reorder, so
   the shape below is flat on purpose rather than a second copy of the resume
   model — but it does carry a template, described in lib/letter-templates.ts.
   --------------------------------------------------------------------------- */

/** How the sender's details sat at the top of the page, before the designs in
 *  lib/letter-templates.ts existed. Kept because saved letters store it: it's
 *  what picks the design for a letter written before there were any. */
export type LetterHeaderStyle = "stacked" | "banner" | "minimal";

/** The cover letter designs. Described in lib/letter-templates.ts. */
export type LetterTemplateId =
  | "classic"
  | "banner"
  | "note"
  | "bureau"
  | "copperplate"
  | "column"
  | "emblem"
  | "tide"
  | "headline"
  | "ribbon"
  | "press"
  | "midnight"
  | "gazette"
  | "pennant"
  | "foolscap"
  | "atrium"
  | "postmark"
  | "dispatch"
  | "memo"
  | "notice"
  | "circular"
  | "missive"
  | "epistle"
  | "regards"
  | "courtesy"
  | "bond"
  | "ream"
  | "sheaf"
  | "clerk"
  | "secretary"
  | "letterpress"
  | "deckle"
  | "watermark"
  | "gilt"
  | "emboss"
  | "deboss"
  | "signet"
  | "seal"
  | "cachet"
  | "escutcheon"
  | "quarto"
  | "octavo"
  | "laid"
  | "wove"
  | "rag"
  | "onionskin"
  | "manila"
  | "tracing"
  | "grotesk"
  | "slab"
  | "kicker"
  | "masthead"
  | "standfirst"
  | "byline"
  | "dateline"
  | "typeset"
  | "matrix"
  | "punchcut"
  | "stylus"
  | "tabula"
  | "plaque"
  | "tablet"
  | "stele"
  | "frieze"
  | "architrave"
  | "reglet"
  | "inkstand"
  | "nib"
  | "blotter"
  | "cipher"
  | "archive"
  | "chambers"
  | "writ"
  | "rotunda"
  | "vestibule"
  | "foyer"
  | "consulate"
  | "embassy"
  | "legation"
  | "cabinet"
  | "scriptorium"
  | "palimpsest"
  | "codicil"
  | "charter"
  | "envoy"
  | "herald"
  | "crier"
  | "stamp"
  | "airmail"
  | "postbox"
  | "letterbox"
  | "mailroom"
  | "sorting"
  | "delivery"
  | "margin"
  | "gutter"
  | "recto"
  | "verso"
  | "spread"
  | "endpaper"
  | "flyleaf"
  | "terminal"
  | "finial"
  | "swash"
  | "salutation"
  | "postscript"
  | "enclosure"
  | "compliments"
  | "overture"
  | "preamble"
  | "prologue"
  | "exordium"
  | "dictum"
  | "epigraph"
  | "accord"
  | "concord"
  | "entente"
  | "parley"
  | "audience"
  | "interview"
  | "grace"
  | "clarity"
  | "candor"
  | "lectern"
  | "ascender"
  | "descender"
  | "baseline"
  | "kern"
  | "ligature"
  | "roman"
  | "uncial"
  | "majuscule"
  | "minuscule"
  | "ampersand"
  | "pilcrow"
  | "leading"
  | "tracking"
  | "rubric"
  | "versal"
  | "capital"
  | "initial"
  | "scrivener"
  | "amanuensis"
  | "notary"
  | "steward"
  | "chancellor"
  | "provost"
  | "reed";

export interface LetterSender {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
}

export interface LetterRecipient {
  /** The person, when it's known — "Dear Hiring Manager" is the fallback. */
  name: string;
  role: string;
  company: string;
  /** Free-form, one line per line. */
  address: string;
}

export interface CoverLetterSettings {
  /** The design. Absent on letters saved before templates existed — read it
   *  through `letterTemplate()` in lib/letter-templates, which falls back to
   *  whatever `headerStyle` those letters were written with. */
  template?: LetterTemplateId;
  language?: LanguageCode;
  accent: string;
  fontFamily: FontFamily;
  /** Base body font size in points. */
  fontSize: number;
  lineHeight: number;
  /** Left/right page margin in millimetres. */
  marginX: number;
  /** Top/bottom page margin in millimetres. */
  marginY: number;
  /** Legacy. The template owns the header now; this is only read when there
   *  isn't one. */
  headerStyle?: LetterHeaderStyle;
  /** Whether the date line is printed. */
  showDate: boolean;
}

export interface CoverLetterData {
  sender: LetterSender;
  recipient: LetterRecipient;
  /** The job being applied for — printed as the subject line when set. */
  role: string;
  /** The posting it was drafted against, kept so a redraft doesn't need it
   *  pasted again. Capped by `parseCoverLetterData`. */
  jobDescription: string;
  /** Written out at print time from the letter's language; blank means today. */
  date: string;
  greeting: string;
  /** Markdown, in the subset `lib/markdown` defines. The letter itself. */
  body: string;
  closing: string;
  /** The name under the sign-off — usually, but not always, the sender's. */
  signature: string;
  /** A drawn or uploaded signature, as a PNG data URL, printed above the name.
   *  Absent on letters saved before signatures existed. */
  signatureImage?: string;
  settings: CoverLetterSettings;
}

export interface CoverLetter {
  id: string;
  name: string;
  format: PageFormat;
  /** The resume it was drafted from, if it came from one. A soft link: the
   *  letter carries its own copy of everything it prints. */
  resumeId: string | null;
  createdAt: number;
  updatedAt: number;
  data: CoverLetterData;
}
