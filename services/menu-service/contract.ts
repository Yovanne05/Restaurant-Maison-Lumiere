/** Contrat public du micro-service « menu ». */

export type MenuCategoryId = "entrees" | "plats" | "desserts" | "brunch" | "bar";

export type DishTag =
  | "signature"
  | "vegetarien"
  | "vegan"
  | "sans-gluten"
  | "de-saison"
  | "epice"
  | "a-partager";

export interface MenuCategory {
  readonly id: MenuCategoryId;
  readonly label: string;
  readonly tagline: string;
  readonly order: number;
}

export interface DishImage {
  readonly src: string;
  readonly alt: string;
}

export interface Dish {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly priceCents: number;
  readonly currency: "EUR";
  readonly categoryId: MenuCategoryId;
  readonly image: DishImage | null;
  readonly tags: readonly DishTag[];
  readonly allergens: readonly string[];
  readonly origin: string | null;
  readonly available: boolean;
}

export interface ListDishesInput {
  readonly categoryId?: MenuCategoryId | "all";
  readonly tags?: readonly DishTag[];
  readonly search?: string;
}

export interface MenuSection {
  readonly category: MenuCategory;
  readonly dishes: readonly Dish[];
}

export interface MenuOverview {
  readonly sections: readonly MenuSection[];
  readonly dishCount: number;
  readonly updatedAt: string;
}

/** Opérations exposées par le service. */
export interface MenuOperations {
  listCategories(): Promise<readonly MenuCategory[]>;
  listDishes(input?: ListDishesInput): Promise<readonly Dish[]>;
  getDish(input: { slug: string }): Promise<Dish>;
  listSignatures(input?: { limit?: number }): Promise<readonly Dish[]>;
  getOverview(): Promise<MenuOverview>;
}
