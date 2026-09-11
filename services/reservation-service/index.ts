import { ServiceError, registerService } from "../kernel";
import type {
  Availability,
  AvailabilityQuery,
  BookingPolicy,
  Reservation,
  ReservationDraft,
  ServiceSlotId,
  ServiceWindow,
  Slot,
} from "./contract";

export * from "./contract";

/**
 * Chaque micro-service possède ses propres données : le planning des services
 * est volontairement dupliqué ici plutôt que partagé avec content-service.
 * Les horaires affichés sur le site et les créneaux réservables sont deux
 * responsabilités distinctes, qui n'évoluent pas au même rythme.
 */
const WEEKLY_SCHEDULE: Readonly<Record<number, readonly ServiceSlotId[]>> = {
  0: ["brunch"],
  1: [],
  2: ["dejeuner", "diner"],
  3: ["dejeuner", "diner"],
  4: ["dejeuner", "diner"],
  5: ["dejeuner", "diner"],
  6: ["brunch", "diner"],
};

const WINDOW_DEFINITIONS: Readonly<
  Record<ServiceSlotId, { label: string; from: string; to: string }>
> = {
  brunch: { label: "Brunch", from: "10:00", to: "14:30" },
  dejeuner: { label: "Déjeuner", from: "12:00", to: "14:00" },
  diner: { label: "Dîner", from: "19:00", to: "22:00" },
};

const SEATS_PER_SLOT = 22;

const policy: BookingPolicy = {
  maxPartySize: 24,
  maxPartySizeOnline: 8,
  holdMinutes: 15,
  cancellationHours: 4,
  closedWeekdays: [1],
  notes: [
    "Au-delà de 8 couverts, écrivez-nous : la grande tablée se réserve à la main.",
    "La table est gardée 15 minutes après l'heure réservée.",
    "Annulation gratuite jusqu'à 4 heures avant le service.",
  ],
};

/** Base de données en mémoire : elle disparaît au rechargement, comme prévu. */
const store = new Map<string, Reservation>();

/* -------------------------------------------------------------------------- */
/* Utilitaires                                                                 */
/* -------------------------------------------------------------------------- */

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function parseDate(value: string): Date {
  if (!ISO_DATE.test(value)) {
    throw ServiceError.validation("Date invalide.", { date: "Format attendu : AAAA-MM-JJ." });
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(date.getTime())) {
    throw ServiceError.validation("Date invalide.", { date: "Cette date n'existe pas." });
  }
  return date;
}

/** Hash stable : la disponibilité doit être identique sur le serveur et le client. */
function hash(value: string): number {
  let acc = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    acc ^= value.charCodeAt(index);
    acc = Math.imul(acc, 16777619);
  }
  return Math.abs(acc);
}

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function toTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

function buildWindow(date: string, id: ServiceSlotId, partySize: number): ServiceWindow {
  const definition = WINDOW_DEFINITIONS[id];
  const slots: Slot[] = [];

  for (
    let minutes = toMinutes(definition.from);
    minutes <= toMinutes(definition.to);
    minutes += 30
  ) {
    const time = toTime(minutes);
    const booked = hash(`${date}|${id}|${time}`) % (SEATS_PER_SLOT + 4);
    const seatsLeft = Math.max(0, SEATS_PER_SLOT - booked);
    const status: Slot["status"] =
      seatsLeft < partySize ? "full" : seatsLeft < partySize + 4 ? "limited" : "free";
    slots.push({ time, status, seatsLeft });
  }

  return { id, label: definition.label, slots };
}

/* -------------------------------------------------------------------------- */
/* Opérations                                                                  */
/* -------------------------------------------------------------------------- */

function getPolicy(): BookingPolicy {
  return policy;
}

function getAvailability(input: AvailabilityQuery): Availability {
  const partySize = Math.trunc(input.partySize);
  if (!Number.isFinite(partySize) || partySize < 1 || partySize > policy.maxPartySizeOnline) {
    throw ServiceError.validation("Nombre de couverts hors limites.", {
      partySize: `Entre 1 et ${policy.maxPartySizeOnline} en ligne.`,
    });
  }

  const date = parseDate(input.date);
  const weekday = date.getUTCDay();
  const windowIds = WEEKLY_SCHEDULE[weekday] ?? [];

  if (windowIds.length === 0) {
    return {
      date: input.date,
      partySize,
      open: false,
      closedReason: "La maison est fermée le lundi. Rendez-vous dès mardi midi.",
      windows: [],
    };
  }

  return {
    date: input.date,
    partySize,
    open: true,
    closedReason: null,
    windows: windowIds.map((id) => buildWindow(input.date, id, partySize)),
  };
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+0-9][0-9 .\-()]{7,}$/;

function validateDraft(draft: ReservationDraft): Record<string, string> {
  const errors: Record<string, string> = {};

  if (draft.firstName.trim().length < 2) errors.firstName = "Indiquez votre prénom.";
  if (draft.lastName.trim().length < 2) errors.lastName = "Indiquez votre nom.";
  if (!EMAIL.test(draft.email.trim())) errors.email = "Adresse e-mail invalide.";
  if (!PHONE.test(draft.phone.trim())) errors.phone = "Numéro de téléphone invalide.";
  if (draft.notes.length > 400) errors.notes = "400 caractères maximum.";

  return errors;
}

function createReference(draft: ReservationDraft): string {
  const seed = hash(`${draft.date}${draft.time}${draft.email}${Date.now()}`);
  return `ML-${seed.toString(36).toUpperCase().padStart(6, "0").slice(0, 6)}`;
}

function create(draft: ReservationDraft): Reservation {
  const errors = validateDraft(draft);
  if (Object.keys(errors).length > 0) {
    throw ServiceError.validation("Le formulaire comporte des erreurs.", errors);
  }

  const availability = getAvailability({ date: draft.date, partySize: draft.partySize });
  if (!availability.open) {
    throw new ServiceError("UNAVAILABLE", availability.closedReason ?? "Service fermé ce jour-là.");
  }

  const slot = availability.windows
    .flatMap((window) => window.slots)
    .find((candidate) => candidate.time === draft.time);

  if (!slot) {
    throw ServiceError.notFound("Ce créneau n'existe pas pour cette date.");
  }
  if (slot.status === "full") {
    throw new ServiceError("UNAVAILABLE", "Ce créneau vient d'être complet. Choisissez-en un autre.");
  }

  const reservation: Reservation = {
    ...draft,
    reference: createReference(draft),
    status: "confirmee",
    createdAt: new Date().toISOString(),
    table: draft.partySize >= 6 ? "Grande tablée" : draft.partySize >= 3 ? "Salle" : "Comptoir",
  };

  store.set(reservation.reference, reservation);
  return reservation;
}

function get(input: { reference: string }): Reservation {
  const reservation = store.get(input.reference.toUpperCase());
  if (!reservation) {
    throw ServiceError.notFound(`Aucune réservation sous la référence ${input.reference}.`);
  }
  return reservation;
}

/** Enregistrement du service dans le mesh. */
export const reservationService = registerService({
  name: "reservation",
  version: "2.0.1",
  // Latence assumée : elle rend visibles les états de chargement du parcours.
  latencyMs: 320,
  operations: {
    getPolicy: () => getPolicy(),
    getAvailability: (payload: AvailabilityQuery) => getAvailability(payload),
    create: (payload: ReservationDraft) => create(payload),
    get: (payload: { reference: string }) => get(payload),
  },
});
