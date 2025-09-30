export type NavSection = {
    id: "solution" | "social-proof" | "differentiation" | "faq";
    label: string;
};

export const NAV_SECTIONS: NavSection[] = [
    { id: "solution", label: "چطور کار می‌کنه ؟" },
    { id: "social-proof", label: "اعتماد" },
    { id: "differentiation", label: "چرا روبیتک؟" },
    { id: "faq", label: "پرسش‌ها" },
];