"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Counts from the current value up to `target` once `active` becomes true.
 * Re-targeting mid-flight continues from where it left off.
 */
export function useCountUp(target: number, active: boolean, duration = 1500): number {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);
  const current = useRef(0);

  useEffect(() => {
    if (!active) return;

    if (reduced) {
      current.current = target;
      setValue(target);
      return;
    }

    const from = current.current;
    const distance = target - from;
    if (distance === 0) return;

    let frame = 0;
    let start: number | null = null;

    const tick = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min(1, (timestamp - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      const next = Math.round(from + distance * eased);
      current.current = next;
      setValue(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration, reduced]);

  return value;
}
