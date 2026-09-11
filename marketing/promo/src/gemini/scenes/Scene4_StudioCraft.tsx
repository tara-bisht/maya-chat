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

export const Scene4_StudioCraft: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const sheetSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Slider animation (frames 40 - 120)
  const directnessProgress = interpolate(frame, [30, 90], [0, 92], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const warmthProgress = interpolate(frame, [45, 105], [0, 30], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const humorProgress = interpolate(frame, [60, 120], [0, 80], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Color selection animation
  const selectedCostumeIndex = frame > 80 ? 3 : frame > 50 ? 1 : 0;
  const swatches = [
    { name: 'Moss', color: COLORS.costumes.marcus },
    { name: 'Magenta', color: COLORS.costumes.priya },
    { name: 'Espresso', color: COLORS.costumes.alex },
    { name: 'Pine', color: COLORS.costumes.meera },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.night,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 80px',
        overflow: 'hidden',
      }}
    >
      {/* Background accents */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle at 80% 20%, rgba(214, 242, 92, 0.07) 0%, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 30,
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: COLORS.acid,
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          STUDIO CREATION SUITE
        </div>
        <h2
          style={{
            fontFamily: FONTS.display,
            fontSize: 48,
            fontStyle: 'italic',
            fontWeight: 600,
            color: COLORS.cream,
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          Write your own resident player.
        </h2>
      </div>

      {/* Main Studio Sheet & Callout Row */}
      <div
        style={{
          display: 'flex',
          gap: 60,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 1450,
          zIndex: 20,
        }}
      >
        {/* Studio Character Sheet (Left/Center) */}
        <div
          style={{
            width: 780,
            backgroundColor: COLORS.cream,
            borderRadius: 14,
            padding: '32px 38px',
            boxShadow: `10px 10px 0 ${COLORS.acid}`,
            transform: `translateY(${interpolate(sheetSpring, [0, 1], [60, 0])}px) rotate(-1deg)`,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            boxSizing: 'border-box',
          }}
        >
          {/* Top Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: `2px solid ${COLORS.night}`, paddingBottom: 12 }}>
            <span style={{ fontFamily: FONTS.display, fontStyle: 'italic', fontSize: 26, fontWeight: 700, color: COLORS.night }}>
              Character Sheet
            </span>
            <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.rule, fontWeight: 600 }}>
              STUDIO · DRAFT_01
            </span>
          </div>

          {/* Form Fields Grid */}
          <div style={{ display: 'flex', gap: 20 }}>
            {/* Name */}
            <div style={{ flex: 1.2 }}>
              <div style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', color: COLORS.night, marginBottom: 4 }}>
                AGENT NAME
              </div>
              <div style={{ backgroundColor: COLORS.creamDim, padding: '10px 14px', borderRadius: 8, fontFamily: FONTS.sans, fontSize: 17, fontWeight: 600, color: COLORS.night }}>
                Inspector Vane
              </div>
            </div>

            {/* Language */}
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', color: COLORS.night, marginBottom: 4 }}>
                LANGUAGE PRESET
              </div>
              <div style={{ backgroundColor: COLORS.stub, padding: '10px 14px', borderRadius: 8, fontFamily: FONTS.sans, fontSize: 15, fontWeight: 800, color: COLORS.onStub }}>
                Hinglish · हिंदी (Real Devanagari)
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', color: COLORS.night, marginBottom: 4 }}>
              SIGNATURE TAGLINE
            </div>
            <div style={{ backgroundColor: COLORS.creamDim, padding: '10px 14px', borderRadius: 8, fontFamily: FONTS.sans, fontSize: 15, color: COLORS.night, fontStyle: 'italic' }}>
              "Don't bring me buzzwords. Bring me the receipts and unit economics."
            </div>
          </div>

          {/* Tone Faders */}
          <div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', color: COLORS.night, marginBottom: 8 }}>
              TONE CALIBRATION SLIDERS
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Directness */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, color: COLORS.night, marginBottom: 3 }}>
                  <span>Directness / Bluntness</span>
                  <span>{Math.round(directnessProgress)}%</span>
                </div>
                <div style={{ width: '100%', height: 10, backgroundColor: COLORS.creamDim, borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{ width: `${directnessProgress}%`, height: '100%', backgroundColor: COLORS.acid }} />
                </div>
              </div>

              {/* Warmth */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, color: COLORS.night, marginBottom: 3 }}>
                  <span>Warmth / Politeness</span>
                  <span>{Math.round(warmthProgress)}%</span>
                </div>
                <div style={{ width: '100%', height: 10, backgroundColor: COLORS.creamDim, borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{ width: `${warmthProgress}%`, height: '100%', backgroundColor: '#64748B' }} />
                </div>
              </div>

              {/* Humor */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, color: COLORS.night, marginBottom: 3 }}>
                  <span>Witty Irony & Humor</span>
                  <span>{Math.round(humorProgress)}%</span>
                </div>
                <div style={{ width: '100%', height: 10, backgroundColor: COLORS.creamDim, borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{ width: `${humorProgress}%`, height: '100%', backgroundColor: COLORS.stub }} />
                </div>
              </div>
            </div>
          </div>

          {/* Costume Flood Picker */}
          <div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', color: COLORS.night, marginBottom: 8 }}>
              COSTUME FLOOD SWATCH
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              {swatches.map((swatch, idx) => (
                <div
                  key={swatch.name}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 8,
                    backgroundColor: swatch.color,
                    border: idx === selectedCostumeIndex ? `3px solid ${COLORS.night}` : '2px solid transparent',
                    boxShadow: idx === selectedCostumeIndex ? `3px 3px 0 ${COLORS.acid}` : 'none',
                    transform: idx === selectedCostumeIndex ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.15s ease',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Callout Stack */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            maxWidth: 420,
          }}
        >
          <HardTicket variant="stub" shadowOffset={6} rotation={1.5}>
            <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>
              TRUE PERSONALITY CONTROL
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.45 }}>
              Tune backstory, tone sliders, tools, and language nuances. Not another generic prompt box.
            </div>
          </HardTicket>

          <HardTicket variant="cream" shadowOffset={6} rotation={-1}>
            <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>
              FIRST-CLASS MULTILINGUAL
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.45 }}>
              Native Devanagari Hindi & colloquial Hinglish built directly into the prompt compiler.
            </div>
          </HardTicket>
        </div>
      </div>
    </AbsoluteFill>
  );
};
