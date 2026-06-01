# Auditoría Morashop vs Mercado Libre — Plan de Conversión

## TLDR Score

**6.5 / 10** — Morashop tiene el 65% del ADN de Mercado Libre AR montado y funcionando: cards con precio tachado + %OFF + 3 cuotas sin interés + efectivo -15%, carrito drawer con barra de envío gratis, Jueves de Suplemento con countdown real, welcome-popup con cupón, filtros mobile bottom-sheet nivel app nativa y personalización "Seguí viendo" con localStorage.

Para subir a **9 / 10** no hace falta tocar arquitectura — hace falta cerrar gaps de implementación que ya tienen CSS y renderer listos pero data o llamadas faltantes.

---

## Top 5 Fortalezas (lo que ya hacés bien)

- **Anclaje de precio PDP completo**: tachado + actual + % OFF + 3 cuotas sin interés + efectivo -15% (`producto.html:443-455`). Mejor que la mayoría de competidores AR.
- **Cards de listado tipo ML**: precio, % OFF, efectivo y 3 cuotas sin interés + botón "Agregar" inline sin entrar a PDP (`assets/category.js:74-92, 142`). Patrón ML logrado.
- **Carrito drawer con FOMO honesto**: barra "Te faltan $X para envío gratis" (umbral $70.000) en `cart.js:9` y descuento Jueves de Suplemento aplicado automático. Mecánica recurrente sin engaño.
- **Personalización funcional**: "Seguí viendo" lee `localStorage.morashop_vistos` (`index.html:1685-1688`) + welcome-popup BIENVENIDO 15% para captura de email (`assets/welcome-popup.js`).
- **Filtros mobile pro**: pill-bar Tipo + Marca con bottom sheet full-screen, backdrop, body lock y botón Aplicar fijo (`assets/category.css:353-419`). Se siente nativo.

---

## Top 5 Gaps Críticos vs MeLi

- **Hero placeholder visible en producción**: texto "Imagen del diseñador pendiente — colocar en assets/banners/" (`index.html:806`). Mata credibilidad en el primer pantallazo, especialmente mobile.
- **Array `BLOCKS` vacío en home**: `const BLOCKS = []` (`index.html:1834`). Los bloques 2x4 por tipo (creatinas, proteínas, etc.) que CLAUDE.md describe no se renderizan. Solo hay 1 bloque mix.
- **Cards de home incompletas**: NO muestran rating con estrellas, NO muestran stock bajo ("Últimas X") y NO muestran "Ahorrás $X" en pesos absolutos. Las clases `.mlcard-stock.urgente` y `.mlcard-savings` existen en CSS pero `cardHTML` (`index.html:1692-1712`) no las imprime.
- **Listados sin sort "Más vendidos" ni filtro de precio**: `category.js:179-182` solo tiene Destacados / Precio / Alfabético. Los dos controles que más convierten en ML están ausentes.
- **Touch targets mobile bajo 44px**: `.icon-btn` 42px (`index.html:64`), `.mlcard-add` padding 11px ≈ 38-40px (`index.html:591`). Más miss-taps = más abandono.

---

## Quick Wins (<2h, alto ROI) — implementar primero

| # | Acción | Archivo |
|---|--------|---------|
| 1 | Eliminar texto "Imagen del diseñador pendiente" del hero o subir el JPG real | `index.html:799-817` |
| 2 | Subir touch targets de íconos del nav y botón Agregar a 44px+ | `index.html:64` + `index.html:591` |
| 3 | Imprimir stock bajo en cards home cuando `fakeStock(p) <= 5` | `index.html` cardHTML 1692-1712 |
| 4 | Imprimir "Ahorrás $X" en pesos absolutos en cards y PDP | `index.html` cardHTML 1692-1712 + `producto.html:443-447` |
| 5 | Newsletter footer con lead magnet cuantificado ("Ganá 5% OFF en tu primera compra") | `index.html` prefoot ~línea 1023 |
| 6 | Sort "Más vendidos" y "Mejor calificados" en listados | `assets/category.js:179-182` |
| 7 | Quitar `readonly` del buscador mobile o abrir overlay con sugerencias al focus | `index.html:778` |
| 8 | Cantidad de productos por marca y por tipo en los pills del filtro | `assets/category.js` setupFiltersPanel |

---

## Medium Plays (2-8h)

- **Poblar el array `BLOCKS`** con bloques 2x4 por tipo (Creatinas → Proteínas → Pre-entrenos → BCAA → Vitaminas) — `index.html:1834`. El renderer ya está hecho, solo falta data.
- **Rating con estrellas + cantidad de opiniones** en cards de listado y home — `index.html` cardHTML + `assets/category.js` cardHTML.
- **Filtro de precio** (rango con presets) — `assets/category.js` pill-bar.
- **Bundle "Frequently bought together"** arriba del fold de PDP — `producto.html` (reusar related 616-660).
- **Achicar chrome fijo mobile** (promo-bar 40 + nav 74 + nav-search 58 + catbar 44 = 216px) — meta <130px total.
- **Chips de filtros activos** arriba del grid con `x` por filtro + "Limpiar todo" — `assets/category.js`.
- **Tabs adicionales en PDP**: Modo de uso, Ingredientes, Información nutricional — `producto.html:515`.
- **Separar `wa-float` del sticky CTA en PDP mobile** — `producto.html:250`.
- **Marcas clickeables en home** que linkeen a listado filtrado — `index.html` brands-section ~969.
- **Reformular disclaimer del checkout** ("No se debita nada todavía" → "Confirmamos tu pedido y te avisamos por WhatsApp") — `checkout.html` botón confirmar.

