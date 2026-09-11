import React from 'react';
import { Composition } from 'remotion';
import { LaunchMuse } from './muse/LaunchMuse';
import { LaunchMuseV2 } from './muse/LaunchMuseV2';
import { MayaLaunch } from './gemini/MayaLaunch';
import { MayaLaunchV2 } from './gemini/MayaLaunchV2';
import { LaunchGrok } from './grok/LaunchGrok';
import { LaunchGrokV2 } from './grok/v2/LaunchGrokV2';

export const Root: React.FC = () => {
  return (
    <>
      {/* Muse Compositions (60s @ 30fps) */}
      <Composition
        id="LaunchMuse"
        component={LaunchMuse}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LaunchMuseV2"
        component={LaunchMuseV2}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Gemini Compositions (MayaLaunch: 45s, MayaLaunchV2: 38s @ 30fps) */}
      <Composition
        id="MayaLaunch"
        component={MayaLaunch}
        durationInFrames={1350}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="MayaLaunchV2"
        component={MayaLaunchV2}
        durationInFrames={1140}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Grok Compositions (LaunchGrok: 45s, LaunchGrokV2: 40s @ 30fps) */}
      <Composition
        id="LaunchGrok"
        component={LaunchGrok}
        durationInFrames={1350}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LaunchGrokV2"
        component={LaunchGrokV2}
        durationInFrames={1200}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
