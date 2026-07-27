"use client";

import { useResume } from "@/lib/store";
import { Input } from "@/components/ui/fields";
import {
  ChevronDownIcon,
  DragIcon,
  TrashIcon,
} from "@/components/ui/svg-icons";
import { useEntryDrag } from "./EntryCard";
import { NudgeButtons } from "../NudgeButtons";
import { isTagGroupSection, moveById } from "@/lib/defaults";
import { skillLevels } from "@/lib/i18n";
import type { SkillItem, SkillsSection, TagGroupType } from "@/lib/types";

/** The shape is shared across tag-group sections; only the wording changes. */
const LABELS: Record<
  TagGroupType,
  { placeholder: string; levelLabel: string }
> = {
  skills: { placeholder: "e.g. Java", levelLabel: "Level" },
  languages: { placeholder: "e.g. Arabic", levelLabel: "Fluency" },
  interests: { placeholder: "e.g. Long-distance running", levelLabel: "" },
};

export function SkillsForm({ section }: { section: SkillsSection }) {
  const { data, update } = useResume();
  const labels = LABELS[section.type];
  const levels = skillLevels(section.type, data.settings.language);

  const withSection = (fn: (s: SkillsSection) => void) =>
    update((d) => {
      const s = d.sections.find((x) => x.id === section.id);
      if (s && isTagGroupSection(s)) fn(s);
    });

  const patchItem = (itemId: string, patch: Partial<SkillItem>) =>
    withSection((s) => {
      const item = s.items.find((i) => i.id === itemId);
      if (item) Object.assign(item, patch);
    });

  const dragProps = useEntryDrag(
    section.items.map((i) => i.id),
    (from, to) => withSection((s) => moveById(s.items, from, to)),
  );

  /** Enter at the end of the list adds the next one, so a long list can be
   *  typed without reaching for the mouse. */
  const addAfter = () =>
    withSection((s) => {
      s.items.push({ id: crypto.randomUUID(), name: "" });
    });

  return (
    <div className="space-y-2 px-5 pb-1">
      {section.items.map((item, i) => {
        const drag = dragProps(item.id);
        return (
          <div
            key={item.id}
            draggable
            onDragStart={drag.onDragStart}
            onDragEnd={drag.onDragEnd}
            onDragEnter={drag.onDragEnter}
            onDragOver={(e) => e.preventDefault()}
            className={`flex items-center gap-2 ${drag.dragging ? "opacity-40" : ""}`}
          >
            <button
              type="button"
              aria-label="Reorder"
              onKeyDown={(e) => {
                if (e.key === "ArrowUp") drag.onNudge(-1);
                if (e.key === "ArrowDown") drag.onNudge(1);
              }}
              className="hidden shrink-0 cursor-grab text-ink-faint transition hover:text-ink active:cursor-grabbing md:block"
            >
              <DragIcon className="h-[18px] w-[18px]" />
            </button>

            <NudgeButtons onNudge={drag.onNudge} label={item.name || "entry"} />

            <Input
              value={item.name}
              onChange={(e) => patchItem(item.id, { name: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter" && i === section.items.length - 1) {
                  e.preventDefault();
                  addAfter();
                }
              }}
              placeholder={labels.placeholder}
              className="h-11 min-w-0 py-0"
            />

            {levels.length > 0 && (
              <div className="relative shrink-0">
                <select
                  aria-label={labels.levelLabel}
                  value={item.level ?? 0}
                  onChange={(e) =>
                    patchItem(item.id, {
                      level: Number(e.target.value) || undefined,
                    })
                  }
                  className="h-11 w-[104px] appearance-none rounded-xl bg-field px-3 pr-7 text-[13px] font-medium text-ink outline-none focus-visible:ring-2 focus-visible:ring-ink/80 sm:w-[136px] sm:text-[14px]"
                >
                  <option value={0}>No level</option>
                  {levels.map((name: string, li: number) => (
                    <option key={name} value={li + 1}>
                      {name}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-ink-faint" />
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                withSection((s) => {
                  s.items = s.items.filter((x) => x.id !== item.id);
                })
              }
              disabled={section.items.length <= 1}
              aria-label={`Remove ${item.name || "entry"}`}
              className="inline-flex h-11 w-9 shrink-0 items-center justify-center rounded-lg text-ink-faint transition hover:bg-black/5 hover:text-danger disabled:pointer-events-none disabled:opacity-30"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
