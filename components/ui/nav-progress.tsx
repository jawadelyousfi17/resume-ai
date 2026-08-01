"use client";

// The bar across the top of the window while a page is on its way.
//
// Most navigations here are instant — the marketing pages are static and
// prefetched — but the ones that aren't are the ones that matter: /start
// writes a row before it redirects, the editor loads a resume, and both are
// reached by a press that otherwise looks ignored for a second or two.
//
// Indeterminate on purpose. There is no number to report: the App Router
// doesn't say how far along a navigation is, and a bar that creeps to 90% and
// waits is a fiction. This one just moves, which is the honest version of "the
// press landed, something is happening".
//
// Why a click listener rather than a hook: `useLinkStatus` only works inside
// the <Link> that was clicked, and there is no router event for "a navigation
// began". So the start is taken from the click, and the finish from the route
// actually changing underneath — the one thing that can't lie.

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/** Nothing is shown for a navigation quicker than this. Below it the bar is a
 *  flash rather than feedback, and a flash reads as a glitch. */
const APPEAR_AFTER_MS = 120;

/** However long the fade-out lasts, so the element leaves after it. */
const FADE_MS = 220;

/** A navigation that never lands — a redirect to an external host, a download,
 *  a route that threw — must not leave the bar running forever. */
const GIVE_UP_MS = 12_000;

export function NavProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, setState] = useState<"idle" | "running" | "leaving">("idle");

  // The route that was on screen when the click happened. The navigation is
  // over when what's rendered no longer matches it.
  const from = useRef<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    for (const timer of timers.current) clearTimeout(timer);
    timers.current = [];
  };

  useEffect(() => {
    const start = () => {
      clearTimers();
      from.current = location.pathname + location.search;
      timers.current.push(
        setTimeout(() => {
          // Still on the page we started from — the navigation is slow enough
          // to be worth saying so.
          if (from.current === location.pathname + location.search) {
            setState("running");
          }
        }, APPEAR_AFTER_MS),
        setTimeout(() => {
          from.current = null;
          setState("idle");
        }, GIVE_UP_MS),
      );
    };

    const onClick = (event: MouseEvent) => {
      // Anything but a plain left click is the browser's to handle: a modified
      // click opens a tab, and this window stays where it is.
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, location.href);
      // Another site, or a jump within this page. Neither is a navigation this
      // bar has anything to say about.
      if (url.origin !== location.origin) return;
      if (url.pathname + url.search === location.pathname + location.search) {
        return;
      }

      start();
    };

    // Back and forward are navigations too, and they skip the click entirely.
    const onPopState = () => start();

    // Capture phase: a handler on the link that calls `stopPropagation` would
    // otherwise take the click away before it reaches the document.
    document.addEventListener("click", onClick, { capture: true });
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("popstate", onPopState);
      clearTimers();
    };
  }, []);

  // The route changed, so whatever was in flight has landed. Runs on the first
  // render too, where there is nothing to finish and this does nothing.
  useEffect(() => {
    if (from.current === null) return;
    clearTimers();
    from.current = null;
    // Only worth fading out something that was actually shown.
    setState((current) => (current === "running" ? "leaving" : "idle"));
    const timer = setTimeout(() => setState("idle"), FADE_MS);
    timers.current.push(timer);
    // `searchParams` is in the deps because a navigation can change only the
    // query — /login?next=… back to itself with an error, say.
  }, [pathname, searchParams]);

  if (state === "idle") return null;

  return (
    <div
      // Not a `role="progressbar"`: there is no value to announce, and a
      // progressbar with no value is worse for a screen reader than silence.
      // The pages it covers announce themselves when they arrive.
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px] overflow-hidden transition-opacity"
      style={{
        opacity: state === "leaving" ? 0 : 1,
        transitionDuration: `${FADE_MS}ms`,
      }}
    >
      <div className="nav-progress-bar h-full w-full bg-brand" />
    </div>
  );
}
