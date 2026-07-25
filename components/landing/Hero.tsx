import Link from "next/link";

import { HeroDemo } from "./HeroDemo";
import { Avatar } from "./marks";
import { btnHero, shell } from "./ui";

const FACES = [
  "Priya Nair",
  "Tomas Ruiz",
  "Ada Chen",
  "Jonas Weber",
  "Maya Okafor",
];

export function Hero() {
  return (
    <section className={`${shell} pt-8 lg:pt-14`}>
      <div className="grid grid-cols-1 items-start gap-y-16 md:grid-cols-[55%_45%] lg:grid-cols-[57%_43%]">
        {/* The paper leads on mobile and sits to the right on desktop. */}
        <div className="flex justify-center md:order-2">
          <HeroDemo />
        </div>

        {/* Copy */}
        <div className="md:pr-6 lg:pr-10">
          <h1 className="text-[15px] font-bold tracking-tight text-ink-soft uppercase lg:text-lg">
            Free online resume builder
          </h1>

          <h2 className="mt-3 text-[40px] leading-[1.04] font-black tracking-[-0.035em] text-ink sm:text-[52px] lg:mt-4 lg:text-[62px] xl:text-[72px]">
            Build a job-winning resume for&nbsp;free
          </h2>

          <p className="mt-5 max-w-[500px] text-[17px] leading-[1.7] text-ink-soft lg:mt-6 lg:text-[20px] lg:leading-[1.75]">
            Your first resume is 100% free forever. Unlimited downloads. No
            hidden fees.
            <span className="block">Yes, really 🚀</span>
          </p>

          <Link href="/dashboard" className={`${btnHero} mt-8 lg:mt-10`}>
            Get started for free ✨
          </Link>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5 lg:mt-12">
            <span className="flex -space-x-2.5">
              {FACES.map((name, i) => (
                <Avatar
                  key={name}
                  name={name}
                  seed={i}
                  className="h-11 w-11 text-[13px] ring-4 ring-cream"
                />
              ))}
            </span>
            <p className="text-[15px] font-bold text-ink lg:text-[17px]">
              Trusted by 100k+ job seekers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
