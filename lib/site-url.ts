import "server-only";

import { headers } from "next/headers";

/**
 * The site's own origin, as configured — `NEXT_PUBLIC_SITE_URL` with any
 * trailing slash removed, or undefined when it isn't set.
 *
 * There is deliberately no fallback here. A guessed origin is worse than no
 * origin: a canonical tag pointing at the wrong host tells search engines the
 * page belongs somewhere else, and a baked-in localhost would do exactly that
 * on a deployment that forgot to set the variable.
 */
export function configuredSiteUrl(): string | undefined {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return value ? value.replace(/\/$/, "") : undefined;
}

/**
 * The origin to send OAuth callbacks back to, and to build sitemap URLs from.
 *
 * Prefers the configured value — behind a proxy or on a preview deployment the
 * request headers can describe the edge rather than the URL the user typed,
 * and a wrong origin here means the provider bounces them somewhere that can't
 * finish the sign-in. Falls back to the request when it isn't set, which is
 * what happens in local development.
 */
export async function siteOrigin(): Promise<string> {
  const configured = configuredSiteUrl();
  if (configured) return configured;

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol =
    headerList.get("x-forwarded-proto") ??
    (host?.startsWith("localhost") ? "http" : "https");

  return `${protocol}://${host}`;
}
