# Deploy Welcome Coupon — Setup Vercel + Tiendanube + Resend

> Endpoint: `POST /api/welcome-coupon`
> Stack: Vercel Function (Node.js) + Vercel KV + Tiendanube API + Resend

---

## ✅ Lo que ya está hecho en código

- ✅ `api/welcome-coupon.js` (Vercel Function)
- ✅ `assets/welcome-popup.js` (frontend con fetch al endpoint)
- ✅ Manejo de 4 casos: éxito / ya compró / ya pidió cupón / error

## 🔧 Lo que tenés que configurar vos

3 servicios externos, 1 vez.

---

## PASO 1 — Instalar dependencia Vercel KV

```bash
npm install @vercel/kv
```

Si no tenés `package.json` aún:

```bash
npm init -y
npm install @vercel/kv
```

---

## PASO 2 — Crear KV store en Vercel

1. Dashboard Vercel → tu proyecto Morashop
2. Tab **Storage** → click **Create Database**
3. Elegir **KV** (Redis)
4. Nombre: `morashop-kv`
5. Region: **Sao Paulo (gru1)** (más cerca de Argentina)
6. Click **Create**
7. Tab **Connect** → automáticamente agrega las env vars (`KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`)

✅ No tenés que copiar nada — Vercel las inyecta solas.

---

## PASO 3 — Obtener Tiendanube Access Token

Vos dijiste que ya tenés **App ID + Client Secret**. Falta convertirlos en **Access Token** (no se vence).

### Si tu app está en modo "Privada" (recomendado para una sola tienda)

