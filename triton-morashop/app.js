/* ============================================================
   BAÑO INTELIGENTE · Triton & Qualika × Morashop
   Productos reales del catálogo Morashop (store 002/268/228)
   ============================================================ */
(function(){ /* reduced-motion OFF forzado (el SO del dueño lo tiene ON) */
  if(!window.matchMedia) return;
  var _mm=window.matchMedia.bind(window);
  window.matchMedia=function(q){ if(typeof q==="string" && q.indexOf("prefers-reduced-motion")!==-1)
    return {matches:false,media:q,onchange:null,addEventListener:function(){},removeEventListener:function(){},addListener:function(){},removeListener:function(){},dispatchEvent:function(){return false;}};
    return _mm(q); };
})();

const CDN="https://acdn-us.mitiendanube.com/stores/002/268/228/products/";
const LINK="https://www.morashop.ar/productos/";
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

const INODOROS=[
  {img:"1-a3bdb502d45e0628e617517703020923-480-0.webp", n:"Inodoro Bidet Inteligente Triton Q9 Smart", p:"2.025.000", h:"inodoro-bano-bidet-inteligente-triton-q9-smart-temperatura"},
  {img:"2-2ddff39e9b4b98533e17517703558137-480-0.webp", n:"Inodoro Bidet Inteligente Triton Aerial Smart", p:"2.227.500", h:"inodoro-bano-bidet-inteligente-triton-aerial-smart"},
  {img:"9-f75c80f1bc95cddd2317517705422077-480-0.webp", n:"Inodoro Bidet Inteligente Triton Royal Smart", p:"2.126.250", h:"inodoro-bano-bidet-inteligente-triton-royal-smart"},
  {img:"5-b4696761f04dc24b5d17517704334703-480-0.webp", n:"Inodoro Bidet Inteligente Triton Total White", p:"2.126.250", h:"inodoro-bano-bidet-inteligente-triton-total-white-smart"},
  {img:"7-c49ef9f09435717aab17517704871637-480-0.webp", n:"Inodoro Bidet Inteligente Triton Total Black", p:"2.227.500", h:"inodoro-bano-bidet-inteligente-triton-total-black-smart"},
  {img:"inodoro-inteligente-classic-triton-v6-1-4b926fd7f246c16d8317603830418518-480-0.webp", n:"Inodoro Inteligente Triton Classic V6 Blanco", p:"1.620.000", h:"inodoro-inteligente-triton-classic-v6-blanco"}
];

