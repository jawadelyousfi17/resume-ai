// Kept out of app/auth/actions.ts because a "use server" module may only
// export async functions.

/** `linkedin_oidc` is LinkedIn's current OpenID Connect integration — the
 *  older `linkedin` provider is retired. Both must be enabled and given
 *  client credentials in the Supabase dashboard before they'll work. */
export const OAUTH_PROVIDERS = [
  { id: "google", label: "Google" },
  { id: "linkedin_oidc", label: "LinkedIn" },
] as const;

export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number]["id"];

export function isOAuthProvider(value: unknown): value is OAuthProvider {
  return (
    typeof value === "string" &&
    OAUTH_PROVIDERS.some((provider) => provider.id === value)
  );
}
