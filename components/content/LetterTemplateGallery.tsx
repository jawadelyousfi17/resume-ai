"use client";

// The gallery on /cover-letter/templates: a filter row, a search box and the
// grid. The resume gallery, pointed at the letter descriptors — filtering
// happens in the browser over a list known at build time, which keeps the page
// static and instant.

import { useMemo, useState } from "react";

import { LetterTemplateCard } from "@/components/content/LetterTemplateCard";
import { SearchIcon } from "@/components/ui/icons";
import {
  LETTER_CATEGORIES,
  LETTER_TEMPLATES,
  inLetterCategory,
  type LetterCategory,
} from "@/lib/letter-templates";
import { cn } from "@/lib/utils";

export function LetterTemplateGallery() {
  const [category, setCategory] = useState<LetterCategory | "all">("all");
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LETTER_TEMPLATES.filter(
      (t) =>
        (category === "all" || inLetterCategory(t, category)) &&
        (!q ||
          t.name.toLowerCase().includes(q) ||
          t.short.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)),
    );
  }, [category, query]);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        LETTER_CATEGORIES.map((c) => [
          c.id,
          LETTER_TEMPLATES.filter((t) => inLetterCategory(t, c.id)).length,
        ]),
      ) as Record<LetterCategory, number>,
    [],
  );

  return (
    <>
      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        {/* A row of nine filters wraps into three lines on a phone and pushes
            the designs off the screen — so there it scrolls instead. */}
        <div className="scroll-slim -mx-3 flex min-w-0 gap-2.5 overflow-x-auto px-3 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
          <FilterButton
            active={category === "all"}
            count={LETTER_TEMPLATES.length}
            onClick={() => setCategory("all")}
          >
            All
          </FilterButton>
          {LETTER_CATEGORIES.map((c) => (
            <FilterButton
              key={c.id}
              active={category === c.id}
              count={counts[c.id]}
              onClick={() => setCategory(c.id)}
            >
              {c.label}
            </FilterButton>
          ))}
        </div>

        <label className="relative block w-full lg:w-[280px] lg:shrink-0">
          <span className="sr-only">Search cover letter templates</span>
          <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates"
            className="h-12 w-full rounded-xl border-2 border-black/10 bg-panel pr-4 pl-11 text-[15px] font-bold text-ink outline-none transition placeholder:font-medium placeholder:text-ink-faint focus:border-brand/50"
          />
        </label>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((template) => (
          <LetterTemplateCard key={template.id} template={template} />
        ))}
      </div>

      {shown.length === 0 && (
        <p className="mt-8 text-[15px] font-bold text-ink-soft">
          No template matches “{query.trim()}”.{" "}
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            className="text-brand underline underline-offset-4"
          >
            Show all templates
          </button>
        </p>
      )}
    </>
  );
}

function FilterButton({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean;
  count: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-12 shrink-0 items-center gap-2 rounded-xl border-2 px-5 text-[15px] font-bold transition",
        active
          ? "border-transparent bg-navy text-white"
          : "border-black/10 bg-panel text-ink hover:border-ink/30",
      )}
    >
      {children}
      <span
        className={cn(
          "text-[13px] font-bold",
          active ? "text-white/55" : "text-ink-faint",
        )}
      >
        {count}
      </span>
    </button>
  );
}