const ESPEJOS=[
  {img:"espejo-redondo-qualika-q2-4-e88f1f01d588af52d617734163285902-480-0.webp", n:"Espejo Circular Q2 · Touch + Antivaho + Hora", p:"190.674", h:"espejo-inteligente-circular-q2-qualika-touch-desempanador-hora-luz-calida-fria-amarilla-9fvkr"},
  {img:"espejo-ovalado-qualika-q2-2-4970442f99c889be0417734156232745-480-0.webp", n:"Espejo Ovalado Q2 · Touch + Antivaho + Hora", p:"243.877", h:"espejo-inteligente-ovalado-q2-qualika-touch-desempanador-hora-luz-calida-fria-amarilla-u8jxd"},
  {img:"espejo-cuadrado-qualika-q2-1-9345a2a551458cb10017734148741490-480-0.webp", n:"Espejo Cuadrado Q2 · Touch + Antivaho + Hora", p:"206.174", h:"espejo-inteligente-cuadrado-q2-qualika-touch-desempanador-hora-luz-calida-fria-amarilla-1fs1u"},
  {img:"espejo-rectangular-horizontal-qualika-q2-1-2ea7fb9a01fab2dc9317734137940238-480-0.webp", n:"Espejo Rectangular Horizontal Q2", p:"279.352", h:"espejo-inteligente-rectangular-horizontal-q2-qualika-touch-desempanador-hora-luz-calida-fria-amarilla-18429"},
  {img:"espejo-rectangular-vertical-qualika-q2-b4fd82dbad09085d7a17734120826606-480-0.webp", n:"Espejo Rectangular Vertical Q2", p:"232.786", h:"espejo-inteligente-rectangular-vertical-q2-qualika-luz-calida-fria-amarilla-mw8f9"},
  {img:"espejo-redondo-qualika-q1-6-b889a57af18445451717734158814644-480-0.webp", n:"Espejo Circular Q1 · Touch", p:"144.108", h:"espejo-inteligente-circular-q1-qualika-touch-luz-calida-fria-amarilla-1e8xq"},
  {img:"espejo-ovalado-qualika-q1-3-8f08150c9eb54838f917734153673209-480-0.webp", n:"Espejo Ovalado Q1 · Touch", p:"179.585", h:"espejo-inteligente-ovalado-q1-qualika-touch-luz-calida-fria-amarilla-a76vv"},
  {img:"espejo-cuadrado-qualika-q1-5-40141627d99e0c747d17734152201314-480-0.webp", n:"Espejo Cuadrado Q1 · Touch", p:"146.758", h:"espejo-inteligente-cuadrado-q1-qualika-touch-luz-calida-fria-amarilla-1czir"},
  {img:"espejo-rectangular-horizontal-qualika-q1-1-576b7e8471328778ba17734130272428-480-0.webp", n:"Espejo Rectangular Horizontal Q1", p:"217.264", h:"espejo-inteligente-rectangular-horizontal-q1-qualika-luz-calida-fria-amarilla-yed11"},
  {img:"espejo-rectangular-vertical-qualika-q1-e0ba47c1b9741589fe17734103808357-480-0.webp", n:"Espejo Rectangular Vertical Q1", p:"151.213", h:"espejo-inteligente-rectangular-vertical-q1-qualika-luz-calida-fria-amarilla-hmmj4"}
];

const MAS=[
  {img:"sin-titulo-1-80bbf080e410a87f4b17394728256794-480-0.webp", n:"Grifería Inteligente Cuello Flexible Aqua Sense", p:"324.000", h:"griferia-inteligente-cuello-flexible-aqua-sense-triton", t:"Grifería"},
  {img:"11-b4e6a95b82d10ff8bb17517706157756-480-0.webp", n:"Ducha Inteligente Hydro Smart Triton", p:"455.625", h:"ducha-inteligente-hydro-smart-triton", t:"Ducha"},
  {img:"12-388f339969985a50fb17517706414527-480-0.webp", n:"Toallero Eléctrico Smart Heat Bar Triton", p:"607.500", h:"toallero-electrico-smart-heat-bar-triton", t:"Toallero"},
  {img:"8-6221be38bfce3f8d6217517705173979-480-0.webp", n:"Secador de Manos Inteligente Aerolux Ultra Rápido", p:"1.012.500", h:"secador-de-manos-inteligente-aerolux-ultra-rapido-triton", t:"Secamanos"},
  {img:"3-a682bc714fd1a280f617517703843685-480-0.webp", n:"Mingitorio Inteligente Modelo Slim Triton", p:"506.250", h:"mingitorio-inteligente-modelo-slim-triton", t:"Mingitorio"},
  {img:"4-b6f0748724d1d37e6c17517704078835-480-0.webp", n:"Mingitorio Inteligente Modelo Curve Triton", p:"506.250", h:"mingitorio-inteligente-modelo-curve-triton", t:"Mingitorio"},
  {img:"10-70eef91d7c16b5606917517705642184-480-0.webp", n:"Essensia Bacha Inteligente Acero Inox. Negro", p:"574.200", h:"essensia-bacha-inteligente-de-acero-inoxidable-triton-negro", t:"Bacha smart"},
  {img:"6-84f075e2754fabc6c217517704573256-480-0.webp", n:"Bacha Lavatorio Triton Totem", p:"594.000", h:"bacha-lavatorio-triton-totem", t:"Bacha"},
  {img:"sin-titulo-1-842d9d4900dd7a6cac17394725412230-480-0.webp", n:"Grifería Monocomando Pico Alto Altus", p:"115.425", h:"griferia-monocomando-pico-alto-altus-triton", t:"Grifería"},
  {img:"1312-4afe699ae29c8f8e0e17392916111947-480-0.webp", n:"Bacha Lavatorio Triton Roda Gold", p:"108.900", h:"bacha-lavatorio-triton-roda-gold", t:"Bacha"},
  {img:"1313-066619f212ae9dee6117392916796829-480-0.webp", n:"Bacha Lavatorio Triton Roda Black", p:"102.960", h:"bacha-lavatorio-triton-roda-black", t:"Bacha"},
  {img:"1308-bb60eb3124c337978f17392908565803-480-0.webp", n:"Bacha Lavatorio Triton Stadium", p:"108.900", h:"bacha-lavatorio-triton-stadium", t:"Bacha"},
  {img:"1305-880b22400b16653d2817392909779095-480-0.webp", n:"Bacha Lavatorio Triton Luna", p:"95.040", h:"bacha-lavatorio-triton-luna", t:"Bacha"},
  {img:"1311-72d4fd3e57f33bcae417392914452963-480-0.webp", n:"Bacha Lavatorio Triton Mare", p:"83.160", h:"bacha-lavatorio-triton-mare", t:"Bacha"},
  {img:"1310-b890c6be6e2843113b17392912279303-480-0.webp", n:"Bacha Lavatorio Triton Aqua", p:"83.160", h:"bacha-lavatorio-triton-aqua", t:"Bacha"},
  {img:"1307-4b8494702b3bb0370d17392907172548-480-0.webp", n:"Bacha Lavatorio Triton Zepellin", p:"83.160", h:"bacha-lavatorio-triton-zepellin", t:"Bacha"},
  {img:"1306-7af6c1ecc25f3fb29d17392906176804-480-0.webp", n:"Bacha Lavatorio Triton Triangle", p:"73.260", h:"bacha-lavatorios-triton-triangle", t:"Bacha"},
  {img:"1309-02a3339efca7f9b5dc17392910925465-480-0.webp", n:"Bacha Lavatorio Triton Terra", p:"67.320", h:"bacha-lavatorio-triton-terra", t:"Bacha"},
  {img:"1304-556bae4aea4498baea17392910364650-480-0.webp", n:"Bacha Lavatorio Triton Roda Blanco", p:"69.300", h:"bacha-lavatorio-triton-roda-bano-blanco", t:"Bacha"}
];

