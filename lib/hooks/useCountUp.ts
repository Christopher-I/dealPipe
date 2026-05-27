"use client";

import { useEffect, useRef, useState } from "react";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Animate a numeric value from its previous setting to `target` over `duration` ms.
 *
 * - Initial mount: 0 → target.
 * - Subsequent target changes: previous-target → new-target (smooth, no reset).
 * - Honours `prefers-reduced-motion: reduce` (returns target instantly).
 */
export function useCountUp(target: number, duration = 800): number {
  const [value, setValue] = useState(0);
  const prevTargetRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(target);
      prevTargetRef.current = target;
      return;
    }
    const startValue = prevTargetRef.current;
    const startTime = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // ease-out-cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(startValue + (target - startValue) * eased);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        prevTargetRef.current = target;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}
