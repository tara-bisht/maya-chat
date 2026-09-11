import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, FONTS } from '../constants/theme';
import { UserTurn, AgentTurn } from '../components/ChatTurn';

// Beat 2 (180-480): "Same question. Different night."
export const SceneUsual: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = (delay: number) => {
    const s = spring({
      frame: frame - delay,
      fps,
      config: { damping: 18, stiffness: 120 },
    });
    return {
      opacity: interpolate(frame, [delay, delay + 12], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }),
      y: interpolate(s, [0, 1], [36, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }),
    };
  };

  const you = enter(10);
  const gray = enter(60);
  const marcus = enter(130);
  const nonna = enter(200);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.night,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 26,
        padding: '60px 120px',
      }}
    >
      <div
        style={{
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontWeight: 600,
          fontSize: 64,
          color: COLORS.cream,
          marginBottom: 8,
        }}
      >
        Same question. Different night.
      </div>

      <div style={{ opacity: you.opacity, transform: `translateY(${you.y}px)` }}>
        <UserTurn text="I bombed the presentation. I feel sick." time="21:14" />
      </div>

      <div
        style={{
          opacity: gray.opacity,
          transform: `translateY(${gray.y}px)`,
          maxWidth: 720,
          alignSelf: 'flex-start',
          marginLeft: 220,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: COLORS.inkSoft,
            marginBottom: 6,
          }}
        >
          ASSISTANT
        </div>
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 19,
            color: COLORS.inkSoft,
            textDecoration: 'line-through',
            opacity: 0.65,
            lineHeight: 1.5,
          }}
        >
          I&apos;m sorry you&apos;re feeling that way. As an AI, I&apos;m here
          to help with any questions you might have...
        </div>
      </div>

      <div
        style={{
          opacity: marcus.opacity,
          transform: `translateY(${marcus.y}px)`,
          alignSelf: 'flex-start',
          marginLeft: 220,
        }}
      >
        <AgentTurn
          agentName="Marcus"
          costume="marcus"
          time="21:14"
          text="Oh, call the papers. One wobbly slide deck and you're writing your own tragedy? Epictetus, love: the slides are external noise. Your preparation is yours. Wash your face, redo the opening line."
        />
      </div>

      <div
        style={{
          opacity: nonna.opacity,
          transform: `translateY(${nonna.y}px)`,
          alignSelf: 'flex-start',
          marginLeft: 220,
        }}
      >
        <AgentTurn
          agentName="Nonna Maria"
          costume="nonna"
          time="21:15"
          text="Madonna mia! One bad meeting and no dinner? Tesoro mio, close the laptop, eat something warm, then we fix the slides together."
        />
      </div>
    </AbsoluteFill>
  );
};
