/* ============================================================
   FRANCO "EL TANQUE" CURIA × MORASHOP — app.js (maqueta)
   Colab SOLO con Morashop. Animaciones SIEMPRE activas.
   ============================================================ */

/* reduced-motion OFF forzado (el SO del dueño lo tiene ON) */
(function(){
  if(!window.matchMedia) return;
  var _mm = window.matchMedia.bind(window);
  window.matchMedia = function(q){
    if(typeof q === "string" && q.indexOf("prefers-reduced-motion") !== -1)
      return { matches:false, media:q, onchange:null, addEventListener:function(){}, removeEventListener:function(){}, addListener:function(){}, removeListener:function(){}, dispatchEvent:function(){return false;} };
    return _mm(q);
  };
})();

const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));

/* ---------- Videos YouTube @tanquecuria (verificados embebibles) ---------- */
const VIDEOS = [
  { id:"sDBai20GODs", titulo:"SHOW DAY · Franco el Tanque" },
  { id:"o9K28yCvMMI", titulo:"Estoy cambiando muy rápido" },
  { id:"VgDZhyu7cOs", titulo:"Entrenar, comer y vivir en una mansión fitness" },
  { id:"uoJ7h_ACKnw", titulo:"¿Un músculo por día funciona? Bro Split" }
];
function renderVideos(){
  const grid = document.getElementById("video-grid"); if(!grid) return;
  const play = `<svg viewBox="0 0 68 48" aria-hidden="true"><path fill="#FF0000" d="M66.5 7.7c-.8-3-2.5-5.3-5.5-6.1C55.5.2 34 .2 34 .2S12.5.2 7 1.6C4 2.4 2.3 4.7 1.5 7.7.1 13.2.1 24 .1 24s0 10.8 1.4 16.3c.8 3 2.5 5.3 5.5 6.1C12.5 47.8 34 47.8 34 47.8s21.5 0 27-1.4c3-.8 4.7-3.1 5.5-6.1C67.9 34.8 67.9 24 67.9 24s0-10.8-1.4-16.3z"/><path fill="#fff" d="M27 34.5 45 24 27 13.5z"/></svg>`;
  grid.innerHTML = VIDEOS.map((v,i)=>`
    <a class="video-card reveal" style="--d:${i*70}ms" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener noreferrer">
      <div class="video-card__thumb"><img src="https://img.youtube.com/vi/${v.id}/hqdefault.jpg" alt="${esc(v.titulo)}" loading="lazy" width="480" height="360" /><span class="video-card__play">${play}</span></div>
      <p class="video-card__title">${esc(v.titulo)}</p>
    </a>`).join("");
}

/* ---------- Lo que toma el Tanque: productos REALES del catálogo Morashop ---------- */
const MCDN = "https://acdn-us.mitiendanube.com/stores/002/268/228/products/";
const PRODUCTOS_TANQUE = [
  { img:MCDN+"proteina-on-gold-standard-100-whey-x-1-5-lb-1-90d8d1142a50017cb117587353094068-320-0.webp", tag:"Proteína",        nombre:"Whey ON Gold Standard 100% · 1.5 Lb" },
  { img:MCDN+"5-1f234b354bbd2ec40517274466084347-320-0.webp",                                              tag:"Creatina",        nombre:"Creatina Monohidrato Star Nutrition 300g" },
  { img:MCDN+"suplemento-en-comprimidos-universal-nutrition-animal-pak-vitaminas-en-lata-44-un-bedd9e00e35e0286f316988521062134-320-0.webp", tag:"Multivitamínico", nombre:"Animal Pak · Multivitamínico 44u" },
  { img:MCDN+"omega-3-max-1000-epa-500-dha-innovanaturals-60caps-ifos-goed-454c3b5ca9a3b85c6d17659080390301-320-0.webp",           tag:"Omega 3",         nombre:"Omega 3 Max · 1000 EPA + 500 DHA" },
  { img:MCDN+"24-efb596703fffd6efd117274504066672-320-0.webp",                                             tag:"Recuperación",    nombre:"Citrato de Magnesio ENA · 60 caps" },
  { img:MCDN+"protein-isolate-loaded-whey-sabor-chocolate-flavor-2-lb-animal-e785deaba07b9b389217683923889148-320-0.webp",         tag:"Proteína",        nombre:"Animal Whey Isolate · 2 Lb" }
];
function renderTanque(){
  const grid = document.getElementById("tanque-grid"); if(!grid) return;
  grid.innerHTML = PRODUCTOS_TANQUE.map((p,i)=>`
    <article class="card reveal" style="--d:${Math.min(i,7)*55}ms">
      <div class="card__media"><span class="card__off">${esc(p.tag)}</span><img src="${p.img}" alt="${esc(p.nombre)}" loading="lazy" /></div>
      <div class="card__body">
        <p class="card__pick">⛽ Lo que toma el Tanque</p>
        <h3 class="card__name">${esc(p.nombre)}</h3>
        <a class="card__btn" href="https://www.morashop.ar/" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6.5h14.6l-1.5 8.3a2 2 0 0 1-2 1.6H9.8a2 2 0 0 1-2-1.6L6 4.4H3.2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="20" r="1.5" fill="currentColor"/><circle cx="18" cy="20" r="1.5" fill="currentColor"/></svg>
          Comprar</a>
      </div>
    </article>`).join("");
}

