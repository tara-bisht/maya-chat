import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {fontMono, fontSans} from '../../fonts';
import {clampInterp, paperSlap, typeText} from '../../motion';
import {PROMPT, STERILE_KICKER, STERILE_REPLY} from '../copy';
import {BrowserChrome} from '../components/BrowserChrome';
import {Caret} from '../components/Caret';
import {Pointer} from '../components/Pointer';

const BG = '#F4F4F5';
const INK = '#18181B';
const MUTED = '#71717A';
const BUBBLE = '#E4E4E7';

export const Sterile: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const userTyped = typeText(PROMPT, frame, 18, 1.6);
  const sent = frame >= 70;
  const replyStart = 82;
  const reply = STERILE_REPLY.join('\n');
  const replyTyped = sent ? typeText(reply, frame, replyStart, 3.4) : '';
  const streaming = sent && replyTyped.length < reply.length;
  const sendPress = clampInterp(frame, [66, 70, 78], [0, 1, 0]);
  const userY = interpolate(paperSlap(frame, 30, 70), [0, 1], [18, 0]);
  const stamp = clampInterp(frame, [8, 22], [0, 1]);
  const fade = clampInterp(frame, [durationInFrames - 18, durationInFrames], [1, 0]);

  return (
    <AbsoluteFill style={{backgroundColor: BG, opacity: fade}}>
      <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
        <BrowserChrome url="assistant.app/chat" night={false} />
        <div style={{flex: 1, display: 'flex', minHeight: 0}}>
          <aside
            style={{
              width: 248,
              backgroundColor: '#FFFFFF',
              borderRight: '1px solid #E4E4E7',
              padding: 18,
            }}
          >
            <p style={{margin: 0, fontFamily: fontSans, fontSize: 15, fontWeight: 600, color: INK}}>
              New chat
            </p>
            <p style={{margin: '18px 0 0', fontFamily: fontSans, fontSize: 13, color: MUTED}}>
              Today
            </p>
            <p style={{margin: '8px 0 0', fontFamily: fontSans, fontSize: 14, color: INK}}>
              Productivity tips
            </p>
            <p style={{margin: '10px 0 0', fontFamily: fontSans, fontSize: 14, color: MUTED}}>
              Explain compounding
            </p>
            <p style={{margin: '10px 0 0', fontFamily: fontSans, fontSize: 14, color: MUTED}}>
              Draft an email
            </p>
          </aside>
          <section style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
            <header
              style={{
                height: 58,
                borderBottom: '1px solid #E4E4E7',
                display: 'flex',
                alignItems: 'center',
                padding: '0 28px',
                fontFamily: fontSans,
                fontSize: 15,
                fontWeight: 600,
                color: INK,
              }}
            >
              Assistant
            </header>
            <div
              style={{
                flex: 1,
                padding: '36px 18%',
                display: 'flex',
                flexDirection: 'column',
                gap: 22,
              }}
            >
              {sent ? (
                <div
                  style={{
                    alignSelf: 'flex-end',
                    maxWidth: '78%',
                    backgroundColor: BUBBLE,
                    color: INK,
                    borderRadius: 18,
                    padding: '12px 16px',
                    fontFamily: fontSans,
                    fontSize: 20,
                    lineHeight: 1.45,
                    transform: `translateY(${userY}px)`,
                  }}
                >
                  {PROMPT}
                </div>
              ) : null}
              {sent ? (
                <div style={{display: 'flex', gap: 12}}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 99,
                      backgroundColor: '#D4D4D8',
                      flexShrink: 0,
                      marginTop: 4,
                    }}
                  />
                  <p
                    style={{
                      margin: 0,
                      fontFamily: fontSans,
                      fontSize: 20,
                      lineHeight: 1.5,
                      color: INK,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {replyTyped}
                    {streaming ? <Caret color={INK} /> : null}
                  </p>
                </div>
              ) : (
                <p
                  style={{
                    margin: 'auto',
                    fontFamily: fontSans,
                    fontSize: 28,
                    color: MUTED,
                    textAlign: 'center',
                  }}
                >
                  How can I help you today?
                </p>
              )}
            </div>
            <div style={{padding: '0 18% 28px'}}>
              <div
                style={{
                  minHeight: 52,
                  borderRadius: 26,
                  border: '1px solid #D4D4D8',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 8px 0 18px',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    flex: 1,
                    fontFamily: fontSans,
                    fontSize: 16,
                    color: sent ? MUTED : INK,
                  }}
                >
                  {sent ? 'Message Assistant…' : userTyped}
                  {!sent ? <Caret color={INK} height={16} /> : null}
                </span>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 99,
                    backgroundColor: sent ? '#D4D4D8' : INK,
                    transform: `scale(${1 - sendPress * 0.12})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: 16,
                  }}
                >
                  ↑
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 118,
          left: 292,
          opacity: stamp,
          padding: '8px 12px',
          backgroundColor: '#FFFFFF',
          color: INK,
          fontFamily: fontMono,
          fontSize: 13,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          boxShadow: '4px 4px 0 #18181B',
        }}
      >
        {STERILE_KICKER}
      </div>
      {!sent ? (
        <Pointer
          x={interpolate(frame, [50, 66], [1480, 1588], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
          y={interpolate(frame, [50, 66], [980, 1008], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
          pressed={sendPress}
          opacity={clampInterp(frame, [48, 56, 78, 86], [0, 1, 1, 0])}
        />
      ) : null}
    </AbsoluteFill>
  );
};
