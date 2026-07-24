"use client";

import { useResume } from "@/lib/store";
import { Field, Input, Textarea } from "@/components/ui/fields";
import { PlusIcon, TrashIcon } from "@/components/ui/icons";
import { newEducationItem } from "@/lib/defaults";
import type { EducationItem, EducationSection } from "@/lib/types";

export function EducationForm({ section }: { section: EducationSection }) {
  const { update } = useResume();

  const withSection = (fn: (s: EducationSection) => void) =>
    update((d) => {
      const s = d.sections.find((x) => x.id === section.id);
      if (s && s.type === "education") fn(s);
    });

  const patchItem = (itemId: string, patch: Partial<EducationItem>) =>
    withSection((s) => {
      const item = s.items.find((i) => i.id === itemId);
      if (item) Object.assign(item, patch);
    });

  return (
    <div className="space-y-4">
      {section.items.map((item, index) => (
        <div
          key={item.id}
          className="rounded-xl border border-black/5 bg-cream/40 p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[13px] font-bold text-ink-soft">
              Entry {index + 1}
            </span>
            {section.items.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  withSection((s) => {
                    s.items = s.items.filter((i) => i.id !== item.id);
                  })
                }
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint transition hover:bg-black/5 hover:text-danger"
                aria-label="Remove entry"
              >
                <TrashIcon className="h-[18px] w-[18px]" />
              </button>
            )}
          </div>

          <div className="space-y-3">
            <Field label="Degree / Qualification">
              <Input
                value={item.degree}
                onChange={(e) => patchItem(item.id, { degree: e.target.value })}
                placeholder="B.Sc. Computer Science"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="School">
                <Input
                  value={item.school}
                  onChange={(e) =>
                    patchItem(item.id, { school: e.target.value })
                  }
                  placeholder="University of…"
                />
              </Field>
              <Field label="Location">
                <Input
                  value={item.location}
                  onChange={(e) =>
                    patchItem(item.id, { location: e.target.value })
                  }
                  placeholder="City, Country"
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start">
                <Input
                  type="month"
                  value={item.startDate}
                  onChange={(e) =>
                    patchItem(item.id, { startDate: e.target.value })
                  }
                />
              </Field>
              <Field label="End">
                <Input
                  type="month"
                  value={item.endDate}
                  onChange={(e) =>
                    patchItem(item.id, { endDate: e.target.value })
                  }
                />
              </Field>
            </div>
            <Field label="Description (optional)">
              <Textarea
                value={item.description}
                onChange={(e) =>
                  patchItem(item.id, { description: e.target.value })
                }
                placeholder="Honors, focus areas, notable coursework…"
                className="min-h-[60px]"
              />
            </Field>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          withSection((s) => void s.items.push(newEducationItem()))
        }
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-ink-faint/40 py-2.5 text-[14px] font-semibold text-ink-soft transition hover:border-purple/50 hover:text-purple"
      >
        <PlusIcon className="h-4 w-4" />
        Add another degree
      </button>
    </div>
  );
}
