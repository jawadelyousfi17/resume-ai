import Link from "next/link";

import { Avatar } from "./marks";
import { btnHero, shell } from "./ui";

// The page in the hero. Ledger is the one the editor opens on and the first in
// the library, so the hero shows what a new resume actually looks like rather
// than a composite of the product's chrome.
const HERO_TEMPLATE = "ledger";

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
      <div className="grid grid-cols-1 items-start gap-y-16 md:grid-cols-[42%_58%] lg:grid-cols-[38%_62%]">
        {/* The finished page, which is what someone is here for — the editor's
            chrome is a means to it, not the promise. A desktop thing only: on a
            phone it would be a postage stamp of a resume pushing the button off
            the screen, so the hero there is the words and the button, and the
            product is one tap away. */}
        <div className="hidden justify-center md:order-2 md:flex">
          {/* Decorative: the heading beside it already says what this is, and
              a screen reader announcing a sample resume's contents here would
              be reading somebody else's CV aloud. Square corners and a hairline
              edge, like every other sheet of paper on the site. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/templates/${HERO_TEMPLATE}.png`}
            alt=""
            aria-hidden="true"
            width={1588}
            height={2256}
            // Above the fold, so it is fetched at once rather than lazily —
            // this is the largest paint on the page.
            fetchPriority="high"
            decoding="async"
            className="w-full max-w-[400px] border border-black/[0.09] bg-white lg:max-w-[440px]"
          />
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
              {FACES.map((name) => (
                <Avatar
                  key={name}
                  name={name}
                  className="h-11 w-11 ring-4 ring-cream"
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
