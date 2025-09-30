"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { StatusBadge } from "@/components/ambassador/StatusBadge";
import { useCached } from "@/hooks/useCached";
import {
  api,
  CACHE_KEYS,
  type Teenager,
  type Ambassador,
  type CreateTeenagerPayload,
  type UpdateTeenagerPayload,
} from "@/services/api";
import { UserPlus, Search, X, Pencil, Save, Trash2 } from "lucide-react";

/* ----------------------------- Utils ----------------------------- */

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function calcAgeFromISO(yyyyMmDd?: string | null): number | null {
  if (!yyyyMmDd) return null;
  const m = yyyyMmDd.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const by = Number(m[1]),
    bm = Number(m[2]) - 1,
    bd = Number(m[3]);
  const b = new Date(by, bm, bd);
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const mDiff = now.getMonth() - b.getMonth();
  if (mDiff < 0 || (mDiff === 0 && now.getDate() < b.getDate())) age--;
  return Math.max(0, age);
}

function gregorianAgeStr(iso?: string | null): string {
  const a = calcAgeFromISO(iso);
  return a == null ? "—" : String(a);
}

function teenStatusFromVerified(verified?: boolean): {
  label: string;
  tone: "success" | "warning" | "danger" | "info" | "neutral";
} {
  // BE exposes `verified_by_rubitech` (boolean). Map to a simple badge.
  return verified
    ? { label: "تأیید شده", tone: "success" }
    : { label: "در حال بررسی", tone: "warning" };
}

/* ----------------------------- Primitives ----------------------------- */

function SectionCard({
  title,
  subtitle,
  children,
  footer,
  padded = true,
}: {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  padded?: boolean;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur">
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900 leading-6 truncate">
              {title}
            </h2>
            {subtitle && <p className="text-sm text-slate-600 mt-1">{subtitle}</p>}
          </div>
          {footer}
        </div>
      </div>
      <div className={padded ? "p-5" : ""}>{children}</div>
    </section>
  );
}

function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "xl",
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "md" | "lg" | "xl";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);

  if (!open) return null;
  const width =
    size === "xl" ? "max-w-4xl" : size === "lg" ? "max-w-3xl" : "max-w-xl";

  return (
    <div className="fixed inset-0 z-[80]">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          ref={ref}
          tabIndex={-1}
          className={cn(
            "w-full rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 outline-none",
            width
          )}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-600"
              aria-label="بستن"
            >
              <X size={18} />
            </button>
          </div>
          <div className="p-5">{children}</div>
          {footer && <div className="px-5 py-4 border-t border-slate-200">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm text-slate-700">
        {label}
        {required && <span className="text-rose-600"> *</span>}
      </span>
      <div className="mt-1">{children}</div>
      {error && <div className="text-xs text-rose-600 mt-1">{error}</div>}
    </label>
  );
}

/* ----------------------------- Create/Edit Forms ----------------------------- */

type TeenCreate = {
  full_name: string;
  date_of_birth: string; // yyyy-mm-dd
  national_identifier: string;
  organization_name?: string | null;
  phone_number?: string | null;
  mother_name: string;
  mother_phone_number: string;
  father_name: string;
  father_phone_number: string;
  email: string; // required by BE
  password: string; // required by BE
};

const EMPTY_CREATE: TeenCreate = {
  full_name: "",
  date_of_birth: "",
  national_identifier: "",
  organization_name: "",
  phone_number: "",
  mother_name: "",
  mother_phone_number: "",
  father_name: "",
  father_phone_number: "",
  email: "",
  password: "",
};

function validateCreate(v: TeenCreate) {
  const e: Partial<Record<keyof TeenCreate, string>> = {};
  ([
    "full_name",
    "date_of_birth",
    "national_identifier",
    "mother_name",
    "mother_phone_number",
    "father_name",
    "father_phone_number",
    "email",
    "password",
  ] as const).forEach((k) => {
    if (!String(v[k] || "").trim()) e[k] = "ضروری";
  });
  // simple iso date check
  if (v.date_of_birth && !/^\d{4}-\d{2}-\d{2}$/.test(v.date_of_birth)) {
    e.date_of_birth = "قالب تاریخ نامعتبر است (YYYY-MM-DD)";
  }
  return e;
}

