# @maya/marketing-promo

Marketing and launch promo video generation suite built with [Remotion](https://www.remotion.dev/) and React 19.

This package houses the programmatic video compositions for Maya Chat product launches across Muse, Gemini, and Grok variants.

## Getting Started

### Prerequisites
From the monorepo root:
```bash
pnpm install
```

### Remotion Studio (Preview & Development)
Launch the interactive visual preview editor:
```bash
# From workspace root
pnpm --filter @maya/marketing-promo dev

# Or inside marketing/promo
pnpm dev
```
Studio opens on `http://localhost:3000` (or the configured Remotion port) allowing frame-by-frame inspection, timing adjustments, and live component reloading.

### Typecheck
```bash
pnpm --filter @maya/marketing-promo typecheck
```

## Rendering Videos

Rendered MP4 artifacts are saved locally to `marketing/promo/out/`. Rendered video and audio files are ignored by git.

### Muse Variants
- **v1**: `pnpm --filter @maya/marketing-promo render:muse:v1` -> `out/launch-muse-v1.mp4`
- **v2**: `pnpm --filter @maya/marketing-promo render:muse:v2` -> `out/launch-muse-v2.mp4`
- **Both**: `pnpm --filter @maya/marketing-promo render:muse`

### Gemini Variants
- **v1**: `pnpm --filter @maya/marketing-promo render:gemini:v1` -> `out/launch-gemini-v1.mp4`
- **v2**: `pnpm --filter @maya/marketing-promo render:gemini:v2` -> `out/launch-gemini-v2.mp4`
- **Both**: `pnpm --filter @maya/marketing-promo render:gemini`

### Grok Variants
- **v1**: `pnpm --filter @maya/marketing-promo render:grok:v1` -> `out/launch-grok-v1.mp4`
- **v2**: `pnpm --filter @maya/marketing-promo render:grok:v2` -> `out/launch-grok-v2.mp4`
- **Both**: `pnpm --filter @maya/marketing-promo render:grok`

### Render All Videos
```bash
pnpm --filter @maya/marketing-promo render:all
```

### Still Poster Frame
```bash
pnpm --filter @maya/marketing-promo still
```

## Global Constraints
- Rendered assets (`.mp4`, `.wav`) must never be committed to git.
- Adhere to monorepo Conventional Commits and code style.
