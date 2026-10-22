"use client";

import { useGame } from "@/components/GameProvider";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { stats } from "@/data/portfolio";
import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";

const STAT_ICON = {
  "projects-shipped": "rocket",
  technologies: "component",
  contributions: "git-pull-request",
  quests: "target",
} as const;

function StatValue({ value }: { value: number }) {
  const { inView } = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const animated = useCountUp(value, inView);
  return <>{animated.toLocaleString("en-US")}</>;
}

export function Stats() {
  const { state, skills } = useGame();

  const resolved = stats.map((stat) => {
    if (stat.source === "skills") {
      return { ...stat, value: state.unlockedSkillIds.length };
    }
    if (stat.source === "quests") {
      return { ...stat, value: state.completedQuestIds.length };
    }
    return stat;
  });

  return (
    <section id="stats" className="scroll-mt-24 px-6 py-32 md:px-10 md:py-40">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="05"
          eyebrow="Track record"
          title="Numbers, quietly kept."
          description="A summary of shipped work, the technologies behind it and the contribution graph that fills the weekends."
        />

        <Reveal>
          <dl className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4">
            {resolved.map((stat) => (
              <div key={stat.id} className="bg-ink p-8 md:p-10">
                <dt className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-white/35">
                  <Icon
                    name={STAT_ICON[stat.id as keyof typeof STAT_ICON]}
                    className="size-3.5 text-white/40"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  {stat.label}
                </dt>
                <dd className="mt-6 text-[clamp(2.5rem,5vw,3.75rem)] font-medium leading-none tracking-[-0.04em] text-paper">
                  <StatValue value={stat.value} />
                </dd>
                <p className="mt-4 text-sm leading-relaxed text-white/35">{stat.caption}</p>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={90}>
          <p className="mt-8 text-sm text-white/30">
            Across {skills.length} tracked technologies and {stats.length} tracked measures, the
            run only moves forward.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
