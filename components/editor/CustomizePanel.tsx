"use client";

import { useState } from "react";
import { useResume } from "@/lib/store";
import type { DateFormat, PageFormat, ResumeSettings } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import {
  applyTemplate,
  inCategory,
  TEMPLATE_CATEGORIES,
  TEMPLATES,
  templatesIn,
  type Template,
  type TemplateCategory,
} from "@/lib/templates";
import {
  isDefaultTitle,
  language,
  LANGUAGES,
  SECTION_TITLES,
  type LanguageCode,
} from "@/lib/i18n";
import { formatMonth } from "@/lib/format";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StepperSlider } from "@/components/ui/stepper-slider";
import { CheckIcon } from "@/components/ui/icons";
import { ChevronDownIcon } from "@/components/ui/svg-icons";
import { FontPicker } from "./FontPicker";

const GROUPS = [
  { id: "cz-document", label: "Document" },
  { id: "cz-template", label: "Template" },
  { id: "cz-font-size", label: "Font Size" },
  { id: "cz-spacing", label: "Spacing" },
  { id: "cz-headings", label: "Headings" },
  { id: "cz-font", label: "Font" },
  { id: "cz-colors", label: "Colors" },
];

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

const PAGE_FORMATS: { value: PageFormat; label: string; note: string }[] = [
  { value: "A4", label: "A4", note: "210 × 297 mm" },
  { value: "Letter", label: "US Letter", note: "8.5 × 11 in" },
];

/** Each style is previewed with a real date so the difference is visible
 *  rather than described. */
const DATE_FORMATS: { value: DateFormat; label: string }[] = [
  { value: "short", label: "Short month" },
  { value: "long", label: "Full month" },
  { value: "numeric", label: "Numeric" },
  { value: "iso", label: "ISO" },
];

const HEADINGS: { value: ResumeSettings["headingStyle"]; label: string }[] = [
  { value: "underline", label: "Underline" },
  { value: "plain", label: "Plain" },
  { value: "uppercase", label: "Uppercase" },
];

