import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { StatusBadge } from "@/components/ambassador/StatusBadge";
import { api, CACHE_KEYS } from "@/services/api";
import { useCached } from "@/hooks/useCached";

export function AmbassadorHeader() {
    const navigate = useNavigate();

    // 🔹 Read /me from localStorage; if missing, call api.getMe() once and cache it.
    const { data: me, loading } = useCached(CACHE_KEYS.me.ambassador, api.getMeAmbassador);

    // Derive display name
    const fullName = me?.full_name || (loading ? "…" : "کاربر");

    // Derive verification flags (prefer /me, fallback to store)
    const emailVerified = me?.email_verified;
    const phoneVerified = me?.phone_number_verified;
    const kycStatus = me?.verified_by_rubitech;

    const verified = Boolean(kycStatus);

    const profile_picture_url = import.meta.env.VITE_PROFILE_PICTURE_BASE_URL + (me?.profile_picture_path || "");

    return (
        <header dir="rtl" className="sticky top-4 z-40 px-4">
            <div className="mx-6 h-16 flex items-center justify-between rounded-2xl bg-white/80 backdrop-blur-lg border border-slate-200/80 shadow-sm px-4">
                {/* Right: Title */}
                <div className="flex items-center gap-2">
                    <ShieldCheck size={20} className="text-sky-600" />
                    <span className="font-bold text-slate-800">پنل سفیر</span>
                </div>

                {/* Left: Status + Profile */}
                <div className="flex items-center gap-4">
                    <StatusBadge
                        label={verified ? "هویت احراز شده" : "نیاز به احراز هویت"}
                        tone={verified ? "success" : "warning"}
                    />

                    <button
                        onClick={() => navigate("/ambassador/profile")}
                        className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
                        title="پروفایل"
                    >
                        <span className="hidden sm:inline max-w-[180px] truncate">{fullName}</span>
                        <img
                            src={profile_picture_url}
                            alt="Avatar"
                            className="h-8 w-8 rounded-full bg-slate-200 ring-2 ring-white"
                        />
                    </button>
                </div>
            </div>
        </header>
    );
}
