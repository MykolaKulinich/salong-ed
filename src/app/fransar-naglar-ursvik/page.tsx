import type { Metadata } from "next";
import TreatmentPage from "@/components/page/TreatmentPage";
import { LASHES_AND_NAILS_PAGE } from "@/lib/content";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({ title: "Fransar och naglar i Ursvik", description: "Fransar, lashlift, naglar och pedikyr hos Salong ED i Ursvik, Sundbyberg.", path: LASHES_AND_NAILS_PAGE.path });

export default function FransarNaglarPage() { return <TreatmentPage data={LASHES_AND_NAILS_PAGE} />; }
