"use client";

import { useGame } from "@/components/GameProvider";
import { QuestCard } from "@/components/QuestCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { SpotlightCard } from "@/components/SpotlightCard";

export function Quests() {
  const { quests } = useGame();

  return (
    <section id="quests" className="scroll-mt-24 px-6 py-32 md:px-10 md:py-40">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="02"
          eyebrow="Quest board"
          title="Three quests, one build."
          description="Each project is a quest with a difficulty, a reward and a brief worth reading. Open the briefing to see the constraint that made it interesting."
        />

        <div className="mt-14 space-y-6">
          {quests.map((quest, index) => (
            <Reveal key={quest.id} delay={index * 90}>
              <SpotlightCard className="rounded-3xl">
                <QuestCard quest={quest} />
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
