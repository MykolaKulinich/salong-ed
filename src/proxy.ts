import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const STAGING_HOSTNAME = "salong-ed.netlify.app";
const ADMIN_LOGIN_PATH = "/admin/login";
const ADMIN_PROTECTED_PREFIX = "/admin/presentkort";

function matchesStagingHostname(value: string | null) {
  return (
    value?.split(",").some(
      (host) => host.trim().toLowerCase().replace(/:\d+$/, "") === STAGING_HOSTNAME,
    ) ?? false
  );
}

function applyStagingNoindex(request: NextRequest, response: NextResponse) {
  const isStagingRequest =
    matchesStagingHostname(request.nextUrl.hostname) ||
    matchesStagingHostname(request.headers.get("host")) ||
    matchesStagingHostname(request.headers.get("x-forwarded-host"));

  if (isStagingRequest) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

/**
 * Optimistic admin-session check, scoped to /admin routes only. This does
 * two things, both "optimistic" per the Next.js Proxy guidance (cookie-based,
 * no database query):
 *
 * 1. Refreshes the Supabase auth cookie via getClaims(), which is required
 *    for sessions to stay alive — without it, tokens would silently stop
 *    refreshing since Server Components cannot write response cookies.
 * 2. Redirects obviously unauthenticated/unauthorized visitors away from
 *    /admin/presentkort, and already-authorized visitors away from the
 *    login page.
 *
 * This is a fast-path UX nicety only. The authoritative check — did the
 * request actually come from PRESENTKORT_ADMIN_USER_ID — happens again,
 * independently, server-side in lib/admin-auth.ts for every page, layout,
 * Server Action, and data access. Never rely on this function alone.
 */
async function refreshAdminSession(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const adminUserId = process.env.PRESENTKORT_ADMIN_USER_ID;

  if (!supabaseUrl || !supabaseKey || !adminUserId) {
    // Fail closed: without configured env vars nobody can be verified as
    // admin, so treat every visitor to the protected area as unauthenticated.
    if (pathname.startsWith(ADMIN_PROTECTED_PREFIX)) {
      return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
    }
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const isAdmin = data?.claims?.sub === adminUserId;

  if (pathname.startsWith(ADMIN_PROTECTED_PREFIX) && !isAdmin) {
    return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
  }

  if (pathname === ADMIN_LOGIN_PATH && isAdmin) {
    return NextResponse.redirect(new URL(ADMIN_PROTECTED_PREFIX, request.url));
  }

  return response;
}

export async function proxy(request: NextRequest) {
  const response = request.nextUrl.pathname.startsWith("/admin")
    ? await refreshAdminSession(request)
    : NextResponse.next();

  return applyStagingNoindex(request, response);
}

export const config = {
  matcher: "/:path*",
};
