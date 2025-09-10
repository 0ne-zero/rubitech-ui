export function logEvent(name: string, params?: Record<string, unknown>) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log("[analytics]", name, params ?? {});
  }
  // TODO: wire to PostHog/GA4 here
}
