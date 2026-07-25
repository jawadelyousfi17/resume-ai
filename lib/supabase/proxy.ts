import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./env";

/** API routes a signed-out visitor may call. Everything else under /api is
 *  turned away here; the pages are all public, because the app works as a
 *  guest and the marketing and guide pages have to be crawlable. */
const PUBLIC_API_PATHS = ["/api/compile"];

function isPublicApi(pathname: string) {
  return PUBLIC_API_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

/**
 * Refreshes the Supabase session on every request, and keeps signed-out
 * traffic out of the routes that need an account.
 *
 * Access tokens are short-lived, so something has to trade the refresh token
 * for a new one and write the rotated cookies back. Server Components can't —
 * their cookie store is read-only — which is why this runs in the proxy.
 *
 * This is an *optimistic* gate: it only reads the session. Ownership is
 * enforced again in lib/resumes.ts, next to the data.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl(), supabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        // Keeps a CDN from caching a response that carries someone's session.
        for (const [key, value] of Object.entries(headers)) {
          response.headers.set(key, value);
        }
      },
    },
  });

  // Do not put code between the client above and this call: `getUser()` is
  // what triggers the refresh, and anything in between can end up reading a
  // session that's already expired.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // API routes answer with a status, not a redirect to a login page. The ones
  // that are fine for guests are listed above; the rest still do their own
  // check, since the proxy is an optimistic gate.
  if (!user && pathname.startsWith("/api/") && !isPublicApi(pathname)) {
    return withCookies(
      NextResponse.json({ error: "Not signed in" }, { status: 401 }),
      response,
    );
  }

  // Already signed in — no reason to show them the login page.
  if (user && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return withCookies(NextResponse.redirect(url), response);
  }

  // Return this exact response so the refreshed cookies survive.
  return response;
}

/** Carries the refreshed auth cookies onto a redirect we're returning
 *  instead of the response the Supabase client wrote to. */
function withCookies(target: NextResponse, source: NextResponse) {
  for (const cookie of source.cookies.getAll()) {
    target.cookies.set(cookie);
  }
  return target;
}
