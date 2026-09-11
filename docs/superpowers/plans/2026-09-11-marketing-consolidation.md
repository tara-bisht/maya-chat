# Marketing Worktree Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate three parallel Remotion marketing video worktrees (`muse`, `gemini`, `grok`) into a single `@maya/marketing-promo` workspace package under `marketing/promo/`, sharing common avatars, theme assets, and studio runner, while preserving each task's individual video compositions, eliminating video outputs from git tracking, opening a fresh PR, and cleaning up worktrees.

**Architecture:** A single unified Remotion workspace package with a root Studio (`Root.tsx`) hosting all 6 compositions. Shared static assets (12 character avatars) are stored in `marketing/promo/public/avatars/`, audio stems are organized by variant in `marketing/promo/public/audio/<variant>/`, common theme and UI components live in `src/shared/`, and individual task scenes and compositions reside in `src/muse/`, `src/gemini/`, and `src/grok/`. All video and still outputs render to gitignored `out/`.

**Tech Stack:** React 19, Remotion 4.0.x, TypeScript 5.8, pnpm workspaces, Turbo.

## Global Constraints

- Never commit `.mp4`, `.wav`, or rendered files into Git.
- Preserve the narrative, animations, typography, and scene timing of Muse (v1 & v2), Gemini (v1 & v2), and Grok (v1 & v2).
- Comply with monorepo standards in `AGENTS.md` (Conventional Commits, squash-merge PR workflow, zero secrets in git).
- Do not lose locally rendered MP4 files: back them up into `marketing/promo/out/`.

---

### Task 1: Git Branch Preparation & Monorepo Root Wiring

**Files:**
- Modify: `pnpm-workspace.yaml`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: Existing root `main` branch.
- Produces: `feat/marketing-video-suite` branch with `marketing/promo` package included in pnpm workspaces and output files gitignored.

- [ ] **Step 1: Create feature branch**
  Run:
  ```bash
  git checkout main
  git pull origin main
  git checkout -b feat/marketing-video-suite
  ```

- [ ] **Step 2: Update `pnpm-workspace.yaml`**
  Add `"marketing/promo"` to the workspace packages:
  ```yaml
  packages:
    - "apps/*"
    - "packages/*"
    - "marketing/promo"
  ```

- [ ] **Step 3: Update root `.gitignore`**
  Ensure marketing outputs and video files are ignored:
  ```gitignore
  # Marketing video outputs
  marketing/**/out/
  marketing/**/*.mp4
  marketing/**/*.wav
  *.mp4
  *.wav
  ```

- [ ] **Step 4: Verify git status**
  Run: `git status`
  Expected: Only `pnpm-workspace.yaml` and `.gitignore` modified (plus docs).

---

### Task 2: Package Scaffolding & Configuration

**Files:**
- Create: `marketing/promo/package.json`
- Create: `marketing/promo/remotion.config.ts`
- Create: `marketing/promo/tsconfig.json`
- Create: `marketing/promo/.gitignore`
- Create: `marketing/promo/README.md`

**Interfaces:**
- Consumes: pnpm workspace root.
- Produces: Type-safe, buildable `@maya/marketing-promo` package definition with unified render and studio scripts.

- [ ] **Step 1: Create `marketing/promo/package.json`**
  ```json
  {
    "name": "@maya/marketing-promo",
    "version": "1.0.0",
    "private": true,
    "scripts": {
      "dev": "remotion studio src/index.ts",
      "typecheck": "tsc --noEmit",
      "render:muse:v1": "remotion render src/index.ts LaunchMuse out/launch-muse-v1.mp4 --overwrite",
      "render:muse:v2": "remotion render src/index.ts LaunchMuseV2 out/launch-muse-v2.mp4 --overwrite",
      "render:muse": "pnpm render:muse:v1 && pnpm render:muse:v2",
      "render:gemini:v1": "remotion render src/index.ts MayaLaunch out/launch-gemini-v1.mp4 --overwrite",
      "render:gemini:v2": "remotion render src/index.ts MayaLaunchV2 out/launch-gemini-v2.mp4 --overwrite",
      "render:gemini": "pnpm render:gemini:v1 && pnpm render:gemini:v2",
      "render:grok:v1": "remotion render src/index.ts LaunchGrok out/launch-grok-v1.mp4 --overwrite",
      "render:grok:v2": "remotion render src/index.ts LaunchGrokV2 out/launch-grok-v2.mp4 --overwrite",
      "render:grok": "pnpm render:grok:v1 && pnpm render:grok:v2",
      "render:all": "pnpm render:muse && pnpm render:gemini && pnpm render:grok",
      "still": "remotion still src/index.ts LaunchMuseV2 out/still.png --overwrite"
    },
    "dependencies": {
      "@remotion/cli": "4.0.400",
      "@remotion/google-fonts": "4.0.400",
      "react": "19.1.0",
      "react-dom": "19.1.0",
      "remotion": "4.0.400"
    },
    "devDependencies": {
      "@types/react": "^19",
      "@types/react-dom": "^19",
      "typescript": "^5.8.3"
    }
  }
  ```

