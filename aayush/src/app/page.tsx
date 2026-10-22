import { Achievements } from "@/components/Achievements";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { GameProvider } from "@/components/GameProvider";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Quests } from "@/components/Quests";
import { SkillTree } from "@/components/SkillTree";
import { Stats } from "@/components/Stats";
import { Toaster } from "@/components/Toaster";
import { XpPanel } from "@/components/XpPanel";

export default function Home() {
  return (
    <GameProvider>
      <Navbar />
      <main>
        <Hero />
        <XpPanel />
        <Quests />
        <SkillTree />
        <Achievements />
        <Stats />
        <Contact />
      </main>
      <Footer />
      <Toaster />
    </GameProvider>
  );
}
