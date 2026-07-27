"use client";

import { useState } from "react";
import { useResume } from "@/lib/store";
import {
  attachEntry,
  createSection,
  hasDates,
  isCredentialSection,
  isTagGroupSection,
  isTimelineSection,
  moveById,
  newEntry,
  showsDates,
} from "@/lib/defaults";
import type { Section, SectionType } from "@/lib/types";
import { PlusIcon } from "@/components/ui/svg-icons";
import { SectionCard, SectionFooter, DoneButton } from "./SectionCard";
import { useListDrag } from "./reorder";
import { PersonalIcon, SECTION_ICONS } from "./section-icons";
import { AddContentModal } from "./AddContentModal";
import { PersonalDetailsForm } from "./forms/PersonalDetailsForm";
import { SummaryForm } from "./forms/SummaryForm";
import { ExperienceForm } from "./forms/ExperienceForm";
import { EducationForm } from "./forms/EducationForm";
import { SkillsForm } from "./forms/SkillsForm";
import { EntryEditProvider, type OpenEntry } from "./forms/EntryCard";

/** Whichever form the section's type calls for. Shared with the mobile setup
 *  flow, which walks through the same forms one section at a time. */
export function SectionBody({ section }: { section: Section }) {
  return (
    <>
      {section.type === "summary" && <SummaryForm section={section} />}
      {isTimelineSection(section) && <ExperienceForm section={section} />}
      {isCredentialSection(section) && <EducationForm section={section} />}
      {isTagGroupSection(section) && <SkillsForm section={section} />}
    </>
  );
}

export function ContentPanel() {
  const { data, update } = useResume();
  const [openId, setOpenId] = useState<string | null>("personal");
  const [openEntry, setOpenEntry] = useState<OpenEntry>(null);
  const [showModal, setShowModal] = useState(false);

  const toggle = (id: string) => setOpenId((cur) => (cur === id ? null : id));

  const addSection = (type: SectionType) => {
    const section = createSection(type, data.settings.language);
    update((d) => void d.sections.push(section));
    setOpenId(section.id);
    setShowModal(false);
  };

  const removeSection = (id: string) =>
    update((d) => {
      d.sections = d.sections.filter((s) => s.id !== id);
    });

  const withSection = (id: string, fn: (s: Section) => void) =>
    update((d) => {
      const s = d.sections.find((x) => x.id === id);
      if (s) fn(s);
    });

  /** Adds an entry of whatever kind the section holds and opens it. The entry
   *  is built here, not inside the mutator, because `update` applies the
   *  mutation later — its id has to be known now to open the editor. */
  const addEntry = (id: string) => {
    const section = data.sections.find((s) => s.id === id);
    const entry = section && newEntry(section);
    if (!entry || !section) return;
    withSection(id, (s) => attachEntry(s, entry));
    // A skill is one field; only the entries with a form behind them are worth
    // handing the whole column to.
    if (!isTagGroupSection(section)) {
      setOpenEntry({ sectionId: id, itemId: entry.id });
    }
  };

  // Sections come out on the page in the order they sit in here, so dragging
  // one is how the resume is rearranged.
  const sectionDrag = useListDrag(
    data.sections.map((s) => s.id),
    (from, to) => update((d) => moveById(d.sections, from, to)),
  );

  const existingTypes = new Set(data.sections.map((s) => s.type));

  // One entry open means it owns the column: the section list, the personal
  // details card and "Add content" all step aside until the user is done.
  const editingSection = openEntry
    ? (data.sections.find((s) => s.id === openEntry.sectionId) ?? null)
    : null;

  if (editingSection) {
    return (
      <EntryEditProvider value={{ openEntry, setOpenEntry }}>
        <div className="space-y-3">
          <SectionBody section={editingSection} />
          <DoneButton onClick={() => setOpenEntry(null)} />
        </div>
      </EntryEditProvider>
    );
  }

  return (
    <EntryEditProvider value={{ openEntry, setOpenEntry }}>
      <div className="space-y-3">
        <SectionCard
          icon={PersonalIcon}
          title="Personal details"
          open={openId === "personal"}
          onToggle={() => toggle("personal")}
        >
          <PersonalDetailsForm />
        </SectionCard>

        {data.sections.map((section) => (
          <div key={section.id} className="space-y-3">
            <SectionCard
              icon={SECTION_ICONS[section.type]}
              title={section.title}
              open={openId === section.id}
              onToggle={() => toggle(section.id)}
              onRename={(title) =>
                withSection(section.id, (s) => void (s.title = title))
              }
              drag={sectionDrag(section.id)}
              // The summary is one text box; every other section is a list of
              // full-bleed rows with its own footer of controls.
              flush={section.type !== "summary"}
              footer={
                <SectionFooter
                  showDates={
                    hasDates(section) ? showsDates(section) : undefined
                  }
                  onToggleDates={
                    hasDates(section)
                      ? () =>
                          withSection(section.id, (s) => {
                            if (hasDates(s))
                              s.showDates = s.showDates === false;
                          })
                      : undefined
                  }
                  onAddEntry={
                    section.type === "summary"
                      ? undefined
                      : () => addEntry(section.id)
                  }
                  onDelete={() => removeSection(section.id)}
                />
              }
            >
              <SectionBody section={section} />
            </SectionCard>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink-faint/40 bg-panel/40 py-5 text-base font-bold text-ink-soft transition hover:border-brand/50 hover:text-brand"
        >
          <PlusIcon className="h-5 w-5" />
          Add content
        </button>

        {showModal && (
          <AddContentModal
            existingTypes={existingTypes}
            onAdd={addSection}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </EntryEditProvider>
  );
}
