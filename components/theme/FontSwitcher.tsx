"use client";

// The interface-font picker: the same pill as the theme switcher, one row up.
//
// A tool for deciding, not a preference to ship — see where it's mounted in
// app/layout.tsx. Each row is set in the font it names, so the list is its own
// specimen sheet; pressing one re-sets the whole app instantly, because every
// surface reads `--font-sans` and nothing names a family of its own.

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { CheckIcon } from "@/components/ui/icons";
import { CloseIcon } from "@/components/ui/svg-icons";
import {
  DEFAULT_UI_FONT,
  isUiFontId,
  UI_FONT_KEY,
  UI_FONTS,
  type UiFontId,
} from "@/lib/ui-fonts";
import { cn } from "@/lib/utils";

/* Same shape as the theme switcher: the applied font is an attribute on
   <html>, set before React exists by the inline script in the layout, so the
   DOM is the source of truth and this only subscribes to it. */

const listeners = new Set<() => void>();

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  return () => void listeners.delete(onChange);
};

const readFont = (): UiFontId => {
  const applied = document.documentElement.dataset.uiFont;
  return isUiFontId(applied) ? applied : DEFAULT_UI_FONT;
};

const serverFont = () => DEFAULT_UI_FONT;

function applyFont(id: UiFontId) {
  document.documentElement.dataset.uiFont = id;
  try {
    localStorage.setItem(UI_FONT_KEY, id);
  } catch {
    // Private mode, or storage full. It still applies for this visit.
  }
  for (const listener of listeners) listener();
}

export function FontSwitcher() {
  const [open, setOpen] = useState(false);
  const font = useSyncExternalStore(subscribe, readFont, serverFont);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = UI_FONTS.find((f) => f.id === font) ?? UI_FONTS[0];

  return (
    <div
      ref={panelRef}
      // Directly above the theme pill, which owns right-6 bottom-6.
      className="fixed right-6 bottom-[5.25rem] z-50 hidden print:hidden md:block"
    >
      {open && (
        <div
          role="dialog"
          aria-label="Interface font"
          className="mb-3 w-[300px] overflow-hidden rounded-2xl bg-panel shadow-[0_18px_48px_rgba(15,23,42,0.22)] ring-1 ring-black/10"
        >
          <div className="flex items-center gap-2 border-b border-black/5 px-4 py-3">
            <span className="text-[13.5px] font-extrabold text-ink">
              Interface font
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="-mr-1.5 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint transition hover:bg-black/5 hover:text-ink"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="p-2">
            {UI_FONTS.map((f) => {
              const on = f.id === font;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => applyFont(f.id)}
                  aria-pressed={on}
                  // Set in itself, so the row is the specimen.
                  style={{ fontFamily: f.stack }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
                    on ? "bg-brand-soft" : "hover:bg-black/[0.04]",
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block text-[15px] font-bold",
                        on ? "text-brand" : "text-ink",
                      )}
                    >
                      {f.name}
                    </span>
                    <span className="block text-[12px] leading-snug text-ink-soft">
                      {f.note}
                    </span>
                  </span>

                  {on && <CheckIcon className="h-4 w-4 shrink-0 text-brand" />}
                </button>
              );
            })}
          </div>

          {/* The hard part of judging a UI font is the small stuff, not the
              name at 15px — so the panel carries a line of each. */}
          <div
            className="border-t border-black/5 px-4 py-3"
            style={{ fontFamily: active.stack }}
          >
            <p className="text-[19px] leading-tight font-extrabold tracking-tight text-ink">
              Build a job-winning resume
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
              Senior Product Designer · 2019–2024 · 34% to 58%
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`Interface font: ${active.name}`}
        className="ml-auto flex h-11 items-center gap-2.5 rounded-full bg-panel pr-4 pl-4 shadow-[0_10px_30px_rgba(15,23,42,0.18)] ring-1 ring-black/10 transition hover:-translate-y-0.5"
      >
        <span
          aria-hidden="true"
          className="text-[17px] leading-none font-black text-ink"
          style={{ fontFamily: active.stack }}
        >
          Aa
        </span>
        <span className="text-[13.5px] font-bold text-ink">{active.name}</span>
      </button>
    </div>
  );
}
