(function () {
  'use strict';

  const STORAGE_KEY = 'morashop_cart_v1';
  const formatARS = n => '$ ' + Math.round(n).toLocaleString('es-AR');

  function parsePrice(raw) {
    if (typeof raw === 'number') return raw;
    if (raw == null) return 0;
    const s = String(raw).replace(/[^\d.,]/g, '').replace(/\./g, '').replace(',', '.');
    return parseFloat(s) || 0;
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) { return []; }
  }
  function save(items) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch (_) {}
  }

  let items = load();

  function totals() {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
    return { count, subtotal };
  }

  function emit() {
    save(items);
    syncBadges();
    if (drawerEl && drawerEl.classList.contains('open')) renderDrawer();
    document.dispatchEvent(new CustomEvent('cart:change', { detail: { items: items.slice(), ...totals() } }));
  }

  function add(product, qty) {
    qty = qty || 1;
    if (!product || !product.id) return;
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        id: product.id,
        brand: product.brand || '',
        name: product.name || '',
        price: parsePrice(product.price),
        img: product.img || '',
        qty: qty
      });
    }
    emit();
    openDrawer();
  }

  function setQty(id, qty) {
    const it = items.find(i => i.id === id);
    if (!it) return;
    if (qty <= 0) remove(id);
    else { it.qty = qty; emit(); }
  }
  function remove(id) {
    items = items.filter(i => i.id !== id);
    emit();
  }
  function clear() { items = []; emit(); }

  // ---------- BADGES (sync every .cart-badge / #cartCount in DOM) ----------
  function syncBadges() {
    const { count } = totals();
    document.querySelectorAll('.cart-badge, #cartCount').forEach(b => {
      const prev = parseInt(b.textContent, 10) || 0;
      b.textContent = count;
      b.style.display = count > 0 ? '' : 'none';
      if (count > prev) {
        b.animate(
          [{ transform: 'scale(1)' }, { transform: 'scale(1.4)' }, { transform: 'scale(1)' }],
          { duration: 280, easing: 'ease-out' }
        );
      }
    });
  }

  // ---------- DRAWER ----------
  let drawerEl = null;
  let backdropEl = null;
  let lastTrigger = null;

  function ensureDrawer() {
    if (drawerEl) return;
    backdropEl = document.createElement('div');
    backdropEl.className = 'cart-backdrop';
    backdropEl.addEventListener('click', closeDrawer);

    drawerEl = document.createElement('aside');
    drawerEl.className = 'cart-drawer';
    drawerEl.setAttribute('role', 'dialog');
    drawerEl.setAttribute('aria-modal', 'true');
    drawerEl.setAttribute('aria-label', 'Carrito de compras');
    drawerEl.setAttribute('aria-hidden', 'true');
    drawerEl.innerHTML = `
      <header class="cart-head">
        <div>
          <div class="cart-eyebrow">Tu carrito</div>
          <h3 class="cart-title">Morashop</h3>
        </div>
        <button class="cart-close" type="button" aria-label="Cerrar carrito">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </header>
      <div class="cart-body" data-cart-body></div>
      <footer class="cart-foot" data-cart-foot></footer>
    `;
    document.body.appendChild(backdropEl);
    document.body.appendChild(drawerEl);

    drawerEl.querySelector('.cart-close').addEventListener('click', closeDrawer);
    drawerEl.addEventListener('click', e => {
      const btn = e.target.closest('[data-cart-action]');
      if (!btn) return;
      const action = btn.dataset.cartAction;
      const id = btn.dataset.id;
      if (action === 'inc') {
        const it = items.find(i => i.id === id);
        if (it) setQty(id, it.qty + 1);
      } else if (action === 'dec') {
        const it = items.find(i => i.id === id);
        if (it) setQty(id, it.qty - 1);
      } else if (action === 'remove') {
        remove(id);
      } else if (action === 'clear') {
        clear();
      }
    });
  }

  function renderDrawer() {
    const body = drawerEl.querySelector('[data-cart-body]');
    const foot = drawerEl.querySelector('[data-cart-foot]');
    if (!items.length) {
      body.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>
          </div>
          <div class="cart-empty-title">Tu carrito está vacío</div>
          <p class="cart-empty-sub">Sumá productos del catálogo y aparecen acá.</p>
          <a href="suplementos.html" class="cart-btn-outline" data-cart-close>Ver catálogo →</a>
        </div>
      `;
      foot.innerHTML = '';
      // Close link on outline button (delegated)
      body.querySelectorAll('[data-cart-close]').forEach(a => a.addEventListener('click', closeDrawer));
      return;
    }
    body.innerHTML = items.map(it => `
      <div class="cart-item" data-id="${it.id}">
        <div class="cart-thumb">${it.img ? `<img src="${it.img}" alt="" loading="lazy" />` : ''}</div>
        <div class="cart-item-meta">
          <div class="cart-item-brand">${it.brand}</div>
          <div class="cart-item-name">${it.name}</div>
          <div class="cart-qty">
            <button type="button" data-cart-action="dec" data-id="${it.id}" aria-label="Restar">−</button>
            <span>${it.qty}</span>
            <button type="button" data-cart-action="inc" data-id="${it.id}" aria-label="Sumar">+</button>
          </div>
        </div>
        <div class="cart-item-right">
          <div class="cart-item-price">${formatARS(it.price * it.qty)}</div>
          <button class="cart-item-remove" type="button" data-cart-action="remove" data-id="${it.id}">Quitar</button>
        </div>
      </div>
    `).join('');

    const { subtotal, count } = totals();
    foot.innerHTML = `
      <div class="cart-row">
        <span class="cart-row-l">Subtotal · ${count} ${count === 1 ? 'producto' : 'productos'}</span>
        <span class="cart-row-v">${formatARS(subtotal)}</span>
      </div>
      <div class="cart-row cart-row-mute">
        <span class="cart-row-l">15% efectivo / 5% transferencia</span>
        <span class="cart-row-v">Calculado en checkout</span>
      </div>
      <a href="checkout.html" class="cart-checkout">Finalizar compra <span class="arr">→</span></a>
      <div class="cart-foot-actions">
        <button type="button" data-cart-action="clear" class="cart-clear">Vaciar carrito</button>
        <button type="button" class="cart-keep" data-cart-close>Seguir comprando</button>
      </div>
    `;
    foot.querySelectorAll('[data-cart-close]').forEach(a => a.addEventListener('click', closeDrawer));
  }

  function openDrawer(trigger) {
    ensureDrawer();
    lastTrigger = trigger || document.activeElement || null;
    renderDrawer();
    requestAnimationFrame(() => {
      drawerEl.classList.add('open');
      backdropEl.classList.add('open');
      drawerEl.setAttribute('aria-hidden', 'false');
      document.body.classList.add('cart-locked');
    });
  }
  function closeDrawer() {
    if (!drawerEl) return;
    drawerEl.classList.remove('open');
    backdropEl.classList.remove('open');
    drawerEl.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cart-locked');
    if (lastTrigger && typeof lastTrigger.focus === 'function') lastTrigger.focus();
  }

  // ---------- WIRING ----------
  function attachCartButtons() {
    // Cualquier botón de carrito en el nav abre el drawer
    document.querySelectorAll('#cartBtn, [data-cart-open]').forEach(btn => {
      if (btn._cartBound) return;
      btn._cartBound = true;
      btn.addEventListener('click', e => {
        e.preventDefault();
        openDrawer(btn);
      });
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawerEl && drawerEl.classList.contains('open')) closeDrawer();
  });

  // Public API
  window.Cart = {
    add, remove, setQty, clear,
    open: openDrawer, close: closeDrawer,
    items: () => items.slice(),
    totals,
    attach: attachCartButtons,
    formatARS, parsePrice
  };

  if (document.readyState !== 'loading') { attachCartButtons(); syncBadges(); }
  else document.addEventListener('DOMContentLoaded', () => { attachCartButtons(); syncBadges(); });
})();
