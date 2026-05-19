# -*- coding: utf-8 -*-
"""
Pipeline de depuracion del catalogo Morashop.
Entrada : tiendanube-2268228-17792207886162381057257057011.csv (Latin-1, sep ';')
Salida  : reportes + (futuro) datos para el sitio rediseñado.

Fases:
  1. Cargar productos unicos (por Identificador de URL)
  2. Unificar marcas (tipeo + sufijos)
  3. Clasificar cada producto: SE QUEDA (suplem/super/hogar-electro) o DISCONTINUADO
  4. Recategorizar a la taxonomia nueva
  5. Clasificar ambiguos por nombre/descripcion
"""
import csv, unicodedata, re, json, sys
from collections import Counter, defaultdict

CSV = 'tiendanube-2268228-17792207886162381057257057011.csv'

PLACEHOLDER = {
  'Suplementos':  'assets/products/whey-star.png',
  'Supermercado': 'assets/products/amino-energy-sparkling.png',
  'Electro-Hogar':'assets/products/omega3-innova-max.png',
  'El Bananero':  'assets/products/bananero.gif',
}

def norm(s):
    s = s.strip().lower()
    s = ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')
    s = s.replace('-', ' ')
    return ' '.join(s.split())

# ---- Mapa de unificacion de marcas (canonico correcto) ----
MARCA_CANON = {
    # tipeo / mayusculas
    'love': 'Love', 'innovanaturals': 'InnovaNaturals', 'leguilab': 'Leguilab',
    'ultracomb': 'Ultracomb', 'integra': 'Integra', 'comodin': 'Comodin',
    'plenitud': 'Plenitud', 'ki bar': 'Ki-Bar', '120 anos': '120 Años',
    'ambos': 'Ambos', 'cookies fit': 'Cookies Fit',
    # sufijos (misma marca)
    'sri sri': 'SriSri', 'srisri': 'SriSri', 'sri sri tattva': 'SriSri',
    'optimum': 'Optimum Nutrition', 'optimum nutrition': 'Optimum Nutrition',
    'legend': 'Legend Nutrition', 'legend nutrition': 'Legend Nutrition',
    'ena': 'Ena', 'ena sport': 'Ena',
}
def marca_canon(m):
    if not m: return ''
    n = norm(m)
    return MARCA_CANON.get(n, m.strip())

# ---- Raices ----
QUEDAN = {'suplementos','energia y potenciadores','supermercado','bodega',
          'dulces y miel','legumbres y semillas','hogar','pequenos electrodomesticos',
          'grandes electrodomesticos','inodoros inteligentes'}
SE_VAN = {'comiqueria','precios de funkos','juguetes','mundo del bebe',
          'accesorios para bebes y ninos','bicicletas'}

def cargar():
    with open(CSV, encoding='latin-1', newline='') as f:
        r = csv.reader(f, delimiter=';')
        header = next(r)
        iN = header.index('Nombre')
        iC = [i for i,h in enumerate(header) if h.startswith('Categor')][0]
        iU = [i for i,h in enumerate(header) if 'Identificador' in h][0]
        iM = header.index('Marca')
        iD = [i for i,h in enumerate(header) if h.startswith('Descripci')][0]
        seen = set(); prods = []
        for row in r:
            if len(row) <= max(iN,iC,iM,iD): continue
            k = row[iU].strip()
            if not k or k in seen: continue
            seen.add(k)
            prods.append({
                'url': k,
                'nombre': row[iN].strip(),
                'cat': row[iC].strip(),
                'marca': marca_canon(row[iM].strip()),
                'desc': row[iD].strip(),
            })
    return prods

def clasificar_destino(p):
    if not p['cat']:
        return 'AMBIGUO'
    raices = {norm(x.split('>')[0]) for x in p['cat'].split(',') if x.strip()}
    raices = {r for r in raices if r not in ('ofertas','marcas','superv2','liquidacion','morahot')}
    if raices & QUEDAN:
        return 'QUEDA'
    if raices & SE_VAN:
        return 'DISCONTINUADO'
    return 'AMBIGUO'

