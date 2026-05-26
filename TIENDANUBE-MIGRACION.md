# Plan de migración a Tiendanube

Inventario de todo lo aplicado en el prototipo Vercel y cómo se replica en el theme **Trend** (borrador instalado en `morashop2.mitiendanube.com`). El theme activo hoy es **Toluca**.

## Resumen de viabilidad

| Categoría | Viable | Método | Esfuerzo |
|---|---|---|---|
| 🎨 Visual (colores, tipografías, paleta) | ✅ Total | Edición avanzada de CSS | Bajo |
| 🧱 Estructura básica (bloques del theme) | ✅ Total | Editor visual del theme | Bajo |
| 🛒 Carrito + checkout | ✅ Total | Tiendanube tiene su propio carrito/checkout, hay que configurarlo | Bajo |
| 🔎 Buscador instantáneo | ⚠️ Parcial | JS custom + API de Tiendanube | Medio |
| 💰 "Ahorrás $X" + cuotas en cards | ⚠️ Parcial | JS custom inyecta en cards | Medio |
| ⭐ Stock + vendidos + rating en PDP | ❌ Difícil | App externa (Yotpo) o fake con JS+localStorage | Alto |
| 🔄 Historial "Seguí viendo" | ⚠️ Parcial | JS custom + localStorage | Medio |
| 🎯 Productos patrocinados (monetizar marcas) | ⚠️ Parcial | JS custom que reordena home | Medio |
| 🖥️ PDP con sticky + qty | ✅ Total | El theme Trend ya tiene sticky; CSS para ajustar | Bajo |

---

## Catálogo detallado de features a migrar

### ✅ FACILES — Solo CSS (Edición avanzada del theme)

#### F1. Paleta de colores tema claro
- **Origen**: variables `:root` en `index.html`, `styles.css`, `category.css`, `cart.css`, `producto.html`, `checkout.html` etc.
- **Migración**: pegar bloque CSS en "Edición avanzada de CSS" del theme Trend:
  ```css
  :root {
    --color-fondo: #ECEDEF !important;
    --color-texto: #1A2744 !important;
    --color-acento: #E8341A !important;
    /* ajustar los nombres reales de variables que use Trend */
  }
  body { background:#ECEDEF !important; color:#1A2744 !important; }
  ```
- **Riesgo**: bajo. Si algo se rompe, sacás el bloque.

#### F2. Tipografías (Barlow Condensed + Inter)
- **Origen**: `@import` Google Fonts en todos los HTML
- **Migración**: ya está hecho en Trend con `@import` en Edición avanzada de CSS ✅
- **Estado**: aplicado

#### F3. Botón "Agregar al carrito" en rojo siempre
- **Origen**: `.mlcard-add`, `.mlrow-add` con `background:var(--red)`
- **Migración**: CSS sobre los selectores de Trend (`.js-product-form button`, `.product-item__buy-button`, etc.)
  ```css
  /* identificar selector exacto inspeccionando el theme */
  .product-item__buy-button { background:#E8341A !important; color:#fff !important; }
  .product-item__buy-button:hover { background:#C42710 !important; }
  ```
- **Cómo identificar selectores**: F12 en el preview del borrador → inspeccionar elemento

#### F4. Hero compacto
- **Origen**: `.hero { min-height:auto; padding:48px 0 64px }`
- **Migración**: depende del bloque del hero en Trend. Generalmente:
  ```css
  .header-banner, .home-banner { min-height:auto !important; padding:32px 0 !important; }
  ```

#### F5. Cards estilo ML (sombra, blanco, bordes redondeados)
- **Origen**: `.mlcard { background:#fff; border-radius:8px; box-shadow:0 1px 3px rgba(26,39,68,0.08); }`
- **Migración**: CSS sobre el selector de producto del theme:
  ```css
  .product-item, .item-product, [class*="ProductCard"] {
    background:#fff !important;
    border-radius:8px !important;
    box-shadow:0 1px 3px rgba(26,39,68,0.08) !important;
    transition:transform .2s ease, box-shadow .2s ease;
  }
  .product-item:hover { transform:translateY(-3px); box-shadow:0 12px 28px -8px rgba(26,39,68,0.22); }
  ```

#### F6. Ocultar bloques sobrantes del home
- **Bloques a ocultar**: "Categorías principales" (las 14 cajas rojas), "Productos en oferta" (catálogo sucio), "Video", "Publicaciones Instagram", "Banners promocionales"
- **Migración A (recomendada)**: desde el **editor del theme** → Página de inicio → desactivar cada bloque
- **Migración B**: CSS — `[data-section="categorias-principales"], .home-video, .instagram-section { display:none !important; }`

#### F7. Pills de filtro (blancas con borde, activa azul, hover rojo)
- **Origen**: `.pill` en `category.css`
- **Migración**: CSS sobre `.filter-button`, `.facet-item`, etc. del theme

---

### ⚠️ MEDIOS — JS custom

#### M1. Buscador instantáneo con ranking por type + más vendidos
- **Origen**: `index.html` líneas ~984-1100 (lógica del search overlay)
- **Migración**:
  - Tiendanube tiene endpoint propio de búsqueda: `https://www.morashop2.com/search?q=<query>&format=json` (verificar formato exacto)
  - Alternativa: pre-cargar todo el catálogo al iniciar la sesión (vía sitemap o endpoint), guardar en memoria, buscar localmente
- **Implementación**:
  1. JS custom que se inyecta en el theme (algunos themes permiten "código antes del `</head>`" o "antes del `</body>`")
  2. El JS toma el `#search-input` del theme y le agrega el dropdown custom con los resultados rankeados
  3. Reutilizar la lógica `srSearch()`, `SR_TYPE_ALIASES`, `srVendidos()` del prototipo
- **Bloqueante**: necesito confirmar si Trend permite inyectar JS sin FTP

