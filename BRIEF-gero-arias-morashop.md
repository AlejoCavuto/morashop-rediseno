# BRIEF — Landing “GERO ARIAS × MORASHOP”

> Documento de handoff para Claude Code. Contiene **todo** el contexto, datos y decisiones ya tomadas. Construir la landing siguiendo esta especificación.

---

## 0) PROMPT INICIAL (pegar en Claude Code)

> Quiero que construyas una landing page de la colaboración **GERO ARIAS × MORASHOP** para el e-commerce morashop.ar (está en Tiendanube). Es una página dedicada (URL pensada: `morashop.ar/gero-arias`) que se va a embeber como página personalizada en Tiendanube. **Mobile-first** (75% del tráfico es mobile). Entregar como sitio autocontenido (HTML/CSS/JS, idealmente un `index.html` + carpeta `assets/`), sin frameworks pesados salvo que haga falta. Seguí al pie de la letra el brief de abajo: marca, paleta, tipografías, estructura de secciones, copy aprobado y datos de producto (precios e imágenes reales ya incluidos). Las fotos de Gero te las adjunto como archivos. Arrancá proponiendo la estructura de archivos y el hero, y seguimos iterando.

---

## 1) QUÉ ES MORASHOP (la marca)

E-commerce argentino en **Tiendanube** (morashop.ar). Multi-rubro con **suplementos como eje**.

- **Rubros:** Suplementos (Star Nutrition, ENA, Gold Nutrition, Optimum, PGN — distribuidor oficial) · Supermercado/almacén fit · Electro-Hogar · El Bananero (cerveza Japi + picantes Terapia Picante, rubro rebelde/irreverente) · Bodega (vinos).
- **Tagline maestro:** `Comprar suplementos es Morashop.`
- **Objetivo de marca:** top-of-mind → que “comprar suplementos = Morashop” sea automático.
- **Tono:** argentino directo (de “vos”), tipo Mercado Libre / Coto. **NO** gringo aspiracional.
- **Mobile:** 75% del tráfico es mobile → **mobile-first sí o sí.**

### Paleta de marca (HEX reales del sitio)
| Color | Hex | Uso |
|---|---|---|
| Navy | `#1A2744` | Texto, header, precios |
| Rojo Morashop | `#E8341A` | CTAs, marca, acentos, badges OFF |
| Rojo profundo | `#C72D17` | Hover de botones |
| Verde | `#00A650` | Ahorros (efectivo, cuotas sin interés) |
| Fondo | `#ECEDEF` | Gris claro de página |
| Cards | `#FFFFFF` | Blanco |
| Gris texto | `#5B6472` | Tachados, texto suave |

### Tipografías
| Fuente | Uso |
|---|---|
| **Barlow Condensed** (Black / 900) | Títulos grandes, precios, botones COMPRAR |
| **Inter** | Body, nombres de producto, descripciones, cuotas |
| **Sora** | Títulos de sección |

Cargar de Google Fonts.

### Logo
Archivo: `morashop_logo__1_.png` (fondo navy, “m” manuscrita crema con sombra roja). Adjunto.

### Promos vigentes del sitio (para badges/strips, opcional)
- “Jueves de Suplementos · 10% OFF llevando 3+”
- “15% OFF efectivo / 5% OFF transferencia”
- “Hasta 3 cuotas sin interés”
- Envío gratis CABA/GBA superando $70.000

### Links reales de Morashop (usar en header/footer)
- Home: https://www.morashop.ar
- Suplementos: https://www.morashop.ar/suplementos/
- Supermercado: https://www.morashop.ar/supermercado/
- Electro-Hogar: https://www.morashop.ar/electro-hogar/
- El Bananero: https://www.morashop.ar/bananero1/
- Bodega: https://www.morashop.ar/bodega/
- WhatsApp: https://wa.me/541131373961
- Instagram: https://instagram.com/morashop.ar
- Facebook: https://www.facebook.com/morashop.ar
- YouTube: https://www.youtube.com/channel/UCWZTjnmVgJw-cmCSmyE5v4Q
- TikTok: https://www.tiktok.com/@morashop.ar

---

## 2) LA COLABORACIÓN

- **Nombre / wordmark:** `GERO ARIAS × MORASHOP`
- **URL sugerida:** `morashop.ar/gero-arias`
- **Identidad visual de la colab (del shaker):** sello circular con `366 DISCIPLINE` arriba, monograma **`GA`** (estilo gótico) al centro, y `GERO ARIAS × MORASHOP` abajo. Paleta del sello: **crema (~`#ECE3C8`) + rojo Morashop + negro**. Este sello es el elemento de identidad de la colab (se puede recrear en SVG y reutilizar como “estampa”).

