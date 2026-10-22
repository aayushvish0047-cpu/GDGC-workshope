import {
  achievements,
  quests,
  skills,
  type Achievement,
  type ProgressSnapshot,
  type SkillNode,
} from "@/data/portfolio";

export interface GameState {
  completedQuestIds: string[];
  inspectedQuestIds: string[];
  unlockedSkillIds: string[];
  grantedAchievementIds: string[];
  secretFound: boolean;
}

export type GameAction =
  | { type: "complete-quest"; id: string }
  | { type: "inspect-quest"; id: string }
  | { type: "unlock-skill"; id: string }
  | { type: "discover-secret" }
  | { type: "hydrate"; state: Partial<GameState> }
  | { type: "reset" };

export const INITIAL_STATE: GameState = {
  completedQuestIds: ["aurora-analytics", "vertex-commerce"],
  inspectedQuestIds: [],
  unlockedSkillIds: ["html-css", "js-ts"],
  grantedAchievementIds: [],
  secretFound: false,
};

function uniqueIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.filter((item): item is string => typeof item === "string")));
}

export function sanitizeState(value: unknown): GameState {
  const raw = (value ?? {}) as Partial<GameState>;
  const state: GameState = {
    completedQuestIds: uniqueIds(raw.completedQuestIds),
    inspectedQuestIds: uniqueIds(raw.inspectedQuestIds),
    unlockedSkillIds: uniqueIds(raw.unlockedSkillIds),
    grantedAchievementIds: uniqueIds(raw.grantedAchievementIds),
    secretFound: raw.secretFound === true,
  };

  // Drop ids that no longer exist in the content model.
  state.completedQuestIds = state.completedQuestIds.filter((id) => quests.some((quest) => quest.id === id));
  state.inspectedQuestIds = state.inspectedQuestIds.filter((id) => quests.some((quest) => quest.id === id));
  state.unlockedSkillIds = state.unlockedSkillIds.filter((id) => skills.some((skill) => skill.id === id));
  state.grantedAchievementIds = state.grantedAchievementIds.filter((id) =>
    achievements.some((achievement) => achievement.id === id),
  );

  return state;
}

export function snapshotOf(state: GameState): ProgressSnapshot {
  return {
    completedQuests: state.completedQuestIds.length,
    inspectedQuests: state.inspectedQuestIds.length,
    unlockedSkills: state.unlockedSkillIds.length,
    secretFound: state.secretFound,
  };
}

/**
 * Grants every achievement whose requirement is now satisfied.
 * Achievements are awarded exactly once — the granted list is the ledger.
 */
function syncAchievements(state: GameState): GameState {
  const progress = snapshotOf(state);
  const granted = new Set(state.grantedAchievementIds);

  for (const achievement of achievements) {
    if (granted.has(achievement.id)) continue;
    if (achievement.hidden && !state.secretFound) continue;
    if (achievement.isEarned(progress)) granted.add(achievement.id);
  }

  if (granted.size === state.grantedAchievementIds.length) return state;
  return { ...state, grantedAchievementIds: Array.from(granted) };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "hydrate":
      return syncAchievements(sanitizeState(action.state));

    case "reset":
      return syncAchievements({ ...INITIAL_STATE });

    case "complete-quest": {
      if (!quests.some((quest) => quest.id === action.id)) return state;
      if (state.completedQuestIds.includes(action.id)) return state;
      return syncAchievements({
        ...state,
        completedQuestIds: [...state.completedQuestIds, action.id],
      });
    }

    case "inspect-quest": {
      if (!quests.some((quest) => quest.id === action.id)) return state;
      if (state.inspectedQuestIds.includes(action.id)) return state;
      return syncAchievements({
        ...state,
        inspectedQuestIds: [...state.inspectedQuestIds, action.id],
      });
    }

    case "unlock-skill": {
      const node = skills.find((skill) => skill.id === action.id);
      if (!node) return state;
      if (state.unlockedSkillIds.includes(action.id)) return state;
      return syncAchievements({
        ...state,
        unlockedSkillIds: [...state.unlockedSkillIds, action.id],
      });
    }

    case "discover-secret": {
      if (state.secretFound) return state;
      return syncAchievements({ ...state, secretFound: true });
    }

    default:
      return state;
  }
}

/* -------------------------------------------------------------------------- */
/*  Selectors                                                                 */
/* -------------------------------------------------------------------------- */

export function earnedXp(state: GameState): number {
  const fromQuests = quests
    .filter((quest) => state.completedQuestIds.includes(quest.id))
    .reduce((total, quest) => total + quest.xpReward, 0);
  const fromAchievements = achievements
    .filter((achievement) => state.grantedAchievementIds.includes(achievement.id))
    .reduce((total, achievement) => total + achievement.xpReward, 0);
  return fromQuests + fromAchievements;
}

export function spentXp(state: GameState): number {
  return skills
    .filter((skill) => state.unlockedSkillIds.includes(skill.id))
    .reduce((total, skill) => total + skill.xpCost, 0);
}

export function availableXp(state: GameState): number {
  return Math.max(0, earnedXp(state) - spentXp(state));
}

export function levelFromXp(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function levelProgress(xp: number) {
  const level = levelFromXp(xp);
  const floor = 100 * (level - 1) ** 2;
  const ceiling = 100 * level ** 2;
  const current = xp - floor;
  const needed = ceiling - floor;
  return {
    level,
    current,
    needed,
    ratio: needed === 0 ? 1 : Math.min(1, Math.max(0, current / needed)),
  };
}

export interface UnlockVerdict {
  ok: boolean;
  reason: string;
  missingPrerequisites: string[];
  shortfall: number;
}

export function evaluateUnlock(state: GameState, node: SkillNode): UnlockVerdict {
  const missingPrerequisites = node.requires.filter(
    (id) => !state.unlockedSkillIds.includes(id),
  );

  if (missingPrerequisites.length > 0) {
    const names = missingPrerequisites
      .map((id) => skills.find((skill) => skill.id === id)?.name ?? id)
      .join(", ");
    return {
      ok: false,
      reason: `Requires ${names}`,
      missingPrerequisites,
      shortfall: 0,
    };
  }

  const shortfall = Math.max(0, node.xpCost - availableXp(state));
  if (shortfall > 0) {
    return {
      ok: false,
      reason: `Needs ${shortfall.toLocaleString()} more XP`,
      missingPrerequisites,
      shortfall,
    };
  }

  return { ok: true, reason: "Ready to unlock", missingPrerequisites, shortfall: 0 };
}

export function achievementById(id: string): Achievement | undefined {
  return achievements.find((achievement) => achievement.id === id);
}

export function formatXp(value: number): string {
  return value.toLocaleString("en-US");
}
