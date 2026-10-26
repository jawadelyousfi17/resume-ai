import Image from "next/image";

import { eyebrow, h2, sectionGap, shell } from "./ui";

const STEPS = [
  {
    title: "Pick a template",
    line: "Switch any time.",
    image: "/images/landing/step-template-v3.png",
  },
  {
    title: "Write with AI",
    line: "Or import what you have.",
    image: "/images/landing/step-writing-v3.png",
  },
  {
    title: "Download",
    line: "A clean PDF, no watermark.",
    image: "/images/landing/step-download-v3.png",
  },
];

export function HowItWorks() {
  return (
    <section className={`${shell} ${sectionGap}`}>
      <div className="text-center">
        <p className={eyebrow}>How it works</p>
        <h2 className={`${h2} mt-3`}>Three steps to a finished page</h2>
      </div>

      <ol className="mt-10 grid gap-5 md:grid-cols-3 lg:mt-12 lg:gap-6">
        {STEPS.map(({ title, line, image }, i) => (
          <li
            key={title}
            className="overflow-hidden rounded-[18px] bg-panel ring-1 ring-divider"
          >
            {/* Decorative: the step is named below it. */}
            <div
              aria-hidden="true"
              className="flex h-[260px] items-center justify-center overflow-hidden border-b border-divider bg-panel p-6"
            >
              <Image
                src={image}
                alt=""
                width={1280}
                height={1280}
                sizes="212px"
                className="h-full w-auto max-w-full object-contain"
              />
            </div>
            <div className="flex items-start gap-3 p-5 lg:p-6">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-[12.5px] font-semibold text-white tabular-nums">
                {i + 1}
              </span>
              <div>
                <h3 className="text-[17px] font-bold tracking-tight text-ink">
                  {title}
                </h3>
                <p className="mt-0.5 text-[14.5px] text-ink-soft">{line}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
