/* ============================================================
   CRIS GROSZ × MORASHOP — app.js (boceto)
   Datos de productos = referencia (Grosz Nutrition). Al publicar
   se reemplazan por el catálogo real / render server-side.
   ============================================================ */

/* ---------- Productos (Grosz Nutrition — fotos reales, fondo gris estudio) ---------- */
/* Landing promocional: ignoramos prefers-reduced-motion para que las animaciones
   de marca se vean en TODOS los dispositivos/navegadores (decision del dueno).
   Parchea solo esa media query; el resto (pointer/hover/width) pasa sin tocar. */
(function(){
  if(!window.matchMedia) return;
  var _mm = window.matchMedia.bind(window);
  window.matchMedia = function(q){
    if(typeof q === "string" && q.indexOf("prefers-reduced-motion") !== -1){
      return { matches:false, media:q, onchange:null, addEventListener:function(){}, removeEventListener:function(){}, addListener:function(){}, removeListener:function(){}, dispatchEvent:function(){ return false; } };
    }
    return _mm(q);
  };
})();

const IMG = "assets/productos/";
const PRODUCTOS = [
  { img:IMG+"whey-vainilla.jpg", tag:"Proteína",    nombre:"Whey Protein Concentrate Vainilla 907g",     precio:39999, off:33 },
  { img:IMG+"whey-cacao.jpg",    tag:"Proteína",    nombre:"Whey Protein Concentrate Cacao Amargo 907g", precio:47999, off:0  },
  { img:IMG+"creatina.jpg",      tag:"Creatina",    nombre:"Creatina Micronizada Monohidrato 150g",      precio:24900, off:38 },
  { img:IMG+"pre-nox-pump.jpg",  tag:"Pre-entreno", nombre:"Pre Nox Pump · Pre-entreno",                 precio:24999, off:36 },
  { img:IMG+"bcaa.jpg",          tag:"Aminoácidos", nombre:"BCAA Mega Ratio 12:1:1",                     precio:19900, off:28 },
  { img:IMG+"glutamina.jpg",     tag:"Recuperación",nombre:"Glutamina Micronizada",                      precio:20900, off:24 },
  { img:IMG+"burn-max.jpg",      tag:"Quemador",    nombre:"Burn Max · Termogénico",                     precio:26999, off:30 },
  { img:IMG+"colageno.jpg",      tag:"Articular",   nombre:"Colágeno Hidrolizado",                       precio:27900, off:31 },
  { img:IMG+"omega-3.jpg",       tag:"Bienestar",   nombre:"Omega 3 · Aceite de pescado",                precio:18900, off:22 },
  { img:IMG+"magnesio.jpg",      tag:"Recuperación",nombre:"Citrato de Magnesio",                        precio:20900, off:24 },
  { img:IMG+"vitamina-c.jpg",    tag:"Bienestar",   nombre:"Vitamina C 1000mg",                          precio:15900, off:20 }
];

/* ---------- Videos YouTube (verificados embeddables) ---------- */
const VIDEOS = [
  { id:"fl4ofei10W4", titulo:"Vuelta al Prime 05" },
  { id:"BD6jn2NSBAw", titulo:"El gimnasio más culturista de Argentina" },
  { id:"5iLewV1CPTg", titulo:"Para entrenar no hay excusas" }
];

const ARS = n => "$" + Math.round(n).toLocaleString("es-AR");
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
const slug = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

function renderProductos(){
  const grid = document.getElementById("product-grid");
  if(!grid) return;
  grid.innerHTML = PRODUCTOS.map((p,i)=>{
    const was = p.off ? Math.round(p.precio / (1 - p.off/100)) : 0;
    const offBadge = p.off ? `<span class="card__off">${p.off}% OFF</span>` : "";
    const wasLine = was ? `<p class="card__was">${ARS(was)}</p>` : `<p class="card__was" style="visibility:hidden">.</p>`;
    const cuota = Math.round(p.precio/3);
    return `
    <article class="card reveal reveal--scale" data-idx="${i}" data-cat="${slug(p.tag)}" style="--d:${Math.min(i,7)*55}ms">
      <div class="card__media" role="button" tabindex="0" aria-label="Ver ${esc(p.nombre)}">
        ${offBadge}
        <img src="${p.img}?v=2" alt="${esc(p.nombre)}" loading="lazy" width="1024" height="1024" />
      </div>
      <div class="card__body">
        <p class="card__pick"><b>&#10022;</b> Elegido por Cris</p>
        <h3 class="card__name">${esc(p.nombre)}</h3>
        ${wasLine}
        <p class="card__price">${ARS(p.precio)}<em>3 cuotas sin interés de ${ARS(cuota)}</em></p>
        <a class="card__btn" href="https://www.morashop.ar/" rel="noopener">
          Comprar en Morashop
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
      </div>
    </article>`;
  }).join("");
}

