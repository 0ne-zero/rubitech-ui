import React from "react";
import {
  User2,
  Edit2,
  Check,
  ShieldCheck,
  Upload,
  Info,
  AlertTriangle,
  Mail,
  Phone,
  IdCard,
  ScanFace,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { useAmbassadorData } from "../store";
import { StatusBadge } from "@/components/ambassador/StatusBadge";
import { Field, OTPModal } from "@/components/ambassador/ui";

/* -------------------------------------------------------------------------- */
/*              Lightweight UI primitives (Tailwind only, inline)             */
/* -------------------------------------------------------------------------- */

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* Card */
function Card({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cx(
        "rounded-2xl border bg-white/90 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/70",
        "border-[var(--sky-ring,theme(colors.zinc.200))]",
        className
      )}
    >
      {children}
    </div>
  );
}
function CardHeader({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cx(
        "p-5 border-b",
        "border-[var(--sky-ring,theme(colors.zinc.200))]",
        "bg-gradient-to-l from-[var(--sky,theme(colors.sky.50))] via-white to-[var(--mint-tint,theme(colors.emerald.50))]",
        className
      )}
    >
      {children}
    </div>
  );
}
function CardContent({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cx("p-5", className)}>{children}</div>;
}
function CardTitle({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <h3 className={cx("text-base font-semibold text-zinc-900", className)}>
      {children}
    </h3>
  );
}

/* Button */
function Button({
  children,
  className,
  variant = "primary",
  onClick,
  disabled,
  type,
}: React.PropsWithChildren<{
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "warning";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}>) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";
  const variants = {
    primary:
      "text-white bg-[var(--mint,theme(colors.emerald.600))] hover:brightness-95 focus:ring-[var(--mint-ring,theme(colors.emerald.300))]",
    secondary:
      "bg-white text-zinc-900 border border-[var(--sky-ring,theme(colors.zinc.200))] hover:border-zinc-300 focus:ring-[var(--sky-ring,theme(colors.sky.300))]",
    outline:
      "bg-transparent border border-[var(--sky-ring,theme(colors.zinc.300))] text-zinc-800 hover:bg-zinc-50 focus:ring-[var(--sky-ring,theme(colors.sky.300))]",
    warning:
      "bg-[var(--amber,theme(colors.amber.500))] text-white hover:brightness-95 focus:ring-[var(--amber-ring,theme(colors.amber.300))]",
  } as const;

  return (
    <button
      type={type || "button"}
      onClick={onClick}
      disabled={disabled}
      className={cx(base, variants[variant], className)}
    >
      {children}
    </button>
  );
}

/* Badge */
function Badge({
  children,
  variant = "secondary",
  className,
}: React.PropsWithChildren<{
  variant?: "secondary" | "outline";
  className?: string;
}>) {
  const styles =
    variant === "outline"
      ? "border border-[var(--sky-ring,theme(colors.zinc.300))] text-zinc-700 bg-white"
      : "bg-[var(--sky,theme(colors.sky.100))] text-[var(--sky-strong,theme(colors.sky.800))]";
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
        styles,
        className
      )}
    >
      {children}
    </span>
  );
}

