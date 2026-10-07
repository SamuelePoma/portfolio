"use client";

import { useEffect, useState } from "react";
import type { Toaster as SonnerToaster } from "sonner";

let open: (() => void) | undefined;
let ready: Promise<void> | undefined;
let resolveReady: (() => void) | undefined;

/**
 * Mounts Sonner's toaster the first time a toast is asked for, and resolves once it
 * listens: a toast sent before that would be lost. Until then Sonner isn't loaded.
 */
export function whenToasterReady(): Promise<void> {
  if (ready === undefined) {
    ready = new Promise((resolve) => {
      resolveReady = resolve;
    });
    open?.();
  }
  return ready;
}

/**
 * Where the toaster mounts. It renders nothing until the first toast: the only one on
 * the site ("Email copied") needs a click first, so the page never waits for Sonner.
 */
export function LazyToaster() {
  const [Toaster, setToaster] = useState<typeof SonnerToaster | null>(null);

  useEffect(() => {
    open = () => {
      import("sonner")
        .then((module) => {
          setToaster(() => module.Toaster);
        })
        .catch(() => {
          // Offline: forget the attempt so the next toast tries again.
          ready = undefined;
        });
    };
    if (ready !== undefined) open();
    return () => {
      open = undefined;
    };
  }, []);

  // Runs after the Toaster's own effects, so it is subscribed by now.
  useEffect(() => {
    if (Toaster) resolveReady?.();
  }, [Toaster]);

  return Toaster ? <Toaster position="bottom-center" offset={24} mobileOffset={16} /> : null;
}
