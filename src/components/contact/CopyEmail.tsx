"use client";

import { Copy } from "lucide-react";
import type { MouseEvent } from "react";

import { showToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils/cn";

const sizes = {
  /** A sub-heading's size, for a column next to other content. */
  h2: { text: "self-start text-h2", icon: 20, offset: "underline-offset-8" },
  /** The contact finale: the address is the headline act. */
  display: {
    text: "self-center text-[clamp(1.75rem,5.4vw,4.5rem)] leading-[1.05] font-semibold tracking-[-0.035em]",
    icon: 28,
    offset: "underline-offset-[0.18em]",
  },
} as const;

interface CopyEmailProps {
  email: string;
  size?: keyof typeof sizes;
  className?: string;
}

/**
 * The email address, large (DESIGN.md §9.6). Clicking copies it and confirms with a
 * toast. It is a real `mailto:` link, so without JavaScript or clipboard access it
 * simply opens the email app.
 */
export function CopyEmail({ email, size = "h2", className }: Readonly<CopyEmailProps>) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (typeof navigator === "undefined" || !("clipboard" in navigator)) return;
    event.preventDefault();
    navigator.clipboard.writeText(email).then(
      () => {
        void showToast("Email copied");
      },
      () => {
        window.location.href = `mailto:${email}`;
      },
    );
  }

  const at = email.indexOf("@");
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const style = sizes[size];

  return (
    <a
      href={`mailto:${email}`}
      onClick={handleClick}
      className={cn(
        "group inline-flex max-w-full items-center gap-3 rounded-sm [overflow-wrap:anywhere] text-ink",
        style.text,
        className,
      )}
    >
      <span
        className={cn(
          "underline decoration-hairline-strong decoration-1 transition-colors duration-200 ease-out group-hover:decoration-ink",
          style.offset,
        )}
      >
        {/* On narrow screens, wrap after the @ rather than mid-word. */}
        {local}@<wbr />
        {domain}
      </span>
      <Copy
        aria-hidden
        size={style.icon}
        strokeWidth={1.75}
        className="shrink-0 text-ink-tertiary transition-colors duration-200 ease-out group-hover:text-ink"
      />
      {/* Space outside the element: accessible names trim text inside elements. */}{" "}
      <span className="sr-only">(copy to clipboard)</span>
    </a>
  );
}
