import {interpolate, spring} from 'remotion';

export function clampInterp(
  frame: number,
  input: readonly number[],
  output: readonly number[],
): number {
  return interpolate(frame, [...input], [...output], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

export function fadeInOut(
  frame: number,
  duration: number,
  fadeIn = 12,
  fadeOut = 14,
): number {
  return clampInterp(frame, [0, fadeIn, duration - fadeOut, duration], [0, 1, 1, 0]);
}

export function typeText(text: string, frame: number, start: number, charsPerFrame = 0.85): string {
  const count = Math.floor(Math.max(0, frame - start) * charsPerFrame);
  return text.slice(0, Math.min(text.length, count));
}

export function stickSpring(frame: number, fps: number, delay = 0): number {
  return spring({
    fps,
    frame: frame - delay,
    config: {damping: 16, mass: 0.7, stiffness: 140},
  });
}

export function paperSlap(frame: number, fps: number, delay = 0): number {
  return spring({
    fps,
    frame: frame - delay,
    config: {damping: 13, mass: 0.55, stiffness: 160},
  });
}
