import type { Metadata } from "next";
import TreatmentPage from "@/components/page/TreatmentPage";
import { EYES_PAGE } from "@/lib/content";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({ title: "Ögonbehandlingar i Ursvik", description: "Behandlingar för ögonområdet hos Salong ED i Sundbyberg och Ursvik.", path: EYES_PAGE.path });

export default function OgonomradeBehandlingarPage() { return <TreatmentPage data={EYES_PAGE} />; }