const ARROW='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function card(p, brand, i){
  const badge = brand==="qualika"
    ? '<span class="card__badge card__badge--qualika">Qualika</span>'
    : '<span class="card__badge card__badge--triton">'+(p.t?esc(p.t):"Triton")+'</span>';
  const led = brand==="qualika" ? '<span class="card__led" aria-hidden="true"></span>' : '';
  return `<article class="card reveal" style="--i:${i%6}">
    <div class="card__media">${badge}<img src="${CDN}${p.img}" alt="${esc(p.n)}" loading="lazy" width="480" height="480" />${led}<span class="card__sheen" aria-hidden="true"></span></div>
    <div class="card__body">
      <h3 class="card__name">${esc(p.n)}</h3>
      <p class="card__price">$${esc(p.p)}<span>precio final · cuotas en Morashop</span></p>
      <a class="card__btn" href="${LINK}${esc(p.h)}" target="_blank" rel="noopener">Ver en Morashop ${ARROW}</a>
    </div>
  </article>`;
}

function render(){
  const gi=document.getElementById("grid-inodoros"), ge=document.getElementById("grid-espejos"), gm=document.getElementById("grid-mas");
  if(gi) gi.innerHTML=INODOROS.map((p,i)=>card(p,"triton",i)).join("");
  if(ge) ge.innerHTML=ESPEJOS.map((p,i)=>card(p,"qualika",i)).join("");
  if(gm) gm.innerHTML=MAS.map((p,i)=>card(p,"triton",i)).join("");
}

