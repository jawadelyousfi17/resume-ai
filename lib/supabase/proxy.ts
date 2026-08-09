import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./env";

/** API routes a signed-out visitor may call. Writing a resume needs an
 *  account, so nearly every route under /api does too. The exception is the
 *  public extractor, which authenticates callers with an API key of its own
 *  and would never have a session cookie. The marketing and guide pages stay
 *  public and crawlable — this list is only about /api. */
const PUBLIC_API_PATHS: string[] = [
  "/api/v1/extract",
  // The MCP server, which authenticates with the same API keys the extractor
  // does and likewise never carries a session cookie. Its own 401 is a
  // JSON-RPC error object with a `WWW-Authenticate` challenge, which is what
  // an MCP client knows how to read — this one would answer `Not signed in`
  // and tell it nothing.
  "/api/mcp",
  // Stand-in avatars. These render inside the template previews on the landing
  // page and on all 32 template detail pages, so a signed-out visitor — and
  // every crawler — has to be able to fetch them. The route takes a style and
  // a seed, reads nothing and stores nothing.
  "/api/avatar",
  // Whop telling us somebody paid. It's a server calling a server, so there is
  // no session cookie and never will be — the route holds it to its signature
  // instead, which is the stronger check: an HMAC over the exact bytes sent,
  // verified before a single field is read. Left off this list it would 401
  // every delivery, and plans nobody was given would look like a billing
  // problem rather than a routing one.
  "/api/whop/webhook",
];

/** Exact matches only. A prefix match would have let `/api/compile/cover-letter`
 *  in behind `/api/compile`, and a route nested under a public one is not
 *  itself a reason to make it public — cover letters need an account. New
 *  public routes go in the list above, one line each. */
function isPublicApi(pathname: string) {
  return PUBLIC_API_PATHS.includes(pathname);
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
  const stray = strayCallback(request);
  if (stray) return NextResponse.redirect(stray);

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

/**
 * A sign-in that came back to the wrong place, forwarded to the route that can
 * finish it.
 *
 * Supabase only honours a `redirectTo` that matches its Redirect URLs allow
 * list. When it doesn't match it doesn't fail loudly — it quietly falls back to
 * the dashboard Site URL, so the provider's `?code=` lands on the landing page,
 * which is static, reads no search params, and drops it. The user arrives back
 * signed out with no error to explain why.
 *
 * The origins are easy to get out of step precisely where it's hardest to
 * notice: the callback URL is built from NEXT_PUBLIC_SITE_URL, or from the
 * request headers when that isn't set, and behind a proxy those describe the
 * edge — a platform hostname or a per-deploy preview URL that was never
 * allow-listed. Locally, where the header is plain `localhost:3000`, it matches
 * and everything works.
 *
 * So treat the fallback as a route rather than a dead end. The Site URL is
 * allow-listed by definition — it's what Supabase falls back *to* — and the
 * hop is same-origin, so the PKCE verifier cookie rides along and the exchange
 * succeeds. Returns null for ordinary traffic, which is nearly all of it.
 *
 * This is a safety net, not the fix: the allow list is still worth correcting,
 * or every sign-in pays a redirect it didn't need.
 */
function strayCallback(request: NextRequest): URL | null {
  const { pathname, searchParams } = request.nextUrl;
  if (pathname !== "/") return null;

  // `code` is the sign-in itself; the error pair is the provider refusing, and
  // is worth forwarding too so the login page can say what went wrong instead
  // of showing a landing page as though nothing had been attempted.
  const isCallback =
    searchParams.has("code") ||
    searchParams.has("error") ||
    searchParams.has("error_description");
  if (!isCallback) return null;

  const url = request.nextUrl.clone();
  url.pathname = "/auth/callback";
  return url;
}

/** Carries the refreshed auth cookies onto a redirect we're returning
 *  instead of the response the Supabase client wrote to. */
function withCookies(target: NextResponse, source: NextResponse) {
  for (const cookie of source.cookies.getAll()) {
    target.cookies.set(cookie);
  }
  return target;
}
