import React from 'react';
import {Img, staticFile} from 'remotion';
import {colors, radii} from '../../theme';
import {fontDisplay, fontMono, fontSans} from '../../fonts';
import type {Player} from '../../company';
import {COMPANY} from '../../company';
import {BrowserChrome} from './BrowserChrome';
import {RHEA} from '../roster';

const RAIL: Array<{id: string; shortName: string; color: string; avatar?: string}> = [
  ...COMPANY.map((player) => ({
    id: player.id,
    shortName: player.shortName,
    color: player.color,
    avatar: player.avatar,
  })),
  {id: RHEA.id, shortName: RHEA.shortName, color: RHEA.color},
];

export const ChatShell: React.FC<{
  player: Player | {id: string; shortName: string; color: string; avatar?: string; tagline?: string};
  url: string;
  composer: string;
  placeholder: string;
  children: React.ReactNode;
  extraRail?: boolean;
}> = ({player, url, composer, placeholder, children, extraRail = false}) => {
  const members = extraRail ? RAIL : RAIL.slice(0, 8);

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
            width: 268,
            borderRight: `1px solid ${colors.rule}`,
            display: 'flex',
            flexDirection: 'column',
            padding: '18px 10px 16px',
            flexShrink: 0,
          }}
        >
          <p
            style={{
              margin: '0 8px 4px',
              fontFamily: fontDisplay,
              fontStyle: 'italic',
              fontSize: 32,
              color: colors.cream,
              letterSpacing: '-0.03em',
            }}
          >
            Maya
          </p>
          <p
            style={{
              margin: '0 8px 16px',
              fontFamily: fontSans,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: colors.inkSoft,
            }}
          >
            Home
          </p>
          <nav style={{display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden'}}>
            {members.map((member) => {
              const active = member.id === player.id;
              return (
                <div
                  key={member.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 8px',
                    borderRadius: radii.md,
                    backgroundColor: active ? 'rgba(58,52,46,0.6)' : 'transparent',
                    boxShadow: active ? `inset 3px 0 0 ${member.color}` : undefined,
                  }}
                >
                  <Portrait name={member.shortName} color={member.color} avatar={member.avatar} />
                  <span
                    style={{
                      fontFamily: fontSans,
                      fontSize: 14,
                      fontWeight: 600,
                      color: colors.cream,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {member.shortName}
                  </span>
                </div>
              );
            })}
          </nav>
        </aside>
        <section style={{flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0}}>
          <header
            style={{
              height: 78,
              borderBottom: `1px solid ${colors.rule}`,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '0 24px',
              flexShrink: 0,
            }}
          >
            <Portrait
              name={player.shortName}
              color={'color' in player ? player.color : colors.costume.custom}
              avatar={'avatar' in player ? player.avatar : undefined}
              size={48}
            />
            <div style={{flex: 1, minWidth: 0}}>
              <p
                style={{
                  margin: 0,
                  fontFamily: fontDisplay,
                  fontStyle: 'italic',
                  fontSize: 28,
                  lineHeight: 1,
                  color: colors.cream,
                }}
              >
                {player.shortName}
              </p>
              <p
                style={{
                  margin: '6px 0 0',
                  fontFamily: fontMono,
                  fontSize: 12,
                  color: colors.inkSoft,
                }}
              >
                Voice through grok-fast
              </p>
            </div>
            <span
              style={{
                fontFamily: fontSans,
                fontSize: 14,
                fontWeight: 600,
                color: colors.cream,
              }}
            >
              About
            </span>
          </header>
          <div style={{flex: 1, position: 'relative', overflow: 'hidden'}}>{children}</div>
          <div
            style={{
              borderTop: `1px solid ${colors.rule}`,
              padding: '14px 24px 18px',
              display: 'flex',
              gap: 10,
              alignItems: 'flex-end',
            }}
          >
            <div
              style={{
                flex: 1,
                minHeight: 48,
                borderRadius: radii.md,
                backgroundColor: colors.creamDim,
                color: composer ? colors.night : 'rgba(20,17,15,0.4)',
                padding: '12px 14px',
                fontFamily: fontSans,
                fontSize: 18,
              }}
            >
              {composer || placeholder}
            </div>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: radii.md,
                backgroundColor: colors.acid,
                color: colors.onAcid,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const Portrait: React.FC<{
  name: string;
  color: string;
  avatar?: string;
  size?: number;
}> = ({name, color, avatar, size = 36}) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radii.sm,
        backgroundColor: color,
        overflow: 'hidden',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {avatar ? (
        <Img src={staticFile(avatar)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      ) : (
        <span
          style={{
            fontFamily: fontDisplay,
            fontStyle: 'italic',
            color: colors.cream,
            fontSize: size * 0.46,
          }}
        >
          {name[0]}
        </span>
      )}
    </div>
  );
};