#### M2. "Ahorrás $X" + cuotas en rojo en cards
- **Origen**: funciones `cardHTML` y `rowItemHTML` que calculan `fmt(was - now)` al render
- **Migración**: JS custom que corre al cargar la página de listado, busca todas las cards, lee precio actual y "precio anterior" (Trend lo muestra como `<s>` o `.price-was`), calcula la resta y "inyecta" el elemento `Ahorrás $X` en cada card
  ```js
  document.querySelectorAll('.product-item').forEach(card => {
    const now = parseInt(card.querySelector('.price').textContent.replace(/\D/g,''));
    const wasEl = card.querySelector('.price-was, .price-compare');
    if (!wasEl) return;
    const was = parseInt(wasEl.textContent.replace(/\D/g,''));
    if (was <= now) return;
    const savings = was - now;
    const el = document.createElement('div');
    el.className = 'savings';
    el.textContent = `Ahorrás $${savings.toLocaleString('es-AR')}`;
    el.style.cssText = 'color:#E8341A;font-weight:600;font-size:12px;margin-top:4px';
    wasEl.parentNode.appendChild(el);
  });
  ```

#### M3. Historial "Seguí viendo" / "Te puede interesar"
- **Origen**: `index.html` con `localStorage 'morashop_vistos'`
- **Migración**: JS custom — funciona igual en Tiendanube porque localStorage es del navegador
- **Adaptación**: en vez de renderizar cards con `mlcard`, usar el componente de card del theme Trend

#### M4. Productos patrocinados / Sistema para marcas
- **Origen**: lista `PATROCINADOS` en `index.html` + bloque "Destacados de la semana"
- **Migración**: JS custom en home que reordene el grid de productos del theme priorizando los de la lista de patrocinados
- **Alternativa más simple**: usar las "Categorías destacadas" del editor de Trend y poner ahí los productos pagos. Manual pero sin código.

#### M5. Ícono de carrito en botones
- **Origen**: SVG inline en `.mlcard-add` y `.mlrow-add`
- **Migración**: CSS con `::before` que inyecta el SVG via background-image, o JS custom que prepende un `<svg>`

---

### ❌ DIFÍCILES — Necesitan app externa o trabajo fuerte

#### D1. Stock real visible en cards y PDP
- **Tiendanube SÍ tiene stock** internamente. La cuestión es si Trend lo muestra.
- **Migración**: verificar si Trend ya muestra "X unidades disponibles" en la PDP. Si no, configurar desde el editor o CSS.

#### D2. "+120 vendidos" en PDP y cards
- **Problema**: Tiendanube **no tiene API pública de "unidades vendidas por producto"** sin app externa.
- **Opciones**:
  - **A** (rápida, fake): JS custom + hash determinístico (como en el prototipo) → números fake consistentes. Conversión funciona igual.
  - **B** (real): contratar app del marketplace de Tiendanube tipo "Reseñas Plus", que registra ventas/opiniones
- **Recomendación**: ir con A para arrancar, app externa después si vale la pena.

#### D3. ⭐ Rating + opiniones reales
- **Problema**: Tiendanube no tiene sistema de reseñas nativo en todos los planes.
- **Opciones**:
  - **A** (fake): JS custom con hash → estrellas fake consistentes
  - **B** (real): app del marketplace tipo Yotpo, Stamped, Reseñas. Cuesta ~$15-30/mes.

#### D4. Cross-sell automático en PDP ("Productos relacionados" real)
- **Tiendanube ya tiene** un bloque "Productos relacionados" propio. Trend probablemente lo trae.
- **Migración**: activar y configurar desde el editor. El algoritmo (mismo tag/categoría) ya viene incluido.
- **Si quiere algo más fino** (por tipo + descuento): JS custom — pero el de Tiendanube ya alcanza.

#### D5. Slot publicitario para marcas con banner pago
- **Migración**: depende del theme. Trend tiene "Banners promocionales" que se pueden vender.
- **Flujo**: la marca da una imagen 1920×600 + un link. Vos lo subís al banner del editor. Listo, sin código.

---

## Plan de acción recomendado

### Fase 1 — Visual (1-2 días)
1. Aplicar todo el CSS de paleta clara al theme Trend (Edición avanzada de CSS)
2. Configurar bloques del editor (carrusel, banners categorías, productos destacados)
3. Ocultar bloques sobrantes
4. Verificar que las cards del theme se vean como las del prototipo

### Fase 2 — Catálogo (2-3 días)
1. Limpiar categorías viejas en Tiendanube (Juguetes, Comiquería, MoraKids, etc.) — el agente `morashop-catalogo` ayuda
2. Subir productos reales a Tiendanube (los 2.116 ya están en el CSV original)
3. Configurar marcas, tipos, fotos

### Fase 3 — JS custom (3-5 días)
1. Inyectar buscador instantáneo (M1)
2. Inyectar "Ahorrás $X" en cards (M2)
3. Inyectar historial "Seguí viendo" (M3)
4. (Opcional) Productos patrocinados (M4)

### Fase 4 — Apps externas (decisión comercial)
1. ¿Vale la pena Yotpo / Stamped para reseñas reales?
2. ¿O queda con el sistema fake (D2, D3)?

### Fase 5 — Activación
1. Probar todo en el borrador Trend
2. Verificar checkout end-to-end con un pedido de prueba
3. **Activar Trend reemplazando Toluca** (click en el editor → "Publicar")

---

## Reglas para el agente y el equipo

A partir de ahora, todo lo que se aplique al prototipo Vercel debe:

1. **Documentarse acá** con su método de migración a Tiendanube.
2. **Usar selectores CSS genéricos** cuando se pueda (`.product-item`, `[data-product]`) — más portable.
3. **Funcionalidades JS** deben estar aisladas en funciones reutilizables, no embebidas en el HTML.
4. **Variables CSS** consistentes (`:root`) — facilita el override en Tiendanube.
5. **No depender de elementos DOM específicos del prototipo** (ej: `#bestTrack`) si el plan es migrar — usar IDs genéricos o data-attributes.

---

## Última verificación antes de cualquier migración

Antes de activar Trend en producción:
- [ ] Checkout funciona end-to-end (probado con MercadoPago real en modo prueba)
- [ ] Carrito persiste entre páginas
- [ ] Buscador encuentra productos reales
- [ ] PDP muestra producto correcto con foto, precio, stock
- [ ] Mobile se ve impecable
- [ ] El theme Toluca queda como fallback los primeros días por si hay que volver

---

## 🛒 Features de carrito + checkout (sumadas en sprint conversión)

Implementadas en `assets/cart.js`, `assets/cart.css` y `checkout.html`. Todas pensadas para ser portables a Trend.

