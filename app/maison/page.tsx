import type { Metadata } from "next";
import Image from "next/image";
import { api } from "@/gateway/client";
import { ArrowIcon, ButtonLink } from "@/packages/ui/button";
import { Container, Eyebrow, Marquee, Section } from "@/packages/ui/primitives";
import { Reveal } from "@/packages/ui/reveal";
import { PageHero } from "@/components/shared/page-hero";
import { Gallery } from "@/components/home/gallery";

export const metadata: Metadata = {
  title: "La maison",
  description:
    "De l'ancien fournil de 2017 aux quarante-deux couverts d'aujourd'hui : l'histoire, l'équipe et la façon de travailler de Maison Lumière.",
};

const MARQUEE = [
  "Fait maison",
  "Circuit court",
  "Pain au levain",
  "Cuisine ouverte",
  "Zéro surgelé",
];

export default async function MaisonPage() {
  const [story, values, team, gallery] = await Promise.all([
    api.content.story(),
    api.content.values(),
    api.content.team(),
    api.content.gallery(8),
  ]);

  return (
    <>
      <PageHero
        eyebrow="La maison"
        title={
          <>
            Un fournil,
            <br />
            <span className="text-gold italic">une verrière,</span>
            <br />
            beaucoup de bruit.
          </>
        }
        intro="Camille Rousseau a ouvert Maison Lumière en 2017 dans une ancienne boulangerie du 11e. Le four ne marchait plus. La lumière, si."
        image={{
          src: "/media/venue/atelier.webp",
          alt: "Grande salle lumineuse sous une verrière, avec mobilier en bois",
        }}
      />

      <Marquee items={MARQUEE} duration={38} />

      {/* Chronologie */}
      <Section>
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>Neuf ans</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,5.5vw,4.25rem)] leading-[1.02]">
              Ce qui s&apos;est passé
              <span className="text-gold italic"> entre-temps</span>
            </h2>
          </Reveal>

          <ol className="mt-14 grid gap-px overflow-hidden rounded-4xl border border-ink-line bg-ink-line md:grid-cols-2">
            {story.map((chapter, index) => (
              <li key={chapter.id}>
                <Reveal delay={(index % 2) * 110} className="h-full bg-ink p-8 sm:p-10">
                  <span className="font-display text-6xl text-gold/25">{chapter.year}</span>
                  <h3 className="mt-4 font-display text-2xl text-cream">{chapter.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-sand/70">{chapter.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Portrait + valeurs */}
      <Section className="border-t border-ink-line">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <Reveal className="relative aspect-3/4 overflow-hidden rounded-5xl lg:sticky lg:top-28">
              <Image
                src="/media/venue/brasserie.webp"
                alt="Cuisine ouverte et comptoir de dressage vus depuis la salle"
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
              <p className="absolute inset-x-8 bottom-8 font-display text-2xl leading-snug text-cream italic">
                « On ne cache rien : le piano est dans la salle. »
              </p>
            </Reveal>

            <div>
              <Reveal>
                <Eyebrow>Nos règles</Eyebrow>
                <h2 className="mt-6 font-display text-[clamp(2.2rem,5vw,3.75rem)] leading-[1.04]">
                  Quatre principes
                  <span className="text-gold italic"> jamais négociés</span>
                </h2>
              </Reveal>

              <div className="mt-12 space-y-10">
                {values.map((value, index) => (
                  <Reveal key={value.id} delay={index * 80}>
                    <div className="flex gap-6 border-t border-ink-line pt-8">
                      <span className="font-display text-xl text-gold/60">
                        0{index + 1}
                      </span>
                      <div>
                        <h3 className="font-display text-2xl text-cream">{value.title}</h3>
                        <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-sand/70">
                          {value.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Équipe */}
      <Section className="border-t border-ink-line">
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>L&apos;équipe</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,5.5vw,4.25rem)] leading-[1.02]">
              Onze personnes,
              <span className="text-gold italic"> quatre voix</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {team.map((member, index) => (
              <Reveal key={member.id} delay={index * 90}>
                <article className="flex h-full flex-col rounded-4xl border border-ink-line bg-ink-raised/50 p-7 transition-colors duration-500 hover:border-gold/35">
                  <span
                    className="font-display text-5xl text-gold/30 select-none"
                    aria-hidden="true"
                  >
                    {member.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>
                  <h3 className="mt-6 font-display text-2xl text-cream">{member.name}</h3>
                  <p className="mt-1 text-xs tracking-[0.16em] text-gold uppercase">{member.role}</p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-sand/70">{member.bio}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Gallery items={gallery} />

      <Section className="border-t border-ink-line">
        <Container>
          <Reveal className="flex flex-col items-start gap-8 rounded-5xl border border-ink-line bg-ink-raised/40 p-10 sm:p-14 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.05]">
                Le plus simple reste encore
                <span className="text-gold italic"> de venir voir.</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-sand/70">
                Le comptoir garde neuf places à chaque service, sans réservation.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/reserver" size="lg">
                Réserver
                <ArrowIcon />
              </ButtonLink>
              <ButtonLink href="/carte" variant="outline" size="lg">
                Lire la carte
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
