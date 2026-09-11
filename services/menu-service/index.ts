import { ServiceError, registerService } from "../kernel";
import type { Dish, ListDishesInput, MenuCategory, MenuOverview, MenuSection } from "./contract";
import { categories, dishes, menuUpdatedAt } from "./seed";

export * from "./contract";

/** Normalise une chaîne pour une recherche insensible aux accents et à la casse. */
function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function listCategories(): readonly MenuCategory[] {
  return [...categories].sort((a, b) => a.order - b.order);
}

function listDishes(input: ListDishesInput = {}): readonly Dish[] {
  const { categoryId = "all", tags = [], search = "" } = input;
  const needle = normalize(search);

  return dishes.filter((dish) => {
    if (!dish.available) return false;
    if (categoryId !== "all" && dish.categoryId !== categoryId) return false;
    if (tags.length > 0 && !tags.every((tag) => dish.tags.includes(tag))) return false;
    if (needle.length > 0) {
      const haystack = normalize(`${dish.name} ${dish.description} ${dish.origin ?? ""}`);
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });
}

function getDish(input: { slug: string }): Dish {
  const dish = dishes.find((candidate) => candidate.slug === input.slug);
  if (!dish) throw ServiceError.notFound(`Aucun plat ne correspond à « ${input.slug} ».`);
  return dish;
}

function listSignatures(input: { limit?: number } = {}): readonly Dish[] {
  const limit = input.limit ?? 4;
  return dishes.filter((dish) => dish.tags.includes("signature")).slice(0, limit);
}

function getOverview(): MenuOverview {
  const sections: MenuSection[] = listCategories().map((category) => ({
    category,
    dishes: listDishes({ categoryId: category.id }),
  }));

  return {
    sections,
    dishCount: dishes.filter((dish) => dish.available).length,
    updatedAt: menuUpdatedAt,
  };
}

/** Enregistrement du service dans le mesh. */
export const menuService = registerService({
  name: "menu",
  version: "1.2.0",
  latencyMs: 0,
  operations: {
    listCategories: () => listCategories(),
    listDishes: (payload: ListDishesInput) => listDishes(payload ?? {}),
    getDish: (payload: { slug: string }) => getDish(payload),
    listSignatures: (payload: { limit?: number }) => listSignatures(payload ?? {}),
    getOverview: () => getOverview(),
  },
});
