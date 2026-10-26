"use client";

// The page's properties: the right-hand panel on a wide editor, the Design tab
// everywhere else. Built like a properties inspector — short sections on
// hairlines, a label beside each control, values you can type — rather than a
// stack of explained cards. The controls say what they do; nothing here needs
// a sentence under it.

import { useMemo, useRef, useState } from "react";
import {
  ALargeSmall,
  ArrowLeftRight,
  ArrowUpDown,
  MoveVertical,
  RotateCcw,
} from "lucide-react";
import { useResume } from "@/lib/store";
import type {
  DateFormat,
  IconKind,
  IconStyle,
  PageFormat,
  ResumeSettings,
  TagLayout,
  TagSeparator,
} from "@/lib/types";
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
import {
  CheckIcon,
  icon,
  ImageIcon,
  SearchIcon,
  TrashIcon,
} from "@/components/ui/icons";
import { ChevronDownIcon } from "@/components/ui/svg-icons";
import { removePhoto, uploadPhoto } from "@/lib/upload-image";
import { ColorWheel } from "@/components/ui/color-picker";
import { RangeSlider } from "@/components/ui/range-slider";
import { cn } from "@/lib/utils";
import {
  segItem,
  segItemOn,
  Segmented,
  segTrack,
} from "@/components/ui/segmented";
import { FontPicker } from "./FontPicker";
import { ContactIcon } from "@/components/preview/contact-icons";

const ResetIcon = icon(RotateCcw);
const SizeIcon = icon(ALargeSmall);
const LineIcon = icon(MoveVertical);
const SidesIcon = icon(ArrowLeftRight);
const EndsIcon = icon(ArrowUpDown);

