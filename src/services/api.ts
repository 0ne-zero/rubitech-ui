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

async function apiFetch<T>(path: string, opts: ApiFetchOptions = {}): Promise<T> {
    const url = `${API_BASE.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

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

    const res = await fetch(url, {
        method: opts.method || "GET",
        headers,
        body,
        signal: opts.signal,
    });

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

/** Response models (relaxed/optional to be resilient to BE changes) */
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
    full_name?: string;
    organization_name?: string | null;
    national_identifier?: string | null;
    date_of_birth?: string | null; // yyyy-mm-dd
    province?: string | null;
    city?: string | null;
    address?: string | null;
    profile_picture_path?: string | null;
    verified_by_rubitech?: boolean;
    aggreed_to_terms?: boolean;
    phone_number_verified?: boolean;
    email_verified?: boolean;
};

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
    return apiFetch<Ambassador>("/v1/auth/me/ambassador", { method: "GET" });
}

/** GET /v1/auth/me/stakeholder (Bearer) -> Stakeholder */
export async function getMeStakeholder(): Promise<Stakeholder> {
    return apiFetch<Stakeholder>("/v1/auth/me/stakeholder", { method: "GET" });
}

/** Clear local token */
export function logout() {
    setAuthToken(null);
}

/* ------------------------------ Convenience bag ------------------------------ */
export const api = {
    // auth
    checkEmail,
    loginAmbassador,
    loginStakeholder,
    registerAmbassador,
    registerStakeholder,

    // me (distinct)
    getMeAmbassador,
    getMeStakeholder,

    // session
    logout,

    // optional low-level exports
    _fetch: apiFetch,
    _getAuthToken: getAuthToken,
    _setAuthToken: setAuthToken,
};
