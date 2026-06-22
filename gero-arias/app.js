/* ============================================================
   GERO ARIAS × MORASHOP — app.js
   Datos editables (productos / videos) + render + motion.
   Para actualizar precios: editar PRODUCTOS abajo (o a futuro
   levantar de la API de Tiendanube).
   ============================================================ */

/* ---------- 1) PRODUCTOS (datos reales, editables) ---------- */
const PRODUCTOS = [
  {
    nombre: "L-Citrulline 300g Star Nutrition",
    tag: "Pre-entreno · Óxido nítrico",
    precio: 59448, efectivo: 50531, cuota3: 19816,
    img: "https://acdn-us.mitiendanube.com/stores/002/268/228/products/l-citrulline-300-gr-star-nutrition-citrulina-malato-pre-entreno-oxido-nitrico-750ae7be0a0bbcf56a17049828706844-640-0.webp",
    link: "https://www.morashop.ar/productos/l-citrulline-300-gr-star-nutrition-citrulina-malato-pre-entreno-oxido-nitrico/"
  },
  {
    nombre: "Omega 3 Max 1000 EPA + 500 DHA Innovanaturals 60caps",
    tag: "Salud · Omega-3",
    precio: 82294, efectivo: 69950, cuota3: 27431,
    img: "https://acdn-us.mitiendanube.com/stores/002/268/228/products/omega-3-max-1000-epa-500-dha-innovanaturals-60caps-ifos-goed-454c3b5ca9a3b85c6d17659080390301-640-0.webp",
    link: "https://www.morashop.ar/productos/omega-3-max-1000-epa-500-dha-innovanaturals-60caps-ifos-goed/"
  },
  {
    nombre: "C4 Ultimate Preworkout Cellucor",
    tag: "Pre-entreno",
    precio: 111851, efectivo: 95073, cuota3: 37284,
    img: "https://acdn-us.mitiendanube.com/stores/002/268/228/products/c4-ultimate-pre-workout-powder-icy-blue-razz-c56cb8982f7453eda017518961568769-640-0.webp",
    link: "https://www.morashop.ar/productos/c4-ultimate-preworkout-cellucor-6s4ut/"
  },
  {
    nombre: "Granger Pancake Proteico Dulce de Leche 300g",
    tag: "Desayuno proteico",
    precio: 13349, efectivo: 11347, cuota3: 4450,
    img: "https://acdn-us.mitiendanube.com/stores/002/268/228/products/d_758169-mla112406319643_052026-o-95a74d76d478ab1d7317803328911087-640-0.webp",
    link: "https://www.morashop.ar/productos/granger-pancake-proteico-300g-dulce-de-leche-c7qzf/"
  },
  {
    nombre: "Granger Pancakes Proteicos Vainilla 400g",
    tag: "Desayuno proteico",
    precio: 13349, efectivo: 11347, cuota3: 4450,
    img: "https://acdn-us.mitiendanube.com/stores/002/268/228/products/d_831301-mla106122704302_022026-o-1b6de99bd2bdbc956517733355623324-640-0.webp",
    link: "https://www.morashop.ar/productos/pancakes-proteicos-sabor-vainilla-granger-400-g-yuams/"
  },
  {
    nombre: "Star Nutrition Platinum Whey Protein 907g",
    tag: "Proteína",
    precio: 71211, efectivo: 60529, cuota3: 23737,
    img: "https://acdn-us.mitiendanube.com/stores/002/268/228/products/31-eb5d41310c156ecde816686054084737-1024-1024.webp",
    link: "https://www.morashop.ar/productos/suplemento-en-polvo-star-nutrition-platinum-whey-protein-907g/"
  },
  {
    nombre: "ZMA Star Nutrition x90 caps",
    tag: "Descanso · Recuperación",
    precio: 16433, efectivo: 13968, cuota3: 5478,
    img: "https://acdn-us.mitiendanube.com/stores/002/268/228/products/sdd-4fc77a55da63bc4e5716972234143459-640-0.webp",
    link: "https://www.morashop.ar/productos/zma-star-nutrition-zinc-magnesio-y-vitamina-b6-x-90-capsulas-sabor-sin-sabor/"
  },
  {
    nombre: "Animal Pak en Polvo 44 scoops 383g Universal",
    tag: "Multivitamínico",
    precio: 103455, efectivo: 87937, cuota3: 34485,
    img: "https://acdn-us.mitiendanube.com/stores/002/268/228/products/animal-pak-383g-berries-5030a08388980ae12217597713533198-640-0.webp",
    link: "https://www.morashop.ar/productos/animal-pak-en-polvo-44-scoops-383-g-universal/"
  },
  {
    nombre: "ENA Sport Creatina Micronizada 300g",
    tag: "Creatina",
    precio: 24694, efectivo: 20990, cuota3: 8231,
    img: "https://acdn-us.mitiendanube.com/stores/002/268/228/products/suplemento-en-polvo-ena-sport-creatina-micronizada-300g-sabor-1d2513142816483a1c16965538195786-640-0.webp",
    link: "https://www.morashop.ar/productos/suplemento-en-polvo-ena-sport-creatina-micronizada-sabor-neutro-en-sachet-de-300g1/"
  }
];

