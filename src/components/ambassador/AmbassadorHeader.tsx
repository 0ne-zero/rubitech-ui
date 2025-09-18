import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, Users, ClipboardList, User } from "lucide-react";
import { useAmbassadorData } from "@/routes/ambassador/store";
import { StatusBadge } from "@/components/ambassador/StatusBadge";
export function AmbassadorHeader() {
    const { profile } = useAmbassadorData();
    const navigate = useNavigate();
    const verified = profile.kyc.status === "approved";

    return (

        <>
            <header dir="rtl" className="sticky top-4 z-40 px-4">
                <div className="mx-6 h-16 flex items-center justify-between rounded-2xl bg-white/80 backdrop-blur-lg border border-slate-200/80 shadow-sm px-4">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={20} className="text-sky-600" />
                        <span className="font-bold text-slate-800">پنل سفیر</span>
                    </div>

                    {/* Left Side: User Status & Profile */}
                    <div className="flex items-center gap-4">
                        <StatusBadge label={verified ? "هویت تأیید شده" : "نیاز به تأیید"} tone={verified ? "success" : "warning"} />
                        <button onClick={() => navigate("/ambassador/profile")} className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900">
                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`} alt="Avatar" className="h-8 w-8 rounded-full bg-slate-200 ring-2 ring-white" />
                            <span className="hidden sm:inline">{profile.name}</span>
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
}