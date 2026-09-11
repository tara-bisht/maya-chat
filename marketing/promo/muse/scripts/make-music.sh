#!/bin/bash
# Synthesizes the LaunchMuse background score: a warm 60s ambient pad
# (A2+E3+A3+C#4 drone with slow tremolo, lowpass, fades). Self-made —
# no licensing, no downloads. Re-run to regenerate public/music.mp3.
set -euo pipefail
cd "$(dirname "$0")/.."
ffmpeg -y \
  -f lavfi -i "sine=frequency=110:duration=60" \
  -f lavfi -i "sine=frequency=164.81:duration=60" \
  -f lavfi -i "sine=frequency=220:duration=60" \
  -f lavfi -i "sine=frequency=277.18:duration=60" \
  -filter_complex "[0][1][2][3]amix=inputs=4:normalize=0,tremolo=f=0.15:d=0.6,lowpass=f=900,volume=0.25,aformat=sample_rates=44100:channel_layouts=stereo,afade=t=in:st=0:d=3,afade=t=out:st=56:d=4" \
  -c:a libmp3lame -b:a 96k public/music.mp3
ffprobe -v error -show_entries format=duration -of csv=p=0 public/music.mp3
