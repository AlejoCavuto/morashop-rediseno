/* =============================================================================
   GET /api/img?n={nombre exacto del producto}
   ----------------------------------------------------------------------------
   Devuelve la FOTO de un producto, lista para poner en un <img>. Existe para los
   mails automáticos de Tiendanube (confirmación de compra y demás): la plantilla
   del mail recibe el nombre de cada producto comprado, pero no su imagen. El mail
   pide  https://api.morashop.ar/api/img?n=<nombre>  y acá se busca la foto.

   Cómo la encuentra:
   1) En el índice de productos que ya arma /api/search (Vercel KV, "tn_products_v2"):
      nombre igual, sin distinguir mayúsculas ni acentos.
   2) Si no está (el índice solo guarda lo publicado y con stock, y la compra pudo
      llevarse la última unidad), le pregunta a Tiendanube por nombre.
   3) Si no hay ninguna, devuelve el logo de Morashop: el mail nunca muestra una
      imagen rota.

   Cómo la entrega: las fotos de la tienda traen mucho blanco alrededor (el envase
   ocupa cerca de la mitad del cuadro) y en el mail, que las muestra chicas, el
   producto se veía diminuto y borroso. Por eso acá se le recorta el blanco y se
   devuelve un cuadrado de 240 px con el producto ocupándolo casi entero (sharp).
   Si la foto no tiene fondo blanco se recorta al centro, sin tocar nada más. Si
   sharp no está disponible, sale la foto de Tiendanube tal cual.

   Devuelve los bytes de la imagen (no una redirección: Gmail y Outlook bajan las
   imágenes a través de sus propios servidores y no todos siguen redirecciones).
   No es un proxy abierto: solo entrega imágenes de productos de la tienda.

   Cache: una semana en el CDN de Vercel y en el cliente; la resolución
   nombre -> foto se guarda 7 días en KV ("img_v1:<nombre>").
============================================================================= */

import { kv } from '@vercel/kv';

export const maxDuration = 30;

const { TIENDANUBE_STORE_ID, TIENDANUBE_ACCESS_TOKEN, TIENDANUBE_USER_AGENT } = process.env;
const TN_BASE = `https://api.tiendanube.com/v1/${TIENDANUBE_STORE_ID}`;
const TN_HEADERS = {
  'Authentication': `bearer ${TIENDANUBE_ACCESS_TOKEN}`,
  'User-Agent': TIENDANUBE_USER_AGENT || 'Morashop',
  'Content-Type': 'application/json',
};

const KV_INDEX_KEY = 'tn_products_v2';     // el mismo índice de /api/search
const KV_IMG_PREFIX = 'img_v1:';
const KV_IMG_TTL = 7 * 24 * 3600;
const HOST_FOTOS = 'mitiendanube.com';     // de dónde se aceptan fotos
const LOGO = 'https://d2az8otjr0j19j.cloudfront.net/templates/002/268/228/twig/static/images/mail/morashop-m.png';
// píxel transparente, por si ni el logo responde
const PIXEL = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');

const ANCHO_ORIGEN = 640;                  // tamaño que se le pide a Tiendanube antes de recortar
const LADO = 240;                          // lado del cuadrado que se entrega (el mail lo muestra a 72 px)
const MARGEN = 0.06;                       // aire alrededor del producto, como fracción del lado
const BLANCO = '#ffffff';

// minúsculas, sin acentos, solo letras y números separados por un espacio
export function norm(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// La URL que guarda Tiendanube termina en "-1024-1024.ext": se pide una más chica, misma extensión.
export function achicar(url, ancho = ANCHO_ORIGEN) {
  return String(url || '').replace(/-\d+-\d+\.(png|jpe?g|webp|gif)(\?.*)?$/i, `-${ancho}-0.$1`);
}

export function esFotoDeLaTienda(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && (u.hostname === HOST_FOTOS || u.hostname.endsWith('.' + HOST_FOTOS));
  } catch (e) { return false; }
}

// Busca en el índice el producto que se llama así. Devuelve la URL de su foto o ''.
export function buscarPorNombre(index, nombre) {
  const n = norm(nombre);
  if (!n || !Array.isArray(index)) return '';
  let contiene = '';
  for (const p of index) {
    if (!p || !p.image) continue;
    const pn = norm(p.name);
    if (pn === n) return p.image;
    // por si el mail manda el nombre con la variante pegada, o recortado
    if (!contiene && pn.length >= 12 && (n.startsWith(pn) || pn.startsWith(n))) contiene = p.image;
  }
  return contiene;
}

async function preguntarATiendanube(nombre) {
  if (!TIENDANUBE_STORE_ID || !TIENDANUBE_ACCESS_TOKEN) return '';
  const url = `${TN_BASE}/products?q=${encodeURIComponent(nombre)}&per_page=10&fields=id,name,images`;
  const res = await fetch(url, { headers: TN_HEADERS });
  if (!res.ok) return '';                       // 404 = no encontró nada
  const lista = await res.json();
  if (!Array.isArray(lista) || !lista.length) return '';
  const n = norm(nombre);
  const nombreDe = p => (p && p.name && typeof p.name === 'object') ? (p.name.es || Object.values(p.name)[0] || '') : (p && p.name) || '';
  const fotoDe = p => (p && Array.isArray(p.images) && p.images[0]) ? (p.images[0].src || '') : '';
  const igual = lista.find(p => norm(nombreDe(p)) === n && fotoDe(p));
  return igual ? fotoDe(igual) : '';             // sin coincidencia exacta no se arriesga otra foto
}

