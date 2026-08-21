/* ============================================================
   QUALIKA · Espejos Inteligentes × Morashop
   Productos reales del catálogo Morashop (store 002/268/228)
   HTML/CSS/JS puro — sin dependencias externas (listo Tiendanube)
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

/* line: Q1 (touch) | Q2 (touch + antivaho + hora) · shape para el filtro */
const ESPEJOS=[
  {img:"espejo-redondo-qualika-q2-4-e88f1f01d588af52d617734163285902-480-0.webp", n:"Espejo Circular Q2 · Touch + Desempañador + Hora", p:"190.674", line:"Q2", shape:"circular", h:"espejo-inteligente-circular-q2-qualika-touch-desempanador-hora-luz-calida-fria-amarilla-9fvkr"},
  {img:"espejo-ovalado-qualika-q2-2-4970442f99c889be0417734156232745-480-0.webp", n:"Espejo Ovalado Q2 · Touch + Desempañador + Hora", p:"243.877", line:"Q2", shape:"ovalado", h:"espejo-inteligente-ovalado-q2-qualika-touch-desempanador-hora-luz-calida-fria-amarilla-u8jxd"},
  {img:"espejo-cuadrado-qualika-q2-1-9345a2a551458cb10017734148741490-480-0.webp", n:"Espejo Cuadrado Q2 · Touch + Desempañador + Hora", p:"206.174", line:"Q2", shape:"cuadrado", h:"espejo-inteligente-cuadrado-q2-qualika-touch-desempanador-hora-luz-calida-fria-amarilla-1fs1u"},
  {img:"espejo-rectangular-horizontal-qualika-q2-1-2ea7fb9a01fab2dc9317734137940238-480-0.webp", n:"Espejo Rectangular Horizontal Q2", p:"279.352", line:"Q2", shape:"rectangular", h:"espejo-inteligente-rectangular-horizontal-q2-qualika-touch-desempanador-hora-luz-calida-fria-amarilla-18429"},
  {img:"espejo-rectangular-vertical-qualika-q2-b4fd82dbad09085d7a17734120826606-480-0.webp", n:"Espejo Rectangular Vertical Q2", p:"232.786", line:"Q2", shape:"rectangular", h:"espejo-inteligente-rectangular-vertical-q2-qualika-luz-calida-fria-amarilla-mw8f9"},
  {img:"espejo-redondo-qualika-q1-6-b889a57af18445451717734158814644-480-0.webp", n:"Espejo Circular Q1 · Touch", p:"144.108", line:"Q1", shape:"circular", h:"espejo-inteligente-circular-q1-qualika-touch-luz-calida-fria-amarilla-1e8xq"},
  {img:"espejo-ovalado-qualika-q1-3-8f08150c9eb54838f917734153673209-480-0.webp", n:"Espejo Ovalado Q1 · Touch", p:"179.585", line:"Q1", shape:"ovalado", h:"espejo-inteligente-ovalado-q1-qualika-touch-luz-calida-fria-amarilla-a76vv"},
  {img:"espejo-cuadrado-qualika-q1-5-40141627d99e0c747d17734152201314-480-0.webp", n:"Espejo Cuadrado Q1 · Touch", p:"146.758", line:"Q1", shape:"cuadrado", h:"espejo-inteligente-cuadrado-q1-qualika-touch-luz-calida-fria-amarilla-1czir"},
  {img:"espejo-rectangular-horizontal-qualika-q1-1-576b7e8471328778ba17734130272428-480-0.webp", n:"Espejo Rectangular Horizontal Q1", p:"217.264", line:"Q1", shape:"rectangular", h:"espejo-inteligente-rectangular-horizontal-q1-qualika-luz-calida-fria-amarilla-yed11"},
  {img:"espejo-rectangular-vertical-qualika-q1-e0ba47c1b9741589fe17734103808357-480-0.webp", n:"Espejo Rectangular Vertical Q1", p:"151.213", line:"Q1", shape:"rectangular", h:"espejo-inteligente-rectangular-vertical-q1-qualika-luz-calida-fria-amarilla-hmmj4"}
];

/* ============================================================
   HERO — video de fondo
   Dos cortes de los videos originales: el horizontal para pantallas
   anchas y el vertical para mobile, cada uno en su orientación nativa
   (así no hay recortes feos). Muteado y en loop, con poster mientras carga.
   ============================================================ */
const HERO_BG = {
  wide:   { mp4:"assets/hero-bg-desktop.mp4", poster:"assets/hero-bg-desktop.jpg" },
  tall:   { mp4:"assets/hero-bg-mobile.mp4",  poster:"assets/hero-bg-mobile.jpg"  },
  /* debajo de este ancho se usa el vertical */
  breakpoint: 940
};

