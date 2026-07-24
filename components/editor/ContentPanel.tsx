"use client";

import { useState } from "react";
import { useResume } from "@/lib/store";
import { createSection } from "@/lib/defaults";
import type { Section, SectionType } from "@/lib/types";
import {
  BriefcaseIcon,
  CapIcon,
  FileTextIcon,
  PlusIcon,
  StackIcon,
  UserIcon,
} from "@/components/ui/icons";
import { SectionCard, DoneButton, HoverTip } from "./SectionCard";
import { AddContentModal } from "./AddContentModal";
import { PersonalDetailsForm } from "./forms/PersonalDetailsForm";
import { SummaryForm } from "./forms/SummaryForm";
import { ExperienceForm } from "./forms/ExperienceForm";
import { EducationForm } from "./forms/EducationForm";
import { SkillsForm } from "./forms/SkillsForm";

const SECTION_ICONS: Record<SectionType, React.ReactNode> = {
  summary: <FileTextIcon className="h-[18px] w-[18px]" />,
  experience: <BriefcaseIcon className="h-[18px] w-[18px]" />,
  education: <CapIcon className="h-[18px] w-[18px]" />,
  skills: <StackIcon className="h-[18px] w-[18px]" />,
};

const SECTION_TIPS: Record<SectionType, string> = {
  summary: "Keep it to 2–3 sentences on the value you bring.",
  experience: "Start each highlight with an action verb and a number.",
  education: "List your most recent or highest qualification first.",
  skills: "Group related skills so recruiters can scan them fast.",
};

function sectionSubtitle(section: Section): string {
  switch (section.type) {
    case "summary":
      return section.content ? "Edited" : "Add a short intro";
    case "experience": {
      const n = section.items.filter((i) => i.role || i.company).length;
      return n ? `${n} ${n === 1 ? "position" : "positions"}` : "Add a position";
    }
    case "education": {
      const n = section.items.filter((i) => i.degree || i.school).length;
      return n ? `${n} ${n === 1 ? "entry" : "entries"}` : "Add a degree";
    }
    case "skills": {
      const n = section.groups.reduce((sum, g) => sum + g.skills.length, 0);
      return n ? `${n} ${n === 1 ? "skill" : "skills"}` : "Add your skills";
    }
  }
}

function SectionBody({ section }: { section: Section }) {
  return (
    <>
      <HoverTip>{SECTION_TIPS[section.type]}</HoverTip>
      {section.type === "summary" && <SummaryForm section={section} />}
      {section.type === "experience" && <ExperienceForm section={section} />}
      {section.type === "education" && <EducationForm section={section} />}
      {section.type === "skills" && <SkillsForm section={section} />}
    </>
  );
}

export function ContentPanel() {
  const { data, update } = useResume();
  const [openId, setOpenId] = useState<string | null>("personal");
  const [showModal, setShowModal] = useState(false);

  const toggle = (id: string) => setOpenId((cur) => (cur === id ? null : id));

  const addSection = (type: SectionType) => {
    const section = createSection(type);
    update((d) => void d.sections.push(section));
    setOpenId(section.id);
    setShowModal(false);
  };

  const removeSection = (id: string) =>
    update((d) => {
      d.sections = d.sections.filter((s) => s.id !== id);
    });

  const existingTypes = new Set(data.sections.map((s) => s.type));

  return (
    <div className="space-y-3">
      <SectionCard
        title="Personal details"
        subtitle={data.personal.fullName || "Your name and contact info"}
        icon={<UserIcon className="h-[18px] w-[18px]" />}
        open={openId === "personal"}
        onToggle={() => toggle("personal")}
      >
        <HoverTip>A clear title helps recruiters place you fast.</HoverTip>
        <PersonalDetailsForm />
        <DoneButton onClick={() => setOpenId(null)} />
      </SectionCard>

      {data.sections.map((section) => (
        <SectionCard
          key={section.id}
          title={section.title}
          subtitle={sectionSubtitle(section)}
          icon={SECTION_ICONS[section.type]}
          open={openId === section.id}
          onToggle={() => toggle(section.id)}
          onDelete={() => removeSection(section.id)}
        >
          <SectionBody section={section} />
          <DoneButton onClick={() => setOpenId(null)} />
        </SectionCard>
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
  );
}
