import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./env";

/** A Supabase client for Server Components, Server Actions and Route
 *  Handlers. Create one per request — never hold onto it across requests, or
 *  one visitor's session leaks into another's. */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl(), supabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components get a read-only cookie store. Ignoring the
          // write is safe here because proxy.ts refreshes the session on
          // every request and writes the rotated tokens to the response.
        }
      },
    },
  });
}
