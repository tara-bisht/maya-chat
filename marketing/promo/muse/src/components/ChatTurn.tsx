import React from 'react';
import { COLORS, FONTS, CostumeKey } from '../constants/theme';

interface UserTurnProps {
  text: string;
  time?: string;
  style?: React.CSSProperties;
}

// Cream user ticket with acid offset (docs/DESIGN.md chat-message-user).
export const UserTurn: React.FC<UserTurnProps> = ({
  text,
  time = '23:42',
  style,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        maxWidth: 650,
        ...style,
      }}
    >
      <div
        style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}
      >
        <span
          style={{
            fontFamily: FONTS.sans,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: COLORS.cream,
          }}
        >
          YOU
        </span>
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: 11,
            color: COLORS.inkSoft,
          }}
        >
          {time}
        </span>
      </div>
      <div
        style={{
          backgroundColor: COLORS.cream,
          color: COLORS.night,
          fontFamily: FONTS.sans,
          fontSize: 18,
          lineHeight: 1.45,
          fontWeight: 500,
          padding: '14px 20px',
          borderRadius: 10,
          boxShadow: `4px 4px 0 ${COLORS.acid}`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

interface AgentTurnProps {
  agentName: string;
  costume: CostumeKey;
  text: string;
  modelAlias?: string;
  time?: string;
  style?: React.CSSProperties;
}

// Agent turn on costume wash (docs/DESIGN.md chat-message-agent).
export const AgentTurn: React.FC<AgentTurnProps> = ({
  agentName,
  costume,
  text,
  modelAlias,
  time = '23:42',
  style,
}) => {
  const costumeColor = COLORS.costumes[costume] || COLORS.costumes.marcus;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        maxWidth: 720,
        ...style,
      }}
    >
      <div
        style={{ display: 'flex', gap: 12, alignItems: 'baseline', marginBottom: 6 }}
      >
        <span
          style={{
            fontFamily: FONTS.sans,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: COLORS.cream,
            textTransform: 'uppercase',
          }}
        >
          {agentName}
        </span>
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: 12,
            color: COLORS.inkSoft,
          }}
        >
          {modelAlias ? `${modelAlias} · ${time}` : time}
        </span>
      </div>
      <div
        style={{
          backgroundColor: costumeColor,
          color: COLORS.cream,
          fontFamily: FONTS.sans,
          fontSize: 19,
          lineHeight: 1.5,
          fontWeight: 400,
          padding: '16px 22px',
          borderRadius: 10,
          borderLeft: `8px solid ${COLORS.cream}`,
        }}
      >
        {text}
      </div>
    </div>
  );
};
