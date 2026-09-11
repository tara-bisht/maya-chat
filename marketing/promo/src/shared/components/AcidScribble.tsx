import React from 'react';
import { interpolate, useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { COLORS } from '../theme';

export interface AcidScribbleProps {
  delay?: number;
  width?: number | string;
  height?: number | string;
  color?: string;
  strokeWidth?: number;
}

// Hand-drawn acid underline that draws itself on (~0.7s per DESIGN.md).
export const AcidScribble: React.FC<AcidScribbleProps> = ({
  delay = 0,
  width = '100%',
  height = 20,
  color = COLORS.acid,
  strokeWidth = 6,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 130 },
  });

  const dashOffset = interpolate(spr, [0, 1], [260, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ width, height, position: 'relative', display: 'inline-block' }}>
      <svg
        viewBox="0 0 220 14"
        fill="none"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <path
          d="M3 10.5 C 40 3.5, 75 11, 110 7.5 S 180 4, 217 8"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={260}
          strokeDashoffset={dashOffset}
        />
      </svg>
    </div>
  );
};
