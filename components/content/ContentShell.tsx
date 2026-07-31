// Shared furniture for every written page: the marketing nav and footer, a
// reading-width column, and the pieces the guides and FAQ both use.

import Link from "next/link";

import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteNav } from "@/components/landing/SiteNav";
import { btnPrimary, panel } from "@/components/landing/ui";
import { cn } from "@/lib/utils";
import type { FaqEntry } from "@/lib/content/guides";
import type { Crumb } from "@/lib/seo/schema";

/** Emits structured data. Search engines read this; nothing renders. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // The object is built from our own content, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ContentPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-cream">
      <SiteNav />
      {/* The gutters match the nav's, so a page's content lines up with the
          wordmark above it. */}
      <main className="px-5 pt-6 sm:px-8 lg:px-10">{children}</main>
      <SiteFooter />
    </div>
  );
}

/** The page column: the same width the nav, the footer and the landing page's
 *  sections use, so every page spans the site rather than a strip of it. */
export function Column({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-site", className)}>
      {children}
    </div>
  );
}

/** Running prose is held to a readable measure even where the page is wide. */
export const measure = "max-w-[68ch]";

/**
 * The visible trail, fed by the same `Crumb[]` that builds the page's
 * BreadcrumbList. The last crumb is the current page, so it renders as text
 * rather than a link that goes nowhere.
 *
 * The separators are decorative and hidden from screen readers, which get the
 * list structure and the `aria-current` instead.
 */
export function Breadcrumbs({
  trail,
  className,
}: {
  trail: Crumb[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("mt-2", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-semibold text-ink-faint">
        {trail.map((crumb, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-x-2">
              {i > 0 && (
                <span aria-hidden="true" className="text-ink-faint/50">
                  /
                </span>
              )}
              {last ? (
                <span aria-current="page" className="text-ink-soft">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.path}
                  className="transition hover:text-brand hover:underline hover:underline-offset-4"
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function PageHeader({
  title,
  intro,
  updated,
}: {
  title: string;
  intro: string;
  updated?: string;
}) {
  return (
    <header className="mt-6">
      <h1 className="max-w-[20ch] text-[34px] leading-[1.12] font-extrabold tracking-tight text-ink sm:text-[42px] lg:text-[48px]">
        {title}
      </h1>
      <p className="mt-4 max-w-[62ch] text-[17px] leading-relaxed text-ink-soft">
        {intro}
      </p>
      {updated && (
        <p className="mt-4 text-[13px] font-semibold text-ink-faint">
          Updated{" "}
          <time dateTime={updated}>
            {new Date(`${updated}T00:00:00Z`).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
              timeZone: "UTC",
            })}
          </time>
        </p>
      )}
    </header>
  );
}

/** A question-and-answer block, and the only place FAQ markup is written. */
export function FaqList({
  entries,
  headingLevel = "h3",
  className,
}: {
  entries: FaqEntry[];
  headingLevel?: "h2" | "h3";
  /** Override the two-column grid where the list sits somewhere narrow. */
  className?: string;
}) {
  const Heading = headingLevel;
  return (
    <dl className={cn("mt-5 grid gap-3 md:grid-cols-2", className)}>
      {entries.map((entry) => (
        <div key={entry.question} className={cn(panel, "px-6 py-5")}>
          <dt>
            <Heading className="text-[16.5px] font-extrabold text-ink">
              {entry.question}
            </Heading>
          </dt>
          <dd className="mt-2 text-[15px] leading-relaxed text-ink-soft">
            {entry.answer}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * The same questions as an accordion — the landing page's presentation, for
 * places where the answers are long enough that a wall of cards is worse than
 * a list you open one row at a time.
 *
 * <details> means it needs no client JavaScript, and the browser's own
 * find-in-page still opens the row it lands in.
 */
export function FaqAccordion({
  entries,
  className,
}: {
  entries: FaqEntry[];
  className?: string;
}) {
  return (
    <div className={cn("mt-8", className)}>
      {entries.map((entry) => (
        <details
          key={entry.question}
          className="group border-t-2 border-field-border last:border-b-2"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[16px] font-bold text-ink transition hover:opacity-70 [&::-webkit-details-marker]:hidden">
            {entry.question}
            <span className="relative h-6 w-6 shrink-0">
              <span className="absolute top-1/2 left-0 h-0.5 w-6 -translate-y-1/2 rounded-full bg-ink" />
              <span className="absolute top-0 left-1/2 h-6 w-0.5 -translate-x-1/2 rounded-full bg-ink transition-transform duration-200 group-open:rotate-90" />
            </span>
          </summary>
          <p className="-mt-1 pb-8 text-[15.5px] leading-relaxed text-ink-soft lg:pr-16">
            {entry.answer}
          </p>
        </details>
      ))}
    </div>
  );
}

/** Closing call to action, identical across the written pages. */
export function ContentCta({
  heading = "Build it in the editor",
  body = "Live preview, AI writing help, and an ATS-ready PDF. Free to start, and no card at any point.",
}: {
  heading?: string;
  body?: string;
}) {
  return (
    <section className={cn(panel, "mt-12 px-7 py-8 text-center")}>
      <h2 className="text-[22px] font-extrabold tracking-tight text-ink">
        {heading}
      </h2>
      <p className="mx-auto mt-2 max-w-[46ch] text-[15px] leading-relaxed text-ink-soft">
        {body}
      </p>
      <Link href="/dashboard" className={cn(btnPrimary, "mt-5")}>
        Start your resume
      </Link>
    </section>
  );
}
