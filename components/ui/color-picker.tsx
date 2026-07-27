"use client";

// A colour wheel, for the places where the app asks somebody to choose a colour
// they can't name.
//
// It replaces `<input type="color">`, which hands the job to a browser dialog
// that looks like nothing else in the app and, on Linux and Android, often
// looks like nothing at all. Here the ring picks the hue and the square inside
// it picks how strong and how light — the two questions people actually have —
// with a hex field underneath for anyone who arrived knowing the answer.
//
// Self-contained: no portal, no outside-click handling. It expands in place
// under whatever opened it, which in a settings column is where you were
// looking anyway.

import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ colour */

/** Hue 0–360, saturation and value 0–1. */
type Hsv = { h: number; s: number; v: number };

export function hexToHsv(hex: string): Hsv {
  const raw = hex.replace("#", "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  if (full.length !== 6) return { h: 0, s: 0, v: 0 };

  const [r, g, b] = [0, 2, 4].map(
    (i) => parseInt(full.slice(i, i + 2), 16) / 255,
  );
  if ([r, g, b].some(Number.isNaN)) return { h: 0, s: 0, v: 0 };

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  return { h, s: max === 0 ? 0 : d / max, v: max };
}

export function hsvToHex({ h, s, v }: Hsv): string {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  const [r, g, b] = (
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x]
  ).map((n) => Math.round((n + m) * 255));

  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

const isHex = (value: string) => /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);

const normalise = (value: string) => {
  const raw = value.replace("#", "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  return `#${full.toLowerCase()}`;
};

/* -------------------------------------------------------------------- wheel */

const SIZE = 188;
/** Where the ring ends and the hole begins, as a fraction of the radius. */
const HOLE = 0.68;
/** The biggest square that fits in the hole. */
const SQUARE = Math.floor(((SIZE * HOLE) / Math.SQRT2) * 0.98);

/**
 * Drags on an element, reported as a fraction of its box.
 *
 * Pointer capture rather than window listeners: the drag keeps following the
 * finger past the edge of the wheel, and it ends with the gesture even if the
 * pointer comes up somewhere else entirely.
 */
function useDrag(onMove: (x: number, y: number, box: DOMRect) => void) {
  const ref = useRef<HTMLDivElement>(null);

  const handle = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    onMove(e.clientX - box.left, e.clientY - box.top, box);
  };

  return {
    ref,
    onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      handle(e);
    },
    onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) handle(e);
    },
    style: { touchAction: "none" as const },
  };
}

export function ColorWheel({
  value,
  onChange,
  className,
}: {
  /** Hex, with or without the hash. */
  value: string;
  onChange: (hex: string) => void;
  className?: string;
}) {
  const hsv = hexToHsv(value);

  // Hue is remembered rather than read back, because black and grey have no
  // hue to read: without this the ring snaps to red the moment somebody drags
  // the square into a dark corner, and every colour after that comes out red.
  //
  // Adjusted during render on a change of value — React's own pattern for
  // state that follows a prop — rather than in an effect, which would paint
  // one frame with the old hue first.
  const [hue, setHue] = useState(hsv.h);
  const [seen, setSeen] = useState(value);
  if (value !== seen) {
    setSeen(value);
    if (hsv.s > 0.02 && hsv.v > 0.02) setHue(hsv.h);
  }

  const ring = useDrag((x, y, box) => {
    const dx = x - box.width / 2;
    const dy = y - box.height / 2;
    // 0° at twelve o'clock, clockwise — the same way the conic gradient runs.
    const angle = (Math.atan2(dx, -dy) * (180 / Math.PI) + 360) % 360;
    setHue(angle);
    onChange(hsvToHex({ h: angle, s: hsv.s || 1, v: hsv.v || 1 }));
  });

  const square = useDrag((x, y, box) => {
    const s = Math.min(1, Math.max(0, x / box.width));
    const v = 1 - Math.min(1, Math.max(0, y / box.height));
    onChange(hsvToHex({ h: hue, s, v }));
  });

  const radius = (SIZE / 2) * ((1 + HOLE) / 2);
  const theta = (hue * Math.PI) / 180;

  return (
    <div
      className={cn("flex flex-col items-center gap-4", className)}
      style={{ width: SIZE }}
    >
      <div
        {...ring}
        className="relative cursor-pointer select-none"
        style={{ ...ring.style, width: SIZE, height: SIZE }}
      >
        {/* The ring. Masked to a donut so the square can live in the hole. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
            WebkitMask: `radial-gradient(circle, transparent ${HOLE * 100}%, #000 ${HOLE * 100 + 1}%)`,
            mask: `radial-gradient(circle, transparent ${HOLE * 100}%, #000 ${HOLE * 100 + 1}%)`,
          }}
        />

        {/* Where the hue currently sits. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_1px_4px_rgba(0,0,0,0.45)]"
          style={{
            left: SIZE / 2 + radius * Math.sin(theta),
            top: SIZE / 2 - radius * Math.cos(theta),
            backgroundColor: hsvToHex({ h: hue, s: 1, v: 1 }),
          }}
        />

        {/* Strength and lightness, at the hue the ring is pointing at. */}
        <div
          {...square}
          className="absolute cursor-crosshair rounded-md"
          style={{
            ...square.style,
            width: SQUARE,
            height: SQUARE,
            left: (SIZE - SQUARE) / 2,
            top: (SIZE - SQUARE) / 2,
            backgroundColor: hsvToHex({ h: hue, s: 1, v: 1 }),
            backgroundImage:
              "linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)",
          }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_1px_4px_rgba(0,0,0,0.45)]"
            style={{
              left: `${hsv.s * 100}%`,
              top: `${(1 - hsv.v) * 100}%`,
              backgroundColor: normalise(value),
            }}
          />
        </div>
      </div>

      <HexField value={value} onChange={onChange} />
    </div>
  );
}

/** The same colour, typed. Kept beside the wheel because a brand colour is
 *  usually handed over as six characters, and because it's the part of this
 *  control a keyboard can reach. */
function HexField({
  value,
  onChange,
}: {
  value: string;
  onChange: (hex: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  const [focused, setFocused] = useState(false);

  // While it's being typed in, the field is the source of truth; the rest of
  // the time it follows the wheel.
  const shown = focused ? draft : normalise(value);

  return (
    <label className="flex w-full items-center gap-2 rounded-xl bg-field px-3 py-2">
      <span
        aria-hidden="true"
        className="h-5 w-5 shrink-0 rounded-md border border-black/10"
        style={{ backgroundColor: normalise(value) }}
      />
      <input
        value={shown}
        onFocus={() => {
          setDraft(normalise(value));
          setFocused(true);
        }}
        onBlur={() => setFocused(false)}
        onChange={(e) => {
          setDraft(e.target.value);
          if (isHex(e.target.value)) onChange(normalise(e.target.value));
        }}
        spellCheck={false}
        aria-label="Hex colour"
        className="w-full bg-transparent text-[13.5px] font-bold tracking-wide text-ink uppercase outline-none"
      />
    </label>
  );
}
