"use client";

import { ArrowUp } from "lucide-react";

import { useGame } from "@/components/GameProvider";
import { profile } from "@/data/portfolio";

export function Footer() {
  const { xp, resetProgress } = useGame();

  return (
    <footer className="border-t border-white/10 px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm tracking-tight text-white/60">
            {profile.name} — {profile.role}
          </p>
          <p className="mt-2 font-mono text-[11px] tracking-[0.18em] text-white/25">
            LEVEL {String(xp.level).padStart(2, "0")} · {xp.rank.toUpperCase()} · {xp.earned.toLocaleString("en-US")} XP
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm tracking-tight text-white/45 transition-colors duration-300 hover:text-paper"
          >
            GitHub
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm tracking-tight text-white/45 transition-colors duration-300 hover:text-paper"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="text-sm tracking-tight text-white/45 transition-colors duration-300 hover:text-paper"
          >
            Email
          </a>
          <button
            type="button"
            onClick={resetProgress}
            className="text-sm tracking-tight text-white/25 transition-colors duration-300 hover:text-white/60"
          >
            Reset
          </button>
          <a
            href="#hero"
            className="inline-flex items-center gap-1.5 text-sm tracking-tight text-white/45 transition-colors duration-300 hover:text-paper"
          >
            Top
            <ArrowUp className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
