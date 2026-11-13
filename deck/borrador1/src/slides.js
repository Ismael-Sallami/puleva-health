// Guion de la presentación. Cada diapositiva: tema, notas del ponente, HTML y una lista de "pasos".
// El paso 0 se ejecuta al entrar; cada pulsación de → ejecuta el siguiente.
// Todas las cifras salen del informe del Grupo 6 (PulevaHealth_Grupo6.pdf).
import {
  gsap, handwrite, mark, drop, pop, reveal, charDrop, wordRise, wordSlam, countUp, burst, shake, $, $$,
} from './fx.js';
import { sfx } from './sfx.js';
import { createBottleScene } from './bottle3d.js';

const IMG = {
  care: 'img/care.webp', now: 'img/now.webp', shield: 'img/shield.webp', crea: 'img/crea.webp', clear: 'img/clear.webp',
};
const C = {
  night: '#06124A', cobalt: '#1338BE', lime: '#D7FF3A', coral: '#FF5A3C', cream: '#FFF6E6', sky: '#CFE0FF',
  ink: '#0A1748', pink: '#FF8FB1', orange: '#FF9F1C', white: '#FFFFFF',
};

const tl = () => gsap.timeline();

// ---------------------------------------------------------------------------------------------
export const SLIDES = [
  // 1 ─────────────────────────────────────────────── EL BOTIQUÍN
  {
    id: 'botiquin', theme: 't-night', title: 'El botiquín', speaker: 'Ismael',
    notes: `Arrancamos en silencio. Pulsa → y que el lápiz escriba la pregunta mientras la dejas en el aire.
→ Se abre el botiquín: "Así es como cuidarse sabe hoy: a botiquín."
→ Lo tachamos: "Cuidarse no debería saber a medicina." Pausa.`,
    html: `
      <div class="hint" id="hint">pulsa <b>→</b></div>
      <div id="q1" class="abs h" style="left:110px;top:120px"></div>
      <div id="q2" class="abs h" style="left:110px;top:250px"></div>
      <div class="cabinet abs" id="cab" style="left:1290px;top:250px">
        <div class="cab-inside">
          <div class="cab-light" id="light"></div>
          <div class="cab-shelf" style="top:200px"></div>
          <div class="cab-shelf" style="top:420px"></div>
          <div class="jar" id="jar" style="left:70px;top:58px"><div class="jar-cap"></div><div class="jar-label">VITAMINAS<br><small>60 cápsulas</small></div></div>
          <div class="jar jar-b" style="left:260px;top:90px"><div class="jar-cap"></div><div class="jar-label">ZINC<br><small>comprimidos</small></div></div>
          <div class="blister" style="left:90px;top:330px"></div>
          <div class="blister" style="left:250px;top:345px;transform:rotate(-8deg)"></div>
          <div class="jar" style="left:60px;top:470px;width:130px;height:120px"><div class="jar-cap" style="background:#3C8CFF"></div><div class="jar-label">MAGNESIO</div></div><div class="jar jar-b" style="left:240px;top:488px"><div class="jar-cap" style="background:#2BB673"></div><div class="jar-label">OMEGA 3</div></div>
        </div>
        <div class="cab-door" id="door"><div class="cross"></div><div class="knob"></div></div>
      </div>
      <div id="punch" class="display abs h" style="left:110px;top:640px;font-size:118px;line-height:.95">Cuidarse no debería<br>saber a <span id="med">medicina</span>.</div>
      <div class="fx-layer" id="fx"></div>`,
    init(el) {
      gsap.to($(el, '#hint'), { opacity: 0.25, duration: 0.9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    },
    steps: [
      (el) => tl().from($(el, '#cab'), { autoAlpha: 0, y: 40, duration: 1.2, ease: 'power3.out' }),
      (el) => tl()
        .to($(el, '#hint'), { autoAlpha: 0, duration: 0.3 })
        .add(handwrite($(el, '#q1'), '¿Cuándo fue la última vez que te cuidaste...', { size: 78, color: C.cream, speed: 1.15 }))
        .add(handwrite($(el, '#q2'), '...sin sentir que te estabas medicando?', { size: 78, color: C.lime, speed: 1.15 }), '+=0.15'),
      (el, ctx) => tl()
        .call(() => sfx.whoosh(0.5, false))
        .to($(el, '#door'), { rotationY: -118, duration: 1.1, ease: 'back.out(1.4)' })
        .fromTo($(el, '#light'), { opacity: 0 }, { opacity: 1, duration: 0.08, repeat: 3, yoyo: true }, 0.2)
        .to($(el, '#light'), { opacity: 1, duration: 0.1 })
        .call(() => {
          burst($(el, '#fx'), 1435, 330, { n: 22, colors: ['#FF5A3C', '#FFFFFF', '#FFC531', '#7FB2FF'], size: [16, 30], shape: 'pill', vel: [250, 650], angle: [200, 340], gravity: 1300, dur: 1.8 });
          [0, 0.15, 0.3, 0.5, 0.7].forEach((d) => gsap.delayedCall(0.55 + d, () => sfx.tick(2600 + Math.random() * 800, 0.14)));
        }, null, 0.5),
      (el) => tl()
        .add(mark($(el, '#jar'), 'circle', { color: C.coral, width: 9, pad: 36 }))
        .add(mark($(el, '#jar'), 'cross', { color: C.coral, width: 10, pad: 20, dur: 0.3 }))
        .call(() => sfx.buzz())
        .add(wordRise($(el, '#punch'), { stagger: 0.07 }), '+=0.1')
        .add(mark($(el, '#med'), 'underline', { color: C.coral, width: 8, pad: 10 }), '+=0.1'),
    ],
  },

  // 2 ─────────────────────────────────────────────── TÍTULO 3D
  {
    id: 'titulo', theme: 't-cobalt', title: 'Puleva Health (bote 3D)', speaker: 'Ismael',
    notes: `Cada → es un gesto del producto: cae el bote · se vierte la leche · se enrosca el tapón · se viste la etiqueta · "Salud que se bebe".
Frase: "Somos el Grupo 6 y esto es Puleva Health: complementos naturales en monodosis líquidas, al estilo de un Actimel."`,
    html: `
      <div class="spot abs"></div>
      <div id="three" class="abs" style="left:40px;top:0;width:860px;height:1080px"></div>
      <div class="abs" style="left:930px;top:190px;width:900px">
        <div class="kicker h" id="k">GRUPO 6 · IV HACKATHON UGR × LACTALIS PULEVA</div>
        <div class="mega h" id="t1">PULEVA</div>
        <div class="mega mega-o h" id="t2">HEALTH</div>
        <div id="claim" class="h" style="margin-top:18px"></div>
        <div class="chips">
          <span class="chip h">Monodosis líquidas</span>
          <span class="chip h">Ingredientes lácteos</span>
          <span class="chip h">Claims autorizados EFSA</span>
        </div>
      </div>`,
    init(el, ctx) {
      ctx.scene = createBottleScene($(el, '#three'), { variant: { name: 'DAILY' } });
      return () => ctx.scene.destroy();
    },
    steps: [
      (el) => tl().fromTo($(el, '#k'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 })
        .to($(el, '#k'), { duration: 1.2, scrambleText: { text: 'GRUPO 6 · IV HACKATHON UGR × LACTALIS PULEVA', chars: 'upperCase', speed: 0.6 } }),
      (el, ctx) => tl().add(ctx.scene.drop()).call(() => ctx.splash(470, 900, 1.1), null, 0.6),
      (el, ctx) => tl().add(ctx.scene.pour(2.4)),
      (el, ctx) => tl().add(ctx.scene.capOn()),
      (el, ctx) => tl().add(ctx.scene.wrap())
        .call(() => sfx.boom(), null, 0.9)
        .add(charDrop($(el, '#t1'), { stagger: 0.05 }), 0.6)
        .add(charDrop($(el, '#t2'), { stagger: 0.05 }), 0.85),
      (el) => tl()
        .add(handwrite($(el, '#claim'), 'Salud que se bebe.', { size: 150, color: C.lime, stroke: 3, speed: 1.1 }))
        .add(mark($(el, '#claim'), 'underline', { color: C.white, width: 7, pad: 4 }))
        .add(gsap.timeline().add($$(el, '.chip').map((c, i) => pop(c, { delay: i * 0.12, freq: 500 + i * 120 }))), '-=0.2'),
    ],
  },

  // 3 ─────────────────────────────────────────────── VILLANOS
  {
    id: 'villanos', theme: 't-sky', title: 'El lineal de hoy', speaker: 'Ismael',
    notes: `"Hoy, cuidarse en el súper es esto..."
→ La pastilla: el 37,4 % de los adultos tiene dificultad para tragar comprimidos o cápsulas (Schiele et al., 2013), y tomarlos recuerda a estar enfermo.
→ El polvo: bote de 1 kg, báscula, coctelera y rutina. Es de gimnasio.
→ Y en el pasillo no hay a quién preguntar: nombres técnicos, marca blanca sin aval.`,
    html: `
      <div id="h" class="title abs h" style="left:110px;top:80px;width:1700px">Hoy, cuidarse en el súper <em>es esto</em>.</div>
      <div class="col abs" style="left:110px">
        <div class="floor"><div class="jar jar-xl h" id="v1"><div class="jar-cap"></div><div class="jar-label">MULTI<br>VITAMIN<br><small>90 cápsulas</small></div></div></div>
        <div class="hand-slot h" id="l1"></div>
        <div class="stat h" id="s1"><b id="n1">0</b><span>de los adultos tiene dificultad para tragar pastillas o cápsulas</span></div>
      </div>
      <div class="col abs" style="left:700px">
        <div class="floor"><div class="tub h" id="v2"><div class="tub-lid"></div><div class="tub-label">WHEY<br><b>1 KG</b></div></div></div>
        <div class="hand-slot h" id="l2"></div>
        <div class="stat h" id="s2"><b>1 kg</b><span>que pide báscula, coctelera y rutina</span></div>
      </div>
      <div class="col abs" style="left:1290px">
        <div class="floor"><div class="qmark h" id="v3">?</div></div>
        <div class="hand-slot h" id="l3"></div>
        <div class="stat h" id="s3"><b>0</b><span>farmacéuticos en el pasillo para explicar nombres técnicos</span></div>
      </div>
      <div class="fx-layer" id="fx"></div>`,
    steps: [
      (el) => wordRise($(el, '#h')),
      (el) => tl().add(drop($(el, '#v1'), { weight: 1 }))
        .call(() => burst($(el, '#fx'), 330, 640, { n: 18, colors: ['#FF5A3C', '#FFFFFF', '#FFC531'], size: [14, 26], shape: 'pill', vel: [300, 700], gravity: 1500 }), null, 0.55)
        .add(handwrite($(el, '#l1'), 'parece medicina', { size: 70, color: C.coral }), 0.8)
        .add(reveal($(el, '#s1')), '-=0.3')
        .add(countUp($(el, '#n1'), 37.4, { dec: 1, suffix: ' %' }), '<'),
      (el) => tl().add(drop($(el, '#v2'), { weight: 1.8, quake: 1 }))
        .call(() => burst($(el, '#fx'), 920, 650, { n: 50, colors: ['#E9E2D3', '#FFFFFF', '#C8BFA9'], size: [5, 14], vel: [150, 520], angle: [190, 350], gravity: 500, dur: 2.2 }), null, 0.55)
        .add(handwrite($(el, '#l2'), 'parece de gimnasio', { size: 70, color: C.coral }), 0.9)
        .add(reveal($(el, '#s2')), '-=0.3'),
      (el) => tl().add(drop($(el, '#v3'), { weight: 0.8, rot: 30 }))
        .to($(el, '#v3'), { rotation: 12, duration: 0.25, yoyo: true, repeat: 3, ease: 'sine.inOut' })
        .add(handwrite($(el, '#l3'), 'nadie a quién preguntar', { size: 70, color: C.coral }), 0.8)
        .add(reveal($(el, '#s3')), '-=0.3'),
    ],
  },

  // 4 ─────────────────────────────────────────────── OPORTUNIDAD
  {
    id: 'oportunidad', theme: 't-night', title: 'La oportunidad', speaker: 'Ismael',
    notes: `"Y sin embargo, la demanda está ahí."
→ Entre el 70 % y el 80 % de los adultos tomó algún complemento el último año (Alimarket, 2026).
→ En súper e híper la categoría ya factura 119,5 M€ y crece un 13,2 % (NielsenIQ, 2026).
→ Los vasos: 72 % no llega al magnesio, 83 % al zinc, 80 % a la vitamina E (ANIBES, Olza et al., 2017).
→ Remate: "...y el lineal solo ofrece cápsulas."`,
    html: `
      <div id="h" class="title abs h" style="left:110px;top:70px;color:var(--cream)">Y sin embargo, <em>la demanda está ahí</em>.</div>
      <div class="abs" style="left:110px;top:270px;width:820px">
        <svg width="0" height="0" style="position:absolute"><defs><linearGradient id="half" x1="0" x2="1"><stop offset=".5" stop-color="#D7FF3A"/><stop offset=".5" stop-color="rgba(255,255,255,.22)"/></linearGradient></defs></svg>
        <div class="people" id="people">${Array.from({ length: 10 }, () => '<svg class="person h" viewBox="0 0 40 90"><circle cx="20" cy="12" r="11"/><path d="M4 90 V40 a16 16 0 0 1 32 0 V90 Z"/></svg>').join('')}</div>
        <div class="cap-text h" id="pt"><b>7–8 de cada 10</b> adultos tomó algún complemento el último año</div>
        <div class="money h" id="money"><span id="m1">0</span><small> M€</small></div>
        <div class="cap-text h" id="mt">se venden ya en <b>súper e híper</b> · <span class="up" id="up">+13,2 %</span> al año</div>
      </div>
      <div class="abs" style="left:1010px;top:270px;width:820px">
        <div class="glasses">
          ${[['magnesio', 72], ['zinc', 83], ['vitamina E', 80]].map(([n, v], i) => `
          <div class="glass-wrap">
            <svg class="glass" viewBox="0 0 200 300" id="g${i}">
              <defs><clipPath id="gc${i}"><path d="M20 10 L180 10 L160 290 L40 290 Z"/></clipPath></defs>
              <g clip-path="url(#gc${i})">
                <g class="milk" data-v="${v}" transform="translate(0,300)">
                  <path class="wave" d="M-200 10 Q-150 -6 -100 10 T0 10 T100 10 T200 10 T300 10 T400 10 V400 H-200 Z" fill="#FFFDF7"/>
                </g>
              </g>
              <path d="M20 10 L180 10 L160 290 L40 290 Z" fill="none" stroke="#CFE0FF" stroke-width="5" stroke-linejoin="round" opacity=".9"/>
              <path d="M40 30 L56 270" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".35"/>
            </svg>
            <div class="glass-n h"><b data-n="${v}">0 %</b><span>no llega en<br>${n}</span></div>
          </div>`).join('')}
        </div>
        <div id="fin" class="abs h" style="left:-10px;top:560px"></div>
      </div>`,
    init(el) {
      $$(el, '.wave').forEach((w, i) => gsap.to(w, { x: 200, duration: 2.2 + i * 0.3, repeat: -1, ease: 'none' }));
    },
    steps: [
      (el) => wordRise($(el, '#h')),
      (el) => {
        const t = tl();
        $$(el, '.person').forEach((p, i) => {
          t.fromTo(p, { y: -60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'bounce.out' }, i * 0.06);
          if (i < 7) t.to(p, { fill: C.lime, duration: 0.2, onStart: () => sfx.tick(900 + i * 120, 0.12) }, 0.9 + i * 0.09);
          if (i === 7) t.to(p, { fill: 'url(#half)', duration: 0.01 }, 0.9 + i * 0.09);
        });
        return t.add(reveal($(el, '#pt')), 1.4);
      },
      (el) => tl().add(reveal($(el, '#money'))).add(countUp($(el, '#m1'), 119.5, { dec: 1, dur: 1.6 }), 0)
        .add(reveal($(el, '#mt')), 0.8)
        .add(mark($(el, '#up'), 'circle', { color: C.lime, width: 6, pad: 14 }), 1.4),
      (el, ctx) => {
        const t = tl();
        $$(el, '.glass-wrap').forEach((g, i) => {
          const milk = $(g, '.milk');
          const v = +milk.dataset.v;
          const at = i * 0.85;
          t.call(() => { const r = $(g, 'svg').getBoundingClientRect(); ctx.pourScreen(r.left + r.width / 2, r.top - 120, 0.55); }, null, at);
          t.fromTo(milk, { attr: { transform: 'translate(0,300)' } }, { attr: { transform: `translate(0,${300 - v * 2.8})` }, duration: 1.1, ease: 'power2.out' }, at + 0.25);
          t.call(() => sfx.pour(1), null, at);
          t.add(reveal($(g, '.glass-n')), at + 0.6);
          t.add(countUp($(g, '[data-n]'), v, { suffix: ' %', dur: 0.9, sound: false }), at + 0.6);
        });
        return t;
      },
      (el) => tl().add(handwrite($(el, '#fin'), '...y el lineal solo ofrece cápsulas.', { size: 80, color: C.coral })),
    ],
  },

  // 5 ─────────────────────────────────────────────── INSIGHT
  {
    id: 'insight', theme: 't-cobalt', title: 'El insight', speaker: 'Ismael',
    notes: `Léelo en voz alta, despacio, mientras aparecen las palabras: es la voz del consumidor.
→ Se subrayan las tres claves: cada día · diez segundos · la marca que ya está en la nevera.
→ "Del botiquín... a la nevera." Ese es todo el giro estratégico.`,
    html: `
      <div class="quote-mark abs" style="left:90px;top:40px">“</div>
      <div id="q" class="quote abs h" style="left:200px;top:150px;width:1560px">Quiero <span id="k1">cuidarme cada día</span>, pero sin sentir que me medico. Algo que me tome en <span id="k2">diez segundos</span>, como un Actimel, y de una marca que <span id="k3">ya tengo en la nevera</span>.</div>
      <div class="abs h" id="from" style="left:200px;top:760px"><span class="display" style="font-size:120px;color:rgba(255,255,255,.55)" id="botq">Del botiquín</span></div>
      <div class="abs h" id="to" style="left:1000px;top:760px"><span class="display" style="font-size:120px;color:var(--lime)">→ a la nevera.</span></div>
      <svg class="abs h" id="clock" viewBox="0 0 200 200" style="left:1700px;top:40px;width:160px;height:160px">
        <circle cx="100" cy="100" r="86" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="14"/>
        <circle id="ring" cx="100" cy="100" r="86" fill="none" stroke="#D7FF3A" stroke-width="14" stroke-linecap="round" transform="rotate(-90 100 100)"/>
        <text x="100" y="118" text-anchor="middle" fill="#fff" font-size="54" font-weight="800" id="secs">0 s</text>
      </svg>`,
    steps: [
      () => tl(),
      (el) => wordSlam($(el, '#q'), { stagger: 0.085 }),
      (el) => {
        const o = { s: 0 };
        return tl()
          .add(mark($(el, '#k1'), 'highlight', { color: C.lime, pad: 8 }))
          .add(mark($(el, '#k2'), 'circle', { color: C.lime, width: 7, pad: 22 }))
          .set($(el, '#clock'), { autoAlpha: 1 }, '<')
          .fromTo($(el, '#ring'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.6, ease: 'none' }, '<')
          .to(o, { s: 10, duration: 1.6, ease: 'none', onUpdate: () => { $(el, '#secs').textContent = Math.round(o.s) + ' s'; } }, '<')
          .call(() => sfx.counter(1.6, 10), null, '<')
          .call(() => sfx.ding(1046))
          .add(mark($(el, '#k3'), 'underline', { color: C.lime, width: 7, pad: 8 }));
      },
      (el) => tl().add(reveal($(el, '#from'), { y: 0 }))
        .add(mark($(el, '#botq'), 'strike', { color: C.coral, width: 12, pad: 16 }), '+=0.2')
        .fromTo($(el, '#to'), { autoAlpha: 0, x: -80 }, { autoAlpha: 1, x: 0, duration: 0.7, ease: 'back.out(2)' }, '+=0.1')
        .call(() => sfx.whoosh(0.6), null, '<'),
    ],
  },

  // 6 ─────────────────────────────────────────────── ARQUITECTURA
  {
    id: 'arquitectura', theme: 't-sky', title: 'Una submarca, dos líneas', speaker: 'Jesús',
    notes: `Arquitectura híbrida (Aaker, Keller): submarca Puleva Health avalada por Puleva.
Ni Puleva sola (estira demasiado la marca de leche) ni marca nueva (con 1 M€ de medios no se haría conocida).
Dos líneas que no compiten: DAILY aporta frecuencia en la nevera; ACTIVE aporta impulso y consumidor joven.
Cierre: "Una marca para todo el día: cuidarse por la mañana, concentrarse en el trabajo, rendir en el gimnasio."`,
    html: `
      <svg class="abs" viewBox="0 0 1920 1080" style="left:0;top:0;width:1920px;height:1080px">
        <path id="l1" d="M960 250 C960 300 960 300 960 340" class="tree-line"/>
        <path id="l2" d="M960 470 C960 540 520 520 520 600" class="tree-line"/>
        <path id="l3" d="M960 470 C960 540 1400 520 1400 600" class="tree-line"/>
      </svg>
      <div class="node node-top abs h" id="n0" style="left:760px;top:120px;width:400px"><b>PULEVA</b><span>marca madre que avala</span></div>
      <div class="node node-mid abs h" id="n1" style="left:640px;top:340px;width:640px"><b>PULEVA HEALTH</b><span>submarca de complementos</span></div>
      <div class="node node-daily abs h" id="n2" style="left:190px;top:580px;width:660px"><b>DAILY</b><span>salud y prevención · refrigerado · pack de 6</span></div>
      <div class="node node-active abs h" id="n3" style="left:1070px;top:580px;width:660px"><b>ACTIVE</b><span>rendimiento · ambiente · unidad o pack de 4</span></div>
      <div class="minis abs" style="left:190px;top:770px;width:660px">
        <img src="${IMG.care}" class="mini h"><img src="${IMG.now}" class="mini h"><img src="${IMG.shield}" class="mini h">
      </div>
      <div class="minis abs" style="left:1070px;top:770px;width:660px">
        <img src="${IMG.crea}" class="mini h"><img src="${IMG.clear}" class="mini h">
      </div>
      <div id="day" class="abs h" style="left:110px;top:60px"></div>`,
    steps: [
      (el) => tl().add(pop($(el, '#n0'))).fromTo($(el, '#l1'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.4 }).add(pop($(el, '#n1'), { freq: 640 })),
      (el) => tl().fromTo([$(el, '#l2'), $(el, '#l3')], { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6, ease: 'power2.inOut' })
        .add(drop($(el, '#n2'), { from: -500, quake: 0.3 }), '-=0.1').add(drop($(el, '#n3'), { from: -500, quake: 0.3 }), '-=0.9'),
      (el) => {
        const t = tl();
        $$(el, '.mini').forEach((m, i) => t.add(drop(m, { from: -900, weight: 0.6, quake: 0.15 }), i * 0.12));
        t.add(handwrite($(el, '#day'), 'una marca para todo el día', { size: 64, color: C.cobalt }), '+=0.1');
        return t;
      },
    ],
  },

  // 7 ─────────────────────────────────────────────── DAILY
  {
    id: 'daily', theme: 't-daily', title: 'Línea Daily', speaker: 'Jesús',
    notes: `Shots lácteos refrigerados, pack de 6, en la nevera de lácteos funcionales junto a las leches Puleva.
→ CARE · 100 ml fresa · vit. E 12 mg + vit. C 80 mg + zinc 10 mg · "tu piel, desde dentro" · 6,49 € el pack (1,08 €/shot).
→ NOW · 80 ml frutos rojos · magnesio + L-teanina 200 mg + B6 + B12 · "el shot que sustituye al segundo café" · 1,08 €/shot.
→ SHIELD · 60 ml miel y limón · lactoferrina 150 mg + zinc + saúco + vit. C y D3 · "la defensa natural de la leche" · 1,25 €/shot.
→ Remate: menos que un café en la barra. Solo claims autorizados (Reg. UE 432/2012).`,
    html: `
      ${['care', 'now', 'shield'].map((k, i) => `<div class="panel panel-${k} abs" id="p${i}" style="left:${i * 640}px"></div>`).join('')}
      <div class="abs line-tag h" id="tag" style="left:70px;top:46px">PULEVA HEALTH <b>DAILY</b> · salud y prevención, en la nevera</div>
      ${[
        ['care', 'CARE', 'Piel', 'tu piel, desde dentro', '1,08', '100 ml · fresa', 'Vit. E + Vit. C + Zinc'],
        ['now', 'NOW', 'Concentración', 'adiós al segundo café', '1,08', '80 ml · frutos rojos', 'Magnesio + L-teanina + B6 + B12'],
        ['shield', 'SHIELD', 'Defensas', 'la defensa natural de la leche', '1,25', '60 ml · miel y limón', 'Lactoferrina + Zinc + Vit. C y D'],
      ].map(([k, n, need, tag, price, fmtx, form], i) => `
        <div class="prod abs" style="left:${i * 640}px" id="c${i}">
          <div class="prod-need h">${need}</div>
          <div class="prod-stage"><div class="shadow h"></div><img src="${IMG[k]}" class="prod-img h"></div>
          <div class="price h"><b>${price} €</b><span>/ shot</span></div>
          <div class="prod-hand h"></div>
          <div class="prod-meta h"><b>${fmtx}</b><br>${form}</div>
        </div>`).join('')}
      <div id="cafe" class="abs h banner" style="left:0;top:960px;width:1920px">Menos que un café en la barra.</div>`,
    steps: [
      (el) => tl().from($$(el, '.panel'), { scaleY: 0, transformOrigin: '50% 100%', duration: 0.9, stagger: 0.12, ease: 'power4.inOut' })
        .add(reveal($(el, '#tag')), 0.6),
      ...[0, 1, 2].map((i) => (el) => {
        const c = $(el, `#c${i}`);
        const tags = ['tu piel, desde dentro', 'adiós al segundo café', 'la defensa natural de la leche'];
        return tl()
          .add(reveal($(c, '.prod-need'), { y: -20 }))
          .add(drop($(c, '.prod-img'), { shadow: $(c, '.shadow'), weight: 1 }), 0)
          .add(handwrite($(c, '.prod-hand'), tags[i], { size: 58, color: i === 1 ? C.lime : C.ink, align: 'center', speed: 1.3 }), 0.7)
          .fromTo($(c, '.price'), { autoAlpha: 0, rotation: -40, y: -200 }, { autoAlpha: 1, rotation: -8, y: 0, duration: 0.9, ease: 'elastic.out(1,0.4)' }, 0.9)
          .call(() => sfx.cash(), null, 1.1)
          .add(reveal($(c, '.prod-meta')), 1.2);
      }),
      (el) => tl().fromTo($(el, '#cafe'), { autoAlpha: 0, yPercent: 100 }, { autoAlpha: 1, yPercent: 0, duration: 0.6, ease: 'back.out(1.6)' })
        .call(() => sfx.ding()),
    ],
  },

  // 8 ─────────────────────────────────────────────── ACTIVE
  {
    id: 'active', theme: 't-night', title: 'Línea Active', speaker: 'Jesús',
    notes: `La creatina y la proteína son el mercado más grande y rentable de la suplementación... y no están en el súper: se compran por internet (HSN, Prozis) en botes de polvo.
→ CREA-SNAP · 80 ml · 3 g de creatina en el tapón · "pulsa, agita, entrena" · 1,79 € (5,99 € el pack de 4).
→ CLEARPRO · 125 ml · 20 g de proteína clear con suero de Lactalis Ingredients · "proteína que se bebe como un zumo" · 2,19 €.
→ Gráfica: menos de la mitad que un batido RTD de referencia (4 €).`,
    html: `
      <div class="abs line-tag line-tag-dark h" id="tag" style="left:70px;top:46px">PULEVA HEALTH <b>ACTIVE</b> · rendimiento, sin bote ni báscula</div>
      <div class="prod abs" style="left:60px;width:560px;top:190px;height:860px" id="c0">
        <div class="prod-stage"><div class="shadow h"></div><img src="${IMG.crea}" class="prod-img h" style="height:560px"></div>
        <div class="prod-hand h"></div>
        <div class="prod-meta prod-meta-dark h"><b>CREA-SNAP · 80 ml</b><br>3 g de creatina guardada en el tapón</div>
      </div>
      <div class="prod abs" style="left:640px;width:600px;top:190px;height:860px" id="c1">
        <div class="prod-stage"><div class="shadow h"></div><img src="${IMG.clear}" class="prod-img h" style="height:540px"></div>
        <div class="prod-hand h"></div>
        <div class="prod-meta prod-meta-dark h"><b>CLEARPRO · 125 ml</b><br>20 g de proteína clear · suero Lactalis Ingredients</div>
      </div>
      <div class="abs bars h" id="bars" style="left:1300px;top:300px;width:560px;height:600px">
        <div class="bars-title">Precio por toma</div>
        ${[['Batido RTD de referencia', 4.0, 'ref'], ['ClearPro', 2.19, 'b'], ['Crea-Snap', 1.79, 'a']].map(([n, v, k]) => `
          <div class="bar-row"><div class="bar-name">${n}</div><div class="bar-track"><div class="bar bar-${k}" data-v="${v}"></div><span class="bar-v" data-v="${v}">0 €</span></div></div>`).join('')}
        <div class="bars-hand" id="half"></div>
      </div>`,
    steps: [
      (el) => reveal($(el, '#tag')),
      (el) => tl().add(drop($(el, '#c0 .prod-img'), { shadow: $(el, '#c0 .shadow'), weight: 1.1 }))
        .add(handwrite($(el, '#c0 .prod-hand'), 'pulsa, agita, entrena', { size: 60, color: C.lime, align: 'center' }), 0.7)
        .add(reveal($(el, '#c0 .prod-meta')), 1),
      (el) => tl().add(drop($(el, '#c1 .prod-img'), { shadow: $(el, '#c1 .shadow'), weight: 1.2 }))
        .add(handwrite($(el, '#c1 .prod-hand'), 'proteína que se bebe\ncomo un zumo', { size: 56, color: C.lime, align: 'center', speed: 1.4 }), 0.7)
        .add(reveal($(el, '#c1 .prod-meta')), 1),
      (el) => {
        const t = tl().add(reveal($(el, '#bars')));
        $$(el, '.bar').forEach((b, i) => {
          const v = +b.dataset.v;
          t.fromTo(b, { width: 0 }, { width: `${(v / 4) * 72}%`, duration: 0.9, ease: 'power3.out' }, 0.2 + i * 0.25);
          t.add(countUp($$(el, '.bar-v')[i], v, { dec: 2, suffix: ' €', dur: 0.9, sound: i === 0 }), 0.2 + i * 0.25);
        });
        t.add(handwrite($(el, '#half'), 'menos de la mitad', { size: 64, color: C.lime }), '+=0.1');
        t.add(mark($$(el, '.bar-row')[2], 'box', { color: C.lime, width: 5, pad: 10 }), '-=0.3');
        return t;
      },
    ],
  },

  // 9 ─────────────────────────────────────────────── CREA-SNAP
  {
    id: 'creasnap', theme: 't-deep', title: 'La creatina vive en el tapón', speaker: 'Jesús',
    notes: `"¿Por qué casi no existe creatina lista para beber?"
→ Porque disuelta, con el tiempo se transforma en creatinina, que no tiene efecto sobre el rendimiento.
→ Nuestra solución: guardarla en seco en el tapón, sin contacto con el líquido (agua funcional cítrica).
→ Pulsa · agita · entrena: al mezclar justo antes de beber, cada shot conserva sus 3 g activos toda la vida útil.
El tapón bifásico lo aporta un proveedor de envase; nosotros ponemos formulación y marca.`,
    html: `
      <div class="abs" style="left:110px;top:120px;width:980px">
        <div id="h" class="title h" style="color:#fff;font-size:84px">¿Por qué casi no existe creatina <em>lista para beber</em>?</div>
        <div class="chem h" id="chem"><span id="word"><span id="wtxt">CREATINA</span></span></div>
        <div class="cap-text h" id="why" style="color:rgba(255,255,255,.8)">Disuelta, con el tiempo se degrada en <b>creatinina</b>: sin efecto sobre el rendimiento.</div>
        <div class="cap-text h" id="sol" style="color:#fff;font-size:44px;margin-top:40px">Solución: <b style="color:var(--orange)">guardarla en seco en el tapón</b>.</div>
        <div class="slams" id="slams"><span class="h">PULSA</span><span class="h">AGITA</span><span class="h">ENTRENA</span></div>
      </div>
      <svg class="abs" id="bot" viewBox="0 0 600 1000" style="left:1180px;top:40px;width:600px;height:1000px;overflow:visible">
        <defs>
          <clipPath id="bclip"><path d="M150 380 C150 340 200 320 220 300 L220 250 L380 250 L380 300 C400 320 450 340 450 380 L450 900 C450 930 430 950 400 950 L200 950 C170 950 150 930 150 900 Z"/></clipPath>
          <linearGradient id="juice" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#FFB13B"/><stop offset="1" stop-color="#FF5A1F"/></linearGradient>
        </defs>
        <g clip-path="url(#bclip)">
          <rect id="liq" x="140" y="420" width="320" height="560" fill="url(#juice)"/>
          <path id="liqwave" d="M0 425 Q37 410 75 425 T150 425 T225 425 T300 425 T375 425 T450 425 T525 425 T600 425 V440 H0 Z" fill="#FFC86B"/>
          <rect id="cloud" x="140" y="420" width="320" height="560" fill="#FFF3DD" opacity="0"/>
        </g>
        <path id="outline" d="M150 380 C150 340 200 320 220 300 L220 250 L380 250 L380 300 C400 320 450 340 450 380 L450 900 C450 930 430 950 400 950 L200 950 C170 950 150 930 150 900 Z" fill="none" stroke="#fff" stroke-width="6"/>
        <g id="capg">
          <rect x="196" y="120" width="208" height="140" rx="18" fill="#1338BE" stroke="#fff" stroke-width="5" id="capbody"/>
          <rect x="216" y="150" width="168" height="90" rx="10" fill="#0B1F66" id="chamber"/>
          <g id="powder">${Array.from({ length: 60 }, (_, i) => `<circle cx="${226 + (i * 37) % 150}" cy="${170 + ((i * 53) % 62)}" r="${3 + (i % 3)}" fill="#fff"/>`).join('')}</g>
          <rect id="membrane" x="210" y="246" width="180" height="8" fill="#C9D3E6"/>
          <g id="plunger"><rect x="270" y="40" width="60" height="90" rx="10" fill="#D7FF3A"/><rect x="240" y="30" width="120" height="22" rx="11" fill="#D7FF3A"/></g>
        </g>
        <text x="300" y="1000" text-anchor="middle" fill="rgba(255,255,255,.5)" font-size="26" font-weight="700" letter-spacing="4">CREA-SNAP · 80 ml</text>
      </svg>
      <div class="fx-layer" id="fx"></div>
      <div id="first" class="abs h" style="left:110px;top:860px"></div>`,
    init(el) {
      gsap.to($(el, '#liqwave'), { x: -150, duration: 1.6, repeat: -1, ease: 'none' });
    },
    steps: [
      (el) => tl().fromTo($(el, '#outline'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.4, ease: 'power2.inOut' })
        .from($(el, '#capg'), { y: -300, autoAlpha: 0, duration: 0.6, ease: 'bounce.out' }, 0.8)
        .from([$(el, '#liq'), $(el, '#liqwave')], { y: 560, duration: 1.2, ease: 'power2.out' }, 0.6)
        .call(() => sfx.pour(1.2), null, 0.6),
      (el) => wordRise($(el, '#h')),
      (el) => tl().set($(el, '#chem'), { autoAlpha: 1 })
        .to($(el, '#wtxt'), { duration: 1.4, scrambleText: { text: 'CREATININA', chars: 'ACEINRT', speed: 0.4 } })
        .call(() => sfx.buzz())
        .add(mark($(el, '#word'), 'strike', { color: C.coral, width: 10, pad: 14 }))
        .add(reveal($(el, '#why')), '-=0.2'),
      (el) => tl().add(reveal($(el, '#sol')))
        .add(mark($(el, '#chamber'), 'circle', { color: C.lime, width: 7, pad: 30 }), '-=0.2'),
      (el) => {
        const t = tl();
        const sl = $$(el, '#slams span');
        // PULSA
        t.to($(el, '#plunger'), { y: 70, duration: 0.18, ease: 'power3.in' })
          .call(() => { sfx.click(); shake(0.4); })
          .to($(el, '#membrane'), { scaleX: 0, transformOrigin: '50% 50%', duration: 0.15 })
          .fromTo(sl[0], { autoAlpha: 0, scale: 2.4 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power4.out' }, '<');
        // la creatina cae en cascada
        t.call(() => sfx.powder(1.3));
        $$(el, '#powder circle').forEach((c, i) => {
          t.to(c, { attr: { cy: 440 + Math.random() * 420 }, opacity: 0, duration: 0.7 + Math.random() * 0.8, ease: 'power2.in' }, `<+=${i ? 0.012 : 0}`);
        });
        t.to($(el, '#cloud'), { opacity: 0.55, duration: 0.8 }, '-=1');
        // AGITA
        t.fromTo(sl[1], { autoAlpha: 0, scale: 2.4 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power4.out' }, '-=0.3')
          .to($(el, '#bot'), { rotation: 14, transformOrigin: '50% 60%', duration: 0.09, yoyo: true, repeat: 9, ease: 'sine.inOut' }, '<')
          .call(() => { for (let i = 0; i < 6; i++) gsap.delayedCall(i * 0.09, () => sfx.tick(400 + i * 40, 0.2)); }, null, '<')
          .to($(el, '#cloud'), { opacity: 0, duration: 0.8 })
          .set($(el, '#bot'), { rotation: 0 });
        // ENTRENA
        t.fromTo(sl[2], { autoAlpha: 0, scale: 2.4 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power4.out' }, '-=0.5')
          .call(() => sfx.boom(), null, '<');
        return t;
      },
      (el) => tl().add(handwrite($(el, '#first'), '3 g activos durante toda la vida útil.', { size: 70, color: C.lime })),
    ],
  },

  // 10 ─────────────────────────────────────────────── MAPA
  {
    id: 'mapa', theme: 't-sky', title: 'Espacio libre', speaker: 'David',
    notes: `Mapa de posicionamiento (valoración cualitativa del equipo a partir del lineal observado).
→ Los rivales: laboratorios con aval pero en cápsula; nativos digitales en polvo; marca blanca que compite en precio; shots sin aval.
→ Arriba a la derecha no hay nadie: listo para tomar Y con aval.
→ Ahí aterriza Puleva Health. Por qué nosotros: marca de la nevera (top 10 Kantar 2025), plantas y frío para líquidos a escala nacional, suero de Lactalis Ingredients.
Porter: el líquido refrigerado es difícil de copiar para laboratorios y nativos digitales.`,
    html: `
      <div id="h" class="title abs h" style="left:110px;top:70px">Hay un hueco en el lineal. <em>Es nuestro.</em></div>
      <svg class="abs" viewBox="0 0 1200 760" style="left:110px;top:230px;width:1200px;height:760px;overflow:visible">
        <defs><marker id="ar" markerUnits="userSpaceOnUse" markerWidth="26" markerHeight="26" refX="13" refY="13" orient="auto"><path d="M0 0 L26 13 L0 26 z" fill="#0A1748"/></marker></defs>
        <path id="ax" d="M60 700 L1160 700" stroke="#0A1748" stroke-width="5" marker-end="url(#ar)"/>
        <path id="ay" d="M60 700 L60 20" stroke="#0A1748" stroke-width="5" marker-end="url(#ar)"/>
        <text x="1160" y="745" text-anchor="end" class="axis-t" id="axt">Listo para tomar (sin pastilla ni preparación) →</text>
        <text x="20" y="20" class="axis-t" transform="rotate(-90 20 20)" text-anchor="end" id="ayt">Confianza y aval nutricional →</text>
      </svg>
      ${[['Solgar · Arkopharma', 300, 300], ['Supradyn · Bion', 380, 420], ['HSN · Prozis (polvo)', 520, 580], ['Shots sin aval', 900, 760], ['Deliplus (MDD)', 260, 820]].map(([n, x, y], i) => `<div class="rival abs h" style="left:${x}px;top:${y}px" id="r${i}">${n}</div>`).join('')}
      <div class="abs" id="free" style="left:900px;top:235px;width:420px;height:330px"><div class="free-t h" id="freet">espacio libre</div></div>
      <img src="${IMG.shield}" class="abs h" id="ph" style="left:1062px;top:262px;height:240px">
      <div class="abs h phl" id="phl" style="left:972px;top:505px;z-index:60">PULEVA HEALTH</div>
      <div class="abs" style="left:1420px;top:240px;width:420px">
        <div class="why h"><b>01</b>Una marca que ya está en la nevera <small>top 10 de marcas más elegidas por los hogares (Kantar, 2025)</small></div>
        <div class="why h"><b>02</b>Plantas y cadena de frío para líquidos <small>a escala nacional</small></div>
        <div class="why h"><b>03</b>Ingredientes lácteos del grupo <small>suero de Lactalis Ingredients</small></div>
      </div>`,
    steps: [
      (el) => wordRise($(el, '#h')),
      (el) => tl().fromTo([$(el, '#ax'), $(el, '#ay')], { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.8, ease: 'power2.inOut' })
        .from([$(el, '#axt'), $(el, '#ayt')], { opacity: 0, duration: 0.5 }),
      (el) => {
        const t = tl();
        $$(el, '.rival').forEach((r, i) => t.add(drop(r, { from: -700, weight: 0.6, quake: 0.12 }), i * 0.18));
        return t;
      },
      (el) => tl().add(mark($(el, '#free'), 'circle', { color: C.coral, width: 6, pad: 6 }))
        .add(reveal($(el, '#freet'))),
      (el, ctx) => tl().call(() => sfx.riser(0.9)).add(drop($(el, '#ph'), { weight: 1.6, from: -1100, dur: 0.6, quake: 1.2 }), 0.7)
        .call(() => ctx.splash(1110, 505, 1.3), null, 1.3)
        .to($(el, '#freet'), { autoAlpha: 0, duration: 0.2 }, 1.3)
        .add(pop($(el, '#phl'), { freq: 700 }), 1.4)
        .call(() => sfx.ding(), null, 1.5),
      (el) => {
        const t = tl();
        $$(el, '.why').forEach((w, i) => t.fromTo(w, { autoAlpha: 0, x: 120, rotation: 4 }, { autoAlpha: 1, x: 0, rotation: 0, duration: 0.6, ease: 'back.out(1.8)', onStart: () => sfx.pop(500 + i * 150) }, i * 0.3));
        return t;
      },
    ],
  },

  // 11 ─────────────────────────────────────────────── TIENDA
  {
    id: 'tienda', theme: 't-night', title: 'Dónde se compra', speaker: 'David',
    notes: `Foco total en la tienda física. Presupuesto comercial del año 1: 2 M€.
→ 90 % hiper y súper (Carrefour, Alcampo, El Corte Inglés/Hipercor, Eroski, Consum): Puleva ya negocia con sus centrales y ya sirve en frío. 10 % vending en gimnasios para Active.
→ Triple punto de contacto: nevera de lácteos (Daily), pasillo de suplementos (Active + módulo que dirige a la nevera), cajas y cabeceras (impulso).
→ Descartados: farmacia (no somos un medicamento; 22.273 oficinas costarían 700.000 € de red comercial) y e-commerce (romper la cadena de frío hunde el margen).
Mercadona trabaja casi solo con marca propia: negociación aparte, fuera de previsiones.`,
    html: `
      <div id="h" class="title abs h" style="left:110px;top:70px;color:#fff">Donde ya se hace la compra: <em>en la tienda</em>.</div>
      <svg class="abs" viewBox="0 0 500 500" style="left:110px;top:260px;width:500px;height:500px" id="donut">
        <circle cx="250" cy="250" r="190" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="70"/>
        <circle id="d1" cx="250" cy="250" r="190" fill="none" stroke="#D7FF3A" stroke-width="70" transform="rotate(-90 250 250)"/>
        <circle id="d2" cx="250" cy="250" r="190" fill="none" stroke="#FF5A3C" stroke-width="70" transform="rotate(-90 250 250)"/>
        <text x="250" y="250" text-anchor="middle" fill="#fff" font-size="96" font-weight="800" id="pct">0 %</text>
        <text x="250" y="305" text-anchor="middle" fill="rgba(255,255,255,.7)" font-size="30" font-weight="600">hiper y súper</text>
      </svg>
      <div class="abs h legend" id="leg" style="left:110px;top:790px"><span style="--c:#D7FF3A">90 % hiper y súper</span><span style="--c:#FF5A3C">10 % vending en gimnasios</span><small>Presupuesto comercial del año 1: 2 M€</small></div>
      <div class="abs touch-row" style="left:700px;top:270px;width:1120px">
        ${[['❄', 'Nevera de lácteos', 'DAILY · junto a las leches Puleva, ordenado por color de necesidad'], ['▦', 'Pasillo de suplementos', 'ACTIVE · y un módulo Puleva Health que lleva a la nevera'], ['◎', 'Caja y cabeceras', 'ACTIVE · unidades sueltas de impulso']].map(([ic, t, d], i) => `
          <div class="touch h" id="t${i}"><div class="touch-n">${i + 1}</div><div class="touch-ic">${ic}</div><b>${t}</b><span>${d}</span></div>`).join('')}
      </div>
      <div class="abs kicker h" id="desc" style="left:700px;top:735px;color:var(--coral)">DESCARTADOS</div>
      <div class="abs nope-row" style="left:700px;top:780px;width:1120px">
        <div class="nope h" id="x0"><b>Farmacia</b><span>no somos un medicamento ni queremos parecerlo</span></div>
        <div class="nope h" id="x1"><b>E-commerce</b><span>enviar líquidos en frío por paquetería hunde el margen</span></div>
      </div>`,
    steps: [
      (el) => wordRise($(el, '#h')),
      (el) => {
        const o = { v: 0 };
        return tl().fromTo($(el, '#d1'), { drawSVG: '0%' }, { drawSVG: '90%', duration: 1.3, ease: 'power3.inOut' })
          .fromTo($(el, '#d2'), { drawSVG: '90% 90%' }, { drawSVG: '90% 100%', duration: 0.4, ease: 'power2.out' })
          .to(o, { v: 90, duration: 1.3, ease: 'power3.inOut', onUpdate: () => { $(el, '#pct').textContent = Math.round(o.v) + ' %'; } }, 0)
          .call(() => sfx.counter(1.3), null, 0)
          .add(reveal($(el, '#leg')));
      },
      (el) => {
        const t = tl();
        $$(el, '.touch').forEach((c, i) => t.add(drop(c, { from: -900, weight: 0.8, quake: 0.25 }), i * 0.22));
        return t;
      },
      (el) => {
        const t = tl().add(reveal($(el, '#desc')));
        $$(el, '.nope').forEach((n, i) => {
          t.add(reveal(n), i * 0.5);
          t.add(mark($(n, 'b'), 'strike', { color: C.coral, width: 9, pad: 10 }), i * 0.5 + 0.3);
        });
        return t.call(() => sfx.buzz());
      },
    ],
  },

  // 12 ─────────────────────────────────────────────── CAMPAÑA
  {
    id: 'campana', theme: 't-cobalt', title: 'Campaña y calendario', speaker: 'David',
    notes: `1 M€ al año en TV y redes: 600.000 € TV, 300.000 € redes e influencers, 100.000 € amplificación.
→ Dos caras para dos públicos (sujeto a negociación): Roberto Leal en TV para Daily (familias, cercanía); SofiG en Instagram, TikTok y Twitch para Now y Active.
Si los cachés superan lo previsto, se recortan pases de TV, no redes.
→ Calendario: formulación (mes 0–6), notificación AESAN y altas (4–8), lanzamiento Daily en septiembre (mes 9) con TV, Active en marzo (mes 15), revisión de surtido (18–24).`,
    html: `
      <div class="abs" style="left:110px;top:70px">
        <div class="kicker h" id="k" style="color:var(--lime)">COMUNICACIÓN</div>
        <div class="money money-xl h" id="money"><span id="m">0</span><small> €</small></div><div class="cap-text h" id="mt2" style="color:#fff;margin-top:6px">al año en <b>TV y redes</b> · 600.000 € TV · 300.000 € influencers · 100.000 € amplificación</div>
      </div>
      <div class="amb abs h" id="a0" style="left:110px;top:400px"><div class="amb-face">RL</div><div><b>Roberto Leal</b><span>TV · línea Daily · familias</span><i>“Cercanía y confianza”</i></div></div>
      <div class="amb abs h" id="a1" style="left:960px;top:400px"><div class="amb-face amb-b">SG</div><div><b>SofiG</b><span>Instagram, TikTok, Twitch · Now y Active</span><i>“Adiós al segundo café”</i></div></div>
      <div class="abs h" id="neg" style="left:110px;top:630px;color:rgba(255,255,255,.6);font-size:24px;font-weight:600">Embajadores sujetos a negociación</div>
      <svg class="abs" viewBox="0 0 1700 300" style="left:110px;top:720px;width:1700px;height:300px;overflow:visible">
        <path id="tline" d="M0 120 L1700 120" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
        <circle id="drop" cx="0" cy="120" r="16" fill="#fff"/>
      </svg>
      ${[['Mes 0–6', 'Formulación y estabilidad', 0], ['Mes 4–8', 'Notificación AESAN y altas', 330], ['Mes 9 · sept.', 'Lanzamiento DAILY + TV', 680], ['Mes 15 · marzo', 'Lanzamiento ACTIVE + SofiG', 1030], ['Mes 18–24', 'Revisión de surtido', 1380]].map(([m, t, x], i) => `
        <div class="ms abs h" style="left:${110 + x}px;top:${i % 2 ? 870 : 740}px" id="ms${i}"><b>${m}</b><span>${t}</span></div>`).join('')}`,
    steps: [
      (el) => tl().add(reveal($(el, '#k'))).add(reveal($(el, '#money')), 0.1).add(countUp($(el, '#m'), 1000000, { dec: 0, dur: 1.4 }), 0.2).call(() => sfx.cash(), null, 1.5).add(reveal($(el, '#mt2')), 1.2),
      (el) => tl()
        .fromTo($(el, '#a0'), { autoAlpha: 0, rotationY: 90 }, { autoAlpha: 1, rotationY: 0, duration: 0.8, ease: 'back.out(1.5)' })
        .call(() => sfx.whoosh(0.4), null, 0)
        .fromTo($(el, '#a1'), { autoAlpha: 0, rotationY: -90 }, { autoAlpha: 1, rotationY: 0, duration: 0.8, ease: 'back.out(1.5)' }, 0.35)
        .call(() => sfx.whoosh(0.4), null, 0.35)
        .add(reveal($(el, '#neg')), 0.9),
      (el) => {
        const t = tl().fromTo($(el, '#tline'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 2.6, ease: 'none' })
          .fromTo($(el, '#drop'), { attr: { cx: 0 } }, { attr: { cx: 1700 }, duration: 2.6, ease: 'none' }, 0);
        [0, 330, 680, 1030, 1380].forEach((x, i) => t.add(pop($(el, `#ms${i}`), { freq: 500 + i * 90 }), (x / 1700) * 2.6));
        return t;
      },
    ],
  },

  // 13 ─────────────────────────────────────────────── NÚMEROS
  {
    id: 'numeros', theme: 't-sky', title: 'Business case', speaker: 'David',
    notes: `Hipótesis prudentes: cuota del 4 % → 8 % → 13 % sobre un mercado que crece; 30 % de margen para la cadena.
→ Venta neta: 3,78 M€ → 8,47 M€ → 15,13 M€.
→ EBITDA: −2,69 → −1,29 → +0,20 M€. El año 1 es de inversión (450.000 € de altas que no se repiten).
→ Break-even operativo mensual hacia el mes 29.
→ Y es prudente: EBITDA del 1,3 % en el año 3 frente al 8,5 % de la división láctea de Danone. Con cuota del 15 % en el año 4, el EBITDA se acerca a +0,95 M€.`,
    html: `
      <div id="h" class="title abs h" style="left:110px;top:60px">Números prudentes, <em>curva sólida</em>.</div>
      <svg class="abs" viewBox="0 0 1100 700" style="left:110px;top:240px;width:1100px;height:700px;overflow:visible" id="chart">
        <line x1="40" y1="440" x2="1080" y2="440" stroke="#0A1748" stroke-width="3" id="zero"/>
        ${[[240, 3.78, 'Año 1'], [560, 8.47, 'Año 2'], [880, 15.13, 'Año 3']].map(([x, v, y], i) => `
          <rect class="bar3" x="${x - 100}" y="${440 - v * 24}" width="200" height="${v * 24}" rx="12" fill="#1338BE" data-i="${i}"/>
          <text class="bv" x="${x}" y="${440 - v * 24 - 20}" text-anchor="middle" data-v="${v}">0</text>
          <text class="yl" x="${x}" y="690" text-anchor="middle">${y}</text>`).join('')}
        <path id="eb" d="M240 548 L560 492 L880 432" fill="none" stroke="#FF5A3C" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        ${[[240, 548, '−2,69'], [560, 492, '−1,29'], [880, 432, '+0,20']].map(([x, y, v]) => `<g class="ebp" opacity="0"><circle cx="${x}" cy="${y}" r="13" fill="#FF5A3C" stroke="#fff" stroke-width="4"/><text x="${x + 22}" y="${y + 44}" class="ebv">${v}</text></g>`).join('')}
        <text x="40" y="30" class="lg"><tspan fill="#1338BE">■</tspan> Venta neta (M€)   <tspan fill="#FF5A3C">●</tspan> EBITDA (M€)</text>
      </svg>
      <div class="abs" id="m29" style="left:${110 + 836 - 26}px;top:${240 + 440 - 26}px;width:52px;height:52px"></div>
      <div class="abs h" id="m29t" style="left:770px;top:770px"></div>
      <div class="abs" style="left:1300px;top:260px;width:520px">
        <div class="kpi h"><b>Mes 29</b><span>break-even operativo mensual</span></div>
        <div class="kpi h"><b>30 %</b><span>de margen para la cadena</span></div>
        <div class="kpi h"><b>1,3 %</b><span>EBITDA año 3 · frente al 8,5 % de la división láctea de Danone: hipótesis prudentes</span></div>
      </div>`,
    steps: [
      (el) => wordRise($(el, '#h')),
      (el) => {
        const t = tl();
        $$(el, '.bar3').forEach((b, i) => {
          t.fromTo(b, { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 0.9, ease: 'power3.out' }, i * 0.35);
          t.add(countUp($$(el, '.bv')[i], +$$(el, '.bv')[i].dataset.v, { dec: 2, dur: 0.9, sound: i === 0 }), i * 0.35);
          t.call(() => sfx.thud(0.6), null, i * 0.35 + 0.1);
        });
        return t;
      },
      (el) => tl().fromTo($(el, '#eb'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.5, ease: 'power1.inOut' })
        .call(() => sfx.riser(1.5), null, 0)
        .to($$(el, '.ebp'), { opacity: 1, duration: 0.3, stagger: 0.5 }, 0),
      (el) => tl().add(mark($(el, '#m29'), 'circle', { color: C.coral, width: 6, pad: 16 }))
        .add(handwrite($(el, '#m29t'), 'mes 29: equilibrio', { size: 64, color: C.coral }), '-=0.1')
        .call(() => sfx.ding()),
      (el) => {
        const t = tl();
        $$(el, '.kpi').forEach((k, i) => t.add(drop(k, { from: -700, weight: 0.7, quake: 0.2 }), i * 0.25));
        return t;
      },
    ],
  },

  // 14 ─────────────────────────────────────────────── POR QUÉ NOSOTROS
  {
    id: 'equipo', theme: 't-night', title: 'No solo lo contamos: lo construimos', speaker: 'Todos',
    notes: `Aquí vendemos al equipo: "No nos quedamos en un PowerPoint."
→ Caen las tres piezas: informe de estrategia de 14 páginas, web con los botes en 3D y un spot de 67 segundos con voz, música y subtítulos.
→ Siguiente →: el spot se abre a pantalla completa y suena. Deja que se vea entero.
→ → de nuevo pasa al cierre (el vídeo se detiene solo).`,
    html: `
      <div id="h" class="title abs h" style="left:110px;top:80px;color:#fff;width:1700px">No solo lo contamos. <em>Lo construimos.</em></div>
      <div class="card abs h" id="cd0" style="left:110px;top:330px"><img src="img/informe.png"><b>Informe de estrategia</b><span>14 páginas · mercado, portfolio, go-to-market, business case</span></div>
      <div class="card abs h" id="cd1" style="left:700px;top:330px"><img src="img/web.png"><b>Web en 3D</b><span>los cinco shots en Three.js y “un día con Puleva Health”</span></div>
      <div class="card abs h" id="cd2" style="left:1290px;top:330px"><div class="vid-wrap" id="vw"><video id="vid" src="img/puleva_health.mp4" poster="img/poster.jpg" playsinline preload="auto"></video><div class="play" id="play">▶</div></div><b>Spot de 67 segundos</b><span>voz, música y subtítulos, hecho con código</span></div>`,
    init(el) {
      return () => { const v = $(el, '#vid'); v.pause(); };
    },
    steps: [
      (el) => wordRise($(el, '#h')),
      (el) => {
        const t = tl();
        $$(el, '.card').forEach((c, i) => t.add(drop(c, { from: -1100, weight: 1, rot: (i - 1) * 10 }), i * 0.25));
        return t;
      },
      (el, ctx) => {
        const card = $(el, '#cd2');
        const vw = $(el, '#vw');
        const v = $(el, '#vid');
        const r = vw.getBoundingClientRect();
        const s = window.__stageScale || 1;
        const sr = el.getBoundingClientRect();
        const x0 = (r.left - sr.left) / s, y0 = (r.top - sr.top) / s, w0 = r.width / s, h0 = r.height / s;
        const ph = document.createElement('div');
        ph.className = 'vid-full';
        el.appendChild(ph);
        ph.appendChild(v);
        $(el, '#play').style.display = 'none';
        const t = tl();
        t.fromTo(ph, { left: x0, top: y0, width: w0, height: h0, borderRadius: 24 }, { left: 0, top: 0, width: 1920, height: 1080, borderRadius: 0, duration: 0.8, ease: 'power3.inOut' })
          .call(() => sfx.whoosh(0.7), null, 0)
          .call(() => { if (!ctx.rewinding) { v.currentTime = 0; v.muted = sfx.muted; v.play().catch(() => {}); } });
        return t;
      },
    ],
  },

  // 15 ─────────────────────────────────────────────── CIERRE
  {
    id: 'cierre', theme: 't-cobalt', title: 'Salud que se bebe', speaker: 'Todos',
    notes: `En una frase: Puleva Health aprovecha lo que Puleva ya es (marca de nevera, industria de líquidos, red de frío) para competir donde ni laboratorios ni nativos digitales pueden seguirla.
→ Llueven los cinco shots y la leche inunda la pantalla.
→ "Puleva Health. Salud que se bebe." → Gracias + equipo.`,
    html: `
      <div class="spot abs"></div>
      <div class="row5 abs" style="left:0;top:250px;width:1920px">
        ${['care', 'now', 'shield', 'crea', 'clear'].map((k) => `<div class="r5"><div class="shadow h"></div><img src="${IMG[k]}" class="h"></div>`).join('')}
      </div>
      <div class="abs h" id="end1" style="left:0;top:90px;width:1920px;text-align:center"><span class="mega" style="font-size:150px">PULEVA HEALTH</span></div>
      <div class="abs" id="end2" style="left:0;top:835px;width:1920px;display:flex;justify-content:center"></div>
      <div class="thanks abs h" id="thx">
        <div class="mega" style="font-size:260px;color:var(--cobalt)">Gracias.</div>
        <div class="team">David Bacas Posadas · Ismael Sallami Moreno · Jesús Rodríguez González</div>
        <div class="team-sub">Grupo 6 · Doble Grado en Ingeniería Informática y ADE · Universidad de Granada</div>
        <div class="team-url">ismael-sallami.github.io/puleva-health</div>
      </div>`,
    steps: [
      (el, ctx) => {
        const t = tl();
        $$(el, '.r5').forEach((r, i) => {
          t.add(drop($(r, 'img'), { shadow: $(r, '.shadow'), weight: 1, from: -1200, quake: 0.4 }), 0.3 + i * 0.22);
          t.call(() => ctx.splashEl($(r, 'img'), 0.8), null, 0.3 + i * 0.22 + 0.55);
        });
        return t;
      },
      (el) => tl().add(charDrop($(el, '#end1 .mega'), { stagger: 0.04 }))
        .set($(el, '#end1'), { autoAlpha: 1 }, 0)
        .add(handwrite($(el, '#end2'), 'Salud que se bebe.', { size: 170, color: C.lime, stroke: 3 }), '-=0.3'),
      (el, ctx) => tl().call(() => { sfx.wave(); ctx.flood(); if (!ctx.rewinding) ctx.top.appendChild($(el, '#thx')); else { el.style.background = '#FFFBF2'; $$(el, '.row5, #end1, #end2, .spot').forEach((n) => { n.style.visibility = 'hidden'; }); } })
        .set($(el, '#thx'), { autoAlpha: 1 }, 0.6)
        .fromTo($(el, '#thx'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.6)
        .from($(el, '#thx .mega'), { scale: 0.6, duration: 1.2, ease: 'elastic.out(1,0.5)' }, 0.9)
        .from($$(el, '#thx > div:not(.mega)'), { y: 40, autoAlpha: 0, stagger: 0.15, duration: 0.6 }, 1.2)
        .call(() => sfx.ding(784), null, 1),
    ],
  },
];