async function resolver(nombre) {
  const clave = KV_IMG_PREFIX + 'n:' + norm(nombre).slice(0, 180);
  try {
    const guardado = await kv.get(clave);
    if (typeof guardado === 'string') return guardado;            // '' = ya se buscó y no hay
  } catch (e) { /* sin KV se resuelve igual */ }

  let foto = '';
  try { foto = buscarPorNombre(await kv.get(KV_INDEX_KEY), nombre); }
  catch (e) { console.error('img: KV index failed:', e.message); }

  if (!foto) {
    try { foto = await preguntarATiendanube(nombre); } catch (e) { console.error('img: Tiendanube failed:', e.message); }
  }
  // lo no encontrado se recuerda solo 10 minutos: el producto puede aparecer en el índice después
  try { await kv.set(clave, foto, { ex: foto ? KV_IMG_TTL : 600 }); } catch (e) { /* no pasa nada */ }
  return foto;
}

async function bajar(url) {
  const r = await fetch(url);
  if (!r.ok) return null;
  const tipo = r.headers.get('content-type') || '';
  if (!tipo.startsWith('image/')) return null;
  return { tipo, datos: Buffer.from(await r.arrayBuffer()) };
}

let _sharp;                                     // undefined = todavía no se cargó; null = no está disponible
async function cargarSharp() {
  if (_sharp === undefined) {
    try { _sharp = (await import('sharp')).default; }
    catch (e) { console.error('img: sharp no disponible:', e.message); _sharp = null; }
  }
  return _sharp;
}

// Recorta el blanco que rodea al producto y lo devuelve centrado en un cuadrado (JPEG). null = no se pudo.
export async function encuadrar(datos, lado = LADO) {
  const sharp = await cargarSharp();
  if (!sharp) return null;

  // sobre blanco y sin transparencia, para medir siempre lo mismo
  const { data, info } = await sharp(datos).flatten({ background: BLANCO }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const cruda = (d, i) => sharp(d, { raw: { width: i.width, height: i.height, channels: i.channels } });
  const jpeg = { quality: 86, chromaSubsampling: '4:4:4' };

  // ¿la foto tiene fondo blanco? Se miran las cuatro esquinas.
  const claro = (x, y) => {
    const o = (y * info.width + x) * info.channels;
    return data[o] >= 240 && data[o + 1] >= 240 && data[o + 2] >= 240;
  };
  const fondoBlanco = claro(0, 0) && claro(info.width - 1, 0) && claro(0, info.height - 1) && claro(info.width - 1, info.height - 1);

  // foto con fondo propio (ambientada, de color): cuadrado al centro, sin agregarle blanco
  if (!fondoBlanco) return cruda(data, info).resize(lado, lado, { fit: 'cover' }).jpeg(jpeg).toBuffer();

  let recorte = null;
  try {
    const r = await cruda(data, info).trim({ background: BLANCO, threshold: 14 }).raw().toBuffer({ resolveWithObject: true });
    // si quedó casi nada (una foto prácticamente en blanco) no se confía en el recorte
    if (r.info.width >= info.width * 0.12 && r.info.height >= info.height * 0.12) recorte = r;
  } catch (e) { /* imagen lisa: se usa entera */ }

  const aire = Math.round(lado * MARGEN), interior = lado - 2 * aire;
  return (recorte ? cruda(recorte.data, recorte.info) : cruda(data, info))
    .resize(interior, interior, { fit: 'contain', background: BLANCO })
    .extend({ top: aire, bottom: aire, left: aire, right: aire, background: BLANCO })
    .jpeg(jpeg)
    .toBuffer();
}

// The product name arrives in "?n=". It is read from the raw URL rather than from the parsed parameter, so a name
// carrying "&", a stray "%" or "+" does not get cut short or throw: the mail sends it encoded, but every mail
// client builds the request its own way (and one version of the mail sends the name as-is).
export function nombreDe(req) {
  const q = req.query || {};
  const m = /[?&]n=([^#]*)/.exec(String(req.url || ''));
  let nombre = '';
  if (m) {
    try { nombre = decodeURIComponent(m[1].replace(/\+/g, ' ').replace(/%(?![0-9A-Fa-f]{2})/g, '%25')); } catch (e) { nombre = ''; }
    nombre = nombre.replace(/&amp;/g, '&');
  }
  if (!nombre) nombre = String(Array.isArray(q.n) ? q.n[0] : q.n || '');
  return nombre.slice(0, 300);
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.status(405).end(); return; }
  const nombre = nombreDe(req);

  let img = null, encontrada = false, encuadrada = false;
  try {
    const foto = nombre ? await resolver(nombre) : '';
    if (foto && esFotoDeLaTienda(foto)) {
      img = await bajar(achicar(foto)) || await bajar(foto);
      encontrada = !!img;
    }
  } catch (e) { console.error('img: failed:', e.message); }

  if (img && encontrada) {
    try {
      const cuadrada = await encuadrar(img.datos);
      if (cuadrada) { img = { tipo: 'image/jpeg', datos: cuadrada }; encuadrada = true; }
    } catch (e) { console.error('img: encuadre failed:', e.message); }   // queda la foto como vino
  }

  if (!img) { try { img = await bajar(LOGO); } catch (e) { /* queda el píxel */ } }
  if (!img) img = { tipo: 'image/png', datos: PIXEL };

  res.setHeader('Content-Type', img.tipo);
  // la foto de un producto casi no cambia; el "no encontrada" se vuelve a intentar pronto
  res.setHeader('Cache-Control', encontrada ? 'public, max-age=604800, s-maxage=604800' : 'public, max-age=600, s-maxage=600');
  res.setHeader('X-Morashop-Img', encontrada ? (encuadrada ? 'producto' : 'producto-sin-recortar') : 'logo');
  res.status(200).send(img.datos);
}
