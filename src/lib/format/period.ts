interface PeriodLike {
  start: string;
  end?: string;
}

const yearOf = (value: string) => value.slice(0, 4);

/**
 * Formats a period for mono metadata, using hyphens rather than dashes (DESIGN.md §12):
 * `2024-09 → 2025-01` becomes "2024-25", a single year stays "2024", an open-ended
 * period becomes "Since 2026".
 */
export function formatPeriod({ start, end }: PeriodLike): string {
  const startYear = yearOf(start);
  if (end === undefined) return `Since ${startYear}`;

  const endYear = yearOf(end);
  if (endYear === startYear) return startYear;

  const sameCentury = endYear.slice(0, 2) === startYear.slice(0, 2);
  return `${startYear}-${sameCentury ? endYear.slice(2) : endYear}`;
}
