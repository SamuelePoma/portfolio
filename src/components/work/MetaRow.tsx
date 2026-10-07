import { MonoLabel } from "@/components/ui/MonoLabel";
import type { Project } from "@/content/schema";
import { formatPeriodLong } from "@/lib/format/period";

type MetaRowProps = Pick<Project, "role" | "team" | "period" | "stack">;

/**
 * Role · Team · Timeline · Stack (DESIGN.md §9.3). Facts that aren't known yet are
 * left out, so the row never shows an empty or guessed value.
 */
export function MetaRow({ role, team, period, stack }: Readonly<MetaRowProps>) {
  const items = [
    { label: "Role", value: role },
    { label: "Team", value: team === undefined ? undefined : `${String(team)} people` },
    { label: "Timeline", value: period === undefined ? undefined : formatPeriodLong(period) },
    { label: "Stack", value: stack.length > 0 ? stack.join(", ") : undefined },
  ].filter((item): item is { label: string; value: string } => item.value !== undefined);

  if (items.length === 0) return null;

  return (
    <dl className="grid grid-cols-1 gap-x-10 gap-y-8 border-b border-hairline pb-10 sm:grid-cols-2 md:pb-12 lg:grid-cols-4">
      {items.map(({ label, value }) => (
        <div key={label} className="flex flex-col gap-2">
          <dt>
            <MonoLabel>{label}</MonoLabel>
          </dt>
          <dd className="text-body text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
