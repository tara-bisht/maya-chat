#!/usr/bin/env python3
"""Original 120 BPM four-on-the-floor drum bed. No third-party samples."""

from __future__ import annotations

import math
import os
import random
import struct
import subprocess
import wave

SR = 44100
BPM = 120
BEAT = 60.0 / BPM
BAR = BEAT * 4
N_BARS = 21
DURATION = N_BARS * BAR
N = int(SR * DURATION)
RNG = random.Random(42)


def clamp(value: float, lo: float = -1.0, hi: float = 1.0) -> float:
    return lo if value < lo else hi if value > hi else value


def exp_env(t: float, tau: float) -> float:
    return math.exp(-t / tau) if t >= 0 else 0.0


def write_at(buf: list[float], start: int, samples: list[float], gain: float = 1.0) -> None:
    for i, sample in enumerate(samples):
        idx = start + i
        if 0 <= idx < len(buf):
            buf[idx] += sample * gain


def osc_kick(length: float = 0.28) -> list[float]:
    n = int(SR * length)
    out = [0.0] * n
    for i in range(n):
        t = i / SR
        freq = 148.0 * math.exp(-t * 28.0) + 36.0
        body = math.sin(2 * math.pi * freq * t) * exp_env(t, 0.16)
        click = math.sin(2 * math.pi * 1800.0 * t) * exp_env(t, 0.008) * 0.22
        sub = math.sin(2 * math.pi * 42.0 * t) * exp_env(t, 0.22) * 0.55
        out[i] = body * 0.95 + click + sub
    return out


def osc_snare(length: float = 0.22) -> list[float]:
    n = int(SR * length)
    out = [0.0] * n
    for i in range(n):
        t = i / SR
        tone = math.sin(2 * math.pi * 186.0 * t) * exp_env(t, 0.07)
        tone2 = math.sin(2 * math.pi * 330.0 * t) * exp_env(t, 0.04) * 0.35
        noise = (RNG.random() * 2 - 1) * exp_env(t, 0.055)
        out[i] = tone * 0.45 + tone2 + noise * 0.7
    return out


def osc_clap(length: float = 0.28) -> list[float]:
    n = int(SR * length)
    out = [0.0] * n
    bursts = (0.0, 0.012, 0.023, 0.041)
    for i in range(n):
        t = i / SR
        acc = 0.0
        for delay in bursts:
            if t >= delay:
                acc += (RNG.random() * 2 - 1) * exp_env(t - delay, 0.028)
        out[i] = acc * 0.55
    return out


def osc_hat(open_hat: bool = False) -> list[float]:
    length = 0.22 if open_hat else 0.045
    tau = 0.07 if open_hat else 0.012
    n = int(SR * length)
    out = [0.0] * n
    prev = 0.0
    for i in range(n):
        t = i / SR
        white = RNG.random() * 2 - 1
        hp = white - prev
        prev = white
        out[i] = hp * exp_env(t, tau) * (0.42 if open_hat else 0.28)
    return out


def osc_crash(length: float = 1.6) -> list[float]:
    n = int(SR * length)
    out = [0.0] * n
    prev = 0.0
    for i in range(n):
        t = i / SR
        white = RNG.random() * 2 - 1
        hp = white - prev
        prev = white
        metal = math.sin(2 * math.pi * 540.0 * t) * exp_env(t, 0.18) * 0.12
        out[i] = hp * exp_env(t, 0.42) * 0.5 + metal
    return out


def osc_tom(freq: float, length: float = 0.18) -> list[float]:
    n = int(SR * length)
    out = [0.0] * n
    for i in range(n):
        t = i / SR
        f = freq * math.exp(-t * 6.0)
        out[i] = math.sin(2 * math.pi * f * t) * exp_env(t, 0.09) * 0.7
    return out


def osc_808(length: float = 0.55) -> list[float]:
    n = int(SR * length)
    out = [0.0] * n
    for i in range(n):
        t = i / SR
        freq = 49.0 * math.exp(-t * 3.2)
        out[i] = math.sin(2 * math.pi * freq * t) * exp_env(t, 0.28) * 0.42
    return out


def reverse(samples: list[float]) -> list[float]:
    return list(reversed(samples))


