import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {colors, radii} from '../../theme';
import {fontDisplay, fontSans} from '../../fonts';
import {clampInterp, paperSlap, typeText} from '../../motion';
import {NIGHT_REPLIES, PROMPT, STUDIO} from '../copy';
import {RHEA} from '../roster';
import {LobbyShell} from '../components/LobbyShell';
import {ChatShell} from '../components/ChatShell';
import {AgentWash, UserTicket} from '../components/Bubbles';
import {Pointer} from '../components/Pointer';

const COSTUMES: Array<{id: string; color: string; label: string}> = [
  {id: 'marcus', color: colors.costume.marcus, label: 'Marcus moss'},
  {id: 'priya', color: colors.costume.priya, label: 'Priya magenta'},
  {id: 'alex', color: colors.costume.alex, label: 'Alex espresso'},
  {id: 'custom', color: colors.costume.custom, label: 'Custom brown'},
  {id: 'nonna', color: colors.costume.nonna, label: 'Nonna tomato'},
];

export const Studio: React.FC<{durationInFrames: number}> = () => {
  const frame = useCurrentFrame();
  const revealChat = frame >= 118;
  const name = typeText(STUDIO.name, frame, 16, 0.55);
  const tagline = typeText(STUDIO.tagline, frame, 36, 1.4);
  const backstory = typeText(STUDIO.backstory, frame, 58, 1.8);
  const warmth = clampInterp(frame, [70, 90], [0.08, STUDIO.warmth]);
  const directness = clampInterp(frame, [74, 96], [0.08, STUDIO.directness]);
  const humor = clampInterp(frame, [78, 100], [0.08, STUDIO.humor]);
  const costumeOn = frame >= 64;
  const btnPress = clampInterp(frame, [108, 114, 122], [0, 1, 0]);
  const formPop = paperSlap(frame, 30, 4);
  const localChat = frame - 118;
  const rheaTyped = typeText(NIGHT_REPLIES.rhea, localChat, 6, 2.4);
  const streaming = revealChat && rheaTyped.length < NIGHT_REPLIES.rhea.length;

  if (revealChat) {
    return (
      <AbsoluteFill>
        <ChatShell
          player={{id: RHEA.id, shortName: RHEA.shortName, color: RHEA.color, tagline: RHEA.tagline}}
          url="getmaya.chat/chat/rhea"
          composer=""
          placeholder="Rhea is listening."
          extraRail
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 18,
              backgroundColor: RHEA.color,
            }}
          />
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              gap: 18,
              padding: '28px 18% 24px',
            }}
          >
            <UserTicket text={PROMPT} />
            <AgentWash
              name={RHEA.shortName}
              text={rheaTyped}
              color={RHEA.color}
              streaming={streaming}
            />
          </div>
        </ChatShell>
        <Stamp label="Yours" rotate={-8} top={136} right={36} />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      <LobbyShell url="getmaya.chat/studio/new" active="create">
        <div style={{padding: '28px 48px', display: 'flex', gap: 36, height: '100%'}}>
          <div style={{flex: 1.15}}>
            <p
              style={{
                margin: 0,
                fontFamily: fontSans,
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: colors.stub,
              }}
            >
              {STUDIO.kicker}
            </p>
            <h2
              style={{
                margin: '8px 0 0',
                fontFamily: fontDisplay,
                fontStyle: 'italic',
                fontSize: 52,
                letterSpacing: '-0.04em',
                color: colors.cream,
                transform: `translateY(${interpolate(formPop, [0, 1], [16, 0])}px)`,
              }}
            >
              {STUDIO.title}
            </h2>
            <div
              style={{
                marginTop: 22,
                backgroundColor: colors.cream,
                color: colors.night,
                borderRadius: radii.md,
                padding: 28,
                boxShadow: `8px 8px 0 ${colors.acid}`,
              }}
            >
              <Field label="Name" value={name} caret={frame < 34} />
              <Field label="Tagline" value={tagline} caret={frame >= 36 && frame < 70} />
              <Field label="Backstory" value={backstory} caret={frame >= 58 && frame < 88} />
              <p
                style={{
                  margin: '14px 0 8px',
                  fontFamily: fontSans,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  opacity: 0.55,
                }}
              >
                Costume
              </p>
              <div style={{display: 'flex', gap: 8}}>
                {COSTUMES.map((entry) => {
                  const on = costumeOn && entry.id === 'custom';
                  return (
                    <div
                      key={entry.id}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 4,
                        backgroundColor: entry.color,
                        boxShadow: on ? `0 0 0 3px ${colors.night}, 0 0 0 6px ${colors.acid}` : undefined,
                        transform: `scale(${on ? 1.15 : 1})`,
                      }}
                    />
                  );
                })}
              </div>
              <Slider label="Warmth" value={warmth} />
              <Slider label="Directness" value={directness} />
              <Slider label="Humor" value={humor} />
              <div
                style={{
                  marginTop: 18,
                  height: 48,
                  borderRadius: radii.md,
                  backgroundColor: colors.acid,
                  color: colors.onAcid,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: fontSans,
                  fontSize: 16,
                  fontWeight: 600,
                  boxShadow: `4px 4px 0 ${colors.night}`,
                  transform: `scale(${1 - btnPress * 0.08})`,
                }}
              >
                {STUDIO.save}
              </div>
            </div>
          </div>
          <div style={{width: 360, paddingTop: 92, opacity: clampInterp(frame, [24, 40], [0, 1])}}>
            <p
              style={{
                margin: 0,
                fontFamily: fontSans,
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: colors.inkSoft,
              }}
            >
              Preview
            </p>
            <div
              style={{
                marginTop: 12,
                backgroundColor: colors.costume.custom,
                color: colors.cream,
                borderRadius: radii.md,
                padding: 20,
                minHeight: 220,
                boxShadow: `6px 6px 0 ${colors.cream}`,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily: fontDisplay,
                  fontStyle: 'italic',
                  fontSize: 40,
                }}
              >
                {name || ' '}
              </p>
              <p style={{margin: '10px 0 0', fontFamily: fontSans, fontSize: 16, lineHeight: 1.4}}>
                {tagline}
              </p>
            </div>
          </div>
        </div>
      </LobbyShell>
      <Pointer
        x={interpolate(frame, [96, 108], [620, 760], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
        y={interpolate(frame, [96, 108], [820, 868], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
        pressed={btnPress}
        opacity={clampInterp(frame, [94, 102, 116, 124], [0, 1, 1, 0])}
      />
    </AbsoluteFill>
  );
};

const Field: React.FC<{label: string; value: string; caret?: boolean}> = ({
  label,
  value,
  caret,
}) => {
  return (
    <label style={{display: 'block', marginBottom: 12}}>
      <span
        style={{
          display: 'block',
          fontFamily: fontSans,
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          opacity: 0.55,
          marginBottom: 6,
        }}
      >
        {label}
      </span>
      <div
        style={{
          minHeight: 40,
          borderRadius: radii.md,
          border: '1px solid rgba(20,17,15,0.2)',
          backgroundColor: colors.cream,
          padding: '8px 12px',
          fontFamily: fontSans,
          fontSize: 16,
        }}
      >
        {value}
        {caret ? (
          <span style={{display: 'inline-block', width: 2, height: 16, backgroundColor: colors.night, marginLeft: 2}} />
        ) : null}
      </div>
    </label>
  );
};

const Slider: React.FC<{label: string; value: number}> = ({label, value}) => {
  return (
    <div style={{marginTop: 12}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: fontSans, fontSize: 12, fontWeight: 600}}>
        <span>{label}</span>
        <span>{value.toFixed(2)}</span>
      </div>
      <div
        style={{
          marginTop: 6,
          height: 8,
          borderRadius: 99,
          backgroundColor: 'rgba(20,17,15,0.12)',
          overflow: 'hidden',
        }}
      >
        <div style={{width: `${value * 100}%`, height: '100%', backgroundColor: colors.acid}} />
      </div>
    </div>
  );
};

const Stamp: React.FC<{label: string; rotate: number; top: number; right: number}> = ({
  label,
  rotate,
  top,
  right,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top,
        right,
        padding: '8px 12px',
        backgroundColor: colors.stub,
        color: colors.onStub,
        fontFamily: fontSans,
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        transform: `rotate(${rotate}deg)`,
        boxShadow: `3px 3px 0 ${colors.cream}`,
      }}
    >
      {label}
    </div>
  );
};
