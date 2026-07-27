"use client";

// The palette picker: a small pill in the corner that opens into the five
// themes and applies one the moment you press it.
//
// Applying a theme is one attribute on <html> — every colour in the app is a
// CSS variable behind that attribute — so switching is instant and nothing
// re-renders. The choice is kept in localStorage and re-applied by the inline
// script in app/layout.tsx before the first paint.

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { CheckIcon } from "@/components/ui/icons";
import { CloseIcon, DesignIcon } from "@/components/ui/svg-icons";
import {
  DEFAULT_THEME,
  isThemeId,
  THEME_KEY,
  THEMES,
  type ThemeId,
} from "@/lib/themes";
import { cn } from "@/lib/utils";

/* The applied theme is a DOM attribute, not React state — the inline script in
   the layout sets it before React exists. So it's read as an external store:
   the attribute is the source of truth, and `applyTheme` is the only writer. */

const listeners = new Set<() => void>();

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  return () => void listeners.delete(onChange);
};

const readTheme = (): ThemeId => {
  const applied = document.documentElement.dataset.theme;
  return isThemeId(applied) ? applied : DEFAULT_THEME;
};

const serverTheme = () => DEFAULT_THEME;

function applyTheme(id: ThemeId) {
  document.documentElement.dataset.theme = id;
  try {
    localStorage.setItem(THEME_KEY, id);
  } catch {
    // Private mode, or storage full. The theme still applies for this visit.
  }
  for (const listener of listeners) listener();
}

export function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const theme = useSyncExternalStore(subscribe, readTheme, serverTheme);
  const panelRef = useRef<HTMLDivElement>(null);

  // Pressing anywhere else, or Escape, puts it away.
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

  const active = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  return (
    <div
      ref={panelRef}
      // Desktop only: a phone screen has no corner to spare, and the tab bars
      // in the editor and the tracker already live down there.
      className="fixed right-6 bottom-6 z-50 hidden print:hidden md:block"
    >
      {open && (
        <div
          role="dialog"
          aria-label="Colour theme"
          className="mb-3 w-[268px] overflow-hidden rounded-2xl bg-panel shadow-[0_18px_48px_rgba(15,23,42,0.22)] ring-1 ring-black/10"
        >
          <div className="flex items-center gap-2 border-b border-black/5 px-4 py-3">
            <span className="text-[13.5px] font-extrabold text-ink">
              Colour theme
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
            {THEMES.map((t) => {
              const on = t.id === theme;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => applyTheme(t.id)}
                  aria-pressed={on}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
                    on ? "bg-brand-soft" : "hover:bg-black/[0.04]",
                  )}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10"
                    aria-hidden="true"
                  >
                    {t.swatch.map((colour) => (
                      <span
                        key={colour}
                        className="h-full flex-1"
                        style={{ background: colour }}
                      />
                    ))}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block text-[14px] font-bold",
                        on ? "text-brand" : "text-ink",
                      )}
                    >
                      {t.name}
                    </span>
                    <span className="block truncate text-[12px] text-ink-soft">
                      {t.note}
                    </span>
                  </span>

                  {on && <CheckIcon className="h-4 w-4 shrink-0 text-brand" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`Colour theme: ${active.name}`}
        className="ml-auto flex h-12 items-center gap-2.5 rounded-full bg-panel pr-4 pl-3 shadow-[0_10px_30px_rgba(15,23,42,0.18)] ring-1 ring-black/10 transition hover:-translate-y-0.5"
      >
        <span
          className="flex h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10"
          aria-hidden="true"
        >
          {active.swatch.map((colour) => (
            <span
              key={colour}
              className="h-full flex-1"
              style={{ background: colour }}
            />
          ))}
        </span>
        <span className="text-[13.5px] font-bold text-ink">{active.name}</span>
        <DesignIcon className="h-[18px] w-[18px] text-ink-faint" />
      </button>
    </div>
  );
}
