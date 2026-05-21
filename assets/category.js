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

  function cardHTML(p) {
    const href = productHref(p);
    return `
      <article class="pcard" data-id="${productId(p)}" data-types="${p.types.join(',')}" data-brand="${p.brand}">
        <a href="${href}" class="pcard-link" aria-label="Ver ${p.name}">
          <div class="ph">
            ${p.tag ? `<span class="tag ${p.tagType || ''}">${p.tag}</span>` : ''}
            <img src="${p.img}" alt="${p.name}" loading="lazy" />
          </div>
          <div class="info">
            <div class="brand">${p.brand}</div>
            <div class="name">${p.name}</div>
            <div class="meta">${p.meta}</div>
            <div class="row">
              <div class="price">${p.price}${p.was ? `<small>${p.was}</small>` : ''}</div>
              <button class="pcard-btn" data-add type="button">Agregar</button>
            </div>
          </div>
        </a>
      </article>`;
  }

  function render(list) {
    grid.innerHTML = list.length
      ? list.map(cardHTML).join('')
      : `<div class="cat-empty" style="grid-column: 1/-1;">No hay productos que coincidan con tus filtros.</div>`;
    if (resultsEl) resultsEl.innerHTML = `<strong>${list.length}</strong> producto${list.length === 1 ? '' : 's'}`;
    bindAdd();
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
            img: product.img
          });
        }
        const btn = e.currentTarget;
        btn.textContent = 'Agregado ✓';
        btn.style.background = 'var(--red)';
        btn.style.color = '#fff';
        btn.style.borderColor = 'var(--red)';
        setTimeout(() => {
          btn.textContent = 'Agregar';
          btn.style.background = '';
          btn.style.color = '';
          btn.style.borderColor = '';
        }, 1400);
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

  if (document.readyState !== 'loading') { apply(); setupFiltersPanel(); }
  else document.addEventListener('DOMContentLoaded', () => { apply(); setupFiltersPanel(); });
})();
