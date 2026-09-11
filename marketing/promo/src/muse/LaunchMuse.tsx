import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { loadFont as loadFraunces } from '@remotion/google-fonts/Fraunces';
import { loadFont as loadBricolage } from '@remotion/google-fonts/BricolageGrotesque';
import { loadFont as loadPlexMono } from '@remotion/google-fonts/IBMPlexMono';
import { COLORS } from './constants/theme';
import { NoiseGrain } from './components/NoiseGrain';
import { SceneHook } from './scenes/SceneHook';
import { SceneUsual } from './scenes/SceneUsual';
import { SceneCompany } from './scenes/SceneCompany';
import { SceneStudio } from './scenes/SceneStudio';
import { SceneHouseChat } from './scenes/SceneHouseChat';
import { SceneSeats } from './scenes/SceneSeats';

loadFraunces('italic', { weights: ['500', '600'], subsets: ['latin'] });
loadBricolage('normal', { weights: ['400', '600', '800'], subsets: ['latin'] });
loadPlexMono('normal', { weights: ['400'], subsets: ['latin'] });

export const VIDEO = { w: 1920, h: 1080, fps: 30, frames: 1800 } as const;

// LaunchMuse: 60s general Maya Chat launch with synthesized ambient score.
export const LaunchMuse: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.night }}>
      <Audio src={staticFile('audio/muse/music.mp3')} volume={0.35} />
      <Sequence from={0} durationInFrames={180} name="Hook">
        <SceneHook />
      </Sequence>
      <Sequence from={180} durationInFrames={300} name="Usual">
        <SceneUsual />
      </Sequence>
      <Sequence from={480} durationInFrames={480} name="Company">
        <SceneCompany />
      </Sequence>
      <Sequence from={960} durationInFrames={240} name="Studio">
        <SceneStudio />
      </Sequence>
      <Sequence from={1200} durationInFrames={360} name="HouseChat">
        <SceneHouseChat />
      </Sequence>
      <Sequence from={1560} durationInFrames={240} name="Seats">
        <SceneSeats />
      </Sequence>
      <NoiseGrain />
    </AbsoluteFill>
  );
};
