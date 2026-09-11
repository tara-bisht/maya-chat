import React from 'react';
import {colors} from '../theme';
import {fontDisplay, fontSans} from '../fonts';

export const Kicker: React.FC<{
  kicker: string;
  title: string;
  body?: string;
  align?: 'left' | 'center';
}> = ({kicker, title, body, align = 'left'}) => {
  return (
    <div style={{textAlign: align, maxWidth: align === 'center' ? 980 : 920}}>
      <p
        style={{
          margin: 0,
          fontFamily: fontSans,
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: colors.stub,
        }}
      >
        {kicker}
      </p>
      <h2
        style={{
          margin: '10px 0 0',
          fontFamily: fontDisplay,
          fontStyle: 'italic',
          fontWeight: 600,
          fontSize: 56,
          lineHeight: 1.02,
          letterSpacing: '-0.03em',
          color: colors.cream,
        }}
      >
        {title}
      </h2>
      {body ? (
        <p
          style={{
            margin: '14px 0 0',
            fontFamily: fontSans,
            fontSize: 22,
            fontWeight: 400,
            lineHeight: 1.35,
            color: colors.creamDim,
            maxWidth: 720,
            marginLeft: align === 'center' ? 'auto' : 0,
            marginRight: align === 'center' ? 'auto' : 0,
          }}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
};
