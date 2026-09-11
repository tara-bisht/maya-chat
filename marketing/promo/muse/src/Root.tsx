import React from 'react';
import { Composition } from 'remotion';
import { LaunchMuse, VIDEO } from './LaunchMuse';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="LaunchMuse"
      component={LaunchMuse}
      durationInFrames={VIDEO.frames}
      width={VIDEO.w}
      height={VIDEO.h}
      fps={VIDEO.fps}
      defaultProps={{}}
    />
  );
};
