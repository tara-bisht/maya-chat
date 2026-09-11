import React from 'react';
import {colors, radii} from '../../theme';
import {fontMono, fontSans} from '../../fonts';

export const BrowserChrome: React.FC<{
  url: string;
  night?: boolean;
}> = ({url, night = true}) => {
  const ink = night ? colors.cream : '#3F3F46';
  const bar = night ? '#1C1916' : '#FFFFFF';
  const field = night ? colors.night : '#F4F4F5';
  return (
    <div
      style={{
        height: 44,
        backgroundColor: bar,
        borderBottom: `1px solid ${night ? colors.rule : '#E4E4E7'}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 12,
        flexShrink: 0,
      }}
    >
      <div style={{display: 'flex', gap: 6}}>
        <span style={{width: 10, height: 10, borderRadius: 99, background: '#FF5F57'}} />
        <span style={{width: 10, height: 10, borderRadius: 99, background: '#FEBC2E'}} />
        <span style={{width: 10, height: 10, borderRadius: 99, background: '#28C840'}} />
      </div>
      <div
        style={{
          flex: 1,
          height: 26,
          borderRadius: radii.sm,
          backgroundColor: field,
          color: ink,
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          fontFamily: fontMono,
          fontSize: 13,
          letterSpacing: '-0.01em',
        }}
      >
        {url}
      </div>
      <span
        style={{
          fontFamily: fontSans,
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: night ? colors.inkSoft : '#71717A',
        }}
      >
        Desktop
      </span>
    </div>
  );
};
