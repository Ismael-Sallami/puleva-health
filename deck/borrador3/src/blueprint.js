// Plano técnico 3D del Crea-Snap a partir de los STL reales que imprimimos.
// Optimizado para navegadores modestos: geometría y aristas precalculadas una sola vez, iluminación Gouraud (MeshLambertMaterial) y pixelRatio 1.
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { gsap } from './fx.js';
import { sfx } from './sfx.js';

const PARTS = [
  { key: 'botella', file: 'models/Active_80ml_Botella.stl', line: 0xf2f2f2, fill: 0x140ec8, fillOp: 0.45, explode: 0, label: 'Botella 80 ml', sub: 'agua funcional cítrica' },
  { key: 'carcasa', file: 'models/Active_80ml_Tapon_Carcasa_TR28x3.stl', line: 0x189150, fill: 0x189150, fillOp: 0.75, explode: 46, label: 'Cámara seca', sub: '3 g de creatina, sin tocar el líquido' },
  { key: 'pulsador', file: 'models/Active_80ml_Pulsador_Creatina.stl', line: 0xf2f2f2, fill: 0xe11d38, fillOp: 0.94, explode: 92, label: 'Pulsador', sub: 'rompe el sello y la deja caer' },
  { key: 'pinza', file: 'models/Active_80ml_Pinza_Seguridad.stl', line: 0xf2f2f2, fill: 0x189150, fillOp: 0.88, explode: 120, label: 'Pinza de seguridad', sub: 'se quita antes de pulsar' },
];

const cache = {};
const edgeCache = {};
const sharedSphereGeo = new THREE.SphereGeometry(1.7, 6, 6);

// se cargan y procesan una sola vez al arrancar, así la diapositiva 7 entra al instante sin tirones de CPU
export async function preloadBlueprint() {
  const loader = new STLLoader();
  await Promise.all(PARTS.map(async (p) => {
    const g = await loader.loadAsync(p.file);
    g.rotateX(-Math.PI / 2); // Z arriba -> Y arriba
    g.computeVertexNormals();
    g.computeBoundingBox();
    cache[p.file] = g;
    edgeCache[p.file] = new THREE.EdgesGeometry(g, 38);
  }));
}

