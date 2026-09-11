import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {colors, radii} from '../../theme';
import {fontDisplay, fontSans} from '../../fonts';
import {clampInterp, paperSlap} from '../../motion';
import {playerById} from '../../company';
import {FINALE} from '../copy';
import {playerCard} from '../roster';
import {LobbyShell} from '../components/LobbyShell';
import {PosterMini} from '../components/PosterMini';

export const Finale: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const pop = paperSlap(frame, 30, 2);
  const ticket = paperSlap(frame, 30, 18);
  const pulse = 1 + Math.sin(frame / 8) * 0.012;
  const fadeHold = clampInterp(frame, [durationInFrames - 8, durationInFrames], [1, 1]);
  const marcus = playerCard(playerById('marcus'));
  const priya = playerCard(playerById('priya'));

  return (
    <AbsoluteFill style={{opacity: fadeHold}}>
      <LobbyShell url="getmaya.chat" active="home">
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 80px 40px',
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
              color: colors.stub,
              opacity: pop,
            }}
          >
            {FINALE.kicker}
          </p>
          <h2
            style={{
              margin: '10px 0 0',
              fontFamily: fontDisplay,
              fontStyle: 'italic',
              fontSize: 88,
              lineHeight: 0.92,
              letterSpacing: '-0.04em',
              color: colors.cream,
              transform: `translateY(${interpolate(pop, [0, 1], [22, 0])}px) scale(${pulse})`,
            }}
          >
            {FINALE.title}
          </h2>
          <p
            style={{
              margin: '18px 0 0',
              fontFamily: fontSans,
              fontSize: 24,
              lineHeight: 1.4,
              color: colors.creamDim,
              textAlign: 'center',
              maxWidth: 820,
              opacity: clampInterp(frame, [10, 24], [0, 1]),
            }}
          >
            {FINALE.body}
          </p>
          <div
            style={{
              display: 'flex',
              gap: 28,
              marginTop: 36,
              opacity: clampInterp(frame, [16, 30], [0, 1]),
            }}
          >
            <PosterMini card={marcus} width={220} highlight={1} />
            <PosterMini card={priya} width={220} highlight={1} />
          </div>
          <div
            style={{
              marginTop: 40,
              backgroundColor: colors.acid,
              color: colors.onAcid,
              borderRadius: radii.md,
              padding: '18px 36px',
              boxShadow: `8px 8px 0 ${colors.cream}`,
              transform: `translateY(${interpolate(ticket, [0, 1], [20, 0])}px) rotate(-1.5deg) scale(${pulse})`,
              opacity: ticket,
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
              }}
            >
              Try tonight
            </p>
            <p
              style={{
                margin: '4px 0 0',
                fontFamily: fontDisplay,
                fontStyle: 'italic',
                fontSize: 48,
                letterSpacing: '-0.04em',
              }}
            >
              {FINALE.cta}
            </p>
          </div>
        </div>
      </LobbyShell>
    </AbsoluteFill>
  );
};
