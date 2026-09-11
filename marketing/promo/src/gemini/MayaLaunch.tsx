import React from 'react';
import { AbsoluteFill, Sequence, Audio, staticFile } from 'remotion';
import { COLORS } from './constants/theme';
import { NoiseGrain } from './components/NoiseGrain';
import { Scene1_SterileContrast } from './scenes/Scene1_SterileContrast';
import { Scene2_CompanyLineup } from './scenes/Scene2_CompanyLineup';
import { Scene3_DialogueShowdown } from './scenes/Scene3_DialogueShowdown';
import { Scene4_StudioCraft } from './scenes/Scene4_StudioCraft';
import { Scene5_EngineMemory } from './scenes/Scene5_EngineMemory';
import { Scene6_OutroHouseOpen } from './scenes/Scene6_OutroHouseOpen';

export const MayaLaunch: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.night, overflow: 'hidden' }}>
      <style>{`
        * {
          box-sizing: border-box;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>

      {/* Audio Soundtrack */}
      <Audio src={staticFile('audio/gemini/soundtrack.mp3')} volume={0.8} />

      {/* 7% Tactile Film Grain Overlay (stays on top across whole video) */}
      <NoiseGrain />

      {/* Scene 1: The Sterile AI Contrast (0 - 210 / 0s - 7s) */}
      <Sequence from={0} durationInFrames={210} name="Scene 1: Sterile AI Contrast">
        <Scene1_SterileContrast />
      </Sequence>

      {/* Scene 2: The Touring Repertory Lineup (210 - 510 / 7s - 17s) */}
      <Sequence from={210} durationInFrames={300} name="Scene 2: Company Lineup">
        <Scene2_CompanyLineup />
      </Sequence>

      {/* Scene 3: Showdown: Same Question. Different Night. (510 - 810 / 17s - 27s) */}
      <Sequence from={510} durationInFrames={300} name="Scene 3: Dialogue Showdown">
        <Scene3_DialogueShowdown />
      </Sequence>

      {/* Scene 4: Character Studio: Write The Personality (810 - 1080 / 27s - 36s) */}
      <Sequence from={810} durationInFrames={270} name="Scene 4: Studio Craft">
        <Scene4_StudioCraft />
      </Sequence>

      {/* Scene 5: Engine & Episodic Memory (1080 - 1230 / 36s - 41s) */}
      <Sequence from={1080} durationInFrames={150} name="Scene 5: Engine & Memory">
        <Scene5_EngineMemory />
      </Sequence>

      {/* Scene 6: Outro & The House is Open (1230 - 1350 / 41s - 45s) */}
      <Sequence from={1230} durationInFrames={120} name="Scene 6: Outro House Open">
        <Scene6_OutroHouseOpen />
      </Sequence>
    </AbsoluteFill>
  );
};
