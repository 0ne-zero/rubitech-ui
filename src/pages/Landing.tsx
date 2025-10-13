import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";


import { partners, Partner } from "../data/partners";
import { testimonials, teenager_testimonials } from "../data/testimonials";
import { NAV_SECTIONS } from "@/data/sections";
import { site } from "../config/site";

import {
    IconUsers, IconLaptop, IconShield, IconGlobe, IconNodePath, IconSparkles,
    IconStampOfApproval, IconEye, IconLoop, IconQuestion, IconHeartHand,
    IconBuilding, IconUserGroup, LogoGlyphIcon
} from "../icons";
import { faqs } from "@/data/faq";

import { AuthModalLikeImage } from "@/components/landing/AuthModal";

/**
 * Rubitech — Single-file Landing Page (Updated per spec, with Auth modal trigger)
 * Mobile-first refinements included: dynamic conveyor sizing, stable header on modal open,
 * touch targets >= 44px, clamped typography, and tightened small-screen spacing.
 */


/* -------------------------------------------------------------------------- */
/* Utilities                                                                  */
/* -------------------------------------------------------------------------- */
const cx = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(" ");
const toFa = (n: number | string) => String(n).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
const ext = { rel: "noreferrer", target: "_blank" } as const;

/* -------------------------------------------------------------------------- */
/* Primitives                                                                 */
/* -------------------------------------------------------------------------- */
type ContainerProps = React.ComponentPropsWithoutRef<"div"> & { y?: "none" | "tight" | "loose" };
const Container: React.FC<ContainerProps> = ({ className = "", y, children, ...rest }) => {
    const py = y === "none" ? "" : y === "tight" ? "py-6 sm:py-8" : y === "loose" ? "py-14 sm:py-20" : "py-10 sm:py-14";
    return (
        <div className={cx("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", py, className)} {...rest}>
            {children}
        </div>
    );
};

type SectionProps = React.PropsWithChildren<{
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    y?: "tight" | "normal" | "loose";
}>;

const Section: React.FC<SectionProps> = ({ id, className = "", style, y = "normal", children }) => {
    const py =
        y === "tight" ? "py-6 sm:py-8" :
            y === "loose" ? "py-18 sm:py-24" :
                "py-10 sm:py-14";
    return (
        <section
            id={id}
            className={cx(py, className)}
            style={{
                // header height + 12px breathing + compensation for any negative top margin
                scrollMarginTop: "calc(var(--header-h,64px) + 12px + var(--section-top-nudge,0px))",
                ...style,
            }}
        >
            {children}
        </section>
    );
};
type DividerProps = { variant?: "brand" | "subtle" | "dotted"; className?: string };
export const SectionDivider = ({ variant = "brand", className = "" }: DividerProps) => {
    if (variant === "dotted") return <hr className={`mx-auto my-6 h-0 border-0 border-t-2 border-dotted border-slate-300/80 w-full max-w-7xl ${className}`} />;
    if (variant === "subtle") return <hr className={`mx-auto my-6 h-px w/full max-w-7xl bg-gradient-to-l from-transparent via-slate-200 to-transparent ${className}`} />;
    return <div aria-hidden="true" className={`mx-auto mt-8 mb-3 h-auto md:h-[2px] w-full max-w-7xl rounded-full bg-gradient-to-l from-[var(--green)] via-slate-200 to-[var(--brand)] ${className}`} />;
};


type SectionHeaderProps = {
    kicker?: string;
    Icon?: React.ComponentType<any>;
    title: string;
    subtitle?: string;
    align?: "center" | "start";
};
const SectionHeader: React.FC<SectionHeaderProps> = ({ kicker, Icon, title, subtitle, align = "start" }) => (
    <header className={cx(align === "center" ? "text-center" : "text-right")}>
        {kicker && (
            <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-base sm:text-lg font-extrabold text-[var(--brand)]">
                {Icon ? <Icon className="h-7 w-7 sm:h-10 sm:w-10" /> : null}
                <span>{kicker}</span>
            </div>
        )}
        {/* clamp() gives smoother scaling on tiny screens */}
        <h2 className="font-extrabold text-[clamp(22px,5vw,34px)] lg:text-4xl text-[var(--text-strong)]">{title}</h2>
        {subtitle && <p className="mt-3 sm:mt-5 max-w-3xl text-[15px] sm:text-lg md:text-xl text-slate-700">{subtitle}</p>}
    </header>
);

type CTAButtonProps = {
    href: string;
    children: React.ReactNode;
    colorClass?: string;
    className?: string;
    ariaLabel?: string;
    iconLeft?: React.ReactNode;
    target?: "_blank" | "_self" | "_parent" | "_top";
    rel?: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>; // NEW
};

const CTAButton: React.FC<CTAButtonProps> = ({
    href, children, className = "",
    colorClass = "bg-emerald-500 hover:bg-emerald-600 ring-emerald-500/35",
    ariaLabel, iconLeft, target, rel, onClick
}) => (
    <a
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        onClick={onClick} // NEW
        className={cx(
            "inline-flex items-center justify-center gap-2 rounded-xl px-5 sm:px-6 py-3.5 sm:py-3.5 text-white text-base md:text-lg font-bold ring-1 ring-inset transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent min-h-[44px]", // 44px tap target
            colorClass, className
        )}
    >
        {iconLeft}
        {children}
    </a>
);



/* NEW: DonationChoiceModal.tsx (or place above your components in the same file) */
function DonationChoiceModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const panelRef = React.useRef<HTMLDivElement | null>(null);




    // ESC to close
    React.useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    // Click outside to close
    const onBackdropClick = (e: React.MouseEvent) => {
        if (!panelRef.current) return;
        if (!panelRef.current.contains(e.target as Node)) onClose();
    };

    const go = (url: string) => window.location.replace(url);

    if (!open) return null;

    return createPortal(
        <>
            <div
                className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm"
                onMouseDown={onBackdropClick}
                aria-hidden
            />
            <div className="fixed inset-0 z-[110] grid place-items-center px-4">
                <div
                    ref={panelRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="donation-title"
                    className="relative w-full max-w-md rounded-3xl border border-slate-200/70 bg-white/95 shadow-2xl ring-1 ring-black/5 backdrop-blur p-5 sm:p-6"
                >
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                    >
                        ✕
                    </button>

                    <header className="text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-base font-extrabold text-[var(--brand)] mb-3">
                            <IconHeartHand className="h-6 w-6" />
                            <span>ساخت مدرسه</span>
                        </div>
                        <h3 id="donation-title" className="font-extrabold text-[clamp(20px,4.5vw,26px)] text-[var(--text-strong)]">
                            نوع دونیشن رو انتخاب کن
                        </h3>
                        <p className="mt-2 text-sm sm:text-[15px] text-slate-700">
                            با انتخاب روش پرداخت، به صفحه امن پرداخت هدایت می‌شی.
                        </p>
                    </header>

                    <div className="mt-5 grid gap-3">
                        <button
                            type="button"
                            onClick={() => go(site.donationUrlReymit)}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-white text-[15px] font-extrabold ring-1 ring-inset ring-[var(--green)]/35 bg-[var(--green)] hover:bg-[var(--green-strong)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]/40 shadow-[0_8px_20px_rgba(16,185,129,0.25)]"
                        >
                            دونیشن ریالی
                        </button>
                        <button
                            type="button"
                            onClick={() => go(site.donationUrlPaypal)}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-white text-[15px] font-extrabold ring-1 ring-inset ring-[var(--violet)]/35 bg-[var(--violet)] hover:bg-[var(--violet-strong)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--violet)]/40 shadow-[0_8px_20px_rgba(124,58,237,0.25)]"
                        >
                            دونیشن دلاری
                        </button>
                    </div>

                    <p className="mt-3 text-center text-xs font-bold text-slate-500">
                        پرداخت امن • گزارش شفاف در پنل کاربری
                    </p>
                </div>
            </div>
        </>,
        document.body
    );
}






