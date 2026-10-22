"use client";

import { ArrowUpRight, Check, ChevronDown, Lock, Target } from "lucide-react";
import { useState } from "react";

import { useGame } from "@/components/GameProvider";
import type { Difficulty, Quest } from "@/data/portfolio";
import { cn } from "@/lib/cn";

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  Novice: "border-white/10 text-white/40",
  Advanced: "border-white/15 text-white/60",
  Expert: "border-white/30 text-white/85",
  Legendary: "border-paper bg-paper text-ink",
};

export function QuestCard({ quest }: { quest: Quest }) {
  const { isQuestCompleted, isQuestInspected, completeQuest, inspectQuest } = useGame();
  const [expanded, setExpanded] = useState(false);

  const completed = isQuestCompleted(quest.id);
  const inspected = isQuestInspected(quest.id);
  const locked = quest.status === "locked";
  const panelId = `quest-brief-${quest.id}`;

  const toggleBrief = () => {
    const next = !expanded;
    setExpanded(next);
    if (next) inspectQuest(quest.id);
  };

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-3xl border bg-white/[0.02] transition-colors duration-500",
        completed ? "border-white/10" : "border-white/10 hover:border-white/25",
      )}
    >
      <div className="flex flex-col gap-6 p-7 md:flex-row md:items-start md:justify-between md:p-10">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/35">
              {quest.index}
            </span>
            <span
              className={cn(
                "rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]",
                DIFFICULTY_STYLES[quest.difficulty],
              )}
            >
              {quest.difficulty}
            </span>
            {completed ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-paper">
                <Check className="size-3" aria-hidden="true" />
                Cleared
              </span>
            ) : null}
          </div>

          <h3 className="mt-5 text-3xl font-medium tracking-[-0.02em] text-paper md:text-4xl">
            {quest.title}
          </h3>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-white/45">{quest.tagline}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:flex-col md:items-end md:gap-3">
          <span className="font-mono text-xs tracking-[0.18em] text-white/50">
            +{quest.xpReward} XP
          </span>
          {locked ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-white/30">
              <Lock className="size-3.5" aria-hidden="true" />
              Locked
            </span>
          ) : null}
        </div>
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-500 ease-out",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          {expanded ? (
            <div className="border-t border-white/10 px-7 pb-8 pt-7 md:px-10 md:pb-10">
              <p className="max-w-3xl text-base leading-relaxed text-white/60">
                {quest.description}
              </p>

              <div className="mt-7 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <Target className="mt-0.5 size-4 shrink-0 text-white/50" aria-hidden="true" />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-white/35">
                    The hard part
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{quest.challenge}</p>
                </div>
              </div>

              <dl className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07] sm:grid-cols-3">
                {quest.metrics.map((metric) => (
                  <div key={metric.label} className="bg-ink px-5 py-5">
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                      {metric.label}
                    </dt>
                    <dd className="mt-2 text-xl font-medium tracking-tight text-paper">
                      {metric.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-7 flex flex-wrap gap-2">
                {quest.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] tracking-tight text-white/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {quest.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs tracking-tight text-white/70 transition-colors duration-300 hover:border-white/40 hover:text-paper"
                  >
                    {link.label}
                    <ArrowUpRight
                      className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-7 py-5 md:px-10">
        <button
          type="button"
          onClick={toggleBrief}
          aria-expanded={expanded}
          aria-controls={panelId}
          disabled={locked}
          className="group inline-flex items-center gap-2 text-sm tracking-tight text-white/55 transition-colors duration-300 hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
        >
          {expanded ? "Close briefing" : "Read briefing"}
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-300",
              expanded ? "rotate-180" : "group-hover:translate-y-0.5",
            )}
            aria-hidden="true"
          />
          <span className="sr-only">for {quest.title}</span>
        </button>

        {completed ? (
          <span className="inline-flex items-center gap-2 text-sm tracking-tight text-white/40">
            <Check className="size-4 text-paper/70" aria-hidden="true" />
            Quest cleared
          </span>
        ) : (
          <button
            type="button"
            onClick={() => completeQuest(quest.id)}
            disabled={locked}
            className="inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-xs font-medium tracking-tight text-ink transition-opacity duration-300 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear quest
            <span className="text-ink/50">+{quest.xpReward} XP</span>
          </button>
        )}
      </div>

      {!inspected && !locked ? (
        <p className="sr-only">Briefing for {quest.title} has not been read yet.</p>
      ) : null}
    </article>
  );
}
