/**
 * The item after the one at `index`, wrapping around at the end, so the last case
 * study links back to the first. Throws on an empty list or an index outside it.
 */
export function nextInLoop<T>(items: readonly T[], index: number): T {
  if (!Number.isInteger(index) || index < 0 || index >= items.length) {
    throw new RangeError(`Index ${String(index)} is outside a list of ${String(items.length)}`);
  }
  // `items` is non-empty here, so the modulo always lands on an element.
  return items[(index + 1) % items.length] as T;
}
