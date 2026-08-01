import Link from "next/link";

import { TemplateThumb } from "@/components/content/TemplateCard";
import { TEMPLATES } from "@/lib/templates";

import { TemplateFan } from "./TemplateFan";
import { h2, lede, sectionGap, shell } from "./ui";

// The pages in the carousel.
//
// Screenshots, not live renders. Twenty live ones would have meant twenty
// passes of the template engine on every request to the landing page, and the
// same picture the gallery already shows is sitting in public/templates. The
// pill's link carries the rest of the library.
const FAN = TEMPLATES.slice(0, 20);

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
            <TemplateThumb
              key={t.id}
              template={t}
              className="w-[168px] sm:w-[240px] lg:w-[300px]"
            />
          ))}
        </TemplateFan>
      </div>
    </section>
  );
}
