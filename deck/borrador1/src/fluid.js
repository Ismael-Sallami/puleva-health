// Leche de verdad: simulación de fluidos incompresibles en GPU (Navier-Stokes, "stable fluids")
// con gravedad, sombreado y brillo húmedo. Salpica, gotea y sirve de transición entre diapositivas.

const VS = `#version 300 es
precision highp float;
in vec2 aPos;
out vec2 vUv, vL, vR, vT, vB;
uniform vec2 texel;
void main(){
  vUv = aPos*0.5+0.5;
  vL = vUv - vec2(texel.x,0.); vR = vUv + vec2(texel.x,0.);
  vT = vUv + vec2(0.,texel.y); vB = vUv - vec2(0.,texel.y);
  gl_Position = vec4(aPos,0.,1.);
}`;

const FS = {
  clear: `#version 300 es
precision mediump float; in vec2 vUv; out vec4 o; uniform sampler2D uT; uniform float value;
void main(){ o = value*texture(uT,vUv); }`,

  splat: `#version 300 es
precision highp float; in vec2 vUv; out vec4 o;
uniform sampler2D uT; uniform float aspect; uniform vec3 color; uniform vec2 point; uniform float radius;
void main(){
  vec2 p = vUv - point; p.x *= aspect;
  vec3 s = exp(-dot(p,p)/radius) * color;
  o = vec4(texture(uT,vUv).xyz + s, 1.);
}`,

  advect: `#version 300 es
precision highp float; in vec2 vUv; out vec4 o;
uniform sampler2D uVel; uniform sampler2D uSrc; uniform vec2 texel; uniform float dt; uniform float dissipation; uniform float cap;
void main(){
  vec2 c = vUv - dt*texture(uVel,vUv).xy*texel;
  vec4 r = texture(uSrc,c);
  o = clamp(r/(1.+dissipation*dt), vec4(-cap), vec4(cap));
}`,

  divergence: `#version 300 es
precision mediump float; in vec2 vUv, vL, vR, vT, vB; out vec4 o; uniform sampler2D uVel;
void main(){
  float L = texture(uVel,vL).x, R = texture(uVel,vR).x, T = texture(uVel,vT).y, B = texture(uVel,vB).y;
  vec2 C = texture(uVel,vUv).xy;
  if(vL.x<0.) L=-C.x; if(vR.x>1.) R=-C.x; if(vT.y>1.) T=-C.y; if(vB.y<0.) B=-C.y;
  o = vec4(0.5*(R-L+T-B),0.,0.,1.);
}`,

  curl: `#version 300 es
precision mediump float; in vec2 vUv, vL, vR, vT, vB; out vec4 o; uniform sampler2D uVel;
void main(){
  float L = texture(uVel,vL).y, R = texture(uVel,vR).y, T = texture(uVel,vT).x, B = texture(uVel,vB).x;
  o = vec4(0.5*(R-L-T+B),0.,0.,1.);
}`,

  vorticity: `#version 300 es
precision highp float; in vec2 vUv, vL, vR, vT, vB; out vec4 o;
uniform sampler2D uVel; uniform sampler2D uCurl; uniform float curl; uniform float dt;
void main(){
  float L = texture(uCurl,vL).x, R = texture(uCurl,vR).x, T = texture(uCurl,vT).x, B = texture(uCurl,vB).x, C = texture(uCurl,vUv).x;
  vec2 f = 0.5*vec2(abs(T)-abs(B), abs(R)-abs(L));
  f /= length(f)+0.0001; f *= curl*C; f.y *= -1.;
  vec2 v = texture(uVel,vUv).xy + f*dt;
  o = vec4(clamp(v,-1000.,1000.),0.,1.);
}`,

  // gravedad: la leche pesa, así que donde hay leche el campo de velocidad tira hacia abajo
  gravity: `#version 300 es
precision highp float; in vec2 vUv; out vec4 o;
uniform sampler2D uVel; uniform sampler2D uDye; uniform float g; uniform float dt;
void main(){
  vec2 v = texture(uVel,vUv).xy;
  float m = clamp(texture(uDye,vUv).r,0.,1.);
  v.y -= g*m*dt;
  o = vec4(v,0.,1.);
}`,

  pressure: `#version 300 es
precision mediump float; in vec2 vUv, vL, vR, vT, vB; out vec4 o;
uniform sampler2D uP; uniform sampler2D uDiv;
void main(){
  float L = texture(uP,vL).x, R = texture(uP,vR).x, T = texture(uP,vT).x, B = texture(uP,vB).x;
  float d = texture(uDiv,vUv).x;
  o = vec4((L+R+B+T-d)*0.25,0.,0.,1.);
}`,

  gradient: `#version 300 es
precision mediump float; in vec2 vUv, vL, vR, vT, vB; out vec4 o;
uniform sampler2D uP; uniform sampler2D uVel;
void main(){
  float L = texture(uP,vL).x, R = texture(uP,vR).x, T = texture(uP,vT).x, B = texture(uP,vB).x;
  vec2 v = texture(uVel,vUv).xy - vec2(R-L,T-B);
  o = vec4(v,0.,1.);
}`,

  // render: leche opaca, cremosa, con normales a partir del grosor -> sombreado y brillo especular
  display: `#version 300 es
precision highp float; in vec2 vUv, vL, vR, vT, vB; out vec4 o;
uniform sampler2D uDye; uniform vec2 texel; uniform vec3 tint; uniform float cut; uniform float drain;
void main(){
  float raw = texture(uDye,vUv).r;
  float c = clamp(raw,0.,1.);
  float L = smoothstep(0.,0.6,texture(uDye,vL).r), R = smoothstep(0.,0.6,texture(uDye,vR).r);
  float T = smoothstep(0.,0.6,texture(uDye,vT).r), B = smoothstep(0.,0.6,texture(uDye,vB).r);
  vec3 n = normalize(vec3(L-R, B-T, 0.12));
  vec3 lightDir = normalize(vec3(-0.45,0.6,1.0));
  float diff = clamp(dot(n,lightDir),0.,1.);
  vec3 h = normalize(lightDir+vec3(0.,0.,1.));
  float spec = pow(clamp(dot(n,h),0.,1.),60.);
  float a = smoothstep(cut,cut+0.16,raw);
  float rim = smoothstep(cut,cut+0.1,raw) - smoothstep(cut+0.1,cut+0.4,raw);
  // al escurrir, la lámina de leche baja con un borde de goterones
  float x = vUv.x;
  float drips = 0.035*sin(x*13.0+1.3) + 0.02*sin(x*37.0+0.4) + 0.16*smoothstep(0.86,1.0,sin(x*9.0+0.7)) + 0.11*smoothstep(0.9,1.0,sin(x*19.0+2.1)) + 0.07*smoothstep(0.93,1.0,sin(x*33.0+0.3));
  float edge = (1.08 - drain*1.4) + drips*(0.4 + drain) - vUv.y;
  if (drain > 0.0) {
    a *= smoothstep(-0.004, 0.006, edge);
    float lip = smoothstep(0.0, 0.012, edge) - smoothstep(0.012, 0.05, edge);
    diff = mix(diff, 1.0, smoothstep(0.004,0.02,edge) - smoothstep(0.02,0.045,edge));
    rim += lip*0.9;
  }
  vec3 col = tint * (0.78 + 0.26*diff) - vec3(0.06,0.05,0.02)*rim + vec3(spec)*0.85;
  o = vec4(col*a, a);
}`,
};

