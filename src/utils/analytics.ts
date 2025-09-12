export function logEvent(name: string, payload: Record<string, unknown> = {}) {
  if (typeof window !== "undefined") {
    // Hook into your analytics SDK here if needed
  }
  // eslint-disable-next-line no-console
  console.debug(`[event] ${name}`, payload);
}
