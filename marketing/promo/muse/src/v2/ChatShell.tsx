import React from 'react';
import { Img, staticFile } from 'remotion';
import { COLORS, FONTS } from '../constants/theme';

interface ChatShellProps {
  // Accent wash: costume color for agents, gray for sterile.
  wash: string;
  sterile?: boolean;
  avatar?: string;
  name: string;
  sub: string;
  statusColor?: string;
  view?: string;
  caption?: string;
  composerText?: string;
  children: React.ReactNode;
}

// The one persistent product window. Every v2 scene except the end card
// lives inside this exact geometry: 1500x800, header / body / composer.
export const ChatShell: React.FC<ChatShellProps> = ({
  wash,
  sterile = false,
  avatar,
  name,
  sub,
  statusColor,
  view,
  caption,
  composerText = 'Message…',
  children,
}) => {
  const bg = sterile ? '#101010' : COLORS.night;
  const win = sterile ? '#EDEDEA' : COLORS.night;
  const subInk = sterile ? '#8A8A8A' : COLORS.inkSoft;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 1500,
          height: 800,
          backgroundColor: win,
          borderRadius: 22,
          border: sterile ? '1px solid #D8D8D4' : `2px solid ${COLORS.rule}`,
          boxShadow: sterile
            ? '0 30px 80px rgba(0,0,0,0.55)'
            : `0 0 0 2px ${wash}, 0 30px 90px rgba(0,0,0,0.6)`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            height: 92,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '0 28px',
            backgroundColor: sterile ? '#FFFFFF' : wash,
            borderBottom: sterile
              ? '1px solid #D8D8D4'
              : `2px solid ${COLORS.night}`,
          }}
        >
          {avatar ? (
            <Img
              src={staticFile(avatar)}
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                objectFit: 'cover',
                border: sterile
                  ? '2px solid #D8D8D4'
                  : `3px solid ${COLORS.cream}`,
              }}
            />
          ) : (
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: sterile ? '#C9C9C9' : COLORS.rule,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONTS.sans,
                fontWeight: 800,
                fontSize: 24,
                color: sterile ? '#FFFFFF' : COLORS.cream,
              }}
            >
              ?
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div
              style={{
                fontFamily: FONTS.sans,
                fontWeight: 800,
                fontSize: 24,
                color: sterile ? '#2B2B2B' : COLORS.cream,
                letterSpacing: '-0.01em',
              }}
            >
              {name}
            </div>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 14,
                color: sterile ? '#8A8A8A' : COLORS.cream,
                opacity: sterile ? 1 : 0.85,
              }}
            >
              {sub}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
            {view ? (
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 13,
                  letterSpacing: '0.14em',
                  color: sterile ? '#8A8A8A' : COLORS.cream,
                  border: sterile
                    ? '1px solid #D8D8D4'
                    : `1px solid ${COLORS.cream}`,
                  borderRadius: 999,
                  padding: '6px 14px',
                }}
              >
                {view}
              </span>
            ) : null}
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                backgroundColor: statusColor ?? (sterile ? '#B5B5B5' : '#7ee787'),
              }}
            />
          </div>
        </div>

        {/* Body = the active view */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: sterile ? '#EDEDEA' : COLORS.night,
          }}
        >
          {children}
        </div>

        {/* Composer */}
        <div
          style={{
            height: 96,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '0 28px',
            backgroundColor: sterile ? '#FFFFFF' : COLORS.codeWell,
            borderTop: sterile
              ? '1px solid #D8D8D4'
              : `2px solid ${COLORS.rule}`,
          }}
        >
          <div
            style={{
              flex: 1,
              fontFamily: FONTS.sans,
              fontSize: 20,
              color: subInk,
            }}
          >
            {composerText}
          </div>
          <div
            style={{
              fontFamily: FONTS.sans,
              fontWeight: 800,
              fontSize: 16,
              letterSpacing: '0.08em',
              padding: '12px 26px',
              borderRadius: 10,
              backgroundColor: sterile ? '#2F7CF6' : COLORS.acid,
              color: '#FFFFFF',
            }}
          >
            SEND
          </div>
        </div>
      </div>

      {/* Caption */}
      {caption ? (
        <div
          style={{
            position: 'absolute',
            bottom: 34,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 19,
              letterSpacing: '0.22em',
              color: COLORS.cream,
              backgroundColor: 'rgba(12,10,9,0.82)',
              border: `1px solid ${COLORS.rule}`,
              padding: '10px 26px',
              borderRadius: 999,
            }}
          >
            {caption}
          </span>
        </div>
      ) : null}
    </div>
  );
};
