import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Kicker} from '../components/Kicker';
import {Stamp} from '../components/Stamp';
import {Wordmark} from '../components/Wordmark';
import {COMPANY} from '../company';
import {STUDIO, HOUSE_OPEN} from '../copy';
import {colors, radii} from '../theme';
import {fontDisplay, fontSans} from '../fonts';
import {clampInterp, fadeInOut, paperSlap} from '../motion';

export const Finale: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = fadeInOut(frame, durationInFrames, 10, 18);
  const studioOpacity = clampInterp(frame, [0, 12, 148, 168], [0, 1, 1, 0]);
  const ctaOpacity = clampInterp(frame, [156, 176], [0, 1]);
  const sheet = paperSlap(frame, fps, 6);
  const ticket = paperSlap(frame, fps, 164);

  return (
    <AbsoluteFill style={{opacity, padding: '64px 96px'}}>
      <div style={{position: 'absolute', inset: 0, opacity: studioOpacity, padding: '64px 96px'}}>
        <div style={{opacity: Math.min(1, sheet), transform: `translateY(${(1 - sheet) * 18}px)`}}>
          <Kicker kicker={STUDIO.kicker} title={STUDIO.title} />
        </div>
        <div
          style={{
            marginTop: 36,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 22,
          }}
        >
          {STUDIO.fields.map((field, index) => {
            const enter = paperSlap(frame, fps, 16 + index * 8);
            const fill = interpolate(frame, [28 + index * 10, 52 + index * 10], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <div
                key={field.label}
                style={{
                  backgroundColor: colors.creamDim,
                  color: colors.night,
                  borderRadius: radii.md,
                  padding: '22px 24px',
                  transform: `translateY(${(1 - enter) * 24}px)`,
                  opacity: Math.min(1, enter),
                  boxShadow: `4px 4px 0 ${colors.night}`,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontFamily: fontSans,
                    fontSize: 13,
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    opacity: 0.55,
                  }}
                >
                  {field.label}
                </p>
                <p
                  style={{
                    margin: '10px 0 0',
                    fontFamily: fontSans,
                    fontSize: 28,
                    fontWeight: 600,
                    opacity: 0.35 + fill * 0.65,
                  }}
                >
                  {field.value}
                </p>
              </div>
            );
          })}
        </div>
        <div style={{marginTop: 28, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap'}}>
          <Stamp label="Free: 3 public" tone="free" rotate={-5} />
          <Stamp label="Plus: 10" tone="plus" rotate={6} />
          <Stamp label="Pro: unlimited" tone="stub" rotate={-3} />
        </div>
        <div style={{marginTop: 36, display: 'flex', alignItems: 'center', gap: 14}}>
          <p
            style={{
              margin: 0,
              fontFamily: fontSans,
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: colors.inkSoft,
            }}
          >
            Costume
          </p>
          {COMPANY.map((player, index) => {
            const enter = paperSlap(frame, fps, 40 + index * 3);
            return (
              <div
                key={player.id}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: radii.md,
                  backgroundColor: player.color,
                  boxShadow: index === 0 ? `3px 3px 0 ${colors.cream}` : `3px 3px 0 ${colors.night}`,
                  outline: index === 0 ? `2px solid ${colors.cream}` : 'none',
                  outlineOffset: 3,
                  transform: `scale(${0.7 + enter * 0.3}) rotate(${player.tilt}deg)`,
                  opacity: Math.min(1, enter),
                }}
              />
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: ctaOpacity,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 980,
            backgroundColor: colors.cream,
            color: colors.night,
            borderRadius: radii.lg,
            padding: '56px 64px 48px',
            boxShadow: `10px 10px 0 ${colors.acid}`,
            transform: `translateY(${(1 - ticket) * 40}px) rotate(-1.2deg) scale(${0.92 + ticket * 0.08})`,
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: fontSans,
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: colors.acid,
            }}
          >
            {HOUSE_OPEN.kicker}
          </p>
          <h2
            style={{
              margin: '14px 0 0',
              fontFamily: fontDisplay,
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 92,
              lineHeight: 0.94,
              letterSpacing: '-0.04em',
            }}
          >
            {HOUSE_OPEN.title}
          </h2>
          <p
            style={{
              margin: '22px 0 0',
              fontFamily: fontSans,
              fontSize: 28,
              lineHeight: 1.35,
              maxWidth: 720,
            }}
          >
            {HOUSE_OPEN.body}
          </p>
          <div style={{marginTop: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div
              style={{
                backgroundColor: colors.acid,
                color: colors.onAcid,
                fontFamily: fontSans,
                fontSize: 20,
                fontWeight: 600,
                height: 52,
                padding: '0 22px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: radii.md,
                boxShadow: `4px 4px 0 ${colors.night}`,
              }}
            >
              {HOUSE_OPEN.cta}
            </div>
            <Wordmark size={48} color={colors.night} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
