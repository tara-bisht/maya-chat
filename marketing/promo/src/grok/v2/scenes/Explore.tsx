import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {colors, radii} from '../../theme';
import {fontDisplay, fontSans} from '../../fonts';
import {clampInterp, paperSlap} from '../../motion';
import {CATEGORY_SPOTS, EXPLORE} from '../copy';
import {WALL} from '../roster';
import {LobbyShell} from '../components/LobbyShell';
import {PosterMini} from '../components/PosterMini';
import {Pointer} from '../components/Pointer';

const COLS = 7;
const CARD_W = 196;
const GAP = 16;

export const Explore: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const titlePop = paperSlap(frame, 30, 2);
  const count = Math.min(100, Math.floor(clampInterp(frame, [6, 48], [8, 100])));
  const countLabel = count >= 100 ? EXPLORE.count : String(count);
  const scroll = interpolate(frame, [12, durationInFrames], [40, -920], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const spotIndex = Math.min(
    CATEGORY_SPOTS.length - 1,
    Math.max(0, Math.floor((frame - 50) / 36)),
  );
  const spot = CATEGORY_SPOTS[spotIndex];
  const spotLocal = Math.max(0, frame - 50 - spotIndex * 36);
  const spotPop = paperSlap(spotLocal, 30, 0);
  const chipX = 310 + spotIndex * 168;
  const pointerOpacity = clampInterp(frame, [48, 56, durationInFrames - 20, durationInFrames], [0, 1, 1, 0]);

  return (
    <AbsoluteFill>
      <LobbyShell url="getmaya.chat/explore" active="explore">
        <div style={{padding: '28px 36px 0', height: '100%', position: 'relative'}}>
          <p
            style={{
              margin: 0,
              fontFamily: fontSans,
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: colors.stub,
              opacity: titlePop,
            }}
          >
            {EXPLORE.kicker}
          </p>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 8}}>
            <h2
              style={{
                margin: 0,
                fontFamily: fontDisplay,
                fontStyle: 'italic',
                fontSize: 56,
                lineHeight: 0.95,
                letterSpacing: '-0.04em',
                color: colors.cream,
                transform: `translateY(${interpolate(titlePop, [0, 1], [18, 0])}px)`,
              }}
            >
              {count >= 100 ? EXPLORE.title : `${countLabel} characters.`}
            </h2>
          </div>
          <div style={{display: 'flex', gap: 10, marginTop: 16}}>
            {CATEGORY_SPOTS.map((entry) => {
              const on = entry.id === spot.id && frame >= 50;
              return (
                <div
                  key={entry.id}
                  style={{
                    padding: '8px 12px',
                    borderRadius: radii.md,
                    backgroundColor: on ? colors.acid : colors.rule,
                    color: on ? colors.onAcid : colors.cream,
                    fontFamily: fontSans,
                    fontSize: 14,
                    fontWeight: 600,
                    transform: `scale(${on ? 1.06 : 1})`,
                    boxShadow: on ? `4px 4px 0 ${colors.cream}` : undefined,
                  }}
                >
                  {entry.label}
                </div>
              );
            })}
          </div>
          <div style={{marginTop: 16, height: 660, overflow: 'hidden', position: 'relative'}}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${COLS}, ${CARD_W}px)`,
                gap: GAP,
                transform: `translateY(${scroll}px)`,
              }}
            >
              {WALL.map((card) => {
                const match = frame >= 50 && card.category === spot.id;
                const featured = Boolean(card.avatar);
                const highlight = match && featured ? spotPop : match ? 0.25 : 0;
                return (
                  <PosterMini key={card.id} card={card} width={CARD_W} highlight={highlight} />
                );
              })}
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              right: 40,
              bottom: 36,
              width: 420,
              backgroundColor: colors.cream,
              color: colors.night,
              borderRadius: radii.md,
              padding: 20,
              boxShadow: `8px 8px 0 ${colors.acid}`,
              opacity: clampInterp(frame, [54, 68], [0, 1]) * spotPop,
              transform: `translateY(${interpolate(spotPop, [0, 1], [16, 0])}px) rotate(-2deg)`,
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: fontSans,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                opacity: 0.6,
              }}
            >
              {spot.label}
            </p>
            <p
              style={{
                margin: '6px 0 0',
                fontFamily: fontDisplay,
                fontStyle: 'italic',
                fontSize: 34,
                letterSpacing: '-0.03em',
              }}
            >
              {spot.example}
            </p>
            <p style={{margin: '8px 0 0', fontFamily: fontSans, fontSize: 18, lineHeight: 1.35}}>
              {spot.line}
            </p>
          </div>
        </div>
      </LobbyShell>
      <Pointer x={chipX} y={176} pressed={clampInterp(spotLocal, [0, 4, 10], [0, 1, 0])} opacity={pointerOpacity} />
    </AbsoluteFill>
  );
};