function fillHazard(){
  const t = document.getElementById("hazardTrack"); if(!t) return;
  const words = ["MODO TANQUE","SIN ATAJOS","FUERZA REAL","COMBUSTIBLE"];
  const bar = '<span class="bar"></span>';
  const unit = words.map(w=>`<span>${w}</span>`).join(bar);
  let out=""; for(let i=0;i<4;i++){ out += unit + bar; }
  t.innerHTML = out;
}

function initCounters(){
  const els = document.querySelectorAll("[data-count]"); if(!els.length) return;
  const run = el=>{
    const to = parseInt(el.dataset.count,10)||0;
    if(!("requestAnimationFrame" in window)){ el.textContent=to; return; }
    const dur=1300,t0=performance.now();
    const tick=now=>{ const p=Math.min(1,(now-t0)/dur); el.textContent=Math.round(to*(1-Math.pow(1-p,3))); if(p<1) requestAnimationFrame(tick); else el.textContent=to; };
    requestAnimationFrame(tick);
  };
  if(!("IntersectionObserver" in window)){ els.forEach(run); return; }
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ run(e.target); io.unobserve(e.target); } }),{threshold:.5});
  els.forEach(e=>io.observe(e));
}

function initReveal(){
  const els=document.querySelectorAll(".reveal");
  if(!("IntersectionObserver" in window)){ els.forEach(e=>e.classList.add("is-in")); return; }
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("is-in"); io.unobserve(e.target); } }),{rootMargin:"0px 0px -8% 0px", threshold:.05});
  els.forEach(e=>io.observe(e));
  setTimeout(()=>{ document.querySelectorAll(".reveal:not(.is-in)").forEach(e=>{ if(e.getBoundingClientRect().top < innerHeight*0.95) e.classList.add("is-in"); }); }, 1600);
}

function initScrollFX(){
  const prog=document.getElementById("scrollProg"), bar=document.querySelector(".topbar"), fuel=document.getElementById("fuelReadout");
  let t=false;
  const f=()=>{ const y=pageYOffset||0, h=document.documentElement.scrollHeight-innerHeight;
    const pct=h>0?(y/h*100):0;
    if(prog) prog.style.width=pct+"%";
    if(fuel){ fuel.textContent="COMBUSTIBLE "+Math.round(pct)+"%"; fuel.classList.toggle("redline", pct>=88); }
    if(bar) bar.classList.toggle("scrolled", y>8);
    t=false; };
  addEventListener("scroll",()=>{ if(!t){ t=true; requestAnimationFrame(f); } },{passive:true}); f();
}

