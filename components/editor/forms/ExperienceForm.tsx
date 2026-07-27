"use client";

import { useResume } from "@/lib/store";
import { Field, Input } from "@/components/ui/fields";
import { Checkbox } from "@/components/ui/checkbox";
import { EntryCard, useEntryDrag, useEntryList } from "./EntryCard";
import { formatRange } from "@/lib/format";
import { isMarkdownEmpty, markdownToText } from "@/lib/markdown";
import { AssistedField } from "@/components/editor/ai/AssistedField";
import { isTimelineSection, moveById, showsDates } from "@/lib/defaults";
import type {
  ExperienceItem,
  ExperienceSection,
  TimelineType,
} from "@/lib/types";

/** The shape is shared across timeline sections; only the wording changes. */
const LABELS: Record<
  TimelineType,
  {
    tip: string;
    entry: string;
    role: string;
    rolePlaceholder: string;
    org: string;
    orgPlaceholder: string;
  }
> = {
  experience: {
    tip: "Start each highlight with an action verb and a number — \u201cCut build times 40%\u201d beats \u201cResponsible for builds\u201d.",
    entry: "Entry",
    role: "Role / Title",
    rolePlaceholder: "Product Designer",
    org: "Company",
    orgPlaceholder: "Acme Inc.",
  },
  projects: {
    tip: "Say what it does, what you built, and the outcome. Link the repo or live site in the second field.",
    entry: "Project",
    role: "Project name",
    rolePlaceholder: "Design system revamp",
    org: "Organisation / link",
    orgPlaceholder: "github.com/you/project",
  },
  volunteering: {
    tip: "Treat it like a role: what you did, who it served, and what changed because of it.",
    entry: "Entry",
    role: "Role",
    rolePlaceholder: "Mentor",
    org: "Organisation",
    orgPlaceholder: "Code Club",
  },
};

export function ExperienceForm({ section }: { section: ExperienceSection }) {
  const { data, update } = useResume();
  const labels = LABELS[section.type];
  const entries = useEntryList(section.id, section.items);

  const withSection = (fn: (s: ExperienceSection) => void) =>
    update((d) => {
      const s = d.sections.find((x) => x.id === section.id);
      if (s && isTimelineSection(s)) fn(s);
    });

  const patchItem = (itemId: string, patch: Partial<ExperienceItem>) =>
    withSection((s) => {
      const item = s.items.find((i) => i.id === itemId);
      if (item) Object.assign(item, patch);
    });

  const dragProps = useEntryDrag(
    section.items.map((i) => i.id),
    (from, to) => withSection((s) => moveById(s.items, from, to)),
  );

  /** What the closed row says — whatever the entry has to say for itself. */
  const rowMeta = (item: ExperienceItem) =>
    [
      item.company,
      showsDates(section)
        ? formatRange(
            item.startDate,
            item.endDate,
            item.current,
            data.settings.language,
          )
        : "",
    ]
      .filter(Boolean)
      .join(" · ");

  return (
    <div>
      {entries.items.map((item) => (
        <EntryCard
          key={item.id}
          open={entries.isOpen(item.id)}
          onOpen={() => entries.open(item.id)}
          drag={entries.editing ? undefined : dragProps(item.id)}
          title={`${labels.entry} ${section.items.indexOf(item) + 1}`}
          summary={item.role || markdownToText(item.highlights)}
          meta={rowMeta(item)}
          tip={labels.tip}
          hidden={item.hidden}
          onToggleHidden={() => patchItem(item.id, { hidden: !item.hidden })}
          onDelete={
            section.items.length > 1
              ? () =>
                  withSection((s) => {
                    s.items = s.items.filter((i) => i.id !== item.id);
                  })
              : undefined
          }
        >
          {/* Groups (who/where, when, highlights) sit further apart than the
              fields within each group — the personal details card's rhythm. */}
          <div className="space-y-7">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={labels.role}>
                <Input
                  value={item.role}
                  onChange={(e) => patchItem(item.id, { role: e.target.value })}
                  placeholder={labels.rolePlaceholder}
                />
              </Field>
              <Field label={labels.org}>
                <Input
                  value={item.company}
                  onChange={(e) =>
                    patchItem(item.id, { company: e.target.value })
                  }
                  placeholder={labels.orgPlaceholder}
                />
              </Field>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
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
                    onChange={(e) =>
                      patchItem(item.id, { endDate: e.target.value })
                    }
                    className={item.current ? "opacity-50" : ""}
                  />
                </Field>
                <Field label="Location" className="col-span-2 sm:col-span-1">
                  <Input
                    value={item.location}
                    onChange={(e) =>
                      patchItem(item.id, { location: e.target.value })
                    }
                    placeholder="Remote"
                  />
                </Field>
              </div>

              <label className="flex w-fit items-center gap-2 text-[14px] font-medium text-ink-soft">
                <Checkbox
                  checked={item.current}
                  onCheckedChange={(v) =>
                    patchItem(item.id, { current: v === true })
                  }
                />
                I currently work here
              </label>
            </div>

            <AssistedField
              label="Highlights"
              value={item.highlights}
              onChange={(md) => patchItem(item.id, { highlights: md })}
              request={() => ({
                task: "highlights",
                target: { sectionId: section.id, itemId: item.id },
              })}
              disabled={isMarkdownEmpty(item.highlights)}
              disabledHint="Write a highlight first — the assistant sharpens what you've written rather than inventing it."
              placeholder="Led a redesign that lifted conversion by 18%…"
              minHeight={150}
            />
          </div>
        </EntryCard>
      ))}
    </div>
  );
}
