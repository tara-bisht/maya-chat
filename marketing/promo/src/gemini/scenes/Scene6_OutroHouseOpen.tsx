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
import { HardTicket } from '../components/HardTicket';

export const Scene6_OutroHouseOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Wordmark spring
  const wordmarkSpring = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  // Ticket spring
  const ticketSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 12, stiffness: 130 },
  });

  // Button pulse
  const btnPulse = Math.sin(frame * 0.15) * 2;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.night,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 80px',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient night glow */}
      <div
        style={{
          position: 'absolute',
          width: 1100,
          height: 1100,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 77, 46, 0.08) 0%, rgba(214, 242, 92, 0.04) 50%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Brand Climax Block */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          transform: `translateY(${interpolate(wordmarkSpring, [0, 1], [50, 0])}px)`,
          opacity: interpolate(wordmarkSpring, [0, 1], [0, 1]),
          zIndex: 10,
        }}
      >
        {/* Wordmark */}
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 120,
            fontStyle: 'italic',
            fontWeight: 500,
            color: COLORS.cream,
            letterSpacing: '-0.04em',
            lineHeight: 0.9,
            marginBottom: 10,
          }}
        >
          Maya
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: FONTS.display,
            fontSize: 68,
            fontStyle: 'italic',
            fontWeight: 600,
            color: COLORS.cream,
            margin: '10px 0 0 0',
            letterSpacing: '-0.03em',
          }}
        >
          Give your AI a{' '}
          <span style={{ color: COLORS.cream, position: 'relative', display: 'inline-block' }}>
            personality.
            <div style={{ position: 'absolute', bottom: -18, left: 0, width: '100%' }}>
              <AcidScribble delay={12} width="100%" height={26} />
            </div>
          </span>
        </h1>

        <p
          style={{
            fontFamily: FONTS.sans,
            fontSize: 24,
            color: COLORS.creamDim,
            marginTop: 40,
            maxWidth: 880,
            lineHeight: 1.45,
          }}
        >
          Opinionated AI — yours, or one we already wrote.
          <br />
          <span style={{ color: COLORS.inkSoft }}>Not a helpdesk. Not a copilot.</span>
        </p>
      </div>

      {/* Final Ticket with CTA */}
      <div
        style={{
          marginTop: 45,
          transform: `translateY(${interpolate(ticketSpring, [0, 1], [80, 0])}px) rotate(-1deg)`,
          opacity: interpolate(ticketSpring, [0, 1], [0, 1]),
          zIndex: 20,
        }}
      >
        <HardTicket variant="stub" shadowOffset={8} rotation={-0.5}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 36,
              padding: '10px 24px',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 24,
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  color: COLORS.onStub,
                }}
              >
                THE HOUSE IS OPEN.
              </div>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 15,
                  color: COLORS.night,
                  opacity: 0.8,
                  marginTop: 2,
                }}
              >
                mayachat.com · Free tier included
              </div>
            </div>

            {/* Acid CTA Button */}
            <div
              style={{
                backgroundColor: COLORS.acid,
                color: COLORS.onAcid,
                fontFamily: FONTS.sans,
                fontSize: 18,
                fontWeight: 700,
                padding: '14px 28px',
                borderRadius: 10,
                boxShadow: `4px 4px 0 ${COLORS.night}`,
                transform: `translateY(${btnPulse}px)`,
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
              }}
            >
              Create an agent →
            </div>
          </div>
        </HardTicket>
      </div>
    </AbsoluteFill>
  );
};
