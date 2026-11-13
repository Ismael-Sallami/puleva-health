import '@fontsource/anton';
import '@fontsource-variable/archivo';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource/permanent-marker';
import '@fontsource/space-mono/400.css';
import '@fontsource/space-mono/700.css';
import './style.css';
import { gsap, state, stamp } from './fx.js';
import { sfx } from './sfx.js';
import { preloadBlueprint } from './blueprint.js';
import { SLIDES } from './slides.js';
import { setupFullscreen } from './fullscreen.js';

const params = new URLSearchParams(location.search);
const bc = 'BroadcastChannel' in window ? new BroadcastChannel('puleva-health-zine') : null;

if (params.has('presenter')) presenter();
else deck();

// ═════════════════════════════════════════════════════════════════ PRESENTACIÓN
async function deck() {
  document.body.innerHTML = `
    <div id="stage">
      <div id="world"></div>
      <div id="buyers">
        <span class="by-t">Hay que convencer a</span>
        ${['Consumidor', 'Súper', 'Lactalis'].map((b, i) => `<div class="by" data-i="${i}"><i>${i + 1}</i>${b}<em class="by-stamp">SÍ</em></div>`).join('')}
      </div>
      <div id="folio"><span>PULEVA HEALTH · FANZINE DE LA FINAL</span><b id="pg">01</b></div>
      <div id="roller"><div class="drum"></div><div class="ink-line"></div></div>
    </div>
    <div id="blackout"></div>
    <div id="help"><b>→ / espacio / clic</b> siguiente · <b>←</b> atrás · <b>F</b> pantalla completa · <b>P</b> ponente · <b>M</b> sonido · <b>B</b> negro · <b>H</b> ayuda</div>`;
  const stage = document.getElementById('stage');
  const world = document.getElementById('world');
  const roller = document.getElementById('roller');
  const pg = document.getElementById('pg');
  const buyersEl = document.getElementById('buyers');

  const fit = () => {
    const s = Math.min(innerWidth / 1920, innerHeight / 1080);
    window.__stageScale = s;
    stage.style.transform = `translate(-50%,-50%) scale(${s})`;
  };
  fit();
  addEventListener('resize', fit);

  await Promise.all([document.fonts.ready, preloadBlueprint().catch((e) => console.warn(e)),
    document.fonts.load('400 80px Anton'), document.fonts.load('400 40px "Permanent Marker"')]);

  // ---- marcador de los tres compradores
  const buyerBoxes = [...buyersEl.querySelectorAll('.by')];
  function setBuyers(show, n) {
    buyersEl.classList.toggle('on', !!show);
    buyerBoxes.forEach((b, i) => {
      const st = b.querySelector('.by-stamp');
      gsap.killTweensOf(st);
      gsap.set(st, { autoAlpha: i < n ? 1 : 0, scale: 1, rotation: -14 });
      b.classList.toggle('done', i < n);
    });
  }
  const stampBuyer = (i) => {
    const b = buyerBoxes[i];
    const tl = gsap.timeline();
    tl.call(() => b.classList.add('done'));
    tl.add(stamp(b.querySelector('.by-stamp'), { rot: -14, quake: 0.3 }));
    return tl;
  };

  let idx = 0, step = 0, cur = null, el = null, cleanup = null, busy = false;
  const ctx = { rewinding: false, stampBuyer, stage };

  function teardown(node, clean, tl) {
    if (clean) try { clean(); } catch (e) { console.warn(e); }
    if (tl) tl.kill();
    gsap.killTweensOf(node.querySelectorAll('*'));
    node.remove();
  }

  function mount(i, keepOld = false) {
    const old = { el, cleanup, cur };
    if (el && !keepOld) teardown(el, cleanup, cur);
    const S = SLIDES[i];
    el = document.createElement('section');
    el.className = `slide ${S.theme || 'paper'}`;
    el.dataset.id = S.id;
    el.innerHTML = S.html;
    world.appendChild(el);
    state.slideEl = el;
    cur = null;
    cleanup = S.init ? S.init(el, ctx) : null;
    idx = i;
    step = 0;
    setBuyers(S.buyers?.[0], S.buyers?.[1] || 0);
    pg.textContent = String(i + 1).padStart(2, '0');
    return old;
  }

  function run(k) {
    const r = SLIDES[idx].steps[k](el, ctx);
    cur = r || null;
    step = k + 1;
  }

  function fastForward(n) {
    ctx.rewinding = true;
    sfx.silent++;
    for (let k = 0; k < n; k++) { run(k); if (cur) cur.progress(1); }
    sfx.silent--;
    ctx.rewinding = false;
  }

  function finishCurrent() {
    if (cur && cur.isActive && cur.isActive()) {
      sfx.silent++; cur.progress(1); sfx.silent--;
      return true;
    }
    return false;
  }

  // Transición: el rodillo de la risógrafo baja e "imprime" la página nueva encima de la anterior
  function goTo(i, where = 'start', animate = true) {
    if (i < 0 || i >= SLIDES.length || busy) return;
    if (!animate) {
      mount(i);
      if (where === 'end') fastForward(SLIDES[i].steps.length); else run(0);
      sync();
      return;
    }
    busy = true;
    const old = mount(i, true);
    const fresh = el;
    run(0);
    if (cur) cur.pause();
    sync();
    sfx.roller(0.85);
    const tl = gsap.timeline({
      onComplete: () => {
        if (old.el) teardown(old.el, old.cleanup, old.cur);
        gsap.set(fresh, { clearProps: 'clipPath' });
        busy = false;
      },
    });
    tl.set(roller, { autoAlpha: 1, y: -160 })
      .fromTo(fresh, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.85, ease: 'power2.inOut' }, 0)
      .to(roller, { y: 1080, duration: 0.85, ease: 'power2.inOut' }, 0)
      .fromTo(fresh, { filter: 'saturate(2.2) contrast(1.15)' }, { filter: 'saturate(1) contrast(1)', duration: 1.1, ease: 'power2.out' }, 0.2)
      .set(roller, { autoAlpha: 0 })
      .call(() => { if (cur) cur.play(); }, null, 0.35);
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
    if (step > 1) { const target = step - 1; mount(idx); fastForward(target); sync(); }
    else if (idx > 0) goTo(idx - 1, 'end', false);
  }

  function sync() {
    history.replaceState(null, '', `#${idx + 1}.${step}`);
    bc && bc.postMessage({ type: 'state', idx, step, n: SLIDES[idx].steps.length, total: SLIDES.length });
  }

  const fsc = setupFullscreen({ onStart: () => sfx.unlock() });
  addEventListener('keydown', (e) => {
    const k = e.key;
    if (['ArrowRight', 'ArrowDown', ' ', 'PageDown', 'Enter'].includes(k)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); prev(); }
    else if (k === 'f' || k === 'F') { fsc.toggle(); }
    else if (k === 'm' || k === 'M') { sfx.muted = !sfx.muted; document.querySelectorAll('video').forEach((v) => { v.muted = sfx.muted; }); }
    else if (k === 'b' || k === 'B' || k === '.') document.body.classList.toggle('black');
    else if (k === 'h' || k === 'H' || k === '?') document.body.classList.toggle('show-help');
    else if (k === 'p' || k === 'P') window.open(`${location.pathname}?presenter`, 'puleva-zine-presenter', 'width=1280,height=800');
    else if (k === 'Home') goTo(0, 'start', false);
    else if (k === 'End') goTo(SLIDES.length - 1, 'end', false);
  });
  stage.addEventListener('click', (e) => { if (e.target.closest('video, input, .interactive')) return; next(); });
  stage.addEventListener('contextmenu', (e) => { e.preventDefault(); prev(); });
  if (bc) {
    bc.onmessage = ({ data }) => {
      if (data.type !== 'cmd') return;
      if (data.cmd === 'next') next();
      if (data.cmd === 'prev') prev();
      if (data.cmd === 'goto') goTo(data.idx, 'start');
      if (data.cmd === 'hello') sync();
    };
  }

  const m = location.hash.match(/^#(\d+)\.?(\d+)?/);
  if (m) {
    const i = Math.min(SLIDES.length - 1, Math.max(0, +m[1] - 1));
    mount(i);
    fastForward(Math.max(1, Math.min(SLIDES[i].steps.length, +(m[2] || 1))));
    sync();
  } else { mount(0); run(0); sync(); }
  window.__deck = { next, prev, goTo, get idx() { return idx; }, get step() { return step; }, gsap };
}

