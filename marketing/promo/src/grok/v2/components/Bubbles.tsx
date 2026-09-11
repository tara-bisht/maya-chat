import React from 'react';
import {colors, radii} from '../../theme';
import {fontSans} from '../../fonts';
import {Caret} from './Caret';

export const UserTicket: React.FC<{
  text: string;
  opacity?: number;
  y?: number;
}> = ({text, opacity = 1, y = 0}) => {
  return (
    <article
      style={{
        alignSelf: 'flex-end',
        width: '86%',
        backgroundColor: colors.cream,
        color: colors.night,
        borderRadius: radii.md,
        padding: '16px 18px',
        boxShadow: `4px 4px 0 ${colors.acid}`,
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: fontSans,
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        You
      </p>
      <p
        style={{
          margin: '8px 0 0',
          fontFamily: fontSans,
          fontSize: 22,
          fontWeight: 400,
          lineHeight: 1.4,
        }}
      >
        {text}
      </p>
    </article>
  );
};

export const AgentWash: React.FC<{
  name: string;
  text: string;
  color: string;
  streaming?: boolean;
  opacity?: number;
  y?: number;
}> = ({name, text, color, streaming = false, opacity = 1, y = 0}) => {
  return (
    <article
      style={{
        width: '78%',
        maxWidth: 780,
        backgroundColor: color,
        color: colors.cream,
        borderRadius: radii.md,
        padding: '16px 18px',
        opacity,
        transform: `translateY(${y}px)`,
        boxShadow: `4px 4px 0 ${colors.cream}`,
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: fontSans,
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          opacity: 0.82,
        }}
      >
        {name}
      </p>
      <p
        style={{
          margin: '8px 0 0',
          fontFamily: fontSans,
          fontSize: 22,
          fontWeight: 400,
          lineHeight: 1.4,
          whiteSpace: 'pre-wrap',
        }}
      >
        {text}
        {streaming ? <Caret color={colors.cream} /> : null}
      </p>
    </article>
  );
};
