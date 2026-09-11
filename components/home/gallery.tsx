import Image from "next/image";
import type { GalleryItem } from "@/services/content-service/contract";
import { cn } from "@/packages/ui/cn";
import { Container, Eyebrow, Section } from "@/packages/ui/primitives";
import { Reveal } from "@/packages/ui/reveal";

/**
 * Gabarits de la mosaïque. Les hauteurs viennent des rangées automatiques ;
 * sur quatre colonnes, les huit gabarits pavent exactement un bloc 4 × 4.
 */
const SHAPES: Record<GalleryItem["shape"], string> = {
  grande: "col-span-2 row-span-2",
  paysage: "col-span-1 row-span-1 sm:col-span-2",
  portrait: "col-span-1 row-span-2",
  carre: "col-span-1 row-span-1",
};

export function Gallery({ items }: { items: readonly GalleryItem[] }) {
  return (
    <Section className="border-t border-ink-line">
      <Container>
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <Eyebrow>En images</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,5.5vw,4.25rem)] leading-[1.02]">
              Un mardi soir
              <span className="text-gold italic"> ordinaire</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-sand/65">
            Aucune de ces photos n&apos;a été prise un jour de reportage. C&apos;est la salle telle
            qu&apos;elle est.
          </p>
        </Reveal>

        <div className="mt-14 grid auto-rows-[9rem] grid-flow-dense grid-cols-2 gap-4 sm:auto-rows-[13rem] sm:grid-cols-4">
          {items.map((item, index) => (
            <Reveal
              key={item.id}
              delay={(index % 4) * 80}
              className={cn("group relative overflow-hidden rounded-3xl", SHAPES[item.shape])}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 640px) 25vw, 50vw"
                className="object-cover transition-transform duration-[1.3s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.09]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <p className="absolute inset-x-5 bottom-5 translate-y-2 text-sm text-cream opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
                {item.caption}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
