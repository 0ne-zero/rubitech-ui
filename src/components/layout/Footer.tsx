import React from "react";
import { Container } from "@/components/ui/Container";

import { toFa } from "@/utils/format";


export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#0A2540] py-6">
      <Container className="flex flex-col items-center justify-between gap-4 text-sm text-white/70 md:flex-row">
        <div>© {toFa(new Date().getFullYear())} روبیتک. کلیهٔ حقوق محفوظ است.</div>
        <div className="flex items-center gap-4">
          {/* <a href="#" className="transition hover:text-white">حریم خصوصی</a>
          <a href="#" className="transition hover:text-white">ارتباط با ما</a> */}
        </div>
      </Container>
    </footer>
  );
}