# ---- Deteccion de basura / productos de prueba / mensajes de clientes ----
BASURA_RE = re.compile(r'\b(prueba|test|no usar|no comprar|borrar|ejemplo|dummy|asdf|xxx+)\b', re.I)
MENSAJE_RE = re.compile(r'^\s*(hola|buenas|buenos dias|necesito|quiero saber|consulta|me pueden|disculpa)\b', re.I)
def es_basura(p):
    n = p['nombre'].strip()
    if len(n) < 4:
        return True
    if BASURA_RE.search(n):
        return True
    if MENSAJE_RE.match(n):          # mensaje de cliente colado como producto
        return True
    return False

# ---- Deteccion de discontinuados POR NOMBRE (Funko/anime/coleccionables) ----
DISC_NOMBRE_RE = re.compile(
    r'\b(funko|funkos|pop!|dragon ball|hello kitty|marvel|spider[- ]?man|'
    r'naruto|demon slayer|harry potter|star wars|anime|banpresto|wabro|'
    r'figura coleccionable|coleccionable)\b', re.I)
def disc_por_nombre(p):
    return bool(DISC_NOMBRE_RE.search(p['nombre']) or DISC_NOMBRE_RE.search(p['marca']))

# ---- Clasificador a las 4 categorias del SITIO ----
# El Bananero: marca Japi o menciona "el bananero"
BANANERO_RE = re.compile(r'\b(el bananero|bananero)\b', re.I)
def es_bananero(p):
    if norm(p['marca']) == 'japi':
        return True
    if BANANERO_RE.search(p['nombre']) or BANANERO_RE.search(p['cat']):
        return True
    return False

KW = {
  'Suplementos': [
     'creatina','whey','proteina','proteína','protein','aminoacido','aminoácido','bcaa',
     'glutamina','pre entreno','pre-entreno','preentreno','cafeina','cafeína','quemador',
     'colageno','colágeno','omega','magnesio','vitamina','suplemento','ganador de masa',
     'barra proteica','barras proteica','gomitas creatina','carnitina','beta alanine',
     'l-carnitine','eaa','resveratrol','melena de leon','melena leon','pro hormonal',
  ],
  'El Bananero': [],  # se maneja con es_bananero()
  'Supermercado': [
     'aceite','vinagre','harina','mermelada','salsa','condimento','infusion','infusión',
     'pasta de mani','pasta de maní','frutos secos','almendra','nuez','semilla','legumbre',
     'vino','espumante','cerveza','vermouth','gin','whisky','bebida','mate','yerba','te ',
     'cafe','café','dulce','miel','granola','snack','galleta','cookie','cupcake','pancake',
     'omelette','keto','shampoo','acondicionador','jabon','jabón','crema','higiene',
     'cuidado','desodorante','pañal','panal','toalla','papel','limpieza','detergente',
     'bruma facial','hidratante','arandano','arándano','chia','pudding',
     'datil','dátil','barra de cereal','barras de cereal','cereal','perfume','edp',
     'eau de parfum','colonia','fragancia','toallita','toallitas','algodon','algodón',
     'azucar','azúcar','sal ','arroz','fideo','pasta seca','conserva','enlatado',
     'gaseosa','agua','jugo','isotonica','isotónica','ropa interior','protector',
  ],
  'Electro-Hogar': [
     'licuadora','batidora','balanza','cafetera','aspiradora','heladera','freezer',
     'amoladora','taladro','herramienta','bacha','espejo','inodoro','mingitorio',
     'electrodomestico','electrodoméstico','cocina','horno','microondas','ventilador',
     'plancha','tostadora','procesadora','pava electrica','pava eléctrica',
  ],
}

