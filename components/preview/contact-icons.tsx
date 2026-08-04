// The marks beside the contact rows, in whichever style the document asks for.
//
// Four sets, because a resume's icons are part of its voice: a Feather outline
// suits the quiet templates, Font Awesome's solids suit the loud ones, and some
// people want no icons at all. `IconKind` is the vocabulary — what the row
// means — and each style answers it in its own hand, so nothing above this file
// has to know which pack is in play.
//
// The default set is drawn here rather than imported. It is the one tuned for
// the page: solid at a size where a hairline stroke disappears into the paper,
// and carrying the official brand marks, which is the only way GitHub reads as
// GitHub at 8pt. See `HOUSE`.

import { FaEnvelope, FaGithub, FaGitlab, FaLink, FaLinkedin, FaLocationDot, FaPhone, FaBehance, FaDribbble, FaStackOverflow, FaXTwitter } from "react-icons/fa6";
import { FiGithub, FiGitlab, FiDribbble, FiLink, FiLinkedin, FiMail, FiMapPin, FiPhone, FiTwitter } from "react-icons/fi";
import { PiBehanceLogo, PiDribbbleLogo, PiEnvelopeSimple, PiGithubLogo, PiGitlabLogo, PiLink, PiLinkedinLogo, PiMapPin, PiPhone, PiXLogo } from "react-icons/pi";
import { SiStackoverflow, SiBehance } from "react-icons/si";

import type { IconKind, IconStyle } from "@/lib/types";

/**
 * The house set: solid, and drawn to sit on a line of 8pt type.
 *
 * A 1.4px stroke at this size thins to nothing in a PDF and greys out in a
 * scan, while a filled shape keeps its silhouette. The brand paths are the
 * official ones. Inline and local on purpose — the renderer has to draw
 * identically in the editor, in a screenshot and in the print browser, with no
 * icon font to load and nothing to fetch.
 */
