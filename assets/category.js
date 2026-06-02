(function () {
  const grid = document.getElementById('catGrid');
  const resultsEl = document.getElementById('resultsCount');
  const cartCount = document.getElementById('cartCount');
  if (!grid) return;

  // Detectar la categoria actual desde el nombre del HTML (suplementos.html -> 'suplementos')
  const CURRENT_CAT = (() => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('suplementos')) return 'suplementos';
    if (path.includes('supermercado')) return 'supermercado';
    if (path.includes('electro'))     return 'electro';
    if (path.includes('bananero'))    return 'bananero';
    return '';
  })();

  function productId(p) {
    return (p.brand + '-' + p.name)
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function productHref(p) {
    return `producto.html?cat=${CURRENT_CAT}&pid=${productId(p)}`;
  }

  // Helpers de precio/descuento (estilo ML)
  function toNum(s) { return parseInt(String(s || '').replace(/[^\d]/g, ''), 10) || 0; }
  function fmt(n) { return '$ ' + n.toLocaleString('es-AR'); }
  function discount(p) {
    const now = toNum(p.price), was = toNum(p.was);
    if (was > now && now > 0) return Math.round((1 - now / was) * 100);
    return 0;
  }

  /* Hash determinístico fake-data */
  function seedFromProduct(p){
    const str = ((p.brand||'') + (p.name||'')).toLowerCase();
    let h = 0;
    for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h = h & h; }
    return Math.abs(h);
  }
  function fakeStock(p){ return (seedFromProduct(p) % 30) + 3; }
  function fakeVendidos(p){ return (seedFromProduct(p) % 1500) + 50; }
  function fakeRating(p){ return 4 + ((seedFromProduct(p) % 100) / 100); }
  function vendidosEscalon(p){
    const n = fakeVendidos(p);
    if (n >= 10000) return '+10mil';
    if (n >= 5000)  return '+5mil';
    if (n >= 1000)  return '+1000';
    if (n >= 500)   return '+500';
    if (n >= 100)   return '+100';
    if (n >= 5)     return '+5';
    return '';
  }
  function precioEfectivo(now){ return Math.round(now * 0.85); }
  function precioCuota(now){ return Math.round(now / 3); }
  function stockHTML(p, type){
    const st = fakeStock(p);
    const cls = type === 'row' ? 'mlrow-stock' : 'mlcard-stock';
    return st < 10
      ? `<div class="${cls} urgente">⚡ Solo quedan ${st}</div>`
      : '';
  }
  function vendidosHTML(p, type){
    const v = vendidosEscalon(p);
    if (!v) return '';
    const cls = type === 'row' ? 'mlrow-vendidos' : 'mlcard-vendidos';
    return `<div class="${cls}">${v} vendidos</div>`;
  }
  function fakeReviews(p){ return Math.max(3, Math.floor(fakeVendidos(p) * 0.15)); }
  function ratingHTML(p, type){
    const r = fakeRating(p).toFixed(1);
    const rev = fakeReviews(p);
    const cls = type === 'row' ? 'mlrow-rating' : 'mlcard-rating';
    return `<div class="${cls}"><span class="star">★</span>${r}<span class="rev">(${rev})</span></div>`;
  }

  // CARD estilo ML (grilla) — limpio
  function cardHTML(p) {
    const href = productHref(p);
    const now = toNum(p.price), was = toNum(p.was), disc = discount(p);
    const efectivo = precioEfectivo(now), cuota = precioCuota(now);
    const offBadge = disc >= 5 ? `<span class="mlcard-off">${disc}% OFF</span>` : '';
    const savingsHTML = was > now ? `<div class="mlcard-savings">Ahorrás ${fmt(was - now)}</div>` : '';
    return `<a class="mlcard" href="${href}" data-id="${productId(p)}" data-types="${p.types.join(',')}" data-brand="${p.brand}">
      <div class="mlcard-ph">${offBadge}<img src="${p.img}" alt="${p.name}" loading="lazy" /></div>
      <div class="mlcard-info">
        <div class="mlcard-brand">${p.brand}</div>
        <div class="mlcard-name">${p.name}</div>
        ${ratingHTML(p, 'card')}
        ${vendidosHTML(p, 'card')}
        <div class="mlcard-price-row"><span class="mlcard-price">${fmt(now)}</span></div>
        ${savingsHTML}
        <div class="mlcard-efectivo"><strong>${fmt(efectivo)}</strong> en efectivo</div>
        <div class="mlcard-cuotas">3 cuotas sin interés de ${fmt(cuota)}</div>
        <div class="mlcard-foot"><button class="mlcard-add" type="button" data-add><svg class="cart-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg><span>Agregar</span></button></div>
      </div>
    </a>`;
  }

  // FILA horizontal estilo ML (lista) — idéntica a la home
  function rowItemHTML(p) {
    const href = productHref(p);
    const now = toNum(p.price), was = toNum(p.was), disc = discount(p);
    const efectivo = precioEfectivo(now), cuota = precioCuota(now);
    const wasRow = was > now ? `<div class="mlrow-was">${fmt(was)}</div>` : '';
    const discTxt = disc >= 5 ? `<span class="mlrow-disc">${disc}% OFF</span>` : '';
    return `<a class="mlrow-item" href="${href}" data-id="${productId(p)}" data-types="${p.types.join(',')}" data-brand="${p.brand}">
      <div class="mlrow-ph"><img src="${p.img}" alt="${p.name}" loading="lazy" /></div>
      <div class="mlrow-body">
        <div class="mlrow-brand">${p.brand}</div>
        <div class="mlrow-name">${p.name}</div>
        ${ratingHTML(p, 'row')}
        ${vendidosHTML(p, 'row')}
        ${wasRow}
        <div class="mlrow-priceline"><span class="mlrow-price">${fmt(now)}</span>${discTxt}</div>
        <div class="mlrow-efectivo"><strong>${fmt(efectivo)}</strong> en efectivo</div>
        <div class="mlrow-cuotas">3 cuotas sin interés de ${fmt(cuota)}</div>
      </div>
      <button class="mlrow-add" type="button" data-add>Agregar</button>
    </a>`;
  }

  // Cuántos productos mostrar de entrada (resto con "Ver más")
  let mostrados = 24;

  function renderEmptyState() {
    const toolbar = document.querySelector('.cat-toolbar');
    if (toolbar) toolbar.style.display = 'none';
    const cardsSection = document.querySelector('.type-cards');
    if (cardsSection) cardsSection.style.display = '';
    const labels = {
      suplementos: 'los suplementos',
      supermercado: 'los productos del super',
      electro: 'los electrodomésticos',
      bananero: 'los vinos y destilados'
    };
    const label = labels[CURRENT_CAT] || 'los productos';
    grid.innerHTML = `<div class="cat-empty-cta">
      <h3>Elegí una categoría arriba para empezar</h3>
      <p>Hacé click en una de las cards para ver los productos de esa categoría.</p>
      <button class="cat-show-all-btn" type="button" data-show-all>Ver todos ${label} (${window.PRODUCTS.length}) →</button>
    </div>`;
    if (resultsEl) resultsEl.innerHTML = '';
    const btn = grid.querySelector('[data-show-all]');
    if (btn) {
      btn.addEventListener('click', () => {
        document.body.dataset.showAll = '1';
        apply();
        const target = document.querySelector('.cat-body');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  function render(list) {
    if (!list.length) {
      grid.innerHTML = `<div class="cat-empty">No hay productos que coincidan con tus filtros.</div>`;
      if (resultsEl) resultsEl.innerHTML = `<strong>0</strong> productos`;
      return;
    }
    const visible = list.slice(0, mostrados);
    // Grilla única: todas las cards en una grilla que va bajando (2 columnas en mobile)
    let html = `<div class="mlgrid">${visible.map(cardHTML).join('')}</div>`;
    // Botón "Ver más" si quedan productos
    if (list.length > mostrados) {
      html += `<div class="cat-more"><button class="cat-more-btn" type="button" data-more>Ver más productos (${list.length - mostrados} restantes)</button></div>`;
    }
    grid.innerHTML = html;
    if (resultsEl) resultsEl.innerHTML = `<strong>${list.length}</strong> producto${list.length === 1 ? '' : 's'}`;
    bindAdd();
    // "Ver más" amplía la cantidad visible
    const moreBtn = grid.querySelector('[data-more]');
    if (moreBtn) {
      moreBtn.addEventListener('click', () => { mostrados += 24; render(list); });
    }
  }

  function bindAdd() {
    document.querySelectorAll('[data-add]').forEach(b => {
      if (b._cartBound) return;
      b._cartBound = true;
      b.addEventListener('click', e => {
        // El boton esta DENTRO del <a> de la card -> evitar la navegacion
        e.preventDefault();
        e.stopPropagation();
        const card = e.currentTarget.closest('[data-id]');
        const id = card && card.dataset.id;
        const product = id ? window.PRODUCTS.find(p => productId(p) === id) : null;
        if (product && window.Cart) {
          window.Cart.add({
            id: id,
            brand: product.brand,
            name: product.name,
            price: product.price,
            img: product.img,
            cat: CURRENT_CAT
          });
        }
        const btn = e.currentTarget;
        const original = btn.textContent;
        btn.textContent = 'Agregado ✓';
        setTimeout(() => { btn.textContent = original; }, 1400);
      });
    });
  }

  function parseNum(s) { return parseFloat(String(s).replace(/[^\d.,]/g, '').replace(/\./g, '').replace(',', '.')) || 0; }

  function countByValue(group, value) {
    const list = window.PRODUCTS || [];
    if (value === 'all') return list.length;
    if (group === 'brand') return list.filter(p => p.brand === value).length;
    if (group === 'type')  return list.filter(p => Array.isArray(p.types) && p.types.includes(value)).length;
    return 0;
  }

  function decoratePillCounts() {
    document.querySelectorAll('.pill[data-group][data-value]').forEach(pill => {
      if (pill.dataset.countDone) return;
      const group = pill.dataset.group;
      const value = pill.dataset.value;
      const n = countByValue(group, value);
      const baseLabel = pill.textContent.trim();
      pill.textContent = `${baseLabel} (${n})`;
      pill.dataset.countDone = '1';
    });
    // Type-cards: agregar conteo "(N)" debajo del nombre
    document.querySelectorAll('.type-card[data-filter-type]').forEach(card => {
      if (card.dataset.countDone) return;
      const tipo = card.dataset.filterType;
      const n = countByValue('type', tipo);
      const nameEl = card.querySelector('.type-card-name');
      if (nameEl && !card.querySelector('.type-card-count')) {
        const countEl = document.createElement('span');
        countEl.className = 'type-card-count';
        countEl.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
        nameEl.insertAdjacentElement('afterend', countEl);
      }
      card.dataset.countDone = '1';
    });
  }

  function apply() {
    let list = window.PRODUCTS.slice();
    // Tipo: prioridad a type-cards si existen, sino fallback a pills (bananero)
    let typeValues;
    const cards = document.querySelectorAll('.type-card[data-filter-type]');
    const hasCards = cards.length > 0;
    if (hasCards) {
      typeValues = [...document.querySelectorAll('.type-card.active')].map(c => c.dataset.filterType);
    } else {
      typeValues = [...document.querySelectorAll('.pill[data-group="type"].active')].map(p => p.dataset.value);
    }
    const brandPills = [...document.querySelectorAll('.pill[data-group="brand"].active')].map(p => p.dataset.value);

    // EMPTY STATE: en pages con cards + sin filtro de tipo + sin filtro de marca (o solo "all") + sin showAll → solo CTA
    const noTypeFilter = !typeValues.length || typeValues.includes('all');
    const noBrandFilter = !brandPills.length || brandPills.every(v => v === 'all');
    const showAll = document.body.dataset.showAll === '1';
    if (hasCards && noTypeFilter && noBrandFilter && !showAll) {
      renderEmptyState();
      return;
    }
    // Mostrar toolbar (puede haber estado oculta por empty state)
    const toolbar = document.querySelector('.cat-toolbar');
    if (toolbar) toolbar.style.display = '';
    // Cards de categoría: ocultar cuando showAll (usuario eligió ver todo, ya filtra con pills/sort)
    // Mantener visibles cuando una card está activa (para que pueda cambiar de tipo)
    const cardsSection = document.querySelector('.type-cards');
    if (cardsSection) cardsSection.style.display = showAll ? 'none' : '';

    if (typeValues.length && !typeValues.includes('all')) list = list.filter(p => p.types.some(t => typeValues.includes(t)));
    if (brandPills.length && !brandPills.includes('all')) list = list.filter(p => brandPills.includes(p.brand));
    const sort = document.getElementById('sort')?.value;
    if (sort === 'price-asc')   list.sort((a, b) => parseNum(a.price) - parseNum(b.price));
    if (sort === 'price-desc')  list.sort((a, b) => parseNum(b.price) - parseNum(a.price));
    if (sort === 'name')        list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'bestsellers') list.sort((a, b) => fakeVendidos(b) - fakeVendidos(a));
    if (sort === 'rating')      list.sort((a, b) => fakeRating(b) - fakeRating(a));
    mostrados = 24; // resetear al filtrar/ordenar
    render(list);
  }

  document.addEventListener('click', e => {
    const pill = e.target.closest('.pill');
    if (!pill) return;
    const group = pill.dataset.group;
    const val = pill.dataset.value;
    if (val === 'all') {
      document.querySelectorAll(`.pill[data-group="${group}"]`).forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    } else {
      document.querySelector(`.pill[data-group="${group}"][data-value="all"]`)?.classList.remove('active');
      pill.classList.toggle('active');
      // if none active, re-activate "all"
      if (!document.querySelector(`.pill[data-group="${group}"].active`)) {
        document.querySelector(`.pill[data-group="${group}"][data-value="all"]`)?.classList.add('active');
      }
    }
    apply();
  });

  document.addEventListener('change', e => { if (e.target.id === 'sort') apply(); });

  // Click en .type-card → toggle activa/desactiva, filtra productos, scroll a grilla
  document.addEventListener('click', e => {
    const card = e.target.closest('.type-card[data-filter-type]');
    if (!card) return;
    const wasActive = card.classList.contains('active');
    document.querySelectorAll('.type-card').forEach(c => c.classList.remove('active'));
    if (!wasActive) card.classList.add('active'); // click en la misma = mostrar todos
    apply();
    const target = document.querySelector('.cat-body') || document.getElementById('catGrid');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Lee ?tipo=X y ?marca=Y de la URL y activa los pills correspondientes.
  // Usado por catbar, menú mobile y marcas.html para entrar directo a un filtro.
  function applyTipoFromURL() {
    const params = new URLSearchParams(window.location.search);
    const tipo = params.get('tipo');
    if (tipo) {
      // Type-cards: si existen, marcar la card. Sino, fallback a pills.
      const card = document.querySelector(`.type-card[data-filter-type="${tipo}"]`);
      if (card) {
        document.querySelectorAll('.type-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      } else {
        const allTypeBtn = document.querySelector('.pill[data-group="type"][data-value="all"]');
        if (allTypeBtn) allTypeBtn.classList.remove('active');
        const targetBtn = document.querySelector(`.pill[data-group="type"][data-value="${tipo}"]`);
        if (targetBtn) targetBtn.classList.add('active');
      }
    }
    const marca = params.get('marca');
    if (marca) {
      const allBrandBtn = document.querySelector('.pill[data-group="brand"][data-value="all"]');
      if (allBrandBtn) allBrandBtn.classList.remove('active');
      // Busca pill por marca exacta o lowercase
      const pills = document.querySelectorAll('.pill[data-group="brand"]');
      pills.forEach(p => {
        if ((p.dataset.value || '').toLowerCase() === marca.toLowerCase()) {
          p.classList.add('active');
        }
      });
    }
  }

  // ---------- PANEL DE FILTROS EN MOBILE ----------
  // Se inyecta automaticamente: boton "Filtros" en el toolbar + backdrop + boton cerrar/aplicar en el panel.
  // No hay que tocar el HTML de las paginas; usa las mismas .pill ya existentes.
  function setupFiltersPanel() {
    const pillBar = document.querySelector('.pill-bar');
    const toolbar = document.querySelector('.cat-toolbar');
    if (!pillBar || !toolbar) return;

    // Boton Filtros al inicio del toolbar (antes de results)
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.type = 'button';
    btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/></svg>
      Filtros <span class="badge" data-count style="display:none">0</span>`;
    toolbar.insertBefore(btn, toolbar.firstChild);

    // Backdrop + boton cerrar + boton aplicar (hermanos de .pill-bar)
    const backdrop = document.createElement('div');
    backdrop.className = 'pill-backdrop';
    pillBar.parentNode.insertBefore(backdrop, pillBar.nextSibling);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'pill-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Cerrar filtros');
    closeBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
    pillBar.parentNode.insertBefore(closeBtn, backdrop.nextSibling);

    const applyBtn = document.createElement('button');
    applyBtn.className = 'pill-apply';
    applyBtn.type = 'button';
    applyBtn.textContent = 'Ver resultados';
    pillBar.parentNode.insertBefore(applyBtn, closeBtn.nextSibling);

    function updateCount() {
      const active = document.querySelectorAll('.pill.active:not([data-value="all"])').length;
      const badge = btn.querySelector('[data-count]');
      if (active > 0) { badge.style.display = ''; badge.textContent = active; }
      else            { badge.style.display = 'none'; }
    }
    function open() {
      pillBar.classList.add('open');
      backdrop.classList.add('open');
      document.body.classList.add('filters-open');
    }
    function close() {
      pillBar.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.classList.remove('filters-open');
    }
    btn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);
    applyBtn.addEventListener('click', () => { updateCount(); close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && pillBar.classList.contains('open')) close(); });
    // Actualizar contador cada vez que se toca una pill
    document.addEventListener('click', e => { if (e.target.closest('.pill')) updateCount(); });
    updateCount();
  }

  if (document.readyState !== 'loading') { applyTipoFromURL(); decoratePillCounts(); apply(); setupFiltersPanel(); }
  else document.addEventListener('DOMContentLoaded', () => { applyTipoFromURL(); decoratePillCounts(); apply(); setupFiltersPanel(); });
})();
