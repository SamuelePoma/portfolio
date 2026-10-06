import type { CSSProperties } from "react";

/**
 * Stands in for the D&D generator's screenshot until there is one: the heart of a
 * character sheet, typeset. The scores are the course's standard array
 * (15, 14, 13, 12, 10, 8) in order, with the modifiers the SRD derives from them.
 */
const scores = [
  ["STR", 15],
  ["DEX", 14],
  ["CON", 13],
  ["INT", 12],
  ["WIS", 10],
  ["CHA", 8],
] as const;

/** SRD 5.1: the modifier is (score - 10) / 2, rounded down. */
function modifier(score: number): string {
  const value = Math.floor((score - 10) / 2);
  return value > 0 ? `+${String(value)}` : value < 0 ? `−${String(-value)}` : "+0";
}

export function CharacterSheet() {
  return (
    <div
      role="img"
      aria-label="Illustration: the six ability scores of a character sheet, from the standard array 15, 14, 13, 12, 10 and 8"
      className="@container absolute inset-0 flex items-center justify-center bg-surface-sunken p-[6cqw]"
    >
      <div className="w-full rounded-lg bg-surface p-[4.5cqw] shadow-card">
        <div className="flex items-baseline justify-between gap-4 font-mono text-[max(9px,1.7cqw)] text-ink-tertiary uppercase">
          <span>Character sheet</span>
          <span>SRD 5.1</span>
        </div>
        <div className="mt-[3.5cqw] grid grid-cols-6 gap-[1.6cqw]">
          {scores.map(([ability, score], index) => (
            <div
              key={ability}
              className="rise-in flex flex-col items-center gap-[0.8cqw] rounded-md py-[2.4cqw] ring-1 ring-hairline ring-inset"
              style={{ "--i": index } as CSSProperties}
            >
              <span className="font-mono text-[max(8px,1.5cqw)] text-ink-tertiary">{ability}</span>
              <span className="text-[max(16px,5.6cqw)] leading-none font-semibold tracking-[-0.03em] tabular-nums">
                {score}
              </span>
              <span className="font-mono text-[max(8px,1.5cqw)] text-ink-secondary tabular-nums">
                {modifier(score)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-[3.5cqw] flex items-baseline justify-between gap-4 border-t border-hairline pt-[2.5cqw] font-mono text-[max(9px,1.7cqw)] text-ink-tertiary uppercase">
          <span>Standard array</span>
          <span>+ race bonuses</span>
        </div>
      </div>
    </div>
  );
}
