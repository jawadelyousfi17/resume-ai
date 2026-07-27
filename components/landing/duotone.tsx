// The three marks under the hero, drawn as duotone.
//
// Same construction as the app's own set in public/svgs — 24×24, solid fills,
// no strokes, rounded corners — but each glyph is split in two: a backing shape
// at a quarter opacity and the part that carries the meaning at full strength.
// Both take `currentColor`, so a mark is still coloured by the text colour it
// inherits and works on cream or on the navy band.

import type { SVGProps } from "react";

import { cn } from "@/lib/utils";

function duotone(back: string, front: string) {
  const Icon = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cn("h-6 w-6 shrink-0", className)}
      {...props}
    >
      <path d={back} opacity="0.26" />
      <path d={front} />
    </svg>
  );
  Icon.displayName = "DuotoneIcon";
  return Icon;
}

/** First resume, free forever. Handles behind, cup in front. */
export const TrophyIcon = duotone(
  // Handles, one each side.
  "M6.6 4.6H4.4A2.4 2.4 0 0 0 2 7c0 2.6 1.9 4.8 4.5 5.2l.3-2A3.2 3.2 0 0 1 4 7c0-.2.2-.4.4-.4h2.2v-2Zm10.8 0h2.2A2.4 2.4 0 0 1 22 7c0 2.6-1.9 4.8-4.5 5.2l-.3-2A3.2 3.2 0 0 0 20 7c0-.2-.2-.4-.4-.4h-2.2v-2Z",
  // Cup, stem and base.
  "M6 3.6c0-.6.5-1.1 1.1-1.1h9.8c.6 0 1.1.5 1.1 1.1v4.9a6 6 0 1 1-12 0V3.6ZM11 14.3h2v3.5h-2v-3.5Zm-3.4 4.6c0-.6.5-1.1 1.1-1.1h6.6c.6 0 1.1.5 1.1 1.1v1.4c0 .6-.5 1.1-1.1 1.1H8.7c-.6 0-1.1-.5-1.1-1.1v-1.4Z",
);

/** Privacy — the eye is the backing, what's over it is the point. */
export const PrivateEyeIcon = duotone(
  "M12 4.8c-4.6 0-8.4 3.1-10 6.6a1.4 1.4 0 0 0 0 1.2c1.6 3.5 5.4 6.6 10 6.6s8.4-3.1 10-6.6a1.4 1.4 0 0 0 0-1.2c-1.6-3.5-5.4-6.6-10-6.6Z",
  "M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2ZM4.4 3a1.1 1.1 0 0 0-1.5 1.5l16.6 16.6a1.1 1.1 0 0 0 1.5-1.5L4.4 3Z",
);

/** Unlimited downloads. The tray holds; the arrow moves. */
export const DownloadDuotoneIcon = duotone(
  "M2.9 14.2a1.1 1.1 0 0 1 2.2 0v3.1c0 .5.4.9.9.9h12c.5 0 .9-.4.9-.9v-3.1a1.1 1.1 0 0 1 2.2 0v3.1a3.1 3.1 0 0 1-3.1 3.1H6a3.1 3.1 0 0 1-3.1-3.1v-3.1Z",
  "M10.9 3.6a1.1 1.1 0 0 1 2.2 0v8.5l2.3-2.3a1.1 1.1 0 0 1 1.6 1.6l-4.2 4.2a1.1 1.1 0 0 1-1.6 0L7 11.4a1.1 1.1 0 0 1 1.6-1.6l2.3 2.3V3.6Z",
);

/** Every template. Three quiet panes and the one you're looking at. */
export const GalleryIcon = duotone(
  "M13.6 2.6h5.8c1.1 0 2 .9 2 2v5.8c0 1.1-.9 2-2 2h-5.8c-1.1 0-2-.9-2-2V4.6c0-1.1.9-2 2-2Zm0 11.2h5.8c1.1 0 2 .9 2 2v3.6c0 1.1-.9 2-2 2h-5.8c-1.1 0-2-.9-2-2v-3.6c0-1.1.9-2 2-2Z",
  "M4.6 2.6h3.6c1.1 0 2 .9 2 2v14.8c0 1.1-.9 2-2 2H4.6c-1.1 0-2-.9-2-2V4.6c0-1.1.9-2 2-2Z",
);

/** Import or start fresh — a page arriving on top of the ones you have. */
export const LayersIcon = duotone(
  "M2.6 13.1a1.1 1.1 0 0 1 1.5-.5l7.9 4 7.9-4a1.1 1.1 0 1 1 1 2l-8.4 4.3a1.1 1.1 0 0 1-1 0L3.1 14.6a1.1 1.1 0 0 1-.5-1.5Z",
  "M11.5 2.7a1.1 1.1 0 0 1 1 0l8.4 4.2a1.1 1.1 0 0 1 0 2l-8.4 4.2a1.1 1.1 0 0 1-1 0L3.1 8.9a1.1 1.1 0 0 1 0-2l8.4-4.2Z",
);

/** The AI tools. Sparks behind, the wand itself in front. */
export const WandDuotoneIcon = duotone(
  "M17.6 2.4c.3 0 .6.2.7.5l.5 1.6 1.6.5a.7.7 0 0 1 0 1.4l-1.6.5-.5 1.6a.7.7 0 0 1-1.4 0l-.5-1.6-1.6-.5a.7.7 0 0 1 0-1.4l1.6-.5.5-1.6c.1-.3.4-.5.7-.5ZM6.2 2.4c.3 0 .6.2.7.5l.3 1 1 .3a.7.7 0 0 1 0 1.4l-1 .3-.3 1a.7.7 0 0 1-1.4 0l-.3-1-1-.3a.7.7 0 0 1 0-1.4l1-.3.3-1c.1-.3.4-.5.7-.5Zm13 12.2c.3 0 .6.2.7.5l.3 1 1 .3a.7.7 0 0 1 0 1.4l-1 .3-.3 1a.7.7 0 0 1-1.4 0l-.3-1-1-.3a.7.7 0 0 1 0-1.4l1-.3.3-1c.1-.3.4-.5.7-.5Z",
  "M13.2 5.9a2 2 0 0 1 2.9 0l2 2a2 2 0 0 1 0 2.9l-8.3 8.3a2 2 0 0 1-2.9 0l-2-2a2 2 0 0 1 0-2.9l8.3-8.3Zm-.7 3.6L4.4 17.6l2 2 8.1-8.1-2-2Z",
);
