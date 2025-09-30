import React from "react";
import {
  Routes,
  Route,
  NavLink, // 👈 use NavLink for active styling
  useLocation,
} from "react-router-dom";
import {
  Users,
  ClipboardList,
  User as UserIcon,
  Home,
} from "lucide-react";

import { AmbassadorHeader } from "@/components/ambassador/AmbassadorHeader";

import { DashboardPage } from "./pages/DashboardPage";
import { TeenagersPage } from "./pages/TeenagersPage";
import { PackagesPage } from "./pages/PackagesPage";
import { ProfilePage } from "./pages/ProfilePage";

export function AmbassadorApp() {
  const navItems = [
    { to: "", label: "داشبورد", icon: Home, end: true }, // 👈 index
    { to: "teenagers", label: "نوجوانان", icon: Users },
    { to: "packages", label: "بسته‌ها", icon: ClipboardList },
    { to: "profile", label: "پروفایل", icon: UserIcon },
  ];

  return (
    <div
      dir="rtl"
      className="min-h-[70vh] bg-gradient-to-b from-sky-50 via-sky-50 to-white pb-20 lg:pb-0"
    >
      <AmbassadorHeader />

      <div className="mx-auto px-10 py-10 grid grid-cols-1 gap-8 lg:grid-cols-[250px_1fr]">
        {/* --- Desktop Sidebar --- */}
        <aside className="hidden lg:block self-start rounded-2xl border border-sky-200 bg-white/80 backdrop-blur p-5">
          <div className="text-sm font-medium text-slate-500 px-2 mb-3">پنل سفیران</div>
          <nav className="space-y-2">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={`desktop-${to || "index"}`}
                to={to}
                end={end} // 👈 exact match for dashboard
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base transition ${isActive
                    ? "bg-slate-900 text-white ring-1 ring-slate-900/10"
                    : "hover:bg-sky-50 text-slate-800"
                  }`
                }
              >
                <Icon size={20} /> {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* --- Main Content --- */}
        <main>
          <Routes>
            <Route index element={<DashboardPage />} /> {/* 👈 index route */}
            <Route path="teenagers" element={<TeenagersPage />} />
            <Route path="packages" element={<PackagesPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>

      {/* --- Mobile Bottom Tab Bar --- */}
      <nav className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-white/80 backdrop-blur border-t border-sky-200 shadow-t-lg">
        <div className="flex justify-around items-stretch h-20">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={`mobile-${to || "index"}`}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 w-full transition-colors text-sm ${isActive ? "text-slate-900 font-bold" : "text-slate-500 hover:bg-sky-50"
                }`
              }
            >
              <Icon size={24} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
