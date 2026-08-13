/* ============================================================
   Morashop — Orientador de suplementos (quiz 5 preguntas)
   Recomienda PRODUCTOS reales, ajustados por objetivo + presupuesto.
   Orientativo — NO reemplaza a un profesional (disclaimers).
   Prototipo: "Agregar" es demo (toast). En la tienda → carrito nativo.
   ============================================================ */
const BASE = 'https://www.morashop.ar';
const IMG = 'https://acdn-us.mitiendanube.com/stores/002/268/228/products/';

/* Productos reales del catálogo */
const PROD = {
  whey2lb:    { name: 'Whey Protein Star Nutrition 2 Lb',        cat: 'Proteína',  price: '$72.229', url: 'proteina-de-suero-whey-protein-star-nutrition-doypack-x-2-lb/', img: '1-2091f046cdb9e699d617310762984465-480-0.webp' },
  platinum:   { name: 'Platinum Whey Protein 907g',             cat: 'Proteína',  price: '$77.544', url: 'suplemento-en-polvo-star-nutrition-platinum-whey-protein-907g/', img: '31-eb5d41310c156ecde816686054084737-480-0.webp' },
  creaStar:   { name: 'Creatina Monohidratada Star 300g',       cat: 'Creatina',  price: '$29.518', url: 'creatina-monohidratada-star-nutrition-300-gr-doypack/', img: '5-1f234b354bbd2ec40517274466084347-480-0.webp' },
  creaEna:    { name: 'Creatina Micronizada Ena 300g',          cat: 'Creatina',  price: '$28.014', url: 'suplemento-en-polvo-ena-sport-creatina-micronizada-sabor-neutro-en-sachet-de-300g1/', img: 'suplemento-en-polvo-ena-sport-creatina-micronizada-300g-sabor-1d2513142816483a1c16965538195786-480-0.webp' },
  pumpV8:     { name: 'Pump V8 Pre Workout 285g',               cat: 'Pre-entreno', price: '$36.532', url: 'pump-v8-pre-workout-star-nutrition-285-gr-cafeina-taurina/', img: 'dfdf-f2f81f5876d6616d7816965485756348-480-0.webp' },
  tnt:        { name: 'Pre Entreno TNT Dynamite',               cat: 'Pre-entreno', price: '$27.426', url: 'suplemento-en-polvo-star-nutrition-pre-entreno-tnt-dynamite-aminoacidos-en-pote-de-240ml/', img: '1588-blue-ra-11bce9471258677a0317401460089233-480-0.webp' },
  thermo:     { name: 'Thermo Fuel 120 Caps',                  cat: 'Quemador',  price: '$23.936', url: 'thermo-fuel-x-120-caps-star-nutrition-quemador-termogenico/', img: 'thermo-fuel-x-120-caps-star-nutrition-quemador-termogenico-913e23295695387e7517049827228010-480-0.webp' },
  hydroxy:    { name: 'Hydroxy Max Black 120 Tabs',            cat: 'Quemador',  price: '$13.439', url: 'hydroxy-max-black120-tabs-ena-termogenico-descenso-de-peso/', img: '17673-2c39ee6dc968fb367317465390292958-480-0.webp' },
  lipoXtreme: { name: 'Lipo Xtreme 60 Comp',                   cat: 'Quemador',  price: '$8.802',  url: 'lipo-xtreme-quemador-de-grasa-60-comp-body-advance/', img: '1603-118ab65727b53772f717401609157210-480-0.webp' },
  omega:      { name: 'Omega 3 Max 1000 EPA 60 caps',          cat: 'Salud',     price: '$86.626', url: 'omega-3-max-1000-epa-500-dha-innovanaturals-60caps-ifos-goed/', img: 'omega-3-max-1000-epa-500-dha-innovanaturals-60caps-ifos-goed-454c3b5ca9a3b85c6d17659080390301-480-0.webp' },
  colageno:   { name: 'Colágeno Hidrolizado 210g',            cat: 'Salud',     price: '$20.836', url: 'colageno-hydrolizado-x210-gr-suplemento-star-nutrition/', img: 'colageno-hydrolizado-x210-gr-suplemento-star-nutrition-sabor-limon-9729bd66e819f5a03517049828415284-480-0.webp' },
  magnesio:   { name: 'Citrato de Magnesio 1kg',              cat: 'Salud',     price: '$20.444', url: 'suplemento-natural-whey-citrato-de-magnesio-en-sachet-de-1kg/', img: '6-2985f2aaf52c8fb53516964641547957-480-0.webp' },
  ultraMass:  { name: 'Ena Ultra Mass Ganador 1500g',         cat: 'Ganador',   price: '$59.293', url: 'ena-super-ultra-mass-suplemento-en-polvo-1500g/', img: 'ena-super-ultra-mass-suplemento-en-polvo-1500-gr-choco-9e0d22959b5b0f5d4317510265976638-480-0.webp' },
  mutantMass: { name: 'Mutant Mass 5kg Ganador',             cat: 'Ganador',   price: '$148.991',url: 'mutant-mass-5-kg-ganador-de-masa-muscular-star-nutrition/', img: 'ss-480c82e20b5ae14c2916968155577346-480-0.webp' },
  mtorBcaa:   { name: 'MTOR BCAA 270g Aminoácidos',          cat: 'Aminos',    price: '$33.660', url: 'mtor-bcaa-270-gr-star-nutrition-aminoacido-nueva-formula/', img: 'mtor-bcaa-270-gr-star-nutrition-aminoacido-nueva-formula-c70e8843a0b28f63d316988446988389-480-0.webp' },
  gelEnergy:  { name: 'Gel Energy Cafeína x12',              cat: 'Energía',   price: '$16.633', url: 'gel-energy-mervick-lab-repositor-energetico-cafeina-x-12-un-sabor-frutos-rojos/', img: 'fefedf-61bc77b629abd65ed116970709735567-480-0.webp' },
  cafeina:    { name: 'Cafeína 200mg 30 caps',               cat: 'Energía',   price: '$8.948',  url: 'cafeina-caffeine-200mg-star-nutrition-30cap-rendimiento-sabor-neutro/', img: '31-e5dbe649ad49c0fcbf17231407817018-480-0.webp' }
};
const CATURL = {
  'Proteína': '/suplementos/proteinas/', 'Creatina': '/suplementos/creatinas/', 'Pre-entreno': '/suplementos/pre-entrenos/',
  'Quemador': '/suplementos/quemadores/', 'Salud': '/suplementos/vitaminas-y-salud/', 'Ganador': '/suplementos/ganadores/',
  'Aminos': '/suplementos/bcaa-aminos/', 'Energía': '/suplementos/cafeina-energia/'
};

