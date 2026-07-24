"use client";

import { useState } from "react";
import { useResume } from "@/lib/store";
import type { ResumeSettings } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import { StepperSlider } from "@/components/ui/stepper-slider";
import { CheckIcon } from "@/components/ui/icons";

const GROUPS = [
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

const FONTS: { value: ResumeSettings["fontFamily"]; label: string }[] = [
  { value: "sans", label: "Sans" },
  { value: "serif", label: "Serif" },
  { value: "mono", label: "Mono" },
];

const HEADINGS: { value: ResumeSettings["headingStyle"]; label: string }[] = [
  { value: "underline", label: "Underline" },
  { value: "plain", label: "Plain" },
  { value: "uppercase", label: "Uppercase" },
];

export function CustomizePanel() {
  const { data, update } = useResume();
  const s = data.settings ?? DEFAULT_SETTINGS;
  const [active, setActive] = useState(GROUPS[0].id);

  const set = <K extends keyof ResumeSettings>(
    key: K,
    value: ResumeSettings[K],
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
          <p className="mb-2.5 text-[13.5px] font-bold text-ink">Typeface</p>
          <Segmented
            value={s.fontFamily}
            options={FONTS}
            onChange={(v) => set("fontFamily", v)}
          />
        </Group>

        <Group id="cz-colors" title="Colors">
          <p className="mb-2.5 text-[13.5px] font-bold text-ink">Accent color</p>
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
