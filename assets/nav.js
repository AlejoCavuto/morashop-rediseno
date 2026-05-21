(function () {
  'use strict';

  // Links del nav mobile — mismas opciones del nav desktop
  const NAV_LINKS = [
    { href: 'suplementos.html', label: 'Suplementos' },
    { href: 'supermercado.html', label: 'Supermercado' },
    { href: 'electro.html', label: 'Electro-Hogar' },
    { href: 'bananero.html', label: 'El Bananero' },
    { href: 'mayoristas.html', label: 'Mayoristas' },
    { href: 'sobre-nosotros.html', label: 'Sobre nosotros' },
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
        ${NAV_LINKS.map((l, i) => `
          <a href="${l.href}" class="nav-drawer-link">
            <span class="nav-drawer-num">— 0${i + 1}</span>
            <span class="nav-drawer-label">${l.label}</span>
            <span class="nav-drawer-arrow">→</span>
          </a>
        `).join('')}
      </nav>
      <footer class="nav-drawer-foot">
        <a href="suplementos.html" class="nav-drawer-cta">Ver catálogo <span>→</span></a>
        <a href="https://wa.me/" class="nav-drawer-wa" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.92.5 3.78 1.46 5.43L2 22l4.78-1.55a9.85 9.85 0 0 0 5.26 1.5c5.45 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 17.92c-1.6 0-3.17-.43-4.55-1.24l-.33-.2-3.16 1.02 1.04-3.06-.22-.34a8.05 8.05 0 0 1-1.27-4.31c0-4.5 3.66-8.17 8.17-8.17 4.5 0 8.17 3.66 8.17 8.17.01 4.51-3.66 8.13-8.16 8.13z"/></svg>
          WhatsApp
        </a>
      </footer>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);

    drawer.querySelector('.nav-drawer-close').addEventListener('click', close);
    // Cualquier link cierra el drawer (navegación natural)
    drawer.querySelectorAll('.nav-drawer-link, .nav-drawer-cta').forEach(a => {
      a.addEventListener('click', close);
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
