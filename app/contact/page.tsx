import type { Metadata } from "next";
import { api } from "@/gateway/client";
import { describeToday, parisWeekday } from "@/lib/schedule";
import { ArrowIcon, ButtonLink } from "@/packages/ui/button";
import { cn } from "@/packages/ui/cn";
import { Container, Eyebrow, Section } from "@/packages/ui/primitives";
import { Reveal } from "@/packages/ui/reveal";
import { PageHero } from "@/components/shared/page-hero";

export const metadata: Metadata = {
  title: "Nous trouver",
  description:
    "18 rue des Trois Bornes, Paris 11e. Horaires, accès en métro, accessibilité et réponses aux questions les plus fréquentes.",
};

/**
 * Le repère « aujourd'hui » dépend de la date : on régénère la page chaque heure
 * plutôt que de figer le jour au moment du build.
 */
export const revalidate = 3600;

const ACCESS = [
  { label: "Métro", value: "Parmentier (ligne 3), 4 min à pied" },
  { label: "Métro", value: "Oberkampf (lignes 5 et 9), 7 min à pied" },
  { label: "Vélo", value: "Station Vélib' rue Saint-Maur, 80 m" },
  { label: "Accessibilité", value: "Salle de plain-pied, toilettes adaptées" },
];

export default async function ContactPage() {
  const [identity, hours, faq] = await Promise.all([
    api.content.identity(),
    api.content.openingHours(),
    api.content.faq(),
  ]);

  const weekday = parisWeekday();

  return (
    <>
      <PageHero
        eyebrow="Nous trouver"
        title={
          <>
            Rue des
            <br />
            <span className="text-gold italic">Trois Bornes.</span>
          </>
        }
        intro={`${identity.addressLine}, ${identity.postalCode} ${identity.city}. Entre Parmentier et Oberkampf, la façade bleu nuit avec la verrière allumée.`}
        image={{
          src: "/media/venue/comptoir.jpg",
          alt: "Comptoir du bar avec son ardoise et ses bouteilles",
        }}
      >
        <div className="mt-12 flex flex-wrap gap-3">
          <ButtonLink href="/reserver" size="lg">
            Réserver une table
            <ArrowIcon />
          </ButtonLink>
          <ButtonLink
            href={identity.mapsUrl}
            variant="outline"
            size="lg"
            target="_blank"
            rel="noreferrer noopener"
          >
            Ouvrir dans un plan
          </ButtonLink>
        </div>
      </PageHero>

      <Section>
        <Container>
          <div className="grid gap-5 lg:grid-cols-3">
            {/* Horaires */}
            <Reveal className="lg:col-span-2">
              <div className="h-full rounded-4xl border border-ink-line bg-ink-raised/50 p-8 sm:p-10">
                <Eyebrow>Horaires</Eyebrow>
                <p className="mt-6 font-display text-2xl text-cream sm:text-3xl">
                  Aujourd&apos;hui : <span className="text-gold">{describeToday(hours, weekday)}</span>
                </p>

                <ul className="mt-9 divide-y divide-ink-line border-y border-ink-line">
                  {hours.map((day) => {
                    const today = day.index === weekday;
                    return (
                      <li
                        key={day.weekday}
                        className={cn(
                          "flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4",
                          today ? "text-cream" : "text-sand/70",
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              today ? "bg-gold" : "bg-transparent",
                            )}
                            aria-hidden="true"
                          />
                          <span className="font-display text-xl">{day.weekday}</span>
                        </span>
                        <span className={cn("text-sm", day.closed && "text-mist")}>
                          {day.closed
                            ? "Fermé"
                            : day.services
                                .map((service) => `${service.label} ${service.range}`)
                                .join("   ·   ")}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <p className="mt-7 text-sm leading-relaxed text-mist">
                  Dernière commande trente minutes avant la fermeture. Le bar reste ouvert une heure
                  de plus le vendredi et le samedi.
                </p>
              </div>
            </Reveal>

            {/* Contact direct */}
            <Reveal delay={120}>
              <div className="flex h-full flex-col gap-8 rounded-4xl border border-ink-line bg-ink-raised/50 p-8 sm:p-10">
                <div>
                  <Eyebrow>Nous joindre</Eyebrow>
                  <div className="mt-6 space-y-5">
                    <a
                      href={`tel:${identity.phone.replace(/\s/g, "")}`}
                      className="block font-display text-2xl text-cream transition-colors duration-300 hover:text-gold-soft"
                    >
                      {identity.phone}
                    </a>
                    <a
                      href={`mailto:${identity.email}`}
                      className="block text-sm text-sand/75 transition-colors duration-300 hover:text-cream"
                    >
                      {identity.email}
                    </a>
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-mist">
                    Le téléphone est décroché pendant les services. En dehors, l&apos;e-mail obtient
                    toujours une réponse le lendemain.
                  </p>
                </div>

                <div>
                  <p className="text-[11px] tracking-[0.24em] text-gold uppercase">L&apos;adresse</p>
                  <address className="mt-4 space-y-1 text-sm leading-relaxed text-sand/75 not-italic">
                    <p>{identity.addressLine}</p>
                    <p>
                      {identity.postalCode} {identity.city}
                    </p>
                  </address>
                  <p className="mt-4 text-sm leading-relaxed text-mist">
                    Façade bleu nuit, verrière allumée. Le comptoir est à gauche en entrant.
                  </p>
                </div>

                <div className="mt-auto">
                  <p className="text-[11px] tracking-[0.24em] text-gold uppercase">Nous suivre</p>
                  <ul className="mt-4 space-y-2">
                    {identity.socials.map((social) => (
                      <li key={social.label}>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="group flex items-center justify-between text-sm text-sand/75 transition-colors duration-300 hover:text-cream"
                        >
                          {social.label}
                          <ArrowIcon className="text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Accès */}
          <Reveal className="mt-5">
            <div className="rounded-4xl border border-ink-line bg-ink-raised/50 p-8 sm:p-10">
              <Eyebrow>Y venir</Eyebrow>
              <dl className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {ACCESS.map((item) => (
                  <div key={item.value}>
                    <dt className="text-[11px] tracking-[0.2em] text-mist uppercase">
                      {item.label}
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed text-sand/80">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Questions fréquentes */}
      <Section className="border-t border-ink-line">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <Reveal>
              <Eyebrow>Questions fréquentes</Eyebrow>
              <h2 className="mt-6 font-display text-[clamp(2.2rem,5vw,3.75rem)] leading-[1.04]">
                Ce qu&apos;on nous
                <span className="text-gold italic"> demande le plus</span>
              </h2>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-sand/70">
                Une question qui n&apos;est pas là ? Le téléphone reste la voie la plus rapide.
              </p>
            </Reveal>

            <Reveal delay={120} className="divide-y divide-ink-line border-y border-ink-line">
              {faq.map((entry) => (
                <details key={entry.id} className="group py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-xl text-cream transition-colors duration-300 hover:text-gold-soft">
                    {entry.question}
                    <span
                      className="relative h-4 w-4 shrink-0 text-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-open:rotate-45"
                      aria-hidden="true"
                    >
                      <span className="absolute top-1/2 left-0 h-px w-4 -translate-y-1/2 bg-current" />
                      <span className="absolute top-0 left-1/2 h-4 w-px -translate-x-1/2 bg-current" />
                    </span>
                  </summary>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-sand/70">
                    {entry.answer}
                  </p>
                </details>
              ))}
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
