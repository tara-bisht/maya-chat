import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, FONTS } from '../constants/theme';
import { HardTicket } from '../components/HardTicket';

const FIELDS: Array<{ label: string; value: string; accent?: boolean }> = [
  { label: 'NAME', value: 'Sable — the midnight radio host' },
  { label: 'TAGLINE', value: 'Static, secrets, and slow truths after dark.' },
  { label: 'COSTUME', value: 'moss · magenta · indigo · brass' },
  {
    label: 'BACKSTORY',
    value: 'Ran a pirate station for nine years. Never sleeps before 3am.',
  },
  { label: 'TONE', value: 'Warmth 0.7 · Directness 0.8 · Humor 0.6' },
  { label: 'WHO CAN TALK', value: 'Public — anyone signed in can chat', accent: true },
];

// Beat 4 (960-1200): Studio character sheet.
export const SceneStudio: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sheet = spring({
    frame,
    fps,
    config: { damping: 17, stiffness: 100 },
  });
  const sheetOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sheetY = interpolate(sheet, [0, 1], [60, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.night,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 90,
        padding: '60px 110px',
      }}
    >
      <div style={{ maxWidth: 480 }}>
        <div
          style={{
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: 84,
            lineHeight: 1.0,
            color: COLORS.cream,
            marginBottom: 24,
          }}
        >
          Write the personality.
        </div>
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 26,
            lineHeight: 1.45,
            color: COLORS.creamDim,
            marginBottom: 36,
          }}
        >
          If no voice fits the night, you write one. Name, backstory, tone —
          yours.
        </div>
        <div
          style={{
            display: 'inline-block',
            backgroundColor: COLORS.acid,
            color: COLORS.onAcid,
            fontFamily: FONTS.sans,
            fontSize: 24,
            fontWeight: 600,
            padding: '14px 36px',
            borderRadius: 10,
            boxShadow: `4px 4px 0 ${COLORS.cream}`,
          }}
        >
          Save
        </div>
      </div>

      <div
        style={{
          opacity: sheetOpacity,
          transform: `translateY(${sheetY}px)`,
        }}
      >
        <HardTicket
          rotation={-1}
          shadowOffset={8}
          style={{ width: 760, padding: '34px 38px' }}
        >
          <div
            style={{
              fontFamily: FONTS.sans,
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '0.14em',
              color: COLORS.acidHover,
              marginBottom: 18,
            }}
          >
            CREATE AGENT
          </div>
          {FIELDS.map((f, i) => {
            const o = interpolate(frame, [25 + i * 14, 37 + i * 14], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <div key={f.label} style={{ opacity: o, marginBottom: 16 }}>
                <div
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 13,
                    letterSpacing: '0.1em',
                    opacity: 0.6,
                    marginBottom: 3,
                  }}
                >
                  {f.label}
                </div>
                <div
                  style={{
                    fontFamily: FONTS.sans,
                    fontSize: 23,
                    fontWeight: f.accent ? 800 : 500,
                    backgroundColor: f.accent ? COLORS.stub : 'transparent',
                    display: f.accent ? 'inline-block' : 'block',
                    padding: f.accent ? '2px 12px' : 0,
                    borderRadius: 6,
                  }}
                >
                  {f.value}
                </div>
              </div>
            );
          })}
        </HardTicket>
      </div>
    </AbsoluteFill>
  );
};
