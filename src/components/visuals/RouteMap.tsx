import { Bike, Car } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Stands in for the GPS dashboard's screenshot until there is one: a city map in
 * greys with a tracked route drawn in the accent between a car and a bicycle, the two
 * kinds of vehicle the dashboard follows. An illustration of the idea, not of the
 * product's interface, and labelled as such for screen readers.
 *
 * Streets keep the same width in pixels at any size (`non-scaling-stroke`), so the
 * map reads as a city in a card and in a full-width hero alike.
 */
const avenues = [
  "M 0 34 H 240",
  "M 0 78 H 240",
  "M 0 122 H 240",
  "M 38 0 V 150",
  "M 104 0 V 150",
  "M 170 0 V 150",
  "M 0 150 L 96 0",
];

const streets = [
  "M 0 12 H 240",
  "M 0 56 H 240",
  "M 0 100 H 240",
  "M 0 140 H 240",
  "M 14 0 V 150",
  "M 62 0 V 150",
  "M 82 0 V 150",
  "M 128 0 V 150",
  "M 148 0 V 150",
  "M 194 0 V 150",
  "M 218 0 V 150",
];

/** Blocks shaded a step darker, so the grid has some texture. */
const blocks = [
  [106, 36, 20, 18],
  [172, 80, 20, 18],
  [40, 102, 20, 18],
  [196, 14, 20, 18],
] as const;

/** Along the streets, from the car to the bicycle. */
const route = "M 38 122 V 78 H 104 V 34 H 170 V 78 H 194 V 122";

export function RouteMap() {
  return (
    <svg
      role="img"
      aria-label="Illustration: a route tracked across a city map, from a car to a bicycle"
      viewBox="0 0 240 150"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full bg-[#eceef0]"
    >
      {blocks.map(([x, y, width, height]) => (
        <rect
          key={`${String(x)}-${String(y)}`}
          x={x}
          y={y}
          width={width}
          height={height}
          fill="#e2e5e8"
        />
      ))}
      {/* A river, in the palest blue-grey, so the map reads as a place. */}
      <path
        d="M -6 22 C 40 30, 60 52, 112 58 S 190 86, 246 74"
        fill="none"
        stroke="#dde3ea"
        strokeWidth={8}
        strokeLinecap="round"
      />
      {streets.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="#f7f8f9"
          strokeWidth={2.5}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {avenues.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="#ffffff"
          strokeWidth={6}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <path
        d={route}
        pathLength={1}
        fill="none"
        className="draw-line"
        stroke="var(--accent)"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Marker x={38} y={122} label="CAR">
        <Car x={-1.9} y={-1.9} width={3.8} height={3.8} strokeWidth={2.2} color="#ffffff" />
      </Marker>
      <Marker x={194} y={122} label="BICYCLE">
        <Bike x={-1.9} y={-1.9} width={3.8} height={3.8} strokeWidth={2.2} color="#ffffff" />
      </Marker>
    </svg>
  );
}

interface MarkerProps {
  x: number;
  y: number;
  label: string;
  children: ReactNode;
}

function Marker({ x, y, label, children }: Readonly<MarkerProps>) {
  return (
    <g transform={`translate(${String(x)} ${String(y)})`}>
      <circle r={6} fill="var(--accent)" opacity={0.16} />
      <circle r={3.6} fill="var(--ink)" />
      {children}
      <text
        x={5.4}
        y={1.1}
        className="font-mono"
        fontSize={3}
        fontWeight={500}
        letterSpacing={0.15}
        fill="var(--ink-secondary)"
      >
        {label}
      </text>
    </g>
  );
}
