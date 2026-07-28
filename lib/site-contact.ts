// How to reach the person behind this. Written once, read by the footer, the
// contact page and the legal pages, so an address never goes stale in one
// place and not another.

export const CONTACT = {
  email: "jawadelyo5@gmail.com",
  /** Printed as written. */
  phone: "+212 651 754 580",
  /** `tel:` wants no spaces. */
  phoneHref: "+212651754580",
  /** What to say about how long an answer takes — a promise small enough to
   *  keep, since one person answers these. */
  responseTime: "Usually within a day or two",
} as const;

/** No accounts anywhere yet. The footer draws nothing rather than linking to
 *  profiles that don't exist; fill this in and it comes back on its own. */
export const SOCIAL_LINKS: { label: string; href: string }[] = [];
