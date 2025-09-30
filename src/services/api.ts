// src/services/api.ts
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "");
const TOKEN_KEY = "token";

/* ------------------------------ Token helpers ------------------------------ */
function getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}

function setAuthToken(token: string | null) {
    if (typeof window === "undefined") return;
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
}

/* -------------------------------- apiFetch -------------------------------- */
type ApiFetchOptions = {
    method?: HttpMethod;
    headers?: Record<string, string>;
    body?: any;
    rawBody?: boolean;
    signal?: AbortSignal;
};

function normalizeBase(path: string) {
    return `${API_BASE.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

function prepareRequest(
    path: string,
    opts: ApiFetchOptions = {}
): {
    url: string;
    init: RequestInit;
} {
    const url = normalizeBase(path);

    const headers: Record<string, string> = {
        ...(opts.headers || {}),
    };

    const token = getAuthToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;

    let body: BodyInit | undefined;
    if (opts.rawBody) {
        body = opts.body as BodyInit;
    } else if (opts.body instanceof FormData) {
        body = opts.body;
    } else if (typeof opts.body === "string") {
        headers["Content-Type"] = headers["Content-Type"] || "application/json";
        body = opts.body;
    } else if (opts.body !== undefined) {
        headers["Content-Type"] = headers["Content-Type"] || "application/json";
        body = JSON.stringify(opts.body);
    }

    return {
        url,
        init: {
            method: opts.method || "GET",
            headers,
            body,
            signal: opts.signal,
        },
    };
}

async function apiFetch<T>(path: string, opts: ApiFetchOptions = {}): Promise<T> {
    const { url, init } = prepareRequest(path, opts);
    const res = await fetch(url, init);

    const text = await res.text();
    let data: any;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text || null;
    }

    if (!res.ok) {
        const message =
            (data && (data.detail || data.message || data.error)) ||
            (typeof data === "string" ? data : "") ||
            `HTTP ${res.status}`;
        const err = new Error(message) as Error & { status?: number };
        (err as any).status = res.status;
        throw err;
    }

    return data as T;
}

async function apiFetchWithResponse<T>(
    path: string,
    opts: ApiFetchOptions = {}
): Promise<{ data: T; headers: Headers; status: number }> {
    const { url, init } = prepareRequest(path, opts);
    const res = await fetch(url, init);

    const text = await res.text();
    let data: any;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text || null;
    }

    if (!res.ok) {
        const message =
            (data && (data.detail || data.message || data.error)) ||
            (typeof data === "string" ? data : "") ||
            `HTTP ${res.status}`;
        const err = new Error(message) as Error & { status?: number };
        (err as any).status = res.status;
        throw err;
    }

    return { data: data as T, headers: res.headers, status: res.status };
}

/* ============================== Cache helpers ============================== */
import {
    readJSON,
    writeJSON,
    removeJSON,
    invalidate,
    invalidateByPrefix,
    safeUpdateJSON,
} from "@/utils/cache";

/** Centralized cache keys (consistent invalidation) */
export const CACHE_KEYS = {
    me: {
        ambassador: "me:ambassador",
        stakeholder: "me:stakeholder",
    },
    dashboard: {
        stats: "ambassador:dashboard:stats",
    },
    teenagers: {
        list: "ambassador:teenagers:list",
        detail: (id: number | string) => `ambassador:teenagers:detail:${id}`,
        _prefix: "ambassador:teenagers:",
    },
    packages: {
        list: "ambassador:packages:list",
        detail: (id: number | string) => `ambassador:packages:detail:${id}`,
        _prefix: "ambassador:packages:",
    },
};

/* ============================== Schemas (typed) ============================== */
/** Copied from OpenAPI enums */
export type UserRole =
    | "stakeholder"
    | "ambassador"
    | "teenager"
    | "admin"
    | "internal_staff";

/** /v1/auth/check-email */
export type CheckEmailResponse = { action: "signup" | "login" };

/** Login & JWT */
export type LoginPayload = { email: string; password: string };
export type JWTTokenResponse = { access_token: string; token_type?: string };

/** Register payloads */
export type RegisterAmbassadorPayload = {
    age: number;
    email: string;
    full_name: string;
    password: string;
    role: "ambassador";
};

export type RegisterStakeholderPayload = {
    age: number;
    email: string;
    full_name: string;
    password: string;
    role: "stakeholder";
};

/** OTP */
export type SendOTPPayload = {
    channel?: "email" | "sms"; // server default: email
    identifier: string; // email or phone number
    purpose?: string; // server default: login
    role: UserRole;
};
export type VerifyOTPPayload = {
    channel?: "email" | "sms"; // server default: email
    identifier: string;
    purpose?: string; // server default: login
    code: string;
    role: UserRole;
};
export type OTPResponse = { ok: boolean; detail?: string | null };

/** Response models (relaxed) */
export type DonationInStakeholder = {
    id: number;
    donated_at: string; // ISO datetime
    laptop_count?: number | null;
};

export type Stakeholder = {
    id: number;
    role: UserRole; // "stakeholder"
    age?: number;
    email?: string;
    full_name?: string;
    organization_name?: string | null;
    phone_number_verified?: boolean;
    email_verified?: boolean;
    donations?: DonationInStakeholder[];
};

export type Ambassador = {
    id: number;
    role: UserRole; // "ambassador"
    age?: number;
    email?: string;
    phone_number?: string | null;
    full_name?: string;
    organization_name?: string | null;
    national_identifier?: string | null;
    date_of_birth?: string | null; // yyyy-mm-dd
    province?: string | null;
    city?: string | null;
    address?: string | null;
    profile_picture_path?: string | null;
    verified_by_rubitech?: boolean;
    agreed_to_terms?: boolean; // spec uses "agreed_to_terms"
    phone_number_verified?: boolean;
    email_verified?: boolean;
};

/** Dashboard stats */
export type DashboardStats = {
    total_teenagers: number;
    total_packages: number;
    total_laptops: number;
    total_reports: number;
};

/* ------------------------ Ambassador: Teenagers types ----------------------- */
export type Teenager = {
    id: number;
    role: UserRole; // "teenager"
    national_identifier: string;
    organization_name?: string | null;
    date_of_birth: string; // yyyy-mm-dd
    mother_name: string;
    mother_phone_number: string;
    father_name: string;
    father_phone_number: string;
    verified_by_rubitech: boolean;
    age?: number;
    email?: string;
    full_name?: string;
    phone_number?: string | null;
    phone_number_verified?: boolean;
    email_verified?: boolean;
    profile_picture_path?: string | null;
};

export type CreateTeenagerPayload = {
    national_identifier: string;
    organization_name?: string | null;
    date_of_birth: string; // yyyy-mm-dd
    mother_name: string;
    mother_phone_number: string;
    father_name: string;
    father_phone_number: string;
    verified_by_rubitech: boolean;
    age: number;
    email: string;
    full_name: string;
    password: string;
    role: "teenager";
    ambassador_id: number;
    phone_number?: string | null;
    profile_picture_path?: string | null;
    phone_number_verified?: boolean;
    email_verified?: boolean;
};

export type UpdateTeenagerPayload = Partial<{
    national_identifier: string;
    organization_name: string | null;
    date_of_birth: string; // yyyy-mm-dd
    mother_name: string;
    mother_phone_number: string;
    father_name: string;
    father_phone_number: string;
    verified_by_rubitech: boolean;
    full_name: string | null;
    email: string | null;
    age: number | null;
    phone_number: string | null;
}>;

/* ------------------------- Ambassador: Packages types ----------------------- */
export type PackageStage = "reviewing" | "packaging" | "shipping" | "delivered";

export type Package = {
    id: number;
    ambassador_id: number;
    requested_at: string; // ISO datetime
    stage?: PackageStage;
    requested_laptops_count?: number;
    requested_teenagers_count?: number;
    notes?: string | null;
    teenager_ids?: number[];
};

export type CreatePackagePayload = {
    ambassador_id: number;
    teenager_ids: number[]; // min 1
    stage?: PackageStage; // default reviewing (server-side)
    requested_laptops_count?: number;
    requested_teenagers_count?: number;
    notes?: string | null;
    requested_at?: string; // ISO
};

export type UpdatePackagePayload = Partial<{
    stage: PackageStage | null;
    requested_laptops_count: number | null;
    requested_teenagers_count: number | null;
    notes: string | null;
    teenager_ids: number[] | null; // replace list when provided
}>;

/* ============================== Endpoints ============================== */
/** POST /v1/auth/check-email { email, role } -> { action } */
export async function checkEmail(
    email: string,
    role: UserRole
): Promise<"login" | "signup"> {
    const res = await apiFetch<CheckEmailResponse>("/v1/auth/check-email", {
        method: "POST",
        body: { email, role },
    });
    return res.action;
}

/** POST /v1/auth/otp/send -> { ok, detail? } */
export async function sendOtp(payload: SendOTPPayload): Promise<OTPResponse> {
    return apiFetch<OTPResponse>("/v1/auth/otp/send", {
        method: "POST",
        body: payload,
    });
}

/** POST /v1/auth/otp/verify -> { ok, detail? }
 *  If verification changes the current user's state, we refresh the relevant cache.
 */
export async function verifyOtp(payload: VerifyOTPPayload): Promise<OTPResponse> {
    const res = await apiFetch<OTPResponse>("/v1/auth/otp/verify", {
        method: "POST",
        body: payload,
    });

    // Try to refresh "me" caches when relevant; ignore errors to keep UX smooth
    try {
        if (payload.role === "ambassador") {
            invalidate(CACHE_KEYS.me.ambassador);
            await getMeAmbassador();
        } else if (payload.role === "stakeholder") {
            invalidate(CACHE_KEYS.me.stakeholder);
            await getMeStakeholder();
        }
    } catch {
        // no-op
    }

    return res;
}

/** POST /v1/auth/login/ambassador -> JWT */
export async function loginAmbassador(
    payload: LoginPayload
): Promise<JWTTokenResponse> {
    const res = await apiFetch<JWTTokenResponse>("/v1/auth/login/ambassador", {
        method: "POST",
        body: payload,
    });
    if (res?.access_token) setAuthToken(res.access_token);
    return res;
}

/** POST /v1/auth/login/stakeholder -> JWT */
export async function loginStakeholder(
    payload: LoginPayload
): Promise<JWTTokenResponse> {
    const res = await apiFetch<JWTTokenResponse>("/v1/auth/login/stakeholder", {
        method: "POST",
        body: payload,
    });
    if (res?.access_token) setAuthToken(res.access_token);
    return res;
}

/** POST /v1/auth/register/ambassador -> JWT */
export async function registerAmbassador(
    payload: RegisterAmbassadorPayload
): Promise<JWTTokenResponse> {
    const res = await apiFetch<JWTTokenResponse>("/v1/auth/register/ambassador", {
        method: "POST",
        body: payload,
    });
    if (res?.access_token) setAuthToken(res.access_token);
    return res;
}

/** POST /v1/auth/register/stakeholder -> JWT */
export async function registerStakeholder(
    payload: RegisterStakeholderPayload
): Promise<JWTTokenResponse> {
    const res = await apiFetch<JWTTokenResponse>("/v1/auth/register/stakeholder", {
        method: "POST",
        body: payload,
    });
    if (res?.access_token) setAuthToken(res.access_token);
    return res;
}

/** GET /v1/auth/me/ambassador (Bearer) -> Ambassador */
export async function getMeAmbassador(): Promise<Ambassador> {
    const data = await apiFetch<Ambassador>("/v1/auth/me/ambassador", {
        method: "GET",
    });
    writeJSON(CACHE_KEYS.me.ambassador, data);
    return data;
}

/** GET /v1/auth/me/stakeholder (Bearer) -> Stakeholder */
export async function getMeStakeholder(): Promise<Stakeholder> {
    const data = await apiFetch<Stakeholder>("/v1/auth/me/stakeholder", {
        method: "GET",
    });
    writeJSON(CACHE_KEYS.me.stakeholder, data);
    return data;
}

/** Clear local token + user caches */
export function logout() {
    setAuthToken(null);
    removeJSON(CACHE_KEYS.me.ambassador);
    removeJSON(CACHE_KEYS.me.stakeholder);
}

/* =========================== Ambassador - Dashboard ========================= */
/** GET /v1/ambassador/dashboard/stats */
export async function getDashboardStats(): Promise<DashboardStats> {
    const data = await apiFetch<DashboardStats>("/v1/ambassador/dashboard/stats", {
        method: "GET",
    });
    writeJSON(CACHE_KEYS.dashboard.stats, data);
    return data;
}

/* =========================== Ambassador - Profile ========================== */
/** PATCH /v1/ambassador/profile/ -> {} (partial update) */
export async function updateAmbassadorProfile(
    payload: Partial<
        Pick<
            Ambassador,
            | "organization_name"
            | "national_identifier"
            | "date_of_birth"
            | "province"
            | "city"
            | "address"
            | "verified_by_rubitech"
            | "agreed_to_terms"
            | "full_name"
            | "email"
            | "age"
            | "phone_number"
        >
    >
): Promise<void> {
    await apiFetch<unknown>("/v1/ambassador/profile/", {
        method: "PATCH",
        body: payload,
    });

    // Force a real API call and refresh cache
    invalidate(CACHE_KEYS.me.ambassador);
    await getMeAmbassador();
}

/* ========================== Ambassador - Teenagers ========================= */
/** GET /v1/ambassador/teenagers/ */
export async function listTeenagers(): Promise<Teenager[]> {
    const data = await apiFetch<Teenager[]>("/v1/ambassador/teenagers/", {
        method: "GET",
    });
    writeJSON(CACHE_KEYS.teenagers.list, data);
    return data;
}

/** POST /v1/ambassador/teenagers/ */
export async function createTeenager(
    payload: CreateTeenagerPayload
): Promise<Teenager> {
    const created = await apiFetch<Teenager>("/v1/ambassador/teenagers/", {
        method: "POST",
        body: payload,
    });

    // Invalidate and immediately refetch authoritative data
    invalidate(CACHE_KEYS.teenagers.list);
    await listTeenagers();

    invalidate(CACHE_KEYS.teenagers.detail(created.id));
    await getTeenager(created.id);

    // Stats may change
    invalidate(CACHE_KEYS.dashboard.stats);
    await getDashboardStats();

    return created;
}

/** GET /v1/ambassador/teenagers/{id} */
export async function getTeenager(id: number): Promise<Teenager> {
    const data = await apiFetch<Teenager>(`/v1/ambassador/teenagers/${id}`, {
        method: "GET",
    });
    writeJSON(CACHE_KEYS.teenagers.detail(id), data);
    return data;
}

/** PATCH /v1/ambassador/teenagers/{id} */
export async function updateTeenager(
    id: number,
    payload: UpdateTeenagerPayload
): Promise<Teenager> {
    const updated = await apiFetch<Teenager>(`/v1/ambassador/teenagers/${id}`, {
        method: "PATCH",
        body: payload,
    });

    // Invalidate & refetch
    invalidate(CACHE_KEYS.teenagers.detail(id));
    await getTeenager(id);

    invalidate(CACHE_KEYS.teenagers.list);
    await listTeenagers();

    return updated;
}

/** DELETE /v1/ambassador/teenagers/{id} -> 204 */
export async function deleteTeenager(id: number): Promise<void> {
    await apiFetch<unknown>(`/v1/ambassador/teenagers/${id}`, { method: "DELETE" });

    // Purge detail, refresh list, and refresh stats
    removeJSON(CACHE_KEYS.teenagers.detail(id));
    invalidate(CACHE_KEYS.teenagers.list);
    await listTeenagers();

    invalidate(CACHE_KEYS.dashboard.stats);
    await getDashboardStats();
}

/* =========================== Ambassador - Packages ========================= */
/**
 * GET /v1/ambassador/packages/
 * Returns array and (optionally) X-Total-Count header.
 */
export async function listPackages(): Promise<{ items: Package[]; total?: number }> {
    const { data, headers } = await apiFetchWithResponse<Package[]>(
        "/v1/ambassador/packages/",
        { method: "GET" }
    );
    const totalHeader = headers.get("X-Total-Count");
    const total = totalHeader != null ? Number(totalHeader) : undefined;

    writeJSON(CACHE_KEYS.packages.list, data);
    return { items: data, total };
}

/** POST /v1/ambassador/packages/ */
export async function createPackage(payload: CreatePackagePayload): Promise<Package> {
    const created = await apiFetch<Package>("/v1/ambassador/packages/", {
        method: "POST",
        body: payload,
    });

    // Invalidate & refetch list and detail
    invalidate(CACHE_KEYS.packages.list);
    await listPackages();

    invalidate(CACHE_KEYS.packages.detail(created.id));
    await getPackage(created.id);

    invalidate(CACHE_KEYS.dashboard.stats);
    await getDashboardStats();

    return created;
}

/** GET /v1/ambassador/packages/{id} */
export async function getPackage(id: number): Promise<Package> {
    const data = await apiFetch<Package>(`/v1/ambassador/packages/${id}`, {
        method: "GET",
    });
    writeJSON(CACHE_KEYS.packages.detail(id), data);
    return data;
}

/** PATCH /v1/ambassador/packages/{id} */
export async function updatePackage(
    id: number,
    payload: UpdatePackagePayload
): Promise<Package> {
    const updated = await apiFetch<Package>(`/v1/ambassador/packages/${id}`, {
        method: "PATCH",
        body: payload,
    });

    invalidate(CACHE_KEYS.packages.detail(id));
    await getPackage(id);

    invalidate(CACHE_KEYS.packages.list);
    await listPackages();

    invalidate(CACHE_KEYS.dashboard.stats);
    await getDashboardStats();

    return updated;
}

/** DELETE /v1/ambassador/packages/{id} -> 204 */
export async function deletePackage(id: number): Promise<void> {
    await apiFetch<unknown>(`/v1/ambassador/packages/${id}`, { method: "DELETE" });

    removeJSON(CACHE_KEYS.packages.detail(id));
    invalidate(CACHE_KEYS.packages.list);
    await listPackages();

    invalidate(CACHE_KEYS.dashboard.stats);
    await getDashboardStats();
}

/* ------------------------------ Convenience bag ------------------------------ */
export const api = {
    // auth
    checkEmail,
    sendOtp,
    verifyOtp,
    loginAmbassador,
    loginStakeholder,
    registerAmbassador,
    registerStakeholder,

    // me
    getMeAmbassador,
    getMeStakeholder,

    // dashboard
    getDashboardStats,

    // profile
    updateAmbassadorProfile,

    // teenagers
    listTeenagers,
    createTeenager,
    getTeenager,
    updateTeenager,
    deleteTeenager,

    // packages
    listPackages,
    createPackage,
    getPackage,
    updatePackage,
    deletePackage,

    // session
    logout,

    // cache keys
    CACHE_KEYS,

    // low-level
    _fetch: apiFetch,
    _fetchWithResponse: apiFetchWithResponse,
    _getAuthToken: getAuthToken,
    _setAuthToken: setAuthToken,
};
