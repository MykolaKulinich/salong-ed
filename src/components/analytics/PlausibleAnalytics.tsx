"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";
import {
  isProductionEnvironment,
  PLAUSIBLE_DOMAIN,
  PLAUSIBLE_EVENT_ENDPOINT,
  PLAUSIBLE_SCRIPT_SRC,
} from "@/lib/analytics";

const PLAUSIBLE_INIT = `
  window.plausible =
    window.plausible ||
    function () {
      (plausible.q = plausible.q || []).push(arguments);
    };

  plausible.init =
    plausible.init ||
    function (options) {
      plausible.o = options || {};
    };

  plausible.init({
    domain: "${PLAUSIBLE_DOMAIN}",
    endpoint: "${PLAUSIBLE_EVENT_ENDPOINT}"
  });
`;

const subscribeToLocation = () => () => {};
const getProductionSnapshot = () => isProductionEnvironment();
const getServerSnapshot = () => false;

/**
 * Loads Plausible once per root layout and only on the real production host.
 * Rendering the Scripts after the client hostname check keeps localhost and
 * deploy previews analytics-free without introducing a hydration mismatch.
 */
export default function PlausibleAnalytics() {
  const enabled = useSyncExternalStore(
    subscribeToLocation,
    getProductionSnapshot,
    getServerSnapshot,
  );

  if (!enabled) return null;

  return (
    <>
      <Script src={PLAUSIBLE_SCRIPT_SRC} strategy="afterInteractive" />
      <Script id="plausible-init" strategy="afterInteractive">
        {PLAUSIBLE_INIT}
      </Script>
    </>
  );
}
