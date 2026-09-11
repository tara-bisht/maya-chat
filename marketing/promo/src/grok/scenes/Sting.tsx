import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Wordmark} from '../components/Wordmark';
import {Stamp} from '../components/Stamp';
import {colors} from '../theme';
import {fontSans} from '../fonts';
import {fadeInOut, stickSpring} from '../motion';

export const Sting: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = fadeInOut(frame, durationInFrames, 8, 16);
  const scale = stickSpring(frame, fps, 4);
  const stampIn = stickSpring(frame, fps, 14);
  const tag = interpolate(frame, [22, 44], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          opacity: stampIn,
          transform: `translateY(${(1 - stampIn) * 18}px) scale(${0.86 + stampIn * 0.14})`,
          marginBottom: 28,
        }}
      >
        <Stamp label="Tonight" tone="stub" rotate={-8} />
      </div>
      <div style={{transform: `scale(${0.72 + scale * 0.28})`, opacity: Math.min(1, scale)}}>
        <Wordmark size={168} />
      </div>
      <p
        style={{
          marginTop: 28,
          fontFamily: fontSans,
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: colors.inkSoft,
          opacity: tag,
        }}
      >
        Opinionated AI · not a helpdesk
      </p>
    </AbsoluteFill>
  );
};
