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

  // CARD estilo ML (grilla) — limpio
  function cardHTML(p) {
    const href = productHref(p);
    const now = toNum(p.price), disc = discount(p);
    const efectivo = precioEfectivo(now), cuota = precioCuota(now);
    const offBadge = disc >= 5 ? `<span class="mlcard-off">${disc}% OFF</span>` : '';
    const discTxt = disc >= 5 ? `<span class="mlcard-disc">${disc}% OFF</span>` : '';
    return `<a class="mlcard" href="${href}" data-id="${productId(p)}" data-types="${p.types.join(',')}" data-brand="${p.brand}">
      <div class="mlcard-ph">${offBadge}<img src="${p.img}" alt="${p.name}" loading="lazy" /></div>
      <div class="mlcard-info">
        <div class="mlcard-brand">${p.brand}</div>
        <div class="mlcard-name">${p.name}</div>
        ${vendidosHTML(p, 'card')}
        <div class="mlcard-price-row"><span class="mlcard-price">${fmt(now)}</span>${discTxt}</div>
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

  function apply() {
    let list = window.PRODUCTS.slice();
    const typePills = [...document.querySelectorAll('.pill[data-group="type"].active')].map(p => p.dataset.value);
    const brandPills = [...document.querySelectorAll('.pill[data-group="brand"].active')].map(p => p.dataset.value);
    if (typePills.length && !typePills.includes('all')) list = list.filter(p => p.types.some(t => typePills.includes(t)));
    if (brandPills.length && !brandPills.includes('all')) list = list.filter(p => brandPills.includes(p.brand));
    const sort = document.getElementById('sort')?.value;
    if (sort === 'price-asc')  list.sort((a, b) => parseNum(a.price) - parseNum(b.price));
    if (sort === 'price-desc') list.sort((a, b) => parseNum(b.price) - parseNum(a.price));
    if (sort === 'name')       list.sort((a, b) => a.name.localeCompare(b.name));
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

  // Click en .type-card (cards grandes arriba) → activa pill del mismo tipo + scroll a productos
  document.addEventListener('click', e => {
    const card = e.target.closest('.type-card[data-filter-type]');
    if (!card) return;
    const tipo = card.dataset.filterType;
    // toggle card visual
    document.querySelectorAll('.type-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    // desactivar "all" + activar el pill correspondiente
    document.querySelector('.pill[data-group="type"][data-value="all"]')?.classList.remove('active');
    document.querySelectorAll('.pill[data-group="type"]').forEach(p => p.classList.remove('active'));
    const pill = document.querySelector(`.pill[data-group="type"][data-value="${tipo}"]`);
    if (pill) pill.classList.add('active');
    apply();
    // scroll suave hasta los productos
    const target = document.querySelector('.cat-body') || document.getElementById('catGrid');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Lee ?tipo=X de la URL y activa el pill correspondiente del grupo "type".
  // Usado por la catbar y el menú mobile para entrar directo a una subcategoría filtrada.
  function applyTipoFromURL() {
    const params = new URLSearchParams(window.location.search);
    const tipo = params.get('tipo');
    if (!tipo) return;
    const allBtn = document.querySelector('.pill[data-group="type"][data-value="all"]');
    if (allBtn) allBtn.classList.remove('active');
    const targetBtn = document.querySelector(`.pill[data-group="type"][data-value="${tipo}"]`);
    if (targetBtn) targetBtn.classList.add('active');
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

  if (document.readyState !== 'loading') { applyTipoFromURL(); apply(); setupFiltersPanel(); }
  else document.addEventListener('DOMContentLoaded', () => { applyTipoFromURL(); apply(); setupFiltersPanel(); });
})();
