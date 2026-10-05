"use client";

import { type Ref, useEffect, useImperativeHandle, useRef, useState } from "react";

const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export interface TurnstileRenderOptions {
  sitekey: string;
  theme: "light" | "dark" | "auto";
  size: "normal" | "flexible" | "compact";
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => boolean;
}

interface TurnstileApi {
  render(container: HTMLElement, options: TurnstileRenderOptions): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptLoading: Promise<void> | undefined;

/** Adds Cloudflare's script once per page; a failed load can be retried later. */
function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  scriptLoading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      scriptLoading = undefined;
      reject(new Error("Turnstile failed to load"));
    };
    document.head.append(script);
  });
  return scriptLoading;
}

export interface TurnstileHandle {
  /** Asks for a fresh token: each one can be verified only once. */
  reset(): void;
}

interface TurnstileProps {
  siteKey: string;
  /** Called with a token once the check passes, and with `undefined` when it expires or fails. */
  onToken: (token: string | undefined) => void;
  ref?: Ref<TurnstileHandle>;
}

/**
 * Cloudflare Turnstile, compact and dark (DESIGN.md §8.12). The script is only
 * requested when the form comes near the viewport, so visitors who never scroll to it
 * never load anything from Cloudflare.
 */
export function Turnstile({ siteKey, onToken, ref }: Readonly<TurnstileProps>) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);
  const onTokenRef = useRef(onToken);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    onTokenRef.current = onToken;
  });

  useImperativeHandle(ref, () => ({
    reset() {
      onTokenRef.current(undefined);
      if (widgetId.current !== undefined) window.turnstile?.reset(widgetId.current);
    },
  }));

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let cancelled = false;

    const mount = () => {
      loadScript()
        .then(() => {
          if (cancelled || !window.turnstile) return;
          widgetId.current = window.turnstile.render(element, {
            sitekey: siteKey,
            theme: "dark",
            size: "compact",
            callback: (token) => {
              onTokenRef.current(token);
            },
            "expired-callback": () => {
              onTokenRef.current(undefined);
            },
            "error-callback": () => {
              onTokenRef.current(undefined);
              return true;
            },
          });
        })
        .catch(() => {
          if (!cancelled) setFailed(true);
        });
    };

    // Without IntersectionObserver (old browsers), load straight away.
    const observer =
      typeof IntersectionObserver === "undefined"
        ? undefined
        : new IntersectionObserver(
            (entries) => {
              if (!entries.some((entry) => entry.isIntersecting)) return;
              observer?.disconnect();
              mount();
            },
            { rootMargin: "400px 0px" },
          );
    if (observer) observer.observe(element);
    else mount();

    return () => {
      cancelled = true;
      observer?.disconnect();
      if (widgetId.current !== undefined) window.turnstile?.remove(widgetId.current);
      widgetId.current = undefined;
    };
  }, [siteKey]);

  return (
    <div className="min-h-[140px]">
      <div ref={container} />
      {failed && (
        <p className="text-caption text-ink-secondary">
          The spam check couldn&apos;t load. A content blocker may be stopping it.
        </p>
      )}
    </div>
  );
}
