import Image from "next/image";
import type { Experience } from "@/services/content-service/contract";
import { Container, Eyebrow, Section } from "@/packages/ui/primitives";
import { Reveal } from "@/packages/ui/reveal";

export function Experiences({ experiences }: { experiences: readonly Experience[] }) {
  return (
    <Section className="border-t border-ink-line">
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow>Autrement qu&apos;à table</Eyebrow>
          <h2 className="mt-6 font-display text-[clamp(2.4rem,5.5vw,4.25rem)] leading-[1.02]">
            Trois façons de
            <span className="text-gold italic"> passer la porte</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {experiences.map((experience, index) => (
            <Reveal key={experience.id} delay={index * 110}>
              <article className="group relative flex h-full flex-col justify-end overflow-hidden rounded-4xl border border-ink-line">
                <div className="absolute inset-0">
                  <Image
                    src={experience.image.src}
                    alt={experience.image.alt}
                    fill
                    sizes="(min-width: 1024px) 32vw, 90vw"
                    className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/25" />
                </div>

                <div className="relative flex min-h-[26rem] flex-col justify-end p-7 sm:p-8">
                  <p className="text-[11px] tracking-[0.2em] text-gold uppercase">
                    {experience.priceLabel}
                  </p>
                  <h3 className="mt-3 font-display text-3xl leading-tight">{experience.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-sand/75">
                    {experience.description}
                  </p>
                  <p className="mt-5 border-t border-cream/12 pt-4 text-xs tracking-[0.14em] text-mist uppercase">
                    {experience.detail}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
