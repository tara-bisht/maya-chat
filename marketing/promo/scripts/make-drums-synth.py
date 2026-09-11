#!/usr/bin/env python3
"""Synthesize a 60s 132 BPM drum track with stdlib only.

Sections (beats, 1 beat = 60/132 s):
  0-10   sterile: half-time soft kick + hat, no snare
  11-45  switch/montage: four-floor kick, snare 2&4, 8th hats
  46-71  explore: + open-hat offbeats, snare fill into studio
  72     studio drop: one-beat silence, then slam
  73-90  studio: full energy, 16th hats
  91-107 free: full,OrderedDict-free steady drive
  108-109 pre-card dropout: silence
  110-128 end card: kick+snare every beat, open hats
  129    final boom + crash tail to 60s
Usage: make-drums-synth.py [out.mp3|out.wav] (default: public/audio/muse/drums.mp3)
"""

import audioop
import math
import os
import random
import struct
import subprocess
import sys
import wave

SR = 44100
TOTAL = 60.0
BPM = 132
BEAT = 60.0 / BPM


def f2b(samples: list[float]) -> bytes:
    vals = [max(-1.0, min(1.0, s)) for s in samples]
    return struct.pack("<%dh" % len(vals), *(int(v * 32767) for v in vals))


def make_kick(dur: float = 0.30, f0: float = 160.0, f1: float = 45.0,
              tau: float = 0.09) -> bytes:
    n = int(SR * dur)
    out: list[float] = []
    phase = 0.0
    for i in range(n):
        t = i / SR
        k = i / n
        f = f1 + (f0 - f1) * math.exp(-t * 30)
        phase += 2 * math.pi * f / SR
        env = math.exp(-t / tau)
        v = math.sin(phase) * env
        if i < int(SR * 0.005):  # beater click
            v += (random.random() * 2 - 1) * 0.5 * math.exp(-t / 0.002)
        out.append(v * (1 - 0.15 * k))
    return f2b(out)


def make_snare(dur: float = 0.20) -> bytes:
    n = int(SR * dur)
    out = []
    for i in range(n):
        t = i / SR
        noise = random.random() * 2 - 1
        body = math.sin(2 * math.pi * 190 * t) * 0.6 * math.exp(-t / 0.04)
        out.append(noise * math.exp(-t / 0.06) * 0.8 + body)
    return f2b(out)


def hp_noise(n: int) -> list[float]:
    prev = 0.0
    out = []
    for _ in range(n):
        x = random.random() * 2 - 1
        y = x - prev
        prev = x
        out.append(y * 0.7)
    return out


def make_hat(dur: float, tau: float) -> bytes:
    n = int(SR * dur)
    nz = hp_noise(n)
    return f2b([nz[i] * math.exp(-(i / SR) / tau) for i in range(n)])


def make_riser(dur: float) -> bytes:
    n = int(SR * dur)
    nz = hp_noise(n)
    out = []
    for i in range(n):
        k = i / n
        t = i / SR
        shimmer = 1 + 0.3 * math.sin(2 * math.pi * 8 * t * (0.5 + k))
        out.append(nz[i] * (k ** 2) * shimmer * 0.9)
    return f2b(out)


def make_boom() -> bytes:
    dur = 1.4
    n = int(SR * dur)
    nz = hp_noise(n)
    out = []
    phase = 0.0
    for i in range(n):
        t = i / SR
        f = 30 + 90 * math.exp(-t * 8)
        phase += 2 * math.pi * f / SR
        v = math.sin(phase) * math.exp(-t / 0.5)
        v += nz[i] * math.exp(-t / 0.8) * 0.5
        out.append(v)
    return f2b(out)


KICK = make_kick()
KICK_SOFT = audioop.mul(KICK, 2, 0.45)
SNARE = make_snare()
CHAT = make_hat(0.05, 0.012)
OHAT = make_hat(0.30, 0.09)
RISER = make_riser(1.9)
BOOM = make_boom()

master = bytearray(int(SR * TOTAL) * 2)


