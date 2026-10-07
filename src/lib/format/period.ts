interface PeriodLike {
  start: string;
  end?: string | undefined;
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

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2024-11" becomes "Nov 2024"; a bare year stays as it is. */
function formatMonth(value: string): string {
  const [year, month] = value.split("-");
  const name = month === undefined ? undefined : MONTHS[Number(month) - 1];
  return name === undefined ? (year ?? value) : `${name} ${year ?? ""}`;
}

/**
 * The long form for the case-study meta row, in words rather than dashes:
 * "Nov 2024 to Jan 2025", "Jun 2026" for a single month, "Since Sep 2026" when ongoing.
 */
export function formatPeriodLong({ start, end }: PeriodLike): string {
  if (end === undefined) return `Since ${formatMonth(start)}`;
  if (end === start) return formatMonth(start);
  return `${formatMonth(start)} to ${formatMonth(end)}`;
}
