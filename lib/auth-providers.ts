// Kept out of app/auth/actions.ts because a "use server" module may only
// export async functions.

/** `linkedin_oidc` is LinkedIn's current OpenID Connect integration — the
 *  older `linkedin` provider is retired. Both must be enabled and given
 *  client credentials in the Supabase dashboard before they'll work.
 *
 *  `enabled` is what the app offers today. A way in that's switched off is
 *  still drawn on the card, greyed out and labelled: people look for the
 *  button they used last time, and a missing one reads as "this site lost my
 *  account" where a disabled one reads as "not yet". */
export const OAUTH_PROVIDERS = [
  { id: "google", label: "Google", enabled: true },
  { id: "linkedin_oidc", label: "LinkedIn", enabled: false },
] as const;

export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number]["id"];

/** Email and password sign-in, on the same footing as the providers above.
 *  Off while everyone comes in through Google. */
export const CREDENTIALS_ENABLED = false;

/** What a switched-off way in says, wherever it's said. */
export const SIGN_IN_DISABLED = "Not open yet — continue with Google for now.";

/**
 * Where the post-sign-in destination rides while the user is off at the
 * provider.
 *
 * It used to be a query param on the callback URL. Supabase matches
 * `redirectTo` against the dashboard's Redirect URLs allow list as a whole
 * string, so `/auth/callback?next=%2Fdashboard` did not match the registered
 * `/auth/callback` — Supabase discarded it and fell back to the dashboard Site
 * URL, dropping users on `/?code=…` where nothing trades the code for a
 * session. A cookie keeps the callback URL exactly as registered.
 */
export const OAUTH_NEXT_COOKIE = "meniacv-oauth-next";

export function isOAuthProvider(value: unknown): value is OAuthProvider {
  return (
    typeof value === "string" &&
    OAUTH_PROVIDERS.some((provider) => provider.id === value)
  );
}

/** Whether the app will actually hand off to that provider. A disabled button
 *  is a courtesy; this is the check that means it. */
export function isProviderEnabled(value: unknown): value is OAuthProvider {
  return OAUTH_PROVIDERS.some(
    (provider) => provider.id === value && provider.enabled,
  );
}
