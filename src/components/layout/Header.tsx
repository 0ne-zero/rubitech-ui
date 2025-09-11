import React from "react";
import { Container } from "@/components/ui/Container";
export function Header() {
  return (
    <>



      {/* Blue */}
      {/* <header className="sticky top-0 z-50 bg-[#0A2540] text-white shadow-md">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <span className="text-xl font-extrabold">روبیتک</span>
            <nav className="flex gap-8 font-medium">
              <button className="hover:text-[#00D09C]">خانه</button>
              <button className="hover:text-[#00D09C]">چطور</button>
              <button className="hover:text-[#00D09C]">شفافیت</button>
              <button className="hover:text-[#00D09C]">چرا روبیتک</button>
            </nav>
          </div>
        </Container>
      </header> */}

      {/* Box */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[70%] rounded-2xl bg-gradient-to-r from-[#0A2540] to-[#00D09C] text-white shadow-xl">
        <Container>
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-white text-[#0A2540] grid place-items-center rounded-md">
                R
              </div>
              <span className="font-bold text-white text-sm">روبیتک</span>
            </div>

            {/* Nav */}
            <nav className="flex gap-3">
              {[
                { label: "خانه", id: "hero" },
                { label: "چطور", id: "solution" },
                { label: "اعتماد", id: "social-proof" },
                { label: "چرا روبیتک", id: "differentiation" },
                { label: "پرسش‌های متداول", id: "faq" },
              ].map(({ label, id }) => (
                <button
                  key={id}
                  onClick={() =>
                    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="rounded-lg px-3 py-1.5 text-[15px] font-medium hover:bg-white hover:text-[#0A2540] transition-colors"
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </Container>
      </header>




      {/* Simple */}
      {/*       
      <header className="sticky top-0 z-50 bg-white/40 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#00D09C] text-white grid place-items-center">R</div>
              <span className="font-bold text-[#0A2540]">روبیتک</span>
            </div>
            <nav className="flex gap-8 text-[#0A2540] font-semibold text-[17px]">
              <button>خانه</button>
              <button>چطور</button>
              <button>شفافیت</button>
              <button>چرا روبیتک</button>
            </nav>
          </div>
        </Container>
      </header> */}



    </>











  );
}
