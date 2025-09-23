import * as React from "react";
import { ensureCached, readJSON, writeJSON } from "@/utils/cache";

export function useCached<T>(key: string, fetcher: () => Promise<T>) {
    const [data, setData] = React.useState<T | null>(() => readJSON<T>(key));
    const [loading, setLoading] = React.useState(!data);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        let cancelled = false;
        if (data) return; // already have it from localStorage (no API call)

        (async () => {
            setLoading(true);
            setError(null);
            try {
                const fresh = await ensureCached<T>(key, fetcher);
                if (!cancelled) { setData(fresh); }
            } catch (e: any) {
                if (!cancelled) setError(e?.message || "Failed to load");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [key]); // fetcher is stable if from api module

    const setLocal = (next: T) => { writeJSON(key, next); setData(next); };

    return { data, setLocal, loading, error };
}
