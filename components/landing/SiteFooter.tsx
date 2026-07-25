import Link from "next/link";

import { MailIcon } from "@/components/ui/icons";

import { SOCIALS, SocialIcon, Wordmark } from "./marks";
import { btnOnNavy, btnPrimary } from "./ui";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Resume builder", href: "/dashboard" },
      { label: "Templates", href: "/resume-templates" },
      { label: "AI writing", href: "/guides/ai-resume-builder" },
      { label: "Translate a resume", href: "/guides/translate-your-resume" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Guides",
    links: [
      { label: "How to write a resume", href: "/guides/how-to-write-a-resume" },
      { label: "Bullet points", href: "/guides/resume-bullet-points" },
      { label: "Resume summary", href: "/guides/resume-summary-examples" },
      { label: "Resume format", href: "/guides/resume-format" },
      { label: "All guides", href: "/guides" },
    ],
  },
  {
    title: "Situations",
    links: [
      { label: "ATS-friendly resumes", href: "/guides/ats-friendly-resume" },
      { label: "Career change", href: "/guides/career-change-resume" },
      { label: "Common mistakes", href: "/guides/resume-mistakes" },
      { label: "Applying abroad", href: "/guides/translate-your-resume" },
    ],
  },
];

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path
        d="M5.4 2.2 6.8 5 5.5 6.3a8 8 0 0 0 4.2 4.2L11 9.2l2.8 1.4v2.2c0 .6-.5 1.1-1.1 1a11.5 11.5 0 0 1-10.5-10.5c0-.6.4-1.1 1-1.1z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="px-5 pb-5 sm:px-8 sm:pb-8">
      <div className="mx-auto max-w-[1180px] rounded-3xl bg-navy px-6 pt-14 shadow-[var(--shadow-panel)] sm:px-10 sm:pt-16">
        {/* Closing CTA */}
        <div className="flex flex-col gap-8 pb-16 lg:flex-row lg:items-center lg:justify-between lg:pb-20">
          <h2 className="max-w-[16ch] text-[28px] leading-[1.2] font-extrabold tracking-tight text-white sm:text-[34px]">
            Discover the full scale of{" "}
            <span className="underline decoration-accent-2 decoration-[5px] underline-offset-[8px]">
              resumeai
            </span>{" "}
            capabilities
          </h2>
          <div className="flex shrink-0 flex-wrap gap-3">
            <a href="#features" className={btnOnNavy}>
              Get a Demo
            </a>
            <Link href="/dashboard" className={btnPrimary}>
              Start for Free
            </Link>
          </div>
        </div>

        {/* Sitemap */}
        <div className="grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Wordmark tone="light" />
            <div className="mt-6 space-y-3 text-[13.5px] text-white/55">
              <a
                href="mailto:hello@resumeai.com"
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <MailIcon className="h-4 w-4" />
                hello@resumeai.com
              </a>
              <a
                href="tel:+14155550134"
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <PhoneIcon className="h-4 w-4" />
                +1 (415) 555-0134
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[13.5px] font-bold text-white">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-[13.5px] text-white/55 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal */}
        <div className="flex flex-col items-center justify-between gap-5 border-t border-white/10 py-6 sm:flex-row">
          <p className="text-[12.5px] text-white/40">
            © Copyright 2026 resumeai. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {SOCIALS.map((s) => (
              <SocialIcon key={s.label} {...s} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
