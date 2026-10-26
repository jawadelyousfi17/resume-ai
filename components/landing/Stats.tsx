import { TEMPLATES } from "@/lib/templates";

import { shell } from "./ui";

// Three numbers in pale tiles, set in the headline serif. Only numbers the
// rest of the site already states — nothing here is a new claim.
const STATS = [
  { value: "100k+", label: "Resumes built" },
  { value: String(TEMPLATES.length), label: "Free templates" },
  { value: "40+", label: "Languages supported" },
];

export function Stats() {
  return (
    <section className={`${shell} mt-12 lg:mt-14`}>
      <dl className="mx-auto grid max-w-[1000px] gap-[15px] sm:grid-cols-3">
        {STATS.map(({ value, label }) => (
          <div
            key={label}
            className="flex flex-col-reverse items-center rounded-[13px] bg-canvas px-6 py-9 text-center"
          >
            <dt className="mt-3 text-[12px] tracking-[0.04em] text-ink-soft uppercase">
              {label}
            </dt>
            <dd className="font-editorial text-[44px] leading-none font-normal tracking-[-0.02em] text-ink lg:text-[52px]">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
