import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../../theme';

export const AcidWipe: React.FC<{durationInFrames: number}> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const w = 1920;
  const h = 1080;
  const nightX = (progress * 1.28 - 0.04) * w;
  const edgeX = (progress * 1.28 - 0.18) * w;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <polygon
          points={`0,0 ${nightX + 80},0 ${nightX - 240},${h} 0,${h}`}
          fill={colors.night}
        />
        <polygon
          points={`${edgeX},0 ${edgeX + 130},0 ${edgeX - 110},${h} ${edgeX - 240},${h}`}
          fill={colors.acid}
        />
        <polygon
          points={`${edgeX + 130},0 ${edgeX + 172},0 ${edgeX - 68},${h} ${edgeX - 110},${h}`}
          fill={colors.cream}
        />
      </svg>
    </AbsoluteFill>
  );
};
