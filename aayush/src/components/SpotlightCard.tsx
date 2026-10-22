"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

import { cn } from "@/lib/cn";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * React Bits "SpotlightCard".
 *
 * Tracks the pointer and paints a soft radial highlight that follows the
 * cursor across the card surface. The pointer offset is published as the
 * `--mouse-x` / `--mouse-y` custom properties, which the `.card-spotlight`
 * pseudo-element in `globals.css` reads to place the gradient.
 */
export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={cn("card-spotlight", className)}
    >
      {children}
    </div>
  );
}
