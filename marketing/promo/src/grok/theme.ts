export const colors = {
  night: '#14110F',
  cream: '#F6EFE4',
  creamDim: '#E4D8C8',
  acid: '#FF4D2E',
  acidHover: '#E03A1C',
  onAcid: '#14110F',
  stub: '#D6F25C',
  onStub: '#14110F',
  rule: '#3A342E',
  inkSoft: '#B7A99A',
  overlay: 'rgba(20, 17, 15, 0.6)',
  costume: {
    marcus: '#1F5A3C',
    priya: '#9B1B4E',
    alex: '#3A2418',
    nonna: '#B33A1C',
    viktor: '#4A6324',
    valerian: '#24306E',
    barnaby: '#8A3F16',
    ren: '#3A4A58',
    custom: '#5C4636',
    jules: '#4A1638',
    meera: '#1A3F3A',
    kenji: '#2E2450',
    sofia: '#7A4A12',
  },
} as const;

export const radii = {
  sm: 4,
  md: 10,
  lg: 14,
} as const;

export const WIDTH = 1920;
export const HEIGHT = 1080;
export const FPS = 30;
export const DURATION = 1350;

export const ACTS = {
  sting: {from: 0, duration: 105},
  hook: {from: 105, duration: 165},
  hero: {from: 270, duration: 180},
  wall: {from: 450, duration: 240},
  contrast: {from: 690, duration: 360},
  finale: {from: 1050, duration: 300},
} as const;