- [ ] **Step 2: Create `marketing/promo/remotion.config.ts`**
  ```ts
  import { Config } from '@remotion/cli/config';

  Config.setVideoImageFormat('jpeg');
  Config.setPixelFormat('yuv420p');
  Config.setConcurrency(4);
  Config.setChromiumOpenGlRenderer('angle');
  ```

- [ ] **Step 3: Create `marketing/promo/tsconfig.json`**
  ```json
  {
    "compilerOptions": {
      "target": "ES2022",
      "module": "NodeNext",
      "moduleResolution": "NodeNext",
      "lib": ["DOM", "DOM.Iterable", "ES2022"],
      "jsx": "react-jsx",
      "strict": true,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true,
      "baseUrl": "."
    },
    "include": ["src/**/*", "remotion.config.ts"]
  }
  ```

- [ ] **Step 4: Create `marketing/promo/.gitignore`**
  ```gitignore
  node_modules/
  out/
  *.mp4
  *.wav
  *.log
  .DS_Store
  ```

- [ ] **Step 5: Run pnpm install**
  Run: `pnpm install`
  Expected: Dependencies installed and package linked to workspace.

---

### Task 3: Shared Static Assets & Output Backup

**Files:**
- Create: `marketing/promo/public/avatars/*` (12 files)
- Create: `marketing/promo/public/audio/muse/*`
- Create: `marketing/promo/public/audio/gemini/*`
- Create: `marketing/promo/public/audio/grok/*`
- Create: `marketing/promo/scripts/*`
- Directory (local untracked): `marketing/promo/out/`

**Interfaces:**
- Consumes: Asset files from `.worktrees/feat-marketing-remotion-video-muse`, `marketing-remotion-video-gemini`, `marketing-remotion-video-grok`.
- Produces: De-duplicated static assets served via Remotion's `staticFile()` under `public/`, and local preservation of rendered videos.

- [ ] **Step 1: Copy character avatars into `marketing/promo/public/avatars/`**
  Copy the 12 verified avatars:
  `alex-tech-lead.jpg`, `barnaby-cat.jpg`, `dr-priya-stem.jpg`, `jules-cinephile.jpg`, `kenji-panel.jpg`, `marcus-stoic.jpg`, `meera-editor.jpg`, `nonna-maria.jpg`, `ren-philosopher.jpg`, `sofia-economist.jpg`, `valerian-polymath.jpg`, `viktor-drill-sergeant.jpg`.

- [ ] **Step 2: Copy audio stems into variant subdirectories**
  - `public/audio/muse/`: `drums.mp3`, `music.mp3`
  - `public/audio/gemini/`: `drums-soundtrack.mp3`, `soundtrack.mp3`
  - `public/audio/grok/`: `drums.mp3`

- [ ] **Step 3: Copy audio generator scripts into `marketing/promo/scripts/`**
  Copy `make-drums-synth.py`, `make-drums.sh`, `make-music.sh` (Muse) and `make-drums.py` (Grok).

- [ ] **Step 4: Move existing `.mp4` video files to local `marketing/promo/out/`**
  Copy `launch-muse.mp4`, `launch-muse-v2.mp4`, `launch-gemini-v1.mp4`, `launch-gemini-v2.mp4`, `launch-grok.mp4`, `launch-grok-v2.mp4` to `marketing/promo/out/`.
  Verify `git status` shows `out/` is completely ignored and untracked.

---

### Task 4: Shared Theme & Common Base Components