const ACCENTS = [
  "#244cec",
  "#0ea5e9",
  "#0d9488",
  "#059669",
  "#7c3aed",
  "#e11d48",
  "#d97706",
  "#111111",
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

const PAGE_FORMATS: { value: PageFormat; label: string }[] = [
  { value: "A4", label: "A4" },
  { value: "Letter", label: "Letter" },
];

/** Each style is shown as a real date — the sample is the label. */
const DATE_FORMATS: DateFormat[] = ["short", "long", "numeric", "iso"];

const HEADINGS: { value: ResumeSettings["headingStyle"]; label: string }[] = [
  { value: "underline", label: "Rule" },
  { value: "plain", label: "Plain" },
  { value: "uppercase", label: "Caps" },
];

/** Shown by their marks; the name is only the tooltip. */
const ICON_STYLES: { value: IconStyle; label: string }[] = [
  { value: "solid", label: "Solid" },
  { value: "line", label: "Line" },
  { value: "rounded", label: "Rounded" },
  { value: "classic", label: "Classic" },
  { value: "none", label: "None" },
];

const ICON_SAMPLE: IconKind[] = ["email", "linkedin"];

const TAG_LAYOUTS: { value: TagLayout; label: string }[] = [
  { value: "auto", label: "Template default" },
  { value: "columns-1", label: "One column" },
  { value: "columns-2", label: "Two columns" },
  { value: "columns-3", label: "Three columns" },
  { value: "columns-4", label: "Four columns" },
  { value: "inline", label: "One line" },
  { value: "dots", label: "Dots" },
  { value: "bars", label: "Bars" },
];

const TAG_SEPARATOR_OPTIONS: { value: TagSeparator; label: string }[] = [
  { value: "pipe", label: "|" },
  { value: "bullet", label: "•" },
  { value: "dot", label: "·" },
  { value: "slash", label: "/" },
  { value: "comma", label: "," },
  { value: "dash", label: "–" },
];

type Wheel = "accent" | "pageColor" | "textColor" | "headingColor";

export function CustomizePanel() {
  const { data, format, setFormat, update } = useResume();
  const s = data.settings ?? DEFAULT_SETTINGS;
  const [pickerOpen, setPickerOpen] = useState(false);
  // One colour open at a time: four wheels at once is a wall of gradients.
  const [wheel, setWheel] = useState<Wheel | null>(null);
  const toggleWheel = (w: Wheel) => setWheel(wheel === w ? null : w);

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

  /** Back to how the template draws it: its font, heading and accent, the
   *  default sizes, and no colour overrides. Content and the background image
   *  are left alone — and undo is one keystroke away. */
  const resetStyle = () =>
    update((d) => {
      applyTemplate(d.settings, activeTemplate);
      d.settings.fontSize = DEFAULT_SETTINGS.fontSize;
      d.settings.lineHeight = DEFAULT_SETTINGS.lineHeight;
      d.settings.marginX = DEFAULT_SETTINGS.marginX;
      d.settings.marginY = DEFAULT_SETTINGS.marginY;
      d.settings.tagStyle = "auto";
      d.settings.pageColor = undefined;
      d.settings.textColor = undefined;
      d.settings.headingColor = undefined;
    });

  // The separator only means something between entries on one line.
  const inlineTags =
    s.tagStyle === "inline" ||
    ((!s.tagStyle || s.tagStyle === "auto") &&
      activeTemplate.tags === "inline");

  return (
    <div>
      <Group title="Template">
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="group flex w-full items-center gap-3 rounded-[10px] border border-field-border p-2 pr-3 text-left transition hover:border-brand/50"
        >
          <span className="block w-11 shrink-0 overflow-hidden rounded-[4px] ring-1 ring-divider">
            <TemplateThumb template={activeTemplate} />
          </span>
          <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-ink">
            {activeTemplate.name}
          </span>
          <span className="shrink-0 text-[13px] font-medium text-brand">
            Change
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

      <Group title="Text">
        <div className="space-y-4">
          <FontPicker
            value={s.fontFamily}
            onChange={(v) => set("fontFamily", v)}
          />
          <RangeRow
            label="Size"
            icon={SizeIcon}
            value={s.fontSize}
            unit="pt"
            min={9}
            max={13}
            step={0.5}
            onChange={(v) => set("fontSize", v)}
          />
          <RangeRow
            label="Line height"
            icon={LineIcon}
            value={s.lineHeight}
            min={1}
            max={1.7}
            step={0.05}
            digits={2}
            onChange={(v) => set("lineHeight", v)}
          />
        </div>
        <Row label="Headings" className="mt-3">
          <Segmented
            value={s.headingStyle}
            options={HEADINGS}
            onChange={(v) => set("headingStyle", v)}
          />
        </Row>
      </Group>

      <Group title="Color">
        <div className="flex flex-wrap items-center gap-2">
          {ACCENTS.map((color) => (
            <Swatch
              key={color}
              color={color}
              selected={s.accent.toLowerCase() === color.toLowerCase()}
              onClick={() => set("accent", color)}
            />
          ))}
          <WheelButton
            open={wheel === "accent"}
            color={s.accent}
            onClick={() => toggleWheel("accent")}
            label="accent color"
          />
        </div>
        {wheel === "accent" && (
          <WheelPanel>
            <ColorWheel value={s.accent} onChange={(v) => set("accent", v)} />
          </WheelPanel>
        )}

        {/* Overrides. Unset, the template decides — shown as "Auto". */}
        <div className="mt-4 space-y-2">
          <ColorRow
            label="Page"
            swatches={PAPERS}
            value={s.pageColor}
            fallback="#ffffff"
            open={wheel === "pageColor"}
            onToggle={() => toggleWheel("pageColor")}
            onChange={(v) => set("pageColor", v)}
          />
          <ColorRow
            label="Text"
            swatches={INKS}
            value={s.textColor}
            fallback="#374151"
            open={wheel === "textColor"}
            onToggle={() => toggleWheel("textColor")}
            onChange={(v) => set("textColor", v)}
          />
          <ColorRow
            label="Headings"
            swatches={INKS}
            value={s.headingColor}
            fallback="#111827"
            open={wheel === "headingColor"}
            onToggle={() => toggleWheel("headingColor")}
            onChange={(v) => set("headingColor", v)}
          />
        </div>
      </Group>

      <Group title="Page">
        <div className="space-y-3">
          <Row label="Size">
            <Segmented
              value={format}
              options={PAGE_FORMATS}
              onChange={setFormat}
            />
          </Row>
          <RangeRow
            label="Sides"
            icon={SidesIcon}
            value={s.marginX}
            unit="mm"
            min={8}
            max={30}
            step={1}
            onChange={(v) => set("marginX", v)}
          />
          <RangeRow
            label="Top & bottom"
            icon={EndsIcon}
            value={s.marginY}
            unit="mm"
            min={8}
            max={28}
            step={1}
            onChange={(v) => set("marginY", v)}
          />
          <Row label="Language">
            <Select
              label={
                <>
                  <span className="text-[16px] leading-none">
                    {activeLang.flag}
                  </span>
                  <span dir={activeLang.dir} className="truncate">
                    {activeLang.label}
                  </span>
                </>
              }
            >
              {LANGUAGES.map((l) => (
                <DropdownMenuItem
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                >
                  <span className="text-[16px] leading-none">{l.flag}</span>
                  <span dir={l.dir}>{l.label}</span>
                  {l.code === activeLang.code && <Tick />}
                </DropdownMenuItem>
              ))}
            </Select>
          </Row>
          <Row label="Dates">
            <Select
              label={formatMonth(
                "2021-09",
                s.language,
                s.dateFormat ?? "short",
              )}
            >
              {DATE_FORMATS.map((f) => (
                <DropdownMenuItem
                  key={f}
                  onClick={() => set("dateFormat", f)}
                >
                  {formatMonth("2021-09", s.language, f)}
                  {(s.dateFormat ?? "short") === f && <Tick />}
                </DropdownMenuItem>
              ))}
            </Select>
          </Row>
          <Row label="Image">
            <BackgroundImage
              value={s.pageImage}
              onChange={(v) => set("pageImage", v)}
            />
          </Row>
        </div>
      </Group>

      <Group title="Layout">
        <div className="space-y-3">
          <Row label="Icons">
            <div className={segTrack}>
              {ICON_STYLES.map((o) => {
                const selected = (s.iconStyle ?? "solid") === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => set("iconStyle", o.value)}
                    aria-pressed={selected}
                    aria-label={`${o.label} icons`}
                    title={o.label}
                    className={cn(
                      segItem,
                      "gap-0.5 px-0",
                      selected ? segItemOn : "opacity-60 hover:opacity-100",
                    )}
                    style={{ color: selected ? "#ffffff" : undefined }}
                  >
                    {o.value === "none" ? (
                      <span className="text-[12px] font-semibold text-ink-soft">
                        Off
                      </span>
                    ) : (
                      ICON_SAMPLE.map((kind) => (
                        <ContactIcon
                          key={kind}
                          kind={kind}
                          style={o.value}
                          color="currentColor"
                        />
                      ))
                    )}
                  </button>
                );
              })}
            </div>
          </Row>
          <Row label="Skills">
            <Select
              label={
                TAG_LAYOUTS.find((o) => o.value === (s.tagStyle ?? "auto"))
                  ?.label
              }
            >
              {TAG_LAYOUTS.map((o) => (
                <DropdownMenuItem
                  key={o.value}
                  onClick={() => set("tagStyle", o.value)}
                >
                  {o.label}
                  {(s.tagStyle ?? "auto") === o.value && <Tick />}
                </DropdownMenuItem>
              ))}
            </Select>
          </Row>
          {inlineTags && (
            <Row label="Separator">
              <div className={segTrack}>
                {TAG_SEPARATOR_OPTIONS.map((o) => {
                  const selected = (s.tagSeparator ?? "pipe") === o.value;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => set("tagSeparator", o.value)}
                      aria-label={o.value}
                      aria-pressed={selected}
                      className={cn(
                        segItem,
                        "px-0 text-[15px]",
                        selected && segItemOn,
                      )}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </Row>
          )}
        </div>
      </Group>

      <button
        type="button"
        onClick={resetStyle}
        className="flex w-full items-center justify-between px-5 py-4 text-[13.5px] text-ink-soft transition hover:bg-canvas hover:text-ink"
      >
        Reset style
        <ResetIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Layout pieces                                                              */
/* -------------------------------------------------------------------------- */

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-divider px-5 py-5">
      <h3 className="mb-3 text-[15px] font-bold text-ink">{title}</h3>
      {children}
    </section>
  );
}

/** A label on the left, its control filling the rest. */
function Row({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("grid grid-cols-[72px_minmax(0,1fr)] items-center gap-3", className)}
    >
      <span className="text-[13px] text-ink-soft">{label}</span>
      {children}
    </div>
  );
}

