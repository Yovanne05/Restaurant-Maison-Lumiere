"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Identity } from "@/services/content-service/contract";
import { ArrowIcon, ButtonLink } from "@/packages/ui/button";
import { cn } from "@/packages/ui/cn";

const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/carte", label: "La carte" },
  { href: "/maison", label: "La maison" },
  { href: "/contact", label: "Nous trouver" },
] as const;

export function SiteHeader({ identity }: { identity: Identity }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        scrolled || open
          ? "border-b border-ink-line/90 bg-ink/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[4.5rem] w-full max-w-[86rem] items-center justify-between gap-6 px-5 sm:h-20 sm:px-8">
        <Link href="/" className="group flex flex-col leading-none" aria-label="Maison Lumière, accueil">
          <span className="font-display text-[1.35rem] tracking-tight text-cream transition-colors duration-500 group-hover:text-gold-soft sm:text-2xl">
            Maison <span className="italic">Lumière</span>
          </span>
          <span className="mt-1 text-[10px] tracking-[0.32em] text-mist uppercase">
            Paris · {identity.postalCode}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm transition-colors duration-400",
                  active ? "text-cream" : "text-sand/70 hover:text-cream",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-4 -bottom-0.5 h-px origin-left bg-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    active ? "scale-x-100" : "scale-x-0",
                  )}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${identity.phone.replace(/\s/g, "")}`}
            className="hidden text-sm text-sand/70 transition-colors duration-300 hover:text-gold-soft xl:block"
          >
            {identity.phone}
          </a>
          <div className="hidden sm:block">
            <ButtonLink href="/reserver">
              Réserver
              <ArrowIcon />
            </ButtonLink>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-sand/25 text-cream transition-colors duration-300 hover:border-gold/60 lg:hidden"
          >
            <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
            <span className="relative block h-3 w-5">
              <span
                className={cn(
                  "absolute left-0 h-px w-5 bg-current transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  open ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 h-px w-5 bg-current transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  open ? "top-1.5 -rotate-45" : "top-3",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        hidden={!open}
        className="border-t border-ink-line bg-ink/95 backdrop-blur-xl lg:hidden"
      >
        <nav className="flex flex-col px-5 py-6 sm:px-8" aria-label="Navigation mobile">
          {NAV.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-baseline justify-between border-b border-ink-line py-4 font-display text-3xl text-cream transition-colors duration-300 hover:text-gold-soft"
            >
              {item.label}
              <span className="text-[11px] tracking-[0.2em] text-mist">
                0{index + 1}
              </span>
            </Link>
          ))}
          <ButtonLink href="/reserver" size="lg" className="mt-7 w-full" onClick={() => setOpen(false)}>
            Réserver une table
            <ArrowIcon />
          </ButtonLink>
          <a
            href={`tel:${identity.phone.replace(/\s/g, "")}`}
            className="mt-4 text-center text-sm text-sand/70"
          >
            {identity.phone}
          </a>
        </nav>
      </div>
    </header>
  );
}