/* Progress */
function Progress({ value = 0, className = "" }: { value?: number; className?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cx(
        "h-2 w-full overflow-hidden rounded-full",
        "bg-[var(--sky-tint,theme(colors.zinc.100))]",
        className
      )}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-[var(--mint,theme(colors.emerald.500))] via-[var(--sky,theme(colors.sky.500))] to-[var(--violet,theme(colors.violet.500))]"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Pro Tabs v2                                 */
/* -------------------------------------------------------------------------- */

type TabsContextType = {
  value: string;
  setValue?: (v: string) => void;
  register?: (v: string, el: HTMLButtonElement | null) => void;
  listRef?: React.RefObject<HTMLDivElement>;
  values?: string[];
};
const TabsContext = React.createContext<TabsContextType | null>(null);

function Tabs({
  defaultValue,
  value: controlled,
  onValueChange,
  className,
  children,
}: React.PropsWithChildren<{
  defaultValue?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  className?: string;
}>) {
  const [internal, setInternal] = React.useState(defaultValue || "");
  const value = controlled ?? internal;
  const setValue = (v: string) => {
    setInternal(v);
    onValueChange?.(v);
  };

  // registry to track trigger elements (for indicator + keyboard nav)
  const registry = React.useRef<Map<string, HTMLButtonElement | null>>(new Map());
  const valuesRef = React.useRef<string[]>([]);
  const listRef = React.useRef<HTMLDivElement>(null);

  const register = React.useCallback((v: string, el: HTMLButtonElement | null) => {
    registry.current.set(v, el);
    valuesRef.current = Array.from(registry.current.keys());
  }, []);

  return (
    <TabsContext.Provider
      value={{ value, setValue, register, listRef, values: valuesRef.current }}
    >
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}
function TabsList({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  const ctx = React.useContext(TabsContext)!;
  const indicatorRef = React.useRef<HTMLDivElement>(null);

  const recalc = React.useCallback(() => {
    const list = ctx.listRef?.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator || !ctx.value) return;

    const active = list.querySelector<HTMLButtonElement>(
      `[data-tab-value="${CSS.escape(ctx.value)}"]`
    );
    if (!active) return;

    // Always use LEFT offset relative to the tablist — correct in LTR & RTL
    const left = (active as HTMLElement).offsetLeft - (list as HTMLElement).clientLeft;
    const width = (active as HTMLElement).offsetWidth;

    // Clamp to avoid sub-pixel overflow
    const maxX = list.clientWidth - width;
    const x = Math.max(0, Math.min(maxX, left));

    indicator.style.width = `${width}px`;
    indicator.style.transform = `translate3d(${x}px,0,0)`;
  }, [ctx.value, ctx.listRef]);

  React.useLayoutEffect(() => {
    recalc();
  }, [recalc]);

  React.useEffect(() => {
    const list = ctx.listRef?.current;
    if (!list) return;

    const ro = new ResizeObserver(recalc);
    ro.observe(list);
    list.querySelectorAll("[role='tab']").forEach((el) => ro.observe(el));

    const mo = new MutationObserver(recalc);
    mo.observe(list, { childList: true, subtree: true, attributes: true });

    window.addEventListener("resize", recalc);
    document.fonts?.ready?.then(recalc).catch(() => { });
    return () => {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", recalc);
    };
  }, [recalc, ctx.listRef]);

  return (
    <div
      ref={ctx.listRef}
      role="tablist"
      className={cx(
        "relative grid grid-flow-col auto-cols-fr w-full gap-1 rounded-2xl p-1 overflow-hidden",
        "bg-[var(--sky,theme(colors.slate.900))] ring-1 ring-inset ring-black/10",
        className
      )}
    >
      {/* Anchor at left:0 so translateX works consistently in RTL/LTR */}
      <div
        ref={indicatorRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-1 bottom-1 rounded-xl bg-white shadow-md transition-[transform,width] duration-300 ease-out will-change-transform"
        style={{ transform: "translate3d(0px,0,0)", width: "0px" }}
      />
      {children}
    </div>
  );
}



function TabsTrigger({
  value,
  children,
  icon,
  disabled,
}: {
  value: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}) {
  const ctx = React.useContext(TabsContext)!;
  const ref = React.useRef<HTMLButtonElement | null>(null);
  const active = ctx.value === value;

  // register for indicator + keyboard nav
  React.useEffect(() => {
    ctx.register?.(value, ref.current);
  }, [ctx, value]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!ctx.values || !ctx.setValue) return;

    const list = Array.from(
      ref.current?.parentElement?.querySelectorAll<HTMLButtonElement>("[role='tab']")
      || []
    );
    const idx = list.findIndex((n) => n === ref.current);
    const dir =
      (document.dir === "rtl" ||
        ref.current?.closest("[dir='rtl']") ||
        getComputedStyle(ref.current?.parentElement as Element).direction === "rtl")
        ? -1
        : 1;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      list[(idx + 1 * dir + list.length) % list.length]?.focus();
      const nextVal = list[(idx + 1 * dir + list.length) % list.length]?.dataset.tabValue;
      nextVal && ctx.setValue(nextVal);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      list[(idx - 1 * dir + list.length) % list.length]?.focus();
      const prevVal = list[(idx - 1 * dir + list.length) % list.length]?.dataset.tabValue;
      prevVal && ctx.setValue(prevVal);
    } else if (e.key === "Home") {
      e.preventDefault();
      list[0]?.focus();
      list[0]?.dataset.tabValue && ctx.setValue(list[0].dataset.tabValue);
    } else if (e.key === "End") {
      e.preventDefault();
      list[list.length - 1]?.focus();
      const v = list[list.length - 1]?.dataset.tabValue;
      v && ctx.setValue(v);
    }
  };

  return (
    <button
      ref={ref}
      role="tab"
      aria-selected={active}
      aria-controls={`panel-${value}`}
      data-tab-value={value}
      disabled={disabled}
      onKeyDown={onKeyDown}
      onClick={() => !disabled && ctx.setValue?.(value)}
      className={cx(
        "relative z-[1] flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
        "whitespace-nowrap",
        disabled && "opacity-50 cursor-not-allowed",
        // CHANGE: Inverted text colors for the new dark background
        active
          ? "text-[var(--brand-strong,theme(colors.slate.900))]" // Active text is dark (on the white pill)
          : "text-black hover:text-black/" // Inactive text is light
      )}
    >
      {icon && <span className="grid h-4 w-4 place-items-center">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}




function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(TabsContext)!;
  if (ctx.value !== value) return null;
  return (
    <div
      id={`panel-${value}`}
      role="tabpanel"
      aria-labelledby={value}
      className={className}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Helper Components                             */
/* -------------------------------------------------------------------------- */

type KycStatus = "draft" | "submitted" | "review" | "approved" | "rejected";

function toneFromStatus(status: KycStatus) {
  switch (status) {
    case "approved":
      return { tone: "success" as const, text: "تأیید شده" };
    case "review":
      return { tone: "info" as const, text: "در حال بررسی" };
    case "submitted":
      return { tone: "info" as const, text: "ارسال‌شده" };
    case "rejected":
      return { tone: "danger" as const, text: "رد شده" };
    default:
      return { tone: "warning" as const, text: "پیش‌نویس" };
  }
}

function SectionHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 p-0">
      <div>
        <div className="text-sm font-semibold text-zinc-900">{title}</div>
        {subtitle && (
          <div className="text-xs leading-relaxed text-zinc-500">
            {subtitle}
          </div>
        )}
      </div>
      {right}
    </div>
  );
}

function SmartStatus({ status }: { status: KycStatus }) {
  const { tone, text } = toneFromStatus(status);
  return <StatusBadge label={text} tone={tone as any} />;
}

/* Upload Drop */
function UploadCard({
  label,
  file,
  onFile,
  hint,
  dense = false,
}: {
  label: string;
  file?: File | null;
  onFile: (f: File | null) => void;
  hint?: string;
  dense?: boolean;
}) {
  return (
    <div
      className={cx(
        "group relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border bg-white text-center transition",
        "border-dashed border-[var(--sky-ring,theme(colors.zinc.300))] hover:border-zinc-400",
        dense ? "min-h-[92px] p-3" : "min-h-[120px] p-4"
      )}
    >
      <Upload className="h-5 w-5 text-[var(--violet,theme(colors.violet.600))]" />
      <div className="text-sm font-medium text-zinc-800">{label}</div>
      <div className="text-xs text-zinc-500">
        {file ? (file as any).name : hint || "JPG/PNG، حداکثر ۵ مگابایت"}
      </div>
      <input
        type="file"
        className="absolute inset-0 h-full w-full opacity-0"
        onChange={(e) => onFile(e.target.files?.[0] || null)}
      />
    </div>
  );
}

/* Common logic */
function kycProgress(kyc: any) {
  const completedCount = [kyc.front, kyc.back, kyc.selfie].filter(Boolean).length;
  const progress = Math.round(
    (completedCount / 3) * 75 +
    (["submitted", "review", "approved"].includes(kyc.status) ? 25 : 0)
  );
  return { completedCount, progress };
}

/* راهنما (Helper) */
function GuideCard() {
  return (
    <Card className="h-full">
      <CardHeader className="bg-gradient-to-b from-white to-[var(--sky,theme(colors.sky.50))]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[var(--mint,theme(colors.emerald.600))]" />
          <CardTitle>راهنما</CardTitle>
          <Badge className="rtl:mr-2">تکمیل سریع‌تر</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-zinc-700">
        <div className="flex items-start gap-2">
          <ImageIcon className="mt-0.5 h-4 w-4 text-[var(--violet,theme(colors.violet.600))]" />
          <span>تصاویر واضح، برش‌نخورده و بدون واترمارک بارگذاری کنید.</span>
        </div>
        <div className="flex items-start gap-2">
          <IdCard className="mt-0.5 h-4 w-4 text-[var(--mint,theme(colors.emerald.600))]" />
          <span>روی و پشت کارت ملی باید خوانا و بدون انعکاس باشد.</span>
        </div>
        <div className="flex items-start gap-2">
          <ScanFace className="mt-0.5 h-4 w-4 text-[var(--brand,theme(colors.sky.600))]" />
          <span>برای سلفی، صورت کامل در کادر و بدون عینک آفتابی باشد.</span>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                     KYC — Design 6: Themed Checklist + Guide               */
/* -------------------------------------------------------------------------- */

function KYC_Checklist_Themed({
  form,
  setForm,
}: {
  form: any;
  setForm: (v: any) => void;
}) {
  const { progress } = kycProgress(form.kyc);

  const Row = ({
    label,
    file,
    onFile,
    accent = "mint",
  }: {
    label: string;
    file: File | null | undefined;
    onFile: (f: File | null) => void;
    accent?: "mint" | "sky" | "violet";
  }) => {
    const accentMap = {
      mint: {
        icon: "text-[var(--mint,theme(colors.emerald.600))]",
        ring: "ring-[var(--mint-ring,theme(colors.emerald.300))]",
        bg: "bg-[var(--mint-tint,theme(colors.emerald.50))]",
      },
      sky: {
        icon: "text-[var(--sky,theme(colors.sky.600))]",
        ring: "ring-[var(--sky-ring,theme(colors.sky.300))]",
        bg: "bg-[var(--sky-tint,theme(colors.sky.50))]",
      },
      violet: {
        icon: "text-[var(--violet,theme(colors.violet.600))]",
        ring: "ring-[var(--violet-ring,theme(colors.violet.300))]",
        bg: "bg-[var(--violet-tint,theme(colors.violet.50))]",
      },
    } as const;

    const tones = accentMap[accent];

    return (
      <div
        className={cx(
          "flex items-center justify-between gap-3 rounded-xl border bg-white p-3",
          "border-[var(--sky-ring,theme(colors.zinc.200))]",
          file && `ring-1 ${tones.ring}`
        )}
      >
        <div className="flex items-center gap-2 text-sm">
          <span
            className={cx(
              "grid h-6 w-6 place-items-center rounded-lg text-white",
              file ? "bg-[var(--mint,theme(colors.emerald.600))]" : "bg-[var(--sky,theme(colors.sky.500))]"
            )}
          >
            {file ? <Check className="h-5 w-5" /> : <Sparkles className="h-5 w-5 text-[var(--amber)]" />}
          </span>
          <span className="text-zinc-800">{label}</span>
        </div>
        <div className={cx("w-56 rounded-lg", file ? tones.bg : "")}>
          <UploadCard label="انتخاب فایل" file={file} onFile={onFile} dense />
        </div>
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[var(--mint-strong,theme(colors.emerald.600))]" />
            <CardTitle>احراز هویت</CardTitle>
          </div>
          <div className="flex items-center gap-3">
            {/* reserved for future status/progress */}
          </div>
        </div>
      </CardHeader>

      {/* Two-column layout with Guide */}
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {/* راهنما */}
          <div className="md:col-span-1">
            <GuideCard />
          </div>
          <div className="md:col-span-2 space-y-3">
            <Row
              label="روی کارت ملی"
              file={form.kyc.front}
              onFile={(f) => setForm({ ...form, kyc: { ...form.kyc, front: f } })}
              accent="mint"
            />
            <Row
              label="پشت کارت ملی"
              file={form.kyc.back}
              onFile={(f) => setForm({ ...form, kyc: { ...form.kyc, back: f } })}
              accent="sky"
            />
            <Row
              label="سلفی زنده"
              file={form.kyc.selfie}
              onFile={(f) => setForm({ ...form, kyc: { ...form.kyc, selfie: f } })}
              accent="violet"
            />

            <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-600">
              {form.kyc.status === "rejected" ? (
                <div className="flex items-center gap-1 text-rose-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span>توضیح رد: {form.kyc.note || "—"}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Info className="h-4 w-4 text-[var(--amber-strong)]" />
                  <span className="mr-1">میانگین زمان بررسی ۷۲ ساعت کاری است</span>
                </div>
              )}
              <Button
                variant="primary"
                disabled={!(form.kyc.front && form.kyc.back && form.kyc.selfie)}
                onClick={() =>
                  setForm({
                    ...form,
                    kyc: { ...form.kyc, status: "submitted" as KycStatus },
                  })
                }
              >
                <Upload className="ml-1 rtl:ml-0 rtl:mr-1" size={16} /> ارسال برای بررسی
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Profile Fields                                */
/* -------------------------------------------------------------------------- */

function ProfileFields({
  form,
  setForm,
  editing,
  profile,
}: {
  form: any;
  setForm: (v: any) => void;
  editing: boolean;
  profile: any;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Field
        label="نام و نام خانوادگی"
        value={editing ? form.name : profile.name}
        onChange={(v) => (editing ? setForm({ ...form, name: v }) : null as any)}
        readOnly={!editing}
      />
      <Field
        label="کد ملی"
        value={editing ? form.nationalId : profile.nationalId}
        onChange={(v) =>
          editing ? setForm({ ...form, nationalId: v }) : (null as any)
        }
        readOnly={!editing}
      />
      <Field
        label="تاریخ تولد"
        type="date"
        value={editing ? form.dob : profile.dob}
        onChange={(v) => (editing ? setForm({ ...form, dob: v }) : null as any)}
        readOnly={!editing}
      />
      <Field
        label="شهر"
        value={editing ? form.city : profile.city}
        onChange={(v) => (editing ? setForm({ ...form, city: v }) : null as any)}
        readOnly={!editing}
      />
      <Field
        label="استان/منطقه"
        value={editing ? form.region : profile.region}
        onChange={(v) =>
          editing ? setForm({ ...form, region: v }) : (null as any)
        }
        readOnly={!editing}
      />
      <Field
        label="سازمان/نقش"
        value={editing ? form.org : profile.org}
        onChange={(v) => (editing ? setForm({ ...form, org: v }) : null as any)}
        readOnly={!editing}
      />
      <Field
        label="ایمیل"
        value={editing ? form.email.value : profile.email.value}
        onChange={(v) =>
          editing
            ? setForm({ ...form, email: { ...form.email, value: v } })
            : (null as any)
        }
        readOnly={!editing}
        after={
          <StatusBadge
            label={profile.email.verified ? "تأیید شده" : "تأیید نشده"}
            tone={profile.email.verified ? ("success" as any) : ("warning" as any)}
          />
        }
      />
      <Field
        label="موبایل"
        value={editing ? form.phone.value : profile.phone.value}
        onChange={(v) =>
          editing
            ? setForm({ ...form, phone: { ...form.phone, value: v } })
            : (null as any)
        }
        readOnly={!editing}
        after={
          <StatusBadge
            label={profile.phone.verified ? "تأیید شده" : "تأیید نشده"}
            tone={profile.phone.verified ? ("success" as any) : ("warning" as any)}
          />
        }
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Header Bar                                  */
/* -------------------------------------------------------------------------- */

function HeaderBar({
  profile,
}: {
  profile: any;
}) {
  return (
    <div className="rounded-2xl border p-4 bg-gradient-to-tr from-[var(--sky-ring,theme(colors.sky.100))] to-[var(--sky,theme(colors.sky.200))] border-[var(--sky-ring,theme(colors.sky.200))]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[var(--violet-tint,theme(colors.violet.100))] to-[var(--mint-tint,theme(colors.emerald.100))]">
            <User2 className="h-6 w-6 text-zinc-800" />
          </div>
          <div>
            <div className="font-medium text-zinc-900">{profile.name}</div>
            <div className="text-xs text-zinc-600">کد سفیر: RB-20341</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Final Page Export                              */
/* -------------------------------------------------------------------------- */

export function ProfilePage() {
  const { profile, setProfile } = useAmbassadorData();
  const [editing, setEditing] = React.useState(false);
  const [form, setForm] = React.useState(profile);
  const [otp, setOtp] = React.useState<{
    open: boolean;
    channel: "email" | "phone" | null;
    onOk?: () => void;
  }>({ open: false, channel: null });

  const startEdit = () => {
    setForm(profile);
    setEditing(true);
  };
  const saveWithOtp = () => {
    setOtp({
      open: true,
      channel: null,
      onOk: () => {
        setProfile(form);
        setEditing(false);
      },
    });
  };

  return (
    <div className="space-y-6">
      <HeaderBar profile={profile} />

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger
            value="profile"
            icon={<User2 className="h-4 w-4" />}
          >
            پروفایل
          </TabsTrigger>
          <TabsTrigger
            value="kyc"
            icon={<ShieldCheck className="h-4 w-4" />}
          >
            احراز هویت
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <SectionHeader
                title="اطلاعات فردی"
              />
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 ">
                <div>
                  <ProfileFields
                    form={form}
                    setForm={setForm}
                    editing={editing}
                    profile={profile}
                  />
                </div>
              </div>

              {!editing ? (
                <div className="mt-5 flex items-center justify-end">
                  <Button variant="warning" onClick={startEdit}>
                    <Edit2 className="ml-1 rtl:ml-0 rtl:mr-1" size={16} /> ویرایش
                  </Button>
                </div>
              ) : (
                <div className="mt-5 flex items-center justify-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditing(false);
                      setForm(profile); // reset
                    }}
                  >
                    انصراف
                  </Button>
                  <Button
                    variant="primary"
                    onClick={saveWithOtp}
                  >
                    <Check className="ml-1 rtl:ml-0 rtl:mr-1" size={16} /> ذخیره با تأیید OTP
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Your chosen KYC design */}
        <TabsContent value="kyc">
          <KYC_Checklist_Themed form={form} setForm={setForm} />
        </TabsContent>
      </Tabs>

      <OTPModal
        open={otp.open}
        channel={otp.channel}
        onVerified={() => {
          otp.onOk && otp.onOk();
        }}
        onClose={() => setOtp({ open: false, channel: null })}
      />
    </div>
  );
}
