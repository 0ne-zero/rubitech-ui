import React from "react";

type PrimaryCTAProps = { onClick?: () => void; className?: string; children: React.ReactNode };
export const PrimaryCTA = ({ onClick, children, className = "" }: PrimaryCTAProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`min-h-12 rounded-lg bg-[var(--green)] px-8 py-4 text-[18px] font-extrabold text-white strong-shadow ring-1 ring-[var(--green)]/35 transition hover:-translate-y-0.5 hover:bg-[var(--green-strong)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--green)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${className}`}
    aria-label="حمایت خود رو ثبت کن"
  >
    {children}
  </button>
);