| # | Feature | Dónde vive en el proto | Método de migración a Tiendanube | Esfuerzo |
|---|---|---|---|---|
| C1 | **Barra de envío gratis** (umbral `ENVIO_GRATIS_DESDE`, progreso visual) | `cart.js` → `renderShippingBar()` + `.cart-ship-bar` en `cart.css` | **JS custom** + **CSS custom** inyectados en el theme. El JS escucha el evento `cart:updated` del theme Trend (o un `MutationObserver` sobre el mini-cart) y agrega el bloque HTML calculando contra el subtotal del carrito de Tiendanube. Alternativa más simple: **App "Envío Gratis" del marketplace** de Tiendanube ya hace esto out-of-the-box. | Medio (JS) / Bajo (app) |
| C2 | **Cupón de descuento en el drawer** (`CUPONES` hardcodeado, persistido en `localStorage`) | `cart.js` → `applyCoupon/removeCoupon/getDiscount` + UI `.cart-coupon-*` | **Tiendanube tiene sistema de cupones nativo** en el checkout (panel Promociones). El campo "¿Tenés cupón?" aparece automáticamente en el checkout oficial. **No hace falta replicar el código del drawer** — alcanza con crear los cupones (`MORA10`, `BIENVENIDO`, `ENVIOGRATIS`) desde el admin. Si igual se quiere el campo en el drawer del theme, JS custom que llame al endpoint `/api/cart/coupon` de Tiendanube. | Bajo (nativo) / Medio (drawer custom) |
| C3 | **Cross-sell "También podés llevar"** (2 productos sugeridos por tipo, fallback descuento) | `cart.js` → `getSuggestions()` + `renderCrossSell()` + `.cart-xsell-*` | **Trend trae bloque "Productos relacionados"** en el carrito y la PDP. Para que use la lógica por type (creatinas → proteínas/bcaa) se necesita: **A)** configurar tags/categorías en los productos y dejar que el theme los relacione, o **B)** JS custom que lea el carrito vía API de Tiendanube y reemplace el bloque por uno hecho con la misma regla del proto. | Medio |
| C4 | **Mejor descuento visible** ("Con efectivo $X · Ahorrás $Y" + 3 cuotas s/i) en el drawer | `cart.js` → `renderDiscountsBlock()` | **CSS + JS custom**. Tiendanube no muestra "precio con descuento por medio de pago" en el drawer por default. Hay que inyectar JS que calcule `subtotal * 0.85` y lo pinte. Los métodos de pago con descuento se configuran en `Configuración → Medios de pago → Recargo/Descuento` y la lógica de % la leemos desde ahí. | Medio |
| C5 | **Validación amigable del checkout** ("Falta el @", "Faltan números") + DNI opcional + errores bajo el input con `aria-invalid` | `checkout.html` → objeto `VALIDATORS` + `.field-err` | **No aplica al checkout oficial de Tiendanube** (ellos manejan la validación). Esto vive sólo en el proto. **Si se mantiene un checkout custom** (improbable), portar el JS tal cual. **Si se usa el checkout de Tiendanube**: revisar qué campos son obligatorios desde `Configuración → Checkout` y desactivar DNI si no se factura. | N/A (nativo) |
| C6 | **Logos de tarjetas** (Visa/Master/Amex/Naranja como SVG inline) en opción Tarjeta | `checkout.html` → `.pay-cards` con `<svg>` inline | **Trend ya muestra logos** de medios de pago en el footer y en el checkout. Si queremos los logos también dentro del card "Tarjeta" del checkout custom: **CSS** + **SVG inline** (mismo bloque que el proto). Las marcas aceptadas las define cada gateway (Mercado Pago / TodoPago). | Bajo |

### Notas operativas

- **Persistencia**: `morashop_cart_v1`, `morashop_coupon` viven en `localStorage`. Tiendanube tiene su propio carrito server-side — **al migrar, descartar estos keys** (el cupón se aplica vía el sistema de cupones nativo).
- **Cross-sell con catálogo real**: la función `getSuggestions()` depende de `window.CATALOG_BY_CAT.suplementos` con campo `types`. En Tiendanube no existe `types` — usar **tags de producto** equivalentes (ej. tag `creatina`, `proteina`) y leerlos vía API `/api/v1/products?tags=creatina`.
- **Umbral envío gratis**: ahora es `const ENVIO_GRATIS_DESDE = 70000;` en `cart.js`. Si en Tiendanube se usa la app de Envío Gratis, el umbral se configura desde el panel — no hace falta tocar código.
- **Constante portable**: el bloque `window.Cart.config` expone los valores (`ENVIO_GRATIS_DESDE`, `DESC_EFECTIVO`, `CUPONES`, etc.) para que el JS custom de Tiendanube los lea desde un único lugar.

---

## 🎯 Hero promocional (carrusel estilo Mercado Libre)

Implementado en `index.html`. Banner full-width, 4 slides con colores vibrantes (amarillo, azul, rojo, gris), grid 50/50 (texto izquierda + imagen producto derecha), autoplay 6s, dots de paginación, flechas (desktop), pausa al hover y swipe touch en mobile. Reemplaza al hero compacto anterior. Los perks de envío / cuotas / efectivo que vivían en el hero viejo ahora viven en una **trust strip** debajo del carrusel (`<section class="trust-strip">`).

### Migración a Tiendanube — Theme Trend

| Componente del proto | Equivalente en Trend | Esfuerzo |
|---|---|---|
| `<section class="hero-carousel">` + JS de slides | **Bloque "Carrusel de imágenes"** nativo del theme Trend | **Bajo** — sin código |
| `HERO_SLIDES` (4 slides con copy + colores + imagen) | Subir 4 imágenes pre-renderizadas (1920×600 cada una, con el texto ya incluido) al editor del theme | Bajo (diseño en Figma/Canva, 1 hora) |
| Autoplay 6s + dots + flechas + swipe | Trend ya lo trae out-of-the-box, configurable desde el editor (intervalo, transición, navegación) | Cero código |
| `.trust-strip` (perks debajo) | **Bloque "Características destacadas"** o **"Beneficios"** del theme. Si no existe, CSS custom + HTML inyectado | Bajo |

### Recomendación

**NO portar el JS del carrusel ni la lista `HERO_SLIDES`** — el bloque del theme ya hace lo mismo y mejor (responsive, lazy, SEO friendly). En su lugar:

