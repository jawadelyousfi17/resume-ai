// Every filter, under the grid: the six in the sticky row plus the eight that
// don't fit in it. Server-rendered links — nothing here has state, and the
// copy behind each one stays out of the client bundle.

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
import { panelFlat } from "@/components/landing/ui";
import { filterChips } from "@/lib/content/template-filters";
import { cn } from "@/lib/utils";

/** One glyph per cut. Keyed by slug rather than carried in the filter itself,
 *  so lib/content stays free of components. */
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
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filterChips().map((chip) => {
          const Icon = ICONS[chip.slug];
          const current = chip.slug === active;
          return (
            <Link
              key={chip.slug}
              href={`/templates/${chip.slug}`}
              aria-current={current ? "page" : undefined}
              className={cn(
                panelFlat,
                "flex items-center gap-3 px-4 py-3.5 transition hover:ring-ink/15",
                current && "ring-2 ring-navy/25",
              )}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy/[0.06] text-navy">
                {Icon && <Icon className="h-[18px] w-[18px]" />}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[14.5px] font-extrabold text-ink">
                  {chip.label}
                </span>
                <span className="mt-0.5 block text-[12.5px] font-semibold text-ink-faint">
                  {chip.count} templates
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
