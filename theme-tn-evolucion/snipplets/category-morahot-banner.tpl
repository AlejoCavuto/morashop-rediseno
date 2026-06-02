{# ============================================================
   CATEGORÍA MORAHOT — Banner principal de la categoría /morahot
   Se incluye solo cuando category.handle == 'morahot'
   ============================================================ #}

<section class="morahot-cat-banner" data-store="category-morahot-banner" aria-label="Evento MORAHOT">
  <div class="mh-cb-inner">

    <div class="mh-cb-left">
      <div class="mh-cb-eyebrow-row">
        <span class="mh-cb-eyebrow"><span class="mh-cb-dot"></span>EN VIVO AHORA</span>
        <span class="mh-cb-extended">¡Por demanda lo extendimos!</span>
      </div>

      <h1 class="mh-cb-title">
        <span>MORA</span><span class="mh-cb-accent">HOT</span>
      </h1>

      <p class="mh-cb-tagline">
        Suplementos seleccionados con <b>precios especiales</b>. Extendido hasta el <b>domingo 17/05</b> a las 23:59 hs.
      </p>
    </div>

    <div class="mh-cb-right">
      <div class="mh-cb-countdown" id="morahot-cat-countdown">
        <div class="mh-cb-cd-cell"><span class="mh-cb-cd-num" data-mh-cb-unit="days">00</span><div class="mh-cb-cd-label">Días</div></div>
        <span class="mh-cb-cd-sep">:</span>
        <div class="mh-cb-cd-cell"><span class="mh-cb-cd-num" data-mh-cb-unit="hours">00</span><div class="mh-cb-cd-label">Horas</div></div>
        <span class="mh-cb-cd-sep">:</span>
        <div class="mh-cb-cd-cell"><span class="mh-cb-cd-num" data-mh-cb-unit="minutes">00</span><div class="mh-cb-cd-label">Min</div></div>
        <span class="mh-cb-cd-sep">:</span>
        <div class="mh-cb-cd-cell"><span class="mh-cb-cd-num" data-mh-cb-unit="seconds">00</span><div class="mh-cb-cd-label">Seg</div></div>
      </div>

      <div class="mh-cb-rules">
        <div class="mh-cb-rule">
          <strong>10%</strong>
          <div>OFF<small>en toda la tienda</small></div>
        </div>
        <div class="mh-cb-rule">
          <strong>15%</strong>
          <div>OFF<small>pagando en efectivo</small></div>
        </div>
      </div>

      <p class="mh-cb-disclaimer">
        Los productos MORAHOT mantienen su precio del evento sin el 10% adicional.
      </p>
    </div>

  </div>

  {# H2 invisible para SEO con keywords reales que el usuario busca #}
  <h2 class="mh-cb-seo-title">
    Suplementos en oferta — Evento MORAHOT del 9 al 17 de mayo de 2026 (extendido)
  </h2>

  {# CTA scroll-to-products: ayuda al usuario a entender que abajo hay productos #}
  <a href="#productos-morahot" class="mh-cb-scroll-cta" aria-label="Ver productos MORAHOT">
    <span>Ver productos del evento</span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 5v14M5 12l7 7 7-7"/>
    </svg>
  </a>
</section>

<style>
  /* ============================================================
     Banner MORAHOT — namespaced .mh-cb-* para no chocar con el tema
     Paleta extraída de Toluca (#000e35 navy, #ff2e10 coral, etc.)
     ============================================================ */
  .morahot-cat-banner{
    --mh-cb-navy:#000a28;
    --mh-cb-coral:#ff2e10;
    --mh-cb-coral-deep:#cc1d00;
    --mh-cb-line:rgba(255,255,255,.10);
    --mh-cb-grey:rgba(255,255,255,.70);
    --mh-cb-white:#fff;

    position:relative;
    background:var(--mh-cb-navy);
    color:var(--mh-cb-white);
    padding:36px 16px 28px;
    overflow:hidden;
    isolation:isolate;
    font-family:"Sora",sans-serif;
    margin-bottom:0;
  }
  /* mesh atmosférico */
  .morahot-cat-banner::before{
    content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;
    background:
      radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,46,16,.10) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 100% 30%, rgba(255,46,16,.06) 0%, transparent 60%);
  }
  /* línea coral arriba con shimmer */
  .morahot-cat-banner::after{
    content:"";position:absolute;left:0;right:0;top:0;height:3px;
    background:linear-gradient(90deg,var(--mh-cb-coral) 0%,#ff8064 50%,var(--mh-cb-coral) 100%);
    background-size:200% 100%;animation:mh-cb-shimmer 3s linear infinite;
  }
  @keyframes mh-cb-shimmer{from{background-position:200% 0}to{background-position:-200% 0}}

  .morahot-cat-banner .mh-cb-inner{
    max-width:1280px;margin:0 auto;
    display:flex;flex-direction:column;align-items:center;text-align:center;gap:18px;
  }
  @media (min-width:880px){
    .morahot-cat-banner{padding:60px 24px 44px}
    .morahot-cat-banner .mh-cb-inner{
      display:grid;grid-template-columns:1.2fr 1fr;gap:40px;align-items:center;text-align:left;
    }
    .morahot-cat-banner .mh-cb-left{display:flex;flex-direction:column;align-items:flex-start;gap:18px}
    .morahot-cat-banner .mh-cb-right{display:flex;flex-direction:column;gap:14px}
  }
  @media (max-width:879px){
    .morahot-cat-banner .mh-cb-left{display:flex;flex-direction:column;align-items:center;gap:14px}
    .morahot-cat-banner .mh-cb-right{display:flex;flex-direction:column;gap:14px;width:100%;align-items:center}
  }

  /* eyebrow row contiene EN VIVO + badge EXTENDIDO */
  .morahot-cat-banner .mh-cb-eyebrow-row{
    display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:center;
  }
  @media (min-width:880px){
    .morahot-cat-banner .mh-cb-eyebrow-row{justify-content:flex-start}
  }
  /* eyebrow */
  .morahot-cat-banner .mh-cb-eyebrow{
    display:inline-flex;align-items:center;gap:8px;padding:6px 14px;
    background:rgba(255,46,16,.18);border:1px solid rgba(255,46,16,.55);border-radius:999px;
    font-family:"Sora",sans-serif;font-size:10px;font-weight:800;
    text-transform:uppercase;letter-spacing:.18em;color:#fff;
  }
  .morahot-cat-banner .mh-cb-dot{
    width:7px;height:7px;border-radius:50%;background:var(--mh-cb-coral);
    animation:mh-cb-pulse 1.4s ease-out infinite;
  }
  @keyframes mh-cb-pulse{0%{box-shadow:0 0 0 0 rgba(255,46,16,.8)}100%{box-shadow:0 0 0 12px rgba(255,46,16,0)}}

  /* Badge "¡Por demanda lo extendimos!" en categoría — amarillo cálido */
  .morahot-cat-banner .mh-cb-extended{
    display:inline-block;padding:6px 14px;
    background:linear-gradient(135deg,#ffb800 0%,#ff8c00 100%);
    color:#000a28;
    border-radius:999px;
    font-family:"Sora",sans-serif;font-size:10px;font-weight:800;
    text-transform:uppercase;letter-spacing:.12em;
    box-shadow:0 4px 14px rgba(255,184,0,.35);
    animation:mh-cb-extended-pulse 2.2s ease-in-out infinite;
  }
  @keyframes mh-cb-extended-pulse{
    0%,100%{transform:scale(1);box-shadow:0 4px 14px rgba(255,184,0,.35),0 0 0 0 rgba(255,184,0,.5)}
    50%{transform:scale(1.04);box-shadow:0 4px 18px rgba(255,184,0,.45),0 0 0 6px rgba(255,184,0,0)}
  }

  /* título MORAHOT con halo asimétrico */
  .morahot-cat-banner .mh-cb-title{
    font-family:"Sora",sans-serif;font-weight:800;
    font-size:clamp(64px,16vw,128px);line-height:.88;letter-spacing:-.05em;
    color:#fff;text-transform:uppercase;
    display:inline-flex;align-items:baseline;gap:0;
    position:relative;margin:0;
  }
  .morahot-cat-banner .mh-cb-accent{
    position:relative;display:inline-block;color:#fff;z-index:3;
    text-shadow:
      0 -8px 18px rgba(255,180,80,.45),
      0 -4px 10px rgba(255,100,30,.4),
      0 3px 8px rgba(255,46,16,.35);
  }
  .morahot-cat-banner .mh-cb-accent::before{
    content:"";position:absolute;
    right:-25%;bottom:-25%;width:120%;height:160%;
    background:radial-gradient(ellipse at 35% 55%,
      rgba(255,220,120,.55) 0%,
      rgba(255,150,50,.34) 18%,
      rgba(255,80,20,.18) 40%,
      rgba(255,46,16,.08) 60%,
      transparent 78%);
    z-index:1;pointer-events:none;filter:blur(6px);
    animation:mh-cb-halo 3.5s ease-in-out infinite alternate;
    transform-origin:35% 55%;
  }
  @keyframes mh-cb-halo{
    0%{opacity:.85;transform:scale(1)}
    50%{opacity:1;transform:scale(1.04)}
    100%{opacity:.92;transform:scale(1.02)}
  }

  /* tagline */
  .morahot-cat-banner .mh-cb-tagline{
    font-family:"Inter",sans-serif;font-size:14px;color:var(--mh-cb-grey);
    line-height:1.55;max-width:480px;margin:0;
  }
  @media (max-width:879px){.morahot-cat-banner .mh-cb-tagline{margin:0 auto;max-width:360px}}
  .morahot-cat-banner .mh-cb-tagline b{color:#fff;font-weight:700}

  /* countdown compacto */
  .morahot-cat-banner .mh-cb-countdown{
    display:flex;align-items:center;justify-content:center;gap:4px;
    font-family:"Sora",sans-serif;
    background:rgba(255,255,255,.04);
    border:1px solid var(--mh-cb-line);border-radius:12px;
    padding:12px 10px;
    backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
  }
  @media (min-width:880px){
    .morahot-cat-banner .mh-cb-countdown{padding:20px 24px;gap:10px;width:100%}
  }
  .morahot-cat-banner .mh-cb-cd-cell{display:flex;flex-direction:column;align-items:center;min-width:38px;flex:1}
  @media (min-width:880px){.morahot-cat-banner .mh-cb-cd-cell{min-width:60px;flex:0 0 auto}}
  .morahot-cat-banner .mh-cb-cd-num{
    font-weight:800;font-size:24px;line-height:1;color:#fff;
    font-variant-numeric:tabular-nums;letter-spacing:-.03em;
    display:inline-block;perspective:300px;
  }
  @media (min-width:880px){.morahot-cat-banner .mh-cb-cd-num{font-size:40px}}
  /* en mobile, los separadores ":" desaparecen para no comer espacio */
  @media (max-width:560px){
    .morahot-cat-banner .mh-cb-cd-sep{display:none}
  }
  .morahot-cat-banner .mh-cb-cd-num.mh-cb-flip{animation:mh-cb-flip .55s cubic-bezier(.4,0,.2,1)}
  @keyframes mh-cb-flip{
    0%{transform:rotateX(0);opacity:1}
    50%{transform:rotateX(-90deg);opacity:.4}
    100%{transform:rotateX(0);opacity:1}
  }
  .morahot-cat-banner .mh-cb-cd-label{
    font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.16em;
    color:var(--mh-cb-grey);margin-top:4px;
  }
  .morahot-cat-banner .mh-cb-cd-sep{
    font-size:20px;font-weight:800;color:var(--mh-cb-coral);line-height:1;
    margin-bottom:14px;animation:mh-cb-blink 1s steps(2) infinite;
  }
  @media (min-width:880px){
    .morahot-cat-banner .mh-cb-cd-sep{font-size:24px}
  }
  @keyframes mh-cb-blink{0%,50%{opacity:.7}51%,100%{opacity:.2}}

  /* mini reglas — más grandes en desktop */
  .morahot-cat-banner .mh-cb-rules{
    display:flex;gap:10px;width:100%;max-width:520px;
  }
  @media (min-width:880px){
    .morahot-cat-banner .mh-cb-rules{
      gap:14px;max-width:none;
    }
  }
  .morahot-cat-banner .mh-cb-rule{
    flex:1;display:flex;align-items:center;gap:12px;padding:14px 16px;
    background:rgba(255,255,255,.04);
    border:1px solid var(--mh-cb-line);border-radius:10px;
    transition:transform .3s ease,border-color .25s ease,background .25s ease;
  }
  @media (min-width:880px){
    .morahot-cat-banner .mh-cb-rule{
      padding:18px 22px;gap:16px;border-radius:12px;
    }
  }
  .morahot-cat-banner .mh-cb-rule:hover{
    transform:translateY(-2px);
    border-color:rgba(255,46,16,.4);background:rgba(255,46,16,.05);
  }
  .morahot-cat-banner .mh-cb-rule strong{
    font-family:"Sora",sans-serif;font-size:24px;font-weight:800;
    color:var(--mh-cb-coral);letter-spacing:-.02em;line-height:1;
  }
  @media (min-width:880px){
    .morahot-cat-banner .mh-cb-rule strong{font-size:36px}
  }
  .morahot-cat-banner .mh-cb-rule div{
    font-family:"Inter",sans-serif;font-size:12px;color:#fff;
    line-height:1.3;text-align:left;font-weight:700;
  }
  @media (min-width:880px){
    .morahot-cat-banner .mh-cb-rule div{font-size:14px}
  }
  .morahot-cat-banner .mh-cb-rule div small{
    color:var(--mh-cb-grey);font-size:10.5px;display:block;margin-top:2px;font-weight:500;
    line-height:1.3;
  }
  @media (min-width:880px){
    .morahot-cat-banner .mh-cb-rule div small{font-size:12px;margin-top:3px}
  }

  /* disclaimer del 10% no aplicable a MORAHOT */
  .morahot-cat-banner .mh-cb-disclaimer{
    font-family:"Inter",sans-serif;font-size:11px;
    color:rgba(255,255,255,.55);
    font-style:italic;margin:6px 0 0;text-align:center;
    line-height:1.4;
  }
  @media (min-width:880px){
    .morahot-cat-banner .mh-cb-disclaimer{
      font-size:12px;text-align:left;
    }
  }

  /* H2 SEO oculto visualmente pero presente para Google y screen readers */
  .morahot-cat-banner .mh-cb-seo-title{
    position:absolute;
    width:1px;height:1px;
    padding:0;margin:-1px;
    overflow:hidden;
    clip:rect(0,0,0,0);
    white-space:nowrap;border:0;
  }

  /* CTA "Ver productos del evento" con flecha animada */
  .morahot-cat-banner .mh-cb-scroll-cta{
    display:flex;align-items:center;justify-content:center;gap:8px;
    margin:24px auto 0;max-width:340px;
    padding:14px 24px;
    background:transparent;
    border:1px solid rgba(255,46,16,.45);
    border-radius:10px;
    color:#fff;text-decoration:none;
    font-family:"Sora",sans-serif;font-size:13px;font-weight:700;
    text-transform:uppercase;letter-spacing:.12em;
    transition:background .25s ease, border-color .25s ease, transform .2s ease;
    position:relative;z-index:2;
  }
  .morahot-cat-banner .mh-cb-scroll-cta:hover{
    background:rgba(255,46,16,.10);
    border-color:var(--mh-cb-coral);
    color:#fff;text-decoration:none;
    transform:translateY(-2px);
  }
  .morahot-cat-banner .mh-cb-scroll-cta svg{
    width:16px;height:16px;color:var(--mh-cb-coral);
    animation:mh-cb-bounce 1.8s ease-in-out infinite;
  }
  @keyframes mh-cb-bounce{
    0%,100%{transform:translateY(0)}
    50%{transform:translateY(4px)}
  }
  @media (min-width:880px){
    .morahot-cat-banner .mh-cb-scroll-cta{
      margin:32px auto 0;max-width:400px;font-size:14px;padding:16px 28px;
    }
  }
  /* respeto a prefers-reduced-motion */
  @media (prefers-reduced-motion: reduce){
    .morahot-cat-banner .mh-cb-scroll-cta svg{animation:none}
  }
</style>

<script>
(function(){
  if(window.__morahotCatBannerInit) return;
  window.__morahotCatBannerInit = true;

  // Countdown hacia el FIN del evento
  var target = new Date('2026-05-17T23:59:59-03:00').getTime();
  function mhcbq(u){return document.querySelector('[data-mh-cb-unit="'+u+'"]');}
  function mhcbPad(n){return n.toString().padStart(2,'0');}
  var prev={days:'',hours:'',minutes:'',seconds:''};

  function mhcbTick(){
    var diff=target-Date.now();
    if(diff<=0){
      ['days','hours','minutes','seconds'].forEach(function(u){
        var el = mhcbq(u);
        if(el) el.textContent='00';
      });
      return;
    }
    var v={
      days:    mhcbPad(Math.floor(diff/86400000)),
      hours:   mhcbPad(Math.floor((diff%86400000)/3600000)),
      minutes: mhcbPad(Math.floor((diff%3600000)/60000)),
      seconds: mhcbPad(Math.floor((diff%60000)/1000))
    };
    Object.keys(v).forEach(function(k){
      if(v[k]!==prev[k]){
        var el=mhcbq(k);if(!el)return;
        el.textContent=v[k];
        el.classList.remove('mh-cb-flip');
        void el.offsetWidth;
        el.classList.add('mh-cb-flip');
        prev[k]=v[k];
      }
    });
  }
  mhcbTick();setInterval(mhcbTick,1000);
})();
</script>
