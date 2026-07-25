import Link from "next/link";

import { ALL_FAQS } from "@/lib/content/faq";

import { h2, sectionGap, shell } from "./ui";

// The landing page shows the questions people ask before signing up; /faq has
// the full set, so this reads from the same source rather than a second copy.
const SHOWN = ALL_FAQS.slice(0, 8);

export function Faq() {
  return (
    <section className={`${shell} ${sectionGap}`}>
      <div className="mx-auto max-w-5xl">
        <h2 className={h2}>Frequently asked questions</h2>

        <div className="mt-8 md:mt-12">
          {SHOWN.map((entry) => (
            <details
              key={entry.question}
              // <details> means the accordion needs no client JavaScript, and
              // it still opens with the page's own find-in-page.
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

        <p className="mt-8 text-[15px] text-ink-soft">
          More questions are answered on the{" "}
          <Link href="/faq" className="font-bold text-ink underline">
            full FAQ
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
