type SalongEdLogoProps = {
  className?: string;
  compact?: boolean;
  variant?: "light" | "dark";
};

/**
 * Brand lock-up for the supplied ED monogram and SALONG wordmark.
 *
 * No approved logo artwork is present in this workspace, so the existing
 * restrained lock-up is kept intact rather than inventing a replacement mark.
 * A future approved SVG/raster can replace this component without changing its
 * header or footer API.
 */
export default function SalongEdLogo({ className = "", compact = false, variant = "dark" }: SalongEdLogoProps) {
  const isLight = variant === "light";
  const frameClasses = isLight ? "border-background/70 bg-background/5" : "border-accent/80 bg-accent/5";
  const wordmarkClasses = isLight ? "text-background" : "text-foreground";
  const openingClasses = isLight ? "bg-foreground" : "bg-background";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden="true"
        className={`relative flex shrink-0 items-center justify-center border ${frameClasses} ${
          compact ? "h-8 w-8" : "h-11 w-11"
        }`}
      >
        <span className={`font-serif tracking-[0.04em] text-accent ${compact ? "text-sm" : "text-base"}`}>ED</span>
        <span aria-hidden="true" className={`absolute -right-px top-2 h-4 w-px ${openingClasses}`} />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-serif tracking-[0.18em] ${wordmarkClasses} ${compact ? "text-base" : "text-xl"}`}
        >
          SALONG
        </span>
        {!compact && (
          <span className={`mt-1 text-[9px] uppercase tracking-[0.24em] ${isLight ? "text-background/70" : "text-muted"}`}>
            Skönhetssalong
          </span>
        )}
      </span>
    </span>
  );
}
