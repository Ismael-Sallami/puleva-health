// Plano técnico 3D del Crea-Snap a partir de los STL reales que imprimimos.
// Estilo "blueprint" en tinta de risógrafo: aristas en línea, piezas con relleno plano y cotas en HTML.
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { gsap } from './fx.js';
import { sfx } from './sfx.js';

const PARTS = [
  { key: 'botella', file: 'models/Active_80ml_Botella.stl', line: 0xffffff, fill: 0x2a4fd6, fillOp: 0.35, explode: 0, label: 'Botella 80 ml', sub: 'agua funcional cítrica' },
  { key: 'carcasa', file: 'models/Active_80ml_Tapon_Carcasa_TR28x3.stl', line: 0xffd400, fill: 0x2a4fd6, fillOp: 0.5, explode: 46, label: 'Cámara seca', sub: '3 g de creatina, sin tocar el líquido' },
  { key: 'pulsador', file: 'models/Active_80ml_Pulsador_Creatina.stl', line: 0xffffff, fill: 0xff48b0, fillOp: 0.9, explode: 92, label: 'Pulsador', sub: 'rompe el sello y la deja caer' },
  { key: 'tapa', file: 'models/Active_80ml_Tapa_Seguridad.stl', line: 0xffffff, fill: 0x2a4fd6, fillOp: 0.3, explode: 128, label: 'Tapa de seguridad', sub: 'evita pulsar sin querer' },
];

const cache = {};
// se cargan una vez al arrancar, así la diapositiva se monta al instante (y se puede rebobinar)
export async function preloadBlueprint() {
  const loader = new STLLoader();
  await Promise.all(PARTS.map(async (p) => { cache[p.file] = await loader.loadAsync(p.file); }));
}

