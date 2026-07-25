// The timeline entries the "Rewrite highlights" task can act on. Shared by the
// AI panel, which uses it to decide whether the card is available, and the
// task dialog, which offers them as choices.

import { isTimelineSection } from "@/lib/defaults";
import { isMarkdownEmpty } from "@/lib/markdown";
import type { ResumeData } from "@/lib/types";

export interface EntryOption {
  sectionId: string;
  itemId: string;
  label: string;
  /** False when the entry has no highlights yet — nothing to rewrite. */
  ready: boolean;
}

export function timelineEntries(data: ResumeData): EntryOption[] {
  return data.sections.flatMap((section) =>
    isTimelineSection(section)
      ? section.items
          .filter((item) => !item.hidden)
          .map((item) => ({
            sectionId: section.id,
            itemId: item.id,
            label:
              [item.role, item.company].filter(Boolean).join(" · ") ||
              "Untitled entry",
            ready: !isMarkdownEmpty(item.highlights),
          }))
      : [],
  );
}
