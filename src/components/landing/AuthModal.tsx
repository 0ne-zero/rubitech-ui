"use client";
import React from "react";
import { api, CACHE_KEYS, LoginPayload, RegisterAmbassadorPayload, RegisterStakeholderPayload } from "@/services/api";

import { BrandLogo } from "../ui/BrandLogo";

/* ============================== Auth Modal (email-only, check-email) ============================== */

type Role = "ambassador" | "stakeholder";


const redirectToPanel = (role: "ambassador" | "stakeholder") => {
    const PATHS: Record<"ambassador" | "stakeholder", string> = {
        ambassador: `${import.meta.env.BASE_URL}dashboard/ambassador`,
        stakeholder: `${import.meta.env.BASE_URL}dashboard/stakeholder`,
    };
    window.location.href = PATHS[role];
};

/* Email validation */
const isEmailLike = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

type Stage = "identify" | "login" | "signup" | "success";

/* ---------- Role visuals ---------- */
function RoleIcon({ role }: { role: Role }) {
    const stroke = "currentColor";
    if (role === "ambassador") {
        return (
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                <path d="M7 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" stroke={stroke} strokeWidth="1.8" fill="none" />
                <path d="M13 21c-1.7-3-4.3-4.5-7-4.5S.7 18 .1 21" stroke={stroke} strokeWidth="1.8" fill="none" />
                <path d="M14 12l2.5 2.5a2 2 0 0 0 2.8 0l.7-.7a1.5 1.5 0 0 1 2.1 2.1l-2.8 2.8a3.5 3.5 0 0 1-5 0L12 16" stroke={stroke} strokeWidth="1.8" fill="none" />
            </svg>
        );
    }
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <path d="M12.1 20.3s-7-4.3-7-9.3A4.6 4.6 0 0 1 9.7 6a4.9 4.9 0 0 1 2.4.7A4.9 4.9 0 0 1 14.5 6a4.6 4.6 0 0 1 4.6 5c0 5-7 9.3-7 9.3Z" stroke="currentColor" strokeWidth="1.8" fill="none" />
            <path d="M7 14h4.2a2.6 2.6 0 0 1 1.8.7l.8.8a2.6 2.6 0 0 0 1.8.7H18" stroke="currentColor" strokeWidth="1.8" fill="none" />
        </svg>
    );
}

const ROLE_OPTIONS: Array<{ key: Role; title: string; desc: string; bullets: string[] }> = [
    // { key: "stakeholder", title: "حامی", desc: "پشتیبانی و تامین منابع", bullets: ["مدیریت کمک‌ها و فاکتورها", "گزارش‌دهی شفاف", "پیگیری تاثیر"] },
    { key: "ambassador", title: "سفیر", desc: "معرفی و مدیریت نوجوانان", bullets: ["مدیریت پروفایل نوجوانان", "بارگذاری مدارک و تاییدیه‌ها", "پیگیری وضعیت‌ها"] },
];

function useArrowNav({ value, onChange }: { value: Role | null; onChange: (r: Role) => void }) {
    return (e: React.KeyboardEvent) => {
        const keys = ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"];
        if (!keys.includes(e.key)) return;
        e.preventDefault();
        const order: Role[] = ["ambassador", "stakeholder"];
        const idx = value ? order.indexOf(value) : 0;
        const next = e.key === "ArrowLeft" || e.key === "ArrowUp" ? order[(idx - 1 + order.length) % order.length] : order[(idx + 1) % order.length];
        onChange(next);
    };
}

