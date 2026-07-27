import { DownloadDuotoneIcon, PrivateEyeIcon, TrophyIcon } from "./duotone";

import { sectionGap, shell } from "./ui";

const ITEMS = [
  { Icon: TrophyIcon, line1: "1st resume,", line2: "free forever" },
  {
    Icon: PrivateEyeIcon,
    line1: "Privacy-first,",
    line2: "your data stays yours",
  },
  { Icon: DownloadDuotoneIcon, line1: "Unlimited", line2: "PDF downloads" },
];

/** The three-up reassurance row directly under the hero. */
export function Highlights() {
  return (
    <section className={`${shell} ${sectionGap}`}>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6 lg:max-w-6xl">
        {ITEMS.map(({ Icon, line1, line2 }) => (
          <div
            key={line1}
            className="flex items-center gap-5 sm:flex-col sm:gap-4 sm:text-center"
          >
            <Icon className="h-14 w-14 shrink-0 text-navy sm:h-16 sm:w-16 lg:h-20 lg:w-20" />
            <p className="text-xl leading-tight font-bold tracking-tight text-ink sm:text-lg md:text-xl lg:text-2xl lg:leading-snug">
              {line1}
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              {line2}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
