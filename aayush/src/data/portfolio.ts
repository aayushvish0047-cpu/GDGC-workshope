/**
 * Single source of truth for every piece of portfolio content.
 * The file is intentionally free of React imports so it can be consumed from
 * both server and client components without dragging the icon set into the
 * server bundle.
 */

export type IconName =
  | "frame"
  | "braces"
  | "component"
  | "layers"
  | "palette"
  | "orbit"
  | "server"
  | "database"
  | "key-round"
  | "workflow"
  | "cloud"
  | "bot"
  | "binary"
  | "waypoints"
  | "gauge"
  | "activity"
  | "rocket"
  | "puzzle"
  | "git-pull-request"
  | "languages"
  | "landmark"
  | "trophy"
  | "radio"
  | "target";

export type Difficulty = "Novice" | "Advanced" | "Expert" | "Legendary";
export type QuestStatus = "completed" | "active" | "locked";
export type SkillCategory = "Frontend" | "Backend" | "AI/ML";
export type SkillTier = 1 | 2 | 3 | 4 | 5;

export interface DeveloperProfile {
  name: string;
  role: string;
  location: string;
  availability: string;
  email: string;
  github: string;
  linkedin: string;
  yearsOfExperience: number;
  hero: {
    eyebrow: string;
    headline: string;
    lede: string;
    cta: string;
  };
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface QuestMetric {
  label: string;
  value: string;
}

export interface Quest {
  id: string;
  index: string;
  title: string;
  tagline: string;
  description: string;
  challenge: string;
  difficulty: Difficulty;
  xpReward: number;
  status: QuestStatus;
  technologies: string[];
  metrics: QuestMetric[];
  links: ProjectLink[];
}

export interface SkillNode {
  id: string;
  name: string;
  category: SkillCategory;
  tier: SkillTier;
  xpCost: number;
  requires: string[];
  proficiency: number;
  description: string;
  icon: IconName;
}

export interface ProgressSnapshot {
  completedQuests: number;
  inspectedQuests: number;
  unlockedSkills: number;
  secretFound: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  requirement: string;
  xpReward: number;
  icon: IconName;
  hidden?: boolean;
  isEarned: (progress: ProgressSnapshot) => boolean;
}

export interface StatDefinition {
  id: string;
  label: string;
  caption: string;
  value: number;
  source: "static" | "skills" | "quests";
}

export interface NavLink {
  id: string;
  label: string;
}

/* -------------------------------------------------------------------------- */
/*  Profile                                                                   */
/* -------------------------------------------------------------------------- */

export const profile: DeveloperProfile = {
  name: "Alex",
  role: "Frontend Engineer",
  location: "Bengaluru, India",
  availability: "Open to select work — Q1 2026",
  email: "hello@alex.dev",
  github: "https://github.com/alex",
  linkedin: "https://www.linkedin.com/in/alex",
  yearsOfExperience: 8,
  hero: {
    eyebrow: "Frontend Engineer · Design Engineer",
    headline: "Interfaces that feel inevitable.",
    lede: "I build products where the interface disappears — fast, quiet and precise. Eight years spent between design systems and production runtime.",
    cta: "Begin the run",
  },
};

/* -------------------------------------------------------------------------- */
/*  Progression curve                                                         */
/* -------------------------------------------------------------------------- */

/** Total XP required to *reach* a given level. L1 = 0, L2 = 100, L3 = 400 … */
export function xpForLevel(level: number): number {
  return 100 * (level - 1) ** 2;
}

export interface Rank {
  minLevel: number;
  title: string;
}

export const ranks: Rank[] = [
  { minLevel: 15, title: "Luminary" },
  { minLevel: 12, title: "Architect" },
  { minLevel: 9, title: "Specialist" },
  { minLevel: 7, title: "Adept" },
  { minLevel: 5, title: "Journeyman" },
  { minLevel: 3, title: "Apprentice" },
  { minLevel: 1, title: "Initiate" },
];

export function rankForLevel(level: number): string {
  return ranks.find((rank) => level >= rank.minLevel)?.title ?? "Initiate";
}

/* -------------------------------------------------------------------------- */
/*  Quests                                                                    */
/* -------------------------------------------------------------------------- */

export const quests: Quest[] = [
  {
    id: "aurora-analytics",
    index: "Quest I",
    title: "Aurora Analytics",
    tagline: "Realtime product analytics without the dashboard tax.",
    description:
      "A streaming analytics suite that ingests billions of events a day and renders them into dashboards that stay interactive under load. I owned the entire frontend — from the design system and charting layer to the virtualised table that stays smooth at 100k rows.",
    challenge: "Streaming 2.4B events a day without dropping a single query.",
    difficulty: "Advanced",
    xpReward: 700,
    status: "completed",
    technologies: ["Next.js", "TypeScript", "tRPC", "PostgreSQL", "Tailwind CSS"],
    metrics: [
      { label: "Time to insight", value: "< 400ms" },
      { label: "Events / day", value: "2.4B" },
      { label: "Uptime", value: "99.98%" },
    ],
    links: [
      { label: "Live", href: "https://aurora-analytics.example.com" },
      { label: "Source", href: "https://github.com/alex/aurora-analytics" },
    ],
  },
  {
    id: "vertex-commerce",
    index: "Quest II",
    title: "Vertex Commerce",
    tagline: "A headless storefront with a checkout that converts.",
    description:
      "Rebuilt a legacy storefront as a composable headless platform. Twelve markets, three currencies, one checkout flow — plus a design system that let three teams ship without stepping on each other.",
    challenge: "Replacing checkout behind a live storefront with zero downtime.",
    difficulty: "Expert",
    xpReward: 1000,
    status: "completed",
    technologies: ["Next.js", "Stripe", "Redux Toolkit", "Node.js", "PostgreSQL"],
    metrics: [
      { label: "Conversion", value: "+38%" },
      { label: "LCP", value: "0.9s" },
      { label: "Markets", value: "12" },
    ],
    links: [
      { label: "Live", href: "https://vertex-commerce.example.com" },
      { label: "Source", href: "https://github.com/alex/vertex-commerce" },
    ],
  },
  {
    id: "nebula-studio",
    index: "Quest III",
    title: "Nebula Studio",
    tagline: "An AI workbench that grounds every answer.",
    description:
      "A prompt workbench for support and research teams. Every response is grounded in a 12M-chunk corpus, cited inline, and streamed token by token with a latency budget that never broke.",
    challenge: "Grounding a chat assistant on 12M chunks without losing p95 latency.",
    difficulty: "Legendary",
    xpReward: 1500,
    status: "active",
    technologies: ["React", "TypeScript", "RAG", "pgvector", "Next.js"],
    metrics: [
      { label: "Grounded answers", value: "94%" },
      { label: "p95 latency", value: "1.2s" },
      { label: "Corpus", value: "12M chunks" },
    ],
    links: [
      { label: "Live", href: "https://nebula-studio.example.com" },
      { label: "Source", href: "https://github.com/alex/nebula-studio" },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Skill tree                                                                */
/* -------------------------------------------------------------------------- */

export const skillCategories: SkillCategory[] = ["Frontend", "Backend", "AI/ML"];

export const skills: SkillNode[] = [
  {
    id: "html-css",
    name: "HTML & CSS",
    category: "Frontend",
    tier: 1,
    xpCost: 0,
    requires: [],
    proficiency: 96,
    description: "Semantic markup, modern layout primitives and an obsessive eye for spacing.",
    icon: "frame",
  },
  {
    id: "js-ts",
    name: "JavaScript & TypeScript",
    category: "Frontend",
    tier: 1,
    xpCost: 0,
    requires: [],
    proficiency: 94,
    description: "Type-level thinking, async fluency and ruthless refactoring.",
    icon: "braces",
  },
  {
    id: "react",
    name: "React & Hooks",
    category: "Frontend",
    tier: 2,
    xpCost: 150,
    requires: ["js-ts"],
    proficiency: 92,
    description: "Composition, render cost, and knowing when not to re-render.",
    icon: "component",
  },
  {
    id: "nextjs",
    name: "Next.js App Router",
    category: "Frontend",
    tier: 3,
    xpCost: 300,
    requires: ["react"],
    proficiency: 90,
    description: "Server components, streaming, caching and the edges of the model.",
    icon: "layers",
  },
  {
    id: "tailwind",
    name: "Design Systems & Tailwind",
    category: "Frontend",
    tier: 3,
    xpCost: 200,
    requires: ["js-ts"],
    proficiency: 89,
    description: "Tokens, constraints and a component API that survives its authors.",
    icon: "palette",
  },
  {
    id: "threejs",
    name: "Three.js & WebGL",
    category: "Frontend",
    tier: 5,
    xpCost: 500,
    requires: ["nextjs", "tailwind"],
    proficiency: 74,
    description: "Realtime 3D scenes, shaders and a hard frame budget.",
    icon: "orbit",
  },
  {
    id: "node",
    name: "Node.js & REST",
    category: "Backend",
    tier: 2,
    xpCost: 150,
    requires: ["js-ts"],
    proficiency: 88,
    description: "Runtime fundamentals, streaming responses and sane API surfaces.",
    icon: "server",
  },
  {
    id: "postgres",
    name: "PostgreSQL & Prisma",
    category: "Backend",
    tier: 2,
    xpCost: 200,
    requires: ["node"],
    proficiency: 86,
    description: "Query plans, migrations and a typed data layer that doesn't lie.",
    icon: "database",
  },
  {
    id: "auth",
    name: "Auth & Sessions",
    category: "Backend",
    tier: 3,
    xpCost: 250,
    requires: ["postgres"],
    proficiency: 84,
    description: "OAuth, session strategy and permissions that are boring on purpose.",
    icon: "key-round",
  },
  {
    id: "trpc",
    name: "API Design & tRPC",
    category: "Backend",
    tier: 3,
    xpCost: 300,
    requires: ["node"],
    proficiency: 85,
    description: "End-to-end types, versioning and contracts clients trust.",
    icon: "workflow",
  },
  {
    id: "edge",
    name: "Edge & Serverless",
    category: "Backend",
    tier: 4,
    xpCost: 350,
    requires: ["nextjs"],
    proficiency: 79,
    description: "Cold starts, geographic routing and functions that stay cheap.",
    icon: "cloud",
  },
  {
    id: "llm",
    name: "LLM Prompting",
    category: "AI/ML",
    tier: 2,
    xpCost: 200,
    requires: ["js-ts"],
    proficiency: 83,
    description: "Prompt structure, tool use and evals that catch regressions.",
    icon: "bot",
  },
  {
    id: "embeddings",
    name: "Embeddings & Vector Search",
    category: "AI/ML",
    tier: 3,
    xpCost: 250,
    requires: ["postgres"],
    proficiency: 80,
    description: "Chunking strategies, ANN indexes and retrieval quality.",
    icon: "binary",
  },
  {
    id: "rag",
    name: "RAG Pipelines",
    category: "AI/ML",
    tier: 4,
    xpCost: 350,
    requires: ["llm", "embeddings"],
    proficiency: 81,
    description: "Grounding, reranking, citations and measurable precision.",
    icon: "waypoints",
  },
  {
    id: "evaluation",
    name: "Model Evaluation",
    category: "AI/ML",
    tier: 4,
    xpCost: 300,
    requires: ["rag"],
    proficiency: 76,
    description: "Golden sets, LLM judges and knowing when a prompt regressed.",
    icon: "gauge",
  },
  {
    id: "mlops",
    name: "MLOps & Observability",
    category: "AI/ML",
    tier: 5,
    xpCost: 400,
    requires: ["evaluation", "edge"],
    proficiency: 72,
    description: "Tracing, drift, cost control and safe incremental rollout.",
    icon: "activity",
  },
];

/* -------------------------------------------------------------------------- */
/*  Achievements                                                              */
/* -------------------------------------------------------------------------- */

export const achievements: Achievement[] = [
  {
    id: "first-steps",
    name: "First Steps",
    description: "Complete your first quest briefing.",
    requirement: "Complete 1 quest",
    xpReward: 100,
    icon: "rocket",
    isEarned: (progress) => progress.completedQuests >= 1,
  },
  {
    id: "problem-solver",
    name: "Problem Solver",
    description: "Read the brief on every quest before you claim it.",
    requirement: "Inspect all 3 quests",
    xpReward: 150,
    icon: "puzzle",
    isEarned: (progress) => progress.inspectedQuests >= 3,
  },
  {
    id: "open-source",
    name: "Open Source Contributor",
    description: "Ship every quest on the board and contribute the work back.",
    requirement: "Complete all 3 quests",
    xpReward: 250,
    icon: "git-pull-request",
    isEarned: (progress) => progress.completedQuests >= 3,
  },
  {
    id: "polyglot",
    name: "Polyglot",
    description: "Five technologies unlocked across three disciplines.",
    requirement: "Unlock 5 skill nodes",
    xpReward: 200,
    icon: "languages",
    isEarned: (progress) => progress.unlockedSkills >= 5,
  },
  {
    id: "deep-architect",
    name: "Deep Architect",
    description: "Ten technologies unlocked — the tree starts to make sense.",
    requirement: "Unlock 10 skill nodes",
    xpReward: 350,
    icon: "landmark",
    isEarned: (progress) => progress.unlockedSkills >= 10,
  },
  {
    id: "completionist",
    name: "Completionist",
    description: "Every node in the tree, unlocked.",
    requirement: "Unlock all 16 skill nodes",
    xpReward: 400,
    icon: "trophy",
    isEarned: (progress) => progress.unlockedSkills >= 16,
  },
  {
    id: "signal-hunter",
    name: "Signal Hunter",
    description: "You found the signal nobody was supposed to find.",
    requirement: "Decode the hidden sequence",
    xpReward: 500,
    icon: "radio",
    hidden: true,
    isEarned: (progress) => progress.secretFound,
  },
];

/* -------------------------------------------------------------------------- */
/*  Stats                                                                     */
/* -------------------------------------------------------------------------- */

export const stats: StatDefinition[] = [
  {
    id: "projects-shipped",
    label: "Projects Shipped",
    caption: "Production launches across fintech, commerce and AI tooling.",
    value: 24,
    source: "static",
  },
  {
    id: "technologies",
    label: "Technologies Mastered",
    caption: "Nodes unlocked in your personal skill tree.",
    value: 0,
    source: "skills",
  },
  {
    id: "contributions",
    label: "GitHub Contributions",
    caption: "Commits, pull requests and reviews over the last 12 months.",
    value: 1284,
    source: "static",
  },
  {
    id: "quests",
    label: "Quests Completed",
    caption: "Briefings closed out of the quest board.",
    value: 0,
    source: "quests",
  },
];

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                */
/* -------------------------------------------------------------------------- */

export const navLinks: NavLink[] = [
  { id: "progress", label: "Progress" },
  { id: "quests", label: "Quests" },
  { id: "skills", label: "Skills" },
  { id: "achievements", label: "Badges" },
  { id: "stats", label: "Stats" },
  { id: "contact", label: "Contact" },
];

/** Classic console sequence. Entering it decodes the hidden achievement. */
export const secretSequence: string[] = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];
