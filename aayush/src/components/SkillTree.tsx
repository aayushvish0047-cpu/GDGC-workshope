"use client";

import { Bot, Check, Component, Server } from "lucide-react";

import { useGame } from "@/components/GameProvider";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { skillCategories, type SkillCategory, type SkillNode } from "@/data/portfolio";
import { cn } from "@/lib/cn";

const CATEGORY_ICON: Record<SkillCategory, typeof Component> = {
  Frontend: Component,
  Backend: Server,
  "AI/ML": Bot,
};

function Node({ node, last }: { node: SkillNode; last: boolean }) {
  const { isSkillUnlocked, unlockSkill, unlockVerdict, notify } = useGame();
  const unlocked = isSkillUnlocked(node.id);
  const verdict = unlockVerdict(node);

  const handleClick = () => {
    if (unlocked) return;
    if (verdict.ok) {
      unlockSkill(node.id);
      return;
    }
    notify({ title: node.name, description: verdict.reason, icon: node.icon });
  };

  return (
    <li className="relative">
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-[34px] w-px bg-white/10",
          last ? "top-0 h-[34px]" : "top-0 h-full",
        )}
      />

      <button
        type="button"
        onClick={handleClick}
        aria-pressed={unlocked}
        className={cn(
          "group relative flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition-colors duration-300",
          unlocked
            ? "border-white/15 bg-white/[0.03]"
            : "border-white/10 hover:border-white/25",
        )}
      >
        <span
          className={cn(
            "relative z-10 flex size-11 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300",
            unlocked
              ? "border-paper/25 bg-paper/10 text-paper"
              : "border-white/10 bg-ink-raised text-white/45 group-hover:text-white/70",
          )}
        >
          <Icon name={node.icon} className="size-[18px]" strokeWidth={1.5} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span
              className={cn(
                "truncate text-sm tracking-tight",
                unlocked ? "text-paper" : "text-white/70",
              )}
            >
              {node.name}
            </span>
            {unlocked ? (
              <Check className="size-3.5 shrink-0 text-paper/70" aria-hidden="true" />
            ) : null}
          </span>
          <span className="mt-1 flex items-center gap-1.5" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={index}
                className={cn(
                  "h-1 w-1 rounded-full",
                  index < node.tier
                    ? unlocked
                      ? "bg-paper/70"
                      : "bg-white/30"
                    : "bg-white/10",
                )}
              />
            ))}
          </span>
          <span className="mt-1.5 block truncate text-[11px] leading-relaxed text-white/35">
            {unlocked ? node.description : verdict.ok ? node.description : verdict.reason}
          </span>
        </span>

        <span className="shrink-0 pr-1 text-right">
          {unlocked ? (
            <span className="font-mono text-[11px] tracking-[0.14em] text-white/30">OPEN</span>
          ) : (
            <span className="font-mono text-[11px] tracking-[0.14em] text-white/50">
              {node.xpCost} XP
            </span>
          )}
        </span>
      </button>
    </li>
  );
}

export function SkillTree() {
  const { skills, state } = useGame();

  return (
    <section id="skills" className="scroll-mt-24 px-6 py-32 md:px-10 md:py-40">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="03"
          eyebrow="Skill tree"
          title="Unlock the next node."
          description="Sixteen technologies across three disciplines. Nodes open in sequence — each one costs XP and unlocks the branches that depend on it."
        />

        <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
          {skillCategories.map((category, categoryIndex) => {
            const nodes = skills.filter((skill) => skill.category === category);
            const unlocked = nodes.filter((node) => state.unlockedSkillIds.includes(node.id)).length;
            const CategoryIcon = CATEGORY_ICON[category];

            return (
              <Reveal key={category} delay={categoryIndex * 90}>
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="flex items-center gap-2.5">
                      <CategoryIcon className="size-4 text-white/50" strokeWidth={1.5} aria-hidden="true" />
                      <h3 className="text-xs uppercase tracking-[0.24em] text-white/70">{category}</h3>
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.16em] text-white/35">
                      {unlocked}/{nodes.length}
                    </span>
                  </div>

                  <ol className="mt-6 space-y-3">
                    {nodes.map((node, index) => (
                      <Node key={node.id} node={node} last={index === nodes.length - 1} />
                    ))}
                  </ol>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
