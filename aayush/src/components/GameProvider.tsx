"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  achievements,
  quests,
  rankForLevel,
  skills,
  type Achievement,
  type IconName,
  type Quest,
  type SkillNode,
} from "@/data/portfolio";
import {
  availableXp,
  earnedXp,
  evaluateUnlock,
  gameReducer,
  INITIAL_STATE,
  levelProgress,
  spentXp,
  type GameState,
  type UnlockVerdict,
} from "@/lib/game";

const STORAGE_KEY = "alex.portfolio.progress.v1";

export interface Toast {
  id: number;
  title: string;
  description?: string;
  icon?: IconName;
}

interface GameContextValue {
  state: GameState;
  quests: Quest[];
  skills: SkillNode[];
  achievements: Achievement[];
  xp: {
    earned: number;
    spent: number;
    available: number;
    level: number;
    rank: string;
    current: number;
    needed: number;
    ratio: number;
  };
  isQuestCompleted: (id: string) => boolean;
  isQuestInspected: (id: string) => boolean;
  isSkillUnlocked: (id: string) => boolean;
  isAchievementEarned: (id: string) => boolean;
  completeQuest: (id: string) => void;
  inspectQuest: (id: string) => void;
  unlockSkill: (id: string) => void;
  discoverSecret: () => void;
  resetProgress: () => void;
  unlockVerdict: (node: SkillNode) => UnlockVerdict;
  toasts: Toast[];
  notify: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: number) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    gameReducer,
    INITIAL_STATE,
    (initial) => gameReducer(initial, { type: "hydrate", state: initial }),
  );
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const toastId = useRef(0);
  const previous = useRef<GameState | null>(null);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback((toast: Omit<Toast, "id">) => {
    setToasts((current) => [...current, { ...toast, id: toastId.current++ }].slice(-4));
  }, []);

  /* Restore persisted progress after mount so the server and client markup
     stay identical on the very first paint. */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", state: JSON.parse(raw) as Partial<GameState> });
    } catch {
      /* Corrupt or unavailable storage — fall back to the starting state. */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* Private mode / quota — progress simply will not persist. */
    }
  }, [state, hydrated]);

  /* Translate state transitions into notifications. */
  useEffect(() => {
    if (!hydrated) return;
    const before = previous.current;
    previous.current = state;
    if (!before) return;

    const fresh: Toast[] = [];

    if (state.secretFound && !before.secretFound) {
      fresh.push({
        id: toastId.current++,
        title: "Hidden signal decoded",
        description: "Signal Hunter unlocked · +500 XP",
        icon: "radio",
      });
    }

    for (const id of state.completedQuestIds) {
      if (before.completedQuestIds.includes(id)) continue;
      const quest = quests.find((item) => item.id === id);
      if (!quest) continue;
      fresh.push({
        id: toastId.current++,
        title: `${quest.title} completed`,
        description: `Quest cleared · +${quest.xpReward} XP`,
        icon: "rocket",
      });
    }

    for (const id of state.unlockedSkillIds) {
      if (before.unlockedSkillIds.includes(id)) continue;
      const node = skills.find((item) => item.id === id);
      if (!node) continue;
      fresh.push({
        id: toastId.current++,
        title: `${node.name} unlocked`,
        description: `${node.category} · −${node.xpCost} XP`,
        icon: node.icon,
      });
    }

    for (const id of state.grantedAchievementIds) {
      if (before.grantedAchievementIds.includes(id)) continue;
      const achievement = achievements.find((item) => item.id === id);
      if (!achievement || achievement.hidden) continue;
      fresh.push({
        id: toastId.current++,
        title: achievement.name,
        description: `Badge earned · +${achievement.xpReward} XP`,
        icon: achievement.icon,
      });
    }

    if (fresh.length > 0) setToasts((current) => [...current, ...fresh].slice(-4));
  }, [state, hydrated]);

  const isQuestCompleted = useCallback(
    (id: string) => state.completedQuestIds.includes(id),
    [state.completedQuestIds],
  );
  const isQuestInspected = useCallback(
    (id: string) => state.inspectedQuestIds.includes(id),
    [state.inspectedQuestIds],
  );
  const isSkillUnlocked = useCallback(
    (id: string) => state.unlockedSkillIds.includes(id),
    [state.unlockedSkillIds],
  );
  const isAchievementEarned = useCallback(
    (id: string) => state.grantedAchievementIds.includes(id),
    [state.grantedAchievementIds],
  );

  const completeQuest = useCallback((id: string) => {
    dispatch({ type: "complete-quest", id });
  }, []);

  const inspectQuest = useCallback((id: string) => {
    dispatch({ type: "inspect-quest", id });
  }, []);

  const unlockSkill = useCallback(
    (id: string) => {
      const node = skills.find((skill) => skill.id === id);
      if (!node) return;
      if (!evaluateUnlock(state, node).ok) return;
      dispatch({ type: "unlock-skill", id });
    },
    [state],
  );

  const discoverSecret = useCallback(() => {
    dispatch({ type: "discover-secret" });
  }, []);

  const resetProgress = useCallback(() => {
    dispatch({ type: "reset" });
    notify({ title: "Progress reset", description: "Back to the starting line" });
  }, [notify]);

  const unlockVerdict = useCallback((node: SkillNode) => evaluateUnlock(state, node), [state]);

  const value = useMemo<GameContextValue>(() => {
    const earned = earnedXp(state);
    const progress = levelProgress(earned);
    return {
      state,
      quests,
      skills,
      achievements,
      xp: {
        earned,
        spent: spentXp(state),
        available: availableXp(state),
        level: progress.level,
        rank: rankForLevel(progress.level),
        current: progress.current,
        needed: progress.needed,
        ratio: progress.ratio,
      },
      isQuestCompleted,
      isQuestInspected,
      isSkillUnlocked,
      isAchievementEarned,
      completeQuest,
      inspectQuest,
      unlockSkill,
      discoverSecret,
      resetProgress,
      unlockVerdict,
      toasts,
      notify,
      dismissToast,
    };
  }, [
    state,
    isQuestCompleted,
    isQuestInspected,
    isSkillUnlocked,
    isAchievementEarned,
    completeQuest,
    inspectQuest,
    unlockSkill,
    discoverSecret,
    resetProgress,
    unlockVerdict,
    toasts,
    notify,
    dismissToast,
  ]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used inside <GameProvider>.");
  return context;
}
