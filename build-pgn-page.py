"""Build redesigned PGN brand page HTML.
Inspired by pgnsa.com.ar (green natural palette) + Morashop structure.
Output: pgn-page.html for TN admin paste.
"""
import json, os, html as html_lib

ROOT = r"c:\Users\alejo\OneDrive\Escritorio\catalogo_star\morashop-rediseno"
PRODUCTS = os.path.join(ROOT, "pgn-products.json")
OUT = os.path.join(ROOT, "pgn-page.html")

with open(PRODUCTS, encoding="utf-8") as f:
    products = json.load(f)

cards_html = ""
for p in products:
    handle = p["handle"]
    name = html_lib.escape(p["name"])
    cards_html += (
        '<a href="/productos/' + handle + '/" class="pgn-product-card">'
        '<div class="pgn-product-img">'
        '<img src="https://acdn.mitiendanube.com/stores/002/268/228/products/' + handle + '-1.jpg" '
        'alt="' + name + '" loading="lazy" '
        'onerror="this.style.opacity=0.3;this.src=\'data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 100 100&quot;><rect width=&quot;100&quot; height=&quot;100&quot; fill=&quot;%23f7faf6&quot;/><text x=&quot;50&quot; y=&quot;55&quot; text-anchor=&quot;middle&quot; font-family=&quot;Arial&quot; font-size=&quot;14&quot; fill=&quot;%231d6e3d&quot;>PGN</text></svg>\';" />'
        '</div>'
        '<div class="pgn-product-info">'
        '<h3 class="pgn-product-name">' + name + '</h3>'
        '<span class="pgn-product-cta">Ver producto &rarr;</span>'
        '</div>'
        '</a>'
    )

# Build full HTML with f-string substitutions
TOTAL = len(products)

