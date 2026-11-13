import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/fraunces/full-italic.css';
import '@fontsource/caveat/700.css';
import './style.css';
import { gsap, state, loadHandFont } from './fx.js';
import { sfx } from './sfx.js';
import { MilkFluid } from './fluid.js';
import { SLIDES } from './slides.js';
import { setupFullscreen } from './fullscreen.js';

const params = new URLSearchParams(location.search);
const CH = 'puleva-health-deck';
const bc = 'BroadcastChannel' in window ? new BroadcastChannel(CH) : null;

if (params.has('presenter')) presenter();
else deck();

// ═════════════════════════════════════════════════════════════════ DECK
async function deck() {
  document.body.innerHTML = `
    <div id="stage">
      <div id="world"></div>
      <canvas id="milk" width="1440" height="810"></canvas>
      <div id="top"></div>
      <div id="hud"><div id="bar"></div></div>
    </div>
    <div id="blackout"></div>
    <div id="help">
      <b>→ / espacio / clic</b> siguiente · <b>←</b> atrás · <b>F</b> pantalla completa · <b>P</b> vista de ponente ·
      <b>M</b> sonido · <b>B</b> pantalla en negro · <b>H</b> esta ayuda
    </div>`;
  const stage = document.getElementById('stage');
  const world = document.getElementById('world');
  const top = document.getElementById('top');
  const bar = document.getElementById('bar');
  const milk = new MilkFluid(document.getElementById('milk'));

  const fit = () => {
    const s = Math.min(innerWidth / 1920, innerHeight / 1080);
    window.__stageScale = s;
    stage.style.transform = `translate(-50%,-50%) scale(${s})`;
  };
  fit();
  addEventListener('resize', fit);

  await Promise.all([loadHandFont('fonts/caveat-700.woff'), document.fonts.ready,
    document.fonts.load('800 80px "Bricolage Grotesque Variable"'), document.fonts.load('700 80px "Caveat"')]);

  // ---- contexto que reciben las diapositivas
  const toStage = (cx, cy) => {
    const r = stage.getBoundingClientRect();
    const s = window.__stageScale;
    return [(cx - r.left) / s, (cy - r.top) / s];
  };
  const ctxBase = () => ({
    rewinding: false,
    splash: (x, y, p = 1) => { if (!ctx.rewinding && milk.ok) milk.splash(x, y, p); },
    splashEl: (node, p = 1) => {
      if (ctx.rewinding || !milk.ok) return;
      const r = node.getBoundingClientRect();
      const [x, y] = toStage(r.left + r.width / 2, r.bottom);
      milk.splash(x, y - 6, p);
    },
    pourScreen: (cx, cy, dur = 0.6) => {
      if (ctx.rewinding || !milk.ok) return;
      const [x, y] = toStage(cx, cy);
      milk.pourAt(x, y, dur, 1300, 0.0005);
    },
    flood: () => {
      if (ctx.rewinding || !milk.ok) return;
      milk.cfg.gravity = 40; milk.cfg.dyeDiss = 0.0;
      milk.flood(0.7);
      milk.wake(1e9);
    },
  });

  let idx = 0, step = 0, cur = null, el = null, cleanup = null, busy = false;
  let ctx = ctxBase();

  function unmount() {
    if (!el) return;
    if (cleanup) try { cleanup(); } catch (e) { console.warn(e); }
    gsap.killTweensOf(el.querySelectorAll('*'));
    if (cur) cur.kill();
    cur = null;
    el.remove();
    el = null;
    top.innerHTML = '';
  }

  function mount(i) {
    unmount();
    const S = SLIDES[i];
    ctx = ctxBase();
    el = document.createElement('section');
    el.className = `slide ${S.theme}`;
    el.dataset.id = S.id;
    el.innerHTML = S.html;
    world.appendChild(el);
    state.slideEl = el;
    ctx.top = top;
    cleanup = S.init ? S.init(el, ctx) : null;
    idx = i;
    step = 0;
  }

  function run(k) {
    const r = SLIDES[idx].steps[k](el, ctx);
    cur = r || null;
    step = k + 1;
  }

  // ejecuta los pasos 0..n-1 instantáneamente y en silencio (para ir hacia atrás o recargar)
  function fastForward(n) {
    ctx.rewinding = true;
    sfx.silent++;
    for (let k = 0; k < n; k++) {
      run(k);
      if (cur) cur.progress(1);
    }
    sfx.silent--;
    ctx.rewinding = false;
  }

  function finishCurrent() {
    if (cur && cur.isActive && cur.isActive()) {
      sfx.silent++;
      cur.progress(1);
      sfx.silent--;
      return true;
    }
    return false;
  }

  function resetMilk() {
    if (!milk.ok) return;
    gsap.killTweensOf(milk);
    milk.cut = 0.08;
    milk.drain = 0;
    milk.cfg.gravity = 170; milk.cfg.dyeDiss = 0.3;
    milk.active = Math.min(milk.active, 600);
  }

  function goTo(i, where = 'start', animate = true) {
    if (i < 0 || i >= SLIDES.length || busy) return;
    const enter = () => {
      mount(i);
      if (where === 'end') fastForward(SLIDES[i].steps.length);
      else run(0);
      sync();
    };
    if (!animate || !milk.ok || sfx.silent) {
      resetMilk();
      if (milk.ok) milk.clear();
      gsap.fromTo(world, { opacity: 0 }, { opacity: 1, duration: 0.35 });
      enter();
      return;
    }
    // Transición: la leche inunda la pantalla, cambia la escena por debajo y escurre
    busy = true;
    resetMilk();
    milk.cfg.dyeDiss = 0;
    sfx.wave();
    milk.flood(0.5);
    gsap.to(world, { opacity: 0, duration: 0.35, delay: 0.3 });
    gsap.delayedCall(0.7, () => {
      enter();
      gsap.set(world, { opacity: 1 });
      milk.cfg.gravity = 600;
      milk.cfg.dyeDiss = 0.4;
      gsap.fromTo(milk, { drain: 0 }, {
        drain: 1, duration: 1.0, ease: 'power2.in',
        onComplete: () => { milk.clear(); resetMilk(); milk.active = 0; busy = false; },
      });
    });
  }

  function next() {
    sfx.unlock();
    if (busy) return;
    if (finishCurrent()) return;
    if (step < SLIDES[idx].steps.length) { run(step); sync(); return; }
    if (idx < SLIDES.length - 1) goTo(idx + 1);
  }

  function prev() {
    sfx.unlock();
    if (busy) return;
    if (step > 1) {
      const target = step - 1;
      resetMilk();
      if (milk.ok) milk.clear();
      mount(idx);
      fastForward(target);
      sync();
    } else if (idx > 0) {
      goTo(idx - 1, 'end', false);
    }
  }

  function sync() {
    const n = SLIDES[idx].steps.length;
    bar.style.width = `${((idx + step / n) / SLIDES.length) * 100}%`;
    history.replaceState(null, '', `#${idx + 1}.${step}`);
    bc && bc.postMessage({ type: 'state', idx, step, n, total: SLIDES.length });
  }

  // ---- teclado / ratón / ponente
  const fsc = setupFullscreen({ onStart: () => sfx.unlock() });
  addEventListener('keydown', (e) => {
    if (e.repeat && !['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    const k = e.key;
    if (['ArrowRight', 'ArrowDown', ' ', 'PageDown', 'Enter'].includes(k)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); prev(); }
    else if (k === 'f' || k === 'F') { fsc.toggle(); }
    else if (k === 'm' || k === 'M') { sfx.muted = !sfx.muted; document.querySelectorAll('video').forEach((v) => { v.muted = sfx.muted; }); }
    else if (k === 'b' || k === 'B' || k === '.') { document.body.classList.toggle('black'); }
    else if (k === 'h' || k === 'H' || k === '?') { document.body.classList.toggle('show-help'); }
    else if (k === 'p' || k === 'P') { window.open(`${location.pathname}?presenter`, 'puleva-presenter', 'width=1280,height=800'); }
    else if (k === 'Home') { goTo(0, 'start', false); }
    else if (k === 'End') { goTo(SLIDES.length - 1, 'end', false); }
  });
  stage.addEventListener('click', (e) => { if (e.target.closest('video')) return; next(); });
  stage.addEventListener('contextmenu', (e) => { e.preventDefault(); prev(); });
  if (bc) {
    bc.onmessage = ({ data }) => {
      if (data.type === 'cmd') {
        if (data.cmd === 'next') next();
        if (data.cmd === 'prev') prev();
        if (data.cmd === 'goto') goTo(data.idx, 'start');
        if (data.cmd === 'hello') sync();
      }
    };
  }

  // ---- arranque (respeta #diapositiva.paso para recargar sin perder el sitio)
  const m = location.hash.match(/^#(\d+)\.?(\d+)?/);
  if (m) {
    const i = Math.min(SLIDES.length - 1, Math.max(0, +m[1] - 1));
    mount(i);
    fastForward(Math.max(1, Math.min(SLIDES[i].steps.length, +(m[2] || 1))));
    sync();
  } else {
    mount(0);
    run(0);
    sync();
  }
  window.__deck = { next, prev, goTo, get idx() { return idx; }, get step() { return step; }, milk, gsap };
}

// ═════════════════════════════════════════════════════════════════ VISTA DE PONENTE
function presenter() {
  document.title = 'Puleva Health · Ponente';
  document.body.className = 'presenter';
  document.body.innerHTML = `
    <header><div id="pt-title"></div><div id="pt-timer">00:00</div><div id="pt-clock"></div></header>
    <main>
      <section id="pt-now"><small id="pt-meta"></small><h2 id="pt-h"></h2><pre id="pt-notes"></pre></section>
      <aside><small>SIGUIENTE</small><h3 id="pt-next"></h3><div id="pt-dots"></div>
        <div class="pt-btns"><button id="pt-prev">← Atrás</button><button id="pt-nextb">Siguiente →</button></div>
        <button id="pt-reset">Reiniciar cronómetro</button>
        <ol id="pt-list"></ol>
      </aside>
    </main>`;
  const $ = (s) => document.querySelector(s);
  let t0 = null;
  const send = (cmd, extra = {}) => bc && bc.postMessage({ type: 'cmd', cmd, ...extra });
  $('#pt-prev').onclick = () => send('prev');
  $('#pt-nextb').onclick = () => { if (!t0) t0 = Date.now(); send('next'); };
  $('#pt-reset').onclick = () => { t0 = Date.now(); };
  $('#pt-list').innerHTML = SLIDES.map((s, i) => `<li data-i="${i}"><b>${s.title}</b> <span>${s.speaker}</span></li>`).join('');
  $('#pt-list').onclick = (e) => { const li = e.target.closest('li'); if (li) send('goto', { idx: +li.dataset.i }); };
  addEventListener('keydown', (e) => {
    if (['ArrowRight', ' ', 'PageDown', 'Enter'].includes(e.key)) { e.preventDefault(); if (!t0) t0 = Date.now(); send('next'); }
    if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); send('prev'); }
  });
  setInterval(() => {
    const d = new Date();
    $('#pt-clock').textContent = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    if (t0) { const s = Math.floor((Date.now() - t0) / 1000); $('#pt-timer').textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; }
  }, 500);
  $('#pt-h').textContent = 'Esperando a la presentación...';
  $('#pt-notes').textContent = 'Abre la presentación en otra ventana del mismo navegador (o pulsa P en ella). Esta vista se sincroniza sola y desde aquí puedes avanzar con → y ←.';
  if (bc) {
    bc.onmessage = ({ data }) => {
      if (data.type !== 'state') return;
      const S = SLIDES[data.idx];
      $('#pt-title').textContent = `${data.idx + 1} / ${data.total}`;
      $('#pt-meta').textContent = `Habla: ${S.speaker} · paso ${data.step} de ${data.n}`;
      $('#pt-h').textContent = S.title;
      $('#pt-notes').textContent = S.notes;
      $('#pt-next').textContent = data.step < data.n ? 'Más animaciones en esta diapositiva' : (SLIDES[data.idx + 1]?.title || '— fin —');
      $('#pt-dots').innerHTML = Array.from({ length: data.n }, (_, k) => `<i class="${k < data.step ? 'on' : ''}"></i>`).join('');
      document.querySelectorAll('#pt-list li').forEach((li, i) => li.classList.toggle('cur', i === data.idx));
    };
    send('hello');
  }
}
