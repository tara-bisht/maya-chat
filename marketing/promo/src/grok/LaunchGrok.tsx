import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {NightWall} from './components/NightWall';
import {Grain} from './components/Grain';
import {Wordmark} from './components/Wordmark';
import {Sting} from './scenes/Sting';
import {Hook} from './scenes/Hook';
import {Hero} from './scenes/Hero';
import {Wall} from './scenes/Wall';
import {Contrast} from './scenes/Contrast';
import {Finale} from './scenes/Finale';
import {ACTS} from './theme';
import {useCurrentFrame} from 'remotion';
import {clampInterp} from './motion';

const Chrome: React.FC = () => {
  const frame = useCurrentFrame();
  const show = clampInterp(frame, [100, 118, 430, 448], [0, 1, 1, 0]);
  return (
    <div
      style={{
        position: 'absolute',
        top: 28,
        left: 40,
        zIndex: 8,
        opacity: show,
      }}
    >
      <Wordmark size={36} />
    </div>
  );
};

export const LaunchGrok: React.FC = () => {
  return (
    <AbsoluteFill>
      <NightWall />
      <Sequence from={ACTS.sting.from} durationInFrames={ACTS.sting.duration} name="Sting" premountFor={8}>
        <Sting durationInFrames={ACTS.sting.duration} />
      </Sequence>
      <Sequence from={ACTS.hook.from} durationInFrames={ACTS.hook.duration} name="Hook" premountFor={12}>
        <Hook durationInFrames={ACTS.hook.duration} />
      </Sequence>
      <Sequence from={ACTS.hero.from} durationInFrames={ACTS.hero.duration} name="Hero" premountFor={16}>
        <Hero durationInFrames={ACTS.hero.duration} />
      </Sequence>
      <Sequence from={ACTS.wall.from} durationInFrames={ACTS.wall.duration} name="Wall" premountFor={20}>
        <Wall durationInFrames={ACTS.wall.duration} />
      </Sequence>
      <Sequence from={ACTS.contrast.from} durationInFrames={ACTS.contrast.duration} name="Contrast" premountFor={20}>
        <Contrast durationInFrames={ACTS.contrast.duration} />
      </Sequence>
      <Sequence from={ACTS.finale.from} durationInFrames={ACTS.finale.duration} name="Finale" premountFor={16}>
        <Finale durationInFrames={ACTS.finale.duration} />
      </Sequence>
      <Chrome />
      <Grain />
    </AbsoluteFill>
  );
};
