/** In-flight dedupe for identical keys */
const INFLIGHT = new Map<string, Promise<any>>();

/** Lightweight pub/sub so hooks/pages can react to cache changes if needed */
type CacheEvent =
    | { type: "write"; key: string }
    | { type: "remove"; key: string }
    | { type: "invalidate"; key: string }
    | { type: "invalidate-prefix"; prefix: string };

const SUBS = new Set<(e: CacheEvent) => void>();

function emit(e: CacheEvent) {
    SUBS.forEach((fn) => fn(e));
}

/** Subscribe to cache events (optional for your hooks) */
export function subscribe(fn: (e: CacheEvent) => void) {
    SUBS.add(fn);
    return () => SUBS.delete(fn);
}

/** Read JSON from localStorage (null if absent or parse error) */
export function readJSON<T = unknown>(key: string): T | null {
    try {
        const v = localStorage.getItem(key);
        return v ? (JSON.parse(v) as T) : null;
    } catch {
        return null;
    }
}

/** Write JSON to localStorage */
export function writeJSON(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
    emit({ type: "write", key });
}

/** Remove a single key */
export function removeJSON(key: string) {
    try {
        localStorage.removeItem(key);
    } catch { }
    emit({ type: "remove", key });
}

/** Hard invalidate a single key (delete so ensureCached will fetch) */
export function invalidate(key: string) {
    try {
        localStorage.removeItem(key);
    } catch { }
    emit({ type: "invalidate", key });
}

/** Hard invalidate all keys that start with a prefix */
export function invalidateByPrefix(prefix: string) {
    try {
        const del: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith(prefix)) del.push(k);
        }
        del.forEach((k) => localStorage.removeItem(k));
    } catch { }
    emit({ type: "invalidate-prefix", prefix });
}

/** Update existing JSON (or remove if updater returns null) */
export function safeUpdateJSON<T>(
    key: string,
    updater: (prev: T | null) => T | null
) {
    const prev = readJSON<T>(key);
    const next = updater(prev);
    if (next === null) removeJSON(key);
    else writeJSON(key, next);
}

/**
 * Ensure value exists in localStorage. If missing:
 *  - If another identical fetch is in-flight, await it.
 *  - Else run fetcher(), store, and resolve.
 */
export async function ensureCached<T>(
    key: string,
    fetcher: () => Promise<T>
): Promise<T> {
    const cached = readJSON<T>(key);
    if (cached !== null) return cached;

    const existing = INFLIGHT.get(key);
    if (existing) return existing as Promise<T>;

    const p = (async () => {
        try {
            const fresh = await fetcher();
            writeJSON(key, fresh);
            return fresh;
        } finally {
            INFLIGHT.delete(key);
        }
    })();

    INFLIGHT.set(key, p);
    return p;
}
