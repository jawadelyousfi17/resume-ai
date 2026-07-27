"use client";

// Everything you can change about a letter, split the way the resume editor
// splits it: Content is who it's from, who it's to and the letter itself;
// Customize is how the page looks.
//
// Content uses collapsible cards, each wearing the mark it's known by. Customize
// is laid out like the resume's panel instead — a rail of section names beside
// a stack of open cards — because these are settings you scan and adjust, not
// long forms you work through once.

import { useState } from "react";
import { Field, Input, Label, Textarea } from "@/components/ui/fields";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { StepperSlider } from "@/components/ui/stepper-slider";
import { FontPicker } from "@/components/editor/FontPicker";
import {
  BuildingIcon,
  ChevronDownIcon,
  IdCardIcon,
  LetterIcon,
  SignatureIcon,
} from "@/components/ui/svg-icons";
import { useLetter } from "@/lib/letter-store";
import { DEFAULT_GREETING, DEFAULT_CLOSING } from "@/lib/cover-letter";
import { LANGUAGES } from "@/lib/i18n";
import type {
  CoverLetterSettings,
  LetterHeaderStyle,
  PageFormat,
} from "@/lib/types";
import { SignaturePad } from "./SignaturePad";

const ACCENTS = [
  "#2563eb",
  "#0ea5e9",
  "#0d9488",
  "#059669",
  "#7c3aed",
  "#e11d48",
  "#d97706",
  "#0f172a",
];

const HEADERS: { value: LetterHeaderStyle; label: string }[] = [
  { value: "stacked", label: "Stacked" },
  { value: "banner", label: "Banner" },
  { value: "minimal", label: "One line" },
];

const PAGE_FORMATS: { value: PageFormat; label: string }[] = [
  { value: "A4", label: "A4" },
  { value: "Letter", label: "US Letter" },
];

/** The rail down the side of Customize, in the order the cards appear. */
const CZ_GROUPS = [
  { id: "lc-document", label: "Document" },
  { id: "lc-header", label: "Header" },
  { id: "lc-size", label: "Font Size" },
  { id: "lc-spacing", label: "Spacing" },
  { id: "lc-font", label: "Font" },
  { id: "lc-colors", label: "Colors" },
];

