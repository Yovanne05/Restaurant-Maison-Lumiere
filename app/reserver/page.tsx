import type { Metadata } from "next";
import { api } from "@/gateway/client";
import { Container } from "@/packages/ui/primitives";
import { PageHero } from "@/components/shared/page-hero";
import { ReservationFlow } from "@/components/reservation/reservation-flow";

export const metadata: Metadata = {
  title: "Réserver",
  description:
    "Réservez votre table en trois étapes : le jour, le créneau, vos coordonnées. Confirmation immédiate, annulation libre jusqu'à quatre heures avant.",
};

export default async function ReserverPage() {
  const policy = await api.reservation.policy();

  return (
    <>
      <PageHero
        eyebrow="Réserver"
        title={
          <>
            Trois clics,
            <br />
            <span className="text-gold italic">une table.</span>
          </>
        }
        intro="Choisissez le jour et l'heure : la disponibilité affichée est celle du plan de salle, mise à jour en direct."
        image={{
          src: "/media/venue/service.webp",
          alt: "Convives attablés en train de partager un repas",
        }}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <ReservationFlow policy={policy} />
        </Container>
      </section>
    </>
  );
}
