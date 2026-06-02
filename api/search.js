/* =============================================================================
   GET /api/search?q={query}&limit=10
   ----------------------------------------------------------------------------
   Búsqueda inteligente con ranking de "más vendidos" sobre catálogo Tiendanube.

   Flujo:
   1) Lee cache de productos en Vercel KV (key "tn_products_v1", TTL 1h)
   2) Si no hay cache → trae TODOS los productos paginados desde TN API
      (per_page=200, loop hasta página vacía) y los normaliza/indexa
   3) Filtra solo published === true y stock > 0
   4) Detecta si la query matchea un type-alias (creatina, proteina, etc.)
   5) Ranking:
        - Con typeHit  → SOLO ordena por ventas (proxy hash) descending
        - Sin typeHit  → tier-based (starts-with name → brand → contains)
                         con ventas como tiebreaker
   6) Devuelve { matches, total, typeHit, cached }

   PROXY de ventas (importante):
   - Hoy: srVendidos = hash determinístico (brand+name) → 50..1549
   - Mañana (upgrade real-data):
     • Cron diario lee /v1/{store}/orders últimos 30 días
     • Cuenta apariciones por product_id
     • Guarda score en KV: hset("tn_sales_v1", product_id, count)
     • Reemplazar srVendidos(p) por: (await kv.hget('tn_sales_v1', p.id)) ?? 0
     • Mantener fallback al hash si KV vacío (cold start)

   Errores:
   - 400 falta query
   - 500 Tiendanube falla / KV falla
============================================================================= */

import { kv } from '@vercel/kv';

// Vercel: subir el timeout máximo de la función (Pro lo respeta; en Hobby no daña)
export const maxDuration = 60;

// ============== CONFIG ==============
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

const KV_CACHE_KEY = 'tn_products_v1';
const KV_TTL_SECONDS = 3600; // 1 hora

// ============== HELPERS ==============

// Normaliza: lowercase + sin tildes + trim + colapsa espacios
function srNorm(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Hash determinístico estilo Java String.hashCode — misma fórmula que el prototipo
function srSeed(p) {
  const s = ((p.brand || '') + (p.name || '')).toLowerCase();
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h = h & h; // forzar 32-bit
  }
  return Math.abs(h);
}

// Proxy de ventas: 50..1549 (determinístico por brand+name)
function srVendidos(p) {
  return (srSeed(p) % 1500) + 50;
}

// Aliases de types → palabras que tipea el usuario (sub-cats reales del catálogo)
const SR_TYPE_ALIASES = {
  // Suplementos
  'proteinas':         ['proteina', 'proteinas', 'protein', 'whey', 'caseina', 'isolate', 'aislada'],
  'creatinas':         ['creatina', 'crea', 'creatinas', 'monohidrato', 'creatine'],
  'vitaminas-salud':   ['vitamina', 'vitaminas', 'multivitaminico', 'colageno', 'magnesio', 'omega', 'zinc', 'biotina', 'melatonina', 'salud'],
  'bcaa-aminos':       ['bcaa', 'aminoacido', 'aminoacidos', 'amino', 'glutamina', 'arginina', 'leucina'],
  'pre-entrenos':      ['pre-entreno', 'pre-entrenos', 'preentreno', 'pre workout', 'preworkout', 'c4', 'pump'],
  'quemadores':        ['quemador', 'quemadores', 'fat burner', 'termogenico', 'lipo', 'cla', 'adelgazante', 'detox'],
  'combos':            ['combo', 'combos', 'pack', 'kit'],
  'snacks-proteicos':  ['barra', 'barras', 'gel', 'geles', 'snack', 'alfajor', 'cookies', 'pancake', 'gomitas'],
  'cafeina-energia':   ['cafeina', 'caffeine', 'cafeine', 'energia'],
  'carbo-isotonicos':  ['isotonico', 'isotonicos', 'carbo', 'carbohidrato', 'electrolitos', 'hidratacion'],
  'ganadores':         ['ganador', 'ganadores', 'mass gainer', 'gainer', 'serious mass', 'mutant mass'],
  // Supermercado
  'aceites-vinagres':  ['aceite', 'aceites', 'vinagre', 'aceto', 'oliva'],
  'panales-absorbentes':['panal', 'panales', 'toallita', 'toallitas', 'apositos', 'incontinencia', 'higiene'],
  'salsas-jarabes':    ['salsa', 'salsas', 'jarabe', 'syrup'],
  'pasta-mani':        ['pasta mani', 'pasta de mani', 'mantequilla mani', 'manteca de mani'],
  'almacen-fit':       ['almacen', 'fit'],
  'miel-endulzantes':  ['miel', 'endulzante', 'edulcorante', 'ghee'],
  'yerba-mate':        ['yerba', 'mate'],
  // Electro
  'cocina-electrica':  ['cafetera', 'pava', 'tostadora', 'licuadora', 'batidora', 'air fryer', 'freidora', 'horno', 'yogurtera', 'sandwicher'],
  'bano-espejos':      ['inodoro', 'bacha', 'griferia', 'espejo', 'baño'],
  'salud-medicion':    ['balanza', 'termometro', 'oximetro', 'tensiometro', 'nebulizador'],
  'cuidado-personal':  ['plancha', 'secador', 'planchita', 'depiladora'],
  'grandes-electro':   ['lavarropas', 'heladera', 'freezer', 'aire'],
  'limpieza':          ['aspirador', 'aspiradora', 'robot'],
  'herramientas':      ['taladro', 'sierra', 'amoladora', 'atornillador', 'motosierra'],
  'climatizacion':     ['ventilador', 'calefactor', 'estufa', 'caloventor'],
  // Bodega
  'vinos-tintos':      ['vino', 'vinos', 'tinto', 'tintos', 'malbec', 'cabernet', 'merlot', 'syrah'],
  'vinos-blancos':     ['blanco', 'blancos', 'chardonnay', 'sauvignon', 'torrontes'],
  'destilados':        ['gin', 'whisky', 'vodka', 'ron', 'aperitivo', 'vermut', 'fernet'],
  'espumantes':        ['espumante', 'champagne', 'brut', 'champa'],
  // Bananero
  'bananero':          ['japi', 'picante', 'salsa picante', 'cerveza japi', 'merch']
};