/** The Content tab: what the letter says. */
export function LetterContent() {
  const { data, update } = useLetter();

  return (
    <div className="space-y-3">
      <Group title="You" icon={IdCardIcon} defaultOpen>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <Input
              value={data.sender.fullName}
              onChange={(e) =>
                update((d) => void (d.sender.fullName = e.target.value))
              }
              placeholder="Dana Okoro"
            />
          </Field>
          <Field label="Title">
            <Input
              value={data.sender.title}
              onChange={(e) =>
                update((d) => void (d.sender.title = e.target.value))
              }
              placeholder="Backend Engineer"
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={data.sender.email}
              onChange={(e) =>
                update((d) => void (d.sender.email = e.target.value))
              }
              placeholder="dana@example.com"
            />
          </Field>
          <Field label="Phone">
            <Input
              value={data.sender.phone}
              onChange={(e) =>
                update((d) => void (d.sender.phone = e.target.value))
              }
              placeholder="+44 7700 900123"
            />
          </Field>
          <Field label="Location" className="sm:col-span-2">
            <Input
              value={data.sender.location}
              onChange={(e) =>
                update((d) => void (d.sender.location = e.target.value))
              }
              placeholder="London, UK"
            />
          </Field>
        </div>
      </Group>

      <Group title="Who it's to" icon={BuildingIcon} defaultOpen>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Company">
            <Input
              value={data.recipient.company}
              onChange={(e) =>
                update((d) => void (d.recipient.company = e.target.value))
              }
              placeholder="Monzo"
            />
          </Field>
          <Field label="Role you're applying for">
            <Input
              value={data.role}
              onChange={(e) => update((d) => void (d.role = e.target.value))}
              placeholder="Senior Backend Engineer"
            />
          </Field>
          <Field label="Contact name">
            <Input
              value={data.recipient.name}
              onChange={(e) =>
                update((d) => void (d.recipient.name = e.target.value))
              }
              placeholder="Leave blank if you don't know it"
            />
          </Field>
          <Field label="Their title">
            <Input
              value={data.recipient.role}
              onChange={(e) =>
                update((d) => void (d.recipient.role = e.target.value))
              }
              placeholder="Head of Engineering"
            />
          </Field>
          <Field label="Address" className="sm:col-span-2">
            <Textarea
              value={data.recipient.address}
              onChange={(e) =>
                update((d) => void (d.recipient.address = e.target.value))
              }
              placeholder={"Broadwalk House\nLondon EC2A 2DA"}
              className="min-h-[72px]"
            />
          </Field>
        </div>
      </Group>

      <Group title="The letter" icon={LetterIcon} defaultOpen>
        <div className="space-y-4">
          <Field label="Greeting">
            <Input
              value={data.greeting}
              onChange={(e) =>
                update((d) => void (d.greeting = e.target.value))
              }
              placeholder={DEFAULT_GREETING}
            />
          </Field>

          <div>
            <Label>Body</Label>
            <MarkdownEditor
              value={data.body}
              onChange={(md) => update((d) => void (d.body = md))}
              placeholder="Three or four paragraphs — what you're applying for, what you've done that answers it, and why this employer."
              minHeight={280}
            />
          </div>
        </div>
      </Group>

      <Group title="Sign-off" icon={SignatureIcon} defaultOpen>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Sign-off">
              <Input
                value={data.closing}
                onChange={(e) =>
                  update((d) => void (d.closing = e.target.value))
                }
                placeholder={DEFAULT_CLOSING}
              />
            </Field>
            <Field label="Name">
              <Input
                value={data.signature}
                onChange={(e) =>
                  update((d) => void (d.signature = e.target.value))
                }
                placeholder="Dana Okoro"
              />
            </Field>
          </div>

          <SignaturePad
            value={data.signatureImage}
            onChange={(url) => update((d) => void (d.signatureImage = url))}
          />
        </div>
      </Group>
    </div>
  );
}

