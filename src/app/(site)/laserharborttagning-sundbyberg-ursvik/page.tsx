import type { Metadata } from "next";
import LaserHairRemovalPage from "@/components/page/LaserHairRemovalPage";
import { ROUTES } from "@/lib/routes";
import { createPageMetadata } from "@/lib/site";

// The page itself is evergreen, but the September campaign banner on it is
// date-gated (see src/lib/laser-campaign.ts). Revalidating hourly means the
// banner disappears on its own shortly after the campaign ends, without a
// redeploy — cheap ISR instead of forcing this SEO page fully dynamic.
export const revalidate = 3600;

export const metadata: Metadata = createPageMetadata({
  title: "Laserhårborttagning i Sundbyberg & Ursvik",
  description:
    "Laserhårborttagning med diodlaser hos Salong ED i Ursvik, Sundbyberg. Läs hur behandlingen fungerar, hur du förbereder dig och boka enkelt via Bokadirekt.",
  path: ROUTES.laser,
});

export default function LaserHarborttagningPage() {
  return <LaserHairRemovalPage />;
}
