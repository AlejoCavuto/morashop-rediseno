(function () {
  'use strict';

  // ======================================================
  // CONFIG: editá estos valores para cambiar la lógica
  // ======================================================
  const STORAGE_KEY  = 'morashop_cart_v1';
  const COUPON_KEY   = 'morashop_coupon';
  const ENVIO_GRATIS_DESDE = 70000;   // ARS — umbral para envío gratis
  const DESC_EFECTIVO       = 0.15;   // 15% efectivo (contraentrega CABA/GBA)
  const DESC_TRANSFERENCIA  = 0.05;   // 5% transferencia
  const CUOTAS_TARJETA      = 3;      // cuotas s/i

  const CUPONES = {
    'MORA10':       { tipo: 'porcentaje', valor: 10, label: '10% OFF' },
    'BIENVENIDO':   { tipo: 'porcentaje', valor: 10, label: '10% OFF (primera compra)' },
    'ENVIOGRATIS':  { tipo: 'envio',      valor: 0,  label: 'Envío gratis' }
  };

  // "Jueves de Suplemento": -10% en suplementos los jueves si hay >= 3 suplementos en el carrito
  const JUEVES_DE_SUPLEMENTO = {
    dia: 4,                  // 0=domingo, 4=jueves
    minItems: 3,             // unidades mínimas (cuenta qty)
    descuento: 0.10,         // 10%
    categoria: 'suplementos',
    label: 'Jueves de Suplemento'
  };

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
  function loadCoupon() {
    try {
      const raw = localStorage.getItem(COUPON_KEY);
      if (!raw) return null;
      const code = String(raw).toUpperCase();
      return CUPONES[code] ? { code, ...CUPONES[code] } : null;
    } catch (_) { return null; }
  }
  function saveCoupon(code) {
    try {
      if (code) localStorage.setItem(COUPON_KEY, String(code).toUpperCase());
      else localStorage.removeItem(COUPON_KEY);
    } catch (_) {}
  }

  let items = load();
  let activeCoupon = loadCoupon();

  function totals() {
    const count    = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
    return { count, subtotal };
  }

  function getDiscount() {
    const { subtotal } = totals();
    if (!activeCoupon || !subtotal) return { amount: 0, label: '', code: null };
    if (activeCoupon.tipo === 'porcentaje') {
      return {
        amount: subtotal * (activeCoupon.valor / 100),
        label: activeCoupon.label,
        code: activeCoupon.code
      };
    }
    // envío gratis: no descuenta del subtotal, sólo marca el envío
    return { amount: 0, label: activeCoupon.label, code: activeCoupon.code };
  }

  function applyCoupon(rawCode) {
    const code = String(rawCode || '').trim().toUpperCase();
    if (!code) return { ok: false, error: 'Ingresá un código' };
    if (!CUPONES[code]) return { ok: false, error: 'Cupón no válido' };
    activeCoupon = { code, ...CUPONES[code] };
    saveCoupon(code);
    emit();
    return { ok: true, coupon: activeCoupon };
  }
  function removeCoupon() {
    activeCoupon = null;
    saveCoupon(null);
    emit();
  }
  function getActiveCoupon() { return activeCoupon ? { ...activeCoupon } : null; }

  // ---------- JUEVES DE SUPLEMENTO ----------
  // Helper: hoy es jueves?
  function _esJueves() {
    return new Date().getDay() === JUEVES_DE_SUPLEMENTO.dia;
  }
  // Cuenta unidades de suplementos en el carrito
  function _unidadesSuplementos() {
    return items.reduce((s, i) => {
      return s + (i.cat === JUEVES_DE_SUPLEMENTO.categoria ? i.qty : 0);
    }, 0);
  }
  // Subtotal de SOLO los suplementos
  function _subtotalSuplementos() {
    return items.reduce((s, i) => {
      return s + (i.cat === JUEVES_DE_SUPLEMENTO.categoria ? i.qty * i.price : 0);
    }, 0);
  }
  // API pública: ¿aplica hoy la promo Jueves?
  function getJuevesDescuento() {
    const esJueves = _esJueves();
    const unidades = _unidadesSuplementos();
    if (!esJueves || unidades < JUEVES_DE_SUPLEMENTO.minItems) {
      return { activo: false, ahorro: 0, unidades, mensaje: '' };
    }
    const sub = _subtotalSuplementos();
    const ahorro = sub * JUEVES_DE_SUPLEMENTO.descuento;
    return {
      activo: true,
      ahorro,
      unidades,
      porcentaje: JUEVES_DE_SUPLEMENTO.descuento,
      label: JUEVES_DE_SUPLEMENTO.label,
      mensaje: `¡${JUEVES_DE_SUPLEMENTO.label}! −${Math.round(JUEVES_DE_SUPLEMENTO.descuento * 100)}% por llevar ${JUEVES_DE_SUPLEMENTO.minItems} o más suplementos`
    };
  }
  // Empuje cuando falta 1 (o más) para que aplique — jueves o pre-jueves (mié ≥18hs)
  function getJuevesProgreso() {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const esJueves = day === JUEVES_DE_SUPLEMENTO.dia;
    const esPreJueves = day === 3 && hour >= 18;
    if (!esJueves && !esPreJueves) return { mostrar: false };
    const unidades = _unidadesSuplementos();
    const faltan = JUEVES_DE_SUPLEMENTO.minItems - unidades;
    if (unidades === 0 || faltan <= 0) return { mostrar: false };
    const sub = _subtotalSuplementos();
    const promedio = sub / Math.max(1, unidades);
    const ahorroEstimado = (sub + promedio * faltan) * JUEVES_DE_SUPLEMENTO.descuento;
    const prefix = esJueves ? '⚡ Hoy es Jueves de Suplemento' : '🔥 Mañana es Jueves de Suplemento';
    return {
      mostrar: true,
      faltan,
      ahorroEstimado,
      esPreJueves,
      mensaje: `${prefix} — Sumá ${faltan} producto${faltan === 1 ? '' : 's'} más y ahorrás ~${formatARS(ahorroEstimado)}`
    };
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
      // si el item existente no tenía cat (carrito viejo) y ahora llega — lo seteamos
      if (!existing.cat && product.cat) existing.cat = product.cat;
    } else {
      items.push({
        id: product.id,
        brand: product.brand || '',
        name: product.name || '',
        price: parsePrice(product.price),
        img: product.img || '',
        types: Array.isArray(product.types) ? product.types.slice() : [],
        cat: product.cat || '',
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
    // Si el carrito queda vacío, soltamos el cupón también (consistente con clear()).
    // Evitamos llamar clear() para no disparar dos saves.
    if (items.length === 0) {
      try { localStorage.removeItem(COUPON_KEY); } catch (_) {}
      activeCoupon = null;
    }
    emit();
  }
  function clear() {
    items = [];
    activeCoupon = null;
    saveCoupon(null);
    emit();
  }

  // ---------- BADGES ----------
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

  // ---------- CROSS-SELL ----------
  // Mapeo: si en el carrito hay tipo X, sugerí tipos prioritarios Y.
  const CROSS_RULES = {
    'creatinas':    ['proteinas', 'bcaa', 'aminoacidos'],
    'proteinas':    ['creatinas', 'pre-entrenos', 'aminoacidos'],
    'pre-entrenos': ['creatinas', 'proteinas', 'aminoacidos'],
    'bcaa':         ['proteinas', 'creatinas'],
    'aminoacidos':  ['proteinas', 'creatinas'],
    'vitaminas':    ['proteinas', 'omega'],
    'omega':        ['vitaminas', 'proteinas']
  };

  function _slug(s) {
    return String(s || '').toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function _scoreDiscount(p) {
    const now = parsePrice(p.price);
    const was = parsePrice(p.was);
    if (!was || was <= now) return 0;
    return (was - now) / was;
  }

  function getSuggestions(limit) {
    limit = limit || 2;
    if (!items.length) return [];
    const catalog = (window.CATALOG_BY_CAT && window.CATALOG_BY_CAT.suplementos) || [];
    if (!catalog.length) return [];

    // Normalizamos: si el id incluye sabor (`base--chocolate`), nos quedamos con el base
    // para que el producto sin sabor del catálogo no aparezca como sugerencia.
    const inCartIds = new Set(items.map(i => String(i.id).split('--')[0]));
    const inCartTypes = new Set();
    items.forEach(it => (it.types || []).forEach(t => inCartTypes.add(t)));

    // Construir prioridad de tipos: por cada type del carrito, agregar sus "cross"
    const prefTypes = [];
    inCartTypes.forEach(t => {
      (CROSS_RULES[t] || []).forEach(x => { if (!prefTypes.includes(x)) prefTypes.push(x); });
    });

    const pidOf = p => _slug((p.brand || '') + '-' + (p.name || ''));
    const candidates = catalog.filter(p => !inCartIds.has(pidOf(p)));

    let pool = [];
    if (prefTypes.length) {
      // tomar candidatos cuyo type matchee al menos uno de los preferidos
      pool = candidates.filter(p => Array.isArray(p.types) && p.types.some(t => prefTypes.includes(t)));
    }
    // Fallback: top descuento global
    if (pool.length < limit) {
      const extras = candidates
        .filter(p => !pool.includes(p))
        .map(p => ({ p, s: _scoreDiscount(p) }))
        .filter(x => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .map(x => x.p);
      pool = pool.concat(extras);
    }

    return pool.slice(0, limit).map(p => ({
      id: pidOf(p),
      brand: p.brand || '',
      name: p.name || '',
      price: p.price,
      img: p.img || '',
      types: p.types || [],
      cat: 'suplementos' // las sugerencias vienen del catálogo de suplementos
    }));
  }

  // ---------- DRAWER ----------
  let drawerEl = null;
  let backdropEl = null;
  let lastTrigger = null;
  let couponOpen = false;
  let couponError = '';

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

    // Click delegation
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
      } else if (action === 'toggle-coupon') {
        couponOpen = !couponOpen;
        couponError = '';
        renderDrawer();
        if (couponOpen) {
          const input = drawerEl.querySelector('[data-coupon-input]');
          if (input) input.focus();
        }
      } else if (action === 'apply-coupon') {
        const input = drawerEl.querySelector('[data-coupon-input]');
        const res = applyCoupon(input ? input.value : '');
        if (!res.ok) {
          couponError = res.error;
          renderDrawer();
          const i2 = drawerEl.querySelector('[data-coupon-input]');
          if (i2) i2.focus();
        } else {
          couponError = '';
          // emit ya re-renderiza
        }
      } else if (action === 'remove-coupon') {
        removeCoupon();
      } else if (action === 'add-suggestion') {
        const idx = parseInt(btn.dataset.idx, 10);
        const suggestions = getSuggestions(2);
        const prod = suggestions[idx];
        if (prod) {
          // No abrir drawer otra vez (ya está abierto)
          const existing = items.find(i => i.id === prod.id);
          if (existing) existing.qty += 1;
          else items.push({
            id: prod.id, brand: prod.brand, name: prod.name,
            price: parsePrice(prod.price), img: prod.img,
            types: prod.types, cat: prod.cat || 'suplementos', qty: 1
          });
          emit();
        }
      }
    });

    // Coupon input: Enter aplica
    drawerEl.addEventListener('keydown', e => {
      if (e.target && e.target.matches('[data-coupon-input]') && e.key === 'Enter') {
        e.preventDefault();
        const res = applyCoupon(e.target.value);
        if (!res.ok) {
          couponError = res.error;
          renderDrawer();
          const i2 = drawerEl.querySelector('[data-coupon-input]');
          if (i2) i2.focus();
        }
      }
    });
  }

  // ---------- RENDER HELPERS ----------
  function renderShippingBar(subtotal) {
    if (!subtotal) return '';
    const free = subtotal >= ENVIO_GRATIS_DESDE;
    if (free) {
      return `
        <div class="cart-ship-bar cart-ship-bar--ok" role="status">
          <div class="cart-ship-msg"><span class="cart-ship-ic" aria-hidden="true">🚚</span><strong>¡Envío gratis!</strong> Tu pedido ya califica.</div>
          <div class="cart-ship-track"><div class="cart-ship-fill" style="width:100%"></div></div>
        </div>
      `;
    }
    const falta = ENVIO_GRATIS_DESDE - subtotal;
    const pct = Math.max(4, Math.min(100, Math.round((subtotal / ENVIO_GRATIS_DESDE) * 100)));
    return `
      <div class="cart-ship-bar" role="status">
        <div class="cart-ship-msg">Te faltan <strong>${formatARS(falta)}</strong> para envío gratis <span class="cart-ship-ic" aria-hidden="true">🚚</span></div>
        <div class="cart-ship-track"><div class="cart-ship-fill" style="width:${pct}%"></div></div>
      </div>
    `;
  }

  function renderCouponBlock() {
    if (activeCoupon) {
      const ext = activeCoupon.tipo === 'porcentaje' ? ` · -${activeCoupon.valor}%` : '';
      return `
        <div class="cart-coupon cart-coupon--applied">
          <div class="cart-coupon-applied">
            <span class="cart-coupon-check" aria-hidden="true">✓</span>
            <span><strong>${activeCoupon.code}</strong> aplicado${ext}</span>
          </div>
          <button type="button" class="cart-coupon-remove" data-cart-action="remove-coupon" aria-label="Quitar cupón">Quitar</button>
        </div>
      `;
    }
    if (!couponOpen) {
      return `
        <button type="button" class="cart-coupon-toggle" data-cart-action="toggle-coupon" aria-expanded="false">
          <span class="cart-coupon-ic" aria-hidden="true">🎟️</span>
          ¿Tenés un cupón?
          <span class="cart-coupon-chev" aria-hidden="true">▾</span>
        </button>
      `;
    }
    return `
      <div class="cart-coupon">
        <button type="button" class="cart-coupon-toggle cart-coupon-toggle--open" data-cart-action="toggle-coupon" aria-expanded="true">
          <span class="cart-coupon-ic" aria-hidden="true">🎟️</span>
          ¿Tenés un cupón?
          <span class="cart-coupon-chev cart-coupon-chev--open" aria-hidden="true">▾</span>
        </button>
        <div class="cart-coupon-form">
          <input type="text" class="cart-coupon-input" data-coupon-input placeholder="Ingresá tu código" autocomplete="off" spellcheck="false" maxlength="32" aria-label="Código de cupón" aria-invalid="${couponError ? 'true' : 'false'}" />
          <button type="button" class="cart-coupon-apply" data-cart-action="apply-coupon">Aplicar</button>
        </div>
        ${couponError ? `<div class="cart-coupon-err" role="alert">${couponError}</div>` : ''}
      </div>
    `;
  }

  function renderCrossSell() {
    const suggestions = getSuggestions(2);
    if (!suggestions.length) return '';
    return `
      <div class="cart-xsell">
        <div class="cart-xsell-head">También podés llevar</div>
        <div class="cart-xsell-list">
          ${suggestions.map((p, i) => `
            <div class="cart-xsell-item">
              <div class="cart-xsell-thumb">${p.img ? `<img src="${p.img}" alt="" loading="lazy" />` : ''}</div>
              <div class="cart-xsell-meta">
                <div class="cart-xsell-brand">${p.brand}</div>
                <div class="cart-xsell-name">${p.name}</div>
                <div class="cart-xsell-price">${typeof p.price === 'string' ? p.price : formatARS(parsePrice(p.price))}</div>
              </div>
              <button type="button" class="cart-xsell-add" data-cart-action="add-suggestion" data-idx="${i}" aria-label="Agregar ${p.brand} ${p.name}">+ Agregar</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderDiscountsBlock(subtotal) {
    if (!subtotal) return '';
    const disc = getDiscount();
    const jueves = getJuevesDescuento();
    const baseAfterCoupon = subtotal - disc.amount;
    const baseAfterJueves = baseAfterCoupon - jueves.ahorro;
    const conEfectivo = baseAfterJueves * (1 - DESC_EFECTIVO);
    const ahorroEfectivo = subtotal - conEfectivo;
    const porCuota = baseAfterJueves / CUOTAS_TARJETA;

    return `
      <div class="cart-discount-box">
        <div class="cart-row">
          <span class="cart-row-l">Subtotal</span>
          <span class="cart-row-v">${formatARS(subtotal)}</span>
        </div>
        ${disc.amount > 0 ? `
          <div class="cart-row cart-row-coupon">
            <span class="cart-row-l">Cupón ${disc.code}</span>
            <span class="cart-row-v">− ${formatARS(disc.amount)}</span>
          </div>
        ` : ''}
        ${jueves.activo ? `
          <div class="cart-row cart-row-jueves">
            <span class="cart-row-l">Jueves −${Math.round(jueves.porcentaje * 100)}%</span>
            <span class="cart-row-v">− ${formatARS(jueves.ahorro)}</span>
          </div>
        ` : ''}
        <div class="cart-row cart-row-best">
          <span class="cart-row-l">Con efectivo <span class="cart-best-pct">−${Math.round(DESC_EFECTIVO * 100)}%</span></span>
          <span class="cart-row-v cart-row-v--red">${formatARS(conEfectivo)}</span>
        </div>
        <div class="cart-row cart-row-save">
          <span class="cart-row-l">Ahorrás</span>
          <span class="cart-row-v cart-row-v--red">${formatARS(ahorroEfectivo)}</span>
        </div>
        <div class="cart-row cart-row-cuotas">
          <span class="cart-row-l">${CUOTAS_TARJETA} cuotas s/i</span>
          <span class="cart-row-v">${CUOTAS_TARJETA} × ${formatARS(porCuota)}</span>
        </div>
      </div>
    `;
  }

  // Banner verde "¡Jueves de Suplemento!" cuando aplica, o nudge cuando falta poco
  function renderJuevesBlock() {
    const j = getJuevesDescuento();
    if (j.activo) {
      return `
        <div class="cart-jueves cart-jueves--on" role="status">
          <span class="cart-jueves-ic" aria-hidden="true">🎉</span>
          <div class="cart-jueves-txt">
            <strong>${j.mensaje}</strong>
            <span class="cart-jueves-save">Ahorrás ${formatARS(j.ahorro)}</span>
          </div>
        </div>
      `;
    }
    const prog = getJuevesProgreso();
    if (prog.mostrar) {
      return `
        <div class="cart-jueves cart-jueves--nudge" role="status">
          <span class="cart-jueves-ic" aria-hidden="true">💡</span>
          <div class="cart-jueves-txt">${prog.mensaje}</div>
        </div>
      `;
    }
    return '';
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
          <a href="index.html" class="cart-btn-outline" data-cart-close>Ver catálogo →</a>
        </div>
      `;
      foot.innerHTML = '';
      body.querySelectorAll('[data-cart-close]').forEach(a => a.addEventListener('click', closeDrawer));
      return;
    }

    const itemsHTML = items.map(it => `
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

    body.innerHTML = itemsHTML + renderCrossSell();

    const { subtotal, count } = totals();
    foot.innerHTML = `
      ${renderShippingBar(subtotal)}
      ${renderJuevesBlock()}
      ${renderCouponBlock()}
      ${renderDiscountsBlock(subtotal)}
      <div class="cart-row cart-row-mute">
        <span class="cart-row-l">${count} ${count === 1 ? 'producto' : 'productos'} · Envío calculado en checkout</span>
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
    couponOpen = false;
    couponError = '';
    if (lastTrigger && typeof lastTrigger.focus === 'function') lastTrigger.focus();
  }

  // ---------- WIRING ----------
  function attachCartButtons() {
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

  // ---------- PUBLIC API ----------
  window.Cart = {
    // API original (no romper)
    add, remove, setQty, clear,
    open: openDrawer, close: closeDrawer,
    items: () => items.slice(),
    totals,
    attach: attachCartButtons,
    formatARS, parsePrice,
    // Métodos nuevos
    applyCoupon, removeCoupon, getActiveCoupon, getDiscount, getSuggestions,
    getJuevesDescuento, getJuevesProgreso,
    // Constantes públicas
    config: {
      ENVIO_GRATIS_DESDE,
      DESC_EFECTIVO,
      DESC_TRANSFERENCIA,
      CUOTAS_TARJETA,
      CUPONES: Object.assign({}, CUPONES),
      JUEVES_DE_SUPLEMENTO: Object.assign({}, JUEVES_DE_SUPLEMENTO)
    }
  };

  if (document.readyState !== 'loading') { attachCartButtons(); syncBadges(); }
  else document.addEventListener('DOMContentLoaded', () => { attachCartButtons(); syncBadges(); });
})();
