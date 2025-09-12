import React from "react";
import { Partner } from "../../types/common";

export const PartnerCard = ({ logoUrl, name, description, url }: Partner) => (
  <a href={url} target="_blank" rel="noreferrer" className="block focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--brand)]/35 rounded-2xl">
    <div className="group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[var(--sky-ring)] transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[var(--brand)]/25">
      <div className="grid h-20 w-20 flex-shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-200/70">
        <img src={logoUrl} alt={`لوگوی ${name}`} className="object-contain opacity-95 transition" loading="lazy" />
      </div>
      <div className="min-w-0 mr-2">
        <div className="truncate text-[22px] font-bold text-[#0A2540]">{name}</div>
        <p className="mt-1 line-clamp-2 text-[20px] leading-6 text-[#1A1F36] opacity-80">{description}</p>
      </div>
    </div>
  </a>
);
