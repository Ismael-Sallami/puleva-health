// Bote 3D real (Three.js): cae en seco, se llena de leche, se enrosca el tapón y se envuelve la etiqueta.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap } from './fx.js';
import { sfx } from './sfx.js';

// Perfil del bote (radio, altura) — forma de shot lácteo
const PROFILE = [
  [0, 0], [0.8, 0], [0.92, 0.04], [0.96, 0.16], [0.96, 1.92], [0.92, 2.16],
  [0.78, 2.42], [0.58, 2.62], [0.46, 2.76], [0.46, 3.06], [0.5, 3.08], [0.5, 3.14], [0.44, 3.16],
];
const LABEL = { y0: 0.34, y1: 1.78, r: 0.975 };

function radiusAt(y) {
  for (let i = 0; i < PROFILE.length - 1; i++) {
    const [r0, y0] = PROFILE[i];
    const [r1, y1] = PROFILE[i + 1];
    if (y >= y0 && y <= y1 && y1 > y0) return r0 + (r1 - r0) * ((y - y0) / (y1 - y0));
  }
  return 0.46;
}

function labelTexture(variant) {
  const c = document.createElement('canvas');
  c.width = 2048; c.height = 640;
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 0, 640);
  grd.addColorStop(0, variant.top);
  grd.addColorStop(1, variant.bottom);
  g.fillStyle = grd;
  g.fillRect(0, 0, 2048, 640);
  // ola de leche
  g.fillStyle = '#FFFFFF';
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(2048, 0);
  g.lineTo(2048, 120);
  for (let x = 2048; x >= 0; x -= 16) g.lineTo(x, 132 + Math.sin(x / 2048 * Math.PI * 8) * 22);
  g.closePath();
  g.fill();
  const cx = 1024;
  g.textAlign = 'center';
  g.fillStyle = variant.brand;
  g.font = '800 92px "Bricolage Grotesque Variable", sans-serif';
  g.fillText('PULEVA', cx, 96);
  g.fillStyle = '#FFFFFF';
  g.font = '800 64px "Bricolage Grotesque Variable", sans-serif';
  g.fillText('H E A L T H', cx, 250);
  g.fillStyle = variant.accent;
  g.font = '700 130px "Bricolage Grotesque Variable", sans-serif';
  g.fillText(variant.name, cx, 400);
  g.fillStyle = '#FFFFFF';
  g.font = '700 74px "Caveat", cursive';
  g.fillText('Salud que se bebe', cx, 500);
  g.font = '600 26px "Bricolage Grotesque Variable", sans-serif';
  g.globalAlpha = 0.8;
  g.fillText('COMPLEMENTO ALIMENTICIO · MONODOSIS', cx, 590);
  g.globalAlpha = 1;
  // detalle trasero
  g.font = '700 42px "Bricolage Grotesque Variable", sans-serif';
  g.fillStyle = 'rgba(255,255,255,.55)';
  g.fillText('10 SEGUNDOS', 200, 380);
  g.fillText('EFSA', 1848, 380);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  return tex;
}

function shadowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, 'rgba(6,20,70,.55)');
  grd.addColorStop(0.5, 'rgba(6,20,70,.18)');
  grd.addColorStop(1, 'rgba(6,20,70,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

export function createBottleScene(host, opts = {}) {
  const variant = {
    top: '#1A46D1', bottom: '#0B2A8F', brand: '#1338BE', accent: '#D7FF3A', name: 'DAILY', ...opts.variant,
  };
  const W = host.clientWidth, H = host.clientHeight;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  const pr = Math.min(2, (window.devicePixelRatio || 1) * (window.__stageScale || 1));
  renderer.setPixelRatio(pr);
  renderer.setSize(W, H);
  renderer.localClippingEnabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;

  const camera = new THREE.PerspectiveCamera(28, W / H, 0.1, 100);
  const camBase = new THREE.Vector3(0, 2.1, 10.5);
  camera.position.copy(camBase);
  camera.lookAt(0, 1.55, 0);

  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(3, 6, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x9fc4ff, 2.2);
  rim.position.set(-4, 3, -4);
  scene.add(rim);
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));

  const group = new THREE.Group();
  scene.add(group);

  // --- envase (PET translúcido)
  const pts = PROFILE.map(([r, y]) => new THREE.Vector2(r, y));
  const bottleGeo = new THREE.LatheGeometry(pts, 128);
  const bottleMat = new THREE.MeshPhysicalMaterial({
    color: 0xdfe9ff, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.16,
    clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.6, depthWrite: false, side: THREE.DoubleSide,
  });
  const bottle = new THREE.Mesh(bottleGeo, bottleMat);
  bottle.renderOrder = 3;
  group.add(bottle);

  // --- leche (con plano de corte que sube)
  const clip = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0.0);
  const liqPts = PROFILE.slice(0, -4).map(([r, y]) => new THREE.Vector2(Math.max(0, r * 0.93), Math.max(0.03, y)));
  const liqGeo = new THREE.LatheGeometry(liqPts, 96);
  const liqMat = new THREE.MeshPhysicalMaterial({
    color: 0xfffbf2, roughness: 0.32, sheen: 1, sheenColor: new THREE.Color(0xffffff), sheenRoughness: 0.5,
    clippingPlanes: [clip], side: THREE.DoubleSide,
  });
  const liquid = new THREE.Mesh(liqGeo, liqMat);
  liquid.renderOrder = 1;
  group.add(liquid);
  const surf = new THREE.Mesh(new THREE.CircleGeometry(1, 64), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.15, clearcoat: 1 }));
  surf.rotation.x = -Math.PI / 2;
  surf.visible = false;
  group.add(surf);

  // --- chorro de leche
  const streamMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.2, clearcoat: 1 });
  const streamGeo = new THREE.CylinderGeometry(0.075, 0.09, 1, 24, 1, true);
  streamGeo.translate(0, -0.5, 0); // origen arriba
  const stream = new THREE.Mesh(streamGeo, streamMat);
  stream.visible = false;
  scene.add(stream);

  // --- etiqueta
  const tex = labelTexture(variant);
  const labelMat = new THREE.MeshPhysicalMaterial({ map: tex, roughness: 0.35, clearcoat: 0.6, side: THREE.DoubleSide, transparent: true });
  let label = null;
  function buildLabel(frac) {
    if (label) { group.remove(label); label.geometry.dispose(); }
    if (frac <= 0.001) { label = null; return; }
    const L = Math.PI * 2 * frac;
    const geo = new THREE.CylinderGeometry(LABEL.r, LABEL.r, LABEL.y1 - LABEL.y0, 128, 1, true, -L / 2, L);
    // UV: el centro del texto siempre al frente
    const uv = geo.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setX(i, 0.5 - frac / 2 + uv.getX(i) * frac);
    geo.translate(0, (LABEL.y0 + LABEL.y1) / 2, 0);
    label = new THREE.Mesh(geo, labelMat);
    label.renderOrder = 2;
    group.add(label);
  }

  // --- tapón con estrías
  const cap = new THREE.Group();
  const capMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(variant.brand), roughness: 0.38, clearcoat: 0.8 });
  const capBody = new THREE.Mesh(new THREE.CylinderGeometry(0.53, 0.55, 0.46, 64), capMat);
  capBody.position.y = 0.23;
  cap.add(capBody);
  const ribGeo = new THREE.BoxGeometry(0.035, 0.38, 0.05);
  for (let i = 0; i < 48; i++) {
    const rib = new THREE.Mesh(ribGeo, capMat);
    const a = (i / 48) * Math.PI * 2;
    rib.position.set(Math.sin(a) * 0.55, 0.23, Math.cos(a) * 0.55);
    rib.rotation.y = a;
    cap.add(rib);
  }
  const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.53, 0.04, 64), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.3 }));
  capTop.position.y = 0.47;
  cap.add(capTop);
  group.add(cap);

  // --- reflejos de estudio (franjas fijas respecto a la cámara, como en un render de producto)
  const streaks = new THREE.Group();
  const streakMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending });
  [[-0.62, 0.1, 0.32], [0.45, 0.05, 0.18], [-0.22, 0.02, 0.14]].forEach(([a, w, o]) => {
    const g = new THREE.CylinderGeometry(0.985, 0.985, 1.62, 16, 1, true, a, w);
    g.translate(0, 1.08, 0);
    const m = new THREE.Mesh(g, streakMat.clone());
    m.material.opacity = o;
    m.renderOrder = 5;
    streaks.add(m);
  });
  scene.add(streaks);

  // --- sombra
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.6), new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.002;
  scene.add(shadow);

  // --- estado animable
  const st = {
    y: 9, squash: 1, rotY: -0.35, tilt: 0, level: 0, stream: 0, tail: 0,
    capY: 9, capRot: 0, label: 0, idle: 0, camShake: 0, x: 0,
  };
  let lastLabel = -1;
  let t0 = performance.now();

  function apply() {
    const t = (performance.now() - t0) / 1000;
    group.position.set(st.x, st.y, 0);
    group.scale.set(1 + (1 - st.squash) * 0.8, st.squash, 1 + (1 - st.squash) * 0.8);
    group.rotation.y = st.rotY + st.idle * Math.sin(t * 0.7) * 0.5;
    group.rotation.z = st.tilt + st.idle * Math.sin(t * 1.1) * 0.03;
    streaks.position.copy(group.position);
    streaks.scale.copy(group.scale);
    streaks.rotation.z = group.rotation.z;
    // leche
    clip.constant = st.level;
    liquid.visible = st.level > 0.02;
    surf.visible = st.level > 0.04 && st.level < 3.0;
    const r = radiusAt(st.level) * 0.93;
    surf.position.y = st.level;
    surf.scale.set(r, r, 1);
    // chorro
    const top = 6.5;
    const head = top - (top - (st.y + st.level)) * st.stream;
    const tail = top - (top - (st.y + st.level)) * st.tail;
    stream.visible = st.stream > 0 && st.tail < 1;
    stream.position.set(st.x, tail, 0);
    stream.scale.set(1 + Math.sin(t * 40) * 0.05, Math.max(0.001, tail - head), 1);
    // tapón
    cap.position.y = st.capY;
    cap.rotation.y = st.capRot;
    // etiqueta
    if (Math.abs(st.label - lastLabel) > 0.002) { buildLabel(st.label); lastLabel = st.label; }
    // sombra según altura
    const hgt = Math.max(0, st.y);
    const s = 1 / (1 + hgt * 0.25);
    shadow.scale.set(s, s, 1);
    shadow.position.x = st.x;
    shadow.material.opacity = Math.min(1, s * 1.15);
    // cámara
    camera.position.set(
      camBase.x + (Math.random() - 0.5) * st.camShake,
      camBase.y + (Math.random() - 0.5) * st.camShake,
      camBase.z,
    );
    camera.lookAt(0, 1.55, 0);
  }

  const tick = () => { apply(); renderer.render(scene, camera); };
  gsap.ticker.add(tick);

  const quake = (k = 0.18) => gsap.fromTo(st, { camShake: k }, { camShake: 0, duration: 0.45, ease: 'power2.out' });

  const api = {
    st,
    // 1) cae en seco
    drop() {
      const tl = gsap.timeline();
      tl.fromTo(st, { y: 9, rotY: -1.2, tilt: 0.25 }, { y: 0, rotY: -0.35, tilt: 0, duration: 0.6, ease: 'power3.in' });
      tl.call(() => { sfx.thud(1.1); quake(0.22); });
      tl.to(st, { squash: 0.84, duration: 0.07, ease: 'power2.out' });
      tl.to(st, { squash: 1, duration: 0.9, ease: 'elastic.out(1.2,0.3)' });
      return tl;
    },
    // 2) se vierte la leche
    pour(dur = 2.4) {
      const tl = gsap.timeline();
      tl.call(() => sfx.pour(dur + 0.4));
      tl.fromTo(st, { stream: 0, tail: 0 }, { stream: 1, duration: 0.28, ease: 'power2.in' });
      tl.fromTo(st, { level: 0 }, { level: 2.5, duration: dur, ease: 'power1.inOut' }, '>-0.02');
      tl.to(st, { tilt: 0.03, duration: 0.2, yoyo: true, repeat: 5, ease: 'sine.inOut' }, '<');
      tl.to(st, { tail: 1, duration: 0.3, ease: 'power2.in' }, '>-0.15');
      tl.set(st, { tilt: 0 });
      return tl;
    },
    // 3) tapón que cae y se enrosca
    capOn() {
      const tl = gsap.timeline();
      tl.fromTo(st, { capY: 8, capRot: 0 }, { capY: 3.5, duration: 0.45, ease: 'power3.in' });
      tl.call(() => sfx.click());
      tl.to(st, { capY: 3.62, duration: 0.12, ease: 'power2.out' });
      tl.to(st, { capY: 3.5, duration: 0.12, ease: 'power2.in' });
      tl.call(() => sfx.cap(7, 0.75));
      tl.to(st, { capY: 2.98, capRot: -Math.PI * 4, duration: 0.8, ease: 'power2.inOut' });
      tl.to(st, { squash: 0.95, duration: 0.06 }).to(st, { squash: 1, duration: 0.5, ease: 'elastic.out(1,0.3)' });
      return tl;
    },
    // 4) la etiqueta se envuelve y el bote gira
    wrap() {
      const tl = gsap.timeline();
      tl.call(() => sfx.whoosh(1.1));
      tl.fromTo(st, { label: 0 }, { label: 1, duration: 1.1, ease: 'power2.inOut' });
      tl.fromTo(st, { rotY: -0.35 }, { rotY: Math.PI * 2, duration: 1.6, ease: 'power3.inOut' }, 0.1);
      tl.to(st, { idle: 1, duration: 1.5 });
      return tl;
    },
    moveX(x, dur = 1) { return gsap.to(st, { x, duration: dur, ease: 'power3.inOut' }); },
    destroy() {
      gsap.ticker.remove(tick);
      renderer.dispose();
      envRT.dispose();
      pmrem.dispose();
      scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
      tex.dispose();
      renderer.domElement.remove();
    },
  };
  apply();
  return api;
}
