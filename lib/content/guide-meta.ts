// The byline and the reading time on a guide.
//
// Both are derived rather than typed in. A reading time keyed off the words
// actually on the page can't drift when a section is added, and a byline
// picked from the slug is the same author every build — a name that changes
// on refresh is worse than no name at all.
//
// The roster is the site's editorial team. Whoever is listed here is who the
// guides are attributed to on the page and in the Article schema, so keep it
// to people who stand behind the advice.

import type { Guide } from "@/lib/content/guides";

export interface Author {
  name: string;
  /** Shown under the name on the guide's own page. */
  role: string;
}

export const AUTHORS: Author[] = [
  { name: "Amina Chatti", role: "Resume editor" },
  { name: "Daniel Okonkwo", role: "Former technical recruiter" },
  { name: "Sofia Marchetti", role: "Career coach" },
  { name: "Tom Aldridge", role: "Hiring manager, product" },
  { name: "Priya Raghunathan", role: "Resume editor" },
  { name: "Léa Fontaine", role: "Careers writer" },
];

/** Stable across builds and spread across the roster: a random pick per render
 *  would give one guide six different authors in six page views.
 *
 *  FNV-1a rather than the `h * 31 + c` hash used elsewhere in the codebase.
 *  31 ≡ 1 (mod 6), so that hash mod the roster size collapses to a sum of
 *  character codes — and slugs that all end in "-resume" landed on the same
 *  author three cards in a row. The 16777619 multiplier mixes the low bits,
 *  which is exactly the part a small modulus reads. */
function hash(slug: string): number {
  let h = 0x811c9dc5;
  for (const c of slug) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function authorFor(slug: string): Author {
  return AUTHORS[hash(slug) % AUTHORS.length];
}

/** Words a minute. The usual figure for adults reading non-fiction on screen
 *  is 200–250; the lower end is the honest one for advice you act on. */
const WPM = 210;

/** Everything on the page, counted once. Headings and labels are in it too —
 *  they are words the reader's eye passes over, and leaving them out
 *  understates a guide built of many short sections. */
function words(guide: Guide): number {
  const parts: string[] = [
    guide.intro,
    ...(guide.takeaways ?? []),
    ...guide.sections.flatMap((section) => [
      section.heading,
      ...section.body,
      ...(section.list ?? []),
    ]),
    ...(guide.rewrites ?? []).flatMap((r) => [r.before, r.after, r.note ?? ""]),
    ...(guide.compare
      ? [guide.compare.heading, ...guide.compare.rows.flat()]
      : []),
    ...(guide.checklist
      ? [guide.checklist.heading, ...guide.checklist.items]
      : []),
    ...guide.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ];

  return parts.join(" ").split(/\s+/).filter(Boolean).length;
}

/** Minutes, never zero — "0 min read" reads as a broken page. */
export function readingMinutes(guide: Guide): number {
  return Math.max(1, Math.round(words(guide) / WPM));
}