---

## 3) QUIÉN ES GERO ARIAS (datos reales verificados)

- Influencer **puntano** (de San Luis). Su papá es el actor Gabriel Arias.
- Se hizo conocido por la **calistenia** y por su **reto de 366 dominadas**, que cerró en el **Obelisco** (carteles “366 / 366 — LA GLORIA SERÁ ETERNA”).
- Dio el salto al **boxeo**: le **ganó a Tomás Mazza** en **Párense de Manos 3** (dic. 2025). Se prepara para enfrentar a **Viruzz** en **La Velada del Año 6**. Declaró que su objetivo son los **Juegos Olímpicos 2028 (LA)**.
- Sello personal: **disciplina, superación y nutrición** tomadas en serio. Encaja perfecto con suplementos.
- **Redes de Gero** (para “seguí a Gero”): YouTube https://www.youtube.com/@geroariass · Instagram https://www.instagram.com/geroooo_arias · TikTok https://www.tiktok.com/@geroooo_ariass366

---

## 4) COPY APROBADO — Sección “¿QUIÉN ES GERO ARIAS?”

Usar este texto **tal cual** (ya fue aprobado):

> **¿QUIÉN ES GERO ARIAS?**
>
> Gero Arias es de esos que no entienden de atajos. Puntano, derecho y obsesionado con superarse, se ganó al país a pura disciplina: arrancó con la calistenia y se hizo leyenda el día que cerró su reto de 366 dominadas arriba del Obelisco —una por cada día del año, frente a una multitud—. Esa misma cabeza, la de no aflojar nunca, es la que hoy lo tiene peleando arriba del ring.
>
> Porque Gero dio el salto al boxeo y lo hizo en serio: le ganó a Tomás Mazza en Párense de Manos 3, se prepara para enfrentar a Viruzz en La Velada del Año 6 y no esconde su sueño más grande, los Juegos Olímpicos 2028. Pero atrás de cada pelea hay algo que la cámara no muestra: entrenamiento todos los días, descanso, cabeza y una nutrición tomada en serio. Y ahí es donde entra Morashop.
>
> Esta colaboración nace de algo simple. Gero entrena como pocos, y para bancar ese nivel necesita suplementos de verdad, sin vueltas ni promesas mágicas. Por eso armamos juntos su selección: los productos que usa en su día a día, los mismos que conseguís acá, al precio de siempre y con la confianza de siempre. Gero le mete la disciplina. Los suplementos los pone Morashop.

---

## 5) ESTRUCTURA DE LA PÁGINA (secciones, en orden)

1. **Top bar / nav** — wordmark `GERO ARIAS × MORASHOP` + logo Morashop + link “← Volver a morashop.ar”.
2. **Hero** — foto del Obelisco (brazos abiertos, multitud). Título gigante en Barlow Condensed Black. Eyebrow: `COLABORACIÓN OFICIAL · 366 DISCIPLINE`. CTA rojo “Ver los suplementos de Gero” (scroll a la grilla). Sello `GA` en una esquina.
3. **¿Quién es Gero Arias?** — copy aprobado (sección 4) + foto de la dominada en el Obelisco. Incluir un **palmarés/timeline real** (no inventar números): `366/366 dominadas — cumplido` · `Párense de Manos 3 — ganó` · `La Velada del Año 6 — próxima` · `Juegos Olímpicos 2028 — objetivo`.
4. **Boxeo — “Del Obelisco al ring”** — fotos de boxeo callejero + la del globo aerostático como “no le esquiva a nada”.
5. **Suplementos elegidos por Gero** — grilla de **9 productos** (datos en sección 6). Acá la página adopta el **look de tienda Morashop** (fondo `#ECEDEF`, cards blancas): precio en navy (Barlow), precio con efectivo en verde, cuotas en gris, botón rojo **“Comprar”** que linkea al producto (`target="_blank"`).
6. **Shaker “366 DISCIPLINE”** — destacar el shaker con su sello. Estado **“Próximamente”** (sin botón de compra todavía). Ver sección 7 (3D).
7. **Videos de YouTube** — 4 cards con thumbnail + link (datos en sección 8).
8. **Ropa / Merch** — teaser **“Próximamente”** (sin productos aún).
9. **Footer Morashop** — tagline grande `Comprar suplementos es Morashop.` + links + redes (sección 1).

