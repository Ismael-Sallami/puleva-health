// Páginas añadidas en la revisión de la final:
//  · MERCADO_SLIDE: la figura 1 del informe dibujada en directo (por qué Now, Care y Shield).
//  · CLEARPRO_SLIDE: ClearPro en su propia página (antes iba dentro de Active).
//  · EMBAJADORES_SLIDE: el plan de medios de 1 M€ con Roberto Leal y SofiG (bloque Lactalis, antes del break-even).
// Todas las cifras salen de media/PulevaHealth_Grupo6.pdf.
import { gsap, mark, drop, pop, reveal, countUp, stamp, scrawl, misreg, tapeOn, $, $$ } from './fx.js';
import { sfx } from './sfx.js';
import { DEFS, bubble } from './illus.js';

const tl = () => gsap.timeline();
const IMG = (k) => `img/${k}.webp`;

// ---------------------------------------------------------------------------------------- figura 1
// Segmentos del canal moderno (NielsenIQ 2026): ventas en M€, crecimiento interanual y producto Daily que lo cubre.
const SEGS = [
  ['Colágeno', 14.2, '+1,2 %', 'CARE'],
  ['Polivitaminas', 7.6, '−1,9 %', null],
  ['Omega 3', 6.5, '+16,7 %', null],
  ['Vitamina C + Zinc', 6.4, '+13,5 %', 'SHIELD'],
  ['Magnesio', 5.4, '+27,2 %', 'NOW'],
  ['Probióticos', 4.5, '+6,3 %', null],
  ['Cúrcuma', 3.7, '+110,5 %', null],
  ['Cabello y uñas', 3.6, '+13,5 %', 'CARE'],
  ['Melatonina', 3.4, '+63,6 %', null],
  ['Memoria', 1.8, '+1,7 %', 'NOW'],
  ['Própolis', 1.7, '+9,6 %', 'SHIELD'],
];
const BX = 330; // x donde empiezan las barras
const K = 42; // px por M€
const ROW = 56;
const Y0 = 34;
const fmt1 = (v) => v.toFixed(1).replace('.', ',');

const chart = () => `
  <svg class="abs" id="segs" viewBox="0 0 1200 720" style="left:90px;top:240px;width:1200px;height:720px;overflow:visible">
    <g id="grid">${[0, 2, 4, 6, 8, 10, 12, 14, 16].map((t) => `
      <line class="sg-grid" x1="${BX + t * K}" y1="${Y0 - 14}" x2="${BX + t * K}" y2="${Y0 + SEGS.length * ROW}"/>
      <text class="sg-tick" x="${BX + t * K}" y="${Y0 + SEGS.length * ROW + 34}" text-anchor="middle">${t}</text>`).join('')}
    </g>
    <path id="sg-ax" class="sg-ax" d="M${BX} ${Y0 - 14} V${Y0 + SEGS.length * ROW}"/>
    ${SEGS.map(([n, v, g, p], i) => {
    const y = Y0 + i * ROW;
    return `<g class="sg ${p ? 'sg-d' : 'sg-o'}" data-v="${v}">
        <text class="sg-n" x="${BX - 18}" y="${y + 29}" text-anchor="end">${n}</text>
        <rect class="sg-bar" x="${BX}" y="${y + 4}" height="36" width="0" rx="12"/>
        <text class="sg-v" x="${BX + v * K + 14}" y="${y + 30}" opacity="0">${fmt1(v)} M€ · ${g}</text>
        ${p ? `<g class="sg-p" opacity="0"><rect x="${BX + v * K + 250}" y="${y + 6}" width="${p.length * 17 + 30}" height="32" rx="16"/><text x="${BX + v * K + 265}" y="${y + 30}">${p}</text></g>` : ''}
      </g>`;
  }).join('')}
    <text class="sg-cap" x="${BX}" y="${Y0 + SEGS.length * ROW + 74}">Barra: ventas 2026 súper+híper (M€) · %: crecimiento anual · NielsenIQ</text>
  </svg>`;

