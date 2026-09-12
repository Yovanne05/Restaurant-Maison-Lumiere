import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { api } from "@/gateway/client";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maisonlumiere.fr"),
  title: {
    default: "Maison Lumière — Bistronomie de quartier, Paris 11e",
    template: "%s · Maison Lumière",
  },
  description:
    "Une salle en bois clair, une cuisine ouverte et une carte qui change avec le marché. Réservez votre table rue des Trois Bornes, Paris 11e.",
  keywords: [
    "restaurant Paris 11",
    "bistronomie",
    "réservation restaurant",
    "brunch Paris",
    "cuisine de marché",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Maison Lumière",
    title: "Maison Lumière — Bistronomie de quartier, Paris 11e",
    description:
      "Carte courte qui change chaque semaine, cuisine ouverte, 42 couverts. Réservation en ligne.",
    images: [{ url: "/media/venue/salle.webp", width: 1200, height: 630, alt: "La salle de Maison Lumière" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0a09",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const identity = await api.content.identity();

  return (
    <html lang="fr" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="grain min-h-dvh bg-ink antialiased">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[70] focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-ink"
        >
          Aller au contenu
        </a>
        <SiteHeader identity={identity} />
        <main id="contenu">{children}</main>
        <SiteFooter identity={identity} />
      </body>
    </html>
  );
}
