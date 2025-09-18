
import React from "react";
import { Stepper } from "@/components/ambassador/Stepper";
import { StatusBadge } from "@/components/ambassador/StatusBadge";
import { useAmbassadorData } from "../store";

function jalaliAge(j: string): string { if (!j) return '—'; const m = j.match(/^(\d{4})-(\d{2})-(\d{2})$/); if (!m) return '—'; const jy = parseInt(m[1], 10); const gy = jy + 621; const now = new Date().getFullYear(); const age = Math.max(0, now - gy); return String(age); }

export function PackagesPage() {
  const { profile, teenagers, setPackages } = useAmbassadorData();
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [contract, setContract] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [submitted, setSubmitted] = React.useState<{ id: string } | null>(null);

  const isVerified = profile.kyc.status === 'approved';
  const hasFive = teenagers.length >= 5;

  const issues = [
    !hasFive && 'برای ثبت درخواست باید حداقل ۵ نوجوان ثبت شده داشته باشید.',
    !isVerified && 'ابتدا احراز هویت شما باید تأیید شود.',
  ].filter(Boolean) as string[];

  const toggleSel = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : (prev.length < 5 ? [...prev, id] : prev));
  };

  const canGoNextFrom2 = selected.length === 5;

  const submit = () => {
    const id = `د-${Math.floor(100 + Math.random() * 900)}`;
    setPackages((prev: any) => [{ id, status: 'submitted', quantity: 5, teens: 5, createdAt: '۱۴۰۴/۰۶/۲۳' }, ...(prev || [])]);
    setSubmitted({ id });
  };

  const steps = ['پیش‌نیازها', 'انتخاب نوجوانان', 'بازبینی و تأیید'];

  return (
    <div className="space-y-6">
      <Stepper steps={steps} current={step - 1} />

      {step === 1 && (
        <div className="rounded-2xl border p-4 bg-white">
          <div className="text-sm font-medium mb-2">پیش‌نیازهای درخواست بسته</div>
          <ul className="list-disc pr-5 text-sm text-slate-700 space-y-1">
            <li>حداقل ۵ نوجوان ثبت‌شده در پنل سفیر</li>
            <li>احراز هویت سفیر باید <b>تأیید شده</b> باشد</li>
          </ul>

          {issues.length > 0 ? (
            <div className="mt-3 space-y-2">
              {issues.map((t, i) => (
                <div key={i} className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">{t}</div>
              ))}
              <div className="flex items-center gap-2 mt-2">
                {(!hasFive) && <a href="/ambassador/teenagers" className="rounded-xl bg-slate-900 text-white px-3 py-2 text-sm">ثبت نوجوان</a>}
                {(!isVerified) && <a href="/ambassador/profile" className="rounded-xl bg-white border border-slate-300 px-3 py-2 text-sm">تکمیل احراز هویت</a>}
              </div>
            </div>
          ) : (
            <div className="mt-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={contract} onChange={e => setContract(e.target.checked)} />
                <span>تأیید می‌کنم که قرارداد مأموریت را مطالعه و امضا کرده‌ام.</span>
              </label>
              <div className="flex items-center justify-end gap-2 mt-4">
                <button onClick={() => setStep(2)} disabled={!contract} className={`rounded-xl px-3 py-2 text-sm ${contract ? 'bg-emerald-600 text-white' : 'bg-emerald-200 text-emerald-800 cursor-not-allowed'}`}>ادامه</button>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="rounded-2xl border p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">انتخاب ۵ نوجوان برای این مأموریت</div>
            <div className="text-xs text-slate-600">انتخاب شده: {selected.length} / 5</div>
          </div>
          <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {teenagers.map(t => {
              const checked = selected.includes(t.id);
              return (
                <label key={t.id} className={`rounded-2xl border p-3 text-sm cursor-pointer ${checked ? 'border-sky-400 bg-sky-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-slate-900">{t.name}</div>
                    <input type="checkbox" checked={checked} onChange={() => toggleSel(t.id)} />
                  </div>
                  <div className="mt-1 text-xs text-slate-600">سن تقریبی: {jalaliAge(t.dob)} • استعداد: {t.talent || '—'}</div>
                  <div className="text-xs text-slate-600">مدرسه: {t.school || '—'}</div>
                </label>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-4">
            <a href="/ambassador/teenagers" className="text-sm text-sky-700 hover:underline">ثبت نوجوان جدید</a>
            <div className="flex items-center gap-2">
              <button onClick={() => setStep(1)} className="rounded-xl bg-slate-100 px-3 py-2 text-sm">بازگشت</button>
              <button onClick={() => setStep(3)} disabled={!canGoNextFrom2} className={`rounded-xl px-3 py-2 text-sm ${canGoNextFrom2 ? 'bg-emerald-600 text-white' : 'bg-emerald-200 text-emerald-800 cursor-not-allowed'}`}>بازبینی</button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="rounded-2xl border p-4 bg-white">
          <div className="text-sm font-medium mb-2">بازبینی و تأیید</div>
          <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="text-slate-800">وضعیت قرارداد</div>
              <StatusBadge label={contract ? 'امضا شده' : 'نامشخص'} tone={contract ? 'success' : 'warning'} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-medium">نوجوانان انتخاب‌شده (۵ نفر)</div>
              <button onClick={() => setStep(2)} className="text-xs text-sky-700 hover:underline">ویرایش</button>
            </div>
            <ul className="rounded-xl border border-slate-200 bg-white divide-y">
              {selected.map(id => {
                const t = teenagers.find(x => x.id === id);
                if (!t) return null;
                return (
                  <li key={id} className="p-3 text-sm flex items-center justify-between">
                    <div className="text-slate-800">{t.name}</div>
                    <div className="text-xs text-slate-600">سن تقریبی: {jalaliAge(t.dob)}</div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="flex items-center justify-end gap-2 mt-4">
            <button onClick={() => setStep(2)} className="rounded-xl bg-slate-100 px-3 py-2 text-sm">بازگشت</button>
            <button onClick={submit} className="rounded-xl bg-emerald-600 text-white px-3 py-2 text-sm">ارسال درخواست بسته</button>
          </div>
        </div>
      )}

      {submitted && (
        <div className="rounded-2xl border p-4 bg-emerald-50 border-emerald-200">
          <div className="text-sm font-medium text-emerald-900">درخواست شما با شماره {submitted.id} ثبت شد.</div>
          <div className="text-xs text-emerald-800 mt-1">وضعیت فعلی: ارسال شد. نتیجه به‌محض بررسی از طریق پیامک و ایمیل اطلاع‌رسانی می‌شود.</div>
        </div>
      )}
    </div>
  );
}
