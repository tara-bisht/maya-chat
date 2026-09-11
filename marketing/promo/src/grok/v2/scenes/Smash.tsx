import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../../theme';
import {fontDisplay, fontSans} from '../../fonts';
import {paperSlap} from '../../motion';
import {SMASH_LINE} from '../copy';
import {Wordmark} from '../../components/Wordmark';

export const Smash: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const pop = paperSlap(frame, 30, 4);
  const out = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
        opacity: out,
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: fontSans,
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: colors.stub,
          transform: `translateY(${interpolate(pop, [0, 1], [12, 0])}px)`,
        }}
      >
        {SMASH_LINE}
      </p>
      <div style={{marginTop: 10, transform: `scale(${0.7 + pop * 0.3})`}}>
        <Wordmark size={96} />
      </div>
      <p
        style={{
          margin: '16px 0 0',
          fontFamily: fontDisplay,
          fontStyle: 'italic',
          fontSize: 36,
          color: colors.cream,
          letterSpacing: '-0.03em',
        }}
      >
        AI with a personality.
      </p>
    </AbsoluteFill>
  );
};
