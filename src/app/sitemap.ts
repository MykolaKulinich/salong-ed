import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { SEO_ROUTES } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  return SEO_ROUTES.map((path) => ({
    // URL encodes raw Swedish characters exactly once; do not pre-encode the
    // protected paths or the Unicode routes would become double-encoded.
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