/* Categorías para el filtro (orden = orden de los chips) */
const CAT_LABELS = { pre: "Pre-entreno", proteina: "Proteína", creatina: "Creatina", salud: "Salud" };
const CATS = ["pre", "salud", "pre", "proteina", "proteina", "proteina", "salud", "salud", "creatina"];
PRODUCTOS.forEach((p, i) => { p.cat = CATS[i] || "salud"; });

/* ---------- 2) VIDEOS YouTube (editables) ---------- */
const VIDEOS = [
  { titulo: "Acepté una PELEA ILEGAL antes de LA VELADA", id: "HzZ5j6Lm8aU" },
  { titulo: "Boxee en la Favela Más Peligrosa de Brasil",  id: "QN4PPPCFX1s" },
  { titulo: "Mi Pelea Más Importante (Párense de Manos)",   id: "3uDP4u8-_hI" },
  { titulo: "Peleé Contra un Campeón Mundial de Boxeo",     id: "fvIVHMDXvgs" }
];

/* ---------- 3) Helpers ---------- */
const ARS = n => "$" + Math.round(n).toLocaleString("es-AR");
const off = (precio, efectivo) => Math.round((1 - efectivo / precio) * 100);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------- 4) Render productos ---------- */
function renderProductos() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;
  grid.innerHTML = PRODUCTOS.map((p, i) => {
    const pct = (p.efectivo && p.precio) ? off(p.precio, p.efectivo) : 0;
    const offBadge = pct >= 5 ? `<span class="card__off">${pct}% OFF</span>` : "";
    const efectivo = Number.isFinite(p.efectivo) ? p.efectivo : p.precio;
    const ahorro = (Number.isFinite(p.precio) && Number.isFinite(efectivo) && p.precio > efectivo)
      ? `<p class="card__save">Ahorrás ${ARS(p.precio - efectivo)}</p>` : "";
    const cuotas = Number.isFinite(p.cuota3)
      ? `<p class="card__inst">o <b>3 cuotas sin interés</b> de ${ARS(p.cuota3)}</p>` : "";
    return `
    <article class="card reveal reveal--scale" data-cat="${p.cat}" data-idx="${i}" style="--d:${Math.min(i, 8) * 55}ms">
      <a class="card__media" href="${p.link}" target="_blank" rel="noopener noreferrer" tabindex="-1" aria-hidden="true">
        <img src="${p.img}" alt="${esc(p.nombre)}" loading="lazy" width="640" height="640" />
        ${offBadge}
      </a>
      <div class="card__body">
        <p class="card__pick"><b>366</b> Elegido por Gero</p>
        <p class="card__tag">${esc(p.tag)}</p>
        <h3 class="card__name">${esc(p.nombre)}</h3>
        <div class="card__pricing">
          <p class="card__was">${ARS(p.precio)}</p>
          <p class="card__price"><b>${ARS(efectivo)}</b><em>con efectivo</em></p>
          ${ahorro}
          ${cuotas}
        </div>
        <a class="card__btn" href="${p.link}" target="_blank" rel="noopener noreferrer">
          Comprar
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
      </div>
    </article>`;
  }).join("");
}

/* ---------- 5) Render videos ---------- */
function renderVideos() {
  const grid = document.getElementById("video-grid");
  if (!grid) return;
  const playSVG = `<svg viewBox="0 0 68 48" aria-hidden="true"><path fill="#E8341A" d="M66.5 7.7c-.8-3-2.5-5.3-5.5-6.1C55.5.2 34 .2 34 .2S12.5.2 7 1.6C4 2.4 2.3 4.7 1.5 7.7.1 13.2.1 24 .1 24s0 10.8 1.4 16.3c.8 3 2.5 5.3 5.5 6.1C12.5 47.8 34 47.8 34 47.8s21.5 0 27-1.4c3-.8 4.7-3.1 5.5-6.1C67.9 34.8 67.9 24 67.9 24s0-10.8-1.4-16.3z"/><path fill="#fff" d="M27 34.5 45 24 27 13.5z"/></svg>`;
  grid.innerHTML = VIDEOS.map((v, i) => `
    <a class="video-card reveal" style="--d:${i * 80}ms" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener noreferrer">
      <div class="video-card__thumb">
        <img src="https://img.youtube.com/vi/${v.id}/hqdefault.jpg" alt="Video: ${esc(v.titulo)}" loading="lazy" width="480" height="360" />
        <span class="video-card__play">${playSVG}</span>
      </div>
      <p class="video-card__title">${esc(v.titulo)}</p>
    </a>
  `).join("");
}

