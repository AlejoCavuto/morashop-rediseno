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
        - Con typeHit  → dentro del tipo: match de NOMBRE primero (prefijo de
                         palabra > contiene > solo-categoria), luego ventas
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

const KV_CACHE_KEY = 'tn_products_v2';   // v2: price ahora usa promotional_price + compareAt
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

// ============== STEMMING ES ==============
// El matching era literal (substring/prefijo), asi que "barrita" no encontraba
// "Barras" ni al reves: en castellano el plural (-s/-es) y el diminutivo
// (-ita/-ito/-illa) generan palabras que no se contienen entre si.
// srStem lleva query y catalogo a la MISMA raiz:
//   barras -> barra -> barr      barritas -> barrita -> barr
//   proteinas -> proteina -> protein     creatine -> creatin
function srStem(w) {
  if (!w || w.length < 4) return w || '';
  var x = w;
  // plural
  if (x.length > 4 && x.slice(-2) === 'es') x = x.slice(0, -2);
  else if (x.length > 3 && x.slice(-1) === 's') x = x.slice(0, -1);
  // diminutivo (barrita -> barr, gomita -> gom)
  x = x.replace(/(?:cit|cill|it|ill)[aeo]$/, '');
  // vocal final (barra -> barr, proteina -> protein, creatine -> creatin)
  if (x.length > 4 && 'aeiou'.indexOf(x.slice(-1)) !== -1) x = x.slice(0, -1);
  // si quedo demasiado corto, no vale la pena: se pierde precision
  return x.length >= 3 ? x : w;
}

function srStemPhrase(str) {
  return String(str || '').split(' ').map(srStem).join(' ');
}

