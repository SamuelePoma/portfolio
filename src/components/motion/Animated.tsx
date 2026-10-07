"use client";

import {
  type ComponentPropsWithoutRef,
  createElement,
  type CSSProperties,
  type RefObject,
  useEffect,
  useRef,
} from "react";

import { frame } from "@/lib/motion/frame";
import { buildStyle, type TransformKey } from "@/lib/motion/style";
import { MotionValue } from "@/lib/motion/value";

type Animatable = number | string | MotionValue<number> | MotionValue<string>;

/**
 * A style whose entries may be motion values, with transform shorthands such as `x`,
 * `scale` and `rotateY` (see `buildStyle`).
 */
export type AnimatedStyle = Partial<Record<keyof CSSProperties | TransformKey, Animatable>>;

/** The style as it is right now: every motion value read. */
function current(style: AnimatedStyle): Record<string, number | string> {
  const values: Record<string, number | string> = {};
  for (const [key, value] of Object.entries(style)) {
    values[key] = value instanceof MotionValue ? value.get() : value;
  }
  return values;
}

function kebab(property: string): string {
  return property.startsWith("--")
    ? property
    : property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

/** Writes the properties that move: the transform, and each animated property. */
function write(element: HTMLElement, style: AnimatedStyle): void {
  const css = buildStyle(current(style));
  for (const [key, value] of Object.entries(css)) {
    if (key === "transform" || style[key as keyof AnimatedStyle] instanceof MotionValue) {
      element.style.setProperty(kebab(key), String(value));
    }
  }
}

type Tag = "div" | "span" | "li";

type AnimatedProps<T extends Tag> = Omit<ComponentPropsWithoutRef<T>, "style"> & {
  ref?: RefObject<HTMLElementTagNameMap[T] | null>;
  style?: AnimatedStyle;
};

function animated<T extends Tag>(tag: T) {
  function AnimatedElement({ ref, style = {}, ...props }: AnimatedProps<T>) {
    const own = useRef<HTMLElementTagNameMap[T]>(null);
    const element = ref ?? own;

    // Motion values change outside React: each change writes the element's style on
    // the next frame, without a render.
    useEffect(() => {
      const node = element.current;
      const values = Object.values(style).filter((value) => value instanceof MotionValue);
      if (!node || values.length === 0) return;
      const render = () => {
        write(node, style);
      };
      render();
      const stops = values.map((value) =>
        value.on(() => {
          frame.render(render);
        }),
      );
      return () => {
        for (const stop of stops) stop();
        frame.cancel(render);
      };
    }, [element, style]);

    return createElement(tag, {
      ...props,
      ref: element,
      style: buildStyle(current(style)),
    });
  }
  AnimatedElement.displayName = `Animated.${tag}`;
  return AnimatedElement;
}

/**
 * Elements whose style can hold motion values. The server renders them at their
 * starting values; in the browser each value writes the style directly as it changes.
 */
export const Animated = {
  div: animated("div"),
  span: animated("span"),
  li: animated("li"),
};