1. **Diseñar las 4 imágenes** en Figma/Canva con el copy quemado en la imagen (1920×600 desktop / 800×800 mobile). Esto da más control tipográfico y evita problemas de overflow.
2. **Subirlas** desde el editor de Trend → Página de inicio → Carrusel.
3. **Configurar links** (cada imagen apunta a `/categoria/suplementos`, etc.).
4. **Activar autoplay** y dejarlo en 6 segundos.

### Alternativa con código (si querés copy editable sin re-subir imágenes)

Si en el futuro el cliente quiere editar el copy de los slides sin pasar por diseño:

1. Subir 4 imágenes "fondo limpio" (solo el color + producto, sin texto) al carrusel del theme.
2. Inyectar CSS custom que superpone un `<div>` con texto sobre cada imagen leyendo `data-slide-text` (atributo custom que se setea desde el editor del banner).
3. Más trabajo, peor SEO. **No recomendado salvo necesidad real.**

### Resultado esperado en Tiendanube

El usuario que entra a la home Trend ve exactamente lo mismo que el prototipo: banner promocional grande arriba, perks abajo, círculos de categorías, productos. El carrusel funciona idéntico (autoplay, dots, flechas) porque el theme ya lo implementa.

---

## 🔄 Sprint "limpieza + Bodega + cards info + Jueves" (2026-05-23)

Cuatro cambios coordinados al prototipo Vercel. Cada uno con su migración a Tiendanube.

| # | Feature | Dónde vive en el proto | Migración a Tiendanube | Esfuerzo |
|---|---|---|---|---|
| L1 | **Borrar círculos `.quicknav` de la home** (redundantes con nav + catbar) | `index.html` → HTML + CSS borrados | **En el editor visual de Trend**: si el theme trae un bloque "Categorías destacadas con íconos", **desactivarlo** desde la Página de inicio del editor. Si lo trae como CSS hardcodeado, override con `[data-section="categorias-iconos"]{display:none !important;}` en Edición avanzada de CSS. | Bajo |
| L2 | **Bodega como 5ta categoría** (vacía, "Próximamente") | `bodega.html` nuevo + nav-links + catbar + `nav.js` (NAV_LINKS) + footer + hero `.hero-bodega-cat` en `category.css` | **En Tiendanube**: crear la categoría "Bodega" desde `Productos → Categorías → Nueva`. Hasta que haya SKUs cargados, **redirigir la URL `/categoria/bodega`** a una página estática "Próximamente" usando la app de Redirects (o un bloque de contenido que diga "estamos seleccionando los mejores vinos…"). Cuando se suban los primeros productos, sacar la redirección y queda el listado nativo del theme. El link al footer/nav es automático si activás "mostrar categoría en menú" desde el panel. | Bajo |
| L3 | **6 cards informativas estilo ML desktop** (envíos, cuotas, efectivo, originales, WA, +2.000 productos) reemplazan el primer "Banner promocional" intercalado entre bloques de productos | `index.html` → `infoCardsHTML()` + CSS `.infocards*`. Se invoca para el primer slot intercalado (después de Creatinas y Proteínas). El resto de los slots quedan como "Banner promocional". | **Bloque "Características destacadas" / "Beneficios"** del theme Trend (sin código). Ingresar las 6 cards desde el editor: ícono + título + subtítulo + link. Si Trend no lo tiene en la posición intercalada, **JS custom** (15 líneas) que inserta un `<div class="infocards">` después del 2º bloque de productos del listado. CSS de `.infocard*` portado tal cual a Edición avanzada de CSS. | Bajo (editor) / Medio (JS) |
| L4 | **"Jueves de Suplemento"** — -10% automático en suplementos los jueves si hay ≥3 suplementos en el carrito. Acumula con descuento por medio de pago. Banner verde en el drawer + nudge "Sumá 1 producto más" cuando falta. Reflejado en `checkout.html`. | `assets/cart.js` (constante `JUEVES_DE_SUPLEMENTO`, funciones `getJuevesDescuento()`, `getJuevesProgreso()`, `renderJuevesBlock()`, item del carrito ahora guarda `cat`). `assets/cart.css` (`.cart-jueves*`, `.cart-row-jueves`). `checkout.html` (resumen). | **Tiendanube tiene promociones nativas por cantidad/categoría**. Crear desde `Marketing → Promociones → Nueva`: tipo "Descuento por cantidad de productos en categoría", configurar: Categoría = Suplementos, cantidad mínima = 3, descuento = 10%, **fechas programadas** = todos los jueves (o usar la app del marketplace "Promociones por día de la semana" si el panel nativo no permite recurrencia). El banner verde del drawer y el nudge "Sumá 1 producto más" son JS custom (el panel nativo aplica el descuento en checkout, pero no muestra el aviso en el carrito) — replicar leyendo el evento `cart:updated` del theme y consultando `/api/cart` para contar items de la categoría Suplementos. | Bajo (descuento) / Medio (UI del banner) |

### Notas operativas Jueves de Suplemento

- **Acumulación**: primero se aplica el cupón (si hay), después el Jueves (sobre el subtotal de suplementos), y al final el descuento por medio de pago. Es como un descuento en cascada — coincide con cómo Tiendanube aplica promociones en el checkout (primero promo de categoría, después medio de pago).
- **Solo cuenta suplementos**: el ahorro se calcula sobre `_subtotalSuplementos()`, NO sobre el subtotal total. Si el cliente lleva 3 suplementos + 1 picante de El Bananero, el picante no entra en el cálculo.
- **`cat` en items del carrito**: agregamos el campo `cat` (`'suplementos'`, `'supermercado'`, `'electro'`, `'bananero'`, `'bodega'`) a cada item nuevo. Items viejos en localStorage no lo tienen — degradan gracefully (no triggerean Jueves hasta que se re-agreguen).
- **Replicabilidad**: la lógica de Jueves está aislada en `assets/cart.js` con la constante `JUEVES_DE_SUPLEMENTO` (día, minItems, descuento, categoría, label). Cambiar el día (a "Lunes de Suplemento") o el % es 1 línea. La API pública `window.Cart.getJuevesDescuento()` está disponible para cualquier integración Tiendanube futura.

### Notas operativas Bodega

