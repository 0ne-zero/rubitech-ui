import React, { useState } from "react";
import { Section, Container } from "../components/ui/Section";
import { SectionHeader, IconBadge } from "../components/ui/SectionHeader";
import { SectionDivider } from "../components/ui/SectionDivider";
import { CTAButton } from "../components/ui/Button";
import { ImpactStat } from "../components/cards/ImpactStat";
import { TestimonialCard } from "../components/cards/TestimonialCard";
import { DifferentiationCard } from "../components/cards/DifferentiationCard";
import { FlowStep } from "../components/flow/FlowStep";
import { FAQItem } from "../components/ui/FAQItem";
import { PartnerCard } from "../components/cards/PartnerCard";
import { partners } from "../data/partners";
import { testimonials } from "../data/testimonials";
import { toFa } from "../utils/format";
import { logEvent } from "../utils/analytics";
import { DonationModal } from "../widgets/DonationModal"
import { site } from "../config/site"
import {
  IconUsers, IconLaptop, IconShield, IconGlobe, IconNodePath, IconSparkles,
  IconStampOfApproval, IconEye, IconLoop, IconQuestion, IconHeartHand,
  IconBuilding, IconUserGroup, LogoGlyphIcon
} from "../icons";



export default function RubitechLandingPageFA() {
  // const [open, setOpen] = useState(false);
  // const openModal = (location: string) => { logEvent("cta_click", { location }); setOpen(true); };

  return (
    <main dir="rtl" lang="fa" style={{ fontFamily: 'IRANYekanX, IRANYekanX FaNum, -apple-system, "Segoe UI", Roboto, Arial, sans-serif' }}>
      {/* hero */}
      <Section id="hero" className="overflow-hidden bg-gradient-to-b from-[var(--sky)] to-white">
        <Container>
          <div className="grid items-center gap-6 md:gap-10 md:grid-cols-2 mt-4 md:mt-[100px]">
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
                با هم آینده ایران رو می‌سازیم!
              </h1>
              <h1 className="text-[30px] font-extrabold leading-[1.9] text-[#0A2540] md:text-[32px]">
                هر لپ‌تاپ، یک مدرسه هوشمند
              </h1>
              <p className="mt-4 font-medium text-[20px] leading-[1.7] text-[var(--brand)]">
                ایران آینده‌ای روشن‌تر می‌خواد، این آینده به دست نوجوانانش ساخته می‌شه؛ نوجوانانی که سرمایه و سازندگان واقعی ایران‌اند.
              </p>
              <p className="font-medium text-[20px]">
                روبیتک اینجاست تا اثرگذاری شما رو به فرصتی روشن برای نوجوانان فردای ایران تبدیل کنه.
              </p>


              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <CTAButton
                  href={site.paypalUrl}
                  className="w-full sm:w-auto flex-[1.4] text-center whitespace-nowrap py-5 text-[20px]" // 👈 no wrap + bigger
                  colorClass="bg-[var(--green)] hover:bg-[var(--green-strong)] ring-[var(--green)]/35"
                  iconLeft={<IconHeartHand className="h-7 w-7" />}
                  ariaLabel="ساخت مدرسه"
                >
                  ساخت مدرسه
                </CTAButton>

                <CTAButton
                  href={site.ambassadorRegistrationUrl}
                  className="w-full sm:w-auto flex-1 text-center whitespace-nowrap"
                  colorClass="bg-[var(--violet)] hover:bg-[var(--violet-strong)] ring-[var(--violet)]/35"
                  iconLeft={<IconShield className="h-7 w-7" />}
                  ariaLabel="ثبت‌نام سفیر"
                >
                  ثبت‌نام سفیر
                </CTAButton>

                <CTAButton
                  href={site.teenagerRegistrationUrl}
                  className="w-full sm:w-auto flex-1 text-center whitespace-nowrap"
                  colorClass="bg-[var(--amber)] hover:bg-[var(--amber-strong)] ring-[var(--amber)]/35"
                  iconLeft={<IconUsers className="h-7 w-7" />}
                  ariaLabel="ثبت‌نام نوجوان"
                >
                  ثبت‌نام نوجوان
                </CTAButton>
              </div>



            </div>
          </div>
          <div className="mt-16 mb-2 backdrop-blur-sm">
            <Container y="none">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ImpactStat value={`${toFa(134)}+`} label="نوجوانان تحت ثاثیر" Icon={IconUsers} bgColor="bg-[var(--mint-ring)]" iconColor="text-[var(--brand)]" />
                <ImpactStat value={`${toFa(113)}+`} label="مدرسه تامین شده" Icon={IconLaptop} bgColor="bg-[var(--sky-ring)]" iconColor="text-[var(--brand)]" />
                <ImpactStat value={toFa(35)} label="سفیر فعال" Icon={IconShield} bgColor="bg-[var(--violet-ring)]" iconColor="text-[#6D28D9]" />
                {/* <ImpactStat value={toFa(4)} label="استان تحت پوشش" Icon={IconGlobe} bgColor="bg-[var(--amber-ring)]" iconColor="text-[#0EA5A7]" /> */}
                <ImpactStat value={toFa(128)} label="حامیان فعال" Icon={IconStampOfApproval} bgColor="bg-[var(--amber-ring)]" iconColor="text-[#0EA5A7]" />
              </div>
            </Container>
          </div>
        </Container>
        <SectionDivider />
      </Section>

      {/* چطور */}
      <Section id="solution" className="overflow-hidden bg-gradient-to-b from-white to-[var(--sky)]">
        <Container>
          <SectionHeader
            kicker="چطور"
            Icon={IconNodePath}
            title="مسیر کامل تاثیر شما"
            subtitle="ما یک اکوسیستم شفاف و قابل‌اعتماد طراحی کردیم که اثرگذاری شما رو به فرصتی پایدار برای آینده یک نوجوان تبدیل می‌کنه. این همیاری در ۵ مرحله اتفاق میوفته:"
          />

          <div className="relative mt-10 flex flex-col gap-6 md:gap-5 md:gap-0">
            <div className="absolute right-1/2 top-0 hidden h-full w-0.5 translate-x-1/2 bg-slate-200/80 md:block" />

            <FlowStep
              number="۱"
              title="شما زنجیره رو آغاز می‌کنید"
              description="حمایت/لپ‌تاپ شما به شکلی شفاف و امن، اولین حلقه زنجیره آینده‌سازی رو می‌سازه."
              IconComponent={IconHeartHand}
              isOdd={true}
              boxBgColor="bg-[var(--rose-ring)]"
              iconBgColor="bg-white/50"
              stepColor="text-[var(--rose-step)]"
            />

            <FlowStep
              number="۲"
              title="روبیتک شفافیت رو تضمین می‌کنه"
              description="روبیتک هر لپ‌تاپ رو ثبت و قابل رهگیری می‌کنه، در نهایت تحویل سفیرهاش می‌ده."
              IconComponent={(props) => <LogoGlyphIcon {...props} scale={2} />}
              isOdd={false}
              boxBgColor="bg-[var(--violet-tint)]"
              iconBgColor="bg-white/50"
              stepColor="text-[var(--violet-step)]"
            />

            <FlowStep
              number="۳"
              title="سفیر معتمد و متعهد ما لپ‌تاپ رو تحویل می‌ده"
              description="معلم‌ها و مدیران (سفیران ما) لپ‌تاپ رو به دست نوجوان مستعد می‌رسونند."
              IconComponent={IconShield}
              isOdd={true}
              boxBgColor="bg-[var(--amber-tint)]"
              iconBgColor="bg-white/50"
              stepColor="text-[var(--amber-step)]"
            />

            <FlowStep
              number="۴"
              title="یک آینده ساخته می‌شه"
              description="نوجوان مستعد بستر مناسب برای رشد، ساخت و تغییر آینده خودش و ایران رو داره."
              IconComponent={IconUsers}
              isOdd={false}
              boxBgColor="bg-[var(--lime-tint)]"
              iconBgColor="bg-white/50"
              stepColor="text-[var(--lime-step)]"
            />

            <FlowStep
              number="۵"
              title="فرصت بورسیه روبیکمپ"
              // description="نوجوان موفق بورسیه کامل مدرسه رهبری روبیکمپ رو دریافت می‌کنه."
              description="نوجوانی که با موفقیت مسیر رشد خودش رو پشت سر گذاشته، بورسیه کامل مدرسه رهبری روبیکمپ رو دریافت می‌کنه!"
              IconComponent={IconSparkles}
              isOdd={true}
              boxBgColor="bg-[var(--mint-ring)]"
              iconBgColor="bg-white/50"
              stepColor="text-[var(--mint-step)]"
            />
          </div>
        </Container>
        <SectionDivider />
      </Section>

      {/* اعتماد */}
      <Section id="social-proof" className="overflow-hidden bg-gradient-to-b from-[var(--sky)] to-white">
        <Container >
          <SectionHeader
            kicker="اعتماد"
            Icon={IconStampOfApproval}
            title="جنبشی که می‌تونید بهش تکیه کنید"
            subtitle="از اعتماد فردی تا مسئولیت اجتماعی شرکت‌ها، همه در کنار هم برای ساخت آینده ایران."
          />

          <div className="mt-10">



            <div className="mb-5 flex items-center justify-between">
              <IconBadge
                kicker="سازمان‌های آینده‌ساز"
                Icon={IconBuilding}
                size="sm"
              />

              {/* <a
                href="#"
                className="hidden text-sm font-bold text-[var(--brand)] underline-offset-4 hover:underline md:inline"
                onClick={() => logEvent("partners_view_all")}
              >
                مشاهدهٔ همه
              </a> */}
            </div>

            {/* Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {partners.map((p) => (
                <PartnerCard key={p.name} logoUrl={p.logoUrl} name={p.name} description={p.description} url={p.url} />
              ))}
            </div>

          </div>

          <div className="mt-10">
            <div className="mb-5 flex items-center justify-between">
              <IconBadge
                kicker="افراد آینده‌ساز"
                Icon={IconUserGroup}
                size="sm"
              />

              {/* <a
                href="#"
                className="hidden text-sm font-bold text-[var(--brand)] underline-offset-4 hover:underline md:inline"
                onClick={() => logEvent("partners_view_all")}
              >
                مشاهدهٔ همه
              </a> */}
            </div>


            <div className=" grid gap-6 md:grid-cols-2">
              {testimonials.map((t) => (
                <TestimonialCard key={t.name} {...t} />
              ))}
            </div>
          </div>
        </Container>
        <SectionDivider />
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

          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <DifferentiationCard
              Icon={IconLoop}
              iconClass="ه-7 w-7 text-[#0EA5A7]"
              title="مسیرِ پایدار"
              wrapperClass="group rounded-2xl p-6 ring-1 bg-[var(--mint-ring)] ring-[var(--mint-ring)] transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[#0EA5A7]/30"
              description="لپ‌تاپ‌ها به صورت چرخه‌ای به نفر بعدی می‌رسند. همچنین نوجوانان موفق وارد روبیکمپ میشن."
            />
            <DifferentiationCard
              Icon={IconEye}
              iconClass="h-7 w-7 text-[var(--brand)]"
              title="شفافیت رادیکال"
              wrapperClass="group rounded-2xl p-6 ring-1 bg-[var(--sky-ring)] ring-[var(--sky-ring)] transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[var(--brand)]/30"
              description="پنل شخصی شما قابلیت‌های تخصیص، تحویل و رهگیری مدرسه(لپ‌تاپ)ها رو داره."
            />

            <DifferentiationCard
              Icon={IconShield}
              iconClass="h-7 w-7 text-[#6D28D9]"
              title="شبکهٔ مورد اعتماد"
              wrapperClass="group rounded-2xl p-6 ring-1 bg-[var(--violet-ring)] ring-[var(--violet-ring)] transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[#6D28D9]/30"
              description="با معلمان و مدیرانِ مورد اعتماد کار می‌کنیم تا نوجوانان مستعد انتخاب بشن."
            />
            <DifferentiationCard
              Icon={IconUsers}
              iconClass="h-7 w-7 text-[#F59E0B]"
              title="اجتماع‌محور"
              wrapperClass="group rounded-2xl p-6 ring-1 bg-[var(--amber-ring)] ring-[var(--amber-ring)] transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[#F59E0B]/30"
              description="به‌دست جامعه و برایِ جامعه؛ برای پیشرفتی پایدار در ایران."
            />

          </div>
        </Container>
        <SectionDivider />
      </Section>

      {/* FAQ */}
      <Section id="faq" className="overflow-hidden bg-gradient-to-b from-[var(--sky)] to-white mb-8">
        <Container>
          <SectionHeader
            kicker="پرسش‌های پرتکرار"
            Icon={IconQuestion}
            title="سوالات شما، پاسخ‌های ما"
            subtitle="اگر جواب سوال‌تون رو نمی‌بینید، بهمون اطلاع بدید."
          />
          <div className="mt-8 grid gap-4">
            <FAQItem
              q="نوجوانان چطور انتخاب می‌شوند؟"
              a={<p>سفیران—معلمان و مدیران مورد نوجوان واجد شرایط رو بر اساس شایستگی، علاقه به فناوری و نیاز مالی معرفی می‌کنند.</p>}
            />
            <FAQItem
              q="حمایت من چه چیزهایی رو پوشش می‌دهد؟"
              a={<p>هزینهٔ یک لپ‌تاپ مقاوم، یک سال اینترنت و منابع آموزشی برگزیده. ۱۰۰٪ مبلغ تعیین‌شده صرف نوجوان می‌شه.</p>}
            />
            <FAQItem
              q="امکان اهدای سخت‌افزارِ کارکرده هست؟"
              a={<p>برای تضمین کیفیت و امنیت، فعلاً دستگاه‌ها به‌صورت نو و عمده تهیه می‌شوند.</p>}
            />
          </div>
        </Container>
      </Section>








      <Section id="final-cta" className="relative overflow-hidden bg-gradient-to-b from-white to-[var(--sky)]">
        <div className="absolute inset-0 opacity-60"
          style={{ backgroundImage: "radial-gradient(1px 1px at 20% 30%, rgba(14,165,167,.35) 1px, transparent 1px), radial-gradient(1px 1px at 80% 70%, rgba(109,40,217,.25) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <Container className="relative">
          <div
            className="mx-auto max-w-5xl rounded-3xl border border-white/40 p-8 backdrop-blur-xl ring-1 ring-slate-300/60 shadow-2xl relative overflow-hidden"
            style={{
              background:
                "linear-gradient(90deg, rgba(14,165,167,0.08), rgba(255,255,255,0.70) 35%, rgba(255,255,255,0.70) 65%, rgba(109,40,217,0.08))",
            }}
          >

            {/* Do not remove this */}
            {/* <div
            className="mx-auto relative max-w-3xl rounded-3xl p-8 shadow-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.70)",
              backdropFilter: "blur(28px)",
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(80% 120% at 50% 0%, rgba(14,165,167,0.30), transparent), radial-gradient(120% 100% at 50% 100%, rgba(109,40,217,0.25), transparent)",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0 rounded-3xl opacity-25"
              style={{
                boxShadow: "0 0 80px rgba(245,158,11,0.35) inset",
              }}
            /> */}






            <h2 className="text-center text-[28px] md:text-[36px] font-extrabold text-[#0A2540]">
              به جنبش {toFa(10000)} مدرسه سالانه بپیوند
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-[18px] md:text-[20px] leading-[1.7] text-[var(--text-weak)]">
              یک لپ‌تاپ آغازِ راه هست: یک جامعه پشتیبان، انقلاب واقعی‌ست!
              <br />امروز، آینده ایران رو بساز.
            </p>
            <div className="mt-8 flex justify-center flex-col gap-4 sm:flex-row">
              <CTAButton
                href={site.paypalUrl}
                className="w-full sm:w-auto text-center whitespace-nowrap text-[20px]" // 👈 no wrap + bigger
                colorClass="bg-[var(--green)] hover:bg-[var(--green-strong)] ring-[var(--green)]/35"
                iconLeft={<IconHeartHand className="h-7 w-7" />}
                ariaLabel="ساخت مدرسه"
              >
                ساخت مدرسه
              </CTAButton>
              <CTAButton
                href={site.ambassadorRegistrationUrl}
                className="w-full sm:w-auto text-center whitespace-nowrap"
                colorClass="bg-[var(--violet)] hover:bg-[var(--violet-strong)] ring-[var(--violet)]/35"
                iconLeft={<IconShield className="h-7 w-7" />}
                ariaLabel="ثبت‌نام سفیر"
              >
                ثبت‌نام سفیر
              </CTAButton>

              <CTAButton
                href={site.teenagerRegistrationUrl}
                className="w-full sm:w-auto text-center whitespace-nowrap"
                colorClass="bg-[var(--amber)] hover:bg-[var(--amber-strong)] ring-[var(--amber)]/35"
                iconLeft={<IconUsers className="h-7 w-7" />}
                ariaLabel="ثبت‌نام نوجوان"
              >
                ثبت‌نام نوجوان
              </CTAButton>
            </div>


            <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {[
                ["۱", "آغاز شما", "bg-[var(--rose-ring)]", "text-[var(--rose-step)]"],
                ["۲", "روبیتک", "bg-[var(--violet-tint)]", "text-[var(--violet-step)]"],
                ["۳", "دریافت نوجوان", "bg-[var(--amber-tint)]", "text-[var(--amber-step)]"],
                ["۴", "ساخت آینده", "bg-[var(--lime-tint)]", "text-[var(--lime-step)]"],
                ["۵", "بورسیه روبیکمپ", "bg-[var(--mint-ring)]", "text-[var(--mint-step)]"],
              ].map(([n, t, bg, tc], i) => (
                <div
                  key={n}
                  // FIX 1: The col-span logic is now correctly scoped to mobile only
                  className={`flex w-full items-center rounded-full px-4 py-2 ring-1 ring-slate-200/70 ${bg} ${i === 4 ? "col-span-2 sm:col-span-1 justify-center" : ""
                    }`}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-[15px] font-extrabold text-[#0A2540]">
                    {n}
                  </span>
                  <span
                    className={`mr-2 text-[1۵px] font-bold leading-none sm:text-[14px] md:text-[16px] ${tc}`}
                  >
                    {t}
                  </span>
                </div>
              ))}
            </div>








            {/* Flow Recap — Beads */}
            {/* <div className="mt-7">
              <div className="relative mx-auto max-w-2xl">
                <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-l from-[var(--mint-step)] via-[var(--violet-step)] to-[var(--rose-step)] opacity-70" />
                <div className="relative z-10 grid grid-cols-5">
                  {[
                    ["۱", "آغاز شما", "bg-white text-[#0A2540] ring-[var(--rose-step)]"],
                    ["۲", "شفافیت روبیتک", "bg-white text-[#0A2540] ring-[var(--violet-step)]"],
                    ["۳", "تحویل به نوجوان", "bg-white text-[#0A2540] ring-[var(--amber-step)]"],
                    ["۴", "ساخت آینده", "bg-white text-[#0A2540] ring-[var(--lime-step)]"],
                    ["۵", "بورسیه روبیکمپ", "bg-white text-[#0A2540] ring-[var(--mint-step)]"],
                  ].map(([n, t, cls]) => (
                    <div key={n} className="flex flex-col items-center gap-2">
                      <span className={`grid h-8 w-8 place-items-center rounded-full ring-2 ${cls} text-xs font-extrabold`}>{n}</span>
                      <span className="text-[11px] text-[var(--text-weak)]">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div> */}


            {/* Sponsors — Logo Row */}
            {/* <div className="mt-6">

              <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7">
                {(partners?.slice?.(0, 6) ?? []).map((p) => (
                  <a
                    key={p.name}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-80 hover:opacity-100 transition"
                    aria-label={p.name}
                    title={p.name}
                  >
                    <img
                      src={p.logoUrl}
                      alt={p.name}
                      loading="lazy"
                      className="h-7 sm:h-8 object-contain  hover:grayscale-0"
                    />
                  </a>
                ))}
                
                {(!partners || partners.length === 0) && (
                  <div className="text-[12px] text-[var(--text-weak)]">— به‌زودی —</div>
                )}
              </div>
            </div> */}



          </div>



        </Container>
      </Section>










      {/* sticky mobile CTA */}
      {/* <div className="fixed inset-x-0 bottom-4 z-40 mx-auto w-full max-w-md px-4 sm:hidden">
        <div className="rounded-xl border border-[#00D09C] bg-white p-2 shadow-xl">
          <PrimaryCTA href={site.paypalUrl} className="w-full">همین حالا همراه می‌شوم</PrimaryCTA>
        </div>
      </div> */}


    </main >
  );
}
