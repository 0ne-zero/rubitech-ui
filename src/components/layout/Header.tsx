"use client";
import React, { useEffect, useRef, useState } from "react";
import { HeaderContainer } from "@/components/ui/Container";
import { BrandLogo } from "../ui/BrandLogo";

type NavItem = { id: string; label: string; onClick?: () => void };

export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("hero");

  const firstFocusable = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  // Measure fixed header height (used for spacer and observer)
  const headerRef = useRef<HTMLElement | null>(null);
  const [headerH, setHeaderH] = useState(0);

  useEffect(() => {
    if (!headerRef.current) return;
    const el = headerRef.current;
    const measure = () => setHeaderH(el.offsetHeight || 0);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, []);

  // ——— Accessibility: focus trap + ESC to close, body scroll lock ———
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && open && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll<
          HTMLButtonElement | HTMLAnchorElement | HTMLInputElement
        >('a[href], button:not([disabled]), input:not([disabled]), [tabindex="0"]');
        if (!focusables.length) return;
        const first = focusables[0] as HTMLElement;
        const last = focusables[focusables.length - 1] as HTMLElement;
        const activeEl = document.activeElement as HTMLElement;
        if (e.shiftKey && activeEl === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && activeEl === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);

    const body = document.body;
    const prev = body.style.overflow;
    if (open) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = prev || "auto";
    }

    if (open && firstFocusable.current) firstFocusable.current.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.overflow = prev || "auto"; // always restore
    };
  }, [open]);

  // —— Use your real nav items (copy unchanged) ——
  const navItems: NavItem[] = [
    { id: "hero", label: "آغاز" },
    { id: "solution", label: "روش کار" },
    { id: "social-proof", label: "شفافیت" },
    { id: "differentiation", label: "چرا روبیتک" },
    { id: "faq", label: "راهنما" },
  ];

  // Scroll with offset (fixed header + small gap)
  const scrollToWithOffset = (id: string) => {
    const el = document.getElementById(id);
    const header = document.getElementById("site-header");
    if (!el) return;
    const topVal = header ? getComputedStyle(header).top : "0px";
    const parsedTop = parseInt(topVal, 10);
    const headerTop = Number.isNaN(parsedTop) ? 0 : parsedTop;
    const headerHeight = header?.offsetHeight || headerH || 0;
    const gap = 8;
    const offset = headerTop + headerHeight + gap;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    setActive(id); // immediate visual feedback
    window.scrollTo({ top: y, behavior: "smooth" });
    setOpen(false);
  };

  // ——— Active section observer (desktop + mobile) ———
  useEffect(() => {
    const ids = navItems.map((n) => n.id);

    const topOffset = (headerH || 0) + 8; // shift observer line just below header
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        root: null,
        threshold: 0.25,                  // lower = shorter sections activate properly
        rootMargin: `-${topOffset}px 0px -40% 0px`,
        // -topOffset: header height, -40% bottom margin helps next section take over earlier
      }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [headerH]);


  const mobileBottomMarginPx = 16;

  return (
    <>
      <header
        ref={headerRef}
        id="site-header"
        className="
          fixed inset-x-0 top-4 z-50
          px-3 pt-[env(safe-area-inset-top)] sm:px-4
          md:top-4 md:left-1/2 md:-translate-x-1/2 md:inset-x-auto md:w-[70%]
        "
      >


        <div className="rounded-xl md:rounded-2xl bg-gradient-to-r from-[#0A2540] to-[#00D09C] text-white shadow-xl">
          <HeaderContainer>
            {/* —— Mobile Bar (<md) —— */}
            <div className="flex h-14 items-center justify-between md:hidden">
              <a href="/" aria-label="Rubitech Home" className="flex items-center gap-2">
                <BrandLogo size="sm" alt="" scale={1.3} priority />
                <span className="font-bold mr-0.5 text-white text-normal">روبیتک</span>
              </a>

              {/* Hamburger */}
              <button
                ref={firstFocusable}
                aria-label="Toggle navigation"
                aria-expanded={open}
                aria-controls="mobile-drawer"
                onClick={() => setOpen(true)}
                className="inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-white/70"
              >
                <span className="sr-only">Open menu</span>
                <div className="space-y-1.5">
                  <span className="block h-0.5 w-6 bg-white rounded" />
                  <span className="block h-0.5 w-6 bg-white rounded" />
                  <span className="block h-0.5 w-6 bg-white rounded" />
                </div>
              </button>
            </div>

            {/* —— Desktop (md+) — unchanged markup, now with active styles —— */}
            <DesktopNav>
              <div className="flex h-16 items-center justify-between">
                <a href="/" aria-label="Rubitech Home" className="flex items-center gap-2">
                  <BrandLogo size="md" alt="" scale={1.3} />
                  <span className="font-bold mr-1 text-white text-lg">روبیتک</span>
                </a>


                <nav className="flex gap-3" aria-label="Primary">
                  {navItems.map(({ id, label }) => {
                    const isActive = active === id;
                    return (
                      <button
                        key={id}
                        onClick={() => scrollToWithOffset(id)}
                        aria-current={isActive ? "page" : undefined}
                        className={[
                          "rounded-lg px-3 py-1.5 text-[17px] font-medium transition-colors",
                          isActive
                            ? "bg-white text-[#0A2540]"
                            : "hover:bg-white hover:text-[#0A2540] text-white",
                        ].join(" ")}
                      >
                        {label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </DesktopNav>
          </HeaderContainer>
        </div>
      </header>

      {/* Mobile spacer — keeps content below fixed header */}
      <div
        aria-hidden="true"
        className="md:hidden"
        style={{ height: Math.max(headerH + mobileBottomMarginPx, 0) }}
      />

      {/* —— Mobile Drawer + Overlay —— */}
      <MobileDrawer
        open={open}
        onClose={() => setOpen(false)}
        drawerRef={drawerRef}
        brand={
          <a href="/" aria-label="Rubitech Home" className="flex items-center gap-2">
            <BrandLogo size="md" alt="" scale={1.3} priority={false} />
            <span className="font-bold text-[#0A2540] text-normal">روبیتک</span>
          </a>
        }
      >
        <nav className="mt-4 space-y-1" aria-label="Mobile primary">
          {navItems.map(({ id, label }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                aria-current={isActive ? "page" : undefined}
                onClick={() => scrollToWithOffset(id)}
                className={[
                  "w-full text-right rounded-lg px-3 py-2 text-[17px] font-medium transition-colors",
                  isActive
                    ? "bg-white/90 text-[#0A2540]"
                    : "hover:bg-[#0A2540]/5 text-[#0A2540]",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </nav>
      </MobileDrawer>
    </>
  );
}

/* Desktop-only container */
function DesktopNav({ children }: { children: React.ReactNode }) {
  return <div className="hidden md:block">{children}</div>;
}

/* Mobile Drawer (unchanged visuals, uses your --sky overlay if you already applied it) */
function MobileDrawer({
  open,
  onClose,
  drawerRef,
  brand,
  children,
}: {
  open: boolean;
  onClose: () => void;
  drawerRef: React.MutableRefObject<HTMLDivElement | null>;
  brand: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        aria-hidden={!open}
        className={[
          "fixed inset-0 z-[60] md:hidden transition-opacity duration-300 ease-in-out",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
          "bg-[var(--sky)]/80 backdrop-blur-sm",
        ].join(" ")}
        onClick={onClose}
      />
      <div
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        ref={drawerRef}
        className={[
          "fixed z-[61] inset-y-0 right-0 w-80 max-w-[85%] md:hidden",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full",
          "rounded-l-2xl shadow-2xl",
          "bg-[var(--sky)] text-[#0A2540]",
        ].join(" ")}
      >
        <div className="flex h-14 items-center justify-between px-3">
          {brand}
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md p-2 text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0A2540]/50"
          >
            <span className="sr-only">Close menu</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="px-3 pb-4 overflow-y-auto">{children}</div>
      </div>
    </>
  );
}
