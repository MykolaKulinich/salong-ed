import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import LaserCampaignPreview from "@/components/home/LaserCampaignPreview";
import TreatmentPreview from "@/components/home/TreatmentPreview";
import TechnologyFeature from "@/components/home/TechnologyFeature";
import TreatmentGuidePreview from "@/components/home/TreatmentGuidePreview";
import AboutPreview from "@/components/home/AboutPreview";
import FinalCta from "@/components/home/FinalCta";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Skönhet & välmående i Ursvik",
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Salong ED | Skönhet & välmående i Ursvik",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Salong ED",
    locale: "sv_SE",
    type: "website",
  },
  twitter: { card: "summary", title: "Salong ED | Skönhet & välmående i Ursvik", description: SITE_DESCRIPTION },
};

// Keep the temporary homepage campaign date-aware without changing the
// homepage's evergreen SEO metadata or adding client-side campaign logic.
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <LaserCampaignPreview />
      <TreatmentPreview />
      <TechnologyFeature />
      <TreatmentGuidePreview />
      <AboutPreview />
      <FinalCta />
    </>
  );
}
