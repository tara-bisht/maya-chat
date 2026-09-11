import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { COLORS } from '../constants/theme';
import { UserTurn, AgentTurn } from '../components/ChatTurn';
import { ChatShell } from './ChatShell';
import { AgentRail, Cursor } from './Chrome';
import { DEMO_REPLIES, USER_Q, characterById } from './cast';
import { fadeIn, flashAt, typeChars } from './anim';

const RAIL_IDS = ['marcus', 'nonna', 'viktor', 'priya', 'barnaby'];
const TAP = 46;

// Beat 2 — the switch. Rail docks, cursor taps Marcus, the window
// floods stoic green and the same question gets a real answer.
export const V2Switch: React.FC = () => {
  const frame = useCurrentFrame();
  const tapped = frame >= TAP;
  const marcus = characterById('marcus');
  const wash = tapped ? COLORS.costumes.marcus : COLORS.rule;

  const slide = interpolate(frame, [5, 26], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // Cursor glides from the rail header down to the Marcus row, then taps.
  const cx = interpolate(frame, [28, TAP], [1290, 1290], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cy = interpolate(frame, [28, TAP], [180, 258], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cursorOpacity = interpolate(frame, [28, 32, 52, 58], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const replyFull = DEMO_REPLIES.marcus;
  const reply = typeChars(frame, 58, replyFull, 64);
  const typing = tapped && reply.length < replyFull.length;

  return (
    <ChatShell
      wash={wash}
      avatar={tapped ? marcus.avatar : undefined}
      name={tapped ? 'Marcus' : 'Pick a voice'}
      sub={tapped ? 'Savage Stoic · replies fast' : 'one question, five answers'}
      caption="SAME QUESTION. DIFFERENT PERSONALITY."
    >
      {/* Wash-flood wipe on tap */}
      {tapped ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: COLORS.costumes.marcus,
            transformOrigin: 'right center',
            transform: `scaleX(${interpolate(frame, [TAP, TAP + 12], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })})`,
            opacity: 0.55,
          }}
        />
      ) : null}
      {/* Acid flash hides the header swap */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: COLORS.acid,
          opacity: flashAt(frame, TAP, 5) * 0.85,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: '30px 360px 30px 90px',
          display: 'flex',
          flexDirection: 'column',
          gap: 26,
          opacity: fadeIn(frame, 0, 10),
        }}
      >
        <UserTurn text={USER_Q} time="23:42" />
        {tapped ? (
          <AgentTurn
            agentName="Marcus"
            costume="marcus"
            modelAlias="grok-fast"
            time="23:42"
            text={typing ? `${reply}▍` : reply}
          />
        ) : null}
      </div>

      <AgentRail
        ids={RAIL_IDS}
        activeId={tapped ? 'marcus' : null}
        slide={slide}
        highlightAt={tapped ? TAP : undefined}
      />
      <Cursor x={cx} y={cy} opacity={cursorOpacity} />
    </ChatShell>
  );
};
