import Link from "next/link";

import { FaqAccordion } from "@/components/content/ContentShell";
import { LANDING_FAQS } from "@/lib/content/faq";

import { ArrowRight, eyebrow, h2, sectionGap, shell } from "./ui";

// The landing page shows the questions people ask before signing up; /faq has
// the full set, so this reads from the same source rather than a second copy.

export function Faq() {
  return (
    <section className={`${shell} ${sectionGap}`}>
      <div className="mx-auto max-w-5xl">
        <p className={eyebrow}>FAQ</p>
        <h2 className={`${h2} mt-3`}>Questions, answered</h2>

        <FaqAccordion entries={LANDING_FAQS} className="mt-8 md:mt-12" />

        <Link
          href="/faq"
          className="mt-8 inline-flex items-center gap-1.5 text-[15px] font-semibold text-brand transition hover:text-accent-2"
        >
          All questions
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
