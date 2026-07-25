// Small visual primitives shared across the landing page: the wordmark, the
// partner glyphs and the social icons. Everything here is inline SVG or CSS so
// the marketing page ships without a single image request.
//
// Anything the app already has an icon for comes from components/ui/icons —
// these are only the marks that don't exist there.

import { avatarUrl } from "@/lib/avatar";
import { cn } from "@/lib/utils";
import { Logo, LogoLockup } from "@/components/ui/logo";

/* -------------------------------------------------------------------------- */
/* Brand                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * The wordmark, the same one the dashboard sidebar and the editor's top bar
 * wear — the landing page is the same product, so it wears the same badge.
 *
 * On a dark background the lockup's black wordmark would disappear, so the
 * footer gets the mark beside the name set in the page's own type.
 */
export function Wordmark({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  if (tone === "dark") return <LogoLockup className={cn("h-8", className)} />;

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Logo className="h-8 w-8" />
      <span className="text-[20px] font-light tracking-tight text-white">
        mania<span className="font-black">cv</span>
      </span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* People                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * A face for someone quoted on the page — the same DiceBear illustrations the
 * resume templates use for a missing photo, so the two agree. The style and
 * seed come from the name, so a person keeps their face across the page and
 * between server and client renders.
 *
 * A plain <img> rather than next/image: these are SVGs, and serving remote SVG
 * through the image optimiser means turning on `dangerouslyAllowSVG`, which is
 * not worth it for a decorative avatar.
 */
export function Avatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={avatarUrl(name)}
      alt=""
      loading="lazy"
      decoding="async"
      className={cn(
        "shrink-0 rounded-full bg-field object-cover",
        className,
      )}
      aria-hidden="true"
    />
  );
}

/** The cursor arrow that tags each floating hero avatar. */
export function CursorTag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 14"
      className={cn("h-3.5 w-3", className)}
      aria-hidden="true"
    >
      <path d="M0 0 L11.5 6.4 L5.4 7.6 L2.6 13.6 Z" fill="currentColor" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Partner logos                                                              */
/* -------------------------------------------------------------------------- */

// Placeholder companies on purpose — these are not real customers, so the row
// reads as a design slot rather than a claim. Swap the names and glyphs when
// there are logos to show.
type Glyph = (props: { className?: string }) => React.ReactElement;

const Orbit: Glyph = ({ className }) => (
  <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
    <circle cx="10" cy="10" r="3.4" fill="currentColor" />
    <ellipse
      cx="10"
      cy="10"
      rx="8.6"
      ry="4.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      transform="rotate(-28 10 10)"
    />
  </svg>
);

const Stack: Glyph = ({ className }) => (
  <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
    <path d="M10 2 17 6 10 10 3 6z" fill="currentColor" />
    <path
      d="M3 11l7 4 7-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

const Bolt: Glyph = ({ className }) => (
  <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
    <path d="M11.4 1.5 4 11h4.4l-.8 7.5L16 9h-4.6z" fill="currentColor" />
  </svg>
);

const Prism: Glyph = ({ className }) => (
  <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
    <rect
      x="2.6"
      y="2.6"
      width="14.8"
      height="14.8"
      rx="4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    <path d="M6.6 13.4 10 6.6l3.4 6.8z" fill="currentColor" />
  </svg>
);

const Petal: Glyph = ({ className }) => (
  <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
    <circle cx="10" cy="5.6" r="3.3" fill="currentColor" />
    <circle cx="5.6" cy="13" r="3.3" fill="currentColor" opacity=".55" />
    <circle cx="14.4" cy="13" r="3.3" fill="currentColor" opacity=".8" />
  </svg>
);

export const PARTNERS: { name: string; Glyph: Glyph }[] = [
  { name: "Northwind", Glyph: Orbit },
  { name: "Lumen", Glyph: Stack },
  { name: "Vertex", Glyph: Bolt },
  { name: "Havenly", Glyph: Prism },
  { name: "Meridian", Glyph: Petal },
];

/* -------------------------------------------------------------------------- */
/* Social                                                                     */
/* -------------------------------------------------------------------------- */

export const SOCIALS: {
  label: string;
  href: string;
  path: React.ReactElement;
}[] = [
  {
    label: "X",
    href: "#",
    path: (
      <path
        d="M17.2 3h2.8l-6.1 7 7.2 9.5h-5.6l-4.4-5.8-5 5.8H3.3l6.5-7.5L2.9 3h5.7l4 5.3zm-1 15h1.6L7.9 4.6H6.2z"
        fill="currentColor"
      />
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    path: (
      <>
        <path
          d="M5 3.6a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2M3 20.4h4V9.4H3z"
          fill="currentColor"
        />
        <path
          d="M9.4 9.4h3.8v1.5h.06c.53-.98 1.83-2 3.77-2 4.03 0 4.77 2.5 4.77 5.75v5.75h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.32-1.96 2.69v5.19h-4z"
          fill="currentColor"
        />
      </>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    path: (
      <>
        <rect
          x="3.2"
          y="3.2"
          width="17.6"
          height="17.6"
          rx="5.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle
          cx="12"
          cy="12"
          r="3.9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="17" cy="7" r="1.2" fill="currentColor" />
      </>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    path: (
      <path
        d="M22.6 12s0-3.3-.42-4.9a2.72 2.72 0 0 0-1.9-1.92C18.66 4.75 12 4.75 12 4.75s-6.66 0-8.28.43A2.72 2.72 0 0 0 1.82 7.1C1.4 8.7 1.4 12 1.4 12s0 3.3.42 4.9c.23.86.9 1.53 1.9 1.92 1.62.43 8.28.43 8.28.43s6.66 0 8.28-.43a2.72 2.72 0 0 0 1.9-1.92c.42-1.6.42-4.9.42-4.9M9.9 15.1V8.9l5.4 3.1z"
        fill="currentColor"
      />
    ),
  },
];

export function SocialIcon({
  path,
  label,
  href,
}: {
  path: React.ReactElement;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="text-white/45 transition-colors hover:text-white"
    >
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]">
        {path}
      </svg>
    </a>
  );
}
