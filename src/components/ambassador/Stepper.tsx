import React from "react";

interface StepperProps {
  steps: string[];
  current: number; // zero-based index
  variant?: "brand" | "danger";
}

export function Stepper({ steps, current, variant = "brand" }: StepperProps) {
  const activeDot =
    variant === "danger" ? "bg-red-500" : "bg-emerald-500";
  const activeBg =
    variant === "danger"
      ? "border-red-200 bg-red-50"
      : "border-emerald-200 bg-emerald-50";
  const lineColor =
    variant === "danger" ? "bg-red-200" : "bg-emerald-200";

  return (
    <ol className="grid md:grid-cols-3 gap-2">
      {steps.map((label, i) => {
        const isActive = i <= current;

        const itemClasses = `relative rounded-xl border p-3 text-sm flex items-center gap-2 ${isActive ? activeBg : "border-slate-200 bg-white/80"
          }`;

        const dotClasses = `w-6 h-6 rounded-full text-xs text-white flex items-center justify-center ${isActive ? activeDot : "bg-slate-300"
          }`;

        return (
          <li
            key={i}
            className={itemClasses}
            aria-current={i === current ? "step" : undefined}
          >
            {/* Connector line (only after first step) */}
            {i > 0 && (
              <span
                className={`absolute left-2 right-2 -top-1 h-0.5 ${isActive ? lineColor : "bg-slate-200"
                  }`}
              />
            )}

            {/* Step dot */}
            <span className={dotClasses}>{i + 1}</span>

            {/* Label */}
            {label}
          </li>
        );
      })}
    </ol>
  );
}
