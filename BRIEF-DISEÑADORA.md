# Brief — Diseño visual Morashop (rediseño 2026)

Hola, te paso el detalle de lo que necesito. El sitio que estoy rediseñando es **Morashop** (morashop.com.ar / Tiendanube actual: morashop.mitiendanube.com). Hoy es un e-commerce multi-rubro y estamos enfocándolo en **4 categorías core**: Suplementos, Supermercado, Electro-Hogar y "El Bananero" (cerveza Japi + snacks picantes del influencer).

Te paso el link del rediseño en proceso para que veas cómo está quedando y entiendas el contexto antes de empezar:

> 🔗 **Link del sitio rediseñado:** *(te paso link de Vercel)*
>
> Te recomiendo abrirlo en **desktop y mobile** (chrome devtools → ícono de celular) para que veas las dos versiones.

---

## 1. Contexto de marca

**Morashop** vende:
- Suplementación deportiva (Star Nutrition, Ena, Optimum, Gold Nutrition, etc.)
- Supermercado "saludable" (almacén, frutos secos, vinos, cuidado personal)
- Electrodomésticos y hogar
- Productos de "El Bananero" (cerveza Japi, salsas picantes — categoría rebelde, irreverente, distinta del resto)

**Mascota:** Mora, la perra labradora de la familia. La marca tiene una vibra **familiar, honesta, sin chamuyo** ("Sin trampas" es uno de los copys del sitio).

**Paleta de colores actual del sitio:**

| Color | Hex | Uso |
|---|---|---|
| Negro/ink | `#0D1117` | Fondo principal |
| Crema | `#E8E0CE` | Texto principal, contraste con negro |
| Rojo Morashop | `#E8341A` | Acento, CTAs, marca |
| Rojo profundo | `#B82610` | Hover de CTAs |
| Navy | `#1A2230` | Fondos secundarios |

**Tipografías:**
- Display (títulos grandes): **Barlow Condensed Black**
- Body: **Inter**

---

## 2. Las 4 imágenes hero por categoría

Lo más importante. Cada página de categoría tiene un **hero (banner superior)** donde va el título grande + descripción corta. Hoy ese banner es solo fondo negro — necesito que cada categoría tenga **una foto/ilustración propia** que le dé identidad.

### Especificaciones técnicas (las 4 imágenes)

| Spec | Valor |
|---|---|
| **Resolución desktop** | 2400 × 1200 px (banner ancho) |
| **Resolución mobile** | 1080 × 1200 px (más cuadrado/vertical) |
| **Si hacés UNA sola por categoría** | 2400 × 1400 px con el "punto de interés" centrado, recortable a ambos formatos sin perder lo importante |
| **Formato final** | WebP (preferido) o JPG comprimido |
| **Peso máximo** | 300 KB cada una (importante para performance mobile) |
| **Espacio para texto** | El título de la página (45-90px de alto) va **superpuesto** sobre la imagen, en general arriba a la izquierda. **Dejá esa zona más oscura/limpia** para que el texto se lea |
| **Overlay** | Yo agrego en CSS un overlay oscuro encima de la imagen (gradiente negro al 40-60% en la zona del texto). Vos solo pasame la imagen "limpia" |

### Estilo general (las 4 imágenes deben sentirse de la misma familia)

- **Fotografía editorial / lifestyle**, no fotos de producto recortadas tipo packshot
- Buscar **grano, contraste, sensación real** — nada que parezca stock de Shutterstock
- Que **dominen los tonos oscuros** (la paleta del sitio es dark) con puntos de **rojo o crema** que destaquen
- Mismo tratamiento de color/contraste/iluminación entre las 4 para que se vean como "serie"
- **Una excepción:** El Bananero puede romper la regla (es la categoría rebelde, opuesta al resto)

---

### IMAGEN 1 — Suplementos

> 🎯 **Mood:** energía, fuerza, intensidad. Foco en personas reales entrenando, no en productos.

**Concepto sugerido:**
- Persona entrenando en gym real (no estudio fotográfico): manos en barra de dominadas, alguien con shaker, espalda con sudor en blanco y negro, primer plano de manos de atleta.
- Idealmente: foto en blanco y negro con **un solo punto de color rojo** que llame la atención (la marca de una remera, una banda elástica, el shaker).

**Referencias para inspirarte (estilos que funcionan):**
- Editorial fotográfico de Nike, Gymshark, Peak Performance
- Fotografía deportiva tipo Annie Leibovitz / Andrew Hetherington

**Evitar:**
- ❌ Atletas perfectos con sonrisa de stock
- ❌ Fondos blancos de estudio
- ❌ Botes de proteína apilados (eso ya está en las cards de producto)
- ❌ Personas con ropa de marcas reconocibles (Adidas, Nike) — problemas legales

---

### IMAGEN 2 — Supermercado

> 🎯 **Mood:** cálido, hogareño, "real food". Foco en producto natural en contexto de casa/cocina.

**Concepto sugerido:**
- Mesa de madera con frutos secos, granola en frasco, miel, mate, una botella de vino.
- Cocina real con luz natural cálida, despensa con productos.
- Detalle macro de granos, semillas, mermeladas.

**Referencias:**
- Editorial de Patagonia Provisions, Felices Las Vacas, Almacén Pueblo
- Fotografía gastronómica honesta tipo NYT Cooking

