/* =============================================================================
   GET /api/app-sales?key=<clave>[&dias=30][&formato=json][&fresco=1]
   ----------------------------------------------------------------------------
   Separa los pedidos hechos desde la app de celular de los hechos en la web.

   Como se distingue: la app agrega "MorashopApp/<version>" a la identificacion
   del navegador (user agent) de cada pagina que abre, y Tiendanube guarda esa
   identificacion en cada pedido (client_details.user_agent). Con eso:
     - "MorashopApp" + iPhone/iPad  -> app en iPhone
     - "MorashopApp" + Android      -> app en Android
     - sin "MorashopApp"            -> web
     - sin identificacion           -> sin dato (pedidos cargados a mano, Mercado Libre, etc.)

   Es informacion del negocio, asi que pide una clave. El repo es publico: aca
   solo esta la huella SHA-256 de la clave, no la clave.

   Lee los pedidos de los ultimos `dias` (30 por defecto, 90 como maximo) con el
   mismo token que /api/sales y guarda el resultado 10 minutos en el cache de
   Vercel. `fresco=1` lo vuelve a calcular.
============================================================================= */

import { createHash, timingSafeEqual } from 'node:crypto';
import { getCache } from '@vercel/functions';

const {
  TIENDANUBE_STORE_ID,
  TIENDANUBE_ACCESS_TOKEN,
  TIENDANUBE_USER_AGENT,
} = process.env;

const TN_BASE = `https://api.tiendanube.com/v1/${TIENDANUBE_STORE_ID}`;
const TN_HEADERS = {
  'Authentication': `bearer ${TIENDANUBE_ACCESS_TOKEN}`,
  'User-Agent': TIENDANUBE_USER_AGENT || 'Morashop',
  'Content-Type': 'application/json',
};

export const maxDuration = 300;

// Huella SHA-256 de la clave de acceso (la clave la tiene el dueño).
const KEY_SHA256 = '35d69f7c491104bdd50cf50b6e35fc4423db2a2e5b8aea8609a75e28e54ada0e';

const DEFAULT_DAYS = 30;
const MAX_DAYS = 90;
const PER_PAGE = 200;
const MAX_PAGES = 25;
// Tiendanube responde lento (una pagina puede tardar varios segundos): pasado este
// tiempo se deja de pedir y se informa lo juntado, que son los pedidos mas nuevos.
const BUDGET_MS = 240 * 1000;
const CACHE_TTL = 600;
const FIELDS = 'id,number,created_at,total,currency,status,payment_status,storefront,client_details';

const CANALES = {
  app_ios: 'App · iPhone',
  app_android: 'App · Android',
  app_otro: 'App · otro',
  web: 'Web',
  sin_dato: 'Sin dato',
};

export function canalDe(userAgent) {
  const ua = String(userAgent || '');
  if (!ua) return 'sin_dato';
  if (!/MorashopApp/i.test(ua)) return 'web';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'app_ios';
  if (/Android/i.test(ua)) return 'app_android';
  return 'app_otro';
}