def clasificar_sitio(p):
    """Devuelve una de las 4 categorias del sitio, o None si no encaja."""
    if es_bananero(p):
        return 'El Bananero'
    texto = norm(p['nombre'] + ' ' + p['cat'])
    # 1) por raiz de categoria cruda
    raices = {norm(x.split('>')[0]) for x in p['cat'].split(',') if x.strip()}
    if raices & {'suplementos','energia y potenciadores'}:
        return 'Suplementos'
    if raices & {'supermercado','bodega','dulces y miel','legumbres y semillas'}:
        return 'Supermercado'
    if raices & {'hogar','pequenos electrodomesticos','grandes electrodomesticos','inodoros inteligentes'}:
        return 'Electro-Hogar'
    # 2) por palabras clave del nombre (para ambiguos / sin categoria)
    puntajes = {}
    for cat, kws in KW.items():
        if not kws: continue
        puntajes[cat] = sum(1 for kw in kws if kw in texto)
    if puntajes:
        mejor = max(puntajes, key=puntajes.get)
        if puntajes[mejor] > 0:
            return mejor
    # 3) pista por marca conocida (suplementos vs alimento/cuidado)
    MARCAS_SUPLEM = {norm(m) for m in (
        'Ena','Star Nutrition','Gold Nutrition','Body Advance','Labs Nutrition',
        'Framingham Pharma','Gentech','Optimum Nutrition','Universal Nutrition',
        'Muscletech','Cellucor','Bsn','Nutrex Research','Ultimate Nutrition',
        'Protein Project','Woman Supplements','My Protein','Atlhetica Nutrition',
        'Eth Nutrition','Mervick','Nutrilab','Breaking Lab','Hoch Sport','Gentech')}
    if norm(p['marca']) in MARCAS_SUPLEM:
        return 'Suplementos'
    return None  # no clasificable -> revision manual

# ---- Subtipo (filtro pill) por categoria del sitio ----
SUBTIPO = {
  'Suplementos': [
    ('proteinas', ['whey','proteina','protein','syntha','caseina']),
    ('creatinas', ['creatina','creatine']),
    ('pre-entrenos', ['pre entreno','pre-entreno','preentreno','pre workout','no-xplode','oxido nitrico']),
    ('bcaa', ['bcaa','aminoacido','aminoácido','amino energy','glutamina','eaa']),
    ('quemadores', ['quemador','fat burner','definicion','termo','l-carnitine','carnitina']),
    ('vitaminas', ['vitamina','omega','magnesio','colageno','colágeno','mineral','multivit']),
    ('barras', ['barra','gel ','geles','snack proteico','cookie','cupcake','pancake']),
    ('combos', ['combo','pack x','x2','x3','2x1','3x1']),
  ],
  'Supermercado': [
    ('almacen', ['aceite','vinagre','harina','mermelada','salsa','condimento','pasta de mani','frutos secos','almendra','nuez','semilla','legumbre','dulce','miel','granola','infusion','mate','yerba','arroz','fideo','azucar','sal ','datil','cereal','barra de cereal']),
    ('bebidas', ['vino','espumante','cerveza','vermouth','gin','whisky','gaseosa','agua','jugo','bebida']),
    ('cuidado-personal', ['shampoo','acondicionador','jabon','jabón','crema','desodorante','perfume','edp','colonia','fragancia','higiene','cuidado','toallita','pañal','panal','algodon','protector','ropa interior']),
  ],
  'Electro-Hogar': [
    ('electrodomesticos', ['licuadora','batidora','cafetera','aspiradora','heladera','freezer','horno','microondas','tostadora','procesadora','pava','ventilador','plancha']),
    ('cocina', ['cocina','bacha','olla','sarten','sartén']),
    ('bano', ['baño','bano','inodoro','espejo','mingitorio','bidet']),
    ('herramientas', ['amoladora','taladro','herramienta','soldadora','compresor']),
    ('otros', []),
  ],
  'El Bananero': [
    ('cerveza', ['cerveza','japi','ipa','lager','porter','birra']),
    ('picantes', ['salsa picante','picante','hot sauce','terapia picante','papas','snack']),
    ('otros', []),
  ],
}
def subtipo(cat_sitio, p):
    texto = norm(p['nombre'] + ' ' + p['cat'])
    for st, kws in SUBTIPO.get(cat_sitio, []):
        if not kws:  # 'otros' = fallback
            return st
        if any(kw in texto for kw in kws):
            return st
    reglas = SUBTIPO.get(cat_sitio, [])
    return reglas[0][0] if reglas else 'otros'

