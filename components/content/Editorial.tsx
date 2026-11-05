// Building blocks for the browse pages — /guides, /resume-examples,
// /resume-templates and /templates/{filter} — in the landing page's look:
// a pale canvas hero, serif headlines, outlined eyebrows and pill buttons.

import Image from "next/image";
import Link from "next/link";

import {
  btnCompact,
  btnPrimary,
  btnQuiet,
  eyebrow,
  h2,
} from "@/components/landing/ui";
import { cn } from "@/lib/utils";

/** The head of a browse page: words on the left, a drawing on the right, all
 *  on one pale panel. One column on a phone, where the drawing goes. */
export function IndexHero({
  label,
  title,
  intro,
  primary,
  secondary,
  image,
}: {
  label: string;
  title: string;
  intro: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  /** Decorative, so no alt text. */
  image: string;
}) {
  return (
    <header className="mt-4 grid items-center gap-10 overflow-hidden rounded-[28px] bg-canvas px-6 py-10 sm:mt-6 sm:px-10 lg:grid-cols-[1.3fr_1fr] lg:gap-12 lg:rounded-[35px] lg:px-16 lg:py-14">
      <div className="min-w-0">
        <span className={eyebrow}>{`// ${label} //`}</span>
        <h1 className="mt-5 font-editorial text-[40px] leading-[1.04] font-normal tracking-[-0.03em] text-ink sm:text-[52px] lg:text-[62px]">
          {title}
        </h1>
        <p className="mt-5 max-w-[58ch] text-[16px] leading-[1.62] text-ink-soft lg:text-[17px]">
          {intro}
        </p>
        <div className="mt-7 flex flex-nowrap gap-3">
          <Link href={primary.href} className={cn(btnPrimary, btnCompact)}>
            {primary.label}
          </Link>
          <Link href={secondary.href} className={cn(btnQuiet, btnCompact)}>
            {secondary.label}
          </Link>
        </div>
      </div>

      <Image
        src={image}
        alt=""
        width={1254}
        height={1254}
        priority
        sizes="(min-width: 1024px) 400px, 60vw"
        // Multiplied into the panel so the drawing's ground disappears, and
        // cropped to the middle of its own height to drop the empty band.
        className="mx-auto aspect-[1254/1003] w-full max-w-[400px] object-cover object-center mix-blend-multiply max-lg:hidden"
      />
    </header>
  );
}

/** An outlined label over a serif heading — every section's opening. */
export function SectionHead({
  label,
  title,
  lede,
  id,
}: {
  label: string;
  title: string;
  lede?: string;
  id?: string;
}) {
  return (
    <div>
      <span className={eyebrow}>{`// ${label} //`}</span>
      <h2 id={id} className={cn(h2, "mt-4 scroll-mt-24")}>
        {title}
      </h2>
      {lede && (
        <p className="mt-4 max-w-[60ch] text-[16px] leading-[1.65] text-ink-soft">
          {lede}
        </p>
      )}
    </div>
  );
}

/** The closing panel. */
export function ClosingPanel({
  title = "Build it in the editor",
  body = "Live preview, AI writing help, and an ATS-ready PDF. Free to start, and no card at any point.",
  label = "Start your resume",
  href = "/dashboard",
}: {
  title?: string;
  body?: string;
  label?: string;
  href?: string;
}) {
  return (
    <section className="mt-20 mb-6 rounded-[28px] bg-canvas px-6 py-14 text-center sm:px-10 lg:rounded-[35px] lg:py-20">
      <h2 className={cn(h2, "mx-auto max-w-[20ch]")}>{title}</h2>
      <p className="mx-auto mt-4 max-w-[46ch] text-[16px] leading-[1.6] text-ink-soft">
        {body}
      </p>
      <Link href={href} className={cn(btnPrimary, "mt-8")}>
        {label}
      </Link>
    </section>
  );
}

/** A pale card in a grid of them: a serif title, a line under it. */
export function InfoCard({ title, note }: { title: string; note: string }) {
  return (
    <div className="rounded-[22px] bg-canvas px-6 py-6">
      <h3 className="font-editorial text-[22px] leading-[1.15] tracking-[-0.015em] text-ink">
        {title}
      </h3>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}
