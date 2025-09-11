import React, { useMemo, useState } from "react";

/**
 * Rubitech Landing (FA / RTL)
 * Palette:
 *  - Deep Trust Blue  #0A2540
 *  - Cloud White      #FFFFFF
 *  - Light Grey       #F6F9FC
 *  - Impact Green     #00D09C (hover #00B88A)
 *  - Charcoal Text    #1A1F36
 * Typography: IranYekanX / IranYekanX FaNum (self-host; needs license)
 * RTL-first layout, 8px grid, section spacing 80px, single primary CTA
 */


type IconLike = React.ComponentType<{ className?: string }>;

// ---- local type helpers
type SVGProps = React.SVGProps<SVGSVGElement>;
type DivProps = React.HTMLAttributes<HTMLDivElement>;

// --- helpers
function logEvent(name: string, payload: Record<string, unknown> = {}) {
  console.debug(`[event] ${name}`, payload);
}
export const toFa = (n: number | string) => Number(n || 0).toLocaleString("fa-IR");
const toEnDigits = (str: string) =>
  (str || "")
    .replace(/[۰-۹]/g, (d: string) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString())
    .replace(/[^0-9.]/g, "");

// --- icons (minimal, RTL-aware)
const IconShield = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
    <path
      d="M12 3l7 3v6a9 9 0 0 1-7 8.75A9 9 0 0 1 5 12V6l7-3Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="m9 12 2 2 4-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const IconLoop = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
    <path d="M17 1v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M21 5a9 9 0 1 0 2.62 6.38"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
const IconUsers = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
    <circle cx="8" cy="9" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M1.5 20a6.5 6.5 0 0 1 13 0" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="17" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M14 20a6 6 0 0 1 8.5-5.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
const IconArrowRTL = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
    <path
      d="M20 12H4M8 6l-6 6 6 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const IconHeartHand = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...p}>
    <path d="M7.5 3C4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3c-1.74 0-3.41.81-4.5 2.09C11.91 3.81 10.24 3 8.5 3H7.5z" />
    <path d="M7 11.5a4.5 4.5 0 0 1 9 0" />
  </svg>
);
const IconRubitechPlatform = (p: DivProps) => (
  <div
    className="grid h-8 w-8 place-items-center rounded-lg bg-[#0A2540] text-lg font-bold text-white"
    {...p}
  >
    ر
  </div>
);
const IconMap = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
    <path
      d="M3 6 9 3l6 3 6-3v15l-6 3-6-3-6 3V6Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 12v6" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
const IconQuestion = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
    <path d="M12 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path
      d="M9.09 9a3 3 0 1 1 5.82 1c0 1.5-1 2-2 2-1 0-2 .5-2 2v1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
const IconEye = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
    <path
      d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
const IconSparkles = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
    <path
      d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M5 16l.8 2.2L8 19l-2.2.8L5 22l-.8-2.2L2 19l2.2-.8L5 16Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);
const IconLaptop = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
    <rect x="3" y="5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 17h18v2H3z" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
const IconGlobe = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const IconKeyhole = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...p}>
    <circle cx="12" cy="9" r="4" />
    <path d="M10 13h4l-2 6z" />
  </svg>
);
const IconNodePath = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...p}>
    <circle cx="4" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="20" cy="12" r="2" />
    <path d="M6 12h4M14 12h4" />
  </svg>
);
const IconStampOfApproval = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...p}>
    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const IconCommunity = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...p}>
    <circle cx="12" cy="7" r="3" />
    <path d="M12 10c-3 0-6 2-6 5v2h12v-2c0-3-3-5-6-5Z" />
    <circle cx="6" cy="12" r="2" />
    <path d="M6 14c-2 0-4 1-4 3v1h8v-1c0-2-2-3-4-3Z" />
    <circle cx="18" cy="12" r="2" />
    <path d="M18 14c2 0 4 1 4 3v1h-8v-1c0-2 2-3 4-3Z" />
  </svg>
);
const IconFlag = (p: SVGProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...p}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1v12Z" />
    <path d="M4 22v-7" />
  </svg>
);

