import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COLORS, FONTS } from '../constants/theme';
import { UserTurn, AgentTurn } from '../components/ChatTurn';
import { HardTicket } from '../components/HardTicket';
import { ChatShell } from './ChatShell';
import { USER_Q } from './cast';
import { fadeIn, usePop } from './anim';

// Beat 6 — Free. The chat keeps living behind a hard-offset ticket:
// no card, two voices on the house.
export const V2Free: React.FC = () => {
  const frame = useCurrentFrame();
  const ticketScale = usePop(frame, 26);

  return (
    <ChatShell
      wash={COLORS.costumes.marcus}
      avatar="avatars/marcus-stoic.jpg"
      name="Marcus"
      sub="Savage Stoic · replies fast"
      caption="FREE TIER. REAL VOICES. NO CARD."
    >
      {/* Living chat behind */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: '30px 90px',
          display: 'flex',
          flexDirection: 'column',
          gap: 26,
          opacity: fadeIn(frame, 0, 10),
        }}
      >
        <UserTurn text={USER_Q} time="23:42" />
        <AgentTurn
          agentName="Marcus"
          costume="marcus"
          modelAlias="grok-fast"
          time="23:42"
          text="Butt in chair. Phone in another room. Write 200 ugly words. Now."
        />
      </div>

      {/* Dim + ticket */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: COLORS.night,
          opacity: fadeIn(frame, 14, 14) * 0.72,
        }}
      />
      {frame >= 22 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${Math.max(0.01, ticketScale)}) rotate(-1.5deg)`,
          }}
        >
          <HardTicket
            variant="cream"
            shadowOffset={12}
            style={{ width: 860, textAlign: 'center', padding: '44px 50px' }}
          >
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 20,
                letterSpacing: '0.28em',
                color: COLORS.acid,
                fontWeight: 700,
              }}
            >
              NO CARD. NO CATCH.
            </div>
            <div
              style={{
                fontFamily: FONTS.display,
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: 108,
                lineHeight: 1,
                margin: '10px 0 6px',
              }}
            >
              Try it free.
            </div>
            <div
              style={{
                fontFamily: FONTS.sans,
                fontWeight: 500,
                fontSize: 26,
                opacity: 0.85,
              }}
            >
              Marcus &amp; Dr. Priya are on the house.
            </div>
            <div
              style={{
                marginTop: 26,
                display: 'inline-block',
                fontFamily: FONTS.sans,
                fontWeight: 900,
                fontSize: 30,
                letterSpacing: '0.03em',
                backgroundColor: COLORS.stub,
                color: COLORS.onStub,
                border: `3px solid ${COLORS.night}`,
                padding: '16px 54px',
                borderRadius: 12,
                boxShadow: `6px 6px 0 ${COLORS.acid}`,
                opacity: fadeIn(frame, 90, 12),
              }}
            >
              START CHATTING →
            </div>
          </HardTicket>
        </div>
      ) : null}
    </ChatShell>
  );
};