/* #13 tilt 3D + sheen que sigue el cursor + temperatura del LED (espejos) */
function initTilt(){
  if(!matchMedia("(hover:hover) and (pointer:fine)").matches) return;
  document.querySelectorAll(".card").forEach(c=>{
    let raf=null;
    c.addEventListener("pointermove",e=>{
      const r=c.getBoundingClientRect(), rx=(e.clientX-r.left)/r.width, ry=(e.clientY-r.top)/r.height;
      if(raf) cancelAnimationFrame(raf);
      raf=requestAnimationFrame(()=>{
        c.style.transform="perspective(900px) rotateX("+(-(ry-.5)*4).toFixed(2)+"deg) rotateY("+((rx-.5)*5).toFixed(2)+"deg) translateY(-6px)";
        c.style.setProperty("--sx",((rx-.5)*60).toFixed(0)+"%");
        if(c.querySelector(".card__led")) c.style.setProperty("--temp", Math.round(38+rx*(195-38))); // cálido->frío
      });
    });
    c.addEventListener("pointerleave",()=>{ if(raf) cancelAnimationFrame(raf); c.style.transform=""; c.style.removeProperty("--sx"); });
  });
}

/* #19/#20 temperatura de color por sección (tiñe la aurora) */
function initTemp(){
  const map=[["#catalogo","cool"],["#espejos","warm"],["#mas","cool"],["#porque","warm"],[".bridge","violet"],[".closer","violet"]];
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ document.body.setAttribute("data-temp", e.target.getAttribute("data-temp")); } }),{rootMargin:"-45% 0px -45% 0px"});
  map.forEach(([sel,t])=>{ const el=document.querySelector(sel); if(el){ el.setAttribute("data-temp",t); io.observe(el); } });
  const hero=document.querySelector(".hero");
  if(hero){ const io2=new IntersectionObserver(es=>{ if(es[0].isIntersecting) document.body.removeAttribute("data-temp"); },{threshold:.4}); io2.observe(hero); }
}

/* #25 sub-nav sticky: aparece tras el hero + pastilla scrollspy brand-aware */
function initSubnav(){
  const nav=document.getElementById("subnav"); if(!nav) return;
  const pill=nav.querySelector(".subnav__pill"), links=[].slice.call(nav.querySelectorAll("a"));
  const secs=links.map(a=>document.querySelector(a.getAttribute("href")));
  function move(a){
    const r=a.getBoundingClientRect(), pr=a.parentElement.getBoundingClientRect();
    pill.style.width=r.width+"px"; pill.style.transform="translateX("+(r.left-pr.left-4)+"px)";
    const cyan=a.dataset.brand==="cyan";
    pill.style.background=cyan?"var(--cyan)":"var(--gold)";
    pill.style.boxShadow="0 0 16px "+(cyan?"rgba(90,200,218,.5)":"rgba(232,184,115,.5)");
    links.forEach(l=>l.classList.toggle("active",l===a));
  }
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ const i=secs.indexOf(e.target); if(i>=0) move(links[i]); } }),{rootMargin:"-42% 0px -52% 0px"});
  secs.forEach(s=>{ if(s) io.observe(s); });
  links.forEach(a=>a.addEventListener("click",()=>setTimeout(()=>move(a),50)));
  requestAnimationFrame(()=>move(links[0]));
  const hero=document.querySelector(".hero");
  if(hero){ const io2=new IntersectionObserver(es=>{ nav.classList.toggle("show", !es[0].isIntersecting); },{threshold:.05}); io2.observe(hero); }
}

function initReveal(){
  const els=document.querySelectorAll(".reveal");
  if(!("IntersectionObserver" in window)){ els.forEach(e=>e.classList.add("is-in")); return; }
  const io=new IntersectionObserver(es=>es.forEach((e,i)=>{ if(e.isIntersecting){ e.target.classList.add("is-in"); io.unobserve(e.target); } }),{rootMargin:"0px 0px -8% 0px",threshold:.04});
  els.forEach((e,i)=>{ e.style.setProperty("--d",(i%8)*45+"ms"); io.observe(e); });
}