/* #16 fragua: los títulos se calientan a ámbar al entrar en viewport */
function initForge(){
  const els=document.querySelectorAll("[data-split]");
  if(!els.length) return;
  if(!("IntersectionObserver" in window)){ els.forEach(e=>e.classList.add("is-forged")); return; }
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("is-forged"); io.unobserve(e.target); } }),{threshold:.35});
  els.forEach(e=>io.observe(e));
}

/* #27 fogonazo + recoil al click de cualquier botón */
function initClickBlast(){
  document.addEventListener("click",e=>{
    const btn=e.target.closest(".btn,.card__btn,.plan__btn,.follow__links a");
    if(!btn) return;
    btn.classList.remove("is-recoil"); void btn.offsetWidth; btn.classList.add("is-recoil");
    setTimeout(()=>btn.classList.remove("is-recoil"),320);
    const b=document.createElement("span"); b.className="click-blast";
    b.style.left=e.clientX+"px"; b.style.top=e.clientY+"px";
    document.body.appendChild(b);
    setTimeout(()=>b.remove(),520);
  },{passive:true});
}

/* #35 cierre: el tanque del closer entra y le dispara al CTA en loop */
function initCloserTank(){
  const closer=document.querySelector(".closer"), tank=document.querySelector(".closer__tank"),
        cta=document.querySelector(".closer__cta"), btn=cta&&cta.querySelector(".btn");
  if(!closer||!tank||!cta||!btn) return;
  let started=false, timer=null;
  function fire(){
    if(document.hidden) return;
    tank.classList.remove("is-firing"); cta.classList.remove("is-firing"); void tank.offsetWidth;
    tank.classList.add("is-firing"); cta.classList.add("is-firing");
    btn.classList.remove("is-hit"); void btn.offsetWidth; btn.classList.add("is-hit");
    closer.classList.remove("is-blast"); void closer.offsetWidth; closer.classList.add("is-blast");
    setTimeout(()=>{ tank.classList.remove("is-firing"); cta.classList.remove("is-firing"); btn.classList.remove("is-hit"); closer.classList.remove("is-blast"); },460);
  }
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){
      if(!started){ started=true; tank.classList.add("is-in"); setTimeout(fire,1200); }
      if(!timer) timer=setInterval(fire, 3600);
    } else { if(timer){ clearInterval(timer); timer=null; } }
  }),{threshold:.4});
  io.observe(closer);
}

