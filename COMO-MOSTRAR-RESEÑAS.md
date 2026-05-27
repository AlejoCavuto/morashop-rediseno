# Cómo mostrar reseñas en Morashop — Guía paso a paso

> Estado actual: tenés ~20-100 reseñas en Tiendanube. Querés mostrarlas en cada PDP.

---

## ⚠️ ACLARACIÓN IMPORTANTE PRIMERO

**Tiendanube NO tiene sistema de reseñas nativo en el plan base.** Si decís que las tenés "todas en Tiendanube", probablemente:

- **Opción A**: las tenés cargadas en una **app del marketplace** (ej: Lily Reviews, AVALA, BK Reviews) ya instalada
- **Opción B**: las tenés en el **panel de Tiendanube** como descripciones manuales del producto (no son reseñas reales)
- **Opción C**: las tenés en el **theme con un widget custom** que alguien instaló antes

Antes de seguir, abrí tu panel Tiendanube y andá a:
1. **Aplicaciones** (menú lateral)
2. Mirá si tenés instalada alguna de: Lily Reviews, AVALA, BK Reviews, Trusty, Revie

**¿Tenés alguna instalada?**
- ✅ **SÍ** → saltá al **CASO 1**
- ❌ **NO** → seguí al **CASO 2**

---

## CASO 1: Ya tenés app de reseñas instalada

Si tenés una app instalada con reseñas cargadas:

### Activar el widget en la PDP

1. Panel Tiendanube → **Aplicaciones** → click en la app de reseñas
2. Ir a "**Configuración**" o "**Widgets**"
3. Activar:
   - ✅ "Mostrar en página de producto"
   - ✅ "Mostrar estrellas en listado de productos"
4. Elegir posición: **debajo de la descripción del producto** (estilo ML)
5. Personalizar colores: **rojo `#E8341A`** estrellas (o amarillo dorado)
6. Guardar

### Verificar que se vean

1. Abrir tu tienda en otra pestaña
2. Entrar a cualquier PDP
3. Bajar hasta el final → debería aparecer "Opiniones del producto" con estrellas

### Si NO se ven

- Limpiar cache del navegador (Ctrl+Shift+R)
- Verificar en panel de la app que el **theme esté configurado**
- Si seguís sin verlas → revisar el **código JS** en `Diseño → Edición avanzada de CSS`. Algunas apps requieren agregar 1 línea en el theme

---

## CASO 2: NO tenés app de reseñas

Entonces lo que tenés en Tiendanube **NO son reseñas reales**, son posiblemente:
- Texto pegado en la descripción de cada producto
- Comentarios sueltos sin sistema

### Solución: instalar app de reseñas + cargar las que tenés

#### Paso 1: Instalar AVALA Reviews (recomendado para 20-100 reseñas)

1. Panel Tiendanube → **Aplicaciones** → **Tienda de aplicaciones**
2. Buscar **"AVALA"**
3. Click "**Instalar**" → "**Aceptar permisos**"
4. **Prueba gratis 7 días** → cargás todo y después decidís

#### Paso 2: Cargar tus 20-100 reseñas existentes

AVALA tiene 3 formas de cargar reseñas:

##### A) Importar desde Excel/CSV (la más rápida si las tenés en una lista)

Crear un archivo `.csv` con estas columnas:

```
producto_id, nombre_cliente, ciudad, fecha, rating, titulo, comentario
123, Juan M., Caballito, 2025-12-15, 5, "Excelente", "Llegó al día siguiente. 100% original."
124, María L., Quilmes, 2025-12-12, 5, "Recomendado", "Compro hace años, distribuidor confiable."
...
```

Subir desde **AVALA panel → Importar → CSV**.

##### B) Importar desde Mercado Libre

Si tus reseñas vienen de tu cuenta vendedor ML:
1. AVALA panel → **Importar** → **Mercado Libre**
2. Pegar URL de tu tienda ML
3. Importa automáticamente con foto + nombre + estrella + comentario

##### C) Cargar manual una por una

Si son pocas (<20) y no las tenés en archivo:
1. AVALA panel → **Reviews** → **Nueva reseña**
2. Seleccionar producto
3. Pegar texto + rating + nombre cliente
4. Repetir

#### Paso 3: Activar widget en PDP (igual que CASO 1)

Mismo flujo: panel app → Widgets → activar PDP → guardar.

---

## 📋 Formato exacto para tu CSV (si vas por opción A)

Pega esto en Excel, completá filas con tus reseñas, exportá como **CSV (delimitado por comas)**:

