import { TEMPLATES } from "@/lib/templates";

import {
  DownloadDuotoneIcon,
  GalleryIcon,
  LayersIcon,
  PrivateEyeIcon,
  TrophyIcon,
  WandDuotoneIcon,
} from "./duotone";

import { h2, lede, sectionGap, shell } from "./ui";

const ITEMS = [
  {
    Icon: TrophyIcon,
    title: "Your first resume is free forever",
    copy: "Create, edit and save one resume free for life. No trial, no credit card, no automatic upgrade.",
  },
  {
    Icon: PrivateEyeIcon,
    title: "Just you on your resume",
    copy: "We never brand what you send out. No logo, no watermark — the page is entirely yours.",
  },
  {
    Icon: DownloadDuotoneIcon,
    title: "Unlimited PDF downloads",
    copy: "Update and re-export as often as you like. Take the LaTeX source with you too, if you want it.",
  },
  {
    Icon: GalleryIcon,
    title: `All ${TEMPLATES.length} templates, customizable`,
    copy: "ATS-friendly layouts you can bend: type, spacing, margins, colour and heading style are all yours.",
  },
  {
    Icon: LayersIcon,
    title: "Import or start from scratch",
    copy: "Bring in an existing resume and keep the content, or open a blank page and let the editor guide you.",
  },
  {
    Icon: WandDuotoneIcon,
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
        {ITEMS.map(({ Icon, title, copy }) => (
          <div key={title} className="flex flex-col items-start">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy md:h-12 md:w-12">
              <Icon className="h-6 w-6 text-cream md:h-7 md:w-7" />
            </span>
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
