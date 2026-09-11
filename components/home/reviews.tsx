import type { Review, ReviewSummary } from "@/services/review-service";
import { Container, Eyebrow, Section, Stars } from "@/packages/ui/primitives";
import { Reveal } from "@/packages/ui/reveal";

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  month: "long",
  year: "numeric",
  timeZone: "Europe/Paris",
});

export function Reviews({
  reviews,
  summary,
}: {
  reviews: readonly Review[];
  summary: ReviewSummary;
}) {
  const fiveStarShare = Math.round((summary.distribution["5"] / summary.total) * 100);

  return (
    <Section className="border-t border-ink-line">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal>
            <Eyebrow>Ce qu&apos;on en dit</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,5.5vw,4.25rem)] leading-[1.02]">
              {summary.average.toFixed(1)}
              <span className="text-mist">/5</span>
            </h2>
            <div className="mt-4 flex items-center gap-3">
              <Stars rating={summary.average} className="scale-125 origin-left" />
              <span className="text-sm text-sand/70">
                {summary.total.toLocaleString("fr-FR")} avis
              </span>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-sand/70">
              {fiveStarShare} % des clients mettent la note maximale. Nous répondons à tous les avis,
              y compris ceux qui piquent.
            </p>

            <ul className="mt-9 space-y-3">
              {summary.sources.map((source) => (
                <li key={source.source}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-sand/75">{source.source}</span>
                    <span className="text-mist">{source.count.toLocaleString("fr-FR")}</span>
                  </div>
                  <div className="mt-2 h-px w-full bg-ink-line">
                    <div
                      className="h-px bg-gold/70"
                      style={{ width: `${(source.count / summary.total) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {reviews.map((review, index) => (
              <Reveal key={review.id} delay={index * 90}>
                <figure className="flex h-full flex-col rounded-4xl border border-ink-line bg-ink-raised/50 p-7 transition-colors duration-500 hover:border-gold/30">
                  <Stars rating={review.rating} />
                  <blockquote className="mt-5 flex-1 text-[0.95rem] leading-relaxed text-sand/85">
                    « {review.body} »
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-ink-line pt-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 font-display text-sm text-gold">
                      {review.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-cream">{review.author}</span>
                      <span className="block text-xs text-mist">
                        {review.source} · {dateFormat.format(new Date(review.publishedAt))}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