/* ---------- 6) Riel 366 (relleno del marquee) ---------- */
function fillRail() {
  const track = document.getElementById("rail-track");
  if (!track) return;
  const unit = `<span>366 · La gloria será eterna ·</span>`;
  // duplicado x N para loop continuo sin huecos (translateX -50%)
  track.innerHTML = unit.repeat(16);
}

/* ---------- 6b) Count-up del 366 al entrar en viewport ---------- */
function initCounters() {
  const els = document.querySelectorAll("[data-count]");
  if (!els.length) return;

  const run = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    if (!("requestAnimationFrame" in window)) { el.textContent = target; return; }
    const dur = 1300, t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);           // ease-out cúbico
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
  };

  if (!("IntersectionObserver" in window)) { els.forEach(run); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.5 });
  els.forEach(e => io.observe(e));
}

/* ---------- 7) Reveal on scroll ---------- */
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach(e => e.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  els.forEach(e => io.observe(e));
}

/* ---------- 7b) Parallax hero + progreso de la capa 366 (1 solo listener) ---------- */
function initScrollMotion() {
  const saga = document.querySelector(".saga__num");
  if (!saga) return;
  let ticking = false;
  const frame = () => {
    const y = window.pageYOffset || 0, vh = window.innerHeight || 1;
    const p = Math.min(1, y / vh);
    saga.style.setProperty("--p", p.toFixed(3)); // solo el 366 de fondo crece/rota (sin parallax del contenido)
    ticking = false;
  };
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  frame();
}

/* ---------- 7d) Sheen escalonado en mobile (desktop usa :hover) ---------- */
function initSheen() {
  if (matchMedia("(pointer:fine)").matches) return;
  if (!("IntersectionObserver" in window)) return;
  const cards = document.querySelectorAll("#product-grid .card");
  const so = new IntersectionObserver((es) => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      const d = parseInt(e.target.style.getPropertyValue("--d"), 10) || 0;
      setTimeout(() => e.target.classList.add("is-sheen"), d + 160);
      so.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  cards.forEach(c => so.observe(c));
}

/* ---------- 7e) Riel 366 multicapa (clona el track relleno en uno outline) ---------- */
function fillRailGhost() {
  const track = document.getElementById("rail-track");
  if (!track) return;
  const rail = track.closest(".rail");
  if (!rail || rail.querySelector(".rail__track--ghost")) return;
  const ghost = track.cloneNode(true);
  ghost.id = ""; ghost.classList.add("rail__track--ghost"); ghost.setAttribute("aria-hidden", "true");
  rail.appendChild(ghost);
}

/* ---------- 7f) Lightbox de YouTube inline ---------- */
function initYTLightbox() {
  const grid = document.getElementById("video-grid");
  if (!grid) return;
  grid.addEventListener("click", (e) => {
    const a = e.target.closest(".video-card");
    if (!a) return;
    e.preventDefault();
    let id; try { id = new URL(a.href).searchParams.get("v"); } catch (_) { return; }
    if (!id) return;
    const box = document.createElement("div");
    box.className = "yt-lightbox"; box.tabIndex = -1;
    box.innerHTML = '<div class="yt-lightbox__panel"><button class="yt-lightbox__x" aria-label="Cerrar">&times;</button>' +
      '<iframe src="https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0" allow="autoplay;encrypted-media" allowfullscreen title="Video de Gero"></iframe></div>';
    document.body.appendChild(box);
    requestAnimationFrame(() => box.classList.add("is-open"));
    box.focus();
    const close = () => { box.classList.remove("is-open"); setTimeout(() => box.remove(), 300); document.removeEventListener("keydown", esc); };
    const esc = (ev) => { if (ev.key === "Escape") close(); };
    box.addEventListener("click", (ev) => { if (ev.target === box || ev.target.closest(".yt-lightbox__x")) close(); });
    document.addEventListener("keydown", esc);
  });
}

/* ---------- 7h) Scroll suave (glide) en links internos — corre aunque el SO tenga reduced-motion ---------- */
function initSmoothScroll() {
  const docEl = document.documentElement;
  const easeInOutCubic = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  function tweenTo(toY, dur) {
    const startY = window.pageYOffset || 0;
    const dist = toY - startY;
    const t0 = performance.now();
    const prev = docEl.style.scrollBehavior;
    docEl.style.scrollBehavior = "auto"; // evita pelea con scroll-behavior:smooth del CSS
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      window.scrollTo(0, startY + dist * easeInOutCubic(p));
      if (p < 1) requestAnimationFrame(step);
      else docEl.style.scrollBehavior = prev;
    };
    requestAnimationFrame(step);
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (!id || id === "#" || id.length < 2) return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    const bar = document.querySelector(".topbar");
    const off = bar ? bar.getBoundingClientRect().height : 0;
    const y = el.getBoundingClientRect().top + (window.pageYOffset || 0) - off - 6;
    const dist = Math.abs(y - (window.pageYOffset || 0));
    tweenTo(y, Math.min(1100, Math.max(500, dist * 0.5))); // duración proporcional a la distancia
    if (history.replaceState) history.replaceState(null, "", id);
  });
}

