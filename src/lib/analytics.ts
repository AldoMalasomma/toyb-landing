/**
 * Analytics hook.
 *
 * This forwards events to Google Analytics only after consent has loaded the
 * gtag runtime. Before that, it stays a no-op.
 */
export function track(event: string, payload?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", event, payload ?? {});
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __toybAnalyticsLoaded?: boolean;
  }
}
