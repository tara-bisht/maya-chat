import React from 'react';
import { AbsoluteFill } from 'remotion';

// 7% film-grain overlay (docs/DESIGN.md). pointer-events none, above content.
export const NoiseGrain: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        opacity: 0.07,
        zIndex: 999,
        mixBlendMode: 'overlay',
      }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id="mayaNoise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#mayaNoise)" />
      </svg>
    </AbsoluteFill>
  );
};
