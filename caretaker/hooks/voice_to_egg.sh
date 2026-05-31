#!/bin/bash
echo "🎤 recording for 10 seconds... speak!"
arecord -d 10 -f cd /tmp/voice_note.wav 2>/dev/null

echo "🔍 transcribing..."
~/whisper-venv/bin/whisper /tmp/voice_note.wav \
    --model tiny \
    --output_format txt \
    --output_dir /tmp/ 2>/dev/null

TEXT=$(cat /tmp/voice_note.txt 2>/dev/null | tr "'" '"')
echo "📝 heard: $TEXT"

node -e "
const incubator = require('/home/wespc/root-project/nursery/incubator/incubator');
incubator.createEgg({ source: 'voice', content: \`$TEXT\` });
"
echo "🥚 egg hatched from voice!"