function initCounters(){
  const els=document.querySelectorAll("[data-count]"); if(!els.length) return;
  const run=el=>{ const to=parseInt(el.dataset.count,10)||0, t0=performance.now(), dur=1300;
    const c1=1.70158, c3=c1+1;
    const tick=now=>{ const p=Math.min(1,(now-t0)/dur); const e=1+c3*Math.pow(p-1,3)+c1*Math.pow(p-1,2); // easeOutBack (overshoot)
      el.textContent=Math.max(0,Math.round(to*e));
      if(p<1) requestAnimationFrame(tick); else { el.textContent=to; el.classList.add("flash"); setTimeout(()=>el.classList.remove("flash"),550); } };
    requestAnimationFrame(tick); };
  if(!("IntersectionObserver" in window)){ els.forEach(run); return; }
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ run(e.target); io.unobserve(e.target); } }),{threshold:.5});
  els.forEach(e=>io.observe(e));
}

function initScrollFX(){
  const prog=document.getElementById("scrollProg"), bar=document.querySelector(".topbar"), img=document.querySelector("[data-parallax]");
  let t=false;
  const f=()=>{ const y=pageYOffset||0, h=document.documentElement.scrollHeight-innerHeight;
    if(prog) prog.style.width=(h>0?(y/h*100):0)+"%";
    if(bar) bar.classList.toggle("scrolled", y>8);
    if(img && y<innerHeight) img.style.transform="translateY("+(y*0.16).toFixed(1)+"px)";
    t=false; };
  addEventListener("scroll",()=>{ if(!t){ t=true; requestAnimationFrame(f); } },{passive:true}); f();
}

/* Ola 2 — scroll suave (Lenis) */
function initSmooth(){
  if(!window.Lenis) return;
  var lenis=new Lenis({ lerp:.1, smoothWheel:true, wheelMultiplier:1 });
  function raf(t){ lenis.raf(t); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{
    var t=document.querySelector(a.getAttribute("href")); if(t){ e.preventDefault(); lenis.scrollTo(t,{offset:-72}); }
  }));
}

/* botones magnéticos (desktop) */
function initMagnetic(){
  if(!matchMedia("(hover:hover) and (pointer:fine)").matches) return;
  document.querySelectorAll(".btn").forEach(b=>{
    var raf=null;
    b.addEventListener("pointermove",e=>{ var r=b.getBoundingClientRect(), mx=(e.clientX-r.left-r.width/2)/r.width, my=(e.clientY-r.top-r.height/2)/r.height;
      if(raf) cancelAnimationFrame(raf); raf=requestAnimationFrame(()=>{ b.style.transform="translate("+(mx*8).toFixed(1)+"px,"+(my*8).toFixed(1)+"px)"; }); });
    b.addEventListener("pointerleave",()=>{ if(raf) cancelAnimationFrame(raf); b.style.transform=""; });
  });
}

/* HERO spotlight que sigue el cursor (desktop) */
function initHeroFX(){
  const hero=document.querySelector(".hero"); if(!hero) return;
  if(!matchMedia("(hover:hover) and (pointer:fine)").matches) return;
  hero.addEventListener("pointermove",e=>{ const r=hero.getBoundingClientRect();
    hero.style.setProperty("--mx",(((e.clientX-r.left)/r.width)*100).toFixed(1)+"%");
    hero.style.setProperty("--my",(((e.clientY-r.top)/r.height)*100).toFixed(1)+"%"); });
}

/* glow ambiental que sigue el cursor (desktop) */
function initCursor(){
  if(!matchMedia("(hover:hover) and (pointer:fine)").matches) return;
  const g=document.getElementById("cursorGlow"); if(!g) return;
  let raf=null;
  addEventListener("pointermove",e=>{ if(raf) cancelAnimationFrame(raf); raf=requestAnimationFrame(()=>{ g.style.transform="translate("+e.clientX+"px,"+e.clientY+"px)"; g.classList.add("on"); }); },{passive:true});
  addEventListener("pointerleave",()=>g.classList.remove("on"));
}

document.addEventListener("DOMContentLoaded", ()=>{
  render(); initReveal(); initCounters(); initScrollFX();
  initTilt(); initTemp(); initSubnav();
  initSmooth(); initMagnetic(); initHeroFX(); initCursor();
});
