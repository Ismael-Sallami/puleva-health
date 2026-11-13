#!/usr/bin/env bash
# Regenera el spot "10 SEGUNDOS" (public/img/spot10.mp4).
# Requisitos: ffmpeg, python3 + numpy, Google Chrome, y una vez:
#   python3 -m venv .venv && .venv/bin/pip install edge-tts
#   npm i --prefix . puppeteer-core
# OJO: edge-tts envía el texto de la locución al servicio de voz de Microsoft.
set -e
cd "$(dirname "$0")"
W=$(mktemp -d)
VOZ=${VOZ:-es-ES-XimenaNeural}
declare -A L=( [vo1]="Este anuncio dura lo mismo que cuidarte." [abres]="Abres." [coges]="Coges." [destapas]="Destapas." [bebes]="Bebes." [listo]="Y listo." [diez]="Diez segundos." [pastillas]="Sin pastillas." [polvos]="Sin polvos." [vo4]="Puleva Health. Salud que se bebe." )
mkdir -p "$W/vo"
for k in "${!L[@]}"; do
  .venv/bin/edge-tts --voice "$VOZ" --rate=-6% --text "${L[$k]}" --write-media "$W/vo/$k.mp3"
  ffmpeg -v error -y -i "$W/vo/$k.mp3" -af "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse" -ar 48000 -ac 1 "$W/vo/$k.wav"
done
python3 audio.py "$W/vo" "$W/audio.wav"
(cd .. && npx vite build && npx vite preview --port 5191 --strictPort) & PID=$!
sleep 4
node render.mjs "http://localhost:5191/spot.html?render" "$W/frames" 22.5 30
kill $PID || true
ffmpeg -v error -y -framerate 30 -i "$W/frames/f%05d.jpg" -i "$W/audio.wav" -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart ../public/img/spot10.mp4
cp "$W/frames/f00645.jpg" ../public/img/spot10.jpg
echo "Listo: public/img/spot10.mp4"
