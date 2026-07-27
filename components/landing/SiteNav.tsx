import Link from "next/link";

import { Wordmark } from "./marks";

const LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Templates", href: "/resume-templates" },
  { label: "Pricing", href: "/pricing" },
  { label: "Guides", href: "/guides" },
  { label: "FAQ", href: "/faq" },
];

export function SiteNav() {
  // The floating rounded bar is the editor's TopBar shape, so arriving on the
  // marketing page already looks like arriving in the app.
  return (
    <header className="sticky top-0 z-30 bg-cream/85 px-3 py-3 backdrop-blur-sm sm:px-4 sm:py-4">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center gap-8 rounded-2xl border border-black/5 bg-panel px-4 shadow-[var(--shadow-panel)] sm:px-6 lg:h-[74px] lg:gap-10 lg:px-7">
        <Link href="/" aria-label="maniacv home" className="shrink-0">
          <Wordmark className="h-9 lg:h-10" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex lg:gap-9">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-1 text-[15px] font-bold text-ink-soft transition hover:text-ink lg:text-[16px]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:gap-3">
          <Link
            href="/login"
            className="hidden h-10 items-center rounded-xl border border-black/10 px-5 text-[14.5px] font-bold text-ink transition hover:bg-black/5 sm:inline-flex lg:h-11 lg:text-[15px]"
          >
            Log In
          </Link>
          <Link
            href="/dashboard"
            className="btn-gradient inline-flex h-10 items-center rounded-xl px-5 text-[14.5px] font-bold transition hover:opacity-90 lg:h-11 lg:px-6 lg:text-[15px]"
          >
            Start Now
          </Link>
        </div>
      </div>
    </header>
  );
}