```csv
producto_url,nombre,ciudad,fecha,rating,titulo,comentario
suplemento-en-polvo-sport-creatina-300g,Juan M.,Caballito,2025-12-15,5,Excelente,Llegó al día siguiente al pedido. Distribuidor de verdad.
whey-protein-star-nutrition-2lb,María L.,Quilmes,2025-12-10,5,Recomendado,Compro hace 3 años acá. Productos siempre originales.
creatina-ena-monohidrato-1kg,Diego F.,Vicente López,2025-12-08,5,Llegó al día,Pedí jueves de mañana y a la tarde tenía el pedido. WhatsApp atiende bien.
```

⚠️ El `producto_url` debe coincidir con el slug del producto en Tiendanube (mismo que aparece en el navegador después de `/productos/`).

---

## 🎨 Personalización visual del widget (opcional)

Para que las reseñas matcheen el estilo Morashop:

### Colores
- **Estrellas**: amarillo dorado `#FFB400` (o rojo `#E8341A`)
- **Fondo del bloque**: blanco con border gris
- **Botón "Ver más"**: rojo Morashop `#E8341A`

### CSS custom (en Tiendanube → Diseño → Edición avanzada de CSS)

```css
/* Reseñas — match estilo Morashop */
.avala-reviews-block,
.lily-reviews-container {
  background: #fff;
  border: 1px solid rgba(26,39,68,0.14);
  border-radius: 10px;
  padding: 24px;
  margin: 32px 0;
}
.avala-star,
.lily-star {
  color: #FFB400 !important;
}
.avala-rating-num {
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 900;
  color: #1A2744;
}
.avala-author-name {
  font-weight: 700;
  color: #1A2744;
}
.avala-author-city {
  font-size: 12px;
  color: rgba(26,39,68,0.6);
}
.avala-show-more-btn {
  background: #E8341A;
  color: #fff;
  border-radius: 6px;
  padding: 10px 20px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
```

---

## 🚨 Si NO querés instalar app (alternativa cruda)

Si NO querés pagar app mensual, **alternativa hardcodeada**:

### Opción cruda: reseñas en la descripción del producto

1. Panel Tiendanube → **Productos** → entrar a un producto
2. En "**Descripción**" → al final, pegar HTML:

```html
<hr>
<h3>⭐ Opiniones de clientes</h3>
<div style="background:#f5f6f8;padding:16px;border-radius:8px;margin:8px 0">
  <strong>⭐⭐⭐⭐⭐ Juan M. — Caballito</strong>
  <p>"Llegó al día siguiente. Distribuidor de verdad, productos 100% originales."</p>
  <small style="color:#888">15 dic 2025</small>
</div>
<div style="background:#f5f6f8;padding:16px;border-radius:8px;margin:8px 0">
  <strong>⭐⭐⭐⭐⭐ María L. — Quilmes</strong>
  <p>"Compro hace 3 años acá. Servicio excelente."</p>
  <small style="color:#888">10 dic 2025</small>
</div>
```

### Contras de esta opción
- ❌ NO sale en Google con estrellas (rich snippets)
- ❌ NO suma al rating general del producto
- ❌ Hay que copiar/pegar a mano en cada producto (20-100 productos × 5 reseñas = 100-500 pegadas)
- ❌ NO permite filtrar por rating
- ❌ Cliente nuevo no puede agregar reseña
- ✅ Cero costo
- ✅ Se ve

**Veredicto**: solo si tenés MUY pocas reseñas (5-10) y poca paciencia para apps. Sino, AVALA es mucho mejor.

---

## ✅ Mi recomendación final

Para 20-100 reseñas existentes:

1. **Instalá AVALA Reviews** (prueba gratis 7 días)
2. **Importá las 20-100 reseñas** vía CSV
3. **Activá widget en PDP** (debajo de descripción)
4. **Personalizá colores** con el CSS de arriba
5. **Configurá email automático** "Calificá tu compra" post-entrega para que sigan llegando solas
6. **Después de 7 días**: si funciona → pagás plan. Si no → desinstalás (las reseñas quedan exportables)

Tiempo total: **1-2 horas**.
Resultado: 100 reseñas reales visibles en tu sitio + estrellas en Google.

---

## 🆘 Si necesitás ayuda

- **Soporte AVALA**: support@avala.cloud (responden en email)
- **Soporte Tiendanube**: chat en el panel admin abajo a la derecha
- **Yo (Alejo)**: cavutoalejo10@gmail.com

---

## ❓ Preguntas pendientes

Mandame respuestas para ajustar:

1. ¿Las reseñas que decís que tenés son de **Mercado Libre**, **Excel**, **WhatsApp** o ya están en una app de Tiendanube?
2. ¿Sabés si tu plan de Tiendanube ya tiene alguna app de reseñas instalada? (panel → Aplicaciones)
3. ¿Las reseñas tienen **foto del cliente** o solo texto + nombre?
4. ¿Tenés cuenta vendedor de Mercado Libre con reseñas acumuladas? (eso simplifica importar)
