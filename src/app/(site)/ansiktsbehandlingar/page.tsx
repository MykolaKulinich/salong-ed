import type { Metadata } from "next";
import TreatmentPage from "@/components/page/TreatmentPage";
import { FACE_PAGE } from "@/lib/content";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({ title: "Ansiktsbehandlingar i Ursvik", description: "Ansiktsbehandlingar hos Salong ED i Ursvik med hudvård, peeling, infusion, mikronålar, laser och IPL.", path: FACE_PAGE.path });

export default function AnsiktsbehandlingarPage() { return <TreatmentPage data={FACE_PAGE} />; }
