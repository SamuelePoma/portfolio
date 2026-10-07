"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

interface MovingPieceProps {
  /** How many ranks the piece travels to reach its square, downwards. */
  ranks: number;
  children: ReactNode;
}

/** The last move, played again: the piece slides from its old square once in view. */
export function MovingPiece({ ranks, children }: Readonly<MovingPieceProps>) {
  return (
    <m.span
      data-reveal
      className="inline-block"
      initial={{ y: `-${String(ranks * 1.4)}em` }}
      whileInView={{ y: "0em" }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ type: "spring", duration: 0.9, bounce: 0.15, delay: 0.5 }}
    >
      {children}
    </m.span>
  );
}
