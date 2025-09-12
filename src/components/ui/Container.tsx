import React from "react";
import clsx from "clsx";
export function HeaderContainer({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx("container-pro", className)}>{children}</div>;
}

type ContainerProps = {
  className?: string;
  children: React.ReactNode;
  y?: "none" | "xs" | "sm" | "md" | "lg";
};

const CONTAINER_Y: Record<NonNullable<ContainerProps["y"]>, string> = {
  none: "py-0",
  xs: "py-4 md:py-6",
  sm: "py-6 md:py-8",
  md: "py-8 md:py-10",
  lg: "py-24 md:py-24",
};

export const Container = ({ className = "", children, y = "sm" }: ContainerProps) => (
  <div className={`mx-auto w-full max-w-7xl px-4 ${CONTAINER_Y[y]} ${className}`}>{children}</div>
);