export const MERCADO_SLIDE = {
  id: 'mercado', theme: 'graph', title: '¿Por qué estos tres? (figura 1)', speaker: 'Jesús', time: '4:15–4:50', buyers: [true, 0],
  notes: `"¿Por qué estos tres y no otros? No los elegimos a ojo."
→ (se dibujan las barras) "Esta es la venta de complementos en súper e híper por segmento, con datos de NielsenIQ de 2026."
→ (se pintan de verde) "En verde, lo que cubre Daily: colágeno y cabello para Care, vitamina C con zinc y própolis para Shield, magnesio y memoria para Now. Suman 33 millones, el 28 % del mercado."
→ (ciencia) "Y la ciencia lo respalda: según el estudio ANIBES, el 72 % de los adultos no llega al magnesio, el 83 % al zinc y el 80 % a la vitamina E."
   (opcional, si sobra tiempo) "En farmacia, el magnesio ya mueve 48 millones y crece un 35 %."`,
  html: `${DEFS}
    <div class="marker abs h" id="k" style="left:110px;top:56px;font-size:46px;color:var(--pink)">No los elegimos a ojo.</div>
    <div class="mega abs h" id="h" style="left:110px;top:112px;font-size:100px">¿POR QUÉ <span style="color:var(--blue)">ESTOS TRES?</span></div>
    ${chart()}
    <div class="sg-total abs h" id="tot">
      <span class="sg-tk">LO QUE CUBRE DAILY</span>
      <b id="totv">0 M€</b>
      <em id="totp">el 28 % del mercado</em>
    </div>
    <div class="sg-sci abs h" id="sci">
      <div class="sg-sci-t">Y LA CIENCIA LO RESPALDA</div>
      ${[['72', 'no llega al magnesio', 'NOW'], ['83', 'no llega al zinc', 'SHIELD · CARE'], ['80', 'no llega a la vitamina E', 'CARE']].map(([n, t, p]) => `
        <div class="sg-def h"><b><span class="sg-n2" data-v="${n}">0</span> %</b><span>${t}</span><i>${p}</i></div>`).join('')}
      <div class="sg-src">Olza et al. (2017), estudio ANIBES · <i>Nutrients</i></div>
      <div class="sg-iqvia h" id="iq">En farmacia, el magnesio ya mueve <b>48,2 M€</b> (+34,6 %) · IQVIA (2026)</div>
    </div>`,
  steps: [
    (el) => tl().add(scrawl($(el, '#k'))).add(misreg($(el, '#h')), 0.35),
    (el) => {
      const t = tl()
        .fromTo($(el, '#sg-ax'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5 })
        .from($$(el, '#grid > *'), { opacity: 0, duration: 0.4, stagger: 0.03 }, 0.1);
      $$(el, '.sg').forEach((g, i) => {
        const v = +g.dataset.v;
        const at = 0.3 + i * 0.11;
        t.to($(g, '.sg-bar'), { attr: { width: v * K }, duration: 0.7, ease: 'power3.out' }, at)
          .call(() => sfx.tick(500 + (SEGS.length - i) * 60, 0.13), null, at)
          .to($(g, '.sg-v'), { opacity: 1, duration: 0.3 }, at + 0.5);
      });
      return t;
    },
    (el) => {
      const t = tl()
        .to($$(el, '.sg-o'), { opacity: 0.32, duration: 0.5 })
        .call(() => sfx.ding(660), null, 0.2);
      $$(el, '.sg-d').forEach((g, i) => {
        t.to($(g, '.sg-bar'), { fill: '#189150', duration: 0.35 }, 0.25 + i * 0.16)
          .fromTo($(g, '.sg-p'), { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.35, ease: 'back.out(2)' }, 0.3 + i * 0.16)
          .call(() => sfx.pop(600 + i * 80), null, 0.3 + i * 0.16);
      });
      t.add(pop($(el, '#tot')), 1.3)
        .add(countUp($(el, '#totv'), 33, { dec: 1, suffix: ' M€', dur: 1.1 }), 1.4)
        .add(mark($(el, '#totp'), 'underline', { color: '#e11d38', width: 6, pad: 6 }), 2.4);
      return t;
    },
    (el) => {
      const t = tl().add(reveal($(el, '#sci')));
      $$(el, '.sg-def').forEach((d, i) => {
        t.add(stamp(d, { rot: [-1.5, 1, -1][i], quake: 0.25 }), 0.3 + i * 0.45)
          .add(countUp($(d, '.sg-n2'), +$(d, '.sg-n2').dataset.v, { dur: 0.7, sound: i === 0 }), 0.3 + i * 0.45);
      });
      t.add(pop($(el, '#iq'), { freq: 700 }), 1.9);
      return t;
    },
  ],
};

