// Whether a request came from a phone.
//
// Read on the server from the User-Agent so the editor can send the mobile
// layout in the first response instead of swapping it in after hydration. It's
// a hint, not the truth: the client re-checks with a media query on mount, and
// that answer wins.

const MOBILE_UA =
  /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile Safari/i;

export function isMobileUserAgent(ua: string | null | undefined): boolean {
  if (!ua) return false;
  // An iPad reports itself as a Mac, and the editor's desktop layout is the
  // right one for it, so nothing here tries to catch tablets.
  return MOBILE_UA.test(ua);
}

/** The width the editor switches layouts at — Tailwind's `md`. */
export const MOBILE_QUERY = "(max-width: 767px)";
