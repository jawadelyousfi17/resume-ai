// Stand-in avatars, generated here rather than fetched from api.dicebear.com.
//
// These render inside every template preview, which means they sit in the
// critical path of the landing page and of all 32 template detail pages. A
// third-party request there is two things we don't want: an LCP dependency on
// somebody else's uptime, and a page that visibly breaks if they rate-limit us.
//
// Same library, same output — @dicebear/collection is what the HTTP API runs.
// Only the origin changes, so the illustrations are identical to before.

import { type Style, createAvatar } from "@dicebear/core";
import {
  adventurer,
  adventurerNeutral,
  avataaars,
  lorelei,
  micah,
  notionists,
  personas,
} from "@dicebear/collection";

import { AVATAR_BACKGROUNDS, type AvatarStyle } from "@/lib/avatar";

/**
 * The styles lib/avatar.ts is allowed to ask for. Anything else is a 400 —
 * this is a public endpoint and the style name indexes into a module.
 *
 * Typed against the core options rather than each style's own: every DiceBear
 * style declares its own `Options` (different mouths, different hair), so the
 * union of them doesn't unify. We only ever pass `seed`, `backgroundColor` and
 * `radius`, which are core and identical across all of them.
 */
const STYLES = {
  notionists,
  personas,
  lorelei,
  micah,
  adventurer,
  avataaars,
  "adventurer-neutral": adventurerNeutral,
} as unknown as Record<AvatarStyle, Style<Record<never, never>>>;

/** Nothing here depends on a request beyond its query, and the output for a
 *  given query never changes — so it caches forever, at the edge and in the
 *  browser. */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const style = params.get("style") ?? "notionists";
  const seed = params.get("seed") ?? "resume";

  if (!(style in STYLES)) {
    return new Response("Unknown avatar style", { status: 400 });
  }

  const svg = createAvatar(STYLES[style as AvatarStyle], {
    seed,
    backgroundColor: AVATAR_BACKGROUNDS,
    radius: 50,
  }).toString();

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      // Immutable: the seed and style fully determine the image.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
