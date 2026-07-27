// Reads a job posting off a URL so the tailor can score against it.
//
// This is the one place in the app that fetches a URL the user chose, which
// makes it the one place that can be pointed at the network the server sits
// on. So: https only, the resolved address must be public, no redirects
// followed blindly, a hard timeout, and a size cap. What comes back is text —
// scripts, styles and markup are stripped before it leaves here.

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

import { getAuthUser } from "@/lib/auth";

export const runtime = "nodejs";
export const maxDuration = 30;

const TIMEOUT_MS = 8000;
const MAX_BYTES = 1_500_000;
/** Enough for any posting; the scorer only reads the first few thousand. */
const MAX_CHARS = 20_000;
const MAX_REDIRECTS = 3;

export async function POST(req: Request) {
  // Same rule as the other AI-adjacent routes: an account, so the fetcher
  // can't be used anonymously as a proxy.
  if (!(await getAuthUser())) return jsonError("Not signed in", 401);

  const body = (await req.json().catch(() => null)) as { url?: string } | null;
  const start = body?.url?.trim();
  if (!start) return jsonError("Paste a link to the posting.", 400);

  let url: URL;
  try {
    url = new URL(start);
  } catch {
    return jsonError("That doesn't look like a link.", 400);
  }

  try {
    const html = await read(url);
    const text = toText(html);
    if (text.length < 120) {
      return jsonError(
        "That page didn't give up much text — paste the description instead.",
        422,
      );
    }
    return Response.json({
      text: text.slice(0, MAX_CHARS),
      url: url.toString(),
    });
  } catch (err) {
    return jsonError(
      err instanceof PostingError
        ? err.message
        : "Couldn't read that page. Paste the description instead.",
      err instanceof PostingError ? err.status : 502,
    );
  }
}

class PostingError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

/** Follows redirects by hand, checking every hop rather than only the first. */
async function read(start: URL): Promise<string> {
  let url = start;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    await assertPublic(url);

    const res = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        // Some boards serve an empty shell to anything that doesn't look like
        // a browser. This says what it is rather than pretending to be one.
        "User-Agent": "maniacv/1.0 (+resume tailoring; one page, on request)",
        Accept: "text/html,text/plain;q=0.9",
      },
    });

    if (res.status >= 300 && res.status < 400) {
      const next = res.headers.get("location");
      if (!next) throw new PostingError("That link went nowhere.", 502);
      url = new URL(next, url);
      continue;
    }

    if (!res.ok) {
      throw new PostingError(
        res.status === 403 || res.status === 401
          ? "That site won't let us read the posting — paste the description instead."
          : `The page answered ${res.status}.`,
        502,
      );
    }

    const type = res.headers.get("content-type") ?? "";
    if (!/text\/html|text\/plain/.test(type)) {
      throw new PostingError("That link isn't a web page.", 415);
    }

    return await readCapped(res);
  }

  throw new PostingError("That link redirects too many times.", 502);
}

/** Reads at most MAX_BYTES, so a huge or endless response can't fill memory. */
async function readCapped(res: Response): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) return "";

  const decoder = new TextDecoder();
  let out = "";
  let size = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    out += decoder.decode(value, { stream: true });
    if (size > MAX_BYTES) {
      await reader.cancel();
      break;
    }
  }

  return out;
}

/** https, a real hostname, and an address outside every private range. */
async function assertPublic(url: URL) {
  if (url.protocol !== "https:") {
    throw new PostingError("Only https links can be read.", 400);
  }

  const host = url.hostname.replace(/^\[|\]$/g, "");
  const addresses = isIP(host)
    ? [{ address: host }]
    : await lookup(host, { all: true }).catch(() => {
        throw new PostingError("That host doesn't resolve.", 400);
      });

  for (const { address } of addresses) {
    if (isPrivate(address)) {
      throw new PostingError("That address isn't reachable from here.", 400);
    }
  }
}

/** Loopback, link-local, private and carrier ranges, v4 and v6. */
function isPrivate(address: string): boolean {
  if (isIP(address) === 6) {
    const ip = address.toLowerCase();
    if (ip === "::1" || ip === "::") return true;
    // Unique-local (fc00::/7) and link-local (fe80::/10).
    if (/^f[cd]/.test(ip) || /^fe[89ab]/.test(ip)) return true;
    // ::ffff:10.0.0.1 and friends.
    const mapped = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    return mapped ? isPrivate(mapped[1]) : false;
  }

  const [a, b] = address.split(".").map(Number);
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 100 && b >= 64 && b <= 127) ||
    a >= 224
  );
}

/** Markup in, readable text out. */
function toText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<\/(p|div|li|h[1-6]|section|article|br)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*/g, "\n")
    .trim();
}

function jsonError(error: string, status: number) {
  return Response.json({ error }, { status });
}
