import Image from "next/image";
import type { Value } from "@/services/content-service/contract";
import { Container, Eyebrow, Section } from "@/packages/ui/primitives";
import { Reveal } from "@/packages/ui/reveal";

const NUMBERS = [
  { value: "42", label: "couverts en salle" },
  { value: "12", label: "lignes sur la carte" },
  { value: "9", label: "producteurs partenaires" },
  { value: "250", label: "km au plus loin" },
];

export function Manifesto({ values }: { values: readonly Value[] }) {
  return (
    <Section className="border-t border-ink-line">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <Reveal>
            <Eyebrow>Notre façon de faire</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,5.5vw,4.25rem)] leading-[1.02]">
              On cuisine ce qui arrive,
              <br />
              <span className="text-gold italic">pas ce qui se vend.</span>
            </h2>

            <div className="mt-12 space-y-px overflow-hidden rounded-4xl border border-ink-line">
              {values.map((value) => (
                <div
                  key={value.id}
                  className="group bg-ink-raised/50 p-7 transition-colors duration-500 hover:bg-ink-hover sm:p-8"
                >
                  <h3 className="font-display text-xl text-cream transition-colors duration-400 group-hover:text-gold-soft">
                    {value.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-sand/70">{value.body}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={140} className="flex flex-col gap-8">
            <div className="relative aspect-4/5 overflow-hidden rounded-5xl">
              <Image
                src="/media/venue/marche.webp"
                alt="Étal de légumes frais préparés pour le service"
                fill
                sizes="(min-width: 1024px) 42vw, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <p className="absolute inset-x-7 bottom-7 font-display text-2xl leading-snug text-cream italic">
                « La carte du soir s&apos;écrit à midi, une fois les cageots ouverts. »
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-4xl border border-ink-line bg-ink-line">
              {NUMBERS.map((item) => (
                <div key={item.label} className="bg-ink px-6 py-8">
                  <dt className="font-display text-5xl text-gold">{item.value}</dt>
                  <dd className="mt-2 text-xs tracking-[0.16em] text-mist uppercase">
                    {item.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
