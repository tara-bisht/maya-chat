import React from 'react';
import { staticFile, Img } from 'remotion';
import { COLORS, FONTS, CHARACTERS } from '../constants/theme';

interface DesktopWindowProps {
  children: React.ReactNode;
  activeAgentId?: string;
  activeNav?: 'chat' | 'explore' | 'studio';
  headerRight?: React.ReactNode;
  style?: React.CSSProperties;
}

export const DesktopWindow: React.FC<DesktopWindowProps> = ({
  children,
  activeAgentId = 'marcus',
  activeNav = 'chat',
  headerRight,
  style,
}) => {
  return (
    <div
      style={{
        width: 1720,
        height: 980,
        backgroundColor: COLORS.night,
        borderRadius: 14,
        border: `2px solid ${COLORS.rule}`,
        boxShadow: `0 25px 60px rgba(0,0,0,0.85), 8px 8px 0 ${COLORS.acid}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
    >
      {/* Top macOS Titlebar */}
      <div
        style={{
          height: 48,
          backgroundColor: '#1C1815',
          borderBottom: `1px solid ${COLORS.rule}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          flexShrink: 0,
        }}
      >
        {/* Window controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#FF5F56' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#27C93F' }} />
          <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.inkSoft, marginLeft: 14 }}>
            maya-chat.desktop · v2.4
          </span>
        </div>

        {/* Center Title */}
        <div
          style={{
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            fontSize: 18,
            fontWeight: 600,
            color: COLORS.cream,
            letterSpacing: '0.02em',
          }}
        >
          Maya House — Opinionated Characters
        </div>

        {/* Right Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span
            style={{
              backgroundColor: COLORS.stub,
              color: COLORS.onStub,
              fontFamily: FONTS.sans,
              fontSize: 11,
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: 4,
              letterSpacing: '0.05em',
            }}
          >
            FREE TIER
          </span>
          <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.inkSoft }}>
            50 credits · grok-fast
          </span>
        </div>
      </div>

      {/* App Body (Left Sidebar + Main Stage) */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Cast Navigation Rail */}
        <div
          style={{
            width: 310,
            backgroundColor: '#171412',
            borderRight: `1px solid ${COLORS.rule}`,
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 16px',
            flexShrink: 0,
          }}
        >
          {/* Logo & Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, paddingLeft: 6 }}>
            <span style={{ fontFamily: FONTS.display, fontStyle: 'italic', fontSize: 26, fontWeight: 700, color: COLORS.cream }}>
              Maya
            </span>
            <span style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 800, color: COLORS.acid, letterSpacing: '0.08em' }}>
              CAST
            </span>
          </div>

          {/* Quick Cast List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
            <div style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 800, color: COLORS.inkSoft, letterSpacing: '0.08em', marginBottom: 4, paddingLeft: 6 }}>
              FEATURED PLAYERS
            </div>

            {CHARACTERS.slice(0, 5).map((char) => {
              const isActive = activeNav === 'chat' && activeAgentId === char.id;
              const costumeColor = COLORS.costumes[char.costume];

              return (
                <div
                  key={char.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '8px 10px',
                    borderRadius: 8,
                    backgroundColor: isActive ? 'rgba(246, 239, 228, 0.08)' : 'transparent',
                    borderLeft: isActive ? `3px solid ${costumeColor}` : '3px solid transparent',
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      overflow: 'hidden',
                      backgroundColor: costumeColor,
                      flexShrink: 0,
                    }}
                  >
                    <Img src={staticFile(char.avatar)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: FONTS.sans,
                        fontSize: 14,
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? COLORS.cream : COLORS.creamDim,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {char.shortName}
                    </div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.inkSoft }}>
                      {char.category}
                    </div>
                  </div>
                  {isActive && (
                    <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: COLORS.acid }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Sidebar Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 14, borderTop: `1px solid ${COLORS.rule}` }}>
            {/* Explore 100+ agents button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 8,
                backgroundColor: activeNav === 'explore' ? COLORS.stub : '#221D19',
                color: activeNav === 'explore' ? COLORS.onStub : COLORS.cream,
                fontFamily: FONTS.sans,
                fontSize: 13,
                fontWeight: 700,
                border: `1px solid ${activeNav === 'explore' ? COLORS.stub : COLORS.rule}`,
              }}
            >
              <span>✦</span>
              <span>Explore Agents (100+)</span>
            </div>

            {/* Custom agent button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 8,
                backgroundColor: activeNav === 'studio' ? COLORS.acid : '#221D19',
                color: activeNav === 'studio' ? COLORS.onAcid : COLORS.creamDim,
                fontFamily: FONTS.sans,
                fontSize: 13,
                fontWeight: 700,
                border: `1px solid ${activeNav === 'studio' ? COLORS.acid : COLORS.rule}`,
              }}
            >
              <span>+</span>
              <span>Create Custom Agent</span>
            </div>
          </div>
        </div>

        {/* Main Workspace Stage */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: COLORS.night,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
