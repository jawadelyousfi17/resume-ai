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

export type FontFamily = "sans" | "serif" | "mono";

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
  | "editorial";

export interface ResumeSettings {
  template: TemplateId;
  /** The language the resume is written in. Absent on resumes saved before
   *  languages existed — read it through `language()` in `lib/i18n`. */
  language?: LanguageCode;
  /** Accent color as a hex string, e.g. "#2563eb". */
  accent: string;
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
}

export interface ResumeData {
  personal: PersonalDetails;
  sections: Section[];
  settings: ResumeSettings;
}

export interface Resume {
  id: string;
  name: string;
  format: PageFormat;
  createdAt: number;
  updatedAt: number;
  data: ResumeData;
}