/* ---------- Render videos ---------- */
function renderVideos(){
  const grid = document.getElementById("video-grid");
  if(!grid) return;
  const playSVG = `<svg viewBox="0 0 68 48" aria-hidden="true"><path fill="#FF0000" d="M66.5 7.7c-.8-3-2.5-5.3-5.5-6.1C55.5.2 34 .2 34 .2S12.5.2 7 1.6C4 2.4 2.3 4.7 1.5 7.7.1 13.2.1 24 .1 24s0 10.8 1.4 16.3c.8 3 2.5 5.3 5.5 6.1C12.5 47.8 34 47.8 34 47.8s21.5 0 27-1.4c3-.8 4.7-3.1 5.5-6.1C67.9 34.8 67.9 24 67.9 24s0-10.8-1.4-16.3z"/><path fill="#fff" d="M27 34.5 45 24 27 13.5z"/></svg>`;
  grid.innerHTML = VIDEOS.map((v,i)=>`
    <a class="video-card reveal" style="--d:${i*80}ms" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener noreferrer">
      <div class="video-card__thumb">
        <img src="https://img.youtube.com/vi/${v.id}/hqdefault.jpg" alt="${esc(v.titulo)}" loading="lazy" width="480" height="360" />
        <span class="video-card__play">${playSVG}</span>
      </div>
      <p class="video-card__title">${esc(v.titulo)}</p>
    </a>`).join("");
}

/* ---------- Riel marquee ---------- */
function fillRail(){
  const track = document.getElementById("rail-track");
  if(!track) return;
  const words = ["Trabajo real","Resultados reales","Suplementación natural","Invertí en tu salud"];
  const unit = words.map(w=>`<span>${w}</span>`).join('<span class="dot">·</span>');
  let out=""; for(let i=0;i<4;i++){ out += unit + '<span class="dot">·</span>'; }
  track.innerHTML = out;
}

/* ---------- Count-up ---------- */
function initCounters(){
  const els = document.querySelectorAll("[data-count]");
  if(!els.length) return;
  const run = (el)=>{
    const target = parseInt(el.dataset.count,10)||0;
    if(!("requestAnimationFrame" in window)){ el.textContent = target; return; }
    const dur=1300, t0=performance.now();
    const tick=(now)=>{
      const p=Math.min(1,(now-t0)/dur);
      el.textContent = Math.round(target*(1-Math.pow(1-p,3)));
      if(p<1) requestAnimationFrame(tick); else el.textContent=target;
    };
    requestAnimationFrame(tick);
  };
  if(!("IntersectionObserver" in window)){ els.forEach(run); return; }
  const io=new IntersectionObserver((es)=>{
    es.forEach(e=>{ if(e.isIntersecting){ run(e.target); io.unobserve(e.target); } });
  },{threshold:.5});
  els.forEach(e=>io.observe(e));
}

