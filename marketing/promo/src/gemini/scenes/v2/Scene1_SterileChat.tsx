import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, FONTS } from '../../constants/theme';

export const Scene1_SterileChat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance
  const winSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  // Typewriter effect for bland reply
  const sterileText =
    "That is completely valid! Launching is stressful. Here are 5 tips: 1. Take a deep breath. 2. Make a prioritized to-do list. 3. Be gentle with yourself. You've got this! 😊";
  const chars = Math.floor(
    interpolate(frame, [25, 95], [0, sterileText.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  // Glitch before transition (frames 105 - 150)
  const isGlitch = frame >= 105;
  const glitchX = isGlitch ? Math.sin(frame * 3) * 10 : 0;

  // Stamp slam at frame 115
  const stampSpring = spring({
    frame: frame - 115,
    fps,
    config: { damping: 10, stiffness: 200 },
  });
  const stampScale = interpolate(stampSpring, [0, 1], [3.5, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0F172A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Sterile Desktop Window Frame */}
      <div
        style={{
          width: 1550,
          height: 880,
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transform: `translateY(${interpolate(winSpring, [0, 1], [60, 0])}px) translateX(${glitchX}px)`,
          filter: isGlitch ? 'contrast(130%) hue-rotate(20deg)' : 'none',
        }}
      >
        {/* Sterile Titlebar */}
        <div
          style={{
            height: 48,
            backgroundColor: '#F1F5F9',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            gap: 12,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#CBD5E1' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#CBD5E1' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#CBD5E1' }} />
          <span style={{ fontFamily: FONTS.sans, fontSize: 13, color: '#64748B', marginLeft: 10 }}>
            Generic AI Assistant — Standard Helpdesk
          </span>
        </div>

        {/* Sterile Chat Well */}
        <div
          style={{
            flex: 1,
            padding: '40px 60px',
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
            backgroundColor: '#F8FAFC',
          }}
        >
          {/* User Message */}
          <div style={{ alignSelf: 'flex-end', maxWidth: 750 }}>
            <div style={{ fontFamily: FONTS.sans, fontSize: 12, color: '#64748B', marginBottom: 4, textAlign: 'right' }}>
              You · 23:42
            </div>
            <div
              style={{
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                padding: '16px 22px',
                borderRadius: '18px 18px 4px 18px',
                fontFamily: FONTS.sans,
                fontSize: 19,
                lineHeight: 1.45,
              }}
            >
              I have 3 hours to launch, but I'm overwhelmed and procrastinating. What do I do?
            </div>
          </div>

          {/* Assistant Message */}
          <div style={{ alignSelf: 'flex-start', maxWidth: 820 }}>
            <div style={{ fontFamily: FONTS.sans, fontSize: 12, color: '#64748B', marginBottom: 4 }}>
              Generic Assistant AI ✨
            </div>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: '#1E293B',
                padding: '18px 24px',
                borderRadius: '18px 18px 18px 4px',
                fontFamily: FONTS.sans,
                fontSize: 19,
                lineHeight: 1.5,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}
            >
              {sterileText.substring(0, chars)}
              {chars < sterileText.length && (
                <span style={{ display: 'inline-block', width: 3, height: 18, backgroundColor: '#2563EB', marginLeft: 4 }} />
              )}
            </div>
          </div>
        </div>

        {/* Slam Stamp at frame 115 */}
        {frame >= 115 && (
          <div
            style={{
              position: 'absolute',
              top: '40%',
              left: '28%',
              backgroundColor: COLORS.acid,
              color: COLORS.cream,
              border: `5px solid ${COLORS.night}`,
              boxShadow: `10px 10px 0 ${COLORS.night}`,
              borderRadius: 14,
              padding: '18px 36px',
              fontFamily: FONTS.sans,
              fontSize: 38,
              fontWeight: 900,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              transform: `scale(${stampScale}) rotate(-8deg)`,
              zIndex: 50,
            }}
          >
            TIRED OF GENERIC ADVICE?
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
