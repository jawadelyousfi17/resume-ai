import Link from "next/link";

import { TEMPLATES } from "@/lib/templates";

import { ResumePaper } from "./ResumePaper";
import { sampleWithTemplate } from "./sample-resume";
import { btnQuiet, h2, lede, sectionGap, shell } from "./ui";

// The rail renders this list twice so the loop can wrap seamlessly, and each
// card is a full <ResumePreview> — so keep the count modest and let the button
// underneath carry the rest.
const SHOWN = TEMPLATES.slice(0, 6);

function Card({ id, name }: { id: (typeof SHOWN)[number]["id"]; name: string }) {
  return (
    <Link
      href="/resume-templates"
      className="group mx-3 block shrink-0 sm:mx-4"
      tabIndex={-1}
    >
      <ResumePaper
        data={sampleWithTemplate(id)}
        className="shadow-[var(--shadow-panel)] ring-1 ring-black/5 transition group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-paper)]"
      />
      <p className="mt-3 text-center text-[14px] font-bold text-ink">{name}</p>
    </Link>
  );
}

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
          Every one is ATS-friendly and fully customizable. These are real
          renders of the same document — not mockups.{" "}
          <Link href="/resume-templates" className="underline">
            Browse all templates
          </Link>
          .
        </p>
      </div>

      {/*
        The row drifts continuously leftwards, fading out at both edges, with
        two copies of the list making the wrap invisible. Hovering pauses it,
        and it can still be dragged by hand — which is also the fallback when
        the reader has asked for reduced motion.

        It's centred in the page column rather than run full-bleed, which also
        keeps the loop honest: a seamless marquee needs one copy of the list to
        be at least as wide as its container, and six cards (~1570px) clears
        1180px at every screen size. Full-bleed would tear open on a wide
        monitor.
      */}
      <div className={`${shell} mt-10 lg:mt-12`}>
        <div className="lp-rail-mask scroll-slim overflow-x-auto">
          <div className="lp-rail [--rail-duration:60s] hover:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex" aria-hidden={copy === 1}>
                {SHOWN.map((t) => (
                  <Card key={t.id} id={t.id} name={t.name} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-center lg:mt-12">
        <Link href="/resume-templates" className={btnQuiet}>
          All resume templates
        </Link>
      </div>
    </section>
  );
}
