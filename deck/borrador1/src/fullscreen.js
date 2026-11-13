// Modo pantalla completa: pantalla de inicio con botón y un botón discreto en la esquina.
export function setupFullscreen({ onStart } = {}) {
  const fs = () => !!document.fullscreenElement;
  const enter = () => document.documentElement.requestFullscreen?.().catch(() => {});
  const toggle = () => (fs() ? document.exitFullscreen() : enter());

  const css = document.createElement('style');
  css.textContent = `
  #fs-start { position: fixed; inset: 0; z-index: 200; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px;
    background: rgba(8,10,30,.86); backdrop-filter: blur(6px); cursor: auto; font-family: system-ui, sans-serif; color: #fff; }
  #fs-start h1 { font: 800 clamp(28px, 4vw, 56px)/1.05 system-ui, sans-serif; letter-spacing: -.02em; text-align: center; margin: 0 20px; }
  #fs-start p { opacity: .75; margin: 0; font-size: 16px; text-align: center; }
  #fs-start .row { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
  #fs-start button { font: 700 20px system-ui, sans-serif; padding: 16px 28px; border-radius: 14px; border: 0; cursor: pointer; }
  #fs-go { background: #FF48B0; color: #fff; box-shadow: 0 8px 0 #9c1c63; }
  #fs-win { background: rgba(255,255,255,.12); color: #fff; }
  #fs-btn { position: fixed; right: 16px; bottom: 16px; z-index: 150; width: 52px; height: 52px; border-radius: 14px; border: 0; cursor: pointer;
    background: rgba(10,12,40,.75); color: #fff; font-size: 26px; opacity: 0; transition: opacity .3s; pointer-events: none; }
  body.fs-mouse #fs-btn { opacity: 1; pointer-events: auto; }
  body.fs-mouse { cursor: auto !important; }`;
  document.head.appendChild(css);

  const start = document.createElement('div');
  start.id = 'fs-start';
  start.innerHTML = `<h1>Puleva Health · Salud que se bebe</h1>
    <div class="row"><button id="fs-go">⛶ Empezar en pantalla completa</button><button id="fs-win">Seguir en ventana</button></div>
    <p>Enter o F: pantalla completa · Esc: en ventana · durante la presentación, F alterna</p>`;
  document.body.appendChild(start);
  const btn = document.createElement('button');
  btn.id = 'fs-btn'; btn.title = 'Pantalla completa (F)'; btn.textContent = '⛶';
  document.body.appendChild(btn);

  let open = true;
  const close = (full) => {
    if (!open) return;
    open = false;
    if (full) enter();
    start.remove();
    onStart && onStart();
  };
  start.querySelector('#fs-go').onclick = (e) => { e.stopPropagation(); close(true); };
  start.querySelector('#fs-win').onclick = (e) => { e.stopPropagation(); close(false); };
  btn.onclick = (e) => { e.stopPropagation(); toggle(); };
  // mientras está la pantalla de inicio, las teclas no avanzan la presentación
  addEventListener('keydown', (e) => {
    if (!open) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (e.key === 'Enter' || e.key === 'f' || e.key === 'F' || e.key === ' ') close(true);
    else if (e.key === 'Escape') close(false);
  }, true);
  // el botón de la esquina aparece al mover el ratón
  let tm;
  addEventListener('mousemove', () => {
    document.body.classList.add('fs-mouse');
    clearTimeout(tm); tm = setTimeout(() => document.body.classList.remove('fs-mouse'), 2000);
  });
  return { toggle, isOpen: () => open };
}
