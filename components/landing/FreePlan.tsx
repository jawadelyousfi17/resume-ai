import Image from "next/image";

import { TEMPLATES } from "@/lib/templates";

import { h2, lede, sectionGap, shell } from "./ui";

const ITEMS = [
  {
    art: "/images/landing/free-forever.png",
    title: "Your first resume is free forever",
    copy: "Create, edit and save one resume free for life. No trial, no credit card, no automatic upgrade.",
  },
  {
    art: "/images/landing/free-nobrand.png",
    title: "Just you on your resume",
    copy: "We never brand what you send out. No logo, no watermark — the page is entirely yours.",
  },
  {
    art: "/images/landing/free-downloads.png",
    title: "Unlimited PDF downloads",
    copy: "Update and re-export as often as you like. Take the LaTeX source with you too, if you want it.",
  },
  {
    art: "/images/landing/free-templates.png",
    title: `All ${TEMPLATES.length} templates, customizable`,
    copy: "ATS-friendly layouts you can bend: type, spacing, margins, colour and heading style are all yours.",
  },
  {
    art: "/images/landing/free-import.png",
    title: "Import or start from scratch",
    copy: "Bring in an existing resume and keep the content, or open a blank page and let the editor guide you.",
  },
  {
    art: "/images/landing/free-ai.png",
    title: "AI that writes with you",
    copy: "Rewrite bullets, fix tone and match keywords in place — you approve every change before it lands.",
  },
];

export function FreePlan() {
  return (
    <section className={`${shell} ${sectionGap}`}>
      <h2 className={h2}>What&apos;s included in the free plan</h2>
      <p className={lede}>
        You won&apos;t find a more generous free tier among resume builders.
        Here&apos;s what you get without paying anything.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:mt-16 lg:gap-14 xl:grid-cols-3">
        {ITEMS.map(({ art, title, copy }) => (
          <div key={title} className="flex flex-col items-start">
            {/* No frame: these aren't cards, and the artwork is drawn on white
                for a page that is white. `mix-blend-multiply` is what keeps it
                that way — the export's ground is a shade off pure white, which
                on this surface would otherwise read as a faint slab. */}
            <Image
              src={art}
              alt=""
              width={1672}
              height={941}
              sizes="(min-width: 1280px) 380px, (min-width: 768px) 45vw, 90vw"
              // See next.config.ts — 75 lands the white ground on 254.
              quality={95}
              className="w-full max-w-[420px] mix-blend-multiply"
            />
            <h3 className="mt-4 text-xl font-bold tracking-tight text-ink">
              {title}
            </h3>
            <p className="mt-2 max-w-[420px] text-[15px] leading-[1.65] text-ink-soft">
              {copy}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
