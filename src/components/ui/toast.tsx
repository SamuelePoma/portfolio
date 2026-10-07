import { whenToasterReady } from "./LazyToaster";

/**
 * Design-system toast (DESIGN.md §8.11): Sonner handles positioning, stacking,
 * swipe and the live region; the look is ours (headless `toast.custom`).
 * The message doubles as the id, so a double click updates instead of stacking.
 * Sonner is imported on first use, so it never weighs on the first load.
 */
export async function showToast(message: string): Promise<void> {
  const [{ toast }] = await Promise.all([import("sonner"), whenToasterReady()]);
  toast.custom(
    () => (
      <div className="mx-auto w-fit rounded-full bg-ink px-5 py-3 text-small font-medium text-canvas shadow-card-hover ring-1 ring-white/10">
        {message}
      </div>
    ),
    { id: message, duration: 2000 },
  );
}
