import React from "react";
import {
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";
import {
  Users,
  ClipboardList,
  Truck,
  User as UserIcon,
  Home,
} from "lucide-react";

import { AmbassadorHeader } from "@/components/ambassador/AmbassadorHeader";

import { DashboardPage } from "./pages/DashboardPage";
import { TeenagersPage } from "./pages/TeenagersPage";
import { PackagesPage } from "./pages/PackagesPage";
import { ProfilePage } from "./pages/ProfilePage";

export function AmbassadorApp() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path || (path !== "/ambassador/dashboard" && location.pathname.startsWith(path));

  const navItems = [
    { to: "dashboard", path: "/ambassador/dashboard", label: "داشبورد", icon: Home },
    { to: "teenagers", path: "/ambassador/teenagers", label: "نوجوانان", icon: Users },
    { to: "packages", path: "/ambassador/packages", label: "بسته‌ها", icon: ClipboardList },
    { to: "profile", path: "/ambassador/profile", label: "پروفایل", icon: UserIcon },
  ];

  return (
    <div
      dir="rtl"
      // --- CHANGE: Added pb-20 to the main container to prevent content from being hidden behind the mobile nav ---
      className="min-h-[70vh] bg-gradient-to-b from-sky-50 via-sky-50 to-white pb-20 lg:pb-0"
    >
      <AmbassadorHeader />

      {/* --- Main content area --- */}
      {/* The grid now applies only on large screens (lg) and up */}
      <div className="mx-auto px-10 py-10 grid grid-cols-1 gap-8 lg:grid-cols-[250px_1fr]">

        {/* --- Desktop Sidebar --- */}
        {/* This remains unchanged but is correctly hidden on mobile */}
        <aside className="hidden lg:block self-start rounded-2xl border border-sky-200 bg-white/80 backdrop-blur p-5">
          <div className="text-sm font-medium text-slate-500 px-2 mb-3">پنل سفیران</div>
          <nav className="space-y-2">
            {navItems.map(({ to, path, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base transition ${isActive(path)
                  ? "bg-slate-900 text-white ring-1 ring-slate-900/10"
                  : "hover:bg-sky-50 text-slate-800"
                  }`}
              >
                <Icon size={20} /> {label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* --- Main Content --- */}
        {/* This section is now correctly placed and works for both mobile and desktop */}
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="teenagers" element={<TeenagersPage />} />
            <Route path="packages" element={<PackagesPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>

      {/* --- NEW: Mobile Bottom Tab Bar --- */}
      {/* This nav is fixed to the bottom and only appears on screens smaller than lg */}
      <nav className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-white/80 backdrop-blur border-t border-sky-200 shadow-t-lg">
        <div className="flex justify-around items-stretch h-20">
          {navItems.map(({ to, path, label, icon: Icon }) => (
            <Link
              key={`mobile-${to}`}
              to={to}
              className={`flex flex-col items-center justify-center gap-1 w-full transition-colors text-sm ${isActive(path)
                ? "text-slate-900 font-bold"
                : "text-slate-500 hover:bg-sky-50"
                }`}
            >
              <Icon size={24} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}