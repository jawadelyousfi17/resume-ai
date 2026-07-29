// The shape of a resume example, and the bridge from it to real ResumeData.
//
// An example is written here in the most compact form that still says
// everything — a summary, a few roles with their bullets, education, skills.
// `toResumeData` expands that into the same ResumeData the editor produces, so
// the sample on each page is rendered by <ResumePreview>, the component the
// app and the PDF export both use. There is no second renderer and no
// screenshot to go stale: if the product changes how a resume looks, these
// pages change with it.

import type { FaqEntry } from "@/lib/content/guides";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import { getTemplate } from "@/lib/templates";
import type { ResumeData, TemplateId } from "@/lib/types";

/** The groups the index page sorts examples into. */
export const EXAMPLE_CATEGORIES = [
  {
    id: "engineering",
    label: "Software & engineering",
    blurb: "Developers, data, infrastructure and security.",
  },
  {
    id: "product-design",
    label: "Product & design",
    blurb: "The people who decide what gets built, and how it looks.",
  },
  {
    id: "business",
    label: "Business & finance",
    blurb: "Analysis, delivery, accounting and operations.",
  },
  {
    id: "commercial",
    label: "Sales, marketing & people",
    blurb: "Revenue, demand, support and hiring.",
  },
  {
    id: "public",
    label: "Healthcare & education",
    blurb: "Licensed and classroom roles, where credentials lead.",
  },
] as const;

export type ExampleCategoryId = (typeof EXAMPLE_CATEGORIES)[number]["id"];

/** One job on the sample resume. */
export interface ExampleRole {
  role: string;
  company: string;
  location: string;
  /** "YYYY-MM". */
  start: string;
  /** "YYYY-MM", or omitted for the current job. */
  end?: string;
  /** One per bullet. `**bold**` is rendered, and is how metrics are lifted. */
  bullets: string[];
}

export interface ExampleSchool {
  degree: string;
  school: string;
  location: string;
  start: string;
  end: string;
}

export interface ExampleCredential {
  name: string;
  issuer: string;
  /** "YYYY-MM". */
  date: string;
}

/** A prose block on the page: heading, paragraphs, optional bulleted list. */
export interface ExampleSection {
  heading: string;
  body: string[];
  list?: string[];
}

/** A named bank of terms an ATS is likely to be matching against. */
export interface KeywordGroup {
  group: string;
  terms: string[];
}

export interface ResumeExample {
  slug: string;
  /** The job title, as the <h1> says it. */
  role: string;
  /** The other titles the same job is advertised under. These are real search
   *  terms — "software developer" and "software engineer" are the same job to
   *  a candidate and two different queries to a search engine. */
  aka: string[];
  category: ExampleCategoryId;
  /** The <title>, which can be longer and carry the brand. */
  metaTitle: string;
  description: string;
  /** ISO date, surfaced to readers and to search engines. */
  updated: string;
  intro: string;
  /** What a hiring manager looks for in the first ten seconds. */
  looksFor: string[];
  /** The document rendered on the page. */
  sample: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    links: { label: string; url: string }[];
    summary: string;
    experience: ExampleRole[];
    education: ExampleSchool[];
    skills: string[];
    certifications?: ExampleCredential[];
  };
  /** Which template the sample is laid out in. */
  template: TemplateId;
  /** The written advice, section by section. */
  sections: ExampleSection[];
  keywords: KeywordGroup[];
  mistakes: string[];
  faqs: FaqEntry[];
  /** Slugs of other examples worth reading. */
  related: string[];
  /** Slugs from /guides that go deeper on something this page raises. */
  guides: string[];
}

/**
 * Expand an example into the real document.
 *
 * Ids are derived from the slug rather than generated: this renders on the
 * server, and a random id would differ between the server and client trees.
 */
export function toResumeData(example: ResumeExample): ResumeData {
  const { sample, slug } = example;
  const template = getTemplate(example.template);

  return {
    personal: {
      fullName: sample.name,
      title: sample.title,
      email: sample.email,
      phone: sample.phone,
      location: sample.location,
      contactOrder: ["email", "phone", "location"],
      links: sample.links.map((link, i) => ({
        id: `${slug}-l${i}`,
        label: link.label,
        url: link.url,
      })),
    },
    sections: [
      {
        id: `${slug}-summary`,
        type: "summary",
        title: "Summary",
        content: sample.summary,
      },
      {
        id: `${slug}-experience`,
        type: "experience",
        title: "Experience",
        items: sample.experience.map((job, i) => ({
          id: `${slug}-e${i}`,
          role: job.role,
          company: job.company,
          location: job.location,
          startDate: job.start,
          endDate: job.end ?? "",
          current: !job.end,
          highlights: job.bullets.map((bullet) => `- ${bullet}`).join("\n"),
        })),
      },
      {
        id: `${slug}-education`,
        type: "education",
        title: "Education",
        items: sample.education.map((school, i) => ({
          id: `${slug}-ed${i}`,
          degree: school.degree,
          school: school.school,
          location: school.location,
          startDate: school.start,
          endDate: school.end,
          description: "",
        })),
      },
      {
        id: `${slug}-skills`,
        type: "skills",
        title: "Skills",
        // No levels. These pages argue against rating your own skills out of
        // five — an example that printed "Go (Expert)" would contradict the
        // advice beside it. Absent levels print the name alone, and the
        // templates that draw a meter fall back to their own default.
        items: sample.skills.map((name, i) => ({
          id: `${slug}-k${i}`,
          name,
        })),
      },
      ...(sample.certifications && sample.certifications.length > 0
        ? [
            {
              id: `${slug}-certs`,
              type: "certifications" as const,
              title: "Certifications",
              // A certification is awarded on a date, not held over a range —
              // an empty start prints the one date instead of "May 2023 – May
              // 2023".
              items: sample.certifications.map((credential, i) => ({
                id: `${slug}-c${i}`,
                degree: credential.name,
                school: credential.issuer,
                location: "",
                startDate: "",
                endDate: credential.date,
                description: "",
              })),
            },
          ]
        : []),
    ],
    settings: {
      ...DEFAULT_SETTINGS,
      template: example.template,
      fontFamily: template.presets.fontFamily,
      headingStyle: template.presets.headingStyle,
      accent: template.accent ?? DEFAULT_SETTINGS.accent,
    },
  };
}