const QUESTIONS = [
  { id: 'objetivo', q: '¿Cuál es tu objetivo principal?', help: 'Elegí el que más te representa hoy.', multi: false,
    options: [
      { v: 'masa', label: 'Ganar masa muscular', emoji: '💪' },
      { v: 'grasa', label: 'Bajar grasa / definir', emoji: '🔥' },
      { v: 'energia', label: 'Más energía y rendimiento', emoji: '⚡' },
      { v: 'salud', label: 'Salud y bienestar', emoji: '🧘' },
      { v: 'recuperacion', label: 'Recuperar mejor', emoji: '🔄' }
    ] },
  { id: 'entreno', q: '¿Cómo entrenás?', help: 'Tu actividad principal.', multi: false,
    options: [
      { v: 'fuerza', label: 'Fuerza / gimnasio', emoji: '🏋️' },
      { v: 'cardio', label: 'Cardio / running', emoji: '🏃' },
      { v: 'deporte', label: 'Deporte / equipo', emoji: '⚽' },
      { v: 'arranco', label: 'Recién arranco', emoji: '🌱' },
      { v: 'poco', label: 'Poco o nada', emoji: '🚶' }
    ] },
  { id: 'nivel', q: '¿Hace cuánto entrenás?', help: 'Para ajustar la recomendación.', multi: false,
    options: [
      { v: 'principiante', label: 'Principiante', sub: 'Menos de 6 meses', emoji: '🐣' },
      { v: 'intermedio', label: 'Intermedio', sub: '6 meses a 2 años', emoji: '🔩' },
      { v: 'avanzado', label: 'Avanzado', sub: 'Más de 2 años', emoji: '🏆' }
    ] },
  { id: 'prefs', q: '¿Alguna preferencia?', help: 'Podés elegir varias (o ninguna).', multi: true,
    options: [
      { v: 'sinlactosa', label: 'Sin lactosa', emoji: '🚫' },
      { v: 'vegano', label: 'Vegano / vegetal', emoji: '🌱' },
      { v: 'sabor', label: 'Que sea rico', emoji: '😋' }
    ] },
  { id: 'presupuesto', q: '¿Qué presupuesto manejás?', help: 'Ajustamos las opciones a tu bolsillo.', multi: false,
    options: [
      { v: 'economico', label: 'Económico', sub: 'Lo que más rinde', emoji: '💰' },
      { v: 'equilibrado', label: 'Equilibrado', sub: 'Calidad/precio', emoji: '⚖️' },
      { v: 'premium', label: 'Premium', sub: 'Lo mejor', emoji: '⭐' }
    ] }
];

