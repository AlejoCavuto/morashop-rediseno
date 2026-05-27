# Análisis Competencia — 4 webs (2026-05-27)

> Análisis directo (vía WebFetch) de 4 e-commerce argentinos de suplementos.
> Foco: qué copiar, qué hacer mejor, qué evitar.

---

## 🏆 RANKING RÁPIDO

| # | Web | Fuerte en | Débil en |
|---|---|---|---|
| 1 | **entreno.com.ar** | Categorías ricas, stock visible, popup cupón, descuentos agresivos -58% | Sin reseñas, sin rating, sin fidelización |
| 2 | **elnogalsuplementos.com** | Urgencia stock ("Solo quedan 172"), testimonios reales, local físico Ramos Mejía | Estructura home pobre, pocas secciones |
| 3 | **ecomodico.com** | Variedad rubros (no solo supl), reseñas Google, certificaciones AFIP+CACE | Confuso, no especialista |
| 4 | **suplementoscolo.com.ar** | Combos por objetivo, woman+protein project lines, 6 cuotas s/i | Hero débil, sin trust signals |

---

## 📋 JUGADAS PARA COPIAR (alta prioridad)

### 1. **Popup 5% OFF primera compra** (Entreno)
- "GANÁ UN CUPÓN DE 5% OFF" → captura email + activa cupón
- **Morashop ya tiene `BIENVENIDO` 15% en cart.js** → falta popup que lo active

### 2. **Stock urgencia visible** (Entreno + El Nogal)
- Entreno: "86 en stock", "7 en stock", "3 en stock"
- El Nogal: "¡Solo quedan 172 en stock!", "¡No te lo pierdas, es el último!"
- **Morashop**: hash determinístico genera stock fake, **mostrarlo en cards listado** (hoy solo PDP)

### 3. **Testimonios con foto + nombre** (El Nogal)
- 5 reseñas reales con cita textual: *"Tienen absolutamente de todo en lo que es suplementos"*
- **Morashop**: agregar bloque "Lo que dicen nuestros clientes" antes del footer

### 4. **Reseñas Google integradas** (Ecomodico)
- 4 bloques "Calificación google" con estrellas
- Genera confianza máxima — la review es externa, no propia
- **Morashop**: pedirle a Alejo configurar Google Reviews + integrar widget

### 5. **Certificaciones AFIP + CACE** (Ecomodico)
- Sellos al pie. Súper argentino, súper trust
- **Morashop**: agregar en footer si Alejo está inscripto (probable)

### 6. **Combos por objetivo** (Suplementos Colo)
- "Aumento muscular", "Definición", "Energía", "Descenso"
- **Morashop**: hoy hay sección "Combos" tipo plana. Reorganizar por **objetivo del cliente**, no por tipo de producto

### 7. **Barra envío gratis dinámica** (Entreno, Suplementos Colo)
- "¡Estás a $X de tener envío gratis!"
- **Morashop ya lo tiene en cart drawer** ✅ — bien

### 8. **Schema.org microdata** (Entreno + Colo)
- Datos estructurados precio + disponibilidad para SEO
- **Morashop**: agregar `<script type="application/ld+json">` en PDP

### 9. **WhatsApp prominente** (todos)
- **Morashop ya tiene wa-float** ✅

### 10. **Línea propia** (Suplementos Colo: "Protein Project", "Woman")
- Marcas propias del retailer dentro del catálogo
- **Morashop**: idea futura — línea Morashop propia (cuando crezca)

---

## 🚫 ERRORES DE LA COMPETENCIA (Morashop puede ganar)

### Entreno
- ❌ Hero vacío, solo banner marcas sin copy fuerte → **Morashop**: hero con tagline branding fuerte
- ❌ Sin reseñas, sin rating, sin fidelización → **Morashop**: implementar
- ❌ Categorías muy profundas (37 marcas en menú) → confunde → **Morashop**: 5 cats top

### Ecomodico
- ❌ No especialista (vende todo, desde pañales hasta whey) → percepción débil → **Morashop**: foco suplementos como rubro principal
- ❌ Carga lenta, dice "CARGANDO..." al inicio → **Morashop**: lazy load + skeleton