/* ---------- GSAP: SplitText en títulos + parallax en la banda ---------- */
function initGSAP(){
  if(!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  if(window.SplitText){ try{ gsap.registerPlugin(SplitText); }catch(e){} }

  document.querySelectorAll("[data-split]").forEach(function(t){
    if(!window.SplitText) return;
    try{
      var s = SplitText.create(t, { type:"lines", mask:"lines" });
      gsap.from(s.lines, { yPercent:118, opacity:0, stagger:.09, duration:.7, ease:"power3.out",
        scrollTrigger:{ trigger:t, start:"top 90%", once:true } });
    }catch(e){}
  });

  document.querySelectorAll("[data-parallax]").forEach(function(img){
    var sec = img.closest("section") || img;
    gsap.fromTo(img, { yPercent:-9 }, { yPercent:9, ease:"none",
      scrollTrigger:{ trigger:sec, start:"top bottom", end:"bottom top", scrub:true } });
  });
  ScrollTrigger.refresh();
}

/* ---------- Botones magnéticos (desktop) ---------- */
function initMagnetic(){
  if(!matchMedia("(hover:hover) and (pointer:fine)").matches) return;
  document.querySelectorAll(".btn--amber, .btn--lg").forEach(function(btn){
    var raf=null;
    btn.addEventListener("pointermove",function(e){
      var r=btn.getBoundingClientRect();
      var mx=(e.clientX-r.left-r.width/2)/r.width, my=(e.clientY-r.top-r.height/2)/r.height;
      if(raf) cancelAnimationFrame(raf);
      raf=requestAnimationFrame(function(){ btn.style.transform="translate("+(mx*9).toFixed(1)+"px,"+(my*9).toFixed(1)+"px)"; });
    });
    btn.addEventListener("pointerleave",function(){ if(raf) cancelAnimationFrame(raf); btn.style.transform=""; });
  });
}

/* ---------- Tilt 3D en cards (desktop) ---------- */
function initTilt(){
  if(!matchMedia("(hover:hover) and (pointer:fine)").matches) return;
  document.querySelectorAll(".video-card, .plan").forEach(function(c){
    var raf=null;
    c.style.transformStyle="preserve-3d";
    c.addEventListener("pointermove",function(e){
      var r=c.getBoundingClientRect();
      var px=(e.clientX-r.left)/r.width-.5, py=(e.clientY-r.top)/r.height-.5;
      if(raf) cancelAnimationFrame(raf);
      raf=requestAnimationFrame(function(){ c.style.transform="perspective(900px) rotateX("+(-py*5).toFixed(2)+"deg) rotateY("+(px*6).toFixed(2)+"deg) translateY(-4px)"; });
    });
    c.addEventListener("pointerleave",function(){ if(raf) cancelAnimationFrame(raf); c.style.transform=""; });
  });
}

/* ---------- Golpe seco cuando la placa TANQUE aterriza ---------- */
function initHeroLand(){
  const title=document.querySelector(".hero__title"), hero=document.querySelector(".hero");
  if(!title||!hero) return;
  title.addEventListener("animationend",function(e){
    if(e.animationName!=="tq-drop") return;
    hero.classList.add("hero--land");
    setTimeout(()=>hero.classList.remove("hero--land"),340);
  });
}

/* ---------- Tanque que cruza manejando y le dispara a la "Q" (loop) ---------- */
function initTankFire(){
  const tank=document.querySelector(".hero__tank"), armor=document.querySelector(".hero__armor"),
        hero=document.querySelector(".hero"), hit=armor&&armor.querySelector(".hero__hit");
  if(!tank||!armor||!hit) return;
  const DUR=5600, START=-96, END_PAD=30, BARREL=130; // px: subir BARREL = dispara antes (tanque más a la izquierda)
  // instante (ms) en que la boca del cañón queda justo bajo la Q
  function fireDelay(){
    const a=armor.getBoundingClientRect(), h=hit.getBoundingClientRect();
    const qX=(h.left+h.width/2)-a.left;                 // centro de la Q dentro de la placa
    const prog=(qX-BARREL-START)/((a.width+END_PAD)-START);
    return Math.max(250, Math.min(DUR-300, prog*DUR));
  }
  let busy=false;
  function pass(){
    if(busy||document.hidden) return; busy=true;
    tank.classList.remove("is-driving"); void tank.offsetWidth; tank.classList.add("is-driving");
    setTimeout(()=>{
      tank.classList.add("is-firing"); setTimeout(()=>tank.classList.remove("is-firing"),420);
      armor.classList.remove("is-fire","is-hit"); void armor.offsetWidth; armor.classList.add("is-fire");
      setTimeout(()=>{
        armor.classList.add("is-hit"); // quemadura en la Q
        if(hero){ hero.classList.add("hero--blast"); setTimeout(()=>hero.classList.remove("hero--blast"),440); } // sacudón
      }, 50);
      setTimeout(()=>armor.classList.remove("is-fire"), 900);
      setTimeout(()=>armor.classList.remove("is-hit"), 5000); // la Q cicatriza
    }, fireDelay());
    setTimeout(()=>{ tank.classList.remove("is-driving"); busy=false; }, DUR+300);
  }
  function loop(){ pass(); setTimeout(loop, 9000 + Math.random()*4000); }
  setTimeout(loop, 1700); // primera pasada tras la entrada de la placa
}

document.addEventListener("DOMContentLoaded", ()=>{
  renderTanque(); renderVideos(); fillHazard();
  initCounters(); initReveal(); initScrollFX(); initForge();
  initGSAP(); initMagnetic(); initTilt(); initHeroLand(); initTankFire();
  initClickBlast(); initCloserTank();
});
