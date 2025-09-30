"use client";
import React from "react";
import {
  User2, Edit2, Check, ShieldCheck, Upload, Info, IdCard, ScanFace,
  Image as ImageIcon, UserPenIcon, CheckCircle2, XCircle, AlertCircle, Info as InfoIcon
} from "lucide-react";
import { Field } from "@/components/ambassador/ui"; // keep Field, OTPModal implemented locally
import { StatusBadge } from "@/components/ambassador/StatusBadge";
import { useCached } from "@/hooks/useCached";
import { api, CACHE_KEYS, type Ambassador } from "@/services/api";

/* --------------------------------- Utils --------------------------------- */
function cx(...classes: Array<string | false | null | undefined>) { return classes.filter(Boolean).join(" "); }
const isEmail = (s: string) => /\S+@\S+\.\S+/.test(s);
const isPhone = (s: string) => /^\+?\d{10,15}$/.test(s);

/* --------------------------- Sweet Toasts (RTL) --------------------------- */
type ToastKind = "success" | "error" | "warning" | "info";
type Toast = { id: number; kind: ToastKind; title?: string; message: string };
function useToasts() {
  const [toasts, set] = React.useState<Toast[]>([]);
  const remove = React.useCallback((id: number) => set((xs) => xs.filter((t) => t.id !== id)), []);
  const push = React.useCallback((kind: ToastKind, message: string, title?: string) => {
    const id = Date.now() + Math.random();
    set((xs) => [...xs, { id, kind, title, message }]);
    setTimeout(() => remove(id), 4200);
  }, [remove]);
  return { toasts, push, remove };
}
function ToastHost({ items, onClose }: { items: Toast[]; onClose: (id: number) => void }) {
  const tone = (k: ToastKind) => k === "success" ? "bg-emerald-600" : k === "error" ? "bg-rose-600" : k === "warning" ? "bg-amber-500" : "bg-sky-600";
  const Icon = (k: ToastKind) => k === "success" ? CheckCircle2 : k === "error" ? XCircle : k === "warning" ? AlertCircle : InfoIcon;
  return (
    <div dir="rtl" className="fixed top-4 left-4 z-[60] flex flex-col gap-2">
      {items.map((t) => {
        const Ico = Icon(t.kind);
        return (
          <div key={t.id} className={cx("min-w-[260px] max-w-[92vw] rounded-2xl shadow-lg text-white px-4 py-3", "backdrop-blur-sm bg-opacity-95", "animate-[fadeIn_.2s_ease-out]", tone(t.kind))} style={{ direction: "rtl" }}>
            <div className="flex items-start gap-3">
              <Ico className="h-5 w-5 shrink-0" />
              <div className="flex-1">
                {t.title && <div className="text-sm font-semibold mb-0.5">{t.title}</div>}
                <div className="text-sm leading-6">{t.message}</div>
              </div>
              <button className="opacity-80 hover:opacity-100 transition" onClick={() => onClose(t.id)} aria-label="Dismiss">
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* --------------------------------- Cards/Buttons -------------------------- */
function Card(p: React.PropsWithChildren<{ className?: string }>) { return <div className={cx("rounded-2xl border bg-white shadow-sm", "border-zinc-200", p.className)}>{p.children}</div>; }
function CardHeader(p: React.PropsWithChildren<{ className?: string }>) { return <div className={cx("p-5 border-b", "border-zinc-200", "bg-gradient-to-l from-sky-50 via-white to-emerald-50", p.className)}>{p.children}</div>; }
function CardContent(p: React.PropsWithChildren<{ className?: string }>) { return <div className={cx("p-5", p.className)}>{p.children}</div>; }
function CardTitle(p: React.PropsWithChildren<{ className?: string }>) { return <h3 className={cx("text-base font-semibold text-zinc-900", p.className)}>{p.children}</h3>; }

function Button({
  children, className, variant = "primary", onClick, disabled, type,
}: React.PropsWithChildren<{ className?: string; variant?: "primary" | "secondary" | "outline" | "warning"; onClick?: React.MouseEventHandler<HTMLButtonElement>; disabled?: boolean; type?: "button" | "submit" | "reset"; }>) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";
  const variants = {
    primary: "text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-300",
    secondary: "bg-white text-zinc-900 border border-zinc-200 hover:border-zinc-300 focus:ring-sky-300",
    outline: "bg-transparent border border-zinc-300 text-zinc-800 hover:bg-zinc-50 focus:ring-sky-300",
    warning: "bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-300",
  } as const;
  return <button type={type || "button"} onClick={onClick} disabled={disabled} className={cx(base, variants[variant], className)}>{children}</button>;
}

/* ---------------------------------- Tabs ---------------------------------- */
type TabsCtx = { value: string; setValue: (v: string) => void; listRef: React.RefObject<HTMLDivElement>; };
const TabsContext = React.createContext<TabsCtx | null>(null);
function Tabs({ defaultValue, className, children }: React.PropsWithChildren<{ defaultValue: string; className?: string }>) {
  const [value, setValue] = React.useState(defaultValue);
  const listRef = React.useRef<HTMLDivElement>(null);
  return <TabsContext.Provider value={{ value, setValue, listRef }}><div className={className}>{children}</div></TabsContext.Provider>;
}
function TabsList({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  const ctx = React.useContext(TabsContext)!;
  const indicatorRef = React.useRef<HTMLDivElement>(null);
  const recalc = React.useCallback(() => {
    const list = ctx.listRef.current, indicator = indicatorRef.current;
    if (!list || !indicator) return;
    const active = list.querySelector<HTMLButtonElement>("[data-active='true']");
    if (!active) return;
    const listRect = list.getBoundingClientRect();
    const btnRect = active.getBoundingClientRect();
    const x = btnRect.left - listRect.left + list.scrollLeft;
    const width = btnRect.width;
    const maxX = list.scrollWidth - width;
    indicator.style.width = `${width}px`;
    indicator.style.transform = `translate3d(${Math.max(0, Math.min(maxX, x))}px,0,0)`;
  }, [ctx.value]);
  React.useLayoutEffect(() => recalc(), [recalc, ctx.value]);
  React.useEffect(() => {
    const list = ctx.listRef.current; if (!list) return;
    const ro = new ResizeObserver(recalc);
    ro.observe(list);
    list.querySelectorAll("button[role='tab']").forEach((el) => ro.observe(el));
    window.addEventListener("resize", recalc);
    document.fonts?.ready?.then(recalc).catch(() => { });
    return () => { ro.disconnect(); window.removeEventListener("resize", recalc); };
  }, [recalc]);
  return (
    <div ref={ctx.listRef} role="tablist" dir="ltr" className={cx("relative grid grid-flow-col auto-cols-fr w-full gap-2 rounded-2xl p-1", "bg-slate-100 border border-slate-200", "overflow-hidden", className)}>
      <div ref={indicatorRef} aria-hidden className="pointer-events-none absolute top-1 bottom-1 left-1 rounded-xl bg-white shadow-sm transition-[transform,width] duration-200 ease-out" style={{ width: 0, transform: "translate3d(0,0,0)" }} />
      {children}
    </div>
  );
}
function TabsTrigger({ value, children, icon, disabled }: { value: string; children: React.ReactNode; icon?: React.ReactNode; disabled?: boolean }) {
  const ctx = React.useContext(TabsContext)!;
  const active = ctx.value === value;
  return (
    <button type="button" role="tab" aria-selected={active} data-active={active ? "true" : "false"} disabled={disabled} onClick={() => !disabled && ctx.setValue(value)}
      className={cx("relative z-[1] flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2", "whitespace-nowrap", disabled && "opacity-50 cursor-not-allowed", active ? "text-slate-900" : "text-slate-700 hover:text-slate-900")}>
      {icon && <span className="grid h-4 w-4 place-items-center">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
function TabsContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const ctx = React.useContext(TabsContext)!;
  if (ctx.value !== value) return null;
  return <div role="tabpanel" className={className}>{children}</div>;
}

/* ------------------------------ Header Bar -------------------------------- */
function HeaderBar({ a }: { a: Ambassador }) {
  return (
    <div className="rounded-2xl border p-4 bg-gradient-to-tr from-sky-100 to-sky-200 border-sky-200">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-100 to-emerald-100">
          <User2 className="h-6 w-6 text-zinc-800" />
        </div>
        <div className="font-medium text-zinc-900">{a.full_name || "—"}</div>
      </div>
    </div>
  );
}

/* -------------------------- Profile Fields (Ambassador) ------------------- */
function ProfileFields({ form, setForm, editing, current }: { form: Ambassador; setForm: (v: Ambassador) => void; editing: boolean; current: Ambassador; }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Field label="نام و نام خانوادگی" value={editing ? (form.full_name ?? "") : (current.full_name ?? "")} onChange={(v) => (editing ? setForm({ ...form, full_name: v }) : (null as any))} readOnly={!editing} />
      <Field label="کد ملی" value={editing ? (form.national_identifier ?? "") : (current.national_identifier ?? "")} onChange={(v) => (editing ? setForm({ ...form, national_identifier: v }) : (null as any))} readOnly={!editing} />
      <Field label="تاریخ تولد" type="date" value={editing ? (form.date_of_birth ?? "") : (current.date_of_birth ?? "")} onChange={(v) => (editing ? setForm({ ...form, date_of_birth: v }) : (null as any))} readOnly={!editing} />
      <Field label="استان" value={editing ? (form.province ?? "") : (current.province ?? "")} onChange={(v) => (editing ? setForm({ ...form, province: v }) : (null as any))} readOnly={!editing} />
      <Field label="شهر" value={editing ? (form.city ?? "") : (current.city ?? "")} onChange={(v) => (editing ? setForm({ ...form, city: v }) : (null as any))} readOnly={!editing} />
      <Field label="آدرس" value={editing ? (form.address ?? "") : (current.address ?? "")} onChange={(v) => (editing ? setForm({ ...form, address: v }) : (null as any))} readOnly={!editing} />
      <Field label="سازمان/نقش" value={editing ? (form.organization_name ?? "") : (current.organization_name ?? "")} onChange={(v) => (editing ? setForm({ ...form, organization_name: v }) : (null as any))} readOnly={!editing} />
      <Field label="ایمیل" value={editing ? (form.email ?? "") : (current.email ?? "")} onChange={(v) => (editing ? setForm({ ...form, email: v }) : (null as any))} readOnly={!editing}
        after={<StatusBadge label={current.email_verified ? "تأیید شده" : "تأیید نشده"} tone={current.email_verified ? ("success" as any) : ("warning" as any)} />} />
      <Field label="شماره موبایل" value={editing ? (form.phone_number ?? "") : (current.phone_number ?? "")} onChange={(v) => (editing ? setForm({ ...form, phone_number: v }) : (null as any))} readOnly={!editing}
        after={<StatusBadge label={current.phone_number_verified ? "تأیید شده" : "تأیید نشده"} tone={current.phone_number_verified ? ("success" as any) : ("warning" as any)} />} />
    </div>
  );
}

/* ------------------------------- KYC Section ------------------------------ */
function UploadCard({ label, file, onFile, hint, dense = false }: { label: string; file?: File | null; onFile: (f: File | null) => void; hint?: string; dense?: boolean; }) {
  return (
    <div className={cx("group relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border bg-white text-center transition", "border-dashed border-zinc-300 hover:border-zinc-400", dense ? "min-h-[92px] p-3" : "min-h-[120px] p-4")}>
      <Upload className="h-5 w-5 text-violet-600" />
      <div className="text-sm font-medium text-zinc-800">{label}</div>
      <div className="text-xs text-zinc-500">{file ? (file as any).name : hint || "JPG/PNG، حداکثر ۵ مگابایت"}</div>
      <input type="file" className="absolute inset-0 h-full w-full opacity-0" onChange={(e) => onFile(e.target.files?.[0] || null)} accept="image/*" />
    </div>
  );
}
function KYCSection({ verified, onSubmit }: { verified: boolean; onSubmit: (payload: { front: File; back: File; selfie: File }) => Promise<void> | void; }) {
  const [front, setFront] = React.useState<File | null>(null);
  const [back, setBack] = React.useState<File | null>(null);
  const [selfie, setSelfie] = React.useState<File | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const canSubmit = !!front && !!back && !!selfie;
  if (verified) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-600" /><CardTitle>احراز هویت</CardTitle></div>
            <StatusBadge label="تأیید شده" tone={"success" as any} />
          </div>
        </CardHeader>
        <CardContent className="text-sm text-zinc-700">حساب شما توسط روبیتک تأیید شده است.</CardContent>
      </Card>
    );
  }
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-600" /><CardTitle>احراز هویت</CardTitle></div>
          <StatusBadge label="تأیید نشده" tone={"warning" as any} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3 [direction:ltr]">
          <div className="md:col-start-1 md:col-span-1" dir="rtl">
            <Card>
              <CardHeader className="bg-white"><CardTitle>راهنما</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm text-zinc-700">
                <div className="flex items-start gap-2"><ImageIcon className="mt-0.5 h-4 w-4 text-violet-600" /><span>تصاویر واضح و بدون واترمارک بارگذاری کنید.</span></div>
                <div className="flex items-start gap-2"><IdCard className="mt-0.5 h-4 w-4 text-emerald-600" /><span>روی و پشت کارت ملی باید خوانا باشد.</span></div>
                <div className="flex items-start gap-2"><ScanFace className="mt-0.5 h-4 w-4 text-sky-600" /><span>سلفی: چهره کامل و بدون عینک آفتابی.</span></div>
                <div className="flex items-start gap-2 text-xs text-zinc-600"><Info className="mt-0.5 h-4 w-4" /><span>میانگین زمان بررسی ۷۲ ساعت کاری است.</span></div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-start-2 md:col-span-2 space-y-3" dir="rtl">
            <UploadCard label="روی کارت ملی" file={front} onFile={setFront} dense />
            <UploadCard label="پشت کارت ملی" file={back} onFile={setBack} dense />
            <UploadCard label="سلفی زنده" file={selfie} onFile={setSelfie} dense />
            <div className="flex items-center justify-start gap-2 pt-1">
              <Button variant="primary" disabled={!canSubmit || submitting} onClick={async () => { if (!front || !back || !selfie) return; try { setSubmitting(true); await onSubmit({ front, back, selfie }); } finally { setSubmitting(false); } }}>
                <Upload className="ml-1 rtl:ml-0 rtl:mr-1" size={16} /> ارسال برای بررسی
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------- OTP MODAL --------------------------------
   - Sends user-entered code back via onVerified(code) so parent calls API.
   - Auto-advance to next input.
   - Supports paste (Ctrl/Cmd+V).
------------------------------------------------------------------------------ */
type OTPModalProps = {
  open: boolean;
  channel: "email" | "sms" | null;
  onVerified: (code?: string) => void;
  onClose: () => void;
  length?: number;
  autoSubmitWhenFull?: boolean;
};
function OTPModal({ open, channel, onVerified, onClose, length = 6, autoSubmitWhenFull = true }: OTPModalProps) {
  const [values, setValues] = React.useState<string[]>(Array.from({ length }, () => ""));
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);

  const reset = React.useCallback(() => {
    setValues(Array.from({ length }, () => ""));
    setTimeout(() => inputsRef.current[0]?.focus(), 10);
  }, [length]);

  React.useEffect(() => { if (open) reset(); }, [open, reset]);

  const filledCode = React.useMemo(() => values.join(""), [values]);

  function setAt(idx: number, char: string) {
    setValues((prev) => prev.map((v, i) => (i === idx ? char : v)));
  }
  function focusIndex(idx: number) {
    const clamped = Math.max(0, Math.min(length - 1, idx));
    inputsRef.current[clamped]?.focus();
    inputsRef.current[clamped]?.select?.();
  }

  function handleChange(idx: number, raw: string) {
    const digits = raw.replace(/\D+/g, "");
    if (!digits) { setAt(idx, ""); return; }
    if (digits.length > 1) {
      setValues((prev) => {
        const next = [...prev];
        let i = idx;
        for (const d of digits) { if (i >= length) break; next[i++] = d; }
        return next;
      });
      const nextFocus = Math.min(length - 1, idx + digits.length);
      if (!(autoSubmitWhenFull && idx + digits.length >= length)) focusIndex(nextFocus);
    } else {
      setAt(idx, digits);
      focusIndex(idx + 1);
    }
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    const key = e.key;
    const curr = values[idx];
    if (key === "Backspace") {
      if (curr) setAt(idx, "");
      else { focusIndex(idx - 1); setAt(Math.max(0, idx - 1), ""); }
      e.preventDefault();
    } else if (key === "ArrowLeft") { focusIndex(idx - 1); e.preventDefault(); }
    else if (key === "ArrowRight") { focusIndex(idx + 1); e.preventDefault(); }
    else if (key === "Enter") { if (filledCode.length === length) onVerified(filledCode); e.preventDefault(); }
  }

  function handlePaste(idx: number, e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text");
    const digits = text.replace(/\D+/g, "");
    if (!digits) return;
    e.preventDefault();
    setValues((prev) => {
      const next = [...prev];
      let i = idx;
      for (const d of digits) { if (i >= length) break; next[i++] = d; }
      return next;
    });
    const last = Math.min(length - 1, idx + Math.max(0, digits.length - 1));
    focusIndex(last + 1);
  }

  React.useEffect(() => {
    if (!open) return;
    if (autoSubmitWhenFull && filledCode.length === length) {
      const t = setTimeout(() => onVerified(filledCode), 50);
      return () => clearTimeout(t);
    }
  }, [filledCode, length, open, autoSubmitWhenFull, onVerified]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/30 backdrop-blur-[1px]" onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <div dir="rtl" className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-200 p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-violet-600" />
            <div className="font-semibold text-zinc-900">تأیید کد یک‌بارمصرف</div>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-zinc-100" aria-label="بستن">
            <XCircle className="h-5 w-5 text-zinc-600" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="text-sm text-zinc-700">
            {channel === "sms" ? "کدی که با پیامک دریافت کردید را وارد کنید."
              : channel === "email" ? "کدی که به ایمیل شما ارسال شد را وارد کنید."
                : "کد ارسال‌شده را وارد کنید."}
          </div>

          <div className="flex justify-center gap-2 [direction:ltr]">
            {values.map((val, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                maxLength={1}
                value={val}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={(e) => handlePaste(i, e)}
                className={cx(
                  "h-12 w-10 rounded-xl border text-center text-lg font-semibold tracking-widest",
                  "border-zinc-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                )}
              />
            ))}
          </div>

          <div className="flex items-center justify-start gap-2">
            <Button
              variant="primary"
              onClick={() => onVerified(filledCode)}
              disabled={filledCode.length !== length}
              className="min-w-[96px]"
            >
              <Check className="ml-1 rtl:ml-0 rtl:mr-1" size={16} /> تأیید
            </Button>
            <Button variant="secondary" onClick={onClose}>انصراف</Button>
          </div>

          <div className="text-[12px] text-zinc-500">می‌توانید کد را جای‌گذاری (Ctrl/⌘+V) کنید؛ کادرها به‌صورت خودکار پر می‌شوند.</div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Page ---------------------------------- */
export function ProfilePage() {
  const { data: me, loading, error } = useCached(CACHE_KEYS.me.ambassador, api.getMeAmbassador);
  const toasts = useToasts();

  const [ambassador, setAmbassador] = React.useState<Ambassador>({
    id: 0, role: "ambassador" as any, email: "", full_name: "", organization_name: "",
    national_identifier: "", date_of_birth: "", province: "", city: "", address: "",
    profile_picture_path: "", verified_by_rubitech: false, agreed_to_terms: false,
    phone_number_verified: false, email_verified: false, phone_number: "",
  });

  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState<Ambassador>(ambassador);

  /** OTP flow state — email and/or sms (sequential) */
  const [otp, setOtp] = React.useState<{
    open: boolean;
    steps: Array<"email" | "sms">;
    index: number;
    pendingPatch: Record<string, any> | null;
  }>({ open: false, steps: [], index: 0, pendingPatch: null });

  /** Only hydrate from cache once; then local state is the source of truth */
  const hydratedRef = React.useRef(false);
  React.useEffect(() => {
    if (!me) return;
    if (hydratedRef.current) return; // avoid overwriting after first mount
    hydratedRef.current = true;
    setAmbassador(me as Ambassador);
    setForm(me as Ambassador);
  }, [me]);

  function buildPatch(a: Ambassador, b: Ambassador) {
    const keys: (keyof Ambassador)[] = [
      "full_name", "national_identifier", "date_of_birth", "province", "city", "address",
      "organization_name", "email", "phone_number"
    ];
    const patch: Record<string, any> = {};
    for (const k of keys) {
      const av = (a as any)?.[k];
      const bv = (b as any)?.[k];
      if (av !== bv) patch[k as string] = bv;
    }
    return patch;
  }

  async function refreshMeLocal() {
    try {
      const fresh = await api.getMeAmbassador();
      setAmbassador(fresh);
      if (!editing) setForm(fresh);
    } catch {
      /* keep optimistic state if refresh fails */
    }
  }

  async function actuallySave(patch: Record<string, any>) {
    setSaving(true);
    try {
      await api.updateAmbassadorProfile(patch);

      // ✅ optimistic UI: immediately reflect new values for ALL fields
      setAmbassador((prev) => ({
        ...prev,
        ...patch,
        ...(patch.email ? { email_verified: false } : {}),
        ...(patch.phone_number ? { phone_number_verified: false } : {}),
      }));
      setForm((prev) => ({
        ...prev,
        ...patch,
        ...(patch.email ? { email_verified: false } : {}),
        ...(patch.phone_number ? { phone_number_verified: false } : {}),
      }));

      // then fetch from server to ensure consistency
      await refreshMeLocal();

      toasts.push("success", "پروفایل با موفقیت ذخیره شد.");
      setEditing(false);
    } catch (e: any) {
      toasts.push("error", e?.message || "خطای نامشخص در ذخیره پروفایل.");
    } finally {
      setSaving(false);
    }
  }

  /** Compute identifier for current OTP step */
  function currentIdentifier(channel: "email" | "sms", patch: Record<string, any>) {
    if (channel === "email") return String((patch.email ?? form.email ?? ambassador.email) || "").trim();
    return String((patch.phone_number ?? form.phone_number ?? ambassador.phone_number) || "").trim();
  }

  /** Auto-send OTP when modal opens or step changes */
  React.useEffect(() => {
    if (!otp.open) return;
    const channel = otp.steps[otp.index];
    if (!channel) return;
    const identifier = currentIdentifier(channel, otp.pendingPatch || {});
    if (!identifier) {
      toasts.push("warning", channel === "email" ? "ایمیل برای ارسال کد در دسترس نیست." : "شماره موبایل برای ارسال کد در دسترس نیست.");
      return;
    }
    (async () => {
      try {
        await api.sendOtp({ channel, identifier, role: "ambassador" });
        toasts.push("info", channel === "email" ? "کد به ایمیل ارسال شد." : "کد با پیامک ارسال شد.");
      } catch (e: any) {
        toasts.push("error", e?.message || "ارسال کد ناموفق بود.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp.open, otp.index]);

  /** Verify handler — sends the user-provided code to API */
  async function handleVerify(code: string) {
    const channel = otp.steps[otp.index];
    if (!otp.open || !channel) return;
    const identifier = currentIdentifier(channel, otp.pendingPatch || {});
    if (!identifier) { toasts.push("warning", "شناسه نامعتبر است."); return; }
    if (!code || !code.trim()) { toasts.push("warning", "کد وارد نشده است."); return; }
    try {
      const res = await api.verifyOtp({ channel, identifier, code: code.trim(), role: "ambassador" });
      if (!res?.ok) throw new Error(res?.detail || "کد نادرست است.");
      toasts.push("success", "کد با موفقیت تأیید شد.");
      await onOtpVerified();
    } catch (e: any) {
      toasts.push("error", e?.message || "تأیید کد ناموفق بود.");
    }
  }

  /** Advance OTP flow after a successful verification */
  async function onOtpVerified() {
    const nextIndex = otp.index + 1;
    if (nextIndex < otp.steps.length) { setOtp((st) => ({ ...st, index: nextIndex })); return; }
    const patch = otp.pendingPatch || {};
    setOtp({ open: false, steps: [], index: 0, pendingPatch: null });
    await actuallySave(patch);
  }
  function onOtpClose() {
    setOtp({ open: false, steps: [], index: 0, pendingPatch: null });
    toasts.push("info", "فرآیند تأیید کد لغو شد.");
  }

  async function handleSave() {
    const patch = buildPatch(ambassador, form);
    if (!Object.keys(patch).length) { toasts.push("warning", "تغییری برای ذخیره وجود ندارد."); return; }

    const emailChanged = Object.prototype.hasOwnProperty.call(patch, "email");
    const phoneChanged = Object.prototype.hasOwnProperty.call(patch, "phone_number");

    if (emailChanged) {
      const email = String(patch.email ?? "");
      if (!email || !isEmail(email)) { toasts.push("warning", "ایمیل معتبر نیست."); return; }
    }
    if (phoneChanged) {
      const phone = String(patch.phone_number ?? "");
      if (!phone || !isPhone(phone)) { toasts.push("warning", "شماره موبایل معتبر نیست. مثال: ‎+98912xxxxxxx"); return; }
    }

    if (!emailChanged && !phoneChanged) { await actuallySave(patch); return; }

    const steps: Array<"email" | "sms"> = [];
    if (emailChanged) steps.push("email");
    if (phoneChanged) steps.push("sms");
    setOtp({ open: true, steps, index: 0, pendingPatch: patch });
  }

  const currentOtpChannel: "email" | "sms" | null = otp.steps[otp.index] || null;

  return (
    <div dir="rtl" className="space-y-6">
      <HeaderBar a={ambassador} />
      {loading && <div className="text-xs text-zinc-600">در حال بارگذاری اطلاعات پروفایل…</div>}
      {error && <div className="text-xs text-rose-600">خطا در دریافت پروفایل: {String(error)}</div>}

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="kyc" icon={<ShieldCheck className="h-4 w-4" />}>احراز هویت</TabsTrigger>
          <TabsTrigger value="profile" icon={<UserPenIcon className="h-4 w-4" />}>پروفایل</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader><CardTitle>اطلاعات فردی</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <ProfileFields form={form} setForm={setForm} editing={editing} current={ambassador} />
              </div>
              {!editing ? (
                <div className="mt-5 flex items-center justify-start">
                  <Button variant="warning" onClick={() => { setForm(ambassador); setEditing(true); }} disabled={loading}>
                    <Edit2 className="ml-1 rtl:ml-0 rtl:mr-1" size={16} /> ویرایش
                  </Button>
                </div>
              ) : (
                <div className="mt-5 flex items-center justify-start gap-2">
                  <Button variant="secondary" onClick={() => { setEditing(false); setForm(ambassador); }}>انصراف</Button>
                  <Button variant="primary" onClick={handleSave} disabled={saving}><Check className="ml-1 rtl:ml-0 rtl:mr-1" size={16} /> ذخیره</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc">
          <KYCSection verified={!!ambassador.verified_by_rubitech} onSubmit={async ({ front, back, selfie }) => {
            console.log("Submitting KYC files:", { front, back, selfie });
            toasts.push("success", "فایل‌ها بارگذاری شدند. نتیجه بررسی متعاقباً اعلام می‌شود.");
          }} />
        </TabsContent>
      </Tabs>

      {/* OTP Modal — handles auto-advance & paste, returns user-entered code */}
      <OTPModal
        open={otp.open}
        channel={currentOtpChannel}
        onVerified={(code?: string) => {
          if (typeof code === "string" && code.trim()) {
            void handleVerify(code);
          } else {
            void onOtpVerified();
          }
        }}
        onClose={onOtpClose}
      />

      <ToastHost items={toasts.toasts} onClose={toasts.remove} />
    </div>
  );
}
