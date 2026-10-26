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
        <span className={eyebrow}>{"// How It Works //"}</span>
        <h2 className={`${h2} mt-4`}>Three steps to a finished page</h2>
      </div>

      <ol className="mt-10 grid gap-5 md:grid-cols-3 lg:mt-12 lg:gap-6">
        {STEPS.map(({ title, line, image }, i) => (
          <li
            key={title}
            className="overflow-hidden rounded-[28px] bg-canvas"
          >
            {/* Decorative: the step is named below it. */}
            <div
              aria-hidden="true"
              className="flex h-[260px] items-center justify-center overflow-hidden p-8"
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
            <div className="px-7 pb-8">
              <span className="text-[12px] font-medium tracking-[0.06em] text-ink-soft tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-1.5 font-editorial text-[26px] leading-tight font-normal tracking-[-0.02em] text-ink">
                {title}
              </h3>
              <p className="mt-1 text-[15px] text-ink-soft">{line}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
