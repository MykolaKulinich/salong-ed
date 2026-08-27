import "server-only";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type AdminUser = {
  id: string;
  email: string | null;
};

/**
 * Central, authoritative authorization gate for the Presentkort admin.
 *
 * Every Server Component, Server Action, and Route Handler that reads or
 * mutates gift-card order data must call this first. proxy.ts only performs
 * an optimistic redirect for a snappier UX — it must never be treated as the
 * real access control, since a Proxy matcher change could silently stop
 * covering a route or Server Function.
 *
 * The rule is intentionally narrow: the authenticated Supabase user's id
 * must equal PRESENTKORT_ADMIN_USER_ID. Nothing from the browser (email,
 * query params, client state) is trusted. If the env var is missing, access
 * fails closed for everyone.
 */
export async function requireAdminUser(): Promise<AdminUser> {
  const adminUserId = process.env.PRESENTKORT_ADMIN_USER_ID;
  const supabase = await createSupabaseServerClient();

  if (!adminUserId) {
    // Fail closed: with no configured admin id, nobody can be authorized.
    // Still sign out any session so a stale cookie doesn't linger.
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || !userId) {
    redirect("/admin/login");
  }

  if (userId !== adminUserId) {
    // Authenticated, but not the authorized owner account. Sign the session
    // out rather than leaving a valid-but-unauthorized session in cookies,
    // and never return order data.
    await supabase.auth.signOut();
    redirect("/admin/login?error=forbidden");
  }

  const email = data?.claims?.email;
  return { id: userId, email: typeof email === "string" ? email : null };
}
