import React from "react";

type SectionProps = { id?: string; className?: string; children: React.ReactNode };
export const Section = ({ id, className = "", children }: SectionProps) => (
  <section id={id} className={className}>{children}</section>
);

type ContainerProps = { className?: string; children: React.ReactNode; y?: "none"|"xs"|"sm"|"md"|"lg"; };
const CONTAINER_Y: Record<NonNullable<ContainerProps["y"]>, string> = {
  none: "py-0", xs: "py-4 md:py-6", sm: "py-6 md:py-8", md: "py-8 md:py-10", lg: "py-24 md:py-24",
};
export const Container = ({ className = "", children, y = "sm" }: ContainerProps) => (
  <div className={`mx-auto w-full max-w-7xl px-4 ${CONTAINER_Y[y]} ${className}`}>{children}</div>
);
