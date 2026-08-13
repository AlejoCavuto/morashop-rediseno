/* ============================================================
   MORASHOP — Home preview · datos demo + animaciones sutil-premium
   Imágenes reales de producto (CDN mitiendanube). Precios de ejemplo.
   ============================================================ */
const CDN = "https://acdn-us.mitiendanube.com/stores/003/462/441/products/";
const IMG = {
  whey:   CDN+"whey-v-d06ddaf9fb13a7dd0c17125287842799-1024-1024.webp",
  crea:   CDN+"creatina-fondo-gris-0b1937f7a74c352cf417125292728167-1024-1024.webp",
  pre:    CDN+"pre-nox-pump-fondo-gris-c894708ebc411bb5a617125302728298-1024-1024.webp",
  bcaa:   CDN+"bcaa-fondo-gris-b96277c8ace4ee1d6717125300706525-1024-1024.webp",
  choco:  CDN+"whey-choco-62f74cc16048c0a1cd17125288660898-1024-1024.webp",
  colag:  CDN+"colageno-fondo-grispng-d562886c6049ce558d17125296539012-1024-1024.webp",
  gluta:  CDN+"glutamina-db2dc18247565b49b417550128394584-1024-1024.webp",
  mag:    CDN+"magnesio-d7f8913f786b18779317550117891618-1024-1024.webp"
};

const PRODUCTOS = [
  { img:IMG.whey,  tag:"Proteína",   nombre:"Whey Protein Concentrate Vainilla 907g", precio:39999, off:33, rating:4.9, revs:1283 },
  { img:IMG.crea,  tag:"Creatina",   nombre:"Creatina Micronizada Monohidrato 300g",  precio:24900, off:38, rating:5.0, revs:2104 },
  { img:IMG.pre,   tag:"Pre-entreno",nombre:"Pre Nox Pump · Óxido Nítrico 300g",       precio:24999, off:36, rating:4.8, revs:762 },
  { img:IMG.bcaa,  tag:"Aminos",     nombre:"BCAA Mega Ratio 12:1:1 · 120 comp.",      precio:19900, off:28, rating:4.7, revs:544 },
  { img:IMG.choco, tag:"Proteína",   nombre:"Whey Protein Cacao Amargo 907g",          precio:47999, off:0,  rating:4.9, revs:911 },
  { img:IMG.colag, tag:"Articular",  nombre:"Colágeno Hidrolizado + Vit C",            precio:27900, off:31, rating:4.8, revs:688 },
  { img:IMG.gluta, tag:"Recuperación",nombre:"Glutamina Micronizada 300g",             precio:20900, off:24, rating:4.7, revs:402 },
  { img:IMG.mag,   tag:"Salud",      nombre:"Citrato de Magnesio · 90 caps",           precio:20900, off:24, rating:4.9, revs:1330 }
];

const CATS = [
  { nombre:"Proteínas",   img:IMG.whey },
  { nombre:"Creatinas",   img:IMG.crea },
  { nombre:"Pre-entrenos",img:IMG.pre },
  { nombre:"BCAA · Aminos",img:IMG.bcaa },
  { nombre:"Recuperación",img:IMG.gluta },
  { nombre:"Salud",       img:IMG.mag }
];

const ARS = n => "$" + Math.round(n).toLocaleString("es-AR");
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));

/* ---------- Card producto ---------- */
function cardHTML(p, i){
  const was = p.off ? Math.round(p.precio / (1 - p.off/100)) : 0;
  const efec = p.precio * 0.85;              // 15% off efectivo
  const cuota = p.precio / 3;
  const stars = "★★★★★";
  return `
  <article class="card reveal" style="--d:${Math.min(i,6)*60}ms">
    <div class="card__media">
      ${p.off ? `<span class="card__off">${p.off}% OFF</span>` : ""}
      <img class="gz-blur" data-blur src="${p.img}" alt="${esc(p.nombre)}" loading="lazy" width="512" height="512" />
    </div>
    <div class="card__body">
      <p class="card__stars">${stars}<small>(${p.revs})</small></p>
      <h3 class="card__name">${esc(p.nombre)}</h3>
      ${was ? `<p class="card__was">${ARS(was)}</p>` : `<p class="card__was" style="visibility:hidden">.</p>`}
      <p class="card__price">${ARS(p.precio)}</p>
      <span class="card__efec">💰 ${ARS(efec)} efectivo</span>
      <p class="card__cuo">3x sin interés de ${ARS(cuota)}</p>
      <button class="card__btn" type="button" data-add>
        Comprar <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
  </article>`;
}

function renderRail(id, items){ const el=document.getElementById(id); if(el) el.innerHTML = items.map(cardHTML).join(""); }
function renderBest(){ const el=document.getElementById("bestGrid"); if(el) el.innerHTML = PRODUCTOS.slice(0,5).map(cardHTML).join(""); }
function renderSeen(){
  const el=document.getElementById("railSeen"); if(!el) return;
  el.innerHTML = PRODUCTOS.slice(2,8).map((p,i)=>`
    <article class="card reveal" style="--d:${i*50}ms">
      <div class="card__media"><img class="gz-blur" data-blur src="${p.img}" alt="${esc(p.nombre)}" loading="lazy"/></div>
      <div class="card__body"><h3 class="card__name">${esc(p.nombre)}</h3><p class="card__price">${ARS(p.precio)}</p></div>
    </article>`).join("");
}
function renderCats(){
  const el=document.getElementById("catsGrid"); if(!el) return;
  el.innerHTML = CATS.map((c,i)=>`
    <a class="cat reveal" href="#" style="--d:${i*70}ms">
      <span class="cat__glow" aria-hidden="true"></span>
      <img class="cat__img gz-blur" data-blur src="${c.img}" alt="${esc(c.nombre)}" loading="lazy"/>
      <span class="cat__name">${esc(c.nombre)}</span>
    </a>`).join("");
}
function fillBene(){
  const t=document.getElementById("beneTrack"); if(!t) return;
  const items=["🚚 Envío gratis desde $70.000","💳 Hasta 3 cuotas sin interés","💰 15% off en efectivo","🔒 Comprá 100% seguro","📦 Envío a todo el país","⭐ Marcas oficiales"];
  const unit=items.map(x=>`<span>${x}</span>`).join('<span class="dot">•</span>');
  let out=""; for(let i=0;i<3;i++){ out += unit + '<span class="dot">•</span>'; }
  t.innerHTML = out;
}

