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
      <div className="mx-auto flex h-14 max-w-[1180px] items-center gap-8 rounded-2xl border border-black/5 bg-panel px-4 shadow-[var(--shadow-panel)] sm:px-5">
        <Link href="/" aria-label="maniacv home">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-1 text-[14.5px] font-bold text-ink-soft transition hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/login"
            className="hidden h-9 items-center rounded-lg border border-black/10 px-4 text-[14px] font-bold text-ink transition hover:bg-black/5 sm:inline-flex"
          >
            Log In
          </Link>
          <Link
            href="/dashboard"
            className="btn-gradient inline-flex h-9 items-center rounded-lg px-4 text-[14px] font-bold transition hover:opacity-90"
          >
            Start Now
          </Link>
        </div>
      </div>
    </header>
  );
}
