# Brief — Banner Hero Morashop (lado derecho)

> **Para**: Diseñador/a gráfico
> **De**: Morashop (Alejo)
> **Fecha**: 2026-05-25
> **Objetivo**: Diseñar el **banner que va a la derecha del hero principal** del sitio morashop.com.ar.

---

## ⚠️ Importante leer primero (NO SALTEAR)

El hero (la parte de arriba del sitio, lo primero que se ve) tiene **2 mitades**:

### Mitad izquierda — NO la tocás, no existe para vos

El sitio renderea automáticamente con código (HTML/CSS) este texto:

> **EL MEJOR PRECIO SIEMPRE.**
>
> *Suplementos originales de las mejores marcas. Distribuidor autorizado en Argentina — supermercado fit y electro-hogar para sostener tu rutina.*

Ese texto **NO va en tu imagen**. NO lo dibujes, NO lo escribas, NO lo pongas en el banner. El sitio lo escribe solo encima del fondo gris.

### Mitad derecha — ESTO es lo que vos diseñás

Una **imagen rectangular** (banner) que va al lado derecho del texto. Esa imagen sí lleva texto adentro (la promo: "HASTA 30% OFF", "ENVÍO EN EL DÍA", etc.) + foto del producto + botón.

### Visualización del hero ya armado

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│   ▌  ← detallito rojo                                              │
│                                                                    │
│   EL MEJOR                       ┌─────────────────────────────┐   │
│   PRECIO                         │                             │   │
│   SIEMPRE.                       │                             │   │
│                                  │   ← ACÁ VA TU BANNER →      │   │
│   Suplementos originales         │                             │   │
│   de las mejores marcas.         │   (imagen .webp / .jpg      │   │
│   Distribuidor autorizado        │    que vos diseñás)         │   │
│   en Argentina...                │                             │   │
│                                  │   960 × 480 px              │   │
│                                  │                             │   │
│                                  └─────────────────────────────┘   │
│                                                                    │
│   ↑ TEXTO QUE EL SITIO ESCRIBE    ↑ IMAGEN QUE DISEÑÁS Y ENTREGÁS  │
│     SOLO (NO va en tu imagen)       COMO ARCHIVO .webp + .jpg      │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
   FONDO GRIS CLARO #ECEDEF (todo el hero) — lo pone el sitio
```

### En resumen

| Parte | Quién lo hace | Cómo |
|---|---|---|
| Fondo gris del hero | Sitio (código CSS) | Automático |
| Texto "El mejor precio siempre" | Sitio (código HTML) | Automático |
| Texto descriptivo debajo | Sitio (código HTML) | Automático |
| **Imagen banner lado derecho** | **VOS (diseñador)** | **Entregás .webp + .jpg** |

**Vos solo entregás la imagen del banner derecho.** El texto izquierdo ni lo veas, no es tu problema.

---

## 1. ¿Qué es Morashop?

E-commerce argentino que vende:

- **Suplementos deportivos** (categoría principal): proteínas, creatinas, pre-entrenos, vitaminas, BCAA, quemadores
- Marcas: Star Nutrition, ENA, Gold Nutrition, Optimum, PGN, etc.
- También: supermercado fit, electro-hogar, El Bananero (picantes), Bodega (vinos próximamente)

**Tono**: argentino directo, tipo Mercado Libre/Coto. No fitness gringo aspiracional.
**Público**: 75% mobile, gente normal que entrena y busca buen precio.

---

## 2. ¿Qué tiene que hacer este banner?

El banner del lado derecho cumple **3 funciones**:

1. **Comunicar UNA promo concreta** (Jueves de Suplemento, Envío en el día, Cuotas, etc.)
2. **Mostrar el producto** estrella visualmente (foto del whey, creatina, etc.)
3. **Empujar al click** con un botón claro

**NO tiene que**:
- Repetir el copy "El mejor precio siempre" (eso ya está al lado)
- Decir bienvenidos, somos los mejores, etc.
- Tener más de 3 líneas de texto

---

## 3. Dimensiones técnicas (OBLIGATORIO)

Necesito **3 versiones del mismo banner**, una por viewport. **NO escalar uno solo** — cada versión rediseñada:

| Versión | Tamaño exacto | Aspect ratio | Cuándo aparece |
|---|---|---|---|
| **Desktop** | **960 × 480 px** | 2:1 | PC y notebooks (lado derecho del hero) |
| **Tablet** | **640 × 420 px** | ~1.5:1 | iPad y similares |
| **Mobile** | **750 × 360 px** | ~2.1:1 | Celular (en mobile va arriba o abajo del texto, no al lado) |

### Por qué 3 versiones (no una sola)

Si tomás el desktop (apaisado 2:1) y lo metés en mobile, el producto queda diminuto. Cada viewport necesita **composición propia**:

- **Desktop**: producto centrado o a la derecha, texto promo arriba o abajo
- **Tablet**: igual que desktop pero más comprimido
- **Mobile**: en mobile el texto fijo "El mejor precio siempre" desaparece y se ve solo este banner full-width arriba — composición más horizontal con texto y producto a los lados

---

## 4. Formato y peso

| Param | Especificación |
|---|---|
| Formato primario | **WebP** (.webp) |
| Formato fallback | **JPG** (.jpg) |
| Calidad de export | 82-85% |
| Peso máximo desktop | **180 KB** |
| Peso máximo tablet | **130 KB** |
| Peso máximo mobile | **100 KB** |
| Color profile | **sRGB** |
| DPI | 72 |

> ⚠️ Si pesa más, comprimir en https://squoosh.app o tinypng.com. Banners pesados frenan la carga del sitio.

---

## 5. Estructura visual obligatoria

### Layout desktop / tablet (lado derecho del hero)

```
┌──────────────────────────────────────┐
│                                      │
│   [EYEBROW ROJO 12-14px UPPERCASE]   │
│                                      │
│   TÍTULO PROMO            ╔════════╗ │
│   GRANDE EN               ║        ║ │
│   2 LÍNEAS                ║  PROD  ║ │
│                           ║  PNG   ║ │
│   Subtitulo 1 línea       ║        ║ │
│                           ║        ║ │
│   [ BOTÓN ROJO → ]        ╚════════╝ │
│                                      │
└──────────────────────────────────────┘
   ← TEXTO 55% →   ← PRODUCTO 45% →
