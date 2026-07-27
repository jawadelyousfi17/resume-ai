"use client";

// Sign the letter: draw it with a pointer, or upload a photo of one.
//
// Both routes end in the same place — a PNG data URL on the letter — so the
// preview and the PDF only ever deal with one thing. The drawing is captured on
// a transparent canvas so it sits on the page rather than on a white patch, and
// whatever comes back is trimmed to its ink and scaled down before it's stored:
// a letter has a size budget, and an untrimmed phone photo would eat it.

import { useRef, useState } from "react";

import { Label } from "@/components/ui/fields";
import { CloseIcon, PencilIcon, UploadIcon } from "@/components/ui/svg-icons";

/** Drawn at this resolution regardless of how wide the box ends up. */
const PAD_W = 900;
const PAD_H = 300;

/** What gets stored, at most. Comfortably legible at print size. */
const MAX_W = 600;

type Mode = "draw" | "upload";

export function SignaturePad({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (dataUrl: string | undefined) => void;
}) {
  const [mode, setMode] = useState<Mode>("draw");
  const [error, setError] = useState<string | null>(null);
  // True while replacing a signature that's already on the letter — the pad is
  // on screen even though `value` is set.
  const [editing, setEditing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const dirty = useRef(false);

  const ctx = () => canvasRef.current?.getContext("2d") ?? null;

  /* -------------------------------------------------------------------- */
  /* Drawing                                                              */
  /* -------------------------------------------------------------------- */

  /** Pointer position in canvas pixels, which is not the box's pixels. */
  const at = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const box = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - box.left) / box.width) * PAD_W,
      y: ((e.clientY - box.top) / box.height) * PAD_H,
    };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = ctx();
    if (!c) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    const { x, y } = at(e);
    c.beginPath();
    c.moveTo(x, y);
    // A dot, so a tap leaves a mark.
    c.lineTo(x + 0.01, y);
    c.stroke();
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const c = ctx();
    if (!c) return;
    const { x, y } = at(e);
    c.lineTo(x, y);
    c.stroke();
    dirty.current = true;
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (dirty.current) commit();
  };

  /** Hand the drawing over, trimmed to the ink. */
  const commit = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const trimmed = trim(canvas);
    if (!trimmed) return;
    onChange(trimmed);
    setEditing(false);
  };

  /** Wipes the pad. Only does anything while the pad is on screen, which is
   *  why it can't be what "Remove" calls — see below. */
  const clearPad = () => {
    const c = ctx();
    if (!c) return;
    c.clearRect(0, 0, PAD_W, PAD_H);
    stroke(c);
    dirty.current = false;
  };

  /** Takes the signature off the letter.
   *
   *  Deliberately separate from `clearPad`: the canvas is only mounted when
   *  there's no signature showing, so a single function that started by
   *  reaching for the 2D context bailed out before it ever got to `onChange`
   *  — which is exactly the state Remove is pressed in. */
  const remove = () => {
    clearPad();
    onChange(undefined);
    setEditing(false);
    setError(null);
  };

  /* -------------------------------------------------------------------- */
  /* Upload                                                               */
  /* -------------------------------------------------------------------- */

  const upload = (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("That file isn't an image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, MAX_W / img.width);
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const off = document.createElement("canvas");
        off.width = w;
        off.height = h;
        const c = off.getContext("2d");
        if (!c) return;
        c.drawImage(img, 0, 0, w, h);
        onChange(trim(off) ?? off.toDataURL("image/png"));
        setEditing(false);
      };
      img.onerror = () => setError("That image couldn't be read.");
      img.src = String(reader.result);
    };
    reader.onerror = () => setError("That image couldn't be read.");
    reader.readAsDataURL(file);
  };

  /* -------------------------------------------------------------------- */

  return (
    <div>
      <Label>Signature</Label>

      {value && !editing ? (
        <div className="flex items-center gap-3 rounded-xl bg-field p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Your signature"
            className="h-14 max-w-[220px] object-contain"
          />
          <div className="ml-auto flex items-center gap-1">
            {/* Without this there was no way back to the pad once a signature
                was on the letter — the only route to a different one was to
                remove this one first. */}
            <button
              type="button"
              onClick={() => {
                dirty.current = false;
                setEditing(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[13px] font-bold text-ink-soft transition hover:bg-black/5 hover:text-ink"
            >
              <PencilIcon className="h-4 w-4" />
              Change
            </button>
            <button
              type="button"
              onClick={remove}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[13px] font-bold text-ink-soft transition hover:bg-danger/10 hover:text-danger"
            >
              <CloseIcon className="h-4 w-4" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Only while replacing — with no signature on the letter there's
              nothing to go back to. */}
          {value && (
            <div className="flex items-center gap-2 rounded-xl bg-field px-3 py-2">
              <p className="text-[12.5px] font-semibold text-ink-soft">
                Replacing your signature
              </p>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="ml-auto rounded-lg px-2.5 py-1.5 text-[13px] font-bold text-ink-soft transition hover:bg-black/5 hover:text-ink"
              >
                Keep the old one
              </button>
            </div>
          )}

          <div className="flex gap-2">
            {(
              [
                { id: "draw", label: "Draw it", Icon: PencilIcon },
                { id: "upload", label: "Upload", Icon: UploadIcon },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setMode(t.id)}
                aria-pressed={mode === t.id}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-[14px] font-semibold transition ${
                  mode === t.id
                    ? "border-brand/50 bg-brand-soft text-brand"
                    : "border-field-border bg-field text-ink-soft hover:text-ink"
                }`}
              >
                <t.Icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>

          {mode === "draw" ? (
            <div>
              <canvas
                ref={(el) => {
                  canvasRef.current = el;
                  const c = el?.getContext("2d");
                  if (c) stroke(c);
                }}
                width={PAD_W}
                height={PAD_H}
                onPointerDown={start}
                onPointerMove={move}
                onPointerUp={end}
                onPointerLeave={end}
                onPointerCancel={end}
                // Without this a drag on a touch screen scrolls the panel
                // instead of drawing.
                className="w-full touch-none rounded-xl border border-dashed border-field-border bg-white"
                style={{ aspectRatio: `${PAD_W} / ${PAD_H}` }}
                aria-label="Draw your signature"
              />
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="text-[12.5px] text-ink-faint">
                  Sign in the box with a mouse, trackpad or finger.
                </p>
                <button
                  type="button"
                  onClick={clearPad}
                  className="shrink-0 rounded-lg px-2.5 py-1.5 text-[13px] font-bold text-ink-soft transition hover:bg-black/5 hover:text-ink"
                >
                  Clear
                </button>
              </div>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-field-border bg-field px-4 py-8 text-center transition hover:border-ink/25">
              <UploadIcon className="h-6 w-6 text-ink-faint" />
              <span className="text-[14px] font-bold text-ink">
                Choose an image
              </span>
              <span className="text-[12.5px] text-ink-faint">
                A photo or scan of your signature. PNG with a transparent
                background looks best.
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) upload(file);
                  // So choosing the same file twice still fires.
                  e.target.value = "";
                }}
              />
            </label>
          )}
        </div>
      )}

      {error && <p className="mt-2 text-[12.5px] text-danger">{error}</p>}
    </div>
  );
}

/** The pen. Round joins so a slow hand doesn't leave corners. */
function stroke(c: CanvasRenderingContext2D) {
  c.lineWidth = 4;
  c.lineCap = "round";
  c.lineJoin = "round";
  c.strokeStyle = "#111827";
}

/**
 * Crop to the drawn pixels and scale the result down to MAX_W.
 *
 * Without this, a signature drawn in the corner of the pad prints as a small
 * mark adrift in a wide transparent box, and the stored string carries all that
 * empty space. Returns null when the canvas is blank.
 */
function trim(source: HTMLCanvasElement): string | null {
  const c = source.getContext("2d");
  if (!c) return null;

  const { width, height } = source;
  let pixels: Uint8ClampedArray;
  try {
    pixels = c.getImageData(0, 0, width, height).data;
  } catch {
    // A cross-origin image would taint the canvas. Nothing here should, but
    // failing soft beats throwing inside an onload.
    return source.toDataURL("image/png");
  }

  let top = height,
    left = width,
    right = -1,
    bottom = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const alpha = pixels[i + 3];
      // Near-white counts as background, so a photographed signature on paper
      // crops the same way a drawn one does.
      const light =
        pixels[i] > 244 && pixels[i + 1] > 244 && pixels[i + 2] > 244;
      if (alpha > 12 && !light) {
        if (y < top) top = y;
        if (y > bottom) bottom = y;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
  }

  if (right < 0) return null;

  const pad = 8;
  const sx = Math.max(0, left - pad);
  const sy = Math.max(0, top - pad);
  const sw = Math.min(width - sx, right - left + 1 + pad * 2);
  const sh = Math.min(height - sy, bottom - top + 1 + pad * 2);

  const scale = Math.min(1, MAX_W / sw);
  const out = document.createElement("canvas");
  out.width = Math.max(1, Math.round(sw * scale));
  out.height = Math.max(1, Math.round(sh * scale));
  const oc = out.getContext("2d");
  if (!oc) return null;
  oc.drawImage(source, sx, sy, sw, sh, 0, 0, out.width, out.height);
  return out.toDataURL("image/png");
}
