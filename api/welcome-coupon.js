/* =============================================================================
   POST /api/welcome-coupon
   ----------------------------------------------------------------------------
   Body: { email: "cliente@gmail.com" }

   Flujo:
   1) Valida email
   2) Chequea si ya capturamos ese email antes (Vercel KV) → bloquea
   3) Llama Tiendanube API: ¿tiene pedidos con ese email? → bloquea si sí
   4) Genera código único BIENVENIDA-XXXXX
   5) Crea cupón 10% OFF en Tiendanube vía API
   6) Envía email con el cupón vía Resend
   7) Guarda email en KV para no duplicar
   8) Retorna { ok: true, code }

   Errores:
   - 400 email inválido
   - 409 ya capturamos ese email
   - 409 ya compró antes
   - 500 fallo Tiendanube / Resend
============================================================================= */

import { kv } from '@vercel/kv';

// ============== CONFIG (poner en Vercel Env Vars) ==============
const {
  TIENDANUBE_STORE_ID,       // ej "1234567"
  TIENDANUBE_ACCESS_TOKEN,   // OAuth token (no se vence)
  TIENDANUBE_USER_AGENT,     // ej "Morashop (cavutoalejo10@gmail.com)"
  RESEND_API_KEY,            // re_xxx...
  RESEND_FROM_EMAIL,         // "Morashop <hola@morashop.com.ar>"
  COUPON_DISCOUNT_PERCENT = '10',
  COUPON_VALID_DAYS = '90',
} = process.env;

const TN_BASE = `https://api.tiendanube.com/v1/${TIENDANUBE_STORE_ID}`;
const TN_HEADERS = {
  'Authentication': `bearer ${TIENDANUBE_ACCESS_TOKEN}`,
  'User-Agent': TIENDANUBE_USER_AGENT || 'Morashop',
  'Content-Type': 'application/json',
};

// Validar email simple
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

// Generar código random 5 chars (ABC12)
function randomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin I/O/0/1
  let code = '';
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `BIENVENIDA-${code}`;
}

// ¿Email ya tiene pedidos en Tiendanube?
async function emailYaCompro(email) {
  const url = `${TN_BASE}/orders?q=${encodeURIComponent(email)}&per_page=1`;
  const res = await fetch(url, { headers: TN_HEADERS });
  if (!res.ok) throw new Error(`Tiendanube GET orders failed: ${res.status}`);
  const orders = await res.json();
  // Filtrar exact match porque ?q es fuzzy
  return orders.some(o => (o.customer?.email || '').toLowerCase() === email.toLowerCase());
}

// Crear cupón en Tiendanube
async function crearCupon(code) {
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + parseInt(COUPON_VALID_DAYS, 10));

  const body = {
    code,
    type: 'percentage',
    value: COUPON_DISCOUNT_PERCENT,
    valid: true,
    used: 0,
    max_uses: 1,
    start_date: new Date().toISOString().split('T')[0],
    end_date: validUntil.toISOString().split('T')[0],
    min_price: 0,
    first_consumer_purchase: true, // ← clave: Tiendanube lo restringe a primera compra del cliente
    combines_with_other_discounts: false,
  };

  const res = await fetch(`${TN_BASE}/coupons`, {
    method: 'POST',
    headers: TN_HEADERS,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Tiendanube POST coupon failed: ${res.status} ${errText}`);
  }
  return res.json();
}

// Enviar email con Resend
async function enviarEmail(email, code) {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:20px;background:#fff">
      <div style="background:linear-gradient(135deg,#E8341A,#C42710);padding:32px 24px;text-align:center;border-radius:12px 12px 0 0;color:#fff">
        <h1 style="margin:0 0 8px;font-size:28px;text-transform:uppercase;letter-spacing:-0.01em">
          ¡Bienvenido a <span style="color:#FFD400">Morashop</span>!
        </h1>
        <p style="margin:0;font-size:14px;opacity:0.95">Acá está tu cupón de bienvenida</p>
      </div>
      <div style="background:#fff;padding:28px 24px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 12px 12px;text-align:center">
        <p style="font-size:15px;color:#1A2744;margin:0 0 16px">
          Tu cupón <strong style="color:#E8341A">10% OFF</strong> para tu primera compra:
        </p>
        <div style="background:#FFD400;color:#1A2744;font-family:monospace;font-weight:900;font-size:22px;letter-spacing:0.08em;padding:14px 24px;border-radius:8px;display:inline-block;margin:8px 0 20px;border:2px dashed #1A2744">
          ${code}
        </div>
        <p style="font-size:13px;color:#6b7280;margin:0 0 24px">
          Aplicable a tu primera compra. Vence en ${COUPON_VALID_DAYS} días.
        </p>
        <a href="https://morashop.com.ar" style="background:#1A2744;color:#fff;text-decoration:none;padding:14px 32px;border-radius:6px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;font-size:13px;display:inline-block">
          Empezar a comprar →
        </a>
        <p style="font-size:12px;color:#9ca3af;margin:32px 0 0;line-height:1.5">
          <strong>Comprar suplementos es Morashop.</strong><br>
          Distribuidor oficial · Envío en el día CABA y GBA
        </p>
      </div>
    </div>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL,
      to: email,
      subject: `🎯 Tu cupón ${COUPON_DISCOUNT_PERCENT}% OFF de bienvenida a Morashop`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend send failed: ${res.status} ${err}`);
  }
  return res.json();
}

// ============== HANDLER ==============
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { email } = req.body || {};
    const cleanEmail = String(email || '').trim().toLowerCase();

    // 1) Validar formato
    if (!cleanEmail || !EMAIL_RE.test(cleanEmail)) {
      return res.status(400).json({ ok: false, error: 'email_invalido' });
    }

    // 2) ¿Ya capturamos este email en el popup antes?
    const yaCapturado = await kv.get(`welcome:${cleanEmail}`);
    if (yaCapturado) {
      return res.status(409).json({ ok: false, error: 'ya_capturado', message: 'Ya enviamos un cupón a este email' });
    }

    // 3) ¿Ya compró en Tiendanube?
    const yaCompro = await emailYaCompro(cleanEmail);
    if (yaCompro) {
      // Marcamos para no volver a chequear contra TN cada vez
      await kv.set(`welcome:${cleanEmail}`, { reason: 'ya_compro', at: Date.now() }, { ex: 60 * 60 * 24 * 90 });
      return res.status(409).json({ ok: false, error: 'ya_compraste', message: 'Ya sos cliente — gracias 🙏' });
    }

    // 4) Generar código único
    const code = randomCode();

    // 5) Crear cupón en Tiendanube
    await crearCupon(code);

    // 6) Enviar email
    await enviarEmail(cleanEmail, code);

    // 7) Guardar en KV (TTL 90 días)
    await kv.set(`welcome:${cleanEmail}`, {
      code,
      sentAt: Date.now(),
    }, { ex: 60 * 60 * 24 * 90 });

    // 8) Respuesta
    return res.status(200).json({ ok: true, code, message: 'Cupón enviado' });

  } catch (err) {
    console.error('welcome-coupon error:', err);
    return res.status(500).json({ ok: false, error: 'server_error', detail: String(err.message || err) });
  }
}