**Files:**
- Create: `marketing/promo/src/shared/theme.ts`
- Create: `marketing/promo/src/shared/components/AcidScribble.tsx`
- Create: `marketing/promo/src/shared/components/NoiseGrain.tsx`
- Create: `marketing/promo/src/shared/components/HardTicket.tsx`
- Create: `marketing/promo/src/shared/components/PlaybillPoster.tsx`

**Interfaces:**
- Consumes: `@remotion/google-fonts`, `remotion`.
- Produces: Reusable design tokens, font family declarations, character roster data, and common UI elements.

- [ ] **Step 1: Create `src/shared/theme.ts`**
  Port fonts (Fraunces, Bricolage Grotesque, IBM Plex Mono), colors (night, cream, terracotta, acid, codeWell, costumes), and 12-character roster with taglines and avatar paths (`avatars/<id>.jpg`).

- [ ] **Step 2: Port common visual components**
  Move `AcidScribble.tsx`, `NoiseGrain.tsx`, `HardTicket.tsx`, `PlaybillPoster.tsx` into `src/shared/components/`.

---

### Task 5: Muse Variant Integration

**Files:**
- Create: `marketing/promo/src/muse/LaunchMuse.tsx`
- Create: `marketing/promo/src/muse/LaunchMuseV2.tsx`
- Create: `marketing/promo/src/muse/components/*`
- Create: `marketing/promo/src/muse/scenes/*`
- Create: `marketing/promo/src/muse/v2/*`

**Interfaces:**
- Consumes: `src/shared/theme.ts`, `public/avatars/*`, `public/audio/muse/*`.
- Produces: `LaunchMuse` and `LaunchMuseV2` Remotion compositions.

- [ ] **Step 1: Copy Muse source directory into `marketing/promo/src/muse/`**
- [ ] **Step 2: Update audio asset paths**
  In `LaunchMuse.tsx`: `staticFile('audio/muse/music.mp3')`
  In `LaunchMuseV2.tsx`: `staticFile('audio/muse/drums.mp3')`
- [ ] **Step 3: Update relative imports**
  Ensure imports point to local `muse/components/`, `muse/scenes/`, `muse/v2/`, and `src/shared/`.

---

### Task 6: Gemini Variant Integration

**Files:**
- Create: `marketing/promo/src/gemini/MayaLaunch.tsx`
- Create: `marketing/promo/src/gemini/MayaLaunchV2.tsx`
- Create: `marketing/promo/src/gemini/components/*`
- Create: `marketing/promo/src/gemini/scenes/*`
- Create: `marketing/promo/src/gemini/scenes/v2/*`

**Interfaces:**
- Consumes: `src/shared/theme.ts`, `public/avatars/*`, `public/audio/gemini/*`.
- Produces: `MayaLaunch` and `MayaLaunchV2` Remotion compositions.

- [ ] **Step 1: Copy Gemini source directory into `marketing/promo/src/gemini/`**
- [ ] **Step 2: Update audio asset paths**
  In `MayaLaunch.tsx`: `staticFile('audio/gemini/soundtrack.mp3')`
  In `MayaLaunchV2.tsx`: `staticFile('audio/gemini/drums-soundtrack.mp3')`
- [ ] **Step 3: Update relative imports**
  Ensure scenes and components import cleanly within `gemini/`.

---

### Task 7: Grok Variant Integration

**Files:**
- Create: `marketing/promo/src/grok/LaunchGrok.tsx`
- Create: `marketing/promo/src/grok/Root.tsx`
- Create: `marketing/promo/src/grok/company.ts`, `copy.ts`, `fonts.ts`, `motion.ts`, `theme.ts`
- Create: `marketing/promo/src/grok/components/*`
- Create: `marketing/promo/src/grok/scenes/*`
- Create: `marketing/promo/src/grok/v2/*`

**Interfaces:**
- Consumes: `public/avatars/*`, `public/audio/grok/*`.
- Produces: `LaunchGrok` and `LaunchGrokV2` Remotion compositions.

- [ ] **Step 1: Copy Grok source directory into `marketing/promo/src/grok/`**
- [ ] **Step 2: Update audio asset paths**
  In `v2/LaunchGrokV2.tsx`: `staticFile('audio/grok/drums.mp3')`
