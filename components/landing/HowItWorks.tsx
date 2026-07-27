import {
  DownloadIcon,
  GridIcon,
  PencilIcon,
  WandIcon,
} from "@/components/ui/icons";
import { TEMPLATES } from "@/lib/templates";
import { cn } from "@/lib/utils";

import { h2, lede, panel, sectionGap, shell } from "./ui";

// Four steps, read left to right. No mockups: the copy is the content, and an
// icon per step is enough to tell them apart at a glance.
const STEPS = [
  {
    Icon: GridIcon,
    title: "Choose a template",
    copy: `Pick one of ${TEMPLATES.length} professionally designed templates — or bend any of them until it's yours. Switching later never touches your content.`,
  },
  {
    Icon: PencilIcon,
    title: "Add your experience",
    copy: "Fill in your resume with guidance at every field. Import an existing PDF or DOCX to start with everything already in place.",
  },
  {
    Icon: WandIcon,
    title: "Customize layout & design",
    copy: "Adjust type, spacing, margins and colour until the page feels like you. Full control, with the formatting kept safe underneath.",
  },
  {
    Icon: DownloadIcon,
    title: "Download unlimited PDFs",
    copy: "Your draft saves automatically. Export a clean, text-based PDF — or the LaTeX source — as often as you need, watermark-free.",
  },
];

export function HowItWorks() {
  return (
    <section className={`${shell} ${sectionGap}`}>
      <h2 className={h2}>Create a professional resume in minutes</h2>
      <p className={lede}>
        maniacv makes it easy to write and edit your resume. Here&apos;s how it
        works:
      </p>

      {/* Four cards across rather than a rail down the page: the steps take a
          screenful together instead of a scroll each, and "in minutes" is a
          hard thing to claim underneath a timeline. Still an <ol>, because the
          order is real — the numbers are decoration over that, not the
          structure itself. */}
      <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-5">
        {STEPS.map(({ Icon, title, copy }, i) => (
          <li key={title} className={cn(panel, "relative overflow-hidden p-6")}>
            {/* The step number, as a watermark behind its own card. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-4 right-2 text-[86px] leading-none font-black tracking-tighter text-ink/[0.06] select-none"
            >
              {i + 1}
            </span>

            <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand">
              <Icon className="h-6 w-6" />
            </span>

            <h3 className="relative mt-5 text-[19px] leading-tight font-extrabold tracking-tight text-ink lg:text-[20px]">
              {title}
            </h3>
            <p className="relative mt-2.5 text-[15px] leading-[1.65] text-ink-soft">
              {copy}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
