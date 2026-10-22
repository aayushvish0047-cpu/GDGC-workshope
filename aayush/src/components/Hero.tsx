"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { useGame } from "@/components/GameProvider";
import { profile, secretSequence } from "@/data/portfolio";
import { cn } from "@/lib/cn";

/**
 * The 3D scene is client-only: WebGL and the HDR fetch must never run on the
 * server, so the bundle is loaded on demand with `ssr: false`.
 */
const HeroCanvas = dynamic(
  () => import("@/components/HeroCanvas").then((mod) => mod.HeroCanvas),
  { ssr: false },
);

export function Hero() {
  const { xp, discoverSecret, state } = useGame();
  const [sequenceIndex, setSequenceIndex] = useState(0);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const expected = secretSequence[sequenceIndex];

      if (key === expected) {
        const next = sequenceIndex + 1;
        if (next >= secretSequence.length) {
          setSequenceIndex(0);
          discoverSecret();
        } else {
          setSequenceIndex(next);
        }
        return;
      }

      // Forgiving restart — a fresh opener always begins a new attempt.
      setSequenceIndex(key === secretSequence[0] ? 1 : 0);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sequenceIndex, discoverSecret]);

  const signalComplete = state.secretFound;

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-screen items-center overflow-hidden scroll-mt-24"
    >
      {/*
        Mount point for the 3D canvas. The scene renders behind the hero copy
        and never intercepts pointer events.
      */}
      <div
        aria-hidden="true"
        data-canvas-mount="hero"
        className="absolute inset-0 -z-10 bg-[radial-gradient(65%_55%_at_50%_0%,rgba(245,245,247,0.055),transparent_70%)]"
      >
        <HeroCanvas />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 pt-36 pb-20 md:px-10 md:pt-44 md:pb-28">
        <p className="flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-white/45">
          <span className="inline-block size-1.5 rounded-full bg-paper" aria-hidden="true" />
          {profile.hero.eyebrow}
        </p>

        <h1 className="mt-8 text-[clamp(3.5rem,15vw,12.5rem)] font-medium leading-[0.84] tracking-[-0.055em] text-paper">
          <span className="block">{profile.name}</span>
          <span className="mt-3 block text-[0.3em] font-normal leading-[1.12] tracking-[-0.02em] text-white/35">
            {profile.hero.headline}
          </span>
        </h1>

        <p className="mt-10 max-w-xl text-base leading-relaxed text-white/50 md:text-lg">
          {profile.hero.lede}
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <a
            href="#quests"
            className="group inline-flex items-center gap-2.5 rounded-full bg-paper px-6 py-3.5 text-sm font-medium tracking-tight text-ink transition-opacity duration-300 hover:opacity-80"
          >
            {profile.hero.cta}
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 px-6 py-3.5 text-sm tracking-tight text-white/75 transition-colors duration-300 hover:border-white/40 hover:text-paper"
          >
            Get in touch
            <ArrowUpRight
              className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/10 pt-8 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-[10px] uppercase tracking-[0.24em] text-white/30">Based in</dt>
            <dd className="mt-2 text-white/70">{profile.location}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.24em] text-white/30">Status</dt>
            <dd className="mt-2 text-white/70">{profile.availability}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.24em] text-white/30">Rank</dt>
            <dd className="mt-2 text-white/70">
              Level {String(xp.level).padStart(2, "0")} · {xp.rank}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.24em] text-white/30">Signal</dt>
            <dd className="mt-2">
              <span className="flex items-center gap-1.5" aria-hidden="true">
                {secretSequence.map((_, index) => (
                  <span
                    key={index}
                    className={cn(
                      "h-1.5 w-1.5 rounded-[1px] transition-colors duration-300",
                      signalComplete || index < sequenceIndex
                        ? "bg-paper"
                        : "bg-white/15",
                    )}
                  />
                ))}
              </span>
              <span className="sr-only">
                {signalComplete
                  ? "Hidden signal decoded"
                  : `Hidden signal progress: ${sequenceIndex} of ${secretSequence.length}`}
              </span>
              <span
                className={cn(
                  "mt-1.5 block font-mono text-[10px] tracking-[0.16em]",
                  signalComplete ? "text-paper/70" : "text-white/25",
                )}
              >
                {signalComplete ? "SIGNAL DECODED" : "LEGACY INPUT ACCEPTED"}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
