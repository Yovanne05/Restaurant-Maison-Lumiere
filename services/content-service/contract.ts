/** Contrat public du micro-service « content ». */

export interface Identity {
  readonly name: string;
  readonly baseline: string;
  readonly shortPitch: string;
  readonly addressLine: string;
  readonly postalCode: string;
  readonly city: string;
  readonly phone: string;
  readonly email: string;
  readonly mapsUrl: string;
  readonly socials: readonly { readonly label: string; readonly href: string }[];
  readonly foundedYear: number;
}

export interface OpeningDay {
  readonly weekday: string;
  readonly shortWeekday: string;
  readonly index: number;
  readonly services: readonly { readonly label: string; readonly range: string }[];
  readonly closed: boolean;
}

export interface StoryChapter {
  readonly id: string;
  readonly year: string;
  readonly title: string;
  readonly body: string;
}

export interface Value {
  readonly id: string;
  readonly title: string;
  readonly body: string;
}

export interface GalleryItem {
  readonly id: string;
  readonly src: string;
  readonly alt: string;
  readonly caption: string;
  /** Ratio d'affichage souhaité dans la mosaïque. */
  readonly shape: "grande" | "portrait" | "paysage" | "carre";
}

export interface Experience {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly detail: string;
  readonly image: { readonly src: string; readonly alt: string };
  readonly priceLabel: string;
}

export interface FaqEntry {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

export interface TeamMember {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly bio: string;
}

export interface ContentOperations {
  getIdentity(): Promise<Identity>;
  getOpeningHours(): Promise<readonly OpeningDay[]>;
  getStory(): Promise<readonly StoryChapter[]>;
  getValues(): Promise<readonly Value[]>;
  getGallery(input?: { limit?: number }): Promise<readonly GalleryItem[]>;
  getExperiences(): Promise<readonly Experience[]>;
  getFaq(): Promise<readonly FaqEntry[]>;
  getTeam(): Promise<readonly TeamMember[]>;
}
