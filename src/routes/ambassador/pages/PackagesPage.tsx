import React, { useEffect, useMemo, useRef, useState } from "react";
import { StatusBadge, Tone } from "@/components/ambassador/StatusBadge";
import { useCached } from "@/hooks/useCached";
import { api, type Ambassador, type Teenager, type Package as ApiPackage, type PackageStage, CACHE_KEYS } from "@/services/api";
import {
  Package as PackageIcon,
  Search,
  X,
  Check,
  Info,
  Hash,
  Calendar,
  User2,
  Trash2,
  ChevronLeft,
  ClipboardList,
  Clock,
  Truck,
  Pencil,
  Save,
} from "lucide-react";

/* ----------------------------- Utils ----------------------------- */

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}
function toEnDigits(str = "") {
  const fa = "۰۱۲۳۴۵۶۷۸۹", ar = "٠١٢٣٤٥٦٧٩";
  return String(str).replace(/[۰-۹٠-٩]/g, (d) => {
    const iFa = fa.indexOf(d);
    if (iFa > -1) return String(iFa);
    const iAr = ar.indexOf(d);
    if (iAr > -1) return String(iAr);
    return d;
  });
}
function gregorianAge(yyyyMmDd: string | null | undefined): string {
  if (!yyyyMmDd) return "—";
  const m = yyyyMmDd.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return "—";
  const by = parseInt(m[1], 10);
  const now = new Date().getFullYear();
  return String(Math.max(0, now - by));
}
function formatFaDate(input?: string | number | Date | null) {
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

/* ----------------------------- Stage labels/tones ----------------------------- */

const STAGE_STEPS = [
  { key: "reviewing", label: "در حال بررسی", icon: <Check size={16} /> },
  { key: "packaging", label: "بسته‌بندی", icon: <PackageIcon size={16} /> },
  { key: "shipping", label: "ارسال", icon: <Truck size={16} /> },
  { key: "delivered", label: "تحویل شده", icon: <Calendar size={16} /> },
] as const;

function stageLabel(s?: PackageStage | null) {
  switch (s) {
    case "reviewing": return "در حال بررسی";
    case "packaging": return "بسته‌بندی";
    case "shipping": return "ارسال";
    case "delivered": return "تحویل شده";
    default: return "—";
  }
}
function stageTone(
  s?: PackageStage | null
): Tone {
  switch (s) {
    case "delivered": return "success";
    case "shipping":
    case "packaging": return "info";
    case "reviewing": return "warning";
    default: return "neutral";
  }
}
function stageProgress(s?: PackageStage | null) {
  switch (s) {
    case "reviewing": return 25;
    case "packaging": return 50;
    case "shipping": return 75;
    case "delivered": return 100;
    default: return 0;
  }
}
function stageIndex(s?: PackageStage | null): number | null {
  switch (s) {
    case "reviewing": return 0;
    case "packaging": return 1;
    case "shipping": return 2;
    case "delivered": return 3;
    default: return null;
  }
}
function statusToBadgeToneForSteps(
  s?: PackageStage | null
): "success" | "warning" | "info" | "default" {
  switch (s) {
    case "delivered": return "success";
    case "shipping":
    case "packaging": return "info";
    case "reviewing": return "warning";
    default: return "default";
  }
}

function MiniProgress({ current }: { current: number }) {
  return (
    <div className="relative mt-4">
      <div className="h-2 w-full rounded-full bg-gradient-to-l from-[var(--gray-ring)] to-[var(--sky-ring)]" />
      <div
        className="absolute inset-y-0 right-0 h-2 rounded-full bg-gradient-to-l from-[var(--violet-grad-from)] via-[var(--mint-grad-from)] to-[var(--sky-ring)] shadow-md"
        style={{ width: `${((current + 1) / STAGE_STEPS.length) * 100}%` }}
        aria-hidden
      />
      <div className="mt-3 grid grid-cols-4 gap-2 text-[10px] text-[var(--text-weak)]">
        {STAGE_STEPS.map((s, i) => (
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

/* ----------------------------- Header Controls ----------------------------- */

function HeaderControls({
  query,
  setQuery,
  onNew,
  disabled,
}: {
  query: string;
  setQuery: (v: string) => void;
  onNew: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-3 md:items-center">
      <div className="flex items-center gap-2 bg-white/80 border border-slate-200 rounded-xl px-3 py-2 w-full md:w-80 focus-within:ring-2 focus-within:ring-sky-200">
        <Search size={16} className="text-slate-500 shrink-0" aria-hidden />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو در شناسه بسته یا نام نوجوان…"
          className="bg-transparent outline-none text-sm w-full"
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onNew}
          disabled={disabled}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white",
            "bg-gradient-to-r from-[var(--green)] via-[var(--mint)] to-[var(--green-strong)] hover:brightness-95 disabled:opacity-60"
          )}
        >
          <PackageIcon size={18} />
          درخواست بسته جدید
        </button>
      </div>
    </div>
  );
}

/* ----------------------------- Cards Grid ----------------------------- */

function PackageCard({
  p,
  onOpen,
  onCancel,
  teenNameLookup,
}: {
  p: ApiPackage;
  onOpen: () => void;
  onCancel: () => void;
  teenNameLookup: (id: number) => string | undefined;
}) {
  const prog = stageProgress(p.stage);
  const teensCount = p.requested_teenagers_count ?? (p.teenager_ids?.length ?? 0);
  const qty = p.requested_laptops_count ?? teensCount ?? 0;

  return (
    <div
      className="relative rounded-2xl p-4 transition hover:shadow-lg ring-1 ring-slate-200 bg-white/95 cursor-pointer"
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen()}
    >
      {/* subtle top accent */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-l from-sky-300/70 via-transparent to-emerald-300/70" />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-slate-900 font-semibold flex items-center gap-2">
            <PackageIcon size={16} className="text-slate-600" />
            بسته {p.id}
          </div>
          <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
            <Calendar size={14} className="text-slate-400" />
            {formatFaDate(p.requested_at)}
          </div>
        </div>
        <StatusBadge label={stageLabel(p.stage)} tone={stageTone(p.stage)} />
      </div>

      <div className="mt-3 grid grid-cols-3 text-sm text-slate-600">
        <div>
          تعداد: <span className="text-slate-800">{qty}</span>
        </div>
        <div>
          نوجوانان: <span className="text-slate-800">{teensCount} نفر</span>
        </div>
        <div className="truncate">
          شناسه: <span className="text-slate-800">{p.id}</span>
        </div>
      </div>

      {/* teen pills (first 3) */}
      {!!p.teenager_ids?.length && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {p.teenager_ids.slice(0, 3).map((tid) => {
            const name = teenNameLookup(tid) || String(tid);
            const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("");
            return (
              <span
                key={tid}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-700"
              >
                <span className="grid h-5 w-5 place-items-center rounded-md bg-white text-slate-600 ring-1 ring-slate-200">
                  {initials}
                </span>
                {name}
              </span>
            );
          })}
          {(p.teenager_ids?.length ?? 0) > 3 && (
            <span className="text-[11px] text-slate-500">+{(p.teenager_ids!.length) - 3}</span>
          )}
        </div>
      )}

      {/* progress */}
      <div className="mt-4">
        <div className="mb-1 text-[11px] text-slate-500">پیشرفت</div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={cn("h-full rounded-full transition-all", p.stage === "delivered" ? "bg-emerald-500" : "bg-emerald-500")}
            style={{ width: `${prog}%` }}
          />
        </div>
      </div>

      {/* actions */}
      <div
        className="mt-4 flex items-center justify-between gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onOpen}
          className="inline-flex items-center gap-1 rounded-xl bg-slate-900 text-white px-3 py-2 text-sm hover:brightness-95"
        >
          مشاهده جزئیات
        </button>
        {p.stage === "reviewing" && (
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm border border-rose-200 text-white bg-[var(--rose)] hover:bg-[var(--rose-strong)]"
          >
            لغو
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- Select Teens ----------------------------- */

function TeenPick({
  t,
  checked,
  onToggle,
}: {
  t: Teenager;
  checked: boolean;
  onToggle: () => void;
}) {
  const name = t.full_name ?? `#${t.id}`;
  return (
    <label
      className={cn(
        "group relative flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 text-sm transition",
        checked ? "border-sky-300 bg-sky-50" : "border-slate-200 bg-white hover:bg-slate-50"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
          <User2 size={16} />
        </div>
        <div>
          <div className="font-medium text-slate-900">{name}</div>
          <div className="text-[11px] text-slate-600">
            سن: {gregorianAge(t.date_of_birth || "")}
          </div>
        </div>
      </div>
      <input type="checkbox" checked={checked} onChange={onToggle} />
    </label>
  );
}

/* ----------------------------- Main Page ----------------------------- */

export function PackagesPage() {
  // Load data via cache-aware hook
  const { data: me } = useCached<Ambassador>(CACHE_KEYS.me.ambassador, api.getMeAmbassador);
  const { data: teensData } = useCached<Teenager[]>(CACHE_KEYS.teenagers.list, api.listTeenagers);
  const { data: packagesCached } = useCached<ApiPackage[]>(CACHE_KEYS.packages.list, () => api.listPackages().then((r) => r.items));

  const teenagers = teensData ?? [];
  const [packages, setPackages] = useState<ApiPackage[]>(packagesCached ?? []);

  // --- compute locked & usable teenagers for "new package" flow ---
  const teenIdsLocked = useMemo(() => {
    const s = new Set<number>();
    (packages || []).forEach((p) => (p.teenager_ids || []).forEach((id) => s.add(id)));
    return s;
  }, [packages]);

  const usableTeens = useMemo(
    () => (teenagers || []).filter((t) => !teenIdsLocked.has(t.id)),
    [teenagers, teenIdsLocked]
  );

  const usableTeenIdsSet = useMemo(
    () => new Set(usableTeens.map((t) => t.id)),
    [usableTeens]
  );
  // ---------------------------------------------------------------------

  // Detail edit (attach/edit teens)
  const [editTeens, setEditTeens] = useState(false);
  const [editTeenIds, setEditTeenIds] = useState<number[]>([]);

  // Currently opened package
  const [selectedPkg, setSelectedPkg] = useState<ApiPackage | null>(null);

  // --- NEW: compute editable teens for edit modal (free + current package teens)
  const editableTeens = useMemo(() => {
    if (!selectedPkg) return [] as Teenager[];
    const allowed = new Set<number>(usableTeens.map((t) => t.id));
    (selectedPkg.teenager_ids || []).forEach((id) => allowed.add(id));
    return (teenagers || []).filter((t) => allowed.has(t.id));
  }, [selectedPkg, usableTeens, teenagers]);

  const editableTeenIdsSet = useMemo(
    () => new Set(editableTeens.map((t) => t.id)),
    [editableTeens]
  );
  // ---------------------------------------------------------------------

  // Sync from cache when it arrives first time
  useEffect(() => {
    if (packagesCached && packages.length === 0) {
      setPackages(packagesCached);
    }
  }, [packagesCached]);

  const isVerified = !!me?.verified_by_rubitech;
  const hasFiveTeens = teenagers.length >= 5;

  const unmet: Array<{ text: string; href: string; cta: string }> = [];
  if (!hasFiveTeens)
    unmet.push({
      text: "برای درخواست بسته باید حداقل ۵ نوجوان ثبت شده باشد.",
      href: "/ambassador/teenagers",
      cta: "ثبت نوجوان",
    });
  if (!isVerified)
    unmet.push({
      text: "احراز هویت شما باید تایید شده باشد.",
      href: "/ambassador/profile",
      cta: "تکمیل احراز هویت",
    });

  const [query, setQuery] = useState("");
  const [openCreate, setOpenCreate] = useState(false);

  // Create flow
  const [selTeenIds, setSelTeenIds] = useState<number[]>([]);

  const teenNameLookup = (id: number) =>
    teenagers.find((t) => t.id === id)?.full_name;

  // Sync editable teen ids when opening a package
  useEffect(() => {
    if (selectedPkg) {
      setEditTeens(false);
      setEditTeenIds(selectedPkg.teenager_ids ? [...selectedPkg.teenager_ids] : []);
    }
  }, [selectedPkg]);

  // Filter list
  const list = useMemo(() => {
    const q = toEnDigits(query.trim().toLowerCase());
    let arr = packages || [];
    if (!q) return arr;
    return arr.filter((p) => {
      const idMatch = toEnDigits(String(p.id)).toLowerCase().includes(q);
      const teenNames = (p.teenager_ids || [])
        .map((tid) => teenNameLookup(tid) || "")
        .join(" ");
      return idMatch || teenNames.toLowerCase().includes(q);
    });
  }, [packages, query, teenagers]);

  function openView(p: ApiPackage) {
    setSelectedPkg(p);
  }

  async function withdraw(pkgId: number) {
    // Backend doesn't have "reject" action; use delete as "withdraw"
    await api.deletePackage(pkgId);
    setPackages((prev) => (prev || []).filter((p) => p.id !== pkgId));
    setSelectedPkg((s) => (s?.id === pkgId ? null : s));
  }

  async function createPackage() {
    if (selTeenIds.length !== 5 || !me?.id) return;
    // Safety: ensure all chosen teens are still usable at the moment of submit
    if (!selTeenIds.every((id) => usableTeenIdsSet.has(id))) return;

    const created = await api.createPackage({
      ambassador_id: me.id,
      teenager_ids: selTeenIds.slice(0, 5),
    });
    setPackages((prev) => [created, ...(prev || [])]);
    setOpenCreate(false);
    setSelTeenIds([]);
  }

  // Enforce usable teen IDs for creation
  const canCreate =
    selTeenIds.length === 5 &&
    selTeenIds.every((id) => usableTeenIdsSet.has(id)) &&
    !!me?.id;

  // Save teens attachment from details modal
  const canAttachSave =
    editTeenIds.length === 5 &&
    !!selectedPkg &&
    selectedPkg.stage === "reviewing" &&
    editTeenIds.every((id) => editableTeenIdsSet.has(id));

  async function saveAttachedTeens() {
    if (!selectedPkg) return;
    if (!canAttachSave) return;
    const updated = await api.updatePackage(selectedPkg.id, {
      teenager_ids: [...editTeenIds],
      requested_teenagers_count: 5,
    });
    setPackages((prev) =>
      (prev || []).map((p) => (p.id === selectedPkg.id ? updated : p))
    );
    setSelectedPkg(updated);
    setEditTeens(false);
  }

  return (
    <>
      <SectionCard
        title="بسته‌های سفیر"
        subtitle="در این صفحه می‌توانید بسته‌ها را درخواست و مدیریت کنید."
        footer={
          <span className="hidden md:inline text-xs text-slate-500">
            کل: {packages?.length || 0} • نتایج: {list.length}
          </span>
        }
      >
        {/* Requirements banner */}
        {unmet.length > 0 && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <div className="flex items-start gap-3">
              <Info size={18} className="mt-0.5 text-amber-600" />
              <div className="space-y-2">
                {unmet.map((u, i) => (
                  <div key={i} className="text-sm text-amber-900">
                    {u.text}
                  </div>
                ))}
                <div className="flex flex-wrap gap-2">
                  {unmet.map((u, i) => (
                    <a
                      key={i}
                      href={u.href}
                      className="inline-flex items-center gap-1 rounded-xl border border-amber-300 bg-white px-3 py-1.5 text-xs text-amber-800 hover:bg-amber-100"
                    >
                      <ChevronLeft className="h-3 w-3" />
                      {u.cta}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 mb-3">
          <HeaderControls
            query={query}
            setQuery={setQuery}
            onNew={() => setOpenCreate(true)}
            disabled={unmet.length > 0}
          />
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {list.map((p) => (
            <PackageCard
              key={p.id}
              p={p}
              onOpen={() => openView(p)}
              onCancel={() => withdraw(p.id)}
              teenNameLookup={teenNameLookup}
            />
          ))}

          {list.length === 0 && (
            <div className="col-span-full text-center text-sm text-slate-500 py-10">
              چیزی پیدا نشد.
            </div>
          )}
        </div>
      </SectionCard>

      {/* Create modal */}
      <Modal
        open={openCreate}
        onClose={() => {
          setOpenCreate(false);
          setSelTeenIds([]);
        }}
        title="درخواست بسته جدید (انتخاب ۵ نوجوان)"
        size="xl"
        footer={
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">انتخاب شده: {selTeenIds.length}/5</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOpenCreate(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-sm"
              >
                لغو
              </button>
              <button
                onClick={createPackage}
                disabled={!canCreate}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white",
                  "bg-gradient-to-r from-[var(--green)] via-[var(--mint)] to-[var(--green-strong)]",
                  !canCreate && "opacity-60 cursor-not-allowed"
                )}
              >
                ثبت و ارسال
                <Check size={16} />
              </button>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          {usableTeens.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              هیچ نوجوان قابل انتخابی وجود ندارد. برخی نوجوانان شما در بسته‌های دیگر هستند.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {usableTeens.map((t) => {
                const checked = selTeenIds.includes(t.id);
                return (
                  <TeenPick
                    key={t.id}
                    t={t}
                    checked={checked}
                    onToggle={() =>
                      setSelTeenIds((prev) =>
                        checked
                          ? prev.filter((x) => x !== t.id)
                          : prev.length < 5
                            ? [...prev, t.id]
                            : prev
                      )
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </Modal>

      {/* View (details) modal */}
      <Modal
        open={!!selectedPkg}
        onClose={() => setSelectedPkg(null)}
        title={
          selectedPkg ? (
            <span className="inline-flex items-center gap-2">
              پرونده بسته — {selectedPkg.id}
              <StatusBadge
                label={stageLabel(selectedPkg.stage)}
                tone={stageTone(selectedPkg.stage)}
              />
            </span>
          ) : (
            "پرونده بسته"
          )
        }
        size="lg"
        footer={
          selectedPkg && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar size={14} />
                {formatFaDate(selectedPkg.requested_at)}
              </div>
              <div className="flex items-center gap-2">
                {selectedPkg.stage === "reviewing" && (
                  <button
                    onClick={() => {
                      if (confirm("لغو این درخواست؟")) withdraw(selectedPkg.id);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold border border-rose-200 text-rose-700 hover:bg-rose-50"
                  >
                    لغو
                    <Trash2 size={16} />
                  </button>
                )}
                <button
                  onClick={() => setSelectedPkg(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-sm"
                >
                  بستن
                </button>
              </div>
            </div>
          )
        }
      >
        {selectedPkg && (
          <div className="space-y-4">
            {/* ---------- Brief header ---------- */}
            {(() => {
              const sIdx = stageIndex(selectedPkg.stage);
              const hasSteps = sIdx !== null;
              const currentLabel = hasSteps && sIdx! >= 0 ? STAGE_STEPS[sIdx!].label : "—";
              const tone = statusToBadgeToneForSteps(selectedPkg.stage);

              return (
                <div
                  className="rounded-2xl p-4 gradient-border relative overflow-hidden"
                  style={{ boxShadow: "var(--elevate)" }}
                >
                  <div className="relative rounded-2xl ring-1 ring-white/40 bg-gradient-to-l from-[var(--sky-grad-from)] to-[var(--sky-grad-to)] p-4 glass">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge label={currentLabel} tone={tone as any} />
                          <span className="inline-flex items-center gap-1 rounded-lg border border-white/40 bg-white/70 px-2.5 py-1 text-xs text-[var(--text-weak)] glass">
                            <Hash size={14} /> کد:{" "}
                            <span className="font-extrabold text-[var(--brand)]">
                              {selectedPkg.id}
                            </span>
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-lg border border-white/40 bg-white/70 px-2.5 py-1 text-xs text-[var(--text-weak)] glass">
                            <ClipboardList size={14} /> اقلام:{" "}
                            <span className="font-extrabold text-[var(--brand)]">
                              {selectedPkg.requested_laptops_count ??
                                selectedPkg.requested_teenagers_count ??
                                selectedPkg.teenager_ids?.length ??
                                "—"}
                            </span>
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-[var(--text-weak)] sm:grid-cols-3">
                          <div className="inline-flex items-center gap-1">
                            <Clock size={14} /> ثبت: {formatFaDate(selectedPkg.requested_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                    {hasSteps ? (
                      <MiniProgress current={sIdx!} />
                    ) : (
                      <div className="mt-3 text-[11px] text-[var(--text-weak)]">
                        این درخواست هنوز در مرحله «بررسی» است.
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ---------- Details grid ---------- */}
            <div className="grid gap-4 md:grid-cols-5">
              {/* Left: metadata */}
              <div className="md:col-span-2 space-y-3">
                <div className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                    <Hash size={16} className="text-slate-500" />
                    اطلاعات بسته
                  </div>
                  <dl className="mt-2 grid grid-cols-2 gap-y-1.5 text-sm">
                    <dt className="text-slate-500">شناسه</dt>
                    <dd className="text-slate-800">{selectedPkg.id}</dd>
                    <dt className="text-slate-500">تاریخ ایجاد</dt>
                    <dd className="text-slate-800">{formatFaDate(selectedPkg.requested_at)}</dd>
                    <dt className="text-slate-500">تعداد بسته</dt>
                    <dd className="text-slate-800">
                      {selectedPkg.requested_laptops_count ??
                        selectedPkg.requested_teenagers_count ??
                        selectedPkg.teenager_ids?.length ??
                        "—"}
                    </dd>
                    <dt className="text-slate-500">وضعیت</dt>
                    <dd className="text-slate-800">
                      <StatusBadge
                        label={stageLabel(selectedPkg.stage)}
                        tone={stageTone(selectedPkg.stage)}
                      />
                    </dd>
                  </dl>

                  <div className="mt-4">
                    <div className="mb-1 text-[11px] text-slate-500">پیشرفت</div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full transition-all bg-emerald-500"
                        style={{ width: `${stageProgress(selectedPkg.stage)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: connected teenagers (with attach/edit option) */}
              <div className="md:col-span-3 space-y-3">
                <div className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                      <User2 size={16} className="text-slate-500" />
                      نوجوانان متصل
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedPkg.stage === "reviewing" && (
                        !editTeens ? (
                          <button
                            onClick={() => setEditTeens(true)}
                            className="inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold border border-slate-300 hover:bg-slate-50"
                          >
                            ویرایش
                            <Pencil size={14} />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditTeens(false);
                                setEditTeenIds(selectedPkg.teenager_ids ? [...selectedPkg.teenager_ids] : []);
                              }}
                              className="inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs border border-slate-300"
                            >
                              انصراف
                            </button>
                            <button
                              onClick={saveAttachedTeens}
                              disabled={!canAttachSave}
                              className={cn(
                                "inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs text-white",
                                "bg-emerald-600 hover:brightness-95",
                                !canAttachSave && "opacity-60 cursor-not-allowed"
                              )}
                            >
                              ذخیره
                              <Save size={14} />
                            </button>
                          </>
                        )
                      )}
                    </div>
                  </div>

                  {!editTeens ? (
                    selectedPkg.teenager_ids?.length ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedPkg.teenager_ids.map((tid) => {
                          const t = teenagers.find((x) => x.id === tid);
                          const name = t?.full_name || String(tid);
                          const initials = name
                            .split(" ")
                            .slice(0, 2)
                            .map((w) => w[0])
                            .join("");
                          return (
                            <span
                              key={tid}
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700"
                            >
                              <span className="grid h-6 w-6 place-items-center rounded-lg bg-white text-slate-600 ring-1 ring-slate-200">
                                {initials}
                              </span>
                              {name}
                              <span className="ms-1 rounded-md bg-white px-1.5 py-0.5 text-[11px] text-slate-500 ring-1 ring-slate-200">
                                {gregorianAge(t?.date_of_birth || "")} سال
                              </span>
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="mt-2 text-sm text-slate-600">
                        هنوز نوجوانی متصل نشده است.
                        {selectedPkg.stage === "reviewing" && teenagers.length >= 5 && (
                          <>
                            {" "}
                            <button
                              onClick={() => setEditTeens(true)}
                              className="text-sky-700 hover:underline text-sm"
                            >
                              اتصال ۵ نوجوان
                            </button>
                          </>
                        )}
                      </div>
                    )
                  ) : (
                    <div className="mt-3 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <div>لطفاً دقیقا ۵ نفر را انتخاب کنید</div>
                        <div
                          className={cn(
                            "rounded-lg px-2 py-0.5",
                            editTeenIds.length === 5
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                              : "bg-sky-50 text-sky-700 ring-1 ring-sky-200"
                          )}
                        >
                          {editTeenIds.length}/5
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {editableTeens.map((t) => {
                          const checked = editTeenIds.includes(t.id);
                          return (
                            <TeenPick
                              key={t.id}
                              t={t}
                              checked={checked}
                              onToggle={() =>
                                setEditTeenIds((prev) =>
                                  checked
                                    ? prev.filter((x) => x !== t.id)
                                    : prev.length < 5
                                      ? [...prev, t.id]
                                      : prev
                                )
                              }
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