```

### Layout mobile (apilado o lado a lado compacto)

```
┌────────────────────────┐
│ [EYEBROW]              │
│                        │
│ TÍTULO         ╔═════╗ │
│ PROMO          ║ PROD║ │
│                ║ PNG ║ │
│ Subtitulo      ╚═════╝ │
│                        │
│ [ BOTÓN ROJO → ]       │
└────────────────────────┘
```

---

## 6. Tipografías (CRÍTICO)

Bajar las fuentes gratis de Google Fonts:

- **Barlow Condensed** → https://fonts.google.com/specimen/Barlow+Condensed
- **Inter** → https://fonts.google.com/specimen/Inter

### Uso de cada tipografía

| Elemento | Tipografía | Peso | Tamaño desktop | Tamaño mobile | Otros |
|---|---|---|---|---|---|
| **Título promo** | Barlow Condensed | 900 (Black) | 48-64px | 36-44px | UPPERCASE, line-height 0.95, letter-spacing -0.015em |
| **Eyebrow** | Inter | 700 (Bold) | 12-14px | 10-11px | UPPERCASE, letter-spacing 0.14em, color rojo `#E8341A` |
| **Subtítulo** | Inter | 500 (Medium) | 14-16px | 12-13px | Sentence case, line-height 1.4 |
| **CTA (botón)** | Barlow Condensed | 800 (ExtraBold) | 13-14px | 12-13px | UPPERCASE, letter-spacing 0.08em |

---

## 7. Paleta de colores (OBLIGATORIA)

Colores oficiales de Morashop. **No inventar otros**.

| Color | HEX | Uso |
|---|---|---|
| Azul oscuro | `#1A2744` | Texto sobre fondo claro, fondos oscuros |
| Rojo Morashop | `#E8341A` | CTA, eyebrow, acentos |
| Rojo deep (hover) | `#C42710` | Hover del botón CTA |
| Amarillo | `#FFD400` | Highlight precios / urgencia |
| Gris claro (fondo) | `#ECEDEF` | Fondo banner alternativo |
| Blanco | `#FFFFFF` | Texto sobre fondos oscuros |
| Verde éxito | `#00A650` | Cuotas s/i (sutil) |

### Combinaciones permitidas para fondo del banner

1. **Fondo amarillo `#FFD400`** + texto azul `#1A2744` + acentos rojo `#E8341A` → para promos OFF, urgencia
2. **Fondo azul oscuro `#1A2744`** + texto blanco `#FFFFFF` + acentos amarillo `#FFD400` → para envío, confianza
3. **Fondo rojo `#E8341A`** + texto blanco `#FFFFFF` + acentos amarillo `#FFD400` → para cuotas, agresivo
4. **Fondo gris claro `#ECEDEF`** + texto azul `#1A2744` + acentos rojo `#E8341A` → para marcas, sobrio

### ⚠️ Importante sobre el fondo del lado izquierdo

El lado izquierdo del hero tiene **fondo gris claro `#ECEDEF`**. Tu banner debe **diferenciarse visualmente** del fondo de la izquierda:

- Si tu banner es gris claro también, **agregale borde redondeado** (border-radius 12px) o **shadow sutil** para separarlo
- Recomendado: **fondo amarillo, azul oscuro o rojo** para que destaque

