import "server-only";

// Which examples have a card illustration.
//
// Read off the directory rather than kept as a list, so dropping a PNG into
// public/images/examples is the whole job of adding one — there is no second
// place to update and no way for the two to disagree. The set is built once,
// at module load; the page that uses it is static, so this happens at build
// time and costs a directory read.
//
// A slug with no file is not an error: the card renders without a band. Note
// that the read happens once per build — dropping a file in while `next dev`
// is running needs the module to change before it is seen again.

import { readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = join(process.cwd(), "public", "images", "examples");

const AVAILABLE: ReadonlySet<string> = (() => {
  try {
    return new Set(
      readdirSync(DIR)
        .filter((file) => file.endsWith(".png"))
        .map((file) => file.slice(0, -".png".length)),
    );
  } catch {
    // No directory at all — every card goes without, which is the same
    // outcome as an empty one.
    return new Set<string>();
  }
})();

/** The card illustration for this example, or null where none is drawn yet. */
export function exampleArt(slug: string): string | null {
  return AVAILABLE.has(slug) ? `/images/examples/${slug}.png` : null;
}
