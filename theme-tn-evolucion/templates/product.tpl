{# ===== Solo Mobile: Breadcrumb + Título arriba ===== #}
<div class="product-header-mobile d-md-none">
  {% include 'snipplets/breadcrumbs.tpl' %}
  <h1 class="product-title-mobile">{{ product.name }}</h1>
</div>

<div id="single-product" class="js-has-new-shipping js-product-detail js-product-container js-shipping-calculator-container background-secondary pb-4 pt-md-4 pb-md-3" data-variants="{{product.variants_object | json_encode }}" data-store="product-detail">
  <div class="container pt-md-1">
    <div class="row">
      <div class="col-md-7 pb-3">
        {% include 'snipplets/product/product-image.tpl' %}
      </div>
      <div class="col" data-store="product-info-{{ product.id }}">
        {% include 'snipplets/product/product-form.tpl' %}
        {% if not settings.full_width_description %}
          {% include 'snipplets/product/product-description.tpl' %}
        {% endif %}
      </div>
    </div>
  </div>

  {% if settings.full_width_description %}
    {% include 'snipplets/product/product-description.tpl' %}
  {% endif %}
</div>

{# ================= Buybar solo mobile ================= #}
{% set descuento = product.compare_at_price > product.price
  ? ((product.compare_at_price - product.price) / product.compare_at_price * 100) | round
  : 0 %}

<div id="buybar" class="buybar buybar--minimal only-mobile" aria-live="polite">
  <div class="buybar__priceblock">
    <div class="buybar__price-row">
      <span class="buybar__price-current">{{ product.price | money }}</span>
      {% if product.compare_at_price and product.compare_at_price.value > product.price.value %}
        <span class="buybar__price-old">{{ product.compare_at_price | money }}</span>
      {% endif %}
    </div>
    <div class="buybar__price-cash">{{ (product.price * 0.85) | round | money }} con Efectivo</div>
  </div>

  <div class="buybar__actions">
    <button id="buybar-add" class="buybar__btn buybar__btn--pri" type="button" aria-label="Comprar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M6 6h15l-2 11H8L6 4H3"/>
        <circle cx="9" cy="20" r="1.5"/>
        <circle cx="18" cy="20" r="1.5"/>
      </svg>
      <span>Comprar</span>
    </button>
  </div>

  {% if product.variants | length > 1 %}
  <div id="buybar-variants" class="buybar__variants u-hidden" aria-live="polite">
    <p class="buybar__variants-title">Seleccioná una opción:</p>
    <div class="buybar__variants-list">
      {% for v in product.variants %}
        {% set sin_stock = (v.stock|default(0) <= 0) or (v.available is defined and (v.available == false)) %}
        {% set opt = [] %}
        {% if v.option1 %}{% set opt = opt|merge([v.option1]) %}{% endif %}
        {% if v.option2 %}{% set opt = opt|merge([v.option2]) %}{% endif %}
        {% if v.option3 %}{% set opt = opt|merge([v.option3]) %}{% endif %}

        <button type="button"
                class="variant-btn{% if sin_stock %} is-disabled{% endif %}"
                data-variant-id="{{ v.id }}"
                data-option-ids='{{ opt|json_encode }}'
                {% if sin_stock %}disabled aria-disabled="true"{% endif %}>
          {{ v.name }}
        </button>
      {% endfor %}
    </div>
  </div>
  {% endif %}
</div>


<style>
/* ===== Buybar (mobile) – transición Android + fix iOS ===== */
@media (max-width:768px){
  .buybar{
    position:fixed; left:0; right:0; z-index:900;

    /* Siempre pegado abajo */
    bottom:0;

    background:#fff;
    border-top:1px solid #ddd;
    box-shadow:0 -4px 10px rgba(0,0,0,.1);
    padding:12px 14px;
    display:flex; flex-direction:column; gap:12px;

    /* Variante minimalista: precio + botón en una sola fila horizontal */
    /* (el bloque de variantes se mantiene en columna debajo si aplica) */

    /* Estado inicial oculto */
    transform: translateY(100%);
    opacity:0;
    pointer-events:none;

    will-change: transform, opacity;
    backface-visibility: hidden;
    -webkit-transform: translateZ(0);

    transition: transform .35s cubic-bezier(.22,.61,.36,1),
                opacity   .35s ease;
  }
  .buybar.visible{
    transform: translateY(0);
    opacity:1;
    pointer-events:auto;
    transition: transform .45s cubic-bezier(.22,.61,.36,1),
                opacity   .30s ease;
  }

  /* Evita que el contenido quede tapado en navegadores sin notch */
  body{ padding-bottom:90px; }
}

/* iOS Safari con notch: respetar safe-area */
@supports(padding: max(0px)){
  @media (max-width:768px){
    .buybar{ padding-bottom: env(safe-area-inset-bottom); }
    body{ padding-bottom:0 !important; }
  }
}

/* Respeto a usuarios con menos movimiento */
@media (prefers-reduced-motion: reduce){
  .buybar, .buybar.visible{ transition:none; }
}

.buybar__priceblock{display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;flex:1 1 auto;min-width:0}
.buybar__price-row{
  display:flex;align-items:baseline;gap:8px;
  line-height:1;
}
.buybar__price-current{
  font-family:"Sora","Inter",sans-serif;font-weight:800;font-size:19px;
  color:#000e35;letter-spacing:-.01em;
  white-space:nowrap;
}
.buybar__price-old{
  font-family:"Inter",sans-serif;font-size:13px;font-weight:500;
  color:#94a3b8;text-decoration:line-through;
  white-space:nowrap;
}
.buybar__price-cash{
  font-family:"Sora",sans-serif;font-weight:800;font-size:14px;
  color:#047857;line-height:1.1;letter-spacing:.01em;
  white-space:nowrap;
}
/* Legacy classes (por si quedó algún producto con la versión vieja) */
.buybar__line1{display:flex;align-items:center;gap:8px;justify-content:center;flex-wrap:wrap}
.buybar__promo{font-size:20px;font-weight:700;color:#111827}
.buybar__base{font-size:14px;color:#888;text-decoration:line-through}
.buybar__off{font-size:12px;color:#fff;background:#d40000;padding:2px 6px;border-radius:4px}
.buybar__line2{font-size:13px}
.buybar__cuotas{color:#d40000;font-weight:400}
.buybar__actions{
  display:flex;
  justify-content:flex-end;
  align-items:center;
  flex:0 0 auto;
  /* En layout minimal el width:100% rompe el flex row.
     Lo dejamos auto y posicionamos a la derecha con margin-left:auto */
  padding-bottom: 0;
}

.buybar__btn{padding:14px 16px;font-weight:800;border-radius:10px;border:none;cursor:pointer;text-align:center;font-size:12.5px;white-space:nowrap;font-family:"Sora",sans-serif;letter-spacing:.04em;text-transform:uppercase;display:inline-flex;align-items:center;gap:6px;line-height:1;transition:transform .2s ease, background .2s ease, box-shadow .2s ease}
.buybar__btn--pri{background:#ff2e10;color:#fff;box-shadow:0 6px 18px rgba(255,46,16,.35)}
.buybar__btn--pri:active{background:#cc1d00;transform:translateY(-1px)}
.buybar__btn--pri svg{width:14px;height:14px;flex-shrink:0}
.buybar__variants{padding-top:4px}
.buybar__variants-title{margin:0 0 6px;text-align:center;font-size:14px}
.buybar__variants-list{display:flex;flex-wrap:wrap;justify-content:center}
.variant-btn{margin:4px;padding:10px 12px;border:1px solid #001c4b;border-radius:8px;background:#fff;font-size:14px}
.u-hidden{display:none !important}

.product-header-mobile { padding: 12px 16px; }
.product-header-mobile .breadcrumbs { font-size: 10px; line-height: 1.3; }
.product-header-mobile .breadcrumbs .separator { margin: 0 4px; font-size: 12px; }
.product-title-mobile { font-size: 18px; font-weight: 700; margin: 0; line-height: 1.3; }

@media (min-width:769px){ .product-header-mobile{display:none} }
@media (max-width:768px){
  #single-product .breadcrumbs,
  #single-product h1.js-product-name { display:none !important; }
}

.variant-btn.is-disabled,.variant-btn:disabled{
  color:#777;border-color:#c9c9c9;background:#f3f3f3;
  cursor:not-allowed;pointer-events:none;opacity:.7;box-shadow:none;
}

@media (min-width:769px){ .only-mobile,.buybar.only-mobile { display: none !important; } }

/* ============================================================
   BUYBAR MINIMALISTA — layout horizontal (precio izq / CTA der)
   El modificador .buybar--minimal pone la primera fila como flex-row
   para que precio + botón queden lado a lado, no apilados.
   ============================================================ */
@media (max-width:768px){
  .buybar.buybar--minimal{
    flex-direction:row;
    align-items:center !important;
    flex-wrap:wrap;
    gap:12px;
    /* Padding más generoso para que el bar tenga altura real (no apretado) */
    padding:16px 14px !important;
  }
  /* El bloque de variantes (si aplica) rompe el row y va a una línea propia */
  .buybar.buybar--minimal #buybar-variants{
    flex-basis:100%;
    width:100%;
    order:99; /* se va al final si flex-wrap activo */
  }
  .buybar.buybar--minimal .buybar__actions{
    flex:0 0 auto;
    margin-left:auto;
    align-self:center;
    align-items:center;
    /* Sin padding inferior raro que empujaba el botón hacia abajo */
    padding:0 !important;
  }
  .buybar.buybar--minimal .buybar__priceblock{
    align-self:center;
  }
}

/* Legacy efectivo row (se oculta en minimal, lo dejamos por si algún producto
   aún usa el HTML viejo) */
.buybar__efectivo-row{display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:8px}
.buybar__efectivo-label{color:#1fa22e;font-weight:700;font-size:13px;white-space:nowrap}
.buybar__efectivo-precio{background:#1fa22e;color:#fff;font-size:20px;font-weight:700;padding:4px 8px;border-radius:4px;white-space:nowrap}
/* En modo minimal explícitamente ocultamos por si quedó algo */
.buybar.buybar--minimal .buybar__efectivo-row,
.buybar.buybar--minimal .buybar__line1,
.buybar.buybar--minimal .buybar__line2{display:none !important}

/* ============================================================
   Ocultar el botón AGREGAR AL CARRITO duplicado en mobile.
   El de la sticky bar alcanza; el otro (junto al selector de
   cantidad) confunde al cliente porque parecen 2 botones.
   ============================================================ */
@media (max-width:768px){
  #single-product .js-addtocart:not(#buybar-add),
  #single-product input[type="submit"].js-addtocart:not(#buybar-add),
  #single-product button.js-addtocart:not(#buybar-add){
    display:none !important;
  }
}


/* === Fix: centrar sin recorte por transform heredado === */
#single-product .product-detail-slider .js-product-slide-link{
  padding-bottom:100% !important;
  position:relative;
  display:block;
}
@supports (aspect-ratio:1/1){
  #single-product .product-detail-slider .js-product-slide-link{
    padding-bottom:0 !important;
    aspect-ratio:1/1;
  }
}

/* Resetear posicionamiento del theme */
#single-product .product-detail-slider .img-absolute,
#single-product .product-detail-slider .img-absolute-centered{
  top:0 !important;
  left:0 !important;
  right:0 !important;
  bottom:0 !important;
  transform:none !important;
}

/* Imagen ocupa el cuadrado y queda centrada */
#single-product .product-detail-slider .product-slider-image{
  position:absolute !important;
  inset:0 !important;
  width:100% !important;
  height:100% !important;
  object-fit:contain !important;   /* usa 'cover' si querés llenar recortando */
  object-position:center !important;
  display:block !important;
}

/* Evitar alturas forzadas por Swiper */
#single-product .product-detail-slider .swiper-wrapper,
#single-product .product-detail-slider .swiper-slide{
  height:auto !important;
}



/* ===== Ajuste de imagen en product.tpl solo escritorio ===== */
@media (min-width: 992px) {
  .product-detail-slider .js-product-slide-link {
    max-height: 640px;   /* altura máxima en escritorio */
    padding-bottom: unset !important;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .product-detail-slider img {
    max-height: 100%;
    width: auto;
    object-fit: contain;
  }
}



</style>


<script>
/* ===== Buybar + Submit ===== */
(function(){
  const buybar = document.getElementById('buybar');
  if (!buybar) return;

  // Sticky bar SIEMPRE visible en mobile (no esperar scroll).
  // Se ve desde que el cliente entra a la PDP.
  buybar.classList.add('visible');

  // Si el banner de cookies de Tiendanube está visible, levantamos la
  // sticky bar para que no quede tapada.
  function adjustForCookieBanner(){
    const cookieBanner = document.querySelector('.js-notification-cookie-banner, .notification-cookie-banner');
    if(!cookieBanner) return;
    const isVisible = cookieBanner.offsetHeight > 0 &&
                      getComputedStyle(cookieBanner).display !== 'none' &&
                      !cookieBanner.classList.contains('u-hidden');
    if(isVisible){
      // Tomamos la altura real del banner y subimos la sticky encima
      const h = cookieBanner.offsetHeight;
      buybar.style.bottom = h + 'px';
    } else {
      buybar.style.bottom = '0';
    }
  }
  adjustForCookieBanner();
  // Re-chequear cuando se acepta/oculta el banner
  new MutationObserver(adjustForCookieBanner).observe(document.body, {
    subtree:true, childList:true, attributes:true,
    attributeFilter:['class','style']
  });

  const btn = document.getElementById('buybar-add');
  function getForm(){ return document.querySelector('#single-product form.js-product-form'); }
  function submitMainForm(){
    const form = getForm(); if(!form) return false;
    const sbm = form.querySelector('.js-prod-submit-form');
    if(sbm){ sbm.click(); return true; }
    form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
    return true;
  }

  const priceBlock = document.querySelector('.buybar__priceblock');
  const actions    = document.querySelector('.buybar__actions');
  const variantBox = document.getElementById('buybar-variants');
  const hasVariants = !!variantBox;

  function showVariants(){ priceBlock?.classList.add('u-hidden'); actions?.classList.add('u-hidden'); variantBox?.classList.remove('u-hidden'); }
  function restoreBuybar(){ priceBlock?.classList.remove('u-hidden'); actions?.classList.remove('u-hidden'); variantBox?.classList.add('u-hidden'); }

  function clickChip(chip){
    try{ if(window.jQueryNuvem){ jQueryNuvem(chip).trigger('click'); return; } }catch(_){}
    chip.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
  }
  function activateOptions(optionIds){
    const form = getForm(); if(!form) return;
    optionIds.forEach(oid=>{
      const chip = form.querySelector(`.js-insta-variant[data-option="${oid}"]`);
      if(chip && !chip.classList.contains('selected')) clickChip(chip);
    });
    form.querySelectorAll('select[name^="variation["]').forEach(sel=>{
      const opt = Array.from(sel.options).find(o => optionIds.includes(String(o.value)));
      if(opt){ sel.value = opt.value; sel.dispatchEvent(new Event('input',{bubbles:true})); sel.dispatchEvent(new Event('change',{bubbles:true})); }
    });
  }
  function isApplied(optionIds){
    const form = getForm(); if(!form) return false;
    const sel = form.querySelectorAll('.js-insta-variant.selected[data-option]');
    for(const a of sel){ if(optionIds.includes(String(a.getAttribute('data-option')))) return true; }
    return false;
  }

  if(variantBox){
    variantBox.addEventListener('click',(e)=>{
      const el = e.target.closest('.variant-btn');
      if(!el || el.disabled || el.classList.contains('is-disabled')) return;
      e.preventDefault(); e.stopPropagation();
      let optionIds = [];
      try{ optionIds = JSON.parse(el.getAttribute('data-option-ids')||'[]').map(String); }catch(_){}
      if(!optionIds.length) return;

      const originalLabel = btn.querySelector('span')?.textContent || "Comprar";
      restoreBuybar();
      btn.disabled = true;
      if(btn.querySelector('span')) btn.querySelector('span').textContent = "Agregando...";
      const done = ()=>{
        if(btn.querySelector('span')) btn.querySelector('span').textContent = "✔ Listo";
        setTimeout(()=>{
          if(btn.querySelector('span')) btn.querySelector('span').textContent = originalLabel;
          btn.disabled = false;
        },1200);
        restoreBuybar();
      };
      document.addEventListener("addtocart:success", done, {once:true});
      setTimeout(done, 3000);

      activateOptions(optionIds);
      let tries = 0;
      (function poll(){
        tries++;
        if (isApplied(optionIds) || tries >= 20){
          requestAnimationFrame(()=>requestAnimationFrame(()=>{ submitMainForm(); }));
        } else { setTimeout(poll, 80); }
      })();
    });
  }

  // ============================================================
  // Detectar si el cliente YA tiene una variante seleccionada
  // (porque el theme la marca con .selected en .js-insta-variant)
  // ============================================================
  function hasVariantSelected(){
    const form = getForm(); if(!form) return false;
    // Buscamos chips de variantes (sabor, tamaño, etc.) que estén marcados
    const selected = form.querySelectorAll('.js-insta-variant.selected[data-option]');
    if(selected.length > 0) return true;
    // Fallback: si hay <select> de variantes y todos tienen value distinto de vacío
    const selects = form.querySelectorAll('select[name^="variation["]');
    if(selects.length > 0){
      let allSelected = true;
      selects.forEach(sel => { if(!sel.value || sel.value === '' || sel.value === '0') allSelected = false; });
      if(allSelected) return true;
    }
    return false;
  }

  btn.addEventListener('click',(e)=>{
    // Si tiene variantes Y ninguna seleccionada → mostrar panel
    if(hasVariants && !hasVariantSelected()){
      e.preventDefault(); e.stopPropagation(); showVariants(); return;
    }
    // Si ya hay variante elegida (o no hay variantes), submit directo
    e.preventDefault();
    const originalLabel = btn.querySelector('span')?.textContent || "Comprar";
    btn.disabled = true;
    if(btn.querySelector('span')) btn.querySelector('span').textContent = "Agregando...";
    const done = ()=>{
      if(btn.querySelector('span')) btn.querySelector('span').textContent = "✔ Listo";
      setTimeout(()=>{
        if(btn.querySelector('span')) btn.querySelector('span').textContent = originalLabel;
        btn.disabled = false;
      },1200);
      restoreBuybar();
    };
    document.addEventListener("addtocart:success", done, {once:true});
    setTimeout(done, 3000);
    submitMainForm();
  });

  // NOTA: El auto-select de primera variante disponible se intentó
  // pero Toluca usa jQuery delegado y simular el click programáticamente
  // no propaga el state correctamente (precio, stock, hidden inputs del
  // form). Resultado: visualmente quedaba "Banana" seleccionado pero el
  // submit mandaba variante vacía. Decisión: NO auto-seleccionar.
  // El cliente toca el chip manualmente (1 tap extra) pero todo funciona
  // bien. Si NO toca nada, al apretar COMPRAR aparece el panel
  // "Seleccioná una opción" (gracias al check hasVariantSelected()).
})();
</script>

{# ===== Acordeón ENVÍO/RETIRO: JS GLOBAL (fuera del snippet AJAX) ===== #}
<script>
(function(){
  // Delegación global. Funciona con re-render AJAX del shipping.
  document.addEventListener("click", function(e){
    const header = e.target.closest(".shipping-header");
    if(!header) return;
    e.preventDefault();
    const acc = header.closest(".shipping-accordion"); if(!acc) return;

    // modo exclusivo: abrir uno cierra el otro
    const group = acc.parentElement;
    group.querySelectorAll(".shipping-accordion.open").forEach(a=>{
      if(a!==acc){ a.classList.remove("open"); a.querySelector(".shipping-header")?.classList.remove("active"); }
    });

    acc.classList.toggle("open");
    header.classList.toggle("active");
  }, true);

  function ensureDefault(ctx){
    const container = (ctx||document).querySelector(".shipping-tabs");
    if(!container) return;
    if(container.querySelector(".shipping-accordion.open")) return;
    const first = container.querySelector(".shipping-accordion");
    if(first){
      first.classList.add("open");
      first.querySelector(".shipping-header")?.classList.add("active");
    }
  }

  const root = document.querySelector(".js-shipping-calculator-container") || document.body;
  if(document.readyState!=="loading") ensureDefault(root);
  else document.addEventListener("DOMContentLoaded", ()=>ensureDefault(root));
  new MutationObserver(()=>ensureDefault(root)).observe(root,{subtree:true,childList:true});
})();
</script>

{# Productos relacionados #}
{% include 'snipplets/product/product-related.tpl' %}