1. Ir a [partners.tiendanube.com](https://partners.tiendanube.com)
2. Tu app → tab **Configuración**
3. Mirar sección **Modo desarrollo / Test Store**
4. Click **"Instalar en mi tienda"** → autorizar
5. Te redirige con un código en la URL: `?code=ABC123...`
6. Hacer POST para canjear el code por token:

```bash
curl -X POST https://www.tiendanube.com/apps/authorize/token \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "TU_APP_ID",
    "client_secret": "TU_CLIENT_SECRET",
    "grant_type": "authorization_code",
    "code": "ABC123..."
  }'
```

Respuesta:
```json
{
  "access_token": "abc123...",
  "user_id": 1234567,
  "token_type": "bearer",
  "scope": "read_orders,write_coupons,..."
}
```

7. Guardar: `access_token` + `user_id` (= store_id)

### Scopes mínimos requeridos

- `read_orders` (para chequear si ya compró)
- `read_coupons` y `write_coupons` (para crear cupón)

Si tu app no los tiene, ir a Partners → tu app → editar scopes → reinstalar en tienda.

---

## PASO 4 — Crear cuenta Resend (envío email)

1. Ir a [resend.com](https://resend.com) → sign up con GitHub
2. Tab **API Keys** → click **Create API Key**
3. Nombre: `morashop-prod`
4. Permission: **Sending access**
5. Domain: **Add Domain** → `morashop.com.ar`
6. Resend te da 3 registros DNS (SPF, DKIM, DMARC) → cargarlos en tu DNS (Cloudflare/registrar)
7. Verificar dominio en Resend (15 min para propagar)

**Mientras tanto**: podés usar `onboarding@resend.dev` como `from` para testing (solo envía a tu propio email).

Plan free Resend: **3.000 emails/mes gratis**. Suficiente.

---

## PASO 5 — Configurar Vercel Environment Variables

Dashboard Vercel → tu proyecto → **Settings → Environment Variables**:

| Nombre | Valor | Environment |
|---|---|---|
| `TIENDANUBE_STORE_ID` | tu `user_id` del paso 3 | Production + Preview |
| `TIENDANUBE_ACCESS_TOKEN` | tu `access_token` del paso 3 | Production + Preview |
| `TIENDANUBE_USER_AGENT` | `Morashop (cavutoalejo10@gmail.com)` | Production + Preview |
| `RESEND_API_KEY` | `re_...` del paso 4 | Production + Preview |
| `RESEND_FROM_EMAIL` | `Morashop <hola@morashop.com.ar>` | Production + Preview |
| `COUPON_DISCOUNT_PERCENT` | `10` | Production + Preview |
| `COUPON_VALID_DAYS` | `90` | Production + Preview |

Click **Save** en cada una.

---

## PASO 6 — Verificar que la function se detecte

Tu proyecto debe tener el siguiente file tree mínimo:

```
morashop-rediseno/
├── api/
│   └── welcome-coupon.js     ← Vercel detecta /api/* automático
├── assets/
│   └── welcome-popup.js
├── index.html
├── package.json
└── vercel.json (opcional)
```

Vercel detecta `api/*.js` como serverless function automáticamente. **No necesitás `vercel.json`** salvo para custom routing.

Si querés forzar runtime Node 20 (recomendado), crear `api/welcome-coupon.config.json`:

```json
{ "runtime": "nodejs20.x" }
```

---

## PASO 7 — Deploy

```bash
git add .
git commit -m "feat: welcome coupon endpoint"
git push
```

Vercel auto-deploya en ~30s. Mirar logs en dashboard.

---

## PASO 8 — Testing

### Test 1: email nuevo
```bash
curl -X POST https://morashop-rediseno.vercel.app/api/welcome-coupon \
  -H "Content-Type: application/json" \
  -d '{"email": "test-nuevo@gmail.com"}'
```
**Esperado**: `{ "ok": true, "code": "BIENVENIDA-XXXXX" }` + email recibido

### Test 2: mismo email otra vez
```bash
curl -X POST https://morashop-rediseno.vercel.app/api/welcome-coupon \
  -H "Content-Type: application/json" \
  -d '{"email": "test-nuevo@gmail.com"}'
```
**Esperado**: `{ "ok": false, "error": "ya_capturado" }`

### Test 3: email que YA compró en tu Tiendanube
Buscá un email de un pedido real tuyo:
```bash
curl -X POST https://morashop-rediseno.vercel.app/api/welcome-coupon \
  -H "Content-Type: application/json" \
  -d '{"email": "cliente-real@email.com"}'
```
**Esperado**: `{ "ok": false, "error": "ya_compraste" }`

### Test 4: probar en navegador
1. Ir a `https://morashop-rediseno.vercel.app` modo incógnito
2. Esperar 6s → ver popup
3. Meter email → submit
4. Ver mensaje "Te enviamos tu cupón"
5. Revisar email

---

## ⚠️ Costos reales

| Servicio | Free tier | Cuando empieza a pagar |
|---|---|---|
| Vercel Functions | 100k requests/mes | nunca, salvo viralización |
| Vercel KV | 30k commands/día | nunca con este uso |
| Tiendanube API | sin límite documentado público | nunca |
| Resend | 3.000 emails/mes | si pasás de 3k → $20 USD/mes |

**Probable costo real año 1**: **$0**.

---

## 🐛 Troubleshooting

### "Tiendanube POST coupon failed: 401"
Token incorrecto o sin scope `write_coupons`. Reinstalar app con scopes correctos.

### "Resend send failed: 403"
Dominio no verificado. Usar `onboarding@resend.dev` mientras tanto.

### "KV is undefined"
Falta el `npm install @vercel/kv` o KV no fue creado en Storage tab.

### Cupón se crea pero `first_consumer_purchase: true` no funciona
Tiendanube quizás cambió el flag. Alternativa: crear cupón con `single_use_per_customer: true` (chequear docs actualizadas).

### Cliente con email diferente pero misma tarjeta
Solución actual NO lo detecta. Para v2 → checkear DNI o teléfono también.

---

## 🚀 Mejoras futuras (cuando lo necesites)

1. **Rate limiting**: max 5 requests/hora por IP (con `@vercel/edge-config`)
2. **reCAPTCHA**: prevenir bots metiendo emails fake
3. **Sumar a Doppler/Mailchimp**: además del cupón, agregar email a lista de newsletter
4. **Webhook order.paid**: cuando cliente usa cupón, marcar email como "comprado" en KV para acelerar futuras consultas
5. **A/B testing**: probar 5% vs 10% vs 15% para ver cuál convierte más
