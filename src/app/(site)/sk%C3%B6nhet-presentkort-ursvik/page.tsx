import type { Metadata } from "next";
import GiftCardPage from "@/components/page/GiftCardPage";
import { ROUTES } from "@/lib/routes";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Presentkort skönhet i Ursvik & Sundbyberg",
  description: "Ge bort ett personligt presentkort för skönhet och välmående hos Salong ED i Ursvik. Välj själv belopp från 100 kr och låt mottagaren välja sin behandling.",
  path: ROUTES.giftCard,
});

export default function PresentkortPage() { return <GiftCardPage />; }
