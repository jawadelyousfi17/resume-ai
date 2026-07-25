"use client";

// Writing a suggestion into the document. Each of these runs inside the
// store's `update(draft => …)`, so they mutate the draft in place.

import { createSection, isTagGroupSection, isTimelineSection } from "@/lib/defaults";
import type { ResumeData, Section } from "@/lib/types";
import { parseLines } from "./parse";

/** Sets the summary, adding the section at the top if there isn't one. */
export function applySummary(draft: ResumeData, markdown: string) {
  let section: Section | undefined = draft.sections.find(
    (s) => s.type === "summary",
  );
  if (!section) {
    section = createSection("summary");
    draft.sections.unshift(section);
  }
  if (section.type === "summary") section.content = markdown.trim();
}

/** Replaces one timeline entry's highlights. */
export function applyHighlights(
  draft: ResumeData,
  target: { sectionId: string; itemId: string },
  markdown: string,
) {
  const section = draft.sections.find((s) => s.id === target.sectionId);
  if (!section || !isTimelineSection(section)) return;
  const item = section.items.find((i) => i.id === target.itemId);
  if (item) item.highlights = markdown.trim();
}

/** Replaces the skills section's entries, adding the section if needed.
 *  Levels are left unset — proficiency is the user's to declare. */
export function applySkills(draft: ResumeData, text: string) {
  const parsed = parseLines(text);
  if (!parsed.length) return;

  let section: Section | undefined = draft.sections.find(
    (s) => s.type === "skills",
  );
  if (!section) {
    section = createSection("skills");
    draft.sections.push(section);
  }
  if (!isTagGroupSection(section)) return;

  section.items = parsed.map((name) => ({
    id: crypto.randomUUID(),
    name,
  }));
}

/** Sets the description on one credential entry. */
export function applyDescription(
  draft: ResumeData,
  target: { sectionId: string; itemId: string },
  markdown: string,
) {
  const section = draft.sections.find((s) => s.id === target.sectionId);
  if (!section || !("items" in section)) return;
  const item = section.items.find((i) => i.id === target.itemId);
  if (item && "description" in item) item.description = markdown.trim();
}
