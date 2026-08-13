/* ============================================================
   CLUB MORA — miembros (editable). name = nombre a mostrar (best-effort,
   editá lo que quieras). handle = usuario IG. url se arma solo.
   ============================================================ */
/* followers = aprox (para ordenar; 0 = sin dato). desc = descripción humana. */
const MEMBERS = [
  { name: "Abril Ranieri",        handle: "abrilranieri",         followers: 0,       desc: "Fitness y lifestyle",                       cat: "fitness" },
  { name: "Gero Arias",           handle: "geroooo_arias2.0",     followers: 5912807, desc: "366 dominadas y al ring",                   cat: "calistenia" },
  { name: "Arquero Metalero",     handle: "arquerometalero",      followers: 0,       desc: "Arquero y fierro",                          cat: "futbol" },
  { name: "Agustín Sabbione",     handle: "agu.sabbione",         followers: 0,       desc: "Mindset & Fitness Coach · Personal coach",  cat: "coaching" },
  { name: "Nazarena Pérez",       handle: "nazarenaperez__",      followers: 93000,   desc: "Ciclismo BMX freestyle",                    cat: "bmx" },
  { name: "Agustín Nobile",       handle: "nobileagustinn",       followers: 0,       desc: "Fitness y lifestyle",                       cat: "fitness" },
  { name: "Vicki Bara",           handle: "vickibara",            followers: 0,       desc: "Entrenamiento y fitness",                   cat: "fitness" },
  { name: "Julián Tomás",         handle: "julianttomas",         followers: 0,       desc: "Jugador de rugby",                          cat: "rugby" },
  { name: "LEP Programming",      handle: "lep_programming",      followers: 0,       desc: "Coach de Crossfit",                         cat: "crossfit" },
  { name: "Enzo Pérez",           handle: "enzoperezfitness",     followers: 30000,   desc: "Entrenador personal",                       cat: "coaching" },
  { name: "Jazmín Ramírez",       handle: "jazminlramirez",       followers: 0,       desc: "Recetas de comidas",                        cat: "recetas" },
  { name: "Franco Dal Bianco",    handle: "franco_dalbianco",     followers: 32000,   desc: "Jugador profesional de pádel",              cat: "padel" },
  { name: "Brian Impellizzeri",   handle: "brianimpellizzeri.ok", followers: 14000,   desc: "Campeón mundial de salto en largo",         cat: "atletismo" },
  { name: "Álvaro Matricardi",    handle: "alvaro.matricardi",    followers: 0,       desc: "Levantamiento de potencia",                 cat: "powerlifting" },
  { name: "Amarela García",       handle: "amarelagarciaok",      followers: 20000,   desc: "Recetas y vida saludable",                  cat: "recetas" },
  { name: "Eugenia",              handle: "nutricion.eugenia",    followers: 0,       desc: "Nutrición y hábitos",                       cat: "nutricion" },
  { name: "Fitness Poch",         handle: "fitnesspoch",          followers: 0,       desc: "Entrenamiento y fitness",                   cat: "fitness" },
  { name: "Martu Coach",          handle: "martucoach_",          followers: 0,       desc: "Coaching de entrenamiento", pic: "martucoach_.webp", pos: "50% 6%", cat: "coaching" },
  { name: "M. Troncoso",          handle: "mmatroncoso",          followers: 11000,   desc: "Boxeo y artes marciales",                   cat: "boxeo" },
  { name: "Maiki Fit",            handle: "maikiifit",            followers: 0,       desc: "Entrenamiento y nutrición",                 cat: "fitness" },
  { name: "Aixa Tebaldi",         handle: "aixa.tebaldi",         followers: 9276,    desc: "Atleta élite de fuerza",                    cat: "powerlifting" },
  { name: "Francisco Ojeda",      handle: "franciscoojeda.pf",    followers: 37000,   desc: "Entrenador personal",                       cat: "coaching" },
  { name: "Daiana Sanson",        handle: "daianasanson",         followers: 0,       desc: "Entrenamiento y fitness",                   cat: "fitness" },
  { name: "Santi Saint Lary",     handle: "santi_saintlary",      followers: 0,       desc: "Coaching fitness",                          cat: "coaching" },
  { name: "Nati Cieplicki",       handle: "naticieplicki",        followers: 0,       desc: "Campeona de fisicoculturismo",              cat: "culturismo" },
  { name: "Angie",                handle: "angiemshk",            followers: 0,       desc: "Coaching fitness online",                   cat: "coaching" },
  { name: "Juan Alloco",          handle: "juancriallocofit",     followers: 0,       desc: "Entrenamiento y fitness", pic: "juan-alloco.webp", cat: "fitness" },
  { name: "Matías Tizón",         handle: "matiastizon",          followers: 0,       desc: "Entrenador personal", pic: "matias-tizon.webp", cat: "coaching" },
  { name: "Eduardo Borrero",      handle: "eduardoborreropro",    followers: 38000,   desc: "Culturista IFBB Pro",                       cat: "culturismo" },
  { name: "Fran Setzes",          handle: "fransetzes",           followers: 0,       desc: "Fitness, rutinas y vlogs",                  cat: "fitness" },
  { name: "Juli Sawczuk",         handle: "juli.sawczuk",         followers: 0,       desc: "Fitness y vida saludable",                  cat: "fitness" },
  { name: "Bautista Belloso",     handle: "bautistabelloso_",     followers: 0,       desc: "Deporte y fitness",                         cat: "fitness" },
  { name: "Marti Pérez",          handle: "marrtuperez",          followers: 0,       desc: "Fitness y lifestyle",                       cat: "fitness" },
  { name: "Belu Falcucci",        handle: "belufalcucci",         followers: 0,       desc: "Fitness y lifestyle",                       cat: "fitness" },
  { name: "Prisci Carrel",        handle: "priscicarrel",         followers: 0,       desc: "Fitness y lifestyle",                       cat: "fitness" }
];