const Card: React.FC<React.ComponentPropsWithoutRef<"div">> = ({ className = "", children, ...rest }) => (
    <div className={cx("rounded-lg ring-1 ring-slate-200 bg-white/95", className)} {...rest}>{children}</div>
);

type ImpactStatProps = {
    value: string;
    label: string;
    Icon?: React.ComponentType<any>;
    bgColor?: string;
    iconColor?: string;
};
const ImpactStat: React.FC<ImpactStatProps> = ({ value, label, Icon, bgColor = "bg-sky-50", iconColor = "text-slate-800" }) => (
    <div className={cx("flex items-center gap-3 rounded-lg p-4 ring-1 ring-slate-200", bgColor)}>
        <div className="grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded mb-3">
            {Icon ? <Icon className={cx("h-7 w-7 sm:h-8 sm:w-8", iconColor)} /> : null}
        </div>
        <dl>
            <dt className="sr-only">{label}</dt>
            <dd className="text-xl sm:text-2xl font-extrabold text-[var(--text-strong)]">{value}</dd>
            <dd className="text-xs sm:text-sm text-slate-700">{label}</dd>
        </dl>
    </div>
);

/* ----------------------------- Testimonials Card -------------------------- */
type Testimonial = { name: string; title?: string; quote: string; img?: string };
const TestimonialCard: React.FC<Testimonial> = ({ name, title, quote, img }) => (
    <Card className="p-5 sm:p-6 relative">
        {/* Avatar top-right */}
        {img ? (
            <img
                src={img}
                alt={name}
                loading="lazy"
                decoding="async"
                className="absolute top-3 right-3 h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover ring-2 ring-white shadow"
            />
        ) : null}
        <figure className="pt-1">
            <figcaption>
                <div className="mr-14 sm:mr-16 font-extrabold text-[var(--text-strong)]">{name}</div>
                {title ? <div className="text-xs sm:text-sm mr-14 sm:mr-16 text-slate-600 mt-0.5">{title}</div> : null}
            </figcaption>
            <blockquote className="mt-3 text-[15px] sm:text-base font-medium leading-relaxed">{quote}</blockquote>
        </figure>
    </Card>
);

/* ---------------------------- Differentiation Card ------------------------ */
type DifferentiationCardProps = {
    Icon?: React.ComponentType<any>;
    iconClass?: string;
    title: string;
    description: string;
    wrapperClass?: string;
};
const DifferentiationCard: React.FC<DifferentiationCardProps> = ({ Icon, iconClass = "h-7 w-7 text-slate-700", title, description, wrapperClass = "" }) => (
    <article className={cx("group rounded-2xl p-6 sm:p-7 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md", wrapperClass)}>
        <div className="flex items-start gap-4">
            <div className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center">
                {Icon ? <Icon className={iconClass} /> : null}
            </div>
            <div>
                <h3 className="text-[17px] sm:text-lg font-extrabold text-[var(--text-strong)]">{title}</h3>
                <p className="mt-2 text-[15px] sm:text-base text-slate-800">{description}</p>
            </div>
        </div>
    </article>
);

/* -------------------------------- FlowStep -------------------------------- */
type FlowStepProps = {
    number: string;
    title: string;
    description: string;
    IconComponent?: React.ComponentType<any>;
    align?: "left" | "right"; // NEW: explicit alignment
    boxBgColor?: string;
    iconBgColor?: string;
    stepColor?: string;
};
const FlowStep: React.FC<FlowStepProps> = ({
    number,
    title,
    description,
    IconComponent,
    align = "right",
    boxBgColor = "bg-slate-50",
    iconBgColor = "bg-white",
    stepColor = "text-slate-800",
}) => (
    <div className={cx(
        "relative",
        "md:col-span-1",
        align === "right" ? "md:col-start-2 md:pl-8" : "md:col-start-1 md:pr-8"
    )}>
        <div className={cx("rounded-2xl ring-1 ring-slate-200 p-5 sm:p-6", boxBgColor)}>
            <div className="flex items-start gap-4">
                <div className={cx("grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-full ring-2 ring-slate-200 font-extrabold text-[var(--text-strong)]", iconBgColor)} aria-hidden>
                    {number}
                </div>
                <div>
                    <div className={cx("flex items-center gap-2 font-extrabold", stepColor)}>
                        {IconComponent ? <IconComponent className="h-6 w-6" /> : null}
                        <span className="text-[var(--text-strong)]">{title}</span>
                    </div>
                    <p className="mt-2 text-slate-800">{description}</p>
                </div>
            </div>
        </div>
    </div>
);


/* ---------- CompactFlowItem (tight, minimal lines) ---------- */
type CompactFlowItemProps = {
    step: string;
    title: string;
    description: string;
    Icon?: React.ComponentType<any>;
    align?: "right" | "left"; // first one on RIGHT
    tintBg?: string;          // e.g. "bg-[var(--rose-ring)]"
    accentText?: string;      // e.g. "text-[var(--rose-step)]"
};
const CompactFlowItem: React.FC<CompactFlowItemProps> = ({
    step,
    title,
    description,
    Icon,
    align = "right",
    tintBg = "bg-white",
    accentText = "text-slate-900",
}) => {
    const isRight = align === "left";
    return (
        <li className="relative md:grid md:grid-cols-2 md:items-start py-4 md:py-2">

            {/* Card */}
            <div className={isRight ? "md:col-start-2 md:pl-6" : "md:col-start-1 md:pr-6"}>
                <article className={`rounded-xl ring-1 ring-slate-200 ${tintBg} p-4 md:p-5 shadow-sm`}>
                    <header className="flex items-center gap-3">
                        {/* Step pill (visible on all viewports) */}
                        <span className="inline-grid h-8 w-8 place-items-center rounded-full bg-white ring-1 ring-slate-200 text-[16px] font-extrabold text-slate-800">
                            {step}
                        </span>
                        <h3 className={`text-[15px] md:text-lg font-extrabold text-slate-800`}>{title}</h3>
                    </header>
                    <p className="mt-2 mr-10 text-[14px] md:text-[18px] font-medium leading-relaxed text-slate-800">{description}</p>
                </article>
            </div>
        </li>
    );
};
/* -------------------------------- FAQItem -------------------------------- */
/* ------------------------------- Accordion -------------------------------- */

type QA = { q: string; a: React.ReactNode };

