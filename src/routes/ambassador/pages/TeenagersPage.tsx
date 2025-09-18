import React, { useEffect, useMemo, useRef, useState } from "react";
import { StatusBadge } from "@/components/ambassador/StatusBadge";
import { useAmbassadorData } from "../store";
import { UserPlus, Search, X, Pencil, Save, Trash2 } from "lucide-react";

/* ----------------------------- Types & Utils ----------------------------- */

type Teen = {
  id: string;
  name: string;
  dob: string; // jalali yyyy-mm-dd
  city: string;
  region: string;
  school: string;
  guardian: string;
  guardianPhone: string;
  talent: string;
  proofLink?: string;
  proofFile?: File | null;
  consent: boolean;
  status: "draft" | "submitted" | "review" | "approved" | "rejected";
};

const EMPTY: Teen = {
  id: "",
  name: "",
  dob: "",
  city: "",
  region: "",
  school: "",
  guardian: "",
  guardianPhone: "",
  talent: "",
  proofLink: "",
  proofFile: null,
  consent: false,
  status: "draft",
};

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function jalaliAge(j: string): string {
  if (!j) return "—";
  const m = j.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return "—";
  const jy = parseInt(m[1], 10);
  const gy = jy + 621; // rough conversion
  const now = new Date().getFullYear();
  const age = Math.max(0, now - gy);
  return String(age);
}

function statusTone(s: Teen["status"]): "success" | "warning" | "danger" | "info" | "neutral" {
  return s === "approved"
    ? "success"
    : s === "review"
      ? "warning"
      : s === "submitted"
        ? "info"
        : s === "rejected"
          ? "danger"
          : "neutral";
}

function statusLabel(s: Teen["status"]) {
  return s === "approved"
    ? "تأیید شده"
    : s === "review"
      ? "در حال بررسی"
      : s === "submitted"
        ? "ارسال شده"
        : s === "rejected"
          ? "رد شده"
          : "پیش‌نویس";
}

