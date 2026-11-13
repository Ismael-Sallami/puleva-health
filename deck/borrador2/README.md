# Puleva Health · Borrador 2 · "Fanzine de la final"

Presentación para la final, montada sobre `presentacion/guion.md`, con estética de **fanzine impreso en risógrafo**: papel con grano, tintas fluorescentes (azul Puleva, rosa y amarillo), tramas de puntos y tintas que entran desregistradas y "casan". Para pasar de página, **un rodillo de imprenta baja e imprime la siguiente**.

```bash
cd deck/borrador2
npm install
npm run dev        # http://localhost:5190
npm run build && npm run preview   # versión final
```

## Controles

Al abrirla aparece una pantalla de inicio: **«Empezar en pantalla completa»** (o Enter/F) la pone a pantalla completa y activa el sonido. **«Seguir en ventana»** (o Esc) arranca sin pantalla completa. Durante la presentación, `F` o el botón ⛶ de la esquina, que aparece al mover el ratón, alternan el modo. El contenido se escala a cualquier pantalla en 16:9 con márgenes de seguridad, así que nada se sale por los lados.

`→` / espacio / clic: siguiente · `←`: atrás · `F`: pantalla completa · `P`: vista de ponente (notas del guion, cronómetro que se pone rojo a partir de 9:30, saltar a cualquier página) · `M`: sonido · `B`: negro · `H`: ayuda. La URL guarda la posición (`#página.paso`).

## Novedades de la vuelta 2

- **Portada impresa**: antes de empezar, la risógrafo imprime la portada en tres pasadas de tinta (amarillo, rosa, azul) con marcas de registro, y caen los botes.
- **Una mano coloca los cromos** de Daily y los aprieta contra el álbum; al darse la vuelta tienen **brillo holográfico**.
- **La página de preguntas se rasga** por la mitad y debajo aparece la portada PULEVA HEALTH.
- **Frenos con derrape**: marcas de neumático y chirrido antes de cada señal.
- **Lactalis**: las barras de venta neta son **bricks de leche apilados que caen** (1 brick = 1 M€) y el **mes 29** llega con un calendario que pasa hoja a hoja.
- **Salpicaduras de tinta** en cada sello y **confeti riso** en el Gracias.
- Botes: los renders de la web. Fotos del lineal: las originales del informe, en color y nítidas.
- **Spot nuevo "10 SEGUNDOS" (22 s)**, que sustituye al de 67 s.

## Spot "10 SEGUNDOS"

*"Este anuncio dura lo mismo que cuidarte."* Un cronómetro gigante cuenta 10 → 0 en tiempo real mientras ocurre el ritual: abres la nevera, coges el Now, destapas, bebes… y el sello de HECHO. Después vienen *"Diez segundos. Sin pastillas. Sin polvos."* y la portada que imprime el rodillo: *"Puleva Health. Salud que se bebe."*

- Archivo: `public/img/spot10.mp4` (1080p, 30 fps, 22,5 s). Sale en el último paso de la página final.
- Página de la animación: `spot.html` (se puede ver en directo en `http://localhost:5190/spot.html`).
- Voz: `es-ES-XimenaNeural` (voz neuronal de Microsoft vía `edge-tts`). Música y efectos sintetizados a medida en `spot-tools/audio.py`.
- Para regenerarlo, por ejemplo al cambiar una frase o la voz: `spot-tools/hacer_spot.sh` (usa `VOZ=es-ES-AlvaroNeural ./hacer_spot.sh` para voz masculina).

## Las 13 páginas

| # | Página | Ponente | Tiempo | Qué pasa |
|---|---|---|---|---|
| 0 | Portada | — | antes de empezar | Se imprime en tres pasadas de tinta |
| 1 | Una familia | P1 | 0:00–1:05 | Álex y Carmen ilustrados, el bote de 1 kg cae, el reloj gira hasta las 16:00, bocadillos de cómic, "¿A cuántos os suena…?" |
| 2 | La nevera | P1 | 1:05–1:15 | Se abre la nevera con luz y aparece la leche Puleva |
| 3 | El lineal | P1 | 1:15–1:55 | Las fotos reales del lineal (del informe), pegadas con celo, y el sello "farmacia sin farmacéutico" |
| 4 | Tres frenos | P1 | 1:55–2:30 | Derrape, chirrido y tres señales de stop que se estampan |
| 5 | La idea | P2 | 2:30–3:15 | Preguntas "¿y si…?", la página se rasga y aparece la portada PULEVA HEALTH, caen los 5 botes y aparecen los 3 compradores |
| 6 | Daily · Carmen | P2 | 3:15–4:15 | Cromos de Now, Care y Shield que se estampan en el álbum y se dan la vuelta |
| 7 | Active · Álex | P2 | 4:15–5:15 | **Plano 3D del Crea-Snap con los STL reales impresos**: se despieza, se monta, se pulsa y cae la creatina (plan B de la demo) + ClearPro + sello CONSUMIDOR ✓ |
| 8 | Por qué Puleva | P3 | 5:15–6:00 | 3 claves + mapa del tesoro: "aquí no hay nadie" y Puleva Health cae en la X |
| 9 | Súper | P3 | 6:00–7:00 | Ticket de caja que se imprime, plano de tienda, canales descartados, calendario + SÚPER ✓ |
| 10 | Lactalis | P1 | 7:00–8:15 | Papel milimetrado, barras, EBITDA, mes 29, pósits y un **deslizador de cuota que se puede tocar** (11/13/15 %) |
| 11 | Quién lo lleva | P1 | 8:15–8:45 | Organigrama de la unidad + LACTALIS ✓ |
| 12 | Un martes | P2 | 8:45–9:30 | Tira cómica de 3 viñetas, "Nadie ha tomado una pastilla…", portada final y Gracias. Un paso más reproduce el spot de 22 s |

El marcador "Hay que convencer a: Consumidor · Súper · Lactalis" se queda en la esquina desde la página 5 y se va sellando.

Todas las cifras salen del informe y del guion. Se respetan las reglas del discurso: nada de enfermedades, nada de "como un Actimel", y los embajadores siempre con "como" y "sujeto a negociación".

## Archivos

- `src/slides.js`: las 13 páginas, sus pasos y las notas (el texto del guion).
- `src/illus.js`: ilustraciones vectoriales (Álex, Carmen, nevera, reloj, bote, leche).
- `src/blueprint.js`: el plano 3D a partir de `public/models/*.stl` (copiados de `modelos3d/Export_3D_Active_CreaSnap`).
- `src/fx.js`: sellos, tintas desregistradas, rotulador, cinta adhesiva, caídas, contadores.
- `src/sfx.js`: sonidos sintetizados (sello, impresora de tickets, rodillo, cromo, volteo, celo, reloj…).
- `public/img/lineal*.png`: fotos del lineal del informe pasadas a trama riso.
- `public/img/{care,now,shield,creasnap,clearpro}.png`: los renders de las etiquetas recortados.
