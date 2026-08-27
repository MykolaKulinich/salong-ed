import type { Metadata } from "next";
import TreatmentPage from "@/components/page/TreatmentPage";
import { BODY_PAGE } from "@/lib/content";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({ title: "Kroppsbehandlingar i Ursvik", description: "Kroppsbehandlingar hos Salong ED i Ursvik med bland annat presoterapi, vakuumterapi och kroppsteknik.", path: BODY_PAGE.path });

export default function KroppsbehandlingarPage() { return <TreatmentPage data={BODY_PAGE} />; }
