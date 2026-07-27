import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { prisma } from "./prisma";
import { randomAccountAvatarUrl } from "./avatar";
import { createClient } from "./supabase/server";
import type { User } from "@/generated/prisma/client";

/**
 * The signed-in Supabase user, or null.
 *
 * Uses `getUser()` rather than `getSession()`: the session comes straight from
 * a cookie the browser could have written, while `getUser()` validates the
 * token with Supabase before trusting it. Memoized per render pass so a page
 * calling it from several components pays for one round trip.
 */
export const getAuthUser = cache(async (): Promise<SupabaseUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/**
 * The signed-in user's app-side row, creating it on first sight.
 *
 * Redirects to /login when nobody is signed in, so callers can treat the
 * return value as a guarantee. Every read and write of resume data goes
 * through here — the proxy's check is a nicety, this is the real gate.
 */
export const requireUser = cache(async (): Promise<User> => {
  const authUser = await getAuthUser();
  if (!authUser) redirect("/login");

  const existing = await prisma.user.findUnique({ where: { id: authUser.id } });
  if (existing) {
    // Accounts created before avatars existed have nothing to show. Mint one
    // now — a single write, and then never again for that row.
    if (!existing.avatarUrl) {
      return prisma.user.update({
        where: { id: existing.id },
        data: { avatarUrl: randomAccountAvatarUrl() },
      });
    }
    return existing;
  }

  // First request after a sign-in that skipped syncUser — mirror the row now
  // rather than failing a foreign key later.
  return syncUser(authUser);
});

/**
 * Copies a Supabase identity into the `users` table.
 *
 * Called on every successful sign-in, so profile details from OAuth providers
 * stay current. Prisma can't see Supabase's `auth.users`, and a database
 * trigger would live outside this repo where nobody would find it.
 */
export async function syncUser(authUser: SupabaseUser): Promise<User> {
  const email = authUser.email ?? `${authUser.id}@users.noreply.local`;
  const metadata = authUser.user_metadata ?? {};
  const name =
    pickString(metadata.full_name) ??
    pickString(metadata.name) ??
    pickString(metadata.user_name) ??
    null;
  const avatarUrl =
    pickString(metadata.avatar_url) ?? pickString(metadata.picture) ?? null;

  return prisma.user.upsert({
    where: { id: authUser.id },
    create: {
      id: authUser.id,
      email,
      name,
      // The provider's photo when there is one — email and password sign-ups
      // arrive without. Otherwise a random `adventurer-neutral` portrait,
      // minted here and only here, so it stays theirs from then on.
      avatarUrl: avatarUrl ?? randomAccountAvatarUrl(),
    },
    // Only overwrite a provider-supplied field when the provider supplied one.
    update: {
      email,
      ...(name ? { name } : {}),
      ...(avatarUrl ? { avatarUrl } : {}),
    },
  });
}

/** `user_metadata` is untyped JSON — take the value only if it's a real
 *  non-empty string. */
function pickString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
