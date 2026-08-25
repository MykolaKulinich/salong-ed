"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Fires the presentkort_view business event once when a production visitor
 * lands on the gift-card page. Renders nothing.
 */
export default function PresentkortViewTracker() {
  useEffect(() => {
    trackEvent("presentkort_view");
  }, []);

  return null;
}
