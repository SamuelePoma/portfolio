import type { ReactNode } from "react";

import { MovingPiece } from "@/components/motion/MovingPiece";
import { cn } from "@/lib/utils/cn";

/**
 * The game's real output, copied from Samuele's terminal: White opened with a2 to a4
 * and Black answers b7 to b5. Lines are kept verbatim (a debug line in Italian is
 * left out); `>` marks what the player typed.
 */
const transcriptBefore = [
  "Choose the index of the piece to move: >9",
  "",
  "Possible moves for Black Pawn at b7:",
  "0) b6",
  "1) b5",
  "Choose the index of the move: >1",
  "[LOG] Black Pawn performed a valid move: b7 -> b5",
  "Move executed successfully!",
  "",
] as const;

const transcriptAfter = [
  "",
  "Move History:",
  "1. WHITE: White Pawn a2 -> a4",
  "2. BLACK: Black Pawn b7 -> b5",
  "",
  "Current Turn: WHITE",
] as const;

/** Ranks 8 to 1, uppercase white and lowercase black, as in FEN; dots are empty squares. */
const ranks = [
  "r n b q k b n r",
  "p . p p p p p p",
  ". . . . . . . .",
  ". p . . . . . .",
  "P . . . . . . .",
  ". . . . . . . .",
  ". P P P P P P P",
  "R N B Q K B N R",
].map((rank) => rank.split(" "));

const files = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const LAST_MOVE = "b5";

const glyphs: Record<string, number> = {
  K: 0x2654,
  Q: 0x2655,
  R: 0x2656,
  B: 0x2657,
  N: 0x2658,
  P: 0x2659,
  k: 0x265a,
  q: 0x265b,
  r: 0x265c,
  b: 0x265d,
  n: 0x265e,
  p: 0x265f,
};

/** Variation selector 15: the black pawn is also an emoji, and phones would draw it as one. */
const TEXT_STYLE = String.fromCodePoint(0xfe0e);

function piece(code: string): string {
  const point = glyphs[code];
  return point === undefined ? "." : String.fromCodePoint(point) + TEXT_STYLE;
}

/** Every square is a 2ch cell, so the board stays aligned whatever font draws the pieces. */
function Cell({ children, strong = false }: Readonly<{ children: ReactNode; strong?: boolean }>) {
  return (
    <span className={cn("inline-block w-[2ch] text-center", strong && "text-ink")}>{children}</span>
  );
}

function Board() {
  const border = ` +${"-".repeat(16)}+`;
  return (
    <>
      <span className="block">{border}</span>
      {ranks.map((rank, index) => {
        const number = 8 - index;
        return (
          <span key={number} className="block">
            {number}|
            {rank.map((code, file) => {
              const moved = `${files[file] ?? ""}${String(number)}` === LAST_MOVE;
              return (
                <Cell key={file} strong={moved}>
                  {moved ? <MovingPiece ranks={2}>{piece(code)}</MovingPiece> : piece(code)}
                </Cell>
              );
            })}
            |
          </span>
        );
      })}
      <span className="block">{border}</span>
      <span className="block">
        {"  "}
        {files.map((file) => (
          <Cell key={file}>{file}</Cell>
        ))}
      </span>
    </>
  );
}

/** A transcript line; text after `>` is the player's input, set brighter. */
function Line({ text }: Readonly<{ text: string }>) {
  if (text === "") return <span className="block"> </span>;
  const [output, input] = text.split(">", 2) as [string, string | undefined];
  // "b7 -> b5" contains ">" too: only a trailing input after ": " counts as typed.
  if (input === undefined || !output.endsWith(": ")) return <span className="block">{text}</span>;
  return (
    <span className="block">
      {output}
      <span className="text-ink">{input}</span>
    </span>
  );
}

interface TerminalChessProps {
  /** `card` shows the last move and the board; `full` the whole turn. */
  variant?: "card" | "full";
  className?: string;
}

/**
 * Terminal block for the text-based chess game (DESIGN.md §8.8): the product is
 * text in a terminal, so this is its real output, not a screenshot. Exposed to
 * assistive technology as one image with a description instead of 200 characters.
 */
export function TerminalChess({ variant = "card", className }: Readonly<TerminalChessProps>) {
  const before = variant === "full" ? transcriptBefore : transcriptBefore.slice(6);
  const after = variant === "full" ? transcriptAfter : [];

  return (
    <div
      role="img"
      aria-label="Chess game in a terminal: after White plays a2 to a4, Black moves the pawn from b7 to b5 and the board is printed again"
      className={cn(
        "tone-night overflow-hidden rounded-md bg-surface font-mono shadow-card",
        className,
      )}
    >
      <div className="flex h-8 items-center gap-1.5 border-b border-hairline px-3">
        <span className="size-2 rounded-full bg-hairline-strong" />
        <span className="size-2 rounded-full bg-hairline-strong" />
        <span className="size-2 rounded-full bg-hairline-strong" />
        <span className="mx-auto pr-8 text-caption text-ink-tertiary">chess.java</span>
      </div>
      <pre className="overflow-hidden px-4 py-3 text-mono leading-[1.4] text-ink-secondary">
        {before.map((text, index) => (
          <Line key={`before-${String(index)}`} text={text} />
        ))}
        <Board />
        {after.map((text, index) => (
          <Line key={`after-${String(index)}`} text={text} />
        ))}
      </pre>
    </div>
  );
}
