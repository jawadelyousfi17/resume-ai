"use client";

import { useMemo, useRef, useState } from "react";
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
  DialogBack,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StepperSlider } from "@/components/ui/stepper-slider";
import { CheckIcon, SearchIcon } from "@/components/ui/icons";
import { ChevronDownIcon } from "@/components/ui/svg-icons";
import { removePhoto, uploadPhoto } from "@/lib/upload-image";
import { ColorWheel } from "@/components/ui/color-picker";
import { FontPicker } from "./FontPicker";

const GROUPS = [
  { id: "cz-document", label: "Document" },
  { id: "cz-template", label: "Template" },
  { id: "cz-font-size", label: "Font Size" },
  { id: "cz-spacing", label: "Spacing" },
  { id: "cz-headings", label: "Headings" },
  { id: "cz-font", label: "Font" },
  { id: "cz-colors", label: "Colors" },
  { id: "cz-background", label: "Background" },
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

/** Papers. Off-whites and one near-black, because a resume printed on a
 *  saturated background stops being a resume. */
const PAPERS = [
  "#ffffff",
  "#faf7f2",
  "#f6f6f4",
  "#f2f5f9",
  "#f4f1f8",
  "#eef3f0",
  "#1f2430",
];

/** Inks. Greys and near-blacks, plus two that suit a dark paper. */
const INKS = [
  "#111827",
  "#374151",
  "#4b5563",
  "#1e3a53",
  "#3f3a34",
  "#f8fafc",
  "#cbd5e1",
];

/** Longest edge kept for a page background: an A4 sheet renders 794px
 *  wide, so this survives a retina preview and a PDF. */
const BACKGROUND_EDGE = 1600;

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

  // Which colour is being picked, if any. One at a time: four wheels open at
  // once is a wall of gradients, and only one of them is the one you meant.
  const [wheel, setWheel] = useState<
    "accent" | "pageColor" | "textColor" | "headingColor" | null
  >(null);

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
            <WheelButton
              open={wheel === "accent"}
              color={s.accent}
              onClick={() => setWheel(wheel === "accent" ? null : "accent")}
              label="accent color"
            />
          </div>

          {wheel === "accent" && (
            <WheelPanel>
              <ColorWheel value={s.accent} onChange={(v) => set("accent", v)} />
            </WheelPanel>
          )}

          {/* The three below are overrides, and each says so: unset, the
              template decides, which is what most people should leave them at.
              Clearing one is a button rather than a colour you have to guess. */}
          <ColorRow
            label="Page background"
            swatches={PAPERS}
            value={s.pageColor}
            fallback="#ffffff"
            open={wheel === "pageColor"}
            onToggle={() =>
              setWheel(wheel === "pageColor" ? null : "pageColor")
            }
            onChange={(v) => set("pageColor", v)}
          />

          <ColorRow
            label="Text color"
            swatches={INKS}
            value={s.textColor}
            fallback="#374151"
            open={wheel === "textColor"}
            onToggle={() =>
              setWheel(wheel === "textColor" ? null : "textColor")
            }
            onChange={(v) => set("textColor", v)}
          />

          <ColorRow
            label="Heading color"
            swatches={INKS}
            value={s.headingColor}
            fallback="#111827"
            open={wheel === "headingColor"}
            onToggle={() =>
              setWheel(wheel === "headingColor" ? null : "headingColor")
            }
            onChange={(v) => set("headingColor", v)}
          />
        </Group>

        <Group id="cz-background" title="Background image">
          <BackgroundImage
            value={s.pageImage}
            onChange={(v) => set("pageImage", v)}
          />
        </Group>
      </div>
    </div>
  );
}

/**
 * One optional colour: a row of swatches, a custom picker, and a way back to
 * the template's own choice.
 *
 * `undefined` is a real state here, not a missing value — it means "whatever
 * the template does", so a resume keeps following its template until somebody
 * deliberately overrules it. The picker needs *some* colour to show, which is
 * what `fallback` is for; picking from it is what sets the override.
 */
