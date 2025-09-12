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






// /** Utility: make absolute URLs from relative paths */
// const absUrl = (path?: string) => {
//   if (!path) return site.url;
//   return /^https?:\/\//i.test(path) ? path : `${site.url.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
// };

// /** Utility: ISO stringify if Date provided */
// const iso = (d?: string | Date) => (d instanceof Date ? d.toISOString() : d);

// type Breadcrumb = { name: string; url: string };

// type SeoProps = {
//   /** Page title (without site name) */
//   title?: string;
//   /** Page description */
//   description?: string;
//   /** Canonical path (e.g. `/about`) or full URL */
//   pathname?: string;
//   /** Override canonical if you need an external canonical */
//   canonical?: string;
//   /** OG/Twitter image path or absolute URL */
//   image?: string;
//   /** `website` (default) or `article` */
//   type?: "website" | "article";
//   /** Locale like `fa_IR`, `en_US` */
//   locale?: string;
//   /** Indexing controls */
//   noindex?: boolean;
//   nofollow?: boolean;
//   /** Twitter card type */
//   twitterCard?: "summary_large_image" | "summary";
//   /** Twitter handle override (e.g., "@rubitech") */
//   twitterSite?: string;

//   /** Article extras */
//   publishedTime?: string | Date;
//   modifiedTime?: string | Date;

//   /** Optional breadcrumb list for JSON-LD */
//   breadcrumbs?: Breadcrumb[];

//   /** Pass extra JSON-LD if needed */
//   extraJsonLd?: Record<string, any>;

//   /** Extra nodes to inject */
//   children?: React.ReactNode;
// };

// export function Seo({
//   title,
//   description,
//   pathname,
//   canonical,
//   image,
//   type = "website",
//   locale = site.locale || "fa_IR",
//   noindex = false,
//   nofollow = false,
//   twitterCard = "summary_large_image",
//   twitterSite = site.twitter || "",
//   publishedTime,
//   modifiedTime,
//   breadcrumbs,
//   extraJsonLd,
//   children,
// }: SeoProps) {
//   const t = title ? `${title} | ${site.name}` : site.name;
//   const d = description || site.description;
//   const url = canonical ? absUrl(canonical) : absUrl(pathname);
//   const img = absUrl(image || site.ogImage || "/og.jpg");
//   const robots = `${noindex ? "noindex" : "index"}, ${nofollow ? "nofollow" : "follow"}`;

//   // --- JSON-LD blocks
//   const ldWebsite = {
//     "@context": "https://schema.org",
//     "@type": "WebSite",
//     url: site.url,
//     name: site.name,
//     inLanguage: locale,
//     potentialAction: {
//       "@type": "SearchAction",
//       target: `${site.url}/search?q={search_term_string}`,
//       "query-input": "required name=search_term_string",
//     },
//   };

//   const ldOrg =
//     site.organization?.name
//       ? {
//           "@context": "https://schema.org",
//           "@type": "Organization",
//           name: site.organization.name,
//           url: site.url,
//           logo: site.organization.logo ? absUrl(site.organization.logo) : undefined,
//           sameAs: site.organization.sameAs || [],
//         }
//       : undefined;

//   const ldArticle =
//     type === "article"
//       ? {
//           "@context": "https://schema.org",
//           "@type": "Article",
//           mainEntityOfPage: url,
//           headline: title || site.name,
//           description: d,
//           image: [img],
//           datePublished: iso(publishedTime),
//           dateModified: iso(modifiedTime || publishedTime),
//           publisher: site.organization?.name
//             ? {
//                 "@type": "Organization",
//                 name: site.organization.name,
//                 logo: site.organization.logo ? { "@type": "ImageObject", url: absUrl(site.organization.logo) } : undefined,
//               }
//             : undefined,
//           inLanguage: locale,
//         }
//       : undefined;

//   const ldBreadcrumbs =
//     breadcrumbs && breadcrumbs.length
//       ? {
//           "@context": "https://schema.org",
//           "@type": "BreadcrumbList",
//           itemListElement: breadcrumbs.map((b, i) => ({
//             "@type": "ListItem",
//             position: i + 1,
//             name: b.name,
//             item: absUrl(b.url),
//           })),
//         }
//       : undefined;

//   const jsonLd = [ldWebsite, ldOrg, ldArticle, ldBreadcrumbs, extraJsonLd].filter(Boolean);

//   return (
//     <Helmet prioritizeSeoTags>
//       {/* Title */}
//       <title>{t}</title>
//       <meta name="description" content={d} />

//       {/* Canonical & Robots */}
//       <link rel="canonical" href={url} />
//       <meta name="robots" content={robots} />
//       <meta name="googlebot" content={robots} />

//       {/* PWA / Theming */}
//       {site.themeColor ? <meta name="theme-color" content={site.themeColor} /> : null}
//       {site.manifest ? <link rel="manifest" href={site.manifest} /> : null}
//       {site.icons?.favicon ? <link rel="icon" href={site.icons.favicon} /> : null}
//       {site.icons?.appleTouchIcon ? <link rel="apple-touch-icon" href={site.icons.appleTouchIcon} /> : null}

//       {/* Open Graph */}
//       <meta property="og:site_name" content={site.name} />
//       <meta property="og:locale" content={locale} />
//       {Array.isArray(site.localesAlt) &&
//         site.localesAlt.map((l) => <meta key={l} property="og:locale:alternate" content={l} />)}
//       <meta property="og:type" content={type} />
//       <meta property="og:url" content={url} />
//       <meta property="og:title" content={t} />
//       <meta property="og:description" content={d} />
//       <meta property="og:image" content={img} />
//       <meta property="og:image:secure_url" content={img} />
//       <meta property="og:image:alt" content={title || site.name} />
//       {/* Common social sharing dimensions */}
//       <meta property="og:image:width" content="1200" />
//       <meta property="og:image:height" content="630" />

//       {/* Article-specific OG */}
//       {type === "article" && iso(publishedTime) ? (
//         <meta property="article:published_time" content={iso(publishedTime)!} />
//       ) : null}
//       {type === "article" && iso(modifiedTime) ? (
//         <meta property="article:modified_time" content={iso(modifiedTime)!} />
//       ) : null}

//       {/* Twitter */}
//       <meta name="twitter:card" content={twitterCard} />
//       {twitterSite ? <meta name="twitter:site" content={twitterSite} /> : null}
//       <meta name="twitter:title" content={t} />
//       <meta name="twitter:description" content={d} />
//       <meta name="twitter:image" content={img} />

//       {/* JSON-LD */}
//       {jsonLd.map((block, i) => (
//         <script
//           key={i}
//           type="application/ld+json"
//           // Avoid undefined fields in output
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(block, (_k, v) => (v === undefined ? undefined : v)) }}
//         />
//       ))}

//       {/* Extra tags from caller */}
//       {children}
//     </Helmet>
//   );
// }