const HOUSE: Record<IconKind, string> = {
  email:
    "M2.5 6.6c0-1 .8-1.9 1.9-1.9h15.2c1 0 1.9.8 1.9 1.9v.5l-9.1 5.4a.9.9 0 0 1-1 0L2.5 7.1zm0 2.7 8.6 5.1c.6.3 1.2.3 1.8 0l8.6-5.1v8.1c0 1-.8 1.9-1.9 1.9H4.4c-1 0-1.9-.8-1.9-1.9z",
  phone:
    "M7.4 2.6c.5-.2 1.1 0 1.4.5l1.8 3.2c.3.5.2 1.1-.2 1.5L9 9.2a11 11 0 0 0 5.8 5.8l1.4-1.4c.4-.4 1-.5 1.5-.2l3.2 1.8c.5.3.7.9.5 1.4l-1 2.4c-.2.5-.7.9-1.3.8-4.3-.4-8-2.3-11-5.3S3.2 8 2.8 3.7c0-.6.3-1.1.8-1.3z",
  location:
    "M12 22.3s7.6-6.7 7.6-12.2A7.6 7.6 0 1 0 4.4 10c0 5.5 7.6 12.2 7.6 12.2m0-14.9a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6",
  github:
    "M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2A5.3 5.3 0 0 1 3 19.4c-.3-.8-.8-1.6-1.4-2-.5-.3-1.2-1 0-1a3 3 0 0 1 2.3 1.5 3.2 3.2 0 0 0 4.4 1.2 3.2 3.2 0 0 1 1-2c-3.3-.4-6.7-1.7-6.7-7.4a5.8 5.8 0 0 1 1.5-4 5.4 5.4 0 0 1 .2-4S5.5 1.4 8 3.2a11.5 11.5 0 0 1 6 0c2.4-1.8 3.5-1.4 3.5-1.4a5.4 5.4 0 0 1 .2 4 5.8 5.8 0 0 1 1.5 4c0 5.7-3.4 7-6.7 7.4a3.6 3.6 0 0 1 1 2.8v4.1c0 .3.2.7.8.6A12 12 0 0 0 12 .3",
  linkedin:
    "M20.4 20.5h-3.5V15c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.6H9.4V9h3.4v1.6h.05c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5zM5.3 7.4a2.1 2.1 0 1 1 0-4.1 2.1 2.1 0 0 1 0 4.1m1.8 13.1H3.6V9h3.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 1 .8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7c0-1-.8-1.7-1.8-1.7",
  gitlab:
    "M12 23.3 16.4 9.8H7.6zM12 23.3 7.6 9.8H1.4zM1.4 9.8 0 14.1a1 1 0 0 0 .4 1.1L12 23.3zM1.4 9.8h6.2L4.9 1.6c-.1-.4-.7-.4-.9 0zM12 23.3l4.4-13.5h6.2zM22.6 9.8 24 14.1a1 1 0 0 1-.4 1.1L12 23.3zM22.6 9.8h-6.2l2.7-8.2c.1-.4.7-.4.9 0z",
  dribbble:
    "M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24m7.9 5.5a10.2 10.2 0 0 1 2.3 6.4c-.3-.1-3.7-.8-7.1-.3l-.5-1.2c3.6-1.5 5.2-3.6 5.3-4.9M12 1.8c2.4 0 4.6.9 6.3 2.4-.1.2-1.5 2.2-5 3.5A52 52 0 0 0 9.6 2 10 10 0 0 1 12 1.8M7.6 2.7c.3.4 2 2.9 3.6 5.6-4.5 1.2-8.5 1.2-8.9 1.2A10.3 10.3 0 0 1 7.6 2.7M1.8 12v-.3c.4 0 5.1.1 9.9-1.4l.7 1.4c-4.6 1.3-7.1 5.4-7.3 5.8A10.2 10.2 0 0 1 1.8 12M12 22.2c-2.3 0-4.5-.8-6.2-2.2.2-.3 1.9-3.7 7-5.5 2.1 5.5 3 10 3.2 11.3-1.2.3-2.6.4-4 .4m5.8-1.3c-.1-.9-.9-5.2-2.9-10.6 3.2-.5 6 .3 6.4.4a10.2 10.2 0 0 1-3.5 10.2",
  behance:
    "M7.4 4.5c.7 0 1.4.1 2 .2s1.1.3 1.5.6.7.7 1 1.2c.2.5.3 1.1.3 1.8 0 .8-.2 1.4-.5 2s-.9 1-1.6 1.3c1 .3 1.7.8 2.2 1.5s.7 1.6.7 2.6c0 .8-.2 1.5-.5 2.1s-.7 1.1-1.3 1.5-1.1.6-1.8.8-1.4.3-2.1.3H0V4.5zm-.4 5.9c.6 0 1-.1 1.4-.4s.5-.7.5-1.3c0-.3 0-.6-.2-.8s-.3-.4-.5-.5-.4-.2-.7-.2H3.2v3.2zm.2 6.2c.3 0 .6 0 .9-.1s.5-.2.7-.3.3-.3.5-.6.2-.6.2-.9c0-.7-.2-1.3-.6-1.6s-1-.5-1.6-.5H3.2v4zM17.7 16.8c.4.4 1 .6 1.9.6.6 0 1.1-.1 1.5-.4s.7-.6.8-.9h2.5c-.4 1.2-1 2.1-1.8 2.7s-1.8.8-3 .8c-.8 0-1.6-.1-2.2-.4s-1.2-.6-1.7-1.1-.8-1.1-1-1.7-.4-1.4-.4-2.2c0-.8.1-1.5.4-2.2s.6-1.2 1.1-1.7 1-.9 1.7-1.1 1.3-.4 2.1-.4c.9 0 1.6.2 2.3.5s1.2.8 1.6 1.3.7 1.2.9 1.9.2 1.4.2 2.2h-7.5c0 .9.3 1.7.7 2.1zm3.3-5.7c-.4-.4-.9-.6-1.6-.6-.5 0-.8.1-1.2.2s-.6.3-.7.6-.3.5-.4.7 0 .5-.1.7h4.7c-.1-.7-.3-1.3-.7-1.6zM15.5 5.5h5.9v1.4h-5.9z",
  stackoverflow:
    "M18.986 21.865v-6.404h2.134V24H1.844v-8.539h2.13v6.404zM6.111 19.731H16.85v-2.13H6.111zm.259-4.852 10.48 2.187.451-2.086-10.478-2.187zm1.359-5.056 9.705 4.53.903-1.95-9.706-4.53zm2.715-4.785 8.217 6.855 1.359-1.62-8.216-6.853zM15.751 0l-1.746 1.294 6.318 8.514 1.745-1.294z",
  x: "M18.9 1.2h3.7l-8 9.2L24 22.8h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.2h7.6l5.2 6.9zm-1.3 19.4h2L6.5 3.3H4.3z",
  link: "M9.7 14.3a4.9 4.9 0 0 0 7 0l3.5-3.5a4.9 4.9 0 0 0-7-7L11.5 5.5a1.1 1.1 0 0 0 1.6 1.6l1.7-1.7a2.7 2.7 0 0 1 3.8 3.8l-3.5 3.5a2.7 2.7 0 0 1-3.8 0 1.1 1.1 0 0 0-1.6 1.6m4.6-4.6a4.9 4.9 0 0 0-7 0l-3.5 3.5a4.9 4.9 0 0 0 7 7l1.7-1.7a1.1 1.1 0 0 0-1.6-1.6l-1.7 1.7a2.7 2.7 0 0 1-3.8-3.8l3.5-3.5a2.7 2.7 0 0 1 3.8 0 1.1 1.1 0 0 0 1.6-1.6",
};

