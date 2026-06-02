# Tiendanube Search — Deploy & Operación

Buscador overlay para Morashop con ranking de "más vendidos" sobre el catálogo de Tiendanube (store_id `2268228`). Sustituye la lupa nativa del theme Trend por un overlay que prioriza los productos con mayor score de ventas para una query dada (`creatina`, `proteina`, etc.).

---

## 1. Resumen

| Item | Valor |
|---|---|
| Endpoint API | `GET /api/search?q={query}` |
| Asset cliente | `GET /morashop-search.js` |
| Catálogo | ~1.400 productos publicados (5 categorías) |
| Ranking | Proxy hash determinístico hoy → cron real en fase 2 |
| Cache productos TN | Vercel KV, TTL 1 h |
| Dependencias | `@vercel/kv`, fetch nativo |

Qué hace:
1. Cliente clickea la lupa del theme → el script inyectado abre overlay full-screen.
2. Al tipear, debounce 200 ms → hit a `/api/search?q=...`.
3. El endpoint busca en TN, calcula score, ordena DESC y devuelve top 10.
4. Render con thumbnail + precio.

Qué reemplaza: el `<form action="/search">` nativo del theme Trend, que ordena por relevancia textual sin considerar ventas.

---

## 2. Arquitectura

```
                                Browser (morashop.com.ar)
                                ├─ theme Trend (Tiendanube CDN)
                                └─ morashop-search.js  ◄── inyectado en <head>
                                          │
                                          │ fetch GET
                                          ▼
                  ┌─────────────────────────────────────────────┐
                  │  Vercel  morashop-rediseno.vercel.app       │
                  │                                              │
                  │  /api/search  (Serverless Function, Node)   │
                  │       │                                      │
                  │       ├──► Vercel KV  (cache productos+score)│
                  │       │       key: tn_products_v1            │
                  │       │                                      │
                  │       └──► Tiendanube REST API               │
                  │              GET /products?published=true    │
                  │              header: Authentication bearer   │
                  └─────────────────────────────────────────────┘
                                          │
                                          ▼
                         api.tiendanube.com/v1/2268228
```

Flujo de un request `q=creatina`:

```
search.js  ──►  /api/search?q=creatina
                    │
                    ├─ KV.get("tn_products_v1")   ── HIT → usar cache
                    │                              └─ MISS → GET /products (TN)
                    │                                        KV.set ttl 1h
                    ├─ filtrar por nombre/descr matchea "creatina"
                    ├─ score(product) = hash(brand+name) % 1500 + 50
                    └─ sort DESC por score → top 10
```

---

## 3. Setup Vercel

### 3.1 Verificar env vars

Ya están seteadas para `welcome-coupon`. Reusar las mismas:

| Variable | Origen | Uso en search |
|---|---|---|
| `TIENDANUBE_STORE_ID` | ya existe | path base API |
| `TIENDANUBE_ACCESS_TOKEN` | ya existe | header `Authentication` |
| `TIENDANUBE_USER_AGENT` | ya existe | header obligatorio TN |
| `KV_URL` | provisionado por Vercel KV | `@vercel/kv` lo lee solo |
| `KV_REST_API_URL` | idem | idem |
| `KV_REST_API_TOKEN` | idem | idem |
| `KV_REST_API_READ_ONLY_TOKEN` | idem | idem |

Chequear:

```bash
vercel env ls production
```

Debe listar las 7 vars de arriba. Si falta alguna TN var, agregar con:

```bash
vercel env add TIENDANUBE_ACCESS_TOKEN production
```

### 3.2 Push + Deploy

| Paso | Comando | Resultado esperado |
|---|---|---|
| 1 | `git add api/search.js public/morashop-search.js vercel.json` | staged |
| 2 | `git commit -m "feat: search overlay con ranking"` | commit creado |
| 3 | `git push origin main` | push a GitHub |
| 4 | `vercel --prod` | deploy a producción |
| 5 | esperar `Ready` en output | URL prod activa |

### 3.3 Verificar endpoint

```bash
curl "https://morashop-rediseno.vercel.app/api/search?q=creatina" | jq '.matches[0:3]'
```

Respuesta esperada:

```json
{
  "matches": [
    {
      "id": 123,
      "name": "Creatina Monohidrato 300g — ENA",
      "brand": "ENA",
      "price": 18500,
      "stock": 12,
      "image": "https://acdn.mitiendanube.com/...jpg",
      "handle": "creatina-monohidrato",
      "salesScore": 1247
    }
  ],
  "total": 47,
  "typeHit": { "key": "creatinas", "label": "Creatinas", "handle": "creatinas" },
  "cached": true
}
```

Checks:
- HTTP 200
- `salesScore` decreciente entre items
- `image` con dominio `acdn.mitiendanube.com`
- Primera llamada ~1.5 s (fetch TN), siguientes <100 ms (KV hit)

---

## 4. Setup Tiendanube

| Paso | Acción | Detalle |
|---|---|---|
| 1 | Login | https://www.tiendanube.com/admin |
| 2 | Navegar | Mi tienda → Diseño → Personalización avanzada |
| 3 | Tab | "Editar código" → archivo `layout.tpl` |
| 4 | Insertar | dentro de `<head>`, antes de `</head>` |
| 5 | Snippet | ver abajo |
| 6 | Guardar | botón "Publicar cambios" arriba a la derecha |
| 7 | Verificar | abrir morashop.com.ar en incógnito, F12 Network, click lupa |