- [ ] **Step 3: Update relative imports**
  Ensure Grok's custom components and v2 flow import cleanly.

---

### Task 8: Unified Remotion Studio Root & Entry Point

**Files:**
- Create: `marketing/promo/src/Root.tsx`
- Create: `marketing/promo/src/index.ts`

**Interfaces:**
- Consumes: Compositions from `src/muse/`, `src/gemini/`, `src/grok/`.
- Produces: Single studio registering all 6 video compositions.

- [ ] **Step 1: Create `src/Root.tsx`**
  ```tsx
  import React from 'react';
  import { Composition } from 'remotion';
  import { LaunchMuse } from './muse/LaunchMuse';
  import { LaunchMuseV2 } from './muse/LaunchMuseV2';
  import { MayaLaunch } from './gemini/MayaLaunch';
  import { MayaLaunchV2 } from './gemini/MayaLaunchV2';
  import { LaunchGrok } from './grok/LaunchGrok';
  import { LaunchGrokV2 } from './grok/v2/LaunchGrokV2';

  export const Root: React.FC = () => {
    return (
      <>
        {/* Muse Compositions (60s @ 30fps) */}
        <Composition
          id="LaunchMuse"
          component={LaunchMuse}
          durationInFrames={1800}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="LaunchMuseV2"
          component={LaunchMuseV2}
          durationInFrames={1800}
          fps={30}
          width={1920}
          height={1080}
        />

        {/* Gemini Compositions (45s @ 30fps) */}
        <Composition
          id="MayaLaunch"
          component={MayaLaunch}
          durationInFrames={1350}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="MayaLaunchV2"
          component={MayaLaunchV2}
          durationInFrames={1350}
          fps={30}
          width={1920}
          height={1080}
        />

        {/* Grok Compositions (60s @ 30fps) */}
        <Composition
          id="LaunchGrok"
          component={LaunchGrok}
          durationInFrames={1800}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="LaunchGrokV2"
          component={LaunchGrokV2}
          durationInFrames={1800}
          fps={30}
          width={1920}
          height={1080}
        />
      </>
    );
  };
  ```

- [ ] **Step 2: Create `src/index.ts`**
  ```ts
  import { registerRoot } from 'remotion';
  import { Root } from './Root';

  registerRoot(Root);
  ```

---

### Task 9: Verification & Output Cleanliness Check

- [ ] **Step 1: Typecheck package**
  Run: `pnpm --filter @maya/marketing-promo typecheck`
  Expected: Clean exit code 0.

- [ ] **Step 2: Typecheck root monorepo**
  Run: `pnpm typecheck`
  Expected: Clean exit code 0.

- [ ] **Step 3: Test still render**
  Run: `pnpm --filter @maya/marketing-promo still`
  Expected: `out/still.png` generated locally.

- [ ] **Step 4: Verify Git cleanliness**
  Run: `git status` and `git check-ignore marketing/promo/out/* marketing/promo/out/still.png`
  Expected: Zero `.mp4` or `out/` files tracked or staged.

---

### Task 10: Git Commit, Push, PR Creation & Worktree Cleanup

- [ ] **Step 1: Commit consolidated package**
  Run:
  ```bash
  git add pnpm-workspace.yaml .gitignore marketing/promo docs/
  git commit -m "feat(promo): consolidate marketing video suite into unified workspace package"
  ```

- [ ] **Step 2: Push branch**
  Run: `git push -u origin feat/marketing-video-suite`

- [ ] **Step 3: Create GitHub Pull Request**
  Run: `gh pr create --title "feat(promo): consolidate marketing Remotion promo suite" --body "Consolidates parallel worktree marketing video tasks (Muse, Gemini, Grok) into a single @maya/marketing-promo workspace package with shared avatar assets, unified Remotion Studio, and git output hygiene."`

- [ ] **Step 4: Close PR #28**
  Run: `gh pr close 28 --comment "Superseded by consolidated marketing video suite in PR #<new-pr-number>"`

- [ ] **Step 5: Clean up temporary worktrees**
  Run:
  ```bash
  git worktree remove .worktrees/feat-marketing-remotion-video-muse
  git worktree remove .worktrees/marketing-remotion-video-gemini
  git worktree remove .worktrees/marketing-remotion-video-grok
  git worktree remove .worktrees/remotion-promo
  ```
