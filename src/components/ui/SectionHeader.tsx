import React from "react";
import { IconLike } from "../../types/common";


type IconBadgeProps = {
  kicker?: string;
  Icon?: IconLike;
  className?: string;
  size?: "sm" | "md" | "lg"; // optional
};

const SIZES = {
  sm: {
    kicker: "text-[18px]",
    icon: "h-5 w-6",
    pad: "px-3 py-1.5",
  },
  md: {
    kicker: "text-[24px]",
    icon: "h-6 w-7",
    pad: "px-3 py-1",
  },
  lg: {
    kicker: "text-[28px]",
    icon: "h-8 w-8",
    pad: "px-4 py-2",
  },
} as const;

export const IconBadge = ({
  kicker,
  Icon,
  className = "",
  size = "md", // default keeps your current styles
}: IconBadgeProps) => {
  const s = SIZES[size];
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full bg-[var(--sky)] ${s.pad} text-[var(--brand)] ring ring-[var(--sky-ring)] ${className}`}
    >
      {kicker ? <span className={`${s.kicker} font-bold`}>{kicker}</span> : null}
      {Icon ? <Icon className={s.icon} /> : null}
    </div>
  );
};


type SectionHeaderProps = { kicker?: string; title?: string; subtitle?: string; Icon?: IconLike };
export const SectionHeader = ({ kicker, title, subtitle, Icon }: SectionHeaderProps) => (
  <div className="relative mb-10">
    <IconBadge kicker={kicker} Icon={Icon} />
    {title ? (
      <h2 className="mt-4 text-[32px] font-extrabold leading-[1.5] text-[#0A2540] md:text-[28px]">
        {title}
      </h2>
    ) : null}
    {subtitle ? (
      <p className="mt-4 max-w-3xl text-[20px] leading-[1.6] text-[#1A1F36] opacity-90">
        {subtitle}
      </p>
    ) : null}
    {title ? (
      <div className="mt-6 h-1.5 w-28 rounded-full bg-gradient-to-l from-[var(--green)] to-[var(--brand)]" />
    ) : null}
  </div>
);