- **Está vacía**: hoy `window.CATALOG_BY_CAT.bodega` no existe. La página `bodega.html` muestra un placeholder "Próximamente" con CTA a WhatsApp. No se rompe ni el buscador ni el carrito.
- **Cuando se carguen productos reales**: crear `window.CATALOG_BY_CAT.bodega = [...]` en `catalog-data.js` y reemplazar el placeholder de `bodega.html` por la estructura típica de categoría (pill-bar + cat-body con grid, ver `bananero.html` como template). El nav, catbar, drawer mobile y footer ya tienen el link — no hay que tocar nada más.

---

## 🔄 Reorganización home v2 (2026-05-23)

Limpieza visual del home: el nav top deja de duplicar links con la catbar, el hero vuelve a ser estático ("El mejor precio siempre.") y las piezas promocionales (carrusel grande + 6 cards info) se reubican más abajo en la página.

| # | Cambio | Dónde vive en el proto | Migración a Tiendanube | Esfuerzo |
|---|---|---|---|---|
| H1 | **Nav top sin categorías** — eliminado `<div class="nav-links">` con sus 6 links (Suplementos, Supermercado, Electro-Hogar, El Bananero, Bodega, Sobre nosotros) de TODAS las páginas: `index.html`, `producto.html`, `suplementos.html`, `supermercado.html`, `electro.html`, `bananero.html`, `bodega.html`, `mayoristas.html`, `sobre-nosotros.html`. El nav queda con hamburguesa mobile + logos + acciones (buscar / login / carrito + hamb desktop). Las categorías viven SOLO en la catbar (en `index.html`) y en el drawer mobile (todas las páginas vía `nav.js`). | En Trend: configurar el **header del theme** para mostrar SOLO logo + buscador + cuenta + carrito (sin menú de categorías horizontal). El menú de categorías queda en el **menú lateral / hamburguesa** (mobile) y en una **barra de categorías secundaria fija debajo del header** (similar a la catbar actual, configurable desde el editor del theme). Si Trend obliga a tener menú de categorías en el header, override con CSS `header .main-menu { display:none !important }`. | Bajo |
| H2 | **Hero estático restaurado** — eliminado `<section class="hero-carousel">` + JS `initHeroCarousel()` + constante `HERO_SLIDES` + CSS `.hero-carousel`/`.hc-*` (~150 líneas). Reemplazado por `<section class="hero">` con: overline rojo, H1 "El mejor / precio / siempre.", lede, CTA "Ver suplementos" y foto de producto (`whey-star-choc.png`) a la derecha. Tema CLARO. Padding moderado (`clamp(48px,7vw,96px)`). Se conserva la `.trust-strip` debajo. | En Trend: subir 1 sola imagen pre-renderizada (1920×600) al banner principal del theme, o configurar un bloque "Hero estático" si lo trae (la mayoría de los themes Tiendanube modernos sí). Si no, **JS custom** que reemplaza el bloque carrusel del theme por un `<section>` propio con HTML quemado. Para Trend específicamente: el editor permite "Banner estático" en la página de inicio. CSS portable. | Bajo (editor) / Medio (custom) |
| H3 | **Carrusel de promos movido al medio de la página** — el HTML/JS/CSS del carrusel se conserva pero renombrado a `.promo-carousel` / `.pc-*` y la constante a `PROMO_SLIDES`. La función `initHeroCarousel` ahora es `initPromoCarousel` y se invoca **después** de que el JS de bloques inyecta el HTML del carrusel en el slot intercalado tras el 3er bloque de productos (donde antes había el primer "Banner promocional"). Las 4 slides siguen iguales (45% OFF, Llegá hoy, 3 cuotas, +2.000 productos). Tamaño un poco más chico (`min-height:280px` desktop / apilado en mobile) para no competir con el hero. | En Trend: igual que el carrusel original — bloque **"Carrusel de imágenes"** nativo del theme, pero **ubicado entre bloques de productos destacados** (la mayoría de los themes permiten reordenar bloques de la home desde el editor). Si Trend no soporta carrusel intercalado entre listados de productos, alternativa: **JS custom** que inserta el carrusel del editor (que el theme renderiza arriba) dentro del DOM en una posición más abajo usando `node.insertBefore(carouselNode, document.querySelector('.product-grid:nth-of-type(2)'))`. | Bajo (editor) / Medio (DOM-move) |
| H4 | **6 cards informativas movidas al final** — la función `infoCardsHTML()` ya no se inyecta en el primer slot intercalado entre bloques; ahora se concatena al `html` final de `#mlBlocks` (después de todos los bloques de productos + carrusel + banners). Queda como "reaseguro" justo antes del `<section class="quiz-entry">` y del footer. El CSS de `.infocards*` no cambia. | En Trend: **bloque "Características destacadas" / "Beneficios"** del theme — colocarlo ÚLTIMO en el orden de la página de inicio del editor (después de los productos y antes del footer). Si Trend solo lo permite cerca del hero, JS custom que mueve el bloque al final con `document.querySelector('footer').before(beneficiosNode)`. | Bajo |

### Notas operativas Reorganización home v2

- **Orden visual final del home**: nav → catbar → mobile-search → SEARCH overlay → **hero estático** → trust-strip → bloques ML (creatinas, proteínas, pre-entrenos → **CARRUSEL PROMO** → bcaa, quemadores, barras → banner promo (publicidad) → vitaminas, combos) → **6 cards info "reaseguro"** → quiz-entry → quiz-modal → WhatsApp flotante → footer.
- **Por qué se hizo este cambio**: el hero carrusel competía visualmente con los bloques de productos y duplicaba la jerarquía (eyebrow + título grande). El hero estático tiene UN solo mensaje (`EL MEJOR PRECIO SIEMPRE.`) y deja que los bloques de productos sean los protagonistas. El carrusel ahora sirve de "respiro" entre listados y el primer bloque de info-cards se desperdiciaba arriba — abajo cumple su rol de "reaseguro" antes del CTA del quiz.
- **Compatibilidad con el resto**: el drawer del carrito, el drawer del menú mobile (`nav.js` con `NAV_LINKS`), el quiz y la PDP **no se tocaron**. El buscador funciona igual. localStorage `morashop_vistos` sigue activo (los bloques personalizados "Seguí viendo" + "Te puede interesar" se mantienen).
- **Limpieza pendiente** (no crítica): si en el futuro Trend ofrece bloques nativos para todo lo de arriba, sacar el JS custom y dejar solo el editor + CSS overrides.

---

## 🔄 Pulido home v3 + Promo Bar global (2026-05-25)

