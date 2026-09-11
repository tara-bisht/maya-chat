import React from 'react';
import { Img, interpolate, staticFile } from 'remotion';
import { COLORS, FONTS } from '../constants/theme';
import { characterById } from './cast';

interface AgentRailProps {
  ids: string[];
  activeId: string | null;
  // 0 = docked off-screen right, 1 = fully in.
  slide: number;
  highlightAt?: number;
  style?: React.CSSProperties;
}

// Personality rail: avatar chips docked at the window's right edge.
export const AgentRail: React.FC<AgentRailProps> = ({
  ids,
  activeId,
  slide,
  highlightAt,
  style,
}) => {
  const x = interpolate(slide, [0, 1], [340, 0]);
  return (
    <div
      style={{
        position: 'absolute',
        top: 24,
        right: 24,
        transform: `translateX(${x}px)`,
        width: 300,
        backgroundColor: COLORS.codeWell,
        border: `2px solid ${COLORS.rule}`,
        borderRadius: 16,
        padding: '16px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        boxShadow: '8px 8px 0 rgba(0,0,0,0.45)',
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 13,
          letterSpacing: '0.2em',
          color: COLORS.inkSoft,
          padding: '0 6px 4px',
        }}
      >
        PICK A VOICE
      </div>
      {ids.map((id) => {
        const c = characterById(id);
        const active = id === activeId;
        return (
          <div
            key={id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '8px 10px',
              borderRadius: 12,
              backgroundColor: active ? COLORS.costumes[c.costume] : 'transparent',
              border: active
                ? `2px solid ${COLORS.cream}`
                : '2px solid transparent',
              boxShadow:
                highlightAt !== undefined && active
                  ? `0 0 0 3px ${COLORS.acid}`
                  : 'none',
            }}
          >
            <Img
              src={staticFile(c.avatar)}
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                objectFit: 'cover',
                border: `2px solid ${COLORS.cream}`,
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: FONTS.sans,
                  fontWeight: 800,
                  fontSize: 17,
                  color: COLORS.cream,
                }}
              >
                {c.shortName}
              </span>
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  color: active ? COLORS.cream : COLORS.inkSoft,
                }}
              >
                {c.category}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface StampProps {
  text: string;
  scale: number;
  variant?: 'acid' | 'stub' | 'cream';
  rotate?: number;
  fontSize?: number;
}

// Slam-in rotated stamp label.
export const Stamp: React.FC<StampProps> = ({
  text,
  scale,
  variant = 'acid',
  rotate = -8,
  fontSize = 54,
}) => {
  const bg =
    variant === 'acid'
      ? COLORS.acid
      : variant === 'stub'
        ? COLORS.stub
        : COLORS.cream;
  const fg = variant === 'cream' ? COLORS.night : COLORS.onAcid;
  return (
    <div
      style={{
        transform: `rotate(${rotate}deg) scale(${Math.max(0.01, scale)})`,
        backgroundColor: bg,
        color: fg,
        fontFamily: FONTS.sans,
        fontWeight: 900,
        fontSize,
        letterSpacing: '0.02em',
        padding: '14px 34px',
        borderRadius: 8,
        border: `3px solid ${COLORS.night}`,
        boxShadow: `8px 8px 0 ${COLORS.night}`,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

interface CursorProps {
  x: number;
  y: number;
  opacity?: number;
}

// Acid cursor dot for the "tap" moment.
export const Cursor: React.FC<CursorProps> = ({ x, y, opacity = 1 }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 34,
      height: 34,
      borderRadius: '50%',
      backgroundColor: COLORS.acid,
      border: `4px solid ${COLORS.cream}`,
      boxShadow: '0 0 0 6px rgba(255,77,46,0.35)',
      opacity,
    }}
  />
);
