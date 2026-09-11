import Image from "next/image";
import type { Identity } from "@/services/content-service/contract";
import type { ReviewSummary } from "@/services/review-service";
import { ArrowIcon, ButtonLink } from "@/packages/ui/button";
import { Container, Stars } from "@/packages/ui/primitives";

export function Hero({
  identity,
  summary,
  todayLabel,
}: {
  identity: Identity;
  summary: ReviewSummary;
  todayLabel: string;
}) {
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/media/venue/salle.jpg"
          alt="Salle de Maison Lumière avec ses tables en bois clair et ses banquettes sombres"
          fill
          priority
          sizes="100vw"
          className="slow-zoom object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/55 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/25 to-transparent" />
      </div>

      <Container className="relative flex min-h-[100svh] flex-col justify-end pt-32 pb-12 sm:pb-16">
        <div className="max-w-3xl">
          <p className="flex items-center gap-3 text-[11px] tracking-[0.34em] text-gold uppercase">
            <span className="hairline h-px w-10" aria-hidden="true" />
            {identity.baseline}
          </p>

          <h1 className="mt-7 font-display text-[clamp(3.1rem,10vw,7.5rem)] leading-[0.92] tracking-[-0.03em]">
            La cuisine
            <br />
            se regarde
            <br />
            <span className="text-gold italic">en face.</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-sand/85">{identity.shortPitch}</p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <ButtonLink href="/reserver" size="lg">
              Réserver une table
              <ArrowIcon />
            </ButtonLink>
            <ButtonLink href="/carte" variant="outline" size="lg">
              Voir la carte
            </ButtonLink>
          </div>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-cream/12 pt-8 sm:mt-20 lg:grid-cols-4">
          <div>
            <dt className="text-[11px] tracking-[0.22em] text-mist uppercase">Aujourd&apos;hui</dt>
            <dd className="mt-2 text-sm text-cream">{todayLabel}</dd>
          </div>
          <div>
            <dt className="text-[11px] tracking-[0.22em] text-mist uppercase">L&apos;adresse</dt>
            <dd className="mt-2 text-sm text-cream">
              {identity.addressLine}, {identity.postalCode}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] tracking-[0.22em] text-mist uppercase">Les avis</dt>
            <dd className="mt-2 flex items-center gap-2 text-sm text-cream">
              <Stars rating={summary.average} />
              {summary.average.toFixed(1)} · {summary.total.toLocaleString("fr-FR")} avis
            </dd>
          </div>
          <div>
            <dt className="text-[11px] tracking-[0.22em] text-mist uppercase">Le comptoir</dt>
            <dd className="mt-2 text-sm text-cream">9 places sans réservation</dd>
          </div>
        </dl>
      </Container>

      <div
        className="pointer-events-none absolute right-6 bottom-10 hidden flex-col items-center gap-3 lg:flex"
        aria-hidden="true"
      >
        <span className="text-[10px] tracking-[0.3em] text-mist uppercase [writing-mode:vertical-rl]">
          Faites défiler
        </span>
        <span className="h-16 w-px bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  );
}
