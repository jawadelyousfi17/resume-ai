import "server-only";

import { headers } from "next/headers";

/**
 * The origin to send OAuth callbacks back to.
 *
 * Prefers `NEXT_PUBLIC_SITE_URL` — behind a proxy or on a preview deployment
 * the request headers can describe the edge rather than the URL the user
 * typed, and a wrong origin here means the provider bounces them somewhere
 * that can't finish the sign-in. Falls back to the request when it isn't set,
 * which is what happens in local development.
 */
export async function siteOrigin(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol =
    headerList.get("x-forwarded-proto") ??
    (host?.startsWith("localhost") ? "http" : "https");

  return `${protocol}://${host}`;
}
