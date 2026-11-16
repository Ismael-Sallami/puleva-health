// Spot "10 SEGUNDOS": el anuncio dura lo mismo que cuidarte.
// Animación determinista: ?render congela el reloj global de GSAP y el renderizador avanza fotograma a fotograma.
import '@fontsource/anton';
import '@fontsource-variable/archivo';
import '@fontsource/permanent-marker';
import '@fontsource/space-mono/700.css';
import './style.css';
import './spot.css';
import { gsap, misreg, stamp, scrawl, drop, $, $$ } from './fx.js';
import { DEFS, fridge, milk } from './illus.js';

export const CUES = {
  // segundos: deben coincidir con el audio (render/audio.py)
  vo1: 0.5, countStart: 3.6, abres: 3.9, coges: 5.8, destapas: 7.8, twist: 7.95, pop: 8.45, bebes: 9.6, pour: 10.25, pourEnd: 12.45, listo: 13.0, zero: 13.6,
  diez: 14.1, pastillas: 15.3, polvos: 16.4, logo: 17.8, vo4: 18.4, end: 22.5,
};

const IMG = (k) => `img/${k}.webp`;
const render = new URLSearchParams(location.search).has('render');

document.body.innerHTML = `${DEFS}
<div id="sp" class="slide paper">
  <div class="sp-l1 marker h" id="l1">Este anuncio dura lo mismo<br>que <span style="color:var(--pink)">cuidarte.</span></div>

  <div class="sp-scene h" id="scene">
    <div class="abs" id="fr" style="left:330px;top:120px">${fridge(`
      <div class="abs" style="left:60px;top:120px;width:100px">${milk()}</div>
      <img class="abs" id="nowIn" src="${IMG('now')}" style="left:200px;top:62px;height:236px">
      <img class="abs" src="${IMG('shield')}" style="left:300px;top:70px;height:228px">
      <img class="abs" src="${IMG('care')}" style="left:100px;top:322px;height:190px">`)}</div>
    <div class="sp-bottle h" id="bottle"><img class="sb-body" src="img/now_body.png"><img class="sb-cap" id="cap" src="img/now_cap.png"></div>
    <div class="sp-word" id="word"></div>
    <div class="sp-timer" id="timer">
      <svg viewBox="0 0 300 300">
        <defs><clipPath id="tclip"><circle cx="150" cy="150" r="125"/></clipPath>
          <linearGradient id="liq" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#F59AC4"/><stop offset="1" stop-color="#D9488E"/></linearGradient></defs>
        <circle cx="150" cy="150" r="130" class="tm-bg"/>
        <g clip-path="url(#tclip)"><g id="lq" transform="translate(0,300)">
          <path id="lqw" d="M-300 0 Q-262 -12 -225 0 T-150 0 T-75 0 T0 0 T75 0 T150 0 T225 0 T300 0 T375 0 T450 0 V400 H-300 Z" fill="url(#liq)"/>
          <path d="M-300 6 Q-262 -6 -225 6 T-150 6 T-75 6 T0 6 T75 6 T150 6 T225 6 T300 6 T375 6 T450 6" fill="none" stroke="#FFD0E6" stroke-width="5" opacity=".8" id="lqh"/>
          ${Array.from({ length: 9 }, (_, i) => `<circle class="bub" cx="${60 + i * 22}" cy="${30 + (i % 3) * 30}" r="${3 + (i % 3)}" fill="#FFE3F0" opacity=".8"/>`).join('')}
        </g></g>
        <circle cx="150" cy="150" r="130" class="tm-ring" id="ring" transform="rotate(-90 150 150)"/>
      </svg>
      <b id="sec">10</b><small>SEGUNDOS</small>
    </div>
    <div class="rubber sp-done h" id="done">HECHO.</div>
    <svg class="sp-goo" viewBox="0 0 1920 1080">
      <defs><filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b"/><feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -11" result="g"/><feComposite in="SourceGraphic" in2="g" operator="atop"/></filter></defs>
      <g filter="url(#goo)" id="drops"></g>
    </svg>
  </div>

  <div class="sp-cards" id="cards">
    <div class="sp-card c1 h">10 SEGUNDOS.</div>
    <div class="sp-card c2 h">SIN PASTILLAS.</div>
    <div class="sp-card c3 h">SIN POLVOS.</div>
  </div>

  <div class="cover abs h" id="end">
    <div class="cover-dots"></div>
    <div class="mega h" id="e1" style="font-size:250px;line-height:.82;color:var(--paper)">PULEVA<br>HEALTH</div>
    <div class="marker h" id="e2" style="font-size:110px;color:var(--yellow);margin-top:10px">Salud que se bebe.</div>
    <div class="lineup lineup-xl abs">${['care', 'now', 'shield', 'creasnap', 'clearpro'].map((k) => `<img class="h" src="${IMG(k)}">`).join('')}</div>
    <div class="sp-legal">Complemento alimenticio. No debe utilizarse como sustituto de una dieta equilibrada.</div>
  </div>
  <div class="sp-roller" id="rl"></div>
</div>`;

