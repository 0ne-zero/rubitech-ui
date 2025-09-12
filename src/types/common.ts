import React from "react";
export type IconLike = React.ComponentType<{ className?: string }>;

export type Partner = {
  logoUrl: string;
  name: string;
  description: string;
  url: string;
};
