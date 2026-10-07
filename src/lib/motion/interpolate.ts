const NUMBER = /-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi;

function at<T>(items: readonly T[], index: number): T {
  const item = items[index];
  if (item === undefined) throw new RangeError(`No item at ${String(index)}.`);
  return item;
}

/** Five decimals: finer than a device pixel, and never written in exponent notation. */
function round(value: number): number {
  return Math.round(value * 1e5) / 1e5;
}

function mix(from: number, to: number, progress: number): number {
  return from + (to - from) * progress;
}

/**
 * Mixes two strings of the same shape number by number, e.g. "12vh" and "-4vh", or
 * "inset(10% 14% round 24px)" and "inset(0% 0% round 24px)".
 */
function mixStrings(from: string, to: string): (progress: number) => string {
  const parts = from.split(NUMBER);
  const fromNumbers = (from.match(NUMBER) ?? []).map(Number);
  const toNumbers = (to.match(NUMBER) ?? []).map(Number);
  if (parts.join("|") !== to.split(NUMBER).join("|")) {
    throw new Error(`Can't interpolate between "${from}" and "${to}": they differ in shape.`);
  }
  return (progress) =>
    fromNumbers.reduce(
      (result, a, index) =>
        result + String(round(mix(a, at(toNumbers, index), progress))) + at(parts, index + 1),
      at(parts, 0),
    );
}

/** Mixing never changes the kind of value, so the result has the inputs' type `T`. */
function mixer<T extends number | string>(from: T, to: T): (progress: number) => T {
  if (typeof from === "number" && typeof to === "number") {
    return (progress) => mix(from, to, progress) as T;
  }
  return mixStrings(String(from), String(to)) as (progress: number) => T;
}

/**
 * Maps a number through a piecewise-linear track, like keyframes: `input` holds the
 * stops in ascending order and `output` what each stop maps to. Outside the track the
 * value holds at the first or last output. Outputs are numbers, or strings of one
 * shape whose numbers are interpolated in place.
 */
export function interpolate<T extends number | string>(
  input: readonly number[],
  output: readonly T[],
): (value: number) => T {
  if (input.length < 2 || input.length !== output.length) {
    throw new Error("interpolate needs at least two stops, and as many outputs as inputs.");
  }
  const segments = input.slice(1).map((end, index) => ({
    start: at(input, index),
    end,
    mix: mixer(at(output, index), at(output, index + 1)),
  }));
  const first = at(output, 0);
  const last = at(output, output.length - 1);

  return (value) => {
    if (value <= at(input, 0)) return first;
    const segment = segments.find(({ end }) => value <= end);
    if (!segment) return last;
    const length = segment.end - segment.start;
    return segment.mix(length === 0 ? 1 : (value - segment.start) / length);
  };
}
