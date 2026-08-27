import type { Metadata } from "next";
import TreatmentPage from "@/components/page/TreatmentPage";
import { EXILIS_PAGE } from "@/lib/content";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({ title: "Exilis Ultra 360 i Sundbyberg", description: "Läs om Exilis Ultra 360 hos Salong ED i Ursvik — ultraljud och radiofrekvens för ansikte och kropp.", path: EXILIS_PAGE.path });

export default function ExilisUltra360Page() { return <TreatmentPage data={EXILIS_PAGE} />; }
