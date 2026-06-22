# Plan Auditoría Morashop — tracking de implementación

> Tienda viva: https://www.morashop.ar/ (Tiendanube, deploy FTP desde `C:\Users\alejo\Downloads\Morashop\Backup_tienda\_\`).
> Auditoría hecha 2026-06-16 con Lighthouse 13.4 (Brave headless) + HTML real de producción + workflow multi-agente con verificación adversarial.
> Artefactos medidos en `_audit_data/` (live_home.html, live_pdp.html, lh_home_mobile.json, lh_pdp_mobile.json).

## Scores medidos (Lighthouse mobile, producción)
| | Home | PDP |
|---|---|---|
| Performance | 🔴 41 | 🔴 35 |
| Accesibilidad | 88 | 86 |
| Best Practices | 92 | 96 |
| SEO técnico | 85 | 92 |
| TBT | 700ms | 1.070ms |
| CLS | ✅ 0.001 | ✅ 0.02 |
| Peso | 3.1MB | 3.0MB |

> NOTA clave: el "LCP 19-22s" de Lighthouse es ARTEFACTO del throttle. LCP real (observado, sin throttle) = ~1.3-1.5s. El problema real es saturación de CPU por exceso de tags, no la pintura.

---

## Plan de acción (orden de implementación)

### [ ] 1. Podar tag stack — 🔥🔥 mayor lever de performance · esfuerzo MEDIO · admin/GTM
**Problema (CONFIRMADO):** 650KB de JS sin usar = 100% tracking de terceros (NO el catálogo). 5+ IDs de Google disparando:
- ❌ Universal Analytics `UA-219879602-1` — MUERTO (Google lo apagó), 63KB al pedo. SACAR.
- ❌ 2 GA4 distintos: `G-LDJT5VWZ9Y` + `G-71JE3LHQ50` — duplicado. Consolidar a 1.
- Google Ads `AW-478172026`, GTM `GTM-5LF9ZZR6`, FB Pixel `620541268579837`, TikTok Pixel, PostHog, MS Clarity, Hintup, CrossUp, Revie/Burbuxa.
- 137 requests, ~2MB de 3MB es script de terceros.
**Fix:** podar GTM (sacar UA muerto + GA4 dup, consolidar a 1 GA4), diferir pixels a post-load / first-interaction.
**Ganancia esperada:** TBT 700→~150ms, Perf 41→65-75, −650KB JS.
**RUTEO VERIFICADO (no es FTP — no está en el theme):**
- `UA-219879602-1` (MUERTO) + `G-LDJT5VWZ9Y` (GA4 #2) + `AW-478172026` (Ads) → dentro del contenedor **GTM `GTM-5LF9ZZR6`** (tagmanager.google.com). 0 refs en HTML estático = los dispara GTM en runtime.
- `G-71JE3LHQ50` (GA4 #1, nativo `dataLayerTN`) + FB Pixel `620541268579837` → **admin TN → Posicionamiento / códigos de seguimiento**.
- PostHog, MS Clarity, Hintup, CrossUp, Revie/Burbuxa → **apps instaladas**.
**Pasos:**
1. GTM: BORRAR tag Universal Analytics `UA-219879602-1` (Google dejó de procesar UA en jul-2024, 100% muerto, riesgo cero).
2. Decidir 1 solo GA4: o el de GTM (`G-LDJT5VWZ9Y`) o el nativo TN (`G-71JE3LHQ50`). Borrar el otro. Hoy corren 2 = datos duplicados + peso.
3. ⚠ NO borrar FB Pixel / TikTok / Google Ads si corrés campañas ahí (alimentan optimización de conversión). Si NO usás esa plataforma → borrar.
4. Apps: desinstalar las que NO uses (¿PostHog? ¿Hintup?). Clarity (heatmaps) y CrossUp (cross-sell) dejar si los usás.
5. (Avanzado) En GTM, disparar el contenedor con trigger diferido (post-load / first-interaction) en vez de All Pages.
**Verificación:** re-correr Lighthouse después → esperar Perf 41→65-75.
**ESTADO: BLOQUEADO.** El user NO tiene acceso al contenedor `GTM-5LF9ZZR6` (pestaña Cuentas vacía en su GTM). El contenedor lo inyecta TN admin (Códigos externos → "Cuenta de Tag Manager vinculada") pero su contenido lo controla el dueño del GTM (quien le dio permisos de Ads/Analytics). El UA muerto + GA4 dup viven adentro → necesita acceso GTM del dueño, o que el dueño lo pode.
⚠ NO usar "Desvincular GTM" en admin TN: mataría el tracking de conversiones de Google Ads (AW-478172026 vive dentro del GTM).
GA4 nativo TN = `G-71JE3LHQ50` (admin → Códigos externos, OK dejarlo). El duplicado a sacar es el de adentro del GTM (`G-LDJT5VWZ9Y`).
**Self-serve que SÍ puede:** admin TN → Mis aplicaciones → desinstalar apps no usadas (PostHog, Hintup) = baja peso sin tocar GTM.
**AVANCE 2026-06-17:** el de Ads dio acceso/mandó captura del contenedor GTM-5LF9ZZR6. Solo tiene 3 tags, TODAS de Google Ads (NO borrar ninguna): "Etiqueta base Google Ads", "GA - Conversión Compra" (purchase), "Vinculación de conversiones". El UA muerto + GA4 dup NO están como tags sueltos → probablemente son destinos vinculados DENTRO de "Etiqueta base Google Ads - Morashop" (Google tag puede rutear a varios IDs). PENDIENTE: que abra ese tag y mande captura de sus IDs/destinos vinculados para ver si UA-219879602-1 / G-LDJT5VWZ9Y están ahí. Esperando respuesta del de Ads.

### [~] 2. Bug de precio en cards home — RE-EVALUADO: BAJA PRIORIDAD, NO TOCAR LOOK
**Estado:** el dueño confirmó que LE GUSTA cómo se ve la home (cards limpias) y la PDP (con chip "con Efectivo"). VERIFICADO contra HTML real: los precios visibles SON correctos — el 15% efectivo es real en toda la tienda (PDP: $27.108 → $23.041,80 = 15% exacto vía componente nativo). NO hay mentira de precio activa.
**Lo único que queda (latente, no urgente):** `cavutia-carrusel.tpl:510` hardcodea `price*0.85` + "-15% OFF en Efectivo". Hoy es correcto (15% global) pero si cambian el % de efectivo en admin, las cards cavutia NO se actualizan solas. NO se puede hacer dinámico sin cambiar el look (componente nativo renderiza distinto), y el dueño quiere mantener el look.
**Decisión:** NO redISeñar. Dejar como está. Opcional futuro: factorizar el 15% a una sola variable Twig para mantenibilidad (sin cambio visual). Las strips principales (LO MAS BUSCADO) ya usan cards nativas limpias.

### [x] 3. Título + meta SEO home — Alto · esfuerzo BAJO · admin ✅ HECHO 2026-06-16
**Problema (CONFIRMADO):** `<title>` = solo "Morashop" (cero keywords). Meta desc genérica.
**Fix aplicado (admin TN → Posicionamiento):** Título → `Morashop | Suplementos, Proteína y Creatina en Argentina` (56 car, marca primero, no se trunca). Descripción → `Comprá suplementos deportivos en Argentina: proteínas, creatina, pre-entreno y más. Envío a todo el país. Mercado Líder Platinum con +5 años.` (140 car).
**Nota:** Google tarda días/semanas en reflejarlo.

### [x] 4. Imagen LCP de PDP no precargable — Alto · esfuerzo BAJO · código ✅ HECHO 2026-06-16
**Problema (CONFIRMADO):** foto producto usa lazysizes (`data-srcset`, sin `src`) → arranca 1.330ms tarde (resourceLoadDelay).
**Fix aplicado:** preload de la 1ª foto del producto en `layouts/layout.tpl` head (rama `template == 'product'`, patrón for+loop.first del slider, `fetchpriority="high"`, mismo srcset/sizes que product-image.tpl). NO toca el markup del swiper → cero riesgo de romper el gallery. preload-images.tpl quedaba solo para home (include en layout.tpl:15 con `template=='home'`), por eso fue directo en el head.
**FALTA SUBIR POR FTP:** `layouts/layout.tpl` → `/layouts/`.
**Verificar:** re-correr Lighthouse PDP → resourceLoadDelay ~0, Perf 35→~50.

### [x] 5. Render-blocking head — Alto · esfuerzo BAJO · código ✅ HECHO 2026-06-16
**Problema (CONFIRMADO):** el `@import` de fuentes en `morashop-rediseno.scss:7` (Barlow Condensed+Inter) cargaba en SERIE (se descubre recién tras bajar la scss) y bloqueaba. Inter cargaba 2 veces (nativo Sora|Inter + este).
**Fix aplicado:**
1. Saqué el `@import` de `morashop-rediseno.scss:7` (reemplazado por comentario).
2. `layout.tpl` head: agregué preconnect a fonts.googleapis.com + fonts.gstatic.com (cerca de línea 6) + un `<link rel=stylesheet>` de Barlow Condensed+Inter con display=swap (antes de la scss link). Ahora la fuente se descubre en paralelo, no en serie.
3. Bumpeé versión cache de la scss → `?v=20260616a` (la edité con #6 + #5).
**NO hice async la morashop-rediseno.scss** (estila above-the-fold → daría FOUC en las cards que el dueño quiere mantener).
**FALTA SUBIR POR FTP (los 2, re-subir):** `layouts/layout.tpl` → `/layouts/` + `static/css/morashop-rediseno.scss` → `/static/css/`.

### [x] 6. Contraste AA — Medio · esfuerzo BAJO · código ✅ HECHO 2026-06-16
**Problema (PARCIAL):** `--mr-text-soft: rgba(26,39,68,0.58)` = 3.7:1 (falla 4.5:1) en subtítulos, breadcrumbs, precio tachado. NO afecta nombres de producto (usan navy full, pasan).
**Fix aplicado:** `morashop-rediseno.scss:13` → `--mr-text-soft: #5b6472;` (5.9:1, pasa AA).
**FALTA SUBIR POR FTP:** `static/css/morashop-rediseno.scss` → `/static/css/`. (Pendiente: limpiar fallbacks inline :2937 alpha 0.40, :2812 alpha 0.50 si reaparece el fail.)

### [ ] 7. Unificar paletas + limpiar bloque precio card — Medio · esfuerzo MEDIO · código
**Problema:** 2 navy (`#001c4b` vs token `#1A2744`), 2 rojo (`#d40000` vs `--mr-red #E8341A`), 2 verde (`#1fa22e` vs `--mr-green #00A650`) conviviendo. Card home apila 5 renglones de precio (viola Hick). Card home ≠ card listado (2 design systems).
**Fix:** reemplazar colores hardcodeados por tokens en `cavutia-carrusel.tpl` + `cavutia-home-redesign.tpl`. Dejar 1 precio dominante + "Ahorrás $X". Igualar card home a listado.

### [~] 8. AggregateRating vía Revie — Alto CTR · esfuerzo MEDIO · app — PENDIENTE (sin acceso)
**Problema (PARCIAL):** los 4 Product JSON-LD de PDP NO son duplicado (son carrusel relacionados, OK). Falta `AggregateRating` → no hay estrellas en Google. Revie ya muestra 1798 reseñas/4.98 en PDP.
**Fix:** activar rich snippets en panel Revie. NO inventar ratings (penalización Google).
**ESTADO: diferido** — el dueño no tiene acceso al panel de Revie. Retomar cuando consiga acceso.

### [ ] 9. SEO code quick wins — Medio · esfuerzo BAJO · código (NO necesita acceso admin, NO cambia el look)
- `snipplets/grid/item.tpl:154`: nombre de producto `<div class="item-name">` → `<h3 class="item-name">` (mismas clases CSS, Google entiende mejor las listas de categoría → long-tail "creatina ENA").
- `snipplets/product/product-image.tpl:47-48`: fallback de `alt` a `{{ product.name }} {{ product.brand.name }}` cuando `image.alt` vacío.
- `snipplets/home/home-slider.tpl:46`: alt del hero con keyword en vez de "Carrusel N".
✅ HECHO 2026-06-16:
- `item.tpl:154`: `<div class="...item-name...">` → `<h3 ...>` + `style="font-weight:inherit;"` (neutraliza la negrita default del h3 — `.item-name` define font-size pero NO font-weight, style-critical.scss:1877). Aspecto idéntico, mejor SEO de listados.
- `product-image.tpl:47`: alt → `{{ image.alt }}` o fallback `{{ product.name }} {{ product.brand.name }}` si vacío.
- `home-slider.tpl:41`: alt hero → `slide.title · Morashop` o `Suplementos en oferta · Morashop`.
- **FALTA SUBIR POR FTP:** `snipplets/grid/item.tpl` → `/snipplets/grid/` · `snipplets/product/product-image.tpl` → `/snipplets/product/` · `snipplets/home/home-slider.tpl` → `/snipplets/home/`. (Sin version bump, no toqué scss.)

---

## Downgradeados por verificación (menor gravedad de lo dicho — opcionales)
- **H1 duplicado PDP:** ambos en DOM pero mutuamente ocultos por CSS (mobile/desktop). Cosmético. Opcional: mobile h1→h2/span.
- **Subir estrellas Revie al precio:** el CSS las suprime A PROPÓSITO (`scss:1048-1055`, decisión registrada). Necesita OK del dueño + sacar kill-rules.

---

### [x] 10. Rediseño PDP: Descripción + "Ver más detalles" — pedido user (se veía "sucio") ✅ HECHO 2026-06-17
- **Descripción** (`product-description.tpl`): rediseño "Card editorial" elegido por el user. Card suave (fondo blanco, borde tenue, radius 16px, sombra). Degradado al cortar en vez de corte duro a 80px. Toggle = link centrado rojo marca con chevron que rota (antes: caja navy #001c4b plana con bug de hover). Tipografía interna prolija (line-height 1.6, p/ul/li). Tokens de paleta. JS actualizado para no borrar el chevron.
- **"Ver más detalles"** (`product-form.tpl:69`): de link de texto pelado → pill branded con ícono tarjeta + chevron, hover rojo. Estilo inline en el mismo tpl.
- **FALTA SUBIR POR FTP:** `snipplets/product/product-description.tpl` + `snipplets/product/product-form.tpl` → `/snipplets/product/`. (Sin version bump — estilos inline en los tpl.)

## MEDICIÓN POST-DEPLOY #4+#5+#6 (2026-06-16)
Lighthouse mobile, 2 corridas:
- **PDP: LCP 22.4s → 14.9s ✅ | FCP 7.5s → 4.2s ✅** (preload de foto + fuentes funcionó)
- **Home: TBT 700 → 590ms ✅ | Perf 41 → 44**
- ⚠ **PDP CLS 0.02 → 0.18 (regresión)** — atribuida a `div#___ratingbadge_0` = badge Google Merchant (apis.google.com/platform.js vía `static/js/google-survey.js.tpl`). NO es por editar templates: al acelerar la carga, el badge ahora aparece DENTRO de la ventana medida y empuja contenido (antes la lentitud lo tapaba, badge shift era 0.000).
- **FIX aplicado:** regla CSS en `morashop-rediseno.scss` forzando `div[id^="___ratingbadge"]` a `position:fixed` (fuera de flujo). Versión scss bump → `?v=20260616b`.
- **CLS FIX CONFIRMADO (subido + medido):** CLS 0.18 → **0.001** ✅, ratingbadge shift 0.182 → 0.000. Versión 20260616b viva.
- TBT sigue alto (960-1060ms PDP) → eso es el tag bloat de #1 (bloqueado), no se mueve hasta podar GTM. Mientras TBT esté en ~1s, el LCP/FCP throttled bailan mucho entre corridas (14.9s vs 25.5s) y el Perf score NO sube a verde. #1 es el techo.
- **TODO el código de bajo riesgo está hecho y subido (#4,#5,#6 + fix CLS badge).** Lo que queda es #1 (bloqueado, GTM), #3 (admin SEO), #8 (Revie panel).

## Pendiente de datos duros (no se pudo medir)
- PageSpeed/CrUX field data (quota keyless agotada) — correr con API key para datos de usuarios reales.
- Lighthouse home DESKTOP (falló por lock de temp) — opcional, mobile = 75% tráfico.
