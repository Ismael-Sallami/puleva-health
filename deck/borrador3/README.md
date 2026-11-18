# Puleva Health · Borrador 3 · "Claymorphism de la final"

Presentación para la final, montada sobre `presentacion/guion.md`, manteniendo íntegro el contenido, estructura, pasos, audio y animaciones del Borrador 2 pero con estética **Claymorphism (arcilla / plastilina 3D suave)**: superficies infladas con bordes muy redondeados, doble bisel interior (luz superior-izquierda + sombra inferior-derecha), sombras exteriores difusas, ilustraciones vectoriales volumétricas y el modelo 3D del Crea-Snap iluminado con acabado mate tipo arcilla.

```bash
cd deck/borrador3
npm install
npm run dev        # http://127.0.0.1:5195
npm run build && npm run preview   # versión final
```

## Controles

Al abrirla aparece una pantalla de inicio: **«Empezar en pantalla completa»** (o Enter/F) la pone a pantalla completa y activa el sonido. **«Seguir en ventana»** (o Esc) arranca sin pantalla completa. Durante la presentación, `F` o el botón ⛶ de la esquina, que aparece al mover el ratón, alternan el modo. El contenido se escala a cualquier pantalla en 16:9 con márgenes de seguridad.

`→` / espacio / clic: siguiente · `←`: atrás · `F`: pantalla completa · `P`: vista de ponente (notas del guion, cronómetro que se pone rojo a partir de 9:00, saltar a cualquier página) · `M`: sonido · `B`: negro · `H`: ayuda. La URL guarda la posición (`#página.paso`).

## Revisión de la final (páginas añadidas)

- **¿Por qué estos tres?** (tras Daily): la figura 1 del informe se dibuja en directo. Primero salen las barras de venta por segmento (NielsenIQ 2026), luego se pintan de verde las que cubre Daily (33,0 M€, el 28 % del mercado) y al final aparecen los déficits del estudio ANIBES (Olza et al., 2017) y el dato de magnesio en farmacia (IQVIA 2026).
- **ClearPro** pasa a tener página propia (tras Active), con el cierre de la madre de Álex y el sello CONSUMIDOR ✓.
- **1 M€ para que nos vean** (abre el bloque Lactalis, antes del break-even): Roberto Leal y SofiG con fotos reales (`public/img/embajadores/`), sus botes, microinfluencers, amplificación y la barra 600/300/100 k€. *Sujeto a negociación.*
- Código: `src/extra-slides.js`. Foto de Roberto Leal: Wikimedia Commons, CC BY 3.0 (FEBHI). Foto de SofiG: su canal oficial; solo para uso interno.
- **Lactalis**: la gráfica tiene ejes con unidades (millones de € · años desde el lanzamiento), el EBITDA está en la misma escala que la venta neta y debajo de cada año aparecen el mercado de referencia (135,0 / 151,2 / 166,3 M€, NielsenIQ + crecimiento) y la cuota (4 / 8 / 13 %). Además, un chip con el caso base: margen de Puleva del 15 % en Daily y del 10 % en Active (Danone: 8,5 % operativo en lácteos). El sello LACTALIS ✓ sale al final de esta página.
- **Se quita «¿Quién lo lleva?»** para ganar tiempo.
- **Apéndice** (después del Gracias, para las preguntas): A1 Figura 7 con break-even, EBITDA e inversión a recuperar; A2 Tabla 7 completa y las 5 hipótesis; A3 Tabla 8 de sensibilidad. Desde la vista de ponente (`P`) se puede saltar directo a cada una.
- **Precios de ClearPro revisados**: el informe hablaba de «menos de la mitad que un batido RTD de referencia (4 €)», que no se sostiene con precios reales. La página compara ahora ClearPro (2,19 €) con Myprotein Clear (≈3,00 €, online), YoPro de Danone (2,69 €, Carrefour) y el batido de Mercadona (≈1,40 €), consultados en noviembre de 2026. También se ha corregido en `presentacion/guion.md`, `reparto.md` y `preguntas.md`.
- **Embajadores con público objetivo** (apartado 1.3 del informe): Daily, adultos de 30–55 años y familias; Active, jóvenes activos de 18–35 años.
- **Lactalis más limpia**: fuera el deslizador (la sensibilidad está en el apéndice A3) y los chips. Las hipótesis del caso base van en un recuadro: mercado NielsenIQ, cuota, márgenes (15 % Daily / 10 % Active) e inversión.
- **Fuentes en cada página**: etiqueta «DATOS» en la esquina inferior derecha con los estudios de mercado y las tablas del informe (propiedad `src` de cada página, al final de `slides.js`).