def stamp(hit: bytes, at_sec: float, vel: float = 1.0) -> None:
    if at_sec < 0:
        return
    off = int(at_sec * SR) * 2
    if off >= len(master):
        return
    seg = hit if vel == 1.0 else audioop.mul(hit, 2, vel)
    end = min(len(master), off + len(seg))
    if end <= off:
        return
    mixed = audioop.add(bytes(master[off:end]), seg[: end - off], 2)
    master[off:end] = mixed


def bar(beats: list[int], fn) -> None:
    for b in beats:
        fn(b)


# --- sterile: beats 0-10, thin half-time ---
for b in (0, 4, 8):
    stamp(KICK_SOFT, b * BEAT, 0.8)
for b in range(0, 11):
    stamp(CHAT, b * BEAT, 0.25)


def full_kick(b: int, vel: float = 1.0) -> None:
    stamp(KICK, b * BEAT, vel)


def backbeat(b: int, vel: float = 1.0) -> None:
    if b % 4 == 1 or b % 4 == 3:
        stamp(SNARE, b * BEAT, vel)


# --- switch/montage: beats 11-45 ---
for b in range(11, 46):
    k = (b - 11) / 34
    full_kick(b, 0.7 + 0.3 * k)
    backbeat(b, 0.7 + 0.3 * k)
    stamp(CHAT, b * BEAT, 0.5)
    stamp(CHAT, (b + 0.5) * BEAT, 0.35)

# --- explore: beats 46-71, open hats + fill ---
for b in range(46, 72):
    full_kick(b)
    backbeat(b)
    stamp(CHAT, b * BEAT, 0.55)
    stamp(CHAT, (b + 0.5) * BEAT, 0.4)
    if b % 2 == 1:
        stamp(OHAT, (b + 0.5) * BEAT, 0.35)
for i in range(8):  # snare fill into studio
    stamp(SNARE, (70 + i * 0.25) * BEAT, 0.5 + 0.06 * i)
stamp(RISER, 68 * BEAT)

# --- beat 72: dropout (silence), slam on 73 ---
# --- studio: beats 73-90, 16th hats ---
for b in range(73, 91):
    full_kick(b)
    backbeat(b)
    for s in range(4):
        stamp(CHAT, (b + s * 0.25) * BEAT, 0.5 if s % 2 == 0 else 0.3)

# --- free: beats 91-107 steady ---
for b in range(91, 108):
    full_kick(b, 0.95)
    backbeat(b, 0.95)
    stamp(CHAT, b * BEAT, 0.5)
    stamp(CHAT, (b + 0.5) * BEAT, 0.35)
    if b % 2 == 1:
        stamp(OHAT, (b + 0.5) * BEAT, 0.3)

# --- beats 108-109: pre-card dropout (silence) ---
# --- end card: beats 110-128, everything ---
for b in range(110, 129):
    full_kick(b)
    stamp(SNARE, b * BEAT, 0.9)
    stamp(CHAT, b * BEAT, 0.55)
    stamp(CHAT, (b + 0.5) * BEAT, 0.4)
    stamp(OHAT, (b + 0.5) * BEAT, 0.35)

# --- final boom on 129 + tail ---
stamp(BOOM, 129 * BEAT, 1.0)

stereo = audioop.tostereo(bytes(master), 2, 1, 1)

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
default_target = os.path.join(root, "public", "audio", "muse", "drums.mp3")
out_target = sys.argv[1] if len(sys.argv) > 1 else default_target
os.makedirs(os.path.dirname(os.path.abspath(out_target)), exist_ok=True)

if out_target.endswith(".mp3"):
    wav_target = out_target[:-4] + ".wav"
    with wave.open(wav_target, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(stereo)
    subprocess.check_call(
        [
            "ffmpeg",
            "-y",
            "-v",
            "error",
            "-i",
            wav_target,
            "-codec:a",
            "libmp3lame",
            "-b:a",
            "128k",
            out_target,
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    if os.path.exists(wav_target):
        os.remove(wav_target)
    print("wrote", out_target)
else:
    with wave.open(out_target, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(stereo)
    print("wrote", out_target)
