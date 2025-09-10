import React from "react";
import { Seo } from "@/components/Seo";
import RubitechLandingPageFA from "@/sections/RubitechLandingPageFA";
export function HomePage() {
  return (
    <main id="main">
      <Seo title="روبیتک — آینده را بساز" description="توانمندسازی نوجوانان با ابزار و آموزش" />
      <RubitechLandingPageFA />
    </main>
  );
}
