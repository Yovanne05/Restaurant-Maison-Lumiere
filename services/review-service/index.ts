import { registerService } from "../kernel";

/** Contrat public du micro-service « review ». */

export type ReviewSource = "Google" | "The Fork" | "Le Fooding" | "Sur place";

export interface Review {
  readonly id: string;
  readonly author: string;
  readonly initials: string;
  readonly rating: 1 | 2 | 3 | 4 | 5;
  readonly source: ReviewSource;
  readonly publishedAt: string;
  readonly body: string;
  readonly highlight: boolean;
}

export interface ReviewSummary {
  readonly average: number;
  readonly total: number;
  readonly distribution: Readonly<Record<"1" | "2" | "3" | "4" | "5", number>>;
  readonly sources: readonly { readonly source: ReviewSource; readonly count: number }[];
}

export interface ReviewOperations {
  list(input?: { limit?: number; highlightOnly?: boolean }): Promise<readonly Review[]>;
  getSummary(): Promise<ReviewSummary>;
}

const reviews: readonly Review[] = [
  {
    id: "rev_01",
    author: "Élodie Vasseur",
    initials: "EV",
    rating: 5,
    source: "Google",
    publishedAt: "2026-08-21",
    body: "La côte de cochon est la meilleure que j'aie mangée à Paris, et je pèse mes mots. Service attentif sans être collant, addition honnête. On a réservé pour le mois prochain en sortant.",
    highlight: true,
  },
  {
    id: "rev_02",
    author: "Marc Delaunay",
    initials: "MD",
    rating: 5,
    source: "The Fork",
    publishedAt: "2026-08-09",
    body: "Venu seul au comptoir un mardi soir. On m'a expliqué chaque plat sans que je demande, et j'ai fini par discuter une heure avec mes voisins de tabouret.",
    highlight: true,
  },
  {
    id: "rev_03",
    author: "Sophie Nguyen",
    initials: "SN",
    rating: 4,
    source: "Google",
    publishedAt: "2026-07-30",
    body: "Brunch du dimanche très réussi, les gaufres valent le détour. Un peu bruyant quand la salle est pleine, mais c'est aussi ce qui fait l'ambiance.",
    highlight: false,
  },
  {
    id: "rev_04",
    author: "Julien Pereira",
    initials: "JP",
    rating: 5,
    source: "Le Fooding",
    publishedAt: "2026-07-14",
    body: "Une carte courte qui change vraiment, ce qui est plus rare qu'on ne le croit. Le pesto de pistache est une idée qu'on aimerait voir ailleurs.",
    highlight: true,
  },
  {
    id: "rev_05",
    author: "Anaïs Caron",
    initials: "AC",
    rating: 5,
    source: "Sur place",
    publishedAt: "2026-06-28",
    body: "Privatisation pour les 40 ans de mon frère : vingt-huit personnes, aucun couac, et une équipe qui a tenu le rythme jusqu'à minuit passé.",
    highlight: false,
  },
  {
    id: "rev_06",
    author: "Thomas Rivière",
    initials: "TR",
    rating: 4,
    source: "Google",
    publishedAt: "2026-06-11",
    body: "Excellent rapport qualité-prix au déjeuner. Le bol du midi est copieux et franchement bon pour dix-sept euros dans ce quartier.",
    highlight: false,
  },
];

const summary: ReviewSummary = {
  average: 4.8,
  total: 1247,
  distribution: { "5": 1042, "4": 158, "3": 31, "2": 11, "1": 5 },
  sources: [
    { source: "Google", count: 842 },
    { source: "The Fork", count: 310 },
    { source: "Le Fooding", count: 61 },
    { source: "Sur place", count: 34 },
  ],
};

/** Enregistrement du service dans le mesh. */
export const reviewService = registerService({
  name: "review",
  version: "0.9.2",
  latencyMs: 0,
  operations: {
    list: (payload: { limit?: number; highlightOnly?: boolean } = {}): readonly Review[] => {
      const filtered = payload?.highlightOnly
        ? reviews.filter((review) => review.highlight)
        : reviews;
      return payload?.limit ? filtered.slice(0, payload.limit) : filtered;
    },
    getSummary: (): ReviewSummary => summary,
  },
});
