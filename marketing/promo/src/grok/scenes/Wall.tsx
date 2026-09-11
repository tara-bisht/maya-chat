import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Kicker} from '../components/Kicker';
import {PlaybillPoster} from '../components/PlaybillPoster';
import {COMPANY} from '../company';
import {WALL} from '../copy';
import {fadeInOut, paperSlap} from '../motion';

const LAYOUT = [
  {x: 64, y: 248, z: 1},
  {x: 532, y: 214, z: 3},
  {x: 1000, y: 258, z: 2},
  {x: 1468, y: 222, z: 4},
  {x: 104, y: 590, z: 5},
  {x: 572, y: 624, z: 7},
  {x: 1040, y: 572, z: 6},
  {x: 1508, y: 608, z: 8},
] as const;

export const Wall: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = fadeInOut(frame, durationInFrames, 10, 16);
  const heading = paperSlap(frame, fps, 0);
  const dolly = interpolate(frame, [0, durationInFrames], [1.045, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{opacity, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${dolly})`,
          transformOrigin: '50% 48%',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 64,
            top: 36,
            opacity: Math.min(1, heading),
            transform: `translateY(${(1 - heading) * 20}px)`,
          }}
        >
          <Kicker kicker={WALL.kicker} title={WALL.title} body={WALL.body} />
        </div>
        {COMPANY.map((player, index) => {
          const slot = LAYOUT[index];
          const enter = paperSlap(frame, fps, 18 + index * 8);
          return (
            <div
              key={player.id}
              style={{
                position: 'absolute',
                left: slot.x,
                top: slot.y,
                zIndex: slot.z,
                transform: `translateY(${(1 - enter) * 90}px) rotate(${player.tilt}deg) scale(${0.82 + enter * 0.18})`,
                opacity: Math.min(1, enter),
              }}
            >
              <PlaybillPoster player={player} width={318} compact />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
