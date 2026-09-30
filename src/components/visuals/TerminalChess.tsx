import { cn } from "@/lib/utils/cn";

/** The rank the last move landed on, highlighted so the eye finds the change. */
const MOVED_RANK = 4;

/** The position after 1. e4, in the classic text notation: uppercase white, lowercase black. */
const lines = [
  "white> e2 e4",
  "",
  "  a b c d e f g h",
  "8 r n b q k b n r",
  "7 p p p p p p p p",
  "6 . . . . . . . .",
  "5 . . . . . . . .",
  "4 . . . . P . . .",
  "3 . . . . . . . .",
  "2 P P P P . P P P",
  "1 R N B Q K B N R",
  "",
  "black> ",
] as const;

interface TerminalChessProps {
  className?: string;
}

/**
 * Terminal block for the text-based chess game (DESIGN.md §8.8). The product is
 * text in a terminal, so this is a real preview, not a fake screenshot. Exposed to
 * assistive technology as one image with a description instead of 100 characters.
 */
export function TerminalChess({ className }: Readonly<TerminalChessProps>) {
  return (
    <div
      role="img"
      aria-label="Terminal showing a text chess board after the move e2 to e4"
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
        {lines.map((line, index) => (
          <span
            key={index}
            className={cn("block", line.startsWith(`${MOVED_RANK} `) && "text-ink")}
          >
            {line === "" ? " " : line}
            {index === lines.length - 1 && (
              <span className="ml-px inline-block h-[1.1em] w-[0.6ch] translate-y-[0.15em] bg-ink" />
            )}
          </span>
        ))}
      </pre>
    </div>
  );
}