function ColorRow({
  label,
  swatches,
  value,
  fallback,
  open,
  onToggle,
  onChange,
}: {
  label: string;
  swatches: string[];
  value: string | undefined;
  fallback: string;
  open: boolean;
  onToggle: () => void;
  onChange: (value: string | undefined) => void;
}) {
  return (
    <div className="mt-5">
      <div className="mb-2.5 flex items-center gap-3">
        <p className="text-[13.5px] font-bold text-ink">{label}</p>
        {value ? (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="text-[12.5px] font-bold text-ink-faint transition hover:text-ink"
          >
            Reset
          </button>
        ) : (
          <span className="text-[12.5px] font-medium text-ink-faint">
            From template
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {swatches.map((color) => {
          const selected = value?.toLowerCase() === color.toLowerCase();
          return (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              aria-label={color}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 transition hover:scale-105"
              style={{
                backgroundColor: color,
                boxShadow: selected
                  ? `0 0 0 2px #fff, 0 0 0 4px ${color}`
                  : undefined,
              }}
            >
              {selected && (
                <CheckIcon
                  className="h-4 w-4"
                  style={{ color: readableOn(color) }}
                />
              )}
            </button>
          );
        })}
        <WheelButton
          open={open}
          color={value ?? fallback}
          onClick={onToggle}
          label={label.toLowerCase()}
        />
      </div>

      {open && (
        <WheelPanel>
          <ColorWheel value={value ?? fallback} onChange={onChange} />
        </WheelPanel>
      )}
    </div>
  );
}

/** The way into the wheel: a rainbow ring with the current colour in the
 *  middle, which is what the thing it opens looks like. */
function WheelButton({
  open,
  color,
  onClick,
  label,
}: {
  open: boolean;
  color: string;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label={`Custom ${label}`}
      className="ml-1 grid h-9 w-9 place-items-center rounded-full transition hover:scale-105"
      style={{
        background:
          "conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
        boxShadow: open ? "0 0 0 2px #fff, 0 0 0 4px #111827" : undefined,
      }}
    >
      <span
        className="h-[18px] w-[18px] rounded-full border-2 border-white shadow-sm"
        style={{ backgroundColor: color }}
      />
    </button>
  );
}

function WheelPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 flex justify-center rounded-2xl bg-field/70 p-4">
      {children}
    </div>
  );
}

/** Black or white, whichever reads on the swatch — the tick has to be visible
 *  on white paper and on near-black alike. */