export function CustomizePanel() {
  const { data, format, setFormat, update } = useResume();
  const s = data.settings ?? DEFAULT_SETTINGS;
  const [active, setActive] = useState(GROUPS[0].id);
  const [pickerOpen, setPickerOpen] = useState(false);

  const activeTemplate =
    TEMPLATES.find((t) => t.id === (s.template ?? "classic")) ?? TEMPLATES[0];

  const set = <K extends keyof ResumeSettings>(
    key: K,
    value: ResumeSettings[K],
  ) => update((d) => void (d.settings[key] = value));

  const activeLang = language(s.language);

  /** Switching language re-titles every section still carrying a stock
   *  heading. A heading the user typed themselves is theirs, and is left
   *  exactly as it is. */
  const setLanguage = (code: LanguageCode) =>
    update((d) => {
      d.settings.language = code;
      for (const section of d.sections) {
        if (isDefaultTitle(section.type, section.title)) {
          section.title = SECTION_TITLES[code][section.type];
        }
      }
    });

  const pickTemplate = (t: Template) =>
    update((d) => applyTemplate(d.settings, t));

  const goto = (id: string) => {
    setActive(id);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex gap-5">
      <nav className="sticky top-0 hidden w-28 shrink-0 flex-col self-start border-l border-black/5 sm:flex">
        {GROUPS.map((g) => {
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
        <Group id="cz-document" title="Document">
          <span className="mb-2 block text-[13px] font-bold text-ink">
            Language
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center gap-2.5 rounded-xl border border-field-border px-3.5 py-2.5 text-left text-[14px] font-bold text-ink transition hover:border-ink/30"
              >
                <span className="text-[18px] leading-none">
                  {activeLang.flag}
                </span>
                <span dir={activeLang.dir}>{activeLang.label}</span>
                <span className="ml-auto text-[12.5px] font-medium text-ink-faint">
                  {activeLang.english}
                </span>
                <ChevronDownIcon className="h-4 w-4 shrink-0 text-ink-faint" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-h-80 w-full">
              {LANGUAGES.map((l) => (
                <DropdownMenuItem
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                >
                  <span className="text-[17px] leading-none">{l.flag}</span>
                  <span dir={l.dir} className="font-bold">
                    {l.label}
                  </span>
                  <span className="ml-auto pl-3 text-[12px] font-medium text-ink-faint">
                    {l.english}
                  </span>
                  {l.code === activeLang.code && (
                    <CheckIcon className="h-4 w-4 text-brand" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="mt-5 mb-2 block text-[13px] font-bold text-ink">
            Page size
          </span>
          <div className="grid grid-cols-2 gap-2">
            {PAGE_FORMATS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFormat(f.value)}
                aria-pressed={format === f.value}
                className={`rounded-xl border px-3 py-2.5 text-left transition ${
                  format === f.value
                    ? "border-brand bg-brand-soft"
                    : "border-field-border hover:border-ink/25"
                }`}
              >
                <span
                  className={`block text-[14px] font-bold ${
                    format === f.value ? "text-brand" : "text-ink"
                  }`}
                >
                  {f.label}
                </span>
                <span className="mt-0.5 block text-[11.5px] text-ink-faint">
                  {f.note}
                </span>
              </button>
            ))}
          </div>

          <span className="mt-5 mb-2 block text-[13px] font-bold text-ink">
            Date format
          </span>
          <div className="grid grid-cols-2 gap-2">
            {DATE_FORMATS.map((f) => {
              const selected = (s.dateFormat ?? "short") === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => set("dateFormat", f.value)}
                  aria-pressed={selected}
                  className={`rounded-xl border px-3 py-2.5 text-left transition ${
                    selected
                      ? "border-brand bg-brand-soft"
                      : "border-field-border hover:border-ink/25"
                  }`}
                >
                  <span
                    className={`block text-[14px] font-bold ${
                      selected ? "text-brand" : "text-ink"
                    }`}
                  >
                    {f.label}
                  </span>
                  <span className="mt-0.5 block text-[11.5px] text-ink-faint">
                    {formatMonth("2021-09", s.language, f.value)}
                  </span>
                </button>
              );
            })}
          </div>
        </Group>

        <Group id="cz-template" title="Template">
          {/* The pages themselves are the button: three of them behind a
              single call to action, the one in use first. */}
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="group relative block w-full overflow-hidden rounded-xl border border-field-border transition hover:border-ink/30"
          >
            <span className="grid grid-cols-3 gap-2 p-2">
              {previewTemplates(activeTemplate).map((t) => (
                <span
                  key={t.id}
                  className="block overflow-hidden rounded-lg border border-field-border"
                >
                  <TemplateThumb template={t} accent={s.accent} />
                </span>
              ))}
            </span>

            <span className="absolute inset-0 flex items-center justify-center bg-ink/45 transition group-hover:bg-ink/55">
              <span className="rounded-xl bg-white px-5 py-2.5 text-[14.5px] font-bold text-ink shadow-lg">
                Browse templates
              </span>
            </span>
          </button>

          <TemplatePicker
            open={pickerOpen}
            onOpenChange={setPickerOpen}
            selectedId={activeTemplate.id}
            accent={s.accent}
            onPick={(t) => {
              pickTemplate(t);
              setPickerOpen(false);
            }}
          />
        </Group>

        <Group id="cz-font-size" title="Font Size">
          <StepperSlider
            label="Base font size"
            value={s.fontSize}
            unit="pt"
            min={9}
            max={13}
            step={0.5}
            onChange={(v) => set("fontSize", v)}
          />
        </Group>

        <Group id="cz-spacing" title="Spacing">
          <div className="space-y-5">
            <StepperSlider
              label="Line height"
              value={s.lineHeight}
              min={1}
              max={1.7}
              step={0.05}
              format={(v) => v.toFixed(2)}
              onChange={(v) => set("lineHeight", v)}
            />
            <StepperSlider
              label="Left & right margin"
              value={s.marginX}
              unit="mm"
              min={8}
              max={30}
              step={1}
              onChange={(v) => set("marginX", v)}
            />
            <StepperSlider
              label="Top & bottom margin"
              value={s.marginY}
              unit="mm"
              min={8}
              max={28}
              step={1}
              onChange={(v) => set("marginY", v)}
            />
          </div>
        </Group>

        <Group id="cz-headings" title="Headings">
          <p className="mb-2.5 text-[13.5px] font-bold text-ink">
            Section heading style
          </p>
          <Segmented
            value={s.headingStyle}
            options={HEADINGS}
            onChange={(v) => set("headingStyle", v)}
          />
        </Group>

        <Group id="cz-font" title="Font">
          <FontPicker
            value={s.fontFamily}
            onChange={(v) => set("fontFamily", v)}
          />
        </Group>

        <Group id="cz-colors" title="Colors">
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
                  onClick={() => set("accent", color)}
                  aria-label={color}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition hover:scale-105"
                  style={{
                    backgroundColor: color,
                    boxShadow: selected
                      ? `0 0 0 2px #fff, 0 0 0 4px ${color}`
                      : undefined,
                  }}
                >
                  {selected && <CheckIcon className="h-4 w-4 text-white" />}
                </button>
              );
            })}
            <label className="ml-1 flex items-center gap-2 rounded-xl bg-field px-2.5 py-2">
              <span
                className="h-6 w-6 rounded-md border border-black/10"
                style={{ backgroundColor: s.accent }}
              />
              <input
                type="color"
                value={s.accent}
                onChange={(e) => set("accent", e.target.value)}
                className="h-6 w-8 cursor-pointer bg-transparent p-0"
                aria-label="Custom accent color"
              />
            </label>
          </div>
        </Group>
      </div>
    </div>
  );
}

