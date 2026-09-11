import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, FONTS } from '../../constants/theme';
import { AcidScribble } from '../../components/AcidScribble';
import { HardTicket } from '../../components/HardTicket';

export const Scene5_OutroGetMaya: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance springs
  const wordmarkSpring = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  const ticketSpring = spring({
    frame: frame - 18,
    fps,
    config: { damping: 12, stiffness: 130 },
  });

  const btnPulse = Math.sin(frame * 0.2) * 3;

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
      {/* Background Radial Glow */}
      <div
        style={{
          position: 'absolute',
          width: 1200,
          height: 1200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 77, 46, 0.09) 0%, rgba(214, 242, 92, 0.05) 50%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Value Banner: Try for Free */}
      <div
        style={{
          marginBottom: 20,
          transform: `translateY(${interpolate(wordmarkSpring, [0, 1], [-40, 0])}px)`,
          opacity: interpolate(wordmarkSpring, [0, 1], [0, 1]),
        }}
      >
        <HardTicket variant="acid" shadowOffset={5} rotation={-0.6}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '2px 14px' }}>
            <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: '0.06em' }}>
              ✓ TRY FOR FREE
            </span>
            <span style={{ fontSize: 14, opacity: 0.85 }}>|</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              No Credit Card Required · Daily Credit Allowance Included
            </span>
          </div>
        </HardTicket>
      </div>

      {/* Main Branding Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        {/* Wordmark */}
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 115,
            fontStyle: 'italic',
            fontWeight: 500,
            color: COLORS.cream,
            letterSpacing: '-0.04em',
            lineHeight: 0.9,
            marginBottom: 8,
          }}
        >
          Maya
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: FONTS.display,
            fontSize: 62,
            fontStyle: 'italic',
            fontWeight: 600,
            color: COLORS.cream,
            margin: '6px 0 0 0',
            letterSpacing: '-0.03em',
          }}
        >
          Give your AI a{' '}
          <span style={{ color: COLORS.cream, position: 'relative', display: 'inline-block' }}>
            personality.
            <div style={{ position: 'absolute', bottom: -18, left: 0, width: '100%' }}>
              <AcidScribble delay={10} width="100%" height={26} />
            </div>
          </span>
        </h1>

        <p
          style={{
            fontFamily: FONTS.sans,
            fontSize: 22,
            color: COLORS.creamDim,
            marginTop: 36,
            maxWidth: 820,
            lineHeight: 1.4,
          }}
        >
          100s of resident characters. Unlimited custom studio agents.
          <br />
          <span style={{ color: COLORS.inkSoft }}>Not another sterile chatbot.</span>
        </p>
      </div>

      {/* Main Final CTA Ticket: Try at getmaya.chat */}
      <div
        style={{
          marginTop: 36,
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
              gap: 40,
              padding: '12px 28px',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 13,
                  fontWeight: 900,
                  letterSpacing: '0.1em',
                  color: COLORS.acid,
                  textTransform: 'uppercase',
                }}
              >
                THE HOUSE IS OPEN
              </div>
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 32,
                  fontWeight: 900,
                  color: COLORS.onStub,
                  letterSpacing: '-0.02em',
                  marginTop: 2,
                }}
              >
                Try at <span style={{ textDecoration: 'underline' }}>getmaya.chat</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div
              style={{
                backgroundColor: COLORS.acid,
                color: COLORS.onAcid,
                fontFamily: FONTS.sans,
                fontSize: 19,
                fontWeight: 800,
                padding: '16px 32px',
                borderRadius: 10,
                boxShadow: `5px 5px 0 ${COLORS.night}`,
                transform: `translateY(${btnPulse}px)`,
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
              }}
            >
              Start Chatting for Free →
            </div>
          </div>
        </HardTicket>
      </div>
    </AbsoluteFill>
  );
};
