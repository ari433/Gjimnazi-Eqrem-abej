"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/**
 * Hydration-safe `prefers-reduced-motion`. The server (and the hydration pass)
 * always sees `false`, then React re-renders with the real value — so a
 * component may render a different tree for reduced motion without a
 * hydration mismatch (motion's `useReducedMotion` reads it during hydration).
 */
export function useReducedMotionSafe(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
