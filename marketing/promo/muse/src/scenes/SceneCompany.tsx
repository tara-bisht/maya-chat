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

// Beat 3 (480-960): the company wall. 8 playbills, staggered, highlight sweep.
export const SceneCompany: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const sweep = Math.floor(frame / 45) % CHARACTERS.length;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.night,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '40px 60px',
      }}
    >
      <div
        style={{
          opacity: titleOpacity,
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontWeight: 600,
          fontSize: 60,
          color: COLORS.cream,
          marginBottom: 6,
        }}
      >
        Start with a voice.
      </div>
      <div
        style={{
          opacity: titleOpacity,
          fontFamily: FONTS.sans,
          fontSize: 22,
          color: COLORS.inkSoft,
          marginBottom: 30,
        }}
      >
        Marcus and Dr. Priya are free. The rest ride Plus.
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 44,
          alignItems: 'center',
        }}
      >
        {[0, 1].map((row) => (
          <div key={row} style={{ display: 'flex', gap: 36 }}>
            {CHARACTERS.slice(row * 4, row * 4 + 4).map((c, i) => {
              const index = row * 4 + i;
              const delay = 20 + index * 14;
              const s = spring({
                frame: frame - delay,
                fps,
                config: { damping: 16, stiffness: 110 },
              });
              const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              const scale = interpolate(s, [0, 1], [0.7, 0.8], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              const y = interpolate(s, [0, 1], [60, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              return (
                <div
                  key={c.id}
                  style={{
                    opacity,
                    transform: `translateY(${y}px)`,
                    marginTop: index % 2 === 1 ? 26 : 0,
                  }}
                >
                  <PlaybillPoster
                    character={c}
                    scale={scale}
                    highlight={sweep === index}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