html_doc = """<!-- ============================================================
     PGN BRAND PAGE - Morashop x PGN Redesign
     Pegar en Tiendanube Admin -> Paginas -> /pgn2 -> modo HTML
     ============================================================ -->
<style>
  .pgn-page {
    font-family: 'Inter', -apple-system, sans-serif;
    color: #1a2744;
    max-width: 100%;
    margin: 0 auto;
    background: #fafdf9;
  }
  .pgn-hero {
    background: linear-gradient(135deg, #1d6e3d 0%, #2e8b57 50%, #4ca64c 100%);
    color: #fff;
    padding: 80px 24px 100px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .pgn-hero::before {
    content: "";
    position: absolute;
    top: -50%;
    right: -10%;
    width: 80%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%);
    transform: rotate(15deg);
    pointer-events: none;
  }
  .pgn-hero-eyebrow {
    display: inline-block;
    background: rgba(255,255,255,0.15);
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 8px 20px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.3);
    margin-bottom: 24px;
  }
  .pgn-hero h1 {
    font-size: clamp(36px, 6vw, 64px);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.02em;
    margin: 0 0 20px;
    text-shadow: 0 2px 24px rgba(0,0,0,0.15);
  }
  .pgn-hero p {
    font-size: clamp(16px, 2vw, 20px);
    max-width: 640px;
    margin: 0 auto 32px;
    color: rgba(255,255,255,0.92);
    line-height: 1.5;
  }
  .pgn-hero-cta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    color: #1d6e3d;
    padding: 14px 32px;
    border-radius: 999px;
    font-weight: 700;
    text-decoration: none;
    font-size: 15px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    transition: all 0.2s;
  }
  .pgn-hero-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.25);
  }
  .pgn-stats {
    background: #fff;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background-color: #e6efe2;
    border-top: 4px solid #1d6e3d;
  }
  .pgn-stat {
    background: #fff;
    padding: 32px 16px;
    text-align: center;
  }
  .pgn-stat-num {
    font-size: 32px;
    font-weight: 800;
    color: #1d6e3d;
    line-height: 1;
    margin-bottom: 6px;
  }
  .pgn-stat-label {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #5a6478;
  }
  @media (max-width: 768px) {
    .pgn-stats { grid-template-columns: repeat(2, 1fr); }
  }
  .pgn-story {
    padding: 80px 24px;
    text-align: center;
    background: #fff;
  }
  .pgn-story-inner {
    max-width: 720px;
    margin: 0 auto;
  }
  .pgn-eyebrow {
    font-size: 12px;
    font-weight: 700;
    color: #4ca64c;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    margin-bottom: 16px;
  }
  .pgn-story h2 {
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 800;
    color: #1a2744;
    margin: 0 0 20px;
    letter-spacing: -0.02em;
    line-height: 1.15;
  }
  .pgn-story p {
    font-size: 17px;
    line-height: 1.65;
    color: #5a6478;
    margin: 0 0 16px;
  }
  .pgn-products-section {
    background: linear-gradient(180deg, #fafdf9 0%, #f0f7ee 100%);
    padding: 80px 24px;
  }
  .pgn-products-inner {
    max-width: 1280px;
    margin: 0 auto;
  }
  .pgn-products-header {
    text-align: center;
    margin-bottom: 48px;
  }
  .pgn-products-header h2 {
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 800;
    color: #1a2744;
    margin: 8px 0 16px;
    letter-spacing: -0.02em;
  }
  .pgn-products-header p {
    font-size: 16px;
    color: #5a6478;
    max-width: 560px;
    margin: 0 auto;
  }
  .pgn-products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
  }
  .pgn-product-card {
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    border: 1px solid #e8efe5;
    transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
  }
  .pgn-product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(29,110,61,0.12);
    border-color: #4ca64c;
  }
  .pgn-product-img {
    aspect-ratio: 1 / 1;
    background: #f7faf6;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    overflow: hidden;
  }
  .pgn-product-img img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.3s;
  }
  .pgn-product-card:hover .pgn-product-img img {
    transform: scale(1.05);
  }
  .pgn-product-info {
    padding: 14px 14px 18px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
  }
  .pgn-product-name {
    font-size: 13px;
    font-weight: 600;
    line-height: 1.35;
    color: #1a2744;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .pgn-product-cta {
    font-size: 12px;
    font-weight: 700;
    color: #1d6e3d;
    letter-spacing: 0.02em;
  }
  .pgn-mayorista {
    background: linear-gradient(135deg, #E8341A 0%, #C72D17 100%);
    color: #fff;
    padding: 60px 24px;
    text-align: center;
    margin: 40px 24px;
    border-radius: 24px;
    box-shadow: 0 16px 48px rgba(232,52,26,0.25);
  }
  .pgn-mayorista-eyebrow {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    opacity: 0.85;
    margin-bottom: 12px;
  }
  .pgn-mayorista h2 {
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 800;
    margin: 0 0 24px;
    letter-spacing: -0.02em;
  }
  .pgn-mayorista a {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #fff;
    color: #E8341A;
    padding: 14px 32px;
    border-radius: 999px;
    font-weight: 700;
    text-decoration: none;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    transition: transform 0.2s;
  }
  .pgn-mayorista a:hover {
    transform: translateY(-2px);
  }
  .pgn-values {
    padding: 60px 24px 80px;
    background: #fff;
  }
  .pgn-values-grid {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  .pgn-value {
    text-align: center;
    padding: 32px 20px;
    background: #f7faf6;
    border-radius: 16px;
    border: 1px solid #e8efe5;
  }
  .pgn-value-icon {
    width: 56px;
    height: 56px;
    margin: 0 auto 16px;
    background: linear-gradient(135deg, #4ca64c, #1d6e3d);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
  }
  .pgn-value h3 {
    font-size: 18px;
    font-weight: 700;
    color: #1a2744;
    margin: 0 0 8px;
  }
  .pgn-value p {
    font-size: 14px;
    color: #5a6478;
    line-height: 1.5;
    margin: 0;
  }
  @media (max-width: 768px) {
    .pgn-values-grid { grid-template-columns: 1fr; }
  }
</style>

<div class="pgn-page">

  <section class="pgn-hero">
    <span class="pgn-hero-eyebrow">&#127807; Lideres en bienestar natural</span>
    <h1>Volve a lo natural<br/>con PGN</h1>
    <p>Suplementos dietarios elaborados con extractos herbales puros. Mas de 30 anos cuidando tu salud desde adentro.</p>
    <a href="#productos-pgn" class="pgn-hero-cta">
      Ver todos los productos
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
    </a>
  </section>

  <div class="pgn-stats">
    <div class="pgn-stat">
      <div class="pgn-stat-num">__TOTAL__+</div>
      <div class="pgn-stat-label">Productos disponibles</div>
    </div>
    <div class="pgn-stat">
      <div class="pgn-stat-num">30+</div>
      <div class="pgn-stat-label">Anos de experiencia</div>
    </div>
    <div class="pgn-stat">
      <div class="pgn-stat-num">100%</div>
      <div class="pgn-stat-label">Origen natural</div>
    </div>
    <div class="pgn-stat">
      <div class="pgn-stat-num">&#9733; 4.8</div>
      <div class="pgn-stat-label">Rating clientes</div>
    </div>
  </div>

  <section class="pgn-story">
    <div class="pgn-story-inner">
      <div class="pgn-eyebrow">&#127793; Sobre PGN</div>
      <h2>Tu bienestar empieza hoy</h2>
      <p>PGN es un laboratorio argentino lider en suplementos dietarios a base de hierbas naturales y extractos herbales. Cada formula esta pensada para acompanarte: desde la linea Andina con plantas medicinales tradicionales hasta nuestros suplementos premium con curcuma, espirulina y colageno.</p>
      <p style="margin-top: 24px; font-weight: 600; color: #1d6e3d;">Calidad certificada &middot; Ingredientes puros &middot; Hecho en Argentina</p>
    </div>
  </section>

  <section class="pgn-products-section" id="productos-pgn">
    <div class="pgn-products-inner">
      <div class="pgn-products-header">
        <div class="pgn-eyebrow">&#127807; Catalogo completo</div>
        <h2>Todos los productos PGN</h2>
        <p>__TOTAL__ suplementos PGN disponibles ahora en Morashop. Envio a todo el pais.</p>
      </div>
      <div class="pgn-products-grid">
        __CARDS__
      </div>
    </div>
  </section>

  <section class="pgn-values">
    <div class="pgn-values-grid">
      <div class="pgn-value">
        <div class="pgn-value-icon">&#127793;</div>
        <h3>100% natural</h3>
        <p>Extractos herbales puros, sin quimicos agregados ni conservantes artificiales.</p>
      </div>
      <div class="pgn-value">
        <div class="pgn-value-icon">&#128300;</div>
        <h3>Calidad garantizada</h3>
        <p>Laboratorio habilitado por ANMAT. Cada lote testeado y certificado.</p>
      </div>
      <div class="pgn-value">
        <div class="pgn-value-icon">&#128666;</div>
        <h3>Envio a todo el pais</h3>
        <p>Despachamos en 24hs. Envio gratis CABA/GBA en compras superiores a $70.000.</p>
      </div>
    </div>
  </section>

  <section class="pgn-mayorista">
    <div class="pgn-mayorista-eyebrow">Mayorista</div>
    <h2>Suma PGN a tu negocio</h2>
    <a href="/mayoristas/">
      Consultar ahora
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
    </a>
  </section>

</div>
"""

html_doc = html_doc.replace("__TOTAL__", str(TOTAL)).replace("__CARDS__", cards_html)

with open(OUT, "w", encoding="utf-8") as f:
    f.write(html_doc)

print(f"OK. Saved: {OUT}")
print(f"Size: {len(html_doc):,} bytes")
print(f"Productos: {TOTAL}")