// ---------------------------------------------------------------------------------------- ClearPro
// Precios consultados en noviembre de 2026 (pueden variar): YoPro en Carrefour.es; Mercadona según prensa (jun. 2026);
// Myprotein Clear Protein Water, pack 6 × 500 ml a 18,01 € en tienda online.
const PRICES = [
  ['Myprotein Clear', 'clear · 500 ml · solo online', 3.0, false],
  ['YoPro (Danone)', 'lácteo · 25 g · Carrefour', 2.69, false],
  ['ClearPro', 'clear · 20 g · 125 ml · nevera del súper', 2.19, true],
  ['Batido Mercadona', 'marca blanca · no es clear', 1.4, false],
];
export const CLEARPRO_SLIDE = {
  id: 'clearpro', theme: 'paper', title: 'ClearPro · proteína clear', speaker: 'David', time: '5:50–6:20', buyers: [true, 0],
  notes: `→ "Y después de entrenar, ClearPro: 20 gramos de proteína con textura de zumo, hecha con suero de Lactalis Ingredients…"
→ (precios) "…a 2,19 €: más barata que un YoPro y que la proteína clear online."
   No digáis "menos de la mitad que un batido": con precios reales de nov. 2026 no se sostiene.
→ "Y aquí vuelve la madre de Álex. Lo que le daba miedo era un bote de polvo de una marca que no conocía. Cuando ve un botellín de Puleva junto a la leche, la conversación cambia."  (sello: CONSUMIDOR ✓)`,
  html: `${DEFS}
    <div class="cpx-disc abs h" id="disc"></div>
    <div class="cpx-badge abs h" id="badge"><b id="g20">0</b><span>g de<br>proteína</span></div>
    <img class="cpx-img abs h" id="cpi" src="${IMG('clearpro')}">
    <div class="abs" style="left:840px;top:80px;width:980px">
      <div class="marker h" id="k" style="font-size:48px;color:var(--pink)">Y después de entrenar…</div>
      <div class="mega h" id="h" style="font-size:150px;line-height:.9;margin-top:6px">CLEAR<span style="color:var(--blue)">PRO</span></div>
      <div class="marker h" id="sl" style="font-size:52px;color:var(--blue);margin-top:6px">Proteína que se bebe como un zumo.</div>
    </div>
    <div class="cpx-facts abs" style="left:840px;top:350px;width:980px">
      ${[['20 g', 'de aislado de suero clarificado (clear whey)'], ['125 ml', 'transparente, textura de zumo, sabores frutales'], ['LACTALIS', 'suero nativo de Lactalis Ingredients']].map(([a, b]) => `<div class="cpx-f h"><b>${a}</b><span>${b}</span></div>`).join('')}
    </div>
    <div class="cpx-price abs h" id="pr" style="left:840px;top:700px;width:980px">
      <div class="pc-t">PRECIO POR BOTELLA · nov. 2026</div>
      ${PRICES.map(([n, d, v, me]) => `<div class="pc-r ${me ? 'me' : ''}"><b>${n}</b><span class="pc-bar"><i style="width:${(v / 3) * 100}%"></i></span><em>${v.toFixed(2).replace('.', ',')} €</em><small>${d}</small></div>`).join('')}
      <div class="marker cpx-half h" id="half">precio de súper, formato que hoy solo está online</div>
    </div>
    <div class="cpx-mum abs h" id="mum">${bubble('<s>«Eso son polvos…»</s>', 'left', 'bubble-old')}<div class="marker newline" id="nl">Un botellín de Puleva junto a la leche:<br><span style="color:var(--pink)">la conversación cambia.</span></div></div>`,
  steps: [
    (el) => tl().add(scrawl($(el, '#k'))).add(misreg($(el, '#h'), { k: 1.4 }), 0.35).add(scrawl($(el, '#sl')), 1),
    (el) => {
      const t = tl()
        .add(pop($(el, '#disc'), { freq: 380 }))
        .add(drop($(el, '#cpi'), { from: -1100, weight: 1.3, quake: 0.6 }), 0.2)
        .add(stamp($(el, '#badge'), { rot: -8, quake: 0.4 }), 0.9)
        .add(countUp($(el, '#g20'), 20, { dur: 0.8 }), 1);
      $$(el, '.cpx-f').forEach((f, i) => t.add(pop(f, { freq: 520 + i * 90 }), 1.1 + i * 0.22));
      return t;
    },
    (el) => tl().set($(el, '#pr'), { autoAlpha: 1 })
      .from($$(el, '#pr .pc-r'), { autoAlpha: 0, x: 30, duration: 0.3, stagger: 0.15 })
      .from($$(el, '#pr .pc-bar i'), { width: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }, 0.2)
      .add(scrawl($(el, '#half')), 1.2),
    (el, ctx) => tl()
      .to([$(el, '.cpx-facts'), $(el, '#pr')], { autoAlpha: 0, y: -20, duration: 0.3 })
      .add(pop($(el, '#mum')), 0.25)
      .add(scrawl($(el, '#nl'), { dur: 1.2 }), 0.6)
      .add(ctx.stampBuyer(0), 2),
  ],
};

// ---------------------------------------------------------------------------------------- embajadores
// Fotos reales en public/img/embajadores/{roberto,sofig}_fit.jpg (deportivas; las de retrato quedan de repuesto). Si falta alguna, se ven las iniciales.
const amb = (id, name, initials, role, channel, money, bottles, color, aud) => `
  <div class="amb abs h ${color}" id="amb-${id}">
    <div class="amb-aud">${aud}</div>
    <div class="amb-photo"><img src="img/embajadores/${id}_fit.jpg" alt="${name}" onerror="this.parentNode.classList.add('nophoto');this.remove()"><span class="amb-ini">${initials}</span></div>
    <div class="amb-txt">
      <b>${name}</b>
      <span>${role}</span>
      <div class="amb-ch">${channel}</div>
      <div class="amb-m">${money}</div>
    </div>
    <div class="amb-bottles">${bottles.map((k) => `<img class="h" src="${IMG(k)}">`).join('')}</div>
  </div>`;

