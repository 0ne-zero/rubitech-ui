import React from "react";
import { Helmet } from "react-helmet-async";
import { site } from "@/config/site";
type Props = { title?: string; description?: string };
export function Seo({ title, description }: Props) {
  const t = title ? `${title} | ${site.name}` : site.name;
  const d = description || site.description;
  const url = site.url;
  return (
    <Helmet>
      <title>{t}</title>
      <meta name="description" content={d} />
      <meta property="og:title" content={t} />
      <meta property="og:description" content={d} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
    </Helmet>
  );
}
