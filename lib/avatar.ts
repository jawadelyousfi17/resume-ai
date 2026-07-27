// Stand-in avatars, from DiceBear.
//
// Templates that reserve space for a photo look wrong with an empty circle in
// it, and most people haven't uploaded one. DiceBear fills the gap with a
// generated illustration — clearly not a photograph, so nobody mistakes it for
// the real thing, but the layout reads as intended.
//
// The style and seed are derived from the name rather than randomised at call
// time: the same person gets the same avatar on every render, which matters
// because this renders on the server as well as the client, and a value that
// differed between the two would blow up hydration.

/** Illustration styles that read as a portrait rather than a cartoon. */
const STYLES = [
  "notionists",
  "personas",
  "lorelei",
  "micah",
  "adventurer",
  "avataaars",
] as const;

/** FNV-1a. Small, stable, and no dependency — all this needs is to spread
 *  names across the style list without clustering. */
function hash(value: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * A DiceBear avatar URL for whoever this resume belongs to.
 *
 * `seed` is normally the person's name; an empty one still produces a valid
 * avatar, so a blank resume renders with something in the frame.
 */
export function avatarUrl(seed: string): string {
  const key = seed.trim() || "resume";
  const style = STYLES[hash(key) % STYLES.length];

  const params = new URLSearchParams({
    seed: key,
    // A neutral wash behind the illustration so it reads as a portrait frame
    // rather than a sticker floating on the page.
    backgroundColor: "e9edf2,dfe5ec,eef1f5",
    radius: "50",
  });

  return `https://api.dicebear.com/9.x/${style}/svg?${params}`;
}

/* ---------------------------------------------------------------------------
   Account avatars.

   Different job from the one above. That picks a portrait for whoever a resume
   is about, from their name, on every render. This one is minted once, when the
   account is created, and stored on the user row — so it is theirs, it does not
   move when they change their name, and it survives a change to the code that
   generated it.
   --------------------------------------------------------------------------- */

/** One style for every account, so the sidebar reads as one product rather
 *  than a sampler. Neutral: no expression to misread as a mood. */
const ACCOUNT_STYLE = "adventurer-neutral";

/** A DiceBear `adventurer-neutral` portrait for the given seed. */
export function accountAvatarUrl(seed: string): string {
  const params = new URLSearchParams({
    seed: seed.trim() || "maniacv",
    backgroundColor: "e9edf2,dfe5ec,eef1f5",
    radius: "50",
  });

  return `https://api.dicebear.com/9.x/${ACCOUNT_STYLE}/svg?${params}`;
}

/** A fresh portrait, picked at random.
 *
 *  Random rather than derived from the email: two people who sign up minutes
 *  apart should not be able to guess each other's avatar from an address, and
 *  the value is stored anyway, so there is nothing to recompute. */
export function randomAccountAvatarUrl(): string {
  return accountAvatarUrl(crypto.randomUUID());
}

/** Whether a stored avatar is one we generated. Lets a provider photo take
 *  precedence without a second column to record where the URL came from. */
export function isGeneratedAvatar(url: string | null): boolean {
  return Boolean(url?.startsWith("https://api.dicebear.com/"));
}
