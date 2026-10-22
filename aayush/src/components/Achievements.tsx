"use client";

import { Lock } from "lucide-react";

import { useGame } from "@/components/GameProvider";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/cn";

export function Achievements() {
  const { achievements, isAchievementEarned } = useGame();

  return (
    <section id="achievements" className="scroll-mt-24 px-6 py-32 md:px-10 md:py-40">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="04"
          eyebrow="Achievements"
          title="Badges that mean something."
          description="Earned by clearing quests, reading the briefs and opening new nodes. One of them is still encrypted."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement, index) => {
            const earned = isAchievementEarned(achievement.id);
            const concealed = achievement.hidden === true && !earned;

            return (
              <Reveal key={achievement.id} delay={index * 70}>
                <article
                  className={cn(
                    "flex h-full flex-col rounded-3xl border p-7 transition-colors duration-500",
                    earned
                      ? "border-white/20 bg-white/[0.04]"
                      : "border-white/10 bg-white/[0.015]",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={cn(
                        "flex size-12 items-center justify-center rounded-2xl border transition-colors duration-500",
                        earned
                          ? "border-paper/25 bg-paper/10 text-paper"
                          : "border-white/10 bg-white/[0.03] text-white/25",
                      )}
                    >
                      {concealed ? (
                        <Lock className="size-5" strokeWidth={1.5} aria-hidden="true" />
                      ) : (
                        <Icon name={achievement.icon} className="size-5" strokeWidth={1.5} />
                      )}
                    </span>
                    {earned ? (
                      <span className="font-mono text-[11px] tracking-[0.16em] text-white/40">
                        +{achievement.xpReward} XP
                      </span>
                    ) : null}
                  </div>

                  <h3
                    className={cn(
                      "mt-6 text-lg tracking-tight",
                      earned ? "text-paper" : "text-white/60",
                    )}
                  >
                    {concealed ? "???" : achievement.name}
                  </h3>

                  <p
                    className={cn(
                      "mt-2 flex-1 text-sm leading-relaxed",
                      earned ? "text-white/50" : "text-white/30",
                    )}
                  >
                    {concealed
                      ? "Encrypted. Some achievements answer only to old console codes."
                      : achievement.description}
                  </p>

                  <p className="mt-6 border-t border-white/10 pt-4 text-[11px] uppercase tracking-[0.18em] text-white/30">
                    {concealed ? "Locked" : earned ? "Unlocked" : achievement.requirement}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
