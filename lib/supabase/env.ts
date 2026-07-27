// The two public Supabase values every client needs. Read through helpers so
// a missing key fails with a sentence you can act on rather than an opaque
// "Invalid URL" from deep inside the SDK.
//
// Both are NEXT_PUBLIC_ and safe in the browser: the anon key only grants what
// your row-level security policies allow.

export function supabaseUrl(): string {
  return required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function supabaseAnonKey(): string {
  // Supabase's newer projects issue a `sb_publishable_…` key; older ones a
  // JWT-shaped anon key. Accept either name so the value from the dashboard
  // works as pasted. Both are written out at build time, so reading them
  // through a `??` is fine.
  return required(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * The server-side key, if one is configured. Unlike the two above this must
 * never reach the browser: it bypasses row-level security entirely.
 *
 * Optional — without it the app simply can't store a signed-out visitor's
 * photo, which is the only thing that needs to write with no session.
 */
export function supabaseSecretKey(): string | undefined {
  // Newer projects issue an `sb_secret_…` key; older ones a service-role JWT.
  const value = (
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  )?.trim();
  return value || undefined;
}

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `${name} is not set. Copy .env.example to .env and fill it in from ` +
        "your Supabase project's API settings.",
    );
  }
  return value;
}