/* ----------------------------- Primitives (module-scoped => stable) ----------------------------- */

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
            <h2 className="text-base font-semibold text-slate-900 leading-6 truncate">{title}</h2>
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
  const width = size === "xl" ? "max-w-4xl" : size === "lg" ? "max-w-3xl" : "max-w-xl";

  return (
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          ref={ref}
          tabIndex={-1}
          className={cn("w-full rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 outline-none", width)}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-600" aria-label="بستن">
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

function validateTeen(t: Teen) {
  const e: Partial<Record<keyof Teen, string>> = {};
  (["name", "dob", "city", "region", "school", "guardian", "guardianPhone", "talent"] as (keyof Teen)[]).forEach(
    (k) => {
      if (!t[k]) e[k] = "ضروری";
    }
  );
  if (!t.consent) e.consent = "نیاز به رضایت";
  return e;
}

function TeenForm({
  value,
  onChange,
  readOnly = false,
  errors,
}: {
  value: Teen;
  onChange: (t: Teen) => void;
  readOnly?: boolean;
  errors?: Partial<Record<keyof Teen, string>>;
}) {
  // fully controlled values
  const safe = {
    name: value.name ?? "",
    dob: value.dob ?? "",
    city: value.city ?? "",
    region: value.region ?? "",
    school: value.school ?? "",
    guardian: value.guardian ?? "",
    guardianPhone: value.guardianPhone ?? "",
    talent: value.talent ?? "",
    proofLink: value.proofLink ?? "",
    consent: !!value.consent,
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="نام کامل" required error={errors?.name}>
        <input
          type="text"
          disabled={readOnly}
          value={safe.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
        />
      </Field>
      <Field label="تاریخ تولد (جلالی YYYY-MM-DD)" required error={errors?.dob}>
        <input
          type="text"
          disabled={readOnly}
          value={safe.dob}
          onChange={(e) => onChange({ ...value, dob: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
          placeholder="1388-07-21"
        />
      </Field>
      <Field label="شهر" required error={errors?.city}>
        <input
          type="text"
          disabled={readOnly}
          value={safe.city}
          onChange={(e) => onChange({ ...value, city: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
        />
      </Field>
      <Field label="منطقه" required error={errors?.region}>
        <input
          type="text"
          disabled={readOnly}
          value={safe.region}
          onChange={(e) => onChange({ ...value, region: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
        />
      </Field>
      <Field label="مدرسه" required error={errors?.school}>
        <input
          type="text"
          disabled={readOnly}
          value={safe.school}
          onChange={(e) => onChange({ ...value, school: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
        />
      </Field>
      <Field label="سرپرست" required error={errors?.guardian}>
        <input
          type="text"
          disabled={readOnly}
          value={safe.guardian}
          onChange={(e) => onChange({ ...value, guardian: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
        />
      </Field>
      <Field label="شماره سرپرست" required error={errors?.guardianPhone}>
        <input
          type="tel"
          disabled={readOnly}
          value={safe.guardianPhone}
          onChange={(e) => onChange({ ...value, guardianPhone: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
          placeholder="09xxxxxxxxx"
        />
      </Field>
      <Field label="استعداد" required error={errors?.talent}>
        <input
          type="text"
          disabled={readOnly}
          value={safe.talent}
          onChange={(e) => onChange({ ...value, talent: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
        />
      </Field>
      <Field label="لینک مدرک (اختیاری)">
        <input
          type="url"
          disabled={readOnly}
          value={safe.proofLink}
          onChange={(e) => onChange({ ...value, proofLink: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-200"
          placeholder="https://…"
        />
      </Field>
      <Field label="رضایت‌نامه">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            disabled={readOnly}
            checked={safe.consent}
            onChange={(e) => onChange({ ...value, consent: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300"
          />
          <span className={safe.consent ? "text-emerald-700" : "text-amber-700"}>
            {safe.consent ? "رضایت دارد" : "بدون رضایت"}
          </span>
        </label>
        {errors?.consent && <div className="text-xs text-rose-600 mt-1">{errors.consent}</div>}
      </Field>
    </div>
  );
}

function HeaderControls({
  query,
  setQuery,
  onNew,
}: {
  query: string;
  setQuery: (v: string) => void;
  onNew: () => void;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-3 md:items-center">
      <div className="flex items-center gap-2 bg-white/80 border border-slate-200 rounded-xl px-3 py-2 w-full md:w-80 focus-within:ring-2 focus-within:ring-sky-200">
        <Search size={16} className="text-slate-500 shrink-0" aria-hidden />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو در نام، شهر، مدرسه…"
          className="bg-transparent outline-none text-sm w-full"
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onNew}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white
                     bg-gradient-to-r from-[var(--green)] via-[var(--mint)] to-[var(--green-strong)] hover:brightness-95"
        >
          <UserPlus size={18} />
          افزودن نوجوان
        </button>
      </div>
    </div>
  );
}

function CardsGrid({
  items,
  onView,
  onDelete,
}: {
  items: Teen[];
  onView: (t: Teen) => void;
  onDelete: (id: string, name: string) => void;
}) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {items.map((t) => (
        <div
          key={t.id}
          className="relative rounded-2xl p-4 transition hover:shadow-lg ring-1 ring-slate-200
                     bg-white/95"
        >
          {/* subtle top accent */}
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-l from-sky-300/70 via-transparent to-emerald-300/70" />

          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-slate-900 font-semibold">{t.name}</div>
              <div className="text-xs text-slate-600 mt-0.5">{t.school}</div>
            </div>
            <StatusBadge label={statusLabel(t.status)} tone={statusTone(t.status)} />
          </div>

          <div className="mt-3 grid grid-cols-3 text-sm text-slate-600">
            <div>
              سن: <span className="text-slate-800">{jalaliAge(t.dob)}</span>
            </div>
            <div>
              شهر: <span className="text-slate-800">{t.city}</span>
            </div>
            <div>
              منطقه: <span className="text-slate-800">{t.region}</span>
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
              onClick={() => onDelete(t.id, t.name)}
              className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm border border-rose-200 text-white bg-[var(--rose)] hover:bg-[var(--rose-strong)]"
            >
              حذف
              <Trash2 size={16} />
            </button>
          </div>

          {!t.consent && (
            <div className="mt-3 text-[11px] text-amber-700 bg-amber-50 border border-amber-200/80 rounded-lg px-2 py-1 inline-flex items-center gap-1">
              نیاز به رضایت‌نامه
            </div>
          )}
        </div>
      ))}

      {items.length === 0 && (
        <div className="col-span-full text-center text-sm text-slate-500 py-10">چیزی پیدا نشد.</div>
      )}
    </div>
  );
}

/* ----------------------------- Main Page ----------------------------- */

export function TeenagersPage() {
  const { teenagers, setTeenagers } = useAmbassadorData() as {
    teenagers: Teen[];
    setTeenagers: React.Dispatch<React.SetStateAction<Teen[]>>;
  };

  const [query, setQuery] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [selected, setSelected] = useState<Teen | null>(null);
  const [buf, setBuf] = useState<Teen | null>(null);
  const [edit, setEdit] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Teen, string>>>({});
  const [newTeen, setNewTeen] = useState<Teen>({ ...EMPTY });

  // Filter by query only; default shows ALL teenagers
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return teenagers;
    return teenagers.filter((t) =>
      [t.name, t.city, t.region, t.school, t.guardian, t.talent, t.id]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [teenagers, query]);

  function openView(t: Teen) {
    setSelected(t);
    setBuf({ ...t });
    setEdit(false);
    setErrors({});
  }

  function saveEdit() {
    if (!buf) return;
    const e = validateTeen(buf);
    setErrors(e);
    if (Object.keys(e).length) return;
    setTeenagers((prev) => prev.map((x) => (x.id === buf.id ? { ...buf } : x)));
    setSelected({ ...buf });
    setEdit(false);
  }

  function createTeen() {
    const e = validateTeen(newTeen);
    setErrors(e);
    if (Object.keys(e).length) return;
    const item: Teen = {
      ...newTeen,
      id: "T-" + Math.floor(1000 + Math.random() * 9000),
      status: "submitted",
    };
    setTeenagers((prev) => [item, ...prev]);
    setOpenCreate(false);
    setNewTeen({ ...EMPTY });
    setErrors({});
  }

  function deleteTeen(id: string) {
    setTeenagers((prev) => prev.filter((t) => t.id !== id));
    setSelected((s) => (s?.id === id ? null : s));
  }

  return (
    <>
      <SectionCard
        title="نوجوانان شما"
        subtitle="در این صفحه می‌توانید نوجوانان را ثبت و مدیریت کنید."
        footer={
          <span className="hidden md:inline text-xs text-slate-500">
            کل: {teenagers.length} • نتایج: {list.length}
          </span>
        }
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <HeaderControls query={query} setQuery={setQuery} onNew={() => setOpenCreate(true)} />
        </div>

        <CardsGrid
          items={list}
          onView={openView}
          onDelete={(id, name) => {
            if (confirm(`حذف ${name}؟ این عملیات قابل بازگشت نیست.`)) deleteTeen(id);
          }}
        />
      </SectionCard>

      {/* Create modal */}
      <Modal
        open={openCreate}
        onClose={() => {
          setOpenCreate(false);
          setErrors({});
        }}
        title="افزودن نوجوان جدید"
        size="xl"
        footer={
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">با ذخیره، وضعیت اولیه «ارسال شده» خواهد بود.</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setOpenCreate(false)} className="px-4 py-2 rounded-xl border border-slate-300 text-sm">
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
        <TeenForm value={newTeen} onChange={setNewTeen} errors={errors} />
      </Modal>

      {/* View/Edit modal */}
      <Modal
        open={!!selected}
        onClose={() => {
          setSelected(null);
          setEdit(false);
          setErrors({});
        }}
        title={selected ? `پرونده نوجوان — ${selected.name} (${selected.id})` : "پرونده نوجوان"}
        size="xl"
        footer={
          selected && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusBadge label={statusLabel(selected.status)} tone={statusTone(selected.status)} />
                <span className="text-xs text-slate-500">سن تقریبی: {jalaliAge(selected.dob)}</span>
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
                        if (selected && confirm(`حذف ${selected.name}؟ این عملیات قابل بازگشت نیست.`)) {
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
                        setBuf(selected);
                        setEdit(false);
                        setErrors({});
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
          <TeenForm value={buf} onChange={(t) => setBuf({ ...t })} readOnly={!edit} errors={errors} />
        )}
      </Modal>
    </>
  );
}
