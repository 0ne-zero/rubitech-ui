import React from "react";
import { Container } from "@/components/ui/Container";
export function Footer() {
  return (
    <footer className="border-t">
      <Container className="py-6 text-sm text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} Rubitech</p>
        <p className="opacity-80">ساخته‌شده با عشق برای نوجوانان</p>
      </Container>
    </footer>
  );
}