// Detecta si la query coincide con un type por alias
function srMatchedType(qNorm) {
  if (!qNorm) return null;
  for (const type in SR_TYPE_ALIASES) {
    const aliases = SR_TYPE_ALIASES[type];
    for (let i = 0; i < aliases.length; i++) {
      const a = srNorm(aliases[i]);
      if (!a) continue;
      if (a === qNorm || a.startsWith(qNorm) || qNorm.startsWith(a)) return type;
      // mismo chequeo por raiz: "barritas" tiene que pegarle al alias "barras"
      var as = srStemPhrase(a), qs = srStemPhrase(qNorm);
      if (as && qs && (as === qs || as.startsWith(qs) || qs.startsWith(as))) return type;
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

// Precio EFECTIVO de una variante. TN guarda el precio de LISTA en variant.price y,
// cuando hay oferta, el que realmente se cobra en variant.promotional_price. Leer
// solo .price devolvia el precio inflado (Ivy Bears: $143.626 en vez de $69.999).
function variantPrice(v) {
  const promo = Number(v.promotional_price);
  if (Number.isFinite(promo) && promo > 0) return promo;
  return Number(v.price);
}

// Toma el precio base (mínimo de variantes si hay, sino product.price)
function pickPrice(product) {
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    const prices = product.variants
      .map(variantPrice)
      .filter(n => Number.isFinite(n) && n > 0);
    if (prices.length) return Math.min(...prices);
  }
  return Number(product.promotional_price || product.price || 0);
}

// Precio tachado: el de lista de la variante que define el precio efectivo,
// y solo si realmente hay descuento. null = sin oferta.
function pickCompareAt(product) {
  const eff = pickPrice(product);
  if (!(eff > 0)) return null;
  let list = 0;
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    for (let i = 0; i < product.variants.length; i++) {
      if (variantPrice(product.variants[i]) === eff) {
        list = Number(product.variants[i].price) || 0;
        break;
      }
    }
  } else {
    list = Number(product.price) || 0;
  }
  return list > eff ? list : null;
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
    compareAt: pickCompareAt(p),
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
  const stemKey = srStemPhrase(searchKey);
  const nameStemKey = srStemPhrase(nameKey);
  const item = {
    id: raw.id,
    name: raw.name,
    brand: raw.brand,
    price: raw.price,
    compareAt: raw.compareAt != null ? raw.compareAt : null,
    stock: raw.stock,
    image: raw.image,
    handle: raw.handle,
    categories: raw.categories,
    categoryName: raw.categoryName,
    published: raw.published,
    types,
    brandKey,
    nameKey,
    stemKey,
    nameStemKey,
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

// Que tan bien matchea la QUERY con el NOMBRE del producto.
// 0 = alguna palabra del nombre empieza con la query ("barra" -> "Barras Proteicas")
// 1 = el nombre la contiene en algun lado
// 2 = no matchea el nombre (entro solo por categoria)
// 0 = palabra del nombre empieza con la query literal
// 1 = el nombre la contiene literal
// 2 = match por RAIZ al inicio de palabra ("barritas" vs "Barras")
// 3 = match por raiz en cualquier lado
// 4 = no matchea el nombre (entro solo por categoria)
function srNameRank(p, qNorm, qStems) {
  const words = String(p.nameKey || '').split(' ');
  for (let i = 0; i < words.length; i++) {
    if (words[i] && words[i].startsWith(qNorm)) return 0;
  }
  if (String(p.nameKey || '').indexOf(qNorm) !== -1) return 1;
  if (qStems && qStems.length) {
    const nameStems = String(p.nameStemKey || '').split(' ');
    const allPrefix = qStems.every(st => nameStems.some(w => w && w.startsWith(st)));
    if (allPrefix) return 2;
    const nameStemStr = String(p.nameStemKey || '');
    if (qStems.every(st => nameStemStr.indexOf(st) !== -1)) return 3;
  }
  return 4;
}

function srTier(p, qNorm, typeHit, inStem) {
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
  // Tier 5 — match por RAIZ (todas las palabras de la query, stemmeadas)
  if (inStem) return 5;
  return 0;
}

function rankSearch(index, q, limit) {
  const qNorm = srNorm(q);
  if (!qNorm) return { matches: [], typeHit: null, total: 0 };

  const typeHit = srMatchedType(qNorm);
  // Raices de la query: TODAS tienen que aparecer para considerar match por raiz.
  const qStems = qNorm.split(' ').filter(Boolean).map(srStem).filter(Boolean);
  const scored = [];

  for (let i = 0; i < index.length; i++) {
    const p = index[i];
    const inKey = p.searchKey.indexOf(qNorm) !== -1;
    const inStem = qStems.length > 0 && qStems.every(st => String(p.stemKey || '').indexOf(st) !== -1);
    const inType = typeHit && p.types.indexOf(typeHit) !== -1;
    if (!inKey && !inStem && !inType) continue;
    const tier = srTier(p, qNorm, typeHit, inStem);
    if (!tier) continue;
    scored.push({ p, tier, literalHit: inKey ? 0 : 1, nameRank: srNameRank(p, qNorm, qStems), sales: p.sales });
  }

  scored.sort(function (a, b) {
    if (typeHit) {
      // Con typeHit: los del tipo van primero. Dentro del grupo, manda el NOMBRE
      // (prefijo de palabra > contiene > solo-categoria) y recien despues las ventas.
      // Sin esto, "barra" devolvia geles y pancakes por tener mas ventas que las barras.
      const aMatch = a.p.types.indexOf(typeHit) !== -1 ? 0 : 1;
      const bMatch = b.p.types.indexOf(typeHit) !== -1 ? 0 : 1;
      if (aMatch !== bMatch) return aMatch - bMatch;
      if (a.nameRank !== b.nameRank) return a.nameRank - b.nameRank;
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

// ============== CORRECCION DE TYPOS ==============
// La query se matchea por substring/prefijo, asi que un error al PRINCIPIO de la
// palabra ("kreatina") daba 0 resultados. Acá, solo cuando la busqueda no devuelve
// nada, se busca la palabra mas parecida del catalogo por distancia de edicion.

// Levenshtein acotado: si se pasa de `max` corta y devuelve max+1 (barato).
function srLev(a, b, max) {
  const la = a.length, lb = b.length;
  if (Math.abs(la - lb) > max) return max + 1;
  let prev = new Array(lb + 1);
  for (let j = 0; j <= lb; j++) prev[j] = j;
  for (let i = 1; i <= la; i++) {
    const cur = new Array(lb + 1);
    cur[0] = i;
    let best = cur[0];
    const ca = a.charCodeAt(i - 1);
    for (let j = 1; j <= lb; j++) {
      const cost = ca === b.charCodeAt(j - 1) ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (cur[j] < best) best = cur[j];
    }
    if (best > max) return max + 1;
    prev = cur;
  }
  return prev[lb];
}

// Vocabulario = aliases de tipo + palabras de marca/nombre, con frecuencia
// (la frecuencia desempata: "creatina" aparece mucho mas que un typo del catalogo).
let _vocabCache = null;
function srVocab(index) {
  if (_vocabCache && _vocabCache.n === index.length) return _vocabCache.map;
  const map = new Map();
  const add = (w) => {
    if (!w || w.length < 3 || /^\d+$/.test(w)) return;
    map.set(w, (map.get(w) || 0) + 1);
  };
  for (const type in SR_TYPE_ALIASES) {
    const aliases = SR_TYPE_ALIASES[type];
    for (let i = 0; i < aliases.length; i++) {
      // los aliases pesan como si aparecieran mucho: son el vocabulario "oficial"
      const a = srNorm(aliases[i]);
      if (a && a.length >= 3) map.set(a, (map.get(a) || 0) + 500);
    }
  }
  for (let i = 0; i < index.length; i++) {
    const words = (index[i].brandKey + ' ' + index[i].nameKey).split(' ');
    for (let w = 0; w < words.length; w++) add(words[w]);
  }
  _vocabCache = { n: index.length, map };
  return map;
}

// Corrige palabra por palabra. Devuelve la query corregida o null si no cambio nada.
function srCorrectQuery(qNorm, index) {
  const vocab = srVocab(index);
  const parts = qNorm.split(' ').filter(Boolean);
  if (!parts.length) return null;
  let changed = false;
  const out = parts.map(function (w) {
    if (w.length < 3 || vocab.has(w)) return w;
    const max = w.length >= 7 ? 2 : 1;
    let best = null, bestD = max + 1, bestFreq = -1;
    for (const [v, freq] of vocab) {
      if (Math.abs(v.length - w.length) > max) continue;
      const d = srLev(w, v, max);
      if (d > max) continue;
      if (d < bestD || (d === bestD && freq > bestFreq)) { bestD = d; bestFreq = freq; best = v; }
    }
    if (best) { changed = true; return best; }
    return w;
  });
  return changed ? out.join(' ') : null;
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
    let result = rankSearch(index, q, limit);

    // Sin resultados -> probar corrigiendo typos ("kreatina" -> "creatina").
    let didYouMean = null;
    if (result.total === 0) {
      const fixed = srCorrectQuery(srNorm(q), index);
      if (fixed && fixed !== srNorm(q)) {
        const retry = rankSearch(index, fixed, limit);
        if (retry.total > 0) { result = retry; didYouMean = fixed; }
      }
    }

    // fallback = hay resultados pero NINGUNO matchea el nombre (entraron solo por
    // categoria). El cliente usa esto para el rotulo "no hay X con stock, te puede servir".
    const effectiveQ = srNorm(didYouMean || q);
    const effStems = effectiveQ.split(' ').filter(Boolean).map(srStem).filter(Boolean);
    const nameMatched = result.matches.filter(m => srNameRank(m, effectiveQ, effStems) < 4).length;
    const fallback = result.total > 0 && nameMatched === 0;

    // Bug 5: mapear matches a campos públicos (saca brandKey/nameKey/searchKey/types/sales/published/categories)
    const publicMatches = result.matches.map(p => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: p.price,
      compareAt: p.compareAt != null ? p.compareAt : null,
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
      didYouMean,
      fallback,
      cached,
    });
  } catch (err) {
    console.error('search error:', err);
    return res.status(500).json({ ok: false, error: 'server_error', detail: String(err.message || err) });
  }
}
