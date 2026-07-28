import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { prisma } from "./prisma";
import { randomAccountAvatarUrl } from "./avatar";
import { grantEarlySupporter } from "./early-supporter";
import { CREDENTIALS_ENABLED } from "./auth-providers";
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

  const claimedEmail = await claimEmail(authUser, email);

  const user = await prisma.user.upsert({
    where: { id: authUser.id },
    create: {
      id: authUser.id,
      email: claimedEmail,
      name,
      // The provider's photo when there is one — email and password sign-ups
      // arrive without. Otherwise a random `adventurer-neutral` portrait,
      // minted here and only here, so it stays theirs from then on.
      avatarUrl: avatarUrl ?? randomAccountAvatarUrl(),
    },
    // Only overwrite a provider-supplied field when the provider supplied one.
    update: {
      email: claimedEmail,
      ...(name ? { name } : {}),
      ...(avatarUrl ? { avatarUrl } : {}),
    },
  });

  // The launch offer. Runs on every sign-in rather than only on the first:
  // it settles into a single read once someone has a subscription, and an
  // account that arrived while the offer was open still gets it if the grant
  // was missed the first time round.
  await grantEarlySupporter(user);

  return user;
}

/**
 * Settles the case where that address is already on somebody's row.
 *
 * Rows here are keyed by the Supabase user id, but the same person can arrive
 * under a new one — they signed up with a password and came back through
 * Google, or the auth project was rebuilt around data this app kept. Their
 * resumes would be stranded on the old row, and the unique index on `email`
 * would fail the sign-in outright rather than quietly making a second account.
 *
 * So when the provider has verified the address, the old row is re-keyed to
 * the new id and everything hanging off it — resumes, letters, subscription —
 * comes along: every foreign key to `users` is `ON UPDATE CASCADE`.
 *
 * Without that proof the accounts stay apart, and the new one gets an address
 * that can't collide. Handing over someone else's resumes on the strength of a
 * typed-in address is the one outcome worse than a duplicate account.
 *
 * Returns the address the row should carry.
 */
async function claimEmail(
  authUser: SupabaseUser,
  email: string,
): Promise<string> {
  const holder = await prisma.user.findUnique({ where: { email } });
  if (!holder || holder.id === authUser.id) return email;

  if (!emailIsVerified(authUser)) return `${authUser.id}@users.noreply.local`;

  await prisma.user.update({
    where: { id: holder.id },
    data: { id: authUser.id },
  });
  return email;
}

/** Whether anyone has actually checked that the address belongs to them. */
function emailIsVerified(authUser: SupabaseUser): boolean {
  // The provider's own claim. Google and the other OIDC providers set it.
  if (authUser.user_metadata?.email_verified === true) return true;

  // Supabase stamps this when it accepts an address. While email and password
  // sign-up is switched off, the only way to have one is to have come through
  // a provider that checked — so it counts. If credentials come back, and
  // Supabase is still creating accounts without confirming them, it stops
  // being proof of anything and this line stops trusting it.
  return !CREDENTIALS_ENABLED && Boolean(authUser.email_confirmed_at);
}

/** `user_metadata` is untyped JSON — take the value only if it's a real
 *  non-empty string. */
function pickString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