def mix() -> list[float]:
    left = [0.0] * N
    right = [0.0] * N
    kick = osc_kick()
    snare = osc_snare()
    clap = osc_clap()
    hat_c = osc_hat(False)
    hat_o = osc_hat(True)
    crash = osc_crash()
    tom_l = osc_tom(140)
    tom_m = osc_tom(180)
    tom_h = osc_tom(230)
    bass = osc_808()
    swell = reverse(osc_crash(1.1))

    def stereo(start: int, samples: list[float], gain: float, pan: float = 0.0) -> None:
        l_gain = gain * (1 - max(pan, 0)) * (1 + min(pan, 0) * 0.35)
        r_gain = gain * (1 + min(pan, 0)) * (1 - max(pan, 0) * 0.35)
        # pan -1 left, +1 right. Keep energy.
        l = gain * (0.707 - 0.293 * pan)
        r = gain * (0.707 + 0.293 * pan)
        write_at(left, start, samples, l)
        write_at(right, start, samples, r)
        del l_gain, r_gain

    sixteenths = 16 * N_BARS
    step = BEAT / 4.0

    crash_bars = {0, 3, 4, 10, 14, 17}
    fill_bars = {2, 9, 13, 16}

    for step_i in range(sixteenths):
        bar = step_i // 16
        beat = (step_i % 16) // 4
        sixteenth = step_i % 4
        t = step_i * step
        start = int(t * SR)
        if start >= N:
            break

        finale = bar >= 18
        explore = 10 <= bar < 14
        studio = 14 <= bar < 17

        if bar in crash_bars and beat == 0 and sixteenth == 0:
            stereo(start, crash, 0.55 if bar else 0.4, 0.0)

        if bar == 2 and beat == 3 and sixteenth == 0:
            stereo(start, swell, 0.62, 0.05)

        if finale:
            if beat in (0, 2) and sixteenth == 0:
                stereo(start, kick, 0.95)
                stereo(start, bass, 0.55)
            if beat == 1 and sixteenth == 0:
                stereo(start, snare, 0.7)
            if beat == 3 and sixteenth == 0:
                stereo(start, snare, 0.85)
                stereo(start, clap, 0.7)
                if bar == 20:
                    stereo(start, crash, 0.7)
            if sixteenth == 0:
                stereo(start, hat_c, 0.18, 0.35)
            continue

        if bar in fill_bars and beat >= 2:
            if sixteenth == 0:
                stereo(start, tom_h if beat == 2 else tom_m, 0.7, -0.2)
            if sixteenth == 2:
                stereo(start, tom_l, 0.75, 0.15)
            if beat == 3 and sixteenth == 3:
                stereo(start, snare, 0.8)
            continue

        # Four on the floor + extra pickup kick.
        if sixteenth == 0:
            stereo(start, kick, 0.92)
            stereo(start, bass, 0.48 if beat in (0, 2) else 0.28)
        if beat == 3 and sixteenth == 2 and not studio:
            stereo(start, kick, 0.55)

        if beat in (1, 3) and sixteenth == 0:
            stereo(start, snare, 0.78 if beat == 3 else 0.7)
            if beat == 3 or explore:
                stereo(start, clap, 0.5 if explore else 0.32, -0.12)

        # Closed hats on 16ths, accent on 8ths.
        hat_gain = 0.22 if sixteenth == 0 else 0.12
        if explore:
            hat_gain *= 1.25
        stereo(start, hat_c, hat_gain, 0.42)

        if sixteenth == 2 and beat in (0, 2):
            stereo(start, hat_o, 0.28, 0.55)

        # Ghost snare
        if beat in (0, 2) and sixteenth == 3:
            stereo(start, snare, 0.14, 0.08)

    # Soft clip + peak normalize to -1.4 dB.
    peak = 1e-9
    for i in range(N):
        left[i] = math.tanh(left[i] * 1.15)
        right[i] = math.tanh(right[i] * 1.15)
        peak = max(peak, abs(left[i]), abs(right[i]))
    target = 10 ** (-1.4 / 20)
    scale = target / peak
    fade_start = int((DURATION - 0.7) * SR)
    for i in range(N):
        fade = 1.0
        if i > fade_start:
            fade = max(0.0, 1.0 - (i - fade_start) / (N - fade_start))
        left[i] *= scale * fade
        right[i] *= scale * fade
    return left, right


def write_wav(path: str, left: list[float], right: list[float]) -> None:
    with wave.open(path, "w") as handle:
        handle.setnchannels(2)
        handle.setsampwidth(2)
        handle.setframerate(SR)
        packed = bytearray()
        for i in range(len(left)):
            packed += struct.pack(
                "<hh",
                int(clamp(left[i]) * 32767),
                int(clamp(right[i]) * 32767),
            )
        handle.writeframes(bytes(packed))


def main() -> None:
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    audio_dir = os.path.join(root, "public", "audio", "grok")
    os.makedirs(audio_dir, exist_ok=True)
    wav_path = os.path.join(audio_dir, "drums.wav")
    mp3_path = os.path.join(audio_dir, "drums.mp3")
    print("mixing drums…")
    left, right = mix()
    write_wav(wav_path, left, right)
    subprocess.check_call(
        [
            "ffmpeg",
            "-y",
            "-i",
            wav_path,
            "-codec:a",
            "libmp3lame",
            "-b:a",
            "192k",
            mp3_path,
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    if os.path.exists(wav_path):
        os.remove(wav_path)
    print(f"wrote {mp3_path}")


if __name__ == "__main__":
    main()
