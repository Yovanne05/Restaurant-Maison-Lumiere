import Image from "next/image";
import type { Dish } from "@/services/menu-service/contract";
import { cn } from "@/packages/ui/cn";
import { formatPrice } from "@/packages/ui/primitives";
import { TAG_LABELS } from "./dish-tags";

/** Carte illustrée : utilisée pour les signatures et la carte complète. */
export function DishCard({
  dish,
  priority = false,
  className,
}: {
  dish: Dish;
  priority?: boolean;
  className?: string;
}) {
  const image = dish.image;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-4xl border border-ink-line bg-ink-raised/60 transition-colors duration-500 hover:border-gold/35",
        className,
      )}
    >
      {image ? (
        <div className="relative aspect-4/3 overflow-hidden">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 90vw"
            className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/5 to-transparent" />
          {dish.tags.includes("signature") ? (
            <span className="absolute top-4 left-4 rounded-full bg-gold px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-ink uppercase">
              Signature
            </span>
          ) : null}
        </div>
      ) : (
        <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden bg-gradient-to-br from-ink-hover to-ink">
          <span
            className="font-display text-7xl text-gold/25 italic select-none"
            aria-hidden="true"
          >
            {dish.name.slice(0, 1)}
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-2xl leading-tight text-cream">{dish.name}</h3>
          <span className="shrink-0 font-display text-xl text-gold">
            {formatPrice(dish.priceCents)}
          </span>
        </div>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-sand/70">{dish.description}</p>

        {dish.origin ? (
          <p className="mt-4 text-xs tracking-[0.12em] text-mist uppercase">{dish.origin}</p>
        ) : null}

        {dish.tags.length > 0 ? (
          <ul className="mt-5 flex flex-wrap gap-2">
            {dish.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-sand/18 px-2.5 py-1 text-[11px] tracking-[0.1em] text-sand/70 uppercase"
              >
                {TAG_LABELS[tag]}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

/** Ligne de carte : pour les rubriques sans photo, comme le bar. */
export function DishRow({ dish }: { dish: Dish }) {
  return (
    <article className="group flex items-baseline gap-4 border-b border-ink-line py-5 transition-colors duration-400 hover:border-gold/30">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-display text-xl text-cream transition-colors duration-300 group-hover:text-gold-soft">
            {dish.name}
          </h3>
          {dish.tags.map((tag) => (
            <span key={tag} className="text-[10px] tracking-[0.16em] text-mist uppercase">
              {TAG_LABELS[tag]}
            </span>
          ))}
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-sand/65">{dish.description}</p>
      </div>
      <span
        className="hidden h-px flex-1 self-end bg-ink-line sm:block"
        aria-hidden="true"
        style={{ marginBottom: "0.55rem" }}
      />
      <span className="shrink-0 font-display text-lg text-gold">{formatPrice(dish.priceCents)}</span>
    </article>
  );
}
