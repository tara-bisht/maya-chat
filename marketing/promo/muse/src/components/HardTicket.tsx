import React from 'react';
import { COLORS, FONTS } from '../constants/theme';

interface HardTicketProps {
  children: React.ReactNode;
  variant?: 'cream' | 'stub' | 'acid';
  shadowColor?: string;
  shadowOffset?: number;
  rotation?: number;
  style?: React.CSSProperties;
}

// Hard-offset ticket (paywall/auth/footer language from DESIGN.md).
export const HardTicket: React.FC<HardTicketProps> = ({
  children,
  variant = 'cream',
  shadowColor,
  shadowOffset = 6,
  rotation = 0,
  style,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'stub':
        return {
          bg: COLORS.stub,
          text: COLORS.onStub,
          border: `2px dashed ${COLORS.night}`,
          shadow: shadowColor || COLORS.acid,
        };
      case 'acid':
        return {
          bg: COLORS.acid,
          text: COLORS.onAcid,
          border: 'none',
          shadow: shadowColor || COLORS.cream,
        };
      case 'cream':
      default:
        return {
          bg: COLORS.cream,
          text: COLORS.night,
          border: `2px solid ${COLORS.night}`,
          shadow: shadowColor || COLORS.acid,
        };
    }
  };

  const { bg, text, border, shadow } = getColors();

  return (
    <div
      style={{
        backgroundColor: bg,
        color: text,
        border,
        borderRadius: 10,
        boxShadow: `${shadowOffset}px ${shadowOffset}px 0 ${shadow}`,
        transform: `rotate(${rotation}deg)`,
        fontFamily: FONTS.sans,
        padding: '16px 22px',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