---

## 8. Producto PNG

- **Fondo transparente** (NO blanco, NO sombra integrada al PNG)
- **Resolución mínima**: 1200px en su lado mayor
- **Drop-shadow** aplicado: `0px 20px 40px rgba(0,0,0,0.22)`
- **Ocupa**: máximo 45% del ancho del banner desktop, 50% del alto en mobile
- **Productos sugeridos**: Whey Star Nutrition, Creatina ENA, Pre-entreno Gold, Omega 3 Innova
- **NO stock photos**, solo productos reales del catálogo

---

## 9. Safe area (zona segura)

- **Margen interior desktop**: 40-50px de cada borde
- **Margen interior mobile**: 24px de cada borde
- Nada de texto en los **últimos 60px** del lado derecho (donde va el producto)
- El producto NO se superpone al texto
- El botón CTA NO se apila debajo del producto

---

## 10. Copy / variantes del banner

Producir **4 variantes** del banner (una por promo). El sitio rotará entre ellas según la temporada/día:

### Variante 1 — Jueves de Suplemento (LA MÁS IMPORTANTE)

| Campo | Texto |
|---|---|
| **Eyebrow** | JUEVES DE SUPLEMENTO |
| **Título** | HASTA 30% OFF |
| **Subtítulo** | 5% base + 15% efectivo + 10% llevando 3 suplementos |
| **CTA** | APROVECHAR → |
| **Fondo sugerido** | Amarillo `#FFD400` |
| **Texto** | Azul oscuro `#1A2744` |
| **Producto** | Whey Protein Star Chocolate |

### Variante 2 — Envío en el día

| Campo | Texto |
|---|---|
| **Eyebrow** | ENVÍO EN EL DÍA |
| **Título** | LLEGÁ HOY MISMO |
| **Subtítulo** | Pedidos antes de las 10hs en CABA y GBA |
| **CTA** | VER MÁS → |
| **Fondo sugerido** | Azul oscuro `#1A2744` |
| **Texto** | Blanco `#FFFFFF` |
| **Producto** | Creatina ENA Doypack |

### Variante 3 — 3 cuotas sin interés

| Campo | Texto |
|---|---|
| **Eyebrow** | 3 CUOTAS SIN INTERÉS |
| **Título** | PAGÁ EN 3 CUOTAS |
| **Subtítulo** | Con todas las tarjetas, sin recargo |
| **CTA** | EMPEZAR → |
| **Fondo sugerido** | Rojo `#E8341A` |
| **Texto** | Blanco `#FFFFFF` |
| **Producto** | Omega 3 Innova Max |

### Variante 4 — Marcas oficiales

| Campo | Texto |
|---|---|
| **Eyebrow** | DISTRIBUIDOR OFICIAL |
| **Título** | LAS MEJORES MARCAS |
| **Subtítulo** | Star, ENA, Gold, Optimum, PGN. 100% originales |
| **CTA** | VER CATÁLOGO → |
| **Fondo sugerido** | Gris claro `#ECEDEF` (con shadow) |
| **Texto** | Azul oscuro `#1A2744` |
| **Producto** | Whey Star Nutrition |

---

## 11. Botón CTA — detalles

```
┌──────────────────────────┐
│  APROVECHAR  →           │
└──────────────────────────┘

Background:    #E8341A (rojo Morashop) — siempre
Texto:         #FFFFFF (blanco)
Padding:       12px 24px (desktop) / 10px 18px (mobile)
Border-radius: 6px (esquinas suaves)
Font:          Barlow Condensed 800, UPPERCASE, letter-spacing 0.08em
Flecha:        " →" al final, separado por espacio
```

**NO**: botones outline, gradient, pill (super redondeados), bordes finos.

---

## 12. Entregables esperados

1. **Archivo editable**:
   - Figma (preferido) — compartir link con permisos de visualización
   - O Adobe Illustrator (.ai)
   - O Photoshop (.psd) con capas separadas

2. **Exportaciones** (por cada una de las 4 variantes):
   - `hero-banner-{variante}-desktop.webp` (960×480, ≤180KB)
   - `hero-banner-{variante}-desktop.jpg` (fallback)
   - `hero-banner-{variante}-tablet.webp` (640×420, ≤130KB)
   - `hero-banner-{variante}-tablet.jpg` (fallback)
   - `hero-banner-{variante}-mobile.webp` (750×360, ≤100KB)
   - `hero-banner-{variante}-mobile.jpg` (fallback)

3. **PNG transparente** de cada producto recortado (por separado, para reusar)

4. **Versión sin texto** del fondo (por si necesitamos sumar copy editable en el sitio)

