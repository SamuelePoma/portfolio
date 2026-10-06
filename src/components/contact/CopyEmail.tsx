"use client";

import { Copy } from "lucide-react";
import type { MouseEvent } from "react";

import { showToast } from "@/components/ui/toast";

interface CopyEmailProps {
  email: string;
}

/**
 * The email address, large (DESIGN.md §9.6). Clicking copies it and confirms with a
 * toast. It is a real `mailto:` link, so without JavaScript or clipboard access it
 * simply opens the email app.
 */
export function CopyEmail({ email }: Readonly<CopyEmailProps>) {
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

  return (
    <a
      href={`mailto:${email}`}
      onClick={handleClick}
      className="group inline-flex max-w-full items-center gap-3 self-start rounded-sm text-h2 [overflow-wrap:anywhere] text-ink"
    >
      <span className="underline decoration-hairline-strong decoration-1 underline-offset-8 transition-colors duration-200 ease-out group-hover:decoration-ink">
        {/* On narrow screens, wrap after the @ rather than mid-word. */}
        {local}@<wbr />
        {domain}
      </span>
      <Copy
        aria-hidden
        size={20}
        strokeWidth={1.75}
        className="shrink-0 text-ink-tertiary transition-colors duration-200 ease-out group-hover:text-ink"
      />
      {/* Space outside the element: accessible names trim text inside elements. */}{" "}
      <span className="sr-only">(copy to clipboard)</span>
    </a>
  );
}
