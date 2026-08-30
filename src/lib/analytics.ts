/**
 * Centralized, typed analytics utility for Plausible Analytics.
 *
 * Plausible is loaded through a Netlify first-party proxy (see
 * `public/_redirects`) so the browser never talks to plausible.io directly:
 *
 *   /sd/js/script.js -> https://plausible.io/js/pa-TLJKO1hs8OH95HzKUdyiV.js
 *   /sd/api/event    -> https://plausible.io/api/event
 *
 * The script itself is injected by the `PlausibleAnalytics` client component
 * rendered from the root layouts, which also installs the `window.plausible`
 * queue stub. This module only knows how to safely call it.
 *
 * Analytics must never run outside of production, and must never throw —
 * every guard below fails silently rather than affecting the application.
 */

export const PRODUCTION_HOSTNAME = "www.salongewelinadubowska.com";

export const PLAUSIBLE_DOMAIN = "salongewelinadubowska.com";
export const PLAUSIBLE_SCRIPT_SRC = "/sd/js/script.js";
export const PLAUSIBLE_EVENT_ENDPOINT = "/sd/api/event";

/** Business events tracked across the site. Keep in sync with the report. */
export type AnalyticsEventName =
  | "booking_click"
  | "icoone_booking_click"
  | "exilis_booking_click"
  | "phone_click"
  | "email_click"
  | "instagram_click"
  | "facebook_click"
  | "presentkort_view"
  | "presentkort_start"
  // Reserved for the future gift-card configurator/submission flow — not
  // fired anywhere yet, since no real submission exists today.
  | "presentkort_submit";

/**
 * Plausible custom-event props must be flat scalars. Never pass names,
 * emails, phone numbers, messages, or any other free text/PII here.
 */
export type AnalyticsEventProps = Record<string, string | number | boolean>;

export type PlausibleInitOptions = {
  domain?: string;
  endpoint?: string;
  [key: string]: unknown;
};

type PlausibleTrackOptions = {
  props?: AnalyticsEventProps;
};

export type PlausibleFn = {
  (eventName: string, options?: PlausibleTrackOptions): void;
  q?: unknown[];
  o?: PlausibleInitOptions;
  init?: (options?: PlausibleInitOptions) => void;
};

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

/** True only in the browser, on the real production hostname. */
export function isProductionEnvironment(): boolean {
  return typeof window !== "undefined" && window.location.hostname === PRODUCTION_HOSTNAME;
}

/**
 * Fire a business event to Plausible. Safe to call anywhere, anytime:
 * it no-ops on the server, on non-production hostnames (localhost,
 * Netlify staging/previews), and if Plausible hasn't loaded yet.
 */
export function trackEvent(name: AnalyticsEventName, props?: AnalyticsEventProps): void {
  if (!isProductionEnvironment()) return;
  if (typeof window.plausible !== "function") return;

  try {
    window.plausible(name, props ? { props } : undefined);
  } catch {
    // Analytics must never break the application.
  }
}
