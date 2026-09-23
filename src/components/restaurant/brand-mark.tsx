import { cn } from "@/lib/utils";

export interface BrandMarkProps {
  compact?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showSubtitle?: boolean;
}

export function BrandMark({
  compact = false,
  className,
  size = "lg",
  showSubtitle = true,
}: BrandMarkProps) {
  const isSm = size === "sm";

  return (
    <span
      className={cn(
        "group inline-flex items-center gap-2 sm:gap-3.5 md:gap-4 transition-all duration-300 select-none",
        className
      )}
      aria-label="Laung Laachi Brahmpur Restaurant"
    >
      {/* Royal Circular Clove & Cardamom Crest */}
      <span
        className={cn(
          "relative grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-red-600 via-primary to-stone-950 text-white shadow-lg shadow-primary/25 ring-2 ring-gold/80 ring-offset-2 ring-offset-background transition-transform duration-300 group-hover:scale-105 group-hover:ring-gold group-hover:shadow-xl group-hover:shadow-primary/30",
          isSm ? "size-8.5 sm:size-10 ring-1 ring-offset-1" : "size-10 sm:size-14 md:size-15"
        )}
        aria-hidden="true"
      >
        {/* Subtle inner gold rim */}
        <span className="absolute inset-0.5 rounded-full border border-gold/30 pointer-events-none" />

        {/* Detailed Royal Clove (Laung) & Cardamom (Laachi) Crest SVG */}
        <svg
          viewBox="0 0 36 36"
          className={cn(
            "fill-none transition-transform duration-300 group-hover:rotate-3",
            isSm ? "size-5 sm:size-6" : "size-6 sm:size-8 md:size-9"
          )}
          role="img"
        >
          {/* Cardamom pod aura */}
          <path
            d="M8 18c0-5 3.5-9 8-12 4.5 3 8 7 8 12 0 6-3.5 10-8 13-4.5-3-8-7-8-13Z"
            fill="rgba(247, 208, 112, 0.12)"
            stroke="var(--gold)"
            strokeWidth="0.8"
            strokeDasharray="1.5 1.5"
            opacity="0.8"
          />
          {/* Central Clove (Laung) stem and bulb */}
          <path
            d="M18 6.5c3.2 0 5.5 2.1 5.5 5 0 2-1.3 3.6-3.2 4.4v10.6c0 1.5-1 2.5-2.3 2.5s-2.3-1-2.3-2.5V15.9c-1.9-.8-3.2-2.4-3.2-4.4C12.5 8.6 14.8 6.5 18 6.5Z"
            fill="currentColor"
          />
          {/* Golden crown calyx / clove head */}
          <circle cx="18" cy="11.5" r="2.8" fill="var(--gold)" />
          {/* Golden arched sepals */}
          <path
            d="M13.5 11.5c1.4-1.8 2.8-2.6 4.5-2.6s3.1.8 4.5 2.6"
            stroke="var(--gold)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Golden spice sparkle dot */}
          <circle cx="18" cy="8.2" r="1" fill="#fff" />
        </svg>
      </span>

      {/* Brand Typography: Stacked Royal Letters covering both sides & up and down */}
      {!compact && (
        <span className="flex flex-col justify-center leading-none shrink-0">
          <span
            className={cn(
              "font-brand font-black tracking-[0.05em] sm:tracking-[0.12em] text-foreground transition-colors group-hover:text-primary brand-title-shadow",
              isSm ? "text-xs sm:text-base" : "text-[14px] sm:text-2xl md:text-[27px] leading-[1.05]"
            )}
          >
            LAUNG
          </span>
          <span
            className={cn(
              "font-brand font-black tracking-[0.05em] sm:tracking-[0.12em] text-foreground transition-colors group-hover:text-primary brand-title-shadow",
              isSm ? "text-xs sm:text-base" : "text-[14px] sm:text-2xl md:text-[27px] leading-[1.05]"
            )}
          >
            LAACHI
          </span>

          {showSubtitle && (
            <span
              className={cn(
                "mt-0.5 sm:mt-1 flex items-center gap-1 font-bold uppercase transition-colors group-hover:text-foreground whitespace-nowrap",
                isSm
                  ? "text-[7.5px] sm:text-[9px] tracking-wider text-muted-foreground"
                  : "text-[7.5px] sm:text-[11px] tracking-[0.1em] sm:tracking-[0.22em] text-foreground/75 dark:text-gold"
              )}
            >
              <span>BRAHMPUR</span>
              <span className="text-gold font-black">•</span>
              <span>PUNJAB</span>
            </span>
          )}
        </span>
      )}
    </span>
  );
}
