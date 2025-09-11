import React from "react";
import { Container } from "@/components/ui/Container";
export function Header() {
  return (
    <header className="bg-white/90 backdrop-blur border-b border-[#F6F9FC] sticky top-0 z-50">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <nav className="flex gap-6 text-[20px] font-semibold text-[#0A2540]">
            <button onClick={() => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })}>خانه</button>
            <button onClick={() => document.getElementById("solution")?.scrollIntoView({ behavior: "smooth" })}>چطور</button>
            <button onClick={() => document.getElementById("transparency")?.scrollIntoView({ behavior: "smooth" })}>شفافیت</button>
            <button onClick={() => document.getElementById("differentiation")?.scrollIntoView({ behavior: "smooth" })}>چرا روبیتک</button>
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-[18px] font-extrabold text-[#0A2540]">روبیتک</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0A2540] text-white">لوگو</div>
          </div>
        </div>
      </Container>
    </header>
  );
}