**Evitar:**
- ❌ Góndola de supermercado tradicional (Coto, Carrefour)
- ❌ Productos de marca masiva (Quilmes, Coca-Cola)
- ❌ Estilo "instagrameable" muy saturado de color

---

### IMAGEN 3 — Electro-Hogar

> 🎯 **Mood:** minimalista, espacio cuidado, luz natural.

**Concepto sugerido:**
- Cocina ordenada con licuadora/cafetera/balanza en uso.
- Baño minimalista con espejo, accesorios prolijos.
- Detalle de mano usando un electrodoméstico (no el producto solo, sino la **acción**).
- Mejor con humanos interactuando que productos vacíos.

**Referencias:**
- Editorial de MUJI, Smeg, Aesop
- Hudson Valley Magazine, Apartamento (revista)

**Evitar:**
- ❌ Renders 3D de electrodomésticos
- ❌ Fotos tipo Mercado Libre / Frávega
- ❌ Cocinas demasiado de showroom (que no se sienten habitadas)

---

### IMAGEN 4 — El Bananero

> 🎯 **Mood:** OPUESTO a las otras 3. Irreverente, fiesta, picante, caótico. Marketing de personalidad del influencer.

**Contexto importante:** "El Bananero" es un influencer argentino conocido por su personaje irreverente. Tiene **cerveza propia (Japi)** — una IPA en lata negra con su cara/logo — y vende **salsas picantes y papas picantes** bajo "Terapia Picante". Es una marca con humor crudo, urbana, alejada del "wellness" del resto del sitio.

**Concepto sugerido:**
- Escena de "after" con la cerveza Japi en mesa, manos chocando latas.
- Salsa picante derramándose, fuego (literal o sugerido), lengua roja.
- Detalle de la lata Japi con el logo de El Bananero.
- Estética **opuesta** a Suplementos: si la 1 es seria/atlética, la 4 es festiva/desbocada.

**Referencias:**
- El propio Instagram de El Bananero (@elbananero) — copiá su estética
- Marketing de marcas como Mr. Lemon, Quilmes Stout, marcas de hot sauce yanquis (Hot Ones)

**Materiales que ya tengo:**
- En `assets/products/bananero.gif` hay un GIF actual del personaje con la lata Japi. Te lo paso aparte. Si querés podés usar ese loop como base o referencia.

**Evitar:**
- ❌ Que se parezca al resto de las 3 categorías (rompé la coherencia a propósito)
- ❌ Estética "limpia y wellness" — esta categoría es el opuesto

---

## 3. Sobre los logos (Morashop y Mayorista)

En el nav arriba del sitio hay **dos logos al lado del otro**:

```
[ Morashop ] [ Mayoristas ]
```

Esto **es a propósito**: el cliente puede alternar entre la tienda minorista y la mayorista desde cualquier página. **Son botones de navegación, no decoración.**

**Lo que necesito de tu lado:**

1. ¿Podés revisar los logos actuales (`assets/mora_minorista.png` y `assets/mora_mayorista.png`)? Hoy en mobile quedan chicos. Si tenés una versión **vectorial (.svg)** o una versión **optimizada para tamaños chicos (30-40px de alto)** sería un upgrade enorme.

2. Si te animás a actualizarlos: necesito **una versión que se lea bien a 30px de alto** (para mobile). Pueden ser más simples/compactos que la versión grande.

3. Idealmente: que las 2 versiones (Morashop y Mayoristas) se sientan **claramente parte del mismo sistema** pero con la diferencia visual marcada (hoy uno es negro y otro rojo — eso está bien, ¿podés mejorarlo?).

---

## 4. Entregables

Cuando estén listas las 4 imágenes:

1. **Archivos finales:**
   - `hero-suplementos.webp` (2400×1200 + 1080×1200 si haces 2 versiones)
   - `hero-supermercado.webp`
   - `hero-electro.webp`
   - `hero-bananero.webp`
   - Cada uno máx 300 KB

2. **Archivos editables (opcional pero ideal):**
   - `.psd` o `.ai` por si después hay que retocar algo

3. **Logos actualizados (si los rehacés):**
   - `mora_minorista.svg`
   - `mora_mayorista.svg`
   - (Si solo PNG, mínimo 200px de alto para que escale)

**Plazo:** decime vos qué necesitás. Idealmente las 4 imágenes en 1-2 semanas para poder seguir avanzando.

---

## 5. Preguntas que me podés hacer

Si algo no queda claro, mandame mensaje y resuelvo. Algunas cosas en las que probablemente quieras opinar vos:

- **¿Modelos reales o ilustración?** — Yo lo pensé como foto, pero si querés probar con ilustración editorial moderna (tipo línea, no muy cartoon) puede funcionar especialmente para Bananero.
- **¿Una sola persona o varias?** — Si usás modelos, mi sugerencia es UNA por imagen para no dispersar la atención.
- **¿Color o B&N?** — Mi instinto: Suplementos B&N con un punto rojo, las otras 3 a color tratado.

---

## 6. Contexto técnico (para que sepas)

El sitio está construido en HTML/CSS/JS puro (sin frameworks). Cuando me entregues las imágenes, las pego en `/assets/heroes/` y cambio 1 línea de CSS por categoría — ya tengo el sistema preparado para recibirlas.

Mientras tanto el sitio tiene **fondos CSS estilizados** que dan identidad pero quedan claramente provisorios. Cuando lleguen tus fotos, el sitio levanta un nivel notable.

---

**Cualquier duda me preguntás. Gracias por sumarte 🙌**
