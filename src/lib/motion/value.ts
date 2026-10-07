type Listener<T> = (value: T) => void;

/**
 * A value that changes outside React: scroll progress, a spring, a style derived from
 * them. Components subscribe and write the DOM directly, so a scene can move on every
 * frame without re-rendering.
 */
export class MotionValue<T> {
  #current: T;
  readonly #listeners = new Set<Listener<T>>();

  constructor(initial: T) {
    this.#current = initial;
  }

  get(): T {
    return this.#current;
  }

  /** Stores the value and tells every listener, unless it is unchanged. */
  set(next: T): void {
    if (Object.is(next, this.#current)) return;
    this.#current = next;
    for (const listener of this.#listeners) listener(next);
  }

  /** Calls `listener` on every change; returns the function that stops it. */
  on(listener: Listener<T>): () => void {
    this.#listeners.add(listener);
    return () => {
      this.#listeners.delete(listener);
    };
  }
}
