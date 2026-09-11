#!/bin/bash
# Synthesize the V2 drum track: 132 BPM four-on-the-floor kit with
# risers, a studio-dropout, an end-card slam and a final boom.
# Zero samples, zero licensing risk. Output: public/drums.mp3 (60.0s).
set -euo pipefail
cd "$(dirname "$0")/.."
python3 scripts/make-drums-synth.py public/drums.wav
ffmpeg -y -v error -i public/drums.wav -codec:a libmp3lame -b:a 128k public/drums.mp3
rm public/drums.wav
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 public/drums.mp3
