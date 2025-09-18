import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  ClipboardList,
  Package,
  Truck,
  Home,
  ChevronLeft,
  ShieldCheck,
  ChevronLeft as ArrowRTL,
  Clock,
  Hash,
  QrCode,
  X,
  TentIcon,
} from "lucide-react";

import { useAmbassadorData } from "../store";
import { StatusBadge } from "@/components/ambassador/StatusBadge";

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
      bg: "bg-gradient-to-br from-white to-[var(--mint-ring)]",
      ring: "ring-[var(--mint-ring)]",
      text: "text-[var(--mint-strong)]",
      chip: "bg-gradient-to-br from-[var(--mint-grad-from)] to-[var(--mint-grad-to)] text-white",
    },
    warning: {
      bg: "bg-gradient-to-br from-white to-[var(--amber-ring)]",
      ring: "ring-[var(--amber-ring)]",
      text: "text-[var(--amber-strong)]",
      chip: "bg-gradient-to-br from-[var(--amber-grad-from)] to-[var(--amber-grad-to)] text-white",
    },
    info: {
      bg: "bg-gradient-to-br from-white to-[var(--sky)]",
      ring: "ring-[var(--sky-ring)]",
      text: "text-[var(--brand)]",
      chip: "bg-gradient-to-br from-[var(--brand-grad-from)] to-[var(--brand-grad-to)] text-white",
    },
    default: {
      bg: "bg-gradient-to-br from-[var(--gray-tint)] to-white",
      ring: "ring-[var(--gray-ring)]",
      text: "text-[var(--text)]",
      chip: "bg-white text-[var(--text-weak)]",
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
      ? "from-[var(--amber-ring)] to-[var(--amber-ring)] ring-[var(--amber-ring)]"
      : "from-[var(--sky)] to-white ring-[var(--sky-ring)]";

  return (
    <section
      className={`rounded-2xl ring-1 bg-gradient-to-l ${wrap} p-0 shadow-sm`}
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

function ChecklistItem({
  ok,
  label,
  value,
}: {
  ok: boolean;
  label: string;
  value?: string | number;
}) {
  return (
    <li
      className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 transition border ${ok
        ? "border-[var(--mint-ring)] bg-gradient-to-l from-[var(--mint-tint)] to-white"
        : "border-[var(--amber-ring)] bg-gradient-to-l from-[var(--amber-tint)] to-white"
        }`}
      style={{ boxShadow: "var(--elevate)" }}
    >
      <div className="flex items-center gap-2">
        {ok ? (
          <CheckCircle2 className="text-[var(--mint-strong)]" size={18} aria-hidden />
        ) : (
          <AlertTriangle className="text-[var(--amber-strong)]" size={18} aria-hidden />
        )}
        <span
          className={`text-sm font-semibold ${ok ? "text-[var(--mint-strong)]" : "text-[var(--amber-strong)]"
            }`}
        >
          {label}
        </span>
      </div>
      {value !== undefined && (
        <span className={`${ok ? "text-[var(--mint-strong)]" : "text-[var(--amber-strong)]"} text-xs`}>
          {value}
        </span>
      )}
    </li>
  );
}

/* ------------------------------ Helpers ---------------------------------- */

const STEPS = [
  { key: "approved", label: "تأیید درخواست", icon: <CheckCircle2 size={16} /> },
  { key: "packaging", label: "بسته‌بندی", icon: <Package size={16} /> },
  { key: "shipping", label: "ارسال", icon: <Truck size={16} /> },
  { key: "delivered", label: "تحویل", icon: <Home size={16} /> },
] as const;

function getActiveIndex(status?: string | null) {
  const i = STEPS.findIndex((s) => s.key === status);
  return i < 0 ? null : i;
}

function statusToBadgeTone(status?: string | null): "success" | "warning" | "info" | "default" {
  switch (status) {
    case "delivered":
      return "success";
    case "shipping":
    case "packaging":
      return "info";
    case "approved":
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

/* --------------------------- Latest Package Brief ------------------------ */

function MiniProgress({ current }: { current: number }) {
  return (
    <div className="relative mt-4">
      <div className="h-2 w-full rounded-full bg-gradient-to-l from-[var(--gray-ring)] to-[var(--sky-ring)]" />
      <div
        className="absolute inset-y-0 right-0 h-2 rounded-full bg-gradient-to-l from-[var(--violet-grad-from)] via-[var(--mint-grad-from)] to-[var(--sky-ring)] shadow-md"
        style={{ width: `${((current + 1) / STEPS.length) * 100}%` }}
        aria-hidden
      />
      <div className="mt-3 grid grid-cols-4 gap-2 text-[10px] text-[var(--text-weak)]">
        {STEPS.map((s, i) => (
          <span
            key={s.key}
            className={`flex items-center gap-1 ${i <= current ? "font-extrabold text-[var(--brand)]" : ""}`}
          >
            {s.icon}
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function LatestPackageBrief({ latest }: { latest: any | null }) {
  const active = getActiveIndex(latest?.status ?? null);
  const statusTone = statusToBadgeTone(latest?.status);

  if (!latest || active === null) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--gray-ring)] bg-gradient-to-l from-[var(--gray-tint)] to-white px-4 py-4">
        <div className="text-sm text-[var(--text-weak)]">هنوز درخواستی ثبت نکرده‌اید.</div>
        <Link
          to="/ambassador/packages"
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-l from-[var(--rose-grad-from)] to-[var(--rose-grad-to)] px-3 py-2 text-xs font-extrabold text-white hover:opacity-95 transition"
          aria-label="رفتن به صفحه درخواست‌ها برای ثبت درخواست"
        >
          ثبت اولین درخواست
          <ArrowRTL size={14} />
        </Link>
      </div>
    );
  }

  const code = latest?.code ?? latest?.id ?? "—";
  const createdAt = formatDate(latest?.createdAt);
  const updatedAt = formatDate(latest?.updatedAt);
  const eta = latest?.eta ? formatDate(latest?.eta) : "—";
  const itemsCount = latest?.itemsCount ?? latest?.items?.length ?? "—";

  return (
    <div className="rounded-2xl p-4 gradient-border relative overflow-hidden">
      <div className="relative rounded-2xl ring-1 ring-white/40 bg-gradient-to-l from-[var(--sky-grad-from)] to-[var(--sky-grad-to)] p-4 glass">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge label={STEPS[active].label} tone={statusTone as any} />
              <span className="inline-flex items-center gap-1 rounded-lg border border-white/40 bg-white/70 px-2.5 py-1 text-xs text-[var(--text-weak)] glass">
                <Hash size={14} /> کد:{" "}
                <span className="font-extrabold text-[var(--brand)]">{code}</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg border border-white/40 bg-white/70 px-2.5 py-1 text-xs text-[var(--text-weak)] glass">
                <ClipboardList size={14} /> اقلام:{" "}
                <span className="font-extrabold text-[var(--brand)]">{itemsCount}</span>
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-[var(--text-weak)] sm:grid-cols-3">
              <div className="inline-flex items-center gap-1"><Clock size={14} /> ثبت: {createdAt}</div>
              <div className="inline-flex items-center gap-1"><Clock size={14} /> بروزرسانی: {updatedAt}</div>
              <div className="inline-flex items-center gap-1"><Truck size={14} /> ETA: {eta}</div>
            </div>
          </div>
          <div className="shrink-0">
            <Link
              to="/ambassador/packages"
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-extrabold text-white bg-gradient-to-l from-[var(--brand-grad-from)] to-[var(--brand-grad-to)] hover:opacity-95"
              aria-label="مشاهده جزئیات بیشتر در صفحه درخواست‌ها"
            >
              مشاهده جزئیات
              <ArrowRTL size={16} />
            </Link>
          </div>
        </div>
        <MiniProgress current={active} />
      </div>
    </div>
  );
}

/* --------------------------------- Page --------------------------------- */

export function DashboardPage() {
  const { profile, teenagers, packages: packages } = useAmbassadorData();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const verified =
    profile.email.verified &&
    profile.phone.verified &&
    profile.kyc.status === "approved";

  const consented = useMemo(() => teenagers.filter((t) => t.consent).length, [teenagers]);

  // Status cards
  const totalTeens = teenagers.length;
  const totalPackages = packages.length;
  const incidents = 0;

  // Latest package (assuming newest is first in packages)
  const latestRequest = packages?.[0] ?? null;

  // Gates for quick-start actions
  const canAddTeens = verified;
  const canRequestPackage = verified && consented >= 5;

  return (
    <div dir="rtl" className="mx-auto space-y-6">
      {/* ---------- Warning Gate (Only when NOT verified) ---------- */}
      {!verified && (
        <SectionCard
          tone="warning"
          title={
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-[var(--amber-strong)]" size={18} aria-hidden />
              <span className="text-[var(--brand)]">راهنمای شروع سریع</span>
              <StatusBadge label="نیاز به احراز هویت" tone="warning" />
            </div>
          }
          subtitle="ابتدا احراز هویت خود را تکمیل کنید. سپس می‌توانید نوجوانان را ثبت‌نام کرده، در نهایت میتوانید بسته‌ای را درخواست کنید."
        >
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* STEP 1 — Verify */}
            <li className="rounded-xl border border-transparent ring-1 ring-[var(--rose-ring)] bg-gradient-to-br from-[var(--rose-tint)] to-white px-3 py-3"
              style={{ boxShadow: "var(--elevate)" }}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[var(--rose-strong)] text-sm font-extrabold">
                  <ShieldCheck size={18} />
                  مرحله ۱: احراز هویت سفیر
                </div>
                <Link
                  to="/ambassador/profile"
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-extrabold bg-gradient-to-l from-[var(--rose-grad-from)] to-[var(--rose-grad-to)] text-white hover:opacity-95 transition"
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
                ? "ring-[var(--sky-ring)] bg-gradient-to-br from-[var(--sky)] to-white"
                : "ring-[var(--gray-ring)] bg-gradient-to-br from-[var(--gray-tint)] to-white opacity-80"
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
                  to="/ambassador/teens"
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-extrabold transition ${canAddTeens
                    ? "text-white bg-gradient-to-l from-[var(--brand-grad-from)] to-[var(--brand-grad-to)] hover:opacity-95"
                    : "bg-white/60 text-[var(--text-weak)] cursor-not-allowed pointer-events-none glass"
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
                ? "ring-[var(--mint-ring)] bg-gradient-to-br from-[var(--mint-tint)] to-white"
                : "ring-[var(--gray-ring)] bg-gradient-to-br from-[var(--gray-tint)] to-white opacity-80"
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
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-extrabold transition ${canRequestPackage
                    ? "text-white bg-gradient-to-l from-[var(--mint-grad-from)] to-[var(--mint-grad-to)] hover:opacity-95"
                    : "bg-white/60 text-[var(--text-weak)] cursor-not-allowed pointer-events-none glass"
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="نوجوانان ثبت‌نام شده" value={totalTeens} icon={<UserPlus size={20} />} tone="info" />
        <StatCard label="درخواست‌های ثبت‌شده" value={totalPackages} icon={<ClipboardList size={20} />} tone="success" />
        <StatCard label="حوادث گزارش‌شده" value={incidents} icon={<AlertTriangle size={20} />} tone="warning" />
      </div>

      {/* ---------- Latest Package – Vertical Timeline (refreshed visuals) ---------- */}
      {(() => {
        const latest = packages?.[0] ?? null;
        const active = getActiveIndex(latest?.status ?? null);
        const currentLabel = active !== null ? STEPS[active].label : "—";

        const fmt = (d?: string | number | Date) =>
          d
            ? new Intl.DateTimeFormat("fa-IR", {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(d))
            : "—";

        const InfoCard = ({
          icon,
          label,
          value,
        }: {
          icon: React.ReactNode;
          label: string;
          value: React.ReactNode;
        }) => (
          <div className="flex items-center gap-2 rounded-xl border border-white/50 bg-white/70 px-3 py-2 glass ring-1 ring-[var(--gray-ring)]">
            <span className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--gray-tint)] to-white ring-1 ring-[var(--gray-ring)]">
              {icon}
            </span>
            <div className="min-w-0">
              <div className="text-[14px] text-[var(--text-weak)]">{label}</div>
              <div className="text-sm font-extrabold text-[var(--brand)] truncate">{value}</div>
            </div>
          </div>
        );

        return (
          <SectionCard
            title="وضعیت آخرین بسته"
            subtitle="خلاصه و مراحل پردازش"
            footer={
              <div className="flex items-center gap-2">
                <Link
                  to="/ambassador/packages"
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-extrabold text-white bg-slate-900 ring-slate-900/10 hover:opacity-95"
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
                <div className="rounded-2xl ring-1 ring-[var(--sky-ring)] bg-gradient-to-l from-[var(--sky)] to-white px-4 py-3 glass"
                  style={{ boxShadow: "var(--elevate)" }}>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white bg-gradient-to-br from-[var(--brand-grad-from)] to-[var(--brand-grad-to)] ring-1 ring-white/40">
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

                {/* Vertical timeline with refined spacing + state colors */}
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
                      const isFuture = idx > active;

                      /* ---------- Node styles ---------- */
                      const nodeBase =
                        "absolute -right-[10px] top-2 flex h-12 w-12 items-center justify-center rounded-full ring-1";
                      const nodeColor = isDone
                        ? "text-white bg-gradient-to-br from-[var(--mint-grad-from)] to-[var(--mint-grad-to)] ring-transparent glow-mint"
                        : isCurrent
                          ? // semi green: light bg + mint ring + mint text
                          "text-[var(--mint-strong)] bg-[var(--mint-tint)] ring-[var(--mint-ring)] pulse-soft"
                          : // future: hollow with dashed ring
                          "text-[var(--text-weak)] bg-white ring-[var(--gray-ring)] border border-dashed";

                      /* ---------- Card styles ---------- */
                      const cardTone = isDone
                        ? "ring-[var(--mint-ring)] bg-gradient-to-l from-[var(--mint-tint)] to-white"
                        : isCurrent
                          ? "ring-[var(--mint-ring)] bg-white"
                          : "ring-[var(--gray-ring)] bg-white/70";
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
                  <InfoCard icon={STEPS[active].icon} label="وضعیت" value={currentLabel} />
                  <InfoCard icon={<Package size={16} />} label="اقلام" value={latest.quantity ?? "—"} />
                  <InfoCard icon={<Clock size={16} />} label="ثبت" value={fmt(latest.createdAt)} />
                  {/* <InfoCard icon={<Truck size={16} />} label="ETA" value={fmt(latest.eta)} /> */}

                  {latest.status !== "delivered" && (
                    <div className="col-span-2 md:col-span-2 flex justify-end">
                      <button
                        onClick={() => setShowConfirmModal(true)}
                        className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-extrabold text-white bg-gradient-to-l from-[var(--mint-grad-from)] to-[var(--mint-grad-to)] hover:opacity-95"
                      >
                        <QrCode size={16} />
                        تایید دریافت
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex items-center justify-between gap-3 rounded-2xl ring-1 ring-[var(--gray-ring)] bg-gradient-to-l from-[var(--gray-tint)] to-white px-4 py-4">
                <div className="text-sm text-[var(--text-weak)]">هنوز درخواستی ثبت نکرده‌اید.</div>
                <Link
                  to="/ambassador/packages"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-l from-[var(--brand-grad-from)] to-[var(--brand-grad-to)] px-3 py-2 text-xs font-extrabold text-white hover:opacity-95"
                >
                  ثبت اولین درخواست
                  <ChevronLeft size={14} />
                </Link>
              </div>
            )}
          </SectionCard>
        );
      })()}

      {/* ---------- Confirm Delivery Modal ---------- */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-gradient-to-br from-white to-[var(--gray-tint)] p-6 shadow-xl ring-1 ring-[var(--gray-ring)]">
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
                className="px-4 py-2 text-sm rounded-xl text-white bg-gradient-to-l from-[var(--mint-grad-from)] to-[var(--mint-grad-to)] hover:opacity-95"
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

export default DashboardPage;