function readableOn(hex: string): string {
  const raw = hex.replace("#", "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  if (full.length !== 6) return "#ffffff";
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  if ([r, g, b].some(Number.isNaN)) return "#ffffff";
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 150 ? "#111827" : "#ffffff";
}

/**
 * A picture behind the whole page.
 *
 * It goes through the same uploader as the profile photo — shrunk in the
 * browser and stored as a URL — but at a bigger edge, because this one covers
 * a whole sheet rather than a 120px square. Inline data URLs would bloat every
 * autosave and overflow the print token.
 */
function BackgroundImage({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = async (file: File) => {
    setError(null);
    setBusy(true);
    const previous = value;
    try {
      onChange(await uploadPhoto(file, BACKGROUND_EDGE));
      // Only once the new one is in place, so a failed upload leaves the old
      // background rather than nothing.
      void removePhoto(previous);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "That image couldn't be added.",
      );
    } finally {
      setBusy(false);
    }
  };

  const clear = () => {
    const previous = value;
    onChange(undefined);
    setError(null);
    void removePhoto(previous);
  };

  return (
    <div>
      {/* The card's own title names this, so the row goes straight to the
          controls rather than saying it twice. */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="h-11 rounded-xl bg-field px-4 text-[13.5px] font-bold text-ink transition hover:bg-field/70 disabled:opacity-60"
        >
          {busy ? "Uploading…" : value ? "Replace image" : "Upload an image"}
        </button>

        {value && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt=""
              className="h-11 w-11 rounded-lg object-cover ring-1 ring-black/10"
            />
            <button
              type="button"
              onClick={clear}
              className="text-[13px] font-bold text-ink-faint transition hover:text-ink"
            >
              Remove
            </button>
          </>
        )}
      </div>

      {error ? (
        <p className="mt-2 text-[12px] font-medium text-danger">{error}</p>
      ) : (
        <p className="mt-2 text-[12px] text-ink-faint">
          Sits behind everything and prints with the page. Keep it faint —
          anything busy costs you the words on top of it.
        </p>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void pick(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/** The full template gallery. Picking one applies it and closes the dialog.
 *  Exported because the same gallery asks the question again on the way in —
 *  see components/dashboard/NewResumeDialog. */
export function TemplatePicker({
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
  // Null is "All".
  const [category, setCategory] = useState<TemplateCategory | null>(null);
  const [query, setQuery] = useState("");

  // Search reads the description too: people arrive looking for "two column"
  // or "photo" rather than for Onyx, and the words that describe a template
  // are the ones they'd type.
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEMPLATES.filter(
      (t) =>
        (!category || inCategory(t, category)) &&
        (!q ||
          t.name.toLowerCase().includes(q) ||
          t.short.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)),
    );
  }, [category, query]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // Reopening should start from the whole set, not the last search.
        if (!next) {
          setCategory(null);
          setQuery("");
        }
        onOpenChange(next);
      }}
    >
      {/* The whole window on a desktop. A template is judged by how the page
          looks, and the more of them that fit side by side at a size worth
          reading, the less this is a list and the more it is a shelf. The
          phone keeps the sheet it already had. `scroll-slim` keeps the
          scrolling and drops the bar. */}
      <DialogContent
        fullScreen
        showBack={false}
        aria-describedby={undefined}
        className="scroll-slim gap-6 overflow-y-auto p-7 pt-0 max-sm:content-start max-sm:px-4 max-sm:pt-0 sm:top-0 sm:left-0 sm:h-dvh sm:max-h-none sm:w-screen sm:max-w-none sm:translate-x-0 sm:translate-y-0 sm:rounded-none"
      >
        {/* Title and filters ride along at the top while the grid scrolls
            under them. The negative margins take the block out to the
            dialog's edges so nothing shows through beside it, and the padding
            puts it back where it was. */}
        {/* Back and the filters ride together at the top; only the grid
            underneath them moves. */}
        <div className="sticky top-0 z-10 -mx-7 min-w-0 rounded-t-3xl border-b border-black/5 bg-popover px-7 pt-7 pb-4 max-sm:-mx-4 max-sm:border-0 max-sm:px-4 max-sm:pt-3 sm:rounded-none">
          <DialogBack className="mb-3 sm:hidden" />

          <div className="flex items-center gap-4 max-sm:hidden">
            <DialogHeader>
              {/* The Back button says what this is on a phone. */}
              <DialogTitle className="text-2xl font-extrabold text-ink max-sm:sr-only">
                Choose a template
              </DialogTitle>
            </DialogHeader>

            {/* Beside the title rather than over the grid: the filters below
                are the coarse cut, and this is for when you know the word. */}
            <label className="relative ml-auto block w-[300px] shrink-0">
              <span className="sr-only">Search templates</span>
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-ink-faint" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search — serif, two column, photo…"
                className="h-11 w-full rounded-xl bg-field pr-4 pl-10 text-[14.5px] font-semibold text-ink outline-none transition placeholder:font-medium placeholder:text-ink-faint focus:ring-2 focus:ring-ink/80"
              />
            </label>
          </div>

          <DialogHeader className="sm:hidden">
            <DialogTitle className="sr-only">Choose a template</DialogTitle>
          </DialogHeader>

          {/* Scrolls on a phone rather than stacking — the grid of templates
              is what the dialog is for. */}
          <div className="scroll-slim -mx-7 mt-5 flex min-w-0 gap-2.5 overflow-x-auto px-7 pb-1 max-sm:-mx-4 max-sm:mt-0 max-sm:px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
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
          <div className="py-16 text-center">
            <p className="text-[15px] font-bold text-ink">
              Nothing matches that.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory(null);
              }}
              className="mt-3 text-[14px] font-bold text-brand transition hover:opacity-80"
            >
              Show all {TEMPLATES.length}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
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
