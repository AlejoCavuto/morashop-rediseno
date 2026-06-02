{#
========================================================================
   MORAHOT — Teaser pre-evento (Fase A)
   ----------------------------------------------------------------
   Esta sección se muestra entre HOY y el 09/05/2026 a las 00:00 hs.
   Después del 09/05 00:00 desaparece sola (no se renderiza).

   Cuando empiece el evento (09/05) reemplazar este snippet por
   el `home-morahot-grid.tpl` (Fase B) con la grilla de productos
   de la categoría MORAHOT.

   Después del 13/05 23:59, borrar el include desde home.tpl.
========================================================================
#}

{# Fechas del evento (timezone Argentina explícita -03:00).
   Sin la timezone, Twig interpreta "now" en UTC del server y dispara
   el estado 'live' 3 horas antes de tiempo. #}
{% set morahot_start_ts = "2026-05-09 00:00:00-03:00" | date("U") %}
{% set morahot_end_ts   = "2026-05-17 23:59:59-03:00" | date("U") %}
{% set now_ts = "now" | date("U") %}

{# Estado del evento: 'pre' (todavía no arranca) | 'live' (en curso) | 'over' (terminó) #}
{% set morahot_state = 'pre' %}
{% if now_ts >= morahot_start_ts and now_ts <= morahot_end_ts %}
  {% set morahot_state = 'live' %}
{% elseif now_ts > morahot_end_ts %}
  {% set morahot_state = 'over' %}
{% endif %}

{# Solo renderizamos el teaser ANTES del fin del evento.
   Después del 17/05 23:59:59 (estado 'over') desaparece sola. #}
{% if morahot_state != 'over' %}

<section class="morahot-teaser" data-store="home-morahot-teaser" aria-label="Próximo evento MORAHOT">

  <div class="mh-inner">

    <span class="mh-eyebrow"><span class="mh-dot"></span>Próximamente</span>

    <div class="mh-title-wrap">
      <h2 class="mh-title">
        <span>MORA</span><span class="mh-accent" id="morahot-hot">HOT</span>
      </h2>
      <div class="mh-soon">
        Sábado 09 al <s class="mh-soon-old">Miércoles 13</s> <span class="mh-soon-new">Domingo 17 de Mayo</span>
      </div>
      <div class="mh-extended-badge">¡Por demanda lo extendimos!</div>
    </div>

    <div class="mh-countdown" id="morahot-countdown" aria-label="Cuenta regresiva del evento MORAHOT">
      <div class="mh-cd-box"><span class="mh-cd-num" data-mh-unit="days">00</span><div class="mh-cd-label">Días</div></div>
      <div class="mh-cd-box"><span class="mh-cd-num" data-mh-unit="hours">00</span><div class="mh-cd-label">Horas</div></div>
      <div class="mh-cd-box"><span class="mh-cd-num" data-mh-unit="minutes">00</span><div class="mh-cd-label">Min</div></div>
      <div class="mh-cd-box"><span class="mh-cd-num" data-mh-unit="seconds">00</span><div class="mh-cd-label">Seg</div></div>
    </div>

    {% if morahot_state == 'live' %}
      {# Reglas — solo visibles cuando el evento está EN CURSO #}
      <div class="mh-rules">
        <div class="mh-rule">
          <div class="mh-pct">10%</div>
          <div>
            <h3>Descuento lineal en toda la tienda</h3>
            <p>Durante el MORAHOT, todos los productos de Morashop tienen un 10% OFF directo.</p>
            <span class="mh-note">No combinable: los productos MORAHOT mantienen su precio del evento sin el 10% adicional.</span>
          </div>
        </div>
        <div class="mh-rule">
          <div class="mh-pct">15%</div>
          <div>
            <h3>Descuento pagando en efectivo</h3>
            <p>Como siempre en Morashop: 15% OFF abonando en efectivo en toda la tienda.</p>
            <span class="mh-note">5% OFF si pagás por transferencia bancaria.</span>
          </div>
        </div>
      </div>
    {% else %}
      {# Teaser de misterio — solo visible ANTES del evento #}
      <div class="mh-tease">
        <div class="mh-tease-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/><circle cx="12" cy="12" r="4"/></svg>
        </div>
        <h3 class="mh-tease-title">Algo grande se viene</h3>
        <p class="mh-tease-text">Suplementos, electro, supermercado y mucho más, con descuentos que se revelan el <b>sábado 09/05 a las 00:00 hs</b>.</p>
      </div>
    {% endif %}

    <div class="mh-cta-row">
      {% if morahot_state == 'live' %}
        {# Evento EN CURSO: botón activo que lleva a la categoría con productos #}
        <a class="mh-cta" href="https://www.morashop.ar/morahot">
          <span>Ver categoría MORAHOT</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </a>
        <p class="mh-cta-note">¡El evento está activo! <strong>Extendido por demanda</strong> hasta el <strong>domingo 17/05 a las 23:59 hs</strong>.</p>
      {% else %}
        {# Evento PENDIENTE: botón deshabilitado, no clickeable #}
        <button class="mh-cta mh-cta-disabled" type="button" disabled aria-disabled="true">
          <svg class="mh-cta-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
          <span>Empieza el sábado 09/05</span>
        </button>
        <p class="mh-cta-note">Las ofertas se activan automáticamente cuando llegue el día. Estamos preparando algo grande 🔥</p>
      {% endif %}
    </div>

  </div>
</section>

<style>
  /* ============================================================
     MORAHOT teaser — estilos namespaced .mh-* para no colisionar
     con el resto del tema Toluca.
     ============================================================ */
  .morahot-teaser{
    --mh-navy-deep:#000e35;
    --mh-coral:#ff2e10;
    --mh-coral-deep:#cc1d00;
    --mh-grey-line:rgba(255,255,255,.12);
    --mh-grey-text:rgba(255,255,255,.72);
    --mh-white:#fff;

    position:relative;
    background:var(--mh-navy-deep);
    color:var(--mh-white);
    padding:72px 24px 80px;
    overflow:hidden;
    isolation:isolate;
    font-family:"Sora",sans-serif;
  }
  .morahot-teaser::before{
    content:"";position:absolute;inset:-20%;z-index:-2;pointer-events:none;
    background:
      radial-gradient(circle at 50% 40%, rgba(255,46,16,.15) 0%, transparent 35%),
      radial-gradient(circle at 50% 50%, rgba(0,28,75,1) 0%, transparent 60%);
    animation:mh-bgShift 18s ease-in-out infinite alternate;
  }
  @keyframes mh-bgShift{0%{transform:translate(0,0)}100%{transform:translate(-2%,1%)}}
  .morahot-teaser::after{
    content:"";position:absolute;left:0;right:0;top:0;height:3px;
    background:linear-gradient(90deg,var(--mh-coral) 0%,#ff8064 50%,var(--mh-coral) 100%);
    background-size:200% 100%;animation:mh-shimmer 3s linear infinite;
  }
  @keyframes mh-shimmer{from{background-position:200% 0}to{background-position:-200% 0}}

  .morahot-teaser .mh-inner{
    max-width:1100px;margin:0 auto;
    display:flex;flex-direction:column;align-items:center;gap:48px;
    position:relative;z-index:1;text-align:center;
  }

  .morahot-teaser .mh-eyebrow{
    display:inline-flex;align-items:center;gap:10px;
    padding:8px 16px;background:rgba(255,46,16,.15);
    border:1px solid rgba(255,46,16,.5);border-radius:999px;
    font-family:"Sora",sans-serif;font-size:11px;font-weight:700;
    text-transform:uppercase;letter-spacing:.18em;color:var(--mh-coral);
    opacity:0;transform:translateY(20px);
    animation:mh-reveal .9s cubic-bezier(.2,.8,.2,1) .1s forwards;
  }
  .morahot-teaser .mh-dot{
    width:7px;height:7px;border-radius:50%;background:var(--mh-coral);
    animation:mh-pulse 1.4s ease-out infinite;
  }
  @keyframes mh-pulse{0%{box-shadow:0 0 0 0 rgba(255,46,16,.8)}100%{box-shadow:0 0 0 14px rgba(255,46,16,0)}}
  @keyframes mh-reveal{to{opacity:1;transform:translateY(0)}}

  .morahot-teaser .mh-title-wrap{
    opacity:0;transform:translateY(20px);
    animation:mh-reveal .9s cubic-bezier(.2,.8,.2,1) .3s forwards;
  }
  .morahot-teaser .mh-title{
    font-family:"Sora",sans-serif;font-weight:800;
    font-size:clamp(56px,11vw,160px);line-height:.92;letter-spacing:-.045em;
    color:var(--mh-white);text-transform:uppercase;
    display:inline-flex;align-items:baseline;gap:0;
    position:relative;margin:0;
  }
  .morahot-teaser .mh-accent{
    position:relative;display:inline-block;color:var(--mh-white);z-index:3;
    /* glow del texto: simula que las letras "HOT" están iluminadas por el halo */
    text-shadow:
      0 -8px 18px rgba(255,180,80,.45),
      0 -4px 10px rgba(255,100,30,.4),
      0 3px 8px rgba(255,46,16,.35);
  }
  /* HALO CÁLIDO detrás de HOT — posicionado del lado DERECHO-INFERIOR
     (asimétrico, como saliendo de la "T" final). Mismo en todos los navegadores.
     2 capas radiales con animación sutil de "respiración". */
  .morahot-teaser .mh-accent::before{
    content:"";
    position:absolute;
    /* anclado a la derecha-abajo de las letras */
    right:-30%;
    bottom:-30%;
    width:130%;
    height:170%;
    background:
      radial-gradient(ellipse at 35% 50%,
        rgba(255,220,120,.50) 0%,
        rgba(255,150,50,.32) 18%,
        rgba(255,80,20,.18) 40%,
        rgba(255,46,16,.08) 60%,
        transparent 78%);
    z-index:1;
    pointer-events:none;
    filter:blur(6px);
    animation:mh-halo-breath 3.5s ease-in-out infinite alternate;
    transform-origin:35% 50%;
  }
  /* segunda capa más concentrada — el "núcleo" caliente, también a la derecha */
  .morahot-teaser .mh-accent::after{
    content:"";
    position:absolute;
    right:-10%;
    bottom:-15%;
    width:80%;
    height:115%;
    background:
      radial-gradient(ellipse at 30% 55%,
        rgba(255,240,180,.40) 0%,
        rgba(255,180,60,.25) 20%,
        rgba(255,100,30,.12) 50%,
        transparent 75%);
    z-index:1;
    pointer-events:none;
    filter:blur(4px);
    animation:mh-halo-flicker 2.2s ease-in-out infinite alternate;
    transform-origin:30% 55%;
  }
  @keyframes mh-halo-breath{
    0%   { opacity:.85; transform:scale(1);    }
    50%  { opacity:1;   transform:scale(1.04); }
    100% { opacity:.92; transform:scale(1.02); }
  }
  @keyframes mh-halo-flicker{
    0%   { opacity:.7;  transform:scaleX(1)    scaleY(1);    }
    30%  { opacity:1;   transform:scaleX(1.06) scaleY(.98);  }
    60%  { opacity:.85; transform:scaleX(.98)  scaleY(1.04); }
    100% { opacity:.95; transform:scaleX(1.02) scaleY(1);    }
  }
  .morahot-teaser .mh-soon{
    font-family:"Sora",sans-serif;font-weight:600;
    font-size:clamp(13px,1.2vw,15px);text-transform:uppercase;letter-spacing:.5em;
    color:var(--mh-grey-text);margin-top:18px;padding-left:.5em;position:relative;z-index:5;
  }
  /* Fecha vieja tachada — refleja que estamos extendiendo el evento */
  .morahot-teaser .mh-soon-old{
    color:rgba(255,255,255,.35);
    text-decoration:line-through;
    text-decoration-color:rgba(255,46,16,.7);
    text-decoration-thickness:2px;
    margin-right:.3em;
    font-weight:500;
  }
  /* Fecha nueva destacada */
  .morahot-teaser .mh-soon-new{
    color:#ffb800;
    font-weight:800;
    letter-spacing:.4em;
  }
  /* Badge "¡Por demanda lo extendimos!" — pildora amarilla */
  .morahot-teaser .mh-extended-badge{
    display:inline-block;
    margin-top:14px;
    padding:7px 16px;
    background:linear-gradient(135deg,#ffb800 0%,#ff8c00 100%);
    color:#000a28;
    border-radius:999px;
    font-family:"Sora",sans-serif;
    font-weight:800;
    font-size:11.5px;
    letter-spacing:.12em;
    text-transform:uppercase;
    box-shadow:0 6px 18px rgba(255,184,0,.35);
    animation:mh-extended-pulse 2.2s ease-in-out infinite;
    position:relative;z-index:5;
  }
  @keyframes mh-extended-pulse{
    0%,100%{transform:scale(1);box-shadow:0 6px 18px rgba(255,184,0,.35),0 0 0 0 rgba(255,184,0,.5)}
    50%{transform:scale(1.04);box-shadow:0 6px 22px rgba(255,184,0,.45),0 0 0 8px rgba(255,184,0,0)}
  }
  @media (max-width:560px){
    .morahot-teaser .mh-extended-badge{font-size:10.5px;padding:6px 14px;letter-spacing:.08em}
  }

  .morahot-teaser .mh-countdown{
    display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;
    width:100%;max-width:720px;
    opacity:0;transform:translateY(20px);
    animation:mh-reveal .9s cubic-bezier(.2,.8,.2,1) .5s forwards;
  }
  @media (max-width:560px){.morahot-teaser .mh-countdown{gap:8px}}
  .morahot-teaser .mh-cd-box{
    background:rgba(255,255,255,.05);border:1px solid var(--mh-grey-line);
    border-radius:12px;padding:24px 8px 16px;position:relative;overflow:hidden;
    transition:border-color .3s ease,background .3s ease,box-shadow .4s ease;
  }
  .morahot-teaser .mh-cd-box::before{
    content:"";position:absolute;inset:0;
    background:linear-gradient(180deg,rgba(255,46,16,.08) 0%,transparent 50%);
    pointer-events:none;transition:opacity .3s ease;
  }
  .morahot-teaser .mh-cd-box:hover{
    border-color:rgba(255,46,16,.5);background:rgba(255,46,16,.06);
  }
  .morahot-teaser .mh-cd-num{
    font-family:"Sora",sans-serif;font-weight:800;
    font-size:clamp(40px,7vw,72px);line-height:1;
    color:var(--mh-white);font-variant-numeric:tabular-nums;
    letter-spacing:-.03em;display:inline-block;
    transform-origin:50% 50%;
    transition:text-shadow .3s ease;
  }
  /* Container con perspective real para que el flip 3D se vea */
  .morahot-teaser .mh-cd-box{
    perspective:600px;
  }

  /* === FLIP base (segundos) — corto y fluido para que se sienta
     que el número cambia AL girar, no después === */
  .morahot-teaser .mh-cd-num.mh-flip{
    animation:mh-flip .28s cubic-bezier(.4,0,.2,1);
  }
  @keyframes mh-flip{
    0%  {transform:rotateX(0deg);    opacity:1}
    50% {transform:rotateX(-90deg);  opacity:.15}
    100%{transform:rotateX(0deg);    opacity:1}
  }

  /* === FLIP MINUTO — flip + glow coral en el número === */
  .morahot-teaser .mh-cd-num.mh-flip-minute{
    animation:mh-flip-minute .7s cubic-bezier(.4,0,.2,1);
  }
  @keyframes mh-flip-minute{
    0%  {transform:rotateX(0deg)   scale(1);    text-shadow:none}
    45% {transform:rotateX(-90deg) scale(1.08); text-shadow:0 0 18px rgba(255,46,16,.7)}
    55% {transform:rotateX(-90deg) scale(1.08); text-shadow:0 0 22px rgba(255,46,16,.85)}
    100%{transform:rotateX(0deg)   scale(1);    text-shadow:none}
  }
  /* y la celda contenedora hace un destello coral leve */
  .morahot-teaser .mh-cd-box.mh-pulse-minute{
    animation:mh-pulse-cell-minute .8s ease-out;
  }
  @keyframes mh-pulse-cell-minute{
    0%  {box-shadow:0 0 0 0 rgba(255,46,16,0);    border-color:var(--mh-grey-line)}
    30% {box-shadow:0 0 28px 6px rgba(255,46,16,.35); border-color:rgba(255,46,16,.6)}
    100%{box-shadow:0 0 0 0 rgba(255,46,16,0);    border-color:var(--mh-grey-line)}
  }

  /* === FLIP HORA — flip más fuerte + glow más intenso + scale más marcado === */
  .morahot-teaser .mh-cd-num.mh-flip-hour{
    animation:mh-flip-hour .9s cubic-bezier(.34,1.4,.64,1);
  }
  @keyframes mh-flip-hour{
    0%  {transform:rotateX(0deg)   scale(1);    text-shadow:none}
    45% {transform:rotateX(-90deg) scale(1.15); text-shadow:0 0 24px rgba(255,180,80,.85), 0 0 12px rgba(255,46,16,.7)}
    55% {transform:rotateX(-90deg) scale(1.15)}
    100%{transform:rotateX(0deg)   scale(1);    text-shadow:none}
  }
  .morahot-teaser .mh-cd-box.mh-pulse-hour{
    animation:mh-pulse-cell-hour 1.1s ease-out;
  }
  @keyframes mh-pulse-cell-hour{
    0%  {box-shadow:0 0 0 0 rgba(255,46,16,0);            border-color:var(--mh-grey-line); background:rgba(255,255,255,.05)}
    25% {box-shadow:0 0 36px 10px rgba(255,46,16,.55);    border-color:rgba(255,46,16,.85); background:rgba(255,46,16,.10)}
    100%{box-shadow:0 0 0 0 rgba(255,46,16,0);            border-color:var(--mh-grey-line); background:rgba(255,255,255,.05)}
  }

  /* === FLIP DÍA — el más espectacular: pulso largo + glow dorado-coral + bounce === */
  .morahot-teaser .mh-cd-num.mh-flip-day{
    animation:mh-flip-day 1.4s cubic-bezier(.34,1.56,.64,1);
  }
  @keyframes mh-flip-day{
    0%  {transform:rotateX(0deg)   scale(1);    text-shadow:none}
    35% {transform:rotateX(-90deg) scale(1.25); text-shadow:0 0 32px rgba(255,220,120,1), 0 0 18px rgba(255,46,16,.9)}
    50% {transform:rotateX(-180deg) scale(1.25)}
    65% {transform:rotateX(-270deg) scale(1.25)}
    100%{transform:rotateX(-360deg) scale(1);   text-shadow:none}
  }
  .morahot-teaser .mh-cd-box.mh-pulse-day{
    animation:mh-pulse-cell-day 1.6s ease-out;
  }
  @keyframes mh-pulse-cell-day{
    0%  {box-shadow:0 0 0 0 rgba(255,46,16,0);              border-color:var(--mh-grey-line); background:rgba(255,255,255,.05)}
    20% {box-shadow:0 0 50px 16px rgba(255,180,60,.6), 0 0 24px rgba(255,46,16,.7); border-color:rgba(255,180,60,.9); background:rgba(255,46,16,.14)}
    50% {box-shadow:0 0 60px 20px rgba(255,180,60,.4); border-color:rgba(255,180,60,.7)}
    100%{box-shadow:0 0 0 0 rgba(255,46,16,0);              border-color:var(--mh-grey-line); background:rgba(255,255,255,.05)}
  }
  .morahot-teaser .mh-cd-label{
    font-family:"Sora",sans-serif;font-size:10px;font-weight:600;
    text-transform:uppercase;letter-spacing:.25em;color:var(--mh-grey-text);
    margin-top:10px;
  }
  .morahot-teaser .mh-cd-box::after{
    content:":";position:absolute;right:-12px;top:34%;
    font-family:"Sora",sans-serif;font-weight:800;font-size:42px;
    color:var(--mh-coral);line-height:1;opacity:.7;
    animation:mh-colonBlink 1s steps(2) infinite;
  }
  @keyframes mh-colonBlink{0%,50%{opacity:.7}51%,100%{opacity:.2}}
  .morahot-teaser .mh-cd-box:last-child::after{display:none}
  @media (max-width:560px){.morahot-teaser .mh-cd-box::after{display:none}}

  .morahot-teaser .mh-rules{
    display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;
    width:100%;max-width:860px;margin-top:8px;
  }
  @media (max-width:720px){.morahot-teaser .mh-rules{grid-template-columns:1fr}}
  .morahot-teaser .mh-rule{
    background:rgba(255,255,255,.04);border:1px solid var(--mh-grey-line);
    border-radius:12px;padding:24px;text-align:left;
    display:flex;gap:16px;align-items:flex-start;
    transition:transform .3s ease,border-color .3s ease,background .3s ease;
    position:relative;overflow:hidden;
    opacity:0;transform:translateY(20px);
    animation:mh-reveal .9s cubic-bezier(.2,.8,.2,1) forwards;
  }
  .morahot-teaser .mh-rule:nth-child(1){animation-delay:.7s}
  .morahot-teaser .mh-rule:nth-child(2){animation-delay:.85s}
  .morahot-teaser .mh-rule::after{
    content:"";position:absolute;top:-50%;left:-50%;width:200%;height:200%;
    background:radial-gradient(circle,rgba(255,46,16,.12) 0%,transparent 50%);
    opacity:0;transition:opacity .4s ease;pointer-events:none;
  }
  .morahot-teaser .mh-rule:hover{
    transform:translateY(-4px);
    border-color:rgba(255,46,16,.4);
    background:rgba(255,46,16,.05);
  }
  .morahot-teaser .mh-rule:hover::after{opacity:1}
  .morahot-teaser .mh-pct{
    flex-shrink:0;font-family:"Sora",sans-serif;font-weight:800;
    font-size:40px;line-height:1;color:var(--mh-coral);
    letter-spacing:-.03em;min-width:70px;
    text-shadow:0 0 20px rgba(255,46,16,.4);
  }
  .morahot-teaser .mh-rule h3{
    font-family:"Sora",sans-serif;font-size:15px;font-weight:700;
    color:var(--mh-white);margin:0 0 6px;
  }
  .morahot-teaser .mh-rule p{
    font-family:"Inter",sans-serif;font-size:13.5px;line-height:1.55;
    color:var(--mh-grey-text);margin:0;
  }
  .morahot-teaser .mh-note{
    display:block;font-family:"Inter",sans-serif;font-size:11.5px;
    color:#a39ca7;margin-top:6px;font-style:italic;
  }

  .morahot-teaser .mh-cta-row{
    display:flex;flex-direction:column;align-items:center;gap:14px;margin-top:8px;
    opacity:0;transform:translateY(20px);
    animation:mh-reveal .9s cubic-bezier(.2,.8,.2,1) 1s forwards;
  }
  .morahot-teaser .mh-cta{
    display:inline-flex;align-items:center;gap:10px;
    background:var(--mh-coral);color:var(--mh-white);
    padding:18px 40px;
    font-family:"Sora",sans-serif;font-weight:700;
    text-transform:uppercase;letter-spacing:.12em;font-size:13px;
    border:none;border-radius:8px;text-decoration:none;cursor:pointer;
    transition:transform .2s ease,background .2s ease,box-shadow .2s ease;
    box-shadow:0 8px 24px rgba(255,46,16,.4),0 0 0 0 rgba(255,46,16,.5);
    position:relative;overflow:hidden;
    animation:mh-ctaPulse 2.4s ease-in-out infinite;
  }
  @keyframes mh-ctaPulse{
    0%,100%{box-shadow:0 8px 24px rgba(255,46,16,.4),0 0 0 0 rgba(255,46,16,.5)}
    50%{box-shadow:0 8px 24px rgba(255,46,16,.4),0 0 0 12px rgba(255,46,16,0)}
  }
  .morahot-teaser .mh-cta::before{
    content:"";position:absolute;top:0;left:-100%;width:100%;height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);
    transition:left .6s ease;
  }
  .morahot-teaser .mh-cta:hover{
    background:var(--mh-coral-deep);transform:translateY(-2px);
    color:var(--mh-white);text-decoration:none;
  }
  .morahot-teaser .mh-cta:hover::before{left:100%}
  .morahot-teaser .mh-cta svg{
    width:16px;height:16px;transition:transform .25s ease;position:relative;
  }
  .morahot-teaser .mh-cta:hover svg{transform:translateX(6px)}
  .morahot-teaser .mh-cta-note{
    font-family:"Inter",sans-serif;font-size:12px;color:#8d96b3;
    max-width:520px;line-height:1.5;margin:0;
  }

  /* ============================================================
     Bloque "teaser de misterio" — visible solo ANTES del evento
     ============================================================ */
  .morahot-teaser .mh-tease{
    width:100%;max-width:560px;
    padding:32px 28px;
    text-align:center;
    background:rgba(255,255,255,.04);
    border:1px solid rgba(255,46,16,.25);
    border-radius:14px;
    position:relative;overflow:hidden;
    opacity:0;transform:translateY(20px);
    animation:mh-reveal .9s cubic-bezier(.2,.8,.2,1) .7s forwards;
  }
  .morahot-teaser .mh-tease::before{
    content:"";position:absolute;inset:0;
    background:radial-gradient(circle at 50% 0%,rgba(255,46,16,.10) 0%,transparent 60%);
    pointer-events:none;
  }
  .morahot-teaser .mh-tease-icon{
    display:inline-flex;align-items:center;justify-content:center;
    width:48px;height:48px;
    border-radius:50%;
    background:rgba(255,46,16,.15);
    color:var(--mh-coral);
    margin:0 auto 14px;
    position:relative;
    animation:mh-tease-spin 12s linear infinite;
  }
  .morahot-teaser .mh-tease-icon svg{width:22px;height:22px}
  @keyframes mh-tease-spin{to{transform:rotate(360deg)}}

  .morahot-teaser .mh-tease-title{
    font-family:"Sora",sans-serif;font-weight:700;
    font-size:clamp(20px,2.2vw,26px);
    color:var(--mh-white);
    margin:0 0 10px;
    letter-spacing:-.01em;
  }
  .morahot-teaser .mh-tease-text{
    font-family:"Inter",sans-serif;font-size:14px;line-height:1.6;
    color:var(--mh-grey-text);
    margin:0;
  }
  .morahot-teaser .mh-tease-text b{
    color:var(--mh-white);font-weight:700;
  }

  /* ============================================================
     Estado pre-evento: botón deshabilitado
     ============================================================ */
  .morahot-teaser .mh-cta-disabled{
    background:rgba(255,255,255,.08);
    color:rgba(255,255,255,.55);
    border:1px solid rgba(255,255,255,.15);
    cursor:not-allowed;
    box-shadow:none;
    animation:none;
    pointer-events:auto; /* permite que se vea el cursor not-allowed */
  }
  .morahot-teaser .mh-cta-disabled::before{display:none}
  .morahot-teaser .mh-cta-disabled:hover{
    background:rgba(255,255,255,.08);
    transform:none;
    color:rgba(255,255,255,.55);
    box-shadow:none;
  }
  .morahot-teaser .mh-cta-lock{
    width:14px;height:14px;
    color:rgba(255,255,255,.55);
    flex-shrink:0;
  }

  /* respeto a usuarios con prefers-reduced-motion */
  @media (prefers-reduced-motion: reduce){
    /* Suavizamos las decoraciones (halo del título, shimmer del borde,
       pulso del eyebrow) pero MANTENEMOS las animaciones del countdown
       porque comunican información: el reloj corre. */
    .morahot-teaser::before,
    .morahot-teaser::after,
    .morahot-teaser .mh-dot,
    .morahot-teaser .mh-accent::before,
    .morahot-teaser .mh-accent::after,
    .morahot-teaser .mh-tease-icon,
    .morahot-teaser .mh-cta{
      animation-duration:.01ms !important;
      animation-iteration-count:1 !important;
    }
    /* Las transiciones cosméticas también las acortamos */
    .morahot-teaser .mh-cd-box,
    .morahot-teaser .mh-rule,
    .morahot-teaser .mh-cta{
      transition-duration:.01ms !important;
    }
    /* Pero los flips del countdown se mantienen, solo más cortos */
    .morahot-teaser .mh-cd-num.mh-flip,
    .morahot-teaser .mh-cd-num.mh-flip-minute,
    .morahot-teaser .mh-cd-num.mh-flip-hour,
    .morahot-teaser .mh-cd-num.mh-flip-day{
      animation-duration:.3s !important;
    }
  }
</style>

<script>
(function(){
  // ==========================================================
  // MORAHOT teaser — countdown (el fuego es 100% CSS)
  // namespaced morahot* para no chocar con scripts del tema
  // ==========================================================
  if(window.__morahotInit) return;
  window.__morahotInit = true;

  // -------- COUNTDOWN --------
  // Mientras el evento NO arrancó: cuenta hacia el inicio (09/05 00:00).
  // Una vez en vivo: cuenta hacia el cierre (13/05 23:59:59) para
  // mantener la urgencia activa los 7 días.
  var startTs = new Date('2026-05-09T00:00:00-03:00').getTime();
  var endTs   = new Date('2026-05-17T23:59:59-03:00').getTime();
  function mhq(u){ return document.querySelector('[data-mh-unit="'+u+'"]'); }
  function mhPad(n){ return n.toString().padStart(2,'0'); }
  var mhPrev = {days:'',hours:'',minutes:'',seconds:''};
  var mhSwitchedToLive = false;

  function mhSwitchToLiveUI(){
    if (mhSwitchedToLive) return;
    mhSwitchedToLive = true;
    var eb = document.querySelector('.morahot-teaser .mh-eyebrow');
    if(eb){
      eb.innerHTML = '<span class="mh-dot"></span>EN VIVO AHORA';
      eb.style.background = 'rgba(255,46,16,.3)';
    }
  }

  function mhTick(){
    var now = Date.now();
    var target, diff;
    if (now < startTs){
      target = startTs;
    } else if (now <= endTs){
      target = endTs;
      mhSwitchToLiveUI();
    } else {
      // evento terminado: dejamos en cero
      ['days','hours','minutes','seconds'].forEach(function(u){
        var el = mhq(u); if(el) el.textContent = '00';
      });
      return;
    }
    diff = target - now;
    if (diff < 0) diff = 0;
    var v = {
      days:    mhPad(Math.floor(diff/86400000)),
      hours:   mhPad(Math.floor((diff%86400000)/3600000)),
      minutes: mhPad(Math.floor((diff%3600000)/60000)),
      seconds: mhPad(Math.floor((diff%60000)/1000))
    };
    // Mapeo unidad → clase de animación escalonada
    var animMap = {
      seconds: { num: 'mh-flip',         cell: null              },
      minutes: { num: 'mh-flip-minute',  cell: 'mh-pulse-minute' },
      hours:   { num: 'mh-flip-hour',    cell: 'mh-pulse-hour'   },
      days:    { num: 'mh-flip-day',     cell: 'mh-pulse-day'    }
    };
    var allNumClasses  = ['mh-flip','mh-flip-minute','mh-flip-hour','mh-flip-day'];
    var allCellClasses = ['mh-pulse-minute','mh-pulse-hour','mh-pulse-day'];

    Object.keys(v).forEach(function(k){
      if(v[k] !== mhPrev[k]){
        var el = mhq(k);
        if(!el) return;
        var anim = animMap[k];
        var newVal = v[k];
        // Limpiar clases previas para forzar re-trigger
        allNumClasses.forEach(function(c){ el.classList.remove(c); });
        var cell = el.closest('.mh-cd-box');
        if (cell) allCellClasses.forEach(function(c){ cell.classList.remove(c); });
        // Forzar reflow para que la animación re-arranque
        void el.offsetWidth;
        // Disparar flip + pulso de celda
        el.classList.add(anim.num);
        if (cell && anim.cell) cell.classList.add(anim.cell);
        // Escribir el número nuevo EN EL MEDIO del flip (cuando rotateX=-90°
        // y el número está casi invisible). Así parece que "del otro lado
        // aparece el nuevo número" en lugar de cambiar antes y quedarse parado.
        // Duración del flip de segundos: 280ms → midpoint en 140ms.
        // Para minutos/horas/días la duración es mayor pero el midpoint
        // visual sigue cayendo aprox en los primeros 40% de la animación.
        var midpoint = (k === 'seconds') ? 140
                     : (k === 'minutes') ? 320
                     : (k === 'hours')   ? 400
                     : 500; // days
        setTimeout(function(){ el.textContent = newVal; }, midpoint);
        mhPrev[k] = newVal;
      }
    });
  }
  mhTick();
  setInterval(mhTick, 1000);

  // Limpieza: cuando termina la animación, removemos la clase para que
  // el próximo tick pueda re-aplicarla. Sino la animación se queda "stuck".
  document.addEventListener('animationend', function(e){
    var t = e.target;
    if (!t.classList) return;
    if (t.classList.contains('mh-cd-num')){
      t.classList.remove('mh-flip','mh-flip-minute','mh-flip-hour','mh-flip-day');
    }
    if (t.classList.contains('mh-cd-box')){
      t.classList.remove('mh-pulse-minute','mh-pulse-hour','mh-pulse-day');
    }
  });

  // ==========================================================
  // MODO DEMO: morashop.ar/?mh-demo=1 dispara los 4 efectos en
  // secuencia cada 2.5s para validar visualmente sin esperar.
  // ==========================================================
  if (location.search.indexOf('mh-demo=1') >= 0){
    var demoStep = 0;
    var demoSequence = ['seconds','minutes','hours','days'];
    var demoMap = {
      seconds: { num: 'mh-flip',         cell: null              },
      minutes: { num: 'mh-flip-minute',  cell: 'mh-pulse-minute' },
      hours:   { num: 'mh-flip-hour',    cell: 'mh-pulse-hour'   },
      days:    { num: 'mh-flip-day',     cell: 'mh-pulse-day'    }
    };
    setInterval(function(){
      var unit = demoSequence[demoStep % 4];
      demoStep++;
      var el = mhq(unit);
      if (!el) return;
      var anim = demoMap[unit];
      el.classList.remove('mh-flip','mh-flip-minute','mh-flip-hour','mh-flip-day');
      var cell = el.closest('.mh-cd-box');
      if (cell) cell.classList.remove('mh-pulse-minute','mh-pulse-hour','mh-pulse-day');
      void el.offsetWidth;
      el.classList.add(anim.num);
      if (cell && anim.cell) cell.classList.add(anim.cell);
      // simulamos cambio de número en el midpoint para que el demo
      // muestre el mismo efecto visual que en producción
      var fakeVal = mhPad(Math.floor(Math.random()*60));
      var midpoint = (unit === 'seconds') ? 140
                   : (unit === 'minutes') ? 320
                   : (unit === 'hours')   ? 400 : 500;
      setTimeout(function(){ el.textContent = fakeVal; }, midpoint);
      console.log('[MORAHOT demo] disparé:', unit, '→', anim.num, anim.cell || '');
    }, 2500);
    console.log('%c[MORAHOT demo] Modo demo activo. Vas a ver los 4 efectos en loop.', 'color:#ff2e10;font-weight:bold');
  }

  // El "fuego" detrás de HOT es 100% CSS (halo radial animado).
  // Esto garantiza que se vea EXACTAMENTE igual en todos los navegadores
  // (Chrome, Brave con shields, Firefox con anti-fingerprint, Safari iOS, etc.)
  // sin depender de canvas, mix-blend-mode, ni APIs que cada motor renderiza distinto.
})();
</script>

{% endif %}
