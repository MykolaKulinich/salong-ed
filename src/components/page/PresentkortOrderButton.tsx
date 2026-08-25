"use client";

import Button from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";

/**
 * Same primary CTA as before (href, label, styling all unchanged) — this
 * wrapper only adds the presentkort_start click event.
 */
export default function PresentkortOrderButton() {
  return (
    <Button href="#bestall-presentkort" onClick={() => trackEvent("presentkort_start")}>
      Beställ presentkort
    </Button>
  );
}
