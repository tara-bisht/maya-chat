import React from 'react';
import {colors} from '../../theme';

export const Pointer: React.FC<{
  x: number;
  y: number;
  pressed?: number;
  opacity?: number;
}> = ({x, y, pressed = 0, opacity = 1}) => {
  const scale = 1 - pressed * 0.18;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: '2px 2px',
        zIndex: 20,
        pointerEvents: 'none',
        filter: `drop-shadow(3px 3px 0 ${colors.night})`,
      }}
    >
      <svg width="34" height="40" viewBox="0 0 34 40" fill="none">
        <path
          d="M3 2 L3 32 L12 24 L18 36 L24 33 L18 21 L30 21 Z"
          fill={colors.cream}
          stroke={colors.night}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};
