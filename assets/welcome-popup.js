/* ==========================================================================
   WELCOME POPUP — captura email primera visita, activa cupón BIENVENIDO 15%
   --------------------------------------------------------------------------
   Aparece 6s después de la primera visita. Cerrable. Cookie de 30 días si
   se cierra sin claim, indefinido si se claimea.
   ========================================================================== */
(function () {
  'use strict';

  const CONFIG = {
    enabled: true,
    storageKey: 'morashop_welcome_popup',
    cooldownDays: 30,
    showAfterMs: 6000,
    couponCode: 'BIENVENIDO',
    discountLabel: '10% OFF',
  };

  if (!CONFIG.enabled) return;

  // ¿Ya lo vio / claimeo? → no mostrar
  try {
    const data = JSON.parse(localStorage.getItem(CONFIG.storageKey) || '{}');
    if (data.claimed) return; // claimeó: no mostrar nunca
    if (data.closedAt) {
      const dias = (Date.now() - data.closedAt) / (1000 * 60 * 60 * 24);
      if (dias < CONFIG.cooldownDays) return;
    }
  } catch (e) { /* ignore */ }

  if (!document.getElementById('moraWelcomeStyles')) {
    const style = document.createElement('style');
    style.id = 'moraWelcomeStyles';
    style.textContent = `
      .mora-welcome-backdrop{
        position:fixed;inset:0;background:rgba(26,39,68,0.65);
        backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);
        z-index:9000;display:grid;place-items:center;
        opacity:0;transition:opacity .3s ease;padding:20px;
      }
      .mora-welcome-backdrop.open{opacity:1}
      .mora-welcome-modal{
        background:#fff;border-radius:14px;max-width:480px;width:100%;
        box-shadow:0 24px 60px -12px rgba(0,0,0,0.4);
        font-family:"Inter",system-ui,sans-serif;
        transform:translateY(20px);transition:transform .35s cubic-bezier(.2,.7,.2,1);
        position:relative;overflow:hidden;
      }
      .mora-welcome-backdrop.open .mora-welcome-modal{transform:translateY(0)}
      .mora-welcome-head{
        background:linear-gradient(135deg,#E8341A 0%,#C42710 100%);color:#fff;
        padding:28px 28px 22px;text-align:center;position:relative;
      }
      .mora-welcome-emoji{font-size:38px;line-height:1;margin-bottom:8px}
      .mora-welcome-title{
        font-family:"Barlow Condensed",sans-serif;font-weight:900;
        font-size:28px;line-height:1;margin:0 0 6px;letter-spacing:-0.01em;
        text-transform:uppercase;
      }
      .mora-welcome-title strong{color:#FFD400;font-size:36px;display:inline-block;margin:0 4px}
      .mora-welcome-sub{font-size:13px;font-weight:500;opacity:0.95;margin:0}
      .mora-welcome-body{padding:24px 28px 28px}
      .mora-welcome-form{display:flex;flex-direction:column;gap:12px}
      .mora-welcome-input{
        width:100%;padding:14px 16px;font-size:15px;border:1.5px solid #cfd3d9;
        border-radius:8px;font-family:inherit;color:#1A2744;
        transition:border-color .15s ease;
      }
      .mora-welcome-input:focus{outline:0;border-color:#1A2744}
      .mora-welcome-submit{
        background:#1A2744;color:#fff;border:0;padding:14px;font-size:14px;
        font-weight:800;letter-spacing:0.06em;text-transform:uppercase;
        border-radius:8px;cursor:pointer;
        font-family:"Barlow Condensed",sans-serif;
        transition:background .15s ease,transform .15s ease;
      }
      .mora-welcome-submit:hover{background:#0F1729;transform:translateY(-1px)}
      .mora-welcome-skip{
        background:transparent;border:0;color:#8a8f98;font-size:12px;
        text-decoration:underline;cursor:pointer;padding:8px;margin-top:4px;
        font-family:inherit;
      }
      .mora-welcome-skip:hover{color:#1A2744}
      .mora-welcome-close{
        position:absolute;top:10px;right:10px;width:30px;height:30px;
        background:rgba(255,255,255,0.18);border:0;color:#fff;border-radius:999px;
        cursor:pointer;display:grid;place-items:center;
        transition:background .15s ease;
      }
      .mora-welcome-close:hover{background:rgba(255,255,255,0.32)}
      .mora-welcome-close svg{width:14px;height:14px}
      .mora-welcome-success{
        text-align:center;padding:30px 24px;
      }
      .mora-welcome-success-emoji{font-size:48px;margin-bottom:12px}
      .mora-welcome-success h3{
        font-family:"Barlow Condensed",sans-serif;font-weight:900;font-size:24px;
        margin:0 0 8px;color:#1A2744;text-transform:uppercase;
      }
      .mora-welcome-coupon{
        background:#FFD400;color:#1A2744;font-family:"Barlow Condensed",sans-serif;
        font-weight:900;font-size:22px;letter-spacing:0.08em;
        padding:10px 18px;border-radius:8px;display:inline-block;margin:12px 0;
        border:2px dashed #1A2744;
      }
      .mora-welcome-success p{font-size:13px;color:#8a8f98;margin:8px 0 0}
      @media (max-width:480px){
        .mora-welcome-head{padding:22px 20px 18px}
        .mora-welcome-emoji{font-size:32px}
        .mora-welcome-title{font-size:22px}
        .mora-welcome-title strong{font-size:30px}
        .mora-welcome-body{padding:20px}
      }
    `;
    document.head.appendChild(style);
  }

  function show() {
    const backdrop = document.createElement('div');
    backdrop.className = 'mora-welcome-backdrop';
    backdrop.innerHTML = `
      <div class="mora-welcome-modal" role="dialog" aria-modal="true" aria-labelledby="moraWelcomeTitle">
        <div class="mora-welcome-head">
          <button class="mora-welcome-close" type="button" aria-label="Cerrar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <div class="mora-welcome-emoji">🎯</div>
          <h2 class="mora-welcome-title" id="moraWelcomeTitle">Llevate <strong>${CONFIG.discountLabel}</strong> en tu primera compra</h2>
          <p class="mora-welcome-sub">Dejanos tu email y te mandamos el cupón al toque</p>
        </div>
        <div class="mora-welcome-body" id="moraWelcomeBody">
          <form class="mora-welcome-form" id="moraWelcomeForm">
            <input class="mora-welcome-input" type="email" name="email" placeholder="tucorreo@gmail.com" required autocomplete="email" />
            <button class="mora-welcome-submit" type="submit">Quiero mi ${CONFIG.discountLabel}</button>
            <button class="mora-welcome-skip" type="button" id="moraWelcomeSkip">No, gracias</button>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
    requestAnimationFrame(() => backdrop.classList.add('open'));

    const close = (claimed = false) => {
      backdrop.classList.remove('open');
      try {
        const data = JSON.parse(localStorage.getItem(CONFIG.storageKey) || '{}');
        data.closedAt = Date.now();
        if (claimed) data.claimed = true;
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(data));
      } catch (e) {}
      setTimeout(() => backdrop.remove(), 320);
    };

    backdrop.querySelector('.mora-welcome-close').addEventListener('click', () => close(false));
    backdrop.querySelector('#moraWelcomeSkip').addEventListener('click', () => close(false));
    backdrop.addEventListener('click', e => {
      if (e.target === backdrop) close(false);
    });

    backdrop.querySelector('#moraWelcomeForm').addEventListener('submit', async e => {
      e.preventDefault();
      const email = e.target.email.value.trim();
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return;

      const submitBtn = backdrop.querySelector('.mora-welcome-submit');
      const origBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando…';

      try {
        const res = await fetch('/api/welcome-coupon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        const body = backdrop.querySelector('#moraWelcomeBody');

        // Caso 1: éxito — cupón enviado
        if (res.ok && data.ok) {
          try { localStorage.setItem('morashop_email', email); } catch (e) {}
          body.innerHTML = `
            <div class="mora-welcome-success">
              <div class="mora-welcome-success-emoji">🎉</div>
              <h3>¡Listo! Te enviamos tu cupón</h3>
              <div class="mora-welcome-coupon">${data.code || CONFIG.couponCode}</div>
              <p>Revisá tu casilla de email.<br/>El descuento se aplica en el checkout.</p>
            </div>
          `;
          setTimeout(() => close(true), 5000);
          return;
        }

        // Caso 2: ya compró antes (cliente recurrente)
        if (data.error === 'ya_compraste') {
          body.innerHTML = `
            <div class="mora-welcome-success">
              <div class="mora-welcome-success-emoji">🙏</div>
              <h3>¡Ya sos cliente!</h3>
              <p style="margin-top:12px">El cupón de bienvenida es solo para tu primera compra.<br/>Gracias por elegir Morashop ❤️</p>
            </div>
          `;
          setTimeout(() => close(true), 4000);
          return;
        }

        // Caso 3: ya pediste el cupón antes
        if (data.error === 'ya_capturado') {
          body.innerHTML = `
            <div class="mora-welcome-success">
              <div class="mora-welcome-success-emoji">📧</div>
              <h3>Ya te enviamos un cupón</h3>
              <p style="margin-top:12px">Revisá tu casilla (o el spam).<br/>Si no lo encontrás escribinos por WhatsApp.</p>
            </div>
          `;
          setTimeout(() => close(true), 4000);
          return;
        }

        // Caso 4: error genérico
        submitBtn.disabled = false;
        submitBtn.textContent = origBtnText;
        alert(data.message || 'Hubo un problema. Intentalo de nuevo en un rato.');

      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = origBtnText;
        console.error('welcome-popup fetch error:', err);
        alert('Sin conexión. Intentalo de nuevo.');
      }
    });
  }

  function trigger() {
    setTimeout(show, CONFIG.showAfterMs);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trigger);
  } else {
    trigger();
  }
})();