/* Disciplinas (label + color del chip) */
const CATS = {
  fitness:      { label: "Fitness",          c: "#ff5a3c" },
  coaching:     { label: "Coaching",         c: "#4d86ff" },
  recetas:      { label: "Recetas",          c: "#f0b429" },
  nutricion:    { label: "Nutrición",        c: "#2FBF4E" },
  powerlifting: { label: "Powerlifting",     c: "#a882ff" },
  crossfit:     { label: "Crossfit",         c: "#ff7a3c" },
  boxeo:        { label: "Boxeo / MMA",      c: "#ff4d4d" },
  bmx:          { label: "BMX",              c: "#38d6e6" },
  padel:        { label: "Pádel",            c: "#2fd6a0" },
  atletismo:    { label: "Atletismo",        c: "#e6c02e" },
  rugby:        { label: "Rugby",            c: "#7bc043" },
  culturismo:   { label: "Fisicoculturismo", c: "#ff6b5c" },
  calistenia:   { label: "Calistenia",       c: "#ff9f40" },
  futbol:       { label: "Fútbol",           c: "#4bd07a" }
};

/* gradientes de avatar (marca + variaciones), se cyclan por índice */
const GRADS = [
  "linear-gradient(135deg,#E8341A,#C72D17)",
  "linear-gradient(135deg,#1A2744,#2c3e66)",
  "linear-gradient(135deg,#E8341A,#1A2744)",
  "linear-gradient(135deg,#C72D17,#E8341A)",
  "linear-gradient(135deg,#2c3e66,#0B0F1A)",
  "linear-gradient(135deg,#E8341A,#7a1a0e)"
];

const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
const norm = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const initials = (name) => {
  const w = name.replace(/[·.]/g, " ").split(/\s+/).filter(Boolean);
  return ((w[0]?.[0] || "") + (w[1]?.[0] || "")).toUpperCase();
};
const IG_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.9-.1zm0 1.6c-3.1 0-3.5 0-4.8.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.4-.3 1-.4 2.1-.1 1.3-.1 1.7-.1 4.8s0 3.5.1 4.8c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.2 1 .3 2.1.4 1.3.1 1.7.1 4.8.1s3.5 0 4.8-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.4.3-1 .4-2.1.1-1.3.1-1.7.1-4.8s0-3.5-.1-4.8c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.3-.4-.4-.8-.6-1.3-.8-.4-.2-1-.3-2.1-.4-1.3-.1-1.7-.1-4.8-.1zm0 4.1a4.1 4.1 0 1 1 0 8.2 4.1 4.1 0 0 1 0-8.2zm0 6.8a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4zm5.2-7a1 1 0 1 1-1.9 0 1 1 0 0 1 1.9 0z"/></svg>';