const el = document.getElementById('sp');
const C = CUES;

function word(t, txt, color) {
  return gsap.timeline()
    .set($(el, '#word'), { text: txt, color, autoAlpha: 1 })
    .fromTo($(el, '#word'), { scale: 2.2, rotation: -6, opacity: 0 }, { scale: 1, rotation: -2, opacity: 1, duration: 0.25, ease: 'power4.in' })
    .to($(el, '#word'), { opacity: 0.0, duration: 0.25, delay: 1.2 });
}

const NS = 'http://www.w3.org/2000/svg';
const dropsHost = () => document.getElementById('drops');
function dot(r, fill = '#E86BA8') {
  const c = document.createElementNS(NS, 'circle');
  c.setAttribute('r', r); c.setAttribute('fill', fill); c.setAttribute('cx', 0); c.setAttribute('cy', 0);
  c.style.visibility = 'hidden';
  dropsHost().appendChild(c);
  return c;
}
// boca de la botella (coordenadas del escenario) en reposo y volcada
const MOUTH_UP = { x: 952, y: 178 };
const MOUTH_POUR = { x: 1512, y: 252 };
// el cronómetro como vaso: nivel en coordenadas del escenario
const TIMER = { x: 1340, y: 260, s: 460 / 300 };
const LVL0 = 282, LVL1 = 34; // y del líquido dentro del svg (vacío → lleno)
const surfaceY = (p) => TIMER.y + (LVL0 + (LVL1 - LVL0) * p) * TIMER.s;

function spray(tl, at) {
  for (let i = 0; i < 14; i++) {
    const d = dot(5 + (i % 4) * 2, i % 3 ? '#E86BA8' : '#F7B6D5');
    const ang = -Math.PI / 2 + ((i / 13) - 0.5) * 1.6;
    const v = 260 + (i * 37) % 160;
    tl.set(d, { visibility: 'visible', attr: { cx: MOUTH_UP.x, cy: MOUTH_UP.y } }, at)
      .to(d, { attr: { cx: MOUTH_UP.x + Math.cos(ang) * v * 0.9 }, duration: 0.7, ease: 'none' }, at)
      .to(d, { keyframes: [{ attr: { cy: MOUTH_UP.y + Math.sin(ang) * v * 0.7 }, duration: 0.3, ease: 'power2.out' }, { attr: { cy: MOUTH_UP.y + 420 }, duration: 0.4, ease: 'power2.in' }] }, at)
      .set(d, { visibility: 'hidden' }, at + 0.7);
  }
}

