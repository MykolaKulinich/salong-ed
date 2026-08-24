import type { Metadata } from "next";
import AboutPage from "@/components/page/AboutPage";
import { ROUTES } from "@/lib/routes";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({ title: "Om Salong ED", description: "Lär känna Salong ED och Ewelina Dubowskas bakgrund inom kosmetologi i Ursvik, Sundbyberg.", path: ROUTES.about });

export default function SalongEdPage() { return <AboutPage />; }
