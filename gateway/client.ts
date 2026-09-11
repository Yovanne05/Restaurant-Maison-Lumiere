import "@/services/mesh";

import { dispatch, invoke } from "@/services/kernel";
import type { ServiceName, ServiceResponse } from "@/services/kernel";
import type {
  Dish,
  ListDishesInput,
  MenuCategory,
  MenuOverview,
} from "@/services/menu-service/contract";
import type {
  Availability,
  AvailabilityQuery,
  BookingPolicy,
  Reservation,
  ReservationDraft,
} from "@/services/reservation-service/contract";
import type {
  Experience,
  FaqEntry,
  GalleryItem,
  Identity,
  OpeningDay,
  StoryChapter,
  TeamMember,
  Value,
} from "@/services/content-service/contract";
import type { Review, ReviewSummary } from "@/services/review-service";

/**
 * Gateway applicative.
 *
 * C'est la seule porte d'entrée de l'interface vers le mesh : aucune page,
 * aucun composant n'importe un service directement. Le jour où un service part
 * derrière une vraie API HTTP, seule cette couche change d'adresse.
 */
export const api = {
  menu: {
    categories: () => invoke<readonly MenuCategory[]>("menu", "listCategories"),
    dishes: (input: ListDishesInput = {}) => invoke<readonly Dish[]>("menu", "listDishes", input),
    dish: (slug: string) => invoke<Dish>("menu", "getDish", { slug }),
    signatures: (limit = 4) => invoke<readonly Dish[]>("menu", "listSignatures", { limit }),
    overview: () => invoke<MenuOverview>("menu", "getOverview"),
  },
  reservation: {
    policy: () => invoke<BookingPolicy>("reservation", "getPolicy"),
    availability: (input: AvailabilityQuery) =>
      dispatch<Availability>("reservation", "getAvailability", input),
    create: (input: ReservationDraft) => dispatch<Reservation>("reservation", "create", input),
  },
  content: {
    identity: () => invoke<Identity>("content", "getIdentity"),
    openingHours: () => invoke<readonly OpeningDay[]>("content", "getOpeningHours"),
    story: () => invoke<readonly StoryChapter[]>("content", "getStory"),
    values: () => invoke<readonly Value[]>("content", "getValues"),
    gallery: (limit?: number) => invoke<readonly GalleryItem[]>("content", "getGallery", { limit }),
    experiences: () => invoke<readonly Experience[]>("content", "getExperiences"),
    faq: () => invoke<readonly FaqEntry[]>("content", "getFaq"),
    team: () => invoke<readonly TeamMember[]>("content", "getTeam"),
  },
  review: {
    list: (input: { limit?: number; highlightOnly?: boolean } = {}) =>
      invoke<readonly Review[]>("review", "list", input),
    summary: () => invoke<ReviewSummary>("review", "getSummary"),
  },
} as const;

/** Passe-plat brut, utilisé par l'arête HTTP de la gateway. */
export function forward<TData>(
  service: ServiceName,
  operation: string,
  payload: unknown,
): Promise<ServiceResponse<TData>> {
  return dispatch<TData>(service, operation, payload);
}
