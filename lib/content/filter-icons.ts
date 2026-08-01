import "server-only";

// Which template filters have a drawn icon.
//
// Same arrangement as lib/content/example-art: read off the directory at module
// load rather than kept as a list, so dropping a PNG named after the filter's
// slug into public/images/filters is the whole job. A slug with no file falls
// back to the line glyph the filter index has always used, so the grid is never
// missing a tile.
//
// The read happens once per build — dropping a file in while `next dev` is
// running needs the module to change before it is seen again.

import { readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = join(process.cwd(), "public", "images", "filters");

const AVAILABLE: ReadonlySet<string> = (() => {
  try {
    return new Set(
      readdirSync(DIR)
        .filter((file) => file.endsWith(".png"))
        .map((file) => file.slice(0, -".png".length)),
    );
  } catch {
    return new Set<string>();
  }
})();

/** The drawn icon for this filter, or null where none exists yet. */
export function filterIcon(slug: string): string | null {
  return AVAILABLE.has(slug) ? `/images/filters/${slug}.png` : null;
}

/** The same chips the filter row is built from, each carrying its icon.
 *
 *  Done here rather than in filterChips() so lib/content/template-filters
 *  keeps knowing nothing about the filesystem — and so the gallery, which is a
 *  client component, is handed a path rather than a way to look one up. */
export function chipsWithIcons<T extends { slug: string }>(
  chips: T[],
): (T & { icon: string | null })[] {
  return chips.map((chip) => ({ ...chip, icon: filterIcon(chip.slug) }));
}