function pour(tl) {
  const P0 = C.pour, P1 = C.pourEnd, span = P1 - P0;
  // el líquido sube en el cronómetro, con ola y burbujas
  tl.fromTo('#lq', { attr: { transform: `translate(0,${LVL0})` } }, { attr: { transform: `translate(0,${LVL1})` }, duration: span + 0.3, ease: 'power1.inOut' }, P0 + 0.15)
    .fromTo(['#lqw', '#lqh'], { x: 0 }, { x: 150, duration: 1.1, ease: 'none', repeat: 8 }, P0)
    .fromTo('.bub', { y: 60 }, { y: -40, duration: 1.4, ease: 'none', stagger: 0.15, repeat: 3 }, P0 + 0.3);
  // chorro continuo: una columna de líquido que sale de la boca, baja hasta la superficie y al final se desprende
  const col = document.createElementNS(NS, 'rect');
  col.setAttribute('fill', '#E86BA8'); col.setAttribute('rx', 15);
  col.setAttribute('x', MOUTH_POUR.x - 15); col.setAttribute('width', 30);
  col.setAttribute('y', MOUTH_POUR.y); col.setAttribute('height', 0);
  col.style.visibility = 'hidden';
  dropsHost().appendChild(col);
  const lvl = { p: 0 };
  const colH = () => Math.max(0, surfaceY(lvl.p) - MOUTH_POUR.y + 10);
  tl.set(col, { visibility: 'visible' }, P0)
    .fromTo(col, { attr: { height: 0 } }, { attr: { height: colH() }, duration: 0.2, ease: 'power2.in' }, P0)
    .to(lvl, { p: 0.85, duration: span - 0.2, ease: 'power1.inOut', onUpdate: () => col.setAttribute('height', colH()) }, P0 + 0.2)
    .to(col, { attr: { width: 22, x: MOUTH_POUR.x - 11 }, duration: 0.15, yoyo: true, repeat: Math.floor(span / 0.15), ease: 'sine.inOut' }, P0 + 0.2)
    .to(col, { attr: { y: surfaceY(1) - 10, height: 0 }, duration: 0.3, ease: 'power2.in' }, P1)
    .set(col, { visibility: 'hidden' }, P1 + 0.32);
  // gotas que se funden con la columna (filtro goo) para que el chorro tiemble como un líquido
  const n = 110;
  for (let i = 0; i < n; i++) {
    const t = P0 + (i / n) * span;
    const fall = 0.26;
    const p = Math.min(1, (t + fall - P0 - 0.15) / (span + 0.3));
    const yEnd = surfaceY(Math.max(0, p)) + 10;
    const d = dot(17 + (i % 3) * 5);
    const jx = ((i * 13) % 11) - 5;
    tl.set(d, { visibility: 'visible', attr: { cx: MOUTH_POUR.x + jx, cy: MOUTH_POUR.y } }, t)
      .to(d, { attr: { cy: yEnd, cx: MOUTH_POUR.x + jx * 2 }, duration: fall, ease: 'power1.in' }, t)
      .set(d, { visibility: 'hidden' }, t + fall + 0.02);
    // salpicadura en la superficie cada pocas gotas
    if (i % 9 === 4) {
      for (let k = 0; k < 3; k++) {
        const sp = dot(6 + k * 2, '#F7B6D5');
        const dx = (k - 1) * 46 + jx * 3;
        tl.set(sp, { visibility: 'visible', attr: { cx: MOUTH_POUR.x, cy: yEnd } }, t + fall)
          .to(sp, { attr: { cx: MOUTH_POUR.x + dx }, duration: 0.35, ease: 'none' }, t + fall)
          .to(sp, { keyframes: [{ attr: { cy: yEnd - 50 - k * 12 }, duration: 0.16, ease: 'power2.out' }, { attr: { cy: yEnd + 6 }, duration: 0.19, ease: 'power2.in' }] }, t + fall)
          .set(sp, { visibility: 'hidden' }, t + fall + 0.36);
      }
    }
  }
}

