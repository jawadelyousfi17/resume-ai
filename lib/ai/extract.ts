// Reading an existing resume file into the editor's own shape.
//
// The model is asked for a flat, id-free document via structured outputs — a
// schema the API enforces, so the response parses or the request fails, and
// there's no half-valid JSON to defend against. Ids, section wrappers and
// settings are added here afterwards; the model never invents them.

import { DEFAULT_CONTACT_ORDER, DEFAULT_SETTINGS } from "@/lib/defaults";
import { escapeMarkdown } from "@/lib/markdown";
import { SECTION_TITLES, type LanguageCode } from "@/lib/i18n";
import type { ResumeData, Section } from "@/lib/types";

/** Every object needs `additionalProperties: false` and a complete `required`
 *  list — the API rejects a schema without them. Unknown values come back as
 *  empty strings or 0 rather than being omitted. */
export const EXTRACTION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "personal",
    "summary",
    "experience",
    "education",
    "projects",
    "skills",
    "languages",
  ],
  properties: {
    personal: {
      type: "object",
      additionalProperties: false,
      required: ["fullName", "title", "email", "phone", "location", "links"],
      properties: {
        fullName: { type: "string" },
        title: { type: "string", description: "Professional headline, e.g. 'Backend Engineer'" },
        email: { type: "string" },
        phone: { type: "string" },
        location: { type: "string" },
        links: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["label", "url"],
            properties: {
              label: { type: "string", description: "e.g. LinkedIn, GitHub, Portfolio" },
              url: { type: "string" },
            },
          },
        },
      },
    },
    summary: {
      type: "string",
      description: "The professional summary or profile paragraph, as plain prose.",
    },
    experience: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["role", "company", "location", "startDate", "endDate", "current", "highlights"],
        properties: {
          role: { type: "string" },
          company: { type: "string" },
          location: { type: "string" },
          startDate: { type: "string", description: "YYYY-MM, or empty if not stated" },
          endDate: { type: "string", description: "YYYY-MM, or empty if ongoing or not stated" },
          current: { type: "boolean", description: "True if this is the person's current role" },
          highlights: {
            type: "array",
            description: "One entry per bullet point, verbatim.",
            items: { type: "string" },
          },
        },
      },
    },
    education: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["degree", "school", "location", "startDate", "endDate", "description"],
        properties: {
          degree: { type: "string" },
          school: { type: "string" },
          location: { type: "string" },
          startDate: { type: "string", description: "YYYY-MM, or empty" },
          endDate: { type: "string", description: "YYYY-MM, or empty" },
          description: { type: "string" },
        },
      },
    },
    projects: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "link", "description"],
        properties: {
          name: { type: "string" },
          link: { type: "string", description: "Repository or live URL, or empty" },
          description: { type: "string" },
        },
      },
    },
    skills: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "level"],
        properties: {
          name: { type: "string" },
          level: {
            type: "integer",
            enum: [0, 1, 2, 3, 4],
            description:
              "0 unless the resume states a proficiency: 1 beginner, 2 intermediate, 3 advanced, 4 expert.",
          },
        },
      },
    },
    languages: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "level"],
        properties: {
          name: { type: "string" },
          level: {
            type: "integer",
            enum: [0, 1, 2, 3, 4],
            description:
              "0 unless the resume states a level: 1 basic, 2 conversational, 3 fluent, 4 native.",
          },
        },
      },
    },
  },
} as const;

export const EXTRACTION_SYSTEM = `You read a resume and transcribe it into structured fields.

This is transcription, not writing. Copy what the document says:

- Never invent, embellish, or infer a fact that isn't on the page. No employer, date, title, metric, or skill that isn't written there.
- Keep the person's own wording for summaries and bullet points. Fix only obvious extraction artefacts — a word broken across a line, a stray bullet glyph, doubled whitespace.
- Leave a field empty rather than guessing at it. An empty string is the correct answer for something the resume doesn't say.
- Dates become YYYY-MM. "Mar 2021" is "2021-03"; a year on its own becomes January of that year; "Present", "Current" and "Now" mean an empty end date with current set to true.
- Split each bullet point into its own highlight, in the order they appear.
- Set a proficiency level only where the document states one. Otherwise 0.`;

