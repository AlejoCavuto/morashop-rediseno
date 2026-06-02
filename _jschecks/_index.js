
  // Newsletter prefoot — placeholder local (integrar con Doppler / Mailchimp después)
  document.addEventListener('submit', e => {
    if (e.target.id !== 'prefootNewsletter') return;
    e.preventDefault();
    const email = e.target.email.value.trim();
    if (!email) return;
    try { localStorage.setItem('morashop_newsletter', email); } catch (err) {}
    const btn = e.target.querySelector('button');
    btn.textContent = '¡Suscripto ✓!';
    btn.disabled = true;
    setTimeout(() => { e.target.reset(); btn.textContent = 'Suscribirme'; btn.disabled = false; }, 3500);
  });

  // WhatsApp flotante: atenuarse cuando la prefoot o el footer entran en viewport
  // para no solaparse con el botón "Suscribirme" / links del footer en mobile.
  document.addEventListener('DOMContentLoaded', () => {
    const wa = document.querySelector('.wa-float');
    if (!wa || !('IntersectionObserver' in window)) return;
    const targets = [document.querySelector('.prefoot'), document.querySelector('footer')].filter(Boolean);
    if (!targets.length) return;
    const visible = new WeakSet();
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) visible.add(en.target);
        else visible.delete(en.target);
      });
      wa.classList.toggle('is-dimmed', targets.some(t => visible.has(t)));
    }, { threshold: 0.05 });
    targets.forEach(t => io.observe(t));
  });

