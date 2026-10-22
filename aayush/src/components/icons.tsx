import {
  Activity,
  Binary,
  Bot,
  Braces,
  CircleHelp,
  Cloud,
  Component,
  Database,
  Frame,
  Gauge,
  GitPullRequest,
  KeyRound,
  Landmark,
  Languages,
  Layers,
  Orbit,
  Palette,
  Puzzle,
  Radio,
  Rocket,
  Server,
  Target,
  Trophy,
  Waypoints,
  Workflow,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

import type { IconName } from "@/data/portfolio";

const REGISTRY: Record<IconName, LucideIcon> = {
  frame: Frame,
  braces: Braces,
  component: Component,
  layers: Layers,
  palette: Palette,
  orbit: Orbit,
  server: Server,
  database: Database,
  "key-round": KeyRound,
  workflow: Workflow,
  cloud: Cloud,
  bot: Bot,
  binary: Binary,
  waypoints: Waypoints,
  gauge: Gauge,
  activity: Activity,
  rocket: Rocket,
  puzzle: Puzzle,
  "git-pull-request": GitPullRequest,
  languages: Languages,
  landmark: Landmark,
  trophy: Trophy,
  radio: Radio,
  target: Target,
};

interface IconProps extends LucideProps {
  name: IconName;
}

export function Icon({ name, ...props }: IconProps) {
  // Guard against data drift: a missing glyph must never white-screen a page.
  const Glyph = REGISTRY[name] ?? CircleHelp;
  return <Glyph aria-hidden="true" {...props} />;
}

/* -------------------------------------------------------------------------- */
/*  Brand marks — lucide dropped third-party brand glyphs in v1, so the two    */
/*  marks we need are drawn here to stay dependency-free.                       */
/* -------------------------------------------------------------------------- */

export function GitHubIcon(props: LucideProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.12 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.05.78 2.12v3.14c0 .3.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

export function LinkedInIcon(props: LucideProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}
