import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ChatShell } from './ChatShell';
import { Stamp } from './Chrome';
import { STERILE_REPLY_LINES, USER_Q, STERILE } from './cast';
import { fadeIn, typeChars, usePop, useRise } from './anim';

// Beat 1 — the sterile cold open. Flat light-mode chat app, bland
// numbered-tips reply, BLAND stamp slam.
export const V2Sterile: React.FC = () => {
  const frame = useCurrentFrame();
  const userText = typeChars(frame, 15, USER_Q, 26);
  const stampScale = usePop(frame, 126);
  const stampRise = useRise(frame, 126, 30);

  return (
    <ChatShell
      sterile
      wash="#B5B5B5"
      name="Generic AI"
      sub="always happy to help"
      caption="EVERY AI SOUNDS LIKE THIS"
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: '34px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
        }}
      >
        {/* User bubble */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div
            style={{
              backgroundColor: STERILE.userBubble,
              color: '#FFFFFF',
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontSize: 21,
              lineHeight: 1.45,
              padding: '14px 22px',
              borderRadius: 20,
              maxWidth: 640,
              opacity: fadeIn(frame, 10, 10),
            }}
          >
            {userText}
            <span style={{ opacity: 0.6 }}>
              {frame >= 15 && userText.length < USER_Q.length ? '▍' : ''}
            </span>
          </div>
        </div>

        {/* Bland agent reply, line by line */}
        <div
          style={{
            backgroundColor: STERILE.agentBubble,
            border: `1px solid ${STERILE.border}`,
            borderRadius: 20,
            padding: '20px 26px',
            maxWidth: 760,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            opacity: fadeIn(frame, 68, 12),
          }}
        >
          {STERILE_REPLY_LINES.map((line, i) => (
            <div
              key={i}
              style={{
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: i === 0 ? 20 : 19,
                color: STERILE.ink,
                opacity: fadeIn(frame, 72 + i * 9, 8),
                transform: `translateY(${(1 - fadeIn(frame, 72 + i * 9, 8)) * 10}px)`,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* BLAND stamp */}
      {frame >= 124 ? (
        <div
          style={{
            position: 'absolute',
            right: 130,
            bottom: 46,
            transform: `translateY(${stampRise}px)`,
          }}
        >
          <Stamp text="BLAND." scale={stampScale} variant="acid" rotate={-8} />
        </div>
      ) : null}
    </ChatShell>
  );
};
