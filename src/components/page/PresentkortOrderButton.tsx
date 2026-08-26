"use client";

import Button from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";

/** Primary hero CTA for the configurator. */
export default function PresentkortOrderButton() {
  return (
    <Button href="#presentkort-configurator" onClick={() => trackEvent("presentkort_start")}>
      Skapa presentkort
    </Button>
  );
}
