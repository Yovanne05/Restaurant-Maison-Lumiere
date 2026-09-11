import type { ReactNode } from "react";
import { cn } from "./cn";

/* -------------------------------------------------------------------------- */
/* Étiquettes                                                                  */
/* -------------------------------------------------------------------------- */

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "gold" | "ember";
  className?: string;
}) {
  const tones = {
    neutral: "border-sand/20 text-sand/80",
    gold: "border-gold/45 text-gold-soft",
    ember: "border-ember/50 text-ember",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium tracking-[0.14em] uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Surtitre                                                                    */
/* -------------------------------------------------------------------------- */

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "flex items-center gap-3 text-[11px] font-medium tracking-[0.3em] text-gold uppercase",
        className,
      )}
    >
      <span className="hairline h-px w-8 shrink-0" aria-hidden="true" />
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Mise en page                                                                */
/* -------------------------------------------------------------------------- */

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[86rem] px-5 sm:px-8", className)}>{children}</div>;
}

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("relative py-24 sm:py-32", className)}>
      {children}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Prix                                                                        */
/* -------------------------------------------------------------------------- */

const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatPrice(priceCents: number): string {
  return euro.format(priceCents / 100);
}

/* -------------------------------------------------------------------------- */
/* Bandeau défilant                                                            */
/* -------------------------------------------------------------------------- */

export function Marquee({ items, duration = 46 }: { items: readonly string[]; duration?: number }) {
  const sequence = [...items, ...items];

  return (
    <div
      className="relative flex overflow-hidden border-y border-ink-line/80 bg-ink-raised/40 py-5"
      aria-hidden="true"
    >
      <div
        className="marquee-track"
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {sequence.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex shrink-0 items-center gap-8 px-8 font-display text-xl text-sand/70 italic sm:text-2xl"
          >
            {item}
            <span className="h-1 w-1 rounded-full bg-gold/70" />
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Étoiles                                                                     */
/* -------------------------------------------------------------------------- */

export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5 text-gold", className)} aria-label={`${rating} sur 5`}>
      {[1, 2, 3, 4, 5].map((index) => (
        <svg key={index} viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden="true">
          <path
            d="m10 1.6 2.47 5.3 5.53.66-4.1 3.94 1.08 5.9L10 14.6l-4.98 2.8 1.08-5.9L2 7.56l5.53-.66Z"
            fill={index <= Math.round(rating) ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinejoin="round"
            opacity={index <= Math.round(rating) ? 1 : 0.35}
          />
        </svg>
      ))}
    </span>
  );
}
