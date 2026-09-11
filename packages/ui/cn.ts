export type ClassValue = string | false | null | undefined;

/** Concaténation de classes, sans dépendance externe. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
