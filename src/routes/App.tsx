import React from "react";
import { DefaultLayout } from "@/components/layout/DefaultLayout";
import { HomePage } from "@/routes/HomePage";
export default function App() {
  return (
    <DefaultLayout>
      <HomePage />
    </DefaultLayout>
  );
}