Snippet a pegar en `<head>`:

```html
<script src="https://morashop-rediseno.vercel.app/morashop-search.js" defer></script>
```

Checks en el frontend:

| Check | Cómo |
|---|---|
| Script carga | DevTools Network → `morashop-search.js` 200 |
| Overlay abre | click lupa → div `.morashop-root` visible |
| API responde | Network → `/api/search?q=...` 200 con `matches[]` |
| Orden correcto | primer resultado tiene mayor `salesScore` que el último |
| Theme intacto | el `<form>` nativo sigue presente como fallback si JS falla |

---

## 5. Troubleshooting

| Síntoma | Causa probable | Fix |
|---|---|---|
| Overlay no abre | selector lupa cambió en el theme | Editar `TRIGGER_SELECTORS` (array) en `morashop-search.js` |
| CORS error en consola | `Access-Control-Allow-Origin` no seteado | Verificar headers en `api/search.js`: `res.setHeader('Access-Control-Allow-Origin', '*')` |
| Resultados vacíos en query válida | producto no tiene `published=true` o `stock=0` | Revisar producto en admin TN → tab Visibilidad |
| Cache stale (precios viejos) | KV TTL no expiró | `POST /api/search/clear` (TODO endpoint futuro) o esperar 1 h |
| 429 Too Many Requests | rate limit TN (300 req/min/store) | Subir TTL de `tn_products_v1` a 12 h en `api/search.js` |
| Score idéntico en muchos productos | colisión hash, normal | Subir el `% 1500` a `% 5000` para más spread |
| `KV_URL not found` | KV no provisionado en este proyecto | `vercel kv create morashop-search-kv && vercel kv connect` |
| Endpoint 500 sin log | falta `TIENDANUBE_USER_AGENT` | TN devuelve 401 si falta — log: `Tiendanube GET products failed: 401` |

---

## 6. Upgrade a ranking real

El proxy hash es determinístico pero no refleja ventas reales. Fase 2 lo reemplaza por datos reales sin tocar el frontend.

### 6.1 Cron diario

Archivo `api/cron/compute-sales-scores.js`:

```js
// Corre a las 04:00 ART (07:00 UTC) cada día
// vercel.json: { "crons": [{ "path": "/api/cron/compute-sales-scores", "schedule": "0 7 * * *" }] }
```

Flujo:

| Paso | Acción |
|---|---|
| 1 | `GET /orders?status=paid&created_at_min={hace 30 días}&per_page=200` |
| 2 | Paginar hasta agotar (`Link: <...>; rel="next"`) |
| 3 | Por cada order → iterar `order.products[]` → `++counts[product_id]` |
| 4 | Por cada `product_id` → `kv.set("tn_sales_score_{id}", count, { ex: 60*60*48 })` |
| 5 | Log total productos procesados, total ventas contadas |

### 6.2 Cambio en `api/search.js`

Reemplazar:

```js
const score = hashScore(product.brand + product.name);
```

Por:

```js
const score = await kv.get(`tn_sales_score_${product.id}`) ?? 0;
```

Con `mget` para batch:

```js
const ids = filtered.map(p => `tn_sales_score_${p.id}`);
const scores = await kv.mget(...ids);
filtered.forEach((p, i) => p.score = scores[i] ?? 0);
```

### 6.3 Configuración del cron

`vercel.json`:

```json
{
  "crons": [
    { "path": "/api/cron/compute-sales-scores", "schedule": "0 7 * * *" }
  ]
}
```

### 6.4 Costo

| Item | Volumen | Costo |
|---|---|---|
| Calls TN `/orders` | ~30/día (paginación 30 días) | $0 (sin límite documentado en TN) |
| Vercel Cron | 1 invocación/día | dentro del free tier (incluye cron) |
| KV writes | ~1.400/día (1 por producto) | dentro de 30k commands/mes free |
| Latencia search | sin cambio (lee KV igual que hoy) | — |

---

## 7. Costos

| Servicio | Tier | Límite | Uso estimado | Headroom |
|---|---|---|---|---|
| Vercel Functions | Hobby free | 100k invocations/mes | 30k (1000/día) | 70% libre |
| Vercel KV | Hobby free | 30k commands/mes, 256 MB | ~10k commands, ~2 MB | 66% libre |
| Vercel Cron | Hobby free | 2 jobs, 1/día c/u | 1 job, 1/día | dentro |
| Tiendanube API | gratis | 300 req/min, sin tope mensual | <50 req/día gracias a cache | 99% libre |
| Resend | n/a para search | — | — | — |

Estimación pesimista (5.000 búsquedas/día, 60% cache miss):
- Vercel Functions: 5k * 30 = 150k/mes → **excede free, ~$5/mes en Pro**
- KV reads: 5k * 2 = 10k/día = 300k/mes → **excede free, +$0.20/100k = ~$0.60/mes**

Punto de inflexión hacia plan Pro: ~3.300 búsquedas/día.

---

## TODO

- [ ] Endpoint `POST /api/search/clear` para invalidar cache manualmente
- [ ] Endpoint `GET /api/search/stats` con top queries de la semana (guardar en KV `query_log:{date}`)
- [ ] Fase 2: cron de scores reales (sección 6)
- [ ] A/B test ranking hash vs real una vez deployado el cron
- [ ] Logging de queries sin resultados → input para SEO y carga de productos faltantes
