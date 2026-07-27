import "server-only";

// A print job that carries itself.
//
// The in-memory store next door works when one process both parks the job and
// serves the print page. On Vercel that stops being true: the export runs in
// one instance and the renderer — now a separate box entirely — asks a second
// one for /print/<token>, which has never heard of it.
//
// So when PRINT_SECRET is set the token *is* the job: the document, deflated,
// base64url'd, and signed with HMAC-SHA256. Any instance can read it, nobody
// can forge one, and it expires a minute after it's minted.

import { createHmac, timingSafeEqual } from "node:crypto";
import { deflateSync, inflateSync } from "node:zlib";

import type { PrintJob } from "./print-store";

const TTL_MS = 60_000;

/** Long tokens are the signed kind; a UUID from the memory store is not. */
export const isSignedToken = (token: string) => token.includes(".");

export function printSecret(): string | undefined {
  const value = process.env.PRINT_SECRET?.trim();
  return value || undefined;
}

const b64url = (buf: Buffer) => buf.toString("base64url");

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/** The job, packed into something that can travel in a URL. */
export function signPrintJob(job: PrintJob, secret: string): string {
  const body = b64url(
    deflateSync(
      Buffer.from(JSON.stringify({ ...job, exp: Date.now() + TTL_MS })),
    ),
  );
  return `${body}.${sign(body, secret)}`;
}

/** The job back out, or null if the signature, the shape or the clock says no. */
export function readSignedJob(
  token: string,
  secret: string,
): PrintJob | null {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = Buffer.from(sign(body, secret));
  const given = Buffer.from(signature);
  if (expected.length !== given.length) return null;
  if (!timingSafeEqual(expected, given)) return null;

  try {
    const parsed = JSON.parse(
      inflateSync(Buffer.from(body, "base64url")).toString(),
    ) as PrintJob & { exp?: number };

    if (!parsed?.kind || !parsed.data || !parsed.format) return null;
    if (typeof parsed.exp !== "number" || parsed.exp < Date.now()) return null;

    const { exp, ...job } = parsed;
    void exp;
    return job;
  } catch {
    return null;
  }
}