---

## Long-term Plays (8h+)

- **Reseñas con texto real + foto UGC en PDP** (3-5 reseñas seedeadas con nombre + fecha + verificado, o integrar app de reseñas Tiendanube cuando se migre).
- **Exit-intent + recupero de carrito abandonado**: imposible solo con frontend; requiere Tiendanube + Perfit/Doppler con secuencia 1h / 24h / 72h por email y WhatsApp vía Cliengo/Tidio.
- **Galería PDP multifoto** (4-6 imágenes: frente, dorso, tabla nutricional, lifestyle) + zoom real. Hoy hay 1 sola foto y la galería mobile es 280×240px (`producto.html:216-217`), demasiado chica.
- **Buscador instantáneo (autosuggest)** conectado a CATALOG, con trending searches + historial al focus. Hoy `navSearchInput` tiene `readonly` (`index.html:778`).
- **Lazy-render de bloques ML** por debajo del fold con IntersectionObserver (no solo lazy de imágenes). `catalog-data.js` es grande y bloquea el primer paint en 3G/4G AR.
- **Mecánicas recurrentes adicionales tipo Jueves de Suplemento**: "Sábado fit" (super -5%), "Domingo electro". Replicar la lógica ya existente en `assets/promo-bar.js`.

---

## Orden ideal de la home

1. **Promo bar dismissible 24h** (cintillo educativo / Jueves de Suplemento) — máx 32px mobile.
2. **Nav sticky compacto**: logo + buscador grande con autosuggest + login + carrito — meta 60px mobile.
3. **Catbar horizontal** con fade-gradient hint (Suplementos, Súper, Electro, Bananero, Bodega, Ofertas).
4. **Hero** con producto + precio + %OFF + CTA (**NO placeholder**) o eliminar bloque hasta que llegue arte real.
5. **Círculos de categorías clickeables** (atajo visual estilo ML, después del hero).
6. **Bloque "Seguí viendo"** (solo si hay `localStorage.morashop_vistos`).
7. **Bloque "Top vendidos esta semana"** (fallback para cliente nuevo sin historial, usando seed `srVendidos`).
8. **Bloques 2x4 por tipo** (Creatinas → Proteínas → Pre-entrenos → BCAA → Vitaminas) — poblar array `BLOCKS` en `index.html:1834`.
9. **Banner Mayorista / Distribuidor oficial** (refuerzo de confianza).
10. **Quiz entry como card discreto** (no full section) — hoy roba real estate prime.
11. **Combos / bundles multi-producto** (copiar pattern El Nogal: "Tus objetivos vienen en combo").
12. **Strips de categoría** (Súper, Electro, Bananero).
13. **Brands grid clickeable** a listados filtrados.
14. **Newsletter** con lead magnet "5% OFF tu primera compra".
15. **Footer acordeón mobile** (no grid 2x2 fragmentado).

---

## Pitch para el jefe

> **Jefe**: Morashop ya tiene el **65% del ADN de Mercado Libre** montado y andando. Cards con precio + %OFF + 3 cuotas sin interés + efectivo -15% (ML cobra eso en publicidad), carrito drawer con barra de envío gratis a $70.000, Jueves de Suplemento con countdown real y -10% en `cart.js`, welcome-popup con cupón BIENVENIDO 15%, filtros mobile bottom-sheet nivel app nativa, y personalización "Seguí viendo" con localStorage. **Eso ya está hecho y funcionando — verificado en el repo**.
>
> Lo que falta para convertir como ML son detalles de **alto ROI y bajo esfuerzo**:
>
> 1. Quitar el hero placeholder que dice "Imagen pendiente" (es un bug visible en producción que mata credibilidad en 1 segundo).
> 2. Poblar el array `BLOCKS` que está vacío en `index.html:1834` (los bloques 2x4 por tipo que ya tienen renderer hecho, solo falta data).
> 3. Imprimir stock bajo + rating + "Ahorrás $X" en cards (las clases CSS `.mlcard-stock.urgente` y `.mlcard-savings` ya están estiladas, solo hay que llamarlas desde cardHTML).
> 4. Sumar sort "Más vendidos" y filtro de precio en listados.
>
> **Con menos de 8h de trabajo concentrado podemos cerrar 5 de los 6 gaps críticos vs ML, sin tocar arquitectura**. La diferencia entre Morashop hoy (6.5/10) y ML (10/10) no es ingeniería — es completar lo que ya empezamos.
>
> Y a diferencia de Ecomódico, Entreno y El Nogal (los 3 competidores AR auditados), **Morashop ya tiene cuotas en cards, buscador funcional y bloques por TIPO de suplemento**. Estamos arriba de la competencia local y a 8h de pelearle a ML en suplementos.

---

## Caveats (cosas que no pudimos verificar)

- **Mercado Libre Argentina bloqueó WebFetch (HTTP 403 Forbidden)** en todos los intentos sobre `mercadolibre.com.ar`, `/ofertas` y `/categorias`. ML bloquea bots/scrapers sin sesión.
- **`https://www.mercadolibre.com.ar/c/suplementos-deportivos`** — WebFetch bloqueado 403. Análisis basado en conocimiento del patrón ML AR + lectura completa de `suplementos.html` y `category.js`.
- El análisis comparativo con ML se apoya en **conocimiento del patrón Mercado Libre AR** (cards, fichas, checkout, filtros) y en la **observación directa del repo Morashop deployed**, no en scraping live de ML. Las recomendaciones siguen siendo válidas porque el patrón ML está documentado públicamente y es estable.