;

  // CATALOG (los 8 productos demo) lo usamos solo para el quiz y para resolver
  // los `[data-add]` que se renderizan en la home. POOLS / SORTERS / renderTrack /
  // los handlers del carrusel viejo se eliminaron junto con su sección visual.
  const CATALOG = window.CATALOG;
  const formatARS = n => '$ ' + n.toLocaleString('es-AR');

  // ---------- PROMO CAROUSEL (slides) — antes era el hero, ahora va entre bloques ----------
  const PROMO_SLIDES = [
    {
      eyebrow: 'Jueves de Suplemento',
      title: 'Hasta 30% OFF',
      subtitle: '5% base + 15% efectivo + 10% llevando 3 suplementos. Solo los jueves.',
      cta: 'Aprovechar',
      link: 'suplementos.html',
      bg: '#FFD400',
      fg: '#1A2744',
      img: 'assets/products/whey-star-choc.png',
    },
    {
      eyebrow: 'Envío en el día',
      title: 'Llegá hoy mismo',
      subtitle: 'Pedidos antes de las 10hs en CABA y GBA. Envío gratis desde $70.000.',
      cta: 'Ver más',
      link: '#',
      bg: '#1A2744',
      fg: '#FFFFFF',
      img: 'assets/products/creatina-ena-doypack.png',
    },
    {
      eyebrow: 'Cuotas sin interés',
      title: '3 cuotas s/interés',
      subtitle: 'Con todas las tarjetas en todo el catálogo.',
      cta: 'Empezá a comprar',
      link: 'suplementos.html',
      bg: '#E8341A',
      fg: '#FFFFFF',
      img: 'assets/products/omega3-innova-max.png',
    },
    {
      eyebrow: 'Distribuidor oficial',
      title: 'Las mejores marcas',
      subtitle: 'Star Nutrition, ENA, Gold Nutrition, Optimum y más. 100% originales.',
      cta: 'Ver catálogo',
      link: 'suplementos.html',
      bg: '#ECEDEF',
      fg: '#1A2744',
      img: 'assets/products/whey-star.png',
    },
  ];

  function initPromoCarousel(){
    const track = document.getElementById('pcTrack');
    const dotsEl = document.getElementById('pcDots');
    const frame = track && track.parentElement;
    if (!track || !dotsEl || !frame) return;

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const AUTOPLAY_MS = 6000;
    let currentSlide = 0;
    let autoplayTimer = null;

    function esc(s){
      return String(s == null ? '' : s)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    }

    function renderSlide(s, i){
      return '<article class="pc-slide" style="background:'+esc(s.bg)+';color:'+esc(s.fg)+'" data-slide="'+i+'" aria-roledescription="slide" aria-label="'+(i+1)+' de '+PROMO_SLIDES.length+'">'
        + '<div class="pc-content">'
        +   '<span class="pc-eyebrow">'+esc(s.eyebrow)+'</span>'
        +   '<h2 class="pc-title">'+esc(s.title)+'</h2>'
        +   '<p class="pc-sub">'+esc(s.subtitle)+'</p>'
        +   '<a class="pc-cta" href="'+esc(s.link)+'" style="background:'+esc(s.fg)+';color:'+esc(s.bg)+'">'+esc(s.cta)+' <span class="arr">→</span></a>'
        + '</div>'
        + '<div class="pc-media"><img src="'+esc(s.img)+'" alt="" loading="lazy" /></div>'
        + '</article>';
    }

    track.innerHTML = PROMO_SLIDES.map(renderSlide).join('');
    dotsEl.innerHTML = PROMO_SLIDES.map(function(_, i){
      return '<button class="pc-dot'+(i===0?' active':'')+'" type="button" data-go="'+i+'" role="tab" aria-label="Ir al slide '+(i+1)+'" aria-selected="'+(i===0?'true':'false')+'"></button>';
    }).join('');

    if (reduceMotion) {
      track.style.transition = 'none';
    }

    function goTo(i){
      currentSlide = (i + PROMO_SLIDES.length) % PROMO_SLIDES.length;
      track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
      dotsEl.querySelectorAll('.pc-dot').forEach(function(d, idx){
        const isActive = idx === currentSlide;
        d.classList.toggle('active', isActive);
        d.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }
    function next(){ goTo(currentSlide + 1); }
    function prev(){ goTo(currentSlide - 1); }

    function startAutoplay(){
      if (reduceMotion) return;
      stopAutoplay();
      autoplayTimer = setInterval(next, AUTOPLAY_MS);
    }
    function stopAutoplay(){
      if (autoplayTimer) clearInterval(autoplayTimer);
      autoplayTimer = null;
    }

    // Dots
    dotsEl.addEventListener('click', function(e){
      const btn = e.target.closest('[data-go]');
      if (!btn) return;
      goTo(parseInt(btn.dataset.go, 10));
      startAutoplay();
    });

    // Arrows
    const prevBtn = document.getElementById('pcPrev');
    const nextBtn = document.getElementById('pcNext');
    if (prevBtn) prevBtn.addEventListener('click', function(){ prev(); startAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', function(){ next(); startAutoplay(); });

    // Pausa al hover (desktop)
    frame.addEventListener('mouseenter', stopAutoplay);
    frame.addEventListener('mouseleave', startAutoplay);

    // Pausa si la pestaña no está visible
    document.addEventListener('visibilitychange', function(){
      if (document.hidden) stopAutoplay(); else startAutoplay();
    });

    // Swipe touch
    let touchStartX = 0;
    let touchActive = false;
    track.addEventListener('touchstart', function(e){
      touchStartX = e.touches[0].clientX;
      touchActive = true;
      stopAutoplay();
    }, { passive: true });
    track.addEventListener('touchend', function(e){
      if (!touchActive) return;
      touchActive = false;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) {
        if (dx < 0) next(); else prev();
      }
      startAutoplay();
    });

    // Teclado (cuando alguno del frame tiene focus)
    frame.addEventListener('keydown', function(e){
      if (e.key === 'ArrowLeft') { prev(); startAutoplay(); }
      else if (e.key === 'ArrowRight') { next(); startAutoplay(); }
    });

    startAutoplay();
  }

  // ---------- SEARCH (live dropdown sobre los 2.116 productos reales) ----------
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');

  // Helpers de normalización (sin tildes, lower-cased)
  function srNorm(s){
    return String(s || '').toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, ' ').trim();
  }
  function srSlug(s){
    return String(s || '').toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  function srEsc(s){
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  // Construir el catálogo unificado (1 sola vez)
  const SEARCH_INDEX = (function(){
    const out = [];
    const byCat = (window.CATALOG_BY_CAT || {});
    const cats = ['suplementos', 'supermercado', 'electro', 'bananero'];
    cats.forEach(cat => {
      const arr = byCat[cat] || [];
      for (let i = 0; i < arr.length; i++){
        const p = arr[i];
        const types = Array.isArray(p.types) ? p.types : [];
        const brand = p.brand || '';
        const name  = p.name  || '';
        const brandKey = srNorm(brand);
        const nameKey  = srNorm(name);
        out.push({
          brand: brand,
          name: name,
          price: p.price || '',
          was: p.was || '',
          img: p.img || '',
          types: types,
          category: cat,
          brandKey: brandKey,
          nameKey: nameKey,
          searchKey: srNorm(brand + ' ' + name + ' ' + types.join(' '))
        });
      }
    });
    return out;
  })();

  // Aliases por type para detectar intención del usuario
  const SR_TYPE_ALIASES = {
    'creatinas':     ['creatina', 'crea', 'creatinas', 'monohidrato'],
    'proteinas':     ['proteina', 'proteinas', 'protein', 'whey', 'caseina'],
    'pre-entrenos': ['pre', 'pre-entreno', 'pre-entrenos', 'preentreno', 'pre workout'],
    'bcaa':          ['bcaa', 'aminoacido', 'aminoacidos'],
    'quemadores':    ['quemador', 'quemadores', 'fat burn', 'termogenico'],
    'barras':        ['barra', 'barras', 'gel', 'geles'],
    'vitaminas':     ['vitamina', 'vitaminas', 'multivitaminico'],
    'combos':        ['combo', 'combos', 'pack']
  };
  const SR_TYPE_LABEL = {
    'creatinas': 'Creatinas',
    'proteinas': 'Proteínas',
    'pre-entrenos': 'Pre-entrenos',
    'bcaa': 'BCAA',
    'quemadores': 'Quemadores',
    'barras': 'Barras y geles',
    'vitaminas': 'Vitaminas',
    'combos': 'Combos'
  };

  // Hash determinístico para simular "más vendidos" (misma fórmula que la PDP)
  function srSeed(p){
    const s = (p.brand || '') + '|' + (p.name || '');
    let h = 0;
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    return Math.abs(h);
  }
  function srVendidos(p){ return 20 + (srSeed(p) % 480); }

  function srMatchedType(qNorm){
    for (const type in SR_TYPE_ALIASES){
      const aliases = SR_TYPE_ALIASES[type];
      for (let i = 0; i < aliases.length; i++){
        const a = srNorm(aliases[i]);
        if (a === qNorm || a.startsWith(qNorm) || qNorm.startsWith(a)) return type;
      }
    }
    return null;
  }

  function srTier(p, qNorm, typeHit){
    // Tier 1 — match de type por alias
    if (typeHit && p.types.indexOf(typeHit) !== -1) return 1;
    // Tier 2 — query es exactamente la marca
    if (p.brandKey === qNorm) return 2;
    // Tier 3 — prefijo en alguna palabra de brand/name
    const words = (p.brandKey + ' ' + p.nameKey).split(' ');
    for (let i = 0; i < words.length; i++){
      if (words[i] && words[i].startsWith(qNorm)) return 3;
    }
    // Tier 4 — contiene en searchKey
    if (p.searchKey.indexOf(qNorm) !== -1) return 4;
    return 0;
  }

  function srSearch(q, limit){
    limit = limit || 10;
    const qNorm = srNorm(q);
    if (!qNorm) return { matches: [], typeHit: null, total: 0 };
    const typeHit = srMatchedType(qNorm);
    const scored = [];
    for (let i = 0; i < SEARCH_INDEX.length; i++){
      const p = SEARCH_INDEX[i];
      const inKey = p.searchKey.indexOf(qNorm) !== -1;
      const inType = typeHit && p.types.indexOf(typeHit) !== -1;
      if (!inKey && !inType) continue;
      const tier = srTier(p, qNorm, typeHit);
      if (!tier) continue;
      // Sub-bonus dentro de tier: si la query aparece literal en searchKey, va antes
      scored.push({ p: p, tier: tier, literalHit: inKey ? 0 : 1, sales: srVendidos(p) });
    }
    scored.sort(function(a, b){
      return (a.tier - b.tier) || (a.literalHit - b.literalHit) || (b.sales - a.sales);
    });
    return {
      matches: scored.slice(0, limit).map(function(x){ return x.p; }),
      typeHit: typeHit,
      total: scored.length
    };
  }

  function srProductURL(p){
    return 'producto.html?cat=' + encodeURIComponent(p.category) +
           '&pid=' + srSlug((p.brand || '') + '-' + (p.name || ''));
  }

  function srRenderResults(){
    const raw = input.value || '';
    const q = raw.trim();
    if (!q){ results.innerHTML = ''; return; }
    const out = srSearch(q, 10);
    if (!out.matches.length){
      results.innerHTML =
        '<div class="sr-empty">No encontramos productos para "' + srEsc(q) + '" — ¿probaste con la marca?</div>';
      return;
    }
    let html = '';
    if (out.typeHit){
      html += '<div class="sr-section">' +
              'En ' + srEsc(SR_TYPE_LABEL[out.typeHit] || out.typeHit) +
              ' — los más vendidos' +
              '</div>';
    }
    html += out.matches.map(function(p){
      return '<a href="' + srEsc(srProductURL(p)) + '" class="sr-item" role="option">' +
        '<div class="sr-img"><img src="' + srEsc(p.img) + '" alt="" loading="lazy" /></div>' +
        '<div class="sr-meta">' +
          '<div class="sr-brand">' + srEsc(p.brand) + '</div>' +
          '<div class="sr-name">' + srEsc(p.name) + '</div>' +
        '</div>' +
        '<div class="sr-price">' + srEsc(p.price) + '</div>' +
      '</a>';
    }).join('');
    if (out.total > out.matches.length){
      const seeAll = 'suplementos.html?q=' + encodeURIComponent(q);
      html += '<a href="' + srEsc(seeAll) + '" class="sr-seeall">' +
              'Ver los ' + out.total + ' resultados →' +
              '</a>';
    }
    results.innerHTML = html;
  }

  // Debounce 120ms
  let srDebounce = null;
  function srOnInput(){
    if (srDebounce) clearTimeout(srDebounce);
    srDebounce = setTimeout(srRenderResults, 120);
  }
  input.addEventListener('input', srOnInput);

  function closeSearch(){ overlay.classList.remove('open'); input.blur(); }

  function openSearch(prefill){
    overlay.classList.add('open');
    if (typeof prefill === 'string') input.value = prefill;
    srRenderResults();
    setTimeout(function(){ input.focus(); }, 60);
  }

  // Abrir overlay automáticamente si llegamos con ?q=algo en la URL
  (function(){
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q && q.trim()) openSearch(q);
  })();

  document.getElementById('searchBtn').addEventListener('click', function(){ openSearch(); });
  document.getElementById('searchClose').addEventListener('click', closeSearch);

  // Mobile search bar: NO hace submit. Al tocarlo, abre el overlay.
  const navSearchInput = document.getElementById('navSearchInput');
  const navSearchForm = document.getElementById('navSearchForm');
  if (navSearchForm){
    navSearchForm.addEventListener('submit', function(e){
      e.preventDefault();
      openSearch(navSearchInput ? navSearchInput.value : '');
    });
  }
  if (navSearchInput){
    // Cualquier interacción (focus, click, tap) abre el overlay grande
    const triggerMobile = function(e){
      e.preventDefault();
      navSearchInput.blur();
      openSearch('');
    };
    navSearchInput.addEventListener('focus', triggerMobile);
    navSearchInput.addEventListener('mousedown', triggerMobile);
    navSearchInput.addEventListener('touchstart', triggerMobile, { passive: false });
    navSearchInput.addEventListener('click', triggerMobile);
  }
  const navSearchBtn = document.getElementById('navSearchBtn');
  if (navSearchBtn){
    navSearchBtn.addEventListener('click', function(){ openSearch(''); });
  }

  // ---------- ADD-TO-CART (delega en window.Cart) ----------
  function bindAddButtons(scope){
    scope.querySelectorAll('[data-add]').forEach(b => {
      if (b._bound) return;
      b._bound = true;
      b.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        const card = e.currentTarget.closest('[data-id]');
        const id = card && card.dataset.id;
        const product = id ? CATALOG.find(p => p.id === id) : null;
        if (product && window.Cart) {
          window.Cart.add({
            id: product.id, brand: product.brand, name: product.name,
            price: product.price, img: product.img, cat: 'suplementos'
          });
        }
        const btn = e.currentTarget;
        const original = btn.textContent;
        btn.textContent = 'Agregado ✓';
        btn.style.background = 'var(--red)'; btn.style.color = '#fff'; btn.style.borderColor = 'var(--red)';
        setTimeout(() => {
          btn.textContent = original.includes('Agregado') ? 'Agregar' : original;
          btn.style.background = ''; btn.style.color = ''; btn.style.borderColor = '';
        }, 1400);
      });
    });
  }
  bindAddButtons(document);

  // ---------- QUIZ ----------
  const quizModal = document.getElementById('quizModal');
  const quizOpenBtn = document.getElementById('quizOpenBtn');
  const qmClose = document.getElementById('qmClose');
  const qmBack = document.getElementById('qmBack');
  const qmBar = document.getElementById('qmProgressBar');
  const qmStepLabel = document.getElementById('qmStepLabel');
  const qmRestart = document.getElementById('qmRestart');
  const qmResultsGrid = document.getElementById('qmResultsGrid');
  const qmResultsSub = document.getElementById('qmResultsSub');
  const qmSteps = Array.from(quizModal.querySelectorAll('.qm-step'));

  const quizState = { step: 1, answers: { goal: null, level: null, restriction: null } };
  let quizLastTrigger = null;

  // Recommendation rules — returns array of product IDs from CATALOG
  function recommend({ goal, level, restriction }){
    let picks = [];
    if (goal === 'muscle' && level === 'new') {
      picks = ['whey-star-choc','creatina-ena'];
    } else if (goal === 'muscle') {
      picks = ['whey-star-choc','creatina-ena','amino-energy-spk'];
    } else if (goal === 'performance') {
      picks = ['amino-energy-spk','creatina-ena'];
    } else if (goal === 'weight-loss') {
      picks = ['omega-innova','amino-energy-spk'];
    } else if (goal === 'health') {
      picks = ['omega-innova','amino-energy-spk'];
    } else {
      picks = ['whey-star-choc','omega-innova'];
    }
    // Restricción: priorizar InnovaNaturals + Amino Energy si vegano/sin TACC
    if (restriction === 'vegan' || restriction === 'gluten-free') {
      const priority = ['omega-innova','amino-energy-spk','omega-innova-std'];
      const filtered = picks.filter(id => priority.includes(id));
      picks = filtered.length ? filtered : priority.slice(0, 2);
    }
    return picks;
  }

  function resultsSubtext({ goal, level, restriction }){
    const goalMap = {
      'weight-loss':'bajar de peso',
      'muscle':'ganar músculo',
      'performance':'mejorar tu rendimiento',
      'health':'cuidar tu salud',
    };
    const levelMap = {
      'new':'arrancando',
      'some':'con algo de experiencia',
      'experienced':'entrenando hace tiempo',
    };
    const restrMap = {
      'none':'',
      'gluten-free':' · sin TACC',
      'vegan':' · vegano',
    };
    return `Objetivo: ${goalMap[goal]||'—'} · ${levelMap[level]||'—'}${restrMap[restriction]||''}`;
  }

  function resultCard(p){
    return `<a class="qm-rcard" href="producto.html?id=${p.id}" data-id="${p.id}">
      <div class="ph"><img src="${p.img}" alt="${p.name}" loading="lazy" /></div>
      <div class="info">
        <div class="brand">${p.brand}</div>
        <div class="name">${p.name}</div>
        <div class="row">
          <div class="price">${formatARS(p.price)}</div>
          <button class="add" data-add type="button">Agregar</button>
        </div>
      </div>
    </a>`;
  }

  function showStep(n){
    quizState.step = n;
    qmSteps.forEach(s => s.classList.toggle('active', parseInt(s.dataset.step, 10) === n));
    const pct = n === 4 ? 100 : Math.round((n / 3) * 100);
    qmBar.style.width = pct + '%';
    if (n <= 3) qmStepLabel.textContent = `Pregunta ${n} de 3`;
    else qmStepLabel.textContent = 'Resultados';
    qmBack.classList.toggle('show', n === 2 || n === 3);
    // focus primer opción para teclado
    const active = quizModal.querySelector('.qm-step.active .qm-opt');
    if (active) setTimeout(() => active.focus(), 50);
  }

  function renderQuizResults(){
    const ids = recommend(quizState.answers);
    const products = ids.map(id => CATALOG.find(p => p.id === id)).filter(Boolean);
    qmResultsGrid.className = 'qm-results-grid' + (products.length === 2 ? ' two' : '');
    qmResultsGrid.innerHTML = products.map(resultCard).join('');
    qmResultsSub.textContent = resultsSubtext(quizState.answers);
    bindAddButtons(qmResultsGrid);
  }

  function openQuiz(trigger){
    quizLastTrigger = trigger || null;
    quizModal.classList.add('open');
    quizModal.setAttribute('aria-hidden','false');
    document.body.classList.add('quiz-locked');
    quizState.answers = { goal:null, level:null, restriction:null };
    qmSteps.forEach(s => {
      s.querySelectorAll('.qm-opt.selected').forEach(o => o.classList.remove('selected'));
    });
    showStep(1);
  }
  function closeQuiz(){
    quizModal.classList.remove('open');
    quizModal.setAttribute('aria-hidden','true');
    document.body.classList.remove('quiz-locked');
    if (quizLastTrigger && typeof quizLastTrigger.focus === 'function') quizLastTrigger.focus();
  }

  quizOpenBtn.addEventListener('click', e => openQuiz(e.currentTarget));
  qmClose.addEventListener('click', closeQuiz);
  qmRestart.addEventListener('click', () => {
    quizState.answers = { goal:null, level:null, restriction:null };
    qmSteps.forEach(s => {
      s.querySelectorAll('.qm-opt.selected').forEach(o => o.classList.remove('selected'));
    });
    showStep(1);
  });

  qmBack.addEventListener('click', () => {
    if (quizState.step > 1) showStep(quizState.step - 1);
  });

  // Click en opciones — avance automático
  qmSteps.forEach(step => {
    const qKey = step.dataset.q;
    if (!qKey) return;
    step.addEventListener('click', e => {
      const btn = e.target.closest('.qm-opt');
      if (!btn) return;
      step.querySelectorAll('.qm-opt').forEach(o => o.classList.remove('selected'));
      btn.classList.add('selected');
      quizState.answers[qKey] = btn.dataset.value;
      const n = parseInt(step.dataset.step, 10);
      setTimeout(() => {
        if (n < 3) showStep(n + 1);
        else { renderQuizResults(); showStep(4); }
      }, 220);
    });
  });

  // Click en fondo cierra el modal (solo si clickeás el container, no en una opción)
  quizModal.addEventListener('click', e => {
    if (e.target === quizModal) closeQuiz();
  });

  // Escape global: prioriza quiz > buscador
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (quizModal.classList.contains('open')) { closeQuiz(); return; }
    if (overlay.classList.contains('open')) { closeSearch(); }
  });

  /* ==================== BLOQUES ML (productos reales) ==================== */
  (function(){
    const REAL = (window.CATALOG_BY_CAT && window.CATALOG_BY_CAT.suplementos) || [];
    const host = document.getElementById('mlBlocks');
    if (!host || !REAL.length) return;

    const toNum = s => parseInt(String(s||'').replace(/[^\d]/g,''),10) || 0;
    const fmt   = n => '$ ' + n.toLocaleString('es-AR');
    const pidOf = p => (p.brand||'') + '|' + (p.name||'');
    const escHTML = s => String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');

    // slug idéntico al de producto.html — para armar el link a la PDP
    function slug(s){
      return String(s).toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g,'')
        .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    }
    // URL a la página de producto (PDP). La home es 100% suplementos.
    function productoURL(p, cat){
      return 'producto.html?cat=' + (cat || p.__cat || 'suplementos') + '&pid=' + slug((p.brand||'') + '-' + (p.name||''));
    }

    function discount(p){
      const now = toNum(p.price), was = toNum(p.was);
      if (was > now && now > 0) return Math.round((1 - now/was) * 100);
      return 0;
    }

    /* Hash determinístico para stock/vendidos/rating fake-pero-consistentes */
    function seedFromProduct(p){
      const str = ((p.brand||'') + (p.name||'')).toLowerCase();
      let h = 0;
      for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h = h & h; }
      return Math.abs(h);
    }
    function fakeStock(p){ return (seedFromProduct(p) % 30) + 3; }
    function fakeVendidos(p){ return (seedFromProduct(p) % 1500) + 50; }
    function fakeRating(p){ return 4 + ((seedFromProduct(p) % 100) / 100); }
    function fakeReviews(p){ return Math.max(3, Math.floor(fakeVendidos(p) * 0.15)); }
    function ratingHTML(p, type){
      const r = fakeRating(p).toFixed(1);
      const rev = fakeReviews(p);
      const cls = type === 'row' ? 'mlrow-rating' : 'mlcard-rating';
      return `<div class="${cls}"><span class="star">★</span>${r}<span class="rev">(${rev})</span></div>`;
    }
    /* Vendidos en escalones tipo ML: +5/+100/+500/+1000/+5000/+10000 */
    function vendidosEscalon(p){
      const n = fakeVendidos(p);
      if (n >= 10000) return '+10mil';
      if (n >= 5000)  return '+5mil';
      if (n >= 1000)  return '+1000';
      if (n >= 500)   return '+500';
      if (n >= 100)   return '+100';
      if (n >= 5)     return '+5';
      return '';
    }
    /* Precio en efectivo con 15% OFF (contraentrega CABA/GBA). Transferencia: 5% OFF */
    function precioEfectivo(now){ return Math.round(now * 0.85); }
    function precioCuota(now){ return Math.round(now / 3); }

    /* ---- HISTORIAL (localStorage) ---- */
    const HKEY = 'morashop_vistos';
    function getHistory(){
      try { return JSON.parse(localStorage.getItem(HKEY) || '[]'); } catch(e){ return []; }
    }
    function findByPid(pid){ return REAL.find(p => pidOf(p) === pid); }

    /* ---- CARD VERTICAL (limpio: precio + % OFF + efectivo línea chica + cuotas) ---- */
    function cardHTML(p){
      const now=toNum(p.price), was=toNum(p.was), disc=discount(p);
      const efectivo = precioEfectivo(now), cuota = precioCuota(now);
      const offBadge = disc>=5 ? `<span class="mlcard-off">${disc}% OFF</span>` : '';
      const vendidos = vendidosEscalon(p);
      const vendidosHTML = vendidos ? `<div class="mlcard-vendidos">${vendidos} vendidos</div>` : '';
      const savingsHTML = was>now ? `<div class="mlcard-savings">Ahorrás ${fmt(was - now)}</div>` : '';
      const pid = encodeURIComponent(pidOf(p));
      return `<a class="mlcard" href="${productoURL(p)}" data-pid="${pid}">
        <div class="mlcard-ph">${offBadge}<img src="${escHTML(p.img)}" alt="${escHTML((p.name||'').slice(0,120))}" loading="lazy" /></div>
        <div class="mlcard-info">
          <div class="mlcard-brand">${escHTML(p.brand||'')}</div>
          <div class="mlcard-name">${escHTML(p.name||'')}</div>
          ${ratingHTML(p, 'card')}
          ${vendidosHTML}
          <div class="mlcard-price-row"><span class="mlcard-price">${fmt(now)}</span></div>
          ${savingsHTML}
          <div class="mlcard-efectivo"><strong>${fmt(efectivo)}</strong> en efectivo</div>
          <div class="mlcard-cuotas">3 cuotas sin interés de ${fmt(cuota)}</div>
          <div class="mlcard-foot"><button class="mlcard-add" type="button" data-mladd><svg class="cart-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg><span>Agregar</span></button></div>
        </div>
      </a>`;
    }

    /* ---- FILA HORIZONTAL (para lista vertical 1x4) ---- */
    function rowItemHTML(p){
      const now=toNum(p.price), was=toNum(p.was), disc=discount(p);
      const efectivo = precioEfectivo(now), cuota = precioCuota(now);
      const offBadge = disc>=5 ? `<span class="mlrow-off">${disc}% OFF</span>` : '';
      const wasRow   = was>now ? `<div class="mlrow-was">${fmt(was)}</div>` : '';
      const vendidos = vendidosEscalon(p);
      const vendidosHTML = vendidos ? `<div class="mlrow-vendidos">${vendidos} vendidos</div>` : '';
      const pid = encodeURIComponent(pidOf(p));
      return `<a class="mlrow-item" href="${productoURL(p)}" data-pid="${pid}">
        <div class="mlrow-ph">${offBadge}<img src="${escHTML(p.img)}" alt="${escHTML((p.name||'').slice(0,120))}" loading="lazy" /></div>
        <div class="mlrow-body">
          <div class="mlrow-brand">${escHTML(p.brand||'')}</div>
          <div class="mlrow-name">${escHTML(p.name||'')}</div>
          ${ratingHTML(p, 'row')}
          ${vendidosHTML}
          <div class="mlrow-efectivo"><strong>${fmt(efectivo)}</strong> en efectivo</div>
          <div class="mlrow-cuotas">3 cuotas sin interés de ${fmt(cuota)}</div>
        </div>
        <div class="mlrow-actions">
          ${wasRow}
          <div class="mlrow-priceline"><span class="mlrow-price">${fmt(now)}</span></div>
          ${was>now ? `<div class="mlrow-savings">Ahorrás ${fmt(was - now)}</div>` : ''}
          <button class="mlrow-add" type="button" data-mladd><svg class="cart-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg><span>Agregar</span></button>
        </div>
      </a>`;
    }

    // Genera un <section> de bloque. layout: 'grid' (2x2/2x4) | 'list' (lista vertical). max default 4.
    function blockHTML(title, items, layout, link, max){
      const lim = max || 4;
      let body;
      if (layout==='list'){
        body = `<div class="mllist">${items.slice(0,lim).map(rowItemHTML).join('')}</div>`;
      } else {
        body = `<div class="mlgrid">${items.slice(0,lim).map(cardHTML).join('')}</div>`;
      }
      // botón "Ver todos" abajo del bloque
      const foot = link ? `<div class="mlblock-foot"><a class="mlblock-seeall" href="${link}">Ver todos los productos <span class="arr">→</span></a></div>` : '';
      return `<section class="mlblock">
        <div class="container">
          <div class="mlblock-head"><h2>${title}</h2></div>
          ${body}
          ${foot}
        </div>
      </section>`;
    }

    // Slot de banner promocional (placeholder — después se carga la imagen real)
    function bannerHTML(){
      return `<div class="mlbanner">
        <div class="container">
          <div class="mlbanner-slot">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="M21 15l-5-5L5 19"/></svg>
            <span>Banner promocional</span>
          </div>
        </div>
      </div>`;
    }

    // Grid 2×2 estática de promos (estilo ML "Beneficios en entretenimiento")
    // Reemplazó al carrusel viejo — no desliza, no tiene dots, no tiene flechas.
    function promoGridHTML(){
      const esc = s => String(s == null ? '' : s)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
      const cards = PROMO_SLIDES.map(s => `
        <a class="pg-card" href="${esc(s.link)}" style="background:${esc(s.bg)};color:${esc(s.fg)}">
          <div class="pg-card-body">
            <span class="pg-eyebrow">${esc(s.eyebrow)}</span>
            <h3 class="pg-title">${esc(s.title)}</h3>
            <p class="pg-sub">${esc(s.subtitle)}</p>
          </div>
          <div class="pg-card-media" aria-hidden="true">
            <img src="${esc(s.img)}" alt="" loading="lazy" />
          </div>
        </a>
      `).join('');
      return `<section class="promo-grid" aria-label="Promociones destacadas">
        <div class="container">
          <div class="pg-grid">${cards}</div>
        </div>
      </section>`;
    }

    // 5 cards informativas (envíos, cuotas, efectivo, WhatsApp, +2.000 productos) — se inyectan ARRIBA, después del hero
    function infoCardsHTML(){
      const ICONS = {
        truck:    '<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
        card:     '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
        cash:     '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/>',
        shield:   '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
        whatsapp: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
        box:      '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/>',
      };
      const CARDS = [
        { icon:'truck',    title:'Envío en el día',         sub:'CABA y GBA antes de las 10hs',   link:'sobre-nosotros.html#envios' },
        { icon:'card',     title:'3 cuotas sin interés',    sub:'Con todas las tarjetas',          link:'sobre-nosotros.html#pagos' },
        { icon:'cash',     title:'15% OFF en efectivo',     sub:'Contraentrega CABA/GBA · 5% en transferencia',  link:'sobre-nosotros.html#pagos' },
        { icon:'whatsapp', title:'Atención por WhatsApp',   sub:'Bot rápido + asesor humano',      link:'https://wa.me/5491100000000' },
        { icon:'shield',   title:'Distribuidor oficial',    sub:'Star, ENA, Gold, Optimum, PGN',   link:'sobre-nosotros.html' },
      ];
      const renderItem = c => `
        <a class="infocard" href="${c.link}">
          <span class="infocard-ic" aria-hidden="true"><svg viewBox="0 0 24 24">${ICONS[c.icon]}</svg></span>
          <div class="infocard-txt">
            <div class="infocard-title">${c.title}</div>
            <p class="infocard-sub">${c.sub}</p>
          </div>
        </a>
      `;
      // Track duplicado (2 copias) → loop infinito sin saltos visibles
      // La 2da copia tiene aria-hidden para que el screen reader no la lea 2 veces
      const trackItems = CARDS.map(renderItem).join('') +
        CARDS.map(c => renderItem(c).replace('<a ', '<a aria-hidden="true" tabindex="-1" ')).join('');
      return `<div class="infocards" aria-label="Beneficios">
        <div class="infocards-track">${trackItems}</div>
      </div>`;
    }

    /* ---- BLOQUES POR TIPO ---- VACIADO: home solo tiene "Seguí viendo / Lo más buscado".
       Los bloques por tipo (Creatinas, Proteínas, etc.) viven solo en suplementos.html. */
    const BLOCKS = [];

    /* ====================================================================
       PRODUCTOS PATROCINADOS — espacio que las marcas PAGAN
       --------------------------------------------------------------------
       Para destacar un producto: copiá su "marca|nombre" exacto del catálogo
       y pegalo en esta lista. Aparecerá en el bloque "Destacados" arriba de
       todo. Para sacarlo cuando la marca deje de pagar, borrá la línea.
       El cliente NO ve que es publicidad — se ve como una recomendación.
       ==================================================================== */
    const PATROCINADOS = [
      // Cuando una marca pague, agregá acá su 'Marca|Nombre' exacto del catálogo.
      // (El bloque "Destacados de la semana" está desactivado por ahora.)
    ];

    let html = '';

    /* ---- BLOQUE 1: "Seguí viendo" (solo si hay historial, máx 4) ---- */
    const hist = getHistory().map(findByPid).filter(Boolean);
    if (hist.length >= 2) {
      html += blockHTML('Seguí viendo', hist.slice(0,4), 'grid', 'suplementos.html', 4);
    }

    /* ---- BLOQUE 2: "Lo más buscado de Morashop" SIEMPRE (8 productos mix) ---- */
    const histPidsSet = new Set(getHistory());
    const TIPOS_MIX = ['creatinas','proteinas','pre-entrenos','bcaa'];
    const masBuscado = TIPOS_MIX.flatMap(tipo =>
      REAL.filter(p => (p.types||[]).includes(tipo) && !histPidsSet.has(pidOf(p)))
          .sort((a,b) => fakeVendidos(b) - fakeVendidos(a))
          .slice(0,2)
    ).slice(0,8);
    if (masBuscado.length >= 4) {
      html += blockHTML('Lo más buscado de Morashop', masBuscado, 'grid', 'suplementos.html', 8);
    }

    /* ---- BLOQUES FIJOS (alternan grilla 2x2 / lista vertical, banner cada 3) ---- */
    let bloquesRenderizados = 0;
    let slotsIntercalados = 0; // cuenta slots (carrusel o banners) que ya inyectamos
    BLOCKS.forEach((b) => {
      const items = REAL
        .filter(p => (p.types||[]).includes(b.type))
        .sort((a,c) => discount(c) - discount(a))
        .slice(0, 8);
      if (items.length < 4) return;
      // par = grilla 2x2, impar = lista vertical
      const layout = (bloquesRenderizados % 2 === 0) ? 'grid' : 'list';
      html += blockHTML(b.t, items, layout, 'suplementos.html');
      bloquesRenderizados++;
      // slot intercalado cada 3 bloques de productos
      // el PRIMER slot lleva el CARRUSEL DE PROMOS (movido desde el hero).
      // los siguientes quedan como "Banner promocional" (publicidad de marca pagada).
      if (bloquesRenderizados % 3 === 0) {
        html += (slotsIntercalados === 0) ? promoGridHTML() : bannerHTML();
        slotsIntercalados++;
      }
    });

    /* ---- BLOQUES OTRAS CATEGORÍAS (mostrar variedad del catálogo) ---- */
    function topPorCat(catKey, max){
      const arr = (window.CATALOG_BY_CAT && window.CATALOG_BY_CAT[catKey]) || [];
      return [...arr]
        .map(p => ({ ...p, __cat: catKey }))
        .sort((a,b) => discount(b) - discount(a))
        .slice(0, max || 4);
    }

    const supermercadoTop = topPorCat('supermercado', 4);
    if (supermercadoTop.length >= 4) {
      html += blockHTML('Supermercado', supermercadoTop, 'list', 'supermercado.html', 4);
    }

    const electroTop = topPorCat('electro', 4);
    if (electroTop.length >= 4) {
      html += blockHTML('Electro-Hogar', electroTop, 'grid', 'electro.html', 4);
    }

    host.innerHTML = html;

    // Beneficios (5 cards) — se inyectan ARRIBA, justo después del hero
    const topInfo = document.getElementById('topInfoCards');
    if (topInfo) topInfo.innerHTML = infoCardsHTML();

    /* ---- INICIALIZAR PROMO CAROUSEL (si se inyectó) ---- */
    initPromoCarousel();

    /* ---- Botón "Agregar al carrito" (cards y filas de lista) ---- */
    host.querySelectorAll('[data-mladd]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        const cont = e.currentTarget.closest('.mlcard, .mlrow-item');
        const pid  = cont && decodeURIComponent(cont.dataset.pid || '');
        const prod = pid ? findByPid(pid) : null;
        if (prod && window.Cart) {
          window.Cart.add({ id:pid, brand:prod.brand, name:prod.name, price:toNum(prod.price), img:prod.img, cat:'suplementos' });
        }
        const original = e.currentTarget.textContent;
        e.currentTarget.textContent = 'Agregado ✓';
        setTimeout(() => { e.currentTarget.textContent = original; }, 1400);
      });
    });

    /* ---- Al clickear un producto (card o fila), guardar en historial ---- */
    host.querySelectorAll('.mlcard, .mlrow-item').forEach(item => {
      item.addEventListener('click', e => {
        if (e.target.closest('[data-mladd]')) return; // el botón no cuenta
        const pid = decodeURIComponent(item.dataset.pid || '');
        if (!pid) return;
        let h = getHistory().filter(x => x !== pid);
        h.unshift(pid);
        h = h.slice(0, 12);
        try { localStorage.setItem(HKEY, JSON.stringify(h)); } catch(err){}
      });
    });
  })();
