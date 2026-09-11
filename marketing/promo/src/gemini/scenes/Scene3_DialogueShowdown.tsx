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
import { COLORS, FONTS } from '../constants/theme';
import { UserTurn, AgentTurn } from '../components/ChatTurn';
import { HardTicket } from '../components/HardTicket';

export const Scene3_DialogueShowdown: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // User question entrance
  const userSpring = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  // Assistant response entrance
  const assistantSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  // Marcus response entrance (frames 50 - 170)
  const marcusSpring = spring({
    frame: frame - 50,
    fps,
    config: { damping: 12, stiffness: 130 },
  });

  // Nonna response entrance (frames 170 - 290)
  const nonnaSpring = spring({
    frame: frame - 175,
    fps,
    config: { damping: 12, stiffness: 130 },
  });

  const showNonna = frame >= 170;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.night,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '50px 80px',
        overflow: 'hidden',
      }}
    >
      {/* Title Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 35,
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: COLORS.stub,
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          DIRECT COMPARISON
        </div>
        <h2
          style={{
            fontFamily: FONTS.display,
            fontSize: 48,
            fontStyle: 'italic',
            fontWeight: 600,
            color: COLORS.cream,
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          Same question. Different night.
        </h2>
      </div>

      {/* Center User Question Ticket */}
      <div
        style={{
          transform: `translateY(${interpolate(userSpring, [0, 1], [-40, 0])}px)`,
          opacity: interpolate(userSpring, [0, 1], [0, 1]),
          marginBottom: 35,
          zIndex: 15,
        }}
      >
        <UserTurn
          text="I keep putting off the thing that actually matters."
          time="23:42"
        />
      </div>

      {/* Showdown Split Columns */}
      <div
        style={{
          display: 'flex',
          gap: 50,
          width: '100%',
          maxWidth: 1550,
          justifyContent: 'center',
          alignItems: 'flex-start',
          zIndex: 20,
        }}
      >
        {/* Left Column: Bland Generic AI */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            transform: `translateY(${interpolate(assistantSpring, [0, 1], [40, 0])}px)`,
            opacity: interpolate(assistantSpring, [0, 1], [0, 0.75]),
            position: 'relative',
          }}
        >
          <div
            style={{
              fontFamily: FONTS.sans,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: COLORS.inkSoft,
            }}
          >
            STANDARD AI CHATBOT
          </div>

          <div
            style={{
              backgroundColor: '#1E1B18',
              border: `1px solid ${COLORS.rule}`,
              borderRadius: 10,
              padding: '20px 24px',
              color: '#94A3B8',
              fontFamily: FONTS.sans,
              fontSize: 17,
              lineHeight: 1.5,
              position: 'relative',
            }}
          >
            <p style={{ margin: '0 0 10px 0' }}>
              That’s a very common human challenge! Delay can cause significant stress. Here are a few evidence-based tips:
            </p>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>1. Break your goal into micro-steps</li>
              <li>2. Try the Pomodoro technique</li>
              <li>3. Practice self-compassion and gentle kindness</li>
            </ul>
            <p style={{ margin: '10px 0 0 0', fontStyle: 'italic' }}>
              Remember, you are doing your best! I hope this helps! 😊
            </p>

            {/* Faded Stamp */}
            <div
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                border: `2px solid ${COLORS.acid}`,
                color: COLORS.acid,
                padding: '4px 10px',
                borderRadius: 4,
                fontFamily: FONTS.mono,
                fontSize: 12,
                fontWeight: 700,
                transform: 'rotate(-8deg)',
              }}
            >
              GENERIC HEDGE
            </div>
          </div>
        </div>

        {/* Right Column: Maya Street Cast Character */}
        <div
          style={{
            flex: 1.15,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            position: 'relative',
          }}
        >
          {!showNonna ? (
            // Marcus Turn
            <div
              style={{
                transform: `translateY(${interpolate(marcusSpring, [0, 1], [40, 0])}px) scale(${interpolate(
                  marcusSpring,
                  [0, 1],
                  [0.95, 1]
                )})`,
                opacity: interpolate(marcusSpring, [0, 1], [0, 1]),
                display: 'flex',
                gap: 18,
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 8,
                  overflow: 'hidden',
                  flexShrink: 0,
                  boxShadow: `3px 3px 0 ${COLORS.cream}`,
                }}
              >
                <Img
                  src={staticFile('avatars/marcus-stoic.jpg')}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <AgentTurn
                  agentName="MARCUS (THE SAVAGE STOIC)"
                  costume="marcus"
                  modelAlias="voice through grok-fast"
                  text="Delay is fear in a nicer shirt. The work is yours; the mood is not. Twenty ugly minutes. Right now."
                  time="23:42"
                />
              </div>
            </div>
          ) : (
            // Nonna Maria Turn
            <div
              style={{
                transform: `translateY(${interpolate(nonnaSpring, [0, 1], [40, 0])}px) scale(${interpolate(
                  nonnaSpring,
                  [0, 1],
                  [0.95, 1]
                )})`,
                opacity: interpolate(nonnaSpring, [0, 1], [0, 1]),
                display: 'flex',
                gap: 18,
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 8,
                  overflow: 'hidden',
                  flexShrink: 0,
                  boxShadow: `3px 3px 0 ${COLORS.cream}`,
                }}
              >
                <Img
                  src={staticFile('avatars/nonna-maria.jpg')}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <AgentTurn
                  agentName="NONNA MARIA (FIERCE ITALIAN GRANDMA)"
                  costume="nonna"
                  modelAlias="voice through claude"
                  text="You think the work will love you back if you starve for it? Sit down. I made sauce. Eat. Then we talk."
                  time="23:43"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Punchline Badge */}
      <div
        style={{
          marginTop: 40,
          zIndex: 30,
        }}
      >
        <HardTicket variant="acid" shadowOffset={5}>
          <div
            style={{
              fontFamily: FONTS.sans,
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: '0.04em',
              padding: '0 8px',
            }}
          >
            NOT A HELPDESK. CHARACTERS WITH REAL POINT OF VIEW.
          </div>
        </HardTicket>
      </div>
    </AbsoluteFill>
  );
};
