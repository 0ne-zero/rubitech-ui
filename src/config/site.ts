export const site = {
  name: "Rubitech",
  description: "هر لپ‌تاپ، یک مدرسه هوشمند — روبیتک.",
  url: "https://rubitech.org",
  locale: "fa_IR",
  localesAlt: ["en_US"],

  // Social
  twitter: "@rubitech", // your handle

  // OG image default (1200x630 recommended)
  ogImage: "/og.jpg",

  // Optional theming/PWA
  themeColor: "#0A2540",
  manifest: "/site.webmanifest",
  icons: {
    favicon: "/favicon.ico",
    appleTouchIcon: "/apple-touch-icon.png",
  },

  // Organization (optional but recommended)
  organization: {
    name: "Rubitech Foundation",
    logo: "/images/logos/rubitech-logo.png",
    sameAs: [
      "https://twitter.com/rubitech",
      "https://www.linkedin.com/company/rubitech",
      // ...
    ],
  },
  paypalUrl: "https://www.paypal.com/donate/?hosted_button_id=6R4YWYQBAG6KA"
} as const;
