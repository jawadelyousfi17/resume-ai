// Where OAuth providers drop the user back. Supabase hands us a one-time
// code; trading it for a session is what actually signs them in.

import { NextResponse } from "next/server";
import { syncUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { siteOrigin } from "@/lib/site-url";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Not `new URL(request.url).origin` — behind a proxy that describes the
  // edge, not the host the user is on.
  const origin = await siteOrigin();
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  // The provider itself can refuse — the user hit "cancel", say.
  const providerError =
    searchParams.get("error_description") ?? searchParams.get("error");
  if (providerError) {
    return NextResponse.redirect(loginUrl(origin, providerError));
  }

  if (!code) {
    return NextResponse.redirect(
      loginUrl(origin, "That sign-in link is missing its code."),
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(
      loginUrl(origin, error?.message ?? "Could not complete sign-in."),
    );
  }

  // Mirror the identity into `users` so their resumes have something to hang
  // off, and pick up any name or avatar the provider shared.
  await syncUser(data.user);

  return NextResponse.redirect(`${origin}${next}`);
}

function loginUrl(origin: string, message: string) {
  return `${origin}/login?error=${encodeURIComponent(message)}`;
}

function safeNext(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }
  return value;
}