// ═════════════════════════════════════════════════════════════════ VISTA DE PONENTE
function presenter() {
  document.title = 'Puleva Health · Ponente';
  document.body.className = 'presenter';
  document.body.innerHTML = `
    <header><div id="pt-title">—</div><div id="pt-block"></div><div id="pt-timer">00:00</div><div id="pt-clock"></div></header>
    <main>
      <section id="pt-now"><small id="pt-meta"></small><h2 id="pt-h">Esperando a la presentación…</h2>
        <pre id="pt-notes">Abre la presentación en otra ventana del mismo navegador (o pulsa P en ella). Esta vista se sincroniza sola.</pre></section>
      <aside><small>SIGUIENTE</small><h3 id="pt-next"></h3><div id="pt-dots"></div>
        <div class="pt-btns"><button id="pt-prev">← Atrás</button><button id="pt-nextb">Siguiente →</button></div>
        <button id="pt-reset">Reiniciar cronómetro</button>
        <ol id="pt-list"></ol>
      </aside>
    </main>`;
  const $ = (s) => document.querySelector(s);
  let t0 = null;
  const send = (cmd, extra = {}) => bc && bc.postMessage({ type: 'cmd', cmd, ...extra });
  const go = () => { if (!t0) t0 = Date.now(); send('next'); };
  $('#pt-prev').onclick = () => send('prev');
  $('#pt-nextb').onclick = go;
  $('#pt-reset').onclick = () => { t0 = Date.now(); };
  $('#pt-list').innerHTML = SLIDES.map((s, i) => `<li data-i="${i}"><b>${s.title}</b> <span>${s.speaker} · ${s.time}</span></li>`).join('');
  $('#pt-list').onclick = (e) => { const li = e.target.closest('li'); if (li) send('goto', { idx: +li.dataset.i }); };
  addEventListener('keydown', (e) => {
    if (['ArrowRight', ' ', 'PageDown', 'Enter'].includes(e.key)) { e.preventDefault(); go(); }
    if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); send('prev'); }
  });
  setInterval(() => {
    $('#pt-clock').textContent = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    if (t0) {
      const s = Math.floor((Date.now() - t0) / 1000);
      $('#pt-timer').textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
      $('#pt-timer').classList.toggle('late', s > 570);
    }
  }, 500);
  if (bc) {
    bc.onmessage = ({ data }) => {
      if (data.type !== 'state') return;
      const S = SLIDES[data.idx];
      $('#pt-title').textContent = `${data.idx + 1} / ${data.total}`;
      $('#pt-block').textContent = `${S.speaker} · objetivo ${S.time}`;
      $('#pt-meta').textContent = `Habla ${S.speaker} · paso ${data.step} de ${data.n}`;
      $('#pt-h').textContent = S.title;
      $('#pt-notes').textContent = S.notes;
      $('#pt-next').textContent = data.step < data.n ? 'Más animaciones en esta página' : (SLIDES[data.idx + 1]?.title || '— fin —');
      $('#pt-dots').innerHTML = Array.from({ length: data.n }, (_, k) => `<i class="${k < data.step ? 'on' : ''}"></i>`).join('');
      document.querySelectorAll('#pt-list li').forEach((li, i) => li.classList.toggle('cur', i === data.idx));
    };
    send('hello');
  }
}
