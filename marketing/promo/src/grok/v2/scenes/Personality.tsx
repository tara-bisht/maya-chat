import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../../theme';
import {fontDisplay, fontSans} from '../../fonts';
import {clampInterp, paperSlap, typeText} from '../../motion';
import {playerById} from '../../company';
import {NIGHT_REPLIES, PROMPT, SAME_NIGHT} from '../copy';
import {NIGHT_SLOTS} from '../timing';
import {ChatShell} from '../components/ChatShell';
import {AgentWash, UserTicket} from '../components/Bubbles';
import {Pointer} from '../components/Pointer';

const RAIL_Y: Record<string, number> = {
  marcus: 168,
  nonna: 396,
  barnaby: 564,
};

export const Personality: React.FC<{durationInFrames: number}> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const slot =
    NIGHT_SLOTS.find((entry) => frame >= entry.from && frame < entry.from + entry.duration) ??
    NIGHT_SLOTS[NIGHT_SLOTS.length - 1];
  const local = frame - slot.from;
  const player = playerById(slot.id);
  const reply = NIGHT_REPLIES[slot.id];
  const typed = typeText(reply, local, 10, 2.6);
  const streaming = typed.length < reply.length && local > 10;
  const userPop = paperSlap(frame, 30, 4);
  const agentPop = paperSlap(local, 30, 8);
  const flood = clampInterp(local, [0, 16], [1, 0]);
  const kicker = clampInterp(frame, [8, 20, durationInFrames - 16, durationInFrames], [0, 1, 1, 0]);

  const next = NIGHT_SLOTS.find((entry) => entry.from > slot.from);
  const clickOn = next && local > slot.duration - 22;
  const clickX = 86;
  const clickY = next ? RAIL_Y[next.id] : RAIL_Y[slot.id];
  const pointerX = interpolate(local, [slot.duration - 22, slot.duration - 8], [86, clickX], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pointerY = interpolate(
    local,
    [slot.duration - 22, slot.duration - 8],
    [RAIL_Y[slot.id], clickY],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const pressed = clickOn ? clampInterp(local, [slot.duration - 10, slot.duration - 6], [0, 1]) : 0;

  const slug =
    slot.id === 'nonna' ? 'nonna-maria' : slot.id === 'barnaby' ? 'barnaby' : 'marcus';

  return (
    <AbsoluteFill>
      <ChatShell
        player={player}
        url={`getmaya.chat/chat/${slug}`}
        composer=""
        placeholder={`${player.shortName} is listening.`}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${18 + flood * 82}%`,
            backgroundColor: player.color,
            opacity: 0.16 + flood * 0.22,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            gap: 18,
            padding: '28px 18% 24px',
          }}
        >
          <UserTicket
            text={PROMPT}
            opacity={userPop}
            y={interpolate(userPop, [0, 1], [24, 0])}
          />
          <AgentWash
            name={player.shortName}
            text={typed}
            color={player.color}
            streaming={streaming}
            opacity={agentPop}
            y={interpolate(agentPop, [0, 1], [28, 0])}
          />
        </div>
      </ChatShell>
      <div
        style={{
          position: 'absolute',
          top: 140,
          left: 300,
          opacity: kicker,
          pointerEvents: 'none',
          padding: '10px 14px',
          backgroundColor: colors.stub,
          color: colors.onStub,
          boxShadow: `4px 4px 0 ${colors.acid}`,
          transform: 'rotate(-3deg)',
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
          }}
        >
          {SAME_NIGHT.kicker}
        </p>
        <p
          style={{
            margin: '4px 0 0',
            fontFamily: fontDisplay,
            fontStyle: 'italic',
            fontSize: 22,
            letterSpacing: '-0.03em',
          }}
        >
          {SAME_NIGHT.title}
        </p>
      </div>
      {next ? (
        <Pointer
          x={pointerX}
          y={pointerY}
          pressed={pressed}
          opacity={clampInterp(local, [slot.duration - 24, slot.duration - 18, slot.duration - 2, slot.duration], [0, 1, 1, 0])}
        />
      ) : null}
    </AbsoluteFill>
  );
};
