import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONTS } from '../constants/theme';
import { HardTicket } from '../components/HardTicket';
import { ChatShell } from './ChatShell';
import { CUSTOM_COSTUME } from './cast';
import { fadeIn, typeChars, usePop, useRise } from './anim';

const TRAITS = ['Stoic', 'Roasts gently', 'Hockey-mad'];
const SWATCHES = [
  COLORS.costumes.marcus,
  COLORS.costumes.priya,
  COLORS.acid,
  CUSTOM_COSTUME,
];

// Beat 5 — Studio. A custom agent gets built live: name types in,
// trait chips pop, swatch picks, CREATE slams, its playbill docks.
export const V2Studio: React.FC = () => {
  const frame = useCurrentFrame();
  const name = typeChars(frame, 22, 'Midnight Mentor', 22);
  const createScale = usePop(frame, 162);
  const billRise = useRise(frame, 188, 120);

  return (
    <ChatShell
      wash={COLORS.acid}
      name="Studio"
      sub="write yours in minutes"
      view="STUDIO"
      caption="…AND ONE THAT'S YOURS."
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: '30px 80px',
          display: 'flex',
          gap: 70,
        }}
      >
        {/* Form column */}
        <div
          style={{
            flex: 1.1,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            opacity: fadeIn(frame, 8, 12),
          }}
        >
          <div
            style={{
              fontFamily: FONTS.display,
              fontStyle: 'italic',
              fontWeight: 600,
              fontSize: 56,
              color: COLORS.cream,
            }}
          >
            Build your own.
          </div>

          {/* Name field */}
          <div>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 14,
                letterSpacing: '0.2em',
                color: COLORS.inkSoft,
                marginBottom: 8,
              }}
            >
              NAME
            </div>
            <div
              style={{
                fontFamily: FONTS.sans,
                fontWeight: 700,
                fontSize: 34,
                color: COLORS.cream,
                backgroundColor: COLORS.codeWell,
                border: `2px solid ${COLORS.rule}`,
                borderRadius: 12,
                padding: '14px 22px',
                minHeight: 76,
              }}
            >
              {name}
              {frame >= 22 && name.length < 15 ? (
                <span style={{ opacity: 0.7 }}>▍</span>
              ) : (
                ''
              )}
            </div>
          </div>

          {/* Traits */}
          <div>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 14,
                letterSpacing: '0.2em',
                color: COLORS.inkSoft,
                marginBottom: 8,
              }}
            >
              PERSONALITY
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {TRAITS.map((t, i) => {
                const s = usePop(frame, 82 + i * 20);
                return (
                  <span
                    key={t}
                    style={{
                      transform: `scale(${Math.max(0.01, s)})`,
                      fontFamily: FONTS.sans,
                      fontWeight: 800,
                      fontSize: 20,
                      color: COLORS.night,
                      backgroundColor: COLORS.cream,
                      padding: '10px 20px',
                      borderRadius: 999,
                      boxShadow: `4px 4px 0 ${COLORS.acid}`,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Swatches + create */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              {SWATCHES.map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    backgroundColor: c,
                    border:
                      i === 3
                        ? `4px solid ${COLORS.cream}`
                        : '2px solid rgba(246,239,228,0.4)',
                    boxShadow:
                      i === 3 ? `0 0 0 3px ${COLORS.acid}` : 'none',
                    opacity: fadeIn(frame, 138 + i * 6, 8),
                  }}
                />
              ))}
            </div>
            {frame >= 160 ? (
              <div
                style={{
                  transform: `scale(${Math.max(0.01, createScale)}) rotate(-2deg)`,
                  fontFamily: FONTS.sans,
                  fontWeight: 900,
                  fontSize: 28,
                  letterSpacing: '0.04em',
                  backgroundColor: COLORS.acid,
                  color: COLORS.onAcid,
                  padding: '14px 40px',
                  borderRadius: 12,
                  boxShadow: `6px 6px 0 ${COLORS.cream}`,
                }}
              >
                CREATE →
              </div>
            ) : null}
          </div>
        </div>

        {/* Live playbill preview */}
        <div
          style={{
            flex: 0.9,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {frame >= 186 ? (
            <div
              style={{
                transform: `translateY(${billRise}px) rotate(2.5deg)`,
                width: 380,
              }}
            >
              <HardTicket variant="stub" shadowOffset={10} rotation={0}>
                <div
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 14,
                    letterSpacing: '0.2em',
                    opacity: 0.7,
                  }}
                >
                  YOUR AGENT · JUST MINTED
                </div>
                <div
                  style={{
                    fontFamily: FONTS.display,
                    fontStyle: 'italic',
                    fontWeight: 600,
                    fontSize: 52,
                    lineHeight: 1.05,
                    margin: '8px 0',
                  }}
                >
                  Midnight Mentor
                </div>
                <div
                  style={{
                    fontFamily: FONTS.sans,
                    fontWeight: 700,
                    fontSize: 19,
                  }}
                >
                  Stoic · Roasts gently · Hockey-mad
                </div>
                <div
                  style={{
                    marginTop: 14,
                    display: 'inline-block',
                    fontFamily: FONTS.mono,
                    fontSize: 15,
                    letterSpacing: '0.12em',
                    backgroundColor: COLORS.night,
                    color: COLORS.stub,
                    padding: '8px 18px',
                    borderRadius: 999,
                    opacity: interpolate(frame, [205, 220], [0, 1], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    }),
                  }}
                >
                  ✓ LIVE IN YOUR RAIL
                </div>
              </HardTicket>
            </div>
          ) : (
            <div
              style={{
                width: 380,
                height: 420,
                border: `3px dashed ${COLORS.rule}`,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONTS.mono,
                fontSize: 18,
                letterSpacing: '0.18em',
                color: COLORS.inkSoft,
                opacity: fadeIn(frame, 8, 12),
              }}
            >
              YOUR AGENT
            </div>
          )}
        </div>
      </div>
    </ChatShell>
  );
};
