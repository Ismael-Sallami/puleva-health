// Borrador 2 · "Fanzine de la final". Sigue el guion (presentacion/guion.md) bloque a bloque.
// Cada página: tema, ponente, tiempo objetivo, notas (el texto del guion) y una lista de pasos (→).
import {
  gsap, mark, drop, pop, reveal, wordRise, countUp, burst, shake, misreg, stamp, scrawl, typeOut, tapeOn, printIn, confetti, $, $$,
} from './fx.js';
import { sfx } from './sfx.js';
import { DEFS, alex, carmen, tub, clock, milk, fridge, bubble, hand } from './illus.js';
import { createBlueprint } from './blueprint.js';

const tl = () => gsap.timeline();
const IMG = (k) => `img/${k}.webp`; // renders de los botes de la web

// ---------------------------------------------------------------------------------------- cromos
const CARDS = {
  now: { name: 'NOW', line: 'DAILY', color: 'c-navy', fmt: '80 ml · frutos rojos', formula: ['Magnesio', 'L-teanina 200 mg', 'Vitaminas B6 y B12'], claim: 'Las vitaminas B6 y B12 ayudan a disminuir el cansancio y la fatiga.', tag: 'el shot que sustituye al segundo café', price: '1,08' },
  care: { name: 'CARE', line: 'DAILY', color: 'c-pink', fmt: '100 ml · fresa', formula: ['Vitamina C 80 mg', 'Vitamina E 12 mg', 'Zinc 10 mg'], claim: 'El zinc contribuye a mantener la piel en condiciones normales.', tag: 'tu piel, desde dentro', price: '1,08' },
  shield: { name: 'SHIELD', line: 'DAILY', color: 'c-orange', fmt: '60 ml · miel y limón', formula: ['Lactoferrina 150 mg', 'Zinc y saúco', 'Vitaminas C y D3'], claim: 'El zinc y las vitaminas C y D contribuyen al funcionamiento normal del sistema inmunitario.', tag: 'la defensa natural de la leche', price: '1,25' },
};
const card = (k, n) => {
  const c = CARDS[k];
  return `
  <div class="slot" id="slot-${k}"><span class="slot-n">Nº ${n}</span><span class="slot-name">${c.name}</span>
    <div class="cromo h" id="cr-${k}">
      <div class="cromo-in">
        <div class="cromo-front ${c.color}"><div class="cr-band">${c.line}</div><img src="${IMG(k)}"><div class="cr-name">${c.name}</div><i class="holo"></i></div>
        <div class="cromo-back ${c.color}"><i class="holo"></i>
          <div class="cr-name">${c.name}</div><div class="cr-fmt">${c.fmt}</div>
          <ul>${c.formula.map((f) => `<li>${f}</li>`).join('')}</ul>
          <div class="cr-claim">${c.claim}</div>
          <div class="cr-tag">${c.tag}</div>
          <div class="cr-price"><b>${c.price} €</b><span>/ shot</span></div>
        </div>
      </div>
    </div>
    <div class="hand h">${hand()}</div>
  </div>`;
};
const slapCard = (el, k) => {
  const cr = $(el, `#cr-${k}`);
  const hd = $(el, `#slot-${k} .hand`);
  const t = tl();
  // una mano sube el cromo desde abajo, lo aprieta contra el álbum y se va
  t.fromTo(cr, { autoAlpha: 1, y: 900, rotation: 10, scale: 1.04 }, { y: 0, rotation: (Math.random() - 0.5) * 5, scale: 1, duration: 0.65, ease: 'power3.out' }, 0)
    .fromTo(hd, { autoAlpha: 1, y: 900, rotation: 8 }, { y: 0, rotation: 0, duration: 0.65, ease: 'power3.out' }, 0)
    .call(() => { sfx.slap(); shake(0.35); }, null, 0.7)
    .to([hd], { y: 16, duration: 0.08, yoyo: true, repeat: 1 }, 0.66)
    .fromTo(cr, { scale: 0.97 }, { scale: 1, duration: 0.3, ease: 'back.out(3)' }, 0.72)
    .to(hd, { y: 820, rotation: -6, duration: 0.55, ease: 'power2.in' }, 1.0)
    .set(hd, { autoAlpha: 0 })
    .call(() => sfx.flip(), null, 1.5)
    .to($(cr, '.cromo-in'), { rotationY: 180, duration: 0.7, ease: 'power3.inOut' }, 1.5)
    .fromTo($$(cr, '.holo'), { xPercent: -120 }, { xPercent: 120, duration: 1.1, ease: 'power2.inOut' }, 2.1)
    .call(() => sfx.tick(3200, 0.08), null, 2.4);
  return t;
};

