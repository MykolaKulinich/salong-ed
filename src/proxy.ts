import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const STAGING_HOSTNAME = "salong-ed.netlify.app";

function matchesStagingHostname(value: string | null) {
  return (
    value?.split(",").some(
      (host) => host.trim().toLowerCase().replace(/:\d+$/, "") === STAGING_HOSTNAME,
    ) ?? false
  );
}

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  const isStagingRequest =
    matchesStagingHostname(request.nextUrl.hostname) ||
    matchesStagingHostname(request.headers.get("host")) ||
    matchesStagingHostname(request.headers.get("x-forwarded-host"));

  if (isStagingRequest) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: "/:path*",
};
