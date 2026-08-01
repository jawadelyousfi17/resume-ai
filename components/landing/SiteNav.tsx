"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { Wordmark } from "./marks";

const LINKS = [
  { label: "Templates", href: "/resume-templates" },
  { label: "Examples", href: "/resume-examples" },
  { label: "Pricing", href: "/pricing" },
  { label: "Guides", href: "/guides" },
  { label: "FAQ", href: "/faq" },
];

/** How far down the page the bar stops being part of the background. */
const LIFT_AT = 8;

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

/**
 * True once the page has moved.
 *
 * `useSyncExternalStore` rather than an effect that writes state: it reads the
 * real scroll position during render, so a page restored mid-scroll paints the
 * lifted bar straight away instead of flashing the flat one. The server has no
 * scroll position, so it renders the top-of-page state.
 */
function useScrolled() {
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > LIFT_AT,
    () => false,
  );
}

export function SiteNav() {
  const scrolled = useScrolled();

  // Full width, edge to edge: the public pages are a site, and a site's header
  // spans it. The floating rounded bar is the *editor's* shape and stays there
  // — the app is a tool with a document in it, and the bar around a document
  // should look like it belongs to the document, not to the window.
  //
  // Sticky, and at the top of the page it has no surface of its own: just the
  // cream the hero sits on. It only becomes a bar once there's content passing
  // underneath for it to sit above.
  //
  // For this to stick, no ancestor may create a scroll container — `overflow-x:
  // hidden` on a wrapper is the usual culprit and silently turns a sticky
  // header back into a static one. See the note in app/page.tsx.
  return (
    <header
      className={`sticky top-0 z-30 w-full border-b transition-colors duration-200 ${
        scrolled
          ? "border-black/5 bg-panel/90 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="flex h-[76px] items-center gap-5 px-5 sm:px-8 lg:h-[96px] lg:gap-10 lg:px-10">
        <Link href="/" aria-label="meniacv home" className="shrink-0">
          <Wordmark className="h-10 lg:h-12" />
        </Link>

        {/* The links appear at md, where the bar is at its tightest: wordmark,
            five links and two buttons only fit if the gaps stay small until
            there's room for them. At lg they open back up to the designed
            spacing. Widening these without checking 768px puts the primary
            button off the edge of the page. */}
        <nav className="hidden items-center gap-4 md:flex lg:gap-9">
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
            className="hidden h-11 items-center rounded-xl border border-black/10 px-5 text-[14.5px] font-bold text-ink transition hover:bg-black/5 sm:inline-flex lg:h-12 lg:text-[15px]"
          >
            Log In
          </Link>
          <Link
            href="/dashboard"
            className="btn-fill inline-flex h-11 items-center rounded-xl px-5 text-[14.5px] font-bold transition hover:opacity-90 lg:h-12 lg:px-6 lg:text-[15px]"
          >
            Start Now
          </Link>
        </div>
      </div>
    </header>
  );
}
