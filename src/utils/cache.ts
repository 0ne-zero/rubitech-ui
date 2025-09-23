const INFLIGHT = new Map<string, Promise<any>>();

export function readJSON<T = unknown>(key: string): T | null {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) as T : null; }
    catch { return null; }
}

export function writeJSON(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Ensure a value exists in localStorage. If missing:
 *  - If another identical fetch is in-flight, await it.
 *  - Otherwise run fetcher(), store, and resolve.
 */
export async function ensureCached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = readJSON<T>(key);
    if (cached) return cached;

    // Deduplicate concurrent requests
    const existing = INFLIGHT.get(key);
    if (existing) return existing as Promise<T>;

    const p = (async () => {
        try {
            const fresh = await fetcher();
            writeJSON(key, fresh);
            return fresh;
        } finally {
            // Always clear inflight (success or error) so future calls can retry
            INFLIGHT.delete(key);
        }
    })();

    INFLIGHT.set(key, p);
    return p;
}