function initHeroBg(){
  const box=document.getElementById("heroBg"); if(!box) return;
  const tall = innerWidth <= HERO_BG.breakpoint;
  const src  = tall ? HERO_BG.tall : HERO_BG.wide;

  /* el poster se pinta ya mismo: nada de agujero negro mientras baja el video */
  box.style.backgroundImage="url('"+src.poster+"')";

  const v=document.createElement("video");
  v.className="hero__video";
  v.autoplay=true; v.muted=true; v.loop=true; v.playsInline=true;
  v.setAttribute("muted",""); v.setAttribute("playsinline","");
  v.preload="auto"; v.poster=src.poster; v.src=src.mp4;
  v.addEventListener("playing",()=>box.classList.add("is-playing"),{once:true});
  box.appendChild(v);
  const pr=v.play(); if(pr && pr.catch) pr.catch(()=>{});  /* si el navegador lo bloquea queda el poster */

  /* pausar fuera de vista: no gastar bateria scrolleando el resto de la pagina */
  if("IntersectionObserver" in window){
    new IntersectionObserver(es=>{ es[0].isIntersecting ? v.play().catch(()=>{}) : v.pause(); },{threshold:.02}).observe(box);
  }
  document.addEventListener("visibilitychange",()=>{ document.hidden ? v.pause() : v.play().catch(()=>{}); });
}

const ARROW='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function card(p, i){
  const badge = p.line==="Q2"
    ? '<span class="card__badge">Q2 · con reloj</span>'
    : '<span class="card__badge card__badge--q1">Q1 · touch</span>';
  return `<article class="card reveal" data-shape="${p.shape}" data-line="${p.line}" style="--i:${i%4}">
    <div class="card__media">${badge}<img src="${CDN}${p.img}" alt="${esc(p.n)}" loading="lazy" width="480" height="480" /><span class="card__led" aria-hidden="true"></span><span class="card__sheen" aria-hidden="true"></span></div>
    <div class="card__body">
      <h3 class="card__name">${esc(p.n)}</h3>
      <p class="card__price">$${esc(p.p)}<span>precio final · 3 cuotas sin interés</span></p>
      <a class="card__btn" href="${LINK}${esc(p.h)}">Ver espejo ${ARROW}</a>
    </div>
  </article>`;
}

function render(){
  const g=document.getElementById("grid-espejos");
  if(g) g.innerHTML=ESPEJOS.map((p,i)=>card(p,i)).join("");
}

/* filtros línea + forma (AND) — cards caen en cascada */
function initFilters(){
  const box=document.getElementById("filters"); if(!box) return;
  const empty=document.getElementById("gridEmpty");
  const state={line:"all",shape:"all"};
  function apply(){
    let vis=0;
    document.querySelectorAll("#grid-espejos .card").forEach(c=>{
      const show=(state.line==="all"||c.dataset.line===state.line) && (state.shape==="all"||c.dataset.shape===state.shape);
      c.classList.toggle("is-hidden", !show);
      c.classList.remove("pop");
      if(show){ void c.offsetWidth; c.style.setProperty("--pd",(vis*55)+"ms"); c.classList.add("pop"); vis++;
        c.addEventListener("animationend",()=>c.classList.remove("pop"),{once:true}); }
    });
    if(empty) empty.hidden = vis>0;
  }
  box.addEventListener("click",e=>{
    const b=e.target.closest(".filter"); if(!b) return;
    const dim=b.dataset.dim;
    box.querySelectorAll('.filter[data-dim="'+dim+'"]').forEach(c=>c.classList.toggle("is-on",c===b));
    state[dim]=b.dataset.f;
    apply();
  });
}

/* nav en la página: scroll suave + la sección "cae desde arriba" al llegar */
function initAnchors(){
  const bar=document.querySelector(".topbar");
  function drop(sec){
    const el=sec.querySelector(".cat__head,.why__head,.feat__grid,.bridge__inner,.hero__copy")||sec;
    el.classList.remove("drop-in"); void el.offsetWidth;
    el.addEventListener("animationend",()=>el.classList.remove("drop-in"),{once:true});
    el.classList.add("drop-in");
  }
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener("click",e=>{
      const id=a.getAttribute("href"); if(!id || id.length<2) return;
      const t=document.querySelector(id); if(!t) return;
      e.preventDefault();
      const off=96;
      const y=Math.max(0, t.getBoundingClientRect().top+(window.pageYOffset||0)-off);
      if(window.__ss && window.__ss.active){ window.__ss.target=y; } else { window.scrollTo({top:y,behavior:"smooth"}); }
      setTimeout(()=>drop(t),240);
      try{ history.replaceState(null,"",id); }catch(_){}
    });
  });
}

