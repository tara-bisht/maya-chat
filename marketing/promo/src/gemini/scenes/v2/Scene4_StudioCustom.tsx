import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, FONTS } from '../../constants/theme';
import { DesktopWindow } from '../../components/DesktopWindow';
import { HardTicket } from '../../components/HardTicket';

export const Scene4_StudioCustom: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  // Slider animation
  const directness = interpolate(frame, [15, 65], [0, 95], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rigor = interpolate(frame, [30, 80], [0, 88], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const humor = interpolate(frame, [45, 95], [0, 45], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
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
      <DesktopWindow activeNav="studio">
        {/* Studio Workspace Content */}
        <div
          style={{
            flex: 1,
            padding: '30px 48px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontFamily: FONTS.sans,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.12em',
                color: COLORS.acid,
                textTransform: 'uppercase',
                marginBottom: 4,
              }}
            >
              STUDIO BUILDER
            </div>
            <h2
              style={{
                fontFamily: FONTS.display,
                fontSize: 38,
                fontStyle: 'italic',
                fontWeight: 600,
                color: COLORS.cream,
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Create custom agents as per your need.
            </h2>
          </div>

          {/* Builder Layout (Form Left, Preview/Features Right) */}
          <div
            style={{
              display: 'flex',
              gap: 36,
              alignItems: 'stretch',
              flex: 1,
              transform: `translateY(${interpolate(enterSpring, [0, 1], [30, 0])}px)`,
              opacity: interpolate(enterSpring, [0, 1], [0, 1]),
            }}
          >
            {/* Form Sheet Card */}
            <div
              style={{
                flex: 1.3,
                backgroundColor: COLORS.cream,
                borderRadius: 12,
                padding: '26px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                boxShadow: `8px 8px 0 ${COLORS.acid}`,
                color: COLORS.night,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `2px solid ${COLORS.night}`, paddingBottom: 10 }}>
                <span style={{ fontFamily: FONTS.display, fontStyle: 'italic', fontSize: 22, fontWeight: 700 }}>
                  Custom Character Sheet
                </span>
                <span style={{ fontFamily: FONTS.mono, fontSize: 12, fontWeight: 700, color: COLORS.acid }}>
                  STUDIO · CUSTOM
                </span>
              </div>

              {/* Name & Language Row */}
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1.2 }}>
                  <div style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', marginBottom: 4 }}>
                    AGENT NAME
                  </div>
                  <div style={{ backgroundColor: COLORS.creamDim, padding: '10px 14px', borderRadius: 6, fontFamily: FONTS.sans, fontSize: 16, fontWeight: 700 }}>
                    Chief of Staff Orion
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', marginBottom: 4 }}>
                    LANGUAGE
                  </div>
                  <div style={{ backgroundColor: COLORS.stub, padding: '10px 14px', borderRadius: 6, fontFamily: FONTS.sans, fontSize: 14, fontWeight: 800 }}>
                    Hinglish · हिंदी (Real Devanagari)
                  </div>
                </div>
              </div>

              {/* Tagline */}
              <div>
                <div style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', marginBottom: 4 }}>
                  BACKSTORY / SIGNATURE PHILOSOPHY
                </div>
                <div style={{ backgroundColor: COLORS.creamDim, padding: '10px 14px', borderRadius: 6, fontFamily: FONTS.sans, fontSize: 14, fontStyle: 'italic' }}>
                  "High leverage only. What's the ROI of your next 60 minutes?"
                </div>
              </div>

              {/* Tone Faders */}
              <div>
                <div style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', marginBottom: 8 }}>
                  TONE CALIBRATION
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {/* Directness */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, marginBottom: 2 }}>
                      <span>Directness / Bluntness</span>
                      <span>{Math.round(directness)}%</span>
                    </div>
                    <div style={{ width: '100%', height: 8, backgroundColor: COLORS.creamDim, borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${directness}%`, height: '100%', backgroundColor: COLORS.acid }} />
                    </div>
                  </div>

                  {/* Strategic Rigor */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, marginBottom: 2 }}>
                      <span>Strategic Rigor</span>
                      <span>{Math.round(rigor)}%</span>
                    </div>
                    <div style={{ width: '100%', height: 8, backgroundColor: COLORS.creamDim, borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${rigor}%`, height: '100%', backgroundColor: COLORS.stub }} />
                    </div>
                  </div>

                  {/* Humor */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, marginBottom: 2 }}>
                      <span>Humor / Irony</span>
                      <span>{Math.round(humor)}%</span>
                    </div>
                    <div style={{ width: '100%', height: 8, backgroundColor: COLORS.creamDim, borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${humor}%`, height: '100%', backgroundColor: '#64748B' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Value Proposition Cards */}
            <div style={{ flex: 0.9, display: 'flex', flexDirection: 'column', gap: 18, justifyContent: 'center' }}>
              <HardTicket variant="stub" shadowOffset={6} rotation={1.2}>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>
                  TAILORED TO YOUR WORKFLOW
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.45 }}>
                  Build custom agents for specific projects, coding reviews, language practice, or strategic planning.
                </div>
              </HardTicket>

              <HardTicket variant="acid" shadowOffset={6} rotation={-1}>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>
                  PUBLIC OR PRIVATE
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.45 }}>
                  Keep your custom backstories private to you, or publish to the House gallery for others to enjoy.
                </div>
              </HardTicket>

              <div
                style={{
                  backgroundColor: '#1E1A17',
                  border: `1px solid ${COLORS.rule}`,
                  borderRadius: 10,
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.creamDim }}>
                  ✓ Instant activation in chat
                </span>
                <span style={{ backgroundColor: COLORS.acid, color: COLORS.onAcid, padding: '6px 14px', borderRadius: 6, fontWeight: 800, fontSize: 12 }}>
                  SAVE AGENT
                </span>
              </div>
            </div>
          </div>
        </div>
      </DesktopWindow>
    </AbsoluteFill>
  );
};
