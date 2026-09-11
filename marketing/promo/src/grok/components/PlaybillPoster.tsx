import React from 'react';
import {Img, staticFile} from 'remotion';
import type {Player} from '../company';
import {colors, radii} from '../theme';
import {fontDisplay, fontSans} from '../fonts';
import {Stamp} from './Stamp';

export const PlaybillPoster: React.FC<{
  player: Player;
  width?: number;
  compact?: boolean;
}> = ({player, width = 360, compact = false}) => {
  const height = compact ? width * 1.18 : width * 1.32;

  return (
    <article
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: player.color,
        color: colors.cream,
        borderRadius: radii.md,
        padding: compact ? 14 : 18,
        boxShadow: `6px 6px 0 ${colors.cream}`,
        display: 'flex',
        flexDirection: 'column',
        gap: compact ? 8 : 10,
        overflow: 'visible',
      }}
    >
      <div style={{position: 'absolute', top: -8, right: -8, zIndex: 2}}>
        <Stamp
          label={player.freeTier ? 'Free' : 'Plus'}
          tone={player.freeTier ? 'free' : 'plus'}
          rotate={player.freeTier ? -6 : -8}
        />
      </div>
      <div
        style={{
          borderRadius: radii.md,
          overflow: 'hidden',
          height: compact ? width * 0.52 : width * 0.58,
          flexShrink: 0,
        }}
      >
        <Img
          src={staticFile(player.avatar)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 18%',
            transform: 'scale(1.12)',
          }}
        />
      </div>
      <p
        style={{
          margin: 0,
          fontFamily: fontSans,
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          opacity: 0.8,
        }}
      >
        {player.category}
      </p>
      <h3
        style={{
          margin: 0,
          fontFamily: fontDisplay,
          fontStyle: 'italic',
          fontWeight: 600,
          fontSize: compact ? 28 : 34,
          lineHeight: 1,
          letterSpacing: '-0.03em',
        }}
      >
        {player.shortName}
      </h3>
      {compact ? null : (
        <p
          style={{
            margin: 0,
            fontFamily: fontSans,
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 1.3,
            opacity: 0.92,
          }}
        >
          {player.tagline}
        </p>
      )}
    </article>
  );
};
