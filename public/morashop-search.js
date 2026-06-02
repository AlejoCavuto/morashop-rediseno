/*!
 * Morashop Search Overlay
 * Standalone, no deps. Injects a fixed overlay that hijacks the Tiendanube
 * theme search and ranks results by "más vendidos" using a backend endpoint.
 *
 * Drop into theme via <script src="/morashop-search.js" defer></script>
 * or via the External Code injection of Tiendanube Trend theme.
 */
(function () {
  'use strict';

  // ===== Config =====
  var ENDPOINT = 'https://morashop-rediseno.vercel.app/api/search';
  var LIMIT = 10;
  var DEBOUNCE_MS = 200;
  var TRIGGER_TIMEOUT_MS = 2000;
  var PRODUCT_URL = function (handle) { return '/productos/' + handle; };
  var BRAND_LABEL = 'Morashop';

  // Bail if already mounted (avoid double init on SPA-like navigations)
  if (window.__morashopSearchMounted) return;
  window.__morashopSearchMounted = true;

  // ===== Styles =====
  var CSS = [
    '.morashop-root{position:fixed;inset:0;z-index:2147483600;display:none;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a}',
    '.morashop-root.ms-open{display:block}',
    '.morashop-backdrop{position:absolute;inset:0;background:rgba(15,15,20,.45);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);animation:msFadeIn .18s ease-out}',
    '.morashop-modal{position:absolute;left:50%;top:8vh;transform:translateX(-50%);width:min(680px,calc(100vw - 24px));max-height:84vh;background:#fff;border-radius:16px;box-shadow:0 24px 60px -12px rgba(0,0,0,.35),0 8px 20px -8px rgba(0,0,0,.2);display:flex;flex-direction:column;overflow:hidden;animation:msPopIn .22s cubic-bezier(.2,.9,.3,1.2)}',
    '.morashop-header{display:flex;align-items:center;gap:8px;padding:14px 14px 12px;border-bottom:1px solid #f0f0f3}',
    '.morashop-icon{flex:0 0 20px;width:20px;height:20px;color:#7a7a85}',
    '.morashop-input{flex:1;border:0;outline:0;font-size:17px;background:transparent;padding:6px 4px;color:#1a1a1a;min-width:0}',
    '.morashop-input::placeholder{color:#9a9aa3}',
    '.morashop-close{flex:0 0 auto;border:0;background:#f3f3f6;color:#4a4a55;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:18px;line-height:1;display:flex;align-items:center;justify-content:center;transition:background .15s}',
    '.morashop-close:hover{background:#e8e8ee}',
    '.morashop-close:focus-visible{outline:2px solid #1f6feb;outline-offset:2px}',
    '.morashop-body{flex:1;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}',
    '.morashop-section-title{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#6e6e78;padding:14px 16px 6px;background:#fafafc}',
    '.morashop-list{list-style:none;margin:0;padding:6px 0}',
    '.morashop-item{display:flex;align-items:center;gap:12px;padding:10px 14px;text-decoration:none;color:inherit;transition:background .12s}',
    '.morashop-item:hover,.morashop-item:focus-visible{background:#f6f6fa;outline:none}',
    '.morashop-thumb{flex:0 0 48px;width:48px;height:48px;border-radius:8px;background:#f0f0f3 center/cover no-repeat;border:1px solid #ececf1}',
    '.morashop-meta{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}',
    '.morashop-brand{font-size:11px;font-weight:600;color:#8a8a95;text-transform:uppercase;letter-spacing:.04em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.morashop-name{font-size:14px;font-weight:500;color:#1a1a1a;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
    '.morashop-price{flex:0 0 auto;font-size:14px;font-weight:700;color:#1a1a1a;white-space:nowrap}',
    '.morashop-state{padding:36px 20px;text-align:center;color:#6e6e78;font-size:14px}',
    '.morashop-spinner{width:24px;height:24px;border-radius:50%;border:2.5px solid #e6e6ec;border-top-color:#1a1a1a;animation:msSpin .7s linear infinite;margin:0 auto 10px}',
    '.morashop-footer{padding:10px 14px;border-top:1px solid #f0f0f3;display:flex;align-items:center;justify-content:space-between;gap:10px;background:#fcfcfd;font-size:12px;color:#7a7a85}',
    '.morashop-seeall{color:#1f6feb;text-decoration:none;font-weight:600}',
    '.morashop-seeall:hover{text-decoration:underline}',
    '.morashop-powered{margin-left:auto}',
    '.morashop-powered b{color:#1a1a1a;font-weight:700}',
    '@keyframes msFadeIn{from{opacity:0}to{opacity:1}}',
    '@keyframes msPopIn{from{opacity:0;transform:translate(-50%,8px) scale(.98)}to{opacity:1;transform:translate(-50%,0) scale(1)}}',
    '@keyframes msSpin{to{transform:rotate(360deg)}}',
    '@media (max-width:560px){',
    '  .morashop-modal{left:0;right:0;top:auto;bottom:0;transform:none;width:100%;max-height:92vh;border-radius:18px 18px 0 0;animation:msSlideUp .24s cubic-bezier(.2,.9,.3,1.05)}',
    '  .morashop-input{font-size:16px}',
    '}',
    '@keyframes msSlideUp{from{transform:translateY(16px);opacity:.6}to{transform:translateY(0);opacity:1}}',
    '@media (prefers-reduced-motion:reduce){.morashop-modal,.morashop-backdrop{animation:none}.morashop-spinner{animation-duration:1.4s}}'
  ].join('');

  function injectStyles() {
    if (document.getElementById('morashop-styles')) return;
    var style = document.createElement('style');
    style.id = 'morashop-styles';
    style.appendChild(document.createTextNode(CSS));
    document.head.appendChild(style);
  }

  // ===== DOM =====
  var root, backdrop, modal, input, body, footer, closeBtn;
  var lastFocus = null;
  var debounceTimer = null;
  var lastQuery = '';
  var requestSeq = 0;

  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') el.className = attrs[k];
        else if (k === 'html') el.innerHTML = attrs[k];
        else if (k === 'text') el.textContent = attrs[k];
        else if (k.indexOf('on') === 0) el.addEventListener(k.slice(2), attrs[k]);
        else el.setAttribute(k, attrs[k]);
      });
    }
    if (children) {
      (Array.isArray(children) ? children : [children]).forEach(function (c) {
        if (c == null) return;
        if (typeof c === 'string') el.appendChild(document.createTextNode(c));
        else el.appendChild(c);
      });
    }
    return el;
  }

  function buildOverlay() {
    backdrop = h('div', { class: 'morashop-backdrop', 'data-ms-backdrop': '1' });

    input = h('input', {
      class: 'morashop-input',
      type: 'search',
      autocomplete: 'off',
      autocorrect: 'off',
      autocapitalize: 'off',
      spellcheck: 'false',
      placeholder: 'Buscá creatina, proteína, marca…',
      'aria-label': 'Buscar productos'
    });

    closeBtn = h('button', {
      class: 'morashop-close',
      type: 'button',
      'aria-label': 'Cerrar buscador',
      html: '&times;'
    });

    var iconSVG = '<svg class="morashop-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="2"/><path d="m14 14 3.5 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    var iconWrap = h('span', { html: iconSVG });
    var header = h('div', { class: 'morashop-header' }, [iconWrap.firstChild, input, closeBtn]);

    body = h('div', { class: 'morashop-body', role: 'listbox', 'aria-label': 'Resultados' });
    footer = h('div', { class: 'morashop-footer' }, [
      h('span', { class: 'morashop-powered', html: 'powered by <b>' + BRAND_LABEL + '</b>' })
    ]);

    modal = h('div', {
      class: 'morashop-modal',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': 'Buscador Morashop'
    }, [header, body, footer]);

    root = h('div', { class: 'morashop-root', 'aria-hidden': 'true' }, [backdrop, modal]);

    document.body.appendChild(root);

    backdrop.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    input.addEventListener('input', onInput);
    modal.addEventListener('click', function (e) { e.stopPropagation(); });
    root.addEventListener('keydown', onKeydown);

    renderInitial();
  }

  function renderInitial() {
    body.innerHTML = '';
    body.appendChild(h('div', {
      class: 'morashop-state',
      text: 'Empezá a escribir para ver los más vendidos'
    }));
  }

  function renderLoading() {
    body.innerHTML = '';
    var wrap = h('div', { class: 'morashop-state' }, [
      h('div', { class: 'morashop-spinner', 'aria-hidden': 'true' }),
      h('div', { text: 'Buscando…' })
    ]);
    body.appendChild(wrap);
  }

  function renderEmpty(q) {
    body.innerHTML = '';
    body.appendChild(h('div', {
      class: 'morashop-state',
      text: 'Probá con otra palabra'
    }));
  }

  function renderError() {
    body.innerHTML = '';
    body.appendChild(h('div', {
      class: 'morashop-state',
      text: 'No pudimos buscar ahora. Probá de nuevo en un momento.'
    }));
  }

  function fmtPrice(p) {
    if (p == null || p === '') return '';
    var n = typeof p === 'number' ? p : Number(String(p).replace(/[^\d.,-]/g, '').replace(',', '.'));
    if (!isFinite(n)) return String(p);
    try {
      return n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
    } catch (e) {
      return '$' + Math.round(n);
    }
  }

  function buildSeeAllUrl(q, typeHit) {
    var u = '/search?q=' + encodeURIComponent(q);
    if (typeHit && typeHit.handle) u = '/categorias/' + encodeURIComponent(typeHit.handle) + '?q=' + encodeURIComponent(q);
    return u;
  }

  function renderResults(data, q) {
    body.innerHTML = '';
    var matches = (data && data.matches) || [];
    if (!matches.length) { renderEmpty(q); return; }

    if (data.typeHit && data.typeHit.label) {
      body.appendChild(h('div', {
        class: 'morashop-section-title',
        text: 'Top vendidos en ' + data.typeHit.label
      }));
    } else {
      body.appendChild(h('div', {
        class: 'morashop-section-title',
        text: 'Resultados'
      }));
    }

    var list = h('ul', { class: 'morashop-list' });
    matches.forEach(function (item) {
      var handle = item.handle || item.slug || item.url || '';
      var href = item.url ? item.url : PRODUCT_URL(handle);
      var thumb = h('span', { class: 'morashop-thumb', 'aria-hidden': 'true' });
      if (item.image) {
        var safeUrl = String(item.image || '').replace(/'/g, '%27').replace(/\)/g, '%29');
        thumb.style.backgroundImage = "url('" + safeUrl + "')";
      }
      var meta = h('span', { class: 'morashop-meta' }, [
        item.brand ? h('span', { class: 'morashop-brand', text: item.brand }) : null,
        h('span', { class: 'morashop-name', text: item.name || item.title || '' })
      ]);
      var price = h('span', { class: 'morashop-price', text: fmtPrice(item.price) });
      var a = h('a', {
        class: 'morashop-item',
        href: href,
        role: 'option',
        'data-ms-item': '1'
      }, [thumb, meta, price]);
      var li = h('li', null, a);
      list.appendChild(li);
    });
    body.appendChild(list);

    // "Ver los N resultados" footer link
    // Clear existing inner anchor if any
    Array.prototype.slice.call(footer.querySelectorAll('.morashop-seeall')).forEach(function (el) { el.remove(); });
    var total = (data && typeof data.total === 'number') ? data.total : matches.length;
    if (total > matches.length) {
      var seeAll = h('a', {
        class: 'morashop-seeall',
        href: buildSeeAllUrl(q, data.typeHit),
        text: 'Ver los ' + total + ' resultados →'
      });
      footer.insertBefore(seeAll, footer.firstChild);
    }
  }

  // ===== Fetch with debounce + dedupe =====
  function onInput() {
    var q = input.value.trim();
    if (debounceTimer) clearTimeout(debounceTimer);
    if (!q) { lastQuery = ''; renderInitial(); return; }
    if (q === lastQuery) return;
    debounceTimer = setTimeout(function () { runSearch(q); }, DEBOUNCE_MS);
  }

  function runSearch(q) {
    lastQuery = q;
    var mySeq = ++requestSeq;
    renderLoading();
    var url = ENDPOINT + (ENDPOINT.indexOf('?') === -1 ? '?' : '&') +
              'q=' + encodeURIComponent(q) + '&limit=' + LIMIT;
    fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      credentials: 'omit'
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function (data) {
      if (mySeq !== requestSeq) return; // stale
      renderResults(data || {}, q);
    }).catch(function () {
      if (mySeq !== requestSeq) return;
      renderError();
    });
  }

  // ===== Open / Close =====
  function open() {
    if (!root) buildOverlay();
    if (root.classList.contains('ms-open')) { input.focus(); return; }
    lastFocus = document.activeElement;
    root.classList.add('ms-open');
    root.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    setTimeout(function () { input.focus(); input.select(); }, 30);
  }

  function close() {
    if (!root || !root.classList.contains('ms-open')) return;
    root.classList.remove('ms-open');
    root.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    if (lastFocus && typeof lastFocus.focus === 'function') {
      try { lastFocus.focus(); } catch (e) {}
    }
  }

  function onKeydown(e) {
    if (e.key === 'Escape' || e.keyCode === 27) { e.stopPropagation(); close(); return; }
    if (e.key === 'Tab' || e.keyCode === 9) {
      // simple focus trap
      var focusables = modal.querySelectorAll('input, button, a[href], [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  // ===== Trigger hijack =====
  var TRIGGER_SELECTORS = [
    '.js-search-trigger',
    '.js-toggle-search',
    '.header__search',
    '.header-search',
    'a[href="#search"]',
    'a[href*="/search"]',
    'button[aria-label*="uscar" i]',
    'button[aria-label*="earch" i]',
    'a[aria-label*="uscar" i]',
    'a[aria-label*="earch" i]',
    '.search-form',
    '.search-form input',
    '.nav-search',
    '[data-toggle="search"]',
    '[data-search-trigger]'
  ];

  function hijack(el) {
    if (!el || el.__msHijacked) return;
    el.__msHijacked = true;
    el.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      open();
    }, true);
    if (el.tagName === 'INPUT') {
      el.addEventListener('focus', function (e) {
        e.preventDefault();
        try { el.blur(); } catch (er) {}
        open();
      }, true);
    }
    if (el.tagName === 'FORM') {
      el.addEventListener('submit', function (e) {
        e.preventDefault();
        var inp = el.querySelector('input[type="search"], input[name="q"], input[type="text"]');
        open();
        if (inp && inp.value && input) {
          input.value = inp.value;
          runSearch(inp.value.trim());
        }
      }, true);
    }
  }

  function scanAndHijack() {
    var found = 0;
    TRIGGER_SELECTORS.forEach(function (sel) {
      var nodes;
      try { nodes = document.querySelectorAll(sel); } catch (e) { return; }
      nodes.forEach(function (n) { hijack(n); found++; });
    });
    return found;
  }

  function bootTriggers() {
    var found = scanAndHijack();
    var start = Date.now();
    if (found > 0) return;
    var iv = setInterval(function () {
      var f = scanAndHijack();
      if (f > 0 || Date.now() - start > TRIGGER_TIMEOUT_MS) clearInterval(iv);
    }, 150);

    // MutationObserver in case theme renders later (mobile menus, etc.)
    try {
      var mo = new MutationObserver(function () { scanAndHijack(); });
      mo.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(function () { mo.disconnect(); }, 15000);
    } catch (e) {}
  }

  // Public API + keyboard shortcut "/"
  window.MorashopSearch = {
    open: open,
    close: close,
    setEndpoint: function (url) { if (typeof url === 'string' && url) ENDPOINT = url; }
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && !/^(input|textarea|select)$/i.test((e.target && e.target.tagName) || '')) {
      e.preventDefault();
      open();
    }
  });

  // ===== Boot =====
  function boot() {
    injectStyles();
    buildOverlay();
    bootTriggers();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
