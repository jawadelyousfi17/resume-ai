// How complete a resume is, as a percentage and a list of what's left.
//
// The meter is there to pull someone through to a finished page, so it never
// reads zero: a resume that exists has already been started, and that counts.
// Every other point is for something a recruiter actually looks for — a name
// and a headline, a way to reach you, a summary, a role written out with a
// result in it — not for having pressed buttons.
//
// Pure and synchronous: the editor recomputes it on every keystroke, and the
// dashboard runs it once per card.

import { isMarkdownEmpty, markdownToText } from "./markdown";
import type {
  ExperienceItem,
  ResumeData,
  SectionType,
  SkillItem,
} from "./types";

/** Where a step sends you: the personal-details card, or a section of this
 *  type — opened if the resume has one, added if it doesn't. */
export type StrengthTarget = "personal" | SectionType;

export interface StrengthStep {
  id: string;
  label: string;
  points: number;
  done: boolean;
  target: StrengthTarget;
}

export interface Strength {
  /** 0–100, never below the starting points. */
  score: number;
  steps: StrengthStep[];
  /** The undone step worth the most — what the meter suggests next. */
  next: StrengthStep | null;
}

export function resumeStrength(data: ResumeData): Strength {
  const p = data.personal;
  const sections = data.sections;
  const ofType = <T extends SectionType>(type: T) =>
    sections.filter((s) => s.type === type);

  const summary = ofType("summary").some(
    (s) => "content" in s && markdownToText(s.content).trim().length >= 40,
  );

  const roles = sections.flatMap((s) =>
    s.type === "experience" ? (s.items as ExperienceItem[]) : [],
  );
  const written = roles.filter(
    (r) => !r.hidden && r.role.trim() && !isMarkdownEmpty(r.highlights),
  );
  // A number in a bullet is the cheapest tell of a result rather than a duty.
  const quantified = written.some((r) =>
    /\d/.test(markdownToText(r.highlights)),
  );

  const education = ofType("education").some(
    (s) => "items" in s && s.items.length > 0,
  );
  const skills = sections
    .flatMap((s) => (s.type === "skills" ? (s.items as SkillItem[]) : []))
    .filter((i) => !i.hidden && i.name.trim()).length;

  const steps: StrengthStep[] = [
    {
      id: "start",
      label: "Resume started",
      points: 10,
      done: true,
      target: "personal",
    },
    {
      id: "identity",
      label: "Add your name and title",
      points: 15,
      done: Boolean(p.fullName.trim() && p.title.trim()),
      target: "personal",
    },
    {
      id: "contact",
      label: "Add an email or phone",
      points: 10,
      done: Boolean(p.email.trim() || p.phone.trim()),
      target: "personal",
    },
    {
      id: "link",
      label: "Add a LinkedIn or portfolio link",
      points: 5,
      done: p.links.some((l) => Boolean(l.url.trim())),
      target: "personal",
    },
    {
      id: "summary",
      label: "Write a summary",
      points: 15,
      done: summary,
      target: "summary",
    },
    {
      id: "experience",
      label: "Describe a role",
      points: 20,
      done: written.length > 0,
      target: "experience",
    },
    {
      id: "result",
      label: "Put a number in a bullet",
      points: 5,
      done: quantified,
      target: "experience",
    },
    {
      id: "education",
      label: "Add your education",
      points: 10,
      done: education,
      target: "education",
    },
    {
      id: "skills",
      label: "List three skills",
      points: 10,
      done: skills >= 3,
      target: "skills",
    },
  ];

  const score = steps.reduce((n, s) => n + (s.done ? s.points : 0), 0);
  const next =
    steps
      .filter((s) => !s.done)
      .sort((a, b) => b.points - a.points)[0] ?? null;

  return { score: Math.min(100, score), steps, next };
}
