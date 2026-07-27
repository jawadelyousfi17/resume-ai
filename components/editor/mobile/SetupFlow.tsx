"use client";

// The guided build, for phones only.
//
// One decision per screen: pick a look, then fill the resume in the order it
// is usually written — who you are, education, experience, skills, and the
// summary last, once there is something to summarise. Nothing here is a new
// editor; every screen hands off to the same form the desktop panel uses, so
// there is only ever one implementation of "how do I edit an entry".

import { useEffect, useState } from "react";

import {
  attachEntry,
  createSection,
  insertSection,
  isTagGroupSection,
  newEntry,
  SECTION_META,
} from "@/lib/defaults";
import { useResume } from "@/lib/store";
import { applyTemplate, TEMPLATES } from "@/lib/templates";
import type { Section, SectionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@/components/ui/icons";
import { PlusIcon } from "@/components/ui/svg-icons";

import { SectionBody } from "../ContentPanel";
import { EntryEditProvider, type OpenEntry } from "../forms/EntryCard";
import { PersonalDetailsForm } from "../forms/PersonalDetailsForm";
import { SECTION_ICONS } from "../section-icons";

type Step =
  | { kind: "template" }
  | { kind: "personal" }
  | { kind: "section"; type: SectionType }
  | { kind: "extras" };

/** The order a resume is actually written in. The summary comes last because
 *  it summarises everything above it. */
const GUIDED: Step[] = [
  { kind: "template" },
  { kind: "personal" },
  { kind: "section", type: "education" },
  { kind: "section", type: "experience" },
  { kind: "section", type: "skills" },
  { kind: "section", type: "summary" },
  { kind: "extras" },
];

const COPY: Record<string, { title: string; hint: string }> = {
  template: {
    title: "Pick a look",
    hint: "Change it whenever you like — switching re-renders what you wrote.",
  },
  personal: {
    title: "Your details",
    hint: "Your name, the role you're after, and how to reach you.",
  },
  education: {
    title: "Education",
    hint: "Most recent first. Add as many as you need.",
  },
  experience: {
    title: "Experience",
    hint: "Where you've worked and what changed because you were there.",
  },
  skills: { title: "Skills", hint: "The ones a job posting would ask for." },
  summary: {
    title: "Summary",
    hint: "Two or three lines, now that the rest of the page exists.",
  },
  extras: {
    title: "Anything else?",
    hint: "Optional — pick what fits, or finish and add them later.",
  },
};

/** What a step says about itself. The four steps that are always there have
 *  their own words; a section queued from the extras falls back to the words
 *  the "Add content" picker already uses for it. */
function stepCopy(step: Step): { title: string; hint: string } {
  const key = step.kind === "section" ? step.type : step.kind;
  if (COPY[key]) return COPY[key];

  const meta = SECTION_META.find(
    (m) => step.kind === "section" && m.type === step.type,
  );
  return {
    title: meta?.title ?? "One more thing",
    hint: meta?.description ?? "",
  };
}

export function SetupFlow({
  mode,
  onDone,
}: {
  /** A blank resume gets the whole walk-through; an imported one only needs
   *  a template, since the content is already there. */
  mode: "new" | "import";
  onDone: () => void;
}) {
  // The extras the user picks on the last step become steps of their own, so
  // choosing "Projects" walks straight into filling Projects in.
  const [extra, setExtra] = useState<SectionType[]>([]);
  const [index, setIndex] = useState(0);

  const steps: Step[] = [
    ...(mode === "import" ? [{ kind: "template" as const }] : GUIDED),
    ...extra.map((type) => ({ kind: "section" as const, type })),
  ];

  const step = steps[index];
  const last = index === steps.length - 1;
  const copy = stepCopy(step);

  const next = () => (last ? onDone() : setIndex(index + 1));

  return (
    <div className="flex h-dvh flex-col bg-white">
      <header className="shrink-0 px-5 pt-4">
        <div className="flex items-center gap-3">
          <div
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/10"
            role="progressbar"
            aria-valuenow={index + 1}
            aria-valuemin={1}
            aria-valuemax={steps.length}
          >
            <div
              className="h-full rounded-full bg-brand transition-[width] duration-300"
              style={{ width: `${((index + 1) / steps.length) * 100}%` }}
            />
          </div>
          <span className="shrink-0 text-[12.5px] font-bold text-ink-faint">
            {index + 1} / {steps.length}
          </span>
        </div>

        <h1 className="mt-4 text-[26px] leading-tight font-extrabold tracking-tight text-ink">
          {copy.title}
        </h1>
        <p className="mt-1.5 text-[14.5px] leading-snug text-ink-soft">
          {copy.hint}
        </p>
      </header>

      {/* No horizontal padding here: the forms bring their own, and the
          rows inside them run to the edge of the sheet. */}
      <div className="scroll-slim min-h-0 flex-1 overflow-y-auto pt-5 pb-6">
        {step.kind === "template" && <TemplateStep />}
        {step.kind === "personal" && (
          <div className="px-5">
            <PersonalDetailsForm />
          </div>
        )}
        {step.kind === "section" && (
          <SectionStep key={step.type} type={step.type} />
        )}
        {step.kind === "extras" && (
          <ExtrasStep picked={extra} onPick={setExtra} />
        )}
      </div>

      {/* The bar sits below the thumb, out of the way of the fields above it. */}
      <footer className="shrink-0 border-t border-black/5 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-3">
          {index > 0 && (
            <button
              type="button"
              onClick={() => setIndex(index - 1)}
              className="h-12 shrink-0 rounded-xl px-5 text-[15px] font-bold text-ink-soft transition active:bg-black/5"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={next}
            className="btn-gradient h-12 flex-1 rounded-xl text-[15.5px] font-bold transition active:scale-[0.99]"
          >
            {last ? "See my resume" : "Continue"}
          </button>
        </div>
      </footer>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Steps                                                                      */
/* -------------------------------------------------------------------------- */

function TemplateStep() {
  const { data, update } = useResume();
  const selected = data.settings.template ?? "classic";

  return (
    <div className="grid grid-cols-2 gap-3 px-5">
      {TEMPLATES.map((t) => {
        const on = t.id === selected;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => update((d) => applyTemplate(d.settings, t))}
            aria-pressed={on}
            className={cn(
              "overflow-hidden rounded-2xl border-2 bg-white text-left transition",
              on ? "border-brand" : "border-transparent",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/templates/${t.id}.png`}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="block w-full"
              style={{
                aspectRatio: "210 / 297",
                objectFit: "cover",
                objectPosition: "top",
              }}
            />
            <span className="flex items-center gap-1.5 px-3 py-2.5">
              <span className="min-w-0 truncate text-[14px] font-bold text-ink">
                {t.name}
              </span>
              {on && (
                <CheckIcon className="ml-auto h-4 w-4 shrink-0 text-brand" />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** One section, filled in through the same forms the desktop editor uses. */
function SectionStep({ type }: { type: SectionType }) {
  const { data, update } = useResume();
  const [openEntry, setOpenEntry] = useState<OpenEntry>(null);
  // Until the user opens or closes something themselves, the step decides what
  // is open. After that it's their call, so a closed entry stays closed.
  const [steered, setSteered] = useState(false);

  const section = data.sections.find((s) => s.type === type);

  // The blank resume starts with no sections at all — this step is where this
  // one comes into existence, in its conventional place on the page.
  useEffect(() => {
    if (section) return;
    update((d) => {
      if (d.sections.some((s) => s.type === type)) return;
      insertSection(d.sections, createSection(type, d.settings.language));
    });
  }, [section, type, update]);

  if (!section) return null;

  // A section arrives holding one empty entry: show its fields rather than a
  // row the user has to know to tap. Skills and languages are already one
  // field per row, so there is nothing to open — they stay a list.
  const items = entriesOf(section);
  const open =
    steered || isTagGroupSection(section) || items.length !== 1
      ? openEntry
      : { sectionId: section.id, itemId: items[0].id };

  const setOpen = (entry: OpenEntry) => {
    setSteered(true);
    setOpenEntry(entry);
  };

  const addEntry = () => {
    const entry = newEntry(section);
    if (!entry) return;
    update((d) => {
      const s = d.sections.find((x) => x.id === section.id);
      if (s) attachEntry(s, entry);
    });
    if (!isTagGroupSection(section)) {
      setOpen({ sectionId: section.id, itemId: entry.id });
    }
  };

  const editing = open !== null;
  // Every section but the summary is a list, and a list you can only ever put
  // one thing in isn't a list — skills included.
  const canAdd = section.type !== "summary";

  return (
    <EntryEditProvider
      value={{ openEntry: open, setOpenEntry: setOpen, flat: true }}
    >
      {/* The lists bring their own padding; the summary is a lone field. */}
      <div className={section.type === "summary" ? "px-5" : undefined}>
        <SectionBody section={section} />
      </div>

      <div className="px-5">
        {editing && (
          <button
            type="button"
            onClick={() => setOpen(null)}
            className="mt-3 h-12 w-full rounded-xl bg-field text-[15px] font-bold text-ink transition active:scale-[0.99]"
          >
            ✓ Done with this one
          </button>
        )}

        {canAdd && !editing && (
          <button
            type="button"
            onClick={addEntry}
            className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-faint/40 text-[15px] font-bold text-ink-soft transition active:border-brand/50 active:text-brand"
          >
            <PlusIcon className="h-5 w-5" />
            Add another
          </button>
        )}
      </div>
    </EntryEditProvider>
  );
}

/** The optional extras, offered once the spine of the resume is written. The
 *  selection lives in the parent, which turns each one into another step. */
function ExtrasStep({
  picked,
  onPick,
}: {
  picked: SectionType[];
  onPick: (types: SectionType[]) => void;
}) {
  const { data } = useResume();

  // A section the resume already has isn't offered again — including the ones
  // just queued, which are added the moment their step arrives.
  const already = new Set(data.sections.map((s) => s.type));
  const offered = SECTION_META.filter((meta) => !already.has(meta.type));

  const toggle = (type: SectionType) =>
    onPick(
      picked.includes(type)
        ? picked.filter((t) => t !== type)
        : [...picked, type],
    );

  if (offered.length === 0) {
    return (
      <p className="px-5 text-[15px] leading-relaxed text-ink-soft">
        Your resume already has every section meniacv offers. Continue to see
        it.
      </p>
    );
  }

  return (
    <div className="space-y-2.5 px-5">
      {offered.map((meta) => {
        const Icon = SECTION_ICONS[meta.type];
        const on = picked.includes(meta.type);
        return (
          <button
            key={meta.type}
            type="button"
            onClick={() => toggle(meta.type)}
            aria-pressed={on}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left transition",
              on
                ? "bg-brand-soft ring-2 ring-brand"
                : "bg-panel shadow-[var(--shadow-panel)]",
            )}
          >
            <Icon className="h-5 w-5 shrink-0 text-brand" />
            <span className="min-w-0 flex-1">
              <span className="block text-[15.5px] font-bold text-ink">
                {meta.title}
              </span>
              <span className="mt-0.5 block text-[13px] leading-snug text-ink-soft">
                {meta.description}
              </span>
            </span>
            <span
              className={cn(
                "grid h-6 w-6 shrink-0 place-items-center rounded-full border-2",
                on ? "border-brand bg-brand text-white" : "border-ink-faint/40",
              )}
            >
              {on && <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** The entries a section holds, if it holds any. */
function entriesOf(section: Section): { id: string }[] {
  return "items" in section ? section.items : [];
}
