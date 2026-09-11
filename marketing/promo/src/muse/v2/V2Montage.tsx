import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { COLORS, FONTS } from '../constants/theme';
import { DEMO_REPLIES, MONTAGE_ORDER, USER_Q, characterById } from './cast';
import { flashAt, typeChars } from './anim';

const SLOT = 90;

// Beat 3 — personality montage. Same question, four voices, hard cuts
// on the drums. Slim app header keeps it inside the product.
export const V2Montage: React.FC = () => {
  const frame = useCurrentFrame();
  const slot = Math.min(MONTAGE_ORDER.length - 1, Math.floor(frame / SLOT));
  const sf = frame - slot * SLOT;
  const c = characterById(MONTAGE_ORDER[slot]);
  const wash = COLORS.costumes[c.costume];
  const replyFull = DEMO_REPLIES[c.id];
  const reply = typeChars(sf, 14, replyFull, 48);
  const typing = reply.length < replyFull.length;

  return (
    <div style={{ position: 'absolute', inset: 0, backgroundColor: wash }}>
      {/* Cut flash */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: COLORS.cream,
          opacity: flashAt(sf, 0, 4),
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* Slim app header */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 120,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '0 90px',
          backgroundColor: 'rgba(12,10,9,0.55)',
        }}
      >
        <Img
          src={staticFile(c.avatar)}
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            objectFit: 'cover',
            border: `3px solid ${COLORS.cream}`,
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: FONTS.sans,
              fontWeight: 800,
              fontSize: 30,
              color: COLORS.cream,
            }}
          >
            {c.shortName}
          </span>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 15,
              letterSpacing: '0.14em',
              color: COLORS.cream,
              opacity: 0.85,
            }}
          >
            {c.category} · 0{slot + 1}/04
          </span>
        </div>
        {/* Progress pips */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          {MONTAGE_ORDER.map((_, i) => (
            <div
              key={i}
              style={{
                width: 64,
                height: 10,
                borderRadius: 999,
                backgroundColor:
                  i < slot
                    ? COLORS.cream
                    : i === slot
                      ? COLORS.acid
                      : 'rgba(246,239,228,0.3)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Wash body */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: '190px 130px 120px',
          display: 'flex',
          gap: 90,
          alignItems: 'flex-start',
        }}
      >
        <Img
          src={staticFile(c.avatar)}
          style={{
            width: 340,
            height: 340,
            borderRadius: '50%',
            objectFit: 'cover',
            border: `8px solid ${COLORS.cream}`,
            boxShadow: `14px 14px 0 ${COLORS.night}`,
            flexShrink: 0,
          }}
        />
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 26, flex: 1 }}
        >
          <div
            style={{
              fontFamily: FONTS.display,
              fontStyle: 'italic',
              fontWeight: 600,
              fontSize: 96,
              lineHeight: 1,
              color: COLORS.cream,
              letterSpacing: '-0.02em',
            }}
          >
            {c.shortName} answers.
          </div>
          <div
            style={{
              backgroundColor: COLORS.night,
              color: COLORS.cream,
              fontFamily: FONTS.sans,
              fontSize: 30,
              lineHeight: 1.45,
              padding: '26px 32px',
              borderRadius: 12,
              boxShadow: `8px 8px 0 ${COLORS.cream}`,
              minHeight: 220,
            }}
          >
            “{reply}
            {typing ? (
              <span style={{ opacity: 0.7 }}>▍</span>
            ) : (
              <span style={{ color: COLORS.stub }}> ✓✓</span>
            )}
          </div>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 18,
              letterSpacing: '0.1em',
              color: COLORS.cream,
              opacity: 0.9,
            }}
          >
            YOU ASKED: “{USER_Q}”
          </div>
        </div>
      </div>

      {/* Caption */}
      <div
        style={{
          position: 'absolute',
          bottom: 34,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: 19,
            letterSpacing: '0.22em',
            color: COLORS.cream,
            backgroundColor: 'rgba(12,10,9,0.82)',
            border: `1px solid ${COLORS.cream}`,
            padding: '10px 26px',
            borderRadius: 999,
          }}
        >
          DIFFERENT CONVERSATION. BEST RESULT.
        </span>
      </div>
    </div>
  );
};
