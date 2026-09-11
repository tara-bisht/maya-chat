import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Img, staticFile} from 'remotion';
import {Kicker} from '../components/Kicker';
import {Ticket} from '../components/Ticket';
import {NIGHTS, PROMPT, USUAL} from '../copy';
import {colors, radii} from '../theme';
import {fontDisplay, fontSans} from '../fonts';
import {fadeInOut, paperSlap, typeText} from '../motion';

export const Contrast: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = fadeInOut(frame, durationInFrames, 10, 16);
  const heading = paperSlap(frame, fps, 0);
  const promptTicket = paperSlap(frame, fps, 10);
  const typedPrompt = typeText(PROMPT, frame, 18, 0.9);

  return (
    <AbsoluteFill style={{opacity, padding: '48px 72px 56px'}}>
      <div style={{opacity: Math.min(1, heading), transform: `translateY(${(1 - heading) * 16}px)`}}>
        <Kicker kicker={USUAL.kicker} title={USUAL.title} body={USUAL.body} />
      </div>
      <div
        style={{
          marginTop: 28,
          transform: `translateY(${(1 - promptTicket) * 24}px)`,
          opacity: Math.min(1, promptTicket),
        }}
      >
        <Ticket kicker="You" width="100%" padding={22} shadow={`4px 4px 0 ${colors.acid}`}>
          <p
            style={{
              margin: 0,
              fontFamily: fontSans,
              fontSize: 28,
              lineHeight: 1.3,
              color: colors.night,
            }}
          >
            {typedPrompt}
            {typedPrompt.length < PROMPT.length ? (
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 26,
                  marginLeft: 4,
                  backgroundColor: colors.acid,
                  transform: 'translateY(4px)',
                  opacity: frame % 16 < 8 ? 1 : 0,
                }}
              />
            ) : null}
          </p>
        </Ticket>
      </div>
      <div
        style={{
          marginTop: 32,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 28,
          flex: 1,
        }}
      >
        {NIGHTS.map((night, index) => {
          const enter = paperSlap(frame, fps, 70 + index * 16);
          const quoteStart = 54 + index * 10;
          const quote = typeText(night.quote, frame, quoteStart, 1.35);
          const wash = interpolate(frame, [70 + index * 16, 90 + index * 16], [0.72, 0.9], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <article
              key={night.player.id}
              style={{
                backgroundColor: night.player.color,
                opacity: Math.min(1, enter) * wash,
                borderRadius: radii.md,
                padding: 22,
                minHeight: 300,
                transform: `translateY(${(1 - enter) * 50}px) rotate(${night.player.tilt * 0.35}deg)`,
                boxShadow: `6px 6px 0 ${colors.cream}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
                <div style={{width: 56, height: 56, borderRadius: radii.md, overflow: 'hidden', flexShrink: 0}}>
                  <Img
                    src={staticFile(night.player.avatar)}
                    style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 18%'}}
                  />
                </div>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: fontDisplay,
                      fontStyle: 'italic',
                      fontWeight: 600,
                      fontSize: 28,
                      color: colors.cream,
                      lineHeight: 1,
                    }}
                  >
                    {night.player.shortName}
                  </p>
                  <p
                    style={{
                      margin: '6px 0 0',
                      fontFamily: fontSans,
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: colors.cream,
                      opacity: 0.75,
                    }}
                  >
                    {night.player.category}
                  </p>
                </div>
              </div>
              <p
                style={{
                  margin: 0,
                  fontFamily: fontSans,
                  fontSize: 22,
                  lineHeight: 1.4,
                  color: colors.cream,
                }}
              >
                {quote}
              </p>
            </article>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
