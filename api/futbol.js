/* =============================================================================
   /api/futbol — datos compartidos del grupo de fútbol (Vercel KV)
   ----------------------------------------------------------------------------
   GET  /api/futbol                     → { ok, state, version, receipts }
   GET  /api/futbol?receipt=<key>       → { ok, receipt: { ...meta, file } }
   POST /api/futbol  { action: 'check-pin', pin }
   POST /api/futbol  { action: 'save', pin, state, baseVersion }
        Guarda todo el estado (solo el encargado). Si alguien guardó antes
        (baseVersion distinto) devuelve 409 para que el cliente recargue.
   POST /api/futbol  { action: 'upload-receipt', matchId, playerId, method, file, fileName, note }
        Cualquier jugador avisa que pagó (sin PIN): transferencia con
        comprobante, o efectivo sin archivo. Queda "a confirmar" hasta que
        el encargado lo certifique.
   POST /api/futbol  { action: 'delete-receipt', pin, matchId, playerId }

   Los comprobantes se guardan aparte del estado para que un jugador subiendo
   su comprobante nunca pise lo que está guardando el encargado.

   Env vars: KV_REST_API_URL / KV_REST_API_TOKEN (Vercel KV) y
             FUTBOL_ADMIN_PIN (PIN del encargado de la cancha).
============================================================================= */

import { kv } from '@vercel/kv';

const { FUTBOL_ADMIN_PIN } = process.env;

const KV_STATE = 'futbol:state';
const KV_VERSION = 'futbol:version';
const KV_RECEIPTS = 'futbol:receipts';          // hash  matchId:playerId → meta
const KV_RECEIPT_FILE = 'futbol:receipt-file:'; // + matchId:playerId → dataURL

const MAX_FILE_CHARS = 900_000; // ~650 KB binario en base64; KV acepta ~1 MB por request
const ID_RE = /^[a-z0-9_-]{1,40}$/i;

function kvConfigured() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function pinOk(pin) {
  return Boolean(FUTBOL_ADMIN_PIN) && String(pin || '') === String(FUTBOL_ADMIN_PIN);
}

function receiptKey(matchId, playerId) {
  if (!ID_RE.test(String(matchId || '')) || !ID_RE.test(String(playerId || ''))) return null;
  return `${matchId}:${playerId}`;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (!kvConfigured()) {
    return res.status(503).json({ ok: false, error: 'kv_not_configured' });
  }

  try {
    if (req.method === 'GET') {
      const key = req.query && req.query.receipt;
      if (key) {
        const [meta, file] = await Promise.all([
          kv.hget(KV_RECEIPTS, key),
          kv.get(KV_RECEIPT_FILE + key),
        ]);
        if (!meta || !file) return res.status(404).json({ ok: false, error: 'not_found' });
        return res.status(200).json({ ok: true, receipt: { ...meta, file } });
      }

      const [state, version, receipts] = await Promise.all([
        kv.get(KV_STATE),
        kv.get(KV_VERSION),
        kv.hgetall(KV_RECEIPTS),
      ]);
      return res.status(200).json({
        ok: true,
        state: state || null,
        version: Number(version) || 0,
        receipts: receipts || {},
        adminPinSet: Boolean(FUTBOL_ADMIN_PIN),
      });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, error: 'method_not_allowed' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

    switch (body.action) {
      case 'check-pin': {
        if (!FUTBOL_ADMIN_PIN) return res.status(500).json({ ok: false, error: 'pin_not_configured' });
        return res.status(pinOk(body.pin) ? 200 : 401).json({ ok: pinOk(body.pin) });
      }

      case 'save': {
        if (!pinOk(body.pin)) return res.status(401).json({ ok: false, error: 'pin_invalido' });
        if (!body.state || typeof body.state !== 'object') {
          return res.status(400).json({ ok: false, error: 'state_invalido' });
        }
        const current = Number(await kv.get(KV_VERSION)) || 0;
        if (Number(body.baseVersion) !== current) {
          return res.status(409).json({ ok: false, error: 'version_conflict', version: current });
        }
        const next = current + 1;
        await kv.set(KV_STATE, body.state);
        await kv.set(KV_VERSION, next);
        return res.status(200).json({ ok: true, version: next });
      }

      case 'upload-receipt': {
        const key = receiptKey(body.matchId, body.playerId);
        if (!key) return res.status(400).json({ ok: false, error: 'ids_invalidos' });
        // Transferencia: comprobante obligatorio. Efectivo: el jugador avisa
        // que pagó y el encargado lo certifica después.
        const method = body.method === 'efectivo' ? 'efectivo' : 'transferencia';
        const file = String(body.file || '');
        if (method === 'transferencia' || file) {
          if (!/^data:(image\/(png|jpe?g|webp)|application\/pdf);base64,/.test(file)) {
            return res.status(400).json({ ok: false, error: 'archivo_invalido' });
          }
          if (file.length > MAX_FILE_CHARS) {
            return res.status(413).json({ ok: false, error: 'archivo_muy_grande' });
          }
        }
        const meta = {
          matchId: body.matchId,
          playerId: body.playerId,
          method,
          hasFile: Boolean(file),
          fileName: String(body.fileName || 'comprobante').slice(0, 120),
          note: String(body.note || '').slice(0, 300),
          uploadedAt: new Date().toISOString(),
        };
        if (file) await kv.set(KV_RECEIPT_FILE + key, file);
        else await kv.del(KV_RECEIPT_FILE + key);
        await kv.hset(KV_RECEIPTS, { [key]: meta });
        return res.status(200).json({ ok: true, key, receipt: meta });
      }

      case 'delete-receipt': {
        if (!pinOk(body.pin)) return res.status(401).json({ ok: false, error: 'pin_invalido' });
        const key = receiptKey(body.matchId, body.playerId);
        if (!key) return res.status(400).json({ ok: false, error: 'ids_invalidos' });
        await kv.hdel(KV_RECEIPTS, key);
        await kv.del(KV_RECEIPT_FILE + key);
        return res.status(200).json({ ok: true });
      }

      default:
        return res.status(400).json({ ok: false, error: 'accion_desconocida' });
    }
  } catch (err) {
    console.error('[futbol]', err);
    return res.status(500).json({ ok: false, error: 'server_error', detail: String(err.message || err) });
  }
}
