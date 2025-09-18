import React from "react";
import { UploadCloud, X } from "lucide-react";

type FieldProps = { label: string; value: string; onChange: (v: string) => void; readOnly?: boolean; type?: string; after?: React.ReactNode; placeholder?: string; };
export function Field({ label, value, onChange, readOnly=false, type="text", after, placeholder }: FieldProps){
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-slate-600">{label}</div>
        {after}
      </div>
      <input dir="rtl" type={type} className="w-full rounded-xl border border-slate-300 bg-white/90 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-70" value={value} placeholder={placeholder} onChange={(e)=>onChange(e.target.value)} readOnly={readOnly}/>
    </label>
  );
}

type FileFieldProps = { label: string; file: File|null; onFile: (f: File|null) => void; };
export function FileField({ label, file, onFile }: FileFieldProps){
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className="block">
      <div className="text-xs text-slate-600 mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/90 px-3 py-2 text-sm">
          <UploadCloud className="w-4 h-4" /><span>{file ? "تغییر فایل" : "انتخاب فایل"}</span>
        </button>
        {file && (<span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2 py-1 text-xs"><span className="max-w-[220px] truncate">{file.name}</span><button type="button" aria-label="حذف فایل" className="p-1 rounded-full hover:bg-slate-200" onClick={() => onFile(null)}><X className="w-3 h-3" /></button></span>)}
        <input ref={inputRef} type="file" className="hidden" onChange={(e) => onFile(e.target.files?.[0] ?? null)}/>
      </div>
    </div>
  );
}

type OTPChannel = 'email'|'phone';
export function OTPModal({ open, channel, onVerified, onClose }:{ open:boolean; channel: OTPChannel|null; onVerified:(channel:OTPChannel)=>void; onClose:()=>void }){
  const [code, setCode] = React.useState<string[]>(["","","","","",""]);
  React.useEffect(()=>{ if(!open){ setCode(["","","","","",""]); } }, [open]);
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
      <div className="w-[min(420px,92vw)] rounded-2xl bg-white p-4 shadow-xl">
        <div className="font-semibold mb-2">تأیید {channel === 'email' ? 'ایمیل' : channel === 'phone' ? 'شماره موبایل' : 'کد'}</div>
        <div className="text-sm text-slate-600 mb-3">کد ۶ رقمی را وارد کنید.</div>
        <div className="flex items-center justify-center gap-2">
          {code.map((c, i)=>(
            <input key={i} value={c} onChange={(e)=>{
              const v = e.target.value.replace(/\D/g,'').slice(0,1);
              setCode(prev=>{ const n=[...prev]; n[i]=v; return n; });
            }} className="w-10 h-10 text-center rounded-lg border border-slate-300" />
          ))}
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button onClick={onClose} className="rounded-xl bg-slate-100 px-3 py-2 text-sm">انصراف</button>
          <button onClick={()=> onVerified((channel||'email'))} className="rounded-xl bg-emerald-600 text-white px-3 py-2 text-sm">تأیید</button>
        </div>
      </div>
    </div>
  );
}
