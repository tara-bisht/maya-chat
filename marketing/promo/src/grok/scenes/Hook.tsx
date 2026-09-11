import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Ticket} from '../components/Ticket';
import {HERO, HOOK_LINES} from '../copy';
import {colors} from '../theme';
import {fontDisplay, fontSans} from '../fonts';
import {fadeInOut, paperSlap} from '../motion';

export const Hook: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = fadeInOut(frame, durationInFrames, 10, 14);
  const ticket = paperSlap(frame, fps, 2);
  const headline = paperSlap(frame, fps, 48);

  return (
    <AbsoluteFill style={{opacity, padding: '72px 80px'}}>
      <div
        style={{
          display: 'flex',
          gap: 72,
          height: '100%',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            flex: '0 0 640px',
            transform: `translateY(${(1 - ticket) * 80}px)`,
            opacity: Math.min(1, ticket),
          }}
        >
          <Ticket kicker="Assistant" stamp="The usual" width={640}>
            <ul style={{listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10}}>
              {HOOK_LINES.map((line, index) => {
                const appear = interpolate(frame, [12 + index * 8, 24 + index * 8], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                });
                const strike = interpolate(frame, [44 + index * 6, 58 + index * 6], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                });
                return (
                  <li
                    key={line}
                    style={{
                      fontFamily: fontSans,
                      fontSize: 22,
                      lineHeight: 1.35,
                      color: colors.night,
                      opacity: 0.28 + appear * 0.42,
                    }}
                  >
                    <span style={{position: 'relative', display: 'inline-block'}}>
                      {line}
                      <span
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '54%',
                          height: 2.5,
                          width: `${strike * 100}%`,
                          backgroundColor: colors.night,
                          opacity: 0.7,
                        }}
                      />
                    </span>
                  </li>
                );
              })}
            </ul>
          </Ticket>
        </div>
        <div
          style={{
            flex: 1,
            transform: `translateX(${(1 - headline) * 40}px)`,
            opacity: Math.min(1, headline * 1.2),
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
            Cut
          </p>
          <h1
            style={{
              margin: '16px 0 0',
              fontFamily: fontDisplay,
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 84,
              lineHeight: 0.94,
              letterSpacing: '-0.04em',
              color: colors.cream,
              maxWidth: 820,
            }}
          >
            {HERO.body.split('.')[0]}.
          </h1>
        </div>
      </div>
    </AbsoluteFill>
  );
};
