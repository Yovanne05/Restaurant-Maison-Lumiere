import type { OpeningDay } from "@/services/content-service/contract";

const WEEKDAY_INDEX: Readonly<Record<string, number>> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/** Jour de la semaine à Paris, quelle que soit la machine qui rend la page. */
export function parisWeekday(date: Date = new Date()): number {
  const short = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Paris",
    weekday: "short",
  }).format(date);
  return WEEKDAY_INDEX[short] ?? 0;
}

/** Date du jour à Paris au format AAAA-MM-JJ, utilisable par le service réservation. */
export function parisIsoDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Résumé lisible des services du jour : « Déjeuner 12h00 – 14h30 · Dîner … ». */
export function describeToday(hours: readonly OpeningDay[], weekday = parisWeekday()): string {
  const day = hours.find((entry) => entry.index === weekday);
  if (!day) return "Horaires sur demande";
  if (day.closed) return `${day.weekday} — fermé`;
  return day.services.map((service) => `${service.label} ${service.range}`).join(" · ");
}

const LONG_DATE = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "Europe/Paris",
});

export function formatLongDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return LONG_DATE.format(new Date(Date.UTC(year, month - 1, day, 12)));
}
