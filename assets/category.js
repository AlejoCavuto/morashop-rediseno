(function () {
  const grid = document.getElementById('catGrid');
  const resultsEl = document.getElementById('resultsCount');
  const cartCount = document.getElementById('cartCount');
  if (!grid) return;

  function cardHTML(p) {
    return `
      <article class="pcard" data-types="${p.types.join(',')}" data-brand="${p.brand}">
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
            <button class="pcard-btn" data-add>Agregar</button>
          </div>
        </div>
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
      b.addEventListener('click', e => {
        if (cartCount) {
          const n = parseInt(cartCount.textContent, 10) + 1;
          cartCount.textContent = n;
          cartCount.animate(
            [{ transform: 'scale(1)' }, { transform: 'scale(1.4)' }, { transform: 'scale(1)' }],
            { duration: 280, easing: 'ease-out' }
          );
        }
        e.target.textContent = 'Agregado ✓';
        e.target.style.background = 'var(--red)';
        e.target.style.color = '#fff';
        e.target.style.borderColor = 'var(--red)';
        setTimeout(() => {
          e.target.textContent = 'Agregar';
          e.target.style.background = '';
          e.target.style.color = '';
          e.target.style.borderColor = '';
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

  if (document.readyState !== 'loading') apply();
  else document.addEventListener('DOMContentLoaded', apply);
})();
