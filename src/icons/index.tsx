import React from "react";
type SVGProps = React.SVGProps<SVGSVGElement>;
type DivProps = React.HTMLAttributes<HTMLDivElement>;

import logoWebp from "@/assets/logo/rubitech-logo.webp";
import logoPng from "@/assets/logo/rubitech-logo.png";

export const IconShield = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
    <path d="M12 3l7 3v6a9 9 0 0 1-7 8.75A9 9 0 0 1 5 12V6l7-3Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconLoop = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
    <path d="M17 1v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M21 5a9 9 0 1 0 2.62 6.38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const IconUsers = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
    <circle cx="8" cy="9" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M1.5 20a6.5 6.5 0 0 1 13 0" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="17" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M14 20a6 6 0  0 1 8.5-5.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const IconEye = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const IconSparkles = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
    <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 16l.8 2.2L8 19l-2.2.8L5 22l-.8-2.2L2 19l2.2-.8L5 16Z" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const IconLaptop = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
    <rect x="3" y="5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 17h18v2H3z" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const IconGlobe = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const IconNodePath = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...p}>
    <circle cx="4" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="20" cy="12" r="2" />
    <path d="M6 12h4M14 12h4" />
  </svg>
);

export const IconStampOfApproval = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...p}>
    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

// Heart-in-hand icon
export const IconHeartHand = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...p}>
    <path d="M7.5 3C4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3c-1.74 0-3.41.81-4.5 2.09C11.91 3.81 10.24 3 8.5 3H7.5z" />
    <path d="M7 11.5a4.5 4.5 0 0 1 9 0" />
  </svg>
);

// Carousel chevrons
export const IconChevronRight = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const IconChevronLeft = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export const IconQuestion = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
    <path d="M12 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M9.09 9a3 3 0 1 1 5.82 1c0 1.5-1 2-2 2-1 0-2 .5-2 2v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);


export const IconBuilding = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
    {/* Roof */}
    <path d="M3 9l9-5 9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* Columns */}
    <path d="M6.5 10.5v6M12 10.5v6M17.5 10.5v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Base + floor */}
    <path d="M4 19.5h16M3.5 21h17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Stylized entry (subtle) */}
    <path d="M11 13h2v4h-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

export const IconUserGroup = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
    {/* Central head */}
    <circle cx="12" cy="8.5" r="3" stroke="currentColor" strokeWidth="1.5" />
    {/* Central shoulders */}
    <path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Left peer */}
    <circle cx="6.5" cy="10.5" r="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2.5 20a5.5 5.5 0 0 1 7-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Right peer */}
    <circle cx="17.5" cy="10.5" r="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M21.5 20a5.5 5.5 0 0 0-7-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);


type IconProps = {
  className?: string;   // FlowStep will pass sizing here
  scale?: number;       // 1.0 = normal, 1.1 = 10% bigger, etc.
};

export const LogoGlyphIcon: React.FC<IconProps> = ({ className = "", scale = 1 }) => {
  return (
    <div className={["relative", className].join(" ")}>
      <picture>
        <source srcSet={logoWebp} type="image/webp" />
        <img
          src={logoPng}
          alt="" // decorative
          width={512}
          height={512}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain block select-none pointer-events-none"
          style={{
            transform: scale !== 1 ? `scale(${scale})` : undefined,
          }}
        />
      </picture>
    </div>
  );
};
