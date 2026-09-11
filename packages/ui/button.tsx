import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "./cn";

type Variant = "primary" | "outline" | "ghost";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full font-sans font-medium tracking-tight transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:cursor-not-allowed disabled:opacity-45";

const variants: Record<Variant, string> = {
  primary:
    "bg-gold text-ink hover:bg-gold-soft hover:shadow-[0_18px_50px_-20px_rgba(214,167,92,0.75)]",
  outline:
    "border border-sand/30 text-cream hover:border-gold/70 hover:bg-gold/10 hover:text-gold-soft",
  ghost: "text-sand hover:text-gold-soft",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;
type AnchorProps = CommonProps & { href: string } & Omit<
    ComponentPropsWithoutRef<"a">,
    "className" | "children" | "href"
  >;

function classes(variant: Variant, size: Size, className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={classes(variant, size, className)} {...props}>
      <span className="relative z-10 flex items-center gap-2.5">{children}</span>
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: AnchorProps) {
  return (
    <Link href={href} className={classes(variant, size, className)} {...props}>
      <span className="relative z-10 flex items-center gap-2.5">{children}</span>
    </Link>
  );
}

/** Petite flèche animée, partagée par les appels à l'action. */
export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn(
        "h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-1",
        className,
      )}
    >
      <path
        d="M2.5 8h10.5M9 3.5 13.5 8 9 12.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
