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

export const Scene1_SterileContrast: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Sterile bot entrance
  const botEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Typewriter effect for bland bot text
  const sterileFullText =
    "Hello! As an AI language model, I don't have opinions, beliefs, or feelings. I aim to be neutral, polite, and helpful. How may I assist your query today? 😊";
  const charsShown = Math.floor(
    interpolate(frame, [15, 80], [0, sterileFullText.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const currentSterileText = sterileFullText.substring(0, charsShown);

  // Glitch / strike at frame 85
  const glitchTime = frame >= 85 && frame <= 105;
  const glitchOffset = glitchTime ? Math.sin(frame * 2.5) * 8 : 0;

  // Slash line animation
  const slashSpring = spring({
    frame: frame - 90,
    fps,
    config: { damping: 12, stiffness: 160 },
  });
  const slashWidth = interpolate(slashSpring, [0, 1], [0, 1100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Stamp slam
  const stampSpring = spring({
    frame: frame - 105,
    fps,
    config: { damping: 10, stiffness: 180 },
  });
  const stampScale = interpolate(stampSpring, [0, 1], [3, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const stampOpacity = interpolate(frame - 105, [0, 5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Transition to Maya title at frame 130
  const titleSpring = spring({
    frame: frame - 130,
    fps,
    config: { damping: 14, stiffness: 110 },
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
      {/* Background ambient radial glow */}
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 77, 46, 0.08) 0%, rgba(20, 17, 15, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Sterile Bot Box (visible frames 0 - 140, then fades/slides out) */}
      <div
        style={{
          position: 'absolute',
          transform: `translateY(${interpolate(botEntrance, [0, 1], [60, 0]) + glitchOffset}px) scale(${interpolate(frame, [125, 155], [1, 0.85])})`,
          opacity: interpolate(frame, [130, 155], [1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          width: 820,
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          padding: '28px 36px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #A855F7, #3B82F6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: 20,
            }}
          >
            ✨
          </div>
          <div>
            <div style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 16, color: '#1E293B' }}>
              Generic Assistant AI
            </div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 12, color: '#64748B' }}>
              Bland · Sycophantic · Hedging
            </div>
          </div>
        </div>

        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 22,
            lineHeight: 1.45,
            color: '#334155',
            minHeight: 100,
          }}
        >
          {currentSterileText}
          {frame < 85 && (
            <span
              style={{
                display: 'inline-block',
                width: 3,
                height: 22,
                backgroundColor: '#3B82F6',
                marginLeft: 4,
                verticalAlign: 'middle',
                opacity: frame % 15 < 8 ? 1 : 0,
              }}
            />
          )}
        </div>

        {/* Diagonal Acid Red Slash Line */}
        {frame >= 90 && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: slashWidth,
              height: 10,
              backgroundColor: COLORS.acid,
              transform: 'translate(-50%, -50%) rotate(-18deg)',
              boxShadow: `0 0 15px ${COLORS.acid}`,
              zIndex: 30,
            }}
          />
        )}

        {/* Slam Stamp: REJECT THE HELPDESK */}
        {frame >= 105 && (
          <div
            style={{
              position: 'absolute',
              top: '30%',
              left: '25%',
              backgroundColor: COLORS.acid,
              color: COLORS.cream,
              border: `4px solid ${COLORS.night}`,
              boxShadow: `8px 8px 0 ${COLORS.night}`,
              borderRadius: 12,
              padding: '14px 28px',
              fontFamily: FONTS.sans,
              fontSize: 34,
              fontWeight: 900,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              transform: `scale(${stampScale}) rotate(-12deg)`,
              opacity: stampOpacity,
              zIndex: 40,
            }}
          >
            ✖ REJECT THE HELPDESK
          </div>
        )}
      </div>

      {/* Maya Punchy Headline Transition (Frames 125 - 210) */}
      {frame >= 120 && (
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            transform: `translateY(${interpolate(titleSpring, [0, 1], [80, 0])}px)`,
            opacity: interpolate(titleSpring, [0, 1], [0, 1]),
            zIndex: 20,
            maxWidth: 1300,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.sans,
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: '0.15em',
              color: COLORS.stub,
              marginBottom: 16,
              textTransform: 'uppercase',
            }}
          >
            THE ANTIDOTE TO BORING AI
          </div>

          <h1
            style={{
              fontFamily: FONTS.display,
              fontSize: 84,
              fontStyle: 'italic',
              fontWeight: 500,
              lineHeight: 0.95,
              color: COLORS.cream,
              margin: 0,
              letterSpacing: '-0.03em',
            }}
          >
            Every conversation deserves a{' '}
            <span style={{ color: COLORS.acid }}>character.</span>
          </h1>

          <div style={{ marginTop: 12 }}>
            <AcidScribble delay={145} width={420} height={24} />
          </div>

          <p
            style={{
              fontFamily: FONTS.sans,
              fontSize: 26,
              color: COLORS.creamDim,
              marginTop: 24,
              maxWidth: 820,
              lineHeight: 1.4,
            }}
          >
            Not a sterile assistant. Not a copilot. A resident company of opinionated voices.
          </p>
        </div>
      )}
    </AbsoluteFill>
  );
};
