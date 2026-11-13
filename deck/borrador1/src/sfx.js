// Motor de sonido 100 % sintetizado con Web Audio: sin ficheros, sin latencia.
// Cada efecto está pensado para "sonar a objeto": un bote que cae, leche que se vierte, un tapón que encaja.

class Sfx {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.muted = false;      // silencio pedido por el usuario (tecla M)
    this.silent = 0;         // silencio temporal mientras se "rebobina" una diapositiva
    this.noise = null;
    this.loops = new Set();
  }

  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.9;
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 4;
      this.master.connect(comp).connect(this.ctx.destination);
      const len = this.ctx.sampleRate * 2;
      this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = this.noise.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      // reverb corta para dar "sala"
      this.verb = this.ctx.createConvolver();
      const irLen = this.ctx.sampleRate * 1.4;
      const ir = this.ctx.createBuffer(2, irLen, this.ctx.sampleRate);
      for (let c = 0; c < 2; c++) {
        const ch = ir.getChannelData(c);
        for (let i = 0; i < irLen; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / irLen, 3);
      }
      this.verb.buffer = ir;
      this.verbGain = this.ctx.createGain();
      this.verbGain.gain.value = 0.18;
      this.verb.connect(this.verbGain).connect(this.master);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  get on() { return this.ctx && !this.muted && this.silent === 0; }

  out(wet = false) {
    const g = this.ctx.createGain();
    g.connect(this.master);
    if (wet) g.connect(this.verb);
    return g;
  }

  noiseSrc(loop = false) {
    const s = this.ctx.createBufferSource();
    s.buffer = this.noise;
    s.loop = loop;
    return s;
  }

  env(g, t, a, peak, d, end = 0.0001) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(end, t + a + d);
  }

  // ---------- EFECTOS ----------

  // Bote que cae en seco sobre la mesa
  thud(weight = 1) {
    if (!this.on) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.out(true);
    o.type = 'sine';
    o.frequency.setValueAtTime(150 / weight, t);
    o.frequency.exponentialRampToValueAtTime(42 / weight, t + 0.22);
    this.env(g, t, 0.004, 0.9 * Math.min(weight, 1.3), 0.35 * weight);
    o.connect(g); o.start(t); o.stop(t + 0.6 * weight);
    // golpe de plástico
    const n = this.noiseSrc();
    const f = this.ctx.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = 900 / weight; f.Q.value = 1.2;
    const g2 = this.out();
    this.env(g2, t, 0.002, 0.5, 0.09);
    n.connect(f).connect(g2); n.start(t); n.stop(t + 0.2);
  }

  // Golpe muy pesado (bote de 1 kg de polvo)
  heavy() {
    this.thud(1.7);
    if (!this.on) return;
    const t = this.ctx.currentTime;
    const n = this.noiseSrc();
    const f = this.ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.setValueAtTime(1800, t); f.frequency.exponentialRampToValueAtTime(200, t + 0.8);
    const g = this.out(true);
    this.env(g, t, 0.01, 0.35, 0.9);
    n.connect(f).connect(g); n.start(t); n.stop(t + 1.1);
  }

  // Rebote ligero
  tick(freq = 1800, vol = 0.18) {
    if (!this.on) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.out();
    o.type = 'triangle'; o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(freq * 0.6, t + 0.05);
    this.env(g, t, 0.001, vol, 0.06);
    o.connect(g); o.start(t); o.stop(t + 0.1);
  }

  pop(freq = 520) {
    if (!this.on) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.out(true);
    o.type = 'sine';
    o.frequency.setValueAtTime(freq * 0.5, t);
    o.frequency.exponentialRampToValueAtTime(freq * 1.6, t + 0.07);
    this.env(g, t, 0.003, 0.45, 0.14);
    o.connect(g); o.start(t); o.stop(t + 0.25);
  }

  // Vertido de leche: ruido filtrado con burbujeo (LFO) que sube de tono a medida que se llena
  pour(duration = 2.2) {
    if (!this.on) return;
    const t = this.ctx.currentTime;
    const n = this.noiseSrc(true);
    const f = this.ctx.createBiquadFilter();
    f.type = 'bandpass'; f.Q.value = 3.5;
    f.frequency.setValueAtTime(380, t);
    f.frequency.linearRampToValueAtTime(1300, t + duration);
    const lfo = this.ctx.createOscillator();
    const lfoG = this.ctx.createGain();
    lfo.frequency.value = 13; lfoG.gain.value = 220;
    lfo.connect(lfoG).connect(f.frequency);
    const g = this.out(true);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.75, t + 0.12);
    g.gain.setValueAtTime(0.75, t + duration - 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    n.connect(f).connect(g);
    n.start(t); lfo.start(t);
    n.stop(t + duration + 0.05); lfo.stop(t + duration + 0.05);
    // gluglús
    for (let i = 0; i < Math.floor(duration * 5); i++) {
      const tt = t + 0.15 + Math.random() * (duration - 0.3);
      const o = this.ctx.createOscillator();
      const gg = this.out();
      const base = 260 + (tt - t) / duration * 400 + Math.random() * 120;
      o.frequency.setValueAtTime(base, tt);
      o.frequency.exponentialRampToValueAtTime(base * 1.8, tt + 0.05);
      this.env(gg, tt, 0.004, 0.12, 0.06);
      o.connect(gg); o.start(tt); o.stop(tt + 0.1);
    }
  }

  // Tapón: carraca al enroscar + "clac" final
  cap(turns = 6, dur = 0.7) {
    if (!this.on) return;
    const t = this.ctx.currentTime;
    for (let i = 0; i < turns; i++) {
      const tt = t + (i / turns) * dur;
      const n = this.noiseSrc();
      const f = this.ctx.createBiquadFilter();
      f.type = 'highpass'; f.frequency.value = 2600;
      const g = this.out();
      this.env(g, tt, 0.001, 0.25, 0.025);
      n.connect(f).connect(g); n.start(tt); n.stop(tt + 0.05);
    }
    const tt = t + dur;
    const o = this.ctx.createOscillator();
    const g = this.out(true);
    o.type = 'square';
    o.frequency.setValueAtTime(1400, tt);
    o.frequency.exponentialRampToValueAtTime(300, tt + 0.04);
    this.env(g, tt, 0.001, 0.3, 0.07);
    o.connect(g); o.start(tt); o.stop(tt + 0.1);
  }

  click() {
    if (!this.on) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.out(true);
    o.type = 'square';
    o.frequency.setValueAtTime(2200, t);
    o.frequency.exponentialRampToValueAtTime(500, t + 0.03);
    this.env(g, t, 0.001, 0.35, 0.05);
    o.connect(g); o.start(t); o.stop(t + 0.08);
  }

  // Lápiz sobre papel: ruido agudo con micro-trazos irregulares
  pencil(duration = 1.2) {
    if (!this.on) return;
    const t = this.ctx.currentTime;
    const n = this.noiseSrc(true);
    const hp = this.ctx.createBiquadFilter();
    hp.type = 'highpass'; hp.frequency.value = 3200;
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'peaking'; bp.frequency.value = 5200; bp.gain.value = 8;
    const g = this.out();
    g.gain.setValueAtTime(0.0001, t);
    let tt = t;
    while (tt < t + duration) {
      const stroke = 0.05 + Math.random() * 0.14;
      g.gain.linearRampToValueAtTime(0.1 + Math.random() * 0.12, tt + 0.015);
      g.gain.linearRampToValueAtTime(0.012, tt + stroke);
      tt += stroke + Math.random() * 0.03;
    }
    g.gain.linearRampToValueAtTime(0.0001, tt + 0.02);
    n.connect(hp).connect(bp).connect(g);
    n.start(t); n.stop(tt + 0.05);
  }

  // Rotulador rodeando algo
  scribble(duration = 0.6) {
    if (!this.on) return;
    const t = this.ctx.currentTime;
    const n = this.noiseSrc(true);
    const f = this.ctx.createBiquadFilter();
    f.type = 'bandpass'; f.Q.value = 1.4;
    f.frequency.setValueAtTime(1800, t);
    const lfo = this.ctx.createOscillator();
    const lg = this.ctx.createGain();
    lfo.frequency.value = 7; lg.gain.value = 900;
    lfo.connect(lg).connect(f.frequency);
    const g = this.out();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.32, t + 0.05);
    g.gain.setValueAtTime(0.32, t + duration - 0.1);
    g.gain.linearRampToValueAtTime(0.0001, t + duration);
    n.connect(f).connect(g); n.start(t); lfo.start(t);
    n.stop(t + duration + 0.05); lfo.stop(t + duration + 0.05);
  }

  whoosh(duration = 0.7, up = true) {
    if (!this.on) return;
    const t = this.ctx.currentTime;
    const n = this.noiseSrc();
    const f = this.ctx.createBiquadFilter();
    f.type = 'bandpass'; f.Q.value = 0.9;
    f.frequency.setValueAtTime(up ? 300 : 3000, t);
    f.frequency.exponentialRampToValueAtTime(up ? 3200 : 260, t + duration);
    const g = this.out(true);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.5, t + duration * 0.55);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    n.connect(f).connect(g); n.start(t); n.stop(t + duration + 0.05);
  }

  // Polvo de creatina cayendo: granulado fino
  powder(duration = 1.4) {
    if (!this.on) return;
    const t = this.ctx.currentTime;
    for (let i = 0; i < duration * 70; i++) {
      const tt = t + Math.random() * duration;
      const n = this.noiseSrc();
      const f = this.ctx.createBiquadFilter();
      f.type = 'highpass'; f.frequency.value = 4000 + Math.random() * 4000;
      const g = this.out();
      this.env(g, tt, 0.001, 0.05 + Math.random() * 0.07, 0.012);
      n.connect(f).connect(g);
      n.start(tt, Math.random()); n.stop(tt + 0.03);
    }
  }

  // Campanita de acierto (arpegio)
  ding(base = 880) {
    if (!this.on) return;
    const t = this.ctx.currentTime;
    [1, 1.25, 1.5, 2].forEach((m, i) => {
      const o = this.ctx.createOscillator();
      const g = this.out(true);
      o.type = 'sine';
      o.frequency.value = base * m;
      this.env(g, t + i * 0.07, 0.005, 0.22, 0.9);
      o.connect(g); o.start(t + i * 0.07); o.stop(t + i * 0.07 + 1);
    });
  }

  // Error / tachón
  buzz() {
    if (!this.on) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const f = this.ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 900;
    const g = this.out();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(140, t);
    o.frequency.linearRampToValueAtTime(95, t + 0.28);
    this.env(g, t, 0.01, 0.35, 0.3);
    o.connect(f).connect(g); o.start(t); o.stop(t + 0.4);
  }

  // Subida de tensión antes de una revelación
  riser(duration = 1.4) {
    if (!this.on) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const o2 = this.ctx.createOscillator();
    const f = this.ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(300, t);
    f.frequency.exponentialRampToValueAtTime(5000, t + duration);
    const g = this.out(true);
    o.type = 'sawtooth'; o2.type = 'sawtooth';
    o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(440, t + duration);
    o2.frequency.setValueAtTime(111.5, t); o2.frequency.exponentialRampToValueAtTime(446, t + duration);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16, t + duration * 0.9);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration + 0.05);
    o.connect(f); o2.connect(f); f.connect(g);
    o.start(t); o2.start(t); o.stop(t + duration + 0.1); o2.stop(t + duration + 0.1);
  }

  // Impacto cinematográfico para revelaciones grandes
  boom() {
    if (!this.on) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.out(true);
    o.type = 'sine';
    o.frequency.setValueAtTime(90, t);
    o.frequency.exponentialRampToValueAtTime(30, t + 1.2);
    this.env(g, t, 0.005, 1, 1.4);
    o.connect(g); o.start(t); o.stop(t + 1.6);
    const n = this.noiseSrc();
    const f = this.ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.setValueAtTime(5000, t); f.frequency.exponentialRampToValueAtTime(120, t + 1);
    const g2 = this.out(true);
    this.env(g2, t, 0.002, 0.5, 1);
    n.connect(f).connect(g2); n.start(t); n.stop(t + 1.2);
  }

  // Contador: tic-tic que acelera
  counter(duration = 1.2, steps = 16) {
    if (!this.on) return;
    const t = this.ctx.currentTime;
    for (let i = 0; i < steps; i++) {
      const p = i / steps;
      const tt = t + duration * (1 - Math.pow(1 - p, 2));
      const o = this.ctx.createOscillator();
      const g = this.out();
      o.type = 'triangle';
      o.frequency.value = 900 + p * 900;
      this.env(g, tt, 0.001, 0.07, 0.03);
      o.connect(g); o.start(tt); o.stop(tt + 0.05);
    }
  }

  // Caja registradora
  cash() {
    if (!this.on) return;
    this.tick(3200, 0.2);
    const t = this.ctx.currentTime + 0.08;
    [2093, 2637].forEach((fq, i) => {
      const o = this.ctx.createOscillator();
      const g = this.out(true);
      o.type = 'sine'; o.frequency.value = fq;
      this.env(g, t + i * 0.09, 0.002, 0.25, 0.7);
      o.connect(g); o.start(t + i * 0.09); o.stop(t + i * 0.09 + 0.8);
    });
  }

  // Swipe de transición tipo "ola de leche"
  wave() {
    this.whoosh(0.9, true);
    if (!this.on) return;
    const t = this.ctx.currentTime + 0.25;
    const n = this.noiseSrc();
    const f = this.ctx.createBiquadFilter();
    f.type = 'bandpass'; f.Q.value = 2; f.frequency.setValueAtTime(600, t);
    f.frequency.exponentialRampToValueAtTime(1600, t + 0.5);
    const g = this.out(true);
    this.env(g, t, 0.05, 0.25, 0.5);
    n.connect(f).connect(g); n.start(t); n.stop(t + 0.6);
  }
}

export const sfx = new Sfx();
