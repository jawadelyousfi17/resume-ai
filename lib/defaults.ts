// Factories for new resumes and sections, plus the metadata that drives the
// "Add content" picker.

import { escapeMarkdown } from "./markdown";
import { DEFAULT_LANGUAGE, SECTION_TITLES, type LanguageCode } from "./i18n";
import type {
  ContactField,
  EducationItem,
  EducationSection,
  ExperienceItem,
  ExperienceSection,
  PageFormat,
  PersonalDetails,
  Resume,
  ResumeData,
  ResumeSettings,
  Section,
  SectionType,
  SkillItem,
  SkillsSection,
  SummarySection,
} from "./types";

const uid = () => crypto.randomUUID();

export const DEFAULT_SETTINGS: ResumeSettings = {
  template: "classic",
  language: DEFAULT_LANGUAGE,
  accent: "#2563eb",
  fontFamily: "sans",
  fontSize: 10.5,
  lineHeight: 1.35,
  marginX: 16,
  marginY: 14,
  headingStyle: "underline",
};

export const DEFAULT_CONTACT_ORDER: ContactField[] = [
  "email",
  "phone",
  "location",
];

/** Reads the saved contact order, tolerating resumes saved before reordering
 *  existed as well as partial or duplicated stored values. */
export function contactOrder(personal: PersonalDetails): ContactField[] {
  const saved = personal.contactOrder ?? [];
  const kept = saved.filter(
    (field, i) =>
      DEFAULT_CONTACT_ORDER.includes(field) && saved.indexOf(field) === i,
  );
  return [
    ...kept,
    ...DEFAULT_CONTACT_ORDER.filter((field) => !kept.includes(field)),
  ];
}

/** Page dimensions in CSS pixels at 96dpi, and the LaTeX geometry name. */
export const PAGE_SIZES: Record<
  PageFormat,
  { width: number; height: number; latex: string }
> = {
  A4: { width: 794, height: 1123, latex: "a4paper" },
  Letter: { width: 816, height: 1056, latex: "letterpaper" },
};

// The font stacks moved to lib/fonts.ts, next to the catalogue the Customize
// panel reads. Re-exported here so existing importers keep working.
export { FONT_STACKS, fontStack } from "./fonts";

export function createEmptyResume(name = "Resume 1"): Resume {
  const now = Date.now();
  return {
    id: uid(),
    name,
    format: "A4",
    createdAt: now,
    updatedAt: now,
    data: {
      personal: {
        fullName: "",
        title: "",
        email: "",
        phone: "",
        location: "",
        contactOrder: [...DEFAULT_CONTACT_ORDER],
        links: [],
      },
      sections: [],
      settings: { ...DEFAULT_SETTINGS },
    },
  };
}

export function newExperienceItem(): ExperienceItem {
  return {
    id: uid(),
    role: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    highlights: "",
  };
}

export function newEducationItem(): EducationItem {
  return {
    id: uid(),
    degree: "",
    school: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  };
}

export function newSkillItem(): SkillItem {
  return { id: uid(), name: "" };
}

/** Brings a stored document up to the current shape:
 *
 *  - Long-form fields are Markdown now, so resumes saved when highlights were
 *    an array of plain strings are folded into a bullet list — escaping first,
 *    so a stray `*` someone typed back then stays literal text.
 *  - Skills are one entry each now, so the old named groups of bare tags are
 *    flattened into individual entries. The group names don't survive: they
 *    named a category, and categories are no longer part of the shape.
 *
 *  Runs on every load, so it must be cheap and safe to repeat. */
export function migrateResumeData(data: ResumeData): ResumeData {
  const next = structuredClone(data);

  for (const section of next.sections) {
    if (isTagGroupSection(section)) {
      if (section.groups) {
        if (!section.items?.length) {
          section.items = section.groups
            .flatMap((g) => g.skills)
            .filter((name) => name.trim())
            .map((name) => ({ id: uid(), name: name.trim() }));
        }
        delete section.groups;
      }
      // A section with nothing in it still needs one row to type into.
      if (!section.items?.length) section.items = [newSkillItem()];
      continue;
    }

    if (!isTimelineSection(section)) continue;
    for (const item of section.items) {
      if (!item.bullets) continue;
      const bullets = item.bullets.filter((b) => b.trim());
      if (!item.highlights) {
        item.highlights = bullets
          .map((b) => `- ${escapeMarkdown(b.trim())}`)
          .join("\n");
      }
      delete item.bullets;
    }
  }

  return next;
}

/** Sections that share a data shape also share a form, a preview block and a
 *  LaTeX writer — these narrow a Section to the right one of the three. */
export const isTimelineSection = (s: Section): s is ExperienceSection =>
  s.type === "experience" || s.type === "projects" || s.type === "volunteering";

export const isCredentialSection = (s: Section): s is EducationSection =>
  s.type === "education" || s.type === "certifications" || s.type === "awards";

export const isTagGroupSection = (s: Section): s is SkillsSection =>
  s.type === "skills" || s.type === "languages" || s.type === "interests";