function Accordion({
    items,
    initialOpenIndex = 0,          // set to undefined/null if you want all closed initially
    allowToggle = true,             // clicking the open item closes it
}: {
    items: QA[];
    initialOpenIndex?: number | null;
    allowToggle?: boolean;
}) {
    const [openIndex, setOpenIndex] = React.useState<number | null>(
        Number.isInteger(initialOpenIndex) ? (initialOpenIndex as number) : null
    );
    const btnRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

    const onActivate = (idx: number) => {
        setOpenIndex(prev => (prev === idx && allowToggle ? null : idx));
    };

    // Keyboard navigation (ArrowUp/Down, Home/End) — roving focus between headers
    const onKeyDown = (e: React.KeyboardEvent, idx: number) => {
        const max = items.length - 1;
        let next = idx;

        switch (e.key) {
            case "ArrowDown": next = idx === max ? 0 : idx + 1; break;
            case "ArrowUp": next = idx === 0 ? max : idx - 1; break;
            case "Home": next = 0; break;
            case "End": next = max; break;
            case "Enter":
            case " ":
                e.preventDefault();
                onActivate(idx);
                return;
            default:
                return;
        }
        e.preventDefault();
        btnRefs.current[next]?.focus();
    };

    return (
        <div className="space-y-3 sm:space-y-4" role="list">
            {items.map((item, i) => {
                const isOpen = openIndex === i;
                const panelId = `faq-panel-${i}`;
                const buttonId = `faq-button-${i}`;
                return (
                    <article
                        key={i}
                        role="listitem"
                        className="rounded-2xl ring-1 ring-slate-200 bg-white shadow-sm transition"
                    >
                        <h3 className="m-0">
                            <button
                                id={buttonId}
                                ref={el => (btnRefs.current[i] = el)}
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                onClick={() => onActivate(i)}
                                onKeyDown={(e) => onKeyDown(e, i)}
                                className="w-full text-right flex items-center justify-between gap-4 px-4 sm:px-5 py-4 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                            >
                                <span className="text-[var(--text-strong)] font-extrabold text-[15px] sm:text-base">
                                    {item.q}
                                </span>
                                <span
                                    aria-hidden
                                    className={`transition-transform text-slate-400 ${isOpen ? "rotate-180" : ""}`}
                                >
                                    ⌄
                                </span>
                            </button>
                        </h3>

                        {/* Smooth height animation using CSS grid rows */}
                        <div
                            id={panelId}
                            role="region"
                            aria-labelledby={buttonId}
                            className={`grid overflow-hidden transition-all duration-300 ease-out px-4 sm:px-5 ${isOpen ? "grid-rows-[1fr] py-3" : "grid-rows-[0fr] py-0"}`}
                        >
                            <div className="min-h-0 text-[15px] sm:text-base text-slate-800">
                                {item.a}
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}

/* -------------------------------- PartnerCard ----------------------------- */
type PartnerCardProps = { logoUrl?: string; name: string; description?: string; url?: string };
const PartnerCard: React.FC<PartnerCardProps> = ({ logoUrl, name, description, url }) => (
    <Card
        data-equalize="partner"
        className="h-full hover:shadow-md transition"
    >
        <a
            href={url || "#"}
            {...(url ? ext : {})}
            className="flex h-full items-center gap-4 p-5 sm:p-6 hover:-translate-y-0.5 hover:shadow-md"
        >
            {logoUrl ? (
                <img
                    src={logoUrl}
                    loading="lazy"
                    decoding="async"
                    alt={name}
                    className="h-12 w-12 sm:h-16 sm:w-16 object-contain rounded"
                />
            ) : (
                <span className="grid h-12 w-12 place-items-center rounded bg-slate-100 text-slate-500 text-base font-bold">
                    {name?.[0] ?? "?"}
                </span>
            )}
            <div className="flex-1 min-w-0">
                <div className="text-base text-right font-extrabold text-[var(--text-strong)] truncate">
                    {name}
                </div>
                {description ? (
                    <div className="text-sm sm:text-md font-medium text-right text-slate-700 line-clamp-2">
                        {description}
                    </div>
                ) : null}
            </div>
        </a>
    </Card>
);


/* -------------------------------------------------------------------------- */
/* Skip Link                                                                  */
/* -------------------------------------------------------------------------- */
const SkipLink = () => (
    <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:right-2 z-[100] bg-white text-slate-900 font-bold rounded-lg px-3 py-2 ring-2 ring-slate-300">
        پرش به محتوا
    </a>
);

/* -------------------------------------------------------------------------- */
/* Header (bigger items; taller)                                              */
/* -------------------------------------------------------------------------- */
function HeaderB({ onOpenAuth, onOpenDonate }: { onOpenAuth: () => void; onOpenDonate: () => void }) {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [active, setActive] = useState<string>("hero");
    const navRef = useRef<HTMLDivElement | null>(null);
    const headerRef = useRef<HTMLElement | null>(null);
    const toggleRef = useRef<HTMLButtonElement | null>(null);


    // Compute a fixed scrollbar width ONCE to prevent header "shake" when modals open/close
    useEffect(() => {
        const setSBW = () => {
            const sbw = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
            document.documentElement.style.setProperty("--sbw", sbw + "px");
        };
        // measure once after first paint (when scrollbar is present)
        requestAnimationFrame(setSBW);
        // also on orientation changes which can alter metrics on mobile
        window.addEventListener("orientationchange", setSBW);
        return () => window.removeEventListener("orientationchange", setSBW);
    }, []);

    const sections = useMemo(() => ["hero", "solution", "social-proof", "differentiation", "faq"], []);

    useEffect(() => {
        const el = headerRef.current;
        if (!el) return;

        const write = () => {
            const h = Math.ceil(el.getBoundingClientRect().height);
            document.documentElement.style.setProperty("--header-h", `${h}px`);
        };

        write();
        const ro = new ResizeObserver(write);
        ro.observe(el);

        const onResize = () => requestAnimationFrame(write);
        const onScroll = () => requestAnimationFrame(write);

        window.addEventListener("resize", onResize, { passive: true });
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", onResize);
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    // Scroll spy + header background on scroll
    useEffect(() => {
        const onScrollOrResize = () =>
            requestAnimationFrame(() => {
                // Header background toggle
                setScrolled(window.scrollY > 8);

                // Active section calculation (uses 1/3 viewport from top as probe line)
                const probe = window.scrollY + window.innerHeight * 0.33;
                let current = sections[0];
                for (const id of sections) {
                    const el = document.getElementById(id);
                    if (!el) continue;
                    const top = el.offsetTop;
                    if (top <= probe) current = id;
                }
                setActive(current);
            });

        onScrollOrResize();
        window.addEventListener("scroll", onScrollOrResize, { passive: true });
        window.addEventListener("resize", onScrollOrResize);
        return () => {
            window.removeEventListener("scroll", onScrollOrResize);
            window.removeEventListener("resize", onScrollOrResize);
        };
    }, [sections]);

    useEffect(() => {
        if (!open) {
            // restore
            document.documentElement.classList.remove("overflow-hidden");
            document.body.style.paddingInlineEnd = "";
            return;
        }

        // compute scrollbar width once and lock
        const sbw = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
        document.documentElement.classList.add("overflow-hidden");
        document.body.style.paddingInlineEnd = `${sbw}px`;
        // you already use --sbw on the header; keeping both avoids any tiny shift
        document.documentElement.style.setProperty("--sbw", `${sbw}px`);

        return () => {
            document.documentElement.classList.remove("overflow-hidden");
            document.body.style.paddingInlineEnd = "";
        };
    }, [open]);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!open) return;
            const t = e.target as Node;

            // if click is inside the menu panel, do nothing
            if (navRef.current?.contains(t)) return;

            // if click is on the hamburger button, do nothing
            if (toggleRef.current?.contains(t)) return;

            // otherwise, it's an outside click → close
            setOpen(false);
        };

        document.addEventListener("click", onDocClick);
        return () => document.removeEventListener("click", onDocClick);
    }, [open]);

    const navLink =
        "block px-3 py-2.5 rounded-lg text-[15px] md:text-[17px] font-extrabold hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40";
    const linkClasses = (id: string) =>
        cx(
            navLink,
            active === id && "bg-white/15 ring-1 ring-white/20",
        );

    return (
        <>

            <header
                ref={headerRef}
                style={{ paddingInlineEnd: "var(--sbw, 0px)" }}
                className={cx(
                    "fixed inset-x-0 top-0 z-50 text-white transition",
                    scrolled ? "backdrop-blur-md bg-slate-900/55 ring-1 ring-white/10" : "bg-transparent"
                )}
            >
                <Container className="!py-0">
                    <div className="flex h-16 items-center justify-between">
                        {/* Brand */}
                        <a
                            href="#hero"
                            className="font-extrabold text-[18px] sm:text-[20px] tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-md"
                            aria-current={active === "hero" ? "page" : undefined}
                        >
                            روبیتک
                        </a>

                        {/* Desktop Nav */}
                        <nav aria-label="اصلی" className="hidden md:flex items-center gap-1.5">
                            {NAV_SECTIONS.map(s => (
                                <a key={s.id} href={`#${s.id}`} className={linkClasses(s.id)} aria-current={active === s.id ? "page" : undefined}>
                                    {s.label}
                                </a>
                            ))}
                        </nav>

                        {/* Right actions */}
                        <div className="flex items-center gap-2">
                            {/* Desktop: open Auth modal */}
                            <button
                                type="button"
                                onClick={onOpenAuth}
                                className="hidden sm:inline-flex rounded-xl border border-white/35 px-3.5 py-2 text-[14px] sm:text-[15px] font-extrabold hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                            >
                                ورود
                            </button>

                            {/* Mobile menu button */}
                            <button
                                ref={toggleRef}
                                type="button"
                                aria-label={open ? "بستن منو" : "باز کردن منو"}
                                aria-expanded={open}
                                aria-controls="primary-nav"
                                onClick={() => setOpen((v) => !v)}
                                className="md:hidden grid h-10 w-10 place-items-center rounded-lg hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                            >
                                <span className="sr-only">منو</span>
                                <span aria-hidden className="text-xl leading-none">
                                    {open ? "✕" : "☰"}
                                </span>
                            </button>
                        </div>
                    </div>


                </Container>


                {/* Backdrop overlay (blurs page content) */}
                <div
                    onClick={() => setOpen(false)}
                    aria-hidden
                    className={cx(
                        "fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition-opacity",
                        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    )}
                />
            </header>

            {createPortal(
                <>
                    {/* Backdrop overlay (blurs page content) */}
                    <div
                        onClick={() => setOpen(false)}
                        aria-hidden
                        className={cx(
                            "fixed inset-0 z-[55] bg-slate-900/30 backdrop-blur-sm transition-opacity",
                            open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                        )}
                    />

                    {/* Mobile Nav — Modern Bottom Sheet (anchored to viewport) */}
                    <div
                        id="primary-nav"
                        ref={navRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="mobile-menu-title"
                        className={cx(
                            "fixed left-0 right-0 bottom-0 z-[60]",
                            "origin-bottom transform-gpu transition-transform duration-300 ease-out",
                            open ? "translate-y-0" : "translate-y-full pointer-events-none"
                        )}
                    >
                        <div className="mx-auto w-full max-w-lg rounded-t-[28px] ring-1 ring-black/5 shadow-[0_-24px_60px_rgba(2,6,23,0.25)] overflow-hidden">
                            <div className="bg-gradient-to-b from-white/90 to-white/70 backdrop-blur-xl">
                                {/* header row + close */}
                                <div className="flex items-center justify-between px-4 pt-3 pb-2">
                                    <h2 id="mobile-menu-title" className="sr-only">منوی موبایل</h2>
                                    <span className="inline-flex h-1.5 w-12 rounded-full bg-slate-300/80 mx-auto" aria-hidden />
                                    <button
                                        type="button"
                                        onClick={() => setOpen(false)}
                                        aria-label="بستن منو"
                                        className="grid h-9 w-9 place-items-center rounded-full border border-slate-200/70 bg-white/80 text-slate-600 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* links */}
                                <nav className={cx("px-2 pb-1", open ? "[&>a]:opacity-100 [&>a]:translate-y-0" : "[&>a]:opacity-0 [&>a]:translate-y-1")}>
                                    {NAV_SECTIONS.map((s, i) => (
                                        <a
                                            key={s.id}
                                            href={`#${s.id}`}
                                            onClick={() => setOpen(false)}
                                            style={{ transitionDelay: `${i * 25}ms` }}
                                            className={cx(
                                                "flex items-center justify-between rounded-xl px-4 py-3 text-[16px] font-extrabold transition",
                                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300",
                                                "hover:bg-white",
                                                "ring-1 ring-transparent hover:ring-slate-200/70",
                                                active === s.id ? "bg-white ring-1 ring-slate-200/80 text-[var(--brand)]" : "text-slate-900"
                                            )}
                                        >
                                            <span className="truncate">{s.label}</span>
                                            <span className="text-slate-400" aria-hidden>›</span>
                                        </a>
                                    ))}
                                </nav>

                                {/* actions */}
                                <div className="grid grid-cols-1 gap-2 px-3 pb-[max(16px,env(safe-area-inset-bottom)+8px)]">
                                    <a
                                        href="#donate"
                                        onClick={(e) => { e.preventDefault(); setOpen(false); onOpenDonate(); }}
                                        className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-white text-[15px] font-extrabold
               bg-[var(--green)] hover:bg-[var(--green-strong)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]/40
               shadow-[0_8px_20px_rgba(16,185,129,0.25)]"
                                    >
                                        ساخت مدرسه
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => { setOpen(false); onOpenAuth(); }}
                                        className="rounded-xl border border-slate-300/70 bg-white/90 px-4 py-3 text-[15px] font-extrabold text-slate-900 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                                    >
                                        ورود
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>,
                document.body
            )}

        </>
    );
}


/* -------------------------------------------------------------------------- */
/* Hero (aligned + spaced; divider removed)                                    */
/* -------------------------------------------------------------------------- */
function HeroB({
    onAmbassadorClick,
    onDonateClick,
}: {
    onAmbassadorClick: React.MouseEventHandler<HTMLAnchorElement>;
    onDonateClick: React.MouseEventHandler<HTMLAnchorElement>;
}) {
    return (
        <Section id="hero" className="relative overflow-hidden p-0">
            {/* Background image + overlay */}
            <div className="absolute inset-0">
                <picture>
                    <source
                        srcSet="
              https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=900 900w,
              https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600 1600w,
              https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2400 2400w
            "
                        sizes="100vw"
                    />
                    <img
                        src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop"
                        className="h-full w-full object-cover"
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                        alt="نوجوان امیدوار با لپ‌تاپ"
                    />
                </picture>
                <div className="absolute inset-0 bg-slate-900/60" />
            </div>

            {/* Foreground */}
            <div className="relative">
                <Container className="!py-0">
                    {/* Reserve space for sticky header */}
                    <div className="h-16" aria-hidden />
                    {/* Centered hero copy + CTAs */}
                    <div className="min-h-[64svh] grid place-items-center pb-8 sm:pb-10">
                        <div className="max-w-3xl text-center text-white">
                            <div className="space-y-4 md:space-y-5">

                                <div className="mb-10 sm:mb-14">
                                    <h1 className="font-extrabold leading-tight tracking-tight text-[clamp(26px,6vw,52px)]">با هم آینده ایران رو می‌سازیم!</h1>
                                    <h2 className="font-bold text-[clamp(20px,5vw,34px)]">هر لپ‌تاپ، یک مدرسه هوشمند</h2>
                                </div>
                                <div>
                                    <p className="text-[16px] sm:text-[18px] md:text-[24px] font-bold leading-[1.8] text-white/95">
                                        ایران آینده‌ای روشن‌تر می‌خواد، این آینده به دست نوجوانانش ساخته می‌شه،
                                    </p>
                                    <p className="text-[16px] sm:text-[18px] md:text-[22px] font-bold  text-white/95">
                                        نوجوانانی که سرمایه و سازندگان واقعی ایران‌اند.
                                    </p>

                                </div>
                                <div className="mt-8 sm:mt-10">
                                    <p className="text-[16px] sm:text-[18px] md:text-[21px] font-bold text-white/95">
                                        روبیتک اینجاست تا اثرگذاری شما رو به فرصتی روشن برای نوجوانان فردای ایران تبدیل کنه.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-7 sm:mt-8 flex flex-col gap-3 sm:flex-row justify-center">
                                <CTAButton
                                    href="#donate"
                                    onClick={onDonateClick}
                                    className="w-full sm:w-auto flex-[1.4] text-center whitespace-nowrap py-4"
                                    colorClass="bg-[var(--green)] hover:bg-[var(--green-strong)] ring-[var(--green)]/35"
                                    iconLeft={<IconHeartHand className="h-7 w-7" />}
                                    ariaLabel="ساخت مدرسه"
                                >
                                    ساخت مدرسه
                                </CTAButton>

                                <CTAButton
                                    href={site.ambassadorRegistrationUrl}
                                    onClick={onAmbassadorClick}
                                    className="w-full sm:w-auto flex-1 text-center whitespace-nowrap"
                                    colorClass="bg-[var(--violet)] hover:bg-[var(--violet-strong)] ring-[var(--violet)]/35"
                                    iconLeft={<IconShield className="h-7 w-7" />}
                                    ariaLabel="ثبت‌نام سفیر"
                                >
                                    ثبت‌نام سفیر
                                </CTAButton>

                                <CTAButton
                                    href={site.teenagerRegistrationUrl}
                                    className="w-full sm:w-auto text-center whitespace-nowrap"
                                    colorClass="bg-[var(--amber)] hover:bg-[var(--amber-strong)] ring-[var(--amber)]/35"
                                    iconLeft={<IconUsers className="h-7 w-7" />}
                                    ariaLabel="ثبت‌نام نوجوان"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    ثبت‌نام نوجوان
                                </CTAButton>
                            </div>
                        </div>
                    </div>

                    {/* Stats band */}
                    <div className="backdrop-blur-sm -mt-8 sm:-mt-14">
                        <Container className="">
                            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-2 px-2 sm:px-6 lg:px-8">
                                <ImpactStat value={`${toFa(134)}+`} label="نوجوانان تحت ثاثیر" Icon={IconUsers} bgColor="bg-[var(--mint-ring)]" iconColor="text-[var(--brand)]" />
                                <ImpactStat value={`${toFa(113)}+`} label="مدرسه تامین شده" Icon={IconLaptop} bgColor="bg-[var(--sky-ring)]" iconColor="text-[var(--brand)]" />
                                <ImpactStat value={toFa(35)} label="سفیر فعال" Icon={IconShield} bgColor="bg-[var(--violet-ring)]" iconColor="text-[#6D28D9]" />
                                <ImpactStat value={toFa(128)} label="حامیان فعال" Icon={IconStampOfApproval} bgColor="bg-[var(--amber-ring)]" iconColor="text-[#0EA5A7]" />
                            </div>
                        </Container>
                    </div>
                </Container>
                {/* NOTE: Divider intentionally removed per request */}
            </div>
        </Section>
    );
}

/* -------------------------------------------------------------------------- */
/* Sections                                                                   */
/* -------------------------------------------------------------------------- */
function Solution() {
    return (
        <Section id="solution" y="tight" className="overflow-hidden bg-gradient-to-b from-white to-[var(--sky)]">
            <Container>
                <SectionHeader
                    kicker="چطور کار می‌کنه ؟"
                    Icon={IconNodePath}
                    title="مسیر کامل تاثیر شما"
                    subtitle="ما یک اکوسیستم شفاف و قابل‌اعتماد طراحی کردیم که اثرگذاری شما رو به فرصتی پایدار برای آینده یک نوجوان تبدیل می‌کنه. این همیاری در ۵ مرحله اتفاق میوفته:"
                />

                <ol className="relative mt-6 sm:mt-8 md:mt-10">
                    {/* Single subtle center spine */}
                    <div
                        className="hidden md:block absolute inset-y-0 right-1/2 w-px translate-x-1/2 bg-slate-200/80"
                        aria-hidden
                    />

                    <CompactFlowItem
                        step="۱"
                        title="شما زنجیره رو آغاز می‌کنید"
                        description="حمایت/لپ‌تاپ شما به شکلی شفاف و امن، اولین حلقه زنجیره آینده‌سازی رو می‌سازه."
                        Icon={IconHeartHand}
                        align="right"
                        tintBg="bg-[var(--rose-ring)]"
                        accentText="text-[var(--rose-step)]"
                    />
                    <CompactFlowItem
                        step="۲"
                        title="روبیتک شفافیت رو تضمین می‌کنه"
                        description="روبیتک هر لپ‌تاپ رو ثبت و قابل رهگیری می‌کنه، در نهایت تحویل سفیرهاش می‌ده."
                        Icon={(props: any) => <LogoGlyphIcon {...props} scale={2} />}
                        align="left"
                        tintBg="bg-[var(--violet-tint)]"
                        accentText="text-[var(--violet-step)]"
                    />
                    <CompactFlowItem
                        step="۳"
                        title="سفیر معتمد و متعهد ما لپ‌تاپ رو تحویل می‌ده"
                        description="معلم‌ها و مدیران (سفیران ما) لپ‌تاپ رو به دست نوجوان مستعد می‌رسونند."
                        Icon={IconShield}
                        align="right"
                        tintBg="bg-[var(--amber-tint)]"
                        accentText="text-[var(--amber-step)]"
                    />
                    <CompactFlowItem
                        step="۴"
                        title="یک آینده ساخته می‌شه"
                        description="نوجوان مستعد بستر مناسب برای رشد، ساخت و تغییر آینده خودش و ایران رو داره."
                        Icon={IconUsers}
                        align="left"
                        tintBg="bg-[var(--lime-tint)]"
                        accentText="text-[var(--lime-step)]"
                    />
                    <CompactFlowItem
                        step="۵"
                        title="فرصت بورسیه روبیکمپ"
                        description="نوجوانی که با موفقیت مسیر رشد خودش رو پشت سر گذاشته، بورسیه کامل مدرسه رهبری روبیکمپ رو دریافت می‌کنه!"
                        Icon={IconSparkles}
                        align="right"
                        tintBg="bg-[var(--mint-ring)]"
                        accentText="text-[var(--mint-step)]"
                    />
                </ol>
            </Container>
            <SectionDivider />
        </Section>
    );
}


/* ================= PartnerConveyor (responsively sized, ultra-smooth) ================= */
function useEqualHeightsIn(container: React.RefObject<HTMLElement>, selector = '[data-equalize="partner"]') {
    useEffect(() => {
        const root = container.current;
        if (!root) return;

        const els = Array.from(root.querySelectorAll<HTMLElement>(selector));
        if (!els.length) return;

        const apply = () => {
            // reset then compute tallest
            els.forEach(el => (el.style.height = "auto"));
            const max = Math.max(...els.map(el => el.offsetHeight));
            els.forEach(el => (el.style.height = `${max}px`));
        };

        const ro = new ResizeObserver(apply);
        els.forEach(el => ro.observe(el));
        // also watch the container (in case of font swaps / images)
        ro.observe(root);

        window.addEventListener("resize", apply);
        apply();

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", apply);
        };
    }, [container, selector]);
}

function PartnerConveyor({ items }: { items: any[] }) {
    const partners = Array.isArray(items) ? items : [];
    if (!partners.length) return null;

    // Base tweakables (used as caps for dynamic sizing)
    const MIN_W = 220;
    const MAX_W = 320;
    const GAP = 24;            // px
    const SPEED = 40;          // px/sec (lower = slower)
    const EDGE_FADE_W = 24;    // px (overlay gradient width)

    const wrapRef = React.useRef<HTMLDivElement | null>(null);
    const trackRef = React.useRef<HTMLUListElement | null>(null);

    // 🔹 Equalize heights of all PartnerCards in THIS conveyor
    useEqualHeightsIn(wrapRef);
    // live speed (pause on hover by setting to 0)
    const speedRef = React.useRef<number>(SPEED);
    const reduceRef = React.useRef<boolean>(false);

    // Dynamically compute item width based on container width (keeps full card visible on small screens)
    const [itemW, setItemW] = React.useState<number>(MAX_W);
    React.useEffect(() => {
        const recomputeW = () => {
            const el = wrapRef.current;
            if (!el) return;
            const w = Math.round(Math.min(MAX_W, Math.max(MIN_W, el.clientWidth * 0.82)));
            setItemW(w);
        };
        recomputeW();
        const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(recomputeW) : null;
        ro?.observe(wrapRef.current as Element);
        window.addEventListener("resize", recomputeW);
        return () => {
            ro?.disconnect?.();
            window.removeEventListener("resize", recomputeW);
        };
    }, []);

    // measure visible count so we render enough cards + buffer
    const [visibleCount, setVisibleCount] = React.useState(4);
    React.useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const recompute = () => {
            const per = itemW + GAP;
            setVisibleCount(Math.max(1, Math.ceil(el.clientWidth / per)) + 2); // +2 buffer
        };
        recompute();
        const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(recompute) : null;
        ro?.observe(el);
        window.addEventListener("resize", recompute);
        return () => {
            ro?.disconnect?.();
            window.removeEventListener("resize", recompute);
        };
    }, [itemW]);

    // repeat partners enough to fill + cycle smoothly
    const renderList = React.useMemo(() => {
        const minNeeded = visibleCount + partners.length + 2; // generous buffer
        const reps = Math.max(3, Math.ceil(minNeeded / partners.length));
        const arr: any[] = [];
        for (let r = 0; r < reps; r++) arr.push(...partners);
        return arr.slice(0, minNeeded);
    }, [partners, visibleCount]);

    // animation state
    const offsetRef = React.useRef<number>(0); // current translateX in px (negative)
    const stepPx = itemW + GAP;

    // RAF loop: move continuously; when passing a card boundary, append first child and snap offset precisely
    React.useEffect(() => {
        reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let raf = 0;
        let last = performance.now();

        const frame = (now: number) => {
            const track = trackRef.current;
            if (!track) { raf = requestAnimationFrame(frame); return; }

            const dt = (now - last) / 1000; // seconds
            last = now;

            // advance offset by speed
            let offset = offsetRef.current - (reduceRef.current ? 0 : speedRef.current) * dt;

            // how many whole cards passed? (exactly, to avoid drift)
            let stepsCrossed = 0;
            if (offset <= -stepPx) {
                stepsCrossed = Math.floor((-offset) / stepPx);
                // move that many first children to the end
                for (let k = 0; k < stepsCrossed; k++) {
                    const first = track.firstElementChild;
                    if (first) track.appendChild(first);
                }
                // snap offset back into [-stepPx, 0)
                offset += stepsCrossed * stepPx;
            }

            offsetRef.current = offset;
            track.style.transform = `translateX(${offset}px)`;

            raf = requestAnimationFrame(frame);
        };

        raf = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(raf);
    }, [stepPx]);

    return (
        <div
            ref={wrapRef}
            className="relative overflow-hidden"
            onMouseEnter={() => { speedRef.current = 0; }}
            onMouseLeave={() => { speedRef.current = SPEED; }}
        >
            {/* washed-out edges (overlays so they don’t affect layout/hover) */}
            <div
                className="pointer-events-none absolute inset-y-0 right-0 bg-gradient-to-l from-white to-transparent"
                style={{ width: EDGE_FADE_W }}
            />
            <div
                className="pointer-events-none absolute inset-y-0 left-0 z-10"
            />

            {/* moving track — LTR so new items always enter from the RIGHT on an RTL page */}
            <ul
                ref={trackRef}
                dir="ltr"
                className="flex items-stretch"
                style={{
                    gap: `${GAP}px`,
                    willChange: "transform",
                    transform: "translateX(0)",
                }}
            >
                {renderList.map((p: any, i: number) => (
                    <li
                        key={`conveyor-${i}`}
                        className="shrink-0"
                        style={{ width: itemW, minWidth: itemW }}
                        dir="rtl" // Persian content stays RTL inside each card
                    >
                        <PartnerCard
                            logoUrl={p?.logoUrl}
                            name={p?.name}
                            description={p?.description}
                            url={p?.url}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}



/* =================================== SocialProof (FULL) =================================== */
function SocialProof() {
    const hasPartners = Array.isArray(partners) && partners.length > 0;
    const hasTestimonials = Array.isArray(testimonials) && testimonials.length > 0;

    return (
        <Section id="social-proof" y="tight" className="overflow-hidden bg-gradient-to-b from-[var(--sky)] to-white -mt-10">
            <Container>
                <SectionHeader
                    kicker="اعتماد"
                    Icon={IconStampOfApproval}
                    title="جنبشی که می‌تونید بهش تکیه کنید"
                    subtitle="از اعتماد فردی تا مسئولیت اجتماعی شرکت‌ها، همه در کنار هم برای ساخت آینده ایران."
                />

                {/* Partners — conveyor (one leaves left, same one appears on right) */}
                <div className="mt-8 sm:mt-10">
                    <div className="mb-4 sm:mb-5 flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 font-extrabold text-sm md:text-base text-[var(--brand)]">
                            <IconBuilding className="h-5 w-5 sm:h-6 sm:w-6" />
                            <span>سازمان‌های آینده‌ساز</span>
                        </div>
                    </div>

                    {hasPartners ? (
                        <PartnerConveyor items={partners} />
                    ) : (
                        <div className="text-sm text-slate-600">به‌زودی شرکای بیشتری معرفی می‌شوند.</div>
                    )}
                </div>

                {/* People — testimonials with avatar top-right */}
                <div className="mt-10 sm:mt-12">
                    <div className="mb-4 sm:mb-5 flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 font-extrabold text-sm md:text-base text-[var(--brand)]">
                            <IconUserGroup className="h-5 w-5 sm:h-6 sm:w-6" />
                            <span>افراد آینده‌ساز</span>
                        </div>
                    </div>
                    {hasTestimonials ? (
                        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                            {testimonials.map((t: any, i: number) => (
                                <TestimonialCard
                                    key={t?.name ?? i}
                                    name={t?.name}
                                    title={t?.title}
                                    quote={t?.quote}
                                    img={t?.img}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-slate-600">به‌زودی تجربه‌های افراد منتشر می‌شوند.</div>
                    )}
                </div>

                <div className="mt-10 sm:mt-12">
                    <div className="mb-4 sm:mb-5 flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 font-extrabold text-sm md:text-base text-[var(--brand)]">
                            <IconUsers className="h-5 w-5 sm:h-6 sm:w-6" />
                            <span>نوجوانان روبیتک</span>
                        </div>
                    </div>
                    {hasTestimonials ? (
                        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                            {teenager_testimonials.map((t: any, i: number) => (
                                <TestimonialCard
                                    key={t?.name ?? i}
                                    name={t?.name}
                                    title={t?.title}
                                    quote={t?.quote}
                                    img={t?.img}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-slate-600">به‌زودی تجربه‌های افراد منتشر می‌شوند.</div>
                    )}
                </div>



            </Container>
            <SectionDivider />
        </Section>
    );
}








function Differentiation() {
    return (
        <Section id="differentiation" y="tight" className="overflow-hidden bg-gradient-to-b from-white to-[var(--sky)] -mt-10">
            <Container>
                <SectionHeader
                    kicker="چرا روبیتک ؟"
                    Icon={IconSparkles}
                    title="چه چیز روبیتک رو متمایز می‌کنه ؟"
                    subtitle="ترکیب شفافیت، شبکه مورداعتماد و مسیرِ پایدار، روبیتک رو به انتخابی مطمئن تبدیل می‌کنه."
                />
                <div className="mt-5 sm:mt-6 grid gap-4 sm:gap-6 md:grid-cols-2">
                    <DifferentiationCard
                        Icon={IconLoop}
                        iconClass="h-8 w-11 text-[var(--mint-strong)]"
                        title="مسیرِ پایدار"
                        wrapperClass="bg-[var(--mint-ring)] ring-[var(--mint-ring)]"
                        description="لپ‌تاپ‌ها به صورت چرخه‌ای به نفر بعدی می‌رسند. همچنین نوجوانان موفق وارد روبیکمپ میشن."
                    />
                    <DifferentiationCard
                        Icon={IconEye}
                        iconClass="h-8 w-8 text-[var(--brand)]"
                        title="شفافیت رادیکال"
                        wrapperClass="bg-[var(--sky-ring)] ring-[var(--sky-ring)]"
                        description="پنل شخصی شما قابلیت‌های تخصیص، تحویل و رهگیری مدرسه(لپ‌تاپ)ها رو داره."
                    />
                    <DifferentiationCard
                        Icon={IconShield}
                        iconClass="h-8 w-8 text-[var(--violet)]"
                        title="شبکهٔ مورد اعتماد"
                        wrapperClass="bg-[var(--violet-ring)] ring-[var(--violet-ring)]"
                        description="با معلمان و مدیرانِ مورد اعتماد کار می‌کنیم تا نوجوانان مستعد انتخاب بشن."
                    />
                    <DifferentiationCard
                        Icon={IconUsers}
                        iconClass="h-8 w-8 text-[var(--amber)]"
                        title="اجتماع‌محور"
                        wrapperClass="bg-[var(--amber-ring)] ring-[var(--amber-ring)]"
                        description="به‌دست جامعه و برایِ جامعه؛ برای پیشرفتی پایدار در ایران."
                    />
                </div>
            </Container>
            <SectionDivider />
        </Section>
    );
}

function FAQ() {
    const items = faqs

    return (
        <Section id="faq" y="tight" className="overflow-hidden bg-gradient-to-b from-[var(--sky)] to-white mb-8 -mt-10">
            <Container>
                <SectionHeader
                    kicker="پرسش‌های پرتکرار"
                    Icon={IconQuestion}
                    title="سوالات شما، پاسخ‌های ما"
                    subtitle="اگر جواب سوال‌تون رو نمی‌بینید، بهمون اطلاع بدید."
                    align="start"
                />
                <div className="mt-6 sm:mt-8">
                    {/* Only one open at a time; clicking the open item will close it */}
                    <Accordion items={items} initialOpenIndex={0} allowToggle />
                </div>
            </Container>
        </Section>
    );
}


export function FinalCTA_C({
    onAmbassadorClick,
    onDonateClick,
}: {
    onAmbassadorClick: React.MouseEventHandler<HTMLAnchorElement>;
    onDonateClick: React.MouseEventHandler<HTMLAnchorElement>;
}) {
    const steps = useMemo(() => ([
        ["۱", "آغاز شما", "bg-white/10", "text-white"],
        ["۲", "روبیتک", "bg-white/10", "text-white"],
        ["۳", "دریافت نوجوان", "bg-white/10", "text-white"],
        ["۴", "ساخت آینده", "bg-white/10", "text-white"],
        ["۵", "بورسیه روبیکمپ", "bg-white/10", "text-white"],
    ]), []);

    return (
        <Section id="final-cta" className="relative bg-slate-950">
            <Container>
                <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 md:p-12 shadow-2xl backdrop-blur">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="text-[clamp(22px,5vw,36px)] font-extrabold text-white leading-tight tracking-tight">
                            به جنبش {toFa(10000)} مدرسه سالانه بپیوند
                        </h2>
                        <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-[15px] sm:text-[17px] md:text-[19px] leading-[1.9] text-slate-300">
                            یک لپ‌تاپ آغازِ راه هست: یک جامعه پشتیبان، انقلاب واقعی‌ست!
                            <br />امروز، آینده ایران رو بساز.
                        </p>
                    </div>

                    <div className="mt-7 sm:mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                        <CTAButton
                            href="#donate"
                            onClick={onDonateClick}
                            className="w-full sm:w-auto"
                            colorClass="bg-[var(--green)] hover:bg-[var(--green-strong)] ring-white/20"
                            iconLeft={<IconHeartHand className="h-7 w-7" />}
                        >
                            ساخت مدرسه
                        </CTAButton>
                        <CTAButton href={site.ambassadorRegistrationUrl} onClick={onAmbassadorClick} className="w-full sm:w-auto" colorClass="bg-[var(--violet)] hover:bg-[var(--violet-strong)] ring-white/20" iconLeft={<IconShield className="h-7 w-7" />}>ثبت‌نام سفیر</CTAButton>
                        <CTAButton href={site.teenagerRegistrationUrl} className="w-full sm:w-auto" colorClass="bg-[var(--amber)] hover:bg-[var(--amber-strong)] ring-white/20" iconLeft={<IconUsers className="h-7 w-7" />} target="_blank" rel="noopener noreferrer">ثبت‌نام نوجوان</CTAButton>
                    </div>

                    <div className="mt-4 sm:mt-5 text-center text-[11px] sm:text-xs font-extrabold text-slate-300">
                        اثرگذاری پایدار
                        <span className="mx-2 text-slate-600">|</span>
                        شفافیت رادیکال
                    </div>

                    <div className="mt-8 sm:mt-10">
                        <ol className="mx-auto grid max-w-5xl grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 lg:grid-cols-5" aria-label="گام‌های مسیر">
                            {steps.map(([n, t, bg, tc]) => (
                                <li key={n} className="flex items-center justify-center">
                                    <div className="flex w-full items-center gap-3 rounded-2xl border border-white/15 px-3 sm:px-4 py-3 ring-1 ring-white/10 bg-white/5 hover:bg-white/10 transition">
                                        <span className={cx("grid h-9 w-9 place-items-center rounded-full bg-white/10 text-[15px] font-extrabold text-white ring-1 ring-white/20", bg)}>{n}</span>
                                        <span className={cx("text-[14px] sm:text-[14px] md:text-[16px] font-extrabold leading-none", tc)}>{t}</span>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>

                <p className="mx-auto mt-3 sm:mt-4 max-w-4xl text-center text-[11px] sm:text-[12px] font-bold text-slate-400">
                    با هر مشارکت، یک «مدرسه» (یک لپ‌تاپ + شبکه پشتیبان) برای یک نوجوان شکل می‌گیرد.
                </p>
            </Container>
        </Section>
    );
}


/* -------------------------------------------------------------------------- */
/* Back To Top                                                                 */
/* -------------------------------------------------------------------------- */
function BackToTop() {
    const [show, setShow] = useState(false);
    const [progress, setProgress] = useState(0); // 0..1
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const onChange = () => setReduced(mq.matches);
        onChange();
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    useEffect(() => {
        let raf = 0;
        const update = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const y = window.scrollY;
                const max = Math.max(
                    document.documentElement.scrollHeight - window.innerHeight,
                    1
                );
                setProgress(Math.min(y / max, 1));
                setShow(y > 700);
            });
        };
        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, []);

    const goTop = () => {
        if (reduced) window.scrollTo(0, 0);
        else window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Progress ring geometry
    const size = 48;
    const stroke = 3;
    const r = (size - stroke) / 2;
    const C = 2 * Math.PI * r;
    const dash = C * (1 - progress);

    return (
        <div
            className={cx(
                "fixed z-40 right-4 sm:right-5 md:right-8 bottom-4 sm:bottom-5 md:bottom-8",
                "transition-all motion-safe:duration-200",
                show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
            )}
        >
            <button
                type="button"
                onClick={goTop}
                aria-label="بازگشت به بالا"
                title="بازگشت به بالا"
                className={cx(
                    "group relative grid h-12 w-12 place-items-center rounded-full",
                    "bg-white/90 hover:bg-white text-slate-700 ring-1 ring-slate-300 shadow-lg shadow-slate-900/5",
                    "backdrop-blur supports-[backdrop-filter]:bg-white/80",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                )}
            >
                {/* Progress ring */}
                <svg
                    viewBox={`0 0 ${size} ${size}`}
                    width={size}
                    height={size}
                    className="absolute inset-0"
                    aria-hidden
                >
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={r}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={stroke}
                        className="text-slate-200"
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={r}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={C}
                        strokeDashoffset={dash}
                        className="text-slate-700 transition-[stroke-dashoffset] duration-300 ease-out"
                    />
                </svg>

                {/* Arrow */}
                <span aria-hidden className="relative text-[30px] leading-none font-bold">
                    ↑
                </span>

                {/* Tooltip */}
                <span
                    className={cx(
                        "pointer-events-none absolute -top-2 right-1/2 translate-x-1/2 -translate-y-full",
                        "rounded-md bg-slate-900/90 px-2 py-1 text-[11px] font-extrabold text-white",
                        "opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100",
                        "whitespace-nowrap"
                    )}
                >
                    بالا
                </span>
            </button>
        </div>
    );
}

function Footer() {
    return (
        <footer className="border-t border-slate-200/80 bg-white">
            <Container className="!py-0">
                <div className="py-6 md:py-8 flex flex-col gap-4 md:flex-row md:flex-row-reverse md:items-center md:justify-between">
                    {/* Right column: sections */}
                    <nav
                        aria-label="پیوندهای پایانی سایت"
                        className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-6 text-[13px] sm:text-sm font-extrabold text-slate-600"
                    >
                        {NAV_SECTIONS.map(s => (
                            <a key={s.id} href={`#${s.id}`} className="rounded-md px-2 py-1 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300">
                                {s.label}
                            </a>
                        ))}
                    </nav>

                    {/* Left column: copyright */}
                    <div className="text-[12px] sm:text-xs md:text-sm text-slate-500">
                        © {new Date().getFullYear()} روبیتک — کلیه حقوق محفوظ است
                    </div>
                </div>
            </Container>
        </footer>
    );
}



/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */
export default function Landing() {
    const [authOpen, setAuthOpen] = useState(false);
    const [donationOpen, setDonationOpen] = useState(false);

    useEffect(() => {
        const els = Array.from(document.querySelectorAll<HTMLElement>('section[id]'));
        const write = () => {
            for (const el of els) {
                const mt = parseFloat(getComputedStyle(el).marginTop || "0");
                const nudge = mt < 0 ? -mt : 0; // e.g. -mt-10 → add +40px
                el.style.setProperty("--section-top-nudge", `${nudge}px`);
            }
        };
        write();
        const ro = new ResizeObserver(write);
        els.forEach(el => ro.observe(el));
        window.addEventListener("resize", write, { passive: true });
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", write);
        };
    }, []);

    // Deep-link: open modal on /login or #login
    useEffect(() => {
        const path = typeof window !== "undefined" ? window.location.pathname : "";
        const hash = typeof window !== "undefined" ? window.location.hash : "";
        if (path === "/login" || hash === "#login") {
            setAuthOpen(true);
        }
    }, []);

    const handleDonateClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => { // NEW
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        setDonationOpen(true);
    };

    useEffect(() => {
        const getHeaderH = () =>
            parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 64;

        const computeNudge = (el: HTMLElement) => {
            // Prefer your CSS var if present (set in the existing “nudge” effect)
            const varNudge = parseFloat(getComputedStyle(el).getPropertyValue("--section-top-nudge") || "0");
            if (!Number.isNaN(varNudge) && varNudge > 0) return varNudge;

            // Fallback: read actual negative margin
            const mt = parseFloat(getComputedStyle(el).marginTop || "0");
            return mt < 0 ? -mt : 0;
        };

        const scrollToId = (id: string, behavior: ScrollBehavior = "smooth") => {
            const el = document.getElementById(id);
            if (!el) return;

            const headerH = getHeaderH();
            const nudge = computeNudge(el);
            const breathing = 12;

            const top =
                el.getBoundingClientRect().top + window.scrollY - (headerH + breathing + nudge);

            window.scrollTo({ top: Math.max(0, top), behavior });
        };

        // Intercept in-page anchor clicks
        const onClick = (e: MouseEvent) => {
            const a = (e.target as HTMLElement)?.closest<HTMLAnchorElement>('a[href^="#"]');
            if (!a) return;

            const raw = a.getAttribute("href") || "";
            const id = raw.slice(1);
            if (!id) return;

            // Only handle if target element exists on this page
            const el = document.getElementById(id);
            if (!el) return;

            e.preventDefault();
            scrollToId(id, "smooth");
            // keep URL in sync
            history.pushState(null, "", `#${id}`);
        };

        // Handle initial load with a hash and back/forward
        const onHashNav = () => {
            const id = location.hash.replace("#", "");
            if (!id) return;
            // use 'auto' to avoid double animation when browser also tries to scroll
            scrollToId(id, "auto");
        };

        document.addEventListener("click", onClick);
        window.addEventListener("hashchange", onHashNav);
        window.addEventListener("popstate", onHashNav);

        // If the page loads with #hash, align it correctly after first paint
        if (location.hash) requestAnimationFrame(() => onHashNav());

        return () => {
            document.removeEventListener("click", onClick);
            window.removeEventListener("hashchange", onHashNav);
            window.removeEventListener("popstate", onHashNav);
        };
    }, []);

    const handleAmbassadorClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
        // Let users open in new tab/window if they want
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;

        const token = (() => { try { return localStorage.getItem("token"); } catch { return null; } })();
        if (token) {
            e.preventDefault();
            const panelUrl = `${import.meta.env.BASE_URL}dashboard/ambassador`;
            window.location.assign(panelUrl);
        } else {
            e.preventDefault();
            setAuthOpen(true);
        }
    };
    return (
        <main id="main-content" dir="rtl" lang="fa" className="bg-white text-slate-900" style={{ fontFamily: 'IRANYekanX, IRANYekanX FaNum, -apple-system, "Segoe UI", Roboto, Arial, sans-serif' }}>
            <SkipLink />
            <HeaderB onOpenAuth={() => setAuthOpen(true)} onOpenDonate={() => setDonationOpen(true)} /> {/* MODIFIED */}

            <HeroB onAmbassadorClick={handleAmbassadorClick} onDonateClick={handleDonateClick} />        {/* MODIFIED */}

            <Solution />
            <SocialProof />
            <Differentiation />
            <FAQ />
            {/* <FinalCTA_B /> */}
            <FinalCTA_C onAmbassadorClick={handleAmbassadorClick} onDonateClick={handleDonateClick} />   {/* MODIFIED */}


            <Footer />
            <BackToTop />

            <AuthModalLikeImage open={authOpen} onClose={() => setAuthOpen(false)} />

            {/* Auth Modal mount point */}
            <DonationChoiceModal open={donationOpen} onClose={() => setDonationOpen(false)} />            {/* NEW */}

        </main>
    );
}
