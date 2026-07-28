// About, privacy and terms all read the same way — a title, a date, and
// sections of plain prose — so they're drawn by one component and written in
// lib/content/legal.ts.

import {
  Column,
  ContentPage,
  PageHeader,
} from "@/components/content/ContentShell";
import type { LegalPage } from "@/lib/content/legal";

export function LegalArticle({ page }: { page: LegalPage }) {
  return (
    <ContentPage>
      <Column>
        <PageHeader
          title={page.title}
          intro={page.intro}
          updated={page.updated}
        />

        <article className="mt-10 max-w-[72ch] space-y-10">
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
                {section.heading}
              </h2>
              {section.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mt-4 text-[16px] leading-[1.75] text-ink-soft"
                >
                  {paragraph}
                </p>
              ))}
              {section.list && (
                <ul className="mt-4 space-y-2">
                  {section.list.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-[16px] leading-[1.7] text-ink-soft"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </Column>
    </ContentPage>
  );
}