/* ---------- ESPEJO interactivo del hero (Q1/Q2 + luz + antivaho) ---------- */
/* ---------- VIDEO demo (horizontal, largo) ----------
   preload="none" + src recien al click: 0 bytes hasta que el usuario lo pide. */
function initDemo(){
  const wrap=document.getElementById("demoFrame"); if(!wrap) return;
  const v=wrap.querySelector("video"), btn=document.getElementById("demoPlay");
  if(!v || !btn) return;
  btn.addEventListener("click",()=>{
    if(!v.src) v.src=v.dataset.src;
    v.controls=true;
    wrap.classList.add("is-playing");
    const pr=v.play();
    if(pr && pr.catch) pr.catch(()=>{ v.controls=true; });
  });
  v.addEventListener("ended",()=>wrap.classList.remove("is-playing"));
}

function initMirror(){
  const mirror=document.getElementById("mirror"); if(!mirror) return;
  const clock=document.getElementById("clock"), ripple=document.getElementById("ripple"),
        fogBtn=document.getElementById("fogBtn"), hint=document.getElementById("mirrorHint"),
        stage=mirror.parentElement,
        tempChips=[].slice.call(stage.querySelectorAll(".mc-chip[data-led]")),
        lineChips=[].slice.call(stage.querySelectorAll(".mc-line"));
  const pad=n=>String(n).padStart(2,"0");
  function tick(){ if(!clock) return; const d=new Date(); clock.textContent=pad(d.getHours())+":"+pad(d.getMinutes()); }
  tick(); setInterval(tick,15000);

  function touchAt(x,y){ if(!ripple) return; ripple.style.left=x+"px"; ripple.style.top=y+"px";
    mirror.classList.remove("is-touch"); void mirror.offsetWidth; mirror.classList.add("is-touch"); }
  function touchCenter(){ const r=mirror.getBoundingClientRect(); touchAt(r.width/2, r.height*0.55); }

  /* temperatura de luz */
  tempChips.forEach(c=>c.addEventListener("click",()=>{
    tempChips.forEach(x=>x.setAttribute("aria-pressed", x===c ? "true":"false"));
    mirror.style.setProperty("--led", c.dataset.led);
    touchCenter();
  }));

  /* línea Q1 / Q2 */
  lineChips.forEach(c=>c.addEventListener("click",()=>{
    lineChips.forEach(x=>x.classList.toggle("is-on", x===c));
    const line=c.dataset.line;
    mirror.setAttribute("data-line", line);
    if(hint) hint.textContent=c.dataset.label || ("Línea "+line);
    const isQ2 = line==="Q2";
    if(fogBtn){ fogBtn.disabled=!isQ2; }
    if(!isQ2){ mirror.classList.remove("is-foggy"); if(fogBtn) fogBtn.classList.remove("is-active"); }
    touchCenter();
  }));

  /* antivaho (solo Q2) */
  if(fogBtn) fogBtn.addEventListener("click",()=>{
    if(fogBtn.disabled) return;
    const on=mirror.classList.toggle("is-foggy");
    fogBtn.classList.toggle("is-active",on);
    if(on) setTimeout(()=>{ mirror.classList.remove("is-foggy"); fogBtn.classList.remove("is-active"); }, 2600);
  });

  /* tocar el vidrio = ripple */
  mirror.addEventListener("pointerdown",e=>{ const r=mirror.getBoundingClientRect(); touchAt(e.clientX-r.left, e.clientY-r.top); });
}

/* tilt 3D + sheen + temperatura del LED en las cards */
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
        c.style.setProperty("--temp", Math.round(38+rx*(200-38))); // cálido -> frío
      });
    });
    c.addEventListener("pointerleave",()=>{ if(raf) cancelAnimationFrame(raf); c.style.transform=""; c.style.removeProperty("--sx"); });
  });
}

