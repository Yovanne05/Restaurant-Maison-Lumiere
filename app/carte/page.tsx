import type { Metadata } from "next";
import { api } from "@/gateway/client";
import { PageHero } from "@/components/shared/page-hero";
import { MenuBrowser } from "@/components/menu/menu-browser";

export const metadata: Metadata = {
  title: "La carte",
  description:
    "Vingt lignes qui changent avec le marché : entrées, plats, desserts, brunch du week-end et carte du bar. Allergènes et origines indiqués.",
};

export default async function CartePage() {
  const [categories, dishes, overview] = await Promise.all([
    api.menu.categories(),
    api.menu.dishes(),
    api.menu.overview(),
  ]);

  const updatedLabel = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    timeZone: "Europe/Paris",
  }).format(new Date(overview.updatedAt));

  return (
    <>
      <PageHero
        eyebrow="La carte"
        title={
          <>
            Vingt lignes,
            <br />
            <span className="text-gold italic">pas une de plus.</span>
          </>
        }
        intro="Elle est courte parce qu'elle change. Ce qui manque un jour revient le suivant, et ce qui ne revient pas n'était pas assez bon."
        image={{
          src: "/media/venue/table-service.jpg",
          alt: "Assiette dressée posée sur une table du restaurant",
        }}
      >
        <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-8 border-t border-cream/12 pt-8 sm:grid-cols-3">
          <div>
            <dt className="text-[11px] tracking-[0.2em] text-mist uppercase">Références</dt>
            <dd className="mt-2 font-display text-3xl text-gold">{overview.dishCount}</dd>
          </div>
          <div>
            <dt className="text-[11px] tracking-[0.2em] text-mist uppercase">Mise à jour</dt>
            <dd className="mt-2 font-display text-3xl text-cream">{updatedLabel}</dd>
          </div>
          <div>
            <dt className="text-[11px] tracking-[0.2em] text-mist uppercase">Menu du midi</dt>
            <dd className="mt-2 font-display text-3xl text-cream">24 €</dd>
          </div>
        </dl>
      </PageHero>

      <MenuBrowser categories={categories} initialDishes={dishes} />
    </>
  );
}
