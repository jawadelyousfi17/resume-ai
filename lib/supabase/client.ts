"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./env";

/** The browser-side Supabase client. Reads the session from the same cookies
 *  the server client writes, so the two stay in step. */
export function createClient() {
  return createBrowserClient(supabaseUrl(), supabaseAnonKey());
}
