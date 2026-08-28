import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { ROUTES, SEO_ROUTES } from "@/lib/routes";

// SEO_ROUTES itself stays the protected Wix-migration list — new pages are
// appended here instead so that list's meaning stays stable.
const SITEMAP_ROUTES = [...SEO_ROUTES, ROUTES.laser];

export default function sitemap(): MetadataRoute.Sitemap {
  return SITEMAP_ROUTES.map((path) => ({
    // URL encodes raw Swedish characters exactly once; do not pre-encode the
    // protected paths or the Unicode routes would become double-encoded.
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
