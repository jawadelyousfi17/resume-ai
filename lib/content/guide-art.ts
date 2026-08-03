import "server-only";

// Which guides have an illustration, read off the directory rather than kept
// as a list — dropping a PNG into public/images/guides is the whole job of
// adding one. The same arrangement as lib/content/example-art.ts, and for the
// same reason: two places to update is one place to disagree.
//
// A slug with no file is not an error: the card and the guide's header both
// render without a picture. The read happens once per build, so a file added
// while `next dev` is running needs the module to change before it is seen.

import { readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = join(process.cwd(), "public", "images", "guides");

const AVAILABLE: ReadonlySet<string> = (() => {
  try {
    return new Set(
      readdirSync(DIR)
        .filter((file) => file.endsWith(".png"))
        .map((file) => file.slice(0, -".png".length)),
    );
  } catch {
    // No directory at all — every guide goes without, which is the same
    // outcome as an empty one.
    return new Set<string>();
  }
})();

/** The illustration for this guide, or null where none is drawn yet. */
export function guideArt(slug: string): string | null {
  return AVAILABLE.has(slug) ? `/images/guides/${slug}.png` : null;
}
