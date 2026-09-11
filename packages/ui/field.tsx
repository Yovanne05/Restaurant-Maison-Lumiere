import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "./cn";

const control =
  "w-full rounded-2xl border border-sand/20 bg-ink-raised/70 px-4 py-3.5 text-cream placeholder:text-mist/70 transition-colors duration-300 hover:border-sand/35 focus:border-gold focus:outline-none focus:ring-0 disabled:opacity-50";

export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={htmlFor}
        className="text-[11px] font-medium tracking-[0.18em] text-sand/70 uppercase"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-sm text-ember">{error}</p>
      ) : hint ? (
        <p className="text-sm text-mist">{hint}</p>
      ) : null}
    </div>
  );
}

export function Input({
  className,
  invalid,
  ...props
}: ComponentPropsWithoutRef<"input"> & { invalid?: boolean }) {
  return <input className={cn(control, invalid && "border-ember/70", className)} {...props} />;
}

export function Textarea({
  className,
  invalid,
  ...props
}: ComponentPropsWithoutRef<"textarea"> & { invalid?: boolean }) {
  return (
    <textarea
      className={cn(control, "resize-none", invalid && "border-ember/70", className)}
      {...props}
    />
  );
}

export function Select({
  className,
  invalid,
  children,
  ...props
}: ComponentPropsWithoutRef<"select"> & { invalid?: boolean }) {
  return (
    <div className="relative">
      <select
        className={cn(control, "appearance-none pr-11", invalid && "border-ember/70", className)}
        {...props}
      >
        {children}
      </select>
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-sand/60"
      >
        <path
          d="m4 6.5 4 4 4-4"
          stroke="currentColor"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
