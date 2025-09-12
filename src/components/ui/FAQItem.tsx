import React from "react";

type FAQItemProps = { q: string; a: React.ReactNode };
export const FAQItem = ({ q, a }: FAQItemProps) => (
  <details className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 open:shadow-md">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
      <span className="text-lg font-semibold text-[#0A2540]">{q}</span>
      <span className="shrink-0 rounded-full border border-slate-300 px-2 py-1 text-xs text-slate-500 transition group-open:rotate-180">▾</span>
    </summary>
    <div className="mt-3 text-[18px] font-medium leading-[1.7] text-[#1A1F36] opacity-90">{a}</div>
  </details>
);