/* ---------- Reveal on scroll ---------- */
function initReveal(){
  // Auto-stagger: hijos .reveal de las grillas cascadean (mas notorio que todos juntos)
  document.querySelectorAll(".proof__grid,.angle__grid,.plans__grid,.videos__grid,.creds-list").forEach(grid=>{
    Array.prototype.slice.call(grid.children).forEach((child,i)=>{
      if(child.classList && child.classList.contains("reveal") && !child.style.getPropertyValue("--d")){
        child.style.setProperty("--d", (i*80)+"ms");
      }
    });
  });

  const els = document.querySelectorAll(".reveal");
  if(!("IntersectionObserver" in window)){ els.forEach(e=>e.classList.add("is-in")); return; }
  const io=new IntersectionObserver((es)=>{
    es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("is-in"); io.unobserve(e.target); } });
  },{rootMargin:"0px 0px -12% 0px", threshold:.02});
  els.forEach(e=>io.observe(e));

  // Failsafe: si el observer no dispara (scroll por momentum en mobile, etc.),
  // nada queda invisible: revela lo que ya entro en pantalla.
  setTimeout(()=>{
    els.forEach(e=>{
      if(e.classList.contains("is-in")) return;
      const r = e.getBoundingClientRect();
      if(r.top < window.innerHeight * 0.92) e.classList.add("is-in");
    });
  }, 1500);
}

/* ---------- Scroll FX: barra progreso + header + parallax + CTA sticky ---------- */
function initScrollFX(){
  const prog = document.getElementById("scrollProg");
  const bar  = document.querySelector(".topbar");
  const grid = document.querySelector(".hero__grid");
  let ticking = false;
  const frame = ()=>{
    const y = window.pageYOffset || 0;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if(prog) prog.style.width = (h>0 ? (y/h*100) : 0) + "%";
    if(bar)  bar.classList.toggle("scrolled", y > 8);
    if(grid) grid.style.transform = "translateY(" + (y*0.12).toFixed(1) + "px)";
    ticking = false;
  };
  window.addEventListener("scroll", ()=>{ if(!ticking){ ticking=true; requestAnimationFrame(frame); } }, { passive:true });
  frame();
}

/* ---------- Word-mask reveal en titulos [data-split] ---------- */
function splitWords(el){
  const out=[]; let idx=0;
  Array.prototype.forEach.call(el.childNodes, node=>{
    if(node.nodeType===3){ // texto
      node.textContent.split(/(\s+)/).forEach(tok=>{
        if(tok==="") return;
        if(/^\s+$/.test(tok)){ out.push(document.createTextNode(" ")); return; }
        const w=document.createElement("span"); w.className="word";
        const i=document.createElement("span"); i.className="word__i";
        i.textContent=tok; i.style.transitionDelay=(idx*45)+"ms"; idx++;
        w.appendChild(i); out.push(w);
      });
    } else if(node.nodeName==="BR"){
      out.push(document.createElement("br"));
    } else { // <em>/<span>/<small>: una unidad, conserva su estilo
      const w=document.createElement("span"); w.className="word";
      const i=document.createElement("span"); i.className="word__i";
      i.innerHTML = node.outerHTML || node.textContent;
      i.style.transitionDelay=(idx*45)+"ms"; idx++;
      w.appendChild(i); out.push(w);
    }
  });
  el.textContent=""; out.forEach(n=>el.appendChild(n));
}
function initSplitReveal(){
  const heads = document.querySelectorAll("[data-split]");
  if(!heads.length) return;
  Array.prototype.forEach.call(heads, splitWords);
  const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  if(reduce || !("IntersectionObserver" in window)){ Array.prototype.forEach.call(heads,h=>h.classList.add("is-in")); return; }
  const io=new IntersectionObserver((es)=>{
    es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("is-in"); io.unobserve(e.target); } });
  },{rootMargin:"0px 0px -12% 0px", threshold:.1});
  Array.prototype.forEach.call(heads,h=>io.observe(h));
}

