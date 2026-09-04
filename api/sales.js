/* =============================================================================
   GET /api/sales
   ----------------------------------------------------------------------------
   Construye el ranking REAL de mas vendidos leyendo los pedidos de Tiendanube y
   lo deja en Vercel KV para que /api/search ordene con datos de verdad.

   Hasta ahora search.js ordenaba por srVendidos() = hash(marca+nombre) % 1500,
   un numero determinista pero INVENTADO. Esto lo reemplaza por unidades vendidas.

   Corre por cron diario (ver vercel.json). Se puede llamar a mano para refrescar.

   Salida en KV, key "tn_sales_v1":
     { "<product_id>": <unidades vendidas>, ... }

   Acotado a proposito: ventana de dias fija y tope de paginas, para que una
   tienda con mucho volumen no haga colgar la funcion.
============================================================================= */

import { kv } from '@vercel/kv';

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

const KV_SALES_KEY = 'tn_sales_v1';
const KV_SALES_TTL = 60 * 60 * 30;   // 30 h: el cron es diario, con margen si falla una vez
const WINDOW_DAYS = 90;              // ventana de ventas que se considera "reciente"
const PER_PAGE = 200;
const MAX_PAGES = 25;                // tope duro: 5000 pedidos

// Un pedido cancelado no es una venta. El resto (open/closed) con pago hecho, si.
function counts(order) {
  if (!order) return false;
  if (order.status === 'cancelled') return false;
  return order.payment_status === 'paid';
}

async function fetchSales() {
  const since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const units = {};
  let orders = 0;
  let pages = 0;
  let truncated = false;

  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = `${TN_BASE}/orders?per_page=${PER_PAGE}&page=${page}`
      + `&created_at_min=${encodeURIComponent(since)}`
      + `&fields=id,status,payment_status,products`;
    const res = await fetch(url, { headers: TN_HEADERS });

    // TN devuelve 404 "Last page is 0" cuando te pasaste de la ultima pagina.
    if (res.status === 404) break;
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Tiendanube GET /orders page=${page} failed: ${res.status} ${body}`);
    }

    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;

    pages = page;
    for (const order of batch) {
      if (!counts(order)) continue;
      orders++;
      const lines = Array.isArray(order.products) ? order.products : [];
      for (const line of lines) {
        const id = line && line.product_id;
        if (!id) continue;
        const qty = Number(line.quantity);
        units[id] = (units[id] || 0) + (Number.isFinite(qty) && qty > 0 ? qty : 1);
      }
    }

    if (batch.length < PER_PAGE) break;
    if (page === MAX_PAGES) truncated = true;
  }

  return { units, orders, pages, truncated };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (!TIENDANUBE_STORE_ID || !TIENDANUBE_ACCESS_TOKEN) {
    return res.status(500).json({ ok: false, error: 'missing_env' });
  }

  try {
    const { units, orders, pages, truncated } = await fetchSales();
    const products = Object.keys(units).length;

    // Si no se conto nada, NO se pisa el cache: mejor quedarse con el ranking
    // anterior que dejar a todos los productos en cero.
    if (products === 0) {
      return res.status(200).json({
        ok: true, updated: false, reason: 'sin ventas en la ventana',
        windowDays: WINDOW_DAYS, orders, pages,
      });
    }

    await kv.set(KV_SALES_KEY, units, { ex: KV_SALES_TTL });

    const top = Object.entries(units)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id, qty]) => ({ id: Number(id), units: qty }));

    return res.status(200).json({
      ok: true, updated: true, windowDays: WINDOW_DAYS,
      orders, pages, products, truncated, top,
    });
  } catch (err) {
    console.error('sales error:', err);
    return res.status(500).json({ ok: false, error: 'server_error', detail: String(err.message || err) });
  }
}