export const EMBAJADORES_SLIDE = {
  id: 'embajadores', theme: 'paper', title: 'Lactalis · 1 M€ en medios y embajadores', speaker: 'David', time: '7:00–7:40', buyers: [true, 2],
  notes: `"Y por último, convencer a Lactalis. Invertimos 3 millones al año: dos en comercial y uno en medios. Empecemos por el millón de medios."
→ (Roberto Leal) "Queremos dos caras que cubran los dos públicos que definimos: adultos de 30 a 55 años y familias para Daily, y jóvenes activos de 18 a 35 para Active. Para Daily, en televisión, un presentador de gran audiencia familiar, como Roberto Leal: cercanía y confianza, justo lo que Puleva aporta frente a la marca blanca."
→ (SofiG) "Para Now y la línea Active, en Instagram, TikTok y Twitch, una creadora con público joven, como SofiG."
→ (microinfluencers) "Más microinfluencers de deporte y publicidad pagada en Meta y TikTok para llevar su contenido al público. Todo, sujeto a negociación."
→ (barra) "600.000 en tele, 300.000 en redes, 100.000 en amplificación. Y si los cachés superan lo previsto, se recortan pases de TV, no las redes."
Siempre "como" y "sujeto a negociación".`,
  html: `${DEFS}
    <div class="marker abs h" id="k" style="left:110px;top:54px;font-size:36px;color:var(--blue)">Convencer a Lactalis · 3 M€/año = 2 comercial + 1 medios</div>
    <div class="mega abs h" id="h" style="left:110px;top:108px;font-size:100px">1 M€ <span style="color:var(--pink)">PARA QUE NOS VEAN.</span></div>
    ${amb('roberto', 'Roberto Leal', 'RL', 'presentador de gran audiencia familiar · cercanía y confianza', 'DAILY · TV (Atresmedia, Mediaset y CTV)', '600 k€', ['now', 'care', 'shield'], 'amb-blue', 'PÚBLICO · adultos de 30–55 años y familias')}
    ${amb('sofig', 'SofiG', 'SG', 'creadora de contenido con público joven', 'NOW + ACTIVE · Instagram, TikTok y Twitch', '300 k€', ['now', 'creasnap', 'clearpro'], 'amb-pink', 'PÚBLICO · jóvenes activos de 18–35 años')}
    <div class="amb-side abs" style="left:1500px;top:250px;width:330px">
      <div class="amb-s h"><b>+ MICRO&shy;INFLUENCERS</b><span>de deporte (18–35 años), dentro de los 300 k€ de redes</span></div>
      <div class="amb-s h"><b>100 k€</b><span>amplificación pagada en Meta y TikTok</span></div>
    </div>
    <div class="rubber abs h" id="neg" style="left:1460px;top:640px;font-size:44px">SUJETO A<br>NEGOCIACIÓN</div>
    <div class="mm abs h" id="mm" style="left:110px;top:900px;width:1700px">
      <div class="mm-bar"><i class="mm-tv" style="width:60%"><em>TV · 600 k€</em></i><i class="mm-rs" style="width:30%"><em>Redes · 300 k€</em></i><i class="mm-am" style="width:10%"><em>100 k€</em></i></div>
      <div class="mm-note h" id="mmn">Si los cachés superan lo previsto, se recortan pases de TV, no las redes.</div>
    </div>`,
  steps: [
    (el) => tl().add(scrawl($(el, '#k'))).add(misreg($(el, '#h')), 0.4),
    ...['roberto', 'sofig'].map((id, n) => (el) => {
      const c = $(el, `#amb-${id}`);
      const t = tl().add(tapeOn(c, { rot: n ? 1.5 : -1.5 }));
      $$(c, '.amb-bottles img').forEach((im, i) => t.add(drop(im, { from: -900, weight: 0.7, quake: 0.2, rot: (i - 1) * 7 }), 0.5 + i * 0.15));
      return t;
    }),
    (el) => {
      const t = tl();
      $$(el, '.amb-s').forEach((s, i) => t.add(pop(s, { freq: 560 + i * 120 }), i * 0.3));
      return t.add(stamp($(el, '#neg'), { rot: -7, quake: 0.5 }), 0.8);
    },
    (el) => tl().set($(el, '#mm'), { autoAlpha: 1 })
      .from($$(el, '.mm-bar i'), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.6, stagger: 0.35, ease: 'power3.out' })
      .call(() => sfx.cash(), null, 1.2)
      .add(reveal($(el, '#mmn')), 1.3),
  ],
};

// ---------------------------------------------------------------------------------------- APÉNDICE (para preguntas)
// Figura 7, Tabla 7 (cuenta de resultados + hipótesis) y Tabla 8 (sensibilidad) del informe.
const apxHead = (n, t, sub) => `
  <div class="apx-k abs h" id="ak">APÉNDICE · ${n}</div>
  <div class="mega abs h" id="ah" style="left:110px;top:100px;font-size:84px">${t}</div>
  ${sub ? `<div class="apx-sub abs h" id="as">${sub}</div>` : ''}`;
const apxIntro = (el) => { const t = tl().add(pop($(el, '#ak'), { freq: 900 })).add(misreg($(el, '#ah')), 0.15); if ($(el, '#as')) t.add(reveal($(el, '#as')), 0.5); return t; };

