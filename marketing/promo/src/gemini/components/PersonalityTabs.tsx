import React from 'react';
import { COLORS, FONTS } from '../constants/theme';

interface PersonalityTabsProps {
  activeId: 'marcus' | 'alex' | 'nonna';
  style?: React.CSSProperties;
}

export const PersonalityTabs: React.FC<PersonalityTabsProps> = ({
  activeId,
  style,
}) => {
  const tabs = [
    { id: 'marcus', name: 'Marcus', desc: 'The Savage Stoic', color: COLORS.costumes.marcus },
    { id: 'alex', name: 'Alex', desc: '10x Tech Lead', color: COLORS.costumes.alex },
    { id: 'nonna', name: 'Nonna Maria', desc: 'Fierce Care', color: COLORS.costumes.nonna },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#1C1815',
        padding: '6px 8px',
        borderRadius: 10,
        border: `1px solid ${COLORS.rule}`,
        ...style,
      }}
    >
      <span
        style={{
          fontFamily: FONTS.sans,
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: '0.06em',
          color: COLORS.inkSoft,
          padding: '0 8px',
          textTransform: 'uppercase',
        }}
      >
        PERSONALITY:
      </span>

      {tabs.map((tab) => {
        const isActive = activeId === tab.id;

        return (
          <div
            key={tab.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 6,
              backgroundColor: isActive ? tab.color : 'transparent',
              color: isActive ? COLORS.cream : COLORS.creamDim,
              border: isActive ? `1px solid ${COLORS.cream}` : '1px solid transparent',
              boxShadow: isActive ? `3px 3px 0 ${COLORS.night}` : 'none',
              fontFamily: FONTS.sans,
              fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              transition: 'all 0.2s ease',
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: isActive ? COLORS.stub : tab.color,
              }}
            />
            <span>{tab.name}</span>
            <span style={{ fontSize: 11, opacity: 0.75 }}>({tab.desc})</span>
          </div>
        );
      })}
    </div>
  );
};
