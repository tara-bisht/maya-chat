# LaunchMuse — Maya Chat 60s launch videos (Remotion)

Two compositions, one package. 1920×1080 @ 30fps, 1800 frames (60s),
H.264 + AAC. Night-wall house style (`docs/DESIGN.md`): Fraunces italic
display, Bricolage Grotesque body, Plex Mono machine, costume floods,
hard offsets, 7% grain.

## V1 — LaunchMuse (ambient)

General Maya Chat launch promo over a soft ambient pad.

1. **Hook** (0–6s) — "Give your AI a personality." with acid scribble.
2. **Same question. Different night.** (6–16s) — gray Assistant hedge
   (struck) vs Marcus + Nonna Maria washes.
3. **Start with a voice.** (16–32s) — 8 playbills, staggered tilts,
   FREE / PLUS stickers, highlight sweep.
4. **Write the personality.** (32–40s) — Studio character sheet ticket.
5. **House window** (40–52s) — rail + Marcus typewriter reply + composer.
6. **The house is open.** (52–60s) — Free/Plus/Pro tickets + stub footer.

## V2 — LaunchMuseV2 (drums, fast-paced)

"Same question. Different personality." Every scene except the end
card lives inside one persistent chat-app window (`src/v2/ChatShell`);
cuts land with the 132 BPM drum track (groove drops f150, dropout
slams into Studio f990 and the end card f1500, boom pulses the URL
f1759).

1. **Sterile** (0–5s) — flat gray "Generic AI" chat, bland numbered-tips
   reply, BLAND. stamp.
2. **Switch** (5–9s) — personality rail docks, cursor taps Marcus, wash
   floods stoic green, roast reply types out.
3. **Montage** (9–21s) — same thesis question through Nonna, Viktor,
   Dr. Priya, Barnaby. 90-frame slots, cut flashes, progress pips.
4. **Explore** (21–33s) — marketplace bill in-window: 5 real category
   rows, 12 voices (4 SOON), "100s OF IN-BUILT AGENTS" stamp.
5. **Studio** (33–41s) — "Midnight Mentor" built live: name types,
   trait chips pop, swatch picks, custom playbill docks.
6. **Free** (41–50s) — living Marcus chat behind a TRY IT FREE ticket.
   No card, Marcus & Dr. Priya on the house.
7. **End card** (50–60s) — getmaya.chat slam, avatar marquee, stub
   footer. Final drum boom + stop.

## Commands (run in this dir, standalone npm — not pnpm)

```bash
npm install
npm run typecheck            # tsc --noEmit
npx remotion still src/index.ts LaunchMuse out/still.png --frame=700
npm run render               # -> ../grok/launch-muse.mp4
npm run render:v2            # -> ../grok/launch-muse-v2.mp4
bash scripts/make-music.sh   # regenerate public/music.mp3
bash scripts/make-drums.sh   # regenerate public/drums.mp3
```

## Assets

- `public/avatars/*.jpg` — copied from `apps/web/public/avatars/`
  (12 voices: 8 live + 4 coming-soon).
- `public/music.mp3` — self-synthesized ambient pad (A2+E3+A3+C#4,
  tremolo, lowpass, fades). No license, no download. Recipe in
  `scripts/make-music.sh`.
- `public/drums.mp3` — self-synthesized 132 BPM drum kit (kick/snare/
  hats/risers/dropouts/boom, 60.0s). Recipe in `scripts/make-drums.sh`
  + `scripts/make-drums-synth.py` (stdlib only).
- Fonts load at render via `@remotion/google-fonts`
  (Fraunces italic, Bricolage Grotesque, IBM Plex Mono). Fallback stacks
  in `src/constants/theme.ts` keep frames readable offline.

## Outputs

- `../grok/launch-muse.mp4` — v1 committed deliverable (repo convention).
- `../grok/launch-muse-v2.mp4` — v2 committed deliverable.
- `out/` — local copies (gitignored).
- `/Users/kamalbisht/Documents/maya-chat-promo/` —
  external copies outside the repo.
