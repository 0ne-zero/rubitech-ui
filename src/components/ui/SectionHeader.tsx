import React from "react";
import { IconLike } from "../../types/common";

type Props = { kicker?: string; title: string; subtitle?: string; Icon?: IconLike };
export const SectionHeader = ({ kicker, title, subtitle, Icon }: Props) => (
  <div className="relative mb-10">
    <div className="inline-flex items-center gap-2 rounded-full bg-[var(--sky)] px-3 py-1 text-[var(--brand)] ring ring-[var(--sky-ring)]">
      <span className="text-[24px] font-bold">{kicker}</span>
      {Icon ? <Icon className="h-6 w-7" /> : null}
    </div>
    <h2 className="mt-4 text-[32px] font-extrabold leading-[1.5] text-[#0A2540] md:text-[28px]">{title}</h2>
    {subtitle ? <p className="mt-4 max-w-3xl text-[20px] leading-[1.6] text-[#1A1F36] opacity-90">{subtitle}</p> : null}
    <div className="mt-6 h-1.5 w-28 rounded-full bg-gradient-to-l from-[var(--green)] to-[var(--brand)]" />
  </div>
);