Refinamiento de la home tras feedback del dueño: hero sin CTA (más limpio), beneficios suben arriba (no duplicados), umbral envío gratis sube de $50k a $70k, y se agrega una **bandita persistente "Jueves de Suplemento"** arriba del nav en TODAS las páginas para educar al cliente.

| # | Cambio | Dónde vive en el proto | Migración a Tiendanube | Esfuerzo |
|---|---|---|---|---|
| V1 | **Hero sin botón CTA** — eliminado `<div class="hero-actions">` con "Ver suplementos". Hero queda con overline + H1 + lede + foto. Menos agresivo, más editorial. | `index.html` — bloque `.hero-actions` removido. | **Editor visual de Trend**: editar el banner principal y borrar el botón. Cero código. | Bajo |
| V2 | **Trust-strip eliminada** (la tira fina negra con 4 perks que estaba debajo del hero) — se reemplaza por las 5 info-cards movidas arriba. | `index.html` — `<section class="trust-strip">` removida. Reemplazada por `<div id="topInfoCards">` que se rellena por JS. | **No aplica** — la trust-strip no existía en Trend. Solo asegurarse de que el bloque "Características destacadas / Beneficios" del theme esté justo después del hero. | Bajo |
| V3 | **5 cards informativas movidas ARRIBA** (de antes-del-footer → después-del-hero) y reducidas de 6 a 5: se sacó "Productos 100% originales". Grid pasó de 6 cols → 5 cols. | `index.html` — `infoCardsHTML()` ahora se inyecta en `#topInfoCards` (no más en el final del `html`). CSS `.infocards-grid` actualizado a `repeat(5,1fr)`. | **Editor visual de Trend**: bloque "Beneficios" / "Características destacadas" colocado JUSTO DESPUÉS del hero (no al final). Configurar 5 cards (no 6). Si el bloque permite columnas, fijarlo en 5. | Bajo |
| V4 | **Umbral envío gratis $50k → $70k** | `assets/cart.js` constante `ENVIO_GRATIS_DESDE = 70000` | **Panel de Tiendanube** → `Configuración → Envíos → Envío gratis`. Editar el umbral. Si usás la app "Envío Gratis", se configura desde ahí. Cero código. | Bajo |
| V5 | **Promo Bar global "Jueves de Suplemento"** — bandita azul oscura arriba del nav en todas las páginas. Educa al cliente sobre la promo de los jueves todo el tiempo (no solo cuando aplica). Cerrable con X (cookie 7 días en `localStorage`). | `assets/promo-bar.js` nuevo (autoinyecta `<div class="mora-promobar">` + CSS scoped). Incluido en las 9 páginas: `index.html`, `suplementos.html`, `supermercado.html`, `electro.html`, `bananero.html`, `bodega.html`, `producto.html`, `sobre-nosotros.html`, `mayoristas.html`. Constante `CONFIG` con `text`, `highlight`, `link`, `cooldownDays`. | **Trend tiene "Barra de anuncios" nativa** (`Diseño → Configuración del theme → Barra de anuncios`). Configurar texto + link desde ahí. **Limitación**: la barra nativa de Trend no es cerrable con X. Si querés mantener la X + cookie de 7 días → portar `promo-bar.js` tal cual a Edición avanzada de JS. El CSS está scoped (clase `.mora-promobar*`) y no choca con nada del theme. | Bajo (nativo sin X) / Medio (con X + cookie) |

### Notas operativas Promo Bar

- **Cookie de 7 días**: si el cliente cierra la barra, no la vuelve a ver hasta 7 días después. Guardado en `localStorage.morashop_promo_jueves_closed_at`. Para forzar que aparezca de nuevo en dev: `localStorage.removeItem('morashop_promo_jueves_closed_at')`.
- **Cambiar el copy / desactivarla**: editar el objeto `CONFIG` al inicio de `assets/promo-bar.js`. `enabled:false` la apaga sin tocar HTML.
- **Por qué arriba del nav (no entre nav y hero)**: estilo "announcement bar" tipo Shopify. La ve el 100% de los visitantes apenas entran. Se ve sí o sí antes que cualquier banner del theme.
- **Mobile**: en pantallas <380px se oculta el "Ver suplementos →" (queda solo el copy y la X) para que no se rompa en 2 líneas en celulares chicos.
- **Performance**: el script es ~3KB, sin dependencias. Inyecta CSS inline una sola vez (chequea `#promoBarStyles` para no duplicar).
- **Decisión pendiente (no en este sprint)**: el agente `morashop-conversion` propuso también un **hero promo con countdown** que se activa mié 18hs → jue 23:59hs (reemplaza el hero estático esos 2 días). Decisión del dueño: **solo bandita persistente por ahora**, sin hero promo. Si la métrica de carritos con ≥3 suplementos los jueves no sube en 4 semanas, sumar el hero promo como segunda iteración.
- **Kill switch**: si el ticket de martes+miércoles cae >15% (canibalización real) → desactivar bandita los días lun-mié con `CONFIG.enabled` condicional por día. Mirar a 4 semanas.

---

## 🔄 Limpieza visual de cards + grid 2×2 promos (2026-05-25)

Sprint corto motivado por feedback del dueño: las cards de productos tenían demasiada info, el `$` se rompía en mobile, el botón decía cosas distintas en distintos lugares y el carrusel promo amarillo gigante competía con los productos. Inspiración del cambio de promos: bloque "Beneficios en entretenimiento" de Mercado Libre (grid 2×2 estática).