function recommend(a) {
  const obj = a.objetivo, entreno = a.entreno, nivel = a.nivel, prefs = a.prefs || [], pres = a.presupuesto;
  const veg = prefs.includes('vegano') || prefs.includes('sinlactosa');
  const prem = pres === 'premium', eco = pres === 'economico';
  const proteina = prem ? 'platinum' : 'whey2lb';
  const creatina = eco ? 'creaEna' : 'creaStar';
  const quemador = eco ? 'lipoXtreme' : (prem ? 'thermo' : 'hydroxy');
  const preentreno = eco ? 'tnt' : 'pumpV8';
  const energia = (entreno === 'cardio' || entreno === 'deporte') ? 'gelEnergy' : 'cafeina';
  const ganador = prem ? 'mutantMass' : 'ultraMass';
  let title = '', intro = '', items = [];

  if (obj === 'masa') {
    title = 'Ganar masa muscular';
    intro = 'Construir músculo: proteína para la síntesis + creatina para rendir más en cada serie.';
    items = [
      { key: proteina, why: veg ? 'Elegí la variante vegetal o aislada para tu proteína diaria.' : 'Completá tu proteína diaria y construí músculo.' },
      { key: creatina, why: 'El suplemento más respaldado por evidencia para fuerza y volumen.' }
    ];
    items.push((nivel === 'principiante' || entreno === 'arranco')
      ? { key: ganador, why: 'Si te cuesta subir de peso, sumá calorías de calidad.' }
      : { key: 'mtorBcaa', why: 'Aminos para cuidar el músculo en cada entrenamiento.' });
  } else if (obj === 'grasa') {
    title = 'Bajar grasa y definir';
    intro = 'Sostené el músculo en déficit: proteína alta + un empujón de energía.';
    items = [
      { key: proteina, why: 'Mantené la masa muscular mientras bajás grasa.' },
      { key: quemador, why: 'Acompaña el déficit. Revisá contraindicaciones con un profesional.' },
      { key: energia, why: 'Energía y foco para sostener el entrenamiento.' }
    ];
  } else if (obj === 'energia') {
    title = 'Más energía y rendimiento';
    intro = 'Entrená con todo: pre-entreno para el empuje + creatina para la fuerza.';
    items = [
      { key: preentreno, why: 'Energía, foco y bomba muscular antes de entrenar.' },
      { key: 'creaStar', why: 'Más potencia y fuerza en cada serie.' },
      { key: energia, why: (entreno === 'cardio' || entreno === 'deporte') ? 'Energía rápida para tu deporte.' : 'Un shot de foco cuando lo necesitás.' }
    ];
  } else if (obj === 'salud') {
    title = 'Salud y bienestar';
    intro = 'Cubrí lo esencial: omega, colágeno y minerales para tu día a día.';
    items = [
      { key: 'omega', why: 'Omega 3 de alta pureza para corazón, cerebro y articulaciones.' },
      { key: 'colageno', why: 'Colágeno para piel, articulaciones y tejidos.' },
      { key: 'magnesio', why: 'Magnesio para descanso, energía y recuperación.' }
    ];
  } else {
    title = 'Recuperar mejor';
    intro = 'Menos dolor, más constancia: proteína para reparar + aminos y minerales.';
    items = [
      { key: proteina, why: 'Reparás y construís músculo después de entrenar.' },
      { key: 'mtorBcaa', why: 'BCAA para bajar el daño muscular y el dolor.' },
      { key: 'magnesio', why: 'Magnesio para descanso y recuperación.' }
    ];
  }
  const seen = new Set();
  items = items.filter(i => (seen.has(i.key) ? false : (seen.add(i.key), true))).slice(0, 3);
  const notes = [];
  if (veg) notes.push('Preferís sin lactosa/vegano: en Proteína elegí la variante vegetal o aislada.');
  if (prefs.includes('sabor')) notes.push('La mayoría viene en varios sabores: elegí el tuyo en la ficha.');
  if (eco) notes.push('Elegimos las opciones que más rinden por peso, para cuidar tu bolsillo.');
  if (prem) notes.push('Te sugerimos la línea premium por tu elección de presupuesto.');
  if (nivel === 'principiante') notes.push('Sos principiante: con proteína + creatina ya tenés la base cubierta.');
  return { title, intro, items: items.map(i => ({ p: PROD[i.key], why: i.why })), notes };
}

