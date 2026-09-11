import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { COLORS, FONTS } from '../constants/theme';
import { fadeIn, flashAt, usePop, useRise } from './anim';

const TICKER = [
  'avatars/marcus-stoic.jpg',
  'avatars/dr-priya-stem.jpg',
  'avatars/alex-tech-lead.jpg',
  'avatars/nonna-maria.jpg',
  'avatars/viktor-drill-sergeant.jpg',
  'avatars/valerian-polymath.jpg',
  'avatars/barnaby-cat.jpg',
  'avatars/ren-philosopher.jpg',
  'avatars/jules-cinephile.jpg',
  'avatars/kenji-panel.jpg',
  'avatars/meera-editor.jpg',
  'avatars/sofia-economist.jpg',
];

// Beat 7 — end card. The slam lands on frame 0, the boom pulses the URL.
export const V2EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const urlScale = usePop(frame, 48);
  const kickerRise = useRise(frame, 8, 40);
  const subRise = useRise(frame, 60, 40);
  const boomPulse = 1 + flashAt(frame, 259, 8) * 0.05;
  // Seamless marquee: 12 avatars x 132px pitch = 1584 loop.
  const loop = 1584;
  const mx = -(((frame - 70) * 5) % loop);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: COLORS.night,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        overflow: 'hidden',
      }}
    >
      {/* Slam flash */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: COLORS.acid,
          opacity: flashAt(frame, 0, 5) * 0.9,
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 24,
          letterSpacing: '0.34em',
          color: COLORS.cream,
          opacity: fadeIn(frame, 8, 12),
          transform: `translateY(${kickerRise}px)`,
        }}
      >
        THE HOUSE IS OPEN
      </div>
      <div
        style={{
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontWeight: 500,
          fontSize: 84,
          color: COLORS.cream,
          opacity: fadeIn(frame, 30, 12),
        }}
      >
        Try it at
      </div>
      {frame >= 44 ? (
        <div
          style={{
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            fontWeight: 700,
            fontSize: 168,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            color: COLORS.acid,
            textShadow: `7px 7px 0 ${COLORS.cream}`,
            transform: `scale(${Math.max(0.01, urlScale) * boomPulse})`,
          }}
        >
          getmaya.chat
        </div>
      ) : null}

      {/* Avatar marquee */}
      <div
        style={{
          marginTop: 44,
          width: '100%',
          overflow: 'hidden',
          opacity: fadeIn(frame, 70, 14),
        }}
      >
        <div style={{ display: 'flex', gap: 36, transform: `translateX(${mx}px)`, width: 'max-content' }}>
          {[...TICKER, ...TICKER].map((a, i) => (
            <Img
              key={i}
              src={staticFile(a)}
              style={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                objectFit: 'cover',
                border: `3px solid ${COLORS.rule}`,
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: 40,
          fontFamily: FONTS.mono,
          fontSize: 22,
          letterSpacing: '0.2em',
          color: COLORS.night,
          backgroundColor: COLORS.stub,
          padding: '14px 44px',
          borderRadius: 6,
          border: `2px dashed ${COLORS.night}`,
          boxShadow: `6px 6px 0 ${COLORS.acid}`,
          opacity: fadeIn(frame, 110, 14),
          transform: `translateY(${subRise}px)`,
        }}
      >
        FREE · NO CARD · 100s OF AGENTS
      </div>
    </div>
  );
};
