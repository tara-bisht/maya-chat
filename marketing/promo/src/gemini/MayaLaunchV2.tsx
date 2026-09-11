import React from 'react';
import { AbsoluteFill, Sequence, Audio, staticFile } from 'remotion';
import { COLORS } from './constants/theme';
import { NoiseGrain } from './components/NoiseGrain';
import { Scene1_SterileChat } from './scenes/v2/Scene1_SterileChat';
import { Scene2_MultiPersonalityChat } from './scenes/v2/Scene2_MultiPersonalityChat';
import { Scene3_ExploreAgents } from './scenes/v2/Scene3_ExploreAgents';
import { Scene4_StudioCustom } from './scenes/v2/Scene4_StudioCustom';
import { Scene5_OutroGetMaya } from './scenes/v2/Scene5_OutroGetMaya';

export const MayaLaunchV2: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.night, overflow: 'hidden' }}>
      <style>{`
        * {
          box-sizing: border-box;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>

      {/* Standard Fast-Paced Drum Promo Music Track */}
      <Audio src={staticFile('audio/gemini/drums-soundtrack.mp3')} volume={0.85} />

      {/* 7% Film Grain Overlay */}
      <NoiseGrain />

      {/* Act 1: The Sterile Baseline Chat (0 - 150 / 0s - 5s) */}
      <Sequence from={0} durationInFrames={150} name="Act 1: Sterile Chat">
        <Scene1_SterileChat />
      </Sequence>

      {/* Act 2: Multi-Personality Chat View (150 - 480 / 5s - 16s) */}
      <Sequence from={150} durationInFrames={330} name="Act 2: Multi-Personality Chat">
        <Scene2_MultiPersonalityChat />
      </Sequence>

      {/* Act 3: Explore 100s of In-Built Agents (480 - 720 / 16s - 24s) */}
      <Sequence from={480} durationInFrames={240} name="Act 3: Explore 100s Agents">
        <Scene3_ExploreAgents />
      </Sequence>

      {/* Act 4: Create Custom Agents in Studio (720 - 930 / 24s - 31s) */}
      <Sequence from={720} durationInFrames={210} name="Act 4: Studio Custom Agents">
        <Scene4_StudioCustom />
      </Sequence>

      {/* Act 5: Try for Free & getmaya.chat (930 - 1140 / 31s - 38s) */}
      <Sequence from={930} durationInFrames={210} name="Act 5: Try for Free & CTA">
        <Scene5_OutroGetMaya />
      </Sequence>
    </AbsoluteFill>
  );
};
