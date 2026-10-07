/** Transform shorthands, in the order they are applied: translate, scale, rotate. */
const transforms = {
  x: { fn: "translateX", unit: "px", identity: 0 },
  y: { fn: "translateY", unit: "px", identity: 0 },
  z: { fn: "translateZ", unit: "px", identity: 0 },
  scale: { fn: "scale", unit: "", identity: 1 },
  scaleX: { fn: "scaleX", unit: "", identity: 1 },
  rotate: { fn: "rotate", unit: "deg", identity: 0 },
  rotateX: { fn: "rotateX", unit: "deg", identity: 0 },
  rotateY: { fn: "rotateY", unit: "deg", identity: 0 },
  rotateZ: { fn: "rotateZ", unit: "deg", identity: 0 },
} as const;

export type TransformKey = keyof typeof transforms;

const transformKeys = Object.keys(transforms) as TransformKey[];

function isTransformKey(key: string): key is TransformKey {
  return Object.hasOwn(transforms, key);
}

/**
 * Turns a style whose transforms are written as shorthands (`x`, `scale`, `rotateY`)
 * into plain CSS: the shorthands become one `transform` in a fixed order, numbers get
 * their default unit (px or deg), and parts at their identity value are left out.
 */
export function buildStyle(
  style: Readonly<Record<string, number | string>>,
): Record<string, number | string> {
  const css: Record<string, number | string> = {};
  for (const [key, value] of Object.entries(style)) {
    if (!isTransformKey(key)) css[key] = value;
  }

  const present = transformKeys.filter((key) => key in style);
  if (present.length === 0) return css;
  const parts = present.flatMap((key) => {
    const value = style[key] ?? transforms[key].identity;
    const { fn, unit, identity } = transforms[key];
    if (typeof value === "number")
      return value === identity ? [] : [`${fn}(${String(value)}${unit})`];
    return Number.parseFloat(value) === identity ? [] : [`${fn}(${value})`];
  });
  css.transform = parts.length > 0 ? parts.join(" ") : "none";
  return css;
}
