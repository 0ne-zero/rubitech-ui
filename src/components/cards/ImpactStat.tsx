import React from "react";
import { IconLike } from "../../types/common";

type Props = { value: string | number; label: string; Icon: IconLike; bgColor: string; iconColor: string };
export const ImpactStat = ({ value, label, Icon, bgColor, iconColor }: Props) => (
  <div className={`flex items-center gap-4 rounded-2xl p-6 ${bgColor || "bg-slate-100"}`}>
    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/50 ${iconColor || "text-[#0A2540]"}`}>
      <Icon className="h-7 w-7" />
    </div>
    <div>
      <div className="text-3xl font-extrabold text-[#0A2540]">{value}</div>
      <div className="mt-1 text-base text-[#1A1F36] opacity-80">{label}</div>
    </div>
  </div>
);
