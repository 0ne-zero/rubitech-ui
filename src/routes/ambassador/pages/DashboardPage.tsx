import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  ClipboardList,
  Package as PackageIcon,
  Truck,
  Home,
  ChevronLeft,
  ShieldCheck,
  ChevronLeft as ArrowRTL,
  Clock,
  Hash,
  QrCode,
  X,
  Laptop,
  FileWarning,
} from "lucide-react";

import { StatusBadge } from "@/components/ambassador/StatusBadge";
import { api, type Ambassador, type Teenager, type Package, type DashboardStats } from "@/services/api";
import { useCached } from "@/hooks/useCached";

/* ----------------------------- UI Primitives ----------------------------- */

function StatCard({
  label,
  value,
  icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  tone?: "default" | "success" | "warning" | "info";
}) {
  const tones = {
    success: {
      bg: "bg-white",
      ring: "ring-[var(--mint-ring)]",
      text: "text-[var(--mint-strong)]",
      chip: "bg-[var(--mint-strong)] text-white",
    },
    warning: {
      bg: "bg-white",
      ring: "ring-[var(--amber-ring)]",
      text: "text-[var(--amber-strong)]",
      chip: "bg-[var(--amber-strong)] text-white",
    },
    info: {
      bg: "bg-white",
      ring: "ring-[var(--sky-ring)]",
      text: "text-[var(--brand)]",
      chip: "bg-[var(--brand)] text-white",
    },
    default: {
      bg: "bg-white",
      ring: "ring-[var(--gray-ring)]",
      text: "text-[var(--text)]",
      chip: "bg-slate-100 text-[var(--text-weak)]",
    },
  }[tone];

  return (
    <div
      className={`group relative rounded-2xl border border-transparent ring-1 ${tones.ring} ${tones.bg} px-5 py-4 shadow-sm hover:shadow-lg transition-shadow duration-300`}
      style={{ boxShadow: "var(--elevate)" }}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-[var(--text-weak)] text-normal">{label}</div>
          <div className={`mt-2 text-3xl font-extrabold tracking-tight ${tones.text}`}>
            {value}
          </div>
        </div>
        {icon && (
          <div className={`shrink-0 rounded-xl p-3 border border-white/40 glass ${tones.chip}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export function SectionCard({
  title,
  subtitle,
  children,
  footer,
  tone = "neutral",
}: {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  tone?: "neutral" | "warning";
}) {
  const wrap =
    tone === "warning"
      ? "ring-[var(--amber-ring)]"
      : "ring-[var(--sky-ring)]";

  return (
    <section
      className={`rounded-2xl ring-1 ${wrap} bg-white p-0 shadow-sm`}
      style={{ boxShadow: "var(--elevate)" }}
    >
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-extrabold text-[var(--brand)] leading-6 truncate">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-[var(--text-weak)] mt-1">{subtitle}</p>
            )}
          </div>
          {footer}
        </div>
      </div>
      <div className="p-5 pt-0">{children}</div>
    </section>
  );
}

/* ------------------------------ Helpers ---------------------------------- */

/** Backend stages: reviewing | packaging | shipping | delivered */
const STEPS = [
  { key: "reviewing", label: "در حال بررسی", icon: <CheckCircle2 size={16} /> },
  { key: "packaging", label: "بسته‌بندی", icon: <PackageIcon size={16} /> },
  { key: "shipping", label: "ارسال", icon: <Truck size={16} /> },
  { key: "delivered", label: "تحویل", icon: <Home size={16} /> },
] as const;

function getActiveIndex(stage?: string | null) {
  const i = STEPS.findIndex((s) => s.key === stage);
  return i < 0 ? null : i;
}

function statusToBadgeTone(stage?: string | null): "success" | "warning" | "info" | "default" {
  switch (stage) {
    case "delivered":
      return "success";
    case "shipping":
    case "packaging":
      return "info";
    case "reviewing":
      return "warning";
    default:
      return "default";
  }
}

function formatDate(input?: string | number | Date) {
  if (!input) return "—";
  try {
    const d = new Date(input);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return String(input);
  }
}

/* --------------------------------- Page --------------------------------- */

export function DashboardPage() {
  // ---- Cached reads with keys ----
  const {
    data: me,
    loading: loadingMe,
    error: errMe,
  } = useCached<Ambassador>(api.CACHE_KEYS.me.ambassador, api.getMeAmbassador);

  const {
    data: stats,
    loading: loadingStats,
    error: errStats,
  } = useCached<DashboardStats | null>(
    api.CACHE_KEYS.dashboard.stats,
    async () => {
      try { return await api.getDashboardStats(); }
      catch { return null; } // dashboard optional
    }
  );

  const {
    data: teens,
    loading: loadingTeens,
    error: errTeens,
  } = useCached<Teenager[]>(api.CACHE_KEYS.teenagers.list, api.listTeenagers);

  const {
    data: packsRaw,
    loading: loadingPacks,
    error: errPacks,
  } = useCached<Package[]>(
    api.CACHE_KEYS.packages.list,
    async () => {
      const { items } = await api.listPackages();
      return items;
    }
  );

  const loading = loadingMe || loadingStats || loadingTeens || loadingPacks;
  const err = errMe || errStats || errTeens || errPacks || null;

  // Sort packages newest first, memoized
  const packs = useMemo<Package[]>(
    () =>
      (packsRaw ?? []).slice().sort((a, b) => {
        const ad = new Date(a.requested_at).getTime();
        const bd = new Date(b.requested_at).getTime();
        return bd - ad;
      }),
    [packsRaw]
  );

  const verified =
    Boolean(me?.email_verified) &&
    Boolean(me?.phone_number_verified) &&
    Boolean(me?.verified_by_rubitech);

  const totalTeens = stats?.total_teenagers ?? (teens?.length ?? 0);
  const totalPackages = stats?.total_packages ?? (packs?.length ?? 0);
  const totalReports = stats?.total_reports ?? 0;

  // Latest package after sorting (newest first)
  const latest = packs?.[0] ?? null;
  const active = getActiveIndex(latest?.stage ?? null);

  // Gates for quick-start actions
  const canAddTeens = verified;
  const canRequestPackage = verified && totalTeens >= 5;

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  return (
    <div dir="rtl" className="mx-auto space-y-6">
      {/* ---------- Loading / Error ---------- */}
      {loading && (
        <div className="rounded-2xl ring-1 ring-[var(--gray-ring)] bg-white p-4 text-sm text-[var(--text-weak)]">
          در حال بارگذاری داشبورد...
        </div>
      )}
      {err && !loading && (
        <div className="rounded-2xl ring-1 ring-[var(--amber-ring)] bg-white p-4 text-sm text-[var(--amber-strong)] flex items-center gap-2">
          <AlertTriangle size={18} />
          {String(err)}
        </div>
      )}

      {/* ---------- Warning Gate (Only when NOT verified) ---------- */}
      {!verified && !loading && (
        <SectionCard
          tone="warning"
          title={
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-[var(--amber-strong)]" size={18} aria-hidden />
              <span className="text-[var(--brand)]">راهنمای شروع سریع</span>
              <StatusBadge label="نیاز به احراز هویت" tone="warning" />
            </div>
          }
          subtitle="ابتدا احراز هویت خود را تکمیل کنید. سپس می‌توانید نوجوانان را ثبت‌نام کرده و در نهایت بسته‌ای را درخواست کنید."
        >
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* STEP 1 — Verify */}
            <li
              className="rounded-xl border border-transparent ring-1 ring-[var(--rose-ring)] bg-white px-3 py-3"
              style={{ boxShadow: "var(--elevate)" }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[var(--rose-strong)] text-sm font-extrabold">
                  <ShieldCheck size={18} />
                  مرحله ۱: احراز هویت سفیر
                </div>
                <Link
                  to="/ambassador/profile"
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-extrabold bg-[var(--rose-strong)] text-white hover:opacity-95 transition"
                  aria-label="رفتن به پروفایل برای احراز هویت"
                >
                  شروع
                  <ArrowRTL size={14} />
                </Link>
              </div>
              <p className="text-sm text-[var(--text-weak)] mt-2">
                برای ادامه، ابتدا احراز هویت خود را در صفحه پروفایل تکمیل کنید.
              </p>
            </li>

            {/* STEP 2 — Teens */}
            <li
              className={`rounded-xl border border-transparent ring-1 px-3 py-3 ${canAddTeens
                ? "ring-[var(--sky-ring)] bg-white"
                : "ring-[var(--gray-ring)] bg-white opacity-80"
                }`}
              style={{ boxShadow: "var(--elevate)" }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className={`flex items-center gap-2 text-sm font-extrabold ${canAddTeens ? "text-[var(--brand)]" : "text-[var(--text-weak)]"
                  }`}>
                  <UserPlus size={18} />
                  مرحله ۲: ثبت‌نام نوجوانان
                </div>
                <Link
                  to="/ambassador/teenagers"
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-extrabold transition ${canAddTeens
                    ? "text-white bg-[var(--brand)] hover:opacity-95"
                    : "bg-white text-[var(--text-weak)] cursor-not-allowed pointer-events-none"
                    }`}
                  aria-disabled={!canAddTeens}
                  tabIndex={canAddTeens ? 0 : -1}
                >
                  ادامه
                  <ArrowRTL size={14} />
                </Link>
              </div>
              <p className="text-sm text-[var(--text-weak)] mt-2">
                پس از احراز هویت، امکان ثبت‌نام نوجوانان فراهم می‌شود.
              </p>
            </li>

            {/* STEP 3 — Request Package */}
            <li
              className={`rounded-xl border border-transparent ring-1 px-3 py-3 ${canRequestPackage
                ? "ring-[var(--mint-ring)] bg-white"
                : "ring-[var(--gray-ring)] bg-white opacity-80"
                }`}
              style={{ boxShadow: "var(--elevate)" }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className={`flex items-center gap-2 text-sm font-extrabold ${canRequestPackage ? "text-[var(--mint-strong)]" : "text-[var(--text-weak)]"
                  }`}>
                  <ClipboardList size={18} />
                  مرحله ۳: ثبت درخواست بسته
                </div>
                <Link
                  to="/ambassador/packages"
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-extrabود transition ${canRequestPackage
                    ? "text-white bg-[var(--mint-strong)] hover:opacity-95"
                    : "bg-white text-[var(--text-weak)] cursor-not-allowed pointer-events-none"
                    }`}
                  aria-disabled={!canRequestPackage}
                  tabIndex={canRequestPackage ? 0 : -1}
                >
                  ادامه
                  <ArrowRTL size={14} />
                </Link>
              </div>
              <p className="text-sm text-[var(--text-weak)] mt-2">
                بعد از تکمیل احراز هویت و ثبت‌نام حداقل ۵ نوجوان، می‌توانید بسته درخواست کنید.
              </p>
            </li>
          </ul>
        </SectionCard>
      )}

      {/* ---------- Status Cards ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="نوجوانان ثبت‌نام شده" value={totalTeens} icon={<UserPlus size={20} />} tone="info" />
        <StatCard label="درخواست‌های ثبت‌شده" value={totalPackages} icon={<ClipboardList size={20} />} tone="success" />
        <StatCard label="کل لپ‌تاپ‌ها" value={stats?.total_laptops ?? "—"} icon={<Laptop size={20} />} tone="default" />
        <StatCard label="گزارش‌ها / حوادث" value={totalReports} icon={<FileWarning size={20} />} tone="warning" />
      </div>

      {/* ---------- Latest Package – Vertical Timeline ---------- */}
      <SectionCard
        title="وضعیت آخرین بسته"
        subtitle="خلاصه و مراحل پردازش"
        footer={
          <div className="flex items-center gap-2">
            <Link
              to="/ambassador/packages"
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-extrabold text-white bg-slate-900 hover:opacity-95"
            >
              بسته‌ها
              <ChevronLeft size={16} />
            </Link>
          </div>
        }
      >
        {latest && active !== null ? (
          <div className="space-y-6">
            {/* ID / status header */}
            <div
              className="rounded-2xl ring-1 ring-[var(--sky-ring)] bg-white px-4 py-3"
              style={{ boxShadow: "var(--elevate)" }}
            >
              <div className="flex items-center gap-3 text-sm">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white bg-slate-900 ring-1 ring-white/40">
                  <Hash size={18} />
                </span>
                <div className="min-w-0">
                  <div className="text-[14px] text-[var(--text-weak)]">شناسه بسته</div>
                  <div className="text-lg font-extrabold tracking-tight text-[var(--brand)] truncate">
                    {latest.id ?? "—"}
                  </div>
                </div>
              </div>
            </div>

            {/* Vertical timeline */}
            <ol className="relative pr-12">
              {/* spine */}
              <span
                className="pointer-events-none absolute right-6 top-2 bottom-2 w-[2.5px] rounded-full bg-[var(--gray-ring)]"
                aria-hidden
              />
              <div className="space-y-4">
                {STEPS.map((s, idx) => {
                  const isDone = idx < active;
                  const isCurrent = idx === active;

                  const nodeBase =
                    "absolute -right-[10px] top-2 flex h-12 w-12 items-center justify-center rounded-full ring-1";
                  const nodeColor = isDone
                    ? "text-white bg-[var(--mint-strong)] ring-transparent"
                    : isCurrent
                      ? "text-[var(--mint-strong)] bg-[var(--mint-tint)] ring-[var(--mint-ring)]"
                      : "text-[var(--text-weak)] bg-white ring-[var(--gray-ring)] border border-dashed";

                  const cardTone = isDone
                    ? "ring-[var(--mint-ring)] bg-[var(--mint-tint)]"
                    : isCurrent
                      ? "ring-[var(--mint-ring)] bg-white"
                      : "ring-[var(--gray-ring)] bg-white";

                  const titleColor = isDone
                    ? "text-[var(--mint-strong)] font-semibold"
                    : isCurrent
                      ? "text-[var(--mint-strong)] font-extrabold"
                      : "text-[var(--text-weak)]";

                  return (
                    <li key={s.key} className="relative pr-6">
                      {/* node */}
                      <span className={`${nodeBase} ${nodeColor}`} aria-hidden>
                        {s.icon}
                      </span>

                      {/* card */}
                      <div className="pr-6">
                        <div
                          className={`rounded-xl border border-transparent ring-1 ${cardTone} px-4 py-3 shadow-sm`}
                          style={{ boxShadow: "var(--elevate)" }}
                        >
                          <div className={`text-sm flex items-center gap-2 ${titleColor}`}>
                            {s.label}
                          </div>

                          <div
                            className={`mt-1 text-xs ${isCurrent
                              ? "text-[var(--mint-strong)]"
                              : isDone
                                ? "text-[var(--text-weak)]"
                                : "text-[var(--text-weak)]"
                              }`}
                          >
                            {isCurrent ? "در حال انجام..." : isDone ? "تکمیل شد" : "در صف انجام"}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </div>
            </ol>

            {/* Info cards + CTA */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-center">
              <InfoCard icon={STEPS[active].icon} label="وضعیت" value={STEPS[active].label} />
              <InfoCard icon={<PackageIcon size={16} />} label="نوجوانان" value={latest.requested_teenagers_count ?? (latest.teenager_ids?.length ?? "—")} />
              <InfoCard icon={<Laptop size={16} />} label="لپ‌تاپ‌های درخواستی" value={latest.requested_laptops_count ?? "—"} />
              <InfoCard icon={<Clock size={16} />} label="ثبت" value={formatDate(latest.requested_at)} />

              {latest.stage !== "delivered" && (
                <div className="col-span-2 mt-2 md:col-span-2 flex justify-start">
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-extrabold text-white bg-[var(--mint-strong)] hover:opacity-95"
                  >
                    <QrCode size={16} />
                    تایید دریافت
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 rounded-2xl ring-1 ring-[var(--gray-ring)] bg-white px-4 py-4">
            <div className="text-sm text-[var(--text-weak)]">هنوز درخواستی ثبت نکرده‌اید.</div>
            <Link
              to="/ambassador/packages"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-extrabold text-white hover:opacity-95"
            >
              ثبت اولین درخواست
              <ChevronLeft size={14} />
            </Link>
          </div>
        )}
      </SectionCard>

      {/* ---------- Confirm Delivery Modal ---------- */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-[var(--gray-ring)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-[var(--brand)]">تایید دریافت بسته</h2>
              <button onClick={() => setShowConfirmModal(false)} aria-label="بستن">
                <X size={20} className="text-[var(--text-weak)] hover:text-[var(--text)]" />
              </button>
            </div>
            <p className="mt-3 text-sm text-[var(--text)]">
              لطفاً کد QR روی بسته را اسکن کنید تا دریافت آن تایید شود.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-sm rounded-xl border border-[var(--gray-ring)] text-[var(--text-weak)] hover:bg-white"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                }}
                className="px-4 py-2 text-sm rounded-xl text-white bg-[var(--mint-strong)] hover:opacity-95"
              >
                متوجه شدم
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------- Small local component: InfoCard -------- */
function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[var(--gray-ring)] bg-white px-3 py-2">
      <span className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 ring-1 ring-[var(--gray-ring)]">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[14px] text-[var(--text-weak)]">{label}</div>
        <div className="text-sm font-extrabold text-[var(--brand)] truncate">{value}</div>
      </div>
    </div>
  );
}

export default DashboardPage;
