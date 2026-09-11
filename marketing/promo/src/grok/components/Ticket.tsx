import React from 'react';
import {colors, radii} from '../theme';
import {fontSans} from '../fonts';

export const Ticket: React.FC<{
  kicker?: string;
  children: React.ReactNode;
  width?: number | string;
  stamp?: string;
  shadow?: string;
  background?: string;
  color?: string;
  padding?: number;
}> = ({
  kicker,
  children,
  width = '100%',
  stamp,
  shadow = `8px 8px 0 ${colors.acid}`,
  background = colors.cream,
  color = colors.night,
  padding = 28,
}) => {
  return (
    <article
      style={{
        position: 'relative',
        width,
        backgroundColor: background,
        color,
        borderRadius: radii.md,
        padding,
        boxShadow: shadow,
      }}
    >
      {stamp ? (
        <span
          style={{
            position: 'absolute',
            top: -10,
            right: -8,
            padding: '6px 10px',
            fontFamily: fontSans,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            backgroundColor: colors.cream,
            color: colors.night,
            boxShadow: `3px 3px 0 ${colors.acid}`,
            transform: 'rotate(-6deg)',
          }}
        >
          {stamp}
        </span>
      ) : null}
      {kicker ? (
        <p
          style={{
            margin: 0,
            fontFamily: fontSans,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            opacity: 0.6,
          }}
        >
          {kicker}
        </p>
      ) : null}
      <div style={{marginTop: kicker ? 12 : 0}}>{children}</div>
    </article>
  );
};
