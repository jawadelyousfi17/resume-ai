"use client";

import { useResume } from "@/lib/store";
import { Field, Input } from "@/components/ui/fields";
import { EntryCard, useEntryDrag, useEntryList } from "./EntryCard";
import { formatRange } from "@/lib/format";
import { isMarkdownEmpty, markdownToText } from "@/lib/markdown";
import { AssistedField } from "@/components/editor/ai/AssistedField";
import { isCredentialSection, moveById, showsDates } from "@/lib/defaults";
import type {
  CredentialType,
  EducationItem,
  EducationSection,
} from "@/lib/types";

/** The shape is shared across credential sections; only the wording changes. */
const LABELS: Record<
  CredentialType,
  {
    tip: string;
    title: string;
    titlePlaceholder: string;
    issuer: string;
    issuerPlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
  }
> = {
  education: {
    tip: "List your most recent or highest qualification first. Honours and focus areas belong in the description.",
    title: "Degree / Qualification",
    titlePlaceholder: "B.Sc. Computer Science",
    issuer: "School",
    issuerPlaceholder: "University of…",
    description: "Description (optional)",
    descriptionPlaceholder: "Honors, focus areas, notable coursework…",
  },
  certifications: {
    tip: "Name the awarding body — recruiters scan for the issuer as much as the certificate.",
    title: "Certification",
    titlePlaceholder: "AWS Solutions Architect",
    issuer: "Issued by",
    issuerPlaceholder: "Amazon Web Services",
    description: "Description (optional)",
    descriptionPlaceholder: "Credential ID, scope, or what it covers…",
  },
  awards: {
    tip: "Say who gave it and what it recognised; the title alone rarely carries the weight.",
    title: "Award",
    titlePlaceholder: "Employee of the Year",
    issuer: "Awarded by",
    issuerPlaceholder: "Acme Inc.",
    description: "Description (optional)",
    descriptionPlaceholder: "What it recognised and why you won it…",
  },
};

export function EducationForm({ section }: { section: EducationSection }) {
  const { data, update } = useResume();
  const labels = LABELS[section.type];
  const entries = useEntryList(section.id, section.items);

  const withSection = (fn: (s: EducationSection) => void) =>
    update((d) => {
      const s = d.sections.find((x) => x.id === section.id);
      if (s && isCredentialSection(s)) fn(s);
    });

  const patchItem = (itemId: string, patch: Partial<EducationItem>) =>
    withSection((s) => {
      const item = s.items.find((i) => i.id === itemId);
      if (item) Object.assign(item, patch);
    });

  const dragProps = useEntryDrag(
    section.items.map((i) => i.id),
    (from, to) => withSection((s) => moveById(s.items, from, to)),
  );

  return (
    <div>
      {entries.items.map((item) => (
        <EntryCard
          key={item.id}
          open={entries.isOpen(item.id)}
          onOpen={() => entries.open(item.id)}
          drag={entries.editing ? undefined : dragProps(item.id)}
          title={`Entry ${section.items.indexOf(item) + 1}`}
          summary={item.degree || markdownToText(item.description)}
          meta={[
            item.school,
            showsDates(section)
              ? formatRange(
                  item.startDate,
                  item.endDate,
                  false,
                  data.settings.language,
                )
              : "",
          ]
            .filter(Boolean)
            .join(" · ")}
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
          {/* Groups (what, from whom, when, description) sit further apart
              than the fields within each group — the personal card's rhythm. */}
          <div className="space-y-7">
            <Field label={labels.title}>
              <Input
                value={item.degree}
                onChange={(e) => patchItem(item.id, { degree: e.target.value })}
                placeholder={labels.titlePlaceholder}
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={labels.issuer}>
                <Input
                  value={item.school}
                  onChange={(e) =>
                    patchItem(item.id, { school: e.target.value })
                  }
                  placeholder={labels.issuerPlaceholder}
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <AssistedField
              label={labels.description}
              value={item.description}
              onChange={(md) => patchItem(item.id, { description: md })}
              request={() => ({
                task: "polish",
                text: item.description,
                context: `${labels.description.toLowerCase()} for ${
                  [item.degree, item.school].filter(Boolean).join(" at ") ||
                  "an entry"
                }`,
              })}
              disabled={isMarkdownEmpty(item.description)}
              disabledHint="Write something here first — the assistant rewrites what you've written rather than inventing it."
              placeholder={labels.descriptionPlaceholder}
              minHeight={90}
            />
          </div>
        </EntryCard>
      ))}
    </div>
  );
}
