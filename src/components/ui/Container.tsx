import React from "react";
import clsx from "clsx";
export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx("container-pro", className)}>{children}</div>;
}
