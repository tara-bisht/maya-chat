import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {Grain} from '../components/Grain';
import {colors} from '../theme';
import {ACTS} from './timing';
import {Sterile} from './scenes/Sterile';
import {Smash} from './scenes/Smash';
import {Personality} from './scenes/Personality';
import {Explore} from './scenes/Explore';
import {Studio} from './scenes/Studio';
import {Finale} from './scenes/Finale';
import {AcidWipe} from './components/AcidWipe';

const CUTS = [600, 840, 1020];

export const LaunchGrokV2: React.FC = () => {
  const frame = useCurrentFrame();
  const volume = interpolate(frame, [0, 8, 1140, 1196], [0, 0.86, 0.86, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: colors.night}}>
      <Audio src={staticFile('audio/grok/drums.mp3')} volume={volume} />
      <Sequence from={ACTS.sterile.from} durationInFrames={ACTS.sterile.duration} name="Sterile" premountFor={8}>
        <Sterile durationInFrames={ACTS.sterile.duration} />
      </Sequence>
      <Sequence
        from={ACTS.personality.from}
        durationInFrames={ACTS.personality.duration}
        name="Personality"
        premountFor={16}
      >
        <Personality durationInFrames={ACTS.personality.duration} />
      </Sequence>
      <Sequence from={ACTS.smash.from} durationInFrames={ACTS.smash.duration} name="Wipe" premountFor={4}>
        <AcidWipe durationInFrames={ACTS.smash.duration} />
      </Sequence>
      <Sequence from={ACTS.smash.from} durationInFrames={ACTS.smash.duration} name="Smash" premountFor={4}>
        <Smash durationInFrames={ACTS.smash.duration} />
      </Sequence>
      <Sequence from={ACTS.explore.from} durationInFrames={ACTS.explore.duration} name="Explore" premountFor={20}>
        <Explore durationInFrames={ACTS.explore.duration} />
      </Sequence>
      <Sequence from={ACTS.studio.from} durationInFrames={ACTS.studio.duration} name="Studio" premountFor={16}>
        <Studio durationInFrames={ACTS.studio.duration} />
      </Sequence>
      <Sequence from={ACTS.finale.from} durationInFrames={ACTS.finale.duration} name="Finale" premountFor={12}>
        <Finale durationInFrames={ACTS.finale.duration} />
      </Sequence>
      {CUTS.map((cut) => {
        const delta = Math.abs(frame - cut);
        if (delta > 3) {
          return null;
        }
        return (
          <AbsoluteFill
            key={cut}
            style={{
              backgroundColor: colors.acid,
              opacity: interpolate(delta, [0, 3], [0.32, 0]),
              pointerEvents: 'none',
            }}
          />
        );
      })}
      <Grain />
    </AbsoluteFill>
  );
};
