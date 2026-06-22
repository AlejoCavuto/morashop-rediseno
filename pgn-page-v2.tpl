{# ============================================================
   PGN BRAND PAGE - Morashop x PGN Redesign v2
   Productos: walk categories[marcas][pgn] -> fallback sections.pgn -> static
   Tipografia: Fraunces (serif editorial) + Inter (body)
   Subir por FTP: /templates/page.pgn2.tpl
   ============================================================ #}
<style>
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&display=swap');

  .pgn-page {
    font-family: 'Inter', -apple-system, sans-serif;
    color: #1c2a20;
    max-width: 100%;
    margin: 0 auto;
    background: #fafdf9;
    --pgn-deep: #0f3d22;
    --pgn-brand: #1d6e3d;
    --pgn-mid: #2e8b57;
    --pgn-light: #4ca64c;
    --pgn-lime: #c4e85f;
    --pgn-cream: #f4f8ee;
    --pgn-ink: #1c2a20;
    --pgn-muted: #6b7864;
    --pgn-hairline: #e6efe2;
  }
  .pgn-page * { box-sizing: border-box; }
  .pgn-serif { font-family: 'Fraunces', Georgia, serif; }
  .pgn-italic { font-style: italic; font-weight: 300; }

  /* =========== HERO =========== */
  .pgn-hero {
    background:
      radial-gradient(ellipse at 80% 20%, rgba(196,232,95,0.18) 0%, transparent 50%),
      radial-gradient(ellipse at 20% 80%, rgba(76,166,76,0.25) 0%, transparent 55%),
      linear-gradient(135deg, #0f3d22 0%, #1d6e3d 50%, #2e8b57 100%);
    color: #fff;
    padding: 110px 24px 130px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .pgn-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.4'/></svg>");
    opacity: 0.06;
    pointer-events: none;
  }
  .pgn-hero-inner {
    position: relative;
    z-index: 2;
    max-width: 920px;
    margin: 0 auto;
  }
  .pgn-hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: rgba(255,255,255,0.85);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    margin-bottom: 32px;
  }
  .pgn-hero-eyebrow svg { width: 16px; height: 16px; stroke: #c4e85f; }
  .pgn-hero h1 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(48px, 7vw, 88px);
    font-weight: 700;
    line-height: 0.98;
    letter-spacing: -0.03em;
    margin: 0 0 28px;
    color: #fff;
  }
  .pgn-hero h1 em {
    font-style: italic;
    font-weight: 500;
    color: #c4e85f;
  }
  .pgn-hero p {
    font-family: 'Inter', sans-serif;
    font-size: clamp(16px, 1.6vw, 19px);
    max-width: 620px;
    margin: 0 auto 40px;
    color: rgba(255,255,255,0.86);
    line-height: 1.65;
    font-weight: 400;
  }
  .pgn-hero-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #c4e85f;
    color: #0f3d22;
    padding: 16px 36px;
    border-radius: 999px;
    font-weight: 700;
    text-decoration: none;
    font-size: 14px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    transition: all 0.25s ease;
  }
  .pgn-hero-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(196,232,95,0.35);
    background: #d4f078;
  }
  .pgn-hero-trust {
    margin-top: 32px;
    display: flex;
    justify-content: center;
    gap: 28px;
    flex-wrap: wrap;
    color: rgba(255,255,255,0.7);
    font-size: 12px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  .pgn-hero-trust span {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .pgn-hero-trust svg { width: 14px; height: 14px; stroke: #c4e85f; }

  /* =========== STATS BAR =========== */
  .pgn-stats {
    background: #fff;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-bottom: 1px solid var(--pgn-hairline);
  }
  .pgn-stat {
    padding: 48px 20px;
    text-align: center;
    border-right: 1px solid var(--pgn-hairline);
  }
  .pgn-stat:last-child { border-right: none; }
  .pgn-stat-icon {
    width: 28px;
    height: 28px;
    margin: 0 auto 16px;
    color: var(--pgn-brand);
  }
  .pgn-stat-icon svg { width: 100%; height: 100%; stroke: currentColor; fill: none; stroke-width: 1.5; }
  .pgn-stat-num {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(40px, 5vw, 56px);
    font-weight: 600;
    color: var(--pgn-deep);
    line-height: 1;
    margin-bottom: 10px;
    font-variant-numeric: oldstyle-nums;
    letter-spacing: -0.02em;
  }
  .pgn-stat-label {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.24em;
    color: var(--pgn-muted);
  }
  @media (max-width: 768px) {
    .pgn-stats { grid-template-columns: repeat(2, 1fr); }
    .pgn-stat:nth-child(2) { border-right: none; }
    .pgn-stat:nth-child(1), .pgn-stat:nth-child(2) { border-bottom: 1px solid var(--pgn-hairline); }
  }

  /* =========== STORY (asimetrico 60/40) =========== */
  .pgn-story {
    padding: 100px 24px;
    background: #fff;
  }
  .pgn-story-grid {
    max-width: 1180px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 80px;
    align-items: center;
  }
  .pgn-story-copy { position: relative; }
  .pgn-eyebrow {
    font-size: 11px;
    font-weight: 600;
    color: var(--pgn-brand);
    text-transform: uppercase;
    letter-spacing: 0.28em;
    margin-bottom: 20px;
    display: block;
  }
  .pgn-story h2 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(36px, 4.5vw, 56px);
    font-weight: 700;
    color: var(--pgn-deep);
    margin: 0 0 32px;
    letter-spacing: -0.02em;
    line-height: 1.08;
  }
  .pgn-story h2 em {
    font-style: italic;
    font-weight: 500;
    color: var(--pgn-brand);
  }
  .pgn-story-lead {
    font-size: 19px;
    line-height: 1.65;
    color: var(--pgn-ink);
    margin: 0 0 20px;
    font-weight: 400;
  }
  .pgn-story-lead::first-letter {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 92px;
    font-weight: 600;
    color: var(--pgn-brand);
    float: left;
    line-height: 0.85;
    margin: 8px 14px 0 0;
  }
  .pgn-story-badges {
    display: flex;
    gap: 12px;
    margin-top: 32px;
    flex-wrap: wrap;
  }
  .pgn-story-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: var(--pgn-cream);
    border: 1px solid var(--pgn-hairline);
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    color: var(--pgn-deep);
    letter-spacing: 0.04em;
  }
  .pgn-story-badge svg { width: 14px; height: 14px; stroke: var(--pgn-brand); fill: none; stroke-width: 1.8; }
  .pgn-story-visual {
    position: relative;
    aspect-ratio: 4/5;
    border-radius: 12px;
    overflow: hidden;
    background:
      linear-gradient(180deg, rgba(15,61,34,0.15), rgba(15,61,34,0.45)),
      url('https://images.unsplash.com/photo-1597305877032-0668b3c6413a?auto=format&fit=crop&w=900&q=70') center/cover no-repeat;
  }
  .pgn-story-seal {
    position: absolute;
    bottom: -28px;
    right: -28px;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: var(--pgn-lime);
    color: var(--pgn-deep);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-family: 'Fraunces', Georgia, serif;
    font-style: italic;
    font-weight: 500;
    font-size: 18px;
    line-height: 1.15;
    transform: rotate(-8deg);
    box-shadow: 0 12px 28px rgba(15,61,34,0.18);
  }
  .pgn-story-seal strong {
    font-weight: 700;
    font-size: 26px;
    display: block;
    font-style: normal;
  }
  @media (max-width: 900px) {
    .pgn-story-grid { grid-template-columns: 1fr; gap: 48px; }
    .pgn-story-visual { aspect-ratio: 4/3; max-width: 500px; margin: 0 auto; }
  }

  /* =========== LINEA ANDINA =========== */
  .pgn-andina {
    padding: 100px 24px;
    background: var(--pgn-cream);
    position: relative;
  }
  .pgn-andina-inner {
    max-width: 1180px;
    margin: 0 auto;
  }
  .pgn-andina-header {
    text-align: center;
    margin-bottom: 64px;
  }
  .pgn-andina-header h2 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(34px, 4vw, 52px);
    font-weight: 700;
    color: var(--pgn-deep);
    margin: 12px 0 18px;
    letter-spacing: -0.02em;
    line-height: 1.08;
  }
  .pgn-andina-header h2 em {
    font-style: italic;
    font-weight: 500;
    color: var(--pgn-brand);
  }
  .pgn-andina-header p {
    color: var(--pgn-muted);
    max-width: 560px;
    margin: 0 auto;
    font-size: 16px;
    line-height: 1.65;
  }
  .pgn-andina-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
  .pgn-andina-card {
    text-align: center;
    padding: 32px 24px;
    background: #fff;
    border: 1px solid var(--pgn-hairline);
    border-radius: 8px;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .pgn-andina-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 36px rgba(15,61,34,0.08);
  }
  .pgn-andina-illu {
    width: 88px;
    height: 88px;
    margin: 0 auto 20px;
    color: var(--pgn-brand);
  }
  .pgn-andina-illu svg { width: 100%; height: 100%; fill: none; stroke: currentColor; stroke-width: 1.4; }
  .pgn-andina-card h3 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--pgn-deep);
    margin: 0 0 4px;
  }
  .pgn-andina-card .pgn-andina-lat {
    font-family: 'Fraunces', Georgia, serif;
    font-style: italic;
    font-weight: 300;
    color: var(--pgn-muted);
    font-size: 14px;
    margin-bottom: 16px;
    display: block;
  }
  .pgn-andina-card p {
    color: var(--pgn-ink);
    font-size: 14px;
    line-height: 1.55;
    margin: 0;
  }
  @media (max-width: 768px) {
    .pgn-andina-grid { grid-template-columns: 1fr; gap: 20px; }
  }

  /* =========== PRODUCTOS =========== */
  .pgn-products-section {
    background:
      linear-gradient(180deg, #fafdf9 0%, var(--pgn-cream) 100%);
    padding: 100px 24px;
    position: relative;
  }
  .pgn-products-section::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><path d='M40 12c-8 8-8 22 0 30 8-8 8-22 0-30z' fill='%231d6e3d' opacity='0.5'/></svg>");
    opacity: 0.04;
    pointer-events: none;
  }
  .pgn-products-inner {
    max-width: 1280px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
  }
  .pgn-products-header {
    text-align: center;
    margin-bottom: 56px;
  }
  .pgn-products-header h2 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(36px, 4.5vw, 56px);
    font-weight: 700;
    color: var(--pgn-deep);
    margin: 12px 0 18px;
    letter-spacing: -0.02em;
    line-height: 1.08;
  }
  .pgn-products-header h2 em {
    font-style: italic;
    font-weight: 500;
    color: var(--pgn-brand);
  }
  .pgn-products-header p {
    font-size: 16px;
    color: var(--pgn-muted);
    max-width: 560px;
    margin: 0 auto;
    line-height: 1.6;
  }
  .pgn-products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 18px;
  }
  .pgn-product-card {
    background: #fff;
    border-radius: 14px;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    border: 1px solid var(--pgn-hairline);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
  }
  .pgn-product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 34px rgba(15,61,34,0.12);
    border-color: var(--pgn-light);
  }
  .pgn-product-img {
    aspect-ratio: 1 / 1;
    background: var(--pgn-cream);
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
    padding: 16px 14px 18px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 8px;
  }
  .pgn-product-name {
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.4;
    color: var(--pgn-deep);
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 36px;
  }
  .pgn-product-price-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
    flex-wrap: wrap;
  }
  .pgn-product-price {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--pgn-deep);
    line-height: 1;
    letter-spacing: -0.01em;
  }
  .pgn-product-price-old {
    font-size: 12px;
    color: #9aa3b4;
    text-decoration: line-through;
  }
  .pgn-product-discount {
    background: #E8341A;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .pgn-product-efectivo {
    background: var(--pgn-lime);
    color: var(--pgn-deep);
    font-size: 11px;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 6px;
    display: inline-block;
    margin-top: 4px;
    letter-spacing: 0.02em;
  }
  .pgn-product-cta {
    background: var(--pgn-brand);
    color: #fff;
    text-align: center;
    padding: 11px 0;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-top: 10px;
    transition: background 0.18s;
  }
  .pgn-product-card:hover .pgn-product-cta {
    background: var(--pgn-deep);
  }
  .pgn-product-no-stock {
    background: #e8ebf0;
    color: var(--pgn-muted);
    text-align: center;
    padding: 11px 0;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    margin-top: 10px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  /* =========== VALUES =========== */
  .pgn-values {
    padding: 100px 24px;
    background: #fff;
  }
  .pgn-values-inner {
    max-width: 1180px;
    margin: 0 auto;
  }
  .pgn-values-header {
    text-align: center;
    margin-bottom: 56px;
  }
  .pgn-values-header h2 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(34px, 4vw, 48px);
    font-weight: 700;
    color: var(--pgn-deep);
    margin: 12px 0 0;
    letter-spacing: -0.02em;
    line-height: 1.08;
  }
  .pgn-values-header h2 em {
    font-style: italic;
    font-weight: 500;
    color: var(--pgn-brand);
  }
  .pgn-values-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    border-top: 1px solid var(--pgn-hairline);
    border-bottom: 1px solid var(--pgn-hairline);
  }
  .pgn-value {
    text-align: center;
    padding: 44px 24px;
    border-right: 1px solid var(--pgn-hairline);
  }
  .pgn-value:last-child { border-right: none; }
  .pgn-value-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 22px;
    background: var(--pgn-cream);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--pgn-brand);
  }
  .pgn-value-icon svg { width: 36px; height: 36px; fill: none; stroke: currentColor; stroke-width: 1.5; }
  .pgn-value h3 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--pgn-deep);
    margin: 0 0 10px;
    line-height: 1.3;
  }
  .pgn-value p {
    font-size: 14px;
    color: var(--pgn-muted);
    line-height: 1.55;
    margin: 0;
  }
  @media (max-width: 900px) {
    .pgn-values-grid { grid-template-columns: repeat(2, 1fr); }
    .pgn-value:nth-child(2) { border-right: none; }
    .pgn-value:nth-child(1), .pgn-value:nth-child(2) { border-bottom: 1px solid var(--pgn-hairline); }
  }
  @media (max-width: 560px) {
    .pgn-values-grid { grid-template-columns: 1fr; }
    .pgn-value { border-right: none; border-bottom: 1px solid var(--pgn-hairline); }
    .pgn-value:last-child { border-bottom: none; }
  }

  /* =========== CERTIFICACIONES =========== */
  .pgn-certs {
    padding: 80px 24px;
    background: var(--pgn-cream);
    text-align: center;
  }
  .pgn-certs-inner { max-width: 1100px; margin: 0 auto; }
  .pgn-certs-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 32px;
    align-items: center;
    margin-top: 40px;
  }
  .pgn-cert {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    opacity: 0.6;
    transition: opacity 0.25s ease;
    color: var(--pgn-deep);
  }
  .pgn-cert:hover { opacity: 1; }
  .pgn-cert svg { width: 44px; height: 44px; fill: none; stroke: currentColor; stroke-width: 1.4; }
  .pgn-cert span {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--pgn-muted);
  }
  @media (max-width: 768px) {
    .pgn-certs-grid { grid-template-columns: repeat(3, 1fr); gap: 24px; }
  }

  /* =========== TESTIMONIOS =========== */
  .pgn-testi {
    padding: 100px 24px;
    background: #fff;
  }
  .pgn-testi-inner { max-width: 1180px; margin: 0 auto; }
  .pgn-testi-header {
    text-align: center;
    margin-bottom: 56px;
  }
  .pgn-testi-header h2 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(34px, 4vw, 48px);
    font-weight: 700;
    color: var(--pgn-deep);
    margin: 12px 0 0;
    letter-spacing: -0.02em;
    line-height: 1.08;
  }
  .pgn-testi-header h2 em {
    font-style: italic;
    font-weight: 500;
    color: var(--pgn-brand);
  }
  .pgn-testi-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
  }
  .pgn-testi-card {
    background: var(--pgn-cream);
    padding: 36px 28px;
    border-radius: 12px;
    border: 1px solid var(--pgn-hairline);
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .pgn-testi-stars {
    color: #e8b339;
    font-size: 16px;
    letter-spacing: 2px;
  }
  .pgn-testi-quote {
    font-family: 'Fraunces', Georgia, serif;
    font-style: italic;
    font-weight: 300;
    font-size: 19px;
    line-height: 1.5;
    color: var(--pgn-deep);
    margin: 0;
  }
  .pgn-testi-author {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid var(--pgn-hairline);
  }
  .pgn-testi-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--pgn-brand);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
  }
  .pgn-testi-meta strong {
    display: block;
    font-size: 14px;
    color: var(--pgn-deep);
    font-weight: 600;
  }
  .pgn-testi-meta span {
    font-size: 12px;
    color: var(--pgn-muted);
  }
  @media (max-width: 900px) {
    .pgn-testi-grid { grid-template-columns: 1fr; }
  }

  /* =========== CIERRE EMOCIONAL =========== */
  .pgn-cierre {
    padding: 140px 24px;
    background:
      linear-gradient(180deg, rgba(15,61,34,0.72) 0%, rgba(15,61,34,0.82) 100%),
      url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=70') center/cover no-repeat;
    text-align: center;
    color: #fff;
    position: relative;
  }
  .pgn-cierre-inner { max-width: 880px; margin: 0 auto; position: relative; z-index: 2; }
  .pgn-cierre h2 {
    font-family: 'Fraunces', Georgia, serif;
    font-style: italic;
    font-weight: 300;
    font-size: clamp(40px, 6vw, 72px);
    line-height: 1.1;
    margin: 0 0 28px;
    letter-spacing: -0.01em;
    color: #fff;
  }
  .pgn-cierre-sign {
    font-family: 'Fraunces', Georgia, serif;
    font-weight: 600;
    font-size: 18px;
    color: #c4e85f;
    letter-spacing: 0.04em;
    margin: 0 0 8px;
  }
  .pgn-cierre-links {
    margin-top: 24px;
    display: flex;
    justify-content: center;
    gap: 24px;
    font-size: 12px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  .pgn-cierre-links a {
    color: rgba(255,255,255,0.7);
    text-decoration: none;
    transition: color 0.2s;
  }
  .pgn-cierre-links a:hover { color: #c4e85f; }
</style>

<div class="pgn-page">

  {# =========== HERO =========== #}
  <section class="pgn-hero">
    <div class="pgn-hero-inner">
      <span class="pgn-hero-eyebrow">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C7 7 7 14 12 22c5-8 5-15 0-20z"/><path d="M12 7v15"/></svg>
        L&iacute;deres en bienestar natural
      </span>
      <h1>Volv&eacute; a lo <em>natural</em><br/>con PGN</h1>
      <p>Suplementos dietarios elaborados con extractos herbales puros. M&aacute;s de 30 a&ntilde;os cuidando tu salud desde adentro.</p>
      <a href="#productos-pgn" class="pgn-hero-cta">
        Ver el cat&aacute;logo
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
      <div class="pgn-hero-trust">
        <span>
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/></svg>
          Habilitado por ANMAT
        </span>
        <span>
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          M&aacute;s de 30 a&ntilde;os
        </span>
        <span>
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18M3 6h18M3 18h18"/><path d="M12 3l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" opacity=".5"/></svg>
          Hecho en Argentina
        </span>
      </div>
    </div>
  </section>

  {# =========== PRODUCT LOOKUP CHAIN =========== #}
  {# 1) categories[handle=marcas][handle=pgn].products  2) sections.pgn.products  3) static #}
  {%- set pgn_category = null -%}
  {%- if categories -%}
    {%- for top_cat in categories -%}
      {%- if top_cat.handle == 'marcas' -%}
        {%- for sub in top_cat.subcategories -%}
          {%- if sub.handle == 'pgn' -%}
            {%- set pgn_category = sub -%}
          {%- endif -%}
        {%- endfor -%}
      {%- endif -%}
    {%- endfor -%}
  {%- endif -%}

  {%- set pgn_products = [] -%}
  {%- if pgn_category and pgn_category.products -%}
    {%- set pgn_products = pgn_category.products -%}
  {%- elseif sections and attribute(sections, 'pgn') is defined and attribute(sections, 'pgn').products -%}
    {%- set pgn_products = attribute(sections, 'pgn').products -%}
  {%- endif -%}

  {%- set pgn_total = pgn_products | length -%}

  {# =========== STATS BAR =========== #}
  <div class="pgn-stats">
    <div class="pgn-stat">
      <div class="pgn-stat-icon">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C7 7 7 14 12 22c5-8 5-15 0-20z"/><path d="M12 8v14"/></svg>
      </div>
      <div class="pgn-stat-num">{{ pgn_total > 0 ? pgn_total : '62' }}+</div>
      <div class="pgn-stat-label">Productos disponibles</div>
    </div>
    <div class="pgn-stat">
      <div class="pgn-stat-icon">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h12"/><path d="M6 22h12"/><path d="M6 2c0 6 12 6 12 10s-12 4-12 10"/></svg>
      </div>
      <div class="pgn-stat-num">30+</div>
      <div class="pgn-stat-label">A&ntilde;os de experiencia</div>
    </div>
    <div class="pgn-stat">
      <div class="pgn-stat-icon">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c-4 6-6 10-6 13a6 6 0 0 0 12 0c0-3-2-7-6-13z"/></svg>
      </div>
      <div class="pgn-stat-num">100%</div>
      <div class="pgn-stat-label">Origen natural</div>
    </div>
    <div class="pgn-stat">
      <div class="pgn-stat-icon">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9 12 2"/></svg>
      </div>
      <div class="pgn-stat-num">4.8</div>
      <div class="pgn-stat-label">Rating clientes</div>
    </div>
  </div>

  {# =========== STORY (asimetrico 60/40) =========== #}
  <section class="pgn-story">
    <div class="pgn-story-grid">
      <div class="pgn-story-copy">
        <span class="pgn-eyebrow">Sobre PGN</span>
        <h2>Lo que la tierra te da, <em>nosotros lo concentramos</em>.</h2>
        <p class="pgn-story-lead">PGN es un laboratorio argentino l&iacute;der en suplementos dietarios a base de hierbas naturales y extractos herbales. Cada f&oacute;rmula est&aacute; pensada para acompa&ntilde;arte: desde la l&iacute;nea Andina con plantas medicinales tradicionales hasta nuestros suplementos premium con c&uacute;rcuma, espirulina y col&aacute;geno.</p>
        <div class="pgn-story-badges">
          <span class="pgn-story-badge">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
            ANMAT
          </span>
          <span class="pgn-story-badge">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C7 7 7 14 12 22c5-8 5-15 0-20z"/></svg>
            Vegano
          </span>
          <span class="pgn-story-badge">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="5" y1="5" x2="19" y2="19"/></svg>
            Sin TACC
          </span>
        </div>
      </div>
      <div class="pgn-story-visual">
        <div class="pgn-story-seal">
          Desde
          <strong>1992</strong>
        </div>
      </div>
    </div>
  </section>

  {# =========== LINEA ANDINA =========== #}
  <section class="pgn-andina">
    <div class="pgn-andina-inner">
      <div class="pgn-andina-header">
        <span class="pgn-eyebrow">L&iacute;nea Andina</span>
        <h2>La sabidur&iacute;a de los Andes, <em>en c&aacute;psulas</em>.</h2>
        <p>Plantas medicinales tradicionales seleccionadas y procesadas para conservar todas sus propiedades activas.</p>
      </div>
      <div class="pgn-andina-grid">
        <div class="pgn-andina-card">
          <div class="pgn-andina-illu">
            <svg viewBox="0 0 88 88" stroke-linecap="round" stroke-linejoin="round"><circle cx="44" cy="44" r="14"/><path d="M44 30c-8-8-20-6-22 0 6 6 14 8 22 0z"/><path d="M44 30c8-8 20-6 22 0-6 6-14 8-22 0z"/><path d="M44 58c-8 8-20 6-22 0 6-6 14-8 22 0z"/><path d="M44 58c8 8 20 6 22 0-6-6-14-8-22 0z"/></svg>
          </div>
          <h3>Pasiflora</h3>
          <span class="pgn-andina-lat">Passiflora incarnata</span>
          <p>Ayuda a conciliar el sue&ntilde;o y a reducir la ansiedad cotidiana de forma natural.</p>
        </div>
        <div class="pgn-andina-card">
          <div class="pgn-andina-illu">
            <svg viewBox="0 0 88 88" stroke-linecap="round" stroke-linejoin="round"><path d="M44 16c-10 10-10 26 0 40 10-14 10-30 0-40z"/><path d="M44 24v40"/><path d="M30 40h28"/></svg>
          </div>
          <h3>Boldo</h3>
          <span class="pgn-andina-lat">Peumus boldus</span>
          <p>Apoya la funci&oacute;n hep&aacute;tica y la digesti&oacute;n despu&eacute;s de las comidas.</p>
        </div>
        <div class="pgn-andina-card">
          <div class="pgn-andina-illu">
            <svg viewBox="0 0 88 88" stroke-linecap="round" stroke-linejoin="round"><path d="M44 14v60"/><path d="M44 22c-8 0-14 4-14 10"/><path d="M44 34c-10 0-18 4-18 10"/><path d="M44 46c-12 0-22 4-22 10"/><path d="M44 58c-14 0-26 4-26 10"/><path d="M44 22c8 0 14 4 14 10"/><path d="M44 34c10 0 18 4 18 10"/><path d="M44 46c12 0 22 4 22 10"/><path d="M44 58c14 0 26 4 26 10"/></svg>
          </div>
          <h3>Cola de Caballo</h3>
          <span class="pgn-andina-lat">Equisetum arvense</span>
          <p>Diur&eacute;tico natural rico en silicio. Acompa&ntilde;a procesos de depuraci&oacute;n.</p>
        </div>
      </div>
    </div>
  </section>

  {# =========== PRODUCTOS =========== #}
  <section class="pgn-products-section" id="productos-pgn">
    <div class="pgn-products-inner">
      <div class="pgn-products-header">
        <span class="pgn-eyebrow">Cat&aacute;logo completo</span>
        <h2>Productos <em>PGN</em></h2>
        <p>{{ pgn_total > 0 ? pgn_total : '62' }} suplementos PGN disponibles ahora en Morashop. Env&iacute;o a todo el pa&iacute;s.</p>
      </div>

      {% if pgn_products | length > 0 %}
      <div class="pgn-products-grid">
        {% for product in pgn_products %}
          {% set product_available = (product.available is defined) ? product.available : (product.stock|default(0) > 0) %}
          {% set has_discount = (product.compare_at_price is defined and product.compare_at_price > product.price) %}
          {% set discount_pct = has_discount ? ((product.compare_at_price - product.price) / product.compare_at_price * 100) | round : 0 %}
          {% set precio_efectivo = (product.price * 0.85) | round %}
          <a href="{{ product.url }}" class="pgn-product-card">
            <div class="pgn-product-img">
              <img src="{{ product.featured_image | product_image_url('medium') }}" alt="{{ product.name }}" loading="lazy" />
            </div>
            <div class="pgn-product-info">
              <h3 class="pgn-product-name">{{ product.name }}</h3>
              <div class="pgn-product-price-row">
                <span class="pgn-product-price">{{ product.price | money }}</span>
                {% if has_discount %}
                  <span class="pgn-product-price-old">{{ product.compare_at_price | money }}</span>
                  <span class="pgn-product-discount">-{{ discount_pct }}%</span>
                {% endif %}
              </div>
              <span class="pgn-product-efectivo">{{ precio_efectivo | money }} en efectivo</span>
              {% if product_available %}
                <div class="pgn-product-cta">Ver producto</div>
              {% else %}
                <div class="pgn-product-no-stock">Sin stock</div>
              {% endif %}
            </div>
          </a>
        {% endfor %}
      </div>
      {% else %}
        <p style="text-align:center; color:#6b7864; padding:40px;">
          No se encontraron productos. Verificar que exista la categor&iacute;a <strong>"Pgn"</strong> bajo <strong>"Marcas"</strong> en el admin de Tiendanube, o cargar productos en la colecci&oacute;n <strong>pgn</strong>.
        </p>
      {% endif %}
    </div>
  </section>

  {# =========== VALUES =========== #}
  <section class="pgn-values">
    <div class="pgn-values-inner">
      <div class="pgn-values-header">
        <span class="pgn-eyebrow">Lo que nos hace PGN</span>
        <h2>Cuatro cosas <em>innegociables</em>.</h2>
      </div>
      <div class="pgn-values-grid">
        <div class="pgn-value">
          <div class="pgn-value-icon">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C7 7 7 14 12 22c5-8 5-15 0-20z"/><path d="M12 8v14"/></svg>
          </div>
          <h3>100% natural, sin atajos</h3>
          <p>Extractos herbales puros, sin qu&iacute;micos agregados ni conservantes artificiales.</p>
        </div>
        <div class="pgn-value">
          <div class="pgn-value-icon">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
          </div>
          <h3>Cada lote, certificado</h3>
          <p>Laboratorio habilitado por ANMAT. Cada lote testeado y certificado.</p>
        </div>
        <div class="pgn-value">
          <div class="pgn-value-icon">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="14" height="10" rx="1"/><path d="M16 10h4l2 3v4h-6z"/><circle cx="6" cy="19" r="2"/><circle cx="19" cy="19" r="2"/></svg>
          </div>
          <h3>En tu casa en 24hs</h3>
          <p>Despachamos en 24hs. Env&iacute;o gratis CABA/GBA en compras superiores a $70.000.</p>
        </div>
        <div class="pgn-value">
          <div class="pgn-value-icon">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-8 8-14a8 8 0 1 0-16 0c0 6 8 14 8 14z"/><circle cx="12" cy="8" r="3"/></svg>
          </div>
          <h3>Hecho en Argentina</h3>
          <p>Laboratorio argentino con producci&oacute;n local desde 1992.</p>
        </div>
      </div>
    </div>
  </section>

  {# =========== CERTIFICACIONES =========== #}
  <section class="pgn-certs">
    <div class="pgn-certs-inner">
      <span class="pgn-eyebrow">Respaldados por</span>
      <div class="pgn-certs-grid">
        <div class="pgn-cert">
          <svg viewBox="0 0 44 44" stroke-linecap="round" stroke-linejoin="round"><circle cx="22" cy="22" r="18"/><path d="M14 22l6 6 12-12"/></svg>
          <span>ANMAT</span>
        </div>
        <div class="pgn-cert">
          <svg viewBox="0 0 44 44" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="28" height="28" rx="3"/><path d="M14 22h16"/><path d="M22 14v16"/></svg>
          <span>GMP</span>
        </div>
        <div class="pgn-cert">
          <svg viewBox="0 0 44 44" stroke-linecap="round" stroke-linejoin="round"><path d="M22 6L8 14v10c0 8 6 12 14 14 8-2 14-6 14-14V14z"/></svg>
          <span>INAL</span>
        </div>
        <div class="pgn-cert">
          <svg viewBox="0 0 44 44" stroke-linecap="round" stroke-linejoin="round"><path d="M22 8c-6 6-6 16 0 26 6-10 6-20 0-26z"/><path d="M22 16v18"/></svg>
          <span>Vegano</span>
        </div>
        <div class="pgn-cert">
          <svg viewBox="0 0 44 44" stroke-linecap="round" stroke-linejoin="round"><circle cx="22" cy="22" r="16"/><line x1="10" y1="10" x2="34" y2="34"/></svg>
          <span>Sin TACC</span>
        </div>
        <div class="pgn-cert">
          <svg viewBox="0 0 44 44" stroke-linecap="round" stroke-linejoin="round"><circle cx="22" cy="22" r="6"/><path d="M22 4v6"/><path d="M22 34v6"/><path d="M4 22h6"/><path d="M34 22h6"/></svg>
          <span>Cruelty-free</span>
        </div>
      </div>
    </div>
  </section>

  {# =========== TESTIMONIOS =========== #}
  <section class="pgn-testi">
    <div class="pgn-testi-inner">
      <div class="pgn-testi-header">
        <span class="pgn-eyebrow">Qui&eacute;nes ya volvieron a lo natural</span>
        <h2>Lo que <em>cuentan</em> nuestros clientes.</h2>
      </div>
      <div class="pgn-testi-grid">
        <div class="pgn-testi-card">
          <div class="pgn-testi-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
          <p class="pgn-testi-quote">&laquo;Empec&eacute; con la Pasiflora hace dos meses y duermo mucho mejor. No volv&iacute; a tomar nada de farmacia.&raquo;</p>
          <div class="pgn-testi-author">
            <div class="pgn-testi-avatar">MR</div>
            <div class="pgn-testi-meta">
              <strong>Mar&iacute;a R.</strong>
              <span>CABA &middot; Compr&oacute; Pasiflora</span>
            </div>
          </div>
        </div>
        <div class="pgn-testi-card">
          <div class="pgn-testi-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
          <p class="pgn-testi-quote">&laquo;La c&uacute;rcuma de PGN tiene una calidad que se nota. La pido cada mes y la atenci&oacute;n de Morashop es impecable.&raquo;</p>
          <div class="pgn-testi-author">
            <div class="pgn-testi-avatar">JL</div>
            <div class="pgn-testi-meta">
              <strong>Juan L.</strong>
              <span>C&oacute;rdoba &middot; Compr&oacute; C&uacute;rcuma</span>
            </div>
          </div>
        </div>
        <div class="pgn-testi-card">
          <div class="pgn-testi-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
          <p class="pgn-testi-quote">&laquo;Confianza absoluta en la marca. Llevo a&ntilde;os usando sus productos y siempre cumplen lo que prometen.&raquo;</p>
          <div class="pgn-testi-author">
            <div class="pgn-testi-avatar">VS</div>
            <div class="pgn-testi-meta">
              <strong>Valeria S.</strong>
              <span>Rosario &middot; Compr&oacute; Col&aacute;geno</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {# =========== CIERRE EMOCIONAL =========== #}
  <section class="pgn-cierre">
    <div class="pgn-cierre-inner">
      <h2>Volv&eacute; a lo natural.</h2>
      <p class="pgn-cierre-sign">PGN, desde 1992.</p>
      <div class="pgn-cierre-links">
        <a href="https://www.pgnsa.com.ar" target="_blank" rel="noopener">pgnsa.com.ar</a>
        <a href="#productos-pgn">Ver productos</a>
      </div>
    </div>
  </section>

</div>
