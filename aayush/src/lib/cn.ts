export type ClassValue = string | false | null | undefined;

/** Minimal class-name joiner — avoids pulling in a dependency for six lines. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
