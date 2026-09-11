import { ArrowIcon, ButtonLink } from "@/packages/ui/button";
import { Container } from "@/packages/ui/primitives";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center py-32">
      <Container>
        <p className="text-[11px] tracking-[0.3em] text-gold uppercase">Erreur 404</p>
        <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.6rem,8vw,6rem)] leading-[0.96]">
          Cette page a quitté
          <span className="text-gold italic"> la carte.</span>
        </h1>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-sand/70">
          Comme le reste chez nous, elle a dû changer avec la saison. Reprenons depuis la salle.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/" size="lg">
            Retour à l&apos;accueil
            <ArrowIcon />
          </ButtonLink>
          <ButtonLink href="/carte" variant="outline" size="lg">
            Voir la carte
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
