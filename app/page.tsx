import { api } from "@/gateway/client";
import { Marquee } from "@/packages/ui/primitives";
import { Hero } from "@/components/home/hero";
import { SignatureDishes } from "@/components/home/signature-dishes";
import { Manifesto } from "@/components/home/manifesto";
import { Experiences } from "@/components/home/experiences";
import { Gallery } from "@/components/home/gallery";
import { Reviews } from "@/components/home/reviews";
import { BookingCta } from "@/components/home/booking-cta";

const MARQUEE = [
  "Cuisine ouverte",
  "Carte hebdomadaire",
  "42 couverts",
  "Pain maison",
  "Neuf producteurs",
  "Brunch le week-end",
];

export default async function HomePage() {
  const [identity, hours, values, experiences, gallery, signatures, overview, reviews, summary] =
    await Promise.all([
      api.content.identity(),
      api.content.openingHours(),
      api.content.values(),
      api.content.experiences(),
      api.content.gallery(8),
      api.menu.signatures(4),
      api.menu.overview(),
      api.review.list({ limit: 4 }),
      api.review.summary(),
    ]);

  return (
    <>
      <Hero identity={identity} summary={summary} hours={hours} />
      <Marquee items={MARQUEE} />
      <SignatureDishes dishes={signatures} updatedAt={overview.updatedAt} />
      <Manifesto values={values} />
      <Experiences experiences={experiences} />
      <Gallery items={gallery} />
      <Reviews reviews={reviews} summary={summary} />
      <BookingCta identity={identity} hours={hours} />
    </>
  );
}
