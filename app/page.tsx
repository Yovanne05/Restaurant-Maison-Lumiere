import { api } from "@/gateway/client";
import { describeToday, parisWeekday } from "@/lib/schedule";
import { Marquee } from "@/packages/ui/primitives";
import { Hero } from "@/components/home/hero";
import { SignatureDishes } from "@/components/home/signature-dishes";
import { Manifesto } from "@/components/home/manifesto";
import { Experiences } from "@/components/home/experiences";
import { Gallery } from "@/components/home/gallery";
import { Reviews } from "@/components/home/reviews";
import { BookingCta } from "@/components/home/booking-cta";

/**
 * Le repère « aujourd'hui » dépend de la date : on régénère la page chaque heure
 * plutôt que de figer le jour au moment du build.
 */
export const revalidate = 3600;

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

  const weekday = parisWeekday();

  return (
    <>
      <Hero identity={identity} summary={summary} todayLabel={describeToday(hours, weekday)} />
      <Marquee items={MARQUEE} />
      <SignatureDishes dishes={signatures} updatedAt={overview.updatedAt} />
      <Manifesto values={values} />
      <Experiences experiences={experiences} />
      <Gallery items={gallery} />
      <Reviews reviews={reviews} summary={summary} />
      <BookingCta identity={identity} hours={hours} todayIndex={weekday} />
    </>
  );
}
