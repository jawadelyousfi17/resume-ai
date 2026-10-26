import Image from "next/image";
import Link from "next/link";

import { shell, tag } from "./ui";

// The brown band: what meniacv is, in one long sentence that fades halfway
// through, then the number and the button. The only dark surface on the page
// before the footer, so it reads as the turn from "what it does" to "who
// uses it".
export function About() {
  return (
    <section className="mt-20 bg-lp-brown py-16 text-white lg:mt-28 lg:py-24">
      <div className={shell}>
        <span className={tag("pink")}>{"// About Us //"}</span>
        <h2 className="mt-5 max-w-[760px] text-[22px] leading-[1.35] font-medium tracking-[-0.01em] sm:text-[26px] lg:text-[30px]">
          meniacv is a resume builder for people who would rather be applying.{" "}
          <span className="text-white/55">
            Pick a template, write with AI, check it against the job, and
            download a clean PDF — your first resume is free, forever, with no
            watermark on it.
          </span>
        </h2>

        <div className="mt-14 flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between lg:mt-20">
          <div className="h-[120px] w-[120px] shrink-0 rounded-[14px] bg-white/10 p-2 lg:h-[140px] lg:w-[140px]">
            <Image
              src="/images/landing/feature-templates.png"
              alt=""
              width={1280}
              height={1280}
              sizes="140px"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="max-w-[320px]">
            <h3 className="font-editorial text-[40px] leading-none font-normal tracking-[-0.02em] lg:text-[48px]">
              100k+ Resumes
            </h3>
            <p className="mt-4 text-[14px] leading-[1.55] text-white/70">
              Built by job seekers in more than forty languages, and sent to
              companies large and small.
            </p>
            <Link
              href="/dashboard"
              className="mt-6 inline-flex h-11 items-center rounded-full bg-white px-7 text-[14.5px] font-semibold text-ink transition hover:-translate-y-0.5"
            >
              Get Started — For Free!
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
