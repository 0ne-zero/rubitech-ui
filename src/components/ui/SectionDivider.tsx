import React from "react";

type DividerProps = { variant?: "brand" | "subtle" | "dotted"; className?: string };
export const SectionDivider = ({ variant = "brand", className = "" }: DividerProps) => {
  if (variant === "dotted") return <hr className={`mx-auto my-6 h-0 border-0 border-t-2 border-dotted border-slate-300/80 w-full max-w-7xl ${className}`} />;
  if (variant === "subtle") return <hr className={`mx-auto my-6 h-px w/full max-w-7xl bg-gradient-to-l from-transparent via-slate-200 to-transparent ${className}`} />;
  return <div aria-hidden="true" className={`mx-auto my-6 h-[2px] w-full max-w-7xl rounded-full bg-gradient-to-l from-[var(--green)] via-slate-200 to-[var(--brand)] ${className}`} />;
};
