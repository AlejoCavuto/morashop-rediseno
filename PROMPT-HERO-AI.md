# PROMPT-HERO-AI.md

Banco de prompts para generar el **hero banner de Morashop** con IA, listo para pegar y correr en Midjourney, DALL-E 3 (ChatGPT), ChatGPT Vision y Flux.

> **Para qué sirve este doc:** si el diseñador no llega o queremos prototipar rápido, generamos la imagen base con IA, la limpiamos en Figma (texto real con Barlow Condensed 900) y la subimos a Tiendanube.

---

## Specs Tiendanube — theme Trend

| Viewport | Medida | Ratio | Formato | Peso ideal |
|---|---|---|---|---|
| **Desktop** | 1920 × 900 px | 32:15 panorámico | JPG / WEBP | ≤ 400 KB |
| **Mobile** | 820 × 1000 px | ~41:50 vertical | JPG / WEBP | ≤ 250 KB |

> **OJO:** Trend NO tiene viewport tablet — usa el desktop redimensionado. Solo 2 piezas.
> Límite duro de Tiendanube: 1 MB por imagen. Apuntar más bajo para LCP.

**Paleta obligatoria:** Navy `#1A2744` · Rojo `#E8341A` · Amarillo `#FFD400` · Gris `#ECEDEF` · Blanco `#FFFFFF`
**Tipos:** Barlow Condensed 900 (display) · Inter 500-700 (body)

---

## 1. Midjourney v7

Mejor opción para fotorrealismo del bodegón. **Falla en el texto** — generá el render sin texto y metele "MORASHOP" en Figma.

### Desktop (1920×900)
```
Editorial e-commerce hero banner, Argentine supermarket banner aesthetic (Mercado Libre, Coto Digital style), asymmetric composition: left third holds bold "MORASHOP" wordmark in Barlow Condensed 900 uppercase white with small yellow "DISTRIBUIDOR OFICIAL" sub-label, right two thirds shows a tight clustered still-life of 4 sport supplement products grouped together — one matte black whey protein doypack standing tall, one round creatine tub, one tall pre-workout jar, one omega-3 fish-oil bottle — arranged in overlapping depth, three-quarter angle, sitting on an invisible glossy floor with soft contact shadows and subtle floating effect, deep navy background #1A2744 with a single warm yellow #FFD400 geometric accent shape sweeping diagonally behind the products, tiny brand logo badges (small circular chips) floating discreetly along the bottom edge suggesting multi-brand distributor, clean studio lighting from upper left, soft rim light on bottle silhouettes, sharp product focus, no gym models, no people, no percentage-off stickers, no English slogans, commercial product photography, hyper detailed labels, KodakChrome contrast, 8k --ar 32:15 --v 7 --s 100 --style raw
```

### Mobile (820×1000)
```
Vertical e-commerce hero, Argentine retail banner style (Coto Digital, Mercado Libre flavor), asymmetric stacked composition: top zone holds bold "MORASHOP" wordmark in Barlow Condensed 900 uppercase white with small yellow "DISTRIBUIDOR OFICIAL" sub-tag, bottom zone fills with a tight cluster of 4 sport supplement products — matte black whey doypack front-center, round creatine tub left, tall pre-workout jar right, omega-3 bottle peeking behind — overlapping at three-quarter angle, soft contact shadows on a glossy invisible floor, deep navy #1A2744 background, single yellow #FFD400 diagonal geometric shape sweeping behind products, small circular brand-chip badges scattered along the lower edge hinting at multi-brand distribution, studio lighting upper left, soft rim light, crisp product labels, no models, no people, no discount stickers, commercial editorial product still-life, hyper detailed, sharp focus --ar 41:50 --v 7 --s 100 --style raw
```

> Generá **desktop y mobile por separado** — la composición se reorganiza (no escales un único render).

---

## 2. DALL-E 3 (ChatGPT Plus)

Maneja texto mejor que MJ. Aspect ratios fijos: usá `1792×1024` y recortá a 32:15 en Figma. Para mobile, pedí `1024×1792`.

