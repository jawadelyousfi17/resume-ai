import Image from "next/image";

import { TEMPLATES } from "@/lib/templates";

import { h2, lede, sectionGap, shell } from "./ui";

// Four steps, two by two, each beside a picture of what it does. The
// illustrations replaced an icon tile per card: four paragraphs in a row is a
// wall of text, and a picture is what tells them apart before any of it is
// read. Same set as the example cards on /resume-examples — same palette, same
// flat vector style — so the site reads as one thing.
const STEPS = [
  {
    art: "/images/landing/step-template.png",
    title: "Choose a template",
    copy: `Pick one of ${TEMPLATES.length} professionally designed templates — or bend any of them until it's yours. Switching later never touches your content.`,
  },
  {
    art: "/images/landing/step-experience.png",
    title: "Add your experience",
    copy: "Fill in your resume with guidance at every field. Import an existing PDF or DOCX to start with everything already in place.",
  },
  {
    art: "/images/landing/step-customize.png",
    title: "Customize layout & design",
    copy: "Adjust type, spacing, margins and colour until the page feels like you. Full control, with the formatting kept safe underneath.",
  },
  {
    art: "/images/landing/step-download.png",
    title: "Download unlimited PDFs",
    copy: "Your draft saves automatically. Export a clean, text-based PDF — or the LaTeX source — as often as you need, watermark-free.",
  },
];

export function HowItWorks() {
  return (
    <section className={`${shell} ${sectionGap}`}>
      <h2 className={h2}>Create a professional resume in minutes</h2>
      <p className={lede}>
        meniacv makes it easy to write and edit your resume. Here&apos;s how it
        works:
      </p>

      {/* Two by two rather than four across, and no boxes.
          Four columns meant four narrow ones: art the size of a stamp over a
          paragraph broken across six lines. Paired up, each step gets a picture
          worth looking at and a full measure of type beside it, and the set
          still takes one screenful rather than a scroll each — "in minutes" is
          a hard thing to claim underneath a timeline. The cards are gone with
          the columns: on a white page a ring around each step was drawing four
          boxes to hold up four sentences.

          Still an <ol>, because the order is real. The numerals are the marker
          for it rather than decoration over it. */}
      <ol className="mt-10 grid gap-x-10 gap-y-11 sm:grid-cols-2 lg:mt-14 lg:gap-x-14 lg:gap-y-14">
        {STEPS.map(({ art, title, copy }, i) => (
          // Stacked on a phone: side by side there, the copy is left with about
          // twenty characters a line and runs to nine of them.
          <li
            key={title}
            className="flex flex-col items-start gap-3 sm:flex-row sm:gap-5 lg:gap-6"
          >
            {/* Decorative: the step is written out beside it, so alt text
                would only say it twice. */}
            <Image
              src={art}
              alt=""
              width={1672}
              height={941}
              sizes="(min-width: 1024px) 260px, (min-width: 640px) 26vw, 40vw"
              // See next.config.ts — 75 lands the white ground on 254.
              quality={95}
              className="w-[170px] shrink-0 mix-blend-multiply sm:w-[38%] sm:max-w-[240px]"
            />

            <div className="min-w-0 pt-1">
              <span className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-[13px] font-black text-white"
                >
                  {i + 1}
                </span>
                <h3 className="text-[19px] leading-tight font-extrabold tracking-tight text-ink lg:text-[21px]">
                  {title}
                </h3>
              </span>
              <p className="mt-3 text-[15px] leading-[1.7] text-ink-soft lg:text-[16px]">
                {copy}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
