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

`→` / espacio / clic: siguiente · `←`: atrás · `F`: pantalla completa · `P`: vista de ponente (notas del guion, cronómetro que se pone rojo a partir de 9:30, saltar a cualquier página) · `M`: sonido · `B`: negro · `H`: ayuda. La URL guarda la posición (`#página.paso`).