/* sub-nav sticky: aparece tras el hero + pastilla scrollspy */
function initSubnav(){
  const nav=document.getElementById("subnav"); if(!nav) return;
  const pill=nav.querySelector(".subnav__pill"), links=[].slice.call(nav.querySelectorAll("a"));
  const secs=links.map(a=>document.querySelector(a.getAttribute("href")));
  function move(a){
    const r=a.getBoundingClientRect(), pr=a.parentElement.getBoundingClientRect();
    pill.style.width=r.width+"px"; pill.style.transform="translateX("+(r.left-pr.left-4)+"px)";
    links.forEach(l=>l.classList.toggle("active",l===a));
  }
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ const i=secs.indexOf(e.target); if(i>=0) move(links[i]); } }),{rootMargin:"-42% 0px -52% 0px"});
  secs.forEach(s=>{ if(s) io.observe(s); });
  links.forEach(a=>a.addEventListener("click",()=>setTimeout(()=>move(a),50)));
  requestAnimationFrame(()=>move(links[0]));
  /* visible entre el hero y el cierre: en el closer se montaba encima del CTA */
  const hero=document.querySelector(".hero"), fin=document.querySelector(".closer");
  let fueraDelHero=false, enElCierre=false;
  const sync=()=>nav.classList.toggle("show", fueraDelHero && !enElCierre);
  if(hero){ new IntersectionObserver(es=>{ fueraDelHero=!es[0].isIntersecting; sync(); },{threshold:.05}).observe(hero); }
  if(fin){  new IntersectionObserver(es=>{ enElCierre=es[0].isIntersecting; sync(); },{threshold:.06}).observe(fin); }
}

function initReveal(){
  const els=document.querySelectorAll(".reveal");
  if(!("IntersectionObserver" in window)){ els.forEach(e=>e.classList.add("is-in")); return; }

  // El retardo se calcula POR SECCION, no sobre el indice global. Antes se usaba
  // (i % 8) * 45ms: si una seccion tenia 3 elementos, el primero de la siguiente
  // arrancaba con 135ms de retardo heredado y la cascada entraba descoordinada.
  document.querySelectorAll("main > section, .mora-foot").forEach(sec=>{
    const hijos=sec.querySelectorAll(".reveal");
    hijos.forEach((el,i)=>el.style.setProperty("--d", Math.min(i,7)*55+"ms"));
  });
  // Los que quedaron fuera de una seccion arrancan sin retardo.
  els.forEach(el=>{ if(!el.style.getPropertyValue("--d")) el.style.setProperty("--d","0ms"); });

  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add("is-in"); io.unobserve(e.target); }
  }),{rootMargin:"0px 0px -12% 0px",threshold:.06});
  els.forEach(e=>io.observe(e));
}

function initCounters(){
  const els=document.querySelectorAll("[data-count]"); if(!els.length) return;
  const run=el=>{ const to=parseInt(el.dataset.count,10)||0, t0=performance.now(), dur=1300;
    const c1=1.70158, c3=c1+1;
    const tick=now=>{ const p=Math.min(1,(now-t0)/dur); const e=1+c3*Math.pow(p-1,3)+c1*Math.pow(p-1,2);
      el.textContent=Math.max(0,Math.round(to*e));
      if(p<1) requestAnimationFrame(tick); else { el.textContent=to; el.classList.add("flash"); setTimeout(()=>el.classList.remove("flash"),550); } };
    requestAnimationFrame(tick); };
  if(!("IntersectionObserver" in window)){ els.forEach(run); return; }
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ run(e.target); io.unobserve(e.target); } }),{threshold:.5});
  els.forEach(e=>io.observe(e));
}

function initScrollFX(){
  const prog=document.getElementById("scrollProg"), bar=document.querySelector(".mora-header");
  let t=false;
  const f=()=>{ const y=pageYOffset||0, h=document.documentElement.scrollHeight-innerHeight;
    if(prog) prog.style.width=(h>0?(y/h*100):0)+"%";
    if(bar) bar.classList.toggle("scrolled", y>8);
    t=false; };
  addEventListener("scroll",()=>{ if(!t){ t=true; requestAnimationFrame(f); } },{passive:true}); f();
}

/* parallax al deslizar — usa la prop translate (no pisa transform/tilt/reveal) */
function initParallax(){
  const els=[].slice.call(document.querySelectorAll("[data-parallax]"));
  if(!els.length) return;
  let t=false;
  const f=()=>{
    const vh=innerHeight||1;
    els.forEach(el=>{
      const r=el.getBoundingClientRect();
      const d=((r.top+r.height/2)-vh/2)/vh;      // -0.5..0.5 aprox
      const amp=parseFloat(el.dataset.parallax)||0;
      el.style.setProperty("--py",(d*amp).toFixed(1)+"px");
    });
    t=false;
  };
  addEventListener("scroll",()=>{ if(!t){ t=true; requestAnimationFrame(f); } },{passive:true});
  addEventListener("resize",()=>{ if(!t){ t=true; requestAnimationFrame(f); } },{passive:true});
  f();
}