### Dirección de diseño
- Doble registro intencional: **parte “Gero” oscura y cinematográfica** (tipo afiche de pelea, negro/navy + crema + rojo) y **parte “tienda” clara y limpia** (look real de Morashop) para los suplementos → da confianza de compra y se siente nativo del shop.
- **Elemento de firma:** el sello `GA / 366 DISCIPLINE` (SVG) + un **riel “366 · LA GLORIA SERÁ ETERNA”** como divisor (referencia directa a los carteles del Obelisco). El “366” es un device legítimo porque es real de su historia, no numeración decorativa.
- Display: **Barlow Condensed Black** en tamaños grandes (energía de afiche).
- **Motion sutil:** reveal on-scroll, leve float del shaker, hover en cards. Respetar `prefers-reduced-motion`. Accesibilidad: foco visible.

---

## 6) PRODUCTOS — “Elegidos por Gero” (datos REALES)

Precios e imágenes levantados de morashop.ar. **Efectivo = 15% OFF** sobre el precio; **3 cuotas sin interés = precio/3**. Los precios pueden cambiar: dejarlos en un **array/JSON editable** (abajo) para actualizarlos fácil (o más adelante levantarlos de la API de Tiendanube).

| # | Producto | Tag | Precio | Con efectivo (-15%) | 3 cuotas s/interés |
|---|---|---|---|---|---|
| 1 | L-Citrulline 300g Star Nutrition | Pre-entreno · Óxido nítrico | $59.448 | $50.531 | $19.816 |
| 2 | Omega 3 Max 1000 EPA + 500 DHA Innovanaturals 60caps | Salud · Omega-3 | $82.294 | $69.950 | $27.431 |
| 3 | C4 Ultimate Preworkout Cellucor | Pre-entreno | $111.851 | $95.073 | $37.284 |
| 4 | Granger Pancake Proteico Dulce de Leche 300g | Desayuno proteico | $13.349 | $11.347 | $4.450 |
| 5 | Granger Pancakes Proteicos Vainilla 400g | Desayuno proteico | $13.349 | $11.347 | $4.450 |
| 6 | Star Nutrition Platinum Whey Protein 907g | Proteína | $71.211 | $60.529 | $23.737 |
| 7 | ZMA Star Nutrition x90 caps | Descanso · Recuperación | $16.433 | $13.968 | $5.478 |
| 8 | Animal Pak en Polvo 44 scoops 383g Universal | Multivitamínico | $103.455 | $87.937 | $34.485 |
| 9 | ENA Sport Creatina Micronizada 300g | Creatina | $24.694 | $20.990 | $8.231 |

