import React from 'react';
import {colors, radii} from '../../theme';
import {fontDisplay, fontSans} from '../../fonts';
import {BrowserChrome} from './BrowserChrome';

const NAV = [
  {id: 'home', label: 'Home'},
  {id: 'explore', label: 'Explore'},
  {id: 'create', label: 'Create agent'},
  {id: 'profile', label: 'Profile'},
] as const;

export const LobbyShell: React.FC<{
  url: string;
  active: 'home' | 'explore' | 'create' | 'profile';
  children: React.ReactNode;
}> = ({url, active, children}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: colors.night,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <BrowserChrome url={url} />
      <div style={{flex: 1, display: 'flex', minHeight: 0}}>
        <aside
          style={{
            width: 248,
            borderRight: `1px solid ${colors.rule}`,
            padding: '22px 12px',
            flexShrink: 0,
          }}
        >
          <p
            style={{
              margin: '0 8px 20px',
              fontFamily: fontDisplay,
              fontStyle: 'italic',
              fontSize: 36,
              color: colors.cream,
              letterSpacing: '-0.03em',
            }}
          >
            Maya
          </p>
          <nav style={{display: 'flex', flexDirection: 'column', gap: 4}}>
            {NAV.map((item) => {
              const on = item.id === active;
              return (
                <div
                  key={item.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: radii.md,
                    backgroundColor: on ? 'rgba(58,52,46,0.6)' : 'transparent',
                    color: on ? colors.cream : colors.creamDim,
                    fontFamily: fontSans,
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                </div>
              );
            })}
          </nav>
        </aside>
        <main style={{flex: 1, position: 'relative', overflow: 'hidden'}}>{children}</main>
      </div>
    </div>
  );
};
