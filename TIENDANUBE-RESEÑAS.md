# Reseñas / Calificaciones en Tiendanube — Investigación

> Investigado: 2026-05-27. Fuente: marketplace oficial de apps Tiendanube.

---

## ❌ Lo que NO trae Tiendanube nativo

Tiendanube **no incluye sistema de reseñas en el plan base**. Sin instalar app, NO hay estrellas, NO hay calificaciones, NO hay reviews. Hay que sí o sí instalar una app del marketplace.

---

## ✅ Top 6 apps disponibles (ordenadas por calificación)

| # | App | Rating | Precio | Plan free |
|---|---|---|---|---|
| 1 | **Lily Reviews** | 5.0 (396 reviews) | desde **$10.992/mes** ARS | 3 días prueba |
| 2 | **AVALA Reviews** | 5.0 (104 reviews) | pago (sin precio público en ARS) | **7 días prueba** |
| 3 | **Revie (WhatsApp)** | 4.8 (109 reviews) | compras in-app | — |
| 4 | **Trusty** | 4.7 (89 reviews) | pago | — |
| 5 | **BK Reviews** | 4.4 (92 reviews) | compras in-app | — |
| 6 | **Abejita Testimonios** | 4.9 (39 reviews) | compras in-app | — |

---

## 🏆 RECOMENDADO: **AVALA Reviews**

Por qué AVALA gana para Morashop:

### Pros
- ⭐ Rating 5.0 (104 opiniones)
- **7 días gratis** (vs 3 de Lily)
- **Importa reseñas de Mercado Libre** ← clave para Morashop, evita arrancar desde cero
- También importa de AliExpress, Shopee, Shein
- Fotos + videos en las reviews
- **SEO**: estrellas en resultados de Google (rich snippets) ← gana CTR
- Widgets personalizables (mantiene branding Morashop)
- Solicitudes automáticas post-compra por email

### Contras
- Precio no público en ARS — pedir cotización a support@avala.cloud
- No menciona soporte WhatsApp ni teléfono argentino

### Cómo instalarla
1. Tiendanube panel → **Aplicaciones**
2. Buscar "AVALA"
3. Click "Instalar"
4. Aceptar permisos
5. Configurar: idioma español AR, importar Mercado Libre con CSV
6. Probar widget en una PDP

---

## 🥈 ALTERNATIVA: **Lily Reviews**

Si AVALA no funciona bien:

### Pros
- Rating 5.0 (mejor que AVALA con 396 reviews vs 104)
- Soporte en español vía WhatsApp 7 días
- Q&A integrado (clientes preguntan, otros responden)
- Cupones automáticos por reseña (incentiva)
- Integración con Sak (plataforma argentina)

### Contras
- **Más cara**: $10.992/mes nivel base + extras por pedido
- Solo importa de Shopee + Excel (NO Mercado Libre directo)
- Solo 3 días free trial
- Cobra **por pedidos** además del fee mensual

---

## 🆓 Opción gratis (sin app paga): **Reseñas falsas con hash determinístico**

Lo que ya hicimos en el prototipo Vercel (rating + reviews fake por hash) **se puede portar a Tiendanube** con JS custom en Edición avanzada:

### Pros
- Cero costo mensual
- 100% editable copy
- Mismo aspecto que apps pagas

### Contras
- ❌ NO genera rich snippets en Google (precisa Schema.org JSON-LD válido con reviews reales)
- ❌ NO podés mostrar fotos/videos reales de clientes
- ❌ NO captura emails automáticos post-compra
- ⚠️ Riesgo legal: si cliente descubre que son falsas → daño reputacional
- ❌ No escala: cuando tengas 1000 productos, mantener fake data es imposible

**Recomendación**: fake data sirve para **prototipo Vercel hoy** (lo tenés). Para producción real en Tiendanube → instalar AVALA.

---

## 💡 Estrategia recomendada Morashop

### Fase 1 — Lanzamiento (mes 1)
1. Instalar **AVALA con prueba gratis 7 días**
2. Importar reseñas de tu **Mercado Libre actual** (si tenés cuenta vendedor con calificaciones)
3. Importar reseñas de **Shopee** si vendés ahí
4. Configurar email automático post-compra → pedir review + ofrecer cupón

### Fase 2 — Acumulación (mes 2-6)
5. Cada compra dispara email "Calificá tu producto" + cupón 5% próxima compra
6. Meta: **50+ reseñas reales por producto top** en 6 meses
7. Mostrar estrellas en listado + PDP + emails

### Fase 3 — SEO win (mes 6+)
8. Schema.org Product + AggregateRating → **estrellas en Google search** ⭐⭐⭐⭐⭐
9. Aumenta CTR orgánico 25-35% (según Search Engine Land)
10. Posicionás "morashop creatina" con estrellas vs competencia sin estrellas

---

## ⚙️ Implementación técnica

### Widget en PDP (donde más convierte)
```html
<!-- AVALA inyecta automáticamente en producto.tnube.com.ar/* -->
<div class="avala-product-reviews" data-product-id="{{product.id}}"></div>
```

### Widget en listado (cards)
```html
<!-- Estrellas mini en cards -->
<div class="avala-product-rating" data-product-id="{{product.id}}"></div>
```

### Schema.org auto-inyectado
AVALA inyecta JSON-LD `AggregateRating` en cada PDP automáticamente.

---

## ❓ Preguntas para Alejo (decisiones pendientes)

1. ¿Tenés cuenta vendedor activa en Mercado Libre con reseñas? → si sí, AVALA importa
2. ¿Cuántos productos vas a tener al lanzar? (define plan)
3. ¿Querés que las reseñas sean visibles en el listado (cards) o solo en PDP?
4. ¿Aceptás email automático post-compra pidiendo reseña? (recomendado)

---

## 📊 Comparación rápida final

| Feature | Lily Reviews | **AVALA** ⭐ | Revie WhatsApp | Fake (JS custom) |
|---|---|---|---|---|
| Plan free | 3 días | **7 días** | — | ✅ permanente |
| Precio | $10.992+/mes | a consultar | — | $0 |
| Importa de ML | ❌ | **✅** | ❌ | ❌ |
| Importa de Aliexpress | ❌ | ✅ | ❌ | ❌ |
| Fotos + videos | ✅ | ✅ | ❌ | ❌ |
| Rich snippets Google | ✅ | **✅** | ❌ | ❌ |
| Soporte español | ✅ WhatsApp | email | ✅ | n/a |
| WhatsApp pedidos review | ❌ | ❌ | ✅ | ❌ |

**Veredicto**: AVALA Reviews. Empezar con 7 días gratis, importar ML, evaluar conversión, decidir si sigue.