### JSON listo para usar
```json
[
  {
    "nombre": "L-Citrulline 300g Star Nutrition",
    "tag": "Pre-entreno · Óxido nítrico",
    "precio": 59448, "efectivo": 50531, "cuota3": 19816,
    "img": "https://acdn-us.mitiendanube.com/stores/002/268/228/products/l-citrulline-300-gr-star-nutrition-citrulina-malato-pre-entreno-oxido-nitrico-750ae7be0a0bbcf56a17049828706844-640-0.webp",
    "link": "https://www.morashop.ar/productos/l-citrulline-300-gr-star-nutrition-citrulina-malato-pre-entreno-oxido-nitrico/"
  },
  {
    "nombre": "Omega 3 Max 1000 EPA + 500 DHA Innovanaturals 60caps",
    "tag": "Salud · Omega-3",
    "precio": 82294, "efectivo": 69950, "cuota3": 27431,
    "img": "https://acdn-us.mitiendanube.com/stores/002/268/228/products/omega-3-max-1000-epa-500-dha-innovanaturals-60caps-ifos-goed-454c3b5ca9a3b85c6d17659080390301-640-0.webp",
    "link": "https://www.morashop.ar/productos/omega-3-max-1000-epa-500-dha-innovanaturals-60caps-ifos-goed/"
  },
  {
    "nombre": "C4 Ultimate Preworkout Cellucor",
    "tag": "Pre-entreno",
    "precio": 111851, "efectivo": 95073, "cuota3": 37284,
    "img": "https://acdn-us.mitiendanube.com/stores/002/268/228/products/c4-ultimate-pre-workout-powder-icy-blue-razz-c56cb8982f7453eda017518961568769-640-0.webp",
    "link": "https://www.morashop.ar/productos/c4-ultimate-preworkout-cellucor-6s4ut/"
  },
  {
    "nombre": "Granger Pancake Proteico Dulce de Leche 300g",
    "tag": "Desayuno proteico",
    "precio": 13349, "efectivo": 11347, "cuota3": 4450,
    "img": "https://acdn-us.mitiendanube.com/stores/002/268/228/products/d_758169-mla112406319643_052026-o-95a74d76d478ab1d7317803328911087-640-0.webp",
    "link": "https://www.morashop.ar/productos/granger-pancake-proteico-300g-dulce-de-leche-c7qzf/"
  },
  {
    "nombre": "Granger Pancakes Proteicos Vainilla 400g",
    "tag": "Desayuno proteico",
    "precio": 13349, "efectivo": 11347, "cuota3": 4450,
    "img": "https://acdn-us.mitiendanube.com/stores/002/268/228/products/d_831301-mla106122704302_022026-o-1b6de99bd2bdbc956517733355623324-640-0.webp",
    "link": "https://www.morashop.ar/productos/pancakes-proteicos-sabor-vainilla-granger-400-g-yuams/"
  },
  {
    "nombre": "Star Nutrition Platinum Whey Protein 907g",
    "tag": "Proteína",
    "precio": 71211, "efectivo": 60529, "cuota3": 23737,
    "img": "https://acdn-us.mitiendanube.com/stores/002/268/228/products/31-eb5d41310c156ecde816686054084737-1024-1024.webp",
    "link": "https://www.morashop.ar/productos/suplemento-en-polvo-star-nutrition-platinum-whey-protein-907g/"
  },
  {
    "nombre": "ZMA Star Nutrition x90 caps",
    "tag": "Descanso · Recuperación",
    "precio": 16433, "efectivo": 13968, "cuota3": 5478,
    "img": "https://acdn-us.mitiendanube.com/stores/002/268/228/products/sdd-4fc77a55da63bc4e5716972234143459-640-0.webp",
    "link": "https://www.morashop.ar/productos/zma-star-nutrition-zinc-magnesio-y-vitamina-b6-x-90-capsulas-sabor-sin-sabor/"
  },
  {
    "nombre": "Animal Pak en Polvo 44 scoops 383g Universal",
    "tag": "Multivitamínico",
    "precio": 103455, "efectivo": 87937, "cuota3": 34485,
    "img": "https://acdn-us.mitiendanube.com/stores/002/268/228/products/animal-pak-383g-berries-5030a08388980ae12217597713533198-640-0.webp",
    "link": "https://www.morashop.ar/productos/animal-pak-en-polvo-44-scoops-383-g-universal/"
  },
  {
    "nombre": "ENA Sport Creatina Micronizada 300g",
    "tag": "Creatina",
    "precio": 24694, "efectivo": 20990, "cuota3": 8231,
    "img": "https://acdn-us.mitiendanube.com/stores/002/268/228/products/suplemento-en-polvo-ena-sport-creatina-micronizada-300g-sabor-1d2513142816483a1c16965538195786-640-0.webp",
    "link": "https://www.morashop.ar/productos/suplemento-en-polvo-ena-sport-creatina-micronizada-sabor-neutro-en-sachet-de-300g1/"
  }
]
```
> Formato de precio ARS: `$59.448` (miles con punto). Efectivo y cuotas se pueden mostrar redondeados a peso.
> Nota: las imágenes de producto se sirven desde el CDN de Tiendanube (`acdn-us.mitiendanube.com`) → se referencian directo, no hace falta descargarlas.

---

## 7) SHAKER (3D) — “Próximamente”

- Estado: **diseño cerrado, NO a la venta todavía** → mostrar como **“Próximamente”**, sin botón de compra.
- Imagen actual: `1782085885510_image.png` (shaker negro con sello `366 DISCIPLINE / GA`). Adjunta. Usar como placeholder/visual mientras no esté el 3D.
- **3D:** el modelo se está haciendo en **Blender**. Cuando esté, exportar como **`.glb`** (glTF binario, con texturas embebidas / “Include → Textures”).
  - Integración sugerida: **`<model-viewer>`** de Google (fácil, mobile-friendly, soporta auto-rotate y gestos) o **three.js** si se quiere más control.
  - Dejar el componente preparado para recibir `shaker.glb` (placeholder ahora = la imagen PNG).

---

## 8) VIDEOS DE YOUTUBE (4)

Cards con thumbnail + link (abrir en nueva pestaña). Thumbnail: `https://img.youtube.com/vi/{ID}/hqdefault.jpg` (o `maxresdefault.jpg`).

