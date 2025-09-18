import React from "react";

type Tone = "success" | "warning" | "info" | "danger" | "neutral";

interface StatusBadgeProps {
  label: string;
  tone?: Tone;
}

const toneClasses: Record<Tone, string> = {
  success: "bg-green-100 text-green-800",
  warning: "bg-amber-100 text-amber-800",
  info: "bg-blue-100 text-blue-800",
  danger: "bg-red-100 text-red-800",
  neutral: "bg-slate-100 text-slate-700",
};

export function StatusBadge({ label, tone = "neutral" }: StatusBadgeProps) {
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center ${toneClasses[tone]}`}
      aria-label={`وضعیت: ${label}`}
    >
      {label}
    </span>
  );
}
