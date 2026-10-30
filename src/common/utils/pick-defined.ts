/** Removes `undefined` entries while keeping explicit `null` values (they clear a column). */
export function pickDefined<T extends object>(source: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(source).filter(([, value]) => value !== undefined),
  ) as Partial<T>;
}
