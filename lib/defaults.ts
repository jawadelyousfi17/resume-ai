// Factories for new resumes and sections, plus the metadata that drives the
// "Add content" picker.

import type {
  EducationItem,
  EducationSection,
  ExperienceItem,
  ExperienceSection,
  FontFamily,
  Resume,
  ResumeSettings,
  Section,
  SectionType,
  SkillGroup,
  SkillsSection,
  SummarySection,
} from "./types";

const uid = () => crypto.randomUUID();

export const DEFAULT_SETTINGS: ResumeSettings = {
  accent: "#2563eb",
  fontFamily: "sans",
  fontSize: 10.5,
  lineHeight: 1.35,
  marginX: 16,
  marginY: 14,
  headingStyle: "underline",
};

/** CSS font stacks used by the live preview, per family choice. */
export const FONT_STACKS: Record<FontFamily, string> = {
  sans: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  serif: "Georgia, 'Times New Roman', Times, serif",
  mono: "'SFMono-Regular', Menlo, Consolas, monospace",
};

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
    bullets: [""],
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

export function newSkillGroup(): SkillGroup {
  return { id: uid(), name: "", skills: [] };
}

export function createSection(type: SectionType): Section {
  switch (type) {
    case "summary":
      return { id: uid(), type, title: "Summary", content: "" } satisfies SummarySection;
    case "experience":
      return {
        id: uid(),
        type,
        title: "Professional Experience",
        items: [newExperienceItem()],
      } satisfies ExperienceSection;
    case "education":
      return {
        id: uid(),
        type,
        title: "Education",
        items: [newEducationItem()],
      } satisfies EducationSection;
    case "skills":
      return {
        id: uid(),
        type,
        title: "Skills",
        groups: [newSkillGroup()],
      } satisfies SkillsSection;
  }
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
    description: "Add a short summary of your key strengths, experience, and career goals.",
    multiple: false,
  },
  {
    type: "experience",
    title: "Professional Experience",
    description: "Add your professional roles and employer history including internships.",
    multiple: true,
  },
  {
    type: "education",
    title: "Education",
    description: "Add your degrees and schools. Include your focus, honors, or exchange terms.",
    multiple: true,
  },
  {
    type: "skills",
    title: "Skills",
    description: "Add your hard and soft skills that help you stand out from the crowd today.",
    multiple: true,
  },
];
