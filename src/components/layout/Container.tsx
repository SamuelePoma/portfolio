import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

const widths = {
  page: "max-w-page",
  wide: "max-w-wide",
  prose: "max-w-prose",
} as const;

interface ContainerProps extends ComponentPropsWithoutRef<"div"> {
  /** `page` 1200px (default), `wide` 1400px for break-out media, `prose` 65ch for reading. */
  width?: keyof typeof widths;
}

export function Container({ width = "page", className, ...props }: Readonly<ContainerProps>) {
  return <div className={cn("mx-auto w-full px-4 md:px-6", widths[width], className)} {...props} />;
}
