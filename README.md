# Puleva Health · Salud que se bebe

**[🌐 Ver la web →](https://ismael-sallami.github.io/puleva-health/)** &nbsp;·&nbsp; **[📄 Descargar el informe (PDF)](https://ismael-sallami.github.io/puleva-health/media/PulevaHealth_Grupo6.pdf)**

[![Puleva Health: Salud que se bebe](media/poster.jpg)](https://ismael-sallami.github.io/puleva-health/)

Propuesta del **Grupo 6** para el **Hackathon de Innovación UGR × Lactalis Puleva 2026 (4.ª edición)**. El reto era diseñar cómo podría entrar Lactalis Puleva en el mercado de los complementos nutricionales de hipermercados y supermercados.

La respuesta es **Puleva Health**: complementos naturales en **monodosis líquidas**, al estilo de un Actimel, organizados en dos líneas complementarias.

| Línea | Productos | Para qué |
| --- | --- | --- |
| **Daily** · salud y prevención | Care (piel), Now (concentración), Shield (defensas, con lactoferrina) | Cuidarse cada día, en la nevera de lácteos |
| **Active** · rendimiento | Crea-Snap (creatina en el tapón), ClearPro (proteína *clear*) | Deporte, sin bote ni báscula |

## Qué hay en la web

- **Botes en 3D** con Three.js: tienen volumen, brillo en la etiqueta y se recolocan al hacer scroll sobre una ola de leche animada.
- **Spot de 67 segundos** hecho con Remotion (React), con voz neuronal sintética, música generada por código y subtítulos sincronizados palabra a palabra.
- **"Un día con Puleva Health"**: un recorrido horizontal del desayuno al gimnasio, con el cielo cambiando de hora.
- La demo de **Crea-Snap**: por qué la creatina va en el tapón y no disuelta.
- Las cifras del business case, el go to market y la autoevaluación del reto.

## Ejecutarla en local

Es una web estática sin dependencias de compilación:

```bash
python3 -m http.server 8000
# y abre http://localhost:8000
```

## Presentaciones de la final

Dos versiones de la presentación para los directivos, en `deck/`. Se publican compiladas junto a la web:

| Versión | Estilo | Ver online |
| --- | --- | --- |
| **Borrador 2** · "Fanzine de la final" | Risógrafo: papel, tintas fluorescentes, cómic. Sigue el guion de `presentacion/guion.md` (9:30, 3 ponentes) | [Abrir](https://ismael-sallami.github.io/puleva-health/deck/borrador2/) · [Spot "10 SEGUNDOS"](https://ismael-sallami.github.io/puleva-health/deck/borrador2/img/spot10.mp4) |
| **Borrador 1** | Oscura, con bote 3D y leche simulada en GPU | [Abrir](https://ismael-sallami.github.io/puleva-health/deck/borrador1/) |

Mejor en **Chrome o Edge**. Al abrirlas aparece una pantalla de inicio: **Empezar en pantalla completa** (o Enter) la pone a pantalla completa y activa el sonido.

### Cómo se maneja

| Tecla | Acción |
| --- | --- |
| `→` · espacio · clic | Siguiente animación |
| `←` · clic derecho | Paso anterior |
| `F` o botón ⛶ | Pantalla completa |
| `P` | Vista de ponente: notas del guion, cronómetro y saltar a cualquier diapositiva (ábrela en el portátil y proyecta la otra ventana) |
| `M` | Sonido sí / no |
| `B` | Pantalla en negro |
| `H` | Ayuda |

Los mandos de presentación (los que tienen flechas o AvPág/RePág) funcionan sin configurar nada. La URL guarda dónde vas (`#diapositiva.paso`).

### Ejecutar y compilar en local

Hace falta [Node.js](https://nodejs.org) 18 o superior.

```bash
cd deck/borrador2          # o deck/borrador1
npm install                # solo la primera vez
npm run dev                # modo desarrollo: borrador2 → http://localhost:5190 · borrador1 → http://localhost:5180
npm run build              # versión final en dist/ (estática, se abre desde cualquier servidor)
npm run preview            # sirve dist/ para comprobarla
```

`dist/` funciona en cualquier carpeta de cualquier servidor estático, sin internet. Para presentar sin conexión: `npm run build && npm run preview`, o copiar `dist/` a un pendrive y servirla con `python3 -m http.server`.

Al hacer push a `main`, GitHub Actions compila las dos y las publica en la web (`.github/workflows/deploy.yml`).

### El spot "10 SEGUNDOS"

Está en `deck/borrador2/public/img/spot10.mp4` (22 s, 1080p) y sale al final del borrador 2. Para regenerarlo, por ejemplo cambiando una frase o la voz, usa `deck/borrador2/spot-tools/hacer_spot.sh`. Sus requisitos y opciones están en `deck/borrador2/README.md`.

Cada borrador tiene su propio `README.md` con el detalle de diapositivas, archivos y efectos.

## Equipo

David Bacas Posadas · Ismael Sallami Moreno · Jesús Rodríguez González
Doble Grado en Ingeniería Informática y ADE · Universidad de Granada · Dirección Estratégica I

---

> **Concepto académico.** No es una web oficial de Lactalis Puleva, ni está respaldada por la empresa: las marcas pertenecen a sus propietarios y los productos e imágenes son prototipos ficticios creados para el hackathon. La web no se indexa en buscadores.
>
> *Complemento alimenticio. No debe utilizarse como sustituto de una dieta equilibrada y un modo de vida sano.*
