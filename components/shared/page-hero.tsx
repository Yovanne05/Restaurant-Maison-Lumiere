import Image from "next/image";
import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/packages/ui/primitives";

/** En-tête commun aux pages intérieures. */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  image: { src: string; alt: string };
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/92 via-ink/80 to-ink" />
      </div>

      <Container className="relative pt-40 pb-16 sm:pt-48 sm:pb-20">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.8rem,8vw,6rem)] leading-[0.96] tracking-[-0.03em]">
          {title}
        </h1>
        {intro ? (
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-sand/80">{intro}</p>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