/* scroll suave con inercia (desktop) — "que se arrastre bien" */
function initSmooth(){
  if(!matchMedia("(hover:hover) and (pointer:fine)").matches) return;
  const ss={target:pageYOffset||0, current:pageYOffset||0, active:true, writing:false};
  window.__ss=ss;
  const maxY=()=>Math.max(0,(document.documentElement.scrollHeight||0)-innerHeight);
  addEventListener("wheel",e=>{ if(e.ctrlKey) return; e.preventDefault();
    ss.target=Math.min(maxY(),Math.max(0, ss.target + e.deltaY*(e.deltaMode===1?16:1))); },{passive:false});
  addEventListener("scroll",()=>{ if(ss.writing){ ss.writing=false; return; } ss.current=ss.target=pageYOffset||0; },{passive:true});
  addEventListener("resize",()=>{ ss.target=Math.min(maxY(),ss.target); });
  (function loop(){ const d=ss.target-ss.current;
    if(Math.abs(d)>0.4){ ss.current+=d*0.14; ss.writing=true; window.scrollTo(0,ss.current); }
    requestAnimationFrame(loop); })();
}

/* ripple al tocar cualquier botón */
function initRipple(){
  const SEL=".btn,.mc-chip,.mc-line,.filter,.card__btn,.subnav a,.topbar__back";
  document.addEventListener("pointerdown",e=>{
    const el=e.target.closest(SEL); if(!el || el.disabled) return;
    const r=el.getBoundingClientRect(), d=Math.max(r.width,r.height)*1.9;
    const s=document.createElement("span"); s.className="rippl";
    s.style.width=s.style.height=d+"px";
    s.style.left=(e.clientX-r.left)+"px"; s.style.top=(e.clientY-r.top)+"px";
    el.appendChild(s); s.addEventListener("animationend",()=>s.remove(),{once:true});
  },{passive:true});
}

/* menú hamburguesa mobile (drawer) */
function initBurger(){
  const b=document.getElementById("burger"), d=document.getElementById("mhDrawer"),
        bd=document.getElementById("mhBackdrop"), c=document.getElementById("drawerClose");
  if(!b || !d || !bd) return;
  function open(){ d.classList.add("open"); bd.hidden=false; requestAnimationFrame(()=>bd.classList.add("show"));
    b.setAttribute("aria-expanded","true"); d.setAttribute("aria-hidden","false"); document.body.style.overflow="hidden"; }
  function close(){ d.classList.remove("open"); bd.classList.remove("show");
    b.setAttribute("aria-expanded","false"); d.setAttribute("aria-hidden","true"); document.body.style.overflow="";
    setTimeout(()=>{ bd.hidden=true; },260); }
  b.addEventListener("click",()=>{ d.classList.contains("open") ? close() : open(); });
  if(c) c.addEventListener("click",close);
  bd.addEventListener("click",close);
  d.querySelectorAll("a").forEach(a=>a.addEventListener("click",close));
  addEventListener("keydown",e=>{ if(e.key==="Escape") close(); });
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

/* glow ambiental que sigue el cursor (desktop) */
function initCursor(){
  if(!matchMedia("(hover:hover) and (pointer:fine)").matches) return;
  const g=document.getElementById("cursorGlow"); if(!g) return;
  let raf=null;
  addEventListener("pointermove",e=>{ if(raf) cancelAnimationFrame(raf); raf=requestAnimationFrame(()=>{ g.style.transform="translate("+e.clientX+"px,"+e.clientY+"px)"; g.classList.add("on"); }); },{passive:true});
  addEventListener("pointerleave",()=>g.classList.remove("on"));
}

document.addEventListener("DOMContentLoaded", ()=>{
  /* cada init aislado: si uno falla, el resto de la pagina igual arranca
     (un error suelto dejaba todos los .reveal en opacity:0 = pantalla negra) */
  [render, initFilters, initAnchors, initHeroBg, initDemo, initMirror, initSmooth,
   initReveal, initCounters, initScrollFX, initParallax, initTilt, initSubnav,
   initMagnetic, initCursor, initRipple, initBurger].forEach(fn=>{
    try{ fn(); }catch(e){ console.error("[qualika] fallo "+(fn.name||"init")+":", e); }
  });
  /* red de seguridad: si initReveal no llego a correr, nada seria visible */
  setTimeout(()=>{
    const ocultos=document.querySelectorAll(".reveal:not(.is-in)");
    if(ocultos.length && !document.querySelector(".reveal.is-in")){
      ocultos.forEach(el=>el.classList.add("is-in"));
      console.warn("[qualika] reveal de emergencia:", ocultos.length);
    }
  }, 1200);
});
