import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, FONTS } from '../constants/theme';
import { AcidScribble } from '../components/AcidScribble';

// Beat 1 (0-180): hero hook. "Give your AI a personality."
export const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rise = (delay: number) =>
    spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 120 } });

  const opacity = (delay: number) =>
    interpolate(frame, [delay, delay + 15], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  const slide = (delay: number) =>
    interpolate(rise(delay), [0, 1], [40, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.night,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          opacity: opacity(5),
          fontFamily: FONTS.sans,
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: '0.22em',
          color: COLORS.inkSoft,
          marginBottom: 28,
        }}
      >
        MAYA CHAT · THE HOUSE IS OPEN
      </div>

      <div
        style={{
          opacity: opacity(20),
          transform: `translateY(${slide(20)}px)`,
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontWeight: 500,
          fontSize: 128,
          lineHeight: 0.95,
          letterSpacing: '-0.03em',
          color: COLORS.cream,
          textAlign: 'center',
        }}
      >
        Give your AI
        <br />a personality.
      </div>

      <div
        style={{
          opacity: opacity(20),
          width: 660,
          height: 24,
          marginTop: -10,
        }}
      >
        <AcidScribble delay={55} />
      </div>

      <div
        style={{
          opacity: opacity(70),
          transform: `translateY(${slide(70)}px)`,
          fontFamily: FONTS.sans,
          fontSize: 30,
          color: COLORS.creamDim,
          marginTop: 64,
          textAlign: 'center',
          maxWidth: 1100,
          lineHeight: 1.4,
        }}
      >
        Don&apos;t talk to a boring AI chatbot. Cast a character — or write
        one.
      </div>

      <div
        style={{
          opacity: opacity(100),
          transform: `translateY(${slide(100)}px)`,
          marginTop: 48,
          backgroundColor: COLORS.acid,
          color: COLORS.onAcid,
          fontFamily: FONTS.sans,
          fontSize: 26,
          fontWeight: 600,
          padding: '18px 44px',
          borderRadius: 10,
          boxShadow: `4px 4px 0 ${COLORS.cream}`,
        }}
      >
        Create an agent
      </div>
    </AbsoluteFill>
  );
};