export class MilkFluid {
  constructor(canvas) {
    this.canvas = canvas;
    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, preserveDrawingBuffer: false });
    this.ok = !!gl && !!gl.getExtension('EXT_color_buffer_float');
    if (!this.ok) return;
    gl.getExtension('OES_texture_float_linear');
    this.gl = gl;
    this.cfg = {
      simRes: 160, dyeRes: 960, velDiss: 0.9, dyeDiss: 0.3, pressure: 0.85, iters: 22, curl: 0.6, gravity: 170,
    };
    this.tint = [1.0, 0.985, 0.955];
    this.drain = 0;
    this.cut = 0.08; // umbral de grosor visible: subirlo hace que la leche "se retire"
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    const ib = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    this.p = {};
    for (const k in FS) this.p[k] = this.program(VS, FS[k]);
    this.initFBOs();
    this.last = performance.now();
    this.running = true;
    this.active = 0; // frames con leche visible -> cuando no hay, se pausa el render
    const loop = () => { if (this.running) { this.step(); requestAnimationFrame(loop); } };
    requestAnimationFrame(loop);
  }

  program(vs, fs) {
    const gl = this.gl;
    const mk = (t, s) => { const sh = gl.createShader(t); gl.shaderSource(sh, s); gl.compileShader(sh); if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(sh)); return sh; };
    const pr = gl.createProgram();
    gl.attachShader(pr, mk(gl.VERTEX_SHADER, vs));
    gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, fs));
    gl.bindAttribLocation(pr, 0, 'aPos');
    gl.linkProgram(pr);
    const u = {};
    const n = gl.getProgramParameter(pr, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) { const name = gl.getActiveUniform(pr, i).name; u[name] = gl.getUniformLocation(pr, name); }
    return { pr, u };
  }

  fbo(w, h, ifmt, fmt, type) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0);
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, ifmt, w, h, 0, fmt, type, null);
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { tex, fb, w, h, texel: [1 / w, 1 / h], attach(id) { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, tex); return id; } };
  }

  dbl(w, h, ifmt, fmt, type) {
    let a = this.fbo(w, h, ifmt, fmt, type), b = this.fbo(w, h, ifmt, fmt, type);
    return { w, h, texel: a.texel, get read() { return a; }, get write() { return b; }, swap() { [a, b] = [b, a]; } };
  }

  res(r) {
    const asp = this.canvas.width / this.canvas.height;
    return asp > 1 ? { w: Math.round(r * asp), h: r } : { w: r, h: Math.round(r / asp) };
  }

  initFBOs() {
    const gl = this.gl;
    const HF = gl.HALF_FLOAT;
    const s = this.res(this.cfg.simRes), d = this.res(this.cfg.dyeRes);
    this.dye = this.dbl(d.w, d.h, gl.RGBA16F, gl.RGBA, HF);
    this.vel = this.dbl(s.w, s.h, gl.RG16F, gl.RG, HF);
    this.div = this.fbo(s.w, s.h, gl.R16F, gl.RED, HF);
    this.curlF = this.fbo(s.w, s.h, gl.R16F, gl.RED, HF);
    this.pres = this.dbl(s.w, s.h, gl.R16F, gl.RED, HF);
  }

  blit(target) {
    const gl = this.gl;
    if (target) { gl.viewport(0, 0, target.w, target.h); gl.bindFramebuffer(gl.FRAMEBUFFER, target.fb); }
    else { gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight); gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }

  use(name) { const p = this.p[name]; this.gl.useProgram(p.pr); return p.u; }

  step() {
    const now = performance.now();
    const dt = Math.min((now - this.last) / 1000, 0.025);
    this.last = now;
    if (this.active <= 0) return;
    this.active--;
    if (this.active === 0) { this.clear(); return; }
    const gl = this.gl, c = this.cfg;
    gl.disable(gl.BLEND);
    const vt = this.vel.texel;
    let u;
    if (this.paused) { this.render(); return; }

    u = this.use('curl'); gl.uniform2f(u.texel, ...vt); gl.uniform1i(u.uVel, this.vel.read.attach(0)); this.blit(this.curlF);
    u = this.use('vorticity'); gl.uniform2f(u.texel, ...vt); gl.uniform1i(u.uVel, this.vel.read.attach(0)); gl.uniform1i(u.uCurl, this.curlF.attach(1));
    gl.uniform1f(u.curl, c.curl); gl.uniform1f(u.dt, dt); this.blit(this.vel.write); this.vel.swap();
    u = this.use('gravity'); gl.uniform2f(u.texel, ...vt); gl.uniform1i(u.uVel, this.vel.read.attach(0)); gl.uniform1i(u.uDye, this.dye.read.attach(1));
    gl.uniform1f(u.g, c.gravity); gl.uniform1f(u.dt, dt); this.blit(this.vel.write); this.vel.swap();
    u = this.use('divergence'); gl.uniform2f(u.texel, ...vt); gl.uniform1i(u.uVel, this.vel.read.attach(0)); this.blit(this.div);
    u = this.use('clear'); gl.uniform2f(u.texel, ...vt); gl.uniform1i(u.uT, this.pres.read.attach(0)); gl.uniform1f(u.value, c.pressure); this.blit(this.pres.write); this.pres.swap();
    u = this.use('pressure'); gl.uniform2f(u.texel, ...vt); gl.uniform1i(u.uDiv, this.div.attach(0));
    for (let i = 0; i < c.iters; i++) { gl.uniform1i(u.uP, this.pres.read.attach(1)); this.blit(this.pres.write); this.pres.swap(); }
    u = this.use('gradient'); gl.uniform2f(u.texel, ...vt); gl.uniform1i(u.uP, this.pres.read.attach(0)); gl.uniform1i(u.uVel, this.vel.read.attach(1)); this.blit(this.vel.write); this.vel.swap();
    u = this.use('advect'); gl.uniform2f(u.texel, ...vt); gl.uniform1i(u.uVel, this.vel.read.attach(0)); gl.uniform1i(u.uSrc, this.vel.read.attach(0));
    gl.uniform1f(u.dt, dt); gl.uniform1f(u.dissipation, c.velDiss); gl.uniform1f(u.cap, 100000); this.blit(this.vel.write); this.vel.swap();
    gl.uniform1i(u.uVel, this.vel.read.attach(0)); gl.uniform1i(u.uSrc, this.dye.read.attach(1)); gl.uniform1f(u.dissipation, c.dyeDiss); gl.uniform1f(u.cap, 2.5);
    this.blit(this.dye.write); this.dye.swap();

    this.render();
  }

  render() {
    const gl = this.gl;
    let u = this.use('display');
    gl.uniform2f(u.texel, 1 / this.dye.w, 1 / this.dye.h);
    gl.uniform1i(u.uDye, this.dye.read.attach(0));
    gl.uniform3f(u.tint, ...this.tint);
    gl.uniform1f(u.cut, this.cut);
    gl.uniform1f(u.drain, this.drain);
    gl.clearColor(0, 0, 0, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.blit(null);
  }

  wake(frames = 600) { this.active = Math.max(this.active, frames); }

  // x, y en píxeles del escenario (1920x1080); dx, dy en px/s; r radio relativo
  splat(x, y, dx, dy, r = 0.0025, amount = 1) {
    if (!this.ok) return;
    const gl = this.gl;
    const W = 1920, H = 1080;
    const px = x / W, py = 1 - y / H;
    const asp = this.canvas.width / this.canvas.height;
    let u = this.use('splat');
    gl.uniform1i(u.uT, this.vel.read.attach(0));
    gl.uniform1f(u.aspect, asp);
    gl.uniform2f(u.point, px, py);
    const k = this.vel.h / H; // px/s -> celdas de simulación/s
    gl.uniform3f(u.color, dx * k, -dy * k, 0);
    gl.uniform1f(u.radius, r);
    this.blit(this.vel.write); this.vel.swap();
    gl.uniform1i(u.uT, this.dye.read.attach(0));
    gl.uniform3f(u.color, amount, amount, amount);
    this.blit(this.dye.write); this.dye.swap();
    this.wake();
  }

  // Salpicadura en corona: al caer un bote o una gota
  splash(x, y, power = 1) {
    const n = 9;
    for (let i = 0; i < n; i++) {
      const a = Math.PI + (i / (n - 1)) * Math.PI; // abanico hacia arriba
      const sp = (600 + Math.random() * 900) * power;
      this.splat(x + Math.cos(a) * 30, y + Math.sin(a) * 10, Math.cos(a) * sp, Math.sin(a) * sp * 1.3, 0.0009 * power, 1.4);
    }
    this.splat(x, y, 0, 100, 0.0025 * power, 1.6);
  }

  // Chorro continuo (vertido)
  pourAt(x, y, dur = 1, vy = 1400, r = 0.0012) {
    const t0 = performance.now();
    const tickFn = () => {
      const t = (performance.now() - t0) / 1000;
      if (t > dur) return;
      this.splat(x + (Math.random() - 0.5) * 8, y, (Math.random() - 0.5) * 60, vy, r, 0.9);
      requestAnimationFrame(tickFn);
    };
    tickFn();
  }

  // Inunda toda la pantalla de leche desde arriba
  flood(dur = 0.55) {
    if (!this.ok) return;
    const t0 = performance.now();
    const f = () => {
      const t = (performance.now() - t0) / 1000;
      const k = Math.min(1, t / dur);
      for (let i = 0; i < 7; i++) {
        const x = Math.random() * 1920;
        const y = -40 + k * 1150 * Math.random();
        this.splat(x, y, (Math.random() - 0.5) * 300, 900 + Math.random() * 900, 0.018, 1.6);
      }
      if (t < dur) requestAnimationFrame(f);
    };
    f();
  }

  clear() {
    if (!this.ok) return;
    const gl = this.gl;
    for (const t of [this.dye.read, this.dye.write, this.vel.read, this.vel.write]) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, t.fb); gl.viewport(0, 0, t.w, t.h); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
}