/** The full template gallery. Picking one applies it and closes the dialog. */
function TemplatePicker({
  open,
  onOpenChange,
  selectedId,
  accent,
  onPick,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedId: Template["id"];
  accent: string;
  onPick: (template: Template) => void;
}) {
  // Null is "All". Nothing is typed here — the filter is a row of buttons.
  const [category, setCategory] = useState<TemplateCategory | null>(null);

  const shown = category
    ? TEMPLATES.filter((t) => inCategory(t, category))
    : TEMPLATES;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // Reopening should start from the whole set, not the last filter.
        if (!next) setCategory(null);
        onOpenChange(next);
      }}
    >
      {/* Wide on purpose: a template is judged by how the page looks, and a
          thumbnail small enough to fit a narrow dialog shows layout but not
          typography. `scroll-slim` keeps the scrolling and drops the bar. */}
      <DialogContent
        aria-describedby={undefined}
        className="scroll-slim max-h-[88vh] gap-6 overflow-y-auto rounded-3xl p-7 pt-0 sm:max-w-5xl"
      >
        {/* Title and filters ride along at the top while the grid scrolls
            under them. The negative margins take the block out to the
            dialog's edges so nothing shows through beside it, and the padding
            puts it back where it was. */}
        <div className="sticky top-0 z-10 -mx-7 min-w-0 rounded-t-3xl bg-popover px-7 pt-7 pb-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold text-ink">
              Choose a template
            </DialogTitle>
          </DialogHeader>

          {/* Scrolls on a phone rather than stacking — the grid of templates
              is what the dialog is for. */}
          <div className="scroll-slim -mx-7 mt-5 flex min-w-0 gap-2.5 overflow-x-auto px-7 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            <FilterChip
              label="All"
              count={TEMPLATES.length}
              active={category === null}
              onClick={() => setCategory(null)}
            />
            {TEMPLATE_CATEGORIES.map((c) => (
              <FilterChip
                key={c.id}
                label={c.label}
                count={templatesIn(c.id).length}
                active={category === c.id}
                onClick={() => setCategory(c.id)}
              />
            ))}
          </div>
        </div>

        {shown.length === 0 ? (
          <p className="py-10 text-center text-[14.5px] font-medium text-ink-soft">
            Nothing in that group yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
            {shown.map((t) => {
              const selected = t.id === selectedId;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onPick(t)}
                  aria-pressed={selected}
                  className={`group relative overflow-hidden rounded-2xl border-2 text-left transition ${
                    selected
                      ? "border-brand"
                      : "border-field-border hover:border-ink/25"
                  }`}
                >
                  <TemplateThumb template={t} accent={accent} />
                  <span className="flex items-center gap-1.5 px-4 py-3">
                    <span className="text-[15px] font-bold text-ink">
                      {t.name}
                    </span>
                    {selected && (
                      <CheckIcon className="ml-auto h-4.5 w-4.5 shrink-0 text-brand" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/** The typeface dropdown.
 *
 *  Every name — on the trigger and in the list — is set in the face it
 *  selects. A font is chosen by how it looks, and a list of names all in one
 *  typeface tells you nothing about any of them. */

/** One filter button. The count is worth showing — it tells you whether a
 *  group is worth opening before you open it. */
function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full px-5 py-3 text-[15.5px] font-bold whitespace-nowrap transition ${
        active
          ? "bg-navy text-white"
          : "bg-field text-ink-soft hover:bg-black/[0.06] hover:text-ink"
      }`}
    >
      {label}
      <span
        className={`ml-2 text-[13.5px] font-semibold ${
          active ? "text-white/60" : "text-ink-faint"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

/** The one in use, then whatever comes next — enough to say "there are more". */
function previewTemplates(active: Template): Template[] {
  const at = TEMPLATES.findIndex((t) => t.id === active.id);
  return [0, 1, 2].map((i) => TEMPLATES[(at + i) % TEMPLATES.length]);
}

function TemplateThumb({ template }: { template: Template; accent?: string }) {
  // A screenshot of the real render, produced by scripts/shoot-templates.mjs.
  // A drawn approximation would be one more thing that can disagree with what
  // the editor actually outputs.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/templates/${template.id}.png`}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className="block w-full bg-white"
      style={{
        aspectRatio: "210 / 297",
        objectFit: "cover",
        objectPosition: "top",
      }}
    />
  );
}

function Group({
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
