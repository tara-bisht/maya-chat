import React from 'react';
import { Composition } from 'remotion';
import { LaunchMuse, VIDEO } from './LaunchMuse';
import { LaunchMuseV2, VIDEO2 } from './LaunchMuseV2';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LaunchMuse"
        component={LaunchMuse}
        durationInFrames={VIDEO.frames}
        width={VIDEO.w}
        height={VIDEO.h}
        fps={VIDEO.fps}
        defaultProps={{}}
      />
      <Composition
        id="LaunchMuseV2"
        component={LaunchMuseV2}
        durationInFrames={VIDEO2.frames}
        width={VIDEO2.w}
        height={VIDEO2.h}
        fps={VIDEO2.fps}
        defaultProps={{}}
      />
    </>
  );
};
