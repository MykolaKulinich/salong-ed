/**
 * Client instrumentation entry point (Next.js 16 convention — runs once per
 * full page load, after the HTML document loads and before hydration; it
 * does not re-run on client-side navigations). This is the recommended
 * place to bootstrap third-party analytics, so it's used here to load
 * Plausible through the Netlify first-party proxy defined in
 * `public/_redirects`.
 *
 * Guarded so it only ever runs on the real production hostname — never on
 * localhost, Netlify staging, or Netlify deploy previews.
 */

import {
  PLAUSIBLE_EVENT_ENDPOINT,
  PLAUSIBLE_SCRIPT_SRC,
  isProductionEnvironment,
  type PlausibleFn,
  type PlausibleInitOptions,
} from "./lib/analytics";

if (isProductionEnvironment()) {
  try {
    // Standard Plausible queueing stub: collects calls made before the
    // proxied script below finishes loading.
    function plausibleQueue(...args: unknown[]) {
      const self = plausibleQueue as unknown as PlausibleFn;
      self.q = self.q ?? [];
      self.q.push(args);
    }

    const plausible = window.plausible ?? (plausibleQueue as unknown as PlausibleFn);
    window.plausible = plausible;

    plausible.init =
      plausible.init ??
      function initPlausible(options?: PlausibleInitOptions) {
        plausible.o = options ?? {};
      };

    // Route events through the first-party proxy instead of plausible.io.
    plausible.init({ endpoint: PLAUSIBLE_EVENT_ENDPOINT });

    const script = document.createElement("script");
    script.src = PLAUSIBLE_SCRIPT_SRC;
    script.defer = true;
    document.head.appendChild(script);
  } catch {
    // Analytics failures must never break the application.
  }
}
