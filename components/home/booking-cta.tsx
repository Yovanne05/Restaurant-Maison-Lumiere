import Image from "next/image";
import type { Identity, OpeningDay } from "@/services/content-service/contract";
import { ArrowIcon, ButtonLink } from "@/packages/ui/button";
import { Container, Eyebrow, Section } from "@/packages/ui/primitives";
import { Reveal } from "@/packages/ui/reveal";
import { OpeningHours } from "@/components/shared/opening-hours";

export function BookingCta({
  identity,
  hours,
}: {
  identity: Identity;
  hours: readonly OpeningDay[];
}) {
  return (
    <Section className="border-t border-ink-line">
      <Container>
        <div className="overflow-hidden rounded-5xl border border-ink-line bg-ink-raised/40">
          <div className="grid lg:grid-cols-2">
            <Reveal className="relative min-h-[22rem] lg:min-h-full">
              <Image
                src="/media/venue/vitrine.webp"
                alt="Vitrine éclairée du restaurant vue depuis la rue, le soir"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent lg:bg-gradient-to-r" />
            </Reveal>

            <Reveal delay={120} className="p-8 sm:p-12 lg:p-14">
              <Eyebrow>Réserver</Eyebrow>
              <h2 className="mt-6 font-display text-[clamp(2.1rem,4.4vw,3.4rem)] leading-[1.04]">
                Dites-nous quand,
                <br />
                <span className="text-gold italic">on garde la table.</span>
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-sand/70">
                Choisissez le jour, le nombre de couverts et l&apos;heure. La confirmation est
                immédiate et modifiable jusqu&apos;à quatre heures avant le service.
              </p>

              <OpeningHours hours={hours} className="mt-10" />

              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="/reserver" size="lg">
                  Choisir un créneau
                  <ArrowIcon />
                </ButtonLink>
                <ButtonLink
                  href={`tel:${identity.phone.replace(/\s/g, "")}`}
                  variant="outline"
                  size="lg"
                >
                  Appeler la maison
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
