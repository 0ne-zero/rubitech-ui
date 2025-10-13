import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { DefaultLayout } from "@/components/layout/DefaultLayout";
import { HomePage } from "@/routes/HomePage";
import { AmbassadorApp } from "@/routes/ambassador/AmbassadorApp";
import { site } from "@/config/site";

function SiteLayout() {
  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Ambassador panel WITHOUT site header/footer */}
      <Route path={`${import.meta.env.BASE_URL}dashboard/ambassador/*`} element={<AmbassadorApp />} />

      {/* Inline redirect (no header/footer flash) */}
      <Route
        path={`${import.meta.env.BASE_URL}donatePaypal`}
        Component={() => {
          useEffect(() => {
            window.location.replace(site.donationUrlPaypal);
          }, []);
          return null;
        }}
      />

      {/* Everything else uses the site layout */}
      <Route element={<SiteLayout />}>
        <Route path={`${import.meta.env.BASE_URL}`} element={<HomePage />} />
      </Route>
    </Routes>
  );
}
