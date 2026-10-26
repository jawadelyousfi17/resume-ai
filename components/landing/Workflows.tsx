import Image from "next/image";
import Link from "next/link";

import { CheckIcon } from "@/components/ui/icons";
import { TEMPLATES } from "@/lib/templates";

import { Avatar } from "./marks";
import { ArrowRight, FLOAT, h2, sectionGap, shell, tag } from "./ui";

// Two broad pale panels, copy on one side and a layered picture on the other,
// swapping sides between them — the reference's feature rhythm. Each picture
// is drawn from the product's own pieces (a real page, the paper
// illustrations, a review's bars) and is decorative: the copy says it all.

function Panel({
  label,
  tone,
  title,
  copy,
  href,
  art,
  reverse = false,
}: {
  label: string;
  tone: "coral" | "blue";
  title: React.ReactNode;
  copy: string;
  href: string;
  art: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <article className="grid items-center gap-10 rounded-[28px] bg-canvas px-6 py-12 sm:px-10 md:grid-cols-2 md:gap-12 lg:rounded-[35px] lg:px-20 lg:py-16">
      <div className={reverse ? "md:order-2" : undefined}>
        <span className={tag(tone)}>{label}</span>
        <h3 className="mt-5 font-editorial text-[34px] leading-[1.1] font-normal tracking-[-0.025em] text-ink lg:text-[46px]">
          {title}
        </h3>
        <p className="mt-5 max-w-[345px] text-[15px] leading-[1.55] text-ink-soft">
          {copy}
        </p>
        <Link
          href={href}
          className="mt-6 inline-flex items-center gap-2 border-b border-ink pb-0.5 text-[14px] font-medium text-ink transition hover:gap-3"
        >
          Learn More
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div
        aria-hidden="true"
        inert
        className={`relative mx-auto h-[380px] w-full max-w-[420px] select-none lg:h-[420px] ${reverse ? "md:order-1" : ""}`}
      >
        {art}
      </div>
    </article>
  );
}

/** AI writing: a page, the pencil, the options it offers, and the result. */
function WritingArt() {
  return (
    <>
      <div className="absolute top-[6%] left-[24%] h-[330px] w-[210px] overflow-hidden rounded-[22px] bg-white ring-1 ring-divider lg:h-[360px] lg:w-[230px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/templates/${TEMPLATES[1].id}.png`}
          alt=""
          loading="lazy"
          className="w-full"
        />
      </div>

      <span
        className={`absolute top-0 left-[14%] flex items-center gap-2 rounded-full bg-lp-coral py-1.5 pr-3.5 pl-1.5 text-[12px] font-medium text-ink ${FLOAT}`}
      >
        <span className="grid h-5 w-5 place-items-center rounded-full bg-white">
          <ArrowRight className="h-3 w-3 -rotate-45" />
        </span>
        Stronger bullets
      </span>

      <div
        className={`absolute top-[18%] right-0 h-[120px] w-[120px] rounded-[20px] bg-lp-blue ${FLOAT}`}
      >
        <Image
          src="/images/landing/feature-ai-writing.png"
          alt=""
          width={1254}
          height={1254}
          sizes="120px"
          className="h-full w-full object-contain p-2"
        />
      </div>

      <div className="absolute top-[46%] left-0 flex flex-col gap-2">
        {[
          ["Rewrite summary", false],
          ["Fix the tone", true],
        ].map(([label, on]) => (
          <span
            key={label as string}
            className={`flex items-center gap-2 rounded-full bg-white py-1.5 pr-3.5 pl-1.5 text-[12px] text-ink ring-1 ring-divider ${FLOAT}`}
          >
            <span
              className={`grid h-4 w-4 place-items-center rounded-[4px] ${
                on ? "bg-lp-accent text-white" : "ring-1 ring-divider"
              }`}
            >
              {on && <CheckIcon className="h-3 w-3" strokeWidth={3} />}
            </span>
            {label}
          </span>
        ))}
      </div>

      <div
        className={`absolute right-[4%] bottom-0 flex items-center gap-2.5 rounded-[16px] bg-white p-2.5 pr-4 ring-1 ring-divider ${FLOAT}`}
      >
        <Avatar name="Priya Nair" className="h-9 w-9 rounded-[10px]" />
        <div>
          <strong className="block text-[12.5px] font-semibold text-ink">
            Need a sharper bullet?
          </strong>
          <span className="text-[11px] text-ink-soft">Rewritten in one click</span>
        </div>
      </div>
    </>
  );
}