// --- ImpactStat
type ImpactStatProps = {
  value: string | number;
  label: string;
  Icon: IconLike;
  bgColor: string;
  iconColor: string;
};
const ImpactStat = ({ value, label, Icon, bgColor, iconColor }: ImpactStatProps) => (
  <div className={`flex items-center gap-4 rounded-2xl p-6 ${bgColor || "bg-slate-100"}`}>
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/50 ${iconColor || "text-[#0A2540]"
        }`}
    >
      <Icon className="h-7 w-7" />
    </div>
    <div>
      <div className="text-3xl font-extrabold text-[#0A2540]">{value}</div>
      <div className="mt-1 text-base text-[#1A1F36] opacity-80">{label}</div>
    </div>
  </div>
);

// --- primitives
type SectionProps = { id?: string; className?: string; children: React.ReactNode };
const Section = ({ id, className = "", children }: SectionProps) => (
  <section id={id} className={`py-20 md:py-20 ${className}`}>{children}</section>
);

type ContainerProps = { className?: string; children: React.ReactNode };
const Container = ({ className = "", children }: ContainerProps) => (
  <div className={`mx-auto w-full max-w-7xl px-4  ${className}`}>{children}</div>
);

type PrimaryCTAProps = { onClick?: () => void; className?: string; children: React.ReactNode };
const PrimaryCTA = ({ onClick, children, className = "" }: PrimaryCTAProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`min-h-12 rounded-lg bg-[var(--green)] px-8 py-4 text-[18px] font-extrabold text-white strong-shadow ring-1 ring-[var(--green)]/35 transition hover:-translate-y-0.5 hover:bg-[var(--green-strong)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--green)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${className}`}
    aria-label="حمایت خود رو ثبت کن"
  >
    {children}
  </button>
);

type StatProps = { value: string | number; label: string };
const Stat = ({ value, label }: StatProps) => (
  <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-[var(--sky-ring)]">
    <div className="text-3xl font-extrabold text-[#0A2540]">{value}</div>
    <div className="mt-1 text-sm text-[#1A1F36] opacity-80">{label}</div>
  </div>
);

type TestimonialCardProps = { quote: string; name: string; title: string; img: string };
const TestimonialCard = ({ quote, name, title, img }: TestimonialCardProps) => (
  <figure className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[var(--sky-ring)]">
    <figcaption className="flex items-center gap-3">
      <img src={img} alt="تصویر" className="h-16 w-15 rounded-full object-cover" />
      <div>
        <div className="text-lg font-semibold text-[#0A2540]">{name}</div>
        <div className="text-sm font-semibold text-[#1A1F36] opacity-70">{title}</div>
      </div>
    </figcaption>
    <blockquote className="text-[19px] text-[#1A1F36] opacity-95 font-medium">“{quote}”</blockquote>
  </figure>
);

type FAQItemProps = { q: string; a: React.ReactNode };
const FAQItem = ({ q, a }: FAQItemProps) => (
  <details className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 open:shadow-md">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
      <span className="text-lg font-semibold text-[#0A2540]">{q}</span>
      <span className="shrink-0 rounded-full border border-slate-300 px-2 py-1 text-xs text-slate-500 transition group-open:rotate-180">▾</span>
    </summary>
    <div className="mt-3 text-[18px] font-medium leading-[1.7] text-[#1A1F36] opacity-90">{a}</div>
  </details>
);

// flow components

type FlowStepProps = {
  number: number | string;
  title: string;
  description: string;
  IconComponent: IconLike;
  isOdd: boolean;
  iconBgColor: string;
  stepColor: string;
  boxBgColor: string;
};
const FlowStep = ({
  number,
  title,
  description,
  IconComponent,
  isOdd,
  iconBgColor,
  stepColor,
  boxBgColor,
}: FlowStepProps) => (
  <div className="relative md:w-1/2 md:py-4" style={isOdd ? { alignSelf: "flex-start" } : { alignSelf: "flex-end" }}>
    <div
      className={`relative rounded-2xl p-6 shadow-md ring-1 ring-slate-200/80 transition-all duration-300 hover:shadow-xl hover:ring-slate-300 md:flex md:items-start md:gap-6 ${boxBgColor || "bg-white"
        } ${isOdd ? "md:mr-8" : "md:ml-8"}`}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBgColor || "bg-[#E5F0FA]"
          } text-[#0A2540]`}
      >
        <IconComponent className="h-7 w-7" />
      </div>
      <div className="mt-4 md:mt-0">
        <div className="flex items-baseline gap-3">
          <span className={`text-xl font-extrabold ${stepColor || "text-[#00D09C]"}`}>{number}</span>
          <h3 className="text-xl font-bold text-[#0A2540]">{title}</h3>
        </div>
        <p className="mt-2 text-[20px] leading-relaxed text-[#1A1F36] opacity-80">{description}</p>
      </div>
    </div>
  </div>
);

