import Link from "next/link";

import { MailIcon } from "@/components/ui/icons";

import { CONTACT, SOCIAL_LINKS } from "@/lib/site-contact";

import { Wordmark } from "./marks";
import { btnPrimary, btnQuiet } from "./ui";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Resume builder", href: "/dashboard" },
      { label: "Templates", href: "/resume-templates" },
      { label: "Cover letters", href: "/cover-letter" },
      { label: "Resume review", href: "/resume-review" },
      { label: "ATS score", href: "/resume-ats-score" },
      { label: "Pricing", href: "/pricing" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Collections",
    links: [
      { label: "ATS-friendly templates", href: "/ats-friendly-resume-templates" },
      { label: "Simple templates", href: "/simple-resume-templates" },
      { label: "Modern templates", href: "/modern-resume-templates" },
      { label: "Professional templates", href: "/professional-resume-templates" },
      { label: "Two-column templates", href: "/two-column-resume-templates" },
      { label: "With a photo", href: "/resume-templates-with-photo" },
    ],
  },
  {
    title: "CVs",
    links: [
      { label: "CV maker", href: "/cv-maker" },
      { label: "CV templates", href: "/cv-templates" },
      { label: "CV examples", href: "/cv-examples" },
      { label: "AI resume builder", href: "/ai-resume-builder" },
      { label: "Canva templates", href: "/canva-resume-templates" },
      { label: "Google Docs templates", href: "/google-docs-resume-templates" },
    ],
  },
  {
    title: "Examples",
    links: [
      { label: "Software developer", href: "/resume-examples/software-engineer" },
      { label: "Product manager", href: "/resume-examples/product-manager" },
      { label: "Data analyst", href: "/resume-examples/data-analyst" },
      { label: "Registered nurse", href: "/resume-examples/registered-nurse" },
      { label: "All examples", href: "/resume-examples" },
    ],
  },
  {
    title: "Guides",
    links: [
      { label: "How to write a resume", href: "/guides/how-to-write-a-resume" },
      { label: "ATS-friendly resumes", href: "/guides/ats-friendly-resume" },
      { label: "ATS keywords", href: "/guides/ats-resume-keywords" },
      { label: "Bullet points", href: "/guides/resume-bullet-points" },
      { label: "Career change", href: "/guides/career-change-resume" },
      { label: "All guides", href: "/guides" },
    ],
  },
  {
    title: "Cover letters",
    links: [
      { label: "How to write one", href: "/cover-letter" },
      { label: "Cover letter templates", href: "/cover-letter/templates" },
      { label: "Cover letter examples", href: "/cover-letter/examples" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Contact us", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Refund policy", href: "/refund-policy" },
    ],
  },
];

/** Repeated along the bottom as well as in the sitemap above: these are the
 *  four people look for at the foot of a page, and they shouldn't have to
 *  find the right column first. */
const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Refunds", href: "/refund-policy" },
  { label: "Contact", href: "/contact" },
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
    // The closing CTA carries the whole gap between a page and the footer, so
    // pages don't add bottom padding of their own on top of it.
    <footer className="mt-14 md:mt-16 lg:mt-20">
      {/* Closing CTA, on cream, above the dark footer slab. */}
      <div className="mx-auto w-full max-w-site px-5 pb-20 text-center sm:px-8 lg:pb-28">
        <h2 className="mx-auto max-w-[18ch] text-[30px] leading-[1.12] font-extrabold tracking-tight text-ink sm:text-[38px] lg:text-[44px]">
          Your first resume is free. Start writing it now.
        </h2>
        <p className="mx-auto mt-4 max-w-[52ch] text-[16px] leading-[1.7] text-ink-soft lg:text-[18px]">
          Free to start, no watermark on the way out, and no credit card at any
          point.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard" className={btnPrimary}>
            Get started for free ✨
          </Link>
          <Link href="/resume-templates" className={btnQuiet}>
            Browse templates
          </Link>
        </div>
      </div>

      <div className="w-full bg-navy">
        <div className="mx-auto w-full max-w-site px-5 pt-12 pb-8 sm:px-8 lg:pt-16 lg:pb-10">
          {/* Mission + sitemap */}
          <div className="flex flex-wrap gap-y-10">
            <div className="w-full lg:w-[45%] lg:pr-10">
              <Wordmark tone="light" />
              <p className="mt-6 max-w-md text-[15px] leading-[1.7] text-white/60 md:text-base">
                meniacv is a small, independent project. The goal is simple:
                make the hour before an application deadline a lot less
                miserable, and give you a page you&apos;re happy to send.
              </p>
              <div className="mt-6 space-y-3 text-[13.5px] text-white/55">
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-white"
                >
                  <MailIcon className="h-4 w-4" />
                  {CONTACT.email}
                </a>
                <a
                  href={`tel:${CONTACT.phoneHref}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-white"
                >
                  <PhoneIcon className="h-4 w-4" />
                  {CONTACT.phone}
                </a>
              </div>
            </div>

            <nav className="grid w-full grid-cols-2 gap-8 sm:grid-cols-3 lg:w-[74%] lg:grid-cols-6">
              {COLUMNS.map((col) => (
                <div key={col.title}>
                  <h3 className="text-[13px] font-bold tracking-[0.5px] text-white uppercase">
                    {col.title}
                  </h3>
                  <ul className="mt-4 space-y-2.5 lg:mt-5">
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
            </nav>
          </div>

          {/* Legal. No social icons: there are no accounts to link to yet,
              and a row of dead links is worse than a row without them. Fill in
              SOCIAL_LINKS and they appear. */}
          {/* Both halves keep to the left: the theme switcher floats in the
              bottom-right corner of every page, and links parked underneath it
              are links nobody can press. */}
          <div className="mt-12 flex flex-col items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-start">
            <p className="text-[12.5px] text-white/40">
              © 2026 meniacv. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[12.5px] text-white/40 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  className="text-[12.5px] text-white/40 transition-colors hover:text-white"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
