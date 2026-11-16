// Ilustraciones vectoriales en estilo Claymorphism con la paleta Puleva:
// Blue Charcoal (#000a1a), Green Vogue (#022b50), Dark Blue (#140ec8), Concrete (#f2f2f2), Jewel (#189150).

const BLUE = '#140ec8', PINK = '#e11d38', YEL = '#189150', VOGUE = '#022b50', INK = '#000a1a', SKIN = '#F9C9A7', PAPER = '#f2f2f2';

export const DEFS = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <!-- Filtro 3D Claymorphism para polígonos y piezas SVG -->
    <filter id="clayBevel" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>
      <feOffset in="blur" dx="4" dy="6" result="offsetBlur"/>
      <feSpecularLighting in="blur" surfaceScale="5" specularConstant="0.75" specularExponent="20" lighting-color="#ffffff" result="specOut">
        <fePointLight x="-120" y="-160" z="220"/>
      </feSpecularLighting>
      <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specMask"/>
      <feMerge>
        <feMergeNode in="SourceGraphic"/>
        <feMergeNode in="specMask"/>
      </feMerge>
    </filter>
    <!-- Puleva Red (#e11d38) -->
    <radialGradient id="clayPink" cx="30%" cy="25%" r="75%">
      <stop offset="0%" stop-color="#ff546b"/>
      <stop offset="55%" stop-color="${PINK}"/>
      <stop offset="100%" stop-color="#940a1d"/>
    </radialGradient>
    <!-- Dark Blue (#140ec8) -->
    <radialGradient id="clayBlue" cx="30%" cy="25%" r="75%">
      <stop offset="0%" stop-color="#4842f5"/>
      <stop offset="55%" stop-color="${BLUE}"/>
      <stop offset="100%" stop-color="#0a0678"/>
    </radialGradient>
    <!-- Jewel Green (#189150) -->
    <radialGradient id="clayYel" cx="30%" cy="25%" r="75%">
      <stop offset="0%" stop-color="#35ba72"/>
      <stop offset="55%" stop-color="${YEL}"/>
      <stop offset="100%" stop-color="#0d5930"/>
    </radialGradient>
    <!-- Green Vogue (#022b50) -->
    <radialGradient id="clayVogue" cx="30%" cy="25%" r="75%">
      <stop offset="0%" stop-color="#0b4f8c"/>
      <stop offset="55%" stop-color="${VOGUE}"/>
      <stop offset="100%" stop-color="#001326"/>
    </radialGradient>
    <!-- Skin (personas) -->
    <radialGradient id="claySkin" cx="32%" cy="25%" r="75%">
      <stop offset="0%" stop-color="#FFE4CF"/>
      <stop offset="60%" stop-color="${SKIN}"/>
      <stop offset="100%" stop-color="#DFA076"/>
    </radialGradient>
    <!-- Blue Charcoal (#000a1a) -->
    <radialGradient id="clayInk" cx="30%" cy="25%" r="75%">
      <stop offset="0%" stop-color="#0c264a"/>
      <stop offset="60%" stop-color="${INK}"/>
      <stop offset="100%" stop-color="#00040a"/>
    </radialGradient>
    <!-- Concrete (#f2f2f2) -->
    <radialGradient id="clayWhite" cx="30%" cy="25%" r="75%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="65%" stop-color="${PAPER}"/>
      <stop offset="100%" stop-color="#cfd6dc"/>
    </radialGradient>
    <pattern id="dotB" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="2.2" fill="rgba(242,242,242,0.22)"/></pattern>
    <pattern id="dotP" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="2.2" fill="rgba(242,242,242,0.25)"/></pattern>
    <pattern id="dotY" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="2.5" fill="rgba(242,242,242,0.3)"/></pattern>
    <pattern id="lineB" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3" height="10" fill="rgba(242,242,242,0.18)"/></pattern>
  </defs>
</svg>`;

export function alex() {
  return `
<svg viewBox="0 0 400 470" class="who who-alex">
  <g>
    <path d="M30 470 C30 360 105 318 200 318 C295 318 370 360 370 470 Z" fill="url(#clayPink)"/>
    <path d="M200 318 C150 318 120 345 118 380 C150 360 250 360 282 380 C280 345 250 318 200 318 Z" fill="rgba(242,242,242,0.22)"/>
    <path d="M170 330 L160 420 M230 330 L240 420" stroke="url(#clayWhite)" stroke-width="9" stroke-linecap="round"/>
    <circle cx="160" cy="424" r="10" fill="url(#clayWhite)"/><circle cx="240" cy="424" r="10" fill="url(#clayWhite)"/>
    <rect x="172" y="268" width="56" height="70" rx="24" fill="url(#claySkin)"/>
    <ellipse cx="114" cy="215" rx="18" ry="24" fill="url(#claySkin)"/><ellipse cx="286" cy="215" rx="18" ry="24" fill="url(#claySkin)"/>
    <ellipse cx="200" cy="205" rx="88" ry="104" fill="url(#claySkin)"/>
    <ellipse cx="155" cy="232" rx="16" ry="10" fill="#e89580" opacity=".35"/>
    <ellipse cx="245" cy="232" rx="16" ry="10" fill="#e89580" opacity=".35"/>
    <path d="M108 200 C98 120 148 80 205 80 C262 80 306 118 294 196 L282 152 L266 182 L248 140 L230 176 L210 132 L190 172 L172 136 L152 176 L134 146 Z" fill="url(#clayYel)" stroke-linejoin="round"/>
  </g>
  <g fill="${INK}">
    <circle cx="168" cy="212" r="8"/><circle cx="232" cy="212" r="8"/>
    <circle cx="165" cy="209" r="2.8" fill="#fff"/><circle cx="229" cy="209" r="2.8" fill="#fff"/>
  </g>
  <path d="M150 190 L184 186 M216 186 L250 190" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>
  <path d="M176 256 Q200 274 226 254" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
</svg>`;
}

export function carmen() {
  return `
<svg viewBox="0 0 400 470" class="who who-carmen">
  <g>
    <path d="M30 470 C30 362 105 320 200 320 C295 320 370 362 370 470 Z" fill="url(#clayBlue)"/>
    <path d="M150 322 L200 390 L250 322 Z" fill="url(#clayWhite)"/>
    <rect x="172" y="266" width="56" height="74" rx="24" fill="url(#claySkin)"/>
    <path d="M100 210 C92 110 150 78 205 78 C268 78 312 118 300 214 C300 270 292 300 270 312 L272 230 C262 160 160 150 128 230 L130 312 C106 300 100 270 100 210 Z" fill="url(#clayYel)"/>
    <ellipse cx="200" cy="208" rx="82" ry="98" fill="url(#claySkin)"/>
    <ellipse cx="155" cy="236" rx="15" ry="9" fill="#e89580" opacity=".35"/>
    <ellipse cx="245" cy="236" rx="15" ry="9" fill="#e89580" opacity=".35"/>
    <path d="M118 210 C112 120 160 92 205 92 C255 92 292 126 284 200 C262 150 200 130 160 150 C140 160 126 180 118 210 Z" fill="url(#clayYel)"/>
    <path d="M200 96 C235 100 266 120 278 160 C258 132 230 118 200 114 Z" fill="rgba(255,255,255,0.28)"/>
    <circle cx="283" cy="262" r="11" fill="url(#clayPink)"/>
  </g>
  <g fill="none" stroke="${INK}" stroke-width="6.5" stroke-linecap="round">
    <circle cx="168" cy="214" r="26" fill="rgba(255,255,255,0.2)"/><circle cx="234" cy="214" r="26" fill="rgba(255,255,255,0.2)"/><path d="M194 212 L208 212"/>
    <path d="M154 216 Q168 224 182 216 M220 216 Q234 224 248 216"/>
    <path d="M180 262 Q200 254 222 262"/>
    <path d="M150 186 L184 192 M218 192 L252 186"/>
  </g>
</svg>`;
}

export function tub() {
  return `
<svg viewBox="0 0 260 300" class="tub-svg">
  <rect x="20" y="40" width="220" height="250" rx="38" fill="url(#clayInk)"/>
  <ellipse cx="90" cy="90" rx="45" ry="18" fill="rgba(242,242,242,0.14)" transform="rotate(-15 90 90)"/>
  <rect x="10" y="12" width="240" height="50" rx="22" fill="url(#clayPink)"/>
  <rect x="24" y="110" width="212" height="112" rx="22" fill="url(#clayWhite)"/>
  <text x="130" y="160" text-anchor="middle" font-family="Anton" font-size="42" fill="${INK}">CREATINA</text>
  <text x="130" y="208" text-anchor="middle" font-family="Anton" font-size="46" fill="${PINK}">1 KG</text>
</svg>`;
}

export function clock() {
  return `
<svg viewBox="0 0 220 220" class="clock-svg">
  <circle cx="110" cy="110" r="102" fill="url(#clayYel)"/>
  <circle cx="110" cy="110" r="86" fill="url(#clayWhite)"/>
  ${Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<line x1="${110 + Math.sin(a) * 68}" y1="${110 - Math.cos(a) * 68}" x2="${110 + Math.sin(a) * 78}" y2="${110 - Math.cos(a) * 78}" stroke="${INK}" stroke-width="${i % 3 ? 4 : 7}" stroke-linecap="round"/>`; }).join('')}
  <g class="hand-h"><line x1="110" y1="110" x2="110" y2="64" stroke="${INK}" stroke-width="12" stroke-linecap="round"/></g>
  <g class="hand-m"><line x1="110" y1="110" x2="110" y2="38" stroke="${PINK}" stroke-width="8" stroke-linecap="round"/></g>
  <circle cx="110" cy="110" r="11" fill="url(#clayPink)"/>
</svg>`;
}

// Botella de leche Puleva en volumen Clay 3D
export function milk() {
  return `
<svg viewBox="0 0 120 260" class="milk-svg">
  <path d="M42 6 H78 V40 C78 56 104 64 104 96 V236 C104 250 94 258 80 258 H40 C26 258 16 250 16 236 V96 C16 64 42 56 42 40 Z" fill="url(#clayWhite)"/>
  <rect x="36" y="0" width="48" height="24" rx="10" fill="url(#clayBlue)"/>
  <rect x="18" y="120" width="84" height="90" rx="14" fill="url(#clayBlue)"/>
  <path d="M18 128 Q38 116 60 128 T102 128 V120 H18 Z" fill="url(#clayWhite)"/>
  <text x="60" y="176" text-anchor="middle" font-family="Anton" font-size="24" fill="${PAPER}">PULEVA</text>
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

// Mano en plastilina / arcilla que coloca los cromos
export function hand() {
  return `
<svg viewBox="0 0 260 520" class="hand-svg">
  <rect x="62" y="300" width="150" height="230" rx="36" fill="url(#clayBlue)"/>
  <rect x="62" y="296" width="150" height="36" rx="18" fill="url(#clayPink)"/>
  <path d="M60 170 C58 120 70 96 92 96 L92 40 C92 18 122 18 122 40 L122 90 L124 26 C124 2 156 2 156 26 L156 92 L160 40 C160 18 190 18 190 40 L190 110 L196 70 C198 50 226 52 224 74 L216 190 C214 260 196 300 170 312 L98 312 C74 300 62 250 60 170 Z" fill="url(#claySkin)"/>
  <path d="M60 170 C40 150 18 140 12 160 C8 176 40 210 62 240 Z" fill="url(#claySkin)"/>
  <path d="M92 96 L92 130 M122 90 L122 126 M156 92 L156 126" stroke="rgba(180,110,70,0.45)" stroke-width="5" stroke-linecap="round"/>
</svg>`;
}
