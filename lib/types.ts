// Core data model for the resume builder.
// Everything here is JSON-serializable so it can live in localStorage.

export type SectionType =
  | "summary"
  | "experience"
  | "education"
  | "skills";

export interface ContactLink {
  id: string;
  /** e.g. "LinkedIn", "Website", "GitHub" */
  label: string;
  url: string;
}

export interface PersonalDetails {
  fullName: string;
  title: string;
  /** Data URL of an uploaded photo, if any. */
  photo?: string;
  email: string;
  phone: string;
  location: string;
  links: ContactLink[];
}

export interface SummarySection {
  id: string;
  type: "summary";
  title: string;
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
  bullets: string[];
}

export interface ExperienceSection {
  id: string;
  type: "experience";
  title: string;
  items: ExperienceItem[];
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface EducationSection {
  id: string;
  type: "education";
  title: string;
  items: EducationItem[];
}

export interface SkillGroup {
  id: string;
  name: string;
  /** Comma-free list of individual skills. */
  skills: string[];
}

export interface SkillsSection {
  id: string;
  type: "skills";
  title: string;
  groups: SkillGroup[];
}

export type Section =
  | SummarySection
  | ExperienceSection
  | EducationSection
  | SkillsSection;

export type FontFamily = "sans" | "serif" | "mono";
export type HeadingStyle = "underline" | "plain" | "uppercase";

export interface ResumeSettings {
  /** Accent color as a hex string, e.g. "#2563eb". */
  accent: string;
  fontFamily: FontFamily;
  /** Base body font size in points. */
  fontSize: number;
  /** Unitless line height, e.g. 1.3. */
  lineHeight: number;
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
  format: "A4" | "Letter";
  createdAt: number;
  updatedAt: number;
  data: ResumeData;
}
