import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { loadFont as loadFraunces } from '@remotion/google-fonts/Fraunces';
import { loadFont as loadBricolage } from '@remotion/google-fonts/BricolageGrotesque';
import { loadFont as loadPlexMono } from '@remotion/google-fonts/IBMPlexMono';
import { NoiseGrain } from './components/NoiseGrain';
import { V2Sterile } from './v2/V2Sterile';
import { V2Switch } from './v2/V2Switch';
import { V2Montage } from './v2/V2Montage';
import { V2Explore } from './v2/V2Explore';
import { V2Studio } from './v2/V2Studio';
import { V2Free } from './v2/V2Free';
import { V2EndCard } from './v2/V2EndCard';

loadFraunces('italic', { weights: ['500', '600', '700'], subsets: ['latin'] });
loadBricolage('normal', { weights: ['400', '500', '700', '800'], subsets: ['latin'] });
loadPlexMono('normal', { weights: ['400', '700'], subsets: ['latin'] });

export const VIDEO2 = { w: 1920, h: 1080, fps: 30, frames: 1800 } as const;

// LaunchMuseV2 — "Same question. Different personality." 60s, drum-driven.
// Cuts land with the track: groove drops at f150, dropout slams into
// Studio (f990) and the end card (f1500), boom pulses the URL (f1759).
export const LaunchMuseV2: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile('audio/muse/drums.mp3')} volume={0.5} />
      <Sequence from={0} durationInFrames={150} name="Sterile">
        <V2Sterile />
      </Sequence>
      <Sequence from={150} durationInFrames={120} name="Switch">
        <V2Switch />
      </Sequence>
      <Sequence from={270} durationInFrames={360} name="Montage">
        <V2Montage />
      </Sequence>
      <Sequence from={630} durationInFrames={360} name="Explore">
        <V2Explore />
      </Sequence>
      <Sequence from={990} durationInFrames={240} name="Studio">
        <V2Studio />
      </Sequence>
      <Sequence from={1230} durationInFrames={270} name="Free">
        <V2Free />
      </Sequence>
      <Sequence from={1500} durationInFrames={300} name="EndCard">
        <V2EndCard />
      </Sequence>
      <NoiseGrain />
    </AbsoluteFill>
  );
};
