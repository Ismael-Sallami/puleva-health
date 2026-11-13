# Puleva Health · Presentación a directivos

Presentación web del Grupo 6 (IV Hackathon UGR × Lactalis Puleva). Cada pulsación de **→** dispara un gesto: el bote cae en seco, la leche se vierte, el tapón se enrosca, un lápiz escribe, un rotulador rodea… y entre diapositivas **la pantalla se inunda de leche** (simulación de fluidos en tiempo real en la GPU) que escurre y deja ver la siguiente.

## Arrancar

```bash
cd deck/borrador1
npm install
npm run dev          # http://localhost:5180
# versión final, sin servidor de desarrollo:
npm run build && npm run preview
```

`dist/` es estático: se puede abrir desde cualquier servidor o subir a GitHub Pages.

## Controles

Al abrirla aparece una pantalla de inicio: **«Empezar en pantalla completa»** (o Enter/F) la pone a pantalla completa y activa el sonido. **«Seguir en ventana»** (o Esc) arranca sin pantalla completa. Durante la presentación, `F` o el botón ⛶ de la esquina, que aparece al mover el ratón, alternan el modo. El contenido se escala a cualquier pantalla en 16:9 con márgenes de seguridad, así que nada se sale por los lados.

| Tecla | Acción |
| --- | --- |
| `→` `espacio` `Enter` `clic` | siguiente animación (si una está en curso, la completa) |
| `←` `clic derecho` | paso anterior |
| `F` | pantalla completa |
| `P` | abre la **vista de ponente** (notas, cronómetro, siguiente, saltar a cualquier diapositiva) |
| `M` | silenciar / activar sonido |
| `B` o `.` | pantalla en negro |
| `H` | ayuda |
| `Inicio` / `Fin` | primera / última diapositiva |

La URL guarda la posición (`#diapositiva.paso`): si recargas, vuelves al mismo sitio.
Los mandos de presentación (los "punteros" con flechas o AvPág/RePág) funcionan sin configurar nada.

**Antes de presentar:** pulsa una tecla una vez para que el navegador active el audio; usa Chrome o Edge a pantalla completa.

## El guion (15 diapositivas)

| # | Diapositiva | Ponente | Qué pasa |
| --- | --- | --- | --- |
| 1 | El botiquín | Ismael | Un lápiz escribe la pregunta; se abre un botiquín, saltan las cápsulas, se tacha |
| 2 | Puleva Health | Ismael | Bote 3D: cae, se llena de leche, se enrosca el tapón, se viste la etiqueta |
| 3 | El lineal de hoy | Ismael | Caen el bote de cápsulas, el bote de 1 kg (con polvo) y la interrogación |
| 4 | La oportunidad | Ismael | Pictograma 7–8 de cada 10, contador de 119,5 M€, vasos de leche que se llenan |
| 5 | El insight | Ismael | La cita aparece palabra a palabra, se subraya, cronómetro de 10 s, "del botiquín → a la nevera" |
| 6 | Una submarca, dos líneas | Jesús | Árbol de marca que se dibuja y los cinco shots que caen |
| 7 | Daily | Jesús | Paneles de color, cada shot cae con su precio y su lema a mano |
| 8 | Active | Jesús | Crea-Snap y ClearPro + barras de precio frente al batido de 4 € |
| 9 | Crea-Snap | Jesús | CREATINA → CREATININA, pulsa · agita · entrena con el polvo cayendo |
| 10 | Espacio libre | David | Mapa de posicionamiento; Puleva Health aterriza en el hueco con salpicadura de leche |
| 11 | Dónde se compra | David | Donut 90/10, tres puntos de contacto, canales descartados tachados |
| 12 | Campaña | David | 1.000.000 € en contador, embajadores, calendario que recorre una gota |
| 13 | Business case | David | Barras de venta neta, línea de EBITDA y "mes 29" rodeado a mano |
| 14 | Lo construimos | Todos | Informe, web 3D y el spot de 67 s a pantalla completa |
| 15 | Cierre | Todos | Llueven los cinco shots, "Salud que se bebe" y la leche inunda todo: Gracias |

Todas las cifras salen del informe (`media/PulevaHealth_Grupo6.pdf`). Las notas del ponente de cada diapositiva están en `src/slides.js` y se ven en la vista de ponente.

## Cómo está hecho

- `src/fluid.js`: leche de verdad. Simulación Navier-Stokes en WebGL2 con gravedad, sombreado y brillo húmedo. Salpica, gotea y hace de transición.
- `src/bottle3d.js`: bote 3D en Three.js (PET translúcido, leche con plano de corte, tapón con estrías, etiqueta que se envuelve).
- `src/fx.js`: lápiz que escribe con los trazos reales de la fuente Caveat, rotulador que rodea, subraya o tacha, caídas con aplastamiento, contadores y partículas (GSAP: DrawSVG, SplitText, Physics2D, ScrambleText).
- `src/sfx.js`: todos los sonidos se sintetizan con Web Audio, sin archivos: golpe del bote, vertido con gluglú, carraca del tapón, lápiz, rotulador, polvo, caja registradora…
- `src/slides.js`: el guion. Cada diapositiva tiene HTML y una lista de pasos.
- `src/main.js`: navegación, transición de leche, escalado 16:9 a cualquier pantalla y vista de ponente sincronizada (`BroadcastChannel`).
