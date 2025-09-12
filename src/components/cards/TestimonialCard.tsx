import React from "react";

type Props = { quote: string; name: string; title: string; img: string };
export const TestimonialCard = ({ quote, name, title, img }: Props) => (
  <figure className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[var(--sky-ring)]">
    <figcaption className="flex items-center gap-3">
      <img src={img} alt="تصویر" className="h-16 w-15 rounded-full object-cover" loading="lazy" />
      <div>
        <div className="text-lg font-semibold text-[#0A2540]">{name}</div>
        <div className="text-sm font-semibold text-[#1A1F36] opacity-70">{title}</div>
      </div>
    </figcaption>
    <blockquote className="text-[19px] text-[#1A1F36] opacity-95 font-medium">“{quote}”</blockquote>
  </figure>
);
