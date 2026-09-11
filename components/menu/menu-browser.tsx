"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { api } from "@/gateway/client";
import type { Dish, DishTag, MenuCategory, MenuCategoryId } from "@/services/menu-service/contract";
import { cn } from "@/packages/ui/cn";
import { Container } from "@/packages/ui/primitives";
import { DishCard, DishRow } from "./dish-card";
import { FILTERABLE_TAGS, TAG_LABELS } from "./dish-tags";

type CategoryFilter = MenuCategoryId | "all";

interface MenuBrowserProps {
  categories: readonly MenuCategory[];
  initialDishes: readonly Dish[];
}

/**
 * Navigation de la carte.
 *
 * Chaque changement de filtre repart interroger le service menu à travers la
 * gateway : rien n'est filtré à la main dans l'interface. C'est le même appel
 * que ferait un client HTTP si le service vivait ailleurs.
 */
export function MenuBrowser({ categories, initialDishes }: MenuBrowserProps) {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [tags, setTags] = useState<readonly DishTag[]>([]);
  const [search, setSearch] = useState("");
  const [dishes, setDishes] = useState<readonly Dish[]>(initialDishes);
  const [pending, startTransition] = useTransition();
  const searchId = useId();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      startTransition(async () => {
        const result = await api.menu.dishes({ categoryId: category, tags, search });
        if (!cancelled) setDishes(result);
      });
    }, 180);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [category, tags, search]);

  const grouped = useMemo(() => {
    return categories
      .map((entry) => ({
        category: entry,
        items: dishes.filter((dish) => dish.categoryId === entry.id),
      }))
      .filter((section) => section.items.length > 0);
  }, [categories, dishes]);

  const toggleTag = (tag: DishTag) => {
    setTags((current) =>
      current.includes(tag) ? current.filter((entry) => entry !== tag) : [...current, tag],
    );
  };

  const resetAll = () => {
    setCategory("all");
    setTags([]);
    setSearch("");
  };

  const filtersActive = category !== "all" || tags.length > 0 || search.trim().length > 0;

  return (
    <>
      <div className="sticky top-[4.5rem] z-40 border-y border-ink-line bg-ink/90 backdrop-blur-xl sm:top-20">
        <Container className="py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
                Tout
              </FilterChip>
              {categories.map((entry) => (
                <FilterChip
                  key={entry.id}
                  active={category === entry.id}
                  onClick={() => setCategory(entry.id)}
                >
                  {entry.label}
                </FilterChip>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor={searchId} className="sr-only">
                Rechercher un plat
              </label>
              <div className="relative flex-1 lg:w-64 lg:flex-none">
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-mist"
                >
                  <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" fill="none" />
                  <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                <input
                  id={searchId}
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Truffe, vegan, Aubrac…"
                  className="h-10 w-full rounded-full border border-sand/20 bg-ink-raised/70 pl-10 pr-4 text-sm text-cream placeholder:text-mist/70 transition-colors duration-300 focus:border-gold focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {FILTERABLE_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                aria-pressed={tags.includes(tag)}
                onClick={() => toggleTag(tag)}
                className={cn(
                  "rounded-full border px-3 py-1 text-[11px] tracking-[0.12em] uppercase transition-colors duration-300",
                  tags.includes(tag)
                    ? "border-gold bg-gold/15 text-gold-soft"
                    : "border-sand/15 text-mist hover:border-sand/35 hover:text-sand",
                )}
              >
                {TAG_LABELS[tag]}
              </button>
            ))}
            {filtersActive ? (
              <button
                type="button"
                onClick={resetAll}
                className="ml-1 text-[11px] tracking-[0.12em] text-ember uppercase transition-opacity duration-300 hover:opacity-70"
              >
                Réinitialiser
              </button>
            ) : null}
          </div>
        </Container>
      </div>

      <Container
        className={cn(
          "py-16 transition-opacity duration-300 sm:py-20",
          pending ? "opacity-45" : "opacity-100",
        )}
      >
        {grouped.length === 0 ? (
          <div className="rounded-4xl border border-dashed border-ink-line py-24 text-center">
            <p className="font-display text-3xl text-cream">Rien ne correspond.</p>
            <p className="mt-3 text-sm text-sand/65">
              Essayez un autre mot, ou retirez un filtre. La carte ne compte que vingt lignes.
            </p>
            <button
              type="button"
              onClick={resetAll}
              className="mt-7 rounded-full border border-sand/30 px-5 py-2.5 text-sm text-cream transition-colors duration-300 hover:border-gold hover:text-gold-soft"
            >
              Tout réafficher
            </button>
          </div>
        ) : (
          <div className="space-y-20 sm:space-y-24">
            {grouped.map((section) => {
              const illustrated = section.items.filter((dish) => dish.image !== null);
              const plain = section.items.filter((dish) => dish.image === null);

              return (
                <section key={section.category.id} id={section.category.id} className="scroll-mt-44">
                  <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-ink-line pb-6">
                    <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-none">
                      {section.category.label}
                    </h2>
                    <p className="text-sm text-mist italic">{section.category.tagline}</p>
                  </div>

                  {illustrated.length > 0 ? (
                    <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {illustrated.map((dish) => (
                        <DishCard key={dish.id} dish={dish} />
                      ))}
                    </div>
                  ) : null}

                  {plain.length > 0 ? (
                    <div className="mt-10">
                      {plain.map((dish) => (
                        <DishRow key={dish.id} dish={dish} />
                      ))}
                    </div>
                  ) : null}
                </section>
              );
            })}
          </div>
        )}
      </Container>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-full px-4 py-2 text-sm whitespace-nowrap transition-colors duration-300",
        active ? "bg-cream text-ink" : "text-sand/70 hover:bg-ink-hover hover:text-cream",
      )}
    >
      {children}
    </button>
  );
}
