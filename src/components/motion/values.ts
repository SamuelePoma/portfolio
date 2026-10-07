"use client";

import { type RefObject, useEffect, useMemo, useState } from "react";

import { frame } from "@/lib/motion/frame";
import { interpolate } from "@/lib/motion/interpolate";
import { type ScrollOffset, scrollProgress } from "@/lib/motion/scroll";
import { isAtRest, type SpringConfig, type SpringState, stepSpring } from "@/lib/motion/spring";
import { MotionValue } from "@/lib/motion/value";

export { MotionValue };

/** A motion value that lives as long as the component. */
export function useMotionValue<T>(initial: T): MotionValue<T> {
  const [value] = useState(() => new MotionValue(initial));
  return value;
}

/**
 * A motion value derived from another, through a track of stops (see `interpolate`)
 * or a function. It follows its source without re-rendering the component.
 */
export function useTransform(
  source: MotionValue<number>,
  input: readonly number[],
  output: readonly number[],
): MotionValue<number>;
export function useTransform(
  source: MotionValue<number>,
  input: readonly number[],
  output: readonly string[],
): MotionValue<string>;
export function useTransform<T>(
  source: MotionValue<number>,
  map: (value: number) => T,
): MotionValue<T>;
export function useTransform<T>(
  source: MotionValue<number>,
  inputOrMap: readonly number[] | ((value: number) => T),
  output?: readonly T[],
): MotionValue<T> {
  const map = useMemo(
    () =>
      typeof inputOrMap === "function"
        ? inputOrMap
        : (interpolate(inputOrMap, (output ?? []) as readonly (number | string)[]) as (
            value: number,
          ) => T),
    [inputOrMap, output],
  );
  const value = useMotionValue(map(source.get()));
  useEffect(() => {
    const update = () => {
      value.set(map(source.get()));
    };
    update();
    return source.on(update);
  }, [map, source, value]);
  return value;
}

/**
 * A motion value that follows `source` on a spring. Pass a config defined once at
 * module level: a new object on every render would restart the spring.
 */
export function useSpring(source: MotionValue<number>, config: SpringConfig): MotionValue<number> {
  const value = useMotionValue(source.get());
  useEffect(() => {
    let state: SpringState = { position: value.get(), velocity: 0 };
    let last: number | undefined;
    const step = (time: number) => {
      // A frame after a pause (a hidden tab) counts as at most 64ms, not a leap.
      const seconds = last === undefined ? 1 / 60 : Math.min(time - last, 64) / 1000;
      const target = source.get();
      state = stepSpring(state, target, seconds, config);
      if (isAtRest(state, target, config)) {
        state = { position: target, velocity: 0 };
        last = undefined;
      } else {
        last = time;
        frame.update(step);
      }
      value.set(state.position);
    };
    const start = () => {
      frame.update(step);
    };
    if (value.get() !== source.get()) start();
    const stop = source.on(start);
    return () => {
      stop();
      frame.cancel(step);
    };
  }, [config, source, value]);
  return value;
}

/**
 * How far the page has scrolled through `target`'s track (see `ScrollOffset`), from
 * 0 to 1. Measured once a frame at most, while scrolling or when sizes change.
 */
export function useScrollProgress(
  target: RefObject<HTMLElement | null>,
  offset: ScrollOffset,
): MotionValue<number> {
  const progress = useMotionValue(0);
  const [from, to] = offset;
  useEffect(() => {
    const element = target.current;
    if (!element) return;
    const measure = () => {
      const viewport = document.documentElement.clientHeight;
      progress.set(scrollProgress(element.getBoundingClientRect(), viewport, [from, to]));
    };
    const queue = () => {
      frame.read(measure);
    };
    measure();
    const observer = new ResizeObserver(queue);
    observer.observe(element);
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      frame.cancel(measure);
    };
  }, [from, progress, target, to]);
  return progress;
}
