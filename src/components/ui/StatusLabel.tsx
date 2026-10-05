import { MonoLabel } from "./MonoLabel";

/**
 * The accent "In progress" label with its dot. The only dot on the site, because it
 * reports a real status (DESIGN.md §12).
 */
export function StatusLabel() {
  return (
    <MonoLabel as="p" tone="accent" className="inline-flex items-center gap-2">
      <span aria-hidden className="size-1.5 rounded-full bg-accent" />
      <span>In progress</span>
    </MonoLabel>
  );
}
