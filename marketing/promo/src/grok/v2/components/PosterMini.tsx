import React from 'react';
import {Img, staticFile} from 'remotion';
import {colors, radii} from '../../theme';
import {fontDisplay, fontSans} from '../../fonts';
import type {StampTone, WallCard} from '../roster';

const STAMP_LABEL: Record<StampTone, string> = {
  free: 'Free',
  plus: 'Plus',
  house: 'Public',
  'next-bill': 'Coming soon',
};

export const PosterMini: React.FC<{
  card: WallCard;
  width?: number;
  highlight?: number;
}> = ({card, width = 210, highlight = 0}) => {
  const height = width * 1.22;
  const free = card.stamp === 'free' || card.stamp === 'house';
  return (
    <article
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: card.color,
        color: colors.cream,
        borderRadius: radii.md,
        padding: 12,
        boxShadow: `6px 6px 0 ${highlight > 0.5 ? colors.acid : colors.cream}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        transform: `rotate(${card.tilt}deg) scale(${1 + highlight * 0.08})`,
        overflow: 'visible',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: -8,
          right: -8,
          padding: '5px 8px',
          fontFamily: fontSans,
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          backgroundColor: free ? colors.cream : colors.stub,
          color: colors.night,
          boxShadow: free ? `3px 3px 0 ${colors.acid}` : `3px 3px 0 ${colors.cream}`,
          transform: 'rotate(-7deg)',
          borderRadius: 4,
        }}
      >
        {STAMP_LABEL[card.stamp]}
      </span>
      <div
        style={{
          borderRadius: radii.sm,
          overflow: 'hidden',
          height: width * 0.52,
          backgroundColor: 'rgba(20,17,15,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {card.avatar ? (
          <Img
            src={staticFile(card.avatar)}
            style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 18%'}}
          />
        ) : (
          <span
            style={{
              fontFamily: fontDisplay,
              fontStyle: 'italic',
              fontSize: width * 0.28,
              lineHeight: 1,
            }}
          >
            {card.shortName[0]}
          </span>
        )}
      </div>
      <p
        style={{
          margin: 0,
          fontFamily: fontSans,
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          opacity: 0.8,
        }}
      >
        {card.category}
      </p>
      <h3
        style={{
          margin: 0,
          fontFamily: fontDisplay,
          fontStyle: 'italic',
          fontWeight: 600,
          fontSize: 26,
          lineHeight: 0.95,
          letterSpacing: '-0.03em',
        }}
      >
        {card.shortName}
      </h3>
    </article>
  );
};
