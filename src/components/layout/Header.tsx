"use client";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";

export function Header() {
  const [active, setActive] = useState("hero");

  // ① Helper: scroll with offset
  const scrollToWithOffset = (id: string) => {
    const el = document.getElementById(id);
    const header = document.getElementById("site-header");
    if (!el) return;

    const headerTop = header ? parseInt(getComputedStyle(header).top || "0", 10) : 0; // tailwind top-4
    const headerH = header?.offsetHeight || 0; // tailwind h-14
    const gap = 8; // px breathing room
    const offset = headerTop + headerH + gap;

    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  // ② Active section observer (unchanged)
  useEffect(() => {
    const ids = ["hero", "solution", "social-proof", "differentiation", "faq"];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { threshold: 0.5 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <header
      id="site-header" // ← needed for measuring offset
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[70%] rounded-2xl bg-gradient-to-r from-[#0A2540] to-[#00D09C] text-white shadow-xl"
    >
      <Container>
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-white text-[#0A2540] grid place-items-center rounded-md">R</div>
            <span className="font-bold text-white text-sm">روبیتک</span>
          </div>

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
                onClick={() => scrollToWithOffset(id)}
                className={`rounded-lg px-3 py-1.5 text-[15px] font-medium transition-colors ${active === id ? "bg-white text-[#0A2540]" : "hover:bg-white hover:text-[#0A2540]"
                  }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </Container>
    </header>
  );
}
