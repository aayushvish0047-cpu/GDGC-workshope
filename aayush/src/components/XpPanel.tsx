"use client";

import { RotateCcw, Zap } from "lucide-react";

import { useGame } from "@/components/GameProvider";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ranks } from "@/data/portfolio";
import { formatXp } from "@/lib/game";

export function XpPanel() {
  const { xp, state, quests, achievements, skills, resetProgress } = useGame();

  const questsCleared = state.completedQuestIds.length;
  const badgesEarned = state.grantedAchievementIds.length;
  const technologies = state.unlockedSkillIds.length;
  const percent = Math.round(xp.ratio * 100);

  return (
    <section id="progress" className="scroll-mt-24 px-6 py-32 md:px-10 md:py-40">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="01"
          eyebrow="Progression"
          title="Your run, quantified."
          description="Experience accrues from cleared quests and unlocked badges. Spend it to open new nodes in the skill tree — each unlock raises the ceiling."
        />

        <Reveal delay={80}>
          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/[0.07] md:grid-cols-12">
            <div className="bg-ink p-8 md:col-span-5 md:p-10">
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">Current level</p>
              <p className="mt-4 text-[clamp(4rem,11vw,7rem)] font-medium leading-[0.85] tracking-[-0.05em] text-paper">
                {String(xp.level).padStart(2, "0")}
              </p>
              <p className="mt-5 flex items-center gap-2.5 text-lg tracking-tight text-white/70">
                <Zap className="size-4 text-paper/70" aria-hidden="true" />
                {xp.rank}
              </p>
              <p className="mt-8 border-t border-white/10 pt-5 text-sm text-white/40">
                <span className="text-paper">{formatXp(xp.earned)}</span> XP earned in total
              </p>
            </div>

            <div className="bg-ink p-8 md:col-span-7 md:p-10">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">
                    Level {xp.level} → Level {xp.level + 1}
                  </p>
                  <p className="mt-3 text-3xl font-medium tracking-tight text-paper">
                    {formatXp(xp.current)}
                    <span className="text-white/30"> / {formatXp(xp.needed)} XP</span>
                  </p>
                </div>
                <p className="font-mono text-xs tracking-[0.2em] text-white/40">{percent}%</p>
              </div>

              <div
                role="progressbar"
                aria-label="Progress to next level"
                aria-valuemin={0}
                aria-valuemax={xp.needed}
                aria-valuenow={xp.current}
                className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10"
              >
                <div
                  className="h-full rounded-full bg-paper transition-[width] duration-1000 ease-out"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <p className="mt-5 text-sm text-white/40">
                <span className="text-paper">{formatXp(xp.needed - xp.current)} XP</span> still needed
                to reach level {xp.level + 1}
              </p>

              <ol className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-6">
                {ranks
                  .slice()
                  .reverse()
                  .map((rank) => {
                    const active = xp.level >= rank.minLevel;
                    return (
                      <li
                        key={rank.title}
                        className={
                          active
                            ? "text-[11px] uppercase tracking-[0.18em] text-paper"
                            : "text-[11px] uppercase tracking-[0.18em] text-white/20"
                        }
                      >
                        {rank.title}
                      </li>
                    );
                  })}
              </ol>
            </div>

            <div className="bg-ink p-8 md:col-span-4 md:p-10">
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">Unspent XP</p>
              <p className="mt-4 text-4xl font-medium tracking-tight text-paper">
                {formatXp(xp.available)}
              </p>
              <p className="mt-3 text-sm text-white/40">Available to spend on skill nodes</p>
            </div>

            <div className="bg-ink p-8 md:col-span-4 md:p-10">
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">Quests cleared</p>
              <p className="mt-4 text-4xl font-medium tracking-tight text-paper">
                {String(questsCleared).padStart(2, "0")}
                <span className="text-white/25"> / {String(quests.length).padStart(2, "0")}</span>
              </p>
              <p className="mt-3 text-sm text-white/40">Briefings completed</p>
            </div>

            <div className="bg-ink p-8 md:col-span-4 md:p-10">
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">Badges &amp; tech</p>
              <p className="mt-4 text-4xl font-medium tracking-tight text-paper">
                {badgesEarned}
                <span className="text-white/25"> / {achievements.length}</span>
              </p>
              <p className="mt-3 text-sm text-white/40">
                {technologies} of {skills.length} technologies unlocked
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={resetProgress}
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs tracking-tight text-white/40 transition-colors duration-300 hover:border-white/30 hover:text-white/80"
            >
              <RotateCcw
                className="size-3.5 transition-transform duration-500 group-hover:-rotate-180"
                aria-hidden="true"
              />
              Reset progress
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
