import type { CSSProperties } from "react";

import { cn } from "@/lib/utils/cn";

interface LitTextProps {
  text: string;
  className?: string;
}

/**
 * A statement whose words light up one after another as it scrolls through the
 * viewport, like the copy on Apple's product pages. Pure CSS (globals.css, `.lit`):
 * each word's place in the text, `--p` from 0 to 1, sets where in the paragraph's
 * view timeline it turns from tertiary to full ink. The starting grey still meets AA
 * contrast, and browsers without scroll-driven animations show the text lit.
 */
export function LitText({ text, className }: Readonly<LitTextProps>) {
  const words = text.split(" ");
  return (
    <p className={cn("lit", className)}>
      {words.map((word, index) => (
        <span key={`${word}-${String(index)}`}>
          {index > 0 && " "}
          <span
            className="lit-word"
            style={{ "--p": index / Math.max(1, words.length - 1) } as CSSProperties}
          >
            {word}
          </span>
        </span>
      ))}
    </p>
  );
}