// A1 · Figura 7
const F7 = { k: 30, base: 470 }; // px por M€ y línea del cero
const f7y = (v) => F7.base - v * F7.k;
const APX_FIG7 = {
  id: 'apx-fig7', theme: 'graph', title: 'Apéndice · Figura 7 (venta neta y EBITDA)', speaker: 'Para preguntas', time: 'apéndice',
  notes: `Figura 7 del informe. Lectura: el año 1 es de inversión (0,74 M€ de margen bruto frente a 3,43 M€ de costes, con 450.000 € de altas que no se repiten). Desde el año 2 el margen bruto crece mucho más rápido que los costes fijos. Interpolando mes a mes, el resultado mensual pasa a positivo hacia el mes 29.
Si la cuota llega al 15 % en el año 4, el EBITDA se acerca a +0,95 M€, el EBIT pasa a positivo y la inversión acumulada (5,07 M€) se recupera hacia el año 7.`,
  html: `${apxHead('A1', 'FIGURA 7 · VENTA NETA Y EBITDA', 'Datos de la Tabla 7, en millones de euros')}
    <svg class="abs" viewBox="0 0 1060 640" style="left:90px;top:320px;width:1060px;height:640px;overflow:visible" id="f7">
      ${[-3, 0, 5, 10, 15].map((v) => `<line x1="90" x2="1040" y1="${f7y(v)}" y2="${f7y(v)}" class="${v ? 'ax-grid' : 'f7-zero'}"/><text x="76" y="${f7y(v) + 8}" text-anchor="end" class="ax-t">${String(v).replace('-', '−')}</text>`).join('')}
      <path d="M90 ${f7y(16.5)} V${f7y(-3)}" class="ax-line"/>
      <text class="ax-title" transform="translate(16 ${f7y(6)}) rotate(-90)" text-anchor="middle">millones de €</text>
      ${[[260, 3.78, 'Año 1'], [560, 8.47, 'Año 2'], [860, 15.13, 'Año 3']].map(([x, v, y]) => `
        <rect class="f7-bar" x="${x - 85}" y="${F7.base}" width="170" height="0" rx="12" data-y="${f7y(v)}" data-h="${v * F7.k}"/>
        <text class="f7-v h" x="${x}" y="${f7y(v) - 14}" text-anchor="middle">${v.toFixed(2).replace('.', ',')}</text>
        <text class="yl" x="${x}" y="${f7y(-3) + 74}" text-anchor="middle">${y}</text>`).join('')}
      <path id="f7eb" class="h" d="M260 ${f7y(-2.69)} L560 ${f7y(-1.29)} L860 ${f7y(0.2)}" fill="none" stroke="#e11d38" stroke-width="9" stroke-linecap="round"/>
      ${[[260, -2.69, '−2,69'], [560, -1.29, '−1,29'], [860, 0.2, '+0,20']].map(([x, v, l]) => `<g class="f7p" opacity="0"><circle cx="${x}" cy="${f7y(v)}" r="12" fill="#e11d38"/><text x="${x + 20}" y="${f7y(v) + (v > 0 ? -14 : 36)}" class="ebv">${l}</text></g>`).join('')}
      <text x="96" y="${f7y(16.5) - 10}" class="lg">■ VENTA NETA (M€) · <tspan fill="#e11d38">● EBITDA (M€)</tspan></text>
      <text class="ax-title" x="1040" y="${f7y(-3) + 112}" text-anchor="end">años desde el lanzamiento →</text>
    </svg>
    <div class="apx-kpis abs" style="left:1240px;top:300px;width:580px">
      <div class="apx-kpi h"><span>BREAK-EVEN OPERATIVO MENSUAL</span><b>Mes 29</b></div>
      <div class="apx-kpi h"><span>EBITDA ANUAL POSITIVO</span><b>Año 3</b><small>+202,6 k€ · +1,3 % s/ venta neta</small></div>
      <div class="apx-kpi h"><span>INVERSIÓN ACUMULADA A RECUPERAR</span><b>5,07 M€</b><small>EBITDA acum. −3,77 + inversiones 1,30 · se recupera hacia el año 7</small></div>
    </div>`,
  steps: [
    apxIntro,
    (el) => tl()
      .to($$(el, '.f7-bar'), { attr: { height: (i, b) => +b.dataset.h, y: (i, b) => +b.dataset.y }, duration: 0.8, stagger: 0.25, ease: 'power3.out' })
      .call(() => sfx.tick(900, 0.15), null, 0.3)
      .to($$(el, '.f7-v'), { autoAlpha: 1, duration: 0.3, stagger: 0.25 }, 0.6)
      .set($(el, '#f7eb'), { autoAlpha: 1 }, 1.2)
      .fromTo($(el, '#f7eb'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1 }, 1.2)
      .to($$(el, '.f7p'), { opacity: 1, duration: 0.2, stagger: 0.33 }, 1.2),
    (el) => { const t = tl(); $$(el, '.apx-kpi').forEach((k, i) => t.add(pop(k, { freq: 600 + i * 120 }), i * 0.25)); return t; },
  ],
};