5. **Mínimo para arrancar**: Variante 1 (Jueves) y Variante 2 (Envío) en los 3 viewports = 12 archivos

---

## 13. Inspiración / referencias visuales

Mirar estos sitios para entender el estilo:

1. **Mercado Libre Argentina** (mercadolibre.com.ar) — banners del hero
2. **Ecomodico** (ecomodico.com) — competencia directa, hero con banner amarillo + producto
3. **Coto Digital** (cotodigital.com.ar) — banners promo
4. **Walmart México** — uso de color rojo + amarillo
5. **Amazon Argentina** — composición foto producto + texto promo

**NO inspirarse en**: Gymshark, MyProtein, Optimum Nutrition USA (estética gringa fitness, no aplica).

---

## 14. Reglas duras (NO violar)

- ❌ NO repetir "El mejor precio siempre" (ese texto ya está al lado, en el sitio)
- ❌ Stock photos de modelos genéricos
- ❌ Texto sobre la foto del producto
- ❌ Gradientes con más de 2 colores
- ❌ Watermarks o marcas de agua
- ❌ Fotos pixeladas o bajadas de Google
- ❌ Contraste insuficiente (mínimo WCAG AA: ratio 4.5:1)
- ❌ Tipografías diferentes a Barlow Condensed + Inter
- ❌ Más de 3 líneas de texto
- ❌ Botones rosados, violetas, verdes flúo
- ❌ Animaciones embebidas (es estático)

---

## 15. Accesibilidad

- **Contraste mínimo**: WCAG AA 4.5:1 para texto normal, 3:1 para texto grande (>24px)
- Validar con https://webaim.org/resources/contrastchecker/ antes de entregar
- Texto legible incluso con visión reducida o pantalla bajo brillo

---

## 16. Tiempos y precio

(Completar Alejo con el diseñador):

- Fecha de entrega: __________
- Precio acordado: __________
- Forma de pago: __________
- Revisiones incluidas: __________ (sugerido: 2 por variante)

---

## 17. Contacto

- **Alejo** — cavutoalejo10@gmail.com
- **WhatsApp**: __________

---

## ANEXO — Preview esquemático del hero completo

### Desktop (1440×480 visible — banner ocupa lado derecho 960×480)

```
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║   ▌                                                                        ║
║                                ┌─────────────────────────────────────────┐ ║
║   EL MEJOR                     │  JUEVES DE SUPLEMENTO                   │ ║
║   PRECIO                       │                                         │ ║
║   SIEMPRE.                     │  HASTA              ╔════════════════╗  │ ║
║                                │  30% OFF            ║                ║  │ ║
║   Suplementos originales       │                     ║   WHEY STAR    ║  │ ║
║   de las mejores marcas.       │  5% base +          ║   PROTEIN      ║  │ ║
║   Distribuidor autorizado      │  15% efectivo +     ║                ║  │ ║
║   en Argentina —               │  10% llevando 3     ║   PNG transp.  ║  │ ║
║   supermercado fit y           │                     ╚════════════════╝  │ ║
║   electro-hogar para           │  ┌─────────────────┐                    │ ║
║   sostener tu rutina.          │  │ APROVECHAR  →   │                    │ ║
║                                │  └─────────────────┘                    │ ║
║                                │                                         │ ║
║                                │  FONDO: amarillo #FFD400                │ ║
║                                └─────────────────────────────────────────┘ ║
║                                                                            ║
║   ← TEXTO FIJO (no se toca)→       ← BANNER QUE DISEÑÁS (960×480) →        ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
   FONDO DEL HERO: gris claro #ECEDEF (texto izquierda apoyado sobre este)
```

### Mobile (750×360 visible — banner full-width, texto fijo arriba o abajo)

```
╔════════════════════════════╗
║                            ║
║ EL MEJOR                   ║
║ PRECIO                     ║
║ SIEMPRE.                   ║   ← texto fijo Morashop
║                            ║      (NO se toca)
╠════════════════════════════╣
║                            ║
║  JUEVES DE SUPLEMENTO      ║
║                            ║
║  HASTA              ╔═══╗  ║
║  30% OFF            ║WHY║  ║   ← TU BANNER
║                     ║EY ║  ║      (750×360)
║  5% + 15% +         ╚═══╝  ║
║  10% llevando 3            ║
║                            ║
║  [ APROVECHAR  → ]         ║
║                            ║
║  fondo amarillo #FFD400    ║
║                            ║
╚════════════════════════════╝
```

---

## Cierre

Cualquier duda mientras estés diseñando, mandame mensaje. Mejor preguntar 5 veces y entregar 1 vez bien, que entregar 5 versiones que no sirven.

**Lo importante**: que el cliente entienda la promo en 1 segundo y haga click en el botón rojo. Si eso pasa, el banner cumplió.

Gracias 🙏

— Alejo
