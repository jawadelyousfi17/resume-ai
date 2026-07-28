"use client";

// Toasts, on react-hot-toast.
//
// The library takes one line of message and a handful of options; the app has
// always spoken in a headline plus an optional second line — "Couldn't save
// your changes" over the reason. Rather than rewrite twenty call sites into
// one long sentence, the shim below keeps that shape and renders the second
// line itself. Everything else — ids, dismissal, the promise of a loading
// toast turning into a result — is the library's, untouched.

import { useEffect, useState } from "react";
import hot, { Toaster as HotToaster } from "react-hot-toast";

import { MOBILE_QUERY } from "@/lib/device";

interface Options {
  /** Replaces an existing toast instead of stacking a new one. Used by the
   *  flows that open with "Building…" and answer in place. */
  id?: string;
  /** The quiet second line: what went wrong, or which file arrived. */
  description?: string;
  duration?: number;
}

/** Headline over detail, or just the headline. */
function body(message: string, description?: string) {
  if (!description) return message;
  return (
    <span className="block">
      <span className="block font-bold">{message}</span>
      <span className="mt-0.5 block text-[13px] leading-snug font-medium text-ink-soft">
        {description}
      </span>
    </span>
  );
}

const opts = (o?: Options) => ({ id: o?.id, duration: o?.duration });

export const toast = {
  success: (message: string, o?: Options) =>
    hot.success(body(message, o?.description), opts(o)),
  error: (message: string, o?: Options) =>
    hot.error(body(message, o?.description), opts(o)),
  loading: (message: string, o?: Options) =>
    hot.loading(body(message, o?.description), opts(o)),
  /** No id dismisses everything, which is what leaving a page wants. */
  dismiss: (id?: string) => hot.dismiss(id),
};

/** True on a phone-sized screen. Starts false so the server and the first
 *  client paint agree; nothing is on screen at mount for the correction to
 *  disturb. */
function useNarrow() {
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return narrow;
}

/**
 * Where they appear.
 *
 * Bottom right on a desktop — the editor's own controls live top and left, and
 * a toast over the page being edited is a toast in the way. On a phone there is
 * no such corner, so they come down from the top, clear of the bottom bar.
 *
 * The side is switched through the library's own `position` rather than by
 * pinning the container with CSS. `position` is not only where the box sits:
 * react-hot-toast reads it to decide which way a toast enters and which way the
 * stack grows — `translateY(offset * (isTop ? 1 : -1))`. Told "bottom" while
 * CSS held the container at the top, every toast after the first translated
 * *upwards*, off the top of the screen, which is what made them look half cut
 * off. Given the real position it animates and stacks downwards, as it should.
 */
export function Toaster() {
  const narrow = useNarrow();

  return (
    <HotToaster
      position={narrow ? "top-center" : "bottom-right"}
      containerStyle={
        narrow
          ? {
              // Clear of the status bar and the notch, not just of the
              // viewport's top edge.
              top: "calc(env(safe-area-inset-top, 0px) + 12px)",
              left: 12,
              right: 12,
              bottom: "auto",
            }
          : { bottom: 24, right: 24 }
      }
      toastOptions={{
        // The app's panel, not the library's white box. Full width on a phone,
        // where the container's gutters already set the margin.
        className:
          "!bg-panel !text-ink !text-[14px] !font-semibold !rounded-xl !shadow-[var(--shadow-panel)] !ring-1 !ring-black/5 !max-w-[420px] max-sm:!w-full",
        duration: 4000,
        success: {
          iconTheme: { primary: "var(--app-brand)", secondary: "#fff" },
        },
        error: { duration: 6000 },
      }}
    />
  );
}