/** Marks with a hole the paper has to show through — a pin's dot, the ring on
 *  GitHub's mark. Without `evenodd` they fill in and turn to blobs. */
const EVENODD = new Set<IconKind>(["location", "github"]);

type IconComponent = React.ComponentType<{ className?: string }>;

/** The imported packs, by style. `null` means the house set draws it. */
const PACKS: Record<Exclude<IconStyle, "solid" | "none">, Record<IconKind, IconComponent>> = {
  line: {
    email: FiMail,
    phone: FiPhone,
    location: FiMapPin,
    github: FiGithub,
    linkedin: FiLinkedin,
    gitlab: FiGitlab,
    dribbble: FiDribbble,
    // Feather has no Behance or Stack Overflow mark; the brand sets fill in,
    // and at a hairline weight they sit beside the outlines well enough.
    behance: SiBehance,
    stackoverflow: SiStackoverflow,
    x: FiTwitter,
    link: FiLink,
  },
  rounded: {
    email: PiEnvelopeSimple,
    phone: PiPhone,
    location: PiMapPin,
    github: PiGithubLogo,
    linkedin: PiLinkedinLogo,
    gitlab: PiGitlabLogo,
    dribbble: PiDribbbleLogo,
    behance: PiBehanceLogo,
    stackoverflow: SiStackoverflow,
    x: PiXLogo,
    link: PiLink,
  },
  classic: {
    email: FaEnvelope,
    phone: FaPhone,
    location: FaLocationDot,
    github: FaGithub,
    linkedin: FaLinkedin,
    gitlab: FaGitlab,
    dribbble: FaDribbble,
    behance: FaBehance,
    stackoverflow: FaStackOverflow,
    x: FaXTwitter,
    link: FaLink,
  },
};

/**
 * One mark, at the size of the text beside it.
 *
 * Everything is sized in `em` and coloured with the row's own colour, so a
 * style swap can never disturb the layout — only the drawing changes.
 */
export function ContactIcon({
  kind,
  style,
  color,
}: {
  kind: IconKind;
  style: IconStyle;
  color: string;
}) {
  if (style === "none") return null;

  const shared = {
    // A shade under the cap height: level with the text rather than looming
    // over it. The nudge is what actually sits it on the baseline.
    width: "0.95em",
    height: "0.95em",
    flexShrink: 0,
    marginTop: "0.18em",
    color,
  } satisfies React.CSSProperties;

  if (style !== "solid") {
    const Icon = PACKS[style][kind];
    // react-icons reads its size and colour off the element's own font-size and
    // `currentColor`, so a wrapper carrying both is all it needs.
    return (
      <span style={{ ...shared, display: "inline-flex", fontSize: "0.95em" }}>
        <Icon />
      </span>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill={color}
      fillRule={EVENODD.has(kind) ? "evenodd" : undefined}
      aria-hidden="true"
      style={shared}
    >
      <path d={HOUSE[kind]} />
    </svg>
  );
}

/**
 * Which mark belongs beside a link.
 *
 * A resume's links are nearly always the same handful of places, and a row of
 * identical chain glyphs tells a reader nothing. The label counts as well as
 * the URL — plenty of people write "GitHub" and paste the address into the
 * label field, or type the handle with no scheme at all.
 */
export function linkIcon(text: string): IconKind {
  const t = text.toLowerCase();
  if (t.includes("github")) return "github";
  if (t.includes("linkedin")) return "linkedin";
  if (t.includes("gitlab")) return "gitlab";
  if (t.includes("dribbble")) return "dribbble";
  if (t.includes("behance")) return "behance";
  if (t.includes("stackoverflow") || t.includes("stack overflow"))
    return "stackoverflow";
  if (/(^|[^a-z])x\.com|twitter/.test(t)) return "x";
  return "link";
}
