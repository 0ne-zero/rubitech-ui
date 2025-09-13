type CTAButtonProps = {
  onClick?: () => void;
  href?: string;
  className?: string;
  children: React.ReactNode;
  colorClass?: string;         // you already use this in the caller
  iconLeft?: React.ReactNode;  // optional, for an icon
  ariaLabel?: string;
};

export const CTAButton = ({
  onClick,
  href,
  children,
  className = "",
  colorClass = "bg-[var(--green)] hover:bg-[var(--green-strong)] ring-[var(--green)]/35",
  iconLeft,
  ariaLabel = "دکمه اقدام",
}: CTAButtonProps) => {
  const base =
    // base layout + accessible focus + subtle 3D
    "relative inline-flex items-center justify-center gap-8 rounded-lg px-6 py-6 text-[18px] font-extrabold text-white " +
    "strong-shadow ring-1 transition-transform duration-200 " +
    "focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-offset-white " +
    "hover:-translate-y-0.5 active:translate-y-0";

  const shineLayer =
    // faint overlay on hover
    "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 " +
    "group-hover:opacity-[.08] bg-white";

  const sweep =
    // diagonal “shine” sweep
    "pointer-events-none absolute -inset-y-10 -left-16 w-16 rotate-12 bg-white/40 blur-md " +
    "translate-x-[-130%] group-hover:translate-x-[240%] transition-transform duration-700 ease-out";

  const content =
    <span className="relative z-[1] flex items-center gap-2">
      {iconLeft ? <span className="translate-y-[-1px]">{iconLeft}</span> : null}
      {children}
    </span>;

  // Anchor version
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={`group overflow-hidden ${base} ${colorClass} ${className}`}
      >
        {/* layers */}
        <span className={shineLayer} />
        <span className={sweep} />
        {content}
      </a>
    );
  }

  // Button version
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`group overflow-hidden ${base} ${colorClass} ${className}`}
    >
      <span className={shineLayer} />
      <span className={sweep} />
      {content}
    </button>
  );
};
