import React from 'react';
import {colors, radii} from '../theme';
import {fontSans} from '../fonts';

export const Stamp: React.FC<{
  label: string;
  tone?: 'free' | 'plus' | 'stub' | 'cream';
  rotate?: number;
}> = ({label, tone = 'free', rotate = -6}) => {
  const free = tone === 'free' || tone === 'cream';
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '6px 10px',
        fontFamily: fontSans,
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        backgroundColor: free ? colors.cream : colors.stub,
        color: colors.night,
        boxShadow: free ? `3px 3px 0 ${colors.acid}` : `3px 3px 0 ${colors.cream}`,
        transform: `rotate(${rotate}deg)`,
        borderRadius: radii.sm,
        lineHeight: 1.2,
      }}
    >
      {label}
    </span>
  );
};
