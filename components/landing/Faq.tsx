import Link from "next/link";

import { FaqAccordion } from "@/components/content/ContentShell";
import { LANDING_FAQS } from "@/lib/content/faq";

import { h2, sectionGap, shell } from "./ui";

// The landing page shows the questions people ask before signing up; /faq has
// the full set, so this reads from the same source rather than a second copy.

export function Faq() {
  return (
    <section className={`${shell} ${sectionGap}`}>
      <div className="mx-auto max-w-5xl">
        <h2 className={h2}>Frequently asked questions</h2>

        <FaqAccordion entries={LANDING_FAQS} className="mt-8 md:mt-12" />

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
