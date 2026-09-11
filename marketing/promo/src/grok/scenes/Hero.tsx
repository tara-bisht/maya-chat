import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Scribble} from '../components/Scribble';
import {PlaybillPoster} from '../components/PlaybillPoster';
import {COMPANY} from '../company';
import {HERO} from '../copy';
import {colors} from '../theme';
import {fontDisplay, fontSans} from '../fonts';
import {fadeInOut, paperSlap} from '../motion';

export const Hero: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = fadeInOut(frame, durationInFrames, 10, 16);
  const title = paperSlap(frame, fps, 2);
  const body = interpolate(frame, [28, 52], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{opacity, padding: '64px 80px 0'}}>
      <div
        style={{
          textAlign: 'center',
          transform: `translateY(${(1 - title) * 36}px) scale(${0.94 + title * 0.06})`,
          opacity: Math.min(1, title),
        }}
      >
        <div style={{position: 'relative', display: 'inline-block'}}>
          <h1
            style={{
              margin: 0,
              fontFamily: fontDisplay,
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 108,
              lineHeight: 0.92,
              letterSpacing: '-0.04em',
              color: colors.cream,
            }}
          >
            {HERO.titleLead}
            {HERO.titleMark}
          </h1>
          <div
            style={{
              position: 'absolute',
              left: '47%',
              right: '0.5%',
              top: 86,
              height: 16,
              pointerEvents: 'none',
            }}
          >
            <Scribble frame={frame} start={16} duration={32} />
          </div>
        </div>
        <p
          style={{
            margin: '48px auto 0',
            maxWidth: 780,
            fontFamily: fontSans,
            fontSize: 26,
            lineHeight: 1.35,
            color: colors.creamDim,
            opacity: body,
            paddingTop: 8,
          }}
        >
          {HERO.body}
        </p>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -40,
          display: 'flex',
          justifyContent: 'center',
          gap: 28,
        }}
      >
        {COMPANY.slice(0, 4).map((player, index) => {
          const enter = paperSlap(frame, fps, 22 + index * 5);
          return (
            <div
              key={player.id}
              style={{
                transform: `translateY(${(1 - enter) * 120}px) rotate(${player.tilt}deg)`,
                opacity: Math.min(1, enter),
              }}
            >
              <PlaybillPoster player={player} width={280} compact />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