function build() {
  // en el spot nada se pinta antes de su momento
  gsap.defaults({ immediateRender: false });
  const tl = gsap.timeline();
  // 0 · frase de apertura
  tl.add(scrawl($(el, '#l1'), { dur: 1.6, sound: false }), C.vo1)
    .to($(el, '#l1'), { autoAlpha: 0, y: -40, duration: 0.35 }, C.countStart - 0.4);

  // 1 · cuenta atrás de 10 segundos en tiempo real
  tl.set($(el, '#scene'), { autoAlpha: 1 }, C.countStart - 0.3)
    .from($(el, '#fr'), { y: 80, opacity: 0, duration: 0.4, ease: 'power3.out' }, C.countStart - 0.3)
    .from($(el, '#timer'), { scale: 0, rotation: -90, duration: 0.4, ease: 'back.out(2)' }, C.countStart - 0.3)
    .fromTo($(el, '#ring'), { drawSVG: '100%' }, { drawSVG: '0%', duration: 10, ease: 'none' }, C.countStart);
  for (let s = 10; s >= 0; s--) {
    tl.call(() => { $(el, '#sec').textContent = s; }, null, C.countStart + (10 - s));
    tl.fromTo($(el, '#sec'), { scale: 1.25 }, { scale: 1, duration: 0.3, ease: 'power2.out' }, C.countStart + (10 - s));
  }
  // abres
  tl.add(word(0, 'ABRES.', 'var(--blue)'), C.abres)
    .to($(el, '.fr-door'), { rotationY: -112, duration: 0.9, ease: 'back.out(1.3)' }, C.abres)
    .to($(el, '.fr-light'), { opacity: 1, duration: 0.2 }, C.abres + 0.15);
  // coges
  tl.add(word(0, 'COGES.', 'var(--pink)'), C.coges)
    .set($(el, '#nowIn'), { autoAlpha: 0 }, C.coges + 0.1)
    .fromTo($(el, '#bottle'), { autoAlpha: 1, x: -480, y: -170, scale: 0.42, rotation: 0 }, { x: 0, y: 0, scale: 1, rotation: -6, duration: 0.8, ease: 'power3.inOut' }, C.coges + 0.1)
    .to($(el, '#fr'), { x: -260, scale: 0.85, opacity: 0.35, duration: 0.8, ease: 'power3.inOut' }, C.coges + 0.1);
  // destapas
  tl.add(word(0, 'DESTAPAS.', 'var(--blue)'), C.destapas);
  // el tapón se desenrosca (tres giros cortos), salta girando y cae
  [0, 1, 2].forEach((k) => {
    tl.to($(el, '#cap'), { rotation: k % 2 ? 9 : -9, y: -6 - k * 5, scaleX: 0.94, duration: 0.08, ease: 'power1.inOut' }, C.twist + k * 0.16)
      .to($(el, '#cap'), { rotation: 0, scaleX: 1, duration: 0.08, ease: 'power1.inOut' }, C.twist + k * 0.16 + 0.08);
  });
  tl.to($(el, '#cap'), { x: 330, y: -460, rotation: 620, duration: 0.75, ease: 'power2.out' }, C.pop)
    .to($(el, '#cap'), { y: 1100, rotation: 900, duration: 0.85, ease: 'power2.in' }, C.pop + 0.75)
    .set($(el, '#cap'), { autoAlpha: 0 }, C.pop + 1.6)
    .to($(el, '#bottle'), { y: 18, duration: 0.07, yoyo: true, repeat: 1 }, C.pop);
  // chispitas de líquido al abrir
  spray(tl, C.pop + 0.02);
  // bebes
  tl.add(word(0, 'BEBES.', 'var(--pink)'), C.bebes)
    .to($(el, '#bottle'), { rotation: 112, x: 235, y: -420, duration: 0.65, ease: 'power2.inOut' }, C.bebes + 0.05)
    .to($(el, '#bottle'), { rotation: 116, duration: 0.3, yoyo: true, repeat: 6, ease: 'sine.inOut' }, C.pour)
    .to($(el, '#bottle'), { rotation: -6, x: 0, y: 0, duration: 0.5, ease: 'power2.inOut' }, C.pourEnd)
    .to($(el, '#bottle'), { x: 900, rotation: 25, autoAlpha: 0, duration: 0.45, ease: 'power2.in' }, C.listo);
  pour(tl);
  // cero
  tl.add(stamp($(el, '#done'), { rot: -8, quake: 0, sound: false }), C.zero)
    .to($(el, '#timer'), { scale: 1.12, duration: 0.15, yoyo: true, repeat: 1 }, C.zero);

  // 2 · tres golpes
  tl.to($(el, '#scene'), { autoAlpha: 0, duration: 0.3 }, C.diez - 0.3);
  [['.c1', C.diez], ['.c2', C.pastillas], ['.c3', C.polvos]].forEach(([s, t], i) => {
    tl.fromTo($(el, `.sp-card${s}`), { autoAlpha: 1, scale: 3, rotation: [-10, 8, -6][i] }, { scale: 1, rotation: [-3, 2, -2][i], duration: 0.22, ease: 'power4.in' }, t);
  });

  // 3 · el rodillo imprime la portada final
  tl.set($(el, '#rl'), { autoAlpha: 1, y: -160 }, C.logo)
    .to($(el, '#rl'), { y: 1100, duration: 0.85, ease: 'power2.inOut' }, C.logo)
    .set($(el, '#rl'), { autoAlpha: 0 }, C.logo + 0.85)
    .fromTo($(el, '#end'), { autoAlpha: 1, clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.85, ease: 'power2.inOut' }, C.logo)
    .add(misreg($(el, '#e1'), { k: 2.2, dur: 1.0 }), C.logo + 0.5)
    .add(gsap.timeline().add($$(el, '#end .lineup img').map((im, i) => drop(im, { from: -1200, weight: 0.9, quake: 0, sound: false }).delay(i * 0.12))), C.logo + 0.9)
    .add(scrawl($(el, '#e2'), { dur: 1.0, sound: false }), C.vo4 + 1.2)
    .to({}, { duration: C.end - (C.vo4 + 2.2) });
  return tl;
}

await document.fonts.ready;
await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = r; i.onerror = r; }))));
if (render) {
  gsap.ticker.lagSmoothing(0);
  gsap.globalTimeline.pause();
  build();
  window.__seek = (t) => { gsap.globalTimeline.totalTime(t); };
  window.__ready = true;
} else {
  const fit = () => { const s = Math.min(innerWidth / 1920, innerHeight / 1080); el.style.transform = `translate(-50%,-50%) scale(${s})`; };
  fit(); addEventListener('resize', fit);
  build();
}
