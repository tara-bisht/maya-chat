export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const BPM = 120;
export const BEAT = 15;
export const BAR = 60;
export const DURATION = 1200;

export const ACTS = {
  sterile: {from: 0, duration: 180},
  smash: {from: 165, duration: 30},
  personality: {from: 180, duration: 420},
  explore: {from: 600, duration: 240},
  studio: {from: 840, duration: 180},
  finale: {from: 1020, duration: 180},
} as const;

export const NIGHT_SLOTS = [
  {id: 'marcus' as const, from: 0, duration: 140},
  {id: 'nonna' as const, from: 140, duration: 140},
  {id: 'barnaby' as const, from: 280, duration: 140},
];
