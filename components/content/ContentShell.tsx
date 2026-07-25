// Shared furniture for every written page: the marketing nav and footer, a
// reading-width column, and the pieces the guides and FAQ both use.

import Link from "next/link";

import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteNav } from "@/components/landing/SiteNav";
import { Eyebrow, btnPrimary, panel } from "@/components/landing/ui";
import { cn } from "@/lib/utils";
import type { FaqEntry } from "@/lib/content/guides";

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
      <main className="px-5 pt-6 pb-16 sm:px-8">{children}</main>
      <SiteFooter />
    </div>
  );
}

/** The reading column — narrower than the landing page's full-width sections. */
export function Column({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[760px]", className)}>
      {children}
    </div>
  );
}

export function Breadcrumbs({
  trail,
}: {
  trail: { label: string; href?: string }[];
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1.5 text-[13px] font-semibold text-ink-faint"
    >
      {trail.map((crumb, i) => (
        <span key={crumb.label} className="flex items-center gap-1.5">
          {i > 0 && <span aria-hidden="true">/</span>}
          {crumb.href ? (
            <Link href={crumb.href} className="transition hover:text-ink">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-ink-soft">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  updated,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  updated?: string;
}) {
  return (
    <header className="mt-6">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-4 text-[34px] leading-[1.12] font-extrabold tracking-tight text-ink sm:text-[42px]">
        {title}
      </h1>
      <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">{intro}</p>
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
}: {
  entries: FaqEntry[];
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <dl className="mt-5 space-y-3">
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

/** Closing call to action, identical across the written pages. */
export function ContentCta({
  heading = "Build it in the editor",
  body = "Live preview, AI writing help, and an ATS-ready PDF. No account needed to start.",
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