/** Only dated sections carry the dates toggle. */
export const hasDates = (
  s: Section,
): s is ExperienceSection | EducationSection =>
  isTimelineSection(s) || isCredentialSection(s);

/** Whether a section prints its entries' dates — the default is yes. */
export const showsDates = (s: Section): boolean =>
  hasDates(s) && s.showDates !== false;

/** Whatever a section keeps in its list. */
export type Entry = ExperienceItem | EducationItem | SkillItem;

/** A fresh entry of the kind this section holds — null for the summary, which
 *  keeps no list. Made outside the store update so the caller knows its id
 *  before the mutation is applied. */
export function newEntry(s: Section): Entry | null {
  if (isTimelineSection(s)) return newExperienceItem();
  if (isCredentialSection(s)) return newEducationItem();
  if (isTagGroupSection(s)) return newSkillItem();
  return null;
}

/** Files an entry from `newEntry` into the list it belongs to. */
export function attachEntry(s: Section, entry: Entry) {
  if (isTimelineSection(s) && "role" in entry) s.items.push(entry);
  else if (isCredentialSection(s) && "degree" in entry) s.items.push(entry);
  else if (isTagGroupSection(s) && !("role" in entry) && !("degree" in entry))
    s.items.push(entry);
}

/** Moves the entry `from` into the slot currently held by `to`. */
export function moveById<T extends { id: string }>(
  list: T[],
  from: string,
  to: string,
) {
  const a = list.findIndex((x) => x.id === from);
  const b = list.findIndex((x) => x.id === to);
  if (a < 0 || b < 0 || a === b) return;
  const [moved] = list.splice(a, 1);
  list.splice(b, 0, moved);
}

export function createSection(
  type: SectionType,
  lang: LanguageCode = DEFAULT_LANGUAGE,
): Section {
  const id = uid();
  const title = SECTION_TITLES[lang][type];

  switch (type) {
    case "summary":
      return { id, type, title, content: "" } satisfies SummarySection;
    case "experience":
    case "projects":
    case "volunteering":
      return {
        id,
        type,
        title,
        items: [newExperienceItem()],
      } satisfies ExperienceSection;
    case "education":
    case "certifications":
    case "awards":
      return {
        id,
        type,
        title,
        items: [newEducationItem()],
      } satisfies EducationSection;
    case "skills":
    case "languages":
    case "interests":
      return {
        id,
        type,
        title,
        items: [newSkillItem()],
      } satisfies SkillsSection;
  }
}

/** Where a section belongs when the app adds it for you — the conventional
 *  reading order of a resume. Anything not listed goes at the end, which is
 *  also where a section added by hand lands. */
const SECTION_ORDER: SectionType[] = [
  "summary",
  "experience",
  "education",
  "skills",
];

/** Adds a section in its conventional place rather than at the end, so a
 *  resume filled in step by step still reads in the usual order. */
export function insertSection(sections: Section[], section: Section) {
  const rank = (type: SectionType) => {
    const i = SECTION_ORDER.indexOf(type);
    return i === -1 ? SECTION_ORDER.length : i;
  };

  const at = sections.findIndex((s) => rank(s.type) > rank(section.type));
  if (at === -1) sections.push(section);
  else sections.splice(at, 0, section);
}

export interface SectionMeta {
  type: SectionType;
  title: string;
  description: string;
  /** Whether the "Add content" picker allows more than one of this section. */
  multiple: boolean;
}

export const SECTION_META: SectionMeta[] = [
  {
    type: "summary",
    title: "Summary",
    description:
      "Add a short summary of your key strengths, experience, and career goals.",
    multiple: false,
  },
  {
    type: "experience",
    title: "Professional Experience",
    description:
      "Add your professional roles and employer history including internships.",
    multiple: true,
  },
  {
    type: "education",
    title: "Education",
    description:
      "Add your degrees and schools. Include your focus, honors, or exchange terms.",
    multiple: true,
  },
  {
    type: "skills",
    title: "Skills",
    description:
      "Add your hard and soft skills that help you stand out from the crowd today.",
    multiple: true,
  },
  {
    type: "projects",
    title: "Projects",
    description:
      "Show what you've built — side projects, open source, or work you shipped.",
    multiple: true,
  },
  {
    type: "certifications",
    title: "Certifications",
    description: "List credentials you've earned, who issued them, and when.",
    multiple: true,
  },
  {
    type: "languages",
    title: "Languages",
    description: "Add the languages you speak and how fluent you are in each.",
    multiple: false,
  },
  {
    type: "awards",
    title: "Awards",
    description: "Highlight prizes, honours, and recognition you've received.",
    multiple: true,
  },
  {
    type: "volunteering",
    title: "Volunteering",
    description:
      "Add unpaid roles, community work, and causes you've contributed to.",
    multiple: true,
  },
  {
    type: "interests",
    title: "Interests",
    description:
      "Round out your profile with hobbies and interests outside of work.",
    multiple: false,
  },
];