// Labels legibles por type (para devolver al cliente en typeHit.label)
const SR_TYPE_LABEL = {
  'proteinas':          'Proteínas',
  'creatinas':          'Creatinas',
  'vitaminas-salud':    'Vitaminas y Salud',
  'bcaa-aminos':        'BCAA y Aminoácidos',
  'pre-entrenos':       'Pre-entrenos',
  'quemadores':         'Quemadores',
  'combos':             'Combos',
  'snacks-proteicos':   'Snacks Proteicos',
  'cafeina-energia':    'Cafeína y Energía',
  'carbo-isotonicos':   'Carbo e Isotónicos',
  'ganadores':          'Ganadores de masa',
  'aceites-vinagres':   'Aceites y Vinagres',
  'panales-absorbentes':'Pañales y Absorbentes',
  'salsas-jarabes':     'Salsas y Jarabes',
  'pasta-mani':         'Pasta de Maní',
  'almacen-fit':        'Almacén Fit',
  'miel-endulzantes':   'Miel y Endulzantes',
  'yerba-mate':         'Yerba Mate',
  'cocina-electrica':   'Cocina Eléctrica',
  'bano-espejos':       'Baño y Espejos',
  'salud-medicion':     'Salud y Medición',
  'cuidado-personal':   'Cuidado Personal',
  'grandes-electro':    'Grandes Electrodomésticos',
  'limpieza':           'Limpieza',
  'herramientas':       'Herramientas',
  'climatizacion':      'Climatización',
  'vinos-tintos':       'Vinos Tintos',
  'vinos-blancos':      'Vinos Blancos',
  'destilados':         'Destilados',
  'espumantes':         'Espumantes',
  'bananero':           'Bananero',
};

// Detecta si la query coincide con un type por alias
function srMatchedType(qNorm) {
  if (!qNorm) return null;
  for (const type in SR_TYPE_ALIASES) {
    const aliases = SR_TYPE_ALIASES[type];
    for (let i = 0; i < aliases.length; i++) {
      const a = srNorm(aliases[i]);
      if (!a) continue;
      if (a === qNorm || a.startsWith(qNorm) || qNorm.startsWith(a)) return type;
    }
  }
  return null;
}

// Infiere type del producto a partir del nombre + categoría (sin tildes, lowercase)
function inferType(name, categoryName) {
  const hay = srNorm((name || '') + ' ' + (categoryName || ''));
  if (!hay) return null;
  // Match al primer type cuyo alias aparezca en el hay-string
  for (const type in SR_TYPE_ALIASES) {
    const aliases = SR_TYPE_ALIASES[type];
    for (let i = 0; i < aliases.length; i++) {
      const a = srNorm(aliases[i]);
      if (!a) continue;
      // matching simple por palabra-prefijo dentro del haystack
      if (hay.indexOf(a) !== -1) return type;
    }
  }
  return null;
}

