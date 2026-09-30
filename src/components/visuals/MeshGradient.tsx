import { cn } from "@/lib/utils/cn";

const blobs = [
  "-right-[12%] -top-[28%] size-[70vmax] md:size-[58vmax] bg-[radial-gradient(closest-side,var(--mesh-2),transparent)] opacity-35",
  "right-[18%] -top-[18%] size-[46vmax] md:size-[36vmax] bg-[radial-gradient(closest-side,var(--mesh-1),transparent)] opacity-30",
  "-right-[16%] top-[8%] size-[44vmax] md:size-[34vmax] bg-[radial-gradient(closest-side,var(--mesh-3),transparent)] opacity-20",
  "right-[34%] -top-[30%] size-[40vmax] md:size-[30vmax] bg-[radial-gradient(closest-side,var(--mesh-4),transparent)] opacity-30",
] as const;

interface MeshGradientProps {
  className?: string;
}

/**
 * The hero's only decoration (DESIGN.md §3.2): soft radial blobs in the top-right,
 * away from the text so contrast is never affected. Static for now; the slow drift
 * and pointer reaction come with the motion pass.
 */
export function MeshGradient({ className }: Readonly<MeshGradientProps>) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        // On narrow screens the text sits under the blobs: fade them out well above it,
        // so small grey text never lands on a tinted background.
        "[mask-image:linear-gradient(to_bottom,#000_18%,transparent_40%)] md:[mask-image:none]",
        className,
      )}
    >
      {blobs.map((blob) => (
        <div key={blob} className={cn("absolute rounded-full", blob)} />
      ))}
    </div>
  );
}
