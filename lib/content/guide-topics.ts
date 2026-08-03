// The filter row on /guides.
//
// Each guide already carries an eyebrow — "Formatting", "Early career",
// "Cover letters" — and there are eighteen of them across forty-odd guides.
// Eighteen chips is a menu, not a filter, so the eyebrows are gathered into
// six topics here. The eyebrow stays what the card and the article show; this
// is only the grouping above them.
//
// Nothing derives the topics from the eyebrows automatically because the
// grouping is an editorial judgement — "Deciding" belongs with formats and
// "Review" belongs with writing, and no amount of string matching knows that.
// What is checked automatically is that every eyebrow is in exactly one topic:
// an unlisted one would make its guides reachable under "All" and nowhere
// else, which is the kind of thing nobody notices for a year.

import { GUIDES } from "@/lib/content/guides";

export interface GuideTopic {
  id: string;
  label: string;
  /** The eyebrows that fall under it. */
  eyebrows: string[];
}

export const GUIDE_TOPICS: GuideTopic[] = [
  {
    id: "start",
    label: "Getting started",
    eyebrows: ["Basics", "Guide", "Practical", "Vocabulary"],
  },
  {
    id: "writing",
    label: "Writing",
    eyebrows: ["Writing", "AI writing", "Review"],
  },
  {
    id: "ats",
    label: "ATS & formatting",
    eyebrows: ["ATS", "Formatting"],
  },
  {
    id: "sections",
    label: "Sections",
    eyebrows: ["Sections", "Skills"],
  },
  {
    id: "formats",
    label: "Formats",
    eyebrows: ["Formats", "Deciding"],
  },
  {
    id: "situations",
    label: "Situations",
    eyebrows: ["Early career", "Situations", "International", "Cover letters"],
  },
];

const BY_EYEBROW = new Map(
  GUIDE_TOPICS.flatMap((topic) => topic.eyebrows.map((e) => [e, topic.id])),
);

if (process.env.NODE_ENV !== "production") {
  const orphans = [
    ...new Set(GUIDES.map((g) => g.eyebrow).filter((e) => !BY_EYEBROW.has(e))),
  ];
  if (orphans.length) {
    throw new Error(
      `guide-topics: no topic covers the eyebrow ${orphans.map((e) => `"${e}"`).join(", ")}`,
    );
  }
}

/** The topic a guide sits under, by its eyebrow. */
export function topicOf(eyebrow: string): string | null {
  return BY_EYEBROW.get(eyebrow) ?? null;
}

/** The chips, each with the number of guides behind it. Topics with nothing
 *  in them don't appear — an empty filter is a dead end. */
export function topicChips(): { id: string; label: string; count: number }[] {
  return GUIDE_TOPICS.map((topic) => ({
    id: topic.id,
    label: topic.label,
    count: GUIDES.filter((guide) => topicOf(guide.eyebrow) === topic.id).length,
  })).filter((chip) => chip.count > 0);
}
