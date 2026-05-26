(function () {
  'use strict';

  // Categorías del menú mobile — con ícono y subcategorías
  const NAV_LINKS = [
    {
      href: 'suplementos.html', label: 'Suplementos',
      icon: '<path d="M8 2h8M9 2v4.5L5.5 13a4 4 0 0 0 3.5 6h6a4 4 0 0 0 3.5-6L15 6.5V2M6.5 12h11"/>',
      subs: [
        { href: 'suplementos.html?tipo=proteinas', label: 'Proteínas' },
        { href: 'suplementos.html?tipo=creatinas', label: 'Creatinas' },
        { href: 'suplementos.html?tipo=pre-entrenos', label: 'Pre-entrenos' },
        { href: 'suplementos.html?tipo=bcaa', label: 'BCAA y aminoácidos' },
        { href: 'suplementos.html?tipo=quemadores', label: 'Quemadores' },
        { href: 'suplementos.html?tipo=vitaminas', label: 'Vitaminas' },
        { href: 'suplementos.html?tipo=combos', label: 'Combos' },
      ],
    },
    {
      href: 'supermercado.html', label: 'Supermercado',
      icon: '<path d="M3 4h2l2.5 11h10L20 7H6M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM17 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>',
      subs: [
        { href: 'supermercado.html?tipo=almacen', label: 'Almacén' },
        { href: 'supermercado.html?tipo=bebidas', label: 'Bebidas' },
        { href: 'supermercado.html?tipo=cuidado-personal', label: 'Cuidado personal' },
      ],
    },
    {
      href: 'electro.html', label: 'Electro-Hogar',
      icon: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M9 6h2M9 13h6M9 16h6"/>',
      subs: [
        { href: 'electro.html?tipo=cocina', label: 'Electro de cocina' },
        { href: 'electro.html?tipo=hogar', label: 'Hogar y bazar' },
      ],
    },
    {
      href: 'bananero.html', label: 'El Bananero',
      icon: '<path d="M5 18c8 4 14-3 14-11M5 18c-1-3 0-6 3-7M5 18l-2 2M19 7c1-1 2-1 2-3"/>',
      subs: [],
    },
    {
      href: 'bodega.html', label: 'Bodega',
      icon: '<path d="M8 2h8M9 6v4a3 3 0 0 0 6 0V6M12 14v8M9 22h6"/>',
      subs: [],
    },
    {
      href: 'sobre-nosotros.html', label: 'Sobre nosotros',
      icon: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
      subs: [],
    },
  ];

  let drawer = null;
  let backdrop = null;

  function ensureDrawer() {
    if (drawer) return;

    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    backdrop.addEventListener('click', close);

    drawer = document.createElement('aside');
    drawer.className = 'nav-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Menú de navegación');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.innerHTML = `
      <header class="nav-drawer-head">
        <div class="nav-drawer-brand">
          <img src="assets/mora_minorista.png" alt="Morashop" />
        </div>
        <button class="nav-drawer-close" type="button" aria-label="Cerrar menú">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </header>
      <nav class="nav-drawer-links">
        ${NAV_LINKS.map((l) => {
          const hasSubs = l.subs && l.subs.length > 0;
          return `
          <div class="nav-drawer-group">
            <div class="nav-drawer-row">
              <a href="${l.href}" class="nav-drawer-link">
                <span class="nav-drawer-ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${l.icon}</svg>
                </span>
                <span class="nav-drawer-label">${l.label}</span>
              </a>
              ${hasSubs ? `<button class="nav-drawer-toggle" type="button" aria-label="Ver subcategorías">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
              </button>` : ''}
            </div>
            ${hasSubs ? `<div class="nav-drawer-subs">
              ${l.subs.map(s => `<a href="${s.href}" class="nav-drawer-sub">${s.label}</a>`).join('')}
            </div>` : ''}
          </div>`;
        }).join('')}
      </nav>
      <footer class="nav-drawer-foot">
        <a href="https://wa.me/" class="nav-drawer-wa" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.92.5 3.78 1.46 5.43L2 22l4.78-1.55a9.85 9.85 0 0 0 5.26 1.5c5.45 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 17.92c-1.6 0-3.17-.43-4.55-1.24l-.33-.2-3.16 1.02 1.04-3.06-.22-.34a8.05 8.05 0 0 1-1.27-4.31c0-4.5 3.66-8.17 8.17-8.17 4.5 0 8.17 3.66 8.17 8.17.01 4.51-3.66 8.13-8.16 8.13z"/></svg>
          WhatsApp
        </a>
      </footer>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);

    drawer.querySelector('.nav-drawer-close').addEventListener('click', close);
    // Links de categoría y subcategoría cierran el drawer
    drawer.querySelectorAll('.nav-drawer-link, .nav-drawer-sub').forEach(a => {
      a.addEventListener('click', close);
    });
    // Toggle de subcategorías (no cierra, despliega)
    drawer.querySelectorAll('.nav-drawer-toggle').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const group = btn.closest('.nav-drawer-group');
        group.classList.toggle('open');
      });
    });
  }

  function open() {
    ensureDrawer();
    requestAnimationFrame(() => {
      drawer.classList.add('open');
      backdrop.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('nav-locked');
    });
  }

  function close() {
    if (!drawer) return;
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('nav-locked');
  }

  function attach() {
    // Bindea AMBOS botones: .hamb (desktop, visible >768px) y .hamb-mobile (mobile, visible <=768px)
    document.querySelectorAll('.hamb, .hamb-mobile').forEach(btn => {
      if (btn._navBound) return;
      btn._navBound = true;
      btn.addEventListener('click', e => {
        e.preventDefault();
        open();
      });
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) close();
  });

  if (document.readyState !== 'loading') attach();
  else document.addEventListener('DOMContentLoaded', attach);

  window.NavMenu = { open, close, attach };
})();
