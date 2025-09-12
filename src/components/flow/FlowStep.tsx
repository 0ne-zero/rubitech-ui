import React from "react";
import { IconLike } from "../../types/common";

type Props = {
  number: number | string;
  title: string;
  description: string;
  IconComponent: IconLike;
  isOdd: boolean;
  iconBgColor: string;
  stepColor: string;
  boxBgColor: string;
};
export const FlowStep = ({
  number, title, description, IconComponent, isOdd, iconBgColor, stepColor, boxBgColor,
}: Props) => (
  <div className="relative md:w-1/2 md:py-1" style={isOdd ? { alignSelf: "flex-start" } : { alignSelf: "flex-end" }}>
    <div className={`relative rounded-2xl p-6 shadow-md ring-1 ring-slate-200/80 transition-all duration-300 hover:shadow-xl hover:ring-slate-300 md:flex md:items-start md:gap-6 ${boxBgColor || "bg-white"} ${isOdd ? "md:mr-8" : "md:ml-8"}`}>
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBgColor || "bg-[#E5F0FA]"} text-[#0A2540]`}>
        <IconComponent className="h-8 w-8" />
      </div>
      <div className="mt-4 md:mt-0">
        <div className="flex items-baseline gap-3">
          <span className={`text-xl font-extrabold ${stepColor || "text-[#00D09C]"}`}>{number}</span>
          <h3 className="text-xl font-bold text-[#0A2540]">{title}</h3>
        </div>
        <p className="mt-2 text-[20px] leading-relaxed text-[#1A1F36] opacity-80">{description}</p>
      </div>
    </div>
  </div>
);
