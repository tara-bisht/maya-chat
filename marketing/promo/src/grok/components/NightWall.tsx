import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';

const WASHES: Array<{
  color: string;
  left: string;
  top: string;
  width: string;
  height: string;
  rotate: number;
  drift: number;
}> = [
  {color: colors.costume.marcus, left: '-8%', top: '4%', width: '42%', height: '58%', rotate: -14, drift: 18},
  {color: colors.costume.priya, left: '58%', top: '-10%', width: '48%', height: '52%', rotate: 11, drift: -16},
  {color: colors.costume.valerian, left: '18%', top: '48%', width: '36%', height: '50%', rotate: 8, drift: 12},
  {color: colors.costume.nonna, left: '62%', top: '46%', width: '44%', height: '56%', rotate: -9, drift: -10},
  {color: colors.costume.barnaby, left: '-6%', top: '62%', width: '28%', height: '40%', rotate: 16, drift: 8},
];

export const NightWall: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{backgroundColor: colors.night, overflow: 'hidden'}}>
      {WASHES.map((wash, index) => {
        const y = interpolate(frame, [0, 1350], [0, wash.drift], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: wash.left,
              top: wash.top,
              width: wash.width,
              height: wash.height,
              backgroundColor: wash.color,
              opacity: 0.13,
              borderRadius: 10,
              transform: `translateY(${y}px) rotate(${wash.rotate}deg)`,
            }}
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(1200px 700px at 50% 40%, rgba(20,17,15,0.15), rgba(20,17,15,0.72))',
        }}
      />
    </AbsoluteFill>
  );
};
