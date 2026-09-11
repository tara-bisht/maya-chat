import { interpolate, spring, useVideoConfig } from 'remotion';

// Characters of `text` revealed by `frame` at `cps` chars/sec from `start`.
export function typeChars(
  frame: number,
  start: number,
  text: string,
  cps = 30,
): string {
  const n = Math.floor(((frame - start) * cps) / 30);
  if (n <= 0) return '';
  return text.slice(0, Math.min(text.length, n));
}

// 0->1 pop for stamps, chips, tickets.
export function usePop(frame: number, start: number): number {
  const { fps } = useVideoConfig();
  return spring({
    frame: Math.max(0, frame - start),
    fps,
    config: { damping: 11, stiffness: 260, mass: 0.9 },
  });
}

// Rise-and-settle for rows, bubbles, panels. Returns px offset (dist -> 0).
export function useRise(frame: number, start: number, dist = 46): number {
  const { fps } = useVideoConfig();
  const p = spring({
    frame: Math.max(0, frame - start),
    fps,
    config: { damping: 16, stiffness: 170 },
  });
  return (1 - p) * dist;
}

// Opacity 0->1 over `dur` frames from `start`.
export function fadeIn(frame: number, start: number, dur = 14): number {
  return interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

// Hard flash envelope: 1 at `at`, 0 by `at + dur`.
export function flashAt(frame: number, at: number, dur = 4): number {
  return interpolate(frame, [at, at + dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}
