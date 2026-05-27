# Popup primera compra 10% OFF — Cómo implementarlo

## Estado actual

✅ **Prototipo Vercel**: ya funciona. Popup aparece 6s después de cargar la home, captura email, aplica `BIENVENIDO` 10% OFF al carrito.

❌ **Tiendanube real**: no implementado todavía. El popup del prototipo NO se conecta automáticamente con tu Tiendanube.

---

## 3 formas de implementarlo en Tiendanube (de más fácil a más completa)

### 🥇 OPCIÓN 1: App de marketplace (la más rápida, 30 min)

Tu panel YA tiene **"Abejita: Cupón y Descuento Pop Up"** instalado y activado (lo vi en tu lista de apps).

**Pasos**:
1. Panel Tiendanube → **Aplicaciones** → click **Abejita**
2. Ir a **Configurar**
3. Crear nuevo popup:
   - **Trigger**: primera visita o tiempo 6s
   - **Texto**: "Llevate **10% OFF** en tu primera compra"
   - **Campo email**: activar (capturar lead)
   - **Cupón**: crear `BIENVENIDO` con 10% OFF (paso siguiente)
   - **Diseño**: rojo Morashop `#E8341A` + amarillo `#FFD400`
4. Panel Tiendanube → **Marketing → Promociones → Nueva**
   - Tipo: **Cupón de descuento**
   - Código: `BIENVENIDO`
   - Descuento: **10%**
   - Límite: 1 uso por cliente
   - Vigencia: indefinida (o 6 meses)
5. Volver a Abejita → vincular el popup con el cupón `BIENVENIDO`
6. Activar

**Listo**. Cliente nuevo entra → ve popup → deja email → recibe cupón → lo aplica en checkout.

**Costo**: Abejita ya la tenés activada, no pagás extra (chequear si plan free incluye captura email).

---

### 🥈 OPCIÓN 2: Doppler / Mailchimp (más profesional, 1-2 horas)

Si querés email marketing **automatizado** (no solo el cupón, también newsletters semanales, jueves recordatorio, etc.):

**Pasos**:
1. Crear cuenta gratis en **Doppler** ([doppler.com](https://doppler.com)) — argentino, integra Tiendanube nativo
2. Panel Tiendanube → **Aplicaciones → Buscar "Doppler"** → instalar
3. Configurar lista "Suscriptores BIENVENIDO"
4. Crear automation:
   - Trigger: nuevo suscriptor
   - Email 1 (instantáneo): "Bienvenido + cupón `BIENVENIDO` 10% OFF"
   - Email 2 (3 días después): "Te falta usar tu 10% OFF"
5. En Abejita popup → cambiar destino del email a **Doppler list**
6. Configurar cupón `BIENVENIDO` igual que opción 1

**Resultado**: cupón llega por email + entra a lista para futuras campañas.

**Costo Doppler**:
- Gratis hasta 500 contactos
- $4.000-8.000 ARS/mes desde 1000 contactos

---

### 🥉 OPCIÓN 3: App propia (60 hs dev)

NO RECOMENDADO. Mismo análisis que reseñas — pagar app es más eficiente que desarrollar.

---

## Configurar cupón `BIENVENIDO` en Tiendanube

Independiente de qué opción elijas:

1. Panel Tiendanube → **Marketing** → **Promociones**
2. Click **"Nueva promoción"**
3. Configurar:

| Campo | Valor |
|---|---|
| Tipo | Cupón de descuento |
| Nombre interno | "Bienvenida primera compra" |
| Código | `BIENVENIDO` |
| Tipo descuento | Porcentaje |
| Valor | **10%** |
| Aplica a | Todos los productos |
| Mínimo de compra | Sin mínimo (o $20.000 si querés) |
| Usos por cliente | **1 (uno solo)** |
| Usos totales | Ilimitado |
| Vigencia | 6 meses |
| Combinable con otros descuentos | NO (para no apilar con jueves 10%) |

4. Guardar

**Probar**:
1. Modo incógnito → agregar producto al carrito
2. Checkout → ingresar `BIENVENIDO` → debe aplicar 10% OFF

---

## ⚠️ Decisión importante: ¿10% o más?

Reseñas argentinas (Ecomodico, Entreno, El Nogal) usan **5% OFF primera compra**. Mercado Libre da $5.000 fijo. Vos pediste **10%**.

Pros 10%:
- Más atractivo, capta más emails
- Más conversión en checkout

Contras 10%:
- Apila con 15% efectivo = -25% que es mucho (analizar margen)
- Cliente entrenado a esperar descuentos altos

**Si querés bajar a 5% o $X fijo** decime y lo cambio.

---

## Mi recomendación final

**Para empezar HOY (15 min)**:
1. Activá cupón `BIENVENIDO` 10% en panel Tiendanube → Marketing → Promociones
2. Configurá popup en Abejita (la app que ya tenés)
3. Vinculá Abejita con `BIENVENIDO`

**Resultado**: cliente nuevo ve popup → email → cupón → compra con 10% OFF. Cero código.

**Cuando crezca el volumen (3-6 meses)**:
- Sumar Doppler para newsletter
- Email automation jueves recordatorio
- Win-back 60 días inactivo

---

## ❓ Si Abejita NO sirve

Plan B apps similares (todas en marketplace Tiendanube):
- **TITANPush Promociones** (la tenés activada)
- **PopupNube**
- **OptinMonster Lite**

Si Abejita no permite vincular cupón directo, probar con TITANPush que también lo tenés instalado.