// unified section header
type SectionHeaderProps = {
  kicker?: string;
  title: string;
  subtitle?: string;
  Icon?: IconLike;
};
const SectionHeader = ({ kicker, title, subtitle, Icon }: SectionHeaderProps) => (
  <div className="relative mb-10">
    <div className="inline-flex items-center gap-2 rounded-full bg-[var(--sky)] px-3 py-1 text-[var(--brand)] ring-1 ring-[var(--sky-ring)]">

      <span className="text-[24px] font-bold">{kicker}</span>
      {Icon ? <Icon className="h-6 w-7" /> : null}
    </div>

    <h2 className="mt-4 text-[32px] font-extrabold leading-[1.5] text-[#0A2540] md:text-[28px]">{title}</h2>
    {subtitle ? (
      <p className="mt-4 max-w-3xl text-[20px] leading-[1.6] text-[#1A1F36] opacity-90">{subtitle}</p>
    ) : null}
    <div className="mt-6 h-1.5 w-28 rounded-full bg-gradient-to-l from-[var(--green)] to-[var(--brand)]" />

  </div>
);



type DifferentiationCardProps = {
  Icon: IconLike;
  iconClass: string;
  title: string;
  wrapperClass: string;
  description: string | React.ReactNode;
};

const DifferentiationCard = ({
  Icon,
  iconClass,
  title,
  wrapperClass,
  description,
}: DifferentiationCardProps) => (
  <div className={wrapperClass}>
    <Icon className={iconClass} />
    <div className="mt-3 mb-3 font-semibold text-xl text-[#0A2540]">{title}</div>

    {/* Keep styles identical to your original cards */}
    {typeof description === "string" ? (
      <p className="mt-1 text-[18px] font-medium leading-[1.7] text-[#1A1F36] opacity-90">{description}</p>
    ) : (
      description
    )}
  </div>
);