// Extrae el primer string utilizable de un campo i18n (TN devuelve { es: "...", pt: "..." })
function pickEs(field) {
  if (!field) return '';
  if (typeof field === 'string') return field;
  if (typeof field === 'object') {
    return field.es || field.es_AR || field.es_MX || field.en || field.pt || Object.values(field)[0] || '';
  }
  return String(field);
}

// Suma stock de variantes (TN: cada variant tiene .stock; null = ilimitado)
function sumStock(product) {
  if (!Array.isArray(product.variants) || product.variants.length === 0) {
    return Number(product.stock || 0);
  }
  let total = 0;
  for (const v of product.variants) {
    // stock null en TN significa "stock ilimitado" → contamos como alto
    if (v.stock === null || v.stock === undefined) return 9999;
    total += Number(v.stock || 0);
  }
  return total;
}

// Primera URL de imagen
function pickImage(product) {
  if (!Array.isArray(product.images) || product.images.length === 0) return '';
  const img = product.images[0];
  return img.src || img.url || '';
}

// Toma el precio base (mínimo de variantes si hay, sino product.price)
function pickPrice(product) {
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    const prices = product.variants
      .map(v => Number(v.price))
      .filter(n => Number.isFinite(n) && n > 0);
    if (prices.length) return Math.min(...prices);
  }
  return Number(product.price || 0);
}

// Nombre de la primera categoría (TN: product.categories[0].name es i18n)
function pickCategoryName(product) {
  if (!Array.isArray(product.categories) || product.categories.length === 0) return '';
  return pickEs(product.categories[0].name);
}

// ============== TIENDANUBE FETCH ==============

// Trae TODOS los productos paginados
async function fetchAllProducts() {
  const all = [];
  const PER_PAGE = 200;
  let page = 1;
  // Hard-cap por seguridad: 50 páginas = 10k productos
  while (page <= 50) {
    const url = `${TN_BASE}/products?per_page=${PER_PAGE}&page=${page}`;
    const res = await fetch(url, { headers: TN_HEADERS });
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`Tiendanube GET /products page=${page} failed: ${res.status} ${txt}`);
    }
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < PER_PAGE) break;
    page++;
  }
  return all;
}

// Normaliza el producto TN → forma compacta RAW para el índice cacheado en KV.
// IMPORTANTE: NO se pre-computan brandKey/nameKey/searchKey/types/sales acá
// porque eso infla el payload ~3x (con 1.4k productos pasa de ~300KB a ~1MB+).
// Esos campos se reconstruyen en hydrateItem() después de leer de KV.
function normalizeProduct(p) {
  return {
    id: p.id,
    name: pickEs(p.name),
    brand: p.brand || '',
    price: pickPrice(p),
    stock: sumStock(p),
    image: pickImage(p),
    handle: pickEs(p.handle) || p.handle || '',
    categories: Array.isArray(p.categories) ? p.categories.map(c => c.id) : [],
    categoryName: pickCategoryName(p),
    published: p.published === true,
  };
}

// Rehidrata el item raw con los campos derivados que necesita el ranking.
// Se corre en memoria del proceso, no se persiste en KV.
function hydrateItem(raw) {
  const inferred = inferType(raw.name, raw.categoryName);
  const types = inferred ? [inferred] : [];
  const brandKey = srNorm(raw.brand);
  const nameKey = srNorm(raw.name);
  const searchKey = srNorm(raw.brand + ' ' + raw.name + ' ' + types.join(' ') + ' ' + raw.categoryName);
  const item = {
    id: raw.id,
    name: raw.name,
    brand: raw.brand,
    price: raw.price,
    stock: raw.stock,
    image: raw.image,
    handle: raw.handle,
    categories: raw.categories,
    categoryName: raw.categoryName,
    published: raw.published,
    types,
    brandKey,
    nameKey,
    searchKey,
  };
  item.sales = srVendidos(item);
  return item;
}

