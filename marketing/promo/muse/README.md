# LaunchMuse — Maya Chat 60s launch video (Remotion)

General Maya Chat launch promo. 1920×1080 @ 30fps, 1800 frames (60s),
H.264 + AAC. Night-wall house style (`docs/DESIGN.md`): Fraunces italic
display, Bricolage Grotesque body, Plex Mono machine, costume floods,
hard offsets, 7% grain.

## Beats

1. **Hook** (0–6s) — "Give your AI a personality." with acid scribble.
2. **Same question. Different night.** (6–16s) — gray Assistant hedge
   (struck) vs Marcus + Nonna Maria washes.
3. **Start with a voice.** (16–32s) — 8 playbills, staggered tilts,
   FREE / PLUS stickers, highlight sweep.
4. **Write the personality.** (32–40s) — Studio character sheet ticket.
5. **House window** (40–52s) — rail + Marcus typewriter reply + composer.
6. **The house is open.** (52–60s) — Free/Plus/Pro tickets + stub footer.

## Commands (run in this dir, standalone npm — not pnpm)

```bash
npm install
npm run typecheck            # tsc --noEmit
npx remotion still src/index.ts LaunchMuse out/still.png --frame=700
npm run render               # -> ../grok/launch-muse.mp4
bash scripts/make-music.sh   # regenerate public/music.mp3
```

## Assets

- `public/avatars/*.jpg` — copied from `apps/web/public/avatars/` (8 live agents).
- `public/music.mp3` — self-synthesized ambient pad (A2+E3+A3+C#4,
  tremolo, lowpass, fades). No license, no download. Recipe in
  `scripts/make-music.sh`.
- Fonts load at render via `@remotion/google-fonts`
  (Fraunces italic, Bricolage Grotesque, IBM Plex Mono). Fallback stacks
  in `src/constants/theme.ts` keep frames readable offline.

## Outputs

- `../grok/launch-muse.mp4` — committed deliverable (repo convention).
- `out/launch-muse.mp4` — local copy (gitignored).
- `/Users/kamalbisht/Documents/maya-chat-promo/launch-muse.mp4` —
  external copy outside the repo.