// A2 · Tabla 7 + hipótesis
const T7 = [
  ['Mercado de referencia', '135.000', '151.200', '166.300', 'NielsenIQ + crecimiento', ''],
  ['Cuota (sell-out)', '4,0 %', '8,0 %', '13,0 %', 'Hipótesis 2', ''],
  ['Ventas a PVP (sell-out)', '5.400,0', '12.096,0', '21.619,0', 'Mercado × cuota', ''],
  ['Margen de la cadena (30 %)', '−1.620,0', '−3.628,8', '−6.485,7', 'Hipótesis 3', ''],
  ['Venta neta Puleva (sell-in)', '3.780,0', '8.467,2', '15.133,3', '70 % del PVP', 'b'],
  ['Coste de producto', '−3.037,5', '−6.804,0', '−12.160,7', 'Planta propia + maquila', ''],
  ['Margen bruto', '742,5', '1.663,2', '2.972,6', '13,75 % del PVP (19,6 % s/ neta)', 'b'],
  ['Gasto comercial', '−2.000,0', '−1.500,0', '−1.300,0', 'Altas 450 → 100 → 50', ''],
  ['Marketing (TV + redes)', '−1.000,0', '−1.000,0', '−1.000,0', 'TV 600 + influencers 300 + amplif. 100', ''],
  ['Personal y calidad', '−430,0', '−450,0', '−470,0', 'Hipótesis 5', ''],
  ['EBITDA', '−2.687,5', '−1.286,8', '+202,6', '+1,3 % s/ venta neta en A3', 'b'],
  ['Amortizaciones', '−366,7', '−366,7', '−366,7', '800/3 + 500/5', ''],
  ['EBIT', '−3.054,2', '−1.653,5', '−164,1', 'Positivo en el año 4', 'b'],
];
const HYP = [
  ['Mercado de referencia', 'Canal moderno: 119,46 M€ que crecen un 13, 12 y 10 % → 135,0 / 151,2 / 166,3 M€. Parte de la venta es demanda nueva.'],
  ['Cuota (sell-out a PVP)', '4 % → 8 % → 13 %. Distribución al 55 % y luego al 70 % de las cadenas objetivo; Active entra en el mes 15.'],
  ['Margen de la cadena', '30 % del PVP, como los lácteos refrigerados premium: la venta neta de Puleva es el 70 % del PVP.'],
  ['Margen de Puleva', '15 % Daily · 10 % Active (13,75 % ponderado). Danone: 13,0 % operativo como grupo y 8,5 % en lácteos.'],
  ['Inversiones', '800 k€ de arrancada con el maquilador (3 años) + 500 k€ para la línea propia de shots (5 años). Personal y calidad: 430 → 470 k€.'],
];
const APX_T7 = {
  id: 'apx-t7', theme: 'paper', title: 'Apéndice · Tabla 7 e hipótesis', speaker: 'Para preguntas', time: 'apéndice',
  notes: `Tabla 7 del informe (miles de euros) y las cinco hipótesis del modelo.
Si preguntan por qué el margen es tan bajo: Daily queda solo 5 puntos por encima de Active porque se fabrica en planta propia, sin margen de maquilador, pero en un sector de márgenes ajustados. Nuestro EBITDA del año 3 (1,3 %) queda muy por debajo del 8,5 % de Danone en lácteos: las hipótesis son prudentes.`,
  html: `${apxHead('A2', 'CUENTA DE RESULTADOS E HIPÓTESIS', 'Tabla 7 del informe · miles de euros')}
    <div class="t7 abs" style="left:110px;top:270px;width:1130px">
      <div class="t7-r t7-h"><span>Partida</span><span>Año 1</span><span>Año 2</span><span>Año 3</span><span>Base de cálculo</span></div>
      ${T7.map((r) => `<div class="t7-r h ${r[5] ? 't7-b' : ''}">${r.slice(0, 5).map((c) => `<span>${c}</span>`).join('')}</div>`).join('')}
    </div>
    <div class="hyp abs" style="left:1290px;top:270px;width:540px">
      ${HYP.map(([a, b], i) => `<div class="hyp-c h"><i>${i + 1}</i><b>${a}</b><span>${b}</span></div>`).join('')}
    </div>`,
  steps: [
    apxIntro,
    (el) => tl().from($(el, '.t7-h'), { autoAlpha: 0, duration: 0.2 })
      .set($$(el, '.t7-r.h'), { autoAlpha: 1 }, 0)
      .from($$(el, '.t7-r.h'), { autoAlpha: 0, x: -30, duration: 0.25, stagger: 0.07 }, 0.1)
      .call(() => sfx.printer(13, 0.07), null, 0.1),
    (el) => { const t = tl(); $$(el, '.hyp-c').forEach((c, i) => t.add(pop(c, { freq: 500 + i * 90 }), i * 0.18)); return t; },
  ],
};

