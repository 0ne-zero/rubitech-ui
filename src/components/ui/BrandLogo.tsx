import logoWebp from "@/assets/logo/rubitech-logo.webp";
import logoPng from "@/assets/logo/rubitech-logo.png";

type BrandLogoProps = {
    size?: "xs" | "sm" | "md" | "lg";
    alt?: string;        // "Rubitech" if alone, or "" when next to brand text
    priority?: boolean;  // true for header/hero
    className?: string;  // extra classes for the outer white box

    /** How much of the box the logo should fill (0.6–1.0). Default varies by size. */
    fillPct?: number;
    /** Additional scale multiplier to counter transparent padding (e.g. 1.06). */
    scale?: number;
};

// White box footprint (unchanged)
const BOX: Record<NonNullable<BrandLogoProps["size"]>, string> = {
    xs: "h-8  w-8",
    sm: "h-10 w-11",
    md: "h-12 w-14",
    lg: "h-14 w-14",
};

// Sensible defaults per size (can override with fillPct)
const FILL_DEFAULT: Record<NonNullable<BrandLogoProps["size"]>, number> = {
    xs: 0.92,
    sm: 0.94,
    md: 0.96,
    lg: 0.96,
};

export function BrandLogo({
    size = "md",
    alt = "Rubitech",
    priority = true,
    className = "",
    fillPct = 100,
    scale,
}: BrandLogoProps) {
    // clamp fill to [0.6, 1.0]
    const fill = Math.min(1, Math.max(0.6, fillPct ?? FILL_DEFAULT[size]));
    const sc = typeof scale === "number" ? scale : 1; // 1.00 = no extra scale
    const shiftY = -1;
    return (
        <div
            className={[
                BOX[size],
                "bg-white rounded-md grid place-items-center overflow-hidden shrink-0",
                className,
            ].join(" ")}
        >
            <picture>
                <source srcSet={logoWebp} type="image/webp" />
                <img
                    src={logoPng}
                    alt={alt}
                    width={512}
                    height={512}
                    loading={priority ? "eager" : "lazy"}
                    decoding="async"
                    className="block object-contain select-none pointer-events-none -translate-y-10"
                    style={{
                        width: `${fill * 100}%`,
                        height: `${fill * 100}%`,
                        // Order matters: scale THEN translate so the shift is in real pixels
                        transform: `${sc !== 1 ? `scale(${sc})` : ""} ${shiftY ? `translateY(${shiftY}px)` : ""}`.trim() || undefined,
                    }}
                />
            </picture>
        </div>
    );
}