export function createBlueprint(host, labelHost) {
  const W = host.clientWidth, H = host.clientHeight;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, (window.devicePixelRatio || 1) * (window.__stageScale || 1)));
  renderer.setSize(W, H);
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const aspect = W / H;
  const viewH = 300;
  const camera = new THREE.OrthographicCamera(-viewH * aspect / 2, viewH * aspect / 2, viewH / 2, -viewH / 2, -1000, 1000);
  camera.position.set(0, 60, 400);
  camera.lookAt(0, 0, 0);

  const root = new THREE.Group();
  root.position.y = -128;
  root.rotation.x = -0.12;
  scene.add(root);
  const spin = new THREE.Group();
  root.add(spin);

  const geos = PARTS.map((p) => cache[p.file]);
  const meshes = PARTS.map((p, i) => {
    const g = geos[i].clone();
    g.rotateX(-Math.PI / 2); // Z arriba -> Y arriba
    const grp = new THREE.Group();
    const fill = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: p.fill, transparent: true, opacity: p.fillOp, depthWrite: false, side: THREE.DoubleSide }));
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(g, 28), new THREE.LineBasicMaterial({ color: p.line, transparent: true }));
    grp.add(fill, edges);
    grp.userData = { ...p, fillMat: fill.material, lineMat: edges.material };
    g.computeBoundingBox();
    grp.userData.top = g.boundingBox.max.y;
    grp.userData.bottom = g.boundingBox.min.y;
    spin.add(grp);
    return grp;
  });

  // creatina: puntitos dentro de la cámara
  const grains = new THREE.Group();
  const gGeo = new THREE.SphereGeometry(1.4, 6, 6);
  const gMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  for (let i = 0; i < 70; i++) {
    const m = new THREE.Mesh(gGeo, gMat);
    const a = Math.random() * Math.PI * 2, r = Math.random() * 9;
    m.position.set(Math.cos(a) * r, 80 + Math.random() * 18, Math.sin(a) * r);
    m.userData.home = m.position.clone();
    grains.add(m);
  }
  spin.add(grains);

  // etiquetas con línea guía (HTML encima del lienzo)
  const labels = PARTS.map((p, i) => {
    const d = document.createElement('div');
    d.className = 'bp-label';
    d.innerHTML = `<b>${p.label}</b><span>${p.sub}</span>`;
    labelHost.appendChild(d);
    return d;
  });
  const lines = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  lines.setAttribute('class', 'bp-lines');
  lines.setAttribute('viewBox', `0 0 ${W} ${H}`);
  lines.innerHTML = PARTS.map(() => '<path fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="6 6"/><circle r="5" fill="#FFD400"/>').join('');
  labelHost.appendChild(lines);
  const lp = [...lines.querySelectorAll('path')];
  const lc = [...lines.querySelectorAll('circle')];

  const st = { explode: 0, rot: 0, auto: 1, press: 0, fall: 0, safety: 0, labels: 0, shakeA: 0, intro: 0 };
  const v = new THREE.Vector3();

  function apply() {
    const t = performance.now() / 1000;
    // encuadre: montado se ve grande; al despiezar, la cámara se abre
    camera.zoom = 1.6 - 0.6 * st.explode;
    camera.updateProjectionMatrix();
    root.position.y = -(64 + 64 * st.explode);
    spin.rotation.y = st.rot + st.auto * t * 0.45;
    root.rotation.z = Math.sin(t * 38) * 0.05 * st.shakeA;
    meshes.forEach((m, i) => {
      let y = m.userData.explode * st.explode;
      if (m.userData.key === 'pulsador') y -= 13 * st.press;
      if (m.userData.key === 'tapa') { y += 70 * st.safety; m.rotation.z = st.safety * 0.6; m.userData.lineMat.opacity = 1 - st.safety; m.userData.fillMat.opacity = m.userData.fillOp * (1 - st.safety); }
      m.position.y = y;
      m.scale.setScalar(0.6 + 0.4 * st.intro);
      m.visible = st.intro > 0.01;
    });
    grains.position.y = meshes[1].position.y;
    grains.children.forEach((g, i) => {
      const k = Math.min(1, Math.max(0, st.fall * 1.6 - (i % 10) * 0.06));
      g.position.y = g.userData.home.y - k * (40 + (i % 7) * 6);
      g.position.x = g.userData.home.x * (1 + k * 1.6);
      g.position.z = g.userData.home.z * (1 + k * 1.6);
      g.visible = st.intro > 0.5;
    });
    // etiquetas: proyectar el punto lateral de cada pieza
    meshes.forEach((m, i) => {
      v.set(24, (m.userData.top + m.userData.bottom) / 2, 0);
      m.localToWorld(v);
      v.project(camera);
      const x = (v.x * 0.5 + 0.5) * W, y = (-v.y * 0.5 + 0.5) * H;
      const lx = W * 0.72, ly = 110 + i * 0 + (H - 220) * (1 - i / (PARTS.length - 1));
      const vis = st.labels * (m.userData.key === 'tapa' ? 1 - st.safety : 1);
      labels[i].style.transform = `translate(${lx + 14}px, ${ly - 24}px)`;
      labels[i].style.opacity = vis;
      lp[i].setAttribute('d', `M${x} ${y} L${lx - 40} ${ly} L${lx} ${ly}`);
      lp[i].style.opacity = vis;
      lc[i].setAttribute('cx', x); lc[i].setAttribute('cy', y);
      lc[i].style.opacity = vis;
    });
  }
  const tick = () => { apply(); renderer.render(scene, camera); };
  gsap.ticker.add(tick);
  apply();

  return {
    st,
    intro() {
      return gsap.timeline().fromTo(st, { intro: 0 }, { intro: 1, duration: 1.1, ease: 'back.out(1.6)' })
        .call(() => sfx.whoosh(0.6), null, 0);
    },
    explode() {
      return gsap.timeline()
        .call(() => sfx.whoosh(0.7))
        .to(st, { explode: 1, duration: 1.2, ease: 'power3.inOut' })
        .to(st, { labels: 1, duration: 0.5 }, '-=0.3');
    },
    assembleAndPress() {
      const tl = gsap.timeline();
      tl.to(st, { labels: 0, duration: 0.25 })
        .to(st, { explode: 0, duration: 0.9, ease: 'power3.inOut' })
        .call(() => sfx.click())
        .to(st, { auto: 0, rot: 0.6, duration: 0.4 }, '<')
        .to(st, { safety: 1, duration: 0.6, ease: 'power2.in' })
        .call(() => sfx.click())
        .to(st, { press: 1, duration: 0.18, ease: 'power4.in' })
        .call(() => { sfx.click(); sfx.powder(1.2); })
        .to(st, { fall: 1, duration: 1.2, ease: 'power1.in' })
        .call(() => { for (let i = 0; i < 6; i++) gsap.delayedCall(i * 0.1, () => sfx.tick(420 + i * 30, 0.2)); })
        .fromTo(st, { shakeA: 0 }, { shakeA: 1, duration: 0.1 })
        .to(st, { shakeA: 0, duration: 0.8, ease: 'power2.in' })
        .to(st, { auto: 1, duration: 0.6 });
      return tl;
    },
    destroy() {
      gsap.ticker.remove(tick);
      renderer.dispose();
      meshes.forEach((m) => m.traverse((o) => { if (o.geometry) o.geometry.dispose(); }));
      renderer.domElement.remove();
      labels.forEach((l) => l.remove());
      lines.remove();
    },
  };
}
