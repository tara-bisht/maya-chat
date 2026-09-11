import React from 'react';
import {colors} from '../theme';
import {fontDisplay} from '../fonts';

export const Wordmark: React.FC<{
  size?: number;
  color?: string;
}> = ({size = 56, color = colors.cream}) => {
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
      <span
        style={{
          fontFamily: fontDisplay,
          fontStyle: 'italic',
          fontWeight: 500,
          fontSize: size,
          lineHeight: 0.9,
          letterSpacing: '-0.04em',
          color,
        }}
      >
        Maya
      </span>
      <span
        style={{
          width: Math.max(10, size * 0.18),
          height: Math.max(10, size * 0.18),
          backgroundColor: colors.acid,
        }}
      />
    </div>
  );
};