// ---------------------------------------------------------------------------------------- páginas
export const SLIDES = [
  // 0 ─────────────────────────────────────────── PORTADA (se imprime en tres pasadas)
  {
    id: 'portada', theme: 'paper', title: 'Portada', speaker: 'P1', time: 'antes de empezar',
    notes: `Está en pantalla mientras subís: papel en blanco con marcas de registro.
→ La risógrafo imprime la portada en tres pasadas (amarillo, rosa, azul) y caen los botes. Pulsadlo justo antes de empezar a hablar.
→ siguiente: empieza P1 con la familia.`,
    html: `
      <div class="regmark" style="left:30px;top:30px"><svg viewBox="0 0 70 70"><circle cx="35" cy="35" r="18" fill="none" stroke="#16163A" stroke-width="3"/><path d="M35 0V70M0 35H70" stroke="#16163A" stroke-width="3"/></svg></div><div class="regmark" style="right:30px;top:30px"><svg viewBox="0 0 70 70"><circle cx="35" cy="35" r="18" fill="none" stroke="#16163A" stroke-width="3"/><path d="M35 0V70M0 35H70" stroke="#16163A" stroke-width="3"/></svg></div><div class="regmark" style="left:30px;bottom:30px"><svg viewBox="0 0 70 70"><circle cx="35" cy="35" r="18" fill="none" stroke="#16163A" stroke-width="3"/><path d="M35 0V70M0 35H70" stroke="#16163A" stroke-width="3"/></svg></div><div class="regmark" style="right:30px;bottom:30px"><svg viewBox="0 0 70 70"><circle cx="35" cy="35" r="18" fill="none" stroke="#16163A" stroke-width="3"/><path d="M35 0V70M0 35H70" stroke="#16163A" stroke-width="3"/></svg></div>
      <div class="pass pass-y h"><div class="cv-sun"></div><div class="cv-band"></div></div>
      <div class="pass pass-p h"><div class="cv-moon"></div><div class="cv-slogan">SALUD QUE SE BEBE.</div></div>
      <div class="pass pass-b h"><div class="cv-kick">FANZINE DE LA FINAL · Nº 1</div><div class="cv-title">PULEVA<br>HEALTH</div><div class="cv-foot">IV HACKATHON UGR × LACTALIS PULEVA · GRUPO 6</div></div>
      <div class="cv-bottles">${['care', 'now', 'shield', 'creasnap', 'clearpro'].map((k) => `<img class="h" src="${IMG(k)}">`).join('')}</div>
      <div class="cv-hint" id="hint">PULSA <b>→</b> PARA IMPRIMIR</div>
      <div class="mini-roller" id="mr"></div>`,
    init(el) { gsap.to($(el, '#hint'), { opacity: 0.3, duration: 0.8, repeat: -1, yoyo: true }); },
    steps: [
      (el) => tl().from($$(el, '.regmark'), { scale: 0, rotation: 90, duration: 0.6, stagger: 0.08, ease: 'back.out(2)' }),
      (el) => {
        const t = tl().to($(el, '#hint'), { autoAlpha: 0, duration: 0.2 });
        const passes = [['.pass-y', 26, -14], ['.pass-p', -22, 16], ['.pass-b', 14, 10]];
        passes.forEach(([sel, dx, dy], i) => {
          const at = 0.2 + i * 1.0;
          t.call(() => sfx.roller(0.75), null, at)
            .set($(el, '#mr'), { autoAlpha: 1, y: -100 }, at)
            .to($(el, '#mr'), { y: 1100, duration: 0.75, ease: 'power1.inOut' }, at)
            .set($(el, '#mr'), { autoAlpha: 0 }, at + 0.75)
            .fromTo($(el, sel), { autoAlpha: 1, clipPath: 'inset(0 0 100% 0)', x: dx, y: dy }, { clipPath: 'inset(0 0 0% 0)', duration: 0.75, ease: 'power1.inOut' }, at)
            .to($(el, sel), { x: dx * 0.12, y: dy * 0.12, duration: 0.5, ease: 'power3.out' }, at + 0.75);
        });
        t.add(gsap.timeline().add($$(el, '.cv-bottles img').map((im, i) => drop(im, { from: -1200, weight: 1, quake: 0.35, rot: (i - 2) * 8 }).delay(i * 0.13))), 3.3);
        return t;
      },
    ],
  },

  // 1 ─────────────────────────────────────────── UNA FAMILIA
  {
    id: 'familia', theme: 'paper', title: 'Una familia', speaker: 'P1', time: '0:00–1:05',
    notes: `→ Álex: "Os voy a presentar a una familia. Álex tiene 20 años y acaba de apuntarse al gimnasio. Un día llega a casa con un bote de creatina de un kilo, y su madre lo mira como si hubiera traído algo ilegal: «eso son polvos, eso no puede ser sano»."
→ Carmen: "Su madre, Carmen, tiene 52 años. A las cuatro de la tarde está agotada, le cuesta concentrarse y lleva meses diciendo que tendría que cuidarse más. Pero cuando alguien le sugiere un complemento, contesta: «yo no quiero estar tomando pastillas como si estuviera enferma»."
→ "¿A cuántos os suena alguna de estas dos frases?"  [PAUSA 2 s, mirar al jurado]`,
    html: `${DEFS}
      <div class="marker abs h" id="kick" style="left:100px;top:56px;font-size:46px;color:var(--blue)">Os voy a presentar a una familia.</div>
      <div class="panel panel-pink abs h" id="pa" style="left:90px;top:150px">
        <div class="panel-who">${alex()}</div>
        <div class="panel-name h" id="na"><b>ÁLEX</b><i>20</i></div>
        <div class="panel-sub h" id="sa">se acaba de apuntar al gimnasio</div>
        <div class="panel-obj h" id="oa" style="right:40px;bottom:30px;width:230px">${tub()}</div>
        <div class="h" id="ba" style="position:absolute;right:30px;top:280px;width:400px">${bubble('«Eso son polvos, eso no puede ser sano»', 'left')}<small class="said">— su madre</small></div>
      </div>
      <div class="panel panel-yellow abs h" id="pc" style="left:1010px;top:150px">
        <div class="panel-who">${carmen()}</div>
        <div class="panel-name h" id="nc"><b>CARMEN</b><i>52</i></div>
        <div class="panel-sub h" id="sc">16:00 · agotada · le cuesta concentrarse</div>
        <div class="panel-obj h" id="oc" style="right:50px;bottom:40px;width:200px">${clock()}</div>
        <div class="h" id="bc" style="position:absolute;right:30px;top:280px;width:420px">${bubble('«Yo no quiero estar tomando pastillas como si estuviera enferma»', 'left')}<small class="said">— Carmen</small></div>
      </div>
      <div class="q-banner abs h" id="q"><span>¿A cuántos os suena alguna de estas dos frases?</span></div>`,
    steps: [
      (el) => scrawl($(el, '#kick'), { dur: 1 }),
      (el) => tl()
        .add(printIn($(el, '#pa')))
        .add(misreg($(el, '#na'), { k: 1 }), 0.3)
        .add(reveal($(el, '#sa')), 0.6)
        .add(drop($(el, '#oa'), { weight: 1.8, quake: 1 }), 0.8)
        .call(() => burst($(el, '#pa'), 640, 680, { n: 40, colors: ['#FFFFFF', '#E9E2D3'], size: [5, 12], vel: [150, 450], angle: [200, 340], gravity: 600, dur: 1.6 }), null, 1.35)
        .add(pop($(el, '#ba'), { freq: 420 }), 1.6),
      (el) => {
        const hm = $(el, '.hand-m'), hh = $(el, '.hand-h');
        return tl()
          .add(printIn($(el, '#pc'), { from: 'right' }))
          .add(misreg($(el, '#nc'), { k: 1 }), 0.3)
          .add(pop($(el, '#oc'), { freq: 700 }), 0.5)
          .fromTo(hm, { rotation: 0 }, { rotation: 720, svgOrigin: '110 110', duration: 1.4, ease: 'power2.inOut' }, 0.6)
          .fromTo(hh, { rotation: 60 }, { rotation: 120, svgOrigin: '110 110', duration: 1.4, ease: 'power2.inOut' }, 0.6)
          .call(() => sfx.clock(8, 0.17), null, 0.6)
          .add(reveal($(el, '#sc')), 1.2)
          .add(pop($(el, '#bc'), { freq: 380 }), 1.9);
      },
      (el) => tl()
        .to([$(el, '#pa'), $(el, '#pc')], { scale: 0.96, filter: 'saturate(.5) brightness(.85)', duration: 0.5 })
        .add(stamp($(el, '#q'), { rot: -3, quake: 0.6 }), 0.1),
    ],
  },

  // 2 ─────────────────────────────────────────── LA NEVERA
  {
    id: 'nevera', theme: 'ink-blue', title: 'En su nevera hay leche Puleva', speaker: 'P1', time: '1:05–1:15',
    notes: `→ (se abre la nevera) "Lo curioso es que los dos tienen algo en común: en su nevera hay leche Puleva."
Deja que la puerta se abra antes de decir "leche Puleva".`,
    html: `${DEFS}
      <div class="abs" id="fr" style="left:240px;top:90px">${fridge(`
        <div class="abs" style="left:70px;top:120px;width:110px">${milk()}</div>
        <div class="abs" style="left:200px;top:120px;width:110px">${milk()}</div>
        <div class="yog abs" style="left:80px;top:430px"></div><div class="yog abs" style="left:170px;top:430px"></div><div class="yog yog-p abs" style="left:260px;top:430px"></div>`)}</div>
      <div class="abs h" id="t1" style="left:900px;top:250px;width:900px;font-size:52px;line-height:1.15;color:var(--paper);font-weight:600">Lo curioso es que los dos tienen algo en común:</div>
      <div class="mega abs h" id="t2" style="left:900px;top:380px;width:960px;font-size:180px;color:var(--paper)">EN SU NEVERA<br>HAY LECHE<br><span style="color:var(--yellow)">PULEVA.</span></div>`,
    steps: [
      (el) => tl().from($(el, '#fr'), { y: 60, autoAlpha: 0, duration: 0.8, ease: 'power3.out' }).add(reveal($(el, '#t1')), 0.3),
      (el) => tl()
        .call(() => sfx.whoosh(0.5, false))
        .to($(el, '.fr-door'), { rotationY: -112, duration: 1.1, ease: 'back.out(1.3)' })
        .fromTo($(el, '.fr-light'), { opacity: 0 }, { opacity: 1, duration: 0.06, repeat: 3, yoyo: true }, 0.15)
        .to($(el, '.fr-light'), { opacity: 1, duration: 0.1 })
        .add(misreg($(el, '#t2'), { k: 1.4, dur: 1 }), 0.7)
        .call(() => sfx.ding(660), null, 1),
    ],
  },

  // 3 ─────────────────────────────────────────── EL LINEAL
  {
    id: 'lineal', theme: 'paper', title: 'El problema es el formato', speaker: 'P1', time: '1:15–1:55',
    notes: `"El problema no es la nutrición, es el formato."
→ (fotos del lineal) "Mirad el lineal: botes de cápsulas ordenados por marca…"
→ (sello) "…una farmacia sin farmacéutico."
→ (cifras) "Entre el 70 y el 80 % de los adultos españoles ya toma algún complemento, y en híper y súper la categoría mueve 119,5 millones y crece un 13 %."
→ (pegatina azul) "Y la creatina y la proteína, lo que más se vende en deporte, ni siquiera están: se compran por internet."`,
    html: `
      <div class="mega abs h" id="h1" style="left:90px;top:64px;font-size:112px">EL PROBLEMA NO ES LA NUTRICIÓN.</div>
      <div class="mega abs h" id="h2" style="left:90px;top:178px;font-size:112px;color:var(--pink)">ES EL FORMATO.</div>
      <div class="photo abs h" style="left:70px;top:330px;width:560px" data-r="-3"><img src="img/lineal1.jpg"><i class="tape"></i></div>
      <div class="photo abs h" style="left:590px;top:310px;width:320px" data-r="4"><img src="img/lineal2.jpg"><i class="tape"></i></div>
      <div class="photo abs h" style="left:880px;top:340px;width:560px" data-r="-2"><img src="img/lineal3.jpg"><i class="tape"></i></div>
      <div class="photo abs h" style="left:1420px;top:305px;width:330px" data-r="3"><img src="img/lineal4.jpg"><i class="tape"></i></div>
      <div class="rubber abs h" id="st" style="left:560px;top:440px;font-size:104px">UNA FARMACIA<br>SIN FARMACÉUTICO</div>
      <div class="sticker s-yellow abs h" id="k1" style="left:90px;top:830px"><b id="n1">0 %</b><span>de los adultos ya toma algún complemento</span></div>
      <div class="sticker s-pink abs h" id="k2" style="left:720px;top:850px"><b id="n2">0 M€</b><span>en híper y súper · crece un 13 %</span></div>
      <div class="sticker s-blue abs h" id="k3" style="left:1340px;top:820px"><b>NI ESTÁN</b><span>creatina y proteína: se compran por internet</span></div>`,
    steps: [
      (el) => tl().add(misreg($(el, '#h1'))).add(misreg($(el, '#h2')), 0.35),
      (el) => {
        const t = tl();
        $$(el, '.photo').forEach((p, i) => t.add(tapeOn(p, { rot: +p.dataset.r }), i * 0.22));
        return t;
      },
      (el) => stamp($(el, '#st'), { rot: -8, quake: 0.8 }),
      (el) => tl()
        .add(pop($(el, '#k1')))
        .add(countUp($(el, '#n1'), 80, { suffix: ' %', dur: 1, sound: true }), 0.1)
        .call(() => { $(el, '#n1').textContent = '70–80 %'; }, null, 1.15)
        .add(pop($(el, '#k2'), { freq: 640 }), 0.6)
        .add(countUp($(el, '#n2'), 119.5, { dec: 1, suffix: ' M€', dur: 1.2, sound: false }), 0.7),
      (el) => stamp($(el, '#k3'), { rot: 4, quake: 0.4 }),
    ],
  },

  // 4 ─────────────────────────────────────────── TRES FRENOS
  {
    id: 'frenos', theme: 'paper', title: 'Tres frenos', speaker: 'P1', time: '1:55–2:30',
    notes: `"El consumidor choca con tres frenos."
→ "La pastilla parece medicina, y al 37 % de los adultos le cuesta tragarla."
→ "El polvo es de gimnasio: bote, báscula, coctelera."
→ "Y en el pasillo no hay nadie a quien preguntar."
→ "Mientras tanto, más del 70 % de los españoles no llega a la ingesta recomendada de magnesio, zinc o vitamina E. La necesidad existe. Lo que falla es cómo la ofrecemos."`,
    html: `
      <div class="mega abs h" id="h" style="left:90px;top:66px;font-size:140px">TRES FRENOS.</div>
      ${[['LA PASTILLA', '= MEDICINA', 'oct-pink', '<b class="big" id="p37">0 %</b> de los adultos tiene dificultad para tragarla'],
    ['EL POLVO', '= GIMNASIO', 'oct-blue', '<b class="big">1 KG</b> bote · báscula · coctelera'],
    ['EL PASILLO', '= NADIE', 'oct-ink', '<b class="big">0</b> personas a quien preguntar']].map(([a, b, c, cap], i) => `
        <div class="brake abs" style="left:${110 + i * 590}px;top:250px">
          <svg class="skid h" viewBox="0 0 700 120"><path d="M-40 40 C200 44 420 30 640 46"/><path d="M-40 92 C200 96 420 82 640 98"/></svg>
          <div class="oct ${c} h"><svg viewBox="0 0 100 100"><polygon points="30,2 70,2 98,30 98,70 70,98 30,98 2,70 2,30"/></svg><span>${a}</span><b>${b}</b></div>
          <div class="brake-cap h">${cap}</div>
        </div>`).join('')}
      <div class="need abs h" id="need">Y más del <b>70 %</b> no llega a la ingesta recomendada de <b>magnesio, zinc o vitamina E</b>.</div>
      <div class="marker abs h" id="fin" style="left:110px;top:965px;font-size:52px;color:var(--pink)">La necesidad existe. Lo que falla es cómo la ofrecemos.</div>`,
    steps: [
      (el) => misreg($(el, '#h')),
      ...[0, 1, 2].map((i) => (el) => {
        const b = $$(el, '.brake')[i];
        const t = tl()
          .set($(b, '.skid'), { autoAlpha: 1 })
          .call(() => sfx.screech(0.55))
          .fromTo($$(b, '.skid path'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, ease: 'power2.out' })
          .add(stamp($(b, '.oct'), { rot: [-6, 4, -3][i], quake: 0.9 }), 0.35)
          .add(reveal($(b, '.brake-cap')), 0.75);
        if (i === 0) t.add(countUp($(el, '#p37'), 37, { suffix: ' %', dur: 0.9 }), 0.75);
        return t;
      }),
      (el) => tl().add(reveal($(el, '#need'))).add(scrawl($(el, '#fin'), { dur: 1.1 }), 0.6),
    ],
  },

  // 5 ─────────────────────────────────────────── LA IDEA
  {
    id: 'idea', theme: 'paper', title: 'La idea: Puleva Health', speaker: 'P2', time: '2:30–3:15',
    notes: `→ "Así que nos preguntamos: ¿y si el complemento no pareciera ni medicina ni cosa de gimnasio?"
→ "¿Y si fuera algo que ya está en tu nevera, de una marca en la que ya confías, y que te tomas en diez segundos?"
→ (se imprime la portada) "Esto es Puleva Health. Salud que se bebe."  [Destapar los botes]
→ "Complementos naturales en monodosis líquidas. No son medicamentos ni lo pretenden: cada envase lleva solo declaraciones autorizadas por la EFSA. Dos líneas: Daily, para cuidarse cada día, y Active, para rendir."
→ (opcional, una frase) "Y para que salga adelante hay que convencer a tres compradores: al consumidor, al supermercado y a Lactalis."`,
    html: `
      <div class="tear tear-a" style="clip-path:polygon(0 0,941px 0px,950px 49px,909px 92px,912px 166px,974px 229px,1016px 272px,927px 344px,911px 386px,953px 453px,930px 497px,970px 542px,907px 609px,915px 685px,980px 739px,974px 819px,973px 862px,950px 939px,928px 982px,971px 1024px,937px 1072px,938px 1080px,0 1080px)">
        <div class="qs abs" style="left:110px;top:120px;width:1700px">
        <div class="qline h" data-i="0">¿Y SI NO PARECIERA MEDICINA</div>
        <div class="qline h" data-i="1" style="color:var(--pink)">NI COSA DE GIMNASIO?</div>
        <div class="qline h" data-i="2" style="color:var(--blue)">¿Y SI YA ESTUVIERA EN TU NEVERA,</div>
        <div class="qline h" data-i="3" style="color:var(--blue)">DE UNA MARCA EN LA QUE YA CONFÍAS,</div>
        <div class="qline h" data-i="4" style="color:var(--blue)">Y TE LO TOMARAS EN <span class="ten">DIEZ SEGUNDOS</span>?</div>
      </div>
      </div>
      <div class="tear tear-b" style="clip-path:polygon(1920px 0,941px 0px,950px 49px,909px 92px,912px 166px,974px 229px,1016px 272px,927px 344px,911px 386px,953px 453px,930px 497px,970px 542px,907px 609px,915px 685px,980px 739px,974px 819px,973px 862px,950px 939px,928px 982px,971px 1024px,937px 1072px,938px 1080px,1920px 1080px)">
        <div class="qs abs" style="left:110px;top:120px;width:1700px">
        <div class="qline h" data-i="0">¿Y SI NO PARECIERA MEDICINA</div>
        <div class="qline h" data-i="1" style="color:var(--pink)">NI COSA DE GIMNASIO?</div>
        <div class="qline h" data-i="2" style="color:var(--blue)">¿Y SI YA ESTUVIERA EN TU NEVERA,</div>
        <div class="qline h" data-i="3" style="color:var(--blue)">DE UNA MARCA EN LA QUE YA CONFÍAS,</div>
        <div class="qline h" data-i="4" style="color:var(--blue)">Y TE LO TOMARAS EN <span class="ten">DIEZ SEGUNDOS</span>?</div>
      </div>
      </div>
      <div class="cover abs h" id="cover">
        <div class="cover-dots"></div>
        <div class="kick-mono">GRUPO 6 · HACKATHON UGR × LACTALIS PULEVA</div>
        <div class="mega h" id="ph" style="font-size:250px;line-height:.82;color:var(--paper);margin-top:18px">PULEVA<br>HEALTH</div>
        <div class="marker h" id="sq" style="font-size:100px;color:var(--yellow);margin-top:16px">Salud que se bebe.</div>
        <div class="lines2">
          <div class="ln2 h" id="ld"><b>DAILY</b><span>para cuidarse cada día</span></div>
          <div class="ln2 ln2-a h" id="la"><b>ACTIVE</b><span>para rendir</span></div>
        </div>
        <div class="lineup abs">${['care', 'now', 'shield', 'creasnap', 'clearpro'].map((k) => `<img class="h" src="img/${k}.webp">`).join('')}</div>
        <div class="rubber rubber-y abs h" id="r1" style="right:110px;top:90px">NO SON<br>MEDICAMENTOS</div>
        <div class="rubber rubber-y abs h" id="r2" style="right:560px;top:150px;font-size:40px">SOLO DECLARACIONES<br>AUTORIZADAS EFSA</div>
        <div class="buy3 abs h" id="buy3">
          <div class="b3t marker">Para que salga adelante, hay que convencer a tres compradores:</div>
          <div class="b3row">${['Consumidor', 'Supermercado', 'Lactalis'].map((b, i) => `<div class="b3 h"><i>${i + 1}</i>${b}</div>`).join('')}</div>
        </div>
      </div>`,
    steps: [
      () => tl(),
      (el) => { const L = (i) => $$(el, `.qline[data-i="${i}"]`); return tl().add(misreg(L(0), { k: 0.8 })).add(misreg(L(1), { k: 0.8 }), 0.5); },
      (el) => {
        const L = (i) => $$(el, `.qline[data-i="${i}"]`);
        const [t1, t2] = $$(el, '.ten');
        return tl().add(misreg(L(2), { k: 0.8 })).add(misreg(L(3), { k: 0.8 }), 0.5).add(misreg(L(4), { k: 0.8 }), 1)
          .add(mark(t1, 'circle', { color: '#FF48B0', width: 8, pad: 18, seed: 42 }), 1.6)
          .add(mark(t2, 'circle', { color: '#FF48B0', width: 8, pad: 18, seed: 42, sound: false }), 1.6);
      },
      // la página de preguntas se RASGA por la mitad y debajo aparece la portada
      (el) => tl()
        .set($(el, '#cover'), { autoAlpha: 1 })
        .call(() => sfx.rip(0.75))
        .to($(el, '.tear-a'), { x: -18, rotation: -0.6, duration: 0.25, ease: 'power2.out' }, 0)
        .to($(el, '.tear-b'), { x: 18, rotation: 0.6, duration: 0.25, ease: 'power2.out' }, 0)
        .to($(el, '.tear-a'), { x: -1250, y: 140, rotation: -16, duration: 0.9, ease: 'power3.in' }, 0.35)
        .to($(el, '.tear-b'), { x: 1250, y: 90, rotation: 13, duration: 0.9, ease: 'power3.in' }, 0.4)
        .add(misreg($(el, '#ph'), { k: 2.2, dur: 1.2 }), 0.7)
        .add(scrawl($(el, '#sq'), { dur: 1 }), 1.6)
        .call(() => sfx.boom(), null, 0.95),
      (el) => tl()
        .add(gsap.timeline().add($$(el, '.lineup img').map((im, i) => drop(im, { from: -1100, weight: 0.9, quake: 0.25, rot: (i - 2) * 6 }).delay(i * 0.14))))
        .add(stamp($(el, '#r1'), { rot: 8 }))
        .add(stamp($(el, '#r2'), { rot: -5 }), 0.45)
        .add(pop($(el, '#ld')), 0.9).add(pop($(el, '#la'), { freq: 700 }), 1.1),
      (el, ctx) => {
        const cards = $$(el, '.b3');
        const t = tl().add(reveal($(el, '#buy3')));
        cards.forEach((c, i) => t.add(stamp(c, { rot: [-3, 2, -2][i], quake: 0.3 }), 0.3 + i * 0.3));
        // las tres tarjetas vuelan al marcador de la esquina, que se queda toda la presentación
        t.to(cards, { x: (i) => 640 - i * 380 + i * 30, y: -760, scale: 0.28, autoAlpha: 0, duration: 0.8, ease: 'power3.in', stagger: 0.08 }, '+=1.3')
          .to($(el, '.b3t'), { autoAlpha: 0, duration: 0.3 }, '<')
          .to($(el, '#buy3'), { autoAlpha: 0, duration: 0.4 }, '>-0.2')
          .call(() => { ctx.stage.querySelector('#buyers').classList.add('on'); sfx.pop(800); }, null, '>-0.1');
        return t;
      },
    ],
  },

  // 6 ─────────────────────────────────────────── DAILY (Carmen)
  {
    id: 'daily', theme: 'paper', title: 'Daily · para Carmen', speaker: 'P2', time: '3:15–4:15', buyers: [true, 0],
    notes: `"Volvamos con Carmen."  [coger cada bote al nombrarlo]
→ NOW: "Su shot es Now: magnesio, teanina y vitaminas B6 y B12, que ayudan a disminuir el cansancio. El shot que sustituye al segundo café."
→ CARE: "Care, la piel desde dentro, con vitaminas C y E y zinc."
→ SHIELD: "Y Shield, la defensa natural de la leche: lactoferrina, zinc y vitaminas C y D para el otoño."
→ "Packs de seis en la nevera de lácteos, junto a la leche que ya compra, a poco más de un euro el shot: menos que un café en la barra."`,
    html: `${DEFS}
      <div class="marker abs h" id="k" style="left:110px;top:60px;font-size:50px;color:var(--pink)">Volvamos con Carmen.</div>
      <div class="mega abs h" id="h" style="left:110px;top:120px;font-size:96px">DAILY <span style="color:var(--blue)">· CUIDARSE CADA DÍA</span></div>
      <div class="album abs" style="left:110px;top:260px;width:1700px">
        ${card('now', 1)}${card('care', 2)}${card('shield', 3)}
      </div>
      <div class="sticker s-blue abs h" id="pk" style="left:110px;top:880px;max-width:900px;width:900px"><b>PACK DE 6</b><span>en la nevera de lácteos, junto a la leche que ya compra</span></div>
      <div class="rubber abs h" id="cafe" style="left:1180px;top:870px;font-size:52px">MENOS QUE UN CAFÉ<br>EN LA BARRA</div>`,
    steps: [
      (el) => tl().add(scrawl($(el, '#k'))).add(misreg($(el, '#h')), 0.4),
      (el) => slapCard(el, 'now'),
      (el) => slapCard(el, 'care'),
      (el) => slapCard(el, 'shield'),
      (el) => tl().add(pop($(el, '#pk'))).add(stamp($(el, '#cafe'), { rot: -6 }), 0.5),
    ],
  },

  // 7 ─────────────────────────────────────────── ACTIVE (Álex) + plano 3D del Crea-Snap
  {
    id: 'active', theme: 'paper', title: 'Active · para Álex (Crea-Snap)', speaker: 'P2', time: '4:15–5:15', buyers: [true, 0],
    notes: `"Ahora Álex."  [coger Crea-Snap]
→ "La creatina tiene un problema: disuelta en agua se degrada y deja de servir. Por eso casi no existe creatina lista para beber."
→ (se despiezan nuestras piezas reales) "Nuestra solución es guardarla en el tapón."
→ DEMO en vivo, máx. 15 s: pulsar el tapón y agitar. Pulsa → a la vez y el plano hace lo mismo (es el plan B si la demo falla).
   "Pulsas, agitas y bebes. Tres gramos activos, siempre. Pulsa, agita, entrena."
→ CLEARPRO: "Y ClearPro: 20 gramos de proteína con textura de zumo, hecha con suero de Lactalis Ingredients, por menos de la mitad que un batido de referencia."
→ "Y aquí vuelve la madre de Álex. Lo que le daba miedo no era la creatina, era un bote de polvo de una marca que no conocía. Cuando lo que ve es un botellín de Puleva junto a la leche, la conversación cambia."  (sello: CONSUMIDOR ✓)`,
    html: `${DEFS}
      <div class="bp-panel abs" id="bp">
        <div class="bp-grid"></div>
        <div class="bp-head">CREA-SNAP · 80 ML · PLANO Nº 7 · PIEZAS REALES IMPRESAS EN 3D</div>
        <div class="bp-canvas" id="bpc"></div>
        <div class="bp-labels" id="bpl"></div>
        <div class="bp-stamp h" id="bps">PULSA · AGITA · ENTRENA</div>
      </div>
      <div class="abs" style="left:1110px;top:110px;width:740px">
        <div class="marker h" id="k" style="font-size:50px;color:var(--pink)">Ahora, Álex.</div>
        <div class="mega h" id="h" style="font-size:96px;margin-top:4px">ACTIVE <span style="color:var(--blue)">· RENDIR</span></div>
      </div>
      <div class="swap abs" style="left:1110px;top:330px;width:740px">
        <div class="say h" id="s1">Disuelta en agua, la creatina <b>se degrada</b> y deja de servir. Por eso <span id="nolista">casi no existe creatina lista para beber</span>.</div>
        <div class="say h" id="s2">Nuestra solución:<br><b class="hl">guardarla en el tapón.</b></div>
        <div class="say h" id="s3"><span class="slam h">PULSAS.</span><span class="slam h" style="color:var(--pink)">AGITAS.</span><span class="slam h" style="color:var(--blue)">BEBES.</span><small>3 g de creatina activos, siempre.</small></div>
        <div class="say h" id="s5">${bubble('<s>«Eso son polvos…»</s>', 'left', 'bubble-old')}<div class="marker newline">Un botellín de Puleva junto a la leche:<br><span style="color:var(--pink)">la conversación cambia.</span></div></div>
      </div>
      <div class="cp abs h" id="cp">
        <img src="img/clearpro.webp">
        <div><b>CLEARPRO</b><span>20 g de proteína con textura de zumo · suero de Lactalis Ingredients</span>
          <div class="vs"><i style="width:${(2.19 / 4) * 100}%"></i><em>2,19 €</em></div>
          <div class="vs vs-ref"><i style="width:100%"></i><em>4 € batido de referencia</em></div></div>
      </div>`,
    init(el, ctx) {
      try { ctx.bp = createBlueprint($(el, '#bpc'), $(el, '#bpl')); } catch (e) { console.warn(e); ctx.bp = null; }
      return () => ctx.bp && ctx.bp.destroy();
    },
    steps: [
      (el, ctx) => { const t = tl().add(scrawl($(el, '#k'))).add(misreg($(el, '#h')), 0.3); if (ctx.bp) t.add(ctx.bp.intro(), 0.2); return t; },
      (el) => tl().add(reveal($(el, '#s1'))).add(mark($(el, '#nolista'), 'underline', { color: '#FF48B0', width: 7, pad: 6 }), 0.5),
      (el, ctx) => { const t = tl().to($(el, '#s1'), { autoAlpha: 0, y: -30, duration: 0.3 }).add(misreg($(el, '#s2'))); if (ctx.bp) t.add(ctx.bp.explode(), 0.1); return t; },
      (el, ctx) => {
        const t = tl().to($(el, '#s2'), { autoAlpha: 0, y: -30, duration: 0.3 }).set($(el, '#s3'), { autoAlpha: 1 });
        if (ctx.bp) t.add(ctx.bp.assembleAndPress(), 0.1);
        $$(el, '#s3 .slam').forEach((s, i) => t.fromTo(s, { autoAlpha: 0, scale: 2.4 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: 'power4.in', onComplete: () => { sfx.stamp(); } }, [1.6, 2.2, 3.4][i]));
        t.from($(el, '#s3 small'), { autoAlpha: 0, duration: 0.4 }, 3.8);
        t.add(stamp($(el, '#bps'), { rot: -4, quake: 0.5 }), 3.9);
        return t;
      },
      (el) => tl().add(drop($(el, '#cp'), { from: -900, weight: 1.1 }))
        .from($$(el, '#cp .vs i'), { width: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }, 0.7),
      (el, ctx) => tl().to($(el, '#s3'), { autoAlpha: 0, duration: 0.3 })
        .add(pop($(el, '#s5')))
        .add(scrawl($(el, '#s5 .newline'), { dur: 1.2 }), 0.4)
        .add(ctx.stampBuyer(0), 1.8),
    ],
  },

  // 8 ─────────────────────────────────────────── POR QUÉ PULEVA
  {
    id: 'porque', theme: 'paper', title: 'Por qué Puleva', speaker: 'P3', time: '5:15–6:00', buyers: [true, 1],
    notes: `"¿Por qué Puleva y no otro? Porque solo Puleva reúne tres cosas a la vez."
→ "Confianza: está entre las diez marcas más elegidas por los hogares españoles."
→ "Industria: formular, envasar y distribuir líquidos en frío a escala nacional, justo lo que un laboratorio o una marca online no saben hacer."
→ "Y ciencia láctea: el suero de Lactalis Ingredients, la lactoferrina de la leche y el Instituto Puleva de Nutrición."
→ (mapa) "Los laboratorios tienen aval, pero venden pastillas. Las marcas online venden polvo por paquetería. La marca blanca compite en precio."
→ (X) "El hueco de confianza + listo para tomar está vacío."`,
    html: `
      <div class="mega abs h" id="h" style="left:110px;top:70px;font-size:92px">¿POR QUÉ PULEVA <span style="color:var(--pink)">Y NO OTRO?</span></div>
      <div class="keys abs" style="left:110px;top:240px;width:600px">
        ${[['CONFIANZA', 'entre las 10 marcas más elegidas por los hogares españoles'], ['INDUSTRIA', 'formular, envasar y distribuir líquidos en frío a escala nacional'], ['CIENCIA LÁCTEA', 'suero de Lactalis Ingredients · lactoferrina · Instituto Puleva de Nutrición']].map(([a, b], i) => `
          <div class="key h"><i>${i + 1}</i><b>${a}</b><span>${b}</span></div>`).join('')}
      </div>
      <div class="map abs h" id="map">
        <svg viewBox="0 0 1000 720" class="map-svg">
          <path id="ax" d="M70 660 L960 660" class="map-ax"/><path id="ay" d="M70 660 L70 40" class="map-ax"/>
          <text x="960" y="702" text-anchor="end" class="map-t">listo para tomar →</text>
          <text x="40" y="40" class="map-t" transform="rotate(-90 40 40)" text-anchor="end">confianza →</text>
          <path id="route" d="M120 620 C260 600 300 470 430 470 S620 380 700 300 S790 170 830 150" class="map-route"/>
          <g id="xm"><path d="M800 120 L860 180 M860 120 L800 180" class="map-x"/></g>
        </svg>
        <div class="rival h" style="left:110px;top:120px">Laboratorios<small>aval, pero pastillas</small></div>
        <div class="rival h" style="left:380px;top:390px">Marcas online<small>polvo por paquetería</small></div>
        <div class="rival h" style="left:120px;top:520px">Marca blanca<small>compite en precio</small></div>
        <div class="marker h" id="nadie" style="position:absolute;left:600px;top:10px;font-size:40px;color:var(--pink)">aquí no hay nadie</div>
        <div class="badge h" id="badge">PULEVA<br>HEALTH</div>
      </div>`,
    steps: [
      (el) => misreg($(el, '#h')),
      ...[0, 1, 2].map((i) => (el) => stamp($$(el, '.key')[i], { rot: [-2, 1.5, -1][i], quake: 0.3 })),
      (el) => {
        const t = tl().add(tapeOn($(el, '#map'), { rot: 1.5 }))
          .fromTo([$(el, '#ax'), $(el, '#ay')], { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.7 }, 0.3);
        $$(el, '.rival').forEach((r, i) => t.add(drop(r, { from: -500, weight: 0.6, quake: 0.15 }), 0.8 + i * 0.25));
        return t;
      },
      (el) => tl()
        .call(() => sfx.scribble(1.4))
        .fromTo($(el, '#route'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.3, ease: 'power1.inOut' })
        .fromTo($$(el, '#xm path'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.25, stagger: 0.2 })
        .add(scrawl($(el, '#nadie')), '-=0.2')
        .add(drop($(el, '#badge'), { from: -900, weight: 1.6, quake: 1 }), '+=0.4')
        .call(() => sfx.ding()),
    ],
  },

  // 9 ─────────────────────────────────────────── CONVENCER AL SÚPER
  {
    id: 'super', theme: 'paper', title: 'Convencer al supermercado', speaker: 'P3', time: '6:00–7:00', buyers: [true, 1],
    notes: `"Para llegar a Carmen y a Álex, antes hay que convencer al supermercado. Y le damos lo que hoy no tiene."
→ (ticket) "Rotación, porque Daily se recompra cada semana. Tráfico, con un millón al año en televisión y redes, con embajadores como Roberto Leal y SofiG. Un 30 % de margen. Y una categoría que hoy se le escapa a internet."
→ (plano) "Estaremos en tres puntos de la tienda: la nevera de lácteos, un módulo en el pasillo de suplementos y neveras de caja para la compra por impulso, además de neveras en gimnasios."
→ (sellos) "Farmacia y e-commerce, descartados a propósito: no somos un medicamento, y un líquido refrigerado no se manda por paquetería."
→ (calendario) "Daily se lanza en septiembre, cuando sube la preocupación por las defensas. Active, en marzo, con la temporada de deporte."  (sello: SÚPER ✓)`,
    html: `
      <div class="mega abs h" id="h" style="left:110px;top:60px;font-size:110px">CONVENCER <span style="color:var(--pink)">AL SÚPER.</span></div>
      <div class="printer abs" style="left:110px;top:210px"><div class="slot-p"></div></div>
      <div class="ticket abs" id="tk" style="left:140px;top:236px">
        <div class="tk-in">
          <div class="tk-l tk-c">SUPERMERCADO</div><div class="tk-l tk-c">LO QUE GANA CON PULEVA HEALTH</div><div class="tk-l">--------------------------------</div>
          <div class="tk-l"><b>ROTACIÓN</b><span>semanal</span></div><div class="tk-s">Daily se recompra cada semana</div>
          <div class="tk-l"><b>TRÁFICO</b><span>1 M€/año</span></div><div class="tk-s">TV y redes, con embajadores como Roberto Leal y SofiG*</div>
          <div class="tk-l"><b>MARGEN</b><span>30 %</span></div>
          <div class="tk-l"><b>CATEGORÍA NUEVA</b><span>sí</span></div><div class="tk-s">la venta que hoy se le escapa a internet</div>
          <div class="tk-l">--------------------------------</div>
          <div class="tk-l tk-tot"><b>TOTAL</b><span>UN SÍ</span></div>
          <div class="tk-s">* sujeto a negociación</div>
          <div class="tk-bar"></div>
        </div>
      </div>
      <div class="store abs h" id="store">
        <div class="aisle" style="left:60px;top:70px;width:440px"></div><div class="aisle" style="left:60px;top:190px;width:440px"></div><div class="aisle" style="left:60px;top:310px;width:440px"></div>
        <div class="fridge-row">NEVERA DE LÁCTEOS</div>
        <div class="tills"><span></span><span></span><span></span></div>
        <div class="pin h" style="left:400px;top:130px"><i>1</i><b>Nevera de lácteos</b><small>Daily, junto a la leche</small></div>
        <div class="pin h" style="left:150px;top:250px"><i>2</i><b>Pasillo de suplementos</b><small>módulo Puleva Health</small></div>
        <div class="pin h" style="left:170px;top:440px"><i>3</i><b>Cajas</b><small>neveras de impulso</small></div>
        <div class="gym h" id="gym">+ neveras en gimnasios</div>
        <div class="store-t">PLANO DE TIENDA</div>
      </div>
      <div class="nope abs h" style="left:760px;top:830px" id="x0"><b>FARMACIA</b><span>no somos un medicamento</span><em class="rubber rubber-sm h">DESCARTADO</em></div>
      <div class="nope abs h" style="left:1130px;top:830px" id="x1"><b>E-COMMERCE</b><span>un líquido refrigerado no se manda por paquetería</span><em class="rubber rubber-sm h">DESCARTADO</em></div>
      <div class="cal abs h" id="c1" style="left:1560px;top:230px"><div class="cal-r"></div><b>SEPT.</b><span>lanza DAILY</span><small>sube la preocupación por las defensas</small></div>
      <div class="cal abs h" id="c2" style="left:1560px;top:520px"><div class="cal-r"></div><b>MARZO</b><span>lanza ACTIVE</span><small>temporada de deporte</small></div>`,
    steps: [
      (el) => misreg($(el, '#h')),
      (el) => {
        const lines = $$(el, '.tk-in > *');
        const t = tl().call(() => sfx.printer(lines.length, 0.13));
        t.fromTo($(el, '#tk'), { height: 0 }, { height: $(el, '.tk-in').offsetHeight, duration: lines.length * 0.13, ease: 'steps(' + lines.length + ')' }, 0);
        t.from(lines, { opacity: 0, duration: 0.01, stagger: 0.13 }, 0);
        t.add(mark($(el, '.tk-tot span'), 'circle', { color: '#FF48B0', width: 5, pad: 12 }), '+=0.1');
        return t;
      },
      (el) => {
        const t = tl().add(tapeOn($(el, '#store'), { rot: -1 }));
        $$(el, '.pin').forEach((p, i) => t.add(drop(p, { from: -400, weight: 0.5, quake: 0.1 }), 0.4 + i * 0.3));
        t.add(pop($(el, '#gym')), 1.5);
        return t;
      },
      (el) => {
        const t = tl();
        ['#x0', '#x1'].forEach((s, i) => { t.add(reveal($(el, s)), i * 0.5); t.add(stamp($(el, `${s} .rubber`), { rot: -10, quake: 0.4 }), i * 0.5 + 0.35); });
        return t;
      },
      (el, ctx) => tl()
        .add(drop($(el, '#c1'), { from: -800, weight: 0.8 })).add(drop($(el, '#c2'), { from: -800, weight: 0.8 }), 0.3)
        .call(() => sfx.tear(), null, 1)
        .add(ctx.stampBuyer(1), 1.4),
    ],
  },

  // 10 ─────────────────────────────────────────── CONVENCER A LACTALIS
  {
    id: 'lactalis', theme: 'graph', title: 'Convencer a Lactalis', speaker: 'P1', time: '7:00–8:15', buyers: [true, 2],
    notes: `"Y por último, convencer a Lactalis. Con números prudentes. Invertimos 3 millones al año: dos en comercial y uno en medios."
→ (barras) "Con una cuota que pasa del 4 al 13 %, la venta neta llega a 15,1 millones en el año 3…"
→ (línea) "…el EBITDA es positivo ese mismo año y el equilibrio mensual llega en el mes 29."
→ (pósit amarillo) "No os vamos a vender un pelotazo. El margen es ajustado, como en todo el sector lácteo, y la inversión se recupera hacia el año 7, lo habitual al crear una categoría nueva en gran consumo."
→ (pósit rosa) "Y sabemos qué tiene que salir bien: fabricar Daily en planta propia. Con maquilador no es viable."
→ (deslizador 13 → 15 %) "Con un 15 % de cuota, el EBITDA del año 3 se triplica."
   El deslizador se puede tocar con el ratón si preguntan por la sensibilidad (11 / 13 / 15 %).`,
    html: `
      <div class="mega abs h" id="h" style="left:110px;top:60px;font-size:100px">CONVENCER <span style="color:var(--pink)">A LACTALIS.</span></div>
      <div class="marker abs h" id="k" style="left:115px;top:165px;font-size:44px;color:var(--blue)">con números prudentes</div>
      <div class="chip abs h" id="ch1" style="left:640px;top:168px"><b>3 M€ / año</b> = 2 comercial + 1 medios</div>
      <div class="chip abs h" id="ch2" style="left:1190px;top:168px">cuota <b>4 % → 8 % → 13 %</b></div>
      <svg class="abs" viewBox="0 0 1000 660" style="left:110px;top:290px;width:1000px;height:660px;overflow:visible" id="chart">
        <line x1="40" y1="430" x2="980" y2="430" stroke="#16163A" stroke-width="4"/>
        ${[[200, 3.78, 'Año 1'], [500, 8.47, 'Año 2'], [800, 15.13, 'Año 3']].map(([x, v, y]) => `
          <g class="stack" data-v="${v}">${Array.from({ length: Math.ceil(v) }, (_, b) => { const hgt = Math.min(1, v - b) * 24; return `<g class="brick h"><rect x="${x - 95}" y="${430 - b * 24 - hgt}" width="190" height="${Math.max(2, hgt - 2)}" fill="#fff" stroke="#1F3FBF" stroke-width="3"/>${hgt > 16 ? `<rect x="${x - 95}" y="${430 - b * 24 - hgt}" width="190" height="6" fill="#1F3FBF"/><rect x="${x + 60}" y="${430 - b * 24 - hgt + 9}" width="22" height="${hgt - 14}" fill="#FF48B0" opacity=".8"/>` : ''}</g>`; }).join('')}</g>
          <text class="bv h" x="${x}" y="${430 - v * 24 - 18}" text-anchor="middle" data-v="${v}">0</text>
          <text class="yl" x="${x}" y="640" text-anchor="middle">${y}</text>`).join('')}
        <defs><pattern id="hatchB" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="5" height="12" fill="#1F3FBF" opacity=".55"/></pattern></defs>
        <path id="eb" class="h" d="M200 538 L500 482 L800 422" fill="none" stroke="#FF48B0" stroke-width="9" stroke-linecap="round"/>
        ${[[200, 538, '−2,69'], [500, 482, '−1,29'], [800, 422, '+0,20']].map(([x, y, v]) => `<g class="ebp" opacity="0"><circle cx="${x}" cy="${y}" r="13" fill="#FF48B0"/><text x="${x + 20}" y="${y + 46}" class="ebv">${v}</text></g>`).join('')}
        <text x="40" y="20" class="lg">VENTA NETA (1 brick = 1 M€) · <tspan fill="#FF48B0">EBITDA (M€)</tspan></text>
      </svg>
      <div class="abs" id="m29" style="left:${110 + 772 - 30}px;top:${290 + 430 - 30}px;width:60px;height:60px"></div>
      <div class="flipcal abs h" id="fc" style="left:1010px;top:640px"><div class="fc-top">MES</div><b id="fcn">1</b><div class="fc-ok h" id="fco">EQUILIBRIO</div></div>
      <div class="postit p-yellow abs h" id="pi1" style="left:1250px;top:250px"><b>NO ES UN PELOTAZO.</b>Margen ajustado, como en todo el sector lácteo. La inversión se recupera hacia el <em>año 7</em>: lo habitual al crear una categoría.</div>
      <div class="postit p-pink abs h" id="pi2" style="left:1270px;top:500px"><b>LO QUE TIENE QUE SALIR BIEN:</b>fabricar Daily en <em>planta propia</em>. Con maquilador, no es viable.</div>
      <div class="slider abs h interactive" id="sl" style="left:1230px;top:730px">
        <div class="sl-t">Cuota en el año 3 → EBITDA del año 3</div>
        <div class="sl-track"><div class="sl-fill"></div>${[11, 13, 15].map((v) => `<button class="sl-stop" data-v="${v}">${v} %</button>`).join('')}<div class="sl-knob"></div></div>
        <div class="sl-out"><b id="slv">+202,6 k€</b><span id="slx"></span></div>
      </div>`,
    init(el) {
      const map = { 11: -254.7, 13: 202.6, 15: 659.9 };
      const pos = { 11: 0, 13: 50, 15: 100 };
      const o = { v: 202.6 };
      const set = (q, dur = 0.8) => {
        gsap.to($(el, '.sl-knob'), { left: `${pos[q]}%`, duration: dur, ease: 'back.out(1.6)' });
        gsap.to($(el, '.sl-fill'), { width: `${pos[q]}%`, duration: dur });
        gsap.to(o, { v: map[q], duration: dur, ease: 'power2.out', onUpdate: () => { $(el, '#slv').textContent = `${o.v > 0 ? '+' : '−'}${Math.abs(o.v).toFixed(1).replace('.', ',')} k€`; $(el, '#slv').classList.toggle('neg', o.v < 0); } });
        $(el, '#slx').textContent = q === 15 ? '× 3' : q === 11 ? 'el equilibrio se retrasa al año 4' : 'caso base';
        sfx.tick(1200 + q * 40, 0.15);
      };
      el._setQuota = set;
      $$(el, '.sl-stop').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); sfx.unlock(); set(+b.dataset.v); }));
    },
    steps: [
      (el) => tl().add(misreg($(el, '#h'))).add(scrawl($(el, '#k')), 0.5).add(pop($(el, '#ch1')), 0.8).add(pop($(el, '#ch2'), { freq: 640 }), 1),
      (el) => {
        const t = tl();
        let at = 0;
        $$(el, '.stack').forEach((st, i) => {
          const bricks = $$(st, '.brick');
          bricks.forEach((b, j) => {
            t.fromTo(b, { autoAlpha: 1, y: -620 }, { y: 0, duration: 0.32, ease: 'power2.in' }, at);
            t.call(() => sfx.tick(500 + j * 70, 0.16), null, at + 0.32);
            at += 0.055;
          });
          t.add(countUp($$(el, '.bv')[i], +$$(el, '.bv')[i].dataset.v, { dec: 2, dur: 0.6, sound: false }), at + 0.2);
          at += 0.25;
        });
        return t;
      },
      (el) => {
        const o = { m: 1 };
        let last = 1;
        return tl().set($(el, '#eb'), { autoAlpha: 1 })
          .fromTo($(el, '#eb'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.3 })
          .to($$(el, '.ebp'), { opacity: 1, duration: 0.2, stagger: 0.45 }, 0)
          .add(mark($(el, '#m29'), 'circle', { color: '#FF48B0', width: 6, pad: 10 }))
          .add(pop($(el, '#fc')), '-=0.2')
          // el calendario pasa hoja a hoja, cada vez más rápido, hasta el mes 29
          .to(o, { m: 29, duration: 2.2, ease: 'power2.in', onUpdate: () => {
            const m = Math.round(o.m);
            if (m !== last) { last = m; $(el, '#fcn').textContent = m; sfx.tick(900 + m * 25, 0.12); gsap.fromTo($(el, '#fcn'), { rotationX: -70 }, { rotationX: 0, duration: 0.12 }); }
          } })
          .add(stamp($(el, '#fco'), { rot: -8, quake: 0.5 }));
      },
      (el) => tapeOn($(el, '#pi1'), { rot: -3 }),
      (el) => tapeOn($(el, '#pi2'), { rot: 2.5 }),
      (el) => tl().add(pop($(el, '#sl'))).call(() => el._setQuota(13, 0.01)).call(() => el._setQuota(15, 1.2), null, '+=0.7'),
    ],
  },

  // 11 ─────────────────────────────────────────── LA UNIDAD
  {
    id: 'unidad', theme: 'paper', title: 'Quién lo lleva', speaker: 'P1', time: '8:15–8:45', buyers: [true, 2],
    notes: `→ "Para llevarlo, una unidad de negocio con cuenta de resultados propia y cuatro perfiles: regulatorio y científico, KAM de gran distribución, brand manager y un tecnólogo de bebidas de la propia plantilla de I+D. El talento nuevo, de la UGR."
→ (sello: LACTALIS ✓)`,
    html: `
      <div class="mega abs h" id="h" style="left:110px;top:60px;font-size:110px">¿QUIÉN <span style="color:var(--pink)">LO LLEVA?</span></div>
      <svg class="abs h" id="orgs" viewBox="0 0 1700 300" style="left:110px;top:440px;width:1700px;height:300px;overflow:visible">
        <path class="org" d="M850 0 V80 M212 80 H1488 M212 80 V150 M637 80 V150 M1062 80 V150 M1488 80 V150"/>
      </svg>
      <div class="unit abs h" id="u" style="left:560px;top:250px"><b>UNIDAD PULEVA HEALTH</b><span>cuenta de resultados propia</span></div>
      ${[['Regulatorio y científico', 'claims, AESAN, evidencia'], ['KAM gran distribución', 'centrales de compra'], ['Brand manager', 'marca, embajadores, redes'], ['Tecnólogo de bebidas', 'de la plantilla de I+D']].map(([a, b], i) => `
        <div class="role abs h" style="left:${110 + i * 425 - 100 + 112}px;top:600px"><b>${a}</b><span>${b}</span></div>`).join('')}
      <div class="marker abs h" id="ugr" style="left:110px;top:880px;font-size:60px;color:var(--blue)">Y el talento nuevo, de la UGR.</div>`,
    steps: [
      (el) => misreg($(el, '#h')),
      (el, ctx) => {
        const t = tl().add(stamp($(el, '#u'), { rot: -1, quake: 0.4 }))
          .set($(el, '#orgs'), { autoAlpha: 1 }, 0.3)
          .fromTo($(el, '.org'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.8 }, 0.3);
        $$(el, '.role').forEach((r, i) => t.add(pop(r, { freq: 500 + i * 100 }), 0.9 + i * 0.18));
        t.add(scrawl($(el, '#ugr')), 1.8);
        t.add(ctx.stampBuyer(2), 2.8);
        return t;
      },
    ],
  },

  // 12 ─────────────────────────────────────────── UN MARTES POR LA MAÑANA
  {
    id: 'martes', theme: 'paper', title: 'Un martes por la mañana', speaker: 'P2', time: '8:45–9:30', buyers: [true, 3],
    notes: `"Volvamos a casa de Álex y Carmen."
→ "Un martes por la mañana, Carmen se toma su Now antes de salir."
→ "Álex mete un Crea-Snap en la mochila."
→ "Y en la nevera, junto a la leche de siempre, está Shield para el invierno."
→ "Nadie ha tomado una pastilla. Nadie ha pesado polvos. Solo han abierto la nevera."
→ (portada final) "Puleva lleva toda la vida en esa nevera. Puleva Health es la forma de que, además de alimentar, cuide. Salud que se bebe. Gracias."
→ (opcional) el spot corto a pantalla completa.`,
    html: `${DEFS}
      <div class="strip-t abs h" id="st">UN MARTES POR LA MAÑANA</div>
      <div class="comic abs h" id="c1" style="left:90px"><div class="cap">07:45 · Carmen se toma su <b>Now</b> antes de salir.</div>
        <div class="cw" style="left:20px;bottom:0;width:380px">${carmen()}</div><img class="cp-prod" src="img/now.webp" style="right:60px;bottom:40px;height:300px"></div>
      <div class="comic abs h" id="c2" style="left:670px"><div class="cap">Álex mete un <b>Crea-Snap</b> en la mochila.</div>
        <div class="cw" style="left:10px;bottom:0;width:360px">${alex()}</div>
        <div class="bag"></div><img class="cp-prod" id="cs" src="img/creasnap.webp" style="right:80px;bottom:110px;height:200px"></div>
      <div class="comic comic-fr abs h" id="c3" style="left:1250px"><div class="cap">Y en la nevera, junto a la leche de siempre: <b>Shield</b>.</div>
        <div class="shelf-c"></div><div class="abs" style="left:90px;bottom:120px;width:120px">${milk()}</div><img class="cp-prod" src="img/shield.webp" style="left:270px;bottom:120px;height:250px"></div>
      <div class="nobody abs" style="left:90px;top:800px;width:1740px">
        <span class="h">Nadie ha tomado una pastilla.</span><span class="h">Nadie ha pesado polvos.</span><span class="h" style="color:var(--pink)">Solo han abierto la nevera.</span>
      </div>
      <div class="cover abs h" id="end">
        <div class="cover-dots"></div>
        <div class="marker h" id="e0" style="font-size:44px;color:var(--paper);opacity:.85">Puleva lleva toda la vida en esa nevera.</div>
        <div class="mega h" id="e1" style="font-size:260px;line-height:.82;color:var(--paper);margin-top:30px">PULEVA<br>HEALTH</div>
        <div class="marker h" id="e2" style="font-size:96px;color:var(--yellow)">Salud que se bebe.</div>
        <div class="lineup lineup-xl abs">${['care', 'now', 'shield', 'creasnap', 'clearpro'].map((k) => `<img class="h" src="img/${k}.webp">`).join('')}</div>
        <div class="thx h" id="e3"><b>GRACIAS.</b><span>Grupo 6 · David Bacas Posadas · Ismael Sallami Moreno · Jesús Rodríguez González</span></div>
      </div>
      <div class="vid abs h" id="vid"><video src="img/spot10.mp4" poster="img/spot10.jpg" playsinline preload="auto"></video></div>`,
    init(el) { return () => { const v = $(el, 'video'); if (v) v.pause(); }; },
    steps: [
      (el) => tl().add(stamp($(el, '#st'), { rot: -1.5, quake: 0.3 })),
      (el) => tapeOn($(el, '#c1'), { rot: -1.5 }),
      (el) => tl().add(tapeOn($(el, '#c2'), { rot: 1.2 })).from($(el, '#cs'), { y: -260, rotation: -30, duration: 0.7, ease: 'bounce.out' }, 0.4).call(() => sfx.thud(0.6), null, 0.8),
      (el) => tapeOn($(el, '#c3'), { rot: -1 }),
      (el) => { const s = $$(el, '.nobody span'); const t = tl(); s.forEach((x, i) => t.add(misreg(x, { k: 0.7 }), i * 0.9)); return t; },
      (el) => tl()
        .call(() => sfx.roller(0.9))
        .fromTo($(el, '#end'), { autoAlpha: 1, clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'power2.inOut' })
        .add(scrawl($(el, '#e0')), 0.8)
        .add(misreg($(el, '#e1'), { k: 2.2, dur: 1.1 }), 1.5)
        .add(scrawl($(el, '#e2'), { dur: 1 }), 2.4)
        .add(gsap.timeline().add($$(el, '#end .lineup img').map((im, i) => drop(im, { from: -1200, weight: 0.9, quake: 0.3 }).delay(i * 0.15))), 1.2)
        .add(stamp($(el, '#e3'), { rot: -2, quake: 0.6 }), 3.6)
        .call(() => sfx.ding(784), null, 3.9)
        .call(() => confetti(el), null, 3.8),
      (el, ctx) => {
        const v = $(el, 'video');
        return tl().fromTo($(el, '#vid'), { autoAlpha: 0, scale: 0.6, rotation: -6 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.7, ease: 'back.out(1.4)' })
          .call(() => { if (!ctx.rewinding) { v.currentTime = 0; v.muted = sfx.muted; v.play().catch(() => {}); } });
      },
    ],
  },
];