def acortar_nombre(nombre, marca):
    """Acorta nombres tipo Tiendanube SEO largos para mostrar en card.
    - Saca la marca del nombre si esta repetida
    - Recorta a ~50 chars cortando en limite de palabra
    - Saca '2x1', 'sin gluten', 'sin sabor', etc al final si pasa el limite
    """
    n = nombre.strip()
    # Sacar marca del nombre (case-insensitive) para no repetir
    if marca:
        n = re.sub(r'\b' + re.escape(marca) + r'\b', '', n, flags=re.I).strip()
        n = re.sub(r'\s+', ' ', n)
    # Sacar promos/sufijos en mayúsculas con exclamaciones
    n = re.sub(r'\s*\d*x\d!+\s*$', '', n, flags=re.I).strip()  # 2x1!!!! al final
    n = re.sub(r'\s*!+\s*$', '', n).strip()
    # Limite 50 chars cortando en palabra
    if len(n) > 50:
        cut = n[:50].rsplit(' ', 1)[0]
        n = cut + '…'
    return n or nombre

def precio_fmt(v):
    """CSV trae precios en formato ingles: '32,500.00' = treinta y dos mil quinientos."""
    v = (v or '').strip()
    if not v: return None
    # Quitar separador de miles (,) y dejar el . decimal
    v = v.replace(',', '')
    try:
        n = float(v)
        if n <= 0: return None
        return '$ ' + f'{int(round(n)):,}'.replace(',', '.')
    except Exception:
        return None

def construir_catalogo():
    """Devuelve lista (cat_sitio, dict-producto-sitio) de los que van al sitio."""
    prods = cargar_full()
    salida = []
    for p in prods:
        if es_basura(p): continue
        if disc_por_nombre(p): continue
        if clasificar_destino(p) == 'DISCONTINUADO': continue
        c = clasificar_sitio(p)
        if c is None:
            # forzar los 4 conocidos resueltos manualmente
            n = norm(p['nombre'])
            if 'oleo calcareo' in n or 'sacaleche' in n:
                continue  # discontinuado (bebe)
            c = 'Supermercado'
        precio = precio_fmt(p['precio'])
        promo = precio_fmt(p['promo'])
        item = {
            'brand': p['marca'] or '',
            'name': acortar_nombre(p['nombre'], p['marca']),
            'meta': '',  # SKU no se muestra al cliente final
            'price': precio or 'Consultar',
            'img': PLACEHOLDER[c],
            'types': [subtipo(c, p)],
        }
        if promo and precio and promo != precio:
            item['was'] = precio
            item['price'] = promo
            item['tag'] = 'Oferta'
            item['tagType'] = 'sale'
        salida.append((c, item))
    return salida

def cargar_full():
    """Como cargar() pero incluye precio, promo, stock, sku."""
    with open(CSV, encoding='latin-1', newline='') as f:
        r = csv.reader(f, delimiter=';')
        header = next(r)
        iN = header.index('Nombre')
        iC = [i for i,h in enumerate(header) if h.startswith('Categor')][0]
        iU = [i for i,h in enumerate(header) if 'Identificador' in h][0]
        iM = header.index('Marca')
        iD = [i for i,h in enumerate(header) if h.startswith('Descripci')][0]
        iP = header.index('Precio')
        iPP = [i for i,h in enumerate(header) if h.startswith('Precio promo')][0]
        iS = header.index('Stock')
        iSK = header.index('SKU')
        seen = set(); prods = []
        for row in r:
            if len(row) <= max(iN,iC,iM,iD,iP,iPP): continue
            k = row[iU].strip()
            if not k or k in seen: continue
            seen.add(k)
            prods.append({
                'url': k, 'nombre': row[iN].strip(), 'cat': row[iC].strip(),
                'marca': marca_canon(row[iM].strip()), 'desc': row[iD].strip(),
                'precio': row[iP] if len(row)>iP else '',
                'promo': row[iPP] if len(row)>iPP else '',
                'stock': row[iS] if len(row)>iS else '',
                'sku': row[iSK].strip() if len(row)>iSK else '',
            })
    return prods

if __name__ == '__main__':
    import json
    cat = construir_catalogo()
    by = Counter(c for c,_ in cat)
    print('Productos al sitio:', len(cat))
    for c,n in by.most_common(): print(f'  {c:16s} {n}')
    # muestra
    print()
    for cs in ['Suplementos','Supermercado','Electro-Hogar','El Bananero']:
        ej=[i for c,i in cat if c==cs][:3]
        print(f'--- {cs} ---')
        for e in ej:
            print('  ', json.dumps(e, ensure_ascii=False)[:140])
