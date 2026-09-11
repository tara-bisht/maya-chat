import React from 'react';
import { staticFile, Img } from 'remotion';
import { COLORS, FONTS, CharacterRosterItem } from '../constants/theme';

interface PlaybillPosterProps {
  character: CharacterRosterItem;
  scale?: number;
  opacity?: number;
  highlight?: boolean;
  extraTranslateY?: number;
  style?: React.CSSProperties;
}

// Costume-flood playbill poster (docs/DESIGN.md playbill-poster).
export const PlaybillPoster: React.FC<PlaybillPosterProps> = ({
  character,
  scale = 1,
  opacity = 1,
  highlight = false,
  extraTranslateY = 0,
  style,
}) => {
  const costumeColor =
    COLORS.costumes[character.costume] || COLORS.costumes.marcus;

  return (
    <div
      style={{
        transform: `translateY(${extraTranslateY}px) rotate(${character.tilt}deg) scale(${scale})`,
        opacity,
        width: 320,
        backgroundColor: costumeColor,
        borderRadius: 12,
        padding: '20px 18px',
        boxShadow: highlight
          ? `0 0 0 3px ${COLORS.acid}, 9px 9px 0 ${COLORS.cream}`
          : `6px 6px 0 ${COLORS.cream}`,
        color: COLORS.cream,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -12,
          right: -10,
          backgroundColor: character.freeTier ? COLORS.cream : COLORS.stub,
          color: character.freeTier ? COLORS.night : COLORS.onStub,
          fontFamily: FONTS.sans,
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: '0.08em',
          padding: '4px 10px',
          borderRadius: 6,
          boxShadow: character.freeTier
            ? `3px 3px 0 ${COLORS.acid}`
            : `3px 3px 0 ${COLORS.cream}`,
          transform: `rotate(${character.freeTier ? -6 : -8}deg)`,
          zIndex: 5,
        }}
      >
        {character.freeTier ? 'FREE' : 'PLUS'}
      </div>

      <div
        style={{
          width: '100%',
          height: 230,
          borderRadius: 10,
          overflow: 'hidden',
          backgroundColor: COLORS.night,
          position: 'relative',
          marginBottom: 16,
        }}
      >
        <Img
          src={staticFile(character.avatar)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(1.05)',
          }}
        />
      </div>

      <div
        style={{
          fontFamily: FONTS.sans,
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: '0.08em',
          color: 'rgba(246, 239, 228, 0.75)',
          textTransform: 'uppercase',
          marginBottom: 4,
        }}
      >
        {character.category}
      </div>

      <div
        style={{
          fontFamily: FONTS.display,
          fontSize: 28,
          fontStyle: 'italic',
          fontWeight: 600,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          color: COLORS.cream,
          marginBottom: 10,
        }}
      >
        {character.shortName}
      </div>

      <div
        style={{
          fontFamily: FONTS.sans,
          fontSize: 13,
          fontWeight: 400,
          lineHeight: 1.4,
          color: 'rgba(246, 239, 228, 0.9)',
        }}
      >
        &ldquo;{character.tagline}&rdquo;
      </div>
    </div>
  );
};
