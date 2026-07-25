"use client";

import { useResume } from "@/lib/store";
import { AssistedField } from "@/components/editor/ai/AssistedField";
import { isMarkdownEmpty } from "@/lib/markdown";
import type { SummarySection } from "@/lib/types";

export function SummaryForm({ section }: { section: SummarySection }) {
  const { update } = useResume();

  const setContent = (value: string) =>
    update((d) => {
      const s = d.sections.find((x) => x.id === section.id);
      if (s && s.type === "summary") s.content = value;
    });

  return (
    <AssistedField
      label={section.title}
      value={section.content}
      onChange={setContent}
      request={() => ({ task: "summary" })}
      assistLabel={
        isMarkdownEmpty(section.content) ? "Write with AI" : "Improve with AI"
      }
      placeholder="Product designer with eight years across fintech and health…"
      minHeight={120}
    />
  );
}
