import type { Metadata } from "next";
import GiftCardPage from "@/components/page/GiftCardPage";
import { ROUTES } from "@/lib/routes";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({ title: "Skönhetspresentkort i Ursvik", description: "Ge bort en stund för skönhet och välmående hos Salong ED i Ursvik. Presentkort listas via Bokadirekt.", path: ROUTES.giftCard });

export default function PresentkortPage() { return <GiftCardPage />; }
