import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Img,
} from 'remotion';
import { COLORS, FONTS, CHARACTERS } from '../../constants/theme';
import { DesktopWindow } from '../../components/DesktopWindow';
import { HardTicket } from '../../components/HardTicket';

export const Scene3_ExploreAgents: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Categories
  const categories = ['ALL', 'PRODUCTIVITY', 'LEARNING', 'LIFESTYLE', 'PHILOSOPHY', 'CODE'];
  const activeCategory = frame > 120 ? 'LEARNING' : 'ALL';

  // Agent cards to display (6 diverse characters)
  const agents = [
    CHARACTERS[1], // Priya (Learning)
    CHARACTERS[4], // Viktor (Productivity)
    CHARACTERS[2], // Alex (Code)
    CHARACTERS[6], // Barnaby (Lifestyle)
    CHARACTERS[5], // Valerian (Learning/Cosmos)
    CHARACTERS[7], // Ren (Philosophy)
  ];

  // Grid entrance spring
  const gridSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.night,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <DesktopWindow activeNav="explore">
        {/* Gallery Stage Container */}
        <div
          style={{
            flex: 1,
            padding: '30px 45px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: 24,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: COLORS.acid,
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                THE MARKETPLACE
              </div>
              <h2
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 38,
                  fontStyle: 'italic',
                  fontWeight: 600,
                  color: COLORS.cream,
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                Explore 100s of In-Built Agents.
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: 8 }}>
              {categories.map((cat) => {
                const isActive = cat === activeCategory;
                return (
                  <div
                    key={cat}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 6,
                      backgroundColor: isActive ? COLORS.cream : '#201C18',
                      color: isActive ? COLORS.night : COLORS.inkSoft,
                      fontFamily: FONTS.sans,
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: '0.05em',
                      border: `1px solid ${isActive ? COLORS.cream : COLORS.rule}`,
                    }}
                  >
                    {cat}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 6-Card Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20,
              transform: `translateY(${interpolate(gridSpring, [0, 1], [40, 0])}px)`,
              opacity: interpolate(gridSpring, [0, 1], [0, 1]),
            }}
          >
            {agents.map((agent, index) => {
              const costumeColor = COLORS.costumes[agent.costume];
              const isHovered = index === 0 && frame > 130;

              return (
                <div
                  key={agent.id}
                  style={{
                    backgroundColor: '#1A1613',
                    border: isHovered ? `2px solid ${COLORS.acid}` : `1px solid ${COLORS.rule}`,
                    borderRadius: 10,
                    padding: '16px',
                    display: 'flex',
                    gap: 16,
                    alignItems: 'center',
                    boxShadow: isHovered ? `4px 4px 0 ${COLORS.acid}` : `4px 4px 0 rgba(0,0,0,0.5)`,
                    transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {/* Portrait */}
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 8,
                      overflow: 'hidden',
                      backgroundColor: costumeColor,
                      flexShrink: 0,
                      boxShadow: `2px 2px 0 ${COLORS.cream}`,
                    }}
                  >
                    <Img src={staticFile(agent.avatar)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span
                        style={{
                          fontFamily: FONTS.mono,
                          fontSize: 10,
                          fontWeight: 700,
                          color: COLORS.stub,
                          textTransform: 'uppercase',
                        }}
                      >
                        {agent.category}
                      </span>
                      {agent.freeTier && (
                        <span style={{ fontSize: 10, color: COLORS.inkSoft, fontWeight: 700 }}>FREE TIER</span>
                      )}
                    </div>

                    <div
                      style={{
                        fontFamily: FONTS.display,
                        fontStyle: 'italic',
                        fontSize: 19,
                        fontWeight: 600,
                        color: COLORS.cream,
                        margin: '2px 0 4px 0',
                      }}
                    >
                      {agent.shortName}
                    </div>

                    <div
                      style={{
                        fontFamily: FONTS.sans,
                        fontSize: 12,
                        color: COLORS.creamDim,
                        lineHeight: 1.35,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      "{agent.tagline}"
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Banner */}
          <div style={{ marginTop: 'auto', paddingTop: 20, display: 'flex', justifyContent: 'center' }}>
            <HardTicket variant="stub" shadowOffset={5} rotation={0}>
              <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.04em' }}>
                ✦ 100s OF IN-BUILT RESIDENT AGENTS ACROSS EVERY FIELD & CRAFT
              </span>
            </HardTicket>
          </div>
        </div>
      </DesktopWindow>
    </AbsoluteFill>
  );
};