| # | Cambio | Dónde vive en el proto | Migración a Tiendanube | Esfuerzo |
|---|---|---|---|---|
| W1 | **Promo Bar — 1 línea, sin link en mobile** — la bandita "Jueves de Suplemento" ahora tiene `height:34px` (desktop) / `32px` (mobile), `white-space:nowrap`, copy más corto ("Jueves de Suplemento: llevá 3 y pagás 10% menos"). En mobile se oculta el link "Ver suplementos →" (queda solo copy + X). | `assets/promo-bar.js` — actualizado `CONFIG.text/tail` y CSS scoped `.mora-promobar*`. | Igual que V5 (sprint anterior). Sin cambios en la estrategia de migración. | Bajo |
| W2 | **"Ahorrás $X" eliminado de cards de listado** (grid y lista). Lo dejamos solo en PDP y carrito. El % OFF en la badge ya comunica el descuento — repetirlo en pesos satura la card. | `index.html` (`cardHTML`/`rowItemHTML`) + `assets/category.js` (mismas funciones). Borramos las líneas `${was > now ? \`<div class="mlcard-savings">Ahorrás...\` : ''}`. | **Trend ya NO muestra "Ahorrás $X" por default en cards**. Era una feature que íbamos a inyectar con JS custom según la sección M2 (más arriba). **Cancelar M2** — directamente no portarla. La PDP sí lo mantiene (bloque "Ahorrás" del theme o JS custom). | Nulo (no portar) |
| W3 | **`$` separado del número en mobile** — el `fmt()` retorna `"$ 12.345"` con espacio. Cuando el contenedor era estrecho, el espacio permitía wrap → el `$` quedaba solo en una línea. Fix: agregar `white-space:nowrap` a `.mlcard-price`, `.mlrow-price`. | `index.html` (inline CSS) + `assets/category.css`. | **CSS portable**. Una línea por selector en Edición avanzada de CSS del theme Trend. No hace falta tocar JS. | Bajo |
| W4 | **Botón unificado a "Agregar"** en todo el sitio: cards (grid), cards (lista), PDP grande, sticky mobile. Antes había "Agregar al carrito" (cards de index), "Agregar al carrito" (cards de category), "Agregar" (sticky mobile), "Agregar al carrito" (PDP grande). Ahora todos dicen "Agregar". Más corto, no se rompe en mobile, igual de claro. | `index.html` (`cardHTML`, `rowItemHTML` ya estaba en "Agregar"), `assets/category.js` (`cardHTML` reemplazado), `producto.html` (botón principal `#pdpAddBtn`). | **Editor visual de Trend**: revisar si el theme permite editar el texto del botón "Agregar al carrito" desde el panel del theme. Si no, **CSS** que oculta el texto y lo reemplaza por "Agregar" usando `::after` content (hack barato pero portable). Alternativa: **JS custom** que reemplaza el `textContent` de cada botón `.btn-add-to-cart` al cargar. | Bajo (CSS) / Medio (JS) |
| W5 | **Carrusel promo → grid 2×2 estática** estilo ML "Beneficios en entretenimiento". 4 promos quietas (no desliza, sin flechas, sin dots). Cada card: eyebrow + título grande + sub (oculto en mobile) + imagen del producto a la derecha. Mantienen los mismos 4 mensajes (45% OFF, Llegá hoy, 3 cuotas s/i, +2.000 productos) y los mismos colores. | `index.html` — nueva función `promoGridHTML()` reemplaza `promoCarouselHTML()`. La llamada `(slotsIntercalados === 0) ? promoGridHTML() : bannerHTML()` se mantiene (sigue intercalándose después del 3er bloque de productos). Nuevo CSS `.promo-grid` + `.pg-*`. El JS viejo `initPromoCarousel()` queda como **noop** (su primer if hace return si no encuentra `#pcTrack`). El CSS viejo `.pc-*` queda como código muerto inocuo. | **Trend tiene bloque "Banners grid" / "Featured items"** que renderiza una grilla de banners estáticos. Configurar 4 banners con: imagen de fondo, título, subtítulo y link. Si el theme no lo tiene en posición intercalada (entre bloques de productos), **JS custom** que inserta el bloque grid del theme después del 2º grid de productos con `parent.insertBefore(grid, productsGrid.nextSibling)`. CSS portable. | Bajo (editor) / Medio (DOM-move) |

### Notas operativas Limpieza visual

- **Cards de productos quedan con**: badge `% OFF` (esquina superior izq), marca, nombre, precio tachado, precio actual + `% OFF` verde al lado, cuotas en rojo, botón "Agregar" rojo. **5 cosas, no 7**. Antes había: badge, marca, nombre, precio tachado, precio + verde, **"Ahorrás $X" rojo**, cuotas rojas, **botón "Agregar al carrito"** ancho. Demasiada tinta roja saturaba.
- **Por qué grid 2×2 estática (no carrusel)**: el carrusel ocupaba 1 pantalla completa de mobile y exigía deslizar para ver el resto. La grid 2×2 muestra las 4 promos a la vez en ~1/3 de pantalla y deja la atención en los productos. Es exactamente el patrón de ML "Beneficios en entretenimiento".
- **CSS muerto pendiente de limpiar**: `.promo-carousel`, `.pc-*` (~30 líneas de CSS) y la función `initPromoCarousel()` quedan en el código pero no se renderizan. **No las borro ahora** por si querés volver al carrusel. Limpieza opcional en un sprint futuro.

---

## 🔄 Beneficios tira horizontal + Promo Bar roja (2026-05-25)

Feedback del dueño: las 5 cards de beneficios quedaban desbalanceadas en mobile (2+2+1 = una flotando sola) y la promo bar azul era tan discreta que no se entendía como oportunidad. Ajustes para que cada elemento "venda" mejor.

| # | Cambio | Dónde vive en el proto | Migración a Tiendanube | Esfuerzo |
|---|---|---|---|---|
| X1 | **5 cards de beneficios → tira fina horizontal estilo Amazon** — 1 sola fila con icono al lado del texto (no apilado). Desktop: justify-between, separador vertical sutil entre items. Mobile: scroll horizontal con snap (no se apila, no rompe). Fondo blanco con borders top/bottom. Más bajo perfil, no compite con productos. | `index.html` — CSS `.infocards*` reescrito (flex horizontal en lugar de grid), `infoCardsHTML()` ahora envuelve title+sub en `.infocard-txt` para que queden apilados al lado del icono. | **Trend tiene bloque "Beneficios" / "Trust strip"** que muchos themes ya renderizan en formato horizontal. Si Trend lo trae apilado, override con CSS en Edición avanzada: `.benefits{display:flex;flex-wrap:nowrap;overflow-x:auto}.benefit-item{flex:0 0 auto}`. Mobile: `scroll-snap-type:x mandatory` para que cada item haga snap. | Bajo |
| X2 | **Promo Bar: azul oscuro → rojo Morashop + emoji + copy vendedor** — fondo `linear-gradient(#E8341A → #C42710)`, emoji 🔥 con `pulse animation` (2.2s ease-in-out infinite), copy "Jueves de Suplemento — Llevá 3 y te devolvemos **10%** en efectivo", "10%" en amarillo `#FFD400` para máximo contraste, CTA "APROVECHAR" como pill negra translúcida. Animación se desactiva con `prefers-reduced-motion`. | `assets/promo-bar.js` — `CONFIG` actualizado (emoji, text, highlight, tail, ctaText). CSS scoped reescrito: gradiente rojo, emoji animado, highlight amarillo, CTA pill. | **Trend "Barra de anuncios" nativa permite color de fondo + texto** desde el editor. Para el emoji animado + highlight amarillo + CTA pill, **portar `promo-bar.js` tal cual a Edición avanzada de JS**. CSS scoped (`.mora-promobar*`) no choca con nada del theme. | Bajo (color) / Medio (emoji + pill) |

