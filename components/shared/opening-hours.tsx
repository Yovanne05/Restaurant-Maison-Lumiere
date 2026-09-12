"use client";

import { useSyncExternalStore } from "react";
import type { OpeningDay } from "@/services/content-service/contract";
import { describeToday, parisWeekday } from "@/lib/schedule";
import { cn } from "@/packages/ui/cn";

/**
 * Le site est exporté en statique : le jour courant ne peut donc pas être
 * calculé à la compilation, sinon « aujourd'hui » resterait figé sur la date
 * du build. On le résout dans le navigateur, après le premier rendu.
 *
 * Avant que le jour soit connu, on affiche une formulation qui reste vraie
 * toute la semaine plutôt qu'une information fausse.
 */
const subscribe = () => () => {};
const serverSnapshot = () => null;

function useParisWeekday(): number | null {
  return useSyncExternalStore(subscribe, parisWeekday, serverSnapshot);
}

const FALLBACK = "Du mardi au dimanche";

/** Résumé des services du jour, en une ligne. */
export function TodayLabel({ hours, className }: { hours: readonly OpeningDay[]; className?: string }) {
  const weekday = useParisWeekday();
  return (
    <span className={className}>
      {weekday === null ? FALLBACK : describeToday(hours, weekday)}
    </span>
  );
}

/** Semaine complète, le jour courant mis en avant une fois connu. */
export function OpeningHours({
  hours,
  variant = "compact",
  className,
}: {
  hours: readonly OpeningDay[];
  variant?: "compact" | "detailed";
  className?: string;
}) {
  const weekday = useParisWeekday();
  const detailed = variant === "detailed";

  return (
    <ul
      className={cn("divide-y divide-ink-line border-y border-ink-line", className)}>
      {hours.map((day) => {
        const today = day.index === weekday;
        return (
          <li
            key={day.weekday}
            className={cn(
              "flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1",
              detailed ? "py-4" : "py-3 text-sm",
              today ? "text-cream" : "text-sand/65",
            )}
          >
            <span className="flex items-center gap-3">
              <span
                className={cn("h-1.5 w-1.5 rounded-full", today ? "bg-gold" : "bg-transparent")}
                aria-hidden="true"
              />
              <span className={detailed ? "font-display text-xl" : undefined}>{day.weekday}</span>
              {today && !detailed ? (
                <span className="text-xs text-gold">aujourd&apos;hui</span>
              ) : null}
            </span>
            <span className={cn(detailed && "text-sm", day.closed && "text-mist")}>
              {day.closed
                ? "Fermé"
                : day.services
                    .map((service) => (detailed ? `${service.label} ${service.range}` : service.range))
                    .join(detailed ? "   ·   " : " · ")}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
