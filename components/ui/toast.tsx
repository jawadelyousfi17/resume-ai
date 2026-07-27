"use client";

// Toasts, on react-hot-toast.
//
// The library takes one line of message and a handful of options; the app has
// always spoken in a headline plus an optional second line — "Couldn't save
// your changes" over the reason. Rather than rewrite twenty call sites into
// one long sentence, the shim below keeps that shape and renders the second
// line itself. Everything else — ids, dismissal, the promise of a loading
// toast turning into a result — is the library's, untouched.

import hot, { Toaster as HotToaster } from "react-hot-toast";

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

/**
 * Where they appear.
 *
 * Bottom right on a desktop — the editor's own controls live top and left, and
 * a toast over the page being edited is a toast in the way. On a phone there is
 * no such corner, so they come down from the top, clear of the bottom bar.
 */
export function Toaster() {
  return (
    <HotToaster
      position="bottom-right"
      containerClassName="!bottom-6 !right-6 max-sm:!top-4 max-sm:!bottom-auto max-sm:!right-4 max-sm:!left-4"
      toastOptions={{
        // The app's panel, not the library's white box.
        className:
          "!bg-panel !text-ink !text-[14px] !font-semibold !rounded-xl !shadow-[var(--shadow-panel)] !ring-1 !ring-black/5 !max-w-[420px]",
        duration: 4000,
        success: {
          iconTheme: { primary: "var(--app-brand)", secondary: "#fff" },
        },
        error: { duration: 6000 },
      }}
    />
  );
}
