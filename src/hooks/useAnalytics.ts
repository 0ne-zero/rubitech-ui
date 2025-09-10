import { useCallback } from "react";
import { logEvent } from "@/lib/analytics";
export function useAnalytics() {
  const track = useCallback((name: string, params?: Record<string, unknown>) => {
    logEvent(name, params);
  }, []);
  return { track };
}