### El Nogal
- ❌ Estructura home pobre (solo 6 bloques) → **Morashop**: 8+ bloques (creatinas, prots, pre, bcaa, etc)
- ❌ Sin nav top, todo en hamburger → **Morashop**: catbar visible

### Suplementos Colo
- ❌ Sin trust signals visibles → **Morashop**: marcas + certificaciones
- ❌ "0% OFF" mostrado (descuento que no existe) → confunde → **Morashop**: solo mostrar % si hay real

---

## 🎯 GAPS DE MERCADO (nadie hace bien, Morashop puede ser primero)

| Gap | Cómo ganarlo |
|---|---|
| **Top-of-mind branding** (todos son tiendas, ninguno "ES" suplementos) | Tagline persistente: *"Comprar suplementos es Morashop"* en footer, email, packaging, redes |
| **Personalización con historial** (nadie muestra "lo último que viste") | Morashop ya tiene infra (`localStorage morashop_vistos`) — explotar |
| **Cross-sell inteligente** | Si compra creatina → sugerir whey + shaker. Hoy nadie lo hace bien |
| **PDP completa** (todos PDPs pobres) | Stock + vendidos + rating + cross-sell + envío estimado + cuotas en pesos exactos |
| **Comunidad** (nadie tiene blog activo ni foros) | Blog con guías de entrenamiento + recetas + tips. SEO + autoridad |
| **B2B mayorista visible** | Suplementos Colo tiene "Mayoristas" en menú — Morashop ya tiene `mayoristas.html` ✅ |

---

## 💡 IDEAS NUEVAS BASADAS EN ANÁLISIS

### Tagline candidatos (para top-of-mind)

- *"Comprar suplementos es Morashop"* (directo, posicionamiento)
- *"Suplementos a precio justo"*
- *"El distribuidor de Argentina"*
- *"Tu tienda de confianza"* (genérico, descartado)
- *"Todo lo que necesitás para entrenar"* (amplio pero ok)

### Bloque "Lo más buscado" (para cliente nuevo sin historial)

- Top 8 productos por hash determinístico
- Badge rojo "#1 MÁS VENDIDO" en el primero
- Vendidos visible: "1.247 personas lo compraron este mes"

### Bloque "Comunidad / Testimonios"

- 4-6 testimonios fake-pero-verosímiles con foto + nombre + ciudad
- Cita estilo: *"Lo pido los jueves y me llega antes que los pedidos de Mercado Libre."* — Juan M., Caballito
- Estrellas Google embebidas si Alejo tiene cuenta GMB

---

## 🛠️ PLAN DE ACCIÓN ORDENADO POR ROI

| Prio | Acción | Esfuerzo | Impacto |
|---|---|---|---|
| **🔥 1** | Popup 5% OFF primera compra (activa cupón `BIENVENIDO`) | Bajo | Alto |
| **🔥 2** | Stock visible en cards listado ("Quedan X") | Bajo | Alto |
| **🔥 3** | Bloque testimonios antes de footer | Bajo | Medio |
| **🔥 4** | Bloque "Lo más vendido" en home | Bajo | Alto |
| 5 | Reseñas Google embebidas | Medio (depende GMB) | Alto |
| 6 | Tagline "Comprar suplementos es Morashop" en footer + nav | Bajo | Branding |
| 7 | Combos reorganizados por OBJETIVO | Medio | Medio |
| 8 | Schema.org PDP + SEO | Medio | Alto (largo plazo) |
| 9 | Blog + SEO + comunidad | Muy alto | Muy alto (largo plazo) |

---

## 🤖 AGENTES NUEVOS

Basado en hallazgos, 4 agentes especializados:

| Agente | Rol |
|---|---|
| **morashop-branding** | Tagline, top-of-mind, copy posicionamiento, identidad coherente |
| **morashop-social-proof** | Reseñas, ratings, vendidos, testimonios, Google Reviews, stock visible |
| **morashop-seo** | Schema.org, meta tags, "morashop" como query, structured data |
| **morashop-comunidad** | Blog, contenido editorial, guías, recetas, autoridad de marca |
