import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Session-aware Supabase client for Server Components, Server Actions, and
 * Route Handlers. Reads the signed-in owner's auth cookies and, where the
 * runtime allows it (Server Actions and Route Handlers, not Server Component
 * render), writes refreshed session cookies back.
 *
 * Deliberately separate from lib/supabase/server.ts, which holds the
 * service-role admin client and never carries a user session. Never merge
 * these two — the service-role key must not be reachable from anything that
 * also touches request cookies meant for the browser.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called during a Server Component render, where cookies cannot be
          // mutated. proxy.ts refreshes the session cookie on the way in for
          // /admin routes, so this is safe to ignore here.
        }
      },
    },
  });
}