| Título | URL | ID |
|---|---|---|
| Acepté una PELEA ILEGAL antes de LA VELADA | https://www.youtube.com/watch?v=HzZ5j6Lm8aU | `HzZ5j6Lm8aU` |
| Boxee en la Favela Más Peligrosa de Brasil | https://www.youtube.com/watch?v=QN4PPPCFX1s | `QN4PPPCFX1s` |
| Mi Pelea Más Importante (Párense de Manos) | https://www.youtube.com/watch?v=3uDP4u8-_hI | `3uDP4u8-_hI` |
| Peleé Contra un Campeón Mundial de Boxeo | https://www.youtube.com/watch?v=fvIVHMDXvgs | `fvIVHMDXvgs` |

---

## 9) FOTOS DE GERO (archivos adjuntos)

Adjuntar estos archivos a Claude Code y colocarlos en `assets/`. Uso sugerido:

| Archivo | Qué muestra | Uso sugerido |
|---|---|---|
| `_DSC3918_-_agustinmarianoq.JPEG` | Gero en el Obelisco, brazos abiertos, multitud abajo (cierre del reto 366). Landscape. | **HERO principal** |
| `_DSC3425_-_agustinmarianoq.JPEG` | Gero de espaldas haciendo dominada en el Obelisco, carteles “366/366 — LA GLORIA SERÁ ETERNA”. Portrait. | **Sección ¿Quién es Gero?** |
| `ad6c89b6-609a-469e-9df2-a01750b1b731.JPG` | Gero boxeando en mercado callejero, cabezal + guantes Venum. Landscape. | Sección **Boxeo** |
| `a525fcf1-0b7c-47a7-9c61-3a88fe3667c1.JPG` | Gero conectando un golpe en pelea callejera, público. Landscape. | Sección **Boxeo** |
| `0a40e855-3804-4278-be78-c7a302b51e35.jpg` | Gero colgado de un globo aerostático al amanecer (silueta). Cuadrada. | Momento “no le esquiva a nada” |
| `_raqueelalvarado_LVDA_VI_GEROVSVIRUZZ_2.JPG` | Gero en conferencia/podcast con camiseta de Argentina. Portrait. | Sección **Videos / medios** |
| `Gero_Arias_Tucuman-7.jpg` | Gero de torso, parado en gradas. Portrait (muy alta resolución). | Apoyo / teaser **Ropa** |
| `morashop_logo__1_.png` | Logo Morashop (fondo navy). | Header/footer |
| `1782085885510_image.png` | Shaker 366 DISCIPLINE. | Sección **Shaker** |

> Tip de performance: para producción en Tiendanube, conviene **subir las fotos de Gero al CDN/assets del theme** y referenciarlas por URL (en vez de incrustarlas en base64), para que la página no pese de más. Las imágenes de producto ya van por CDN de Tiendanube.

---

## 10) NOTAS TÉCNICAS / ENTREGABLE

- **Deliverable:** sitio autocontenido para **embeber en una página personalizada de Tiendanube**. Estructura simple (`index.html` + `assets/` + opcional `styles.css` / `app.js`).
- **Mobile-first** (75% mobile). Breakpoints pensados desde 360px.
- **Accesibilidad:** foco visible en links/botones, `alt` en imágenes, contraste OK, `prefers-reduced-motion`.
- **Fonts:** Google Fonts — Barlow Condensed (900), Inter (400/600), Sora (600/700).
- **Precios:** mantenerlos en un JSON/array editable (sección 6). Pueden cambiar; idealmente, a futuro, levantarlos de la API de Tiendanube.
- **Sin** `<form>` real para el shaker/ropa: solo estado “Próximamente”.
- Probar render dentro de Tiendanube (algunas páginas personalizadas sandboxean scripts; verificar que `<model-viewer>`/three.js cargue por CDN).

---

## 11) CHECKLIST DE ESTADO

- [x] Branding, paleta, tipografías, links → definidos
- [x] Bio aprobada → lista (sección 4)
- [x] 9 suplementos con precio + imagen + link reales → listos (sección 6)
- [x] Fotos de Gero → entregadas (sección 9)
- [x] Videos de YouTube → listos (sección 8)
- [x] Shaker (imagen + estado “Próximamente”) → listo; **falta `.glb`** desde Blender
- [ ] Ropa → **Próximamente** (sin productos todavía)
- [ ] Construir la landing
