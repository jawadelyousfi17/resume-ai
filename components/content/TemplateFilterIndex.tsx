// Every filter, under the grid: the six in the sticky row plus the eight that
// don't fit in it. Server-rendered links — nothing here has state, and the
// copy behind each one stays out of the client bundle.

import Image from "next/image";
import Link from "next/link";

import {
  AlignIcon,
  BookIcon,
  BriefcaseIcon,
  BrushIcon,
  BuildingIcon,
  DocFileIcon,
  FileTextIcon,
  GoogleDocIcon,
  ImageIcon,
  LayoutIcon,
  MinusIcon,
  SidebarIcon,
  SparklesIcon,
  TargetIcon,
} from "@/components/ui/icons";
import { filterIcon } from "@/lib/content/filter-icons";
import { filterChips } from "@/lib/content/template-filters";
import { cn } from "@/lib/utils";

/** One glyph per cut, for any filter with no drawn icon yet. Keyed by slug
 *  rather than carried in the filter itself, so lib/content stays free of
 *  components. The chip row above the gallery uses these at 18px and keeps
 *  them — a raster icon that small is where it looks worst. */
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  simple: AlignIcon,
  word: DocFileIcon,
  creative: BrushIcon,
  "one-column": LayoutIcon,
  "one-page": FileTextIcon,
  picture: ImageIcon,
  professional: BriefcaseIcon,
  classic: BookIcon,
  corporate: BuildingIcon,
  minimalist: MinusIcon,
  modern: SparklesIcon,
  ats: TargetIcon,
  "two-column": SidebarIcon,
  "google-docs": GoogleDocIcon,
};

export function TemplateFilterIndex({
  /** The page's own filter, if it has one: it's still listed, but as the
   *  current page rather than somewhere to go. */
  active,
  heading = "Browse every filter",
}: {
  active?: string;
  heading?: string;
}) {
  return (
    <section className="mt-14">
      <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
        {heading}
      </h2>
      {/* Fourteen of these, so the row is the unit rather than the card: a
          hairline between neighbours instead of fourteen separate outlines,
          which at this size read as a sheet of buttons. Square, like the
          template cards — the rounded pills were the last thing on these pages
          still shaped like an app control. */}
      <div className="mt-6 grid gap-px overflow-hidden bg-black/[0.09] ring-1 ring-black/[0.09] sm:grid-cols-2 lg:grid-cols-3">
        {filterChips().map((chip) => {
          const Icon = ICONS[chip.slug];
          const icon = filterIcon(chip.slug);
          const current = chip.slug === active;
          return (
            <Link
              key={chip.slug}
              href={`/templates/${chip.slug}`}
              aria-current={current ? "page" : undefined}
              className={cn(
                "flex items-center gap-4 bg-panel px-5 py-5 transition hover:bg-black/[0.02]",
                current && "bg-brand-soft",
              )}
            >
              {/* The drawn icon needs no tile behind it — it is already a
                  square drawn on white, and a tint under it would fence off
                  the one part of the row that isn't type. The line glyph still
                  gets its tile, since a bare 18px stroke in a row this size
                  reads as a stray mark. */}
              {icon ? (
                <Image
                  src={icon}
                  alt=""
                  width={1254}
                  height={1254}
                  sizes="64px"
                  // See next.config.ts — 75 lands the white ground on 254.
                  quality={95}
                  className="h-14 w-14 shrink-0 mix-blend-multiply"
                />
              ) : (
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-navy/[0.06] text-navy">
                  {Icon && <Icon className="h-6 w-6" />}
                </span>
              )}
              <span className="min-w-0">
                <span className="block truncate text-[17px] leading-snug font-extrabold text-ink">
                  {chip.label}
                </span>
                <span className="mt-1 block text-[13.5px] font-semibold text-ink-faint">
                  {chip.count} templates
                </span>
              </span>
            </Link>
          );
        })}

        {/* Fourteen into three columns leaves one cell empty, and an empty cell
            in this construction is a grey block — the hairline colour showing
            through where no white row covers it. Filled with the same white as
            a row. Two columns divide evenly, so it only exists at `lg`. */}
        <span aria-hidden="true" className="hidden bg-panel lg:block" />
      </div>
    </section>
  );
}
