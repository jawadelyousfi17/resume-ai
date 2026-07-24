"use client";

import { useResume } from "@/lib/store";
import { Field, Input, Textarea } from "@/components/ui/fields";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusIcon, TrashIcon } from "@/components/ui/icons";
import { newExperienceItem } from "@/lib/defaults";
import type { ExperienceItem, ExperienceSection } from "@/lib/types";

export function ExperienceForm({ section }: { section: ExperienceSection }) {
  const { update } = useResume();

  const withSection = (fn: (s: ExperienceSection) => void) =>
    update((d) => {
      const s = d.sections.find((x) => x.id === section.id);
      if (s && s.type === "experience") fn(s);
    });

  const patchItem = (itemId: string, patch: Partial<ExperienceItem>) =>
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

          <div className="grid grid-cols-2 gap-3">
            <Field label="Role / Title">
              <Input
                value={item.role}
                onChange={(e) => patchItem(item.id, { role: e.target.value })}
                placeholder="Product Designer"
              />
            </Field>
            <Field label="Company">
              <Input
                value={item.company}
                onChange={(e) => patchItem(item.id, { company: e.target.value })}
                placeholder="Acme Inc."
              />
            </Field>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
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
                disabled={item.current}
                onChange={(e) => patchItem(item.id, { endDate: e.target.value })}
                className={item.current ? "opacity-50" : ""}
              />
            </Field>
            <Field label="Location">
              <Input
                value={item.location}
                onChange={(e) =>
                  patchItem(item.id, { location: e.target.value })
                }
                placeholder="Remote"
              />
            </Field>
          </div>

          <label className="mt-2 flex w-fit items-center gap-2 text-[14px] font-medium text-ink-soft">
            <Checkbox
              checked={item.current}
              onCheckedChange={(v) =>
                patchItem(item.id, { current: v === true })
              }
            />
            I currently work here
          </label>

          <div className="mt-3">
            <span className="mb-1.5 block text-[13px] font-bold text-ink">
              Highlights
            </span>
            <div className="space-y-2">
              {item.bullets.map((bullet, bi) => (
                <div key={bi} className="flex items-start gap-2">
                  <span className="mt-3.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-faint" />
                  <Textarea
                    value={bullet}
                    onChange={(e) =>
                      withSection((s) => {
                        const it = s.items.find((i) => i.id === item.id);
                        if (it) it.bullets[bi] = e.target.value;
                      })
                    }
                    placeholder="Led a redesign that lifted conversion by 18%…"
                    className="min-h-[42px] py-2"
                  />
                  {item.bullets.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        withSection((s) => {
                          const it = s.items.find((i) => i.id === item.id);
                          if (it) it.bullets.splice(bi, 1);
                        })
                      }
                      className="mt-1.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-faint transition hover:bg-black/5 hover:text-danger"
                      aria-label="Remove highlight"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                withSection((s) => {
                  const it = s.items.find((i) => i.id === item.id);
                  if (it) it.bullets.push("");
                })
              }
              className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-purple transition hover:opacity-80"
            >
              <PlusIcon className="h-4 w-4" />
              Add highlight
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          withSection((s) => void s.items.push(newExperienceItem()))
        }
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-ink-faint/40 py-2.5 text-[14px] font-semibold text-ink-soft transition hover:border-purple/50 hover:text-purple"
      >
        <PlusIcon className="h-4 w-4" />
        Add another position
      </button>
    </div>
  );
}