function RoleSelector({
    value,
    onChange,
    className,
    disabled,
    legend = "نقش خود را انتخاب کنید",
}: {
    value: Role | null;
    onChange: (r: Role) => void;
    className?: string;
    disabled?: boolean;
    legend?: string;
}) {
    const onKey = useArrowNav({ value, onChange });

    return (
        <fieldset dir="rtl" className={["text-right", className].filter(Boolean).join(" ")}>
            <legend className="text-sm font-medium mb-2">{legend}</legend>
            <div onKeyDown={onKey} className="space-y-2" role="radiogroup" aria-label={legend}>
                {ROLE_OPTIONS.map((opt) => {
                    const active = value === opt.key;
                    return (
                        <div
                            key={opt.key}
                            className={[
                                "rounded-2xl border overflow-hidden transition-all",
                                active ? "border-teal-600 shadow-sm" : "border-slate-200 hover:border-slate-300",
                            ].join(" ")}
                        >
                            <label
                                htmlFor={`role - ${opt.key} `}
                                className="flex items-center justify-between p-3 cursor-pointer"
                                aria-expanded={active}
                            >
                                <div className="flex items-center gap-3">
                                    <input
                                        id={`role - ${opt.key} `}
                                        type="radio"
                                        name="role"
                                        className="h-4 w-4 accent-teal-600"
                                        checked={active}
                                        disabled={disabled}
                                        onChange={() => onChange(opt.key)}
                                    />
                                    <div className="flex items-center gap-2">
                                        <div className={["h-8 w-8 grid place-items-center rounded-lg border", active ? "bg-teal-50 text-teal-700 border-teal-200" : "bg-slate-50 text-slate-700 border-slate-200"].join(" ")}>
                                            <RoleIcon role={opt.key} />
                                        </div>
                                        <div>
                                            <div className="font-semibold leading-tight">{opt.title}</div>
                                        </div>
                                    </div>
                                </div>
                            </label>
                        </div>
                    );
                })}
            </div>
        </fieldset>
    );
}


