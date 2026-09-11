import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Img,
} from 'remotion';
import { COLORS, FONTS } from '../../constants/theme';
import { DesktopWindow } from '../../components/DesktopWindow';
import { PersonalityTabs } from '../../components/PersonalityTabs';
import { UserTurn, AgentTurn } from '../../components/ChatTurn';
import { HardTicket } from '../../components/HardTicket';

export const Scene2_MultiPersonalityChat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Determine active personality based on frame
  // 0 - 110: Marcus (Stoic)
  // 110 - 220: Alex (10x Lead)
  // 220 - 330: Nonna Maria (Fierce Care)
  const currentTurn = frame < 110 ? 'marcus' : frame < 220 ? 'alex' : 'nonna';

  // Animation triggers on switch
  const switchSpring = spring({
    frame: currentTurn === 'marcus' ? frame : currentTurn === 'alex' ? frame - 110 : frame - 220,
    fps,
    config: { damping: 13, stiffness: 140 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.night,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <DesktopWindow activeAgentId={currentTurn} activeNav="chat">
        {/* Stage Top Bar */}
        <div
          style={{
            height: 68,
            borderBottom: `1px solid ${COLORS.rule}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            backgroundColor: '#191512',
          }}
        >
          {/* Active Agent Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 8,
                overflow: 'hidden',
                backgroundColor: COLORS.costumes[currentTurn],
                boxShadow: `2px 2px 0 ${COLORS.cream}`,
              }}
            >
              <Img
                src={staticFile(
                  currentTurn === 'marcus'
                    ? 'avatars/marcus-stoic.jpg'
                    : currentTurn === 'alex'
                    ? 'avatars/alex-tech-lead.jpg'
                    : 'avatars/nonna-maria.jpg'
                )}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <div style={{ fontFamily: FONTS.display, fontStyle: 'italic', fontSize: 22, fontWeight: 700, color: COLORS.cream }}>
                {currentTurn === 'marcus'
                  ? 'Marcus (The Savage Stoic)'
                  : currentTurn === 'alex'
                  ? 'Alex (10x Tech Lead)'
                  : 'Nonna Maria (Fierce Italian Grandma)'}
              </div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.inkSoft }}>
                VOICE THROUGH GROK-FAST · ACTIVE THREAD
              </div>
            </div>
          </div>

          {/* Personality Switcher Tabs */}
          <PersonalityTabs activeId={currentTurn} />
        </div>

        {/* Chat Transcript Area */}
        <div
          style={{
            flex: 1,
            padding: '36px 48px',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            overflow: 'hidden',
          }}
        >
          {/* User Question */}
          <UserTurn
            text="I have 3 hours to launch, but I'm overwhelmed and procrastinating. What do I do?"
            time="23:42"
          />

          {/* Dynamic Agent Turn */}
          <div
            style={{
              transform: `translateY(${interpolate(switchSpring, [0, 1], [30, 0])}px)`,
              opacity: interpolate(switchSpring, [0, 1], [0, 1]),
            }}
          >
            {currentTurn === 'marcus' && (
              <AgentTurn
                agentName="MARCUS (THE SAVAGE STOIC)"
                costume="marcus"
                modelAlias="voice through grok-fast"
                text="Delay is fear in a nicer shirt. The work is yours; the mood is not. Kill the pitch deck. 20 ugly minutes on the core checkout flow. NOW."
                time="23:42"
              />
            )}

            {currentTurn === 'alex' && (
              <AgentTurn
                agentName="ALEX (EXHAUSTED 10X TECH LEAD)"
                costume="alex"
                modelAlias="voice through claude"
                text="Your scope is 10x too big. Ship 1 endpoint, mock the auth, defer the database migration. If prod pages me tonight it will be the logger you touched. Ship it."
                time="23:43"
              />
            )}

            {currentTurn === 'nonna' && (
              <AgentTurn
                agentName="NONNA MARIA (FIERCE ITALIAN GRANDMA)"
                costume="nonna"
                modelAlias="voice through grok-fast"
                text="You haven't eaten or drank water in 6 hours! A starving brain writes broken code. Sit down. Eat this sandwich. Then you launch. Not before."
                time="23:44"
              />
            )}
          </div>
        </div>

        {/* Bottom Bar: Composer + Kinetic Value Badge */}
        <div
          style={{
            height: 80,
            borderTop: `1px solid ${COLORS.rule}`,
            backgroundColor: '#161311',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 36px',
          }}
        >
          {/* Fake Composer Input */}
          <div
            style={{
              flex: 1,
              maxWidth: 750,
              backgroundColor: '#201C18',
              borderRadius: 8,
              border: `1px solid ${COLORS.rule}`,
              padding: '12px 18px',
              fontFamily: FONTS.sans,
              fontSize: 14,
              color: COLORS.inkSoft,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>Ask Marcus, Alex, or any character...</span>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                backgroundColor: COLORS.acid,
                color: COLORS.onAcid,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
              }}
            >
              ↑
            </div>
          </div>

          {/* Right Highlight Badge */}
          <HardTicket variant="stub" shadowOffset={4} rotation={-0.8}>
            <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.04em' }}>
              ✦ SWITCH PERSONALITIES TO GET THE BEST RESULT
            </span>
          </HardTicket>
        </div>
      </DesktopWindow>
    </AbsoluteFill>
  );
};