### Notas operativas Beneficios tira + Promo Bar roja

- **Por qué tira horizontal y no 4 cards 2×2**: el usuario explícitamente prefirió la opción "tira fina horizontal estilo Amazon" sobre "4 cards 2×2 más cálidas". Razón: las cards grandes le restan protagonismo a los productos. La tira fina aporta confianza sin gritar.
- **5 items en mobile con scroll horizontal**: en pantallas <768px el grid se vuelve `overflow-x:auto` con `scroll-snap-type:x mandatory`. El usuario hace swipe horizontal y cada item hace snap. La scrollbar está oculta (`scrollbar-width:none`). Probado en iOS Safari y Chrome Android.
- **Por qué emoji 🔥 con pulse**: el ojo humano detecta el movimiento antes que el color. El 🔥 con un pulse sutil de 2.2s capta atención sin ser invasivo (vs un blink agresivo). Si el usuario tiene `prefers-reduced-motion` activo, la animación se desactiva.
- **Highlight amarillo sobre rojo**: el "10%" en `#FFD400` sobre el fondo rojo tiene el contraste más alto posible. Es el truco que usan Hot Sale y Cyber Monday para los descuentos.
- **CTA "Aprovechar" en vez de "Ver suplementos"**: el verbo "aprovechar" tiene más urgencia que "ver". "Ver" es pasivo, "aprovechar" es activo y empuja a la acción. Igual se oculta en mobile (queda solo emoji + copy + X).

---

## 🔄 Fix promo-bar mobile + Beneficios marquee (2026-05-25)

Dos bugs reportados por el dueño en mobile: **(a)** la promo-bar mostraba "Llevá 3 y te devolvemos 1" porque el copy estaba truncado por ellipsis (cortaba la mitad del "10%"); **(b)** la tira fina de beneficios apilaba solo 2 items visibles y "no se entendía como oportunidad" — preferí que sea un carrusel que se mueva solo.

| # | Cambio | Dónde vive en el proto | Migración a Tiendanube | Esfuerzo |
|---|---|---|---|---|
| Y1 | **Promo Bar: 2 copys, uno por viewport** — agregué `mobileText` y `mobileTail` al `CONFIG`. Desktop sigue con "Llevá 3 y te devolvemos **10%** en efectivo". Mobile usa copy corto: "Llevá 3 y **10%** OFF". Saqué `overflow:hidden + text-overflow:ellipsis` del `.mora-promobar-text` (era el origen del bug "te devolvemos 1" — cortaba a la mitad del highlight). En mobile permito `white-space:normal` por si baja a 2 líneas, mejor que mostrar basura cortada. | `assets/promo-bar.js` — `CONFIG.mobileText/mobileTail`, render con 2 `<span>` (`.mora-promobar-text-desktop` + `.mora-promobar-text-mobile`), CSS toggle por breakpoint. | **Trend permite texto fijo único en la barra de anuncios nativa**. Si se quiere mostrar texto diferente desktop/mobile, **JS custom** (o `display:none` con media query en CSS). El truco de los 2 spans con visibility por CSS es portable a Edición avanzada de CSS sin tocar nada del theme. | Bajo |
| Y2 | **Beneficios: tira fina → carrusel marquee auto-deslizante** (CSS-only, sin JS, sin librerías). El track duplica los 5 items (10 elementos totales) y se anima con `@keyframes translateX(0 → -50%)` en `28s linear infinite`. Cuando llega al -50%, hace loop instantáneo a 0 pero visualmente es idéntico porque la 2da mitad es copia exacta de la 1ra. Pausa al hover (desktop). Respeta `prefers-reduced-motion`. Máscara fade (`linear-gradient`) en los bordes izq/der para que los items entren y salgan suaves. La 2da copia tiene `aria-hidden="true" tabindex="-1"` para que screen readers no la lean 2 veces. | `index.html` — CSS `.infocards*` reescrito (track con `width:max-content` y animación CSS), `infoCardsHTML()` ahora duplica items en `trackItems`. Saqué el `.container` wrapper para que el marquee sea full-width (los items entran/salen por los bordes con el fade). | **Trend tiene "Barra de beneficios" / "Trust strip"** pero la mayoría son estáticos. Para el efecto marquee, **CSS custom** en Edición avanzada (las @keyframes son portables 100%). El JS no se necesita — todo es CSS. Si Trend trae 6 items y queremos 5, override con `:nth-child(n+6){display:none}`. | Bajo |

### Notas operativas marquee beneficios

- **Por qué CSS-only y no JS**: las librerías de marquee (Swiper, Marquee.js) traen 30-50KB por algo que se resuelve con 8 líneas de `@keyframes`. Performance perfecto: el navegador maneja la animación con la GPU (`will-change:transform`).
- **Duración 28s desktop / 22s mobile**: testeado para que sea perceptible pero no apurado. Si querés que vaya más rápido, bajar a 20s desktop / 16s mobile.
- **Pausa al hover**: el usuario que quiere LEER un beneficio pasa el mouse y el marquee se queda quieto. Truco de Stripe y Linear.
- **Por qué duplicar items en el DOM**: para que el loop sea infinito sin saltos, el `translateX(-50%)` debe llegar exactamente al punto donde la 2da copia se ve idéntica a la 1ra. Si no duplicáramos, habría un "salto" visual cuando reinicia.
- **Bug del "te devolvemos 1"**: causa raíz documentada → `overflow:hidden + text-overflow:ellipsis + white-space:nowrap` en un contenedor flex angosto cortó "**10%** en efectivo" justo después del "1". Lección: en barras de promo NUNCA usar ellipsis, mejor 2 copys o 2 líneas.