export function AuthModalLikeImage({ open, onClose }: { open: boolean; onClose: () => void }) {
    const dialogRef = React.useRef<HTMLDivElement | null>(null);

    // flow state
    const [stage, setStage] = React.useState<Stage>("identify");
    const [role, setRole] = React.useState<Role | null>(null);

    // identity & form state
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    // signup fields (shared)
    const [fullName, setFullName] = React.useState("");
    const [age, setAge] = React.useState<number | "">("");

    // success screen data & redirect
    const [welcomeName, setWelcomeName] = React.useState<string | null>(null);
    const [targetRole, setTargetRole] = React.useState<Role | null>(null);
    const [redirectIn, setRedirectIn] = React.useState<number>(4);

    // async state
    const [checking, setChecking] = React.useState(false);
    const [checkError, setCheckError] = React.useState<string | null>(null);
    const [lastChecked, setLastChecked] = React.useState<string>("");
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // open/close lifecycle
    // open/close lifecycle
    React.useEffect(() => {
        if (!open) return;

        // reset fields…
        setStage("identify");
        setRole(null);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setFullName("");
        setAge("");
        setChecking(false);
        setCheckError(null);
        setLastChecked("");
        setLoading(false);
        setError(null);
        setWelcomeName(null);
        setTargetRole(null);
        setRedirectIn(4);

        const root = document.documentElement;
        const body = document.body;

        // Keep previous inline styles to restore later
        const prevOverflow = body.style.overflow;
        const prevPaddingRight = body.style.paddingRight;

        // Compute scrollbar width once and share via CSS var
        const sbw = window.innerWidth - root.clientWidth;
        root.classList.add("modal-open");
        root.style.setProperty("--sbw", `${Math.max(0, sbw)}px`);

        // Lock scroll + keep layout width stable for page content
        body.style.overflow = "hidden";
        if (sbw > 0) body.style.paddingRight = `${sbw}px`;

        const onKey = (e: KeyboardEvent) => {
            if (!open) return;
            if (e.key === "Escape") onClose();
            if (e.key === "Tab" && dialogRef.current) {
                const f = dialogRef.current.querySelectorAll<HTMLElement>(
                    'a[href],button:not([disabled]),input:not([disabled]),[tabindex="0"]'
                );
                if (!f.length) return;
                const first = f[0];
                const last = f[f.length - 1];
                const a = document.activeElement as HTMLElement;
                if (e.shiftKey && a === first) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && a === last) { e.preventDefault(); first.focus(); }
            }
        };

        document.addEventListener("keydown", onKey);

        return () => {
            document.removeEventListener("keydown", onKey);
            // restore styles
            body.style.overflow = prevOverflow || "";
            body.style.paddingRight = prevPaddingRight || "";
            root.classList.remove("modal-open");
            root.style.removeProperty("--sbw");
        };
    }, [open, onClose]);


    // countdown + auto-redirect when success
    React.useEffect(() => {
        if (stage !== "success" || !targetRole) return;
        setRedirectIn(4); // ensure it always starts at 4 when entering success
        const t0 = setInterval(() => {
            setRedirectIn((s) => {
                if (s <= 1) {
                    clearInterval(t0);
                    redirectToPanel(targetRole);
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
        return () => clearInterval(t0);
    }, [stage, targetRole]);

    // ---- Handlers ----
    const handleManualCheck = async () => {
        setCheckError(null);
        if (!isEmailLike(email)) return setCheckError("فرمت ایمیل نادرست است");
        if (!role)
            return setError("لطفاً نقش خود را انتخاب کنید (سفیر یا حامی) و دوباره تلاش کنید.");
        setChecking(true);
        try {
            const action = await api.checkEmail(email.trim(), role);
            setLastChecked(email);
            setStage(action === "login" ? "login" : "signup");
        } catch (e: any) {
            setCheckError(e?.message || "خطا در بررسی ایمیل");
        } finally {
            setChecking(false);
        }
    };

    const submitLogin = async () => {
        setError(null);
        if (!isEmailLike(email)) return setError("ایمیل نامعتبر است");
        if (!password) return setError("رمز عبور الزامی است");
        if (!role) return setError("لطفاً نقش خود را انتخاب کنید (سفیر یا حامی) و دوباره تلاش کنید.");

        setLoading(true);
        try {
            const payload: LoginPayload = { email: email.trim(), password };

            // 1) Login (stores token internally in api.*)
            if (role === "ambassador") {
                await api.loginAmbassador(payload);
            } else {
                await api.loginStakeholder(payload);
            }

            // 2) Fetch /me from the role-specific endpoint and cache it once
            let me: any = null;
            try {
                me = role === "ambassador" ? await api.getMeAmbassador() : await api.getMeStakeholder();
                // cache for later reads (Header, Dashboard, Profile)
                localStorage.setItem(CACHE_KEYS.me[role], JSON.stringify(me));
            } catch {
                // If /me fails, continue gracefully (redirect will still work with selected role)
                localStorage.removeItem(CACHE_KEYS.me[role]);
            }

            // 3) Success UI + redirect role
            const resolvedRole: Role =
                me?.role === "ambassador" || me?.role === "stakeholder" ? me.role : role;

            setWelcomeName(me?.full_name || null);
            setTargetRole(resolvedRole);
            setStage("success");
        } catch (e: any) {
            setError(e?.message || "ورود ناموفق بود");
        } finally {
            setLoading(false);
        }
    };


    const submitSignup = async () => {
        setError(null);
        if (!isEmailLike(email)) return setError("ایمیل نامعتبر است");
        if (!fullName.trim()) return setError("نام و نام خانوادگی الزامی است");
        if (age === "" || Number.isNaN(Number(age)) || Number(age) <= 0) return setError("سن را به‌درستی وارد کنید");
        if (!password || password.length < 8) return setError("رمز عبور حداقل ۸ کاراکتر");
        if (password !== confirmPassword) return setError("رمز عبور و تکرار آن یکسان نیست");
        if (!role) return setError("لطفاً نقش خود را انتخاب کنید");

        setLoading(true);
        try {
            if (role === "ambassador") {
                const payload: RegisterAmbassadorPayload = {
                    age: Number(age),
                    email: email.trim(),
                    full_name: fullName.trim(),
                    password,
                    role: "ambassador",
                };
                await api.registerAmbassador(payload);
            } else {
                const payload: RegisterStakeholderPayload = {
                    age: Number(age),
                    email: email.trim(),
                    full_name: fullName.trim(),
                    password,
                    role: "stakeholder",
                };
                await api.registerStakeholder(payload);
            }

            // Optionally fetch /me; if not available, use local form data.
            let me: any = null;
            try {
                me = role === "ambassador" ? await api.getMeAmbassador() : await api.getMeStakeholder();
                // cache for later reads (Header, Dashboard, Profile)
                localStorage.setItem(CACHE_KEYS.me[role], JSON.stringify(me));
            } catch {
                // If /me fails, continue gracefully (redirect will still work with selected role)
                localStorage.removeItem(CACHE_KEYS.me[role]);
            }
            const resolvedRole: Role = (me?.role === "ambassador" || me?.role === "stakeholder")
                ? me.role
                : role;

            setWelcomeName(me?.full_name || fullName.trim());
            setTargetRole(resolvedRole);
            setStage("success");
        } catch (e: any) {
            setError(e?.message || "ثبت‌نام ناموفق بود");
        } finally {
            setLoading(false);
        }
    };

    const HeaderIcon = () => (
        <div className="mx-auto mb-2 mt-5 h-20 w-20 rounded-3xl border border-teal-200 grid place-items-center bg-white text-teal-700 shadow-sm">
            <BrandLogo size="md" alt="Rubitech" scale={1.35} />
        </div>
    );

    if (!open) return null;

    const passwordMismatch = Boolean(password) && Boolean(confirmPassword) && password !== confirmPassword;

    return (
        <>
            <div className="fixed inset-0 z-[80] bg-black/50" onClick={onClose} />
            <div className="fixed inset-0 z-[81] flex items-center justify-center p-4" dir="rtl">
                <div
                    ref={dialogRef}
                    role="dialog"
                    aria-modal="true"
                    className="w-full max-w-lg rounded-3xl bg-white shadow-2xl"
                >
                    {/* Top bar */}
                    <div className="relative h-10">
                        <button
                            onClick={onClose}
                            aria-label="بستن"
                            className="absolute left-3 top-3 rounded-md p-1.5 hover:bg-black/5"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>

                    {/* Identify */}
                    {stage === "identify" && (
                        <form
                            className="px-6 pb-6"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!checking && isEmailLike(email)) handleManualCheck();
                            }}
                        >
                            <HeaderIcon />
                            <h3 className="text-center text-[20px] font-bold">ورود / ثبت‌نام</h3>
                            <p className="text-center text-xs text-slate-500 mt-1">ابتدا ایمیل خود را وارد کنید تا مسیر مناسب تعیین شود.</p>

                            {/* Role (required to route signup/login and correct panel) */}
                            <RoleSelector value={role} onChange={setRole} className="mt-4" />

                            {/* Email */}
                            <div className="text-right mt-4">
                                <label htmlFor="id-email" className="block text-sm font-medium">
                                    ایمیل <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="id-email"
                                    type="email"
                                    dir="ltr"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-200"
                                    autoFocus
                                />
                                <div className="min-h-[20px] mt-1">
                                    {checkError && <p className="text-[12px] text-red-600">{checkError}</p>}
                                    {!checkError && checking && <p className="text-[12px] text-slate-500">در حال بررسی ایمیل…</p>}
                                    {!checkError && !checking && isEmailLike(email) && email === lastChecked && (
                                        <p className="text-[12px] text-teal-700">ایمیل بررسی شد.</p>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={checking || !isEmailLike(email)}
                                className={[
                                    "mt-2 w-full rounded-xl px-4 py-2.5 font-semibold text-white",
                                    checking || !isEmailLike(email) ? "bg-teal-400/70 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700",
                                    "focus:outline-none focus:ring-4 focus:ring-teal-300",
                                ].join(" ")}
                            >
                                ادامه
                            </button>

                            <p className="mt-3 text-[11px] text-slate-500 text-center">
                                با ادامه، <a href="#" className="text-teal-600 underline">شرایط استفاده</a> را می‌پذیرم.
                            </p>
                        </form>
                    )}

                    {/* Login */}
                    {stage === "login" && (
                        <form
                            className="px-6 pb-6"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!loading) submitLogin();
                            }}
                        >
                            <HeaderIcon />
                            <h3 className="text-center text-[20px] font-bold">ورود</h3>
                            <p className="text-center text-sm text-slate-600 mt-1">
                                ایمیل: <span className="font-semibold">{email}</span>
                            </p>
                            {role && (
                                <div className="mt-3 flex items-center justify-center gap-2 text-xs">
                                    <span className="rounded-full bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5">
                                        نقش انتخابی: {role === "ambassador" ? "سفیر" : "حامی"}
                                    </span>
                                    <button type="button" onClick={() => setStage("identify")} className="text-slate-500 hover:text-slate-700 underline">
                                        تغییر
                                    </button>
                                </div>
                            )}
                            <div className="mt-4 space-y-3">
                                <label htmlFor="pass-login" className="block text-sm font-medium">
                                    رمز عبور <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="pass-login"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-200"
                                    autoFocus
                                />
                                {error && <p className="text-red-600 text-xs">{error}</p>}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={[
                                        "w-full rounded-xl px-4 py-2.5 font-semibold text-white",
                                        loading ? "bg-teal-400/70 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700",
                                        "focus:outline-none focus:ring-4 focus:ring-teal-300",
                                    ].join(" ")}
                                >
                                    {loading ? "در حال ورود…" : "ورود"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setStage("identify"); setError(null); }}
                                    className="w-full rounded-xl px-4 py-2.5 font-semibold border border-slate-200 hover:bg-slate-50"
                                >
                                    بازگشت
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Signup */}
                    {stage === "signup" && (
                        <form
                            className="px-6 pb-6"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!loading && !passwordMismatch && role) submitSignup();
                            }}
                        >
                            <HeaderIcon />
                            <h3 className="text-center text-[20px] font-bold">ساخت حساب</h3>
                            <p className="text-center text-sm text-slate-600 mt-1">
                                برای ایمیل: <span className="font-semibold">{email}</span>
                            </p>

                            {/* Role picker (required for signup) */}
                            <RoleSelector value={role} onChange={setRole} className="mt-4" />

                            <div className="mt-3 grid grid-cols-1 gap-3">
                                <div>
                                    <label htmlFor="full-name" className="block text-sm font-medium">
                                        نام و نام خانوادگی <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="full-name"
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="نام شما"
                                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-200"
                                        autoFocus
                                    />
                                </div>

                                {/* Age (own row) */}
                                <div>
                                    <label htmlFor="age" className="block text-sm font-medium">
                                        سن <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="age"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={age}
                                        onChange={(e) => {
                                            const v = e.target.value.replace(/[^\d]/g, "");
                                            setAge(v === "" ? "" : Number(v));
                                        }}
                                        placeholder="مثلاً ۲۵"
                                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-200"
                                    />
                                </div>

                                {/* Password & Repeat Password on the SAME row */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor="pass-sign" className="block text-sm font-medium">
                                            رمز عبور <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="pass-sign"
                                            type="password"
                                            placeholder="حداقل ۸ کاراکتر"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-200"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="pass-repeat" className="block text-sm font-medium">
                                            تکرار رمز عبور <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="pass-repeat"
                                            type="password"
                                            placeholder="تکرار رمز"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-200"
                                        />
                                    </div>
                                </div>
                            </div>

                            {(error || passwordMismatch) && (
                                <p className="text-red-600 text-xs mt-1">
                                    {error || "رمز عبور و تکرار آن یکسان نیست"}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !role || passwordMismatch}
                                className={[
                                    "mt-3 w-full rounded-xl px-4 py-2.5 font-semibold text-white",
                                    (loading || !role || passwordMismatch) ? "bg-teal-400/70 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700",
                                    "focus:outline-none focus:ring-4 focus:ring-teal-300",
                                ].join(" ")}
                            >
                                {loading ? "در حال ساخت حساب…" : "ثبت‌نام"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStage("identify")}
                                className="mt-2 w-full rounded-xl px-4 py-2.5 font-semibold border border-slate-200 hover:bg-slate-50"
                            >
                                بازگشت
                            </button>
                        </form>
                    )}

                    {/* Success + Auto Redirect (no confirmation) */}
                    {stage === "success" && (
                        <div className="px-6 pb-8 text-center">
                            <HeaderIcon />
                            <h3 className="text-[20px] font-bold">خوش آمدید {welcomeName ? `، ${welcomeName} ` : ""} عزیز !</h3>
                            <p className="text-sm text-slate-600 mt-1">
                                ورود/ثبت‌نام با موفقیت انجام شد. {targetRole === "ambassador" ? "در حال انتقال به پنل سفیر…" : targetRole === "stakeholder" ? "در حال انتقال به پنل حامی…" : "در حال انتقال…"}
                            </p>
                            <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-3 py-1.5 text-teal-700">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                                    <path d="M12 8v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                                <span className="text-sm">انتقال خودکار تا {redirectIn} ثانیه دیگر</span>
                            </div>

                            <div className="mt-5">
                                <button
                                    type="button"
                                    onClick={() => targetRole && redirectToPanel(targetRole)}
                                    className="w-full rounded-xl px-4 py-2.5 font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300"
                                >
                                    رفتن سریع به پنل
                                </button>
                            </div>

                            {/* <p className="mt-2 text-xs text-slate-500">
                اگر به‌صورت خودکار منتقل نشدید، روی دکمه بالا کلیک کنید.
              </p> */}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
