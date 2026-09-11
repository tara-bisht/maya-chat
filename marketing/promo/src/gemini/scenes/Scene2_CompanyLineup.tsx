import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, FONTS, CHARACTERS } from '../constants/theme';
import { PlaybillPoster } from '../components/PlaybillPoster';
import { HardTicket } from '../components/HardTicket';

export const Scene2_CompanyLineup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Header entrance
  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Selected 4 characters for widescreen lineup
  const featured = [
    CHARACTERS[0], // Marcus
    CHARACTERS[1], // Priya
    CHARACTERS[2], // Alex
    CHARACTERS[3], // Nonna Maria
  ];

  // Camera pan / zoom
  const camZoom = interpolate(frame, [140, 260], [1, 1.06], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.night,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '40px 60px',
      }}
    >
      {/* Background wheatpaste textures / grid lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(${COLORS.rule} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.rule} 1px, transparent 1px)`,
          backgroundSize: '120px 120px',
          opacity: 0.25,
          pointerEvents: 'none',
        }}
      />

      {/* Top Section Header */}
      <div
        style={{
          position: 'absolute',
          top: 50,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `translateY(${interpolate(headerSpring, [0, 1], [-50, 0])}px)`,
          opacity: interpolate(headerSpring, [0, 1], [0, 1]),
          zIndex: 30,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              backgroundColor: COLORS.acid,
              color: COLORS.onAcid,
              fontFamily: FONTS.sans,
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '0.1em',
              padding: '4px 10px',
              borderRadius: 4,
            }}
          >
            TONIGHT'S LINEUP
          </span>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 13,
              color: COLORS.inkSoft,
              letterSpacing: '0.05em',
            }}
          >
            THE CURATED REPERTORY
          </span>
        </div>

        <h2
          style={{
            fontFamily: FONTS.display,
            fontSize: 52,
            fontStyle: 'italic',
            fontWeight: 600,
            color: COLORS.cream,
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          Meet the Company.
        </h2>
      </div>

      {/* The 4 Staggered Wheatpasted Posters */}
      <div
        style={{
          display: 'flex',
          gap: 40,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 80,
          transform: `scale(${camZoom})`,
          zIndex: 20,
        }}
      >
        {featured.map((char, index) => {
          const delay = index * 12 + 10;
          const enterSpring = spring({
            frame: frame - delay,
            fps,
            config: { damping: 13, stiffness: 120 },
          });

          const translateY = interpolate(enterSpring, [0, 1], [220, index % 2 === 1 ? 30 : 0]);
          const scale = interpolate(enterSpring, [0, 1], [0.8, 1]);
          const opacity = interpolate(enterSpring, [0, 1], [0, 1]);

          // Highlight Marcus during frame 120 - 200
          const isMarcusHighlight = char.id === 'marcus' && frame >= 120 && frame <= 210;
          const marcusPop = isMarcusHighlight
            ? spring({
                frame: frame - 120,
                fps,
                config: { damping: 12, stiffness: 140 },
              })
            : 0;

          return (
            <div
              key={char.id}
              style={{
                transform: `translateY(${translateY - marcusPop * 25}px) scale(${scale + marcusPop * 0.08})`,
                zIndex: isMarcusHighlight ? 25 : index,
              }}
            >
              <PlaybillPoster
                character={char}
                opacity={opacity}
                highlight={isMarcusHighlight}
              />
            </div>
          );
        })}
      </div>

      {/* Bottom Kinetic Ticket Banner */}
      <div
        style={{
          position: 'absolute',
          bottom: 45,
          zIndex: 35,
          transform: `translateY(${interpolate(
            spring({ frame: frame - 60, fps, config: { damping: 14, stiffness: 110 } }),
            [0, 1],
            [80, 0]
          )}px)`,
          opacity: interpolate(frame - 60, [0, 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <HardTicket variant="stub" shadowOffset={6} rotation={-0.6}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '2px 14px' }}>
            <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '0.04em' }}>
              8 DISTINCT PLAYERS
            </span>
            <span style={{ fontSize: 18, opacity: 0.4 }}>|</span>
            <span style={{ fontSize: 16, fontWeight: 600 }}>
              Custom System Prompts · Dedicated Costumes · Built-in Point of View
            </span>
            <span style={{ fontSize: 18, opacity: 0.4 }}>|</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: COLORS.acid }}>
              NO APOLOGY SCRIPTS
            </span>
          </div>
        </HardTicket>
      </div>
    </AbsoluteFill>
  );
};
