import React from "react";
import { Container } from "@/components/ui/Container";
export function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <Container className="flex items-center justify-between py-4">
        <a href="/" className="font-semibold text-lg">Rubitech</a>
        <nav aria-label="اصلی" className="hidden md:flex gap-6">
          <a href="#features" className="hover:underline">ویژگی‌ها</a>
          <a href="#impact" className="hover:underline">تاثیر</a>
          <a href="#faq" className="hover:underline">سوالات</a>
        </nav>
      </Container>
    </header>
  );
}
