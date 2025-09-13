import React from "react";
import { Container } from "@/components/ui/Container";

import { toFa } from "@/utils/format";


// export function Footer() {
//   return (
//     <footer className="bg-gradient-to-b from-[var(--sky)] to-white">
//       <Container className="flex flex-col h-10 mb-2 items-center gap-4 text-sm text-[var(--brand)]/70 ">
//         <div>© {toFa(new Date().getFullYear())} روبیتک. کلیهٔ حقوق محفوظ است.</div>
//         <div className="flex items-center gap-4">
//           {/* <a href="#" className="transition hover:text-white">حریم خصوصی</a>
//           <a href="#" className="transition hover:text-white">ارتباط با ما</a> */}
//         </div>
//       </Container>
//     </footer>
//   );
// }

export function Footer() {
  return (
    <footer dir="rtl" className="relative">
      <div className="bg-gradient-to-r from-[#0A2540] to-[#00D09C]">
        <Container y="none" className="flex flex-col items-center gap-2 py-2 text-sm text-white/80">
          <nav className="flex flex-wrap justify-center mt-2 gap-6">
            <a href="#hero" className="transition hover:text-white">خانه</a>
            <a href="#solution" className="transition hover:text-white">چطور</a>
            <a href="#social-proof" className="transition hover:text-white">اعتماد</a>
            <a href="#differentiation" className="transition hover:text-white">چرا روبیتک</a>
            <a href="#faq" className="transition hover:text-white">پرسش‌ها</a>
          </nav>
          <div className="text-xs md:text-sm mt-1.5">
            © {toFa(new Date().getFullYear())} روبیتک — کلیهٔ حقوق محفوظ است.
          </div>
        </Container>
      </div>
    </footer>
  );
}


