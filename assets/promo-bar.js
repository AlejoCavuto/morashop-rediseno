/* ==========================================================================
   PROMO BAR DINÁMICA — Jueves de Suplemento
   --------------------------------------------------------------------------
   3 modos según día/hora:
   • EDUCATIVO  (lun, mar, mié <18hs, vie, sáb, dom) → rojo, copy informativo
   • PRE-JUEVES (mié ≥18hs)                          → amarillo, "Mañana es..."
   • JUEVES     (jue 00:00-23:59)                    → amarillo, countdown live
   Cerrable con X (cookie 7 días). Re-render al pasar de día.
   ========================================================================== */
(function () {
  'use strict';

  const CONFIG = {
    enabled: true,
    storageKey: 'morashop_promo_jueves_closed_at',
    cooldownDays: 7,
    link: 'suplementos.html',
  };

  if (!CONFIG.enabled) return;

  // Cookie cerrado
  try {
    const closedAt = parseInt(localStorage.getItem(CONFIG.storageKey) || '0', 10);
    if (closedAt) {
      const dias = (Date.now() - closedAt) / (1000 * 60 * 60 * 24);
      if (dias < CONFIG.cooldownDays) return;
    }
  } catch (e) {}

  /* Devuelve el modo según día/hora */
  function getMode() {
    const now = new Date();
    const day = now.getDay();   // 0=dom 1=lun 2=mar 3=mié 4=jue 5=vie 6=sáb
    const hour = now.getHours();
    if (day === 4) return 'jueves';                       // jueves todo el día
    if (day === 3 && hour >= 18) return 'pre-jueves';     // mié ≥18hs
    return 'educativo';                                    // resto
  }

  /* Cuenta regresiva hasta fin de jueves (23:59:59) */
  function timeUntilEndOfThursday() {
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    const ms = end - now;
    if (ms < 0) return null;
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return { h, m, s };
  }
  /* Cuenta regresiva hasta inicio del jueves (cuando es mié ≥18hs) */
  function timeUntilThursdayStart() {
    const now = new Date();
    const start = new Date(now);
    start.setHours(24, 0, 0, 0); // medianoche del jueves
    const ms = start - now;
    if (ms < 0) return null;
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return { h, m };
  }

  // CSS scoped
  if (!document.getElementById('promoBarStyles')) {
    const style = document.createElement('style');
    style.id = 'promoBarStyles';
    style.textContent = `
      .mora-promobar{
        color:#fff;font-family:"Inter",system-ui,sans-serif;
        font-size:13.5px;font-weight:600;line-height:1;
        position:relative;z-index:55;
        box-shadow:0 1px 0 rgba(0,0,0,0.08);
        transition:background .25s ease;
      }
      .mora-promobar.mode-educativo{background:linear-gradient(90deg,#E8341A 0%,#C42710 100%)}
      .mora-promobar.mode-pre-jueves,
      .mora-promobar.mode-jueves{background:linear-gradient(90deg,#FFD400 0%,#FFA800 100%);color:#1A2744}
      .mora-promobar-inner{
        display:flex;align-items:center;justify-content:center;gap:12px;
        padding:0 48px;max-width:1400px;margin:0 auto;
        min-height:42px;text-align:center;
      }
      .mora-promobar-emoji{display:inline-block;font-size:16px;line-height:1;flex-shrink:0;animation:moraPromoPulse 2s ease-in-out infinite}
      .mora-promobar.mode-jueves .mora-promobar-emoji{animation:moraPromoPulse 1s ease-in-out infinite;font-size:18px}
      .mora-promobar-text{display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:center;line-height:1.2}
      .mora-promobar-hl{font-weight:900;letter-spacing:0.02em}
      .mora-promobar.mode-educativo .mora-promobar-hl{color:#FFD400}
      .mora-promobar.mode-pre-jueves .mora-promobar-hl,
      .mora-promobar.mode-jueves .mora-promobar-hl{color:#E8341A;font-size:15px}
      .mora-promobar-countdown{
        display:inline-flex;align-items:center;gap:4px;
        background:rgba(0,0,0,0.92);color:#FFD400;
        padding:5px 10px;border-radius:6px;font-weight:800;
        font-family:"Inter",monospace;font-size:13px;letter-spacing:0.04em;
        white-space:nowrap;
      }
      .mora-promobar-countdown .label{font-size:10px;letter-spacing:0.1em;opacity:0.85;color:#fff;font-weight:600;text-transform:uppercase}
      .mora-promobar-cta{
        color:#fff;font-weight:800;text-decoration:none;
        background:rgba(0,0,0,0.18);border-radius:999px;
        padding:7px 16px;letter-spacing:0.04em;text-transform:uppercase;font-size:11.5px;
        white-space:nowrap;transition:background .15s ease, transform .15s ease;
      }
      .mora-promobar.mode-pre-jueves .mora-promobar-cta,
      .mora-promobar.mode-jueves .mora-promobar-cta{background:#1A2744;color:#fff}
      .mora-promobar-cta:hover{background:rgba(0,0,0,0.32);transform:translateY(-1px)}
      .mora-promobar.mode-pre-jueves .mora-promobar-cta:hover,
      .mora-promobar.mode-jueves .mora-promobar-cta:hover{background:#0F1729}
      .mora-promobar-close{
        position:absolute;right:6px;top:50%;transform:translateY(-50%);
        width:28px;height:28px;border-radius:999px;background:transparent;
        border:0;color:currentColor;opacity:0.7;cursor:pointer;
        display:grid;place-items:center;transition:opacity .15s ease, background .15s ease;
      }
      .mora-promobar-close:hover{opacity:1;background:rgba(0,0,0,0.12)}
      .mora-promobar-close svg{width:13px;height:13px}
      @keyframes moraPromoPulse{
        0%,100%{transform:scale(1)}
        50%{transform:scale(1.18)}
      }
      @media (max-width: 640px){
        .mora-promobar{font-size:12px}
        .mora-promobar-inner{padding:6px 38px 6px 14px;gap:6px;min-height:40px;flex-wrap:wrap}
        .mora-promobar-hl{font-size:13px}
        .mora-promobar-emoji{font-size:14px}
        .mora-promobar-countdown{padding:3px 7px;font-size:11.5px}
        .mora-promobar-countdown .label{display:none}
        .mora-promobar-cta{display:none}
      }
      @media (prefers-reduced-motion: reduce){
        .mora-promobar-emoji{animation:none}
      }
    `;
    document.head.appendChild(style);
  }

  function renderInner(mode) {
    if (mode === 'jueves') {
      const t = timeUntilEndOfThursday();
      const pad = n => String(n).padStart(2,'0');
      const cd = t ? `${pad(t.h)}:${pad(t.m)}:${pad(t.s)}` : '00:00:00';
      return `
        <span class="mora-promobar-emoji" aria-hidden="true">⚡</span>
        <span class="mora-promobar-text">
          <strong>¡Hoy es Jueves de Suplemento!</strong>
          Llevá 3 y pagás <span class="mora-promobar-hl">10% menos</span>
        </span>
        <span class="mora-promobar-countdown" aria-live="polite">
          <span class="label">Termina en</span>
          <span id="moraCountdown">${cd}</span>
        </span>
        <a class="mora-promobar-cta" href="${CONFIG.link}">Aprovechar</a>
      `;
    }
    if (mode === 'pre-jueves') {
      const t = timeUntilThursdayStart();
      const cd = t ? `${t.h}h ${t.m}m` : '';
      return `
        <span class="mora-promobar-emoji" aria-hidden="true">🔥</span>
        <span class="mora-promobar-text">
          <strong>Mañana es Jueves de Suplemento</strong> — Prepará tu carrito y ahorrá <span class="mora-promobar-hl">10%</span>
        </span>
        <span class="mora-promobar-countdown">
          <span class="label">Empieza en</span>
          <span>${cd}</span>
        </span>
        <a class="mora-promobar-cta" href="${CONFIG.link}">Ver suplementos</a>
      `;
    }
    // educativo
    return `
      <span class="mora-promobar-emoji" aria-hidden="true">🔥</span>
      <span class="mora-promobar-text">
        Todos los jueves: llevá 3 suplementos y te ahorrás <span class="mora-promobar-hl">10%</span>
      </span>
      <a class="mora-promobar-cta" href="${CONFIG.link}">Aprovechar</a>
    `;
  }

  let bar;
  let mode;
  let tickInterval;

  function render() {
    mode = getMode();
    bar = document.createElement('div');
    bar.className = 'mora-promobar mode-' + mode;
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Promoción Jueves de Suplemento');
    bar.innerHTML = `
      <div class="mora-promobar-inner">
        ${renderInner(mode)}
        <button class="mora-promobar-close" type="button" aria-label="Cerrar promoción">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
    `;
    document.body.insertBefore(bar, document.body.firstChild);

    bar.querySelector('.mora-promobar-close').addEventListener('click', () => {
      try { localStorage.setItem(CONFIG.storageKey, String(Date.now())); } catch (e) {}
      clearInterval(tickInterval);
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

    // Countdown live solo si es jueves
    if (mode === 'jueves') {
      tickInterval = setInterval(() => {
        const cdEl = document.getElementById('moraCountdown');
        if (!cdEl) { clearInterval(tickInterval); return; }
        const t = timeUntilEndOfThursday();
        if (!t) { clearInterval(tickInterval); return; }
        const pad = n => String(n).padStart(2,'0');
        cdEl.textContent = `${pad(t.h)}:${pad(t.m)}:${pad(t.s)}`;
      }, 1000);
    }

    // Re-render al pasar de día (chequea cada minuto si el modo cambió)
    const modeCheck = setInterval(() => {
      const newMode = getMode();
      if (newMode !== mode) {
        clearInterval(modeCheck);
        clearInterval(tickInterval);
        bar.remove();
        render();
      }
    }, 60000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
