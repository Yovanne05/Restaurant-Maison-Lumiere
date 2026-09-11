import type { DishTag } from "@/services/menu-service/contract";

/** Libellés affichables des étiquettes renvoyées par le service menu. */
export const TAG_LABELS: Readonly<Record<DishTag, string>> = {
  signature: "Signature",
  vegetarien: "Végétarien",
  vegan: "Végan",
  "sans-gluten": "Sans gluten",
  "de-saison": "De saison",
  epice: "Épicé",
  "a-partager": "À partager",
};

/** Étiquettes proposées comme filtres sur la carte. */
export const FILTERABLE_TAGS: readonly DishTag[] = [
  "signature",
  "vegetarien",
  "vegan",
  "sans-gluten",
  "a-partager",
];
