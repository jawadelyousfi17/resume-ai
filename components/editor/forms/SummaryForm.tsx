"use client";

import { useResume } from "@/lib/store";
import { Textarea } from "@/components/ui/fields";
import type { SummarySection } from "@/lib/types";

export function SummaryForm({ section }: { section: SummarySection }) {
  const { update } = useResume();

  const setContent = (value: string) =>
    update((d) => {
      const s = d.sections.find((x) => x.id === section.id);
      if (s && s.type === "summary") s.content = value;
    });

  return (
    <Textarea
      value={section.content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="Results-driven professional with a track record of…"
      className="min-h-[120px]"
    />
  );
}
