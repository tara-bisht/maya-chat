import React from 'react';
import {colors} from '../theme';
import {clampInterp} from '../motion';

export const Scribble: React.FC<{
  frame: number;
  start?: number;
  duration?: number;
}> = ({frame, start = 18, duration = 28}) => {
  const progress = clampInterp(frame, [start, start + duration], [0, 1]);

  return (
    <svg
      viewBox="0 0 220 14"
      fill="none"
      preserveAspectRatio="none"
      style={{width: '100%', height: '100%', overflow: 'visible'}}
    >
      <path
        d="M3 10.5 C 40 3.5, 75 11, 110 7.5 S 180 4, 217 8"
        pathLength={1}
        stroke={colors.acid}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={1}
        strokeDashoffset={1 - progress}
      />
    </svg>
  );
};
