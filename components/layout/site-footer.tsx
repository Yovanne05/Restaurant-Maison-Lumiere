import Link from "next/link";
import type { Identity } from "@/services/content-service/contract";
import { api } from "@/gateway/client";
import { ArrowIcon, ButtonLink } from "@/packages/ui/button";
import { Container } from "@/packages/ui/primitives";

const PLAN = [
  { href: "/carte", label: "La carte" },
  { href: "/maison", label: "La maison" },
  { href: "/reserver", label: "Réserver" },
  { href: "/contact", label: "Nous trouver" },
];

export async function SiteFooter({ identity }: { identity: Identity }) {
  const hours = await api.content.openingHours();

  return (
    <footer className="relative overflow-hidden border-t border-ink-line bg-ink-raised/30">
      <div
        className="glow-pan pointer-events-none absolute -top-40 left-1/2 h-96 w-[min(70rem,120vw)] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]"
        aria-hidden="true"
      />

      <Container className="relative py-20 sm:py-24">
        <div className="flex flex-col gap-12 border-b border-ink-line pb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">
              Il reste sûrement
              <br />
              <span className="text-gold italic">une table ce soir.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-sand/75">
              Réservation en ligne en moins d&apos;une minute, ou un simple coup de fil si vous
              préférez entendre une voix.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/reserver" size="lg">
              Réserver une table
              <ArrowIcon />
            </ButtonLink>
            <ButtonLink href={`tel:${identity.phone.replace(/\s/g, "")}`} variant="outline" size="lg">
              {identity.phone}
            </ButtonLink>
          </div>
        </div>

        <div className="grid gap-12 pt-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl">
              Maison <span className="italic">Lumière</span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist">{identity.baseline}</p>
            <p className="mt-6 text-xs tracking-[0.2em] text-mist uppercase">
              Depuis {identity.foundedYear}
            </p>
          </div>

          <div>
            <p className="text-[11px] tracking-[0.24em] text-gold uppercase">Le plan</p>
            <ul className="mt-5 space-y-3">
              {PLAN.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-sand/75 transition-colors duration-300 hover:text-cream"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] tracking-[0.24em] text-gold uppercase">Horaires</p>
            <ul className="mt-5 space-y-2.5">
              {hours.map((day) => (
                <li key={day.weekday} className="flex items-baseline justify-between gap-4 text-sm">
                  <span className="text-sand/75">{day.shortWeekday}</span>
                  <span className="text-right text-mist">
                    {day.closed ? "Fermé" : day.services.map((service) => service.range).join(" · ")}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] tracking-[0.24em] text-gold uppercase">Nous trouver</p>
            <address className="mt-5 space-y-1 text-sm leading-relaxed text-sand/75 not-italic">
              <p>{identity.addressLine}</p>
              <p>
                {identity.postalCode} {identity.city}
              </p>
              <p className="pt-3">
                <a
                  href={`mailto:${identity.email}`}
                  className="transition-colors duration-300 hover:text-cream"
                >
                  {identity.email}
                </a>
              </p>
            </address>
            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
              {identity.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-xs tracking-[0.16em] text-mist uppercase transition-colors duration-300 hover:text-gold-soft"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-ink-line pt-8 text-xs text-mist sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Maison Lumière — établissement fictif créé pour une
            démonstration.
          </p>
          <p>Photographies : Unsplash.</p>
        </div>
      </Container>
    </footer>
  );
}