/** The Customize tab: how the page looks. Same shape as the resume's panel. */
export function LetterCustomize() {
  const { data, update, format, setFormat } = useLetter();
  const s = data.settings;
  const [active, setActive] = useState(CZ_GROUPS[0].id);

  const set = <K extends keyof CoverLetterSettings>(
    key: K,
    value: CoverLetterSettings[K],
  ) => update((d) => void (d.settings[key] = value));

  const goto = (id: string) => {
    setActive(id);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex gap-5">
      <nav className="sticky top-0 hidden w-28 shrink-0 flex-col self-start border-l border-black/5 sm:flex">
        {CZ_GROUPS.map((g) => {
          const on = active === g.id;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => goto(g.id)}
              className={`relative -ml-px border-l-2 py-2.5 pl-4 text-left text-[15px] font-bold transition ${
                on
                  ? "border-brand text-brand"
                  : "border-transparent text-ink-soft hover:text-ink"
              }`}
            >
              {g.label}
            </button>
          );
        })}
      </nav>

      <div className="min-w-0 flex-1 space-y-4">
        <Panel id="lc-document" title="Document">
          <div className="space-y-5">
            <div>
              <Label>Language</Label>
              <select
                value={s.language ?? "en"}
                onChange={(e) =>
                  set(
                    "language",
                    e.target.value as CoverLetterSettings["language"],
                  )
                }
                className="h-auto w-full rounded-xl bg-field px-4 py-3 text-base text-ink focus-visible:ring-2 focus-visible:ring-ink/80 focus-visible:outline-none"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Paper</Label>
              <Segmented
                value={format}
                options={PAGE_FORMATS}
                onChange={setFormat}
              />
            </div>

            <Field label="Date">
              <Input
                value={data.date}
                onChange={(e) => update((d) => void (d.date = e.target.value))}
                placeholder="Today's date"
              />
            </Field>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={s.showDate}
                onChange={(e) => set("showDate", e.target.checked)}
                className="h-4 w-4 accent-brand"
              />
              <span className="text-[14px] font-semibold text-ink">
                Print the date
              </span>
            </label>
          </div>
        </Panel>

        <Panel id="lc-header" title="Header">
          <Segmented
            value={s.headerStyle}
            options={HEADERS}
            onChange={(v) => set("headerStyle", v)}
          />
        </Panel>

        <Panel id="lc-size" title="Font Size">
          <StepperSlider
            label="Base font size"
            value={s.fontSize}
            unit="pt"
            min={9}
            max={13}
            step={0.5}
            onChange={(v) => set("fontSize", v)}
          />
        </Panel>

        <Panel id="lc-spacing" title="Spacing">
          <div className="space-y-5">
            <StepperSlider
              label="Line height"
              value={s.lineHeight}
              min={1.2}
              max={1.9}
              step={0.05}
              format={(v) => v.toFixed(2)}
              onChange={(v) => set("lineHeight", v)}
            />
            <StepperSlider
              label="Left & right margin"
              value={s.marginX}
              unit="mm"
              min={12}
              max={34}
              step={1}
              onChange={(v) => set("marginX", v)}
            />
            <StepperSlider
              label="Top & bottom margin"
              value={s.marginY}
              unit="mm"
              min={12}
              max={32}
              step={1}
              onChange={(v) => set("marginY", v)}
            />
          </div>
        </Panel>

        <Panel id="lc-font" title="Font">
          <p className="mb-2.5 text-[13.5px] font-bold text-ink">Typeface</p>
          <FontPicker
            value={s.fontFamily}
            onChange={(v) => set("fontFamily", v)}
          />
        </Panel>

        <Panel id="lc-colors" title="Colors">
          <p className="mb-2.5 text-[13.5px] font-bold text-ink">
            Accent color
          </p>
          <div className="flex flex-wrap items-center gap-2.5">
            {ACCENTS.map((color) => {
              const selected = s.accent.toLowerCase() === color.toLowerCase();
              return (
                <button
                  key={color}
                  type="button"
                  aria-label={`Accent ${color}`}
                  onClick={() => set("accent", color)}
                  style={{ backgroundColor: color }}
                  className={`h-9 w-9 rounded-full transition ${
                    selected
                      ? "ring-2 ring-ink ring-offset-2"
                      : "hover:scale-105"
                  }`}
                />
              );
            })}
            <label
              className="relative ml-1 h-9 w-9 overflow-hidden rounded-full ring-1 ring-black/10"
              style={{ backgroundColor: s.accent }}
            >
              <input
                type="color"
                value={s.accent}
                onChange={(e) => set("accent", e.target.value)}
                className="absolute inset-0 cursor-pointer opacity-0"
                aria-label="Custom accent color"
              />
            </label>
          </div>
        </Panel>
      </div>
    </div>
  );
}

/** A collapsible card, for the Content tab: the section's own mark, its title,
 *  and one chevron that turns over as it opens. */
function Group({
  title,
  icon: Icon,
  defaultOpen = false,
  children,
}: {
  title: string;
  icon?: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="overflow-hidden rounded-2xl bg-panel shadow-[var(--shadow-panel)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-6 py-5 text-left"
      >
        {Icon && <Icon className="h-6 w-6 shrink-0 text-ink" />}
        <h3 className="flex-1 text-[17px] font-extrabold tracking-tight text-ink">
          {title}
        </h3>
        <ChevronDownIcon
          className={`h-5 w-5 shrink-0 text-ink-soft transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && <div className="px-6 pt-1 pb-6">{children}</div>}
    </section>
  );
}

/** An always-open card, for the Customize tab — the resume's Group, so the two
 *  panels read the same. */
function Panel({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-4 rounded-2xl bg-panel p-6 shadow-[var(--shadow-panel)]"
    >
      <h3 className="mb-4 text-xl font-extrabold tracking-tight text-ink">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`flex-1 rounded-xl border px-3 py-2.5 text-[14px] font-semibold transition ${
            value === o.value
              ? "border-brand/50 bg-brand-soft text-brand"
              : "border-field-border bg-field text-ink-soft hover:text-ink"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
