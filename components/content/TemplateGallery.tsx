"use client";

// The gallery: a filter row and the grid. Used by /resume-templates and by
// every /templates/{filter} page, which is the same view with one of the
// filters already chosen.
//
// The filters are links rather than buttons. They used to be client state,
// which meant no cut of the catalogue had a URL, nothing could be linked to,
// and a crawler only ever saw the unfiltered grid. Navigating between them is
// a prefetched static page, so it costs about what setState did.
//
// Six filters here, not fourteen: this row sticks under the nav for the whole
// length of the page, and a bar carrying every cut of the catalogue is a menu
// rather than a filter. The rest are in the index under the grid, where
// there's room for a name and an icon.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { TemplateCard } from "@/components/content/TemplateCard";
import { btnCompact, btnQuiet } from "@/components/landing/ui";
import type { FilterChip } from "@/lib/content/template-filters";
import {
  TEMPLATES,
  type TemplateCategory,
  inCategory,
} from "@/lib/templates";
import { cn } from "@/lib/utils";

/** Templates per screenful. Two hundred and twenty-seven cards is two hundred
 *  and twenty-seven page renders in the browser and about as many image
 *  requests — enough to make the first scroll stutter on a phone. */
const PAGE = 24;

export function TemplateGallery({
  chips,
  /** The filter this page is showing, by slug. Absent on /resume-templates,
   *  where the whole catalogue is on show. */
  active,
  category,
}: {
  chips: FilterChip[];
  active?: string;
  category?: TemplateCategory;
}) {
  const shown = category
    ? TEMPLATES.filter((t) => inCategory(t, category))
    : TEMPLATES;

  const [limit, setLimit] = useState(PAGE);
  const remaining = shown.length - limit;

  // The six primary filters, plus whichever one this page is — landing on
  // /templates/creative with no chip for it in the row reads as broken.
  const row = chips.filter((c) => c.primary || c.slug === active);

  // On a phone the row scrolls, and the active chip can start off the right
  // edge of it. Scrolls the row rather than the page: `scrollIntoView` would
  // take the heading above it with it.
  const rowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = rowRef.current?.querySelector<HTMLElement>("[data-active]");
    if (el && rowRef.current) rowRef.current.scrollLeft = el.offsetLeft - 12;
  }, [active]);

  return (
    <>
      {/* Full-bleed within the page column so the cards passing underneath are
          covered rather than showing along its edges. Sits directly under the
          site nav, which is 76px tall and 96px from lg up. */}
      <div className="sticky top-[76px] z-20 -mx-5 mt-8 border-b border-black/[0.07] bg-panel/95 px-5 py-3 backdrop-blur-md sm:-mx-8 sm:px-8 lg:top-[96px] lg:-mx-10 lg:px-10">
        <div
          ref={rowRef}
          className="scroll-slim mx-auto flex w-full max-w-site gap-2 overflow-x-auto pb-0.5 sm:flex-wrap sm:overflow-visible sm:pb-0"
        >
          <FilterLink href="/resume-templates" active={!active} count={TEMPLATES.length}>
            All
          </FilterLink>
          {row.map((chip) => (
            <FilterLink
              key={chip.slug}
              href={`/templates/${chip.slug}`}
              active={chip.slug === active}
              count={chip.count}
            >
              {chip.label}
            </FilterLink>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.slice(0, limit).map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>

      {remaining > 0 && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => setLimit((n) => n + PAGE)}
            className={cn(btnQuiet, btnCompact)}
          >
            Load more templates
          </button>
          <p className="text-[13px] font-semibold text-ink-faint">
            Showing {limit} of {shown.length}
          </p>
        </div>
      )}
    </>
  );
}

function FilterLink({
  href,
  active,
  count,
  children,
}: {
  href: string;
  active: boolean;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      data-active={active ? "" : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-3.5 text-[13.5px] font-bold transition",
        active
          ? "border-transparent bg-navy text-white"
          : "border-black/10 bg-panel text-ink hover:border-ink/30",
      )}
    >
      {children}
      <span
        className={cn(
          "text-[12px] font-bold",
          active ? "text-white/55" : "text-ink-faint",
        )}
      >
        {count}
      </span>
    </Link>
  );
}
