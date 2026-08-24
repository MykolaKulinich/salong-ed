import type { Metadata } from "next";
import GiftCardPage from "@/components/page/GiftCardPage";
import { ROUTES } from "@/lib/routes";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({ title: "Skönhetspresentkort i Ursvik", description: "Beställ ett personligt skönhetspresentkort hos Salong ED i Ursvik. Välj valfritt belopp eller behandling och kontakta salongen direkt för beställning.", path: ROUTES.giftCard });

export default function PresentkortPage() { return <GiftCardPage />; }
