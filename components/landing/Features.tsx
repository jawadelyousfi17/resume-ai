import Image from "next/image";
import { TEMPLATES } from "@/lib/templates";

import { eyebrow, h2, sectionGap, shell } from "./ui";

// Paper illustrations share the visual language of the three getting-started steps.
const FEATURES = [
  {
    image: "/images/landing/feature-templates.png",
    title: `${TEMPLATES.length} templates`,
    line: "ATS-friendly, and switching never touches your content.",
  },
  {
    image: "/images/landing/feature-ai-writing.png",
    title: "AI writing",
    line: "Rewrite a bullet or a summary — you approve every change.",
  },
  {
    image: "/images/landing/feature-resume-review.png",
    title: "Resume review",
    line: "A score by area, and what to fix first.",
  },
  {
    image: "/images/landing/feature-job-match.png",
    title: "Tailor to a job",
    line: "Paste a posting, see the match, close the gaps.",
  },
  {
    image: "/images/landing/feature-import.png",
    title: "Import",
    line: "Start from the PDF you already have.",
  },
  {
    image: "/images/landing/feature-pdf-download.png",
    title: "Clean PDFs",
    line: "Text-based, watermark-free, as often as you like.",
  },
];

export function Features() {
  return (
    <section className={`${shell} ${sectionGap}`}>
      <div className="max-w-2xl">
        <p className={eyebrow}>Features</p>
        <h2 className={`${h2} mt-3`}>Everything a resume needs</h2>
      </div>

      {/* Borders on the cells' right and bottom, and on the grid's top and
          left, so every hairline is drawn once whatever the column count. */}
      <div className="mt-10 grid border-t border-l border-divider sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
        {FEATURES.map(({ image, title, line }) => (
          <div
            key={title}
            className="border-r border-b border-divider p-6 lg:p-8"
          >
            <Image
              src={image}
              alt=""
              width={1280}
              height={1280}
              sizes="112px"
              className="h-28 w-28 object-contain"
            />
            <h3 className="mt-5 text-[17px] font-bold tracking-tight text-ink">
              {title}
            </h3>
            <p className="mt-1.5 text-[14.5px] leading-[1.55] text-ink-soft">
              {line}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
