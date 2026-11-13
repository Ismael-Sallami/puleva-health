// Caja de herramientas del borrador 2 (estilo risógrafo): sellos, tintas desregistradas, rotulador, tickets...
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { SplitText } from 'gsap/SplitText';
import { Physics2DPlugin } from 'gsap/Physics2DPlugin';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { CustomEase } from 'gsap/CustomEase';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { TextPlugin } from 'gsap/TextPlugin';
import { sfx } from './sfx.js';

gsap.registerPlugin(DrawSVGPlugin, SplitText, Physics2DPlugin, ScrambleTextPlugin, CustomEase, MotionPathPlugin, TextPlugin);

export { gsap, SplitText };
const NS = 'http://www.w3.org/2000/svg';

export const state = { slideEl: null };

// ---------- Marcas de rotulador hechas a mano ----------
function rnd(seed) {
  let s = seed || Math.floor(Math.random() * 1e9);
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

function catmull(pts) {
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

function markPaths(type, w, h, pad, r) {
  const j = (a) => (r() - 0.5) * a;
  if (type === 'circle') {
    const cx = w / 2, cy = h / 2, rx = w / 2 + pad, ry = h / 2 + pad * 0.8;
    const pts = [];
    const a0 = -Math.PI * 0.85 + j(0.3);
    const sweep = Math.PI * 2 * 1.1;
    const n = 26;
    for (let i = 0; i <= n; i++) {
      const a = a0 + (sweep * i) / n;
      const k = 1 + j(0.07) + (i / n) * 0.06;
      pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    return [catmull(pts)];
  }
  if (type === 'underline') {
    const y = h + pad * 0.4;
    const a = [], b = [];
    for (let i = 0; i <= 8; i++) a.push([-pad * 0.3 + (w + pad * 0.6) * i / 8, y + j(6)]);
    for (let i = 8; i >= 0; i--) b.push([-pad * 0.1 + (w + pad * 0.3) * i / 8, y + 9 + j(6)]);
    return [catmull(a), catmull(b)];
  }
  if (type === 'strike') {
    const pts = [];
    for (let i = 0; i <= 8; i++) pts.push([-pad * 0.4 + (w + pad * 0.8) * i / 8, h * 0.55 + j(8) - i * 1.2]);
    return [catmull(pts)];
  }
  if (type === 'cross') {
    return [
      catmull([[-pad, -pad], [w * 0.5 + j(10), h * 0.5 + j(10)], [w + pad, h + pad]]),
      catmull([[w + pad, -pad], [w * 0.5 + j(10), h * 0.5 + j(10)], [-pad, h + pad]]),
    ];
  }
  if (type === 'box') {
    const pts = [[-pad + j(6), -pad + j(6)], [w + pad + j(6), -pad + j(6)], [w + pad + j(6), h + pad + j(6)], [-pad + j(6), h + pad + j(6)], [-pad + j(6), -pad * 1.3]];
    return [pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')];
  }
  if (type === 'highlight') {
    const y = h * 0.58;
    return [catmull([[-pad * 0.4, y + j(4)], [w * 0.5, y + j(6)], [w + pad * 0.4, y + j(4)]])];
  }
  if (type === 'arrow') {
    // flecha curva desde abajo-izquierda apuntando al elemento
    return [catmull([[-pad * 5, h + pad * 3], [-pad * 3, h + pad * 0.5], [-pad * 0.6, h * 0.6]]),
      `M${(-pad * 0.6 - 26).toFixed(1)} ${(h * 0.6 - 4).toFixed(1)} L${(-pad * 0.6).toFixed(1)} ${(h * 0.6).toFixed(1)} L${(-pad * 0.6 - 14).toFixed(1)} ${(h * 0.6 + 24).toFixed(1)}`];
  }
  return [];
}

/** Rodea / subraya / tacha un elemento con trazo de rotulador. La geometría se mide al empezar a dibujar. */
export function mark(el, type = 'circle', opts = {}) {
  const { color = '#FF5A3C', width = 6, pad = 18, dur = 0.65, seed, sound = true, opacity = 1 } = opts;
  const isSvg = el instanceof SVGElement;
  const host = isSvg ? el.closest('.slide') : el;
  const svg = document.createElementNS(NS, 'svg');
  svg.classList.add('mark-svg');
  svg.style.cssText = `position:absolute;left:0;top:0;overflow:visible;pointer-events:none;z-index:${type === 'highlight' ? -1 : 55}`;
  const r = rnd(seed);
  const n = markPaths(type, 10, 10, pad, rnd(1)).length;
  const paths = Array.from({ length: n }, () => {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('fill', 'none');
    p.setAttribute('stroke', color);
    p.setAttribute('stroke-linecap', type === 'highlight' ? 'butt' : 'round');
    p.setAttribute('stroke-linejoin', 'round');
    p.setAttribute('opacity', type === 'highlight' ? 0.45 * opacity : opacity);
    p.style.visibility = 'hidden';
    svg.appendChild(p);
    return p;
  });
  const build = () => {
    if (!isSvg && getComputedStyle(el).position === 'static') el.style.position = 'relative';
    if (!svg.parentNode) host.appendChild(svg);
    const sc = window.__stageScale || 1;
    const hr = host.getBoundingClientRect();
    let box;
    const kids = isSvg ? [] : [...el.querySelectorAll('.wd, .ch')];
    const rects = kids.length ? kids.map((k) => k.getBoundingClientRect()) : [el.getBoundingClientRect()];
    box = {
      x1: Math.min(...rects.map((q) => q.left)), x2: Math.max(...rects.map((q) => q.right)),
      y1: Math.min(...rects.map((q) => q.top)), y2: Math.max(...rects.map((q) => q.bottom)),
    };
    const ox = (box.x1 - hr.left) / sc, oy = (box.y1 - hr.top) / sc;
    const w = (box.x2 - box.x1) / sc, h = (box.y2 - box.y1) / sc;
    svg.style.left = `${isSvg || kids.length ? ox : 0}px`;
    svg.style.top = `${isSvg || kids.length ? oy : 0}px`;
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);
    markPaths(type, w, h, pad, r).forEach((d, i) => {
      paths[i].setAttribute('d', d);
      paths[i].setAttribute('stroke-width', type === 'highlight' ? h * 0.72 : width);
    });
  };
  const tl = gsap.timeline();
  tl.call(build, null, 0);
  if (sound) tl.call(() => sfx.scribble(dur * n * 0.9), null, 0);
  paths.forEach((p, i) => {
    tl.fromTo(p, { drawSVG: '0%', visibility: 'visible' }, { drawSVG: '100%', visibility: 'visible', duration: dur / (i ? 1.6 : 1), ease: 'power1.inOut', immediateRender: false }, i ? '>-0.05' : 0.001);
  });
  return tl;
}

// ---------- Movimiento ----------
export function shake(power = 1, target) {
  const el = target || state.slideEl;
  if (!el) return;
  const tl = gsap.timeline();
  const n = 7;
  for (let i = 0; i < n; i++) {
    const k = (1 - i / n) * power;
    tl.to(el, { x: (Math.random() - 0.5) * 26 * k, y: (Math.random() - 0.5) * 22 * k, rotation: (Math.random() - 0.5) * 0.6 * k, duration: 0.035, ease: 'none' });
  }
  tl.to(el, { x: 0, y: 0, rotation: 0, duration: 0.08 });
  return tl;
}

/** Un objeto cae en seco desde arriba, aplasta al tocar suelo y rebota con elasticidad. */
export function drop(el, opts = {}) {
  const { from = -1300, rot = (Math.random() - 0.5) * 24, weight = 1, shadow, dur = 0.55, quake = 0.6, sound = true } = opts;
  const tl = gsap.timeline();
  tl.fromTo(el, { y: from, rotation: rot, autoAlpha: 1, scaleX: 0.92, scaleY: 1.1, transformOrigin: '50% 100%' },
    { y: 0, rotation: 0, scaleX: 1, scaleY: 1, duration: dur, ease: 'power3.in' });
  if (shadow) {
    tl.fromTo(shadow, { scale: 0.2, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: dur, ease: 'power3.in' }, '<');
  }
  tl.call(() => {
    if (sound) weight > 1.3 ? sfx.heavy() : sfx.thud(weight);
    if (quake) shake(quake * weight);
  });
  tl.to(el, { scaleY: 1 - 0.16 / weight, scaleX: 1 + 0.12 / weight, duration: 0.06, ease: 'power2.out' });
  tl.to(el, { scaleY: 1, scaleX: 1, duration: 0.8, ease: 'elastic.out(1.1,0.28)' });
  return tl;
}

/** Aparición con "pop" elástico. */
export function pop(el, opts = {}) {
  const { delay = 0, freq = 520, from = 0 } = opts;
  const tl = gsap.timeline({ delay });
  tl.call(() => sfx.pop(freq));
  tl.fromTo(el, { scale: from, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.7, ease: 'elastic.out(1,0.45)' });
  return tl;
}

export function reveal(el, opts = {}) {
  return gsap.fromTo(el, { autoAlpha: 0, y: opts.y ?? 30 }, { autoAlpha: 1, y: 0, duration: opts.dur ?? 0.6, ease: 'power3.out' });
}

// ---------- Texto cinético ----------
/** Letras que caen y rebotan una a una. */
export function charDrop(el, opts = {}) {
  const { stagger = 0.045, from = -260, sound = true } = opts;
  const split = new SplitText(el, { type: 'chars,words', charsClass: 'ch' });
  const tl = gsap.timeline();
  tl.set(el, { autoAlpha: 1 });
  tl.from(split.chars, {
    y: from, rotation: () => gsap.utils.random(-40, 40), autoAlpha: 0, duration: 0.9,
    ease: 'bounce.out', stagger,
  });
  if (sound) {
    split.chars.forEach((c, i) => {
      if (i % 2 === 0) tl.call(() => sfx.tick(1200 + Math.random() * 900, 0.1), null, i * stagger + 0.5);
    });
  }
  return tl;
}

/** Palabras que entran por máscara de abajo arriba. */
export function wordRise(el, opts = {}) {
  const { stagger = 0.06, dur = 0.8 } = opts;
  const split = new SplitText(el, { type: 'lines,words', linesClass: 'ln', wordsClass: 'wd' });
  split.lines.forEach((l) => { l.style.overflow = 'hidden'; l.style.paddingBottom = '0.08em'; l.style.marginBottom = '-0.08em'; });
  const tl = gsap.timeline();
  tl.set(el, { autoAlpha: 1 });
  tl.from(split.words, { yPercent: 110, rotation: 6, duration: dur, ease: 'power4.out', stagger });
  tl.set(split.lines, { overflow: 'visible' }); // para que subrayados y círculos no se recorten
  return tl;
}

/** Palabras que aparecen al ritmo del habla, una a una, con "golpe". */
export function wordSlam(el, opts = {}) {
  const { stagger = 0.11, sound = true } = opts;
  const split = new SplitText(el, { type: 'words', wordsClass: 'wd' });
  const tl = gsap.timeline();
  tl.set(el, { autoAlpha: 1 });
  split.words.forEach((w, i) => {
    tl.fromTo(w, { autoAlpha: 0, scale: 1.8, filter: 'blur(10px)' }, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.35, ease: 'power3.out' }, i * stagger);
    if (sound && i % 2 === 0) tl.call(() => sfx.tick(700 + i * 15, 0.06), null, i * stagger);
  });
  return tl;
}

// ---------- Números ----------
export function fmt(n, dec = 0) {
  const neg = n < 0;
  const fixed = Math.abs(n).toFixed(dec);
  const [int, frac] = fixed.split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (neg ? '−' : '') + grouped + (frac ? ',' + frac : '');
}

export function countUp(el, to, opts = {}) {
  const { from = 0, dec = 0, prefix = '', suffix = '', dur = 1.4, sound = true, plus = false } = opts;
  const o = { v: from };
  const tl = gsap.timeline();
  tl.set(el, { autoAlpha: 1 });
  if (sound) tl.call(() => sfx.counter(dur, 18));
  tl.to(o, {
    v: to, duration: dur, ease: 'power2.out',
    onUpdate: () => { el.textContent = prefix + (plus && o.v > 0 ? '+' : '') + fmt(o.v, dec) + suffix; },
  }, 0);
  return tl;
}

// ---------- Partículas ----------
export function burst(host, x, y, opts = {}) {
  const { n = 26, colors = ['#FFFFFF'], size = [6, 16], vel = [300, 700], angle = [200, 340], gravity = 900, dur = 1.6, shape = 'circle' } = opts;
  const tl = gsap.timeline();
  if (sfx.silent) return tl; // al rebobinar no dejamos partículas sueltas
  for (let i = 0; i < n; i++) {
    const d = document.createElement('div');
    const s = gsap.utils.random(size[0], size[1]);
    d.className = 'particle';
    d.style.cssText = `left:${x}px;top:${y}px;width:${s}px;height:${shape === 'pill' ? s * 0.45 : s}px;background:${gsap.utils.random(colors)};border-radius:${shape === 'square' ? '2px' : '999px'}`;
    host.appendChild(d);
    tl.fromTo(d, { x: 0, y: 0, opacity: 1, rotation: 0 }, {
      physics2D: { velocity: gsap.utils.random(vel[0], vel[1]), angle: gsap.utils.random(angle[0], angle[1]), gravity },
      rotation: gsap.utils.random(-360, 360), duration: dur, ease: 'none',
    }, 0);
    tl.to(d, { opacity: 0, duration: 0.4 }, dur - 0.4);
  }
  return tl;
}

export const $ = (root, sel) => root.querySelector(sel);
export const $$ = (root, sel) => [...root.querySelectorAll(sel)];


// ---------- Risógrafo ----------
const PINK = '#FF48B0', YEL = '#FFD400';

/** Texto que entra con las tintas desregistradas y luego casa (queda un pelín desplazado, como en una riso real). */
export function misreg(el, opts = {}) {
  const { dur = 0.9, k = 1, delay = 0 } = opts;
  const tl = gsap.timeline({ delay });
  tl.set(el, { autoAlpha: 1 });
  tl.fromTo(el, {
    textShadow: `${28 * k}px ${-14 * k}px 0 ${PINK}, ${-24 * k}px ${16 * k}px 0 ${YEL}`,
    x: -30 * k, opacity: 0,
  }, {
    textShadow: `${4 * k}px ${-2 * k}px 0 ${PINK}, ${-3 * k}px ${2 * k}px 0 ${YEL}`,
    x: 0, opacity: 1, duration: dur, ease: 'power3.out',
  });
  return tl;
}

/** Sello de goma: cae girado, golpea y deja tinta. */
export function stamp(el, opts = {}) {
  const { rot = -12, quake = 0.5, sound = true } = opts;
  const tl = gsap.timeline();
  tl.fromTo(el, { autoAlpha: 0, scale: 2.6, rotation: rot - 18 }, { autoAlpha: 1, scale: 1, rotation: rot, duration: 0.28, ease: 'power4.in' });
  tl.call(() => { if (sound) sfx.stamp(); if (quake) shake(quake); inkSplat(el); });
  tl.fromTo(el, { scale: 0.94 }, { scale: 1, duration: 0.35, ease: 'back.out(3)' });
  return tl;
}

/** Rotulador que escribe: barrido de izquierda a derecha con sonido. */
export function scrawl(el, opts = {}) {
  const { dur = 0.9, sound = true } = opts;
  const tl = gsap.timeline();
  tl.set(el, { autoAlpha: 1 });
  if (sound) tl.call(() => sfx.scribble(dur));
  tl.fromTo(el, { clipPath: 'inset(-20% 100% -20% -2%)' }, { clipPath: 'inset(-20% -2% -20% -2%)', duration: dur, ease: 'power1.inOut' }, 0);
  return tl;
}

/** Escribe un texto letra a letra (máquina / impresora). */
export function typeOut(el, text, opts = {}) {
  const { cps = 38, sound = false } = opts;
  const tl = gsap.timeline();
  tl.set(el, { autoAlpha: 1, text: '' });
  tl.to(el, { text: { value: text }, duration: Math.max(0.15, text.length / cps), ease: 'none' });
  if (sound) tl.call(() => sfx.tick(2400, 0.05), null, 0);
  return tl;
}

/** Trozo de cinta + foto que se pega con un pequeño giro. */
export function tapeOn(el, opts = {}) {
  const { rot = (Math.random() - 0.5) * 8 } = opts;
  const tl = gsap.timeline();
  tl.call(() => sfx.tape());
  tl.fromTo(el, { autoAlpha: 0, y: -80, rotation: rot * 3, scale: 1.08 }, { autoAlpha: 1, y: 0, rotation: rot, scale: 1, duration: 0.55, ease: 'back.out(1.6)' });
  return tl;
}

/** Bloque que "sale de la impresora": entra con las tintas saturadas y desplazadas y se asienta. */
export function printIn(el, opts = {}) {
  const { dur = 0.8, from = 'left' } = opts;
  const tl = gsap.timeline();
  tl.call(() => sfx.roller(0.45));
  tl.fromTo(el, { autoAlpha: 0, x: from === 'left' ? -60 : 60, y: 24, rotation: from === 'left' ? -2 : 2, filter: 'saturate(3) hue-rotate(-25deg) blur(3px)' },
    { autoAlpha: 1, x: 0, y: 0, rotation: 0, filter: 'saturate(1) hue-rotate(0deg) blur(0px)', duration: dur, ease: 'power3.out' }, 0);
  return tl;
}

/** Gotas de tinta que salpican alrededor de un sello al golpear. */
export function inkSplat(el, colors) {
  if (sfx.silent || !el.parentNode) return;
  const host = el.parentNode;
  const c = colors || [getComputedStyle(el).color, '#FF48B0', '#1F3FBF'];
  const x = el.offsetLeft + el.offsetWidth / 2, y = el.offsetTop + el.offsetHeight / 2;
  for (let i = 0; i < 16; i++) {
    const d = document.createElement('i');
    const r = gsap.utils.random(5, 16);
    const a = Math.random() * Math.PI * 2;
    const dist = Math.max(el.offsetWidth, el.offsetHeight) * gsap.utils.random(0.45, 0.75);
    d.className = 'splat';
    d.style.cssText = `left:${x}px;top:${y}px;width:${r}px;height:${r}px;background:${gsap.utils.random(c)}`;
    host.appendChild(d);
    gsap.fromTo(d, { x: 0, y: 0, scale: 0 }, { x: Math.cos(a) * dist, y: Math.sin(a) * dist * 0.6, scale: 1, duration: 0.25, ease: 'power3.out' });
    gsap.to(d, { opacity: 0, duration: 0.6, delay: 1.4, onComplete: () => d.remove() });
  }
}

/** Confeti de papel riso que cae desde arriba. */
export function confetti(host, n = 140) {
  const tl = gsap.timeline();
  if (sfx.silent) return tl;
  const colors = ['#FF48B0', '#FFD400', '#1F3FBF', '#F3EEE3'];
  for (let i = 0; i < n; i++) {
    const d = document.createElement('i');
    const w = gsap.utils.random(14, 34), h = w * gsap.utils.random(0.35, 1);
    d.className = 'confetti';
    d.style.cssText = `left:${gsap.utils.random(-50, 1950)}px;top:-60px;width:${w}px;height:${h}px;background:${gsap.utils.random(colors)};border-radius:${Math.random() < 0.4 ? '50%' : '2px'}`;
    host.appendChild(d);
    tl.to(d, { y: gsap.utils.random(1150, 1300), x: `+=${gsap.utils.random(-200, 200)}`, rotation: gsap.utils.random(-720, 720), rotationX: gsap.utils.random(-360, 360), duration: gsap.utils.random(2.2, 4.2), ease: 'power1.in', delay: Math.random() * 1.2 }, 0);
  }
  return tl;
}
