"use client";

import { useState } from "react";
import { useResume } from "@/lib/store";
import { Field, Input } from "@/components/ui/fields";
import { PlusIcon, TrashIcon, XIcon } from "@/components/ui/icons";
import { newSkillGroup } from "@/lib/defaults";
import type { SkillsSection } from "@/lib/types";

export function SkillsForm({ section }: { section: SkillsSection }) {
  const { update } = useResume();
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const withSection = (fn: (s: SkillsSection) => void) =>
    update((d) => {
      const s = d.sections.find((x) => x.id === section.id);
      if (s && s.type === "skills") fn(s);
    });

  const addSkill = (groupId: string) => {
    const value = (drafts[groupId] ?? "").trim();
    if (!value) return;
    withSection((s) => {
      const g = s.groups.find((x) => x.id === groupId);
      if (g && !g.skills.includes(value)) g.skills.push(value);
    });
    setDrafts((prev) => ({ ...prev, [groupId]: "" }));
  };

  return (
    <div className="space-y-4">
      {section.groups.map((group, index) => (
        <div
          key={group.id}
          className="rounded-xl border border-black/5 bg-cream/40 p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[13px] font-bold text-ink-soft">
              Group {index + 1}
            </span>
            {section.groups.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  withSection((s) => {
                    s.groups = s.groups.filter((g) => g.id !== group.id);
                  })
                }
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint transition hover:bg-black/5 hover:text-danger"
                aria-label="Remove group"
              >
                <TrashIcon className="h-[18px] w-[18px]" />
              </button>
            )}
          </div>

          <Field label="Category (optional)">
            <Input
              value={group.name}
              onChange={(e) =>
                withSection((s) => {
                  const g = s.groups.find((x) => x.id === group.id);
                  if (g) g.name = e.target.value;
                })
              }
              placeholder="e.g. Languages, Tools, Soft skills"
            />
          </Field>

          {group.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 rounded-lg bg-purple-soft px-2.5 py-1 text-[13px] font-medium text-purple"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() =>
                      withSection((s) => {
                        const g = s.groups.find((x) => x.id === group.id);
                        if (g) g.skills = g.skills.filter((sk) => sk !== skill);
                      })
                    }
                    aria-label={`Remove ${skill}`}
                  >
                    <XIcon className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="mt-3">
            <Input
              value={drafts[group.id] ?? ""}
              onChange={(e) =>
                setDrafts((prev) => ({ ...prev, [group.id]: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addSkill(group.id);
                }
              }}
              onBlur={() => addSkill(group.id)}
              placeholder="Type a skill and press Enter"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => withSection((s) => void s.groups.push(newSkillGroup()))}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-ink-faint/40 py-2.5 text-[14px] font-semibold text-ink-soft transition hover:border-purple/50 hover:text-purple"
      >
        <PlusIcon className="h-4 w-4" />
        Add skill group
      </button>
    </div>
  );
}