/** A value set by dragging: the label and the number on one line, the
 *  slider under them. */
function RangeRow({
  label,
  icon: Icon,
  value,
  unit,
  min,
  max,
  step,
  digits,
  onChange,
}: {
  label: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
  value: number;
  unit?: string;
  min: number;
  max: number;
  step: number;
  /** Fixed decimals — line height reads as 1.35, not 1.3500001. */
  digits?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-[13px]">
        <Icon className="h-4 w-4 text-ink-faint" />
        <span className="text-ink-soft">{label}</span>
        <span className="ml-auto font-medium text-ink tabular-nums">
          {digits === undefined ? value : value.toFixed(digits)}
          {unit && <span className="ml-0.5 text-ink-faint">{unit}</span>}
        </span>
      </div>
      <RangeSlider
        aria-label={label}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
      />
    </div>
  );
}

/** A dropdown that looks like a field. */
function Select({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-[42px] w-full min-w-0 items-center gap-2 rounded-md border border-field-border px-3 text-left text-[14px] font-medium text-ink transition hover:border-ink/25 aria-expanded:border-brand"
        >
          <span className="flex min-w-0 flex-1 items-center gap-2 truncate">
            {label}
          </span>
          <ChevronDownIcon className="h-4 w-4 shrink-0 text-ink-faint" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-80 min-w-48">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Tick() {
  return <CheckIcon className="ml-auto h-4 w-4 text-brand" />;
}

/* -------------------------------------------------------------------------- */
/* Colour                                                                     */
/* -------------------------------------------------------------------------- */

function Swatch({
  color,
  selected,
  onClick,
}: {
  color: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={color}
      aria-pressed={selected}
      className="flex h-7 w-7 items-center justify-center rounded-full ring-1 ring-black/10 ring-inset transition hover:scale-110"
      style={{
        backgroundColor: color,
        boxShadow: selected ? `0 0 0 2px #fff, 0 0 0 3.5px ${color}` : undefined,
      }}
    >
      {selected && (
        <CheckIcon
          className="h-3.5 w-3.5"
          strokeWidth={2.5}
          style={{ color: readableOn(color) }}
        />
      )}
    </button>
  );
}

/**
 * One optional colour, as a field: the colour and its hex, or "Auto" while the
 * template decides. Opening it shows the swatches and the wheel; the reset
 * icon hands the choice back to the template.
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
    <div>
      <Row label={label}>
        <div
          className={cn(
            "flex h-[42px] min-w-0 items-center rounded-md border transition",
            open ? "border-brand" : "border-field-border hover:border-ink/25",
          )}
        >
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-label={`${label} color`}
            className="flex h-full min-w-0 flex-1 items-center gap-2.5 px-3 text-left"
          >
            <span
              className="h-[18px] w-[18px] shrink-0 rounded-[5px] ring-1 ring-black/10 ring-inset"
              style={{ backgroundColor: value ?? fallback }}
            />
            <span
              className={cn(
                "truncate text-[14px] font-medium uppercase tabular-nums",
                value ? "text-ink" : "text-ink-faint normal-case",
              )}
            >
              {value ?? "Auto"}
            </span>
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(undefined)}
              aria-label={`Reset ${label.toLowerCase()} color`}
              title="Reset"
              className="flex h-full w-10 shrink-0 items-center justify-center border-l border-field-border text-ink-faint transition hover:text-ink"
            >
              <ResetIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </Row>

      {open && (
        <WheelPanel>
          <div className="mb-3 flex flex-wrap justify-center gap-2">
            {swatches.map((color) => (
              <Swatch
                key={color}
                color={color}
                selected={value?.toLowerCase() === color.toLowerCase()}
                onClick={() => onChange(color)}
              />
            ))}
          </div>
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
      className="grid h-7 w-7 place-items-center rounded-full transition hover:scale-110"
      style={{
        background:
          "conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
        boxShadow: open ? "0 0 0 2px #fff, 0 0 0 3.5px #111111" : undefined,
      }}
    >
      <span
        className="h-3.5 w-3.5 rounded-full border-2 border-white"
        style={{ backgroundColor: color }}
      />
    </button>
  );
}

function WheelPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 flex flex-col items-center rounded-[10px] bg-canvas p-3">
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
    <div className="min-w-0">
      <div className="flex h-[42px] min-w-0 items-center rounded-md border border-field-border transition hover:border-ink/25">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="flex h-full min-w-0 flex-1 items-center gap-2.5 px-3 text-left text-[14px] font-medium disabled:opacity-60"
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className="h-[18px] w-[18px] shrink-0 rounded-[5px] object-cover ring-1 ring-divider"
            />
          ) : (
            <ImageIcon className="h-4 w-4 shrink-0 text-ink-faint" />
          )}
          <span className={cn("truncate", value ? "text-ink" : "text-ink-faint")}>
            {busy ? "Uploading…" : value ? "Replace" : "Upload"}
          </span>
        </button>
        {value && (
          <button
            type="button"
            onClick={clear}
            aria-label="Remove background image"
            title="Remove"
            className="flex h-full w-10 shrink-0 items-center justify-center border-l border-field-border text-ink-faint transition hover:text-danger"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-[12px] font-medium text-danger">{error}</p>
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
        <div className="sticky top-0 z-10 -mx-7 min-w-0 rounded-t-3xl border-b border-divider bg-popover px-7 pt-7 pb-4 max-sm:-mx-4 max-sm:border-0 max-sm:px-4 max-sm:pt-3 sm:rounded-none">
          <DialogBack className="mb-3 sm:hidden" />

          <div className="flex items-center gap-4 max-sm:hidden">
            <DialogHeader>
              {/* The Back button says what this is on a phone. */}
              <DialogTitle className="text-2xl font-bold text-ink max-sm:sr-only">
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
                className="h-[42px] w-full rounded-md border border-field-border bg-panel pr-3.5 pl-10 text-[14px] text-ink outline-none transition placeholder:text-ink-faint focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/15"
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
          ? "bg-brand text-white"
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
