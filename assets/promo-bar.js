/* ==========================================================================
   PROMO BAR — bandita persistente "Jueves de Suplemento"
   --------------------------------------------------------------------------
   Educa al cliente: TODOS los jueves, 10% OFF llevando 3 suplementos.
   Aparece arriba de todo (sobre el nav). Cerrable con X — cookie de 7 días.

   Para cambiar el copy o desactivar: editá CONFIG abajo.
   Para Tiendanube: portable como HTML estático + JS inyectado desde
   "Edición avanzada" del theme Trend. No depende de ninguna lib.
   ========================================================================== */
(function () {
  'use strict';

  const CONFIG = {
    enabled: true,
    storageKey: 'morashop_promo_jueves_closed_at',
    cooldownDays: 7,
    link: 'suplementos.html',
    // Si querés cambiar el copy o el destacado, tocá acá:
    emoji: '🔥',
    // Desktop (≥641px): "Todos los jueves: llevá 3 suplementos y te ahorrás 10%"
    text: 'Todos los jueves: llevá 3 suplementos y te ahorrás',
    highlight: '10%',
    tail: '',
    ctaText: 'Aprovechar',
    // Mobile (≤640px): "Jueves: 3 supl. = ahorrás 10%"
    mobileText: 'Jueves: 3 supl. = ahorrás',
    mobileTail: '',
  };

  if (!CONFIG.enabled) return;

  // ¿La cerró el usuario hace menos de N días? → no mostrar
  try {
    const closedAt = parseInt(localStorage.getItem(CONFIG.storageKey) || '0', 10);
    if (closedAt) {
      const diasDesdeCerrado = (Date.now() - closedAt) / (1000 * 60 * 60 * 24);
      if (diasDesdeCerrado < CONFIG.cooldownDays) return;
    }
  } catch (e) { /* localStorage bloqueado → seguir y mostrar */ }

  // Inyectar CSS (una sola vez, scope con clase única)
  if (!document.getElementById('promoBarStyles')) {
    const style = document.createElement('style');
    style.id = 'promoBarStyles';
    style.textContent = `
      .mora-promobar{
        background:linear-gradient(90deg,#E8341A 0%,#C42710 100%);color:#fff;
        font-family:"Inter",system-ui,sans-serif;
        font-size:13.5px;font-weight:600;line-height:1;
        position:relative;z-index:55;
        box-shadow:0 1px 0 rgba(0,0,0,0.06);
      }
      .mora-promobar-inner{
        display:flex;align-items:center;justify-content:center;gap:12px;
        padding:0 48px;max-width:1400px;margin:0 auto;
        height:38px;text-align:center;white-space:nowrap;
      }
      .mora-promobar-emoji{display:inline-block;font-size:15px;line-height:1;flex-shrink:0;animation:moraPromoPulse 2.2s ease-in-out infinite}
      .mora-promobar-text{display:inline-flex;align-items:center;gap:6px;min-width:0}
      .mora-promobar-text-mobile{display:none}
      .mora-promobar-hl{color:#FFD400;font-weight:900;letter-spacing:0.02em;font-size:14.5px;white-space:nowrap}
      .mora-promobar-cta{
        color:#fff;font-weight:800;text-decoration:none;
        background:rgba(0,0,0,0.18);border-radius:999px;
        padding:6px 14px;letter-spacing:0.03em;text-transform:uppercase;font-size:11.5px;
        white-space:nowrap;transition:background .15s ease, transform .15s ease;
      }
      .mora-promobar-cta:hover{background:rgba(0,0,0,0.28);transform:translateY(-1px)}
      .mora-promobar-close{
        position:absolute;right:6px;top:50%;transform:translateY(-50%);
        width:28px;height:28px;border-radius:999px;background:transparent;
        border:0;color:#fff;opacity:0.75;cursor:pointer;
        display:grid;place-items:center;transition:opacity .15s ease, background .15s ease;
      }
      .mora-promobar-close:hover{opacity:1;background:rgba(0,0,0,0.18)}
      .mora-promobar-close svg{width:13px;height:13px}
      @keyframes moraPromoPulse{
        0%,100%{transform:scale(1)}
        50%{transform:scale(1.15)}
      }
      @media (max-width: 640px){
        .mora-promobar{font-size:12px}
        .mora-promobar-inner{padding:0 36px 0 12px;gap:7px;height:36px;white-space:normal}
        .mora-promobar-hl{font-size:13px}
        .mora-promobar-emoji{font-size:13px}
        .mora-promobar-cta{display:none}  /* mobile: solo emoji + copy + X */
        .mora-promobar-text-desktop{display:none}
        .mora-promobar-text-mobile{display:inline-flex}
      }
      @media (prefers-reduced-motion: reduce){
        .mora-promobar-emoji{animation:none}
      }
    `;
    document.head.appendChild(style);
  }

  // Render
  function render() {
    const bar = document.createElement('div');
    bar.className = 'mora-promobar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Promoción Jueves de Suplemento');
    bar.innerHTML = `
      <div class="mora-promobar-inner">
        <span class="mora-promobar-emoji" aria-hidden="true">${CONFIG.emoji || ''}</span>
        <span class="mora-promobar-text mora-promobar-text-desktop">${CONFIG.text} <span class="mora-promobar-hl">${CONFIG.highlight}</span>${CONFIG.tail ? ' ' + CONFIG.tail : ''}</span>
        <span class="mora-promobar-text mora-promobar-text-mobile">${CONFIG.mobileText || CONFIG.text} <span class="mora-promobar-hl">${CONFIG.highlight}</span>${CONFIG.mobileTail ? ' ' + CONFIG.mobileTail : ''}</span>
        <a class="mora-promobar-cta" href="${CONFIG.link}">${CONFIG.ctaText}</a>
        <button class="mora-promobar-close" type="button" aria-label="Cerrar promoción">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
    `;
    document.body.insertBefore(bar, document.body.firstChild);

    bar.querySelector('.mora-promobar-close').addEventListener('click', () => {
      try { localStorage.setItem(CONFIG.storageKey, String(Date.now())); } catch (e) {}
      bar.style.transition = 'opacity .2s ease, max-height .25s ease, padding .25s ease';
      bar.style.overflow = 'hidden';
      bar.style.maxHeight = bar.offsetHeight + 'px';
      requestAnimationFrame(() => {
        bar.style.opacity = '0';
        bar.style.maxHeight = '0px';
        bar.style.padding = '0';
      });
      setTimeout(() => bar.remove(), 280);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
