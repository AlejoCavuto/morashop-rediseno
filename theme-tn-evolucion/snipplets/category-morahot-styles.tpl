{# ============================================================
   CATEGORÍA MORAHOT — Estilos premium SOLO en /morahot
   Approach conservador: NO toco la estructura de filtros ni de
   imágenes. Solo cambio fondo del body, colores de texto y
   ajustes puntuales en CTAs/badges.
   ============================================================ #}

<style>
  /* ============================================================
     FONDO de la página /morahot
     ============================================================ */
  body.morahot-cat-page{
    background:#000a28;
    overflow-x:hidden;
    scroll-behavior:smooth;
  }
  /* el ancla del CTA "Ver productos del evento" debe respetar el header
     y la barra sticky de ordenar/filtrar — sino queda tapada al saltar */
  body.morahot-cat-page #productos-morahot{
    scroll-margin-top:120px;
  }
  @media (min-width:768px){
    body.morahot-cat-page #productos-morahot{
      scroll-margin-top:80px;
    }
  }

  /* ============================================================
     BANNER TOP — reemplazo del adbar SOLO en /morahot
     Ocultamos el contenido original y usamos un overlay con el
     mensaje del MORAHOT (10% lineal + 15% efectivo + 5% transf.)
     ============================================================ */
  body.morahot-cat-page .header-advertising,
  body.morahot-cat-page .js-header-advertising,
  body.morahot-cat-page [data-store="header-advertising"]{
    position:relative;
    background:linear-gradient(90deg,#cc1d00 0%,#ff2e10 50%,#cc1d00 100%) !important;
    background-size:200% 100% !important;
    color:#fff !important;
    overflow:hidden;
  }
  /* ocultamos los textos originales */
  body.morahot-cat-page .header-advertising > *,
  body.morahot-cat-page .js-header-advertising > *,
  body.morahot-cat-page [data-store="header-advertising"] > *{
    visibility:hidden !important;
  }
  /* y mostramos el nuevo mensaje */
  body.morahot-cat-page .header-advertising::after,
  body.morahot-cat-page .js-header-advertising::after,
  body.morahot-cat-page [data-store="header-advertising"]::after{
    content:"MORAHOT EN VIVO · 10% OFF EN TODA LA WEB · 15% EFECTIVO · 5% TRANSFERENCIA";
    position:absolute;inset:0;
    display:flex;align-items:center;justify-content:center;
    font-family:"Sora",sans-serif;font-weight:800;
    font-size:12px;letter-spacing:.08em;
    color:#fff;
    text-align:center;
    padding:0 14px;
    line-height:1.3;
    text-transform:uppercase;
    animation:mh-adbar-shimmer 3s linear infinite;
  }
  @media (max-width:560px){
    body.morahot-cat-page .header-advertising::after,
    body.morahot-cat-page .js-header-advertising::after,
    body.morahot-cat-page [data-store="header-advertising"]::after{
      content:"MORAHOT EN VIVO · 10% OFF EN TODA LA WEB";
      font-size:11px;
      letter-spacing:.06em;
    }
  }
  @keyframes mh-adbar-shimmer{
    0%{background-position:0 0}
    100%{background-position:200% 0}
  }

  /* ============================================================
     BREADCRUMB y headers — texto blanco sobre navy
     ============================================================ */
  body.morahot-cat-page .breadcrumb,
  body.morahot-cat-page .breadcrumb a,
  body.morahot-cat-page .breadcrumb span{
    color:rgba(255,255,255,.7) !important;
  }
  body.morahot-cat-page .breadcrumb a:hover{
    color:#ff2e10 !important;
  }
  body.morahot-cat-page .background-secondary{
    background:transparent !important;
  }

  /* Headers de la página (h1 categoría, h2 secciones) */
  body.morahot-cat-page > main h1,
  body.morahot-cat-page > main h2:not(.mh-cb-title),
  body.morahot-cat-page .page-header,
  body.morahot-cat-page .page-header *{
    color:#fff !important;
  }

  /* Botón "Ordenar" link */
  body.morahot-cat-page .btn-link{
    color:#fff !important;
  }
  body.morahot-cat-page .btn-link:hover{
    color:#ff2e10 !important;
  }
  body.morahot-cat-page .btn-link svg{
    color:#ff2e10 !important;
  }

  /* ============================================================
     MOBILE: Barra sticky "ORDENAR / FILTRAR" — visible sobre navy
     Toluca pone esos botones con texto color #000E35 (mismo navy)
     y se vuelven invisibles. Forzamos blanco + fondo navy SÓLIDO
     para que cuando se vuelva sticky no se transparente sobre las
     cards blancas.
     ============================================================ */
  @media (max-width:767px){
    body.morahot-cat-page .js-category-controls,
    body.morahot-cat-page .category-controls,
    body.morahot-cat-page .js-category-controls.is-sticky,
    body.morahot-cat-page .category-controls.is-sticky,
    body.morahot-cat-page .js-category-controls-prev + div,
    body.morahot-cat-page .container .d-md-none .d-flex,
    body.morahot-cat-page .row .d-md-none .d-flex{
      background:#000a28 !important;
      border-top:1px solid rgba(255,255,255,.12) !important;
      border-bottom:1px solid rgba(255,46,16,.25) !important;
      box-shadow:0 4px 14px rgba(0,0,0,.45) !important;
    }
    /* Toluca le pone .background-secondary que pinta gris claro — lo neutralizamos */
    body.morahot-cat-page .js-category-controls.background-secondary,
    body.morahot-cat-page .category-controls.background-secondary{
      background:#000a28 !important;
    }
    /* Cualquier link/botón con texto navy lo forzamos a blanco en mobile */
    body.morahot-cat-page .d-md-none a,
    body.morahot-cat-page .d-md-none .btn-link,
    body.morahot-cat-page .d-md-none [data-toggle],
    body.morahot-cat-page .d-md-none .js-modal-open{
      color:#fff !important;
      font-family:"Sora",sans-serif !important;
      font-weight:700 !important;
      text-transform:uppercase !important;
      letter-spacing:.06em !important;
    }
    body.morahot-cat-page .d-md-none a svg,
    body.morahot-cat-page .d-md-none [data-toggle] svg,
    body.morahot-cat-page .d-md-none .js-modal-open svg{
      color:#ff2e10 !important;
      fill:#ff2e10 !important;
    }
    /* el div con d-flex que aparece como "navy sobre navy" */
    body.morahot-cat-page .d-md-none .d-flex.justify-content-center{
      color:#fff !important;
    }
    body.morahot-cat-page .d-md-none .d-flex.justify-content-center *{
      color:#fff !important;
    }
  }

  /* ============================================================
     CARDS DE PRODUCTOS — fondo blanco + ALTURA UNIFORME
     Para que todas las cards de la grilla midan exactamente lo
     mismo, sin importar si una tiene nombre largo o cuotas
     diferentes, forzamos el row a stretch y la card a 100%.
     ============================================================ */

  /* La fila de productos: todas las columnas se estiran al alto del más alto */
  body.morahot-cat-page .row.row-products,
  body.morahot-cat-page .js-products-list,
  body.morahot-cat-page .js-product-list-container .row{
    align-items:stretch !important;
  }

  /* Cada columna de la grilla (.col-grid o .item-product) ocupa toda la altura */
  body.morahot-cat-page .col-grid,
  body.morahot-cat-page .item-product,
  body.morahot-cat-page .js-item-product{
    display:flex !important;
    align-items:stretch !important;
    margin-bottom:18px;
  }

  /* La card en sí ocupa toda la altura de la columna */
  body.morahot-cat-page .item{
    background:#ffffff;
    border-radius:14px;
    border:1px solid rgba(255,255,255,.08);
    overflow:hidden;
    box-shadow:0 4px 12px rgba(0,0,0,.25);
    transition:transform .35s cubic-bezier(.2,.8,.2,1), border-color .3s ease, box-shadow .35s ease;
    position:relative;
    width:100%;
    display:flex;
    flex-direction:column;
  }
  /* El cuerpo de la card crece, el botón COMPRAR queda pegado abajo */
  body.morahot-cat-page .item > .js-item-info,
  body.morahot-cat-page .item > .item-info,
  body.morahot-cat-page .item .item-info{
    flex:1 1 auto;
    display:flex;
    flex-direction:column;
  }
  /* hover sutil */
  @media (hover:hover){
    body.morahot-cat-page .item:hover{
      transform:translateY(-4px);
      border-color:rgba(255,46,16,.30);
      box-shadow:
        0 16px 32px rgba(0,0,0,.35),
        0 0 0 1px rgba(255,46,16,.12);
    }
  }
  @media (hover:none){
    body.morahot-cat-page .item:active{
      transform:scale(.98);
    }
  }

  /* Tag MORAHOT abajo-derecha de la imagen */
  body.morahot-cat-page .item-image-container{
    position:relative !important;
  }
  body.morahot-cat-page .item-image-container::after{
    content:"MORAHOT";
    position:absolute;
    bottom:8px;right:8px;
    background:rgba(0,14,53,.92);
    color:#fff;
    font-family:"Sora",sans-serif;font-weight:700;font-size:8.5px;
    padding:3px 7px;border-radius:4px;
    text-transform:uppercase;letter-spacing:.12em;
    border:1px solid rgba(255,46,16,.5);
    z-index:3;
    pointer-events:none;
  }
  @media (min-width:760px){
    body.morahot-cat-page .item-image-container::after{
      bottom:10px;right:10px;font-size:9px;padding:4px 8px;
    }
  }

  /* Badge -X% OFF más fuerte */
  body.morahot-cat-page .item-discount-percentage,
  body.morahot-cat-page .item-discount,
  body.morahot-cat-page .product-item-discount{
    background:linear-gradient(135deg,#ff2e10 0%,#cc1d00 100%) !important;
    color:#fff !important;
    font-family:"Sora",sans-serif !important;
    font-weight:800 !important;
    font-size:13px !important;
    letter-spacing:-.01em !important;
    padding:5px 11px !important;
    border-radius:7px !important;
    box-shadow:0 4px 10px rgba(255,46,16,.4) !important;
    border:0 !important;
    text-transform:uppercase;
  }

  /* ============================================================
     PRECIO EN EFECTIVO — verde billete, único color de su tipo en la
     card. Se diferencia del coral del -X% OFF y del negro del precio
     normal. Asociación universal con dinero/ahorro (MercadoPago, ML).
     ============================================================ */
  body.morahot-cat-page .item .js-payment-discount-price-product-container,
  body.morahot-cat-page .item .js-payment-discount-price-product-container *,
  body.morahot-cat-page .item .js-payment-discount-price-product{
    color:#047857 !important;
    font-weight:800 !important;
  }

  /* Botón COMPRAR — coral fuerte */
  body.morahot-cat-page .item .btn-primary,
  body.morahot-cat-page .item .js-btn-buy,
  body.morahot-cat-page .item .btn-buy,
  body.morahot-cat-page .item button[type="submit"]{
    background:#ff2e10 !important;
    border-color:#ff2e10 !important;
    color:#fff !important;
    font-family:"Sora",sans-serif !important;
    font-weight:800 !important;
    text-transform:uppercase !important;
    letter-spacing:.08em !important;
    border-radius:8px !important;
    box-shadow:0 4px 14px rgba(255,46,16,.35) !important;
    transition:transform .25s ease, background .25s ease, box-shadow .3s ease !important;
  }
  body.morahot-cat-page .item .btn-primary:hover,
  body.morahot-cat-page .item .js-btn-buy:hover,
  body.morahot-cat-page .item .btn-buy:hover,
  body.morahot-cat-page .item button[type="submit"]:hover{
    background:#cc1d00 !important;
    border-color:#cc1d00 !important;
    transform:translateY(-2px);
    box-shadow:0 12px 28px rgba(255,46,16,.55) !important;
  }

  /* ============================================================
     Aclaración del 10% — al final
     ============================================================ */
  .morahot-cat-clarification{
    margin:40px auto 60px;
    max-width:800px;
    padding:28px 22px;
    background:linear-gradient(135deg,rgba(255,46,16,.10) 0%,rgba(255,46,16,.04) 100%);
    border:1px solid rgba(255,46,16,.25);
    border-radius:14px;
    text-align:center;
  }
  .morahot-cat-clarification h4{
    font-family:"Sora",sans-serif;font-size:18px;font-weight:800;
    color:#fff !important;margin:0 0 10px;letter-spacing:-.01em;
    display:inline-flex;align-items:center;gap:10px;
  }
  .morahot-cat-clarification-icon{
    width:22px;height:22px;color:#ffb800;flex-shrink:0;
  }
  @media (min-width:760px){
    .morahot-cat-clarification h4{font-size:22px}
    .morahot-cat-clarification-icon{width:26px;height:26px}
  }
  .morahot-cat-clarification p{
    font-family:"Inter",sans-serif;font-size:13px;
    color:rgba(255,255,255,.78) !important;margin:0 auto;line-height:1.6;max-width:600px;
  }
  @media (min-width:760px){.morahot-cat-clarification p{font-size:14px}}
  .morahot-cat-clarification strong{color:#ff2e10 !important;font-weight:800}
  .morahot-cat-clarification .important-note{
    margin-top:18px;padding:14px 16px;
    display:flex;gap:10px;align-items:flex-start;text-align:left;
    background:rgba(255,184,0,.06);
    border-radius:8px;border:1px solid rgba(255,184,0,.25);
  }
  .morahot-cat-clarification .important-note svg{
    flex-shrink:0;width:18px;height:18px;color:#ffb800;margin-top:1px;
  }
  .morahot-cat-clarification .important-note p{
    font-size:12px;color:rgba(255,255,255,.85) !important;margin:0;line-height:1.5;
  }
  .morahot-cat-clarification .important-note p b{color:#ffb800 !important;font-weight:700}
  @media (min-width:760px){
    .morahot-cat-clarification .important-note p{font-size:13px}
  }
</style>

{# Marcamos el body con una clase para que los estilos solo apliquen en /morahot #}
<script>
(function(){
  document.body.classList.add('morahot-cat-page');
})();
</script>

{# ============================================================
   AHORRÁS $X + Badge TOP VENTAS — solo en /morahot
   No tocamos el item.tpl global de Toluca (rompería el resto
   de la tienda). Inyectamos vía JS leyendo data-product-price.
   ============================================================ #}
<style>
  /* Badge AHORRÁS — pegado debajo del precio tachado */
  body.morahot-cat-page .mh-savings-badge{
    display:inline-block;
    margin-top:4px;
    padding:3px 8px;
    background:linear-gradient(135deg, rgba(255,46,16,.15) 0%, rgba(255,46,16,.08) 100%);
    border:1px solid rgba(255,46,16,.4);
    border-radius:6px;
    font-family:"Sora",sans-serif;
    font-size:10.5px;
    font-weight:800;
    color:#ff2e10;
    letter-spacing:.02em;
    text-transform:uppercase;
    line-height:1.2;
  }
  body.morahot-cat-page .mh-savings-badge strong{
    color:#ff2e10;
    font-weight:800;
  }
  @media (min-width:760px){
    body.morahot-cat-page .mh-savings-badge{font-size:11.5px;padding:4px 10px}
  }

  /* Badge TOP VENTAS — flotante arriba-izquierda de la imagen
     (la esquina inferior-derecha ya tiene el tag MORAHOT) */
  body.morahot-cat-page .mh-top-badge{
    position:absolute;
    top:8px;left:8px;
    background:linear-gradient(135deg, #ffb800 0%, #ff8c00 100%);
    color:#000a28;
    font-family:"Sora",sans-serif;
    font-weight:800;
    font-size:9px;
    padding:4px 9px;
    border-radius:5px;
    text-transform:uppercase;
    letter-spacing:.1em;
    z-index:3;
    box-shadow:0 3px 10px rgba(255,184,0,.35);
    pointer-events:none;
    display:flex;align-items:center;gap:4px;
  }
  body.morahot-cat-page .mh-top-badge svg{
    width:11px;height:11px;
  }
  @media (min-width:760px){
    body.morahot-cat-page .mh-top-badge{
      top:10px;left:10px;font-size:10px;padding:5px 11px;
    }
    body.morahot-cat-page .mh-top-badge svg{width:12px;height:12px}
  }
</style>
<script>
(function(){
  if (window.__morahotEnhancementsInit) return;
  window.__morahotEnhancementsInit = true;

  // Formato de moneda argentina: $26.173,00
  function fmtARS(n){
    var rounded = Math.round(n);
    var s = rounded.toString();
    var withDots = s.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return '$' + withDots;
  }

  function inject(){
    var cards = document.querySelectorAll('body.morahot-cat-page .item-price-container');
    cards.forEach(function(container){
      // Evitar doble inyección si el script corre de nuevo
      if (container.querySelector('.mh-savings-badge')) return;

      var priceEl   = container.querySelector('.js-price-display[data-product-price]');
      var compareEl = container.querySelector('.js-compare-price-display');
      if (!priceEl || !compareEl) return;
      if (compareEl.style.display === 'none') return; // sin descuento

      var price = parseFloat(priceEl.getAttribute('data-product-price'));
      // Parsear el precio tachado del texto: "$27.550,00" → 27550
      var compareText = (compareEl.textContent || '').trim();
      var compareNum = parseFloat(
        compareText.replace(/[^\d,]/g,'').replace(/\./g,'').replace(',','.')
      );
      if (!price || !compareNum || compareNum <= price) return;

      var savings = compareNum - price;
      if (savings < 100) return; // ahorros muy chicos no aportan

      var badge = document.createElement('div');
      badge.className = 'mh-savings-badge';
      badge.innerHTML = 'Ahorrás <strong>' + fmtARS(savings) + '</strong>';
      // Insertar después del compareEl
      compareEl.insertAdjacentElement('afterend', badge);
    });

    // TOP VENTAS — primeras 3 cards visibles (top-sellers asumidos)
    var products = document.querySelectorAll('body.morahot-cat-page .js-item-product, body.morahot-cat-page .item-product');
    Array.prototype.slice.call(products, 0, 3).forEach(function(prodEl){
      var imgContainer = prodEl.querySelector('.item-image-container');
      if (!imgContainer || imgContainer.querySelector('.mh-top-badge')) return;
      var badge = document.createElement('div');
      badge.className = 'mh-top-badge';
      badge.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4L2 9.4h7.6z"/></svg>TOP';
      imgContainer.appendChild(badge);
    });
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
  // Por si Tiendanube re-renderiza productos al filtrar/ordenar
  document.addEventListener('change', function(){ setTimeout(inject, 300); });
  document.addEventListener('click', function(e){
    if (e.target.closest('.js-modal-open, .pagination, [data-toggle]')) {
      setTimeout(inject, 600);
    }
  });
})();
</script>
