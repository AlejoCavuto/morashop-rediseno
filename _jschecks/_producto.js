
(function () {
  const root = document.getElementById('pdpRoot');
  const stickyEl = document.getElementById('pdpSticky');
  const params = new URLSearchParams(window.location.search);

  // Helpers
  function slug(s) {
    return String(s).toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  function parsePrecio(s) {
    // "$ 13.965" -> 13965
    return parseInt(String(s).replace(/[^\d]/g, ''), 10) || 0;
  }
  // Adaptador: convierte un producto del catalogo REAL (catalog-data.js) al formato
  // que espera el resto de la PDP (catalog.js demo).
  function adaptarProductoReal(p, cat) {
    if (!p) return null;
    const CAT_LABEL = {
      suplementos:  'Suplementos',
      supermercado: 'Supermercado',
      electro:      'Electro-Hogar',
      bananero:     'El Bananero',
    };
    return {
      id: slug(p.brand + '-' + p.name),
      brand: p.brand || 'Morashop',
      name: p.name,
      img: p.img,
      price:    parsePrecio(p.price),
      oldPrice: p.was ? parsePrecio(p.was) : 0,
      tag: p.tag || '',
      tagKind: p.tagType || '',
      category: CAT_LABEL[cat] || '',
      desc: 'Producto original. Distribuidor autorizado.',  // descripcion default mientras no haya texto real por producto
      flavors: [],
      related: [],
    };
  }

  // Todos los links del sitio entran con ?cat=X&pid=Y -> buscamos en el catalogo real.
  const cat = params.get('cat');
  const pid = params.get('pid');

  let product = null;
  if (cat && pid && window.CATALOG_BY_CAT && window.CATALOG_BY_CAT[cat]) {
    const found = window.CATALOG_BY_CAT[cat].find(p => slug(p.brand + '-' + p.name) === pid);
    product = adaptarProductoReal(found, cat);
  }

  if (!product) {
    root.innerHTML = `
      <section class="pdp-error">
        <div class="container">
          <h1>Producto no encontrado</h1>
          <p>El producto que buscás no existe o fue retirado del catálogo.</p>
          <a href="suplementos.html">Ver catálogo →</a>
        </div>
      </section>`;
    document.title = 'Producto no encontrado · Morashop';
    return;
  }

  document.title = `${product.name} · Morashop`;

  const fmt = window.CATALOG_API.formatARS;
  const hasFlavors = Array.isArray(product.flavors) && product.flavors.length > 1;
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  // ----- Datos fake seedeados (UNIFICADO con cards: ((brand+name).toLowerCase()) -----
  function seedFromProduct(p) {
    const s = ((p.brand || '') + (p.name || '')).toLowerCase();
    let h = 0;
    for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h = h & h; }
    return Math.abs(h);
  }
  const seed       = seedFromProduct(product);
  const vendidosNum = (seed % 1500) + 50;                         // 50–1549 (igual que cards)
  const vendidos    = vendidosNum;                                // alias para compat
  const rating      = (4 + (seed % 100) / 100).toFixed(1);        // 4.00–4.99 (igual que cards)
  const opiniones   = Math.max(3, Math.floor(vendidosNum * 0.15));// 15% de vendidos (igual que cards)
  const stock       = (seed % 30) + 3;                            // 3–32 (igual que cards)
  const stockLow    = stock <= 5;
  const catParts = (product.category || '').split('>').map(s => s.trim());
  const catLink = catParts[0] && catParts[0].toLowerCase().startsWith('suplem') ? 'suplementos.html'
    : catParts[0] && catParts[0].toLowerCase().startsWith('super') ? 'supermercado.html'
    : catParts[0] && catParts[0].toLowerCase().startsWith('electro') ? 'electro.html'
    : 'suplementos.html';

  root.innerHTML = `
    <div class="container">
      <nav class="pdp-crumb" aria-label="Breadcrumb">
        <a href="index.html">Inicio</a><span class="sep">/</span>
        <a href="${catLink}">${catParts[0] || 'Catálogo'}</a><span class="sep">/</span>
        <span>${product.name}</span>
      </nav>
    </div>

    <section class="pdp">
      <div class="container">
        <div class="pdp-grid">
          <!-- GALLERY -->
          <div class="pdp-gallery">
            <div class="pdp-photo">
              ${product.tag ? `<span class="pdp-tag ${product.tagKind || ''}">${product.tag}</span>` : ''}
              <img src="${product.img}" alt="${product.name}" />
            </div>
          </div>

          <!-- INFO -->
          <div class="pdp-info">
            <div class="pdp-brand">${product.brand}</div>
            <h1 class="pdp-name">${product.name}</h1>

            <div class="pdp-price-row">
              ${product.oldPrice && product.oldPrice > product.price ? `<div class="pdp-oldprice">${fmt(product.oldPrice)}</div>` : ''}
              <div class="pdp-price" id="pdpPrice">${fmt(product.price)}</div>
              ${discount >= 5 ? `<div class="pdp-discount">${discount}% OFF</div>` : ''}
            </div>

            <div class="pdp-cuotas">3 cuotas sin interés de <strong>${fmt(Math.round(product.price/3))}</strong></div>

            <div class="pdp-efectivo">
              <span class="pdp-efectivo-main"><strong>${fmt(product.price * 0.85)}</strong> en efectivo</span>
              <span class="pdp-efectivo-tag">15% OFF</span>
              <button class="pdp-efectivo-info" type="button" aria-label="Más info" title="Contraentrega CABA/GBA (15% OFF) o transferencia (5% OFF)">?</button>
            </div>

            <div class="pdp-social" aria-label="Información de stock y reseñas">
              <div class="pdp-social-line">
                <span>+${vendidos} vendidos</span>
                <span class="dot">·</span>
                <span class="star">★</span>
                <span class="rating-num">${rating}</span>
                <span>(${opiniones} opiniones)</span>
              </div>
              <div class="pdp-stock">
                <span class="dot" aria-hidden="true"></span>
                Stock disponible
              </div>
            </div>

            ${hasFlavors ? `
              <div class="pdp-section">
                <div class="pdp-section-label">Sabor: <span class="picked" id="flavorPicked">${product.flavors[0]}</span></div>
                <div class="pdp-flavors" id="pdpFlavors">
                  ${product.flavors.map((f,i) => `<button class="flavor-btn ${i===0?'active':''}" data-flavor="${f}" type="button">${f}</button>`).join('')}
                </div>
              </div>
            ` : ''}

            <div class="pdp-section">
              <div class="pdp-section-label">Cantidad</div>
              <div class="pdp-buy">
                <div class="qty-stepper" aria-label="Selector de cantidad">
                  <button type="button" id="qtyMinus" aria-label="Restar">−</button>
                  <span id="qtyVal">1</span>
                  <button type="button" id="qtyPlus" aria-label="Sumar">+</button>
                </div>
                <button class="add-btn" id="pdpAddBtn" type="button">
                  <svg class="cart-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
                  Agregar
                </button>
              </div>
            </div>

            <div class="pdp-perks">
              <div class="pdp-perk">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 5v3h-7zM6 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>
                <span><strong>Envío hoy</strong> en GBA y CABA para pedidos antes de las 10 hs</span>
              </div>
              <div class="pdp-perk">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>
                <span><strong>Producto original</strong> · distribuidor autorizado</span>
              </div>
              <div class="pdp-perk">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                <span><strong>Bot rápido + asesor</strong> por WhatsApp</span>
              </div>
            </div>
          </div>
        </div>

        <!-- TABS -->
        <div class="pdp-tabs">
          <div class="tab-nav" role="tablist">
            <button class="tab-btn active" data-tab="desc" type="button">Descripción</button>
            <button class="tab-btn" data-tab="ship" type="button">Envíos y devoluciones</button>
          </div>
          <div class="tab-panel active" data-panel="desc">
            <p>${product.desc || 'Sin descripción disponible.'}</p>
          </div>
          <div class="tab-panel" data-panel="ship">
            <p><strong>Envío en el día:</strong> pedidos confirmados antes de las 10 hs en GBA y CABA salen el mismo día.</p>
            <p><strong>Resto del país:</strong> OCA y Andreani, 24–72 hs hábiles según destino.</p>
            <p><strong>Devoluciones:</strong> 7 días corridos desde la recepción para productos sin abrir. Coordinamos por WhatsApp.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- RELATED (siempre se renderiza; el JS llena la grilla con productos del mismo type/brand) -->
    <section class="related" id="relatedSection" style="display:none">
      <div class="container">
        <div class="related-head">
          <span class="overline"></span>
          <h2>Productos<br/>relacionados.</h2>
        </div>
        <div class="related-grid" id="relatedGrid"></div>
      </div>
    </section>
  `;

  // ----- State -----
  let qty = 1;
  let chosenFlavor = hasFlavors ? product.flavors[0] : null;

  // Qty stepper (sincroniza con sticky)
  const qtyVal     = document.getElementById('qtyVal');
  const stickyQty  = document.getElementById('stickyQty');
  function syncQty() {
    qtyVal.textContent = qty;
    if (stickyQty) stickyQty.textContent = qty;
  }
  document.getElementById('qtyMinus').addEventListener('click', () => {
    if (qty > 1) { qty--; syncQty(); }
  });
  document.getElementById('qtyPlus').addEventListener('click', () => {
    qty++; syncQty();
  });

  // Flavors
  if (hasFlavors) {
    document.getElementById('pdpFlavors').addEventListener('click', e => {
      const btn = e.target.closest('.flavor-btn');
      if (!btn) return;
      document.querySelectorAll('.flavor-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      chosenFlavor = btn.dataset.flavor;
      document.getElementById('flavorPicked').textContent = chosenFlavor;
    });
  }

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.querySelector(`.tab-panel[data-panel="${btn.dataset.tab}"]`).classList.add('active');
    });
  });

  // Add to cart (compartido entre desktop y sticky mobile)
  function addToCart() {
    if (!window.Cart) return;
    const variantId = chosenFlavor ? `${product.id}--${chosenFlavor.toLowerCase().replace(/[^a-z0-9]+/g,'-')}` : product.id;
    const displayName = chosenFlavor ? `${product.name} · ${chosenFlavor}` : product.name;
    window.Cart.add({
      id: variantId,
      brand: product.brand,
      name: displayName,
      price: product.price,
      img: product.img,
      cat: cat || ''
    }, qty);
  }
  document.getElementById('pdpAddBtn').addEventListener('click', () => {
    addToCart();
    const b = document.getElementById('pdpAddBtn');
    const orig = b.innerHTML;
    b.innerHTML = 'Agregado ✓';
    setTimeout(() => { b.innerHTML = orig; }, 1400);
  });

  // Sticky mobile: solo botón "Agregar al carrito" + badge cantidad (sin precio)
  // Sticky mobile = "Agregar (N)" — usa qty actual del stepper (closure)
  document.getElementById('stickyAddBtn').addEventListener('click', () => {
    addToCart();
    const b = document.getElementById('stickyAddBtn');
    const orig = b.innerHTML;
    b.innerHTML = 'Agregado ✓';
    setTimeout(() => { b.innerHTML = orig; }, 1400);
  });

  // ----- Related products (cross-sell real) -----
  // Filtra el catálogo real por mismo type[0] (preferido) o misma brand (fallback).
  // Excluye el producto actual. Ordena por descuento. Toma hasta 6.
  (function renderRelated() {
    if (!cat || !window.CATALOG_BY_CAT || !window.CATALOG_BY_CAT[cat]) return;
    const pool = window.CATALOG_BY_CAT[cat];

    // Buscamos el "raw" del catálogo para tener types[0] real
    const rawCurrent = pool.find(p => slug((p.brand || '') + '-' + (p.name || '')) === pid);
    if (!rawCurrent) return;
    const myType  = (rawCurrent.types && rawCurrent.types[0]) || '';
    const myBrand = rawCurrent.brand || '';
    const myKey   = slug((rawCurrent.brand || '') + '-' + (rawCurrent.name || ''));

    function discPct(p) {
      const now = parsePrecio(p.price), was = parsePrecio(p.was);
      return (was > now && now > 0) ? (1 - now / was) : 0;
    }

    // 1) Mismo type, distinto producto
    let sameType = pool.filter(p => {
      if (!p || !p.types || !p.types[0]) return false;
      if (slug((p.brand || '') + '-' + (p.name || '')) === myKey) return false;
      return p.types[0] === myType;
    });
    sameType.sort((a, b) => discPct(b) - discPct(a));

    let picks = sameType.slice(0, 6);

    // 2) Si quedan <3, completar con misma brand (sin duplicar)
    if (picks.length < 3 && myBrand) {
      const picked = new Set(picks.map(p => slug((p.brand || '') + '-' + (p.name || ''))));
      const sameBrand = pool.filter(p => {
        if (!p || !p.brand) return false;
        const k = slug(p.brand + '-' + (p.name || ''));
        if (k === myKey || picked.has(k)) return false;
        return p.brand === myBrand;
      });
      sameBrand.sort((a, b) => discPct(b) - discPct(a));
      picks = picks.concat(sameBrand).slice(0, 6);
    }

    if (!picks.length) return;

    const grid = document.getElementById('relatedGrid');
    const section = document.getElementById('relatedSection');
    if (!grid || !section) return;

    grid.innerHTML = picks.map(p => {
      const now  = parsePrecio(p.price);
      const was  = parsePrecio(p.was);
      const disc = (was > now && now > 0) ? Math.round((1 - now / was) * 100) : 0;
      const cuota = Math.round(now / 3);
      const pidx = slug((p.brand || '') + '-' + (p.name || ''));
      const offBadge = disc >= 5 ? `<span class="mlcard-off">${disc}% OFF</span>` : '';
      const wasRow   = was > now ? `<div class="mlcard-was">${fmt(was)}</div>` : '';
      const discTxt  = disc >= 5 ? `<span class="mlcard-disc">${disc}% OFF</span>` : '';
      return `<a class="mlcard" href="producto.html?cat=${encodeURIComponent(cat)}&pid=${encodeURIComponent(pidx)}" data-pid="${encodeURIComponent(pidx)}">
        <div class="mlcard-ph">${offBadge}<img src="${p.img}" alt="${(p.name || '').replace(/"/g,'&quot;')}" loading="lazy" /></div>
        <div class="mlcard-info">
          <div class="mlcard-brand">${p.brand || ''}</div>
          <div class="mlcard-name">${p.name || ''}</div>
          ${wasRow}
          <div class="mlcard-price-row"><span class="mlcard-price">${fmt(now)}</span>${discTxt}</div>
          <div class="mlcard-cuotas">3 cuotas sin interés de ${fmt(cuota)}</div>
          <div class="mlcard-foot"><button class="mlcard-add" type="button" data-mladd><svg class="cart-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg><span>Agregar</span></button></div>
        </div>
      </a>`;
    }).join('');

    section.style.display = '';

    // Handler "Agregar al carrito" sin abrir la PDP
    grid.querySelectorAll('[data-mladd]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        const card = e.currentTarget.closest('.mlcard');
        if (!card) return;
        const pidCard = decodeURIComponent(card.dataset.pid || '');
        const prod = pool.find(p => slug((p.brand || '') + '-' + (p.name || '')) === pidCard);
        if (prod && window.Cart) {
          window.Cart.add({
            id: pidCard,
            brand: prod.brand,
            name: prod.name,
            price: parsePrecio(prod.price),
            img: prod.img,
            cat: cat || ''
          });
        }
        const orig = e.currentTarget.innerHTML;
        e.currentTarget.innerHTML = '<span>Agregado ✓</span>';
        setTimeout(() => { e.currentTarget.innerHTML = orig; }, 1400);
      });
    });
  })();
})();