function render(list) {
  const grid = document.getElementById("club-grid");
  grid.innerHTML = list.map((m, i) => {
    const url = "https://www.instagram.com/" + m.handle + "/";
    const desc = m.desc ? `<p class="mcard__desc">${esc(m.desc)}</p>` : "";
    const photo = m.pic ? m.pic : (m.handle + ".jpg");
    const posStyle = m.pos ? ` style="object-position:${m.pos}"` : "";
    const cat = CATS[m.cat] || CATS.fitness;
    return `
    <article class="mcard" data-cat="${m.cat || 'fitness'}" style="--cc:${cat.c}">
      <div class="mcard__avatar" style="background:${GRADS[i % GRADS.length]}">
        <span class="mcard__ini">${esc(initials(m.name))}</span>
        <img class="mcard__pic" src="assets/fotos/${photo}"${posStyle} alt="${esc(m.name)}" loading="lazy" onerror="this.remove()" />
      </div>
      <h2 class="mcard__name">${esc(m.name)}</h2>
      <span class="mcard__cat">${esc(cat.label)}</span>
      ${desc}
      <p class="mcard__handle">@${esc(m.handle)}</p>
      <a class="mcard__btn" href="${url}" target="_blank" rel="noopener noreferrer">${IG_SVG} Seguir</a>
    </article>`;
  }).join("");
  revealCards();
}

function revealCards() {
  const cards = document.querySelectorAll(".mcard");
  if (!("IntersectionObserver" in window)) { cards.forEach(c => c.classList.add("is-in")); return; }
  const io = new IntersectionObserver((es) => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { threshold: 0.06, rootMargin: "0px 0px -6% 0px" });
  cards.forEach((c, i) => { c.style.transitionDelay = Math.min(i, 12) * 35 + "ms"; io.observe(c); });
}

/* Riel marquee de disciplinas */
function fillDiscRail() {
  const track = document.getElementById("disc-rail");
  if (!track) return;
  const discs = ["Boxeo","Powerlifting","Running","Pádel","BMX","Nutrición","Calistenia","Crossfit","Atletismo","Fitness","Recetas fit","MMA"];
  const unit = discs.map(d => `<span>${d}</span>`).join('<span class="dot">·</span>');
  let out = ""; for (let i = 0; i < 4; i++) { out += unit + '<span class="dot">·</span>'; }
  track.innerHTML = out;
}

/* Count-up de stats */
function countUp(el, target) {
  if (!("requestAnimationFrame" in window) || !("performance" in window)) { el.textContent = target; return; }
  const dur = 1200, t0 = performance.now();
  const tick = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick); else el.textContent = target;
  };
  requestAnimationFrame(tick);
}
function initStats() {
  const sm = document.getElementById("stat-members");
  const sd = document.getElementById("stat-disc");
  const discCount = new Set(MEMBERS.map(m => m.cat || "fitness")).size;
  if (!("IntersectionObserver" in window)) { if (sm) sm.textContent = MEMBERS.length; if (sd) sd.textContent = discCount; return; }
  const hero = document.querySelector(".hero");
  const io = new IntersectionObserver((es, o) => {
    es.forEach(e => { if (e.isIntersecting) { if (sm) countUp(sm, MEMBERS.length); if (sd) countUp(sd, discCount); o.disconnect(); } });
  }, { threshold: 0.2 });
  if (hero) io.observe(hero);
}

/* Filtro por disciplina (chips) */
function initFilters() {
  const cont = document.getElementById("club-filters");
  const grid = document.getElementById("club-grid");
  if (!cont || !grid) return;
  const counts = {};
  MEMBERS.forEach(m => { const k = m.cat || "fitness"; counts[k] = (counts[k] || 0) + 1; });
  const order = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  cont.innerHTML = ['<button class="club-chip is-active" data-cat="all" type="button">Todos</button>']
    .concat(order.map(k => { const cat = CATS[k] || CATS.fitness; return `<button class="club-chip" data-cat="${k}" type="button" style="--cc:${cat.c}">${esc(cat.label)}</button>`; })).join("");
  cont.addEventListener("click", (e) => {
    const b = e.target.closest(".club-chip"); if (!b) return;
    cont.querySelectorAll(".club-chip").forEach(x => x.classList.toggle("is-active", x === b));
    const cat = b.dataset.cat;
    grid.querySelectorAll(".mcard").forEach(card => { card.classList.toggle("is-hidden", !(cat === "all" || card.dataset.cat === cat)); });
  });
}

/* Reveal de secciones (.about / .join) */
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("is-in")); return; }
  const io = new IntersectionObserver((es) => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });
  els.forEach(e => io.observe(e));
}

document.addEventListener("DOMContentLoaded", () => {
  // Orden ponderado-aleatorio: más seguidores tienden a ir arriba, pero el orden
  // cambia en cada carga (no siempre el mismo arriba). Peso = log10(followers) para
  // que el spam de Gero (5.9M) no quede SIEMPRE fijo #1 y los demás roten/intercalen.
  const sorted = [...MEMBERS]
    .map(m => ({ m, k: Math.random() * Math.log10((m.followers || 0) + 10) }))
    .sort((a, b) => b.k - a.k)
    .map(x => x.m);
  render(sorted);
  initFilters();
  fillDiscRail();
  initStats();
  initReveal();
});
