// Ilustraciones vectoriales en estilo risógrafo: tintas planas que se multiplican, tramas de puntos y
// un contorno rosa desregistrado. Todo en SVG para que escale nítido en el proyector.

const BLUE = '#1F3FBF', PINK = '#FF48B0', YEL = '#FFD400', INK = '#16163A', SKIN = '#F7C7A3', PAPER = '#F3EEE3';

export const DEFS = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <pattern id="dotB" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="2.6" fill="${BLUE}"/></pattern>
    <pattern id="dotP" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="5" cy="5" r="2.8" fill="${PINK}"/></pattern>
    <pattern id="dotY" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(15)"><circle cx="6" cy="6" r="3.6" fill="${YEL}"/></pattern>
    <pattern id="lineB" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3" height="8" fill="${BLUE}"/></pattern>
  </defs>
</svg>`;

const mul = 'style="mix-blend-mode:multiply"';

export function alex() {
  return `
<svg viewBox="0 0 400 470" class="who who-alex">
  <g ${mul}>
    <path d="M30 470 C30 360 105 318 200 318 C295 318 370 360 370 470 Z" fill="${PINK}"/>
    <path d="M200 318 C150 318 120 345 118 380 C150 360 250 360 282 380 C280 345 250 318 200 318 Z" fill="url(#dotP)"/>
    <path d="M170 330 L160 420 M230 330 L240 420" stroke="${PAPER}" stroke-width="7" stroke-linecap="round"/>
    <circle cx="160" cy="424" r="8" fill="${PAPER}"/><circle cx="240" cy="424" r="8" fill="${PAPER}"/>
    <rect x="172" y="268" width="56" height="70" rx="20" fill="${SKIN}"/>
    <ellipse cx="114" cy="215" rx="16" ry="22" fill="${SKIN}"/><ellipse cx="286" cy="215" rx="16" ry="22" fill="${SKIN}"/>
    <ellipse cx="200" cy="205" rx="88" ry="104" fill="${SKIN}"/>
    <path d="M240 120 C290 150 292 250 250 300 C280 260 285 180 240 120 Z" fill="url(#dotP)" opacity=".55"/>
    <path d="M108 200 C98 120 148 80 205 80 C262 80 306 118 294 196 L282 152 L266 182 L248 140 L230 176 L210 132 L190 172 L172 136 L152 176 L134 146 Z" fill="${BLUE}"/>
  </g>
  <g fill="${INK}">
    <circle cx="168" cy="212" r="7"/><circle cx="232" cy="212" r="7"/>
  </g>
  <path d="M150 190 L184 186 M216 186 L250 190" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
  <path d="M176 256 Q200 274 226 254" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="200" cy="205" rx="88" ry="104" fill="none" stroke="${PINK}" stroke-width="4" transform="translate(7 -5)" opacity=".85"/>
</svg>`;
}

export function carmen() {
  return `
<svg viewBox="0 0 400 470" class="who who-carmen">
  <g ${mul}>
    <path d="M30 470 C30 362 105 320 200 320 C295 320 370 362 370 470 Z" fill="${BLUE}"/>
    <path d="M150 322 L200 390 L250 322 Z" fill="${YEL}"/>
    <path d="M40 470 C46 400 80 360 120 345 L130 470 Z" fill="url(#lineB)" opacity=".5"/>
    <rect x="172" y="266" width="56" height="74" rx="20" fill="${SKIN}"/>
    <path d="M100 210 C92 110 150 78 205 78 C268 78 312 118 300 214 C300 270 292 300 270 312 L272 230 C262 160 160 150 128 230 L130 312 C106 300 100 270 100 210 Z" fill="${YEL}"/>
    <ellipse cx="200" cy="208" rx="82" ry="98" fill="${SKIN}"/>
    <path d="M118 210 C112 120 160 92 205 92 C255 92 292 126 284 200 C262 150 200 130 160 150 C140 160 126 180 118 210 Z" fill="${YEL}"/>
    <path d="M118 210 C112 120 160 92 205 92 C255 92 292 126 284 200 C262 150 200 130 160 150 C140 160 126 180 118 210 Z" fill="url(#dotP)" opacity=".45"/>
    <path d="M200 96 C235 100 266 120 278 160 C258 132 230 118 200 114 Z" fill="${PAPER}"/>
    <circle cx="283" cy="262" r="9" fill="${YEL}"/>
  </g>
  <g fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round">
    <circle cx="168" cy="214" r="26"/><circle cx="234" cy="214" r="26"/><path d="M194 212 L208 212"/>
    <path d="M154 216 Q168 224 182 216 M220 216 Q234 224 248 216"/>
    <path d="M180 262 Q200 254 222 262"/>
    <path d="M150 186 L184 192 M218 192 L252 186"/>
  </g>
  <ellipse cx="200" cy="208" rx="82" ry="98" fill="none" stroke="${PINK}" stroke-width="4" transform="translate(-7 5)" opacity=".85"/>
</svg>`;
}

export function tub() {
  return `
