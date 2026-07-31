import "server-only";

// Who is allowed to call the public API.
//
// Keys live in the environment — `MENIACV_API_KEYS`, comma-separated — rather
// than in the database. There is no self-serve signup for this API: keys are
// handed out by us, revoked by editing the variable and redeploying, and
// rotated by listing the new one alongside the old until callers have moved.
// A table would buy per-key usage rows and nothing else we need yet.
//
// Nothing here logs a key. The label a key carries is what gets logged.

import { timingSafeEqual } from "node:crypto";

/** A caller, once their key checked out. `label` is the part of a key before
 *  the first colon, if it has one — `partner-app:sk_live_…` identifies who is
 *  calling in a log line without putting the secret in it. */
export interface ApiCaller {
  label: string;
}

/** The configured keys, parsed once. Empty means the API is switched off —
 *  a deployment that forgot the variable must not become an open endpoint. */
function configuredKeys(): string[] {
  return (process.env.MENIACV_API_KEYS ?? "")
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean);
}

export const isEnabled = () => configuredKeys().length > 0;

/** The key presented, from either header. `Authorization: Bearer …` is the
 *  documented one; `X-Api-Key` is accepted because half the HTTP clients in
 *  the world reach for it first. */
export function presentedKey(headers: Headers): string | null {
  const auth = headers.get("authorization");
  if (auth) {
    const [scheme, ...rest] = auth.trim().split(/\s+/);
    const value = rest.join(" ").trim();
    if (scheme?.toLowerCase() === "bearer" && value) return value;
    // A bare key with no scheme is a common enough mistake to accept.
    if (!rest.length && scheme) return scheme;
    return null;
  }
  return headers.get("x-api-key")?.trim() || null;
}

/**
 * The caller behind a request, or null.
 *
 * Compared with `timingSafeEqual` against every configured key: the number of
 * keys is small, and comparing all of them keeps the answer's cost independent
 * of which one matched.
 */
export function authenticate(headers: Headers): ApiCaller | null {
  const presented = presentedKey(headers);
  if (!presented) return null;

  const given = Buffer.from(presented);
  let matched: string | null = null;

  for (const key of configuredKeys()) {
    const expected = Buffer.from(key);
    if (expected.length !== given.length) continue;
    if (timingSafeEqual(expected, given)) matched = key;
  }

  if (!matched) return null;

  return { label: matched.includes(":") ? matched.split(":")[0]! : "default" };
}
