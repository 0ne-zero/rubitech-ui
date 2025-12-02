import React from "react";
export type IconLike = React.ComponentType<{ className?: string }>;

export type Partner = {
  logoUrl: string;
  name: string;
  description: string;
  url: string;
};


export const partners: Partner[] = [
  {
    logoUrl: `${import.meta.env.BASE_URL}images/logos/rubikamp.jpg`,
    name: "روبیکمپ",
    description: "بورسیه و فراهم‌سازی مسیر رشد برای نوجوانان بااستعداد.",
    url: "https://rubikamp.org/?utm_source=rubitech",
  },
  {
    logoUrl: `${import.meta.env.BASE_URL}images/logos/irancell.webp`,
    name: "ایرانسل",
    description: "تامین دسترسی به اینترنت نوجوانان.",
    url: "https://irancell.ir/?utm_source=rubitech",
  },
  {
    logoUrl: `${import.meta.env.BASE_URL}images/logos/maktabkhoneh.jpg`,
    name: "مکتب‌خونه",
    description: "تامین محتوای آموزشی و رهگیری مسیر رشد نوجوانان.",
    url: "https://maktabkhooneh.org/?utm_source=rubitech",
  },
  {
    logoUrl: `${import.meta.env.BASE_URL}images/logos/snapp-pay.jpg`,
    name: "اسنپ‌پی",
    description: "حامی مالی نوجوانان برای خرید لپ‌تاپ.",
    url: "https://snapppay.ir/?utm_source=rubitech",
  },
] as const;
