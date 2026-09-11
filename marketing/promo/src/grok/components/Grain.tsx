import React from 'react';
import {AbsoluteFill} from 'remotion';

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export const Grain: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        opacity: 0.08,
        backgroundImage: GRAIN,
        backgroundRepeat: 'repeat',
        backgroundSize: '220px 220px',
      }}
    />
  );
};