/** The shape the schema above produces. */
export interface ExtractedResume {
  personal: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    links: { label: string; url: string }[];
  };
  summary: string;
  experience: {
    role: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    highlights: string[];
  }[];
  education: {
    degree: string;
    school: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  projects: { name: string; link: string; description: string }[];
  skills: { name: string; level: number }[];
  languages: { name: string; level: number }[];
}

const uid = () => crypto.randomUUID();
const clean = (value: unknown) => (typeof value === "string" ? value.trim() : "");

/** Plain lines become a Markdown bullet list, escaped so a stray `*` in the
 *  original stays literal text. */
const bulletList = (lines: string[]) =>
  lines
    .map(clean)
    .filter(Boolean)
    .map((line) => `- ${escapeMarkdown(line)}`)
    .join("\n");

const level = (value: unknown) =>
  typeof value === "number" && value >= 1 && value <= 4 ? value : undefined;

/**
 * Turns an extraction into a real document: ids minted here, empty sections
 * dropped, headings in the language the resume will be written in.
 */
export function toResumeData(
  extracted: ExtractedResume,
  lang: LanguageCode = "en",
): ResumeData {
  const titles = SECTION_TITLES[lang];
  const sections: Section[] = [];

  const summary = clean(extracted.summary);
  if (summary) {
    sections.push({
      id: uid(),
      type: "summary",
      title: titles.summary,
      content: escapeMarkdown(summary),
    });
  }

  const experience = (extracted.experience ?? []).filter(
    (item) => clean(item.role) || clean(item.company),
  );
  if (experience.length) {
    sections.push({
      id: uid(),
      type: "experience",
      title: titles.experience,
      items: experience.map((item) => ({
        id: uid(),
        role: clean(item.role),
        company: clean(item.company),
        location: clean(item.location),
        startDate: clean(item.startDate),
        endDate: clean(item.endDate),
        current: item.current === true,
        highlights: bulletList(item.highlights ?? []),
      })),
    });
  }

  const projects = (extracted.projects ?? []).filter((item) => clean(item.name));
  if (projects.length) {
    sections.push({
      id: uid(),
      type: "projects",
      title: titles.projects,
      items: projects.map((item) => ({
        id: uid(),
        role: clean(item.name),
        // The projects form uses the second field for an organisation or link.
        company: clean(item.link),
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        highlights: clean(item.description)
          ? escapeMarkdown(clean(item.description))
          : "",
      })),
    });
  }

  const education = (extracted.education ?? []).filter(
    (item) => clean(item.degree) || clean(item.school),
  );
  if (education.length) {
    sections.push({
      id: uid(),
      type: "education",
      title: titles.education,
      items: education.map((item) => ({
        id: uid(),
        degree: clean(item.degree),
        school: clean(item.school),
        location: clean(item.location),
        startDate: clean(item.startDate),
        endDate: clean(item.endDate),
        description: clean(item.description)
          ? escapeMarkdown(clean(item.description))
          : "",
      })),
    });
  }

  for (const [type, list] of [
    ["skills", extracted.skills],
    ["languages", extracted.languages],
  ] as const) {
    const items = (list ?? []).filter((item) => clean(item.name));
    if (!items.length) continue;
    sections.push({
      id: uid(),
      type,
      title: titles[type],
      items: items.map((item) => ({
        id: uid(),
        name: clean(item.name),
        level: level(item.level),
      })),
    });
  }

  const personal = extracted.personal ?? ({} as ExtractedResume["personal"]);

  return {
    personal: {
      fullName: clean(personal.fullName),
      title: clean(personal.title),
      email: clean(personal.email),
      phone: clean(personal.phone),
      location: clean(personal.location),
      contactOrder: [...DEFAULT_CONTACT_ORDER],
      links: (personal.links ?? [])
        .filter((link) => clean(link.url) || clean(link.label))
        .map((link) => ({
          id: uid(),
          label: clean(link.label),
          url: clean(link.url),
        })),
    },
    sections,
    settings: { ...DEFAULT_SETTINGS, language: lang },
  };
}

/** A name for the new resume, taken from whoever it belongs to. */
export function importedResumeName(extracted: ExtractedResume): string {
  const name = clean(extracted.personal?.fullName);
  return name ? `${name}'s Resume` : "Imported Resume";
}
