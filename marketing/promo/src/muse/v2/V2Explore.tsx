import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { COLORS, FONTS } from '../constants/theme';
import { ChatShell } from './ChatShell';
import { Stamp } from './Chrome';
import { EXPLORE_ROWS } from './cast';
import { fadeIn, usePop, useRise } from './anim';

// Beat 4 — Explore. The marketplace bill inside the same window:
// five real category rows, twelve voices, coming-soon dimmed.
export const V2Explore: React.FC = () => {
  const frame = useCurrentFrame();
  const stampScale = usePop(frame, 34);

  return (
    <ChatShell
      wash={COLORS.stub}
      name="Explore"
      sub="agents on tonight"
      view="EXPLORE"
      caption="100s OF VOICES. FIVE WORLDS. ONE HOUSE."
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: '20px 70px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {/* Title + count stamp */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 30,
            opacity: fadeIn(frame, 8, 12),
          }}
        >
          <span
            style={{
              fontFamily: FONTS.display,
              fontStyle: 'italic',
              fontWeight: 600,
              fontSize: 46,
              color: COLORS.cream,
              letterSpacing: '-0.01em',
            }}
          >
            Agents on tonight.
          </span>
          {frame >= 32 ? (
            <Stamp
              text="100s OF IN-BUILT AGENTS"
              scale={stampScale}
              variant="stub"
              rotate={2}
              fontSize={26}
            />
          ) : null}
        </div>

        {/* Category rows */}
        {EXPLORE_ROWS.map((row, i) => {
          const start = 52 + i * 26;
          const o = fadeIn(frame, start, 12);
          const y = useRise(frame, start, 34);
          return (
            <div
              key={row.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 26,
                opacity: o,
                transform: `translateY(${y}px)`,
                borderTop: `1px solid ${COLORS.rule}`,
                paddingTop: 6,
              }}
            >
              <div style={{ width: 200, flexShrink: 0 }}>
                <div
                  style={{
                    fontFamily: FONTS.sans,
                    fontWeight: 900,
                    fontSize: 21,
                    letterSpacing: '0.06em',
                    color: COLORS.stub,
                  }}
                >
                  {row.label}
                </div>
                <div
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 13,
                    color: COLORS.inkSoft,
                    marginTop: 2,
                  }}
                >
                  {row.body}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 18 }}>
                {row.agents.map((a) => (
                  <div
                    key={a.name}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      opacity: a.soon ? 0.5 : 1,
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <Img
                        src={staticFile(a.avatar)}
                        style={{
                          width: 54,
                          height: 54,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: `2px solid ${a.soon ? COLORS.inkSoft : COLORS.cream}`,
                        }}
                      />
                      {a.soon ? (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: -8,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontFamily: FONTS.mono,
                            fontSize: 9,
                            letterSpacing: '0.1em',
                            backgroundColor: COLORS.acid,
                            color: COLORS.onAcid,
                            padding: '1px 7px',
                            borderRadius: 999,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          SOON
                        </span>
                      ) : null}
                    </div>
                    <span
                      style={{
                        fontFamily: FONTS.sans,
                        fontWeight: 700,
                        fontSize: 14,
                        color: COLORS.cream,
                      }}
                    >
                      {a.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Tease */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            opacity: fadeIn(frame, 300, 12),
          }}
        >
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 17,
              letterSpacing: '0.12em',
              color: COLORS.night,
              backgroundColor: COLORS.stub,
              padding: '8px 20px',
              borderRadius: 999,
              boxShadow: `4px 4px 0 ${COLORS.acid}`,
            }}
          >
            …AND ONE THAT&apos;S YOURS →
          </span>
        </div>
      </div>
    </ChatShell>
  );
};
