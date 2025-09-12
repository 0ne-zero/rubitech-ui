import React from "react";
import { IconLike } from "../../types/common";

type Props = {
  Icon: IconLike;
  iconClass: string;
  title: string;
  wrapperClass: string;
  description: string | React.ReactNode;
};

export const DifferentiationCard = ({ Icon, iconClass, title, wrapperClass, description }: Props) => (
  <div className={wrapperClass}>
    <Icon className={iconClass} />
    <div className="mt-3 mb-3 font-bold text-xl text-[#0A2540]">{title}</div>
    {typeof description === "string" ? (
      <p className="mt-1 text-[18px] font-medium leading-[1.7] text-[#1A1F36] opacity-90">{description}</p>
    ) : (
      description
    )}
  </div>
);