/* ---------- Hero: spotlight que sigue el cursor (desktop) ---------- */
function initHeroSpot(){
  const hero=document.querySelector(".hero");
  if(!hero) return;
  if(!window.matchMedia("(pointer:fine)").matches) return;
  if(window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  hero.addEventListener("pointermove",(e)=>{
    const r=hero.getBoundingClientRect();
    hero.style.setProperty("--mx", ((e.clientX-r.left)/r.width*100).toFixed(1)+"%");
    hero.style.setProperty("--my", ((e.clientY-r.top)/r.height*100).toFixed(1)+"%");
  });
}

/* ---------- Botones magneticos (desktop) ---------- */
function initMagnetic(){
  if(!window.matchMedia("(pointer:fine)").matches) return;
  if(window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  document.querySelectorAll(".btn--green, .btn--lg, .plan--feat .plan__btn").forEach(btn=>{
    btn.classList.add("is-mag");
    let raf=null;
    btn.addEventListener("pointermove",(e)=>{
      const r=btn.getBoundingClientRect();
      const mx=(e.clientX-r.left-r.width/2)/r.width;
      const my=(e.clientY-r.top-r.height/2)/r.height;
      if(raf) cancelAnimationFrame(raf);
      raf=requestAnimationFrame(()=>{ btn.style.transform=`translate(${(mx*9).toFixed(1)}px,${(my*9).toFixed(1)}px)`; });
    });
    btn.addEventListener("pointerleave",()=>{ if(raf) cancelAnimationFrame(raf); btn.style.transform=""; });
  });
}

/* ---------- Ripple al tocar botones (touch + click, todos los dispositivos) ---------- */
function initRipple(){
  const sel = ".btn, .plan__btn, .card__btn";
  document.addEventListener("pointerdown",(e)=>{
    const btn = e.target.closest(sel);
    if(!btn) return;
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 2.2;
    const span = document.createElement("span");
    span.className = "btn__ripple";
    span.style.width = span.style.height = size + "px";
    span.style.left = (e.clientX - r.left) + "px";
    span.style.top  = (e.clientY - r.top) + "px";
    btn.appendChild(span);
    span.addEventListener("animationend", ()=> span.remove());
  }, { passive:true });
}

/* ---------- Tilt 3D en cards de producto (solo desktop, respeta reduced-motion) ---------- */
function initTilt(){
  if(window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  if(!window.matchMedia("(pointer:fine)").matches) return;
  document.querySelectorAll("#product-grid .card").forEach(card=>{
    let raf = null;
    card.addEventListener("pointermove",(e)=>{
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left)/r.width - 0.5;
      const py = (e.clientY - r.top)/r.height - 0.5;
      if(raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(()=>{
        card.style.transform = `perspective(900px) rotateX(${(-py*5).toFixed(2)}deg) rotateY(${(px*6).toFixed(2)}deg) translateY(-5px)`;
      });
    });
    card.addEventListener("pointerleave",()=>{ if(raf) cancelAnimationFrame(raf); card.style.transform = ""; });
  });
}

/* ============================================================
   PREMIUM FX v3 — 8 efectos
   ============================================================ */

/* 1) Scroll-parallax: solo activa la marca si el motor soporta view() */
function initScrollParallaxImg(){
  try{
    var ok = window.CSS && CSS.supports && CSS.supports('animation-timeline: view()');
    if(ok){ document.documentElement.classList.add('gz-par-on'); }
  }catch(e){ /* no-op: imagenes estaticas */ }
}

/* 2) Marquee inverso: rellena el track duplicando el contenido */
function initRail2(){
  const t = document.getElementById("gz-rail2-track");
  if(!t) return;
  const words = ["Creatina","Whey Protein","Pre-entreno","BCAA","Glutamina","Colageno","Magnesio"];
  const unit = words.map(w=>`<span>${w}</span>`).join('<span class="gz-dot">&bull;</span>');
  let out=""; for(let i=0;i<4;i++){ out += unit + '<span class="gz-dot">&bull;</span>'; }
  t.innerHTML = out;
}

/* 3) Proof: count-up del numero grande + barra de progreso */
function initProofBarsCount(){
  var cards = document.querySelectorAll(".proof__card");
  if(!cards.length) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  var canRAF = ("requestAnimationFrame" in window);
  function easeOut(t){ return 1 - Math.pow(1 - t, 3); }
  function animateNum(from, to, dur, write, done){
    if(!canRAF || reduce){ write(to); if(done) done(); return; }
    var t0 = performance.now();
    (function tick(now){
      var p = Math.min(1, (now - t0) / dur);
      var v = from + (to - from) * easeOut(p);
      write(v);
      if(p < 1){ requestAnimationFrame(tick); } else if(done){ done(); }
    })(performance.now());
  }
  cards.forEach(function(card){
    var big = card.querySelector(".proof__big");
    if(!big || big.dataset.pbcReady) return;
    var smallEl = big.querySelector("small");
    var smallHTML = smallEl ? smallEl.outerHTML : "";
    var leadText = "";
    Array.prototype.forEach.call(big.childNodes, function(node){
      if(node.nodeType === 1 && node.tagName.toLowerCase() === "small") return;
      leadText += (node.textContent || "");
    });
    leadText = leadText.replace(/\s+$/,"");
    var arrowMatch = leadText.match(/^(\D*)(\d+)\s*(?:→|->|➔)\s*(\d+)(\D*)$/);
    var singleMatch = leadText.match(/^(\D*?)(\d+)(\D*)$/);
    big.dataset.pbcReady = "1";
    var span = document.createElement("span");
    span.className = "gz-pbcount";
    var runCount;
    if(arrowMatch){
      var prefA = arrowMatch[1] || "";
      var nStart = parseInt(arrowMatch[2], 10);
      var nEnd   = parseInt(arrowMatch[3], 10);
      var sufA   = arrowMatch[4] || "";
      span.textContent = prefA + "0→0" + sufA;
      big.textContent = "";
      big.appendChild(span);
      if(smallHTML) big.insertAdjacentHTML("beforeend", smallHTML);
      runCount = function(){
        animateNum(0, nStart, 900, function(v){ span.textContent = prefA + Math.round(v) + "→" + nStart + sufA; }, function(){
          animateNum(nStart, nEnd, 700, function(v){ span.textContent = prefA + nStart + "→" + Math.round(v) + sufA; }, function(){
            span.textContent = prefA + nStart + "→" + nEnd + sufA;
          });
        });
      };
    } else if(singleMatch){
      var pref = singleMatch[1] || "";
      var nTo  = parseInt(singleMatch[2], 10);
      var suf  = singleMatch[3] || "";
      span.textContent = pref + "0" + suf;
      big.textContent = "";
      big.appendChild(span);
      if(smallHTML) big.insertAdjacentHTML("beforeend", smallHTML);
      runCount = function(){
        animateNum(0, nTo, 1300, function(v){ span.textContent = pref + Math.round(v) + suf; }, function(){ span.textContent = pref + nTo + suf; });
      };
    } else { runCount = function(){}; }
    var bar = document.createElement("span");
    bar.className = "gz-pbar"; bar.setAttribute("aria-hidden", "true");
    var fill = document.createElement("span"); fill.className = "gz-pbar__fill";
    bar.appendChild(fill); big.appendChild(bar);
    var started = false;
    function fire(){ if(started) return; started = true; runCount(); }
    if(card.classList.contains("is-in")){ fire(); }
    else if("IntersectionObserver" in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if(e.isIntersecting || e.target.classList.contains("is-in")){ fire(); io.disconnect(); } });
      }, { rootMargin:"0px 0px -12% 0px", threshold:.2 });
      io.observe(card);
      var mo = new MutationObserver(function(){ if(card.classList.contains("is-in")){ fire(); mo.disconnect(); io.disconnect(); } });
      mo.observe(card, { attributes:true, attributeFilter:["class"] });
    } else { fire(); }
  });
}

