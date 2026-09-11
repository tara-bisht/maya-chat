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

export const Scene5_EngineMemory: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  // Cycling models animation
  const models = ['grok-fast', 'claude-3.7-sonnet', 'llama-3.3-70b', 'deepseek-r1'];
  const activeModelIndex = Math.floor((frame / 35) % models.length);

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
      {/* Background ambient elements */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 77, 46, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 45,
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: COLORS.stub,
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          ENGINEERED FOR DEPTH
        </div>
        <h2
          style={{
            fontFamily: FONTS.display,
            fontSize: 52,
            fontStyle: 'italic',
            fontWeight: 600,
            color: COLORS.cream,
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          Private Memory. Frontier Brains.
        </h2>
      </div>

      {/* Two High-Power Feature Pillars */}
      <div
        style={{
          display: 'flex',
          gap: 50,
          width: '100%',
          maxWidth: 1350,
          justifyContent: 'center',
          alignItems: 'stretch',
          zIndex: 20,
          transform: `translateY(${interpolate(enterSpring, [0, 1], [60, 0])}px)`,
        }}
      >
        {/* Left Feature: Episodic Memory */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#191512',
            border: `2px solid ${COLORS.rule}`,
            borderRadius: 14,
            padding: '36px 36px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            boxShadow: `6px 6px 0 ${COLORS.cream}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                backgroundColor: COLORS.stub,
                color: COLORS.onStub,
                fontFamily: FONTS.sans,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.08em',
                padding: '4px 8px',
                borderRadius: 4,
              }}
            >
              EPISODIC
            </span>
            <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.inkSoft }}>
              ISOLATED MEMORY VECTORS
            </span>
          </div>

          <h3
            style={{
              fontFamily: FONTS.display,
              fontSize: 32,
              fontStyle: 'italic',
              color: COLORS.cream,
              margin: '6px 0',
            }}
          >
            They remember you.
          </h3>

          <p style={{ fontFamily: FONTS.sans, fontSize: 18, lineHeight: 1.5, color: COLORS.creamDim }}>
            Each agent maintains private memory. One character never leaks or hears what you told another. Continuity that deepens with every conversation.
          </p>

          <div
            style={{
              marginTop: 'auto',
              backgroundColor: COLORS.night,
              border: `1px solid ${COLORS.rule}`,
              borderRadius: 8,
              padding: '12px 18px',
              fontFamily: FONTS.mono,
              fontSize: 13,
              color: COLORS.stub,
            }}
          >
            ✓ User bio & episodic context bound per-agent
          </div>
        </div>

        {/* Right Feature: Model Voice Engine */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#191512',
            border: `2px solid ${COLORS.rule}`,
            borderRadius: 14,
            padding: '36px 36px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            boxShadow: `6px 6px 0 ${COLORS.acid}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                backgroundColor: COLORS.acid,
                color: COLORS.onAcid,
                fontFamily: FONTS.sans,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.08em',
                padding: '4px 8px',
                borderRadius: 4,
              }}
            >
              MODELS
            </span>
            <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.inkSoft }}>
              OPENROUTER GATEWAY
            </span>
          </div>

          <h3
            style={{
              fontFamily: FONTS.display,
              fontSize: 32,
              fontStyle: 'italic',
              color: COLORS.cream,
              margin: '6px 0',
            }}
          >
            Choose their engine.
          </h3>

          <p style={{ fontFamily: FONTS.sans, fontSize: 18, lineHeight: 1.5, color: COLORS.creamDim }}>
            "The model is the instrument, not the character." Power Marcus or Alex through your preferred model without breaking their persona.
          </p>

          <div
            style={{
              marginTop: 'auto',
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            {models.map((mod, i) => (
              <div
                key={mod}
                style={{
                  backgroundColor: i === activeModelIndex ? COLORS.cream : COLORS.codeWell,
                  color: i === activeModelIndex ? COLORS.night : COLORS.inkSoft,
                  fontFamily: FONTS.mono,
                  fontSize: 14,
                  fontWeight: 600,
                  padding: '8px 14px',
                  borderRadius: 6,
                  border: `1px solid ${i === activeModelIndex ? COLORS.acid : COLORS.rule}`,
                  boxShadow: i === activeModelIndex ? `3px 3px 0 ${COLORS.acid}` : 'none',
                }}
              >
                {mod}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