function CreateTeenForm({
  value,
  onChange,
  errors,
}: {
  value: TeenCreate;
  onChange: (v: TeenCreate) => void;
  errors?: Partial<Record<keyof TeenCreate, string>>;
}) {
  const safe = { ...value };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="نام کامل" required error={errors?.full_name}>
        <input
          value={safe.full_name}
          onChange={(e) => onChange({ ...value, full_name: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
        />
      </Field>
      <Field label="کد ملی" required error={errors?.national_identifier}>
        <input
          value={safe.national_identifier}
          onChange={(e) => onChange({ ...value, national_identifier: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
        />
      </Field>
      <Field label="تاریخ تولد (YYYY-MM-DD)" required error={errors?.date_of_birth}>
        <input
          value={safe.date_of_birth}
          onChange={(e) => onChange({ ...value, date_of_birth: e.target.value })}
          placeholder="2010-07-21"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
        />
      </Field>
      <Field label="شماره تماس نوجوان (اختیاری)">
        <input
          value={safe.phone_number || ""}
          onChange={(e) => onChange({ ...value, phone_number: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
          placeholder="09xxxxxxxxx"
        />
      </Field>
      <Field label="نام مادر" required error={errors?.mother_name}>
        <input
          value={safe.mother_name}
          onChange={(e) => onChange({ ...value, mother_name: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
        />
      </Field>
      <Field label="تلفن مادر" required error={errors?.mother_phone_number}>
        <input
          value={safe.mother_phone_number}
          onChange={(e) => onChange({ ...value, mother_phone_number: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
          placeholder="09xxxxxxxxx"
        />
      </Field>
      <Field label="نام پدر" required error={errors?.father_name}>
        <input
          value={safe.father_name}
          onChange={(e) => onChange({ ...value, father_name: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
        />
      </Field>
      <Field label="تلفن پدر" required error={errors?.father_phone_number}>
        <input
          value={safe.father_phone_number}
          onChange={(e) => onChange({ ...value, father_phone_number: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
          placeholder="09xxxxxxxxx"
        />
      </Field>
      <Field label="ایمیل (لازم برای ایجاد حساب)" required error={errors?.email}>
        <input
          type="email"
          value={safe.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
          placeholder="name@example.com"
        />
      </Field>
      <Field label="رمز عبور" required error={errors?.password}>
        <input
          type="password"
          value={safe.password}
          onChange={(e) => onChange({ ...value, password: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
          placeholder="••••••••"
        />
      </Field>
      <Field label="نام سازمان/مدرسه (اختیاری)">
        <input
          value={safe.organization_name || ""}
          onChange={(e) => onChange({ ...value, organization_name: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
        />
      </Field>
    </div>
  );
}

type TeenEdit = Partial<
  Pick<
    Teenager,
    | "full_name"
    | "date_of_birth"
    | "national_identifier"
    | "organization_name"
    | "phone_number"
    | "mother_name"
    | "mother_phone_number"
    | "father_name"
    | "father_phone_number"
    | "email"
    | "age"
    | "verified_by_rubitech"
  >
>;

function EditTeenForm({
  value,
  onChange,
  readOnly = false,
}: {
  value: TeenEdit;
  onChange: (v: TeenEdit) => void;
  readOnly?: boolean;
}) {
  const v = value;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="نام کامل">
        <input
          disabled={readOnly}
          value={v.full_name ?? ""}
          onChange={(e) => onChange({ ...v, full_name: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
        />
      </Field>
      <Field label="تاریخ تولد (YYYY-MM-DD)">
        <input
          disabled={readOnly}
          value={v.date_of_birth ?? ""}
          onChange={(e) => onChange({ ...v, date_of_birth: e.target.value })}
          placeholder="2010-07-21"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
        />
      </Field>
      <Field label="کد ملی">
        <input
          disabled={readOnly}
          value={v.national_identifier ?? ""}
          onChange={(e) => onChange({ ...v, national_identifier: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
        />
      </Field>
      <Field label="نام سازمان/مدرسه">
        <input
          disabled={readOnly}
          value={v.organization_name ?? ""}
          onChange={(e) => onChange({ ...v, organization_name: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
        />
      </Field>
      <Field label="شماره تماس نوجوان">
        <input
          disabled={readOnly}
          value={v.phone_number ?? ""}
          onChange={(e) => onChange({ ...v, phone_number: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
          placeholder="09xxxxxxxxx"
        />
      </Field>
      <Field label="نام مادر">
        <input
          disabled={readOnly}
          value={v.mother_name ?? ""}
          onChange={(e) => onChange({ ...v, mother_name: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
        />
      </Field>
      <Field label="تلفن مادر">
        <input
          disabled={readOnly}
          value={v.mother_phone_number ?? ""}
          onChange={(e) => onChange({ ...v, mother_phone_number: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
          placeholder="09xxxxxxxxx"
        />
      </Field>
      <Field label="نام پدر">
        <input
          disabled={readOnly}
          value={v.father_name ?? ""}
          onChange={(e) => onChange({ ...v, father_name: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
        />
      </Field>
      <Field label="تلفن پدر">
        <input
          disabled={readOnly}
          value={v.father_phone_number ?? ""}
          onChange={(e) => onChange({ ...v, father_phone_number: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
          placeholder="09xxxxxxxxx"
        />
      </Field>
      <Field label="ایمیل (اختیاری)">
        <input
          disabled={readOnly}
          value={v.email ?? ""}
          onChange={(e) => onChange({ ...v, email: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
          placeholder="name@example.com"
        />
      </Field>
      <Field label="تأیید روبیتک">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            disabled={readOnly}
            checked={!!v.verified_by_rubitech}
            onChange={(e) => onChange({ ...v, verified_by_rubitech: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300"
          />
          <span className={v.verified_by_rubitech ? "text-emerald-700" : "text-amber-700"}>
            {v.verified_by_rubitech ? "تأیید شده" : "در حال بررسی"}
          </span>
        </label>
      </Field>
    </div>
  );
}

/* ----------------------------- Cards Grid ----------------------------- */

function CardsGrid({
  items,
  onView,
  onDelete,
}: {
  items: Teenager[];
  onView: (t: Teenager) => void;
  onDelete: (id: number, name?: string | null) => void;
}) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {items.map((t) => {
        const { label, tone } = teenStatusFromVerified(t.verified_by_rubitech);
        return (
          <div
            key={t.id}
            className="relative rounded-2xl p-4 transition hover:shadow-lg ring-1 ring-slate-200 bg-white/95"
          >
            {/* subtle top accent */}
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-l from-sky-300/70 via-transparent to-emerald-300/70" />

            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-slate-900 font-semibold">{t.full_name || `#${t.id}`}</div>
                <div className="text-xs text-slate-600 mt-0.5">
                  {t.organization_name || "—"}
                </div>
              </div>
              <StatusBadge label={label} tone={tone} />
            </div>

            <div className="mt-3 grid grid-cols-3 text-sm text-slate-600">
              <div>
                سن: <span className="text-slate-800">{gregorianAgeStr(t.date_of_birth)}</span>
              </div>
              <div>
                کد ملی: <span className="text-slate-800">{t.national_identifier || "—"}</span>
              </div>
              <div className="truncate">
                شناسه: <span className="text-slate-800">{t.id}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => onView(t)}
                className="inline-flex items-center gap-1 rounded-xl bg-slate-900 text-white px-3 py-2 text-sm hover:brightness-95"
              >
                مشاهده و ویرایش
                <Pencil size={16} />
              </button>

              <button
                onClick={() => onDelete(t.id, t.full_name)}
                className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm border border-rose-200 text-white bg-[var(--rose)] hover:bg-[var(--rose-strong)]"
              >
                حذف
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        );
      })}

      {items.length === 0 && (
        <div className="col-span-full text-center text-sm text-slate-500 py-10">چیزی پیدا نشد.</div>
      )}
    </div>
  );
}

/* ----------------------------- Main Page ----------------------------- */

export function TeenagersPage() {
  // Load data via cache-aware hooks
  const { data: me } = useCached<Ambassador>(CACHE_KEYS.me.ambassador, api.getMeAmbassador);
  const { data: teensCached } = useCached<Teenager[]>(CACHE_KEYS.teenagers.list, api.listTeenagers);

  const [items, setItems] = useState<Teenager[]>(teensCached ?? []);
  useEffect(() => {
    if (teensCached && items.length === 0) setItems(teensCached);
  }, [teensCached]);

  const [query, setQuery] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [createValue, setCreateValue] = useState<TeenCreate>({ ...EMPTY_CREATE });
  const [createErrors, setCreateErrors] = useState<Partial<Record<keyof TeenCreate, string>>>({});

  const [selected, setSelected] = useState<Teenager | null>(null);
  const [buf, setBuf] = useState<TeenEdit | null>(null);
  const [edit, setEdit] = useState(false);

  // Filter list (name, org, phones, email, national id)
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((t) =>
      [
        t.full_name,
        t.organization_name,
        t.mother_name,
        t.father_name,
        t.mother_phone_number,
        t.father_phone_number,
        t.phone_number,
        t.email,
        t.national_identifier,
        String(t.id),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [items, query]);

  function openView(t: Teenager) {
    setSelected(t);
    setBuf({
      full_name: t.full_name ?? "",
      date_of_birth: t.date_of_birth ?? "",
      national_identifier: t.national_identifier ?? "",
      organization_name: t.organization_name ?? "",
      phone_number: t.phone_number ?? "",
      mother_name: t.mother_name ?? "",
      mother_phone_number: t.mother_phone_number ?? "",
      father_name: t.father_name ?? "",
      father_phone_number: t.father_phone_number ?? "",
      email: t.email ?? "",
      age: t.age ?? calcAgeFromISO(t.date_of_birth) ?? undefined,
      verified_by_rubitech: t.verified_by_rubitech ?? false,
    });
    setEdit(false);
  }

  async function saveEdit() {
    if (!selected || !buf) return;
    const payload: UpdateTeenagerPayload = { ...buf };
    // If age missing but dob present, fill it
    if ((payload.age == null || Number.isNaN(payload.age)) && payload.date_of_birth) {
      const calc = calcAgeFromISO(payload.date_of_birth);
      if (calc != null) payload.age = calc;
    }

    const updated = await api.updateTeenager(selected.id, payload);
    setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    setSelected(updated);
    setBuf({
      full_name: updated.full_name ?? "",
      date_of_birth: updated.date_of_birth ?? "",
      national_identifier: updated.national_identifier ?? "",
      organization_name: updated.organization_name ?? "",
      phone_number: updated.phone_number ?? "",
      mother_name: updated.mother_name ?? "",
      mother_phone_number: updated.mother_phone_number ?? "",
      father_name: updated.father_name ?? "",
      father_phone_number: updated.father_phone_number ?? "",
      email: updated.email ?? "",
      age: updated.age ?? calcAgeFromISO(updated.date_of_birth) ?? undefined,
      verified_by_rubitech: updated.verified_by_rubitech ?? false,
    });
    setEdit(false);
  }

  async function createTeen() {
    const e = validateCreate(createValue);
    setCreateErrors(e);
    if (Object.keys(e).length) return;

    if (!me?.id) {
      alert("ابتدا به عنوان سفیر وارد شوید.");
      return;
    }

    // Compute required fields for BE
    const age = calcAgeFromISO(createValue.date_of_birth) ?? 0;

    const payload: CreateTeenagerPayload = {
      national_identifier: createValue.national_identifier,
      organization_name: createValue.organization_name || null,
      date_of_birth: createValue.date_of_birth,
      mother_name: createValue.mother_name,
      mother_phone_number: createValue.mother_phone_number,
      father_name: createValue.father_name,
      father_phone_number: createValue.father_phone_number,
      verified_by_rubitech: false,
      age,
      email: createValue.email,
      full_name: createValue.full_name,
      password: createValue.password,
      role: "teenager",
      ambassador_id: me.id,
      phone_number: createValue.phone_number || null,
      profile_picture_path: null,
      phone_number_verified: false,
      email_verified: false,
    };

    const created = await api.createTeenager(payload);
    setItems((prev) => [created, ...prev]);
    setOpenCreate(false);
    setCreateValue({ ...EMPTY_CREATE });
    setCreateErrors({});
  }

  async function deleteTeen(id: number) {
    await api.deleteTeenager(id);
    setItems((prev) => prev.filter((t) => t.id !== id));
    setSelected((s) => (s?.id === id ? null : s));
  }

  return (
    <>
      <SectionCard
        title="نوجوانان شما"
        subtitle="در این صفحه می‌توانید نوجوانان را ثبت و مدیریت کنید."
        footer={
          <span className="hidden md:inline text-xs text-slate-500">
            کل: {items.length} • نتایج: {list.length}
          </span>
        }
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="flex items-center gap-2 bg-white/80 border border-slate-200 rounded-xl px-3 py-2 w-full md:w-80 focus-within:ring-2 focus-within:ring-sky-200">
              <Search size={16} className="text-slate-500 shrink-0" aria-hidden />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجو در نام، سازمان، کد ملی، تلفن…"
                className="bg-transparent outline-none text-sm w-full"
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setOpenCreate(true)}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white
                           bg-gradient-to-r from-[var(--green)] via-[var(--mint)] to-[var(--green-strong)] hover:brightness-95"
              >
                <UserPlus size={18} />
                افزودن نوجوان
              </button>
            </div>
          </div>
        </div>

        <CardsGrid
          items={list}
          onView={openView}
          onDelete={(id, name) => {
            if (confirm(`حذف ${name || ""}؟ این عملیات قابل بازگشت نیست.`)) deleteTeen(id);
          }}
        />
      </SectionCard>

      {/* Create modal */}
      <Modal
        open={openCreate}
        onClose={() => {
          setOpenCreate(false);
          setCreateErrors({});
        }}
        title="افزودن نوجوان جدید"
        size="xl"
        footer={
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              فیلدهای ستاره‌دار الزامی هستند.
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOpenCreate(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-sm"
              >
                لغو
              </button>
              <button
                onClick={createTeen}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold bg-[var(--green)] text-white hover:brightness-95"
              >
                ذخیره
                <Save size={16} />
              </button>
            </div>
          </div>
        }
      >
        <CreateTeenForm value={createValue} onChange={setCreateValue} errors={createErrors} />
      </Modal>

      {/* View/Edit modal */}
      <Modal
        open={!!selected}
        onClose={() => {
          setSelected(null);
          setEdit(false);
        }}
        title={
          selected ? `پرونده نوجوان — ${selected.full_name || `#${selected.id}`}` : "پرونده نوجوان"
        }
        size="xl"
        footer={
          selected && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(() => {
                  const { label, tone } = teenStatusFromVerified(selected.verified_by_rubitech);
                  return <StatusBadge label={label} tone={tone} />;
                })()}
                <span className="text-xs text-slate-500">
                  سن تقریبی: {gregorianAgeStr(selected.date_of_birth)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {!edit ? (
                  <>
                    <button
                      onClick={() => setEdit(true)}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold bg-slate-900 text-white hover:brightness-95"
                    >
                      ویرایش
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (selected && confirm(`حذف ${selected.full_name || ""}؟ این عملیات قابل بازگشت نیست.`)) {
                          deleteTeen(selected.id);
                        }
                      }}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold border border-rose-200 text-rose-700 hover:bg-rose-50"
                    >
                      حذف
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setBuf({
                          full_name: selected.full_name ?? "",
                          date_of_birth: selected.date_of_birth ?? "",
                          national_identifier: selected.national_identifier ?? "",
                          organization_name: selected.organization_name ?? "",
                          phone_number: selected.phone_number ?? "",
                          mother_name: selected.mother_name ?? "",
                          mother_phone_number: selected.mother_phone_number ?? "",
                          father_name: selected.father_name ?? "",
                          father_phone_number: selected.father_phone_number ?? "",
                          email: selected.email ?? "",
                          age: selected.age ?? calcAgeFromISO(selected.date_of_birth) ?? undefined,
                          verified_by_rubitech: selected.verified_by_rubitech ?? false,
                        });
                        setEdit(false);
                      }}
                      className="px-4 py-2 rounded-xl border border-slate-300 text-sm"
                    >
                      انصراف از ویرایش
                    </button>
                    <button
                      onClick={saveEdit}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:brightness-95"
                    >
                      ذخیره تغییرات
                      <Save size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        }
      >
        {selected && buf && (
          <EditTeenForm value={buf} onChange={(v) => setBuf({ ...v })} readOnly={!edit} />
        )}
      </Modal>
    </>
  );
}
