# Marketing Worktree Consolidation Design Spec

## Overview
Three parallel worktrees and feature branches were developed to produce launch videos for Maya Chat using Remotion:
1. `feat/marketing-remotion-video-muse` (Worktree `.worktrees/feat-marketing-remotion-video-muse`, PR #28)
2. `feat/marketing-remotion-video-gemini` (Worktree `.worktrees/marketing-remotion-video-gemini`)
3. `feat/marketing-remotion-video-grok` (Worktree `.worktrees/marketing-remotion-video-grok`)

This design unifies all three efforts into a single, cohesive marketing package (`marketing/promo`), preserving each task's custom narrative, components, and scene structure, while deduplicating assets, unifying Remotion Studio, ensuring git output hygiene, and streamlining the PR lifecycle.

## Goals & Non-Goals

### Goals
- **Single Monorepo Package**: Maintain one `@maya/marketing-promo` package inside `marketing/promo/` integrated into `pnpm-workspace.yaml`.
- **Preserve Individual Work**: Preserve the distinct creative tasks in isolated subfolders (`src/muse/`, `src/gemini/`, `src/grok/`).
- **Share Everything Feasible**:
  - Deduplicate all 12 character avatars (`alex`, `barnaby`, `dr-priya`, `jules`, `kenji`, `marcus`, `meera`, `nonna`, `ren`, `sofia`, `valerian`, `viktor`) into a single `public/avatars/` directory.
  - Consolidate Google Fonts, base night-wall tokens, and common components (`NoiseGrain`, `AcidScribble`, `PlaybillPoster`, `HardTicket`) in `src/shared/`.
- **Unified Remotion Studio**: A single `src/Root.tsx` registering all 6 compositions across all three variants for instant side-by-side preview and scrubbing in one Studio session.
- **Git Output Hygiene**:
  - Untrack any committed `.mp4` video files.
  - Ignore `out/`, `*.mp4`, `*.wav`, and render logs in `.gitignore`.
  - Preserve locally rendered `.mp4` files inside an untracked `marketing/promo/out/` directory.
- **PR Transition**: Open a fresh PR against `main` for the consolidated suite, close PR #28 with an explanatory link, and clean up the worktrees.

### Non-Goals
- Changing the narrative, animations, or timing of any individual variant.
- Rewriting Git history on main.

## Architecture & Directory Layout

```text
marketing/promo/
├── package.json              # @maya/marketing-promo
├── remotion.config.ts        # Unified Remotion config (Chromium flags, concurrency)
├── tsconfig.json             # Root TypeScript config for promo
├── .gitignore                # Ignores out/, *.mp4, *.wav, *.log
├── README.md                 # Documentation on viewing and rendering promo cuts
├── public/
│   ├── avatars/              # 12 de-duplicated character avatar portraits
│   └── audio/                # Audio stems grouped by variant:
│       ├── muse/             # drums.mp3, music.mp3
│       ├── gemini/           # drums-soundtrack.mp3, soundtrack.mp3
│       └── grok/             # drums.mp3
├── scripts/                  # Synthesis scripts (make-drums.py, make-music.sh, etc.)
├── src/
│   ├── index.ts              # Remotion registration entry
│   ├── Root.tsx              # Root component registering all 6 compositions
│   ├── shared/               # Shared theme, fonts, roster, common base UI
│   ├── muse/                 # Muse cuts (v1 scenes, v2 scenes, components)
│   ├── gemini/               # Gemini cuts (v1 scenes, v2 scenes, components)
│   └── grok/                 # Grok cuts (v1 scenes, v2 scenes, components)
└── out/                      # (Untracked) Local destination for rendered mp4s & stills
```

## Asset Sharing Details

1. **Avatars**:
   - `public/avatars/*.jpg` (12 images) are bit-for-bit identical across all branches.
   - Referenced in Remotion using `staticFile('avatars/<filename>.jpg')`.
2. **Audio Stems**:
   - Grouped under `public/audio/<variant>/` so variant compositions can cleanly reference their respective music tracks via `staticFile('audio/<variant>/<file>')`.
3. **Synthesis Scripts**:
   - Consolidated under `marketing/promo/scripts/`.

## Compositions in Remotion Studio

The unified `marketing/promo/src/Root.tsx` registers:
- `LaunchMuse`: 60s (1800 frames @ 30fps, 1920×1080)
- `LaunchMuseV2`: 60s (1800 frames @ 30fps, 1920×1080)
- `MayaLaunch`: 45s (1350 frames @ 30fps, 1920×1080)
- `MayaLaunchV2`: 45s (1350 frames @ 30fps, 1920×1080)
- `LaunchGrok`: 60s (1800 frames @ 30fps, 1920×1080)
- `LaunchGrokV2`: 60s (1800 frames @ 30fps, 1920×1080)

## Rendering Scripts in `package.json`

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
  }
}
```

## Git Hygiene & Output Policy
- Root `.gitignore` and `marketing/promo/.gitignore` both ignore:
  ```gitignore
  out/
  *.mp4
  *.wav
  *.log
  ```
- Any committed `.mp4` files from the feature branches are deleted from tracking.
- Existing rendered `.mp4` files on disk are backed up into `marketing/promo/out/` locally so no media is lost.

## Execution & PR Plan
1. Create new branch `feat/marketing-video-suite` from `main`.
2. Update `pnpm-workspace.yaml`.
3. Copy and organize assets, scripts, shared utilities, and variant sources into `marketing/promo/`.
4. Install dependencies and run `pnpm --filter @maya/marketing-promo typecheck` and root `pnpm typecheck`.
5. Verify `git status` shows only source code (no `.mp4` or binaries).
6. Commit and push `feat/marketing-video-suite`.
7. Create PR via `gh pr create`.
8. Close PR #28 with reference to the new PR.
9. Remove temporary worktrees.