export function createBlueprint(host, labelHost) {
  const W = host.clientWidth, H = host.clientHeight;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H);
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const amb = new THREE.AmbientLight(0xf2f2f2, 1.4);
  const dir1 = new THREE.DirectionalLight(0xffffff, 1.35);
  dir1.position.set(-180, 260, 320);
  const dir2 = new THREE.DirectionalLight(0x189150, 0.55);
  dir2.position.set(220, -140, 200);
  scene.add(amb, dir1, dir2);

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

  const meshes = PARTS.map((p) => {
    const g = cache[p.file];
    const eg = edgeCache[p.file];
    const grp = new THREE.Group();
    const fill = new THREE.Mesh(g, new THREE.MeshLambertMaterial({
      color: p.fill,
      transparent: true, opacity: Math.min(1, p.fillOp + 0.25), depthWrite: p.key !== 'botella', side: THREE.DoubleSide,
    }));
    const edges = new THREE.LineSegments(eg, new THREE.LineBasicMaterial({ color: p.line, transparent: true, opacity: 0.42 }));
    grp.add(fill, edges);
    grp.userData = {
      ...p, fillMat: fill.material, lineMat: edges.material,
      top: g.boundingBox.max.y, bottom: g.boundingBox.min.y,
    };
    spin.add(grp);
    return grp;
  });

  // creatina: bolitas de arcilla dentro de la cámara
  const grains = new THREE.Group();
  const gMat = new THREE.MeshLambertMaterial({ color: 0xf2f2f2 });
  for (let i = 0; i < 45; i++) {
    const m = new THREE.Mesh(sharedSphereGeo, gMat);
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
    const lx = W * 0.72, ly = 110 + (H - 220) * (1 - i / (PARTS.length - 1));
    d.style.transform = `translate3d(${lx + 14}px, ${ly - 24}px, 0)`;
    labelHost.appendChild(d);
    return d;
  });
  const lines = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  lines.setAttribute('class', 'bp-lines');
  lines.setAttribute('viewBox', `0 0 ${W} ${H}`);
  lines.innerHTML = PARTS.map(() => '<path fill="none" stroke="#f2f2f2" stroke-width="2" stroke-dasharray="6 6" opacity="0"/><circle r="5" fill="#e11d38" opacity="0"/>').join('');
  labelHost.appendChild(lines);
  const lp = [...lines.querySelectorAll('path')];
  const lc = [...lines.querySelectorAll('circle')];

  const st = { explode: 0, rot: 0, auto: 1, press: 0, fall: 0, safety: 0, labels: 0, shakeA: 0, intro: 0 };
  const v = new THREE.Vector3();
  let lastZoom = -1;
  let labelsVisible = false;

  function apply() {
    const t = performance.now() / 1000;
    const targetZoom = 1.6 - 0.6 * st.explode;
    if (Math.abs(targetZoom - lastZoom) > 0.0005) {
      camera.zoom = targetZoom;
      camera.updateProjectionMatrix();
      lastZoom = targetZoom;
    }
    root.position.y = -(64 + 64 * st.explode);
    spin.rotation.y = st.rot + st.auto * t * 0.45;
    root.rotation.z = st.shakeA > 0.001 ? Math.sin(t * 38) * 0.05 * st.shakeA : 0;
    const sc = 0.6 + 0.4 * st.intro;
    const visMesh = st.intro > 0.01;
    for (let i = 0; i < meshes.length; i++) {
      const m = meshes[i];
      let y = m.userData.explode * st.explode;
      if (m.userData.key === 'pulsador') y -= 13 * st.press;
      if (m.userData.key === 'pinza') {
        m.position.x = 70 * st.safety;
        m.rotation.z = -st.safety * 0.35;
        m.userData.lineMat.opacity = 0.42 * (1 - st.safety);
        m.userData.fillMat.opacity = m.userData.fillOp * (1 - st.safety);
      }
      m.position.y = y;
      m.scale.setScalar(sc);
      m.visible = visMesh;
    }
    grains.position.y = meshes[1].position.y;
    const showGrains = st.intro > 0.5;
    grains.visible = showGrains;
    if (showGrains && st.fall > 0.001) {
      const ch = grains.children;
      for (let i = 0; i < ch.length; i++) {
        const g = ch[i];
        const k = Math.min(1, Math.max(0, st.fall * 1.6 - (i % 10) * 0.06));
        g.position.y = g.userData.home.y - k * (40 + (i % 7) * 6);
        g.position.x = g.userData.home.x * (1 + k * 1.6);
        g.position.z = g.userData.home.z * (1 + k * 1.6);
      }
    }
    // actualizar etiquetas en DOM solo cuando están visibles
    if (st.labels > 0.005) {
      labelsVisible = true;
      for (let i = 0; i < meshes.length; i++) {
        const m = meshes[i];
        v.set(24, (m.userData.top + m.userData.bottom) / 2, 0);
        m.localToWorld(v);
        v.project(camera);
        const x = (v.x * 0.5 + 0.5) * W, y = (-v.y * 0.5 + 0.5) * H;
        const lx = W * 0.72, ly = 110 + (H - 220) * (1 - i / (PARTS.length - 1));
        const vis = st.labels * (m.userData.key === 'pinza' ? 1 - st.safety : 1);
        labels[i].style.opacity = vis;
        lp[i].setAttribute('d', `M${x.toFixed(1)} ${y.toFixed(1)} L${(lx - 40).toFixed(1)} ${ly.toFixed(1)} L${lx.toFixed(1)} ${ly.toFixed(1)}`);
        lp[i].style.opacity = vis;
        lc[i].setAttribute('cx', x.toFixed(1));
        lc[i].setAttribute('cy', y.toFixed(1));
        lc[i].style.opacity = vis;
      }
    } else if (labelsVisible) {
      labelsVisible = false;
      for (let i = 0; i < meshes.length; i++) {
        labels[i].style.opacity = 0;
        lp[i].style.opacity = 0;
        lc[i].style.opacity = 0;
      }
    }
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
      meshes.forEach((m) => { m.userData.fillMat.dispose(); m.userData.lineMat.dispose(); });
      gMat.dispose();
      renderer.domElement.remove();
      labels.forEach((l) => l.remove());
      lines.remove();
    },
  };
}