/* 4) Clip-wipe + blur-up para imagenes de cards y thumbs de video */
function initImgWipe(){
  var imgs = [].slice.call(document.querySelectorAll(".card__media img, .video-card__thumb img"));
  if(!imgs.length) return;
  function reveal(i){ i.classList.add("gz-shown"); }
  Array.prototype.forEach.call(imgs, function(i){ i.classList.add("gz-wipe"); });
  if(!("IntersectionObserver" in window)){ imgs.forEach(reveal); return; }
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ reveal(e.target); io.unobserve(e.target); } });
  },{ rootMargin:"0px 0px 15% 0px", threshold:.01 });
  imgs.forEach(function(i){ io.observe(i); });
  // red de seguridad TOTAL: ninguna imagen queda oculta permanentemente
  setTimeout(function(){ imgs.forEach(function(i){ if(!i.classList.contains("gz-shown")) reveal(i); }); }, 3000);
}

/* 6) Hojas flotando en la banda natural (formas CSS, no emoji -> mismas en todo navegador) */
function initNaturalLeaves(){
  var band = document.querySelector(".natural");
  if(!band) return;
  // destellos dorado/naranja que contrastan sobre el azul de la banda
  var BG = [
    "linear-gradient(135deg,#FFCE6A,#F5820A)",
    "linear-gradient(135deg,#F2F4F0,#FFCE6A)",
    "linear-gradient(135deg,#FF9E2C,#F5820A)"
  ];
  var N = 14, built = false;
  function build(){
    if(built) return; built = true;
    for(var i=0;i<N;i++){
      var s = document.createElement("span");
      s.className = "gz-leaf"; s.setAttribute("aria-hidden","true");
      var left = (i / N * 100 + (i*13 % 9)).toFixed(1);
      var dur  = (6 + (i*7 % 6)).toFixed(1);
      var delay= (-(i*11 % 9)).toFixed(1);
      var size = (11 + (i % 4) * 5);            // 11..26 px
      var dx = ((i % 2 ? 1 : -1) * (20 + (i*9 % 40))) + "px";
      var dr = ((i % 2 ? 1 : -1) * (180 + (i*23 % 160))) + "deg";
      s.style.cssText = "left:"+left+"%;width:"+size+"px;height:"+size+"px;background:"+BG[i % BG.length]+
        ";animation:gz-leafrise "+dur+"s linear "+delay+"s infinite;--dx:"+dx+";--dr:"+dr;
      band.appendChild(s);
    }
  }
  if("IntersectionObserver" in window){
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ build(); io.disconnect(); } }); },{ threshold:.05 });
    io.observe(band);
  } else { build(); }
}

