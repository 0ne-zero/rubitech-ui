import React from "react";
import { Seo } from "@/components/Seo";
import RubitechLandingPageFA from "@/pages/RubitechLandingPageFA";
export function HomePage() {
  return (
    <main id="main">
      <Seo title="روبیتک — آینده را بساز" description="ساخت آینده نوجوانان با تکنولوژی و آموزش" />
      <RubitechLandingPageFA />
    </main>
  );
}
