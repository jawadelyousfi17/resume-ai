"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { syncUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { siteOrigin } from "@/lib/site-url";
import { credentialsSchema } from "@/lib/validation";
import { isOAuthProvider } from "@/lib/auth-providers";

export type AuthFormState = {
  error?: string;
  /** Shown when a sign-up needs the user to go and click a link in an email. */
  notice?: string;
};

export async function signInAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    // Don't spell out which half was wrong — that tells an attacker which
    // addresses have accounts.
    return { error: "Enter your email and password." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error || !data.user) {
    return { error: error?.message ?? "Could not sign you in." };
  }

  await syncUser(data.user);
  revalidatePath("/", "layout");
  redirect(safeNext(formData.get("next")));
}

export async function signUpAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp(parsed.data);

  if (error) return { error: error.message };

  // With email confirmation switched off in the Supabase dashboard, signUp
  // returns a session and the user is in. With it on, there's no session yet
  // and they have to click the link first — handle both so turning the
  // setting back on doesn't strand anyone on a blank screen.
  if (!data.session || !data.user) {
    return {
      notice: "Check your email for a confirmation link to finish signing up.",
    };
  }

  await syncUser(data.user);
  revalidatePath("/", "layout");
  redirect(safeNext(formData.get("next")));
}

/** Hands off to a provider. The browser is redirected to the provider's
 *  consent screen, which sends it back to /auth/callback with a code. */
export async function signInWithProviderAction(formData: FormData) {
  const provider = formData.get("provider");
  if (!isOAuthProvider(provider)) {
    redirect("/login?error=Unknown+sign-in+provider");
  }

  const origin = await siteOrigin();
  const next = safeNext(formData.get("next"));

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error || !data.url) {
    redirect(
      `/login?error=${encodeURIComponent(error?.message ?? "Could not reach that provider.")}`,
    );
  }

  redirect(data.url);
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

/** Only ever redirect within this app — an attacker-supplied `next` of
 *  `https://evil.example` would otherwise be an open redirect. */
function safeNext(value: FormDataEntryValue | string | null): string {
  if (typeof value !== "string") return "/dashboard";
  if (!value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}
