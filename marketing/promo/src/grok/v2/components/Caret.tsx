import React from 'react';
import {useCurrentFrame} from 'remotion';

export const Caret: React.FC<{color: string; height?: number}> = ({
  color,
  height = 22,
}) => {
  const frame = useCurrentFrame();
  const on = frame % 14 < 8;
  return (
    <span
      style={{
        display: 'inline-block',
        width: 2,
        height,
        marginLeft: 3,
        backgroundColor: color,
        opacity: on ? 1 : 0,
        verticalAlign: 'text-bottom',
      }}
    />
  );
};