/** Review and tailor: a page with its score, the bars, the matched posting. */
function ReviewArt() {
  return (
    <>
      <div className="absolute top-0 left-0 h-[340px] w-[220px] overflow-hidden rounded-[22px] bg-white ring-1 ring-divider lg:h-[370px] lg:w-[240px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/templates/${TEMPLATES[2].id}.png`}
          alt=""
          loading="lazy"
          className="w-full"
        />
        <span className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-white py-1 pr-2.5 pl-1 text-[11px] font-semibold text-ink ring-1 ring-divider">
          <b className="rounded-[4px] bg-lp-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
            92
          </b>
          ATS score
        </span>
        <div className="absolute inset-x-3 bottom-3">
          <span className="text-[11px] font-semibold text-ink">
            Similar templates
          </span>
          <div className="mt-1.5 flex gap-1.5">
            {TEMPLATES.slice(3, 6).map((t) => (
              <span
                key={t.id}
                className="flex items-center gap-1 rounded-[8px] bg-white p-1 pr-2 text-[10px] text-ink ring-1 ring-divider"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/templates/${t.id}.png`}
                  alt=""
                  loading="lazy"
                  className="w-4 ring-1 ring-divider"
                />
                {t.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <span
        className={`absolute top-[2%] right-[2%] hidden items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] text-ink ring-1 ring-divider sm:flex ${FLOAT}`}
      >
        <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-lp-accent text-white">
          <CheckIcon className="h-2.5 w-2.5" strokeWidth={3} />
        </span>
        Matched to the posting
      </span>

      <div
        className={`absolute top-[16%] right-0 w-[170px] rounded-[16px] bg-white p-3 ring-1 ring-divider ${FLOAT}`}
      >
        <Image
          src="/images/landing/feature-resume-review.png"
          alt=""
          width={1280}
          height={1280}
          sizes="150px"
          className="mx-auto h-[96px] w-auto object-contain"
        />
        <div className="mt-2 space-y-1.5">
          {[
            ["Impact", 90, "bg-lp-mint"],
            ["Clarity", 84, "bg-lp-pink"],
            ["Keywords", 78, "bg-lp-blue"],
          ].map(([label, v, bg]) => (
            <div
              key={label as string}
              className="relative flex justify-between overflow-hidden rounded-[6px] bg-canvas px-2 py-1 text-[10.5px] text-ink"
            >
              <span
                className={`absolute inset-y-0 left-0 ${bg}`}
                style={{ width: `${v}%` }}
              />
              <span className="relative">{label}</span>
              <b className="relative font-semibold tabular-nums">{v}%</b>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function Workflows() {
  return (
    <section className={`${shell} ${sectionGap}`}>
      <div className="mx-auto max-w-[640px] text-center">
        <h2 className={h2}>Everything a resume needs</h2>
        <p className="mt-4 text-[16px] leading-[1.6] text-ink-soft">
          Write it, check it, and tailor it to the job — from a blank page to
          ready to send.
        </p>
      </div>

      <div className="mt-12 space-y-6 lg:mt-16">
        <Panel
          label="AI Writing"
          tone="coral"
          title={
            <>
              Write with AI,
              <br />
              approve every word
            </>
          }
          copy="Turn a duty into a result, tighten a summary, fix the tone. The AI suggests; nothing lands on your resume until you accept it."
          href="/ai-resume-builder"
          art={<WritingArt />}
        />
        <Panel
          label="Review & Tailor"
          tone="blue"
          title={
            <>
              Review it, then
              <br />
              tailor it to the job
            </>
          }
          copy="A score by area and the fixes that matter most. Paste a posting to see the match and the keywords you're missing."
          href="/resume-review"
          art={<ReviewArt />}
          reverse
        />
      </div>
    </section>
  );
}
