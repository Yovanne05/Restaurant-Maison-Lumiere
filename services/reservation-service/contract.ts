/** Contrat public du micro-service « reservation ». */

export type ServiceSlotId = "brunch" | "dejeuner" | "diner";

export type SlotStatus = "free" | "limited" | "full";

export interface Slot {
  /** Heure au format HH:mm. */
  readonly time: string;
  readonly status: SlotStatus;
  readonly seatsLeft: number;
}

export interface ServiceWindow {
  readonly id: ServiceSlotId;
  readonly label: string;
  readonly slots: readonly Slot[];
}

export interface AvailabilityQuery {
  /** Date au format ISO court : YYYY-MM-DD. */
  readonly date: string;
  readonly partySize: number;
}

export interface Availability {
  readonly date: string;
  readonly partySize: number;
  readonly open: boolean;
  readonly closedReason: string | null;
  readonly windows: readonly ServiceWindow[];
}

export type Occasion = "aucune" | "anniversaire" | "affaires" | "amoureux" | "famille";

export interface ReservationDraft {
  readonly date: string;
  readonly time: string;
  readonly partySize: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone: string;
  readonly occasion: Occasion;
  readonly notes: string;
}

export type ReservationStatus = "confirmee" | "en-attente" | "annulee";

export interface Reservation extends ReservationDraft {
  readonly reference: string;
  readonly status: ReservationStatus;
  readonly createdAt: string;
  readonly table: string;
}

export interface BookingPolicy {
  readonly maxPartySize: number;
  readonly maxPartySizeOnline: number;
  readonly holdMinutes: number;
  readonly cancellationHours: number;
  readonly closedWeekdays: readonly number[];
  readonly notes: readonly string[];
}

export interface ReservationOperations {
  getPolicy(): Promise<BookingPolicy>;
  getAvailability(input: AvailabilityQuery): Promise<Availability>;
  create(input: ReservationDraft): Promise<Reservation>;
  get(input: { reference: string }): Promise<Reservation>;
}