function claveValida(given) {
  const a = createHash('sha256').update(String(given || '')).digest();
  const b = Buffer.from(KEY_SHA256, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}

const pagado = (o) => o.payment_status === 'paid' && o.status !== 'cancelled';

async function fetchOrders(days) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const orders = [];
  const started = Date.now();
  let truncated = false;

  for (let page = 1; page <= MAX_PAGES; page++) {
    if (page > 1 && Date.now() - started > BUDGET_MS) { truncated = true; break; }
    const url = `${TN_BASE}/orders?per_page=${PER_PAGE}&page=${page}`
      + `&created_at_min=${encodeURIComponent(since)}`
      + `&fields=${FIELDS}`;
    const res = await fetch(url, { headers: TN_HEADERS });
    // TN devuelve 404 "Last page is 0" cuando te pasaste de la ultima pagina.
    if (res.status === 404) break;
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Tiendanube GET /orders page=${page} failed: ${res.status} ${body.slice(0, 120)}`);
    }
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    orders.push(...batch);
    if (batch.length < PER_PAGE) break;
    if (page === MAX_PAGES) truncated = true;
  }
  return { orders, truncated };
}

export function resumir(orders, days, truncated) {
  const canales = {};
  for (const key of Object.keys(CANALES)) {
    canales[key] = { nombre: CANALES[key], pedidos: 0, pagados: 0, facturado: 0 };
  }
  const app = [];
  for (const o of orders) {
    if (o.status === 'cancelled') continue;
    const canal = canalDe(o.client_details && o.client_details.user_agent);
    const c = canales[canal];
    c.pedidos++;
    if (pagado(o)) {
      c.pagados++;
      c.facturado += Number(o.total) || 0;
    }
    if (canal.startsWith('app_')) {
      app.push({
        numero: o.number,
        fecha: o.created_at,
        canal: CANALES[canal],
        total: Number(o.total) || 0,
        pago: o.payment_status,
      });
    }
  }
  for (const c of Object.values(canales)) c.facturado = Math.round(c.facturado * 100) / 100;
  return {
    ok: true,
    dias: days,
    desde: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    pedidosLeidos: orders.length,
    incompleto: truncated,
    canales,
    pedidosDeLaApp: app,
    generado: new Date().toISOString(),
  };
}

const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const pesos = (n) => '$' + Math.round(n).toLocaleString('es-AR');
const PAGOS = { paid: 'Pagado', pending: 'Pendiente', authorized: 'Autorizado', abandoned: 'Abandonado', refunded: 'Devuelto', voided: 'Anulado' };

export function html(r) {
  const filas = Object.values(r.canales)
    .filter((c) => c.pedidos > 0 || c.nombre.startsWith('App'))
    .map((c) => `<tr><td>${esc(c.nombre)}</td><td>${c.pedidos}</td><td>${c.pagados}</td><td>${pesos(c.facturado)}</td></tr>`)
    .join('');
  const lista = r.pedidosDeLaApp.length
    ? r.pedidosDeLaApp.map((p) => `<tr><td>#${esc(p.numero)}</td><td>${esc(String(p.fecha).slice(0, 16).replace('T', ' '))}</td><td>${esc(p.canal)}</td><td>${pesos(p.total)}</td><td>${esc(PAGOS[p.pago] || p.pago)}</td></tr>`).join('')
    : '<tr><td colspan="5">Todavía no hay pedidos desde la app en este período.</td></tr>';
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Ventas por canal · Morashop</title>
<style>
body{margin:0;background:#ECEDEF;color:#1A2744;font:15px/1.45 Inter,system-ui,sans-serif}
main{max-width:760px;margin:0 auto;padding:24px 16px 48px}
h1{font-size:24px;margin:0 0 4px}p{margin:0 0 16px;color:rgba(26,39,68,.7)}
h2{font-size:17px;margin:28px 0 8px}
table{width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden}
th,td{padding:10px 12px;text-align:left;border-bottom:1px solid rgba(26,39,68,.1)}
th{font-size:13px;color:rgba(26,39,68,.65);font-weight:600}td:nth-child(n+2){white-space:nowrap}
.aviso{background:#fff4e5;border-radius:10px;padding:10px 12px;color:#7a4b00}
</style></head><body><main>
<h1>Ventas por canal</h1>
<p>Últimos ${r.dias} días (desde el ${esc(r.desde)}) · ${r.pedidosLeidos} pedidos leídos · sin contar cancelados</p>
${r.incompleto ? '<p class="aviso">Tiendanube tardó demasiado: el reporte cubre solo los pedidos más nuevos del período.</p>' : ''}
<table><thead><tr><th>Canal</th><th>Pedidos</th><th>Pagados</th><th>Facturado (pagados)</th></tr></thead><tbody>${filas}</tbody></table>
<h2>Pedidos desde la app</h2>
<table><thead><tr><th>Pedido</th><th>Fecha</th><th>Canal</th><th>Total</th><th>Pago</th></tr></thead><tbody>${lista}</tbody></table>
</main></body></html>`;
}

export default async function handler(req, res) {
  if (!claveValida(req.query && req.query.key)) {
    return res.status(404).json({ ok: false });
  }
  if (!TIENDANUBE_STORE_ID || !TIENDANUBE_ACCESS_TOKEN) {
    return res.status(500).json({ ok: false, error: 'missing_env' });
  }
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Robots-Tag', 'noindex');

  const dias = Math.min(MAX_DAYS, Math.max(1, parseInt(req.query.dias, 10) || DEFAULT_DAYS));
  const json = req.query.formato === 'json';
  const cacheKey = `app_sales_v1:${dias}`;

  try {
    // ?pedido=<numero>: de donde vino un pedido puntual (para revisar casos dudosos).
    if (req.query.pedido) {
      const numero = String(req.query.pedido).replace(/\D/g, '');
      const { orders } = await fetchOrders(dias);
      const o = orders.find((x) => String(x.number) === numero);
      if (!o) return res.status(200).json({ ok: false, error: 'no_encontrado', numero, dias });
      const ua = o.client_details ? o.client_details.user_agent : undefined;
      return res.status(200).json({
        ok: true,
        numero: o.number,
        fecha: o.created_at,
        origen: o.storefront,
        estado: o.status,
        pago: o.payment_status,
        // El resumen no cuenta los cancelados.
        enElResumen: o.status !== 'cancelled',
        canal: CANALES[canalDe(ua)],
        userAgent: ua === undefined ? '(Tiendanube no envió el dato)' : ua,
        clientDetails: o.client_details ? Object.keys(o.client_details) : null,
      });
    }

    let reporte;
    if (req.query.fresco !== '1') {
      try { reporte = await getCache().get(cacheKey); } catch (e) { reporte = undefined; }
    }
    if (!reporte) {
      const { orders, truncated } = await fetchOrders(dias);
      reporte = resumir(orders, dias, truncated);
      try { await getCache().set(cacheKey, reporte, { ttl: CACHE_TTL }); } catch (e) { /* sin cache se calcula cada vez */ }
    }
    if (json) return res.status(200).json(reporte);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html(reporte));
  } catch (err) {
    console.error('app-sales error:', err);
    return res.status(500).json({ ok: false, error: 'server_error', detail: String(err.message || err).slice(0, 200) });
  }
}