export default function RubitechLandingPageFA() {
  const [open, setOpen] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  function openModal(location: string) {
    logEvent("cta_click", { location });
    setOpen(true);
  }

  return (
    <main
      dir="rtl"
      lang="fa"
      style={{
        fontFamily:
          'IRANYekanX, IRANYekanX FaNum, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
      }}
    >

      {/* hero */}
      <Section id="hero" className="overflow-hidden bg-gradient-to-b from-[var(--sky)] to-white pb-0 md:pb-50">

        <Container>
          <div className="grid items-center gap-10 py-10 md:py-10 md:grid-cols-2 ">
            <div className="relative md:order-2">
              <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-slate-200 ring-slate-300 shadow-xl ring-1 ">
                <img
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1400&auto=format&fit=crop"
                  alt="نوجوان امیدوار با لپ‌تاپ"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="md:order-1">
              <h1 className="text-[30px] font-extrabold leading-[1.8] text-[#0A2540] md:text-[42px]">
                با هم آینده ایران رو میسازیم
              </h1>
              <h1 className="text-[30px] font-extrabold leading-[1.9] text-[#0A2540] md:text-[32px]">
                هر لپ‌تاپ، یک مدرسه هوشمند
              </h1>
              <p className="mt-4 text-[20px] leading-[1.7] text-[var(--text-weak)]">
                کنارِ شما، دستِ درخشان‌ترین نوجوانان ایران رو به ابزار وصل می‌کنیم—با گذاشتن یک لپ‌تاپ در دستانشان. می‌توانید مسیرِ مشارکت‌تان رو از صفحهٔ خودتان تا مدرسهٔ او به‌صورت زنده دنبال کنید.
              </p>
              <p className="font-bold text-[20px]">
                (باید تغییر کنه)
              </p>
              <div className="mt-10">
                <PrimaryCTA onClick={() => openModal("hero")} className="w-full sm:w-auto">
                  همین حالا همراه می‌شوم
                </PrimaryCTA>
              </div>
            </div>
          </div>
          <div className="py-5 backdrop-blur-sm">
            <Container>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ImpactStat
                  value={`${toFa(134)}+`}
                  label="نوجوانان تحت ثاثیر"
                  Icon={IconLaptop}
                  bgColor="bg-[var(--mint)]"
                  iconColor="text-[var(--brand)]"
                />
                <ImpactStat
                  value={`${toFa(113)}+`}
                  label="مدرسه تامین شده"
                  Icon={IconLaptop}
                  bgColor="bg-[var(--sky)]"
                  iconColor="text-[var(--brand)]"
                />
                <ImpactStat
                  value={toFa(35)}
                  label="سفیر فعال"
                  Icon={IconShield}
                  bgColor="bg-[var(--violet-tint)]"
                  iconColor="text-[#6D28D9]"
                />
                <ImpactStat
                  value={toFa(4)}
                  label="استان تحت پوشش"
                  Icon={IconGlobe}
                  bgColor="bg-[var(--amber-tint)]"
                  iconColor="text-[#0EA5A7]"
                />
              </div>
            </Container>
          </div>
        </Container>

      </Section>
      <hr></hr>

      {/* چطور */}
      <Section id="solution" className="overflow-hidden bg-gradient-to-b from-white to-[var(--sky)]">
        <Container>
          <SectionHeader
            kicker="چطور ؟"
            Icon={IconNodePath}
            title="مسیر کامل حمایت شما"
            subtitle="ما یک اکوسیستم کامل طراحی کرده‌ایم که کمک شما رو به فرصتی پایدار برای آینده یک نوجوان تبدیل می‌کند. این مسیر ۵ مرحله‌ست:"
          />

          <div className="relative mt-10 flex flex-col gap-12 md:gap-0">
            <div className="absolute right-1/2 top-0 hidden h-full w-0.5 translate-x-1/2 bg-slate-200/80 md:block" />

            <FlowStep
              number="۱"
              title="شما زنجیره رو آغاز می‌کنید"
              description="حمایت شما به شکلی شفاف و امن، اولین حلقه زنجیره آینده‌سازی رو می‌سازد."
              IconComponent={IconHeartHand}
              isOdd={true}
              boxBgColor="bg-[var(--sky)]"
              iconBgColor="bg-white/50"
              stepColor="text-[var(--brand)]"
            />

            <FlowStep
              number="۲"
              title="روبیتک شفافیت رو تضمین می‌کند"
              description="روبیتک هر حمایت رو تا رسیدن به مقصد نهایی، قابل رهگیری می‌کند."
              IconComponent={IconRubitechPlatform}
              isOdd={false}
              boxBgColor="bg-[var(--violet-tint)]"
              iconBgColor="bg-white/50"
              stepColor="text-[#6D28D9]"
            />

            <FlowStep
              number="۳"
              title="سفیر معتمد ما حمایت رو تحویل می‌دهد"
              description="معلمان و مدیران متعهد (سفیران ما) لپ‌تاپ رو به دست نوجوان شایسته می‌رسانند."
              IconComponent={IconShield}
              isOdd={true}
              boxBgColor="bg-[var(--mint)]"
              iconBgColor="bg-white/50"
              stepColor="text-[#0EA5A7]"
            />

            <FlowStep
              number="۴"
              title="یک آینده ساخته می‌شود"
              description="نوجوان بااستعداد ابزار لازم برای یادگیری، ساختن و تغییر آینده خود رو به دست می‌آورد."
              IconComponent={IconUsers}
              isOdd={false}
              boxBgColor="bg-[var(--amber-tint)]"
              iconBgColor="bg-white/50"
              stepColor="text-[#F59E0B]"
            />

            <FlowStep
              number="۵"
              title="فرصت بورسیه روبیکمپ"
              description="نوجوانان موفق بورسیه کامل مدرسه رهبری روبیکمپ رو دریافت می‌کنند."
              IconComponent={IconSparkles}
              isOdd={true}
              boxBgColor="bg-[#E9FBF6]"
              iconBgColor="bg-white/50"
              stepColor="text-[#008A6E]"
            />
          </div>
        </Container>
      </Section>

      {/* شفافیت */}
      {/* <Section id="transparency" className="bg-[#F6F9FC]">
        <Container>
          <SectionHeader
            kicker="شفافیت"
            Icon={IconEye}
            title="تاثیر خود رو رهگیری می‌کنید"
            subtitle="شفافیت ۱۰۰٪؛ تردید ۰٪. هر پیشرفت نوجوان روی پنل شخصی شما قابل رهگیری‌ست."
          />
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <div className="grid content-start gap-6">
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#F6F9FC]">
                <div className="font-semibold text-[#0A2540]">۱. شما تعهد می‌دهید</div>
                <p className="mt-1 text-[18px] leading-[1.7] opacity-90">
                  فرآیند ساده و امن برای انتخاب سطح اثرگذاری.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#F6F9FC]">
                <div className="font-semibold text-[#0A2540]">۲. ما تخصیص می‌دهیم</div>
                <p className="mt-1 text-[18px] leading-[1.7] opacity-90">
                  به هر تعهد یک شناسهٔ یکتا داده می‌شود و با دانش‌آموز واجد شرایط تطبیق می‌یابد.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#F6F9FC]">
                <div className="font-semibold text-[#0A2540]">۳. شما دنبال می‌کنید</div>
                <p className="mt-1 text-[18px] leading-[1.7] opacity-90">
                  با نقشه و نقاط عطف، مسیر رو زنده ببینید.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#F6F9FC]">
                <div className="font-semibold text-[#0A2540]">۴. شما شاهد می‌شوید</div>
                <p className="mt-1 text-[18px] leading-[1.7] opacity-90">
                  به‌روزرسانی‌های پیشرفت برایتان ارسال می‌شود.
                </p>
              </div>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#F6F9FC]">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-[#0A2540]">حمایت #RT-2487 • در حال انتقال</div>
                <span className="rounded-full bg-[#E9FBF6] px-2 py-1 text-xs font-semibold text-[#0A2540]">
                  زنده
                </span>
              </div>
              <div className="mt-4 flex items-center gap-3 text-sm opacity-90">
                <IconMap className="h-5 w-5" />
                <span>آخرین به‌روزرسانی: شیراز • سفیر دریافت رو تأیید کرد</span>
              </div>
              <div className="mt-6 h-56 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200" />
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-[#00D09C]" /> تعهد ثبت شد</div>
                <div className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-[#00D09C]" /> دستگاه تهیه شد</div>
                <div className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-[#00D09C]" /> سفیر تخصیص یافت</div>
                <div className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-[#00D09C]" /> در مسیرِ تحویل</div>
                <div className="flex items-center gap-3 opacity-50"><span className="h-2 w-2 rounded-full bg-slate-300" /> فعال‌سازی توسط دانش‌آموز</div>
              </div>
            </div>
          </div>
        </Container>
      </Section> */}

      {/* اعتماد */}
      <Section id="social-proof" className="overflow-hidden bg-gradient-to-b from-[var(--sky)] to-white">
        <Container>
          <SectionHeader
            kicker="اعتماد"
            Icon={IconStampOfApproval}
            title="جنبشی که می‌توانید به آن تکیه کنید"
            subtitle="از اعتماد فردی تا مسئولیت اجتماعی شرکت‌ها، همه در کنار هم برای ساخت آینده."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <TestimonialCard
              quote="این پروژه برام مهمه چون حتی اگر هستی هم نباشه باز ادامه پیدا میکنه و این روند پایدار کمک به ادم‌ها برام مقدسه!"
              name="هستی طاعتی"
              title="مارکتر"
              img={`${import.meta.env.BASE_URL}/images/hasti-taati.jpg`}
            />
            <TestimonialCard
              quote="به‌عنوان ایرانی مقیم خارج، بالاخره اثر واقعی حمایتم رو در وطن می‌بینم. اگرچه من و تو متاثر از محیط هستیم اما محصور آن نیستیم!."
              name="سعید حسین‌زاده"
              title="مدیرعامل روبیکمپ"
              img={`${import.meta.env.BASE_URL}/images/saeed-hoseinzadeh.jpg`}
            />
            <TestimonialCard
              quote="ورودم به دنیای تکنولوژی مسیر زندگیم ‌رو تغییر داد و حالا میخوام همین فرصت رو برای نوجوانان دیگر هم فراهم کنم تا مسیرشون رو پیدا کنند و رشد کنند. این پروژه برام فراتر از یک تجربه کاری هست؛ رویایی هست که دوست دارم سال‌ها درش فعالیت کنم، چون دقیقا همون پروژه‌ای هست که همیشه می‌خواستم بخشی از زندگی و هویتم باشه."
              name="نازنین مسرور"
              title="دیزاینر"
              img={`${import.meta.env.BASE_URL}/images/nazanin-masror.jpg`}
            />
            <TestimonialCard
              quote="روبیتک توان من رو برای حمایت از بااستعدادترین شاگردانم چند برابر کرد. در این مسیر روبیتک تنها یک پلتفرم نیست، کلید ساخت آینده آن هاست."
              name="مازیار شفیعی"
              title="مدرس زبان انگلیسی"
              img={`${import.meta.env.BASE_URL}/images/maz.jpg`}
            />
          </div>
        </Container>
      </Section>

      {/* چرا روبیتک */}
      <Section id="differentiation" className="overflow-hidden bg-gradient-to-b from-white to-[var(--sky)]">
        <Container>
          <SectionHeader
            kicker="چرا روبیتک ؟"
            Icon={IconSparkles}
            title="چه چیز روبیتک رو متمایز می‌کنه ؟"
            subtitle="ترکیب شفافیت، شبکه مورداعتماد و مسیرِ پایدار، روبیتک رو به انتخابی مطمئن تبدیل می‌کنه."
          />


          <div className="mt-4 grid gap-6 md:grid-cols-4">
            <DifferentiationCard
              Icon={IconEye}
              iconClass="h-7 w-7 text-[var(--brand)]"
              title="شفافیت رادیکال"
              wrapperClass="group rounded-2xl p-6 ring-1 bg-[var(--sky)] ring-[var(--sky-ring)] transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[var(--brand)]/30"
              description="پنل شخصی شما قابلیت‌های تخصیص، تحویل و رهگیری رو داره."
            />

            <DifferentiationCard
              Icon={IconShield}
              iconClass="h-7 w-7 text-[#6D28D9]"
              title="شبکهٔ مورد اعتماد"
              wrapperClass="group rounded-2xl p-6 ring-1 bg-[var(--violet-tint)] ring-[var(--violet-ring)] transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[#6D28D9]/30"
              description="با معلمان و مدیرانِ مورد اعتماد کار می‌کنیم تا نوجوانان شایسته انتخاب بشند."
            />

            <DifferentiationCard
              Icon={IconLoop}
              iconClass="h-7 w-7 text-[#0EA5A7]"
              title="مسیرِ پایدار"
              wrapperClass="group rounded-2xl p-6 ring-1 bg-[var(--mint)] ring-[var(--mint-ring)] transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[#0EA5A7]/30"
              description="لپ‌تاپ‌ها به صورت چرخه‌ای به نفر بعدی می‌رسند. همچنین نوجوانان موفق وارد روبیکمپ میشن."
            />

            <DifferentiationCard
              Icon={IconUsers}
              iconClass="h-7 w-7 text-[#F59E0B]"
              title="اجتماع‌محور"
              wrapperClass="group rounded-2xl p-6 ring-1 bg-[var(--amber-tint)] ring-[var(--amber-ring)] transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[#F59E0B]/30"
              description="به‌دست جامعه و برایِ جامعه؛ برای پیشرفتی پایدار در ایران."
            />
          </div>


        </Container>
      </Section>

      {/* FAQ */}
      <Section id="faq" className="overflow-hidden bg-gradient-to-b from-[var(--sky)] to-white">
        <Container>
          <SectionHeader
            kicker="پرسش‌های پرتکرار"
            Icon={IconQuestion}
            title="سؤالات شما، پاسخ داده شده‌اند"
            subtitle="اگر جواب پرسش‌تان رو نمی‌بینید، برایمان بنویسید."
          />
          <div className="mt-8 grid gap-4">
            <FAQItem
              q="نوجوانان چطور انتخاب می‌شوند؟"
              a={<p>سفیران—معلمان و مدیران مورد نوجوان واجد شرایط رو بر اساس شایستگی، علاقه به فناوری و نیاز مالی معرفی می‌کنند.</p>}
            />
            <FAQItem
              q="حمایت من چه چیزهایی رو پوشش می‌دهد؟"
              a={<p>هزینهٔ یک لپ‌تاپ مقاوم، یک سال اینترنت و منابع آموزشی برگزیده. ۱۰۰٪ مبلغ تعیین‌شده صرف نوجوان می‌شود.</p>}
            />
            <FAQItem
              q="آیا پرداخت امن و قابل کسر مالیاتی است؟"
              a={<p>پرداخت‌ها از طریق ارائه‌دهندگان دارای گواهی PCI سطح ۱ انجام می‌شود. روبیتک زیر چتر یک نهاد غیرانتفاعیِ ثبت‌شده فعالیت می‌کند؛ در صورت امکان رسید رسمی صادر می‌شود.</p>}
            />
            <FAQItem
              q="امکان اهدای سخت‌افزارِ کارکرده هست؟"
              a={<p>برای تضمین کیفیت و امنیت، فعلاً دستگاه‌ها به‌صورت نو و عمده تهیه می‌شوند تا هزینهٔ هر واحد کاهش یابد.</p>}
            />
          </div>
        </Container>
      </Section>

      {/* final CTA */}
      <Section id="final-cta" className="bg-[var(--brand-strong)]">
        <Container className="text-center text-white">
          <h2 className="text-[32px] font-extrabold md:text-[38px]">
            به جنبشِ {toFa(10000)} حامیِ سالانه بپیوندید.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-bold text-[20px] leading-[1.6] opacity-90">
            یک لپ‌تاپ آغازِ راه هست: یک جامعه پشتیبان، انقلابِ واقعی‌ست.
            <br></br>
            امروز، آینده ایران رو بساز.
          </p>
          <div className="mt-8">
            <PrimaryCTA onClick={() => openModal("final")}>همین حالا همراه می‌شوم</PrimaryCTA>
          </div>
        </Container>
      </Section>


      {/* sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-4 z-40 mx-auto w-full max-w-md px-4 sm:hidden">
        <div className="rounded-xl border border-[#00D09C] bg-white p-2 shadow-xl">
          <PrimaryCTA className="w-full">همین حالا همراه می‌شوم</PrimaryCTA>
        </div>
      </div>

      <DonationModal open={open} onClose={() => setOpen(false)} />
    </main>
  );
}


// donation modal
const amounts = [50, 100, 250, 500, 1000] as const;
function DonationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState<number>(250);
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [agree, setAgree] = useState(false);

  const resolvedAmount = useMemo(
    () => (custom ? Number(toEnDigits(custom)) : amount),
    [custom, amount]
  );
  if (!open) return null;

  function goNext() {
    logEvent("donation_step_next", { step, resolvedAmount });
    setStep((s) => Math.min(3, s + 1));
  }
  function goBack() {
    setStep((s) => Math.max(1, s - 1));
  }
  function submitDonation(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    logEvent("donation_submitted", { amount: resolvedAmount, name, email, country, agree });
    alert("سپاسگزاریم! تعهد شما ثبت شد. رسید و لینک رهگیری برایتان ارسال می‌شود.");
    onClose();
  }

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#0A2540]">ثبت تعهد حمایت</h3>
          <button onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="بستن">
            ✕
          </button>
        </div>

        <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#1A1F36] opacity-80">
          <span className={`rounded-full px-2 py-1 ${step >= 1 ? "bg-[#F6F9FC] text-[#0A2540]" : "bg-slate-100"}`}>۱. مبلغ</span>
          <span>←</span>
          <span className={`rounded-full px-2 py-1 ${step >= 2 ? "bg-[#F6F9FC] text-[#0A2540]" : "bg-slate-100"}`}>۲. مشخصات</span>
          <span>←</span>
          <span className={`rounded-full px-2 py-1 ${step >= 3 ? "bg-[#F6F9FC] text-[#0A2540]" : "bg-slate-100"}`}>۳. پرداخت</span>
        </div>

        {step === 1 && (
          <div>
            <p className="mb-4 text-[18px] leading-[1.7] text-[#1A1F36] opacity-90">
              مبلغ دلخواه رو انتخاب کنید. هر تعهد بخشی از هزینهٔ لپ‌تاپ، اینترنت و منابع آموزشی رو پوشش می‌دهد.
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {amounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setAmount(amt);
                    setCustom("");
                  }}
                  className={`rounded-lg border px-3 py-3 text-sm font-semibold transition ${resolvedAmount === amt && !custom
                    ? "border-[#00D09C] bg-[#E9FBF6] text-[#0A2540]"
                    : "border-slate-200 hover:border-slate-300"
                    }`}
                >
                  {toFa(amt)}
                </button>
              ))}
              <div className="col-span-3 sm:col-span-5">
                <label className="mt-2 block text-xs font-medium text-[#1A1F36] opacity-80">
                  مبلغ دلخواه (دلار)
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500">
                    $
                  </span>
                  <input
                    inputMode="decimal"
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    placeholder="مثلاً ۲۵۰"
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-right outline-none ring-[#00D09C]/40 focus:ring-4"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-[#1A1F36] opacity-80">
                مبلغ انتخاب‌شده:{" "}
                <span className="font-semibold text-[#0A2540]">{toFa(resolvedAmount)}</span>
              </div>
              <PrimaryCTA onClick={goNext}>ادامه</PrimaryCTA>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={(e) => { e.preventDefault(); goNext(); }} className="text-right">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[#1A1F36] opacity-80">نام و نام‌خانوادگی</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-right outline-none ring-[#00D09C]/40 focus:ring-4"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1A1F36] opacity-80">ایمیل</label>
                <input
                  type="email"
                  dir="ltr"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-left outline-none ring-[#00D09C]/40 focus:ring-4"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#1A1F36] opacity-80">
                  کشور (برای رسید مالیاتی)
                </label>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-right outline-none ring-[#00D09C]/40 focus:ring-4"
                />
              </div>
              <label className="sm:col-span-2 inline-flex items-start gap-3 text-sm text-[#1A1F36] opacity-90">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                با <a href="#" className="underline">سیاست حریم خصوصی</a> موافقم و دریافت رسید رو می‌پذیرم.
              </label>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button type="button" onClick={goBack} className="text-sm text-[#1A1F36] opacity-80 hover:opacity-100">
                بازگشت
              </button>
              <PrimaryCTA onClick={goNext}>ادامه</PrimaryCTA>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={submitDonation} className="text-right">
            <div className="space-y-4">
              <div className="rounded-2xl bg-[#F6F9FC] p-4 text-sm text-[#1A1F36]">
                شما در حال ثبت تعهد به مبلغ <span className="font-bold">{toFa(resolvedAmount)}</span> به نام{" "}
                <span className="font-bold">{name || "مهمان"}</span> ({email || "ایمیل وارد نشده"}) هستید.
              </div>
              <div className="grid gap-3">
                <label className="text-xs font-medium text-[#1A1F36] opacity-80">شماره کارت</label>
                <input
                  placeholder="۴۲۴۲ ۴۲۴۲ ۴۲۴۲ ۴۲۴۲"
                  dir="ltr"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-left outline-none ring-[#00D09C]/40 focus:ring-4"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[#1A1F36] opacity-80">تاریخ انقضا</label>
                    <input
                      placeholder="MM/YY"
                      dir="ltr"
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-left outline-none ring-[#00D09C]/40 focus:ring-4"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#1A1F36] opacity-80">CVC</label>
                    <input
                      placeholder="CVC"
                      dir="ltr"
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-left outline-none ring-[#00D09C]/40 focus:ring-4"
                    />
                  </div>
                </div>
                <p className="text-xs text-[#1A1F36] opacity-70">
                  پرداخت‌ها توسط ارائه‌دهندگان سطح ۱ PCI امن پردازش می‌شود. رسید و لینک رهگیری ایمیل می‌شود.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button type="button" onClick={goBack} className="text-sm text-[#1A1F36] opacity-80 hover:opacity-100">
                بازگشت
              </button>
              <PrimaryCTA>ثبت تعهد</PrimaryCTA>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