// A3 · Tabla 8 · sensibilidad
const T8 = [
  ['Caso base', 'Daily 15 %, cuota 13 %', 202.6, 'Equilibrio operativo en el año 3'],
  ['Daily al 10 %', 'todo con maquilador', -608.1, 'No es viable: fabricar en planta propia es una condición'],
  ['Daily al 20 %', 'más escala o mejor mix de precio', 1013.3, 'Escenario optimista'],
  ['Cuota del 11 %', 'en el año 3', -254.7, 'El equilibrio se retrasa al año 4'],
  ['Cuota del 15 %', 'en el año 3', 659.9, 'Distribución más rápida en las cadenas'],
];
const S0 = 760; // x del cero
const SK = 0.42; // px por k€
const APX_T8 = {
  id: 'apx-t8', theme: 'graph', title: 'Apéndice · Tabla 8 (sensibilidad)', speaker: 'Para preguntas', time: 'apéndice',
  notes: `Tabla 8 del informe: EBITDA del año 3 según cada escenario (miles de euros).
Lo que tiene que salir bien: fabricar Daily en planta propia. Con maquilador (Daily al 10 %), el EBITDA del año 3 es −608,1 k€.
Con un 15 % de cuota, el EBITDA del año 3 se triplica (+659,9 k€). Si la cuota llega al 15 % en el año 4, EBITDA ≈ +0,95 M€ y EBIT positivo.`,
  html: `${apxHead('A3', 'SENSIBILIDAD: QUÉ TIENE QUE SALIR BIEN', 'Tabla 8 del informe · EBITDA del año 3 por escenario (miles de euros)')}
    <svg class="abs" viewBox="0 0 1700 640" style="left:110px;top:290px;width:1700px;height:640px;overflow:visible" id="t8">
      ${[-600, -300, 0, 300, 600, 900].map((v) => `<line x1="${S0 + v * SK}" x2="${S0 + v * SK}" y1="10" y2="590" class="${v ? 'ax-grid' : 'f7-zero'}"/><text x="${S0 + v * SK}" y="626" text-anchor="middle" class="ax-t">${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v)}</text>`).join('')}
      ${T8.map(([a, b, v, c], i) => { const y = 30 + i * 112; const w = Math.abs(v) * SK; return `
        <g class="t8-r">
          <text x="0" y="${y + 30}" class="t8-a">${a}</text><text x="0" y="${y + 60}" class="t8-b">${b}</text>
          <rect class="t8-bar ${v < 0 ? 'neg' : i === 0 ? 'base' : 'pos'}" x="${S0}" y="${y}" width="0" height="64" rx="12" data-w="${w}" data-neg="${v < 0 ? 1 : 0}"/>
          <text class="t8-v" x="${v < 0 ? S0 - w - 14 : S0 + w + 14}" y="${y + 44}" text-anchor="${v < 0 ? 'end' : 'start'}" opacity="0">${v > 0 ? '+' : '−'}${Math.abs(v).toLocaleString('es-ES', { minimumFractionDigits: 1 })}</text>
          <text class="t8-c" x="${v < 0 ? S0 + 18 : S0 - 18}" y="${y + 40}" text-anchor="${v < 0 ? 'start' : 'end'}" opacity="0">${c}</text>
        </g>`; }).join('')}
      <text class="ax-title" x="${S0}" y="664" text-anchor="middle">EBITDA del año 3 (k€)</text>
    </svg>`,
  steps: [
    apxIntro,
    (el) => {
      const t = tl();
      $$(el, '.t8-bar').forEach((b, i) => {
        const w = +b.dataset.w; const neg = b.dataset.neg === '1';
        t.fromTo(b, { attr: { width: 0, x: S0 } }, { attr: { width: w, x: neg ? S0 - w : S0 }, duration: 0.7, ease: 'power3.out' }, i * 0.3)
          .call(() => sfx.tick(neg ? 500 : 1100, 0.14), null, i * 0.3)
          .to($$(el, '.t8-v')[i], { opacity: 1, duration: 0.3 }, i * 0.3 + 0.5)
          .to($$(el, '.t8-c')[i], { opacity: 1, duration: 0.3 }, i * 0.3 + 0.6);
      });
      return t;
    },
  ],
};

