import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-only Supabase client. Uses exclusively the public URL and
 * publishable key — never import the service-role client (lib/supabase/server.ts)
 * or anything from "server-only" modules here, since this file is safe to
 * bundle for the browser.
 *
 * Not currently wired into a page (the admin login flow authenticates via a
 * Server Action so the session cookie is set directly by the server — see
 * app/admin/login/actions.ts), but kept as the documented browser/public
 * client for any future client-side auth needs (e.g. reacting to
 * `onAuthStateChange`).
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  return createBrowserClient(url, publishableKey);
}
