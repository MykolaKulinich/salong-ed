import type { Metadata } from "next";
import TreatmentPage from "@/components/page/TreatmentPage";
import { SCARNIK_PAGE } from "@/lib/content";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({ title: "SCARINK – behandling av ärr", description: "Läs om ScarNik Concept hos Salong ED och ett personligt arbetssätt för ärrens utseende och komfort.", path: SCARNIK_PAGE.path });

export default function ScarnikPage() { return <TreatmentPage data={SCARNIK_PAGE} />; }
