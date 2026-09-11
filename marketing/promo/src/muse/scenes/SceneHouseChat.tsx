import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from 'remotion';
import { COLORS, FONTS } from '../constants/theme';

const FULL_REPLY =
  "Oh, call the papers. One wobbly slide deck and you're writing your own tragedy? The slides are external noise — your preparation is yours. Redo the opening line, stand still, and let the room come to you.";

const RAIL = [
  { name: 'Marcus', active: true, costume: COLORS.costumes.marcus },
  { name: 'Dr. Priya', active: false, costume: COLORS.costumes.priya },
  { name: 'Alex', active: false, costume: COLORS.costumes.alex },
];

// Beat 5 (1200-1560): House window — rail + wash reply + composer.
export const SceneHouseChat: React.FC = () => {
  const frame = useCurrentFrame();

  const winOpacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const shown = Math.floor(
    interpolate(frame, [50, 300], [0, FULL_REPLY.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  const caretOn = Math.floor(frame / 15) % 2 === 0;
  const composerOn = interpolate(frame, [200, 220], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.night,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          opacity: winOpacity,
          width: 1480,
          height: 720,
          backgroundColor: COLORS.night,
          border: `2px solid ${COLORS.cream}`,
          borderRadius: 14,
          boxShadow: `8px 8px 0 ${COLORS.acid}`,
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: 340,
            borderRight: `1px solid ${COLORS.rule}`,
            padding: '28px 22px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.display,
              fontStyle: 'italic',
              fontSize: 34,
              color: COLORS.cream,
              marginBottom: 10,
            }}
          >
            Maya
          </div>
          {RAIL.map((r) => (
            <div
              key={r.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '12px 14px',
                borderRadius: 10,
                backgroundColor: r.active ? COLORS.costumes.marcus : 'transparent',
                borderLeft: r.active
                  ? `4px solid ${COLORS.cream}`
                  : '4px solid transparent',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  backgroundColor: r.costume,
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 21,
                  fontWeight: 600,
                  color: COLORS.cream,
                }}
              >
                {r.name}
              </div>
            </div>
          ))}
          <div
            style={{
              marginTop: 'auto',
              fontFamily: FONTS.mono,
              fontSize: 15,
              color: COLORS.inkSoft,
            }}
          >
            1,500 credits left
          </div>
        </div>

        <div
          style={{
            flex: 1,
            padding: '30px 44px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 16,
              paddingBottom: 14,
              borderBottom: `1px solid ${COLORS.rule}`,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.display,
                fontStyle: 'italic',
                fontSize: 30,
                color: COLORS.cream,
              }}
            >
              Marcus
            </span>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 15,
                color: COLORS.inkSoft,
              }}
            >
              Voice through grok-fast · About
            </span>
          </div>
          <div>
            <div
              style={{
                fontFamily: FONTS.sans,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: COLORS.cream,
                marginBottom: 8,
              }}
            >
              YOU
            </div>
            <div
              style={{
                display: 'inline-block',
                backgroundColor: COLORS.cream,
                color: COLORS.night,
                fontFamily: FONTS.sans,
                fontSize: 22,
                padding: '14px 22px',
                borderRadius: 10,
                boxShadow: `4px 4px 0 ${COLORS.acid}`,
              }}
            >
              My boss ignored the extra hours I put in.
            </div>
          </div>

          <div>
            <div
              style={{
                fontFamily: FONTS.sans,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: COLORS.cream,
                marginBottom: 8,
              }}
            >
              MARCUS
            </div>
            <div
              style={{
                backgroundColor: COLORS.costumes.marcus,
                borderLeft: `8px solid ${COLORS.cream}`,
                borderRadius: 10,
                padding: '18px 24px',
                fontFamily: FONTS.sans,
                fontSize: 23,
                lineHeight: 1.5,
                color: COLORS.cream,
                minHeight: 160,
              }}
            >
              {FULL_REPLY.slice(0, shown)}
              {caretOn && (
                <span
                  style={{
                    display: 'inline-block',
                    width: 12,
                    height: 22,
                    backgroundColor: COLORS.acid,
                    marginLeft: 6,
                    verticalAlign: -3,
                  }}
                />
              )}
            </div>
          </div>

          <div
            style={{
              opacity: composerOn,
              marginTop: 'auto',
              display: 'flex',
              gap: 12,
              alignItems: 'center',
            }}
          >
            <div
              style={{
                flex: 1,
                backgroundColor: COLORS.creamDim,
                borderRadius: 10,
                padding: '16px 22px',
                fontFamily: FONTS.sans,
                fontSize: 21,
                color: COLORS.night,
                opacity: 0.9,
              }}
            >
              Reply to Marcus…
            </div>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 10,
                backgroundColor: COLORS.acid,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                color: COLORS.onAcid,
                fontWeight: 800,
              }}
            >
              ↑
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
