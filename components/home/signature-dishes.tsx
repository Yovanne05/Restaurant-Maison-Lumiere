import type { Dish } from "@/services/menu-service/contract";
import { ArrowIcon, ButtonLink } from "@/packages/ui/button";
import { Container, Eyebrow, Section } from "@/packages/ui/primitives";
import { Reveal } from "@/packages/ui/reveal";
import { DishCard } from "@/components/menu/dish-card";

export function SignatureDishes({ dishes, updatedAt }: { dishes: readonly Dish[]; updatedAt: string }) {
  const updatedLabel = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(new Date(updatedAt));

  return (
    <Section id="signatures">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-2xl">
            <Eyebrow>Les incontournables</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,5.5vw,4.25rem)] leading-[1.02]">
              Quatre plats qui ne
              <span className="text-gold italic"> quittent jamais</span> la carte
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-sand/70">
              Tout le reste change. Ceux-là, on a essayé de les retirer une fois. La salle nous l&apos;a
              fait savoir.
            </p>
          </Reveal>

          <Reveal delay={120} className="flex flex-col items-start gap-4 lg:items-end">
            <p className="text-xs tracking-[0.18em] text-mist uppercase">
              Carte mise à jour le {updatedLabel}
            </p>
            <ButtonLink href="/carte" variant="outline">
              Toute la carte
              <ArrowIcon />
            </ButtonLink>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {dishes.map((dish, index) => (
            <Reveal key={dish.id} delay={index * 90}>
              <DishCard dish={dish} priority={index < 2} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
