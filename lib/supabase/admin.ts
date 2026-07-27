import "server-only";

// A Supabase client with no session, used for the one thing a signed-out
// visitor still needs done on their behalf: storing the photo they just picked.
//
// This key bypasses row-level security, so the bucket can stay closed to
// anonymous writes and every guest upload passes through our own route, where
// it is checked for type and size first. Keep its use to exactly that.

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { supabaseSecretKey, supabaseUrl } from "./env";

export function createAdminClient() {
  const key = supabaseSecretKey();
  if (!key) return null;

  return createSupabaseClient(supabaseUrl(), key, {
    // Nothing to persist or refresh: this client is one request long and has
    // no user attached to it.
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