// A4 · Escandallo por bote (año 3)
// Cuadra con la Tabla 7: cadena 30 % del PVP; margen bruto de Puleva 15 % del PVP en Daily y 10 % en Active, así que el
// coste de producto es el 55 % y el 60 % del PVP. Su desglose (activos, envase, fabricación…) es una estimación del equipo.
// El escandallo por unidad incluye la amortización, porque va ligada a cada línea: la línea propia (500 k€/5 años) a los
// 14,26 M de shots Daily y la arrancada del maquilador (800 k€/3 años) a los 2,72 M de botes Active. Los costes de
// estructura (comercial, marketing y personal) van en total, como en la Tabla 7, sin repartirlos por bote.
const ESC_TOT = [
  ['Margen bruto', '+2.972,6', 'k'], ['Comercial', '−1.300,0', 'm'], ['Marketing', '−1.000,0', 'm'], ['Personal y calidad', '−470,0', 'm'],
  ['EBITDA', '+202,6', 't'], ['Amortización', '−366,7', 'm'], ['EBIT', '−164,1', 'e'],
];
const ESC_COLS = [
  ['now', 'Now', '80 ml · planta propia'],
  ['care', 'Care', '100 ml · planta propia'],
  ['shield', 'Shield', '60 ml · planta propia'],
  ['creasnap', 'Crea-Snap', '80 ml · maquilador'],
  ['clearpro', 'ClearPro', '125 ml · maquilador'],
];
// [etiqueta, valores por producto, tipo] · tipo: p = precio, m = resta, t = subtotal, k = clave, d = detalle del coste
const ESC_ROWS = [
  ['PVP (precio en el lineal)', [1.08, 1.08, 1.25, 1.79, 2.19], 'p'],
  ['− Margen de la cadena (30 %)', [-0.324, -0.324, -0.375, -0.537, -0.657], 'm'],
  ['= Venta neta Puleva', [0.756, 0.756, 0.875, 1.253, 1.533], 't'],
  ['Activos (minerales, vitaminas, lactoferrina, creatina, suero)', [-0.09, -0.05, -0.17, -0.06, -0.50], 'd'],
  ['Base láctea / líquido y aromas', [-0.06, -0.07, -0.05, -0.03, -0.04], 'd'],
  ['Envase: botellín RPET, tapón, etiqueta y pack', [-0.16, -0.17, -0.16, -0.38, -0.14], 'd'],
  ['Fabricación y calidad (planta propia) · maquila', [-0.12, -0.12, -0.12, -0.51, -0.46], 'd'],
  ['Logística (frío en Daily · ambiente en Active)', [-0.10, -0.11, -0.10, -0.06, -0.07], 'd'],
  ['Mermas y caducidad', [-0.064, -0.074, -0.0875, -0.034, -0.104], 'd'],
  ['= Margen bruto Puleva (15 % Daily · 10 % Active)', [0.162, 0.162, 0.1875, 0.179, 0.219], 't'],
  ['− Amortización (línea propia · arrancada del maquilador)', [-0.007, -0.007, -0.007, -0.0982, -0.0982], 'm'],
  ['= Margen tras amortización', [0.155, 0.155, 0.1805, 0.0808, 0.1208], 'k'],
];
const eur = (v, dec) => `${v < 0 ? '−' : ''}${Math.abs(v).toFixed(dec).replace('.', ',')}`;
const APX_ESC = {
  id: 'apx-escandallo', theme: 'paper', title: 'Apéndice · Escandallo por bote (año 3)', speaker: 'Jesús (solo si preguntan)', time: 'apéndice',
  notes: `Escandallo por bote en el año 3, en euros por unidad, hasta el margen bruto (lo estándar en gran consumo).
- La cadena se queda el 30 % del PVP. El coste de producto es el 55 % del PVP en Daily y el 60 % en Active (margen de Puleva: 15 % y 10 %).
- El desglose del coste (activos, envase, fabricación, logística, mermas) es una estimación del equipo; lo que está en el informe es el total.
- Margen bruto por bote: 16–19 céntimos en Daily y 18–22 en Active.
- Amortización por unidad: línea propia 500 k€/5 años entre 14,3 M de shots = 0,7 céntimos; arrancada del maquilador 800 k€/3 años entre 2,7 M de botes Active = 9,8 céntimos. Tras amortizar: 15–18 céntimos por shot Daily y 8–12 por bote Active.
- Debajo, la cuenta del año 3 en total (Tabla 7): el margen bruto de todos los botes (2,97 M€) cubre comercial (1,3 M€), marketing (1 M€) y personal (0,47 M€): EBITDA +202,6 k€. Tras amortizar la arrancada del maquilador (800 k€ en 3 años) y la línea propia (500 k€ en 5), EBIT −164,1 k€; pasa a positivo en el año 4, cuando la arrancada ya está amortizada.
Si preguntan por qué no se reparten los fijos por bote: son costes de estructura que no dependen de cuántos botes se venden; se cubren con volumen.`,
  html: `${apxHead('A4', 'ESCANDALLO POR BOTE · AÑO 3', 'Euros por unidad, con la amortización de cada línea · debajo, la estructura en total (Tabla 7)')}
    <div class="esc abs" style="left:110px;top:250px;width:1700px">
      <div class="esc-r esc-h"><span></span>${ESC_COLS.map(([k, n, f]) => `<span><img src="${IMG(k)}"><b>${n}</b><small>${f}</small></span>`).join('')}</div>
      ${ESC_ROWS.map(([l, vs, t]) => `<div class="esc-r esc-${t} h"><span>${l}</span>${vs.map((v) => `<span class="${v < 0 && (t === 't' || t === 'k') ? 'neg' : ''}">${eur(v, t === 'p' ? 2 : 3)}</span>`).join('')}</div>`).join('')}
    </div>
    <div class="esc-tot abs h" id="esct">
      <div class="esc-tt">AÑO 3 · CUENTA EN TOTAL (miles de €) · comercial, marketing y personal no se reparten por bote</div>
      <div class="esc-trow">${ESC_TOT.map(([l, v, t]) => `<div class="esc-tc esc-tc-${t}"><span>${l}</span><b>${v}</b></div>`).join('')}</div>
    </div>
    <div class="esc-note abs h" id="escn"><b>Tras amortizar: 15–18 céntimos por shot Daily y 8–12 por bote Active.</b> El volumen cubre la estructura; EBIT positivo en el año 4.</div>`,
  steps: [
    apxIntro,
    (el) => tl().from($(el, '.esc-h'), { autoAlpha: 0, y: 10, duration: 0.3 })
      .set($$(el, '.esc-p, .esc-m, .esc-t').slice(0, 3), { autoAlpha: 1 }, 0.1)
      .from($$(el, '.esc-r.h').slice(0, 3), { autoAlpha: 0, x: -20, duration: 0.25, stagger: 0.12 }, 0.1)
      .call(() => sfx.tick(900, 0.14), null, 0.1),
    (el) => { const r = $$(el, '.esc-r.h').slice(3, 12); return tl().set(r, { autoAlpha: 1 }).from(r, { autoAlpha: 0, x: -20, duration: 0.22, stagger: 0.09 }).call(() => sfx.printer(7, 0.09), null, 0); },
    (el) => { const t = tl().add(reveal($(el, '#esct'))); $$(el, '.esc-tc').forEach((c, i) => t.from(c, { autoAlpha: 0, y: 16, duration: 0.25 }, 0.2 + i * 0.15)); return t.add(pop($(el, '#escn'), { freq: 640 }), 1.4); },
  ],
};

export const APENDICE_SLIDES = [APX_FIG7, APX_T7, APX_T8, APX_ESC];
