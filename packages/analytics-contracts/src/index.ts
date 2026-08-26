export interface AnalyticsPort {
  trackPageView(route: string): void
  trackEvent(name: string, properties: Readonly<Record<string, string | number | boolean>>): void
  setConsent(categories: Readonly<Record<string, boolean>>): void
}
export const disabledAnalytics: AnalyticsPort = {
  trackPageView: () => undefined,
  trackEvent: () => undefined,
  setConsent: () => undefined,
}