/* ---------- 7i) Filtro de productos por tipo (chips) ---------- */
function initFilters() {
  const cont = document.getElementById("product-filters");
  const grid = document.getElementById("product-grid");
  if (!cont || !grid) return;
  const order = [];
  PRODUCTOS.forEach(p => { if (order.indexOf(p.cat) === -1) order.push(p.cat); });
  const chips = ['<button class="chip is-active" data-cat="all" type="button">Todos</button>']
    .concat(order.map(c => `<button class="chip" data-cat="${c}" type="button">${CAT_LABELS[c] || c}</button>`));
  cont.innerHTML = chips.join("");
  cont.addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    cont.querySelectorAll(".chip").forEach(x => x.classList.toggle("is-active", x === b));
    const cat = b.dataset.cat;
    grid.querySelectorAll(".card").forEach(card => {
      card.classList.toggle("is-hidden", !(cat === "all" || card.dataset.cat === cat));
    });
  });
}

/* ---------- 7j) Quick-view de producto (tap en la foto → modal, sin salir) ---------- */
function openQuickView(p) {
  const pct = (p.efectivo && p.precio) ? off(p.precio, p.efectivo) : 0;
  const ahorro = (Number.isFinite(p.precio) && Number.isFinite(p.efectivo) && p.precio > p.efectivo)
    ? `<p class="card__save">Ahorrás ${ARS(p.precio - p.efectivo)}</p>` : "";
  const cuotas = Number.isFinite(p.cuota3)
    ? `<p class="card__inst">o <b>3 cuotas sin interés</b> de ${ARS(p.cuota3)}</p>` : "";
  const box = document.createElement("div");
  box.className = "qv"; box.tabIndex = -1;
  box.innerHTML = `
    <div class="qv__panel" role="dialog" aria-modal="true" aria-label="${esc(p.nombre)}">
      <button class="qv__x" aria-label="Cerrar">&times;</button>
      <div class="qv__media">
        ${pct >= 5 ? `<span class="card__off">${pct}% OFF</span>` : ""}
        <img src="${p.img}" alt="${esc(p.nombre)}" />
      </div>
      <div class="qv__info">
        <p class="card__pick"><b>366</b> Elegido por Gero</p>
        <p class="card__tag">${esc(p.tag)}</p>
        <h3 class="qv__name">${esc(p.nombre)}</h3>
        <p class="card__was">${ARS(p.precio)}</p>
        <p class="card__price"><b>${ARS(p.efectivo)}</b><em>con efectivo</em></p>
        ${ahorro}${cuotas}
        <a class="card__btn" href="${p.link}" target="_blank" rel="noopener noreferrer">
          Comprar en Morashop
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
      </div>
    </div>`;
  document.body.appendChild(box);
  requestAnimationFrame(() => box.classList.add("is-open"));
  box.focus();
  const close = () => { box.classList.remove("is-open"); setTimeout(() => box.remove(), 300); document.removeEventListener("keydown", esc); };
  const esc = (ev) => { if (ev.key === "Escape") close(); };
  box.addEventListener("click", (ev) => { if (ev.target === box || ev.target.closest(".qv__x")) close(); });
  document.addEventListener("keydown", esc);
}
function initQuickView() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;
  grid.addEventListener("click", (e) => {
    const media = e.target.closest(".card__media");
    if (!media) return;
    e.preventDefault();
    const art = media.closest(".card");
    const i = art ? parseInt(art.getAttribute("data-idx"), 10) : -1;
    const p = PRODUCTOS[i];
    if (p) openQuickView(p);
  });
}

/* ---------- 8) Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderProductos();
  renderVideos();
  fillRail();
  initReveal();
  initCounters();
  initScrollMotion();
  initSheen();
  initYTLightbox();
  initSmoothScroll();
  initFilters();
  initQuickView();
});