<svg viewBox="0 0 260 300" class="tub-svg">
  <g ${mul}>
    <rect x="20" y="40" width="220" height="250" rx="26" fill="${INK}"/>
    <rect x="10" y="14" width="240" height="46" rx="14" fill="${INK}"/>
    <rect x="10" y="14" width="240" height="46" rx="14" fill="url(#dotP)" opacity=".5"/>
    <rect x="20" y="110" width="220" height="110" fill="${YEL}"/>
  </g>
  <text x="130" y="160" text-anchor="middle" font-family="Anton" font-size="42" fill="${INK}">CREATINA</text>
  <text x="130" y="208" text-anchor="middle" font-family="Anton" font-size="46" fill="${PINK}">1 KG</text>
</svg>`;
}

export function clock() {
  return `
<svg viewBox="0 0 220 220" class="clock-svg">
  <g ${mul}>
    <circle cx="110" cy="110" r="100" fill="${YEL}"/>
    <circle cx="110" cy="110" r="100" fill="url(#dotP)" opacity=".35"/>
  </g>
  <circle cx="110" cy="110" r="100" fill="none" stroke="${INK}" stroke-width="8"/>
  ${Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<line x1="${110 + Math.sin(a) * 80}" y1="${110 - Math.cos(a) * 80}" x2="${110 + Math.sin(a) * 92}" y2="${110 - Math.cos(a) * 92}" stroke="${INK}" stroke-width="${i % 3 ? 4 : 8}" stroke-linecap="round"/>`; }).join('')}
  <g class="hand-h"><line x1="110" y1="110" x2="110" y2="62" stroke="${INK}" stroke-width="12" stroke-linecap="round"/></g>
  <g class="hand-m"><line x1="110" y1="110" x2="110" y2="34" stroke="${PINK}" stroke-width="7" stroke-linecap="round"/></g>
  <circle cx="110" cy="110" r="9" fill="${INK}"/>
</svg>`;
}

// Botella de leche Puleva (genérica, sin copiar ningún envase real)
export function milk() {
  return `
<svg viewBox="0 0 120 260" class="milk-svg">
  <path d="M42 6 H78 V40 C78 56 104 64 104 96 V240 C104 252 96 258 84 258 H36 C24 258 16 252 16 240 V96 C16 64 42 56 42 40 Z" fill="#fff" stroke="${INK}" stroke-width="5"/>
  <rect x="38" y="0" width="44" height="22" rx="5" fill="${BLUE}"/>
  <g ${mul}><rect x="16" y="120" width="88" height="90" fill="${BLUE}"/></g>
  <path d="M16 128 Q38 116 60 128 T104 128 V120 H16 Z" fill="#fff"/>
  <text x="60" y="176" text-anchor="middle" font-family="Anton" font-size="24" fill="#fff">PULEVA</text>
</svg>`;
}

export function fridge(inside = '') {
  return `
<div class="fridge">
  <div class="fr-in">
    <div class="fr-light"></div>
    <div class="fr-shelf" style="top:300px"></div>
    <div class="fr-shelf" style="top:520px"></div>
    ${inside}
  </div>
  <div class="fr-door"><div class="fr-handle"></div><div class="fr-dots"></div></div>
  <div class="fr-freezer"><div class="fr-handle fr-handle-s"></div></div>
</div>`;
}

export function bubble(text, side = 'left', cls = '') {
  return `<div class="bubble bubble-${side} ${cls}"><span>${text}</span></div>`;
}

// Mano que coloca los cromos (sale desde abajo)
export function hand() {
  return `
<svg viewBox="0 0 260 520" class="hand-svg">
  <g ${mul}>
    <rect x="62" y="300" width="150" height="230" fill="${BLUE}"/>
    <rect x="62" y="300" width="150" height="40" fill="url(#dotP)"/>
    <path d="M60 170 C58 120 70 96 92 96 L92 40 C92 18 122 18 122 40 L122 90 L124 26 C124 2 156 2 156 26 L156 92 L160 40 C160 18 190 18 190 40 L190 110 L196 70 C198 50 226 52 224 74 L216 190 C214 260 196 300 170 312 L98 312 C74 300 62 250 60 170 Z" fill="${SKIN}"/>
    <path d="M60 170 C40 150 18 140 12 160 C8 176 40 210 62 240 Z" fill="${SKIN}"/>
    <path d="M150 200 C190 210 210 250 196 296 C186 270 170 240 150 200 Z" fill="url(#dotP)" opacity=".5"/>
  </g>
  <path d="M60 170 C58 120 70 96 92 96 L92 40 C92 18 122 18 122 40 L122 90 L124 26 C124 2 156 2 156 26 L156 92 L160 40 C160 18 190 18 190 40 L190 110 L196 70 C198 50 226 52 224 74 L216 190 C214 260 196 300 170 312 L98 312 C74 300 62 250 60 170 Z" fill="none" stroke="${PINK}" stroke-width="4" transform="translate(6 -4)"/>
  <path d="M92 96 L92 130 M122 90 L122 126 M156 92 L156 126" stroke="${INK}" stroke-width="4" stroke-linecap="round" opacity=".5"/>
</svg>`;
}