/* 7) Giroscopio / tilt en la foto del hero */
function initHeroGyroTilt(){
  if(window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  var hero = document.querySelector(".hero");
  var fig  = document.querySelector(".hero__figure");
  var img  = document.querySelector(".hero__img");
  if(!hero || !fig || !img) return;
  var wrap = document.createElement("div");
  wrap.className = "gz-tilt";
  img.parentNode.insertBefore(wrap, img);
  wrap.appendChild(img);
  var MAXR = 7, MAXT = 10, raf = 0;
  var cur = { rx:0, ry:0, tx:0, ty:0 }, tgt = { rx:0, ry:0, tx:0, ty:0 };
  function apply(){
    wrap.style.setProperty("--gz-rx", cur.rx.toFixed(2) + "deg");
    wrap.style.setProperty("--gz-ry", cur.ry.toFixed(2) + "deg");
    wrap.style.setProperty("--gz-tx", cur.tx.toFixed(2) + "px");
    wrap.style.setProperty("--gz-ty", cur.ty.toFixed(2) + "px");
  }
  function tick(){
    cur.rx += (tgt.rx - cur.rx) * 0.16; cur.ry += (tgt.ry - cur.ry) * 0.16;
    cur.tx += (tgt.tx - cur.tx) * 0.16; cur.ty += (tgt.ty - cur.ty) * 0.16;
    apply();
    var moving = Math.abs(tgt.rx-cur.rx)+Math.abs(tgt.ry-cur.ry)+Math.abs(tgt.tx-cur.tx)+Math.abs(tgt.ty-cur.ty) > 0.05;
    raf = moving ? requestAnimationFrame(tick) : 0;
  }
  function drive(){ wrap.classList.add("gz-tilt--live"); if(!raf) raf = requestAnimationFrame(tick); }
  function rest(){ tgt.rx=tgt.ry=tgt.tx=tgt.ty=0; wrap.classList.remove("gz-tilt--live"); if(!raf) raf = requestAnimationFrame(tick); }
  var fine = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  if(fine){
    hero.addEventListener("pointermove", function(e){
      var r = hero.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width  * 2 - 1;
      var ny = (e.clientY - r.top)  / r.height * 2 - 1;
      tgt.ry = nx * MAXR; tgt.rx = -ny * MAXR; tgt.tx = nx * MAXT; tgt.ty = ny * (MAXT * 0.6);
      drive();
    }, { passive:true });
    hero.addEventListener("pointerleave", rest, { passive:true });
    return;
  }
  var base = null;
  function onOrient(e){
    if(e.gamma == null && e.beta == null) return;
    if(base === null) base = { g:e.gamma||0, b:e.beta||0 };
    var dg = (e.gamma||0) - base.g, db = (e.beta||0) - base.b;
    var ng = Math.max(-1, Math.min(1, dg/22)), nb = Math.max(-1, Math.min(1, db/22));
    tgt.ry = ng * MAXR; tgt.rx = -nb * MAXR; tgt.tx = ng * MAXT; tgt.ty = nb * (MAXT * 0.6);
    drive();
  }
  function startSway(){ wrap.classList.add("gz-tilt--sway"); }
  function startSensor(){ wrap.classList.remove("gz-tilt--sway"); window.addEventListener("deviceorientation", onOrient, { passive:true }); }
  var DOE = window.DeviceOrientationEvent;
  if(!DOE){ startSway(); return; }
  if(typeof DOE.requestPermission === "function"){
    startSway();   // iOS: solo sway suave, SIN pedir permiso ni botón
  } else {
    startSway();
    var got = false;
    var probe = function(){ got = true; wrap.classList.remove("gz-tilt--sway"); window.removeEventListener("deviceorientation", probe); };
    window.addEventListener("deviceorientation", probe, { passive:true });
    startSensor();
    setTimeout(function(){ if(!got){ wrap.classList.add("gz-tilt--sway"); window.removeEventListener("deviceorientation", onOrient); } }, 1200);
  }
}

/* 8) Confetti + pulse al tocar un plan */
function initPlanConfetti(){
  var btns = document.querySelectorAll(".plan__btn");
  if(!btns.length) return;
  var reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  var COLORS = ["#F5820A","#FF9E2C","#FFCE6A","#3D6BF0","#ffffff"];
  function pulse(btn){ btn.classList.remove("gz-pulse"); void btn.offsetWidth; btn.classList.add("gz-pulse"); }
  Array.prototype.forEach.call(btns, function(btn){
    btn.addEventListener("click", function(){
      pulse(btn);
      if(reduce) return;
      var r = btn.getBoundingClientRect();
      var cx = r.left + r.width/2, cy = r.top + r.height/2;
      var count = 20;
      for(var i=0;i<count;i++){
        var p = document.createElement("span"); p.className = "gz-confetti";
        var a = -Math.PI * Math.random();
        var dist = 70 + Math.random()*100;
        var dx = (Math.cos(a)*dist).toFixed(0) + "px";
        var dy = (Math.sin(a)*dist).toFixed(0) + "px";
        p.style.cssText = "left:"+cx+"px;top:"+cy+"px;background:"+COLORS[i%COLORS.length]+";--dx:"+dx+";--dy:"+dy+";--rot:"+((Math.random()*540).toFixed(0))+"deg";
        document.body.appendChild(p);
        (function(node){ setTimeout(function(){ node.remove(); }, 950); })(p);
      }
    });
  });
}

/* ---------- Filtro de productos por tipo (chips) ---------- */
function initFilters(){
  const cont = document.getElementById("product-filters");
  const grid = document.getElementById("product-grid");
  if(!cont || !grid) return;
  const cats = [];
  PRODUCTOS.forEach(p=>{ const k = slug(p.tag); if(!cats.some(c=>c.k===k)) cats.push({ k, label:p.tag }); });
  cont.innerHTML = ['<button class="gz-chip is-active" data-cat="all" type="button">Todos</button>']
    .concat(cats.map(c=>`<button class="gz-chip" data-cat="${c.k}" type="button">${esc(c.label)}</button>`)).join("");
  cont.addEventListener("click",(e)=>{
    const b = e.target.closest(".gz-chip"); if(!b) return;
    cont.querySelectorAll(".gz-chip").forEach(x=>x.classList.toggle("is-active", x===b));
    const cat = b.dataset.cat;
    grid.querySelectorAll(".card").forEach(card=>{ card.classList.toggle("is-hidden", !(cat==="all" || card.dataset.cat===cat)); });
  });
}

/* ---------- Quick-view de producto (tap en la foto) ---------- */
function openQuickView(p){
  const was = p.off ? Math.round(p.precio/(1 - p.off/100)) : 0;
  const cuota = Math.round(p.precio/3);
  const box = document.createElement("div");
  box.className = "gz-qv"; box.tabIndex = -1;
  box.innerHTML =
    '<div class="gz-qv__panel" role="dialog" aria-modal="true" aria-label="'+esc(p.nombre)+'">'+
      '<button class="gz-qv__x" aria-label="Cerrar">&times;</button>'+
      '<div class="gz-qv__media">'+(p.off?'<span class="card__off">'+p.off+'% OFF</span>':'')+'<img src="'+p.img+'?v=2" alt="'+esc(p.nombre)+'" /></div>'+
      '<div class="gz-qv__info">'+
        '<p class="gz-qv__pick">&#10022; Grosz Nutrition · '+esc(p.tag)+'</p>'+
        '<h3 class="gz-qv__name">'+esc(p.nombre)+'</h3>'+
        (was?'<p class="gz-qv__was">'+ARS(was)+'</p>':'')+
        '<p class="gz-qv__price">'+ARS(p.precio)+'<em>o 3 cuotas sin interés de '+ARS(cuota)+'</em></p>'+
        '<a class="gz-qv__btn" href="https://www.morashop.ar/" target="_blank" rel="noopener">Comprar en Morashop'+
          '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></a>'+
      '</div>'+
    '</div>';
  document.body.appendChild(box);
  requestAnimationFrame(()=>box.classList.add("is-open"));
  box.focus();
  const close = ()=>{ box.classList.remove("is-open"); setTimeout(()=>box.remove(),320); document.removeEventListener("keydown", onKey); };
  const onKey = (ev)=>{ if(ev.key==="Escape") close(); };
  box.addEventListener("click",(ev)=>{ if(ev.target===box || ev.target.closest(".gz-qv__x")) close(); });
  document.addEventListener("keydown", onKey);
}
function initQuickView(){
  const grid = document.getElementById("product-grid"); if(!grid) return;
  const fire = (art)=>{ const i = art ? parseInt(art.getAttribute("data-idx"),10) : -1; const p = PRODUCTOS[i]; if(p) openQuickView(p); };
  grid.addEventListener("click",(e)=>{ const m = e.target.closest(".card__media"); if(m) fire(m.closest(".card")); });
  grid.addEventListener("keydown",(e)=>{ if(e.key!=="Enter" && e.key!==" ") return; const m = e.target.closest(".card__media"); if(!m) return; e.preventDefault(); fire(m.closest(".card")); });
}

/* ---------- Sub-nav sticky (scrollspy) ---------- */
function initSubnav(){
  const nav = document.getElementById("gz-subnav"); if(!nav) return;
  const pill = nav.querySelector(".gz-subnav__pill");
  const links = Array.prototype.slice.call(nav.querySelectorAll("a"));
  const secs = links.map(a=>document.querySelector(a.getAttribute("href")));
  function move(a){
    const r = a.getBoundingClientRect(), pr = a.parentElement.getBoundingClientRect();
    pill.style.width = r.width + "px"; pill.style.transform = "translateX(" + (r.left - pr.left - 4) + "px)";
    links.forEach(l=>l.classList.toggle("active", l===a));
  }
  if("IntersectionObserver" in window){
    const io = new IntersectionObserver((es)=>es.forEach(e=>{ if(e.isIntersecting){ const i = secs.indexOf(e.target); if(i>=0) move(links[i]); } }),{ rootMargin:"-45% 0px -50% 0px" });
    secs.forEach(s=>{ if(s) io.observe(s); });
    const hero = document.querySelector(".hero");
    if(hero){ const io2 = new IntersectionObserver((es)=>{ nav.classList.toggle("show", !es[0].isIntersecting); },{ threshold:.06 }); io2.observe(hero); }
  } else { nav.classList.add("show"); }
  links.forEach(a=>a.addEventListener("click", ()=>setTimeout(()=>move(a),60)));
  requestAnimationFrame(()=>move(links[0]));
}

document.addEventListener("DOMContentLoaded", ()=>{
  renderProductos();
  renderVideos();
  fillRail();
  initRail2();
  initCounters();
  initSplitReveal();
  initReveal();
  initProofBarsCount();
  initScrollFX();
  initScrollParallaxImg();
  initImgWipe();
  initNaturalLeaves();
  initPlanConfetti();
  initTilt();
  initHeroSpot();
  initMagnetic();
  initRipple();
  initHeroGyroTilt();
  initFilters();
  initQuickView();
  initSubnav();
});
