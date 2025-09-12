import React, { useMemo, useState } from "react";
import { PrimaryCTA } from "../components/ui/Button";
import { toEnDigits, toFa } from "../utils/format";
import { logEvent } from "../utils/analytics";

const AMOUNTS = [50, 100, 250, 500, 1000] as const;

export function DonationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState<number>(250);
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [agree, setAgree] = useState(false);

  const resolvedAmount = useMemo(() => (custom ? Number(toEnDigits(custom)) : amount), [custom, amount]);
  if (!open) return null;

  const goNext = () => { logEvent("donation_step_next", { step, resolvedAmount }); setStep((s) => Math.min(3, s + 1)); };
  const goBack = () => setStep((s) => Math.max(1, s - 1));
  const submitDonation: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    logEvent("donation_submitted", { amount: resolvedAmount, name, email, country, agree });
    alert("سپاسگزاریم! تعهد شما ثبت شد. رسید و لینک رهگیری برایتان ارسال می‌شود.");
    onClose();
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#0A2540]">ثبت تعهد حمایت</h3>
          <button onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="بستن">✕</button>
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
              {AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  onClick={() => { setAmount(amt); setCustom(""); }}
                  className={`rounded-lg border px-3 py-3 text-sm font-semibold transition ${resolvedAmount === amt && !custom ? "border-[#00D09C] bg-[#E9FBF6] text-[#0A2540]" : "border-slate-200 hover:border-slate-300"}`}
                >
                  {toFa(amt)}
                </button>
              ))}
              <div className="col-span-3 sm:col-span-5">
                <label className="mt-2 block text-xs font-medium text-[#1A1F36] opacity-80">مبلغ دلخواه (دلار)</label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500">$</span>
                  <input inputMode="decimal" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="مثلاً ۲۵۰" className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-right outline-none ring-[#00D09C]/40 focus:ring-4" />
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-[#1A1F36] opacity-80">مبلغ انتخاب‌شده: <span className="font-semibold text-[#0A2540]">{toFa(resolvedAmount)}</span></div>
              <PrimaryCTA onClick={goNext}>ادامه</PrimaryCTA>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={(e) => { e.preventDefault(); goNext(); }} className="text-right">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[#1A1F36] opacity-80">نام و نام‌خانوادگی</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-right outline-none ring-[#00D09C]/40 focus:ring-4" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1A1F36] opacity-80">ایمیل</label>
                <input type="email" dir="ltr" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-left outline-none ring-[#00D09C]/40 focus:ring-4" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#1A1F36] opacity-80">کشور (برای رسید مالیاتی)</label>
                <input value={country} onChange={(e) => setCountry(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-right outline-none ring-[#00D09C]/40 focus:ring-4" />
              </div>
              <label className="sm:col-span-2 inline-flex items-start gap-3 text-sm text-[#1A1F36] opacity-90">
                <input type="checkbox" className="mt-1" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                با <a href="#" className="underline">سیاست حریم خصوصی</a> موافقم و دریافت رسید رو می‌پذیرم.
              </label>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button type="button" onClick={goBack} className="text-sm text-[#1A1F36] opacity-80 hover:opacity-100">بازگشت</button>
              <PrimaryCTA onClick={goNext}>ادامه</PrimaryCTA>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={submitDonation} className="text-right">
            <div className="space-y-4">
              <div className="rounded-2xl bg-[#F6F9FC] p-4 text-sm text-[#1A1F36]">
                شما در حال ثبت تعهد به مبلغ <span className="font-bold">{toFa(resolvedAmount)}</span> به نام <span className="font-bold">{name || "مهمان"}</span> ({email || "ایمیل وارد نشده"}) هستید.
              </div>
              <div className="grid gap-3">
                <label className="text-xs font-medium text-[#1A1F36] opacity-80">شماره کارت</label>
                <input placeholder="۴۲۴۲ ۴۲۴۲ ۴۲۴۲ ۴۲۴۲" dir="ltr" className="rounded-lg border border-slate-200 px-3 py-2 text-left outline-none ring-[#00D09C]/40 focus:ring-4" />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[#1A1F36] opacity-80">تاریخ انقضا</label>
                    <input placeholder="MM/YY" dir="ltr" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-left outline-none ring-[#00D09C]/40 focus:ring-4" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#1A1F36] opacity-80">CVC</label>
                    <input placeholder="CVC" dir="ltr" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-left outline-none ring-[#00D09C]/40 focus:ring-4" />
                  </div>
                </div>
                <p className="text-xs text-[#1A1F36] opacity-70">پرداخت‌ها توسط ارائه‌دهندگان سطح ۱ PCI امن پردازش می‌شود. رسید و لینک رهگیری ایمیل می‌شود.</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button type="button" onClick={goBack} className="text-sm text-[#1A1F36] opacity-80 hover:opacity-100">بازگشت</button>
              <PrimaryCTA>ثبت تعهد</PrimaryCTA>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