// Construye el índice (fetch + normalize + filtro publicado/stock) y lo cachea
// en KV en su forma RAW (campos derivados se recomputan al leer).
async function buildIndex() {
  const raw = await fetchAllProducts();
  const normalizedRaw = [];
  for (const p of raw) {
    const n = normalizeProduct(p);
    if (!n.published) continue;
    if (!(n.stock > 0)) continue;
    normalizedRaw.push(n);
  }
  // Guardar SÓLO la forma raw (puede fallar silenciosamente si KV está caído)
  try {
    await kv.set(KV_CACHE_KEY, normalizedRaw, { ex: KV_TTL_SECONDS });
  } catch (e) {
    console.error('KV set failed:', e.message);
  }
  // Hidratar para el ranking en este request
  return normalizedRaw.map(hydrateItem);
}

async function getIndex() {
  try {
    const cached = await kv.get(KV_CACHE_KEY);
    if (Array.isArray(cached) && cached.length > 0) {
      // Re-hidratar acá: el cache es raw, el ranking necesita los derivados
      return { index: cached.map(hydrateItem), cached: true };
    }
  } catch (e) {
    console.error('KV get failed:', e.message);
  }
  const index = await buildIndex();
  return { index, cached: false };
}

// ============== RANKING ==============

function srTier(p, qNorm, typeHit) {
  // Tier 1 — match de type por alias
  if (typeHit && p.types.indexOf(typeHit) !== -1) return 1;
  // Tier 2 — query es exactamente la marca
  if (p.brandKey === qNorm) return 2;
  // Tier 3 — prefijo en alguna palabra de brand/name
  const words = (p.brandKey + ' ' + p.nameKey).split(' ');
  for (let i = 0; i < words.length; i++) {
    if (words[i] && words[i].startsWith(qNorm)) return 3;
  }
  // Tier 4 — contiene en searchKey
  if (p.searchKey.indexOf(qNorm) !== -1) return 4;
  return 0;
}

function rankSearch(index, q, limit) {
  const qNorm = srNorm(q);
  if (!qNorm) return { matches: [], typeHit: null, total: 0 };

  const typeHit = srMatchedType(qNorm);
  const scored = [];

  for (let i = 0; i < index.length; i++) {
    const p = index[i];
    const inKey = p.searchKey.indexOf(qNorm) !== -1;
    const inType = typeHit && p.types.indexOf(typeHit) !== -1;
    if (!inKey && !inType) continue;
    const tier = srTier(p, qNorm, typeHit);
    if (!tier) continue;
    scored.push({ p, tier, literalHit: inKey ? 0 : 1, sales: p.sales });
  }

  scored.sort(function (a, b) {
    if (typeHit) {
      // Con typeHit: los del tipo van primero, dentro de cada grupo SOLO ventas mandan
      const aMatch = a.p.types.indexOf(typeHit) !== -1 ? 0 : 1;
      const bMatch = b.p.types.indexOf(typeHit) !== -1 ? 0 : 1;
      if (aMatch !== bMatch) return aMatch - bMatch;
      return b.sales - a.sales;
    }
    return (a.tier - b.tier) || (a.literalHit - b.literalHit) || (b.sales - a.sales);
  });

  return {
    matches: scored.slice(0, limit).map(x => x.p),
    typeHit,
    total: scored.length,
  };
}

// ============== HANDLER ==============

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  try {
    const q = String(req.query?.q || '').trim();
    const limitRaw = parseInt(req.query?.limit, 10);
    const limit = Number.isFinite(limitRaw) && limitRaw > 0 && limitRaw <= 100 ? limitRaw : 10;

    if (!q) {
      return res.status(400).json({ ok: false, error: 'missing_query' });
    }

    const { index, cached } = await getIndex();
    const result = rankSearch(index, q, limit);

    // Bug 5: mapear matches a campos públicos (saca brandKey/nameKey/searchKey/types/sales/published/categories)
    const publicMatches = result.matches.map(p => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: p.price,
      stock: p.stock,
      image: p.image,
      handle: p.handle,
      salesScore: p.sales,
    }));

    // Bug 1: typeHit como objeto {key, label, handle} en vez de string crudo
    const typeHitObj = result.typeHit
      ? { key: result.typeHit, label: SR_TYPE_LABEL[result.typeHit] || result.typeHit, handle: result.typeHit }
      : null;

    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.status(200).json({
      matches: publicMatches,
      total: result.total,
      typeHit: typeHitObj,
      cached,
    });
  } catch (err) {
    console.error('search error:', err);
    return res.status(500).json({ ok: false, error: 'server_error', detail: String(err.message || err) });
  }
}