/* ============ Motor ============ */
const state = { i: 0, answers: {} };
const modal = document.getElementById('mqm');
const screens = { quiz: document.querySelector('[data-screen="quiz"]'), result: document.querySelector('[data-screen="result"]') };
const quizBody = document.getElementById('quizBody');
const resultBody = document.getElementById('resultBody');
const progressBar = document.getElementById('progressBar');
const quizCount = document.getElementById('quizCount');

function esc(s){return (''+s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function show(name){ Object.entries(screens).forEach(([k, el]) => { el.hidden = k !== name; }); }
function open(){ state.i = 0; state.answers = {}; modal.hidden = false; document.body.style.overflow = 'hidden'; show('quiz'); renderQuestion(); }
function close(){ modal.hidden = true; document.body.style.overflow = ''; }

function renderQuestion() {
  const total = QUESTIONS.length, Q = QUESTIONS[state.i], cur = state.answers[Q.id];
  progressBar.style.width = (state.i / total * 100) + '%';
  quizCount.textContent = (state.i + 1) + ' / ' + total;
  const opts = Q.options.map((o, idx) => {
    const sel = Q.multi ? (Array.isArray(cur) && cur.includes(o.v)) : (cur === o.v);
    return `<button class="opt${sel ? ' is-sel' : ''}" data-v="${o.v}" style="--d:${idx * 0.04}s">
        <span class="opt__emoji">${o.emoji}</span>
        <span class="opt__txt"><span class="opt__label">${esc(o.label)}</span>${o.sub ? `<span class="opt__sub">${esc(o.sub)}</span>` : ''}</span>
        <span class="opt__check" aria-hidden="true"></span></button>`;
  }).join('');
  quizBody.innerHTML = `<div class="qcard">
      <h2 class="qcard__q">${esc(Q.q)}</h2><p class="qcard__help">${esc(Q.help)}</p>
      <div class="opts">${opts}</div>
      ${Q.multi ? `<button class="btn btn--primary qcard__next" data-action="next">${(Array.isArray(cur) && cur.length) ? 'Continuar' : 'Continuar sin elegir'}
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>` : ''}
    </div>`;
  const b = modal.querySelector('.mqm__body'); if (b) b.scrollTop = 0;
}
function pick(v) {
  const Q = QUESTIONS[state.i];
  if (Q.multi) {
    let arr = Array.isArray(state.answers[Q.id]) ? state.answers[Q.id].slice() : [];
    arr = arr.includes(v) ? arr.filter(x => x !== v) : arr.concat(v);
    state.answers[Q.id] = arr; renderQuestion();
  } else { state.answers[Q.id] = v; setTimeout(next, 200); }
}
function next(){ if (state.i < QUESTIONS.length - 1){ state.i++; renderQuestion(); } else { renderResult(); show('result'); } }
function back(){ if (state.i === 0){ close(); return; } state.i--; show('quiz'); renderQuestion(); }

function renderResult() {
  const r = recommend(state.answers);
  progressBar.style.width = '100%';
  const cards = r.items.map((it, idx) => `
    <div class="pcard" style="--d:${idx * 0.07}s">
      <a class="pcard__media" href="${BASE}/productos/${it.p.url}" target="_blank" rel="noopener"><img src="${IMG}${it.p.img}" alt="${esc(it.p.name)}" loading="lazy" width="200" height="200"></a>
      <div class="pcard__info">
        <span class="pcard__cat">${esc(it.p.cat)}</span>
        <a class="pcard__name" href="${BASE}/productos/${it.p.url}" target="_blank" rel="noopener">${esc(it.p.name)}</a>
        <div class="pcard__why">${esc(it.why)}</div>
        <div class="pcard__row">
          <span class="pcard__price">${esc(it.p.price)}</span>
          <button class="pcard__add" data-add="${esc(it.p.name)}">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6h15l-1.5 9h-12z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="9" cy="20" r="1.4" fill="currentColor"/><circle cx="18" cy="20" r="1.4" fill="currentColor"/><path d="M6 6L5 3H2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            Agregar
          </button>
        </div>
      </div>
    </div>`).join('');
  const notes = r.notes.length ? `<ul class="rnotes">${r.notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul>` : '';
  resultBody.innerHTML = `
    <div class="result__head">
      <span class="eyebrow">Sugerencia orientativa</span>
      <h2 class="result__title">${esc(r.title)}</h2>
      <p class="result__intro">${esc(r.intro)}</p>
    </div>
    <div class="pcards">${cards}</div>
    <div class="result__disc" role="note">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.1l-8-14a2 2 0 0 0-3.4 0z"/></svg>
      <div><strong>Importante:</strong> esta sugerencia es <strong>orientativa</strong> y se basa solo en tus respuestas. <strong>No reemplaza la evaluación de un médico o nutricionista.</strong> Consultá a un profesional antes de comenzar cualquier suplementación, especialmente si tenés alguna condición de salud, tomás medicación, estás embarazada o en período de lactancia.</div>
    </div>
    ${notes}
    <div class="result__cta">
      <a class="btn btn--primary btn--wide" href="${BASE}/suplementos/" target="_blank" rel="noopener">Ver todos los suplementos</a>
      <button class="btn btn--ghost" data-action="restart">Rehacer</button>
    </div>`;
  const b = modal.querySelector('.mqm__body'); if (b) b.scrollTop = 0;
}
function restart(){ state.i = 0; state.answers = {}; show('quiz'); renderQuestion(); }

function addDemo(name, btn) {
  btn.classList.add('is-added'); btn.innerHTML = '✓ Agregado';
  let t = document.getElementById('mqToast');
  if (!t) { t = document.createElement('div'); t.id = 'mqToast'; t.className = 'mq-toast'; document.body.appendChild(t); }
  t.innerHTML = '🛒 <strong>' + esc(name) + '</strong> agregado <em>(demo)</em>';
  t.classList.add('show');
  clearTimeout(window.__mqt); window.__mqt = setTimeout(() => t.classList.remove('show'), 2600);
}

document.addEventListener('click', (e) => {
  const opt = e.target.closest('.opt'); if (opt) { pick(opt.dataset.v); return; }
  const add = e.target.closest('[data-add]'); if (add) { addDemo(add.dataset.add, add); return; }
  const act = e.target.closest('[data-action]'); if (!act) return;
  const a = act.dataset.action;
  if (a === 'open') open(); else if (a === 'close') close();
  else if (a === 'next') next(); else if (a === 'back') back(); else if (a === 'restart') restart();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) close(); });
