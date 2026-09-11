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

const PLANS = [
  { name: 'Free', price: '$0', line: 'Marcus + Dr. Priya. Daily credits.', cta: 'Get started', acid: true },
  { name: 'Plus', price: '$9/mo', line: 'All eight voices. Memory on.', cta: 'See plans', acid: false },
  { name: 'Pro', price: '$19/mo', line: 'Every model. Biggest allowance.', cta: 'See plans', acid: false },
];

// Beat 6 (1560-1800): plans + closing band.
export const SceneSeats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.night,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 34,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontWeight: 600,
          fontSize: 92,
          color: COLORS.cream,
        }}
      >
        The house is open.
      </div>

      <div style={{ display: 'flex', gap: 36 }}>
        {PLANS.map((p, i) => {
          const delay = 20 + i * 16;
          const s = spring({
            frame: frame - delay,
            fps,
            config: { damping: 16, stiffness: 120 },
          });
          const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const y = interpolate(s, [0, 1], [50, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={p.name}
              style={{ opacity, transform: `translateY(${y}px)` }}
            >
              <HardTicket
                shadowOffset={8}
                style={{ width: 380, padding: '28px 30px' }}
              >
                <div
                  style={{
                    fontFamily: FONTS.display,
                    fontStyle: 'italic',
                    fontSize: 44,
                    marginBottom: 4,
                  }}
                >
                  {p.name}
                </div>
                <div
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 20,
                    marginBottom: 12,
                    opacity: 0.75,
                  }}
                >
                  {p.price}
                </div>
                <div
                  style={{
                    fontFamily: FONTS.sans,
                    fontSize: 20,
                    lineHeight: 1.4,
                    marginBottom: 20,
                  }}
                >
                  {p.line}
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: p.acid ? COLORS.acid : 'transparent',
                    color: p.acid ? COLORS.onAcid : COLORS.night,
                    border: p.acid ? 'none' : `2px solid ${COLORS.night}`,
                    fontFamily: FONTS.sans,
                    fontSize: 20,
                    fontWeight: 600,
                    padding: '12px 28px',
                    borderRadius: 10,
                    boxShadow: p.acid ? `4px 4px 0 ${COLORS.cream}` : 'none',
                  }}
                >
                  {p.cta}
                </div>
              </HardTicket>
            </div>
          );
        })}
      </div>

      <div style={{ opacity: interpolate(frame, [120, 140], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }) }}>
        <HardTicket
          variant="stub"
          shadowOffset={6}
          style={{ padding: '14px 30px' }}
        >
          <span style={{ fontFamily: FONTS.sans, fontSize: 21, fontWeight: 600 }}>
            Opinionated AI — yours, or one we already wrote. Not a helpdesk.
            Not a copilot.
          </span>
        </HardTicket>
      </div>
    </AbsoluteFill>
  );
};