```
Hero banner for an Argentine sport-supplements e-commerce called Morashop, format 1920x900 pixels horizontal (and a separate vertical 820x1000 version). Style: editorial e-commerce closer to Mercado Libre or Coto Digital banners than to gringo gym brands; clean, direct, retail-friendly, NOT aspirational fitness lifestyle. Composition is asymmetric: on the left, a strong "MORASHOP" wordmark in heavy condensed sans-serif (Barlow Condensed 900 feel), uppercase, in white, with a smaller yellow line underneath reading "DISTRIBUIDOR OFICIAL"; on the right, a tightly grouped still-life of four sport supplement products sitting together at three-quarter angle — a matte black whey-protein doypack standing tall, a round creatine tub, a tall pre-workout jar, and an omega-3 fish-oil bottle — overlapping in depth, casting soft contact shadows on an invisible glossy floor, slightly floating feel. Background is a deep solid navy blue (#1A2744). Behind the products, a single warm yellow geometric accent shape (#FFD400) sweeps diagonally, optionally with a thin red (#E8341A) line as secondary accent. Along the bottom edge, distribute a handful of small circular brand-logo chips suggesting multiple supplement brands (generic round badges, no specific copyrighted logos). Studio lighting from the upper left, soft rim light around the product silhouettes, crisp clean product labels but readable as Spanish-language supplement packaging. No human models, no gym scenes, no percentage-off stickers, no large CTA buttons, no English aspirational slogans. The mobile vertical version uses the same elements stacked: wordmark on top, product cluster filling the bottom two thirds, navy background, yellow diagonal accent, brand chips along the lower edge. Photorealistic commercial product photography, hyper detailed, sharp focus, KodakChrome contrast.
```

---

## 3. ChatGPT Vision (iteración)

Subís el primer render (de MJ o DALL-E) y pedís ajustes específicos. **Clave para sacar drift gringo.**

### Iteración 1 — ajustes técnicos
```
Buenísimo el render. Ajustes concretos:
1) Bajá el brillo 15%, el fondo navy tiene que leerse #1A2744 puro, sin tinte violeta.
2) Corré el cluster de productos al 60-70% del ancho hacia la derecha; el wordmark MORASHOP debe respirar a la izquierda con mín. 8% de margen.
3) El doypack de whey MATE negro, no glossy — sacá el reflejo especular fuerte.
4) El acento amarillo #FFD400: hacelo trapecio/paralelogramo diagonal cortando detrás de los productos, no mancha redonda.
5) Etiquetas en castellano: WHEY PROTEIN, CREATINA, PRE-ENTRENO, OMEGA 3. Sans serif condensada. Sin texto inglés.
6) Sacá cualquier modelo humano, mano, brazo o silueta — solo bodegón.
7) Borrá cápsulas/scoops voladores. Solo productos enteros.
8) Sub-label DISTRIBUIDOR OFICIAL en amarillo #FFD400, no blanco, 10-12% del alto del wordmark.
9) Sombras de contacto más definidas, floor invisible físico.
10) Versión mobile vertical 4:5: wordmark arriba, cluster ocupando 65% inferior, mismos colores.
```

### Iteración 2 — si persiste estética gringa
```
Sacale el aire 'gym lifestyle'. Tiene que parecer banner de Mercado Libre o Coto Digital argentino, no de Gymshark ni MyProtein. Cero estética premium-aspiracional, más retail directo.
```

---

## 4. Flux Pro (fal.ai / Replicate)

**Mejor para texto legible en imagen.** Si querés que "MORASHOP" + "DISTRIBUIDOR OFICIAL" salgan ya integrados sin retocar en Figma → Flux Pro.

