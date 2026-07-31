import "server-only";

// A fixed-window rate limit, per client IP, held in this process's memory.
//
// Counting by address rather than by key means one key shared across a fleet
// of your own machines isn't throttled as if it were one caller, while a
// single box stuck in a loop still is.
//
// Deliberately modest: it exists so a loop with a bug can't spend a month of
// model budget in an afternoon, not to enforce a quota to the request. Each
// serverless instance counts on its own, so the real ceiling across a fleet is
// the limit times the number of warm instances. Anything stricter needs shared
// storage, and that is a change to make when there are enough callers to
// justify it rather than now.

/** Requests per window, per address. */
const DEFAULT_LIMIT = 20;
const WINDOW_MS = 60_000;

interface Window {
  count: number;
  /** When this window ends, in epoch milliseconds. */
  resetAt: number;
}

const windows = new Map<string, Window>();

export interface RateLimitResult {
  ok: boolean;
  limit: number;
  remaining: number;
  /** Epoch seconds, for the `X-RateLimit-Reset` header. */
  reset: number;
  /** Seconds until the window turns over, for `Retry-After`. */
  retryAfter: number;
}

function limit(): number {
  const configured = Number(process.env.MENIACV_API_RATE_LIMIT);
  return Number.isFinite(configured) && configured > 0
    ? Math.floor(configured)
    : DEFAULT_LIMIT;
}

/**
 * The address a request came from.
 *
 * Behind a proxy — which is every deployment of this app — the socket belongs
 * to the proxy, so the client is whatever it forwarded. The first entry in
 * `X-Forwarded-For` is the original client; the ones after it are the hops.
 *
 * A caller can put anything in that header, so this is not an identity: it is
 * a bucket key. Authentication is the API key's job, and it has already
 * happened by the time anything here is counted. With no header at all
 * everyone shares one bucket, which is the safe way to be wrong.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "unknown";
}

/** Counts one request against `id` and says whether it may proceed. */
export function rateLimit(id: string, now = Date.now()): RateLimitResult {
  const max = limit();
  const current = windows.get(id);

  if (!current || current.resetAt <= now) {
    // A new window is also the moment to drop the ones nobody came back to,
    // so an instance that has seen many keys doesn't hold them all forever.
    for (const [key, window] of windows) {
      if (window.resetAt <= now) windows.delete(key);
    }
    windows.set(id, { count: 1, resetAt: now + WINDOW_MS });
    return result(true, max, max - 1, now + WINDOW_MS, now);
  }

  current.count += 1;
  return result(
    current.count <= max,
    max,
    Math.max(0, max - current.count),
    current.resetAt,
    now,
  );
}

function result(
  ok: boolean,
  max: number,
  remaining: number,
  resetAt: number,
  now: number,
): RateLimitResult {
  return {
    ok,
    limit: max,
    remaining,
    reset: Math.ceil(resetAt / 1000),
    retryAfter: Math.max(1, Math.ceil((resetAt - now) / 1000)),
  };
}

/** The headers every answer carries, so a caller can pace itself without
 *  waiting to be refused. */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(result.reset),
  };
}
