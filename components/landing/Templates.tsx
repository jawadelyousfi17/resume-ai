import Link from "next/link";

import { TEMPLATES } from "@/lib/templates";

import { ResumePaper } from "./ResumePaper";
import { TemplateFan } from "./TemplateFan";
import { sampleWithTemplate } from "./sample-resume";
import { h2, lede, sectionGap, shell } from "./ui";

// The pages in the carousel. Each one is a full render, so keep the count
// modest — the pill's link carries the rest of the library.
const FAN = TEMPLATES.slice(0, 10);

export function Templates() {
  return (
    <section className={sectionGap}>
      <div className={`${shell} text-center`}>
        {/* Built as one string: JSX drops the space between an expression and
            the text that follows it when the line wraps. */}
        <h2 className={h2}>
          {`Choose from ${TEMPLATES.length} resume templates`}
        </h2>
        <p className={`${lede} mx-auto`}>
          Every one is ATS-friendly and fully customizable — same content, a
          different look in a click.{" "}
          <Link href="/resume-templates" className="underline">
            Browse all templates
          </Link>
          .
        </p>
      </div>

      {/* A plain row of real pages, running the full width of the window:
          arrows step it one card at a time, and it can be swiped or dragged
          like any other horizontally scrolling row. */}
      <div className="mt-10 lg:mt-12">
        <TemplateFan total={TEMPLATES.length} names={FAN.map((t) => t.name)}>
          {FAN.map((t) => (
            <ResumePaper
              key={t.id}
              data={sampleWithTemplate(t.id)}
              size="fan"
              className="shadow-[var(--shadow-paper)] ring-1 ring-black/5"
            />
          ))}
        </TemplateFan>
      </div>
    </section>
  );
}