### Prompt técnico
```
subject: editorial e-commerce hero banner, Argentine retail aesthetic (Mercado Libre / Coto Digital school), product still-life | composition: asymmetric, left 35% wordmark zone, right 65% product cluster, rule-of-thirds anchor on the doypack | typography: "MORASHOP" set in Barlow Condensed Black 900, uppercase, tracking -10, color #FFFFFF, sub-label "DISTRIBUIDOR OFICIAL" in Barlow Condensed Medium uppercase, color #FFD400, 12% of wordmark height | products (4 items overlapping at three-quarter angle, depth-of-field f/8): (1) matte-finish black whey-protein doypack standing, slight forward tilt, foil texture readable; (2) round creatine tub, label facing camera; (3) tall pre-workout jar with metallic lid; (4) omega-3 amber bottle peeking behind | floor: invisible glossy plane with soft elliptical contact shadows under each product, subtle reflection 8% opacity | background: solid navy #1A2744, no gradient, single diagonal trapezoid accent shape in #FFD400 sweeping behind products from lower-left to upper-right, optional 2px line accent in #E8341A | bottom edge: row of 5 small circular brand-chip badges (~40px each), evenly distributed, low contrast, suggesting multi-brand distributor | lighting: key light upper-left 45°, soft rim light right side, fill at 30% | rendering: commercial product photography, photoreal, 8k, sharp focus on product labels, depth cues, hyper detailed packaging texture | mood: clean, direct, retail-trustworthy, NOT aspirational-fitness | output specs: desktop 1920x900 (aspect 32:15), mobile vertical variant 820x1000 (aspect 41:50) with elements restacked (wordmark top, cluster bottom 65%) | exclude: human models, gym scenes, percentage stickers, English slogans, oversized CTA buttons, gradient backgrounds, glossy plastic look on doypack | guidance scale: 4.5 | steps: 35
```

---

## Negative prompt (compartido)

Pegá esto en el campo "negative prompt" de Flux/SDXL/MJ `--no`:

```
human models, people, hands, arms, athletes, gym scenes, workout setting, percentage off stickers, % OFF, discount badges, sale tags, CTA buttons, oversized buttons, English slogans, English-language packaging, "the best price", aspirational fitness lifestyle, Gymshark aesthetic, MyProtein aesthetic, Optimum Nutrition USA aesthetic, gradient sky backgrounds, dramatic smoke, flying powder explosions, scoops mid-air, splashes, neon glow, cyberpunk lighting, lens flare overdone, plastic glossy doypack, blurry product labels, distorted text, low resolution, watermark, signature, jpeg artifacts, oversaturated colors outside palette, purple tint, teal tint, centered symmetrical composition, cluttered layout, more than 5 products, fewer than 3 products, generic stock photo look
```

---

## Comparativa — cuándo usar cada uno

| Herramienta | Fortaleza | Debilidad | Costo | Ideal para |
|---|---|---|---|---|
| **Midjourney v7** | Fotorrealismo y composición editorial | Texto roto, ratios libres pero no exactos | USD 10-30/mes | Render base del bodegón (texto se agrega en Figma) |
| **DALL-E 3** | Viene con ChatGPT Plus, maneja texto OK | Ratios fijos, hay que recortar | USD 20/mes (incluido en Plus) | No-técnicos, primera prueba rápida |
| **ChatGPT Vision** | Iteración guiada sobre un render existente | No genera de cero, depende de input | Plus | Pulir drift gringo, ajustar paleta, etiquetas en castellano |
| **Flux Pro** | Mejor texto legible de la industria | Requiere fal.ai/Replicate, paga por render | ~USD 0.05/imagen | Render final con wordmark ya integrado |

---

## Si tenés que elegir UNA sola

- **Sos no-técnico / sin subs:** → **DALL-E 3 vía ChatGPT Plus.** Pegás el prompt, salís andando. Recortás en cualquier editor online.
- **Pagás sub de diseño:** → **Midjourney v7 `--style raw`.** Mejor estética editorial. Texto lo metés en Figma con Barlow Condensed 900 real.
- **Querés el texto perfecto en la imagen:** → **Flux Pro** en fal.ai.

---

## Flujo recomendado (paso a paso)

1. **Generar bodegón** con Flux Pro o MJ → 4 variantes desktop + 4 mobile
2. **Elegir la mejor composición** → subirla a ChatGPT Vision y aplicar los 10 ajustes
3. **Limpiar en Figma:** meter wordmark MORASHOP real (Barlow Condensed 900), logos de marcas reales (Star, ENA, Gold Nutrition, Optimum, PGN)
4. **Exportar:** JPG (mejor compresión para fotorrealismo) → optimizar a <400KB desktop / <250KB mobile (TinyJPG, Squoosh)
5. **Subir a Trend** → Personalización del tema → Sección Hero → cargar desktop + mobile

---

## Recordatorio crítico

El texto **"Comprar suplementos es Morashop"** NO va dentro de la imagen — ya está renderizado en HTML por el theme.
La imagen es solo branding visual: **logo + bodegón + acento color**.