/* ---------- Count-up ---------- */
function initCounters(){
  const els=document.querySelectorAll("[data-count]"); if(!els.length) return;
  const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
  const run=el=>{
    const to=parseInt(el.dataset.count,10)||0, suf=el.dataset.suffix||"";
    if(reduce||!("requestAnimationFrame" in window)){ el.textContent=to.toLocaleString("es-AR")+suf; return; }
    const dur=1400,t0=performance.now();
    const tick=now=>{ const p=Math.min(1,(now-t0)/dur); el.textContent=Math.round(to*(1-Math.pow(1-p,3))).toLocaleString("es-AR")+suf; if(p<1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  if(!("IntersectionObserver" in window)){ els.forEach(run); return; }
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ run(e.target); io.unobserve(e.target); } }),{threshold:.6});
  els.forEach(e=>io.observe(e));
}

/* ---------- Reveal on scroll ---------- */
function initReveal(){
  const els=document.querySelectorAll(".reveal");
  if(!("IntersectionObserver" in window)){ els.forEach(e=>e.classList.add("is-in")); return; }
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("is-in"); io.unobserve(e.target); } }),{rootMargin:"0px 0px -10% 0px", threshold:.05});
  els.forEach(e=>io.observe(e));
}

/* ---------- Blur-up de imágenes (percepción de rapidez) ---------- */
function initBlurUp(){
  const imgs=document.querySelectorAll("[data-blur]");
  const reveal=img=>{ if(img.complete && img.naturalWidth){ img.classList.add("shown"); } else { img.addEventListener("load",()=>img.classList.add("shown"),{once:true}); img.addEventListener("error",()=>img.classList.add("shown"),{once:true}); } };
  if(!("IntersectionObserver" in window)){ imgs.forEach(reveal); return; }
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ reveal(e.target); io.unobserve(e.target); } }),{rootMargin:"200px"});
  imgs.forEach(i=>io.observe(i));
}

/* ---------- Header shrink ---------- */
function initHeader(){
  const hd=document.getElementById("hd"); if(!hd) return; let t=false;
  const f=()=>{ hd.classList.toggle("scrolled",(window.pageYOffset||0)>10); t=false; };
  addEventListener("scroll",()=>{ if(!t){ t=true; requestAnimationFrame(f); } },{passive:true}); f();
}

/* ---------- Flechas del carrusel ---------- */
function initArrows(){
  document.querySelectorAll(".strip__arrow").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const rail=btn.closest(".strip").querySelector(".strip__rail");
      if(rail) rail.scrollBy({ left:(parseInt(btn.dataset.dir,10)||1)*260, behavior:"smooth" });
    });
  });
}

/* ---------- Agregar al carrito: feedback + vuela al carrito ---------- */
let cartCount=0;
function bumpCart(){
  cartCount++;
  const badge=document.getElementById("cartBadge");
  if(badge){ badge.textContent=cartCount; badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump"); }
}
function flyToCart(imgEl){
  const cart=document.getElementById("cartBtn"); if(!cart||!imgEl) return;
  const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
  if(reduce){ bumpCart(); return; }
  const s=imgEl.getBoundingClientRect(), e=cart.getBoundingClientRect();
  const fly=imgEl.cloneNode(true);
  fly.className="fly"; fly.removeAttribute("data-blur");
  fly.style.left=s.left+"px"; fly.style.top=s.top+"px"; fly.style.width=s.width+"px"; fly.style.height=s.height+"px";
  document.body.appendChild(fly);
  const dx=(e.left+e.width/2)-(s.left+s.width/2), dy=(e.top+e.height/2)-(s.top+s.height/2);
  fly.animate(
    [ {transform:"translate(0,0) scale(1)", opacity:1},
      {transform:`translate(${dx*0.5}px,${dy*0.5-60}px) scale(.7)`, opacity:.9, offset:.6},
      {transform:`translate(${dx}px,${dy}px) scale(.12)`, opacity:.2} ],
    { duration:750, easing:"cubic-bezier(.4,0,.2,1)" }
  ).onfinish=()=>{ fly.remove(); bumpCart(); };
}
function initAddToCart(){
  document.body.addEventListener("click",e=>{
    const btn=e.target.closest("[data-add]"); if(!btn) return;
    const card=btn.closest(".card"); const img=card && card.querySelector(".card__media img");
    flyToCart(img);
    const html=btn.innerHTML; btn.classList.add("done"); btn.innerHTML="✓ Agregado";
    setTimeout(()=>{ btn.classList.remove("done"); btn.innerHTML=html; }, 1400);
  });
}

document.addEventListener("DOMContentLoaded", ()=>{
  renderRail("railImportados", PRODUCTOS);
  renderCats();
  renderSeen();
  renderBest();
  fillBene();
  initCounters();
  initReveal();
  initBlurUp();
  initHeader();
  initArrows();
  initAddToCart();
});
