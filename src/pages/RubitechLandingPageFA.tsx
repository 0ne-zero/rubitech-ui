import React, { useState } from "react";
import { Section, Container } from "../components/ui/Section";
import { SectionHeader, IconBadge } from "../components/ui/SectionHeader";
import { SectionDivider } from "../components/ui/SectionDivider";
import { PrimaryCTA } from "../components/ui/Button";
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
  IconStampOfApproval, IconRubitechPlatform, IconEye, IconLoop, IconQuestion, IconHeartHand,
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
                با هم آینده ایران رو می‌سازیم
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
                <PrimaryCTA href={site.paypalUrl} className="w-full sm:w-auto">
                  همین حالا همراه می‌شوم
                </PrimaryCTA>
              </div>
            </div>
          </div>
          <div className="mt-16 mb-2 backdrop-blur-sm">
            <Container y="none">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ImpactStat value={`${toFa(134)}+`} label="نوجوانان تحت ثاثیر" Icon={IconUsers} bgColor="bg-[var(--mint-ring)]" iconColor="text-[var(--brand)]" />
                <ImpactStat value={`${toFa(113)}+`} label="مدرسه تامین شده" Icon={IconLaptop} bgColor="bg-[var(--sky-ring)]" iconColor="text-[var(--brand)]" />
                <ImpactStat value={toFa(35)} label="سفیر فعال" Icon={IconShield} bgColor="bg-[var(--violet-ring)]" iconColor="text-[#6D28D9]" />
                <ImpactStat value={toFa(4)} label="استان تحت پوشش" Icon={IconGlobe} bgColor="bg-[var(--amber-ring)]" iconColor="text-[#0EA5A7]" />
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
            title="مسیر کامل حمایت شما"
            subtitle="ما یک اکوسیستم کامل طراحی کرده‌ایم که کمک شما رو به فرصتی پایدار برای آینده یک نوجوان تبدیل می‌کند. این مسیر ۵ مرحله‌ست:"
          />

          <div className="relative mt-10 flex flex-col gap-6 md:gap-5 md:gap-0">
            <div className="absolute right-1/2 top-0 hidden h-full w-0.5 translate-x-1/2 bg-slate-200/80 md:block" />

            <FlowStep
              number="۱"
              title="شما زنجیره رو آغاز می‌کنید"
              description="حمایت شما به شکلی شفاف و امن، اولین حلقه زنجیره آینده‌سازی رو می‌سازه."
              IconComponent={IconHeartHand}
              isOdd={true}
              boxBgColor="bg-[var(--rose-ring)]"
              iconBgColor="bg-white/50"
              stepColor="text-[var(--rose-step)]"
            />

            <FlowStep
              number="۲"
              title="روبیتک شفافیت رو تضمین می‌کند"
              description="روبیتک هر حمایت رو ثبت می‌کنه، تحویل سفیرهاش می‌ده و قابل رهگیری می‌کنه."
              IconComponent={(props) => <LogoGlyphIcon {...props} scale={2} />}
              isOdd={false}
              boxBgColor="bg-[var(--violet-tint)]"
              iconBgColor="bg-white/50"
              stepColor="text-[var(--violet-step)]"
            />

            <FlowStep
              number="۳"
              title="سفیر معتمد و متعهد ما حمایت رو تحویل می‌ده"
              description="معلمان و مدیران (سفیران ما) لپ‌تاپ رو به دست نوجوان شایسته می‌رسونند."
              IconComponent={IconShield}
              isOdd={true}
              boxBgColor="bg-[var(--amber-tint)]"
              iconBgColor="bg-white/50"
              stepColor="text-[var(--amber-step)]"
            />

            <FlowStep
              number="۴"
              title="یک آینده ساخته می‌شود"
              description="نوجوان بااستعداد ابزار لازم برای یادگیری، ساختن و تغییر آینده خودش و جامعه رو به دست میاره."
              IconComponent={IconUsers}
              isOdd={false}
              boxBgColor="bg-[var(--lime-tint)]"
              iconBgColor="bg-white/50"
              stepColor="text-[var(--lime-step)]"
            />

            <FlowStep
              number="۵"
              title="فرصت بورسیه روبیکمپ"
              description="نوجوانان موفق، بورسیه کامل مدرسه رهبری روبیکمپ رو دریافت می‌کنند."
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
            title="جنبشی که می‌توانید به آن تکیه کنید"
            subtitle="از اعتماد فردی تا مسئولیت اجتماعی شرکت‌ها، همه در کنار هم برای ساخت آینده."
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
              wrapperClass="group rounded-2xl p-6 ring-1 bg-[var(--mint)] ring-[var(--mint-ring)] transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[#0EA5A7]/30"
              description="لپ‌تاپ‌ها به صورت چرخه‌ای به نفر بعدی می‌رسند. همچنین نوجوانان موفق وارد روبیکمپ میشن."
            />
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
              Icon={IconUsers}
              iconClass="h-7 w-7 text-[#F59E0B]"
              title="اجتماع‌محور"
              wrapperClass="group rounded-2xl p-6 ring-1 bg-[var(--amber-tint)] ring-[var(--amber-ring)] transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[#F59E0B]/30"
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
              q="امکان اهدای سخت‌افزارِ کارکرده هست؟"
              a={<p>برای تضمین کیفیت و امنیت، فعلاً دستگاه‌ها به‌صورت نو و عمده تهیه می‌شوند.</p>}
            />
          </div>
        </Container>
      </Section>

      {/* final CTA */}
      <Section id="final-cta" className="bg-[var(--brand-strong)]">
        <Container className="text-center text-white" y="lg">
          <h2 className="text-[32px] font-extrabold md:text-[38px]">
            به جنبش {toFa(10000)} مدرسه سالانه بپیوند
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-bold text-[20px] leading-[1.6] opacity-90">
            یک لپ‌تاپ آغازِ راه هست: یک جامعه پشتیبان، انقلاب واقعی‌ست!
            <br></br>
            امروز، آینده ایران رو بساز.
          </p>
          <div className="mt-12">
            <PrimaryCTA href={site.paypalUrl}>همین حالا همراه می‌شوم</PrimaryCTA>
          </div>
        </Container>
      </Section>

      {/* sticky mobile CTA */}
      {/* <div className="fixed inset-x-0 bottom-4 z-40 mx-auto w-full max-w-md px-4 sm:hidden">
        <div className="rounded-xl border border-[#00D09C] bg-white p-2 shadow-xl">
          <PrimaryCTA href={site.paypalUrl} className="w-full">همین حالا همراه می‌شوم</PrimaryCTA>
        </div>
      </div> */}


    </main>
  );
}
